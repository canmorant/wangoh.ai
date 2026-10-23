import { StyleSheet, View } from "react-native";

import { spacing } from "@/theme";
import { Text, type TextProps } from "@/ui";

export interface StatTileProps {
  label: string;
  value: string;
  valueVariant?: TextProps["variant"];
  /** Dar satırda yan yana sığması için en küçük genişlik; sığmazsa alt satıra kayar. */
  minWidth?: number;
  testID?: string;
}

/** Etiket + değer çifti; ekran okuyucu "etiket: değer" olarak okur. */
export function StatTile({ label, value, valueVariant = "subheading", minWidth = 120, testID }: StatTileProps) {
  return (
    <View style={[styles.tile, { minWidth }]} accessible accessibilityLabel={`${label}: ${value}`} testID={testID}>
      <Text variant="caption" color="textSecondary" numberOfLines={2}>
        {label}
      </Text>
      <Text variant={valueVariant} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, gap: spacing.xxs },
});
