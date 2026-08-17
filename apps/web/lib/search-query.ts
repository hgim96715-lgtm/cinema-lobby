export function normalizeSearchQuery(query: string): string {
  return query.normalize('NFKC').trim().replace(/\s+/g, ' ');
}
