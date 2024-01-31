import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import Constants from 'src/utils/constants';

export class SyncPermissionToRoleDto {
  @ApiProperty({
    default: [Constants.UUID_EXAMPLE],
  })
  @IsUUID('4', { each: true, message: 'Each roleId must be a valid UUIDv4' })
  permissionIds: string[];
}
