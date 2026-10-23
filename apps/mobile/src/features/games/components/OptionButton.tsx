import { Pressable, StyleSheet, View } from "react-native";

import { Icon, Text } from "@/ui";
import { colors, radius, spacing } from "@/theme";

import type { OptionVisual } from "../model/viewModel";

export interface OptionButtonProps {
  label: string;
  visual: OptionVisual;
  /** Kullanıcı bu seçeneği seçti mi (doğru olsa da olmasa da)? */
  chosen?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  testID?: string;
}

/** Ekran okuyucu: "<seçenek>, senin seçimin, yanlış" / "<seçenek>, doğru cevap". */
export function optionAccessibilityLabel(label: string, visual: OptionVisual, chosen: boolean): string {
  if (visual === "correct") return chosen ? `${label}, senin seçimin, doğru cevap` : `${label}, doğru cevap`;
  if (visual === "wrong") return `${label}, senin seçimin, yanlış`;
  if (visual === "pending") return `${label}, seçildi, gönderiliyor`;
  return label;
}

const palette: Record<OptionVisual, { background: string; border: string }> = {
  idle: { background: colors.surface, border: colors.borderStrong },
  pending: { background: colors.goldSoft, border: colors.gold },
  correct: { background: colors.successSoft, border: colors.success },
  wrong: { background: colors.dangerSoft, border: colors.danger },
  dimmed: { background: colors.surface, border: colors.border },
};

/** Büyük dokunma hedefli cevap seçeneği (en az 56 pt). Renk tek başına anlam taşımaz: doğru/yanlış simgeli. */
export function OptionButton({ label, visual, chosen = false, disabled = false, onPress, testID }: OptionButtonProps) {
  const colorsForVisual = palette[visual];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={optionAccessibilityLabel(label, visual, chosen)}
      accessibilityState={{ disabled, selected: chosen, busy: visual === "pending" }}
      disabled={disabled}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.option,
        { backgroundColor: pressed && !disabled ? colors.surfaceRaised : colorsForVisual.background, borderColor: colorsForVisual.border },
        visual === "dimmed" && styles.dimmed,
      ]}
    >
      <Text variant="bodyStrong" style={styles.label} numberOfLines={3} color={visual === "dimmed" ? "textMuted" : "text"}>
        {label}
      </Text>
      {visual === "correct" ? <Icon name="checkmark-circle" size={24} color="success" /> : null}
      {visual === "wrong" ? <Icon name="close-circle" size={24} color="danger" /> : null}
      {visual === "pending" ? <View style={styles.pendingDot} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  dimmed: { opacity: 0.6 },
  label: { flex: 1 },
  pendingDot: { width: 10, height: 10, borderRadius: radius.pill, backgroundColor: colors.gold },
});
