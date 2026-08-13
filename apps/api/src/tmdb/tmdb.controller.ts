import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GACHA_TMDB_FILTERS, isGachaMachineId } from '@cinemo/shared';
import { TmdbService } from './tmdb.service';

@ApiTags('tmdb')
@ApiBearerAuth()
@Controller('tmdb')
export class TmdbController {
  constructor(private readonly tmdbService: TmdbService) {}

  private getFilters(machineId?: string) {
    return machineId && isGachaMachineId(machineId)
      ? GACHA_TMDB_FILTERS[machineId]
      : {};
  }

  @Get('genres')
  getMovieGenres(@Query('language') language?: string) {
    return this.tmdbService.getMovieGenres(language ?? 'ko');
  }

  @Get('discover')
  discover(
    @Query('machineId') machineId: string | undefined,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.tmdbService.discoverMovies(this.getFilters(machineId), page);
  }

  @Post('seed-pool')
  seedPool(
    @Query('machineId') machineId: string | undefined,
    @Query('pages', new DefaultValuePipe(5), ParseIntPipe) pages: number,
  ) {
    return this.tmdbService.seedPool(this.getFilters(machineId), pages);
  }
}
