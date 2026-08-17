import type { LobbyBoardResponse } from '@cinemo/shared';
import { apiFetch } from './api';

export function getLobbyBoardRequest() {
  return apiFetch<LobbyBoardResponse>('/lobby/board');
}

export function recordLobbyVisitRequest(token: string) {
  return apiFetch<{ ok: true }>('/lobby/visit', {
    method: 'POST',
    token,
  });
}
