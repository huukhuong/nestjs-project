import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Role } from './entities/role.entity';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, User]),
  ],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
