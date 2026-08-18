/** 카페 슬롯 — id만 고정 */
export const CAFE_TABLE_SLOTS = ["1", "2", "3"] as const;

export type CafeTableId = (typeof CAFE_TABLE_SLOTS)[number];

/** open = 홀에 이름·인원 · 누구나 입장 · locked = 🔒 · 외부 입장 ❌ */
export type CafeTableAccess = "open" | "locked";

export const DEFAULT_CAFE_TABLE_ACCESS: CafeTableAccess = "open";

/** 홀 전광 · WS 스냅샷 */
export type CafeTableSnapshot = {
  tableId: CafeTableId;
  label: string | null;
  access: CafeTableAccess;
  seatedCount: number;
};

/** 빈 테이블 첫 입장 시 (label·access 선택) */
export type CafeTableSetup = {
  label?: string | null;
  access?: CafeTableAccess;
};

export type CafeMessageItem = {
  id: string;
  tableId: CafeTableId;
  userId: string;
  nickname: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateCafeMessageInput = {
  body: string;
};

/** true → UI 「오늘 카페는 닫혔어요」 */
export type CafeHallResponse = {
  tables: CafeTableSnapshot[];
  cafeJustClosed: boolean;
};

export type CafeTableChatResponse = {
  messages: CafeMessageItem[];
  cafeJustClosed: boolean;
};

export type CafeSitResult =
  | { ok: true; snapshot: CafeTableSnapshot; cafeJustClosed: boolean }
  | { ok: false; reason: "locked" | "invalid-table" | "already-seated" };

export type CafeStandResult = {
  snapshot: CafeTableSnapshot;
  cafeJustClosed: boolean;
};
