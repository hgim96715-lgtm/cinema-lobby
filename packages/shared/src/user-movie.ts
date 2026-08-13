import { GachaMovie } from "./gacha";

export const USER_MOVIE_KINDS = ["wish", "watched"] as const;

export type UserMovieKind = (typeof USER_MOVIE_KINDS)[number];

export type ToggleUserMovieResult = {
  tmdbId: number;
  kind: UserMovieKind;
  active: boolean;
};

export type UserMovieMarks = {
  tmdbId: number;
  wish: boolean;
  watched: boolean;
};

export type UserMovieListItem = {
  tmdbId: number;
  updatedAt: string;
  movie: GachaMovie;
};
