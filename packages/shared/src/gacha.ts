export const GACHA_ROOMS = [
  { id: "genre", label: "장르방" },
  { id: "country", label: "국적방" },
] as const;

export const GACHA_MACHINES = [
  { id: "random", room: "genre", label: "랜덤", kicker: "RANDOM" },
  { id: "thriller", room: "genre", label: "스릴러", kicker: "THRILLER" },
  { id: "action", room: "genre", label: "액션", kicker: "ACTION" },
  { id: "kr", room: "country", label: "한국", kicker: "KR" },
  { id: "jp", room: "country", label: "일본", kicker: "JP" },
  { id: "us", room: "country", label: "미국", kicker: "US" },
] as const;

export type GachaMachineId = (typeof GACHA_MACHINES)[number]["id"];
export type GachaRoomId = (typeof GACHA_MACHINES)[number]["room"];

export const GACHA_TMDB_FILTERS: Record<
  GachaMachineId,
  Record<string, string>
> = {
  random: {},
  thriller: { with_genres: "53" },
  action: { with_genres: "28" },
  kr: { with_origin_country: "KR" },
  jp: { with_origin_country: "JP" },
  us: { with_origin_country: "US" },
};

export function isGachaMachineId(id: string): id is GachaMachineId {
  return GACHA_MACHINES.some((m) => m.id === id);
}

export type GachaMovie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  director: string | null;
};

export type UseTicketResult = {
  status: "used";
  machineId: string;
  movie: GachaMovie;
};

export type TodayTicket = {
  status: "none" | "issued" | "used";
  machineId: string | null;
  tmdbId: number | null;
  movie: GachaMovie | null;
};
