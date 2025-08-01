import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module({
  imports: [],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
