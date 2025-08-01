import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { nodeEnv } from 'src/common/data/node-env';
import { executeSecuritySeed } from './services/security-seed.service';

@Injectable()
export class SeedService {
  private readonly nodeEnvLocal: string;

  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {
    this.nodeEnvLocal =
      this.configService.get<string>('NODE_ENV') ?? nodeEnv.dev;

    if (this.nodeEnvLocal !== nodeEnv.dev) {
      throw new ConflictException(
        'No se puede ejecutar el seed. Solo está permitido en entorno de desarrollo.',
      );
    }
  }

  async runSeedSecurity() {
    try {
      await this.deleteAllTables();
      await executeSecuritySeed(this.dataSource);
      return { message: 'Seed ejecutado correctamente' };
    } catch {
      throw new ConflictException('Hubo un error al ejecutar el seed');
    }
  }

  private async deleteAllTables() {
    await this.dataSource.dropDatabase();
    await this.dataSource.synchronize();
    return { message: 'Base de datos eliminada y sincronizada nuevamente' };
  }
}
