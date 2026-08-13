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
