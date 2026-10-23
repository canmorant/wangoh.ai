import { StyleSheet, View } from "react-native";

import { radius, spacing } from "@/theme";
import { Skeleton } from "@/ui";

/** Ülke / şehir ayrıntısı yüklenirken: kapak, hızlı bilgi kutuları ve metin satırları. */
export function DetailSkeleton({ label = "Yükleniyor" }: { label?: string }) {
  return (
    <View style={styles.container} accessible accessibilityRole="progressbar" accessibilityLabel={label} accessibilityLiveRegion="polite">
      <Skeleton height={200} radius={radius.lg} />
      <View style={styles.tiles}>
        <Skeleton height={64} radius={radius.md} style={styles.tile} />
        <Skeleton height={64} radius={radius.md} style={styles.tile} />
        <Skeleton height={64} radius={radius.md} style={styles.tile} />
        <Skeleton height={64} radius={radius.md} style={styles.tile} />
      </View>
      <View style={styles.lines}>
        <Skeleton height={18} width="70%" />
        <Skeleton height={14} />
        <Skeleton height={14} />
        <Skeleton height={14} width="85%" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.lg },
  tiles: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  tile: { flexGrow: 1, flexBasis: "46%" },
  lines: { gap: spacing.sm },
});
