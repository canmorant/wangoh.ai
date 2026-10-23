/**
 * Görsel ve bayrak adresleri. Veritabanında web yolu olduğu gibi saklanır (`/images/<ad>.avif`); API mutlak adres döner.
 *
 * Web görselleri AVIF'tir ve eski Android sürümleri AVIF çözemez. Web'in `/og/<ad>.jpg` rotası
 * (`apps/web/src/app/og/[file]/route.web.ts`) aynı görseli 1200×630 JPEG'e çevirir; mobil bunu kullanır.
 * Rota yalnız `^[a-z0-9][a-z0-9-]{0,180}$` adlarını kabul eder ve `public/images/<ad>.avif` dosyasını okur.
 */
const WEB_IMAGE = /^\/images\/([a-z0-9][a-z0-9-]{0,180})\.avif$/;

/**
 * - `/images/<ad>.avif` → `${base}/og/<ad>.jpg` (JPEG varyantı)
 * - `https://...` (harici görsel) → olduğu gibi
 * - başka bir web yolu → `${base}` + yol
 */
export function imageUrl(base: string, image: string | null | undefined): string | null {
  if (!image) return null;
  if (/^https:\/\//i.test(image)) return image;
  const match = WEB_IMAGE.exec(image);
  if (match) return `${base}/og/${match[1]}.jpg`;
  return `${base}${image.startsWith("/") ? "" : "/"}${image}`;
}

/** Web'in kendi görsel yolu mu (`/images/<ad>.avif`)? Atıf kaydı yalnız bu adlar için tutulur. */
export function isWebImagePath(value: string): boolean {
  return WEB_IMAGE.test(value);
}

/**
 * Tohum blog yazılarının kapak adresleri `export-blog-seed.ts` içinde bu kaynağa sabittir (ortam değişkenine bağlı değil);
 * `ASSETS_BASE_URL` başka bir değere ayarlansa da bu kaynağın web görselleri çözülür.
 */
export const CANONICAL_ASSETS_ORIGIN = "https://wangoh.com";

const OG_PATH = /^\/og\/([a-z0-9][a-z0-9-]{0,180})\.jpg$/;

/**
 * Mutlak bir görsel adresini web görsel yoluna (`/images/<ad>.avif`) çevirir; atıf kaydı bu yolla aranır. Tanınan biçimler:
 * `imageUrl`ın ürettiği `<kaynak>/og/<ad>.jpg` ve `<kaynak>/images/<ad>.avif`. `origins` dışındaki adresler (harici siteler)
 * çözülmez: aynı ada sahip başka bir sitenin görseline yanlış atıf bağlanmasın. Çözülemezse `null`.
 */
export function webImagePathOf(value: string | null | undefined, origins: readonly string[]): string | null {
  if (!value) return null;
  if (WEB_IMAGE.test(value)) return value;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.username !== "" || url.password !== "" || !origins.includes(url.origin)) return null;
  const og = OG_PATH.exec(url.pathname);
  if (og) return `/images/${og[1]}.avif`;
  return WEB_IMAGE.test(url.pathname) ? url.pathname : null;
}

/** Bayrak SVG'si: `${base}/flags/<iso2 küçük harf>.svg` (apps/web/public/flags). */
export function flagUrl(base: string, countryCode: string): string {
  return `${base}/flags/${countryCode.toLowerCase()}.svg`;
}

/** Boşluk ya da kontrol karakteri (U+0000–U+0020, U+007F) var mı? */
function hasControlOrSpace(value: string): boolean {
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code <= 0x20 || code === 0x7f) return true;
  }
  return false;
}

/** Yazma uçlarında kabul edilen adres: yalnız https, kimlik bilgisi yok, kontrol/boşluk karakteri yok, alan adı noktalı. */
export function isHttpsUrl(value: string): boolean {
  if (value.length > 2048 || hasControlOrSpace(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.username === "" && url.password === "" && url.hostname.includes(".");
  } catch {
    return false;
  }
}

/** Yazma uçlarında kabul edilen görsel değeri: web AVIF yolu (`/images/<ad>.avif`) ya da https adresi. */
export function isAcceptedImage(value: string): boolean {
  return WEB_IMAGE.test(value) || isHttpsUrl(value);
}
