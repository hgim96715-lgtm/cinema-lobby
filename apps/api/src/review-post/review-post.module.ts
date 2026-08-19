import { Module } from '@nestjs/common';
import { ReviewPostService } from './review-post.service';
import { ReviewPostController } from './review-post.controller';
import { TmdbModule } from '../tmdb/tmdb.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [TmdbModule, AdminModule],
  controllers: [ReviewPostController],
  providers: [ReviewPostService],
})
export class ReviewPostModule {}
