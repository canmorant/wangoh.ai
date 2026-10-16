import { StyleSheet, View } from "react-native";

import { colors, radius, spacing } from "@/theme";

import { Button } from "./Button";
import { Icon, type IconName } from "./Icon";
import { Text } from "./Text";

export interface EmptyStateProps {
  icon?: IconName;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = "file-tray-outline",
  title = "Burada henüz bir şey yok",
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Icon name={icon} size={32} color="gold" />
      </View>
      <Text variant="heading" align="center" style={styles.title}>
        {title}
      </Text>
      {message ? (
        <Text variant="body" color="textSecondary" align="center">
          {message}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button title={actionLabel} variant="secondary" onPress={onAction} style={styles.action} />
      ) : null}
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
    backgroundColor: colors.goldSoft,
    marginBottom: spacing.lg,
  },
  title: { marginBottom: spacing.sm },
  action: { marginTop: spacing.xl },
});
