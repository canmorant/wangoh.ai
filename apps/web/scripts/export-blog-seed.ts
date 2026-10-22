/**
 * API blog tohumu: öne çıkan her ülkenin merkez sayfası (countryHubs) metinlerinden bir blog yazısı.
 *
 *   npx tsx scripts/export-blog-seed.ts           apps/api/seed/blog-posts.json dosyasını yazar
 *   npx tsx scripts/export-blog-seed.ts --check   dosya güncel değilse 1 koduyla çıkar (yazmaz)
 *
 * Metin YALNIZCA mevcut ülke sayfası içeriğinden türer; yeni bilgi yazılmaz:
 *   başlık   → hub.seoTitle
 *   özet     → hub.cityGridIntro
 *   gövde    → planningHeading (h2) + intro paragrafları,
 *              essentialsHeading (h2) + her madde için h3 + paragraf,
 *              rota fikirleri (h2) + her rota için h3, liste (süre, şehirler) ve açıklama paragrafı.
 *
 * Sabit bölüm etiketleri (Süre, Şehirler, "{ülke} rotaları", "Gitmeden önce bilinmesi gerekenler") web'in
 * messages/<dil>.json dosyalarındaki mevcut karşılıklardan alınır; hiçbiri yeni eklenmez.
 *
 * Bir dil, ülke sayfasının o dildeki hub metni ve ülke verisi TAM çevrilmişse (countryPageLocales ile aynı
 * kural) yazıya eklenir; eksik dil için çeviri uydurulmaz, API Türkçeye düşer. Yalnız canlı diller (tr, en, es).
 *
 * Yalnız ızgarada görünen öne çıkan ülkeler (data/destinations) için yazı üretilir. Svalbard (SJ) sitede bilerek
 * gizli bir hedeftir (data/secret.ts: ızgarada yok, yalnız kaydırmayı sallayınca açılır); hub'ı olsa da blogda
 * herkese açık bir yazıyla ifşa edilmez.
 *
 * Yayın tarihi YAZILMAZ: hub verisinde böyle bir bilgi yok, bu yüzden uydurma bir tarih (ve "şu tarihte yayınlandı"
 * iddiası) taşınmaz. API tohumu yüklerken yazıyı o an ilk kez yayınlamış olur ve yükleme zamanını `publishedAt`
 * olarak atar (apps/api/src/blog/blog.seed.ts; `--force` yeniden yüklemesi var olan zamanı korur).
 *
 * Çıktı deterministiktir: yazılar slug'a göre sıralı, kapak görseli /og/<ad>.jpg kuralıyla
 * (bkz. src/app/og/[file]/route.web.ts, src/lib/ogImage.ts) mutlak https adres.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { countries as worldCountries } from "../src/data/countries";
import { countries, type Country } from "../src/data/destinations";
import { countrySlug } from "../src/content/guides";
import { localizedCountry, localizedHub, placeName } from "../src/content/localized";
import { countryName } from "../src/lib/countryNames";
import type { AppLocale } from "../src/i18n/routing";

type Block =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] };

interface SeedTranslation {
  title: string;
  excerpt: string;
  body: Block[];
}

interface SeedPost {
  slug: string;
  status: "published";
  countryCode: string;
  coverImage: string;
  tags: string[];
  translations: { tr: SeedTranslation } & Partial<Record<"en" | "es", SeedTranslation>>;
}

/** API'nin içerik dilleri ve web'de canlı olanlar (CLAUDE.md → Diller). de/ru/fr yayında değil. */
const LOCALES = ["tr", "en", "es"] as const satisfies readonly AppLocale[];

/** API'nin varsayılan ASSETS_BASE_URL değeri; ortam değişkenine bağlı olmasın diye sabit. */
const ASSETS_BASE_URL = "https://wangoh.com";

const COUNTRY_TAG = "ülke-rehberi";

export const OUT_FILE = join(__dirname, "..", "..", "api", "seed", "blog-posts.json");

/** messages/<dil>.json içinde noktalı yoldaki dizgi; yoksa hata (etiket uydurulmaz). */
const messageCache = new Map<string, unknown>();
function message(locale: AppLocale, path: string): string {
  let root = messageCache.get(locale);
  if (!root) {
    root = JSON.parse(readFileSync(join(__dirname, "..", "messages", `${locale}.json`), "utf8"));
    messageCache.set(locale, root);
  }
  let node: unknown = root;
  for (const key of path.split(".")) {
    if (typeof node !== "object" || node === null || !(key in node)) node = undefined;
    else node = (node as Record<string, unknown>)[key];
  }
  if (typeof node !== "string" || node.trim() === "") {
    throw new Error(`messages/${locale}.json içinde "${path}" bulunamadı.`);
  }
  return node;
}

const continentOf = new Map(worldCountries.map((c) => [c.iso2, c.continent.toLowerCase()]));

