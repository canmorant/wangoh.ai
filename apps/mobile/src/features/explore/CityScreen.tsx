import type { CityDetailDto } from "@wangoh/api-client";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { ScrollView, StyleSheet, View, type LayoutChangeEvent } from "react-native";

import { ImageCredits } from "@/features/credits";
import { colors, radius, screenPadding, spacing } from "@/theme";
import { Button, ErrorState, Header, Icon, RemoteImage, Screen, Text, ThemedRefreshControl } from "@/ui";

import { Accordion } from "./components/Accordion";
import { DetailSkeleton } from "./components/DetailSkeleton";
import { FactGrid } from "./components/FactGrid";
import { FaqList, ItineraryDays, PlaceCards, PracticalTips, RelatedGuides, SectionBody, SourceLinks, TocList } from "./components/GuideBlocks";
import { RichText } from "./components/RichText";
import { NotFoundState, isNotFoundError } from "./components/states";
import { useCity } from "./hooks";
import { CONTENT_MAX_WIDTH } from "./layout";
import { GUIDE_BLOCK_IDS, DEFAULT_PRACTICAL_HEADING, buildToc, formatReviewedDate, initialOpenIds, placesSection } from "./lib/guide";
import { cityHref, countryHref, parseCitySlug, parseCountryCode } from "./lib/routes";

type IdSet = ReadonlySet<string>;

const toggled = (set: IdSet, id: string): IdSet => {
  const next = new Set(set);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
};

interface ContentProps {
  data: CityDetailDto;
  code: string;
  refreshing: boolean;
  onRefresh: () => void;
}

/** Yüklenmiş şehir: kapak ve rehber. Açık/kapalı bölüm durumu ve kaydırma konumları burada tutulur. */
function CityContent({ data, code, refreshing, onRefresh }: ContentProps) {
  const router = useRouter();
  const guide = data.guide;
  const toc = useMemo(() => (guide ? buildToc(guide) : []), [guide]);

  const [open, setOpen] = useState<IdSet>(() => new Set(initialOpenIds(toc)));
  const [faqOpen, setFaqOpen] = useState<IdSet>(() => new Set());
  const [tocOpen, setTocOpen] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const offsets = useRef<Record<string, number>>({});
  const anchor = (id: string) => ({
    onLayout: (event: LayoutChangeEvent) => {
      offsets.current[id] = event.nativeEvent.layout.y;
    },
  });

  const toggle = (id: string) => setOpen((current) => toggled(current, id));
  const allOpen = toc.length > 0 && toc.every((entry) => open.has(entry.id));
  const toggleAll = () => setOpen(allOpen ? new Set() : new Set(toc.map((entry) => entry.id)));

  /** İçindekilerden bölüme gider: bölüm açılır, ardından konumuna kaydırılır. */
  const jumpTo = (id: string) => {
    setOpen((current) => new Set(current).add(id));
    setTimeout(() => {
      const y = offsets.current[id];
      if (y !== undefined) scrollRef.current?.scrollTo({ y: Math.max(0, y - spacing.md), animated: true });
    }, 80);
  };

  const openCity = (slug: string) => router.push(cityHref(code, slug));
  const section = (id: string, title: string, children: ReactNode) => (
    <View key={id} {...anchor(id)}>
      <Accordion title={title} open={open.has(id)} onToggle={() => toggle(id)}>
        {children}
      </Accordion>
    </View>
  );

  const places = placesSection(guide?.placesKind);
  const reviewedDate = guide?.reviewedAt ? formatReviewedDate(guide.reviewedAt) : null;

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.scroll}
      contentContainerStyle={styles.content}
      refreshControl={<ThemedRefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <RemoteImage uri={data.imageUrl} alt={`${data.name} kapak görseli`} aspectRatio={16 / 10} radius={radius.lg} />

      {!guide ? (
        <>
          {data.description ? <RichText text={data.description} variant="body" color="text" /> : null}
          <View style={styles.notice}>
            <Icon name="time-outline" size={22} color="gold" />
            <View style={styles.noticeText}>
              <Text variant="bodyStrong">Bu şehrin rehberi hazırlanıyor</Text>
              <Text variant="small" color="textSecondary">
                Rehber yayınlandığında burada görünecek. Şimdilik ülkenin diğer şehirlerine göz atabilirsin.
              </Text>
            </View>
          </View>
        </>
      ) : (
        <>
          <RichText text={guide.lede} variant="body" color="text" />
          <FactGrid facts={guide.quickFacts} />

          <View style={styles.note}>
            {guide.volatileNote ? (
              <View style={styles.noteRow}>
                <Icon name="alert-circle-outline" size={22} color="gold" />
                <View style={styles.noticeText}>
                  <Text variant="bodyStrong">Değişebilecek bilgiler</Text>
                  <Text variant="small" color="textSecondary">
                    {guide.volatileNote}
                  </Text>
                </View>
              </View>
            ) : null}
            <Text variant="caption" color="textMuted" accessibilityRole="text">
              {guide.reviewed && reviewedDate ? `Son editoryal kontrol: ${reviewedDate}` : "Bu rehber henüz editoryal olarak gözden geçirilmedi."}
            </Text>
          </View>

          {guide.countryInfoOnHub ? (
            <View style={styles.notice}>
              <Icon name="document-text-outline" size={22} color="gold" />
              <View style={styles.noticeText}>
                <Text variant="bodyStrong">{data.country.name} için vize, para ve telefon</Text>
                <Text variant="small" color="textSecondary">
                  Giriş kuralları, ödeme, dil, mobil internet ve bütçe bilgileri ülkenin tamamı için geçerli; ülke sayfasında toplandı.
                </Text>
                <Button
                  title={`${data.country.name} sayfasını aç`}
                  variant="secondary"
                  size="sm"
                  onPress={() => router.push(countryHref(code))}
                  style={styles.noticeAction}
                />
              </View>
            </View>
          ) : null}

          {toc.length > 1 ? (
            <Accordion title="İçindekiler" open={tocOpen} onToggle={() => setTocOpen((value) => !value)}>
              <TocList entries={toc} onJump={jumpTo} />
            </Accordion>
          ) : null}

          {toc.length > 0 ? (
            <View style={styles.toolbar}>
              <Text variant="label" color="textMuted">
                {toc.length} BÖLÜM
              </Text>
              <Button title={allOpen ? "Tümünü kapat" : "Tümünü aç"} variant="ghost" size="sm" onPress={toggleAll} />
            </View>
          ) : null}

          {guide.sections.map((item) =>
            section(
              item.id,
              item.heading,
              <SectionBody section={item} />,
            ),
          )}
          {guide.places.length > 0 ? section(GUIDE_BLOCK_IDS.places, places.title, <PlaceCards places={guide.places} intro={places.intro} />) : null}
          {guide.itinerary.length > 0 ? section(GUIDE_BLOCK_IDS.itinerary, "Gün gün gezi planı", <ItineraryDays days={guide.itinerary} />) : null}
          {guide.practicalTips && guide.practicalTips.length > 0
            ? section(GUIDE_BLOCK_IDS.practical, guide.practicalHeading?.trim() || DEFAULT_PRACTICAL_HEADING, <PracticalTips tips={guide.practicalTips} />)
            : null}
          {guide.relatedGuides && guide.relatedGuides.length > 0
            ? section(GUIDE_BLOCK_IDS.related, `${data.country.name} rotasını sürdürün`, <RelatedGuides related={guide.relatedGuides} onOpen={openCity} />)
            : null}
          {guide.faqs.length > 0
            ? section(
                GUIDE_BLOCK_IDS.faq,
                "Sık sorulan sorular",
                <FaqList faqs={guide.faqs} isOpen={(key) => faqOpen.has(key)} onToggle={(key) => setFaqOpen((current) => toggled(current, key))} />,
              )
            : null}
          {guide.sources && guide.sources.length > 0
            ? section(GUIDE_BLOCK_IDS.sources, "Resmî kaynaklar", <SourceLinks sources={guide.sources} />)
            : null}
        </>
      )}

      <Button
        title={`${data.country.name} sayfasına git`}
        variant="secondary"
        onPress={() => router.push(countryHref(code))}
        accessibilityHint="Ülke ayrıntısını ve diğer şehirleri açar"
        style={styles.countryButton}
      />

      {/* Görsel atıfları (CC BY / CC BY-SA koşulu): kaydırmanın en sonu, şehir görseli için. */}
      <ImageCredits credits={data.imageCredits} />
    </ScrollView>
  );
}

