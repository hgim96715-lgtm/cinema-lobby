import type { GachaRoomId, TicketStatus } from '@cinemo/shared';

export type CapsulePhase = 'hidden' | 'dropping' | 'ready' | 'open';

export function gachaMessage(
  capsulePhase: CapsulePhase,
  status: TicketStatus | null,
  usedLabel?: string,
  selectedRoom?: GachaRoomId | null,
) {
  switch (capsulePhase) {
    case 'open':
      return `${usedLabel} 결과입니다.`;
    case 'ready':
      return '캡슐을 클릭해보세요!';
    case 'dropping':
      return '캡슐이 나왔어요!';
    case 'hidden':
    default:
      switch (status) {
        case 'issued':
          if (!selectedRoom) return '먼저 장르방 또는 국적방을 고르세요.';
          return '티켓 1장으로 머신 하나만 고르세요.';
        case 'used':
          return '오늘 뽑기는 이미 끝났어요.';
        default:
          return '로비에서 티켓을 먼저 받아주세요.';
      }
  }
}
