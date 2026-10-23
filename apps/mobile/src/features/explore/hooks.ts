import {
  contentListCountries,
  getContentListCountriesQueryKey,
  useContentGetCity,
  useContentGetContinent,
  useContentGetCountry,
  useContentListContinents,
  type ApiError,
  type ContentListCountriesParams,
  type CountryPageDto,
  type CountrySummaryDto,
} from "@wangoh/api-client";
import { keepPreviousData, useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import { flattenPages, nextPageParam, totalOf } from "./lib/pagination";
import type { ContinentSlug } from "./lib/routes";

/** Uygulama Türkçe çalışır; yanıttaki `lang`/`complete` alanları yok sayılır. */
const LANG = "tr" as const;

/** Ülke listelerinde sayfa boyutu: bir ekranı doldurur, ağ turu sayısı düşük kalır. */
export const COUNTRY_PAGE_SIZE = 20;
/** Ana ekrandaki yatay "öne çıkan ülkeler" şeridinin sayfa boyutu. */
export const FEATURED_PAGE_SIZE = 10;

export function useContinents() {
  return useContentListContinents({ lang: LANG });
}

export function useContinent(slug: ContinentSlug | null) {
  return useContentGetContinent(slug ?? "europe", { lang: LANG }, { query: { enabled: slug !== null } });
}

export function useCountry(code: string | null) {
  return useContentGetCountry(code ?? "", { lang: LANG }, { query: { enabled: code !== null } });
}

export function useCity(code: string | null, slug: string | null) {
  return useContentGetCity(code ?? "", slug ?? "", { lang: LANG }, { query: { enabled: code !== null && slug !== null } });
}

export interface CountryFilter {
  continent?: ContentListCountriesParams["continent"];
  hasTravel?: boolean;
  q?: string;
}

interface InfiniteCountriesOptions {
  enabled?: boolean;
  pageSize?: number;
  /** Sorgu (ör. arama metni) değişince yeni sonuç gelene kadar önceki sonucu göster. */
  keepPrevious?: boolean;
}

/**
 * Sayfalı (sonsuz) ülke listesi. Üretilen `contentListCountries` işlevi ve Orval'ın sorgu anahtarı
 * kullanılır; anahtara "sayfali" eklenir çünkü veri biçimi (`InfiniteData`) tekil sorgudan farklıdır.
 */
export function useInfiniteCountries(filter: CountryFilter, options: InfiniteCountriesOptions = {}) {
  const { enabled = true, pageSize = COUNTRY_PAGE_SIZE, keepPrevious = false } = options;
  const params: ContentListCountriesParams = { lang: LANG, pageSize };
  if (filter.continent) params.continent = filter.continent;
  if (filter.hasTravel !== undefined) params.hasTravel = filter.hasTravel;
  if (filter.q) params.q = filter.q;

  const query = useInfiniteQuery<CountryPageDto, ApiError, InfiniteData<CountryPageDto, number>, readonly unknown[], number>({
    queryKey: [...getContentListCountriesQueryKey(params), "sayfali"],
    queryFn: ({ pageParam, signal }) => contentListCountries({ ...params, page: pageParam }, { signal }),
    initialPageParam: 1,
    getNextPageParam: nextPageParam,
    enabled,
    ...(keepPrevious ? { placeholderData: keepPreviousData } : {}),
  });

  const items = useMemo(() => flattenPages(query.data?.pages, (country) => country.code), [query.data]);
  return { ...query, items, total: totalOf(query.data?.pages) };
}

/**
 * Tüm ülkeler (komşu ülke adlarını ISO3 koduyla eşlemek için). Liste ucunda ISO3 süzgeci yoktur;
 * sayfalar (100'er) arka planda tamamlanır ve 60 sn önbellekte kalır. `enabled` kapalıyken istek atılmaz.
 */
export function useCountryIndexByIso3(enabled: boolean) {
  const query = useInfiniteCountries({}, { enabled, pageSize: 100 });
  const { hasNextPage, isFetchingNextPage, fetchNextPage, isError } = query;

  useEffect(() => {
    if (enabled && hasNextPage && !isFetchingNextPage && !isError) void fetchNextPage();
  }, [enabled, hasNextPage, isFetchingNextPage, isError, fetchNextPage]);

  const byIso3 = useMemo(() => {
    const map = new Map<string, CountrySummaryDto>();
    for (const country of query.items) map.set(country.iso3, country);
    return map;
  }, [query.items]);

  return { byIso3, complete: !hasNextPage && !query.isPending, isError: query.isError };
}

/** Değer, `delay` ms boyunca değişmezse güncellenir (arama kutusu için). */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
