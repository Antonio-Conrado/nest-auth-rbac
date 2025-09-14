import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { nodeEnv } from 'src/common/data/node-env';

/**
 * ⚠️ This configuration is used for NestJS runtime (services, repositories, etc.)
 *     and is different from data-source, which is used only for migrations.
 */

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isProduction = configService.get<string>('NODE_ENV') === nodeEnv.prod;
  const useMigrations = configService.get<string>('USE_MIGRATIONS') === 'true';

  return {
    type: 'postgres',
    host: configService.get<string>('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    username: configService.get<string>('DATABASE_USER'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    database: configService.get<string>('DATABASE_NAME'),
    logging: false, // show SQL queries in the console
    autoLoadEntities: true, // automatically load all entities (no need to specify them)
    synchronize: !isProduction && !useMigrations,
    /**synchronize
     * ⚠️ Automatically creates/updates database tables based on entities.
     *    - True only when NOT in production AND NOT using migrations.
     *    - Always false in production or when using migrations to avoid accidental data loss.
     */
  };
};
