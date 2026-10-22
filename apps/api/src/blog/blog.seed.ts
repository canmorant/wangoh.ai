import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Logger } from "@nestjs/common";
import { inArray, sql } from "drizzle-orm";
import { LANGS } from "../common/lang.js";
import type { Database } from "../db/client.js";
import { blogPosts, countries } from "../db/schema/index.js";
import { BLOG_STATUSES, type BlogStatus } from "../db/schema/enums.js";
import type { Translations } from "../db/schema/types.js";
import { hasForbiddenChars, isBlankText, isHttpsUrl, validateBlocks } from "./blog-blocks.js";
import type { BlogBlock } from "./blog-blocks.js";
import { normalizeTag } from "./blog-tags.js";
import { COUNTRY_CODE_PATTERN, EXCERPT_MAX, MAX_TAGS, MAX_TAG_LENGTH, SLUG_PATTERN, TAG_PATTERN, TITLE_MAX } from "./dto/blog-requests.dto.js";

/** Tohum dosyası: `seed/blog-posts.json` → `{ "posts": [...] }` (`apps/web/scripts/export-blog-seed.ts` üretir). */
export const BLOG_SEED_FILE = "blog-posts.json";

export interface BlogSeedOptions {
  /** Tohum JSON klasörü. */
  dir: string;
  /**
   * `true`: var olan slug'ların içeriğini de tohumla değiştirir (upsert). Varsayılan `false`: YALNIZ eksik
   * slug'lar eklenir, yöneticinin yaptığı düzenlemeler ezilmez.
   */
  force?: boolean;
}

export interface BlogSeedResult {
  inserted: number;
  updated: number;
  /** Zaten var olduğu için dokunulmayan yazılar (`force` kapalıyken). */
  existing: number;
  /** Bağlı ülke veritabanında olmadığı için atlanan slug'lar. */
  missingCountry: string[];
  /** Geçersiz olduğu için atlanan yazılar ve nedenleri. */
  invalid: string[];
}

// `type` (interface değil): jsonb sütununun gevşek `Record<string, unknown>` tipine atanabilsin.
type SeedTranslation = {
  title: string;
  excerpt: string;
  body: BlogBlock[];
};

interface SeedPost {
  slug: string;
  status: BlogStatus;
  countryCode: string | null;
  coverImage: string | null;
  tags: string[];
  /**
   * Dosyada açıkça yazılmış gerçek yayın tarihi. Yoksa `null`: yükleyici yazıyı İLK yüklediği anı atar
   * (`resolvePublishedAt`); tarih uydurulmaz.
   */
  publishedAt: Date | null;
  translations: Translations<SeedTranslation>;
}

const logger = new Logger("BlogSeed");
const INSERT_CHUNK = 10;

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Tohum dosyasındaki bir yazıyı API'nin yazma kurallarıyla doğrular (aynı blok doğrulayıcı, aynı sınırlar).
 * Geçerliyse yazıyı, değilse sorunları döner.
 */
