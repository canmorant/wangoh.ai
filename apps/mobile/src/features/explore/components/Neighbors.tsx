import type { CountrySummaryDto } from "@wangoh/api-client";
import { Pressable, StyleSheet, View } from "react-native";

import { colors, minTouchTarget, radius, spacing } from "@/theme";
import { Skeleton, Text } from "@/ui";

import { FlagEmoji } from "./CountryCards";

export interface NeighborsProps {
  /** Çözümlenmiş komşular (sırayla); çözümlenemeyen ISO3 kodları atlanır. */
  countries: CountrySummaryDto[];
  /** Ülke dizini hâlâ yükleniyor: yer tutucu çipler gösterilir. */
  loading: boolean;
  onOpen: (code: string) => void;
}

/** Komşu ülkeler: `borders` (ISO3) alanından, ülke listesindeki ad ve bayrakla. */
export function Neighbors({ countries, loading, onOpen }: NeighborsProps) {
  if (!loading && countries.length === 0) return null;
  return (
    <View style={styles.container}>
      <Text variant="heading">Komşu ülkeler</Text>
      {loading && countries.length === 0 ? (
        <View style={styles.row} accessible accessibilityRole="progressbar" accessibilityLabel="Komşu ülkeler yükleniyor">
          {[0, 1, 2].map((key) => (
            <Skeleton key={key} width={110} height={44} radius={radius.pill} />
          ))}
        </View>
      ) : (
        <View style={styles.row}>
          {countries.map((country) => (
            <Pressable
              key={country.code}
              accessibilityRole="button"
              accessibilityLabel={country.name}
              accessibilityHint="Ülke ayrıntısını açar"
              onPress={() => onOpen(country.code)}
              style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
            >
              <FlagEmoji flag={country.flag} size={18} />
              <Text variant="small" numberOfLines={1} style={styles.name}>
                {country.name}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md, marginTop: spacing.xl },
  row: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    minHeight: minTouchTarget,
    paddingLeft: spacing.sm,
    paddingRight: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  pressed: { backgroundColor: colors.surfaceRaised },
  name: { flexShrink: 1 },
});
