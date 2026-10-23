import { StyleSheet, View } from "react-native";

import { Icon, Text } from "@/ui";
import { colors, radius, spacing } from "@/theme";

import { useRoundProgress } from "../hooks/useRoundProgress";
import { nextRoundNotice, type RoundTiming } from "../model/countdown";

export interface NextRoundNoticeProps {
  /** Sonraki turun saati (cevap yanıtından). */
  timing: RoundTiming;
  durationMs: number;
  testID?: string;
}

/**
 * Harita oyununda geri bildirim ekranı: sonraki turun sayacı ne zaman başlıyor? Sunucu sayacı cevaptan 5 sn sonra başlatır;
 * oyuncu sonucu inceleyebilir ama süre işlemeye başlayınca bunu açıkça görür ("Süre işliyor").
 */
export function NextRoundNotice({ timing, durationMs, testID }: NextRoundNoticeProps) {
  const progress = useRoundProgress(timing, durationMs);
  const running = !progress.waiting;
  return (
    <View style={[styles.box, running ? styles.running : null]} accessible accessibilityRole="text" testID={testID}>
      <Icon name={running ? "time" : "hourglass-outline"} size={20} color={running ? "gold" : "textSecondary"} />
      <Text variant="small" color={running ? "gold" : "textSecondary"} style={styles.text} testID={testID ? `${testID}-text` : undefined}>
        {nextRoundNotice(progress)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  running: { borderColor: colors.gold, backgroundColor: colors.goldSoft },
  text: { flex: 1 },
});
