export function reviewPanelHint(postedToday: boolean) {
  if (postedToday) return '오늘은 이미 넣었어요 · 볼을 구경해 보세요';
  return '후기를 남겨 볼까요?';
}
