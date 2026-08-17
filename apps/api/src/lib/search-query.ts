/** 검색어 앞뒤·연속 공백 · 전각 문자 정리 */
export function normalizeSearchQuery(query: string): string {
  return query.normalize('NFKC').trim().replace(/\s+/g, ' ');
}

/** TMDB: 붙여 쓴 한글 제목 → 첫 음절 뒤 공백 시도 (예: 싱스트리트 → 싱 스트리트) */
export function searchQueryFallbacks(query: string): string[] {
  if (/\s/.test(query) || query.length < 3) return [];
  const out: string[] = [];
  out.push(`${query.slice(0, 1)} ${query.slice(1)}`);
  if (query.length >= 4) {
    out.push(`${query.slice(0, 2)} ${query.slice(2)}`);
  }
  return out;
}
