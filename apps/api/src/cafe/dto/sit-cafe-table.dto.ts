import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import type { CafeTableSetup } from '@cinemo/shared';

export class SitCafeTableDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(24)
  label?: string;

  @ApiPropertyOptional({ enum: ['open', 'locked'] })
  @IsOptional()
  @IsIn(['open', 'locked'])
  access?: CafeTableSetup['access'];
}
