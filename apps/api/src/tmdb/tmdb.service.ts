import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvKeys } from '../config/env.keys';
import { PrismaService } from '../prisma/prisma.service';
import type { MoviePool } from '../generated/prisma/client';
import type { GachaMovie } from '@cinemo/shared';

type TmdbDiscoverMovie = {
  id: number;
  adult: boolean;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
};

@Injectable()
export class TmdbService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  private async get<T>(
    path: string,
    query: Record<string, string> = {},
  ): Promise<T> {
    const baseUrl = this.configService.getOrThrow(EnvKeys.TMDB_BASE_URL);
    const token = this.configService.getOrThrow(EnvKeys.TMDB_ACCESS_TOKEN);
    const url = new URL(`${baseUrl}${path}`);
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, value);
    }

    const response = await fetch(url, {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new ServiceUnavailableException(
        `TMDB 요청 실패 (${response.status})`,
      );
    }
    return response.json();
  }

  async getMovieGenres(language = 'ko') {
    return this.get<{ genres: { id: number; name: string }[] }>(
      '/genre/movie/list',
      { language },
    );
  }

  async discoverMovies(
    filters: Record<string, string> = {},
    page = 1,
    language = 'ko-KR',
  ) {
    return this.get<{
      page: number;
      total_pages: number;
      results: TmdbDiscoverMovie[];
    }>('/discover/movie', {
      sort_by: 'popularity.desc',
      language,
      page: page.toString(),
      ...filters,
      include_adult: 'false',
    });
  }

  /** MoviePool row → 앱 카드(GachaMovie) 형태 */
  private fromPool(row: MoviePool): GachaMovie {
    return {
      id: row.tmdbId,
      title: row.title,
      overview: row.overview,
      poster_path: row.posterPath,
      release_date: row.releaseDate,
      director: row.director,
    };
  }

  async getMovieCached(movieId: number): Promise<GachaMovie> {
    const cached = await this.prismaService.moviePool.findUnique({
      where: { tmdbId: movieId },
    });
    if (cached) return this.fromPool(cached);
    const movie = await this.getMovie(movieId);
    await this.prismaService.moviePool.upsert({
      where: { tmdbId: movieId },
      create: {
        tmdbId: movieId,
        title: movie.title,
        overview: movie.overview,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date ?? '',
        director: movie.director,
      },
      update: {
        title: movie.title,
        overview: movie.overview,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date ?? '',
        director: movie.director,
        syncedAt: new Date(),
      },
    });
    return movie;
  }

  async seedPool(
    filters: Record<string, string> = {},
    pages = 5,
  ): Promise<{ ok: boolean }> {
    for (let page = 1; page <= pages; page++) {
      const { results } = await this.discoverMovies(filters, page);
      for (const movie of results) {
        await this.getMovieCached(movie.id);
      }
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    return { ok: true };
  }

  async pickRandomMovie(
    filters: Record<string, string> = {},
    excludeIds: number[] = [],
  ): Promise<GachaMovie> {
    const exclude = new Set(excludeIds);

    // 랜덤 머신만: 풀에 장르/국적 태그 없음 → 필터 비었을 때만 DB 우선
    if (Object.keys(filters).length === 0) {
      const where =
        excludeIds.length > 0 ? { tmdbId: { notIn: excludeIds } } : {};
      const count = await this.prismaService.moviePool.count({ where });
      if (count > 0) {
        const row = await this.prismaService.moviePool.findFirst({
          where,
          skip: Math.floor(Math.random() * count),
        });
        if (row) {
          return this.fromPool(row);
        }
      }
    }

    // 장르/국적 머신 · 또는 풀 비어 있음 → 기존 Discover
    const first = await this.discoverMovies(filters, 1);
    if (!first.results.length || first.total_pages < 1) {
      throw new ServiceUnavailableException('TMDB에서 영화를 찾지 못했습니다.');
    }
    for (let attempt = 0; attempt < 8; attempt++) {
      const page =
        Math.floor(Math.random() * Math.min(first.total_pages, 20)) + 1;
      const picked =
        page === 1 ? first : await this.discoverMovies(filters, page);
      const list = picked.results.filter((movie) => !exclude.has(movie.id));
      if (!list.length) continue;

      const movie = list[Math.floor(Math.random() * list.length)]!;
      return this.getMovieCached(movie.id);
    }
    throw new ServiceUnavailableException('뽑을 수 있는 영화가 없습니다.');
  }

  /** TMDB id → 앱용 영화 카드 (감독 포함) */
  async getMovie(movieId: number): Promise<GachaMovie> {
    const detail = await this.getMovieDetail(movieId);
    const director =
      detail.credits?.crew?.find((c) => c.job === 'Director')?.name ?? null;
    return {
      id: movieId,
      title: detail.title,
      overview: detail.overview,
      poster_path: detail.poster_path,
      release_date: detail.release_date,
      director,
    };
  }

  private async getMovieDetail(movieId: number, language = 'ko-KR') {
    return this.get<{
      title: string;
      overview: string;
      poster_path: string | null;
      release_date: string;
      credits?: { crew: { job: string; name: string }[] };
    }>(`/movie/${movieId}`, {
      language,
      append_to_response: 'credits',
    });
  }
}
