import { StyleSheet, View } from "react-native";

import { Text } from "@/ui";
import { colors, radius, spacing } from "@/theme";

import { correctCountOf, type RoundOutcome } from "../model/playMachine";

export interface ProgressStepsProps {
  total: number;
  /** Cevaplanmış turlar (sunucu sonuçları). */
  history: readonly RoundOutcome[];
  /** Şu anki turun 0 tabanlı sırası; yoksa (sonuç ekranı) hiçbiri vurgulanmaz. */
  currentIndex?: number | null;
  /** Üstte "Tur 3 / 10" yazısı gösterilsin mi? */
  showLabel?: boolean;
  testID?: string;
}

function summary(history: readonly RoundOutcome[]): string {
  const correct = correctCountOf(history);
  const timedOut = history.filter((o) => o.timedOut).length;
  const wrong = history.length - correct - timedOut;
  const parts = [`${correct} doğru`];
  if (wrong > 0) parts.push(`${wrong} yanlış`);
  if (timedOut > 0) parts.push(`${timedOut} süre aşımı`);
  return parts.join(", ");
}

/** Tur şeridi: doğru yeşil, yanlış/süre aşımı kırmızı, şimdiki tur altın, kalanlar soluk. */
export function ProgressSteps({ total, history, currentIndex = null, showLabel = true, testID }: ProgressStepsProps) {
  const byIndex = new Map(history.map((outcome) => [outcome.index, outcome]));
  const label = currentIndex === null ? `${total} turluk oyun. ${summary(history)}` : `Tur ${currentIndex + 1} / ${total}. ${summary(history)}`;

  return (
    <View style={styles.wrap} accessible accessibilityLabel={label} testID={testID}>
      {showLabel && currentIndex !== null ? (
        <Text variant="label" color="textSecondary" style={styles.caption}>
          Tur {currentIndex + 1} / {total}
        </Text>
      ) : null}
      <View style={styles.row} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {Array.from({ length: total }, (_, index) => {
          const outcome = byIndex.get(index);
          const backgroundColor = outcome
            ? outcome.correct
              ? colors.success
              : colors.danger
            : index === currentIndex
              ? colors.gold
              : colors.borderStrong;
          return <View key={index} style={[styles.step, { backgroundColor }]} />;
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  caption: { textTransform: "uppercase" },
  row: { flexDirection: "row", gap: spacing.xs },
  step: { flex: 1, height: 6, borderRadius: radius.pill },
});
