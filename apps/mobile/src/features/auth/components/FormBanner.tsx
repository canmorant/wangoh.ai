import { Pressable, StyleSheet, View } from "react-native";

import { colors, minTouchTarget, radius, spacing, type ColorToken } from "@/theme";
import { Icon, Text, type IconName } from "@/ui";

export type FormBannerTone = "danger" | "success" | "info";

export interface FormBannerProps {
  tone?: FormBannerTone;
  message: string;
  /** Verilirse mesajın üstünde kalın başlık olarak gösterilir. */
  title?: string;
  /** Verilirse sağda kapatma düğmesi çıkar (tek seferlik bildirimler için). */
  onDismiss?: () => void;
  testID?: string;
}

const tones: Record<FormBannerTone, { background: string; border: string; icon: IconName; color: ColorToken }> = {
  danger: { background: colors.dangerSoft, border: colors.danger, icon: "alert-circle-outline", color: "danger" },
  success: { background: colors.successSoft, border: colors.success, icon: "checkmark-circle-outline", color: "success" },
  info: { background: colors.goldSoft, border: colors.gold, icon: "information-circle-outline", color: "gold" },
};

/** Form üstünde işlem sonucu (hata, başarı, bilgi). Ekran okuyucu içeriği duyurur. */
export function FormBanner({ tone = "danger", message, title, onDismiss, testID }: FormBannerProps) {
  const palette = tones[tone];
  return (
    <View style={[styles.box, { backgroundColor: palette.background, borderColor: palette.border }]} testID={testID}>
      <Icon name={palette.icon} size={22} color={palette.color} style={styles.icon} />
      <View
        style={styles.texts}
        accessible
        accessibilityRole={tone === "danger" ? "alert" : "text"}
        accessibilityLiveRegion="polite"
        accessibilityLabel={title ? `${title}. ${message}` : message}
      >
        {title ? (
          <Text variant="bodyStrong" color={palette.color}>
            {title}
          </Text>
        ) : null}
        <Text variant="small" color="text">
          {message}
        </Text>
      </View>
      {onDismiss ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Bildirimi kapat" onPress={onDismiss} hitSlop={8} style={styles.dismiss}>
          <Icon name="close" size={20} color="textSecondary" />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  icon: { marginTop: spacing.xxs },
  texts: { flex: 1, gap: spacing.xxs },
  // Dokunma hedefi 44 pt; kutu boşluğunu bozmamak için negatif kenar boşluğuyla içine sığar.
  dismiss: { width: minTouchTarget, height: minTouchTarget, margin: -spacing.md, alignItems: "center", justifyContent: "center" },
});
