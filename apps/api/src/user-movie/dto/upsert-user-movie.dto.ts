import { IsIn, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { USER_MOVIE_KINDS, type UserMovieKind } from '@cinemo/shared';

export class UpsertUserMovieDto {
  @ApiProperty({ example: 550 })
  @IsInt()
  tmdbId: number;

  @ApiProperty({ enum: USER_MOVIE_KINDS, example: 'wish' })
  @IsIn([...USER_MOVIE_KINDS])
  kind: UserMovieKind;
}
