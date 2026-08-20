export const DEMO_SEED = {
  emailDomain: "demo.cinemo.invalid",
  emailPrefix: "demo",
  /** 하루 총 활동(visit·뽑기·후기) 수 */
  totalActivity: 5,
  /** 그중 신규 register 수 */
  newPerDay: 2,
  /** 유저 간 간격 ms (전광판 4h 시리즈 분산용) */
  staggerMs: 800,
} as const;

export function demoEmail(dateKey: string, seq: number) {
  return `${DEMO_SEED.emailPrefix}+${dateKey}-${seq}@${DEMO_SEED.emailDomain}`;
}

export function isDemoEmail(email: string) {
  return (
    email.endsWith(`@${DEMO_SEED.emailDomain}`) &&
    email.startsWith(`${DEMO_SEED.emailPrefix}+`)
  );
}
