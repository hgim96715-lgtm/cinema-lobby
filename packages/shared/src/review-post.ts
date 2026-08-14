import { GachaMovie } from "./gacha";

export type ReviewPostItem = {
  id: string;
  tmdbId: number;
  body: string;
  rating: number;
  createdAt: string;
  nickname: string;
  movie: GachaMovie;
  likeCount: number;
  likedByMe: boolean;
};

export type CreateReviewPostInput = {
  tmdbId: number;
  body: string;
  rating: number;
};

export type UpdateReviewPostInput = {
  body?: string;
  rating?: number;
};
