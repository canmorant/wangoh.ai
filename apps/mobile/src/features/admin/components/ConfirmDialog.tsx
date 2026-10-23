import { Modal, Pressable, StyleSheet, View } from "react-native";

import { colors, radius, spacing } from "@/theme";
import { Button, Text } from "@/ui";

export interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  /** Geri alınamaz işlem: onay düğmesi kırmızı olur. */
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Onay penceresi. `Alert.alert` web'de çalışmadığı (react-native-web'de boş) ve her platformda aynı görünmediği için
 * kendi modalimiz kullanılır. Arka plana dokunmak ya da Android geri tuşu iptal eder (işlem sürerken kapanmaz).
 */
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = "Vazgeç",
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancel = () => {
    if (!loading) onCancel();
  };
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={cancel} statusBarTranslucent>
      <View style={styles.root}>
        <Pressable accessibilityLabel="Pencereyi kapat" accessibilityRole="button" style={StyleSheet.absoluteFill} onPress={cancel}>
          <View style={[StyleSheet.absoluteFill, styles.backdrop]} />
        </Pressable>
        <View role="alertdialog" accessibilityViewIsModal aria-modal style={styles.dialog} testID="confirm-dialog">
          <Text variant="heading" accessibilityRole="header">
            {title}
          </Text>
          <Text variant="body" color="textSecondary" style={styles.message}>
            {message}
          </Text>
          <View style={styles.actions}>
            <Button title={cancelLabel} variant="secondary" onPress={cancel} disabled={loading} fullWidth />
            <Button
              title={confirmLabel}
              variant={destructive ? "danger" : "primary"}
              onPress={onConfirm}
              loading={loading}
              fullWidth
              testID="confirm-dialog-confirm"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.xl },
  backdrop: { backgroundColor: colors.overlay },
  dialog: {
    width: "100%",
    maxWidth: 420,
    gap: spacing.md,
    padding: spacing.xl,
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
  },
  message: { marginBottom: spacing.sm },
  actions: { gap: spacing.sm },
});
