import { StyleSheet, View } from "react-native";

import { Text } from "@/ui";
import { colors, radius, spacing } from "@/theme";

export interface StatTileProps {
  label: string;
  value: string;
  /** Küçük açıklama (ör. "tüm zamanlar"). */
  hint?: string;
  testID?: string;
}

/** Sonuç ekranındaki küçük değer kutusu. Ekran okuyucuya "Doğru: 7 / 10" diye okunur. */
export function StatTile({ label, value, hint, testID }: StatTileProps) {
  return (
    <View style={styles.tile} accessible accessibilityLabel={`${label}: ${value}${hint ? `, ${hint}` : ""}`} testID={testID}>
      <Text variant="caption" color="textSecondary" align="center" numberOfLines={1}>
        {label}
      </Text>
      <Text variant="heading" align="center" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7} testID={testID ? `${testID}-value` : undefined}>
        {value}
      </Text>
      {hint ? (
        <Text variant="caption" color="textMuted" align="center" numberOfLines={1}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
});
