import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvKeys } from '../config/env.keys';
import { PrismaService } from '../prisma/prisma.service';
import type { MoviePool } from '../generated/prisma/client';
import type { GachaMovie, MovieWithTags } from '@cinemo/shared';
import {
  normalizeSearchQuery,
  searchQueryFallbacks,
} from '../lib/search-query';

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
    // hit = row + 태그 있음 · 태그 빈 옛 row는 TMDB 재동기화
    if (
      cached &&
      (cached.genreIds.length > 0 || cached.originCountries.length > 0)
    ) {
      return this.fromPool(cached);
    }
    const movie = await this.getMovie(movieId);
    const { genre_ids, origin_countries, ...card } = movie;
    await this.prismaService.moviePool.upsert({
      where: { tmdbId: movieId },
      create: {
        tmdbId: movieId,
        title: movie.title,
        overview: movie.overview,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date ?? '',
        director: movie.director,
        genreIds: genre_ids,
        originCountries: origin_countries,
      },
      update: {
        title: movie.title,
        overview: movie.overview,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date ?? '',
        director: movie.director,
        genreIds: genre_ids,
        originCountries: origin_countries,
        syncedAt: new Date(),
      },
    });
    return card;
  }

  async seedPool(
    filters: Record<string, string> = {},
    pages = 5,
  ): Promise<{ ok: boolean }> {
    for (let page = 1; page <= pages; page++) {
      const { results } = await this.discoverMovies(filters, page);
      for (const movie of results) {
        if (!movie.poster_path) continue;
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

    // 풀 우선: watched 제외 + 장르/국적 태그 + 포스터 있는 것만
    const where = {
      posterPath: { not: null },
      ...(excludeIds.length > 0 ? { tmdbId: { notIn: excludeIds } } : {}),
      ...(filters.with_genres
        ? { genreIds: { has: Number(filters.with_genres) } }
        : {}),
      ...(filters.with_origin_country
        ? { originCountries: { has: filters.with_origin_country } }
        : {}),
    };
    const count = await this.prismaService.moviePool.count({ where });
    if (count > 0) {
      const row = await this.prismaService.moviePool.findFirst({
        where,
        skip: Math.floor(Math.random() * count),
      });
      if (row) return this.fromPool(row);
    }

    // 풀 miss · 태그 없는 옛 row → Discover
    const first = await this.discoverMovies(filters, 1);
    if (!first.results.length || first.total_pages < 1) {
      throw new ServiceUnavailableException('TMDB에서 영화를 찾지 못했습니다.');
    }
    for (let attempt = 0; attempt < 8; attempt++) {
      const page =
        Math.floor(Math.random() * Math.min(first.total_pages, 20)) + 1;
      const picked =
        page === 1 ? first : await this.discoverMovies(filters, page);
      const list = picked.results.filter(
        (movie) => !exclude.has(movie.id) && movie.poster_path,
      );
      if (!list.length) continue;

      const movie = list[Math.floor(Math.random() * list.length)]!;
      const result = await this.getMovieCached(movie.id);
      if (result.poster_path) return result;
    }
    throw new ServiceUnavailableException('뽑을 수 있는 영화가 없습니다.');
  }

  /** TMDB id → 앱용 영화 카드 (감독 포함) */
  async getMovie(movieId: number): Promise<MovieWithTags> {
    const detail = await this.getMovieDetail(movieId);
    const director =
      detail.credits?.crew?.find((c) => c.job === 'Director')?.name ?? null;
    const genre_ids = detail.genres?.map((g) => g.id) ?? [];
    const origin_countries =
      detail.production_countries?.map((c) => c.iso_3166_1) ?? [];
    return {
      id: movieId,
      title: detail.title,
      overview: detail.overview,
      poster_path: detail.poster_path,
      release_date: detail.release_date,
      director,
      genre_ids,
      origin_countries,
    };
  }

  private async getMovieDetail(movieId: number, language = 'ko-KR') {
    return this.get<{
      title: string;
      overview: string;
      poster_path: string | null;
      release_date: string;
      credits?: { crew: { job: string; name: string }[] };
      genres?: { id: number; name: string }[];
      production_countries?: { iso_3166_1: string; name: string }[];
    }>(`/movie/${movieId}`, {
      language,
      append_to_response: 'credits',
    });
  }

  private async fetchSearchMovies(q: string, page: number) {
    const data = await this.get<{
      page: number;
      total_pages: number;
      results: TmdbDiscoverMovie[];
    }>('/search/movie', {
      query: q,
      language: 'ko-KR',
      include_adult: 'false',
      page: String(page),
    });
    return {
      page: data.page,
      total_pages: data.total_pages,
      results: data.results.map((m) => ({
        id: m.id,
        title: m.title,
        overview: m.overview,
        poster_path: m.poster_path,
        release_date: m.release_date ?? '',
      })),
    };
  }

  async searchMovies(query: string, page = 1) {
    const q = normalizeSearchQuery(query);
    if (!q) return { page: 1, results: [] as GachaMovie[], total_pages: 0 };

    let result = await this.fetchSearchMovies(q, page);
    if (result.results.length > 0) return result;

    for (const alt of searchQueryFallbacks(q)) {
      result = await this.fetchSearchMovies(alt, page);
      if (result.results.length > 0) return result;
    }

    return result;
  }
}
