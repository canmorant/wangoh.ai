import sharp from "sharp";
import { type NextRequest } from "next/server";

/**
 * Paylaşım görseli: /og/<ad>.jpg → public/images/<ad>.avif'in 1200×630 JPEG'i.
 *
 * Sitedeki görseller AVIF. Tarayıcılar için ideal, ama Facebook, WhatsApp,
 * LinkedIn, X ve Slack'in önizleme tarayıcıları AVIF'i göstermiyor; og:image
 * AVIF olunca paylaşılan bağlantı görselsiz çıkıyordu. Bu uç nokta aynı
 * görseli Open Graph'ın önerdiği ölçüde JPEG'e çevirir. Sonuç bir yıl
 * önbellekte kalır: dosya adları içerik özetli, aynı ad hep aynı görsel.
 *
 * Dosya adı route.web.ts: yalnız web derlemesinde (uygulamada sunucu yok).
 */
const NAME = /^[a-z0-9][a-z0-9-]{0,180}$/;

export async function GET(request: NextRequest, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const name = file.endsWith(".jpg") ? file.slice(0, -4) : "";
  if (!NAME.test(name)) return new Response(null, { status: 404 });

  const source = await fetch(new URL(`/images/${name}.avif`, request.nextUrl.origin));
  if (!source.ok) return new Response(null, { status: 404 });

  const jpeg = await sharp(Buffer.from(await source.arrayBuffer()))
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

  return new Response(new Uint8Array(jpeg), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
