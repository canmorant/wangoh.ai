import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { colors, minTouchTarget, spacing } from "@/theme";

import { Icon } from "./Icon";
import { Text } from "./Text";

export interface ListRowProps {
  title: string;
  subtitle?: string;
  /** Sol taraf: bayrak, küçük görsel, simge. */
  leading?: ReactNode;
  /** Sağ taraf: rozet, değer. Verilmezse dokunulabilir satırda ">" çıkar. */
  trailing?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  /** Varsayılan: başlık ve alt başlık. */
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export function ListRow({
  title,
  subtitle,
  leading,
  trailing,
  onPress,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
}: ListRowProps) {
  const content = (
    <>
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <View style={styles.texts}>
        <Text variant="bodyStrong" numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="small" color="textSecondary" numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing ?? (onPress ? <Icon name="chevron-forward" size={20} color="textMuted" /> : null)}
    </>
  );

  if (!onPress) {
    return (
      <View style={styles.row} accessible accessibilityLabel={accessibilityLabel ?? (subtitle ? `${title}. ${subtitle}` : title)}>
        {content}
      </View>
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (subtitle ? `${title}. ${subtitle}` : title)}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed, disabled && styles.disabled]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: minTouchTarget + spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  pressed: { backgroundColor: colors.surfaceRaised },
  disabled: { opacity: 0.45 },
  leading: { alignItems: "center", justifyContent: "center" },
  texts: { flex: 1, gap: spacing.xxs },
});
