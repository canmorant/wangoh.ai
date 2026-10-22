import { ApiExtraModels, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from "class-validator";
import { DEFAULT_LANG, type Lang, LangField } from "../../common/lang.js";
import { PaginationQueryDto } from "../../common/pagination.js";
import { Trim, TrimLowercase } from "../../common/transforms.js";
import { IsOptionalNotNull, NoNullBytes } from "../../common/validators.js";
import { BLOG_STATUSES, type BlogStatus } from "../../db/schema/enums.js";
import { BLOCK_LIMITS, type BlogBlock } from "../blog-blocks.js";
import { normalizeTag } from "../blog-tags.js";
import { BLOG_BLOCK_MODELS, BLOG_BODY_PROPERTY } from "./blog-block.dto.js";
import { IsHttpsUrl, NoControlChars, NotBlank } from "./blog-validators.js";

/** Küçük harf, rakam ve tire; tire kenarda ya da art arda olamaz. */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/** Etiket: küçük harf (Türkçe karakterler dahil), rakam ve tire. */
export const TAG_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N}\p{M}-]*$/u;
export const COUNTRY_CODE_PATTERN = /^[A-Z]{2}$/;

export const MAX_TAGS = 20;
export const MAX_TAG_LENGTH = 50;
export const TITLE_MAX = 200;
export const EXCERPT_MAX = 1000;

/** Liste/ayrıntıda hangi yazılar istenir: `draft` ve `all` yalnız yöneticiye açıktır. */
export const BLOG_VISIBILITIES = ["published", "draft", "all"] as const;
export type BlogVisibility = (typeof BLOG_VISIBILITIES)[number];

const toUpperCase = (): PropertyDecorator => Transform(({ value }) => (typeof value === "string" ? value.trim().toUpperCase() : value));
/** Etiket(ler): `normalizeTag` (NFC, `İ` -> `i`, küçük harf); yazma ve süzgeç aynı kuralı kullanır. */
const normalizeTagValue = (): PropertyDecorator => Transform(({ value }) => (typeof value === "string" ? normalizeTag(value) : value));
const normalizeTags = (): PropertyDecorator =>
  Transform(({ value }) => (Array.isArray(value) ? value.map((t) => (typeof t === "string" ? normalizeTag(t) : t)) : value));

const VISIBILITY_DESCRIPTION =
  "Hangi yazılar: `published` (varsayılan), `draft` ya da `all`. `draft` ve `all` yalnız yöneticiye açıktır: oturumsuz istek 401, yönetici olmayan kullanıcı 403 alır (parametre sessizce yok sayılmaz).";

export class ListBlogPostsQueryDto extends PaginationQueryDto {
  @LangField()
  lang: Lang = DEFAULT_LANG;

  @ApiPropertyOptional({ enum: BLOG_VISIBILITIES, default: "published", description: VISIBILITY_DESCRIPTION })
  @IsOptional()
  @IsIn(BLOG_VISIBILITIES)
  status?: BlogVisibility;

  @ApiPropertyOptional({ type: String, maxLength: MAX_TAG_LENGTH, example: "ülke-rehberi", description: "Etikete göre süz (tam eşleşme, küçük harf)." })
  @IsOptional()
  @normalizeTagValue()
  @IsString()
  @MaxLength(MAX_TAG_LENGTH)
  @NoNullBytes()
  tag?: string;

  @ApiPropertyOptional({ type: String, example: "JP", description: "Ülke kodu (ISO 3166-1 alpha-2); büyük/küçük harf fark etmez." })
  @IsOptional()
  @toUpperCase()
  @IsString()
  @Matches(COUNTRY_CODE_PATTERN)
  country?: string;

  @ApiPropertyOptional({
    type: String,
    maxLength: 100,
    description: "Slug, başlık ve özette arama (başlık/özet için Türkçe ile istenen dil; büyük/küçük harf duyarsız, joker karakterler kaçırılır).",
  })
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(100)
  @NoNullBytes()
  q?: string;
}

export class GetBlogPostQueryDto {
  @LangField()
  lang: Lang = DEFAULT_LANG;

  @ApiPropertyOptional({
    enum: BLOG_VISIBILITIES,
    description: `${VISIBILITY_DESCRIPTION} Verilmezse yönetici her durumdaki yazıyı görür, diğerleri yalnız yayındakini.`,
  })
  @IsOptional()
  @IsIn(BLOG_VISIBILITIES)
  status?: BlogVisibility;
}

/** Bir dildeki tam içerik. Güncellemede bir dilin içeriği bütün olarak değiştirilir (alan alan birleştirme yok). */
@ApiExtraModels(...BLOG_BLOCK_MODELS)
export class BlogTranslationDto {
  @ApiProperty({ type: String, minLength: 1, maxLength: TITLE_MAX })
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(TITLE_MAX)
  @NotBlank()
  @NoNullBytes()
  @NoControlChars()
  title!: string;

  @ApiProperty({ type: String, minLength: 1, maxLength: EXCERPT_MAX, description: "Liste kartında görünen kısa özet." })
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(EXCERPT_MAX)
  @NotBlank()
  @NoNullBytes()
  @NoControlChars({ multiline: true })
  excerpt!: string;

