import {
  ToggleUserMovieResult,
  UserMovieKind,
  UserMovieListItem,
  UserMovieMarks,
} from '@cinemo/shared';
import { apiFetch } from './api';

export function toggleUserMovieRequest(
  token: string,
  tmdbId: number,
  kind: UserMovieKind,
) {
  return apiFetch<ToggleUserMovieResult>('/user-movies/toggle', {
    method: 'POST',
    token,
    body: JSON.stringify({ tmdbId, kind }),
  });
}

export function getUserMovieMarksRequest(token: string, tmdbId: number) {
  return apiFetch<UserMovieMarks>(`/user-movies/marks?tmdbId=${tmdbId}`, {
    token,
  });
}

export function listUserMoviesRequest(token: string, kind: UserMovieKind) {
  return apiFetch<UserMovieListItem[]>(`/user-movies?kind=${kind}`, {
    token,
  });
}
