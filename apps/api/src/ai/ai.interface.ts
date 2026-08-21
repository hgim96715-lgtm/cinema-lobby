export interface IAiProvider {
  translateOverview(
    titleEn: string,
    overviewEn: string,
  ): Promise<string | null>;
  koreanTitle(titleEn: string, year: string): Promise<string | null>;
  koreanDirector(name: string): Promise<string | null>;
}

export const AI_PROVIDER = Symbol('AI_PROVIDER');
