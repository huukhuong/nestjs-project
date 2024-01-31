import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/role/role.entity';
import { User } from 'src/auth/user.entity';
import { Permission } from './entities/permission.entity';
import { PermissionGroup } from './entities/permission-group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission, PermissionGroup, Role, User]),
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
})
export class PermissionModule {}
