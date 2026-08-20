import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpsertProviderOverrideDto {
  @ApiProperty({ example: 496243 })
  @IsInt()
  @Min(1)
  tmdbId: number;

  @ApiProperty({ example: 356, description: 'TMDB provider_id (Wavve=356)' })
  @IsInt()
  @Min(1)
  providerId: number;

  @ApiProperty({ example: 'Wavve' })
  @IsString()
  providerName: string;

  @ApiPropertyOptional({ example: '/xxx.jpg' })
  @IsOptional()
  @IsString()
  logoPath?: string;

  @ApiProperty({ enum: ['add', 'remove'] })
  @IsEnum(['add', 'remove'] as const)
  action: 'add' | 'remove';

  @ApiPropertyOptional({ example: '웨이브 앱에서 확인' })
  @IsOptional()
  @IsString()
  note?: string;
}
