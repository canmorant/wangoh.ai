import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { screenPadding, spacing } from "@/theme";
import { ErrorState, Header, Screen, SectionHeader, Skeleton, Text } from "@/ui";

import { ContinentCard } from "./components/ContinentCard";
import { FEATURED_CARD_WIDTH, FeaturedCountryCard } from "./components/CountryCards";
import { SearchField } from "./components/SearchField";
import { FEATURED_PAGE_SIZE, useContinents, useInfiniteCountries } from "./hooks";
import { CONTENT_MAX_WIDTH } from "./layout";
import { normalizeSearchQuery } from "./lib/search";
import { continentHref, countryHref, searchHref, type ContinentSlug } from "./lib/routes";

function Separator() {
  return <View style={styles.hSeparator} />;
}

function ContinentsSkeleton() {
  return (
    <View style={styles.continentGrid} accessible accessibilityRole="progressbar" accessibilityLabel="Kıtalar yükleniyor">
      {[0, 1, 2, 3].map((key) => (
        <Skeleton key={key} height={108} radius={16} style={styles.continentSkeleton} />
      ))}
    </View>
  );
}

function FeaturedSkeleton() {
  return (
    <View style={styles.featuredSkeletonRow} accessible accessibilityRole="progressbar" accessibilityLabel="Ülkeler yükleniyor">
      {[0, 1, 2].map((key) => (
        <Skeleton key={key} width={FEATURED_CARD_WIDTH} height={190} radius={16} />
      ))}
    </View>
  );
}

/** Keşfet ana ekranı: arama kutusu, kıta kartları ve seyahat rehberi olan ülkeler şeridi. Herkese açık. */
export function ExploreScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const continents = useContinents();
  const featured = useInfiniteCountries({ hasTravel: true }, { pageSize: FEATURED_PAGE_SIZE });

  const { refetch: refetchContinents } = continents;
  const { refetch: refetchFeatured } = featured;
  const refresh = useCallback(() => Promise.all([refetchContinents(), refetchFeatured()]), [refetchContinents, refetchFeatured]);

  const openCountry = useCallback((code: string) => router.push(countryHref(code)), [router]);
  const openContinent = useCallback((slug: ContinentSlug) => router.push(continentHref(slug)), [router]);
  const submitSearch = useCallback(() => router.push(searchHref(normalizeSearchQuery(query))), [router, query]);

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = featured;
  const loadMoreFeatured = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const bothFailed = continents.isError && featured.isError && !continents.data && featured.items.length === 0;

  return (
    <Screen
      header={<Header title="Keşfet" subtitle="Kıtalar, ülkeler ve şehir rehberleri" right={<Text variant="label" color="gold">WANGOH</Text>} />}
      onRefresh={refresh}
      contentContainerStyle={styles.content}
      testID="explore-home"
    >
      <SearchField
        value={query}
        onChangeText={setQuery}
        onSubmit={submitSearch}
        placeholder="Ülke, resmî ad ya da başkent ara"
        accessibilityLabel="Ülke ara"
        testID="explore-search"
      />

      {bothFailed ? (
        <ErrorState error={continents.error} onRetry={() => void refresh()} retrying={continents.isRefetching || featured.isRefetching} />
      ) : (
        <>
          <SectionHeader title="Kıtalar" />
          {continents.isPending ? (
            <ContinentsSkeleton />
          ) : continents.isError ? (
            <ErrorState error={continents.error} onRetry={() => void continents.refetch()} retrying={continents.isRefetching} />
          ) : (
            <View style={styles.continentGrid}>
              {continents.data.map((continent) => (
                <ContinentCard key={continent.slug} continent={continent} onPress={openContinent} />
              ))}
            </View>
          )}

          <SectionHeader title="Seyahat rehberi olan ülkeler" />
          {featured.total !== undefined ? (
            <Text variant="small" color="textSecondary" style={styles.sectionNote}>
              {featured.total} ülke için şehir şehir rehber
            </Text>
          ) : null}
          {featured.isPending ? (
            <FeaturedSkeleton />
          ) : featured.isError && featured.items.length === 0 ? (
            <ErrorState error={featured.error} onRetry={() => void featured.refetch()} retrying={featured.isRefetching} />
          ) : (
            <FlatList
              horizontal
              data={featured.items}
              keyExtractor={(country) => country.code}
              renderItem={({ item }) => <FeaturedCountryCard country={item} onPress={openCountry} />}
              ItemSeparatorComponent={Separator}
              ListFooterComponent={
                featured.isFetchingNextPage ? (
                  <View style={styles.footerSkeleton}>
                    <Skeleton width={FEATURED_CARD_WIDTH} height={190} radius={16} />
                  </View>
                ) : null
              }
              onEndReached={loadMoreFeatured}
              onEndReachedThreshold={0.6}
              showsHorizontalScrollIndicator={false}
              initialNumToRender={4}
              windowSize={5}
              contentContainerStyle={styles.featuredContent}
              style={styles.featuredList}
              accessibilityLabel="Seyahat rehberi olan ülkeler"
            />
          )}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { maxWidth: CONTENT_MAX_WIDTH, width: "100%", alignSelf: "center", paddingBottom: spacing.xl },
  continentGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  continentSkeleton: { flexGrow: 1, flexBasis: "46%" },
  sectionNote: { marginTop: -spacing.xs, marginBottom: spacing.md },
  // Şerit ekran kenarından kenara kayar; içerik boşluğu başlangıçta korunur.
  featuredList: { marginHorizontal: -screenPadding, flexGrow: 0 },
  featuredContent: { paddingHorizontal: screenPadding },
  hSeparator: { width: spacing.md },
  featuredSkeletonRow: { flexDirection: "row", gap: spacing.md, overflow: "hidden" },
  footerSkeleton: { marginLeft: spacing.md },
});