export function parseSeedPost(raw: unknown): { post: SeedPost } | { slug: string; problems: string[] } {
  const problems: string[] = [];
  const record = isRecord(raw) ? raw : {};
  const slug = typeof record.slug === "string" ? record.slug : "(slug yok)";
  if (!isRecord(raw)) return { slug, problems: ["yazı bir nesne olmalı"] };

  if (typeof record.slug !== "string" || record.slug.length < 3 || record.slug.length > 120 || !SLUG_PATTERN.test(record.slug)) {
    problems.push("slug geçersiz");
  }

  const status = record.status ?? "published";
  if (typeof status !== "string" || !(BLOG_STATUSES as readonly string[]).includes(status)) problems.push("status geçersiz");

  const countryCode = record.countryCode ?? null;
  if (countryCode !== null && (typeof countryCode !== "string" || !COUNTRY_CODE_PATTERN.test(countryCode))) problems.push("countryCode geçersiz");

  const coverImage = record.coverImage ?? null;
  if (coverImage !== null && !isHttpsUrl(coverImage)) problems.push("coverImage https adresi olmalı");

  // Etiketler API yazma uçlarıyla aynı kuralla normalleştirilir (NFC, `İ` -> `i`, küçük harf): aksi halde büyük
  // harfli bir tohum etiketi `?tag=` süzgeciyle (o da normalleştirir) hiçbir zaman bulunamazdı.
  const rawTags = record.tags ?? [];
  const tags = Array.isArray(rawTags) ? rawTags.map((t) => (typeof t === "string" ? normalizeTag(t) : t)) : rawTags;
  if (
    !Array.isArray(tags) ||
    tags.length > MAX_TAGS ||
    tags.some((t) => typeof t !== "string" || t.length > MAX_TAG_LENGTH || !TAG_PATTERN.test(t))
  ) {
    problems.push("tags geçersiz");
  }

  // Yayın tarihi isteğe bağlıdır: hub verisinde tarih yok, bu yüzden dışa aktarılan tohum tarih taşımaz ve yazı,
  // API'de ilk yayınlandığı anda (yükleme zamanı) yayınlanmış sayılır. Dosyada tarih varsa geçerli olmalıdır.
  let publishedAt: Date | null = null;
  if (record.publishedAt !== undefined && record.publishedAt !== null) {
    publishedAt = typeof record.publishedAt === "string" ? new Date(record.publishedAt) : null;
    if (publishedAt === null || Number.isNaN(publishedAt.getTime())) problems.push("publishedAt geçerli bir tarih olmalı");
  }

  const translations: Record<string, SeedTranslation> = {};
  if (!isRecord(record.translations) || !isRecord(record.translations.tr)) {
    problems.push("translations.tr zorunlu");
  } else {
    for (const [lang, value] of Object.entries(record.translations)) {
      if (!(LANGS as readonly string[]).includes(lang)) {
        problems.push(`translations.${lang}: desteklenmeyen dil`);
        continue;
      }
      if (!isRecord(value)) {
        problems.push(`translations.${lang}: nesne olmalı`);
        continue;
      }
      const { title, excerpt, body } = value;
      const ok =
        typeof title === "string" && !isBlankText(title) && title.length <= TITLE_MAX && !hasForbiddenChars(title) &&
        typeof excerpt === "string" && !isBlankText(excerpt) && excerpt.length <= EXCERPT_MAX && !hasForbiddenChars(excerpt, true);
      if (!ok) problems.push(`translations.${lang}: başlık/özet geçersiz`);
      const blockProblems = validateBlocks(body, `translations.${lang}.body`);
      for (const issue of blockProblems.slice(0, 3)) problems.push(`${issue.field}: ${issue.code}`);
      if (ok && blockProblems.length === 0) translations[lang] = { title, excerpt, body: body as BlogBlock[] };
    }
    if (status === "published" && translations.tr && translations.tr.body.length === 0) problems.push("yayındaki yazının Türkçe gövdesi boş");
  }

  if (problems.length > 0 || !translations.tr) return { slug, problems: problems.length > 0 ? problems : ["translations.tr geçersiz"] };
  return {
    post: {
      slug,
      status: status as BlogStatus,
      countryCode: countryCode as string | null,
      coverImage: coverImage as string | null,
      tags: [...new Set(tags as string[])],
      publishedAt,
      translations: translations as Translations<SeedTranslation>,
    },
  };
}

/**
 * Yazının yayın zamanı. Öncelik: dosyadaki açık tarih > var olan satırın zamanı (`force` yeniden yüklemesi özgün
 * yayın zamanını bozmaz) > yayındaki yazı için ŞİMDİ (ilk yükleme = ilk yayın; hub verisinde tarih olmadığından
 * tarih uydurulmaz). Taslak tohumu tarihsiz kalır.
 */
function resolvePublishedAt(post: SeedPost, existing: Date | null, now: Date): Date | null {
  return post.publishedAt ?? existing ?? (post.status === "published" ? now : null);
}

