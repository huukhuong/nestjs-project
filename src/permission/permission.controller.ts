import { Body, Controller, Delete, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UUIDParam } from 'src/utils/custom-decorators';
import { CreatePermissionGroupDto } from './dto/create-permission-group.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { SearchPermissionGroupDto } from './dto/search-permission-group.dto';
import { SearchPermissionDto } from './dto/search-permission.dto';
import { PermissionService } from './permission.service';

@ApiTags('Permission')
@ApiBearerAuth()
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post('/search')
  @ApiOperation({
    summary: 'Tìm kiếm quyền có phân trang',
  })
  search(@Body() params: SearchPermissionDto) {
    return this.permissionService.search(params);
  }

  @Post('/create')
  @ApiOperation({
    summary: 'Tạo mới quyền',
  })
  create(@Body() params: CreatePermissionDto) {
    return this.permissionService.create(params);
  }

  @Put('/update/:permissionId')
  @ApiOperation({
    summary: 'Cập nhật quyền',
  })
  update(
    @UUIDParam('permissionId') permissionId: string,
    @Body() params: CreatePermissionDto,
  ) {
    return this.permissionService.update(permissionId, params);
  }

  @Delete('/delete/:permissionId')
  @ApiOperation({
    summary: 'Xoá quyền',
  })
  delete(@UUIDParam('permissionId') permissionId: string) {
    return this.permissionService.delete(permissionId);
  }

  /**
   * =================================================
   * ================ nhóm chức năng =================
   * =================================================
   */
  @Post('/search-group')
  @ApiOperation({
    summary: 'Tìm kiếm nhóm chức năng có phân trang',
  })
  searchGroup(@Body() params: SearchPermissionGroupDto) {
    return this.permissionService.searchGroup(params);
  }

  @Post('/create-group')
  @ApiOperation({
    summary: 'Tạo mới nhóm chức năng',
  })
  createGroup(@Body() params: CreatePermissionGroupDto) {
    return this.permissionService.createGroup(params);
  }

  @Put('/update-group/:groupId')
  @ApiOperation({
    summary: 'Cập nhật nhóm chức năng',
  })
  updateGroup(
    @UUIDParam('groupId') groupId: string,
    @Body() params: CreatePermissionGroupDto,
  ) {
    return this.permissionService.updateGroup(groupId, params);
  }

  @Delete('/delete-group/:groupId')
  @ApiOperation({
    summary: 'Xoá nhóm chức năng',
  })
  deleteGroup(@UUIDParam('groupId') groupId: string) {
    return this.permissionService.deleteGroup(groupId);
  }
}
