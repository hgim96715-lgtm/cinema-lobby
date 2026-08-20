export const DEMO_SEED = {
  emailDomain: 'demo.cinemo.invalid',
  emailPrefix: 'demo',
  totalActivity: 5,
  newPerDay: 2,
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

export function disposableDemoSeedDir() {
  return `${process.cwd()}/../../disposable/demo-seed`;
}
