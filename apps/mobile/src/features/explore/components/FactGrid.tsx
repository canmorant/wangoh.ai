import { StyleSheet, View } from "react-native";

import { colors, radius, spacing } from "@/theme";
import { Text } from "@/ui";

import type { Fact } from "../lib/facts";

/** Hızlı bilgi kutuları: iki sütun; tek kalan son kutu tam genişliğe yayılır. */
export function FactGrid({ facts, label = "Hızlı bilgiler" }: { facts: readonly Fact[]; label?: string }) {
  if (facts.length === 0) return null;
  return (
    <View style={styles.grid} accessibilityLabel={label}>
      {facts.map((fact) => (
        <View key={fact.label} style={styles.tile} accessible accessibilityLabel={`${fact.label}: ${fact.value}`}>
          <Text variant="label" color="textMuted" numberOfLines={1}>
            {fact.label}
          </Text>
          <Text variant="bodyStrong" style={styles.value}>
            {fact.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  tile: {
    flexGrow: 1,
    flexBasis: "46%",
    minWidth: 140,
    padding: spacing.md,
    gap: spacing.xxs,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  value: { fontSize: 15, lineHeight: 21 },
});
