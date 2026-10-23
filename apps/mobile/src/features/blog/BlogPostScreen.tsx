import { useBlogGetPost, useContentListContinents } from "@wangoh/api-client";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { getErrorStatus } from "@/api/errors";
import { ImageCredits } from "@/features/credits";
import { spacing } from "@/theme";
import { Badge, Button, Chip, Divider, EmptyState, ErrorState, Header, RemoteImage, Screen, Skeleton, Text } from "@/ui";

import { bodyWordCount, sanitizeBlocks } from "./blockModel";
import { BlockRenderer } from "./components/BlockRenderer";
import { formatDateTr, readingMinutes, tagLabel } from "./format";
import { blogListHref, countryHref } from "./navigation";

/** Üst bileşenin kolonu: geniş ekranda (tablet, web) satır uzunluğu okunur kalsın. */
const COLUMN_MAX_WIDTH = 720;

function goBackToList() {
  if (router.canGoBack()) router.back();
  else router.dismissTo("/blog");
}

/** Blog yazısı ayrıntısı. `/blog/<slug>` derin bağlantısıyla doğrudan açılabilir; herkese açık. */
export function BlogPostScreen() {
  const params = useLocalSearchParams<{ slug?: string | string[] }>();
  const slug = (Array.isArray(params.slug) ? params.slug[0] : params.slug) ?? "";

  const post = useBlogGetPost(slug, { lang: "tr" }, { query: { enabled: slug !== "" } });
  const continents = useContentListContinents({ lang: "tr" });
  const continentNames = useMemo(
    () => Object.fromEntries((continents.data ?? []).map((continent) => [continent.slug, continent.name])),
    [continents.data],
  );
  const blocks = useMemo(() => sanitizeBlocks(post.data?.body), [post.data?.body]);

  const header = <Header title="Blog" back={goBackToList} />;

  if (slug === "" || (post.isError && getErrorStatus(post.error) === 404)) {
    return (
      <Screen header={header}>
        <EmptyState
          icon="document-text-outline"
          title="Yazı bulunamadı"
          message="Aradığın yazı kaldırılmış ya da adresi değişmiş olabilir."
          actionLabel="Tüm yazılara dön"
          onAction={() => router.dismissTo("/blog")}
        />
      </Screen>
    );
  }

  if (post.isPending) {
    return (
      <Screen header={header}>
        <View style={styles.column} accessibilityRole="progressbar" accessibilityLabel="Yazı yükleniyor" accessibilityLiveRegion="polite">
          <Skeleton height={200} radius={16} />
          <Skeleton height={28} width="90%" />
          <Skeleton height={28} width="60%" />
          <Skeleton height={16} />
          <Skeleton height={16} />
          <Skeleton height={16} width="80%" />
        </View>
      </Screen>
    );
  }

  if (post.isError) {
    return (
      <Screen header={header}>
        <ErrorState error={post.error} title="Yazı yüklenemedi" onRetry={() => void post.refetch()} retrying={post.isFetching} />
      </Screen>
    );
  }

  const data = post.data;
  const date = formatDateTr(data.publishedAt);
  const minutes = readingMinutes(bodyWordCount(blocks));
  const meta = [date, data.author?.displayName, blocks.length > 0 ? `${minutes} dk okuma` : null].filter(Boolean).join(" · ");

  return (
    <Screen header={header} onRefresh={() => post.refetch()}>
      <View style={styles.column}>
        {data.coverImage ? <RemoteImage uri={data.coverImage} alt="" aspectRatio={16 / 9} radius={16} /> : null}

        <View style={styles.titleBlock}>
          {data.status === "draft" ? <Badge label="Taslak: yalnız yöneticiler görür" tone="gold" /> : null}
          <Text variant="title" accessibilityRole="header">
            {data.title}
          </Text>
          {meta ? (
            <Text variant="small" color="textMuted">
              {meta}
            </Text>
          ) : null}
        </View>

        {data.tags.length > 0 ? (
          <View style={styles.tags} accessibilityLabel="Etiketler">
            {data.tags.map((tag) => (
              <Chip
                key={tag}
                label={tagLabel(tag, continentNames)}
                accessibilityHint="Bu etikete sahip yazıları listeler"
                onPress={() => router.dismissTo(blogListHref(tag))}
              />
            ))}
          </View>
        ) : null}

        {data.excerpt ? (
          <Text variant="body" color="textSecondary">
            {data.excerpt}
          </Text>
        ) : null}

        <Divider />

        <BlockRenderer blocks={blocks} />

        <Divider />

        <View style={styles.actions}>
          {data.countryCode ? (
            <Button
              title="Ülke rehberine git"
              fullWidth
              onPress={() => router.push(countryHref(data.countryCode as string))}
              accessibilityHint="Bu yazıyla ilgili ülkenin rehber sayfasını açar"
            />
          ) : null}
          <Button title="Tüm yazılar" variant="secondary" fullWidth onPress={() => router.dismissTo("/blog")} />
        </View>

        {/* Görsel atıfları (CC BY / CC BY-SA koşulu): kaydırmanın en sonu, kapak görseli için. */}
        <ImageCredits credits={data.imageCredits} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  column: { width: "100%", maxWidth: COLUMN_MAX_WIDTH, alignSelf: "center", gap: spacing.lg, paddingBottom: spacing.xl },
  titleBlock: { gap: spacing.sm, alignItems: "flex-start" },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  actions: { gap: spacing.md },
});
