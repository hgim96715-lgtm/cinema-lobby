export type ReviewBallSize = 'sm' | 'md' | 'lg';

export type ReviewCapsuleLayout = {
  left: string;
  top: string;
  hue: string;
  delay: string;
  rotate: string;
  scale: string;
  z: number;
};

// 후기 id 문자열을 숫자 하나로 변환하는 함수
function hashId(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function capsuleLayout(
  id: string,
  index: number,
  total: number,
  size: ReviewBallSize,
): ReviewCapsuleLayout {
  const h = hashId(id);
  const hue = String(12 + (h % 300));
  const delay = `${(h % 2600) / 1000}s`;
  const rotate = `${((h % 11) - 5) * 0.55}deg`;
  const scale = `${0.94 + ((h >>> 8) % 12) / 100}`;
  const z = 1 + (h % 5);

  if (total <= 3) {
    const cluster = [
      { left: 36, top: 3.4 },
      { left: 16, top: 5.6 },
      { left: 54, top: 5.2 },
    ];
    const spot = cluster[index] ?? cluster[0]!;
    const jitterX = ((h % 1000) / 1000) * 4 - 2;
    const jitterY = (((h >>> 10) % 1000) / 1000) * 0.7 - 0.2;
    return {
      left: `${spot.left + jitterX}%`,
      top: `${spot.top + jitterY}rem`,
      hue,
      delay,
      rotate,
      scale,
      z,
    };
  }

  const cols = size === 'sm' ? 7 : size === 'md' ? 6 : 5;
  const pitch = size === 'sm' ? 2.35 : size === 'md' ? 2.85 : 3.65;
  const col = index % cols;
  const row = Math.floor(index / cols);
  const stagger = row % 2 === 1 ? 42 / cols : 0;
  const jitterX = ((h % 1000) / 1000) * 5.5 - 2.75;
  const jitterY = (((h >>> 10) % 1000) / 1000) * 0.7 - 0.2;
  const left = (col / cols) * 80 + 4 + stagger + jitterX;
  const top = row * pitch + 0.4 + jitterY;

  return {
    left: `${Math.min(Math.max(left, 0.5), 84)}%`,
    top: `${Math.max(top, 0.15)}rem`,
    hue,
    delay,
    rotate,
    scale,
    z,
  };
}
