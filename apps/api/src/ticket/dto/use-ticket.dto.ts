import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UseTicketDto {
  @ApiProperty({ description: '뽑기 머신 ID', example: 'thriller' })
  @IsString()
  machineId: string;
}
