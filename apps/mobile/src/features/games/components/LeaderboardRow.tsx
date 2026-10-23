import type { LeaderboardEntryDto } from "@wangoh/api-client";
import { StyleSheet, View } from "react-native";

import { Badge, Text } from "@/ui";
import { colors, minTouchTarget, radius, spacing } from "@/theme";

import { entryLabel } from "../model/feedbackCopy";
import { formatNumber } from "../model/gameTypes";

export interface LeaderboardRowProps {
  entry: LeaderboardEntryDto;
}

/** Liderlik satırı: sıra, görünen ad (yalnız bu), puan. Kendi satırın altın vurgulu ve "Sen" rozetli. */
export function LeaderboardRow({ entry }: LeaderboardRowProps) {
  const podium = entry.rank <= 3;
  return (
    <View
      style={[styles.row, entry.isMe && styles.me]}
      accessible
      accessibilityLabel={entryLabel(entry)}
      testID={entry.isMe ? "leaderboard-row-me" : "leaderboard-row"}
    >
      <View style={[styles.rank, podium && styles.podium]}>
        <Text variant="bodyStrong" color={podium ? "gold" : "textSecondary"} style={styles.rankText}>
          {entry.rank}
        </Text>
      </View>
      <View style={styles.nameWrap}>
        <Text variant="bodyStrong" numberOfLines={1} style={styles.name}>
          {entry.displayName}
        </Text>
        {entry.isMe ? <Badge label="Sen" tone="gold" /> : null}
      </View>
      <Text variant="bodyStrong" color={entry.isMe ? "gold" : "text"} style={styles.score}>
        {formatNumber(entry.score)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    minHeight: minTouchTarget + spacing.md,
    // Vurgulu satırın çerçevesi sayfa kenar boşluğundan taşar; sıra dairesi çiplerle aynı hizada kalır.
    marginHorizontal: -spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.transparent,
  },
  me: { backgroundColor: colors.goldSoft, borderColor: colors.gold },
  rank: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceRaised,
  },
  podium: { backgroundColor: colors.goldSoft },
  rankText: { fontVariant: ["tabular-nums"] },
  nameWrap: { flex: 1, flexDirection: "row", alignItems: "center", gap: spacing.sm },
  // Uzun adlar "Sen" rozetini itmesin: ad daralır, rozet sabit kalır.
  name: { flexShrink: 1 },
  score: { minWidth: 56, textAlign: "right", fontVariant: ["tabular-nums"] },
});
