import { Module } from '@nestjs/common';
import { TmdbService } from './tmdb.service';
import { TmdbController } from './tmdb.controller';
import { TmdbSeedCron } from './tmdb-seed.cron';

@Module({
  controllers: [TmdbController],
  providers: [TmdbService, TmdbSeedCron],
  exports: [TmdbService],
})
export class TmdbModule {}
