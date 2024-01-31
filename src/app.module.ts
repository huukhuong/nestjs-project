import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOption } from '../database/data-source';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';
import { Role } from './role/role.entity';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { RoleGuard } from './role/role.guard';
import { PermissionGuard } from './permission/permission.guard';
import { Permission } from './permission/entities/permission.entity';
import { PermissionGroup } from './permission/entities/permission-group.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOption),
    TypeOrmModule.forFeature([User, Role, Permission, PermissionGroup]),
    AuthModule,
    RoleModule,
    PermissionModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
