import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/role/entities/role.entity';
import BaseException from 'src/utils/BaseException';
import BaseResponse from 'src/utils/BaseResponse';
import { ILike, In, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { SearchRoleDto } from './dto/search-role.dto';
import { SyncRoleToUserDto } from './dto/sync-role-to-user.dto';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async search(params: SearchRoleDto) {
    try {
      if (!params.code) {
        params.code = '';
      }

      if (!params.name) {
        params.name = '';
      }

      const [role, total] = await this.roleRepository.findAndCount({
        skip: (params.pageIndex - 1) * (params.pageSize + 1),
        take: params.pageSize,
        where: [
          { code: ILike(`%${params.code}%`) },
          { name: ILike(`%${params.name}%`) },
        ],
        withDeleted: params.withDeleted,
      });

      return new BaseResponse({
        statusCode: 200,
        isSuccess: true,
        data: role,
        message: 'Lấy danh sách nhóm người dùng thành công',
        pagination: {
          currentPage: params.pageIndex,
          recordsPerPage: params.pageSize,
          totalPages: Math.ceil(total / params.pageSize),
          totalCount: total,
        },
      });
    } catch (e) {
      throw new BaseException(
        'Có lỗi xảy ra.\n' + e.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(params: CreateRoleDto) {
    try {
      const role = this.roleRepository.create(params);
      const result = await this.roleRepository.save(role);
      return new BaseResponse({
        statusCode: 200,
        isSuccess: true,
        data: result,
        message: 'Tạo nhóm người dùng thành công!',
      });
    } catch (e) {
      throw new BaseException(
        'Có lỗi xảy ra.\n' + e.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(roleId: string, params: CreateRoleDto) {
    try {
      const role = await this.roleRepository.findOneBy({ id: roleId });

      if (!role) {
        throw new BaseException(
          'Không tìm thấy nhóm người dùng',
          HttpStatus.NOT_FOUND,
        );
      }

      role.code = params.code;
      role.name = params.name;

      const result = await this.roleRepository.save(role);

      return new BaseResponse({
        statusCode: 200,
        isSuccess: true,
        data: result,
        message: 'Cập nhật nhóm người dùng thành công!',
      });
    } catch (e) {
      throw new BaseException(
        'Có lỗi xảy ra.\n' + e.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(roleId: string) {
    try {
      const role = await this.roleRepository.findOneBy({ id: roleId });

      if (!role) {
        throw new BaseException(
          'Không tìm thấy nhóm người dùng',
          HttpStatus.NOT_FOUND,
        );
      }

      const result = await this.roleRepository.softDelete({
        id: roleId,
      });

      return new BaseResponse({
        statusCode: 200,
        isSuccess: true,
        data: result,
        message: 'Xoá nhóm người dùng thành công!',
      });
    } catch (e) {
      throw new BaseException(
        'Có lỗi xảy ra.\n' + e.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async detail(roleId: string) {
    const role = await this.roleRepository.findOneBy({ id: roleId });
    if (role) {
      return new BaseResponse({
        statusCode: 200,
        isSuccess: true,
        data: role,
        message: 'Lấy thông tin nhóm người dùng thành công',
      });
    }

    throw new BaseException(
      'Không tìm thấy nhóm người dùng',
      HttpStatus.NOT_FOUND,
    );
  }

  async syncRolesToUser(userId: string, params: SyncRoleToUserDto) {
    const userFound = await this.userRepository.findOneBy({ id: userId });

    if (!userFound) {
      throw new BaseException('Người dùng không tồn tại', HttpStatus.NOT_FOUND);
    }

    const rolesFound = await this.roleRepository.find({
      where: {
        id: In(params.roleIds),
      },
    });

    if (!rolesFound || rolesFound.length === 0) {
      throw new BaseException(
        'Nhóm người dùng không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!userFound.roles) {
      userFound.roles = [...rolesFound];
    } else {
      userFound.roles.push(...rolesFound);
    }

    try {
      await this.userRepository.save(userFound);
      return new BaseResponse({
        statusCode: 200,
        isSuccess: true,
        message: 'Thao tác thành công',
      });
    } catch (error) {
      throw new BaseException(
        'Có lỗi xảy ra.\n' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async assignRolesToUser(userId: string, roleId: string) {
    const userFound = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!userFound) {
      throw new BaseException(
        'Người dùng không tồn tại',
        HttpStatus.BAD_REQUEST,
      );
    }

    const roleFound = await this.roleRepository.findOneBy({
      code: roleId,
    });

    if (!roleFound) {
      throw new BaseException(
        'Nhóm người dùng không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!userFound.roles) {
      userFound.roles = [roleFound];
    } else {
      userFound.roles.push(roleFound);
    }

    try {
      await this.userRepository.save(userFound);
      return new BaseResponse({
        statusCode: 200,
        isSuccess: true,
        message: 'Thao tác thành công',
      });
    } catch (error) {
      throw new BaseException(
        'Có lỗi xảy ra.\n' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async revokeRolesFromUser(userId: string, roleId: string) {
    const userFound = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!userFound) {
      throw new BaseException(
        'Người dùng không tồn tại',
        HttpStatus.BAD_REQUEST,
      );
    }

    const roleFound = await this.roleRepository.findOneBy({
      id: roleId,
    });

    if (!roleFound) {
      throw new BaseException('Nhóm người dùng không tồn tại', HttpStatus.BAD_REQUEST);
    }

    if (!userFound.roles) {
      userFound.roles = [];
    } else {
      const index = userFound.roles.indexOf(roleFound);
      if (index > -1) {
        userFound.roles.splice(index, 1);
      }
    }

    try {
      await this.userRepository.save(userFound);
      return new BaseResponse({
        statusCode: 200,
        isSuccess: true,
        message: 'Thao tác thành công',
      });
    } catch (error) {
      throw new BaseException(
        'Có lỗi xảy ra.\n' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
