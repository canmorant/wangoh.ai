/** Sayfalı yanıtların ortak biçimi (CountryPageDto, CityPageDto). */
export interface PageLike<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

/** Sonraki sayfa numarası; son sayfadaysa (ya da veri tutarsızsa) `undefined`. */
export function nextPageParam(last: Pick<PageLike<unknown>, "items" | "page" | "pageSize" | "total">): number | undefined {
  if (last.items.length === 0) return undefined;
  return last.page * last.pageSize < last.total ? last.page + 1 : undefined;
}

/**
 * Sayfaları tek listeye katlar. Sayfalar arasında kayma olursa (araya kayıt eklenmesi) aynı anahtar
 * iki kez gelebilir; ilk gelen korunur ki `keyExtractor` çakışmasın.
 */
export function flattenPages<T>(pages: readonly PageLike<T>[] | undefined, keyOf: (item: T) => string): T[] {
  if (!pages) return [];
  const seen = new Set<string>();
  const result: T[] = [];
  for (const page of pages) {
    for (const item of page.items) {
      const key = keyOf(item);
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(item);
    }
  }
  return result;
}

/** Süzgeçle eşleşen toplam kayıt sayısı (ilk sayfadan). */
export function totalOf(pages: readonly PageLike<unknown>[] | undefined): number | undefined {
  return pages?.[0]?.total;
}
