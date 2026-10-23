import { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { colors, radius, spacing } from "@/theme";
import { RemoteImage, Text } from "@/ui";

import { sanitizeBlocks } from "../blockModel";
import type { BlogBlock } from "../blockTypes";

export interface BlockRendererProps {
  /** API'den gelen gövde. Güvenli olmayan ya da bilinmeyen bloklar sessizce atlanır. */
  blocks: unknown;
}

/**
 * Blog gövdesini yerel bileşenlerle çizer: başlık, paragraf, liste, alıntı, görsel. HTML/Markdown yorumlanmaz,
 * metin her zaman düz `Text`tir. Başlıklar ekran okuyucuya başlık olarak, görseller alt metinle bildirilir.
 */
function BlockRendererView({ blocks }: BlockRendererProps) {
  const safe = useMemo(() => sanitizeBlocks(blocks), [blocks]);
  return (
    <View style={styles.column}>
      {safe.map((block, index) => (
        <BlockView key={index} block={block} />
      ))}
    </View>
  );
}

export const BlockRenderer = memo(BlockRendererView);

function BlockView({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "heading":
      return block.level === 3 ? (
        <Text variant="subheading" accessibilityRole="header" style={styles.h3}>
          {block.text}
        </Text>
      ) : (
        <Text variant="heading" accessibilityRole="header" style={styles.h2}>
          {block.text}
        </Text>
      );
    case "paragraph":
      return (
        <Text variant="body" selectable style={styles.paragraph}>
          {block.text}
        </Text>
      );
    case "list":
      return (
        <View role="list" style={styles.list}>
          {block.items.map((item, index) => (
            <View key={index} role="listitem" style={styles.item}>
              <Text variant="body" color={block.ordered ? "gold" : "textSecondary"} style={styles.marker} accessibilityElementsHidden={!block.ordered}>
                {block.ordered ? `${index + 1}.` : "•"}
              </Text>
              <Text variant="body" selectable style={styles.itemText}>
                {item}
              </Text>
            </View>
          ))}
        </View>
      );
    case "quote":
      return (
        <View style={styles.quote}>
          <Text variant="body" selectable style={styles.quoteText}>
            {block.text}
          </Text>
          {block.cite ? (
            <Text variant="small" color="textSecondary" style={styles.cite}>
              {`— ${block.cite}`}
            </Text>
          ) : null}
        </View>
      );
    case "image":
      return (
        <View role="figure" style={styles.figure}>
          <RemoteImage uri={block.url} alt={block.alt} aspectRatio={16 / 10} radius={radius.md} />
          {block.caption ? (
            <Text variant="caption" color="textMuted" style={styles.caption}>
              {block.caption}
            </Text>
          ) : null}
        </View>
      );
  }
}

const styles = StyleSheet.create({
  column: { gap: spacing.md },
  h2: { marginTop: spacing.lg },
  h3: { marginTop: spacing.sm },
  paragraph: {},
  list: { gap: spacing.sm },
  item: { flexDirection: "row", gap: spacing.sm },
  marker: { width: 24, textAlign: "right" },
  itemText: { flex: 1 },
  quote: {
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
    paddingLeft: spacing.lg,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  quoteText: { fontStyle: "italic", color: colors.textSecondary },
  cite: { marginTop: spacing.xs },
  figure: { gap: spacing.xs },
  caption: {},
});
