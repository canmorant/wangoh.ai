import { StyleSheet, View } from "react-native";

import { getErrorMessage, isNetworkError } from "@/api/errors";
import { colors, radius, spacing } from "@/theme";
import { Button, Icon, Text } from "@/ui";

export interface SectionErrorProps {
  error: unknown;
  title: string;
  onRetry: () => void;
  retrying?: boolean;
  testID?: string;
}

/** Ekranın tamamını kaplamayan bölüm hatası (ErrorState'in kompakt karşılığı): mesaj + yeniden dene. */
export function SectionError({ error, title, onRetry, retrying = false, testID }: SectionErrorProps) {
  const offline = isNetworkError(error);
  return (
    <View style={styles.box} accessibilityLiveRegion="polite" testID={testID}>
      <Icon name={offline ? "cloud-offline-outline" : "alert-circle-outline"} size={28} color="danger" />
      <Text variant="bodyStrong" align="center">
        {offline ? "Bağlantı kurulamadı" : title}
      </Text>
      <Text variant="small" color="textSecondary" align="center">
        {getErrorMessage(error)}
      </Text>
      <Button title="Tekrar dene" variant="secondary" size="sm" onPress={onRetry} loading={retrying} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
});
