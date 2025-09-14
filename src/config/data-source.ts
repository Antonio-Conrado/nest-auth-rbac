import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { nodeEnv } from '../common/data/node-env';
dotenv.config(); // load variables from .env

// ⚠️ This DataSource is used only for running migrations (CLI scripts), not for runtime database access in NestJS services
const isProduction = process.env.NODE_ENV === nodeEnv.prod;

export const AppDataSource = new DataSource({
  type: 'postgres', // same type as your typeOrmConfig
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT!, 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'], // migrations folder
  synchronize: false, // never use synchronize with migrations
  logging: !isProduction,
});
