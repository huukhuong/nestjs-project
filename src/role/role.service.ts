import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Permission } from 'src/permission/entities/permission.entity';
import { Role } from 'src/role/role.entity';
import BaseException from 'src/utils/base-exception';
import BaseResponse from 'src/utils/base-response';
import { ILike, In, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { SearchRoleDto } from './dto/search-role.dto';
import { SyncPermissionToRoleDto } from './dto/sync-permission-to-role.dto';
import { SyncRoleToUserDto } from './dto/sync-role-to-user.dto';
import paginate from 'src/utils/paginate';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
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

      return await paginate({
        pageSize: params.pageSize,
        pageIndex: params.pageIndex,
        repository: this.roleRepository,
        withDeleted: params.withDeleted,
        where: [
          { code: ILike(`%${params.code}%`) },
          { name: ILike(`%${params.name}%`) },
        ],
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
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });
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

  /**
   * =================================================
   * =============== Phân quyền user =================
   * =================================================
   */
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

  async assignRoleToUser(userId: string, roleId: string) {
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

  async revokeRoleFromUser(userId: string, roleId: string) {
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
      throw new BaseException(
        'Nhóm người dùng không tồn tại',
        HttpStatus.BAD_REQUEST,
      );
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

  /**
   * =================================================
   * =============== Phân quyền role =================
   * =================================================
   */
  async syncPermissionsToRole(roleId: string, params: SyncPermissionToRoleDto) {
    const roleFound = await this.roleRepository.findOneBy({ id: roleId });

    if (!roleFound) {
      throw new BaseException(
        'Nhóm người dùng không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }

    const permissionsFound = await this.permissionRepository.find({
      where: {
        id: In(params.permissionIds),
      },
    });

    if (!permissionsFound || permissionsFound.length === 0) {
      throw new BaseException('Quyền không tồn tại', HttpStatus.NOT_FOUND);
    }

    if (!roleFound.permissions) {
      roleFound.permissions = [...permissionsFound];
    } else {
      roleFound.permissions.push(...permissionsFound);
    }

    try {
      await this.roleRepository.save(roleFound);
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

  async assignPermissionToRole(roleId: string, permissionId: string) {
    const roleFound = await this.roleRepository.findOneBy({
      id: roleId,
    });

    if (!roleFound) {
      throw new BaseException(
        'Nhóm người dùng không tồn tại',
        HttpStatus.BAD_REQUEST,
      );
    }

    const permissionFound = await this.permissionRepository.findOneBy({
      code: permissionId,
    });

    if (!permissionFound) {
      throw new BaseException('Quyền không tồn tại', HttpStatus.NOT_FOUND);
    }

    if (!roleFound.permissions) {
      roleFound.permissions = [permissionFound];
    } else {
      roleFound.permissions.push(permissionFound);
    }

    try {
      await this.roleRepository.save(roleFound);
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

  async revokePermissionFromRole(roleId: string, permissionId: string) {
    const roleFound = await this.roleRepository.findOneBy({
      id: roleId,
    });

    if (!roleFound) {
      throw new BaseException(
        'Nhóm người dùng không tồn tại',
        HttpStatus.BAD_REQUEST,
      );
    }

    const permissionFound = await this.permissionRepository.findOneBy({
      id: permissionId,
    });

    if (!permissionFound) {
      throw new BaseException('Quyền không tồn tại', HttpStatus.BAD_REQUEST);
    }

    if (!roleFound.permissions) {
      roleFound.permissions = [];
    } else {
      const index = roleFound.permissions.indexOf(permissionFound);
      if (index > -1) {
        roleFound.permissions.splice(index, 1);
      }
    }

    try {
      await this.roleRepository.save(roleFound);
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
