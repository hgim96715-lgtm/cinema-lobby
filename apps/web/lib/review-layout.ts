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

/** 후기 id → 안정적인 u32 (같은 id면 같은 자리) */
function hashId(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** total과 서로소인 step — 슬롯을 사방으로 섞음 */
function scatterStep(total: number) {
  let step = Math.max(1, Math.floor(total * 0.6180339887));
  while (step > 1 && gcd(step, total) !== 1) step -= 1;
  return step || 1;
}

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/**
 * 유리(chamber) 안 사방으로 흩뿌림.
 * left/top 모두 % — 격자 칸을 높이까지 쓰고, id 해시로 지터·슬롯 섞기.
 */
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

  const n = Math.max(total, 1);
  const maxCols = size === 'sm' ? 6 : size === 'md' ? 5 : 4;
  const cols = Math.max(2, Math.min(maxCols, Math.ceil(Math.sqrt(n * 1.35))));
  const rows = Math.max(2, Math.ceil(n / cols));

  const slot = (index * scatterStep(n)) % n;
  const col = slot % cols;
  const row = Math.floor(slot / cols);

  // 볼 지름을 대략 %로 잡고 가장자리 클리핑 여유
  const ballPct = size === 'sm' ? 13 : size === 'md' ? 16 : 20;
  const padX = 3;
  const padY = 4;
  const usableW = Math.max(20, 100 - padX * 2 - ballPct);
  const usableH = Math.max(20, 100 - padY * 2 - ballPct);
  const cellW = usableW / cols;
  const cellH = usableH / rows;

  const stagger = row % 2 === 1 ? cellW * 0.32 : 0;
  const jitterX = ((h % 1000) / 1000 - 0.5) * cellW * 0.75;
  const jitterY = (((h >>> 10) % 1000) / 1000 - 0.5) * cellH * 0.75;

  const left = padX + col * cellW + cellW * 0.12 + stagger + jitterX;
  const top = padY + row * cellH + cellH * 0.12 + jitterY;
  const maxLeft = 100 - ballPct - padX;
  const maxTop = 100 - ballPct - padY;

  return {
    left: `${Math.min(Math.max(left, padX), maxLeft)}%`,
    top: `${Math.min(Math.max(top, padY), maxTop)}%`,
    hue,
    delay,
    rotate,
    scale,
    z,
  };
}
