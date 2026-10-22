import { Inject, Injectable } from "@nestjs/common";
import { and, asc, eq, or, type SQL, sql } from "drizzle-orm";
import type { AuthUser } from "../common/auth-types.js";
import { AppException, ErrorCode, isUniqueViolation } from "../common/errors.js";
import { containsIlike } from "../common/like.js";
import { LANGS } from "../common/lang.js";
import { type Page, pageWindow, toPage } from "../common/pagination.js";
import { DATABASE, type Database } from "../db/client.js";
import { blogPosts, countries, users } from "../db/schema/index.js";
import type { Translations } from "../db/schema/types.js";
import { assertValidBlocks } from "./blog-blocks.js";
import { type BlogRow, toDetailDto, toSummaryDto } from "./blog.mapper.js";
import type { BlogPostDto, BlogPostSummaryDto } from "./dto/blog-post.dto.js";
import type {
  BlogTranslationDto,
  BlogVisibility,
  CreateBlogPostDto,
  GetBlogPostQueryDto,
  ListBlogPostsQueryDto,
  UpdateBlogPostDto,
} from "./dto/blog-requests.dto.js";

const postNotFound = (): AppException => AppException.notFound("Blog yazısı bulunamadı.");
const slugTaken = (): AppException =>
  AppException.conflict("Bu adres (slug) başka bir yazıda kullanılıyor.", "BLOG_SLUG_TAKEN", [
    { field: "slug", code: "unique", message: "Bu adres başka bir yazıda kullanılıyor." },
  ]);

/** Veritabanında saklanan çeviri nesnesi (yazma uçları her dilde üç alanı birden ister). */
type StoredTranslation = { title: string; excerpt: string; body: BlogTranslationDto["body"] };
type StoredTranslations = Translations<StoredTranslation>;

/**
 * Liste kartları gövdeyi taşımaz: SQL tarafında yalnız başlık/özet ve gövdenin durumu seçilir (`mapper.readView`
 * için yeterli): dizi değilse `null`, boş dizi `[]`, dolu dizi tek öğeli yer tutucu `[{}]`.
 */
function translationsPreview(): SQL<unknown> {
  const perLang = LANGS.map((lang) => {
    const l = sql.raw(`'${lang}'`);
    return sql`case when jsonb_typeof(${blogPosts.translations} -> ${l}) = 'object' then jsonb_build_object(
      'title', ${blogPosts.translations} #> ARRAY[${l}, 'title'],
      'excerpt', ${blogPosts.translations} #> ARRAY[${l}, 'excerpt'],
      'body', case
        when jsonb_typeof(${blogPosts.translations} #> ARRAY[${l}, 'body']) = 'array' then
          case when jsonb_array_length(${blogPosts.translations} #> ARRAY[${l}, 'body']) = 0 then '[]'::jsonb else '[{}]'::jsonb end
        else 'null'::jsonb end
    ) end`;
  });
  return sql`jsonb_build_object('tr', ${perLang[0]}, 'en', ${perLang[1]}, 'es', ${perLang[2]})`;
}

const textAt = (lang: string, key: "title" | "excerpt"): SQL => sql`(${blogPosts.translations} #>> ARRAY[${lang}, ${key}]::text[])`;

/**
 * İstenen görünürlüğü çözer. `draft` ve `all` yalnız yöneticiye açıktır; parametre başkası için sessizce
 * yok sayılmaz: oturumsuz 401 (istemci giriş yapabilir), yönetici olmayan kullanıcı 403.
 */
function resolveVisibility(requested: BlogVisibility | undefined, user: AuthUser | undefined, fallback: BlogVisibility): BlogVisibility {
  if (requested === undefined) return fallback;
  if (requested === "published") return requested;
  if (!user) throw AppException.unauthorized(ErrorCode.AUTH_REQUIRED, "Taslakları görmek için giriş yapmalısınız.");
  if (user.role !== "admin") throw AppException.forbidden("Taslakları yalnızca yöneticiler görebilir.");
  return requested;
}

