import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

import { colors, screenPadding, spacing } from "@/theme";
import { Chip, EmptyState, ErrorState, Header, Screen, SkeletonList, ThemedRefreshControl } from "@/ui";

import { CountryRow } from "./components/CountryCards";
import { HeaderIconButton } from "./components/HeaderIconButton";
import { NotFoundState, isNotFoundError } from "./components/states";
import { useContinent, useInfiniteCountries } from "./hooks";
import { CONTENT_MAX_WIDTH } from "./layout";
import { countryHref, parseContinentSlug, searchHref } from "./lib/routes";

type Filter = "all" | "guided";

function Separator() {
  return <View style={styles.separator} />;
}

/** Kıta ekranı: kıtadaki ülkeler (sayfalı sonsuz liste), seyahat rehberi olanlar rozetli; Hepsi / Rehberi olanlar çipi. */
export function ContinentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ slug?: string | string[] }>();
  const slug = parseContinentSlug(params.slug);
  const [filter, setFilter] = useState<Filter>("all");

  const continent = useContinent(slug);
  const countries = useInfiniteCountries(
    { ...(slug ? { continent: slug } : {}), ...(filter === "guided" ? { hasTravel: true } : {}) },
    { enabled: slug !== null },
  );

  const openCountry = useCallback((code: string) => router.push(countryHref(code)), [router]);
  const { hasNextPage, isFetchingNextPage, fetchNextPage, refetch: refetchCountries, isRefetching } = countries;
  const { refetch: refetchContinent } = continent;
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  const refresh = useCallback(async () => {
    await Promise.all([refetchContinent(), refetchCountries()]);
  }, [refetchContinent, refetchCountries]);

  if (slug === null || (continent.isError && isNotFoundError(continent.error))) {
    return (
      <Screen header={<Header title="Kıta" back />}>
        <NotFoundState
          title="Kıta bulunamadı"
          message="Aradığın kıta yok ya da adresi hatalı."
          actionLabel="Keşfet’e dön"
          onAction={() => router.replace("/")}
        />
      </Screen>
    );
  }

  const info = continent.data;
  const subtitle = info
    ? `${info.countryCount} ülke${info.travelCountryCount > 0 ? ` · ${info.travelCountryCount} ülkede seyahat rehberi` : ""}`
    : undefined;

  const chips = (
    <View style={styles.chips}>
      <Chip
        label={info ? `Hepsi (${info.countryCount})` : "Hepsi"}
        selected={filter === "all"}
        onPress={() => setFilter("all")}
        accessibilityHint="Kıtadaki tüm ülkeleri listeler"
      />
      <Chip
        label={info ? `Rehberi olanlar (${info.travelCountryCount})` : "Rehberi olanlar"}
        selected={filter === "guided"}
        disabled={info?.travelCountryCount === 0}
        onPress={() => setFilter("guided")}
        accessibilityHint="Yalnız seyahat rehberi olan ülkeleri listeler"
      />
    </View>
  );

  return (
    <Screen
      scroll={false}
      padded={false}
      testID="continent-screen"
      header={
        <Header
          back
          title={info?.name ?? "Kıta"}
          subtitle={subtitle}
          right={<HeaderIconButton icon="search" label="Ülke ara" hint="Arama ekranını açar" onPress={() => router.push(searchHref())} />}
        />
      }
    >
      <FlatList
        data={countries.items}
        keyExtractor={(country) => country.code}
        renderItem={({ item }) => <CountryRow country={item} onPress={openCountry} />}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={chips}
        ListEmptyComponent={
          countries.isPending ? (
            <SkeletonList count={8} itemHeight={64} label="Ülkeler yükleniyor" />
          ) : countries.isError ? (
            <ErrorState error={countries.error} onRetry={() => void countries.refetch()} retrying={isRefetching} />
          ) : (
            <EmptyState
              icon="earth-outline"
              title="Ülke bulunamadı"
              message={filter === "guided" ? "Bu kıtada henüz seyahat rehberi olan ülke yok." : "Bu kıtada listelenecek ülke yok."}
              actionLabel={filter === "guided" ? "Tüm ülkeleri göster" : undefined}
              onAction={filter === "guided" ? () => setFilter("all") : undefined}
            />
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footer} accessibilityRole="progressbar" accessibilityLabel="Daha fazla ülke yükleniyor">
              <ActivityIndicator color={colors.gold} />
            </View>
          ) : countries.isError && countries.items.length > 0 ? (
            <ErrorState error={countries.error} onRetry={() => void countries.fetchNextPage()} title="Liste tamamlanamadı" />
          ) : null
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.6}
        refreshControl={<ThemedRefreshControl refreshing={isRefetching && !isFetchingNextPage} onRefresh={() => void refresh()} />}
        contentContainerStyle={styles.content}
        initialNumToRender={14}
        maxToRenderPerBatch={12}
        windowSize={9}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { maxWidth: CONTENT_MAX_WIDTH, width: "100%", alignSelf: "center", paddingHorizontal: screenPadding, paddingBottom: spacing.xl, flexGrow: 1 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.lg },
  separator: { height: spacing.sm },
  footer: { paddingVertical: spacing.xl, alignItems: "center" },
});
