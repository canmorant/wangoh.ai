import { StyleSheet, View } from "react-native";

import { Icon, Text } from "@/ui";
import { colors, radius, spacing } from "@/theme";

import type { RankSummary } from "../model/feedbackCopy";

export interface MyRankCardProps {
  summary: RankSummary;
}

/** "Kendi sıram" kartı: giriş yapmış kullanıcıya, seçili tür ve dönem için sırası ve en iyi puanı. */
export function MyRankCard({ summary }: MyRankCardProps) {
  return (
    <View
      style={[styles.card, summary.ranked && styles.ranked]}
      accessible
      accessibilityLabel={`Sıram. ${summary.headline}. ${summary.detail}`}
      testID="my-rank-card"
    >
      <View style={styles.icon}>
        <Icon name={summary.ranked ? "trophy" : "trophy-outline"} size={24} color="gold" />
      </View>
      <View style={styles.texts}>
        <Text variant="label" color="textSecondary">
          Sıram
        </Text>
        <Text variant="subheading" testID="my-rank-headline">
          {summary.headline}
        </Text>
        <Text variant="small" color="textSecondary">
          {summary.detail}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  ranked: { borderColor: colors.gold, backgroundColor: colors.goldSoft },
  icon: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceRaised,
  },
  texts: { flex: 1, gap: spacing.xxs },
});
