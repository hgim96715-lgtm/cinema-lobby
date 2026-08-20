/**
 * Admin Override 드롭다운용 watch provider 카탈로그.
 * TMDB logo_path 또는 로컬 `/ott/*.png`.
 *
 * Apple TV (2) / Apple TV+ (350), Amazon Video (10) / Prime (119):
 * 둘 다 있으면 구독 쪽 하나 · 하나만 있으면 그 아이콘 (API collapseDisplayProviders).
 */

export const WATCH_PROVIDERS = [
  {
    providerId: 8,
    providerName: 'Netflix',
    logoPath: '/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg',
  },
  {
    providerId: 350,
    providerName: 'Apple TV+',
    logoPath: '/mcbz1LgtErU9p4UdbZ0rG6RTWHX.jpg',
  },
  {
    providerId: 2,
    providerName: 'Apple TV',
    logoPath: '/peURlLlr8jggOwK53fJ5wdQl05y.jpg',
  },
  {
    providerId: 337,
    providerName: 'Disney Plus',
    logoPath: '/97yvRBw1GzX7fXprcF80er19ot.jpg',
  },
  {
    providerId: 119,
    providerName: 'Amazon Prime Video',
    logoPath: '/emthp39XA2YScoYL1p0sdbAH2WA.jpg',
  },
  {
    providerId: 10,
    providerName: 'Amazon Video',
    logoPath: '/5NyLm42TmCqCMOZFvH4fcoSNKEW.jpg',
  },
  {
    providerId: 3,
    providerName: 'Google Play Movies',
    logoPath: '/tbEdFQDwx5LEVr8WpSeXQSIirVq.jpg',
  },
  {
    providerId: 356,
    providerName: 'Wavve',
    logoPath: '/2ioan5BX5L9tz4fIGU93blTeFhv.jpg',
  },
  {
    providerId: 1883,
    providerName: 'TVING',
    logoPath: '/qHThQdkJuROK0k5QTCrknaNukWe.jpg',
  },
  {
    providerId: 97,
    providerName: 'Watcha',
    logoPath: '/5gmEivxOGPdq4Afpq1f8ktLtEW1.jpg',
  },
  {
    providerId: 68,
    providerName: 'Microsoft Store',
    logoPath: '/shq88b09gTBYC4hA7K7MUL8Q4zP.jpg',
  },
  {
    providerId: 192,
    providerName: 'YouTube',
    logoPath: '/oIkQkEkwfmcG7IGpRR1NB8frZZM.jpg',
  },
  {
    /** TMDB watch provider 없음 · Cinemo 로컬 id */
    providerId: 9001,
    providerName: 'Coupang Play',
    logoPath: '/ott/coupang-play.svg',
  },
] as const;

export type WatchProviderCatalogItem = (typeof WATCH_PROVIDERS)[number];

export function providerLogoUrl(logoPath: string) {
  if (logoPath.startsWith('/ott/')) return logoPath;
  return `https://image.tmdb.org/t/p/w92${logoPath}`;
}
