export function kstDateKey(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
  }).format(date);
}

/** 로비에서 시간 보이게 예: `2026년 8월 14일 · 금 · 16:12` */

export function kstLobbyDateLabel(date = new Date()) {
  const parts = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) => {
    return parts.find((part) => part.type === type)?.value || '';
  };
  return `${get('year')}년 ${get('month')} ${get('day')}일 · ${get('weekday')} · ${get('hour')}:${get('minute')}`;
}
