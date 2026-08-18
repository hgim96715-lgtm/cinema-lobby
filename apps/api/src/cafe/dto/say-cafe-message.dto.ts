import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class SayCafeMessageDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  body: string;
}
