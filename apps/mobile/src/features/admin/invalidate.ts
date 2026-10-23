import type { QueryClient } from "@tanstack/react-query";
import { getBlogGetPostQueryKey, getBlogListPostsQueryKey, getScoresListQueryKey, getUsersGetQueryKey, getUsersListQueryKey } from "@wangoh/api-client";

/** Kullanıcı listesi ve (verilirse) o kullanıcının ayrıntısı. Devre dışı durumu skor listesindeki rozeti de etkiler. */
export async function invalidateUsers(queryClient: QueryClient, id?: string): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: getUsersListQueryKey() }),
    id ? queryClient.invalidateQueries({ queryKey: getUsersGetQueryKey(id) }) : Promise.resolve(),
    queryClient.invalidateQueries({ queryKey: getScoresListQueryKey() }),
    invalidateLeaderboards(queryClient),
  ]);
}

/**
 * Tüm blog listeleri (herkese açık + yönetici, sayfalı sürümler dahil) ve verilen slug'ların ayrıntıları.
 * Slug değiştiyse eski ayrıntı önbellekten atılır (`removed`).
 */
export async function invalidatePosts(queryClient: QueryClient, slugs: readonly string[], removed: readonly string[] = []): Promise<void> {
  for (const slug of removed) queryClient.removeQueries({ queryKey: getBlogGetPostQueryKey(slug) });
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: getBlogListPostsQueryKey() }),
    ...slugs.map((slug) => queryClient.invalidateQueries({ queryKey: getBlogGetPostQueryKey(slug) })),
  ]);
}

export async function invalidateScores(queryClient: QueryClient): Promise<void> {
  await Promise.all([queryClient.invalidateQueries({ queryKey: getScoresListQueryKey() }), invalidateLeaderboards(queryClient)]);
}

/**
 * Puan silmek ya da kullanıcıyı devre dışı bırakmak liderliği değiştirir. Liderlik kancaları başka ekrandadır ve
 * anahtarları oyun türü/dönemle değişir; üretilen anahtarların ilk öğesi (`/v1/leaderboards/...`) ile eşleştirilir.
 */
function invalidateLeaderboards(queryClient: QueryClient): Promise<void> {
  return queryClient.invalidateQueries({
    predicate: (query) => typeof query.queryKey[0] === "string" && query.queryKey[0].startsWith("/v1/leaderboards"),
  });
}
