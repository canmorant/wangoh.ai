import { ActivityIndicator, StyleSheet, View } from "react-native";

import { colors, spacing } from "@/theme";

import { Text } from "./Text";

export interface LoadingViewProps {
  message?: string;
}

/** Ekranı kaplayan yükleniyor durumu; içerik şekli bilinmiyorsa Skeleton yerine bu kullanılır. */
export function LoadingView({ message = "Yükleniyor…" }: LoadingViewProps) {
  return (
    <View
      style={styles.container}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={message}
      accessibilityLiveRegion="polite"
    >
      <ActivityIndicator size="large" color={colors.gold} />
      <Text variant="small" color="textSecondary" style={styles.message}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 200, alignItems: "center", justifyContent: "center", padding: spacing.xl },
  message: { marginTop: spacing.md },
});
