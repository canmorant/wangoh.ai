import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import { isNetworkError } from "@/api/errors";
import { AuthGate, useAuth } from "@/auth";
import { colors, radius, spacing } from "@/theme";
import { Badge, Button, Card, EmptyState, Header, LoadingView, Screen, Text } from "@/ui";

import { ProgressSteps } from "./components/ProgressSteps";
import { StatTile } from "./components/StatTile";
import { StatusView } from "./components/StatusView";
import { useGameResult } from "./hooks/useGameResult";
import { endCopy, gameErrorMessage } from "./model/gameErrors";
import { GAME_INFO, firstParam, formatDuration, formatNumber } from "./model/gameTypes";
import { activeSessionStore } from "./storage";
import { gamesRoutes, goBackOrHub } from "./routes";

/** Sonuç ekranı: `/games/results/[sessionId]`. Sayfa yenilenince de sonucu sunucudan yeniden kurar. */
export function ResultsScreen() {
  const params = useLocalSearchParams<{ sessionId?: string | string[] }>();
  const router = useRouter();
  const { status, user } = useAuth();
  const sessionId = firstParam(params.sessionId);
  const goHub = () => router.dismissTo(gamesRoutes.hub);

  if (!sessionId) {
    return (
      <Screen header={<Header title="Sonuç" back={() => goBackOrHub(router)} />}>
        <EmptyState icon="help-circle-outline" title="Sonuç bulunamadı" actionLabel="Oyun merkezi" onAction={goHub} />
      </Screen>
    );
  }

  if (status !== "signedIn" || !user) {
    return (
      <Screen header={<Header title="Sonuç" back={() => goBackOrHub(router)} />}>
        <AuthGate title="Sonucu görmek için giriş yap" message="Oyun sonuçların hesabına bağlıdır.">
          {null}
        </AuthGate>
      </Screen>
    );
  }

  return <ResultsBody sessionId={sessionId} userId={user.id} />;
}

function ResultsBody({ sessionId, userId }: { sessionId: string; userId: string }) {
  const router = useRouter();
  const view = useGameResult(sessionId);
  const goHub = () => router.dismissTo(gamesRoutes.hub);
  const readyGameType = view.kind === "ready" ? view.result.gameType : null;

  // Sonuç görününce yerel "devam eden oyun" kaydı kalmasın (Tekrar oyna yeni oyun başlatsın).
  useEffect(() => {
    if (readyGameType) void activeSessionStore.clearIfMatches(userId, readyGameType, sessionId);
  }, [readyGameType, userId, sessionId]);

  const header = <Header title="Oyun bitti" subtitle={readyGameType ? GAME_INFO[readyGameType].title : undefined} back={goHub} />;

  switch (view.kind) {
    case "loading":
      return (
        <Screen header={header}>
          <LoadingView message="Sonuç hazırlanıyor…" />
        </Screen>
      );
    case "error": {
      const offline = isNetworkError(view.error);
      return (
        <Screen header={header}>
          <StatusView
            icon={offline ? "cloud-offline-outline" : "alert-circle-outline"}
            tone="danger"
            title={offline ? "Bağlantı kurulamadı" : "Sonuç alınamadı"}
            message={gameErrorMessage(view.error)}
            primary={{ label: "Tekrar dene", onPress: view.retry }}
            secondary={{ label: "Oyun merkezi", onPress: goHub }}
          />
        </Screen>
      );
    }
    case "unfinished":
      return (
        <Screen header={header}>
          <StatusView
            icon="hourglass-outline"
            title="Oyun henüz bitmedi"
            message="Sonucu görmek için kalan turları cevapla."
            primary={{ label: "Devam et", onPress: () => router.replace(gamesRoutes.play(view.gameType)) }}
            secondary={{ label: "Oyun merkezi", onPress: goHub }}
          />
        </Screen>
      );
    case "ended": {
      const copy = endCopy(view.reason);
      return (
        <Screen header={header}>
          <StatusView icon="time-outline" title={copy.title} message={copy.message} primary={{ label: "Oyun merkezi", onPress: goHub }} />
        </Screen>
      );
    }
    case "ready": {
      const { result, outcomes } = view;
      return (
        <Screen header={header} contentContainerStyle={styles.content}>
          <View style={styles.hero} testID="result-hero">
            <Text variant="label" color="textSecondary">
              Toplam puan
            </Text>
            <Text style={styles.score} color="gold" allowFontScaling={false} testID="result-score">
              {formatNumber(result.score)}
            </Text>
            {result.isPersonalBest ? (
              <View testID="result-personal-best">
                <Badge label="Yeni kişisel rekor!" tone="gold" />
              </View>
            ) : (
              <Text variant="small" color="textSecondary" testID="result-best">
                Kişisel en iyin: {formatNumber(result.personalBest)}
              </Text>
            )}
          </View>

          <View style={styles.tiles}>
            <StatTile label="Doğru" value={`${result.correctCount} / ${result.roundsTotal}`} testID="result-correct" />
            <StatTile label="Sıralama" value={`#${formatNumber(result.rank)}`} hint="tüm zamanlar" testID="result-rank" />
            <StatTile label="Süre" value={formatDuration(result.durationMs)} testID="result-duration" />
          </View>

          {outcomes && outcomes.length > 0 ? (
            <Card style={styles.summary}>
              <Text variant="label" color="textSecondary">
                Tur özeti
              </Text>
              <ProgressSteps total={result.roundsTotal} history={outcomes} showLabel={false} testID="result-steps" />
            </Card>
          ) : null}

          <View style={styles.actions}>
            <Button title="Tekrar oyna" fullWidth onPress={() => router.replace(gamesRoutes.play(result.gameType))} testID="play-again" />
            <Button
              title="Liderlik tablosu"
              variant="secondary"
              fullWidth
              onPress={() => router.push(gamesRoutes.leaderboard(result.gameType))}
              testID="open-leaderboard"
            />
            <Button title="Merkeze dön" variant="ghost" fullWidth onPress={goHub} testID="back-to-hub" />
          </View>
        </Screen>
      );
    }
  }
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg, paddingBottom: spacing.xxl },
  hero: {
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gold,
    backgroundColor: colors.goldSoft,
  },
  // Büyük puan: sistem yazı tipi ölçeği düzeni bozmasın diye ölçeklenmez.
  score: { fontSize: 60, lineHeight: 68, fontWeight: "700", fontVariant: ["tabular-nums"] },
  tiles: { flexDirection: "row", gap: spacing.md },
  summary: { gap: spacing.md },
  actions: { gap: spacing.md },
});