function coverImage(country: Country): string {
  const local = /^\/images\/([a-z0-9][a-z0-9-]{0,180})\.avif$/.exec(country.image);
  if (local) {
    if (!existsSync(join(__dirname, "..", "public", "images", `${local[1]}.avif`))) {
      throw new Error(`${country.code}: public/images/${local[1]}.avif yok.`);
    }
    return `${ASSETS_BASE_URL}/og/${local[1]}.jpg`;
  }
  if (/^https:\/\//.test(country.image)) return country.image;
  throw new Error(`${country.code}: kapak görseli https/yerel AVIF değil: ${country.image}`);
}

function buildTranslation(country: Country, locale: AppLocale): SeedTranslation | null {
  const hub = localizedHub(country.code, locale);
  if (!hub) return null;
  // Hub metni ve ülke verisi (şehir adları dahil) o dilde tam çevrilmedikçe dil eklenmez.
  if (!hub.complete || !localizedCountry(country, locale).complete) return null;

  const value = hub.value;
  const body: Block[] = [{ type: "heading", level: 2, text: value.planningHeading }];
  for (const paragraph of value.intro) body.push({ type: "paragraph", text: paragraph });

  if (value.essentials && value.essentials.length > 0) {
    body.push({ type: "heading", level: 2, text: value.essentialsHeading ?? message(locale, "Country.essentials") });
    for (const item of value.essentials) {
      body.push({ type: "heading", level: 3, text: item.title });
      body.push({ type: "paragraph", text: item.body });
    }
  }

  if (value.routeIdeas.length > 0) {
    const label = countryName(country.code, locale, country.name);
    body.push({ type: "heading", level: 2, text: message(locale, "Guide.countryRoutes").replace("{country}", label) });
    for (const route of value.routeIdeas) {
      body.push({ type: "heading", level: 3, text: route.title });
      // Ülke sayfasıyla aynı: ülke şehirleri arasında olmayan ad gösterilmez. `cities` çevrilmeyen anahtardır.
      const cities = route.cities.filter((name) => country.cities.some((c) => c.name === name)).map((name) => placeName(name, locale));
      const facts = [`${message(locale, "BoardingPass.duration")}: ${route.duration}`];
      if (cities.length > 0) facts.push(`${message(locale, "BoardingPass.detail.cities")}: ${cities.join(", ")}`);
      body.push({ type: "list", ordered: false, items: facts });
      body.push({ type: "paragraph", text: route.description });
    }
  }

  return { title: value.seoTitle, excerpt: value.cityGridIntro, body };
}

export function buildPosts(): SeedPost[] {
  const posts: SeedPost[] = [];
  for (const country of countries) {
    const tr = buildTranslation(country, "tr");
    if (!tr) continue; // hub'ı olmayan ülke için yazı yok
    const continent = continentOf.get(country.code);
    if (!continent) throw new Error(`${country.code}: kıta bulunamadı.`);

    const translations: SeedPost["translations"] = { tr };
    for (const locale of LOCALES) {
      if (locale === "tr") continue;
      const translated = buildTranslation(country, locale);
      if (translated) translations[locale] = translated;
    }
    posts.push({
      slug: `${countrySlug(country)}-gezi-rehberi`,
      status: "published",
      countryCode: country.code,
      coverImage: coverImage(country),
      tags: [COUNTRY_TAG, continent],
      translations,
    });
  }
  posts.sort((a, b) => (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0));
  const seen = new Set<string>();
  for (const post of posts) {
    if (seen.has(post.slug)) throw new Error(`Yinelenen slug: ${post.slug}`);
    seen.add(post.slug);
  }
  return posts;
}

/** Dosyaya yazılan metin (deterministik: yazılar slug'a göre sıralı, anahtar sırası sabit). */
export function render(posts: SeedPost[]): string {
  return `${JSON.stringify({ posts }, null, 2)}\n`;
}

function main(): void {
  const posts = buildPosts();
  const output = render(posts);

  if (process.argv.includes("--check")) {
    const current = existsSync(OUT_FILE) ? readFileSync(OUT_FILE, "utf8") : "";
    if (current !== output) {
      console.error("apps/api/seed/blog-posts.json güncel değil: `npx tsx scripts/export-blog-seed.ts` çalıştırın.");
      process.exit(1);
    }
    console.log(`blog-posts.json güncel (${posts.length} yazı).`);
  } else {
    mkdirSync(dirname(OUT_FILE), { recursive: true });
    writeFileSync(OUT_FILE, output);
    const langs = posts.map((p) => Object.keys(p.translations).length);
    console.log(
      `${posts.length} yazı yazıldı → ${OUT_FILE} (tr: ${posts.length}, en: ${posts.filter((p) => p.translations.en).length}, es: ${posts.filter((p) => p.translations.es).length}; en çok ${Math.max(...langs)} dil)`,
    );
  }
}

if (require.main === module) main();
