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

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOption),
    TypeOrmModule.forFeature([User, Role]),
    AuthModule,
    RoleModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
