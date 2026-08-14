import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateReviewPostDto {
  @ApiProperty({ example: 550 })
  @IsInt()
  tmdbId: number;

  @ApiProperty({ example: '너무 잼있어요!' })
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  body: string;

  @ApiProperty({ example: 4.5, minimum: 0.5, maximum: 5 })
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0.5)
  @Max(5)
  rating: number;
}
