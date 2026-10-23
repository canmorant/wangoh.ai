import type { ReactNode } from "react";
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { colors, minTouchTarget, radius, spacing } from "@/theme";
import { Icon, Text } from "@/ui";

export interface AccordionProps {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  /** `card`: kenarlıklı kart (bölümler). `plain`: ince çizgili satır (SSS gibi iç içe liste). */
  variant?: "card" | "plain";
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** Açılır/kapanır bölüm. İçerik yalnız açıkken çizilir: uzun rehberlerde kapalı bölümler maliyet çıkarmaz. */
export function Accordion({ title, open, onToggle, children, variant = "card", style, testID }: AccordionProps) {
  return (
    <View style={[variant === "card" ? styles.card : styles.plain, style]} testID={testID}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityHint={open ? "Kapatmak için dokun" : "Açmak için dokun"}
        accessibilityState={{ expanded: open }}
        onPress={onToggle}
        style={({ pressed }) => [styles.header, variant === "card" ? styles.headerCard : styles.headerPlain, pressed && styles.pressed]}
      >
        <Text variant={variant === "card" ? "subheading" : "bodyStrong"} style={styles.title}>
          {title}
        </Text>
        <Icon name={open ? "chevron-up" : "chevron-down"} size={20} color={open ? "gold" : "textMuted"} />
      </Pressable>
      {open ? <View style={variant === "card" ? styles.bodyCard : styles.bodyPlain}>{children}</View> : null}
    </View>
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
  plain: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md, minHeight: minTouchTarget },
  headerCard: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  headerPlain: { paddingVertical: spacing.md },
  pressed: { backgroundColor: colors.surfaceRaised },
  title: { flex: 1 },
  bodyCard: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, gap: spacing.md },
  bodyPlain: { paddingBottom: spacing.md, gap: spacing.md },
});
