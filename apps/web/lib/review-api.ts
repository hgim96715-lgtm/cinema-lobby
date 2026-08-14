import type {
  CreateReviewPostInput,
  ReviewPostItem,
  UpdateReviewPostInput,
} from '@cinemo/shared';
import { apiFetch } from './api';

export function listReviewPostsRequest(limit = 40, token?: string | null) {
  return apiFetch<ReviewPostItem[]>(`/review-posts?limit=${limit}`, { token });
}

export function createReviewPostRequest(
  token: string,
  input: CreateReviewPostInput,
) {
  return apiFetch<ReviewPostItem>('/review-posts', {
    method: 'POST',
    token,
    body: JSON.stringify(input),
  });
}

export function updateReviewPostRequest(
  token: string,
  id: string,
  input: UpdateReviewPostInput,
) {
  return apiFetch<ReviewPostItem>(`/review-posts/${id}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(input),
  });
}

export function deleteReviewPostRequest(token: string, id: string) {
  return apiFetch<void>(`/review-posts/${id}`, {
    method: 'DELETE',
    token,
  });
}

export function toggleReviewPostLikeRequest(token: string, id: string) {
  return apiFetch<{ likeCount: number; likedByMe: boolean }>(
    `/review-posts/${id}/like`,
    {
      method: 'POST',
      token,
    },
  );
}
