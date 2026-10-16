import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { colors, minTouchTarget, radius, spacing } from "@/theme";

import { Text } from "./Text";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  /** `sm` de en az 44 pt yüksekliktedir. */
  size?: "md" | "sm";
  /** Yükleniyor: dokunma kapanır, etiket yerine dönen gösterge çıkar, ekran okuyucu "meşgul" der. */
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  /** Başlığın solunda gösterilecek simge (Icon). */
  icon?: ReactNode;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

interface Palette {
  background: string;
  pressedBackground: string;
  border: string;
  text: string;
}

const palettes: Record<ButtonVariant, Palette> = {
  primary: { background: colors.gold, pressedBackground: colors.goldPressed, border: colors.gold, text: colors.onGold },
  secondary: {
    background: colors.transparent,
    pressedBackground: colors.surfaceRaised,
    border: colors.borderStrong,
    text: colors.text,
  },
  danger: {
    background: colors.dangerSolid,
    pressedBackground: "#9a2c24",
    border: colors.dangerSolid,
    text: colors.onDangerSolid,
  },
  ghost: { background: colors.transparent, pressedBackground: colors.surfaceRaised, border: colors.transparent, text: colors.gold },
};

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  accessibilityLabel,
  accessibilityHint,
  style,
  testID,
}: ButtonProps) {
  const palette = palettes[variant];
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        size === "md" ? styles.md : styles.sm,
        {
          backgroundColor: pressed ? palette.pressedBackground : palette.background,
          borderColor: palette.border,
          opacity: disabled ? 0.45 : 1,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.text} />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text variant="button" style={{ color: palette.text }} numberOfLines={1}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.xl,
  },
  md: { minHeight: 52 },
  sm: { minHeight: minTouchTarget, paddingHorizontal: spacing.lg },
  fullWidth: { alignSelf: "stretch" },
  content: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
});
