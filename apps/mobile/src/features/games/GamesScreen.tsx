import { useFocusEffect, useRouter } from "expo-router";
import { getUsersMeStatsQueryKey, useUsersMeStats } from "@wangoh/api-client";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";

import { AuthGate, useAuth } from "@/auth";
import { Card, Divider, Header, Icon, ListRow, Screen, SectionHeader, Text, type IconName } from "@/ui";
import { colors, radius, spacing } from "@/theme";

import { ConfirmDialog } from "./components/ConfirmDialog";
import { GameCard } from "./components/GameCard";
import { useResumableSession, type ResumableSession } from "./hooks/useResumableSession";
import {
  GAME_INFO,
  LEADERBOARD_TYPES,
  LEADERBOARD_TYPE_TITLES,
  PLAYABLE_GAME_TYPES,
  formatNumber,
  type LeaderboardTypeKey,
  type PlayableGameType,
} from "./model/gameTypes";
import { gamesRoutes } from "./routes";

const LEADERBOARD_ICONS: Record<LeaderboardTypeKey, IconName> = {
  overall: "trophy",
  "flag-quiz": "flag",
  "capital-quiz": "business",
  "map-guess": "map",
};

/**
 * Oyun merkezi. Oyunlar giriş ister (AuthGate); liderlik tabloları herkese açıktır.
 * Devam eden oturum varsa kart "Devam et" gösterir (yerel kayıt `GET /v1/games/sessions/:id` ile doğrulanır).
 */
export function GamesScreen() {
  const router = useRouter();
  const { status, user } = useAuth();
  const signedIn = status === "signedIn" && user !== null;
  const userId = signedIn ? user.id : null;

  // Kullanıcıya özel anahtar: hesap değişince başkasının istatistiği gösterilmez (Orval anahtarı önek olarak korunur).
  const stats = useUsersMeStats({ query: { enabled: signedIn, staleTime: 0, queryKey: [...getUsersMeStatsQueryKey(), userId ?? "anon"] } });
  const { refetch: refetchStats } = stats;

  const resumables: Record<PlayableGameType, ResumableSession> = {
    "flag-quiz": useResumableSession(userId, "flag-quiz"),
    "capital-quiz": useResumableSession(userId, "capital-quiz"),
    "map-guess": useResumableSession(userId, "map-guess"),
  };

  // Oyundan dönünce istatistikler (en iyi puan) tazelenir.
  useFocusEffect(
    useCallback(() => {
      if (signedIn) void refetchStats();
    }, [signedIn, refetchStats]),
  );

  const [confirmNew, setConfirmNew] = useState<PlayableGameType | null>(null);

  const refresh = async () => {
    await Promise.all([refetchStats(), ...PLAYABLE_GAME_TYPES.map((type) => resumables[type].refresh())]);
  };

  const play = (type: PlayableGameType) => {
    const resumable = resumables[type];
    if (resumable.status === "resumable" || resumable.status === "unverified") setConfirmNew(type);
    else router.push(gamesRoutes.play(type));
  };

  const confirmNewGame = async () => {
    const type = confirmNew;
    setConfirmNew(null);
    if (!type) return;
    await resumables[type].discard();
    router.push(gamesRoutes.play(type));
  };

  const statsState = stats.isPending && signedIn ? "loading" : stats.isError ? "error" : "ready";
  const overall = stats.data;

  return (
    <Screen
      header={<Header title="Oyunlar" subtitle="Bayrak, başkent ve harita oyunları" />}
      onRefresh={signedIn ? refresh : undefined}
      contentContainerStyle={styles.content}
    >
      <AuthGate
        title="Oyunlar için giriş yap"
        message="Puanların hesabına bağlı tutulur. Oynamak için önce giriş yapmalısın; liderlik tablolarına girişsiz de bakabilirsin."
      >
        <View style={styles.cards}>
          {PLAYABLE_GAME_TYPES.map((type) => {
            const item = stats.data?.items.find((entry) => entry.gameType === type);
            const resumable = resumables[type];
            const hasGame = resumable.status === "resumable" || resumable.status === "unverified";
            return (
              <GameCard
                key={type}
                gameType={type}
                statsState={statsState}
                bestScore={item?.bestScore ?? null}
                gamesPlayed={item?.gamesPlayed ?? 0}
                resume={hasGame ? { roundNumber: resumable.roundNumber, roundsTotal: resumable.roundsTotal } : null}
                onPlay={() => play(type)}
                onResume={() => router.push(gamesRoutes.play(type))}
              />
            );
          })}
        </View>
      </AuthGate>

      <SectionHeader title="Liderlik tabloları" />
      <Card padded={false}>
        <View style={styles.rows}>
          {LEADERBOARD_TYPES.map((type, index) => (
            <View key={type}>
              {index > 0 ? <Divider /> : null}
              <ListRow
                title={LEADERBOARD_TYPE_TITLES[type]}
                subtitle={leaderboardSubtitle(type, signedIn && overall && overall.gamesPlayed > 0 ? overall.overallBest : null)}
                leading={
                  <View style={styles.rowIcon}>
                    <Icon name={LEADERBOARD_ICONS[type]} size={22} color="gold" />
                  </View>
                }
                onPress={() => router.push(gamesRoutes.leaderboard(type))}
                accessibilityHint="Liderlik tablosunu açar"
              />
            </View>
          ))}
        </View>
      </Card>
      <Text variant="caption" color="textMuted" style={styles.footnote}>
        Listelerde yalnız görünen ad yer alır.
      </Text>

      <ConfirmDialog
        visible={confirmNew !== null}
        title="Yeni oyun başlatılsın mı?"
        message={`Devam eden ${confirmNew ? GAME_INFO[confirmNew].title : "oyun"} terk edilir ve puanı kaydedilmez.`}
        confirmLabel="Yeni oyun"
        cancelLabel="Vazgeç"
        onConfirm={() => void confirmNewGame()}
        onCancel={() => setConfirmNew(null)}
        testID="confirm-new-game"
      />
    </Screen>
  );
}

function leaderboardSubtitle(type: LeaderboardTypeKey, overallBest: number | null): string {
  if (type === "overall") return overallBest !== null ? `Toplam en iyin: ${formatNumber(overallBest)}` : "Üç oyunun en iyi puanlarının toplamı";
  return `${GAME_INFO[type].title} sıralaması`;
}

const styles = StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.xxl },
  cards: { gap: spacing.lg },
  rows: { paddingHorizontal: spacing.lg },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.goldSoft,
  },
  footnote: { textAlign: "center" },
});
