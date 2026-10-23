import type { CountryDetailDto } from "@wangoh/api-client";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { ImageCredits } from "@/features/credits";
import { colors, radius, screenPadding, spacing } from "@/theme";
import { Button, ErrorState, Header, Icon, RemoteImage, Screen, Text, ThemedRefreshControl } from "@/ui";

import { CityCard } from "./components/CityCard";
import { DetailSkeleton } from "./components/DetailSkeleton";
import { FactGrid } from "./components/FactGrid";
import { HubContent } from "./components/HubContent";
import { Neighbors } from "./components/Neighbors";
import { RichText } from "./components/RichText";
import { NotFoundState, isNotFoundError } from "./components/states";
import { useContinents, useCountry, useCountryIndexByIso3 } from "./hooks";
import { CONTENT_MAX_WIDTH, useGridMetrics } from "./layout";
import { buildCountryFacts, countrySubtitle } from "./lib/facts";
import { cityHref, continentHref, countryHref, parseCountryCode } from "./lib/routes";

function RowSeparator({ height }: { height: number }) {
  return <View style={{ height }} />;
}

/** Ülke başlığı: bayrak emojisi (varsa) ve ad. */
const titleOf = (country: Pick<CountryDetailDto, "flag" | "name">) => (country.flag ? `${country.flag} ${country.name}` : country.name);

/**
 * Ülke ayrıntısı: kapak, hızlı bilgiler, ülke rehberi içeriği (hub), şehirler ve komşu ülkeler.
 * Seyahat bilgisi olmayan ülkede temel dünya verisi (kıta, alt bölge, başkent, bayrak) gösterilir.
 */
export function CountryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ code?: string | string[] }>();
  const code = parseCountryCode(params.code);
  const grid = useGridMetrics();

  const country = useCountry(code);
  const continents = useContinents();
  const detail = country.data;

  const hasBorders = (detail?.borders.length ?? 0) > 0;
  const index = useCountryIndexByIso3(hasBorders);

  const neighbors = useMemo(() => {
    if (!detail) return [];
    return detail.borders.flatMap((iso3) => {
      const match = index.byIso3.get(iso3);
      return match ? [match] : [];
    });
  }, [detail, index.byIso3]);

  const { refetch } = country;
  const refresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const openCity = useCallback((slug: string) => (code ? router.push(cityHref(code, slug)) : undefined), [router, code]);
  const openCountry = useCallback((target: string) => router.push(countryHref(target)), [router]);

  if (code === null || (country.isError && !country.data && isNotFoundError(country.error))) {
    return (
      <Screen header={<Header back title="Ülke" />}>
        <NotFoundState
          title="Ülke bulunamadı"
          message={code ? `“${code}” koduna sahip bir ülke yok.` : "Ülke kodu iki harften oluşmalı (ör. JP)."}
          actionLabel="Keşfet’e dön"
          onAction={() => router.replace("/")}
        />
      </Screen>
    );
  }

  if (!country.data) {
    return (
      <Screen header={<Header back title="Ülke" />}>
        {country.isError ? (
          <ErrorState error={country.error} onRetry={() => void country.refetch()} retrying={country.isRefetching} />
        ) : (
          <DetailSkeleton label="Ülke yükleniyor" />
        )}
      </Screen>
    );
  }

  const data = country.data;
  const continentName = continents.data?.find((item) => item.slug === data.continent)?.name ?? null;
  const travel = data.travel ?? null;
  const facts = buildCountryFacts(
    {
      name: data.name,
      officialName: data.officialName,
      capital: data.capital,
      subregion: data.subregion,
      landlocked: data.landlocked,
      travel,
    },
    continentName,
  );
  const cities = data.cities;
  const hub = travel?.hub ?? null;
  const guided = cities.filter((city) => city.hasGuide).length;
  const cover = travel?.imageUrl ?? data.imageUrl;
  const description = travel?.description ?? null;
  const signature = travel?.signature ?? null;

  const header = (
    <View style={styles.headerBlock}>
      {cover ? <RemoteImage uri={cover} alt={`${data.name} kapak görseli`} aspectRatio={16 / 10} radius={radius.lg} /> : null}

      <FactGrid facts={facts} />

      {description ? <RichText text={description} variant="body" color="text" /> : null}

      {signature ? (
        <View style={styles.signature}>
          <Text variant="label" color="gold">
            KAÇIRMAYIN
          </Text>
          <Text variant="body">{signature}</Text>
        </View>
      ) : null}

      {!travel ? (
        <View style={styles.notice}>
          <Icon name="information-circle-outline" size={22} color="gold" />
          <View style={styles.noticeText}>
            <Text variant="bodyStrong">Bu ülke için seyahat rehberi henüz yok</Text>
            <Text variant="small" color="textSecondary">
              Şimdilik temel bilgiler gösteriliyor: kıta, alt bölge, başkent ve bayrak.
            </Text>
            {continentName ? (
              <Button
                title={`${continentName} ülkelerine göz at`}
                variant="secondary"
                size="sm"
                onPress={() => router.push(continentHref(data.continent))}
                style={styles.noticeAction}
              />
            ) : null}
          </View>
        </View>
      ) : null}

      {hub ? <HubContent hub={hub} onOpenCity={openCity} /> : null}

      {cities.length > 0 ? (
        <View style={styles.citiesHeader}>
          <Text variant="heading">{hub?.citiesHeading ?? `${data.name}’da gezilecek şehirler`}</Text>
          {hub?.cityGridIntro ? <RichText text={hub.cityGridIntro} variant="small" /> : null}
          <Text variant="caption" color="gold">
            {guided === cities.length ? `${cities.length} şehrin tamamı için rehber yayında` : `${guided}/${cities.length} şehir rehberi yayında`}
          </Text>
        </View>
      ) : null}
    </View>
  );

  // Görsel atıfları (CC BY / CC BY-SA koşulu) kaydırmanın en sonunda: ülke ve şehir kartı görselleri için.
  const footer = (
    <View>
      <Neighbors countries={neighbors} loading={hasBorders && !index.complete && !index.isError} onOpen={openCountry} />
      <ImageCredits credits={data.imageCredits} />
    </View>
  );

  return (
    <Screen
      scroll={false}
      padded={false}
      testID="country-screen"
      header={<Header back title={titleOf(data)} subtitle={countrySubtitle(continentName, data.subregion)} />}
    >
      <FlatList
        key={`sehirler-${grid.columns}`}
        data={cities}
        numColumns={grid.columns}
        keyExtractor={(city) => city.slug}
        renderItem={({ item }) => <CityCard city={item} width={grid.itemWidth} onPress={openCity} />}
        columnWrapperStyle={{ gap: grid.gap }}
        ItemSeparatorComponent={() => <RowSeparator height={grid.gap} />}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        refreshControl={<ThemedRefreshControl refreshing={country.isRefetching} onRefresh={() => void refresh()} />}
        contentContainerStyle={styles.content}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={7}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { maxWidth: CONTENT_MAX_WIDTH, width: "100%", alignSelf: "center", paddingHorizontal: screenPadding, paddingBottom: spacing.xxl },
  headerBlock: { gap: spacing.lg, marginBottom: spacing.lg },
  signature: {
    gap: spacing.xs,
    padding: spacing.lg,
    backgroundColor: colors.goldSoft,
    borderRadius: radius.lg,
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
  citiesHeader: { gap: spacing.sm, marginTop: spacing.lg },
});
