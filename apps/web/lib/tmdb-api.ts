import type { GachaMovie } from '@cinemo/shared';
import { apiFetch } from './api';
import { normalizeSearchQuery } from './search-query';

export type TmdbSearchResponse = {
  page: number;
  total_pages: number;
  results: GachaMovie[];
};

export function searchMoviesRequest(token: string, q: string, page = 1) {
  const query = encodeURIComponent(normalizeSearchQuery(q));
  return apiFetch<TmdbSearchResponse>(`/tmdb/search?q=${query}&page=${page}`, {
    token,
  });
}
