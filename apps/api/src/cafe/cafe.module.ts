import { Module } from '@nestjs/common';
import { CafeService } from './cafe.service';
import { CafeController } from './cafe.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { CafeNightCron } from './cafe-night.cron';
import { AuthModule } from '../auth/auth.module';
import { CafeGateway } from './cafe.gateway';

@Module({
  imports: [ScheduleModule.forRoot(), AuthModule],
  controllers: [CafeController],
  providers: [CafeService, CafeNightCron, CafeGateway],
})
export class CafeModule {}
