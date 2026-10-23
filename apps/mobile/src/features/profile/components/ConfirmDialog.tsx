import { Modal, Pressable, StyleSheet, View } from "react-native";

import { colors, radius, spacing } from "@/theme";
import { Button, Text } from "@/ui";

export interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  /** `danger`: onay düğmesi kırmızı (geri alınamaz eylem). */
  tone?: "default" | "danger";
  /** Onay sürerken düğmeler kilitlenir ve geri tuşu/dış dokunuş kapatmaz. */
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  testID?: string;
}

/**
 * Onay penceresi. RN `Alert` web'de çalışmaz (RN-web'de boş işlem); `Modal` üç platformda da aynıdır.
 * Android geri tuşu (`onRequestClose`) ve boş alana dokunma iptal sayılır.
 */
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = "Vazgeç",
  tone = "default",
  loading = false,
  onConfirm,
  onCancel,
  testID,
}: ConfirmDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={loading ? undefined : onCancel} statusBarTranslucent>
      <View style={styles.overlay} testID={testID}>
        <Pressable
          style={StyleSheet.absoluteFill}
          accessibilityRole="button"
          accessibilityLabel="Pencereyi kapat"
          onPress={loading ? undefined : onCancel}
        />
        <View style={styles.dialog} accessibilityViewIsModal accessibilityRole="alert">
          <Text variant="heading" style={styles.title}>
            {title}
          </Text>
          <Text variant="body" color="textSecondary">
            {message}
          </Text>
          <View style={styles.actions}>
            <Button title={cancelLabel} variant="secondary" onPress={onCancel} disabled={loading} fullWidth testID="confirm-cancel" />
            <Button
              title={confirmLabel}
              variant={tone === "danger" ? "danger" : "primary"}
              onPress={onConfirm}
              loading={loading}
              fullWidth
              testID="confirm-ok"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "center", padding: spacing.xl, backgroundColor: colors.overlay },
  dialog: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    gap: spacing.sm,
    padding: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  title: { marginBottom: spacing.xs },
  actions: { gap: spacing.md, marginTop: spacing.lg },
});
