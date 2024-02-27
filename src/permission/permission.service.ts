import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseException from 'src/utils/base-exception';
import BaseResponse from 'src/utils/base-response';
import { ILike, Repository } from 'typeorm';
import { CreatePermissionGroupDto } from './dto/create-permission-group.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { SearchPermissionGroupDto } from './dto/search-permission-group.dto';
import { SearchPermissionDto } from './dto/search-permission.dto';
import { PermissionGroup } from './entities/permission-group.entity';
import { Permission } from './entities/permission.entity';
import paginate from 'src/utils/paginate';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(PermissionGroup)
    private readonly permissionGroupRepository: Repository<PermissionGroup>,
  ) {}

  async search(params: SearchPermissionDto) {
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
        repository: this.permissionRepository,
        withDeleted: params.withDeleted,
        where: [
          { code: ILike(`%${params.code}%`) },
          { name: ILike(`%${params.name}%`) },
          params.groupId ? { group: { id: params.groupId } } : {},
        ],
      });
    } catch (e) {
      throw new BaseException(
        'Có lỗi xảy ra.\n' + e.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(params: CreatePermissionDto) {
    try {
      const permissionGroup = await this.permissionGroupRepository.findOneBy({
        id: params.groupId,
      });
      if (!permissionGroup) {
        throw new BaseException(
          'Không tìm thấy nhóm chức năng',
          HttpStatus.NOT_FOUND,
        );
      }
      const permission = this.permissionRepository.create({
        code: params.code,
        name: params.name,
      });
      permission.group = permissionGroup;
      const result = await this.permissionRepository.save(permission);
      return new BaseResponse({
        statusCode: 200,
        isSuccess: true,
        data: result,
        message: 'Tạo quyền thành công!',
      });
    } catch (e) {
      throw new BaseException(
        'Có lỗi xảy ra.\n' + e.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(permissionId: string, params: CreatePermissionDto) {
    try {
      const permissionFound = await this.permissionRepository.findOneBy({
        id: permissionId,
      });

      if (!permissionFound) {
        throw new BaseException('Không tìm thấy quyền', HttpStatus.NOT_FOUND);
      }

      permissionFound.code = params.code;
      permissionFound.name = params.name;
      if (params.groupId) {
        const groupFound = await this.permissionGroupRepository.findOneBy({
          id: params.groupId,
        });
        if (!groupFound) {
          throw new BaseException(
            'Nhóm chức năng không tồn tại',
            HttpStatus.NOT_FOUND,
          );
        }
        permissionFound.group = groupFound;
      }

      const result = await this.permissionRepository.save(permissionFound);

      return new BaseResponse({
        statusCode: 200,
        isSuccess: true,
        data: result,
        message: 'Cập nhật quyền thành công!',
      });
    } catch (e) {
      throw new BaseException(
        'Có lỗi xảy ra.\n' + e.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(permissionId: string) {
    try {
      const role = await this.permissionRepository.findOneBy({
        id: permissionId,
      });

      if (!role) {
        throw new BaseException('Không tìm thấy quyền', HttpStatus.NOT_FOUND);
      }

      const result = await this.permissionRepository.softDelete({
        id: permissionId,
      });

      return new BaseResponse({
        statusCode: 200,
        isSuccess: true,
        data: result,
        message: 'Xoá quyền thành công!',
      });
    } catch (e) {
      throw new BaseException(
        'Có lỗi xảy ra.\n' + e.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * =================================================
   * ================== nhóm chức năng ===================
   * =================================================
   */
  async searchGroup(params: SearchPermissionGroupDto) {
    try {
      if (!params.name) {
        params.name = '';
      }

      return await paginate({
        pageSize: params.pageSize,
        pageIndex: params.pageIndex,
        repository: this.permissionGroupRepository,
        withDeleted: params.withDeleted,
        where: [{ name: ILike(`%${params.name}%`) }],
      });
    } catch (e) {
      throw new BaseException(
        'Có lỗi xảy ra.\n' + e.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createGroup(params: CreatePermissionGroupDto) {
    try {
      const role = this.permissionGroupRepository.create(params);
      const result = await this.permissionGroupRepository.save(role);
      return new BaseResponse({
        statusCode: 200,
        isSuccess: true,
        data: result,
        message: 'Tạo nhóm chức năng thành công!',
      });
    } catch (e) {
      throw new BaseException(
        'Có lỗi xảy ra.\n' + e.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateGroup(groupId: string, params: CreatePermissionGroupDto) {
    try {
      const groupFound = await this.permissionGroupRepository.findOneBy({
        id: groupId,
      });

      if (!groupFound) {
        throw new BaseException(
          'Không tìm thấy nhóm chức năng',
          HttpStatus.NOT_FOUND,
        );
      }

      groupFound.name = params.name;

      const result = await this.permissionGroupRepository.save(groupFound);

      return new BaseResponse({
        statusCode: 200,
        isSuccess: true,
        data: result,
        message: 'Cập nhật quyền thành công!',
      });
    } catch (e) {
      throw new BaseException(
        'Có lỗi xảy ra.\n' + e.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteGroup(groupId: string) {
    try {
      const role = await this.permissionGroupRepository.findOneBy({
        id: groupId,
      });

      if (!role) {
        throw new BaseException(
          'Không tìm thấy nhóm chức năng',
          HttpStatus.NOT_FOUND,
        );
      }

      const result = await this.permissionGroupRepository.softDelete({
        id: groupId,
      });

      return new BaseResponse({
        statusCode: 200,
        isSuccess: true,
        data: result,
        message: 'Xoá nhóm chức năng thành công!',
      });
    } catch (e) {
      throw new BaseException(
        'Có lỗi xảy ra.\n' + e.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
