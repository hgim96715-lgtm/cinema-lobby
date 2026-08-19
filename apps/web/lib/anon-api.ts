import { apiFetch } from './api';

const STORAGE_KEY = 'cinemo_visitor';

function visitorKey() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;
  const next = crypto.randomUUID();
  localStorage.setItem(STORAGE_KEY, next);
  return next;
}

export function recordAnonReviewVisitRequest() {
  return apiFetch<{ ok: true }>('/anon/visit', {
    method: 'POST',
    body: JSON.stringify({ visitorKey: visitorKey(), place: 'review' }),
  });
}
