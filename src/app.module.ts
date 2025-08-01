import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { typeOrmConfig } from './config/typeorm.config';
import { JoiValidationSchema } from './config/env.config';
import { AuthModule } from './modules/security/auth/auth.module';
import { RolesModule } from './modules/security/roles/roles.module';
import { PermissionsModule } from './modules/security/permissions/permissions.module';
import { UsersModule } from './modules/security/users/users.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // Load and validate environment variables globally
      isGlobal: true,
      validationSchema: JoiValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      // Initialize TypeORM using the config service
      useFactory: typeOrmConfig,
      inject: [ConfigService],
    }),

    AuthModule,
    RolesModule,
    PermissionsModule,
    UsersModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
