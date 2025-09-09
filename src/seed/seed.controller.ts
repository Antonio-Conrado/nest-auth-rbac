import { Controller, Get, Version } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get('security')
  @Version('1')
  executeSeed() {
    return this.seedService.runSeedSecurity();
  }
}
