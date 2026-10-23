import { Pressable, StyleSheet, View } from "react-native";

import { colors, minTouchTarget, radius, spacing } from "@/theme";
import { Text } from "@/ui";

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string> {
  options: ReadonlyArray<SegmentOption<T>>;
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel: string;
}

/** Üst düzey bölüm seçici (Kullanıcılar / Yazılar / Skorlar). Ekran okuyucuya sekme grubu olarak bildirilir. */
export function SegmentedControl<T extends string>({ options, value, onChange, accessibilityLabel }: SegmentedControlProps<T>) {
  return (
    <View role="tablist" accessibilityLabel={accessibilityLabel} style={styles.track}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            role="tab"
            accessibilityRole="tab"
            accessibilityLabel={option.label}
            accessibilityState={{ selected }}
            aria-selected={selected}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [styles.segment, selected && styles.selected, pressed && !selected && styles.pressed]}
          >
            <Text variant="bodyStrong" color={selected ? "onGold" : "textSecondary"} numberOfLines={1}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    padding: spacing.xs,
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  segment: {
    flex: 1,
    minHeight: minTouchTarget,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
  },
  selected: { backgroundColor: colors.gold },
  pressed: { backgroundColor: colors.surfaceRaised },
});
