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
  myTableId: CafeTableId | null;
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

export const DEFAULT_CAFE_NOTICE_RULES = [
  "짧은 한 줄 · 이모지 OK · 장문 SNS ❌",
  "오늘 수다만 — 새벽 2시에 사라져요",
  "남기고 싶은 말 → 후기방",
  "첫 앉은 사람이 이름 · 공개/비공개",
  "말하기 = 로그인 · 본인 말만 수정",
] as const;

export type CafeNotice = {
  id: string;
  key: string;
  kicker: string;
  title: string;
  rules: string[];
  createdAt: string;
  updatedAt: string;
};

export type UpdateCafeNoticeInput = {
  kicker?: string;
  title?: string;
  rules?: string[];
};
