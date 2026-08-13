import { Module } from '@nestjs/common';
import { UserMovieService } from './user-movie.service';
import { UserMovieController } from './user-movie.controller';
import { TmdbModule } from '../tmdb/tmdb.module';

@Module({
  imports: [TmdbModule],
  controllers: [UserMovieController],
  providers: [UserMovieService],
})
export class UserMovieModule {}
