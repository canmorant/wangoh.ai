import { absolute } from "./site";

/** Open Graph'ın önerdiği paylaşım görseli ölçüsü. */
export const OG_SIZE = { width: 1200, height: 630 } as const;

/**
 * Bir sayfa görselinin paylaşım (og:image / twitter:image) sürümü.
 *
 * Yerel AVIF görseller /og/<ad>.jpg uç noktasından JPEG olarak verilir
 * (bkz. app/og/[file]/route.web.ts); sosyal ağ önizlemeleri AVIF okumuyor.
 * Uzak görseller (Wikimedia, Unsplash) zaten JPEG/PNG; olduğu gibi kalır.
 */
export function ogImage(src: string | undefined, alt: string) {
  if (!src) return undefined;
  const local = src.match(/^\/images\/([a-z0-9-]+)\.avif$/);
  if (!local) return { url: src, alt };
  return { url: absolute(`/og/${local[1]}.jpg`), ...OG_SIZE, alt };
}
