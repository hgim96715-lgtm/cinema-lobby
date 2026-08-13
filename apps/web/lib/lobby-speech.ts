import type { TicketStatus } from '@cinemo/shared';

export function staffSpeech(
  nickname: string | undefined,
  status: TicketStatus | null,
) {
  if (!nickname) return '어서 오세요! 입장하면 티켓을 받을 수 있어요 😊';
  if (status === 'issued') return `${nickname}님, 뽑기방에서 사용해 보세요!`;
  if (status === 'used') return `${nickname}님, 오늘도 즐거우셨나요?`;
  return `${nickname}님, 안녕하세요! 오늘 뽑기권 받아가세요~`;
}

export function guestSpeech(status: TicketStatus | null) {
  if (status === 'issued') return '티켓 받았어! 뽑기방 가볼까?';
  if (status === 'used') return '오늘 뽑기는 끝!';
  return '티켓 받으러 왔어!';
}

export function guestTicketLabel(status: TicketStatus | null) {
  if (status === 'issued') return '발급됨 · 뽑기 가능';
  if (status === 'used') return '오늘 사용함';
  return '아직 없음';
}
