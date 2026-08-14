import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ReviewPostService } from './review-post.service';
import { CreateReviewPostDto } from './dto/create-review-post.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserId } from '../auth/decorators/user-id.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UpdateReviewPostDto } from './dto/update-review-post.dto';
import { OptionalUserId } from '../auth/decorators/optional-user-id.decorator';

@ApiTags('review-posts')
@ApiBearerAuth()
@Controller('review-posts')
export class ReviewPostController {
  constructor(private readonly reviewPostService: ReviewPostService) {}

  @Public()
  @Get()
  list(
    @Query('limit', new DefaultValuePipe(40), ParseIntPipe) limit: number,
    @OptionalUserId() userId?: string,
  ) {
    return this.reviewPostService.list(limit, userId);
  }

  @Post()
  create(@UserId() userId: string, @Body() dto: CreateReviewPostDto) {
    return this.reviewPostService.create(userId, dto);
  }

  @Patch(':id')
  update(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateReviewPostDto,
  ) {
    return this.reviewPostService.update(userId, id, dto);
  }

  @Post(':id/like')
  toggleLike(@UserId() userId: string, @Param('id') id: string) {
    return this.reviewPostService.toggleLike(userId, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@UserId() userId: string, @Param('id') id: string) {
    return this.reviewPostService.remove(userId, id);
  }
}
