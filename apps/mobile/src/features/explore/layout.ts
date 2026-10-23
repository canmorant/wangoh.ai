import { useWindowDimensions } from "react-native";

import { screenPadding, spacing } from "@/theme";

/** Tablet ve web önizlemede içerik bu genişliği aşmaz, ortalanır. */
export const CONTENT_MAX_WIDTH = 720;

/** Şehir ızgarası sütun sayısı eşiği: bu genişliğin üstünde üç sütun. */
const THREE_COLUMN_MIN_WIDTH = 640;

export interface GridMetrics {
  columns: number;
  /** Tek hücrenin genişliği (px). */
  itemWidth: number;
  gap: number;
}

/** Pencere genişliğinden ızgara ölçüleri (FlatList `numColumns` için sabit hücre genişliği). */
export function useGridMetrics(): GridMetrics {
  const { width } = useWindowDimensions();
  const content = Math.min(width, CONTENT_MAX_WIDTH) - screenPadding * 2;
  const columns = width >= THREE_COLUMN_MIN_WIDTH ? 3 : 2;
  const gap = spacing.md;
  return { columns, gap, itemWidth: Math.floor((content - gap * (columns - 1)) / columns) };
}
