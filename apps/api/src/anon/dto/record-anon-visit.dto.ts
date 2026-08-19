import { IsIn, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecordAnonVisitDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID('4')
  visitorKey: string;

  @ApiProperty({ enum: ['review'] })
  @IsIn(['review'])
  place: 'review';
}