  // Bloklar `validateBlocks` ile (blog-blocks.ts) alan yollarıyla doğrulanır; burada yalnız biçim denetlenir.
  @ApiProperty(BLOG_BODY_PROPERTY)
  @IsArray()
  @ArrayMaxSize(BLOCK_LIMITS.maxBlocks)
  body!: BlogBlock[];
}

export class CreateBlogTranslationsDto {
  @ApiProperty({ type: () => BlogTranslationDto, description: "Türkçe zorunludur; diğer diller yoksa Türkçeye düşülür." })
  @IsObject()
  @ValidateNested()
  @Type(() => BlogTranslationDto)
  tr!: BlogTranslationDto;

  @ApiPropertyOptional({ type: () => BlogTranslationDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => BlogTranslationDto)
  en?: BlogTranslationDto | null;

  @ApiPropertyOptional({ type: () => BlogTranslationDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => BlogTranslationDto)
  es?: BlogTranslationDto | null;
}

export class UpdateBlogTranslationsDto {
  @ApiPropertyOptional({ type: () => BlogTranslationDto, description: "Türkçe içeriği bütün olarak değiştirir. Silinemez." })
  @IsOptionalNotNull()
  @IsObject()
  @ValidateNested()
  @Type(() => BlogTranslationDto)
  tr?: BlogTranslationDto;

  @ApiPropertyOptional({ type: () => BlogTranslationDto, nullable: true, description: "Bütün olarak değiştirir; `null` bu dildeki çeviriyi siler." })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => BlogTranslationDto)
  en?: BlogTranslationDto | null;

  @ApiPropertyOptional({ type: () => BlogTranslationDto, nullable: true, description: "Bütün olarak değiştirir; `null` bu dildeki çeviriyi siler." })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => BlogTranslationDto)
  es?: BlogTranslationDto | null;
}

export class CreateBlogPostDto {
  @ApiProperty({ type: String, minLength: 3, maxLength: 120, example: "japonya-gezi-rehberi", description: "Benzersiz; küçük harf, rakam ve tire. Çakışırsa 409 `BLOG_SLUG_TAKEN`." })
  @TrimLowercase()
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  @Matches(SLUG_PATTERN)
  slug!: string;

  @ApiPropertyOptional({ enum: BLOG_STATUSES, default: "draft", description: "`published` ilk yayında `publishedAt` atar." })
  @IsOptionalNotNull()
  @IsIn(BLOG_STATUSES)
  status?: BlogStatus;

  @ApiPropertyOptional({ type: String, format: "uri", nullable: true, maxLength: 2048, description: "Yalnız https adresi." })
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(2048)
  @NoNullBytes()
  @IsHttpsUrl()
  coverImage?: string | null;

  @ApiPropertyOptional({ type: [String], maxItems: MAX_TAGS, description: "Küçük harfe çevrilir, tekrarlar atılır." })
  @IsOptionalNotNull()
  @normalizeTags()
  @IsArray()
  @ArrayMaxSize(MAX_TAGS)
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(MAX_TAG_LENGTH, { each: true })
  @Matches(TAG_PATTERN, { each: true })
  tags?: string[];

  @ApiPropertyOptional({ type: String, nullable: true, example: "JP", description: "Bağlı ülke (ISO 3166-1 alpha-2). Var olmayan ülke 400." })
  @IsOptional()
  @toUpperCase()
  @IsString()
  @Matches(COUNTRY_CODE_PATTERN)
  countryCode?: string | null;

  @ApiProperty({ type: () => CreateBlogTranslationsDto })
  @IsObject()
  @ValidateNested()
  @Type(() => CreateBlogTranslationsDto)
  translations!: CreateBlogTranslationsDto;
}

export class UpdateBlogPostDto {
  @ApiPropertyOptional({ type: String, minLength: 3, maxLength: 120 })
  @IsOptionalNotNull()
  @TrimLowercase()
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  @Matches(SLUG_PATTERN)
  slug?: string;

  @ApiPropertyOptional({ enum: BLOG_STATUSES, description: "`published`: ilk yayında `publishedAt` atanır. `draft`: yayın zamanı korunur." })
  @IsOptionalNotNull()
  @IsIn(BLOG_STATUSES)
  status?: BlogStatus;

  @ApiPropertyOptional({ type: String, format: "uri", nullable: true, maxLength: 2048, description: "Yalnız https adresi; `null` kapak görselini kaldırır." })
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(2048)
  @NoNullBytes()
  @IsHttpsUrl()
  coverImage?: string | null;

  @ApiPropertyOptional({ type: [String], maxItems: MAX_TAGS, description: "Verilirse etiket listesinin tamamı değiştirilir." })
  @IsOptionalNotNull()
  @normalizeTags()
  @IsArray()
  @ArrayMaxSize(MAX_TAGS)
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(MAX_TAG_LENGTH, { each: true })
  @Matches(TAG_PATTERN, { each: true })
  tags?: string[];

  @ApiPropertyOptional({ type: String, nullable: true, example: "JP", description: "`null` ülke bağını kaldırır." })
  @IsOptional()
  @toUpperCase()
  @IsString()
  @Matches(COUNTRY_CODE_PATTERN)
  countryCode?: string | null;

  @ApiPropertyOptional({ type: () => UpdateBlogTranslationsDto, description: "Yalnız gönderilen diller değişir; diğerleri korunur." })
  @IsOptionalNotNull()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateBlogTranslationsDto)
  translations?: UpdateBlogTranslationsDto;
}
