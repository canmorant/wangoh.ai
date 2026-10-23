/**
 * Yazı formunun saf mantığı: form değerleri <-> API gövdesi, istemci doğrulaması, sunucu hatalarını alanlara eşleme.
 *
 * Yalnız TÜRKÇE çeviri düzenlenir. Sunucu `PATCH` ile gönderilen dili bütün olarak değiştirir, gönderilmeyen
 * dillere (en/es) dokunmaz; bu yüzden güncellemede `translations` içine yalnız `tr` konur ve hiçbir zaman
 * `en`/`es` (null dahil) gönderilmez.
 */
import type { BlogPostDto, CreateBlogPostDto, UpdateBlogPostDto } from "@wangoh/api-client";

import type { BlogBlock } from "../blog/blockTypes";
import {
  COUNTRY_CODE_PATTERN,
  FIELD_LIMITS,
  TAG_PATTERN,
  hasForbiddenChars,
  isBlankText,
  isHttpsUrl,
  normalizeTag,
} from "../blog/contentRules";
import { blocksToText, locateIssue, parseBlocks, validateBodyText } from "./blocks";
import { SLUG_RULE_MESSAGE, slugify, validateSlug } from "./slug";

export interface PostFormValues {
  slug: string;
  title: string;
  excerpt: string;
  /** Virgülle (ya da boşlukla) ayrılmış etiketler. */
  tags: string;
  coverImage: string;
  /** İki harfli ülke kodu (isteğe bağlı). */
  countryCode: string;
  /** Editör metni (`blocks.ts` biçimi). */
  body: string;
}

export type PostFieldName = Exclude<keyof PostFormValues, "body">;

export interface PostFormErrors {
  fields: Partial<Record<PostFieldName, string>>;
  /** Gövde sorunları, her biri ayrı satır ("Satır 4: ..."). */
  body: string[];
  /** Hiçbir alana bağlanamayan hata (ağ, yetki, genel). */
  form: string | null;
}

export const NO_ERRORS: PostFormErrors = { fields: {}, body: [], form: null };

export function hasErrors(errors: PostFormErrors): boolean {
  return errors.form !== null || errors.body.length > 0 || Object.keys(errors.fields).length > 0;
}

export function emptyForm(): PostFormValues {
  return { slug: "", title: "", excerpt: "", tags: "", coverImage: "", countryCode: "", body: "" };
}

/** Kayıtlı yazıdan (Türkçe sürüm) form değerleri. */
export function formFromPost(post: BlogPostDto): PostFormValues {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    tags: post.tags.join(", "),
    coverImage: post.coverImage ?? "",
    countryCode: post.countryCode ?? "",
    body: blocksToText(post.body),
  };
}

/** Etiket kutusunu listeye çevirir: virgül/noktalı virgül/boşluk/satır sonuyla ayrılır, sunucuyla aynı kuralla normalleşir. */
export function parseTags(input: string): string[] {
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const part of input.split(/[\s,;]+/)) {
    const tag = normalizeTag(part);
    if (tag === "" || seen.has(tag)) continue;
    seen.add(tag);
    tags.push(tag);
  }
  return tags;
}

function normalizeCountry(input: string): string {
  return input.trim().toUpperCase();
}

function normalizeBodyText(text: string): string {
  return text.replace(/\r\n?/g, "\n");
}

/** Başlıktan slug önerisi (yeni yazıda, kullanıcı slug'ı elle değiştirene kadar). */
export function suggestSlug(title: string): string {
  return slugify(title);
}

function validateText(label: string, value: string, max: number, multiline: boolean): string | null {
  const trimmed = value.trim();
  if (trimmed === "" || isBlankText(trimmed)) return `${label} boş olamaz.`;
  if (trimmed.length > max) return `${label} en fazla ${max} karakter olabilir (şu an ${trimmed.length}).`;
  if (hasForbiddenChars(trimmed, multiline)) return `${label} kontrol ya da yön belirleyici karakter içeremez.`;
  return null;
}

