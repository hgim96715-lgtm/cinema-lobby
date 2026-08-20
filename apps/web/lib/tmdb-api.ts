import type { GachaMovie } from '@cinemo/shared';
import { apiFetch } from './api';
import { normalizeSearchQuery } from './search-query';

export type TmdbSearchResponse = {
  page: number;
  total_pages: number;
  results: GachaMovie[];
};

export type SeedResult = Record<string, { ok: boolean }>;

export function seedPoolAllRequest(token: string | null, pages = 5) {
  return apiFetch<SeedResult>(`/tmdb/seed-pool/all?pages=${pages}`, {
    method: 'POST',
    token,
  });
}

export function searchMoviesRequest(token: string, q: string, page = 1) {
  const query = encodeURIComponent(normalizeSearchQuery(q));
  return apiFetch<TmdbSearchResponse>(`/tmdb/search?q=${query}&page=${page}`, {
    token,
  });
}

export function seedPoolRequest(
  token: string | null,
  machineId: string,
  pages = 5,
) {
  return apiFetch<void>(
    `/tmdb/seed-pool?machineId=${machineId}&pages=${pages}`,
    {
      method: 'POST',
      token,
    },
  );
}

export type SeedProgress = {
  done: number;
  total: number;
  machineId: string;
};

export function getSeedPoolProgressRequest(token: string | null) {
  return apiFetch<SeedProgress | null>('/tmdb/seed-pool/progress', { token });
}

export type ProviderOverride = {
  id: string;
  tmdbId: number;
  providerId: number;
  providerName: string;
  logoPath: string | null;
  action: 'add' | 'remove';
  note: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpsertProviderOverrideBody = {
  tmdbId: number;
  providerId: number;
  providerName: string;
  logoPath?: string;
  action: 'add' | 'remove';
  note?: string;
};

export function listProviderOverridesRequest(
  token: string | null,
  tmdbId: number,
) {
  return apiFetch<ProviderOverride[]>(
    `/tmdb/provider-overrides?tmdbId=${tmdbId}`,
    { token },
  );
}

export function upsertProviderOverrideRequest(
  token: string | null,
  body: UpsertProviderOverrideBody,
) {
  return apiFetch<ProviderOverride>('/tmdb/provider-overrides', {
    method: 'POST',
    token,
    body: JSON.stringify(body),
  });
}
