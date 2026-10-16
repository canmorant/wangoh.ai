import { Pressable, StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";

import { colors, radius, spacing } from "@/theme";

export interface CardProps extends ViewProps {
  /** İç boşluk (varsayılan açık). Görselin kenardan kenara gideceği kartlarda kapatılır. */
  padded?: boolean;
  /** Verilirse kart dokunulabilir olur; `accessibilityLabel` verilmesi önerilir. */
  onPress?: () => void;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
}

export function Card({ padded = true, onPress, accessibilityLabel, accessibilityHint, style, children, ...rest }: CardProps) {
  const base = [styles.card, padded && styles.padded, style];

  if (!onPress) {
    return (
      <View style={base} accessibilityLabel={accessibilityLabel} {...rest}>
        {children}
      </View>
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      style={({ pressed }) => [base, pressed && styles.pressed]}
      testID={rest.testID}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: "hidden",
  },
  padded: { padding: spacing.lg },
  pressed: { backgroundColor: colors.surfaceRaised },
});