/** İstemci tarafı doğrulama (sunucu kurallarının aynısı). `publish`: yayın için gövde boş olamaz. */
export function validatePostForm(values: PostFormValues, options: { publish: boolean }): PostFormErrors {
  const fields: PostFormErrors["fields"] = {};

  const slugError = validateSlug(values.slug);
  if (slugError) fields.slug = slugError;

  const titleError = validateText("Başlık", values.title, FIELD_LIMITS.title, false);
  if (titleError) fields.title = titleError;

  const excerptError = validateText("Özet", values.excerpt, FIELD_LIMITS.excerpt, true);
  if (excerptError) fields.excerpt = excerptError;

  const tags = parseTags(values.tags);
  const badTag = tags.find((tag) => tag.length > FIELD_LIMITS.tag || !TAG_PATTERN.test(tag));
  if (tags.length > FIELD_LIMITS.tags) fields.tags = `En fazla ${FIELD_LIMITS.tags} etiket olabilir (şu an ${tags.length}).`;
  else if (badTag !== undefined) {
    fields.tags =
      badTag.length > FIELD_LIMITS.tag
        ? `Etiket en fazla ${FIELD_LIMITS.tag} karakter olabilir: "${badTag.slice(0, 20)}…"`
        : `"${badTag}" geçerli bir etiket değil: yalnız harf, rakam ve tire kullan.`;
  }

  const cover = values.coverImage.trim();
  if (cover !== "" && !isHttpsUrl(cover)) fields.coverImage = "Kapak görseli adresi https:// ile başlayan geçerli bir adres olmalı.";

  const country = normalizeCountry(values.countryCode);
  if (country !== "" && !COUNTRY_CODE_PATTERN.test(country)) fields.countryCode = "Ülke kodu iki harfli olmalı (ör. JP, TR).";

  const body = validateBodyText(normalizeBodyText(values.body), { requireContent: options.publish }).map(describeBodyIssue);
  return { fields, body, form: null };
}

function describeBodyIssue(issue: { line: number | null; message: string }): string {
  return issue.line === null ? issue.message : `Satır ${issue.line}: ${issue.message}`;
}

export function buildCreateDto(values: PostFormValues, status: "draft" | "published"): CreateBlogPostDto {
  const cover = values.coverImage.trim();
  const country = normalizeCountry(values.countryCode);
  return {
    slug: values.slug.trim().toLowerCase(),
    status,
    tags: parseTags(values.tags),
    ...(cover !== "" ? { coverImage: cover } : {}),
    ...(country !== "" ? { countryCode: country } : {}),
    translations: {
      tr: { title: values.title.trim(), excerpt: values.excerpt.trim(), body: parseBlocks(normalizeBodyText(values.body)).blocks },
    },
  };
}

const sameList = (a: readonly string[], b: readonly string[]) => a.length === b.length && a.every((value, index) => value === b[index]);

/**
 * Yalnız değişen alanlardan güncelleme gövdesi. Hiçbir şey değişmediyse ve durum verilmediyse `null`.
 * Gövde metni açıldığı hâlden değişmediyse özgün bloklar aynen gönderilir: editörün normalleştirmesi
 * (satır kenarı boşlukları, alıntı sonu boş satırı) dokunulmamış bir gövdeyi sessizce değiştirmesin.
 */
export function buildUpdateDto(
  values: PostFormValues,
  original: BlogPostDto,
  options: { status?: "draft" | "published" } = {},
): UpdateBlogPostDto | null {
  const dto: UpdateBlogPostDto = {};

  const slug = values.slug.trim().toLowerCase();
  if (slug !== original.slug) dto.slug = slug;

  const tags = parseTags(values.tags);
  if (!sameList(tags, original.tags)) dto.tags = tags;

  const cover = values.coverImage.trim();
  if (cover !== (original.coverImage ?? "")) dto.coverImage = cover === "" ? null : cover;

  const country = normalizeCountry(values.countryCode);
  if (country !== (original.countryCode ?? "")) dto.countryCode = country === "" ? null : country;

  const title = values.title.trim();
  const excerpt = values.excerpt.trim();
  const bodyText = normalizeBodyText(values.body);
  const bodyChanged = bodyText !== blocksToText(original.body);
  if (title !== original.title || excerpt !== original.excerpt || bodyChanged) {
    const body: BlogBlock[] = bodyChanged ? parseBlocks(bodyText).blocks : original.body;
    dto.translations = { tr: { title, excerpt, body } };
  }

  if (options.status !== undefined && options.status !== original.status) dto.status = options.status;

  return Object.keys(dto).length === 0 ? null : dto;
}

// --- sunucu hatalarını alanlara eşleme -------------------------------------------------------------------

interface ApiFieldDetail {
  field: string;
  code: string;
  message: string;
}

function asDetails(value: unknown): ApiFieldDetail[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is ApiFieldDetail =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as ApiFieldDetail).field === "string" &&
      typeof (item as ApiFieldDetail).message === "string",
  );
}

