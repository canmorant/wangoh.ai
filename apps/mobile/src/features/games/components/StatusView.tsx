import { StyleSheet, View } from "react-native";

import { Button, Icon, Text, type IconName } from "@/ui";
import { colors, radius, spacing } from "@/theme";

export interface StatusAction {
  label: string;
  onPress: () => void;
  loading?: boolean;
  testID?: string;
}

export interface StatusViewProps {
  icon: IconName;
  tone?: "gold" | "danger";
  title: string;
  message?: string;
  primary?: StatusAction;
  secondary?: StatusAction;
  testID?: string;
}

/**
 * Ekran ortası durum görünümü: simge, başlık, mesaj ve eylem düğmeleri (birincil + ikincil) bir arada.
 * Ortak EmptyState/ErrorState tek eylem alır; ikincil düğme ("Oyun merkezi") ekranın dibine düşerdi.
 */
export function StatusView({ icon, tone = "gold", title, message, primary, secondary, testID }: StatusViewProps) {
  return (
    <View style={styles.container} accessibilityLiveRegion="polite" testID={testID}>
      <View style={[styles.iconWrap, { backgroundColor: tone === "danger" ? colors.dangerSoft : colors.goldSoft }]}>
        <Icon name={icon} size={32} color={tone === "danger" ? "danger" : "gold"} />
      </View>
      <Text variant="heading" align="center">
        {title}
      </Text>
      {message ? (
        <Text variant="body" color="textSecondary" align="center">
          {message}
        </Text>
      ) : null}
      <View style={styles.actions}>
        {primary ? (
          <Button title={primary.label} onPress={primary.onPress} loading={primary.loading} fullWidth testID={primary.testID} />
        ) : null}
        {secondary ? (
          <Button title={secondary.label} variant={primary ? "ghost" : "secondary"} onPress={secondary.onPress} fullWidth testID={secondary.testID} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 240, alignItems: "center", justifyContent: "center", gap: spacing.md, padding: spacing.xl },
  iconWrap: { width: 64, height: 64, borderRadius: radius.xl, alignItems: "center", justifyContent: "center", marginBottom: spacing.sm },
  actions: { alignSelf: "stretch", gap: spacing.sm, marginTop: spacing.lg },
});
