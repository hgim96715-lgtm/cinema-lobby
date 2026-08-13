import type { TicketStatus } from '@cinemo/shared';
import { apiFetch } from './api';

export function getTodayTicketRequest(token: string) {
  return apiFetch<{ status: TicketStatus }>('/tickets/today', { token });
}

export function issueTicketRequest(token: string) {
  return apiFetch<{ id: string }>('/tickets/issue', { method: 'POST', token });
}

export function useTicketRequest(token: string) {
  return apiFetch<void>('/tickets/use', { method: 'POST', token });
}
