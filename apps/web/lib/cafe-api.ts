import type {
  CafeHallResponse,
  CafeMessageItem,
  CafeNotice,
  CafeSitResult,
  CafeStandResult,
  CafeTableChatResponse,
  CafeTableId,
  CafeTableSetup,
  UpdateCafeNoticeInput,
} from '@cinemo/shared';
import { apiFetch } from './api';

export function getCafeHallRequest(token?: string | null) {
  return apiFetch<CafeHallResponse>('/cafe/hall', { token });
}

export function getCafeTableChatRequest(token: string, tableId: CafeTableId) {
  return apiFetch<CafeTableChatResponse>(`/cafe/tables/${tableId}/messages`, {
    token,
  });
}

export function sitCafeTableRequest(
  token: string,
  tableId: CafeTableId,
  setup?: CafeTableSetup,
) {
  return apiFetch<CafeSitResult>(`/cafe/tables/${tableId}/sit`, {
    method: 'POST',
    token,
    body: JSON.stringify(setup ?? {}),
  });
}

export function standCafeTableRequest(token: string, tableId: CafeTableId) {
  return apiFetch<CafeStandResult>(`/cafe/tables/${tableId}/stand`, {
    method: 'POST',
    token,
  });
}

export function sayCafeMessageRequest(
  token: string,
  tableId: CafeTableId,
  body: string,
) {
  return apiFetch<CafeMessageItem>(`/cafe/tables/${tableId}/messages`, {
    method: 'POST',
    token,
    body: JSON.stringify({ body }),
  });
}

export function updateCafeMessageRequest(
  token: string,
  messageId: string,
  body: string,
) {
  return apiFetch<CafeMessageItem>(`/cafe/messages/${messageId}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify({ body }),
  });
}

export function getCafeNoticeRequest() {
  return apiFetch<CafeNotice>('/cafe/notice');
}

export function updateCafeNoticeRequest(
  token: string,
  input: UpdateCafeNoticeInput,
) {
  return apiFetch<CafeNotice>('/cafe/notice', {
    method: 'PATCH',
    token,
    body: JSON.stringify(input),
  });
}
