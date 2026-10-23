import type { BlogPostSummaryDto } from "@wangoh/api-client";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

import { spacing } from "@/theme";
import { Badge, Card, RemoteImage, Text } from "@/ui";

import { formatDateTr, tagLabel } from "../format";

export interface PostCardProps {
  post: BlogPostSummaryDto;
  /** Kıta etiketlerinin Türkçe adları (slug -> ad). */
  continentNames?: Readonly<Record<string, string>>;
  onPress: (post: BlogPostSummaryDto) => void;
  /** Yönetici görünümü: taslak rozeti gösterilir. */
  showStatus?: boolean;
}

const MAX_TAGS_ON_CARD = 3;

/** Liste kartı: kapak, başlık, özet, etiketler ve yayın tarihi / yazar. */
function PostCardView({ post, continentNames, onPress, showStatus = false }: PostCardProps) {
  const date = formatDateTr(post.publishedAt);
  const meta = [date, post.author?.displayName].filter(Boolean).join(" · ");
  const isDraft = post.status === "draft";
  const label = [post.title, isDraft ? "Taslak" : null, meta || null].filter(Boolean).join(". ");

  return (
    <Card
      padded={false}
      onPress={() => onPress(post)}
      accessibilityLabel={label}
      accessibilityHint="Yazıyı açar"
      testID={`blog-card-${post.slug}`}
    >
      {post.coverImage ? <RemoteImage uri={post.coverImage} alt="" aspectRatio={16 / 9} radius={0} /> : null}
      <View style={styles.body}>
        <Text variant="subheading" numberOfLines={3}>
          {post.title}
        </Text>
        {post.excerpt ? (
          <Text variant="small" color="textSecondary" numberOfLines={3}>
            {post.excerpt}
          </Text>
        ) : null}
        {post.tags.length > 0 || (showStatus && isDraft) ? (
          <View style={styles.tags}>
            {showStatus && isDraft ? <Badge label="Taslak" tone="gold" /> : null}
            {post.tags.slice(0, MAX_TAGS_ON_CARD).map((tag) => (
              <Badge key={tag} label={tagLabel(tag, continentNames)} />
            ))}
          </View>
        ) : null}
        {meta ? (
          <Text variant="caption" color="textMuted">
            {meta}
          </Text>
        ) : null}
      </View>
    </Card>
  );
}

export const PostCard = memo(PostCardView);

const styles = StyleSheet.create({
  body: { padding: spacing.lg, gap: spacing.sm },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
});
