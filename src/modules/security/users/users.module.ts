import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CommonModule } from 'src/common/common.module';
import { User } from './entities/user.entity';
import { UserSecurity } from './entities/user-security.entity';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([User, UserSecurity]),
    RolesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
