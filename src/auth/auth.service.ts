import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import BaseException from 'src/utils/BaseException';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';
import { UserWithTokenDto } from './dto/user-with-token';
import BaseResponse from 'src/utils/BaseResponse';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(params: LoginDto) {
    const userFind = await this.userRepository.findOne({
      where: { username: params.username },
      // relations: ['roles', 'roles.permissions'],
    });

    if (!userFind) {
      throw new BaseException('Sai username', HttpStatus.UNAUTHORIZED);
    }

    if (userFind.deletedAt) {
      throw new BaseException('Tài khoản đã bị khóa', HttpStatus.UNAUTHORIZED);
    }

    const checkPassword = bcrypt.compareSync(
      params.password,
      userFind.password,
    );

    if (!checkPassword) {
      throw new BaseException('Sai mật khẩu', HttpStatus.UNAUTHORIZED);
    }

    const token = await this.generateToken(userFind);

    return new BaseResponse<UserWithTokenDto>({
      data: token,
      message: 'Đăng nhập thành công',
    });
  }

  async signUp(params: SignupDto, isAdmin = false) {
    const duplicatedUser = await this.userRepository.findOneBy({
      username: params.username,
    });

    if (duplicatedUser) {
      throw new BaseException('Username đã tồn tại', HttpStatus.CONFLICT);
    }

    const hashPassword = await this.hashPassword(params.password);

    const newUser = this.userRepository.create({
      fullName: params.fullName,
      username: params.username,
      password: hashPassword,
      isAdmin: isAdmin,
    });

    try {
      const result = await this.userRepository.save(newUser);
      return new BaseResponse({
        statusCode: 200,
        isSuccess: true,
        data: result,
        message: 'Tạo tài khoản thành công!',
      });
    } catch (e) {
      throw new BaseException('Có lỗi xảy ra.\n' + e.message, 500);
    }
  }

  async lockUser(userId: string, status: boolean) {
    const userFound = await this.userRepository.findOneBy({ id: userId });

    if (!userFound) {
      throw new BaseException('Người dùng không tồn tại', HttpStatus.NOT_FOUND);
    }

    try {
      if (status) {
        const deletedUser = await this.userRepository.findOne({
          where: { id: userId },
          withDeleted: true,
        });

        if (deletedUser) {
          await this.userRepository.restore({ id: userId });
        }
      } else {
        await this.userRepository.softDelete({ id: userId });
      }

      return new BaseResponse({
        statusCode: 200,
        isSuccess: true,
        data: userFound.id,
        message: status
          ? `Mở khóa tài khoản ${userFound.username} thành công`
          : `Khóa tài khoản ${userFound.username} thành công`,
      });
    } catch (e) {
      throw new BaseException(
        'Có lỗi xảy ra.\n' + e.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async generateToken(payload: User) {
    const payloadJson = {
      userId: payload.id,
      username: payload.username,
    };

    const accessToken = await this.jwtService.signAsync(payloadJson, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.EXPIRES_IN_ACCESS_TOKEN,
    });
    const refreshToken = await this.jwtService.signAsync(payloadJson, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.EXPIRES_IN_REFRESH_TOKEN,
    });

    await this.userRepository.update(
      { id: payload.id },
      { refreshToken: refreshToken },
    );

    const result: UserWithTokenDto = {
      user: { ...payload, refreshToken },
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    return result;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
}