@Injectable()
export class BlogService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  // --- herkese açık okuma -----------------------------------------------

  async list(query: ListBlogPostsQueryDto, user: AuthUser | undefined): Promise<Page<BlogPostSummaryDto>> {
    const visibility = resolveVisibility(query.status, user, "published");
    const filters: SQL[] = [];
    if (visibility !== "all") filters.push(eq(blogPosts.status, visibility));
    if (query.tag) filters.push(sql`${blogPosts.tags} @> ARRAY[${query.tag}]::text[]`);
    if (query.country) filters.push(eq(blogPosts.countryCode, query.country));
    if (query.q) {
      const term = query.q;
      const langs = query.lang === "tr" ? ["tr"] : ["tr", query.lang];
      filters.push(
        or(
          containsIlike(blogPosts.slug, term),
          ...langs.flatMap((lang) => [containsIlike(textAt(lang, "title"), term), containsIlike(textAt(lang, "excerpt"), term)]),
        )!,
      );
    }
    const where = filters.length > 0 ? and(...filters) : undefined;
    const { limit, offset } = pageWindow(query);

    const [rows, [count]] = await Promise.all([
      this.db
        .select({
          id: blogPosts.id,
          slug: blogPosts.slug,
          status: blogPosts.status,
          coverImage: blogPosts.coverImage,
          tags: blogPosts.tags,
          countryCode: blogPosts.countryCode,
          publishedAt: blogPosts.publishedAt,
          createdAt: blogPosts.createdAt,
          updatedAt: blogPosts.updatedAt,
          translations: translationsPreview(),
          authorName: users.displayName,
        })
        .from(blogPosts)
        .leftJoin(users, eq(blogPosts.authorId, users.id))
        .where(where)
        // En yeni yayın başta; hiç yayınlanmamış taslaklar oluşturulma zamanına göre. `slug` eşitlikte sırayı sabitler.
        .orderBy(sql`coalesce(${blogPosts.publishedAt}, ${blogPosts.createdAt}) desc`, asc(blogPosts.slug))
        .limit(limit)
        .offset(offset),
      this.db.select({ total: sql<number>`count(*)::int` }).from(blogPosts).where(where),
    ]);
    return toPage(
      rows.map((row) => toSummaryDto(row, query.lang)),
      count?.total ?? 0,
      query,
    );
  }

  async get(slug: string, query: GetBlogPostQueryDto, user: AuthUser | undefined): Promise<BlogPostDto> {
    // Yönetici varsayılan olarak her durumdaki yazıyı görür; diğerleri yalnız yayındakini.
    const visibility = resolveVisibility(query.status, user, user?.role === "admin" ? "all" : "published");
    const row = await this.findOne(this.db, eq(blogPosts.slug, slug));
    // Taslak ile hiç olmayan yazı aynı yanıtı verir: yetkisiz çağıran bir taslağın varlığını öğrenemez.
    if (!row || (visibility !== "all" && row.status !== visibility)) throw postNotFound();
    return toDetailDto(row, query.lang);
  }

  // --- yönetici ---------------------------------------------------------

  async create(dto: CreateBlogPostDto, author: AuthUser): Promise<BlogPostDto> {
    const translations = this.checkedTranslations(dto.translations);
    await this.assertCountryExists(this.db, dto.countryCode);
    const status = dto.status ?? "draft";
    if (status === "published") this.assertPublishable(translations);
    const now = new Date();

    let created: BlogRow;
    try {
      // Yanıt, yazıyı oluşturan işlemin İÇİNDE okunur (bkz. `update`).
      created = await this.db.transaction(async (tx) => {
        const [row] = await tx
          .insert(blogPosts)
          .values({
            slug: dto.slug,
            status,
            authorId: author.id,
            coverImage: dto.coverImage ?? null,
            tags: dedupe(dto.tags ?? []),
            countryCode: dto.countryCode ?? null,
            translations,
            // İlk yayında atanır; taslak olarak açılan yazı yayınlanana kadar null kalır.
            publishedAt: status === "published" ? now : null,
            createdAt: now,
            updatedAt: now,
          })
          .returning({ id: blogPosts.id });
        return (await this.findOne(tx, eq(blogPosts.id, row!.id)))!;
      });
    } catch (err) {
      if (isUniqueViolation(err)) throw slugTaken();
      throw err;
    }
    return toDetailDto(created, "tr");
  }

  async update(id: string, dto: UpdateBlogPostDto): Promise<BlogPostDto> {
    if (Object.values(dto).every((value) => value === undefined)) {
      throw AppException.validation([{ field: "", code: "noChanges", message: "Güncellenecek en az bir alan gönderin." }]);
    }
    const incoming = dto.translations ? this.checkedPartialTranslations(dto.translations) : undefined;
    if (dto.countryCode !== undefined) await this.assertCountryExists(this.db, dto.countryCode);

    let updated: BlogRow;
    try {
      updated = await this.db.transaction(async (tx) => {
        // Okuma-değiştirme-yazma: çeviri birleştirmesi ve yayın zamanı eşzamanlı yönetici işlemlerinden korunur.
        const [current] = await tx.select().from(blogPosts).where(eq(blogPosts.id, id)).for("update").limit(1);
        if (!current) throw postNotFound();

        const now = new Date();
        const patch: Partial<typeof blogPosts.$inferInsert> = { updatedAt: now };
        if (dto.slug !== undefined) patch.slug = dto.slug;
        if (dto.coverImage !== undefined) patch.coverImage = dto.coverImage;
        if (dto.countryCode !== undefined) patch.countryCode = dto.countryCode;
        if (dto.tags !== undefined) patch.tags = dedupe(dto.tags);

        let translations = current.translations as StoredTranslations;
        if (incoming) {
          const next: Partial<Record<(typeof LANGS)[number], StoredTranslation>> & { tr: StoredTranslation } = { ...translations };
          if (incoming.tr) next.tr = incoming.tr;
          for (const lang of ["en", "es"] as const) {
            const value = incoming[lang];
            if (value === null) delete next[lang];
            else if (value !== undefined) next[lang] = value;
          }
          translations = next;
          patch.translations = translations;
        }

        const status = dto.status ?? current.status;
        if (dto.status !== undefined) patch.status = dto.status;
        if (status === "published") {
          this.assertPublishable(translations);
          // Yalnız İLK yayında atanır; taslağa alıp yeniden yayınlamak özgün yayın zamanını korur.
          if (current.publishedAt === null) patch.publishedAt = now;
        }

        await tx.update(blogPosts).set(patch).where(eq(blogPosts.id, id));
        // Yanıt işlemin İÇİNDE okunur: işlem bittikten sonra okunsa, araya giren eşzamanlı bir DELETE satırı
        // götürür ve başarılı güncelleme 500'e (okunamayan satır) dönerdi. Böyle bir silme güncellemeden SONRA
        // sıralanmış sayılır: güncelleme 200 döner, silme 204.
        return (await this.findOne(tx, eq(blogPosts.id, id)))!;
      });
    } catch (err) {
      if (isUniqueViolation(err)) throw slugTaken();
      throw err;
    }
    return toDetailDto(updated, "tr");
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.db.delete(blogPosts).where(eq(blogPosts.id, id)).returning({ id: blogPosts.id });
    if (deleted.length === 0) throw postNotFound();
  }

  // --- yardımcılar ------------------------------------------------------

  private async findOne(db: Database, where: SQL): Promise<BlogRow | undefined> {
    const [row] = await db
      .select({
        id: blogPosts.id,
        slug: blogPosts.slug,
        status: blogPosts.status,
        coverImage: blogPosts.coverImage,
        tags: blogPosts.tags,
        countryCode: blogPosts.countryCode,
        publishedAt: blogPosts.publishedAt,
        createdAt: blogPosts.createdAt,
        updatedAt: blogPosts.updatedAt,
        translations: blogPosts.translations,
        authorName: users.displayName,
      })
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .where(where)
      .limit(1);
    return row;
  }

  /** İstek gövdesindeki çevirileri blok düzeyinde doğrular (alan yolları `translations.<dil>.body.<i>...`). */
  private checkedTranslations(input: { tr: BlogTranslationDto; en?: BlogTranslationDto | null; es?: BlogTranslationDto | null }): StoredTranslations {
    const out: StoredTranslations = { tr: this.checkedTranslation("tr", input.tr) };
    for (const lang of ["en", "es"] as const) {
      const value = input[lang];
      if (value) out[lang] = this.checkedTranslation(lang, value);
    }
    return out;
  }

  private checkedPartialTranslations(input: {
    tr?: BlogTranslationDto;
    en?: BlogTranslationDto | null;
    es?: BlogTranslationDto | null;
  }): { tr?: StoredTranslation; en?: StoredTranslation | null; es?: StoredTranslation | null } {
    const out: { tr?: StoredTranslation; en?: StoredTranslation | null; es?: StoredTranslation | null } = {};
    if (input.tr) out.tr = this.checkedTranslation("tr", input.tr);
    for (const lang of ["en", "es"] as const) {
      const value = input[lang];
      if (value === null) out[lang] = null;
      else if (value !== undefined) out[lang] = this.checkedTranslation(lang, value);
    }
    return out;
  }

  private checkedTranslation(lang: string, value: BlogTranslationDto): StoredTranslation {
    assertValidBlocks(value.body, `translations.${lang}.body`);
    return { title: value.title, excerpt: value.excerpt, body: value.body };
  }

  /** Yayındaki yazının Türkçe içeriği boş gövdeyle yayına çıkamaz. */
  private assertPublishable(translations: { tr?: { body: unknown[] } }): void {
    if (!translations.tr || translations.tr.body.length === 0) {
      throw AppException.validation([
        { field: "translations.tr.body", code: "arrayNotEmpty", message: "Yayınlanan yazının gövdesi boş olamaz." },
      ]);
    }
  }

  private async assertCountryExists(db: Database, code: string | null | undefined): Promise<void> {
    if (code === null || code === undefined) return;
    const [row] = await db.select({ code: countries.code }).from(countries).where(eq(countries.code, code)).limit(1);
    if (!row) throw AppException.validation([{ field: "countryCode", code: "unknownCountry", message: "Böyle bir ülke yok." }]);
  }
}

function dedupe(values: string[]): string[] {
  return [...new Set(values)];
}
