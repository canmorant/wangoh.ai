import { DEFAULT_LANG, type Lang, LANGS, resolveTranslation } from "../common/lang.js";
import type { ImageCreditDto } from "../content/dto/image-credit.dto.js";
import type { BlogStatus } from "../db/schema/enums.js";
import type { Translations } from "../db/schema/types.js";
import { type BlogBlock, isBlankText } from "./blog-blocks.js";
import type { BlogPostDto, BlogPostSummaryDto } from "./dto/blog-post.dto.js";

/** Bir dildeki içeriğin sunulan hâli. */
interface LangView {
  title: string;
  excerpt: string;
  body: BlogBlock[];
}

/** Veritabanı satırından yanıta gereken alanlar (`translations` tam ya da önizleme olabilir). */
export interface BlogRow {
  id: string;
  slug: string;
  status: BlogStatus;
  coverImage: string | null;
  tags: string[];
  countryCode: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  translations: unknown;
  /** Sol birleştirmeden gelen yazar adı; yazar yoksa null. */
  authorName: string | null;
}

const EMPTY_VIEW: LangView = { title: "", excerpt: "", body: [] };

/**
 * Bir çeviri YALNIZ başlığı, özeti ve gövdesi birlikte kullanılabilirse sunulur (yarım çeviri karışık dilli
 * sayfa üretir). Başlık ve özet görünür metin taşımalıdır (yalnız boşluk/görünmez karakter "dolu" değildir).
 * Gövde burada yalnız dizi olarak denetlenir: bloklar yazılırken doğrulanmıştır. `requireBody`: Türkçe dışındaki
 * dillerde boş gövde çeviri sayılmaz (başlık/özet çevrilmiş, metin henüz yazılmamış; okuyucu boş makale yerine
 * Türkçeyi görür). Türkçe taslağın gövdesi boş olabilir ve yöneticiye olduğu gibi gösterilir.
 */
function readView(raw: unknown, requireBody: boolean): LangView | null {
  if (typeof raw !== "object" || raw === null) return null;
  const { title, excerpt, body } = raw as Record<string, unknown>;
  if (typeof title !== "string" || isBlankText(title) || typeof excerpt !== "string" || isBlankText(excerpt) || !Array.isArray(body)) return null;
  if (requireBody && body.length === 0) return null;
  return { title, excerpt, body: body as BlogBlock[] };
}

function resolveView(translations: unknown, requested: Lang): { lang: Lang; complete: boolean; availableLangs: Lang[]; view: LangView } {
  const source = typeof translations === "object" && translations !== null ? (translations as Record<string, unknown>) : {};
  const usable: Partial<Record<Lang, LangView>> = {};
  for (const lang of LANGS) {
    const view = readView(source[lang], lang !== DEFAULT_LANG);
    if (view) usable[lang] = view;
  }
  const availableLangs = LANGS.filter((lang) => usable[lang] !== undefined);
  const resolved = resolveTranslation({ ...usable, tr: usable.tr ?? EMPTY_VIEW } as Translations<LangView>, null, requested);
  // Türkçe de yoksa (doğrudan veritabanı müdahalesi) boş içerik "tam" sayılmaz.
  const complete = resolved.complete && (resolved.lang !== DEFAULT_LANG || usable.tr !== undefined);
  return { lang: resolved.lang, complete, availableLangs, view: resolved.value };
}

function build(row: BlogRow, requested: Lang): { summary: BlogPostSummaryDto; view: LangView } {
  const { lang, complete, availableLangs, view } = resolveView(row.translations, requested);
  const summary: BlogPostSummaryDto = {
    id: row.id,
    slug: row.slug,
    status: row.status,
    lang,
    complete,
    availableLangs,
    title: view.title,
    excerpt: view.excerpt,
    coverImage: row.coverImage,
    tags: row.tags,
    countryCode: row.countryCode,
    // Yalnız görünen ad: e-posta ve kimlik hiçbir koşulda yanıta girmez.
    author: row.authorName === null ? null : { displayName: row.authorName },
    publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
  return { summary, view };
}

/** Liste kartı: gövde yok. */
export function toSummaryDto(row: BlogRow, requested: Lang): BlogPostSummaryDto {
  return build(row, requested).summary;
}

/** Ayrıntı: özet alanları + tam gövde + kapak görselinin atfı. */
export function toDetailDto(row: BlogRow, requested: Lang, imageCredits: ImageCreditDto[]): BlogPostDto {
  const { summary, view } = build(row, requested);
  return { ...summary, body: view.body, imageCredits };
}
