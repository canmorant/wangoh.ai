import { Pressable, StyleSheet } from "react-native";

import { colors, minTouchTarget, spacing, type ColorToken } from "@/theme";
import { Icon, Text, type IconName } from "@/ui";

export interface ActionRowProps {
  label: string;
  icon: IconName;
  onPress: () => void;
  /** `danger`: kırmızı metin ve simge (geri alınamaz eylemler). */
  tone?: "default" | "danger";
  /** Sağdaki ok yerine dış bağlantı simgesi (tarayıcıda açılır). */
  external?: boolean;
  accessibilityHint?: string;
  testID?: string;
}

/** Kart içinde ayarlar satırı: simge + etiket + ok. 44 pt dokunma hedefi. */
export function ActionRow({ label, icon, onPress, tone = "default", external = false, accessibilityHint, testID }: ActionRowProps) {
  const color: ColorToken = tone === "danger" ? "danger" : "text";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint ?? (external ? "Tarayıcıda açılır" : undefined)}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <Icon name={icon} size={22} color={tone === "danger" ? "danger" : "gold"} />
      <Text variant="bodyStrong" color={color} style={styles.label}>
        {label}
      </Text>
      <Icon name={external ? "open-outline" : "chevron-forward"} size={20} color="textMuted" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    minHeight: minTouchTarget + spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  pressed: { backgroundColor: colors.surfaceRaised },
  label: { flex: 1 },
});
