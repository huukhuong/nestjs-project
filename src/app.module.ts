import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOption } from '../database/data-source';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';
import { PermissionGroup } from './permission/entities/permission-group.entity';
import { Permission } from './permission/entities/permission.entity';
import { PermissionGuard } from './permission/permission.guard';
import { PermissionModule } from './permission/permission.module';
import { RegionModule } from './region/region.module';
import { Role } from './role/role.entity';
import { RoleGuard } from './role/role.guard';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOption),
    TypeOrmModule.forFeature([User, Role, Permission, PermissionGroup]),
    AuthModule,
    RoleModule,
    PermissionModule,
    RegionModule,
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
