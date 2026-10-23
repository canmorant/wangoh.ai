import { Modal, Pressable, StyleSheet, View } from "react-native";

import { Button, Text } from "@/ui";
import { colors, radius, spacing } from "@/theme";

export interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  testID?: string;
}

/**
 * Onay penceresi. `Alert.alert` web önizlemede çalışmadığından (React Native Web'de boş) kendi
 * penceremizi çizeriz; Android geri tuşu ve arka plana dokunma "vazgeç" sayılır.
 */
export function ConfirmDialog({ visible, title, message, confirmLabel, cancelLabel, onConfirm, onCancel, testID }: ConfirmDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} accessible={false} importantForAccessibility="no" />
        <View style={styles.card} accessibilityViewIsModal accessibilityRole="alert" testID={testID}>
          <Text variant="heading" style={styles.title}>
            {title}
          </Text>
          <Text variant="body" color="textSecondary" style={styles.message}>
            {message}
          </Text>
          <View style={styles.actions}>
            <Button title={cancelLabel} onPress={onCancel} fullWidth testID="confirm-cancel" />
            <Button title={confirmLabel} onPress={onConfirm} variant="danger" fullWidth testID="confirm-accept" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay, alignItems: "center", justifyContent: "center", padding: spacing.xl },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    padding: spacing.xl,
    gap: spacing.md,
  },
  title: { marginBottom: spacing.xs },
  message: { marginBottom: spacing.sm },
  actions: { gap: spacing.md },
});
