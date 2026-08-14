import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateReviewPostDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  body?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0.5)
  @Max(5)
  rating?: number;
}
