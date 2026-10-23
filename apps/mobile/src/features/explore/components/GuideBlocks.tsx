import type {
  GuideFaqDto,
  GuideItineraryDayDto,
  GuidePlaceDto,
  GuidePracticalTipDto,
  GuideRelatedDto,
  GuideSectionDto,
  GuideSourceDto,
} from "@wangoh/api-client";
import { Linking, Pressable, StyleSheet, View } from "react-native";

import { colors, minTouchTarget, radius, spacing } from "@/theme";
import { Badge, Icon, Text } from "@/ui";

import { Accordion } from "./Accordion";
import { RichText } from "./RichText";

const cardStyle = {
  gap: spacing.sm,
  padding: spacing.md,
  backgroundColor: colors.surface,
  borderRadius: radius.lg,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: colors.border,
} as const;

/** Rehber bölümünün gövdesi: paragraflar ve (varsa) alt bölümler. */
export function SectionBody({ section }: { section: GuideSectionDto }) {
  return (
    <>
      {section.body.map((paragraph, index) => (
        <RichText key={index} text={paragraph} />
      ))}
      {section.subsections?.map((sub) => (
        <View key={sub.heading} style={styles.subsection}>
          <Text variant="bodyStrong" color="text">
            {sub.heading}
          </Text>
          {sub.body.map((paragraph, index) => (
            <RichText key={index} text={paragraph} />
          ))}
        </View>
      ))}
    </>
  );
}

/** Mekân kartları: ad, semt, ne ile bilinir, neden, fiyat kategorisi (API'deki kaba değer) ve ipucu. */
export function PlaceCards({ places, intro }: { places: readonly GuidePlaceDto[]; intro: string }) {
  return (
    <>
      <Text variant="small" color="textSecondary">
        {intro}
      </Text>
      {places.map((place, index) => (
        <View key={`${index}-${place.name}`} style={cardStyle}>
          <View style={styles.placeTitle}>
            <Text variant="subheading" style={styles.flex}>
              {place.name}
            </Text>
            {place.price ? <Badge label={`Fiyat: ${place.price}`} tone="gold" /> : null}
          </View>
          <Text variant="caption" color="textMuted">
            {place.area} · {place.known}
          </Text>
          <RichText text={place.why} />
          {place.tip ? (
            <View style={styles.tip}>
              <RichText text={place.tip} variant="small" color="textSecondary" />
            </View>
          ) : null}
        </View>
      ))}
    </>
  );
}

/** Gün gün gezi planı: sabah / öğleden sonra / akşam. */
export function ItineraryDays({ days }: { days: readonly GuideItineraryDayDto[] }) {
  const slots = [
    ["Sabah", "morning"],
    ["Öğleden sonra", "afternoon"],
    ["Akşam", "evening"],
  ] as const;
  return (
    <>
      {days.map((day, index) => (
        <View key={`${index}-${day.title}`} style={cardStyle}>
          <Text variant="subheading">{day.title}</Text>
          {slots.map(([label, key]) => (
            <View key={key} style={styles.slot}>
              <Text variant="label" color="gold">
                {label}
              </Text>
              <RichText text={day[key]} />
            </View>
          ))}
        </View>
      ))}
    </>
  );
}

export function PracticalTips({ tips }: { tips: readonly GuidePracticalTipDto[] }) {
  return (
    <>
      {tips.map((tip, index) => (
        <View key={`${index}-${tip.title}`} style={cardStyle}>
          <Text variant="bodyStrong">{tip.title}</Text>
          <RichText text={tip.body} />
        </View>
      ))}
    </>
  );
}

/** Aynı ülkedeki ilgili rehberler; şehir slug'ı çözülemeyenler bağlantısız kart olur. */
export function RelatedGuides({ related, onOpen }: { related: readonly GuideRelatedDto[]; onOpen: (slug: string) => void }) {
  return (
    <>
      {related.map((item, index) => {
        const slug = item.slug ?? null;
        const content = (
          <>
            <Text variant="bodyStrong">{item.anchor}</Text>
            <RichText text={item.description} variant="small" />
            {slug ? (
              <Text variant="small" color="gold">
                Rehberi oku →
              </Text>
            ) : null}
          </>
        );
        return slug ? (
          <Pressable
            key={`${index}-${item.city}`}
            accessibilityRole="button"
            accessibilityLabel={`${item.anchor}. Rehberi oku`}
            onPress={() => onOpen(slug)}
            style={({ pressed }) => [cardStyle, pressed && styles.pressed]}
          >
            {content}
          </Pressable>
        ) : (
          <View key={`${index}-${item.city}`} style={cardStyle}>
            {content}
          </View>
        );
      })}
    </>
  );
}

/** Sık sorulan sorular: her soru kendi içinde açılır/kapanır. */
export function FaqList({
  faqs,
  isOpen,
  onToggle,
}: {
  faqs: readonly GuideFaqDto[];
  isOpen: (key: string) => boolean;
  onToggle: (key: string) => void;
}) {
  return (
    <View>
      {faqs.map((faq, index) => {
        const key = `sss-${index}`;
        return (
          <Accordion key={key} variant="plain" title={faq.q} open={isOpen(key)} onToggle={() => onToggle(key)}>
            <RichText text={faq.a} />
          </Accordion>
        );
      })}
    </View>
  );
}

/** İçindekiler: bölüm başlıkları (uzun başlıklar satıra sarılır); dokununca bölüme gidilir. */
export function TocList({ entries, onJump }: { entries: readonly { id: string; label: string }[]; onJump: (id: string) => void }) {
  return (
    <View>
      {entries.map((entry, index) => (
        <Pressable
          key={entry.id}
          accessibilityRole="button"
          accessibilityLabel={entry.label}
          accessibilityHint="Bölümü açar ve oraya kaydırır"
          onPress={() => onJump(entry.id)}
          style={({ pressed }) => [styles.tocRow, index > 0 && styles.tocDivider, pressed && styles.pressed]}
        >
          <Text variant="small" color="gold" style={styles.flex}>
            {entry.label}
          </Text>
          <Icon name="arrow-down" size={16} color="textMuted" />
        </Pressable>
      ))}
    </View>
  );
}

/** Resmî kaynaklar: tarayıcıda açılan bağlantılar (API yalnız https adresi kabul eder). */
export function SourceLinks({ sources }: { sources: readonly GuideSourceDto[] }) {
  return (
    <>
      {sources.map((source, index) => (
        <Pressable
          key={`${index}-${source.url}`}
          accessibilityRole="link"
          accessibilityLabel={`${source.name}. Tarayıcıda açılır`}
          onPress={() => {
            Linking.openURL(source.url).catch(() => undefined);
          }}
          style={({ pressed }) => [styles.source, pressed && styles.pressed]}
        >
          <Text variant="small" color="gold" style={styles.flex}>
            {source.name}
          </Text>
          <Icon name="open-outline" size={18} color="textMuted" />
        </Pressable>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  pressed: { opacity: 0.8 },
  subsection: { gap: spacing.sm, marginTop: spacing.sm },
  placeTitle: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
  tip: { borderLeftWidth: 2, borderLeftColor: colors.gold, paddingLeft: spacing.md, marginTop: spacing.xs },
  slot: { gap: spacing.xxs },
  tocRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, minHeight: minTouchTarget, paddingVertical: spacing.sm },
  tocDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  source: { flexDirection: "row", alignItems: "center", gap: spacing.md, minHeight: minTouchTarget, paddingVertical: spacing.xs },
});
