/** Asia/Seoul 달력의 ‘오늘’ → Prisma @db.Date 용 (UTC 자정 Date) */
// en-CA → "2026-07-02" 형태 (ISO와 같은 순서)
export function todayKstDate(): Date {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  return new Date(`${parts}T00:00:00.000Z`);
}

/** 임의 시각 → KST 달력 Date (@db.Date 용) */
export function toKstDate(instant: Date = new Date()): Date {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(instant);
  return new Date(`${parts}T00:00:00.000Z`);
}

/** KST 달력 ‘오늘’의 [start, end) — Timestamptz 필터용 */

export function kstTodayRange(now = new Date()): { start: Date; end: Date } {
  const day = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
  const start = new Date(`${day}T00:00:00+09:00`);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

/** KST 이번 주 월요일 00:00 ~ 다음 월요일 00:00 범위 */
export function kstWeekRange(now = new Date()): { start: Date; end: Date } {
  const { start: todayStart } = kstTodayRange(now);
  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    weekday: 'short',
  }).format(now);
  const monOffset =
    {
      Mon: 0,
      Tue: 1,
      Wed: 2,
      Thu: 3,
      Fri: 4,
      Sat: 5,
      Sun: 6,
    }[weekday] ?? 0;
  const start = new Date(todayStart.getTime() - monOffset * 86400000);
  const end = new Date(start.getTime() + 7 * 86400000);
  return { start, end };
}

export function kstDateKey(date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
  }).format(date);
}

/** KST 02:00 마감 — 0~1시는 전날 수다로 취급 */
export function cafeDayKey(now = new Date()): string {
  const kst = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
  if (kst.getHours() < 2) kst.setDate(kst.getDate() - 1);
  return kstDateKey(kst);
}

export function cafeDayRange(now = new Date()): { start: Date; end: Date } {
  const key = cafeDayKey(now);
  const start = new Date(`${key}T02:00:00+09:00`);
  return { start, end: new Date(start.getTime() + 86400000) };
}
