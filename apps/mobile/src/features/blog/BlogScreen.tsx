import {
  blogListPosts,
  getBlogListPostsQueryKey,
  useBlogListPosts,
  useContentListContinents,
  type BlogListPostsParams,
  type BlogPostSummaryDto,
} from "@wangoh/api-client";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { ActivityIndicator, FlatList, Platform, StyleSheet, View } from "react-native";

import { screenPadding, spacing } from "@/theme";
import { Button, EmptyState, ErrorState, Header, Screen, SkeletonList, Text, ThemedRefreshControl } from "@/ui";

import { FilterChips } from "./components/FilterChips";
import { PostCard } from "./components/PostCard";
import { SearchField } from "./components/SearchField";
import { tagLabel } from "./format";
import { blogPostHref } from "./navigation";
import { collectTags } from "./tags";
import { useDebouncedValue } from "./useDebouncedValue";
import { usePagedQuery } from "./usePagedQuery";

const PAGE_SIZE = 10;
/** Etiket çipleri için bir kerelik geniş sorgu (API'de etiket listesi ucu yok). */
const TAG_SAMPLE_SIZE = 100;
const MAX_TAG_CHIPS = 12;

/** Blog listesi: arama, etiket süzgeci, sonsuz kaydırma, çek-yenile. Herkese açık (oturum gerekmez). */
export function BlogScreen() {
  const params = useLocalSearchParams<{ tag?: string | string[] }>();
  const tag = (Array.isArray(params.tag) ? params.tag[0] : params.tag) || null;

  const [search, setSearch] = useState("");
  const query = useDebouncedValue(search.trim(), 400);
  const [manualRefreshing, setManualRefreshing] = useState(false);

  const listParams = useMemo<BlogListPostsParams>(
    () => ({ lang: "tr", pageSize: PAGE_SIZE, ...(query ? { q: query } : {}), ...(tag ? { tag } : {}) }),
    [query, tag],
  );

  const feed = usePagedQuery<BlogPostSummaryDto>({
    queryKey: getBlogListPostsQueryKey(listParams),
    fetchPage: (page, signal) => blogListPosts({ ...listParams, page }, { signal }),
    keepPrevious: true,
  });

  // Etiket çipleri süzgeçten bağımsız örneklemden çıkar; böylece süzgeç seçilince diğer çipler kaybolmaz.
  const sample = useBlogListPosts({ lang: "tr", pageSize: TAG_SAMPLE_SIZE });
  const continents = useContentListContinents({ lang: "tr" });
  const continentNames = useMemo(
    () => Object.fromEntries((continents.data ?? []).map((continent) => [continent.slug, continent.name])),
    [continents.data],
  );
  const tagOptions = useMemo(
    () => collectTags(sample.data?.items ?? [], MAX_TAG_CHIPS, tag).map((value) => ({ value, label: tagLabel(value, continentNames) })),
    [sample.data, tag, continentNames],
  );

  const selectTag = useCallback((next: string | null) => {
    router.setParams({ tag: next ?? undefined });
  }, []);

  const openPost = useCallback((post: BlogPostSummaryDto) => router.push(blogPostHref(post.slug)), []);

  const refresh = useCallback(async () => {
    setManualRefreshing(true);
    try {
      await feed.refetch();
    } finally {
      setManualRefreshing(false);
    }
  }, [feed]);

  const filtered = query !== "" || tag !== null;
  const clearFilters = () => {
    setSearch("");
    selectTag(null);
  };

  // Arama ve çipler listenin dışında, hep bağlı kalır: yükleme/hata durumları arasında geçerken klavye odağı kaybolmaz.
  const filters = (
    <View style={styles.filters}>
      <SearchField value={search} onChangeText={setSearch} placeholder="Yazılarda ara" accessibilityLabel="Blog yazılarında ara" testID="blog-search" />
      {tagOptions.length > 0 ? <FilterChips options={tagOptions} value={tag} onChange={selectTag} accessibilityLabel="Etiketlere göre süz" /> : null}
      {feed.items.length > 0 ? (
        <Text variant="caption" color="textMuted" accessibilityLiveRegion="polite">
          {feed.total} yazı
        </Text>
      ) : null}
    </View>
  );

  let body: ReactNode;
  if (feed.isPending) {
    body = (
      <View style={styles.padded}>
        <SkeletonList count={3} itemHeight={280} label="Yazılar yükleniyor" />
      </View>
    );
  } else if (feed.isError && feed.items.length === 0) {
    body = (
      <View style={styles.padded}>
        <ErrorState error={feed.error} title="Yazılar yüklenemedi" onRetry={() => void feed.refetch()} retrying={feed.isFetching} />
      </View>
    );
  } else {
    body = (
      <FlatList
        data={feed.items}
        keyExtractor={(post) => post.id}
        renderItem={({ item }) => <PostCard post={item} continentNames={continentNames} onPress={openPost} />}
        ListEmptyComponent={
          <EmptyState
            icon={filtered ? "search-outline" : "newspaper-outline"}
            title={filtered ? "Sonuç bulunamadı" : "Henüz yazı yok"}
            message={filtered ? "Aramana ya da seçtiğin etikete uyan yazı yok. Süzgeçleri temizleyip tekrar dene." : "Yeni gezi yazıları yayınlandıkça burada görünecek."}
            actionLabel={filtered ? "Süzgeçleri temizle" : undefined}
            onAction={filtered ? clearFilters : undefined}
          />
        }
        ListFooterComponent={
          feed.isFetchingNextPage ? (
            <View style={styles.footer} accessibilityRole="progressbar" accessibilityLabel="Daha fazla yazı yükleniyor">
              <ActivityIndicator />
            </View>
          ) : feed.isNextPageError ? (
            <View style={styles.footer}>
              <Text variant="small" color="textSecondary" align="center">
                Daha fazla yazı yüklenemedi.
              </Text>
              <Button title="Tekrar dene" size="sm" variant="secondary" onPress={() => void feed.fetchNextPage()} />
            </View>
          ) : null
        }
        ItemSeparatorComponent={Separator}
        onEndReached={() => {
          if (feed.hasNextPage && !feed.isFetchingNextPage && !feed.isNextPageError) void feed.fetchNextPage();
        }}
        onEndReachedThreshold={0.6}
        refreshControl={<ThemedRefreshControl refreshing={manualRefreshing} onRefresh={refresh} />}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={[styles.content, feed.isPlaceholderData && styles.stale]}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={7}
        removeClippedSubviews={Platform.OS === "android"}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  return (
    <Screen scroll={false} padded={false} header={<Header title="Blog" subtitle="Gezi yazıları ve rota fikirleri" />}>
      {filters}
      {body}
    </Screen>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  padded: { paddingHorizontal: screenPadding, flex: 1 },
  content: { paddingHorizontal: screenPadding, paddingBottom: screenPadding, flexGrow: 1 },
  filters: { gap: spacing.sm, paddingHorizontal: screenPadding, paddingBottom: spacing.sm },
  separator: { height: spacing.lg },
  footer: { paddingVertical: spacing.xl, alignItems: "center", gap: spacing.md },
  stale: { opacity: 0.6 },
});