/** Sunucunun kısa kısıt mesajlarını ("Biçim geçersiz.") alana özgü, anlaşılır Türkçeye çevirir. */
function fieldMessage(field: PostFieldName, detail: ApiFieldDetail): string {
  const { code } = detail;
  switch (field) {
    case "slug":
      if (code === "unique" || code === "BLOG_SLUG_TAKEN") return "Bu adres başka bir yazıda kullanılıyor. Başka bir adres dene.";
      if (code === "minLength") return `Adres en az ${FIELD_LIMITS.slugMin} karakter olmalı.`;
      if (code === "maxLength") return `Adres en fazla ${FIELD_LIMITS.slugMax} karakter olabilir.`;
      return SLUG_RULE_MESSAGE;
    case "title":
      if (code === "maxLength") return `Başlık en fazla ${FIELD_LIMITS.title} karakter olabilir.`;
      if (code === "noControlChars") return "Başlık kontrol ya da yön belirleyici karakter içeremez.";
      return "Başlık boş olamaz.";
    case "excerpt":
      if (code === "maxLength") return `Özet en fazla ${FIELD_LIMITS.excerpt} karakter olabilir.`;
      if (code === "noControlChars") return "Özet kontrol ya da yön belirleyici karakter içeremez.";
      return "Özet boş olamaz.";
    case "coverImage":
      return "Kapak görseli adresi https:// ile başlayan geçerli bir adres olmalı (en fazla 2048 karakter).";
    case "countryCode":
      return code === "unknownCountry" ? "Böyle bir ülke yok. İki harfli geçerli bir ülke kodu gir (ör. JP)." : "Ülke kodu iki harfli olmalı (ör. JP, TR).";
    case "tags":
      return `Etiketler yalnız harf, rakam ve tire içerebilir; en fazla ${FIELD_LIMITS.tags} etiket, her biri en fazla ${FIELD_LIMITS.tag} karakter.`;
  }
}

function fieldFor(path: string): PostFieldName | "body" | null {
  if (path === "slug") return "slug";
  if (path === "coverImage") return "coverImage";
  if (path === "countryCode") return "countryCode";
  if (path === "tags" || path.startsWith("tags.")) return "tags";
  if (path === "translations.tr.title") return "title";
  if (path === "translations.tr.excerpt") return "excerpt";
  if (path === "translations.tr.body" || path.startsWith("translations.tr.body.")) return "body";
  return null;
}

function statusMessage(error: unknown): string | null {
  const status = (error as { status?: unknown } | null)?.status;
  if (status === 401) return "Oturumun sona ermiş. Yeniden giriş yapıp tekrar dene.";
  if (status === 403) return "Bu işlem için yönetici yetkin yok.";
  if (status === 404) return "Yazı bulunamadı; başka bir yönetici silmiş olabilir.";
  if (status === 413) return "Yazı çok büyük; gövdeyi kısaltıp tekrar dene.";
  return null;
}

/**
 * `ApiError` -> form hataları. `bodyLines`: gönderilen gövdede blok sırasına karşılık gelen metin satırları
 * (`parseBlocks().lines`); sunucunun `translations.tr.body.3.url` gibi yollarını satıra bağlamak için.
 */
export function mapServerErrors(error: unknown, options: { bodyLines?: readonly number[] } = {}): PostFormErrors {
  const result: PostFormErrors = { fields: {}, body: [], form: null };
  const code = (error as { code?: unknown } | null)?.code;
  const message = (error as { message?: unknown } | null)?.message;
  const details = asDetails((error as { details?: unknown } | null)?.details);

  for (const detail of details) {
    const target = fieldFor(detail.field);
    if (target === "body") {
      const where = locateIssue(detail.field, "translations.tr.body");
      const line = where ? options.bodyLines?.[where.block] : undefined;
      const text = line === undefined ? detail.message : `Satır ${line + (where?.item ?? 0)}: ${detail.message}`;
      result.body.push(text);
    } else if (target !== null) {
      result.fields[target] ??= fieldMessage(target, detail);
    }
  }

  if (code === "BLOG_SLUG_TAKEN") result.fields.slug ??= "Bu adres başka bir yazıda kullanılıyor. Başka bir adres dene.";

  if (!hasErrors(result)) {
    const generic = statusMessage(error) ?? (typeof message === "string" && message.trim() !== "" ? message : null);
    result.form = generic ?? "Yazı kaydedilemedi. Lütfen tekrar dene.";
  } else if (details.some((detail) => fieldFor(detail.field) === null)) {
    // Bilmediğimiz bir alan da hatalıysa sunucu mesajını genel hata olarak göster.
    result.form = typeof message === "string" ? message : null;
  }
  return result;
}
