import { GachaMovie } from "./gacha";

export type BoardWeekTopMovie = {
  tmdbId: number;
  title: string;
  count: number;
};

/** 전광판 막대 시리즈  */
export type LobbyBoardResponse = {
  todayVisits: number | null;
  todayVisitSeries?: number[];

  todayReviewCount: number;
  todayReviewSeries: number[];

  weekReviewCount: number;

  weekTopMovies: BoardWeekTopMovie[];
};

export type WeeklyRevealWinner = {
  tmdbId: number;
  title: string;
  count: number;
  sampleBody: string | null;
  movie: GachaMovie;
};
