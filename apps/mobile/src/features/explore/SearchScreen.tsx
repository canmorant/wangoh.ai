import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

import { colors, screenPadding, spacing } from "@/theme";
import { EmptyState, ErrorState, Header, Screen, SkeletonList, Text, ThemedRefreshControl } from "@/ui";

import { CountryRow } from "./components/CountryCards";
import { SearchField } from "./components/SearchField";
import { useDebouncedValue, useInfiniteCountries } from "./hooks";
import { CONTENT_MAX_WIDTH } from "./layout";
import { countryHref } from "./lib/routes";
import { SEARCH_DEBOUNCE_MS, isSearchable, normalizeSearchQuery } from "./lib/search";

function Separator() {
  return <View style={styles.separator} />;
}

/**
 * Ülke araması (`/search?q=...`). Girdi 300 ms beklenip normalleştirilir ve `q` ile
 * `useContentListCountries` ailesine gönderilir; büyük/küçük harf ve Türkçe i/ı eşlemesi API'de yapılır.
 */
export function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string | string[] }>();
  const urlQuery = (Array.isArray(params.q) ? params.q[0] : params.q) ?? "";

  const [text, setText] = useState(urlQuery);
  const debounced = useDebouncedValue(text, SEARCH_DEBOUNCE_MS);
  const query = normalizeSearchQuery(debounced);
  const searchable = isSearchable(query);

  // Adres çubuğu/derin bağlantı arama metnini taşısın (paylaşılabilir, geri gelince korunur).
  useEffect(() => {
    if (query !== normalizeSearchQuery(urlQuery)) router.setParams({ q: query || undefined });
    // `urlQuery` bilerek bağımlılık dışı: yalnız kullanıcı yazınca adres güncellenir.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const results = useInfiniteCountries(searchable ? { q: query } : {}, { enabled: searchable, keepPrevious: true });
  const openCountry = useCallback((code: string) => router.push(countryHref(code)), [router]);
  const { hasNextPage, isFetchingNextPage, fetchNextPage, isRefetching, refetch } = results;
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const waiting = normalizeSearchQuery(text) !== query;
  const stale = results.isPlaceholderData || waiting;

  let empty;
  if (!searchable) {
    empty = (
      <EmptyState
        icon="search-outline"
        title="Ülke ara"
        message="Ülke adı, resmî ad ya da başkent yaz (en az 2 harf). Büyük/küçük harf ve Türkçe karakterler fark etmez."
      />
    );
  } else if (results.isPending) {
    empty = <SkeletonList count={6} itemHeight={64} label="Aranıyor" />;
  } else if (results.isError) {
    empty = <ErrorState error={results.error} onRetry={() => void refetch()} retrying={isRefetching} />;
  } else {
    empty = (
      <EmptyState
        icon="earth-outline"
        title="Sonuç bulunamadı"
        message={`“${query}” ile eşleşen ülke yok. Yazımı kontrol edip yeniden dene.`}
      />
    );
  }

  const summary =
    searchable && !results.isPending && !results.isError && results.total ? (
      <Text variant="small" color="textSecondary" style={styles.summary} accessibilityLiveRegion="polite">
        {`${results.total} ülke bulundu`}
      </Text>
    ) : null;

  return (
    <Screen
      scroll={false}
      padded={false}
      testID="search-screen"
      header={
        <>
          <Header back title="Ara" subtitle="Ülke adı, resmî ad ya da başkent" />
          <View style={styles.fieldBlock}>
            <SearchField value={text} onChangeText={setText} autoFocus={urlQuery === ""} testID="search-input" />
          </View>
        </>
      }
    >
      <FlatList
        data={searchable ? results.items : []}
        keyExtractor={(country) => country.code}
        renderItem={({ item }) => (
          <View style={stale ? styles.stale : undefined}>
            <CountryRow country={item} onPress={openCountry} />
          </View>
        )}
        extraData={stale}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={summary}
        ListEmptyComponent={empty}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footer} accessibilityRole="progressbar" accessibilityLabel="Daha fazla sonuç yükleniyor">
              <ActivityIndicator color={colors.gold} />
            </View>
          ) : null
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.6}
        refreshControl={searchable ? <ThemedRefreshControl refreshing={isRefetching && !isFetchingNextPage} onRefresh={() => void refetch()} /> : undefined}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        initialNumToRender={12}
        windowSize={9}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { maxWidth: CONTENT_MAX_WIDTH, width: "100%", alignSelf: "center", paddingHorizontal: screenPadding, paddingBottom: spacing.xl, flexGrow: 1 },
  stale: { opacity: 0.6 },
  fieldBlock: { maxWidth: CONTENT_MAX_WIDTH, width: "100%", alignSelf: "center", paddingHorizontal: screenPadding, paddingBottom: spacing.sm },
  summary: { marginBottom: spacing.md },
  separator: { height: spacing.sm },
  footer: { paddingVertical: spacing.xl, alignItems: "center" },
});
