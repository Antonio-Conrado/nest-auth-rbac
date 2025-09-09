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
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerConfigService } from './config/throttler.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      // Load and validate environment variables globally
      isGlobal: true,
      validationSchema: JoiValidationSchema,
    }),

    // Rate limiting configuration for requests
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useClass: ThrottlerConfigService,
    }),
    // cache
    CacheModule.registerAsync({
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (config: ConfigService) => ({
        store: config.get<string>('CACHE_STORE', 'memory'),
        ttl: config.get<number>('CACHE_TTL'),
        max: config.get<number>('CACHE_MAX'),
      }),
    }),

    // Initialize TypeORM using the config service
    TypeOrmModule.forRootAsync({
      useFactory: typeOrmConfig,
      inject: [ConfigService],
    }),
    //modules
    AuthModule,
    RolesModule,
    PermissionsModule,
    UsersModule,
    SeedModule,
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
