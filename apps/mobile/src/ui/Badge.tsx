import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { colors, radius, spacing, type ColorToken } from "@/theme";

import { Text } from "./Text";

export type BadgeTone = "neutral" | "gold" | "success" | "danger";

export interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  style?: StyleProp<ViewStyle>;
}

const tones: Record<BadgeTone, { background: string; text: ColorToken }> = {
  neutral: { background: colors.surfaceRaised, text: "textSecondary" },
  gold: { background: colors.goldSoft, text: "gold" },
  success: { background: colors.successSoft, text: "success" },
  danger: { background: colors.dangerSoft, text: "danger" },
};

/** Durum ya da kısa etiket (ör. "Taslak", "Yönetici"). Dokunulmaz; seçilebilir olan Chip'tir. */
export function Badge({ label, tone = "neutral", style }: BadgeProps) {
  const palette = tones[tone];
  return (
    <View style={[styles.badge, { backgroundColor: palette.background }, style]} accessible accessibilityLabel={label}>
      <Text variant="caption" color={palette.text} style={styles.text} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  text: { fontWeight: "600" },
});
