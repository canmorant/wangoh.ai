import { keepPreviousData, useInfiniteQuery, type InfiniteData, type QueryKey } from "@tanstack/react-query";
import type { ApiError } from "@wangoh/api-client";
import { useMemo } from "react";

import { flattenPages, nextPageNumber, totalOf, type PageLike } from "./pagination";

export interface PagedQueryOptions<T> {
  /** Orval'ın ürettiği sorgu anahtarı (`getBlogListPostsQueryKey(params)` vb.); sayfalı sürümü ayırmak için sonuna ek yapılır. */
  queryKey: QueryKey;
  /** Üretilmiş istek işlevi: `(page, signal) => blogListPosts({ ...params, page }, { signal })`. */
  fetchPage: (page: number, signal: AbortSignal) => Promise<PageLike<T>>;
  enabled?: boolean;
  /** Süzgeç değişince yeni sonuç gelene kadar önceki listeyi gösterir (yanıp sönmeyi önler). */
  keepPrevious?: boolean;
  /** `0`: ekrana her girişte yeniden çek (yönetim listeleri her zaman güncel olmalı). Varsayılan: uygulamanın genel süresi. */
  staleTime?: number;
}

/**
 * Sonsuz kaydırma için sayfalı sorgu. Orval yalnız tek sayfalık kancalar ürettiğinden TanStack `useInfiniteQuery`
 * üretilmiş istek işleviyle birleştirilir; anahtar, üretilen anahtarın devamıdır (`...anahtar, "infinite"`), bu yüzden
 * `invalidateQueries({ queryKey: getXxxQueryKey() })` sayfalı sorguları da tazeler.
 */
export function usePagedQuery<T extends { id: string }>({ queryKey, fetchPage, enabled = true, keepPrevious = false, staleTime }: PagedQueryOptions<T>) {
  const query = useInfiniteQuery<PageLike<T>, ApiError, InfiniteData<PageLike<T>, number>, QueryKey, number>({
    queryKey: [...queryKey, "infinite"],
    queryFn: ({ pageParam, signal }) => fetchPage(pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: nextPageNumber,
    enabled,
    staleTime,
    placeholderData: keepPrevious ? keepPreviousData : undefined,
  });

  const pages = query.data?.pages;
  const items = useMemo(() => flattenPages(pages), [pages]);
  const total = useMemo(() => totalOf(pages), [pages]);

  return {
    items,
    total,
    error: query.error,
    isPending: query.isPending,
    isError: query.isError,
    isFetching: query.isFetching,
    isFetchingNextPage: query.isFetchingNextPage,
    isPlaceholderData: query.isPlaceholderData,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    /** Dönen söz bitince yenileme tamamdır (çek-yenile için). */
    refetch: async () => {
      await query.refetch();
    },
    /** Sayfalama hatası: ilk sayfalar yüklendi ama sonraki sayfa başarısız. */
    isNextPageError: query.isFetchNextPageError,
  };
}

/** `usePagedQuery` sonucu (liste bileşenlerine geçirmek için). */
export type PagedQueryResult<T extends { id: string }> = ReturnType<typeof usePagedQuery<T>>;