/** Tohum dosyasını okur. Dosya yoksa `undefined` (sessizce atlanır); bozuk JSON açık hatadır. */
async function readSeedFile(dir: string): Promise<unknown> {
  let text: string;
  try {
    text = await readFile(join(dir, BLOG_SEED_FILE), "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT" || (err as NodeJS.ErrnoException).code === "ENOTDIR") return undefined;
    throw err;
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${BLOG_SEED_FILE} geçerli bir JSON değil.`);
  }
}

/**
 * Blog tohumunu yükler ve ne yaptığını döner. Idempotent: varsayılan olarak YALNIZ eksik slug'ları ekler
 * (yönetici düzenlemeleri ezilmez); `force` var olanları tohumla değiştirir. Bağlı ülkesi veritabanında
 * olmayan yazı (içerik tohumu yüklenmemiş) atlanır ve loglanır; yazar atanmaz (`author: null`).
 */
export async function seedBlogPosts(db: Database, opts: BlogSeedOptions): Promise<BlogSeedResult> {
  const result: BlogSeedResult = { inserted: 0, updated: 0, existing: 0, missingCountry: [], invalid: [] };
  const file = await readSeedFile(opts.dir);
  if (file === undefined) return result;
  if (!isRecord(file) || !Array.isArray(file.posts)) throw new Error(`${BLOG_SEED_FILE}: { "posts": [...] } biçiminde olmalı.`);

  const posts: SeedPost[] = [];
  const seen = new Set<string>();
  for (const raw of file.posts) {
    const parsed = parseSeedPost(raw);
    if ("post" in parsed) {
      if (seen.has(parsed.post.slug)) result.invalid.push(`${parsed.post.slug}: yinelenen slug`);
      else {
        seen.add(parsed.post.slug);
        posts.push(parsed.post);
      }
    } else {
      result.invalid.push(`${parsed.slug}: ${parsed.problems.join("; ")}`);
    }
  }
  if (result.invalid.length > 0) logger.warn(`Geçersiz blog tohum yazısı atlandı (${result.invalid.length}): ${result.invalid.slice(0, 5).join(" | ")}`);
  if (posts.length === 0) return result;

  const existingRows = await db
    .select({ slug: blogPosts.slug, publishedAt: blogPosts.publishedAt })
    .from(blogPosts)
    .where(inArray(blogPosts.slug, posts.map((p) => p.slug)));
  const existing = new Set(existingRows.map((r) => r.slug));
  const existingPublishedAt = new Map(existingRows.map((r) => [r.slug, r.publishedAt]));
  const candidates = opts.force ? posts : posts.filter((p) => !existing.has(p.slug));
  result.existing = opts.force ? 0 : posts.length - candidates.length;

  const codes = [...new Set(candidates.flatMap((p) => (p.countryCode ? [p.countryCode] : [])))];
  const knownCodes = new Set(
    codes.length === 0 ? [] : (await db.select({ code: countries.code }).from(countries).where(inArray(countries.code, codes))).map((r) => r.code),
  );
  const insertable = candidates.filter((p) => {
    if (p.countryCode === null || knownCodes.has(p.countryCode)) return true;
    result.missingCountry.push(p.slug);
    return false;
  });
  if (result.missingCountry.length > 0) {
    logger.warn(`Bağlı ülke veritabanında yok, ${result.missingCountry.length} blog yazısı atlandı (içerik tohumu yüklenmemiş olabilir).`);
  }

  if (insertable.length > 0) {
    const now = new Date();
    await db.transaction(async (tx) => {
      for (let i = 0; i < insertable.length; i += INSERT_CHUNK) {
        const chunk = insertable.slice(i, i + INSERT_CHUNK);
        const values = chunk.map((p) => ({
          slug: p.slug,
          status: p.status,
          coverImage: p.coverImage,
          tags: p.tags,
          countryCode: p.countryCode,
          translations: p.translations,
          publishedAt: resolvePublishedAt(p, existingPublishedAt.get(p.slug) ?? null, now),
          createdAt: now,
          updatedAt: now,
        }));
        const query = tx.insert(blogPosts).values(values);
        const rows = opts.force
          ? await query
              .onConflictDoUpdate({
                target: blogPosts.slug,
                // Kimlik, oluşturulma zamanı ve yazar korunur; yalnız içerik alanları tohumdan gelir.
                set: {
                  status: sql`excluded.status`,
                  coverImage: sql`excluded.cover_image`,
                  tags: sql`excluded.tags`,
                  countryCode: sql`excluded.country_code`,
                  translations: sql`excluded.translations`,
                  publishedAt: sql`excluded.published_at`,
                  updatedAt: sql`excluded.updated_at`,
                },
              })
              .returning({ slug: blogPosts.slug, inserted: sql<boolean>`(xmax = 0)` })
          : // Eşzamanlı iki açılış aynı slug'ı eklemeye kalkarsa kaybeden sessizce geçer.
            await query.onConflictDoNothing({ target: blogPosts.slug }).returning({ slug: blogPosts.slug, inserted: sql<boolean>`true` });
        for (const row of rows) {
          if (row.inserted) result.inserted++;
          else result.updated++;
        }
      }
    });
  }

  const message = `Blog tohumu: ${result.inserted} eklendi, ${result.updated} güncellendi, ${result.existing} zaten vardı.`;
  if (result.inserted > 0 || result.updated > 0) logger.log(message);
  else logger.debug(message);
  return result;
}

/**
 * Orkestratörün çağırdığı sabit imza (`runSeed`). `dir` altında `blog-posts.json` yoksa sessizce atlar.
 * Ayrıntılı sonuç için `seedBlogPosts`.
 */
export async function seedBlog(db: Database, opts: BlogSeedOptions): Promise<void> {
  await seedBlogPosts(db, opts);
}
