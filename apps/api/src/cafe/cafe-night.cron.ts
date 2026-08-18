import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CafeService } from './cafe.service';

@Injectable()
export class CafeNightCron {
  constructor(private readonly cafeService: CafeService) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM, { timeZone: 'Asia/Seoul' })
  async closeCafeForNight() {
    await this.cafeService.closeForNight();
  }
}
