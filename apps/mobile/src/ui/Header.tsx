import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { minTouchTarget, spacing } from "@/theme";

import { Button } from "./Button";
import { Icon } from "./Icon";
import { Text } from "./Text";

export interface HeaderProps {
  title: string;
  subtitle?: string;
  /** `true`: bir önceki ekrana (yoksa ana sayfaya) döner. Fonksiyon verilirse o çalışır. */
  back?: boolean | (() => void);
  /** Sağ üst eylem alanı (düğme, rozet). */
  right?: ReactNode;
}

/**
 * Ekran başlığı. Uygulamada yerel (native) başlık çubukları kapalıdır; her ekran kendi başlığını
 * bununla çizer, böylece görünüm iOS, Android ve web önizlemede aynı kalır.
 */
export function Header({ title, subtitle, back, right }: HeaderProps) {
  const router = useRouter();

  const goBack = () => {
    if (typeof back === "function") back();
    else if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  return (
    <View style={styles.container}>
      {back ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Geri"
          accessibilityHint="Önceki ekrana döner"
          onPress={goBack}
          hitSlop={8}
          style={styles.back}
        >
          <Icon name="chevron-back" size={26} color="gold" />
        </Pressable>
      ) : null}
      <View style={styles.titles}>
        <Text variant="title" numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="small" color="textSecondary" style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

export interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

/** Ekran içi bölüm başlığı ("Öne çıkan ülkeler" + "Tümü"). */
export function SectionHeader({ title, actionLabel, onActionPress }: SectionHeaderProps) {
  return (
    <View style={styles.section}>
      <Text variant="heading" style={styles.sectionTitle} numberOfLines={1}>
        {title}
      </Text>
      {actionLabel && onActionPress ? <Button title={actionLabel} variant="ghost" size="sm" onPress={onActionPress} style={styles.sectionAction} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: minTouchTarget + spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  back: {
    width: minTouchTarget,
    height: minTouchTarget,
    marginLeft: -spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  titles: { flex: 1 },
  subtitle: { marginTop: spacing.xxs },
  right: { alignItems: "flex-end" },
  section: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: minTouchTarget,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionTitle: { flex: 1 },
  // Metin sağ kenara hizalansın: düğmenin iç boşluğu kadar dışarı taşır, dokunma alanı korunur.
  sectionAction: { marginRight: -spacing.lg },
});
