import type { Href } from "expo-router";

/**
 * Keşfet rotaları. Adresler `app/(tabs)/(explore)` dosya yapısıyla birebir aynıdır; başka sekmeler
 * ülkeye `/country/XX` yoluyla gelir, bu biçim bozulmamalı.
 *
 * `Href` dönüşü: tipli rota listesi (`.expo/types`) `expo start`/`export` sırasında üretilir ve yeni
 * rotaları geç görebilir; dinamik parçalı dizgiler bu yüzden tek yerde, burada tiplenir.
 */

export const CONTINENT_SLUGS = ["europe", "asia", "americas", "africa", "oceania"] as const;
export type ContinentSlug = (typeof CONTINENT_SLUGS)[number];

/** Kıta adresi parçası: yalnız API'nin bildiği beş slug; başkası `null`. */
export function parseContinentSlug(value: string | string[] | undefined): ContinentSlug | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;
  const slug = raw.trim().toLowerCase();
  return (CONTINENT_SLUGS as readonly string[]).includes(slug) ? (slug as ContinentSlug) : null;
}

/** İki harfli ülke kodu (ISO 3166-1 alpha-2); büyük harfe çevrilir, biçim bozuksa `null`. */
export function parseCountryCode(value: string | string[] | undefined): string | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;
  const code = raw.trim();
  return /^[A-Za-z]{2}$/.test(code) ? code.toUpperCase() : null;
}

/** Şehir adresi parçası (web slug'ı: küçük harf, rakam, tire); biçim bozuksa `null`. */
export function parseCitySlug(value: string | string[] | undefined): string | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;
  const slug = raw.trim().toLowerCase();
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 80 ? slug : null;
}

export const continentPath = (slug: ContinentSlug): string => `/continent/${slug}`;
export const countryPath = (code: string): string => `/country/${code.toUpperCase()}`;
export const cityPath = (code: string, slug: string): string => `${countryPath(code)}/city/${slug}`;
export const searchPath = (query?: string): string => {
  const q = query?.trim();
  return q ? `/search?q=${encodeURIComponent(q)}` : "/search";
};

export const continentHref = (slug: ContinentSlug): Href => continentPath(slug) as Href;
export const countryHref = (code: string): Href => countryPath(code) as Href;
export const cityHref = (code: string, slug: string): Href => cityPath(code, slug) as Href;
export const searchHref = (query?: string): Href => searchPath(query) as Href;
