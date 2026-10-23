import { useQueryClient } from "@tanstack/react-query";
import { blogListPosts, getBlogListPostsQueryKey, useBlogUpdatePost, type BlogListPostsParams, type BlogPostSummaryDto } from "@wangoh/api-client";
import { router } from "expo-router";
import { memo, useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { screenPadding, spacing } from "@/theme";
import { Badge, Button, Card, Text } from "@/ui";

import { FilterChips } from "../../blog/components/FilterChips";
import { SearchField } from "../../blog/components/SearchField";
import { formatDateTr } from "../../blog/format";
import { useDebouncedValue } from "../../blog/useDebouncedValue";
import { usePagedQuery } from "../../blog/usePagedQuery";
import { Banner } from "../components/Banner";
import { PagedList } from "../components/PagedList";
import { invalidatePosts } from "../invalidate";
import { ADMIN_NEW_POST_HREF, adminPostHref } from "../navigation";
import { hasErrors, mapServerErrors } from "../postForm";

const PAGE_SIZE = 20;

type StatusFilter = "published" | "draft";
const STATUS_OPTIONS = [
  { value: "published" as const, label: "Yayında" },
  { value: "draft" as const, label: "Taslak" },
];

interface PostRowProps {
  post: BlogPostSummaryDto;
  busy: boolean;
  onToggle: (post: BlogPostSummaryDto) => void;
}

const PostRow = memo(function PostRow({ post, busy, onToggle }: PostRowProps) {
  const published = post.status === "published";
  const date = formatDateTr(published ? post.publishedAt : post.createdAt);
  const label = [post.title, published ? "yayında" : "taslak", date].filter(Boolean).join(", ");
  return (
    <Card onPress={() => router.push(adminPostHref(post.slug))} accessibilityLabel={label} accessibilityHint="Yazıyı düzenler" testID={`admin-post-${post.slug}`}>
      <View style={styles.row}>
        <Text variant="bodyStrong" numberOfLines={2}>
          {post.title}
        </Text>
        <Text variant="caption" color="textMuted" numberOfLines={1}>
          {post.slug}
        </Text>
        <View style={styles.badges}>
          <Badge label={published ? "Yayında" : "Taslak"} tone={published ? "success" : "gold"} />
          {post.countryCode ? <Badge label={post.countryCode} /> : null}
          {date ? (
            <Text variant="caption" color="textMuted">
              {published ? "Yayın" : "Oluşturulma"}: {date}
            </Text>
          ) : null}
        </View>
        <View style={styles.actions}>
          <Button
            title={published ? "Taslağa al" : "Yayınla"}
            size="sm"
            variant="secondary"
            loading={busy}
            onPress={() => onToggle(post)}
            accessibilityLabel={`${post.title}: ${published ? "taslağa al" : "yayınla"}`}
          />
        </View>
      </View>
    </Card>
  );
});

/** Yazılar: taslaklar dahil liste (status=all), arama, durum süzgeci, hızlı yayınla / taslağa al, yeni yazı. */
export function PostsSection() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const q = useDebouncedValue(search.trim(), 400);
  const [status, setStatus] = useState<StatusFilter | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: updatePost } = useBlogUpdatePost();

  const params = useMemo<BlogListPostsParams>(
    () => ({ lang: "tr", status: status ?? "all", pageSize: PAGE_SIZE, ...(q ? { q } : {}) }),
    [q, status],
  );
  const feed = usePagedQuery<BlogPostSummaryDto>({
    queryKey: getBlogListPostsQueryKey(params),
    fetchPage: (page, signal) => blogListPosts({ ...params, page }, { signal }),
    keepPrevious: true,
    staleTime: 0,
  });

  const toggle = useCallback(
    async (post: BlogPostSummaryDto) => {
      setError(null);
      setBusyId(post.id);
      try {
        await updatePost({ id: post.id, data: { status: post.status === "published" ? "draft" : "published" } });
        await invalidatePosts(queryClient, [post.slug]);
      } catch (caught) {
        const errors = mapServerErrors(caught);
        setError(hasErrors(errors) ? [errors.form, ...errors.body, ...Object.values(errors.fields)].filter(Boolean)[0]! : "Durum değiştirilemedi.");
      } finally {
        setBusyId(null);
      }
    },
    [queryClient, updatePost],
  );

  const renderItem = useCallback((post: BlogPostSummaryDto) => <PostRow post={post} busy={busyId === post.id} onToggle={toggle} />, [busyId, toggle]);
  const clear = useCallback(() => {
    setSearch("");
    setStatus(null);
  }, []);

  return (
    <View style={styles.fill}>
      <View style={styles.filters}>
        <Button title="Yeni yazı" onPress={() => router.push(ADMIN_NEW_POST_HREF)} fullWidth size="sm" testID="admin-new-post" />
        <SearchField value={search} onChangeText={setSearch} placeholder="Başlık, özet ya da adres ara" accessibilityLabel="Yazılarda ara" testID="admin-posts-search" />
        <FilterChips options={STATUS_OPTIONS} value={status} onChange={setStatus} accessibilityLabel="Duruma göre süz" />
        {error ? <Banner message={error} testID="admin-posts-error" /> : null}
      </View>
      <PagedList
        feed={feed}
        renderItem={renderItem}
        filtered={q !== "" || status !== null}
        onClearFilters={clear}
        emptyIcon="newspaper-outline"
        emptyTitle="Henüz yazı yok"
        emptyMessage="“Yeni yazı” ile ilk yazıyı oluştur."
        errorTitle="Yazılar yüklenemedi"
        skeletonLabel="Yazılar yükleniyor"
        skeletonHeight={120}
        noun="yazı"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  filters: { gap: spacing.sm, paddingHorizontal: screenPadding, paddingBottom: spacing.sm },
  row: { gap: spacing.xs },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, alignItems: "center", marginTop: spacing.xs },
  actions: { flexDirection: "row", justifyContent: "flex-end", marginTop: spacing.sm },
});
