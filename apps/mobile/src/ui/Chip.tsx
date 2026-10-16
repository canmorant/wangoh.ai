import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from "react-native";

import { colors, radius, spacing } from "@/theme";

import { Text } from "./Text";

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
}

/** Seçilebilir süzgeç (kıta, etiket). Görsel yükseklik 36 pt, `hitSlop` ile dokunma hedefi 44 pt. */
export function Chip({ label, selected = false, onPress, disabled = false, accessibilityHint, style }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={{ top: 4, bottom: 4, left: 2, right: 2 }}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.selected : styles.idle,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text variant="small" color={selected ? "gold" : "textSecondary"} style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 36,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  idle: { backgroundColor: colors.transparent, borderColor: colors.borderStrong },
  selected: { backgroundColor: colors.goldSoft, borderColor: colors.gold },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.45 },
  label: { fontWeight: "600" },
});
