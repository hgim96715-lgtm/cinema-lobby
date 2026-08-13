import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvKeys } from '../config/env.keys';

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
  constructor(private readonly configService: ConfigService) {}

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
  /** MVP: Discover 앞 20페이지 편향 랜덤. 공정 랜덤은 추후 MoviePool — docs/web/tmdb.md 참고*/
  async pickRandomMovie(
    filters: Record<string, string> = {},
    excludeIds: number[] = [],
  ) {
    const exclude = new Set(excludeIds);
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
      const detail = await this.getMovieDetail(movie.id);
      const director =
        detail.credits?.crew?.find((c) => c.job === 'Director')?.name ?? null;
      return {
        id: movie.id,
        title: detail.title || movie.title,
        overview: detail.overview || movie.overview,
        poster_path: detail.poster_path ?? movie.poster_path,
        release_date: detail.release_date || movie.release_date,
        director,
      };
    }
    throw new ServiceUnavailableException('뽑을 수 있는 영화가 없습니다.');
  }

  /** TMDB id → 앱용 영화 카드 (감독 포함) */
  async getMovie(movieId: number) {
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
