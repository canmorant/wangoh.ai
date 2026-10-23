/** Sayfalı API yanıtları (`{ items, page, pageSize, total }`) için saf yardımcılar. */

export interface PageLike<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

/**
 * Sonraki sayfa numarası; son sayfaysa `undefined` (TanStack `getNextPageParam`). Boş sayfa da bitiş sayılır:
 * sunucu `total` değerini fazla bildirse bile sonsuz istek döngüsüne girilmez.
 */
export function nextPageNumber(last: Pick<PageLike<unknown>, "items" | "page" | "pageSize" | "total">): number | undefined {
  if (last.items.length === 0) return undefined;
  return last.page * last.pageSize < last.total ? last.page + 1 : undefined;
}

/** Sayfaları tek listede toplar; kayma yüzünden aynı kayıt iki sayfada gelirse yinelenenleri atar. */
export function flattenPages<T extends { id: string }>(pages: ReadonlyArray<PageLike<T>> | undefined): T[] {
  if (!pages) return [];
  const seen = new Set<string>();
  const result: T[] = [];
  for (const page of pages) {
    for (const item of page.items) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      result.push(item);
    }
  }
  return result;
}

/** Süzgeçli sorgudaki toplam kayıt: son yüklenen sayfanın bildirdiği değer. */
export function totalOf(pages: ReadonlyArray<PageLike<unknown>> | undefined): number {
  const last = pages?.[pages.length - 1];
  return last ? last.total : 0;
}
