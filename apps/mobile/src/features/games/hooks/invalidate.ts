import type { QueryClient } from "@tanstack/react-query";
import {
  getGamesGetSessionQueryKey,
  getLeaderboardsGetQueryKey,
  getLeaderboardsMeQueryKey,
  getUsersMeStatsQueryKey,
} from "@wangoh/api-client";

import { LEADERBOARD_TYPES } from "../model/gameTypes";

/**
 * Oyun bitince puanla değişen sorguları tazeler: liderlik tabloları (tüm dönemler/limitler, kısmi anahtar
 * eşleşmesiyle), "benim sıram" ve kişisel istatistik. Orval anahtarları kullanılır (elle anahtar yok).
 */
export function invalidateAfterGame(queryClient: QueryClient): Promise<unknown> {
  const tasks: Promise<unknown>[] = [queryClient.invalidateQueries({ queryKey: getUsersMeStatsQueryKey() })];
  for (const type of LEADERBOARD_TYPES) {
    tasks.push(queryClient.invalidateQueries({ queryKey: getLeaderboardsGetQueryKey(type) }));
    tasks.push(queryClient.invalidateQueries({ queryKey: getLeaderboardsMeQueryKey(type) }));
  }
  return Promise.all(tasks);
}

/** Bir oturumun önbellekteki geri yükleme sonuçlarını atar (oturum durumu değişti). */
export function dropSessionQueries(queryClient: QueryClient, sessionId: string): void {
  queryClient.removeQueries({ queryKey: getGamesGetSessionQueryKey(sessionId) });
}
