/** Etiket süzgeci için saf yardımcılar. */

interface Taggable {
  tags: readonly string[];
}

/**
 * Yazıların etiketlerini görülme sayısına göre (çoktan aza, eşitlikte alfabetik) sıralar. `limit` kadarını verir;
 * `keep` verilen etiket (seçili olan) sınır dışında kalsa da başa eklenir.
 */
export function collectTags(posts: readonly Taggable[], limit = 12, keep?: string | null): string[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of new Set(post.tags)) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "tr")).map(([tag]) => tag);
  const top = sorted.slice(0, limit);
  if (keep && !top.includes(keep)) top.unshift(keep);
  return top;
}
