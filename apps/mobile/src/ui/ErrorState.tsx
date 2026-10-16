import { StyleSheet, View } from "react-native";

import { getErrorMessage, isNetworkError } from "@/api/errors";
import { colors, radius, spacing } from "@/theme";

import { Button } from "./Button";
import { Icon } from "./Icon";
import { Text } from "./Text";

export interface ErrorStateProps {
  /** Sorgu ya da işlem hatası; mesaj ve bağlantı sorunu ayrımı buradan gelir. */
  error?: unknown;
  title?: string;
  /** Verilmezse hatadan ya da genel Türkçe mesajdan türetilir. */
  message?: string;
  /** Verilirse "Tekrar dene" düğmesi çıkar (genellikle `query.refetch`). */
  onRetry?: () => void;
  retryLabel?: string;
  retrying?: boolean;
}

export function ErrorState({ error, title, message, onRetry, retryLabel = "Tekrar dene", retrying = false }: ErrorStateProps) {
  const offline = isNetworkError(error);
  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      <View style={styles.iconWrap}>
        <Icon name={offline ? "cloud-offline-outline" : "alert-circle-outline"} size={32} color="danger" />
      </View>
      <Text variant="heading" align="center" style={styles.title}>
        {title ?? (offline ? "Bağlantı kurulamadı" : "Bir sorun oluştu")}
      </Text>
      <Text variant="body" color="textSecondary" align="center">
        {message ?? getErrorMessage(error)}
      </Text>
      {onRetry ? <Button title={retryLabel} onPress={onRetry} loading={retrying} style={styles.action} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 240, alignItems: "center", justifyContent: "center", padding: spacing.xl },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.dangerSoft,
    marginBottom: spacing.lg,
  },
  title: { marginBottom: spacing.sm },
  action: { marginTop: spacing.xl, minWidth: 160 },
});
