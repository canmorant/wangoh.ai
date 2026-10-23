import { useCallback, useState, type ComponentProps, type ReactElement } from "react";
import { ActivityIndicator, FlatList, Platform, StyleSheet, View } from "react-native";

import { screenPadding, spacing } from "@/theme";
import { Button, EmptyState, ErrorState, SkeletonList, Text, ThemedRefreshControl } from "@/ui";

import type { PagedQueryResult } from "../../blog/usePagedQuery";

type IconName = ComponentProps<typeof EmptyState>["icon"];

export interface PagedListProps<T extends { id: string }> {
  feed: PagedQueryResult<T>;
  renderItem: (item: T) => ReactElement;
  /** Süzgeç/arama açık mı? Boş durum metni ve "temizle" eylemi buna göre değişir. */
  filtered: boolean;
  onClearFilters?: () => void;
  emptyIcon?: IconName;
  emptyTitle: string;
  emptyMessage: string;
  errorTitle: string;
  skeletonHeight?: number;
  skeletonLabel: string;
  /** "{n} kayıt" sayacında kullanılan ad ("kullanıcı", "yazı", "skor"). */
  noun: string;
}

/** Yönetim listeleri için ortak iskelet: yükleniyor / hata / boş durumları, sonsuz kaydırma, çek-yenile. */
export function PagedList<T extends { id: string }>({
  feed,
  renderItem,
  filtered,
  onClearFilters,
  emptyIcon = "file-tray-outline",
  emptyTitle,
  emptyMessage,
  errorTitle,
  skeletonHeight = 76,
  skeletonLabel,
  noun,
}: PagedListProps<T>) {
  const [manualRefreshing, setManualRefreshing] = useState(false);
  const refresh = useCallback(async () => {
    setManualRefreshing(true);
    try {
      await feed.refetch();
    } finally {
      setManualRefreshing(false);
    }
  }, [feed]);

  if (feed.isPending) {
    return (
      <View style={styles.fill}>
        <SkeletonList count={5} itemHeight={skeletonHeight} label={skeletonLabel} />
      </View>
    );
  }

  if (feed.isError && feed.items.length === 0) {
    return (
      <View style={styles.fill}>
        <ErrorState error={feed.error} title={errorTitle} onRetry={() => void feed.refetch()} retrying={feed.isFetching} />
      </View>
    );
  }

  return (
    <FlatList
      data={feed.items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => renderItem(item)}
      ListHeaderComponent={
        feed.items.length > 0 ? (
          <Text variant="caption" color="textMuted" style={styles.count} accessibilityLiveRegion="polite">
            {feed.total} {noun}
          </Text>
        ) : null
      }
      ListEmptyComponent={
        <EmptyState
          icon={filtered ? "search-outline" : emptyIcon}
          title={filtered ? "Sonuç bulunamadı" : emptyTitle}
          message={filtered ? "Seçili süzgeçlere uyan kayıt yok. Süzgeçleri değiştirip tekrar dene." : emptyMessage}
          actionLabel={filtered && onClearFilters ? "Süzgeçleri temizle" : undefined}
          onAction={filtered ? onClearFilters : undefined}
        />
      }
      ListFooterComponent={
        feed.isFetchingNextPage ? (
          <View style={styles.footer} accessibilityRole="progressbar" accessibilityLabel="Daha fazlası yükleniyor">
            <ActivityIndicator />
          </View>
        ) : feed.isNextPageError ? (
          <View style={styles.footer}>
            <Text variant="small" color="textSecondary" align="center">
              Daha fazlası yüklenemedi.
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
      initialNumToRender={8}
      maxToRenderPerBatch={8}
      windowSize={9}
      removeClippedSubviews={Platform.OS === "android"}
      showsVerticalScrollIndicator={false}
    />
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  fill: { flex: 1, paddingHorizontal: screenPadding },
  content: { paddingHorizontal: screenPadding, paddingBottom: screenPadding * 2, flexGrow: 1 },
  count: { marginBottom: spacing.sm },
  separator: { height: spacing.sm },
  footer: { paddingVertical: spacing.xl, alignItems: "center", gap: spacing.md },
  stale: { opacity: 0.6 },
});
