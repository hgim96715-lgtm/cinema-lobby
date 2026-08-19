import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TmdbService } from './tmdb.service';

@Injectable()
export class TmdbSeedCron {
  constructor(private readonly tmdbService: TmdbService) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM, { timeZone: 'Asia/Seoul' })
  async seedPoolNight() {
    await this.tmdbService.seedPoolAll(3);
  }
}
