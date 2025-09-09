import { Injectable } from '@nestjs/common';
import {
  ThrottlerOptionsFactory,
  ThrottlerModuleOptions,
} from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ThrottlerConfigService implements ThrottlerOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createThrottlerOptions(): ThrottlerModuleOptions {
    return {
      throttlers: [
        {
          ttl: this.configService.get<number>('THROTTLE_TTL') ?? 60000,
          limit: this.configService.get<number>('THROTTLE_LIMIT') ?? 100,
        },
      ],
      errorMessage: 'Too many requests',
    };
  }
}
