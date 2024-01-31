import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UUIDParam } from 'src/utils/decorators';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';
import { SearchRoleDto } from './dto/search-role.dto';
import { SyncRoleToUserDto } from './dto/sync-role-to-user.dto';

@ApiTags('Role')
@ApiBearerAuth()
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('/search')
  @ApiOperation({
    summary: 'Tìm kiếm nhóm người dùng có phân trang',
  })
  search(@Body() params: SearchRoleDto) {
    return this.roleService.search(params);
  }

  @Post('/create')
  @ApiOperation({
    summary: 'Tạo mới nhóm người dùng',
  })
  create(@Body() params: CreateRoleDto) {
    return this.roleService.create(params);
  }

  @Put('/update/:roleId')
  @ApiOperation({
    summary: 'Cập nhật nhóm người dùng',
  })
  update(@UUIDParam('roleId') roleId: string, @Body() params: CreateRoleDto) {
    return this.roleService.update(roleId, params);
  }

  @Delete('/delete/:roleId')
  @ApiOperation({
    summary: 'Xoá nhóm người dùng',
  })
  delete(@UUIDParam('roleId') roleId: string) {
    return this.roleService.delete(roleId);
  }

  @Get('/:roleId')
  @ApiOperation({
    summary: 'Xem chi tiết nhóm người dùng',
  })
  detail(@UUIDParam('roleId') roleId: string) {
    return this.roleService.detail(roleId);
  }

  @Post('/sync-roles-to-user/:userId')
  @ApiOperation({
    summary: 'Đồng bộ nhóm người dùng cho user',
  })
  syncRolesToUser(
    @UUIDParam('userId') userId: string,
    @Body() params: SyncRoleToUserDto,
  ) {
    return this.roleService.syncRolesToUser(userId, params);
  }

  @Post('/assign-roles-to-user/:userId/:roleId')
  @ApiOperation({
    summary: 'Gán nhóm người dùng cho user',
  })
  assignRolesToUser(
    @UUIDParam('userId') userId: string,
    @UUIDParam('roleId') roleId: string,
  ) {
    return this.roleService.assignRolesToUser(userId, roleId);
  }

  @Post('/revoke-roles-from-user/:userId/:roleId')
  @ApiOperation({
    summary: 'Xoá nhóm người dùng khỏi user',
  })
  revokeRolesFromUser(
    @UUIDParam('userId') userId: string,
    @UUIDParam('roleId') roleId: string,
  ) {
    return this.roleService.revokeRolesFromUser(userId, roleId);
  }
}
