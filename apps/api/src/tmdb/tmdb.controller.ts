import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
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

  @Get('genres')
  getMovieGenres(@Query('language') language?: string) {
    return this.tmdbService.getMovieGenres(language ?? 'ko');
  }

  @Get('discover')
  discover(
    @Query('machineId') machineId: string | undefined,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    const filters =
      machineId && isGachaMachineId(machineId)
        ? GACHA_TMDB_FILTERS[machineId]
        : {};
    return this.tmdbService.discoverMovies(filters, page);
  }
}
