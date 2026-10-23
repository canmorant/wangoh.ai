import { StyleSheet, View } from "react-native";

import { colors, radius, spacing } from "@/theme";
import { Icon, Text } from "@/ui";

export interface BannerProps {
  message: string;
  tone?: "error" | "success" | "info";
  testID?: string;
}

const TONES = {
  error: { background: colors.dangerSoft, icon: "alert-circle" as const, color: "danger" as const },
  success: { background: colors.successSoft, icon: "checkmark-circle" as const, color: "success" as const },
  info: { background: colors.goldSoft, icon: "information-circle" as const, color: "gold" as const },
};

/** Ekran içi durum/hata iletisi. Ekran okuyucu değişince okur (alert/polite). */
export function Banner({ message, tone = "error", testID }: BannerProps) {
  const palette = TONES[tone];
  return (
    <View
      role={tone === "error" ? "alert" : "status"}
      accessibilityRole={tone === "error" ? "alert" : undefined}
      accessibilityLiveRegion={tone === "error" ? "assertive" : "polite"}
      style={[styles.banner, { backgroundColor: palette.background }]}
      testID={testID}
    >
      <Icon name={palette.icon} size={20} color={palette.color} />
      <Text variant="small" style={styles.text}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { flexDirection: "row", gap: spacing.sm, alignItems: "flex-start", padding: spacing.md, borderRadius: radius.md },
  text: { flex: 1 },
});
