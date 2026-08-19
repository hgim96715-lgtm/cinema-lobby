import { Module } from '@nestjs/common';
import { CafeService } from './cafe.service';
import { CafeController } from './cafe.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { CafeNightCron } from './cafe-night.cron';
import { AuthModule } from '../auth/auth.module';
import { CafeGateway } from './cafe.gateway';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [ScheduleModule.forRoot(), AuthModule, AdminModule],
  controllers: [CafeController],
  providers: [CafeService, CafeNightCron, CafeGateway],
})
export class CafeModule {}
