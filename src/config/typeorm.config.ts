import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { nodeEnv } from 'src/common/data/node-env';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isProduction = configService.get<string>('NODE_ENV') === nodeEnv.prod;

  return {
    type: 'postgres',
    host: configService.get<string>('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    username: configService.get<string>('DATABASE_USER'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    database: configService.get<string>('DATABASE_NAME'),
    logging: false, // show SQL queries in the console
    autoLoadEntities: true, // automatically load all entities (no need to specify them)
    synchronize: !isProduction, // never sync schema in production (can cause data loss)
  };
};
