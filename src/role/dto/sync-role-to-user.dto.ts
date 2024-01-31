import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class SyncRoleToUserDto {
  @ApiProperty({
    default: ['b4e5ad03-aa18-4d8a-a63f-1125fa57c32a'],
  })
  @IsUUID('4', { each: true, message: 'Each roleId must be a valid UUIDv4' })
  roleIds: string[];
}
