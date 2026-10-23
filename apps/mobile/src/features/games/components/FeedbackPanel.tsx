import { StyleSheet, View } from "react-native";

import { Badge, Icon, Text } from "@/ui";
import { colors, radius, spacing } from "@/theme";

import type { FeedbackCopy } from "../model/feedbackCopy";

export interface FeedbackPanelProps {
  copy: FeedbackCopy;
  timedOut: boolean;
  testID?: string;
}

/** Cevap sonrası geri bildirim. Tüm değerler (puan, bonus, doğru cevap) sunucudan gelir. */
export function FeedbackPanel({ copy, timedOut, testID }: FeedbackPanelProps) {
  const success = copy.tone === "success";
  return (
    <View
      style={[styles.panel, success ? styles.success : styles.danger]}
      accessible
      accessibilityLiveRegion="polite"
      accessibilityLabel={copy.announcement}
      testID={testID}
    >
      <View style={styles.titleRow}>
        <Icon name={success ? "checkmark-circle" : timedOut ? "time" : "close-circle"} size={28} color={success ? "success" : "danger"} />
        <Text variant="heading" style={styles.title} testID="feedback-title">
          {copy.title}
        </Text>
        <Text variant="subheading" color={success ? "success" : "textSecondary"} testID="feedback-points">
          {copy.pointsLabel}
        </Text>
      </View>
      {copy.lines.map((line) => (
        <Text key={line} variant="body" color="textSecondary" testID="feedback-line">
          {line}
        </Text>
      ))}
      {copy.chips.length > 0 ? (
        <View style={styles.chips}>
          {copy.chips.map((chip) => (
            <Badge key={chip} label={chip} tone="gold" />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { gap: spacing.sm, padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1 },
  success: { backgroundColor: colors.successSoft, borderColor: colors.success },
  danger: { backgroundColor: colors.dangerSoft, borderColor: colors.danger },
  titleRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  title: { flex: 1 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
});
