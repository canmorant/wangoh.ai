import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import { useUsersMeStats, type GameTypeStatsDto } from "@wangoh/api-client";

import { spacing } from "@/theme";
import { Button, Card, Divider, Icon, SectionHeader, SkeletonList, Text } from "@/ui";

import { formatAverage, formatInteger, formatLastPlayed, formatScore, gameTypeLabel } from "../format";
import { SectionError } from "./SectionError";
import { StatTile } from "./StatTile";

function GameTypeCard({ item }: { item: GameTypeStatsDto }) {
  const label = gameTypeLabel(item.gameType);
  const played = item.gamesPlayed > 0;
  return (
    <Card testID={`profile-stats-${item.gameType}`}>
      <Text variant="subheading" style={styles.cardTitle}>
        {label}
      </Text>
      {played ? (
        <>
          <View style={styles.grid}>
            <StatTile label="Oynanan oyun" value={formatInteger(item.gamesPlayed)} />
            <StatTile label="En iyi puan" value={formatScore(item.bestScore)} />
          </View>
          <View style={styles.grid}>
            <StatTile label="Ortalama puan" value={formatAverage(item.averageScore)} />
            <StatTile label="Toplam puan" value={formatInteger(item.totalScore)} />
          </View>
          <Divider style={styles.divider} />
          <Text variant="small" color="textSecondary">
            Son oynama: {formatLastPlayed(item.lastPlayedAt)}
          </Text>
        </>
      ) : (
        <Text variant="small" color="textSecondary">
          Henüz oynamadın.
        </Text>
      )}
    </Card>
  );
}

/** Oyun istatistikleri: tür başına oynama, en iyi, ortalama, toplam ve son oynama. */
export function StatsSection() {
  const stats = useUsersMeStats();

  let body;
  if (stats.isPending) {
    body = <SkeletonList count={2} itemHeight={110} label="İstatistikler yükleniyor" />;
  } else if (stats.isError) {
    body = (
      <SectionError
        error={stats.error}
        title="İstatistikler yüklenemedi"
        onRetry={() => void stats.refetch()}
        retrying={stats.isRefetching}
        testID="profile-stats-error"
      />
    );
  } else if (stats.data.gamesPlayed === 0) {
    body = (
      <Card style={styles.empty} testID="profile-stats-empty">
        <Icon name="game-controller-outline" size={32} color="gold" />
        <Text variant="bodyStrong" align="center">
          Henüz oyun oynamadın
        </Text>
        <Text variant="small" color="textSecondary" align="center">
          Oynadığın oyunların puanları ve istatistikleri burada görünür.
        </Text>
        <Button title="Oyunlara git" variant="secondary" onPress={() => router.push("/games")} testID="profile-go-games" />
      </Card>
    );
  } else {
    const data = stats.data;
    body = (
      <View style={styles.stack}>
        <Card testID="profile-stats-summary">
          <View style={styles.grid}>
            <StatTile label="Toplam oyun" value={formatInteger(data.gamesPlayed)} valueVariant="heading" minWidth={90} />
            <StatTile label="Toplam puan" value={formatInteger(data.totalScore)} valueVariant="heading" minWidth={90} />
            <StatTile label="Genel en iyi" value={formatInteger(data.overallBest)} valueVariant="heading" minWidth={90} />
          </View>
        </Card>
        {data.items.map((item) => (
          <GameTypeCard key={item.gameType} item={item} />
        ))}
      </View>
    );
  }

  return (
    <View testID="profile-stats">
      <SectionHeader title="Oyun istatistiklerim" />
      {body}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: spacing.md },
  cardTitle: { marginBottom: spacing.md },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginBottom: spacing.md },
  divider: { marginBottom: spacing.sm },
  empty: { alignItems: "center", gap: spacing.sm },
});
