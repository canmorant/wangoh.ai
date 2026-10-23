import type { ContinentDto } from "@wangoh/api-client";
import { StyleSheet, View } from "react-native";

import { colors, radius, spacing } from "@/theme";
import { Card, Icon, Text } from "@/ui";

/** Kıta kartı: ad, ülke sayısı ve (varsa) seyahat rehberi olan ülke sayısı. Yalnız API alanları. */
export function ContinentCard({ continent, onPress }: { continent: ContinentDto; onPress: (slug: ContinentDto["slug"]) => void }) {
  const guided = continent.travelCountryCount;
  return (
    <Card
      onPress={() => onPress(continent.slug)}
      accessibilityLabel={`${continent.name}, ${continent.countryCount} ülke${guided > 0 ? `, ${guided} ülkede seyahat rehberi var` : ""}`}
      accessibilityHint="Kıtadaki ülkeleri açar"
      style={styles.card}
    >
      <View style={styles.icon}>
        <Icon name="earth" size={22} color="gold" />
      </View>
      <Text variant="heading" numberOfLines={1}>
        {continent.name}
      </Text>
      <Text variant="small" color="textSecondary">
        {continent.countryCount} ülke
      </Text>
      {guided > 0 ? (
        <Text variant="caption" color="gold">
          {guided} ülkede rehber
        </Text>
      ) : (
        <Text variant="caption" color="textMuted">
          Henüz rehber yok
        </Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flexGrow: 1, flexBasis: "46%", minWidth: 140, gap: spacing.xxs, minHeight: 108 },
  icon: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.goldSoft,
    marginBottom: spacing.xs,
  },
});
