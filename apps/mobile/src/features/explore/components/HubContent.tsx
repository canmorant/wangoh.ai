import type { CountryHubDto } from "@wangoh/api-client";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { colors, radius, spacing } from "@/theme";
import { Badge, Chip, Text } from "@/ui";

import { Accordion } from "./Accordion";
import { RichText } from "./RichText";

export const DEFAULT_ESSENTIALS_HEADING = "Gitmeden önce bilinmesi gerekenler";

/**
 * Ülke rehberi içeriği (hub): rota planı girişi, önemli bilgiler (açılır) ve rota fikirleri.
 * Rota fikirlerindeki şehir adları (`cityLinks`) şehir ekranına bağlanan çiplerdir.
 */
export function HubContent({ hub, onOpenCity }: { hub: CountryHubDto; onOpenCity: (slug: string) => void }) {
  const [openEssentials, setOpenEssentials] = useState<ReadonlySet<string>>(new Set());
  const essentials = hub.essentials ?? [];

  const toggle = (title: string) =>
    setOpenEssentials((current) => {
      const next = new Set(current);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });

  return (
    <View style={styles.container}>
      <Text variant="heading" style={styles.heading}>
        {hub.planningHeading}
      </Text>
      {hub.intro.map((paragraph, index) => (
        <RichText key={index} text={paragraph} />
      ))}

      {essentials.length > 0 ? (
        <View style={styles.block}>
          <Text variant="heading" style={styles.heading}>
            {hub.essentialsHeading ?? DEFAULT_ESSENTIALS_HEADING}
          </Text>
          <View style={styles.list}>
            {essentials.map((item) => (
              <Accordion key={item.title} title={item.title} open={openEssentials.has(item.title)} onToggle={() => toggle(item.title)}>
                <RichText text={item.body} />
              </Accordion>
            ))}
          </View>
        </View>
      ) : null}

      {hub.routeIdeas.length > 0 ? (
        <View style={styles.block}>
          <Text variant="heading" style={styles.heading}>
            Rota fikirleri
          </Text>
          <View style={styles.list}>
            {hub.routeIdeas.map((route) => (
              <View key={route.title} style={styles.routeCard}>
                <Badge label={route.duration} tone="gold" />
                <Text variant="subheading">{route.title}</Text>
                <RichText text={route.description} variant="small" />
                {route.cityLinks && route.cityLinks.length > 0 ? (
                  <View style={styles.cityChips}>
                    {route.cityLinks.map((link) => (
                      <Chip
                        key={link.slug}
                        label={link.name}
                        onPress={() => onOpenCity(link.slug)}
                        accessibilityHint="Şehir rehberini açar"
                      />
                    ))}
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  block: { gap: spacing.md, marginTop: spacing.md },
  heading: { marginTop: spacing.sm },
  list: { gap: spacing.md },
  routeCard: {
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  cityChips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.xs },
});