/** Şehir rehberi (`/country/XX/city/slug`): kapak, hızlı bilgiler, açılır bölümler, mekânlar, plan, SSS. Herkese açık. */
export function CityScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ code?: string | string[]; slug?: string | string[] }>();
  const code = parseCountryCode(params.code);
  const slug = parseCitySlug(params.slug);
  const city = useCity(code, slug);

  const { refetch } = city;
  const refresh = useCallback(() => void refetch(), [refetch]);

  // Doğrudan bağlantıyla açıldığında geri gidecek ekran yoksa ülke sayfasına (o da yoksa ana ekrana) döner.
  const goBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace(code ? countryHref(code) : "/");
  }, [router, code]);

  const data = city.data;

  if (code === null || slug === null || (city.isError && !data && isNotFoundError(city.error))) {
    return (
      <Screen header={<Header back={goBack} title="Şehir" />}>
        <NotFoundState
          title="Şehir bulunamadı"
          message="Aradığın şehir yok ya da adresi hatalı."
          actionLabel={code ? "Ülke sayfasına dön" : "Keşfet’e dön"}
          onAction={() => router.replace(code ? countryHref(code) : "/")}
        />
      </Screen>
    );
  }

  if (!data) {
    return (
      <Screen header={<Header back={goBack} title="Şehir" />}>
        {city.isError ? (
          <ErrorState error={city.error} onRetry={() => void city.refetch()} retrying={city.isRefetching} />
        ) : (
          <DetailSkeleton label="Şehir rehberi yükleniyor" />
        )}
      </Screen>
    );
  }

  const countryLabel = data.country.flag ? `${data.country.flag} ${data.country.name}` : data.country.name;

  return (
    <Screen
      scroll={false}
      padded={false}
      testID="city-screen"
      header={<Header back={goBack} title={data.name} subtitle={countryLabel} />}
    >
      <CityContent key={`${code}/${slug}`} data={data} code={code} refreshing={city.isRefetching} onRefresh={refresh} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    maxWidth: CONTENT_MAX_WIDTH,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: screenPadding,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  notice: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  noticeText: { flex: 1, gap: spacing.xs },
  noticeAction: { alignSelf: "flex-start", marginTop: spacing.sm },
  note: {
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.goldSoft,
    borderRadius: radius.lg,
  },
  noteRow: { flexDirection: "row", gap: spacing.md },
  toolbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: spacing.sm, marginRight: -spacing.lg },
  countryButton: { marginTop: spacing.md },
});
