/** Aramanın başlaması için en az karakter sayısı (tek harf hemen her ülkeyle eşleşir). */
export const MIN_SEARCH_LENGTH = 2;
/** API `q` sınırı (OpenAPI: maxLength 100). */
export const MAX_SEARCH_LENGTH = 100;
/** Yazmayı bırakıp sorgu gönderene kadar beklenen süre. */
export const SEARCH_DEBOUNCE_MS = 300;

/**
 * Arama kutusu girdisini sorguya çevirir: kenar boşlukları kırpılır, iç boşluklar tek boşluğa iner,
 * 100 karaktere kesilir. Harf büyüklüğü ve Türkçe i/ı/İ/I eşlemesi API'de yapılır (aynı kalır).
 */
export function normalizeSearchQuery(input: string): string {
  return input.replace(/\s+/g, " ").trim().slice(0, MAX_SEARCH_LENGTH).trim();
}

/** Normalleştirilmiş sorgu yeterince uzun mu (API'ye gidilir mi)? */
export function isSearchable(normalized: string): boolean {
  return [...normalized].length >= MIN_SEARCH_LENGTH;
}
