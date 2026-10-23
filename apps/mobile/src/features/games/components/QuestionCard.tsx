import type { GameQuestionDto } from "@wangoh/api-client";
import { StyleSheet, View } from "react-native";

import { RemoteImage, Text } from "@/ui";
import { colors, radius, spacing } from "@/theme";

import type { PlayableGameType } from "../model/gameTypes";

export interface QuestionCardProps {
  gameType: PlayableGameType;
  question: GameQuestionDto;
}

const PROMPTS: Record<PlayableGameType, string> = {
  "flag-quiz": "Bu bayrak hangi ülkeye ait?",
  "capital-quiz": "Bu ülkenin başkenti neresi?",
  "map-guess": "Haritada bu ülkeyi işaretle",
};

/**
 * Soru kartı. Bayrak için önce API'nin verdiği emoji gösterilir (ağ beklemez; süre sunucuda işlerken
 * görsel yüklemesi oyuncunun süresinden yemesin), emoji yoksa `flagUrl` görseli kullanılır.
 * Ülke adı ve bayrak API'den gelir; burada içerik verisi tutulmaz.
 */
export function QuestionCard({ gameType, question }: QuestionCardProps) {
  const prompt = PROMPTS[gameType];

  if (gameType === "flag-quiz") {
    return (
      <View style={styles.card} testID="question-card">
        <Text variant="label" color="textSecondary" align="center">
          {prompt}
        </Text>
        {question.flag ? (
          <Text
            style={styles.emoji}
            allowFontScaling={false}
            accessibilityRole="image"
            testID="question-flag"
          >
            {question.flag}
          </Text>
        ) : question.flagUrl ? (
          <RemoteImage uri={question.flagUrl} alt="Bayrak" width={192} aspectRatio={3 / 2} contentFit="contain" />
        ) : (
          <Text variant="body" color="textSecondary" align="center">
            Bayrak yüklenemedi
          </Text>
        )}
      </View>
    );
  }

  const compact = gameType === "map-guess";
  return (
    <View style={[styles.card, compact && styles.compact]} testID="question-card">
      <Text variant="label" color="textSecondary" align="center">
        {prompt}
      </Text>
      <Text variant={compact ? "title" : "display"} align="center" testID="question-country">
        {question.countryName ?? "—"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  compact: { paddingVertical: spacing.md, gap: spacing.xs },
  // Emoji satır yüksekliği yazı boyutundan küçük olursa Android'de kırpılır.
  emoji: { fontSize: 76, lineHeight: 92, textAlign: "center" },
});
