import type { Href } from "expo-router";

import type { LeaderboardTypeKey, PlayableGameType } from "./model/gameTypes";

/**
 * Oyunlar sekmesinin yolları. `typedRoutes` türleri yalnız geliştirme sunucusu çalışınca yenilenir;
 * yeni rotalar için derleme sırasında tip hatası çıkmasın diye `Href`e dönüştürülür.
 */
export const gamesRoutes = {
  hub: "/games" as Href,
  play: (gameType: PlayableGameType) => `/games/play/${gameType}` as Href,
  results: (sessionId: string) => `/games/results/${sessionId}` as Href,
  leaderboard: (type: LeaderboardTypeKey) => `/games/leaderboard/${type}` as Href,
} as const;

/** Başlıktaki geri düğmeleri için: yığında geri gider, yoksa (doğrudan açılış, sayfa yenileme) merkeze. */
export function goBackOrHub(router: { canGoBack(): boolean; back(): void; dismissTo(href: Href): void }): void {
  if (router.canGoBack()) router.back();
  else router.dismissTo(gamesRoutes.hub);
}
