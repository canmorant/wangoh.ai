import { applyDecorators, type Type as NestType } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional, type ApiPropertyOptions } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDefined,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateBy,
  ValidateNested,
} from "class-validator";
import { Trim } from "../../common/transforms.js";
import { IsOptionalNotNull, NoNullBytes } from "../../common/validators.js";
import { isAcceptedImage, isHttpsUrl } from "../assets.js";
import { FOREIGN_LANGS } from "../content.constants.js";
import { isCalendarDate } from "../dates.js";
import { ArrayUnique } from "class-validator";

/**
 * Yazma gövdesi DTO'ları için kısa dekoratörler. Aynı sınıf hem istek doğrulaması hem Swagger belgesi hem de
 * (iç içe öğelerde) yanıt şeması olarak kullanılır: açık `@ApiProperty` + `class-validator` bir arada.
 *
 * `optional`: alan gönderilmeyebilir ama `null` OLAMAZ (`@IsOptionalNotNull`). `nullable`: `null` da geçerli
 * (yazma uçlarında "bu dili sil" anlamına gelir; `@IsOptional`).
 */
export interface FieldOptions {
  optional?: boolean;
  nullable?: boolean;
  description?: string;
}

function doc(options: FieldOptions, schema: ApiPropertyOptions): PropertyDecorator {
  const optional = options.optional === true || options.nullable === true;
  const full = { ...schema, ...(options.nullable ? { nullable: true } : {}), ...(options.description ? { description: options.description } : {}) } as ApiPropertyOptions;
  return optional ? ApiPropertyOptional(full) : ApiProperty(full);
}

function presence(options: FieldOptions): PropertyDecorator[] {
  if (options.nullable) return [IsOptional()];
  if (options.optional) return [IsOptionalNotNull()];
  return [];
}

export interface TextOptions extends FieldOptions {
  max: number;
  /** Varsayılan 1: boş metin geçersiz. */
  min?: number;
  example?: string;
  pattern?: RegExp;
}

/**
 * Metni NFC'ye çevirir: macOS gibi kaynaklardan gelen ayrışık Unicode ("I" + U+0307) birleşik "İ" olur. Aksi halde ad
 * arama terimiyle (NFC) eşleşmez, aynı ad iki ayrı kayıt olarak girilebilir ve şehir adı bağlantı anahtarı tutmaz.
 */
const Nfc = (): PropertyDecorator => Transform(({ value }) => (typeof value === "string" ? value.normalize("NFC") : value));

/** Kırpılan, NFC'ye çevrilen, NUL içermeyen, uzunluğu sınırlı metin. */
export function Text(options: TextOptions): PropertyDecorator {
  const min = options.min ?? 1;
  return applyDecorators(
    doc(options, { type: String, minLength: min, maxLength: options.max, ...(options.example ? { example: options.example } : {}), ...(options.pattern ? { pattern: options.pattern.source } : {}) }),
    ...presence(options),
    Nfc(),
    Trim(),
    IsString(),
    MinLength(min),
    MaxLength(options.max),
    NoNullBytes(),
    ...(options.pattern ? [Matches(options.pattern)] : []),
  );
}

/** Metin listesi: her öğe `Text` kurallarına uyar (kırpma hariç). */
export function TextList(options: FieldOptions & { maxItems: number; maxLength: number; minItems?: number; minLength?: number; example?: string[] }): PropertyDecorator {
  const minItems = options.minItems ?? 0;
  const minLength = options.minLength ?? 1;
  return applyDecorators(
    doc(options, { type: [String], minItems, maxItems: options.maxItems, ...(options.example ? { example: options.example } : {}) }),
    ...presence(options),
    Transform(({ value }) => (Array.isArray(value) ? value.map((item: unknown) => (typeof item === "string" ? item.normalize("NFC") : item)) : value)),
    IsArray(),
    ArrayMinSize(minItems),
    ArrayMaxSize(options.maxItems),
    IsString({ each: true }),
    MinLength(minLength, { each: true }),
    MaxLength(options.maxLength, { each: true }),
    NoNullBytes({ each: true }),
  );
}

/** `YYYY-AA-GG` ve takvimde var olan gün (`2026-13-45`, `0000-00-00`, `2025-02-29` reddedilir). */
export function CalendarDate(options: FieldOptions & { example?: string }): PropertyDecorator {
  return applyDecorators(
    doc(options, { type: String, minLength: 10, maxLength: 10, example: options.example ?? "2026-01-31", pattern: "^\\d{4}-\\d{2}-\\d{2}$" }),
    ...presence(options),
    Trim(),
    IsString(),
    ValidateBy({
      name: "isCalendarDate",
      validator: { validate: (value: unknown) => typeof value === "string" && isCalendarDate(value), defaultMessage: () => "$property YYYY-AA-GG biçiminde, takvimde var olan bir gün olmalı" },
    }),
  );
}

/** Yalnız https adresi (kimlik bilgisi yok): `javascript:`, `data:`, `http:` reddedilir. */
export function HttpsUrl(options: FieldOptions): PropertyDecorator {
  return applyDecorators(
    doc(options, { type: String, format: "uri", maxLength: 2048, example: "https://example.com/kaynak" }),
    ...presence(options),
    Trim(),
    IsString(),
    ValidateBy({ name: "isHttpsUrl", validator: { validate: (value: unknown) => typeof value === "string" && isHttpsUrl(value), defaultMessage: () => "$property yalnız https adresi olabilir" } }),
  );
}

/** Görsel: web AVIF yolu (`/images/<ad>.avif`) ya da https adresi. */
export function ContentImage(options: FieldOptions): PropertyDecorator {
  return applyDecorators(
    doc(options, { type: String, maxLength: 2048, example: "/images/ornek-gorsel-1a2b3c4d.avif", description: options.description ?? "Web yolu (`/images/<ad>.avif`) ya da https adresi. Yanıtta mutlak `imageUrl` üretilir." }),
    ...presence(options),
    Trim(),
    IsString(),
    ValidateBy({ name: "isContentImage", validator: { validate: (value: unknown) => typeof value === "string" && isAcceptedImage(value), defaultMessage: () => "$property /images/<ad>.avif yolu ya da https adresi olmalı" } }),
  );
}

/** Sabit değer kümesinden biri. */
export function Choice(values: readonly string[], options: FieldOptions = {}): PropertyDecorator {
  return applyDecorators(doc(options, { enum: values as string[] }), ...presence(options), IsIn(values));
}

export function Flag(options: FieldOptions = {}): PropertyDecorator {
  return applyDecorators(doc(options, { type: Boolean }), ...presence(options), IsBoolean());
}

export function Whole(options: FieldOptions & { min: number; max: number }): PropertyDecorator {
  return applyDecorators(doc(options, { type: "integer", minimum: options.min, maximum: options.max }), ...presence(options), IsInt(), Min(options.min), Max(options.max));
}

/** İç içe nesne (ya da `array` ile nesne listesi). */
export function Nested(type: NestType<unknown>, options: FieldOptions & { array?: boolean; maxItems?: number; minItems?: number }): PropertyDecorator {
  const list = options.array === true;
  return applyDecorators(
    doc(options, list ? { type: [type], ...(options.maxItems !== undefined ? { maxItems: options.maxItems } : {}) } : { type }),
    ...presence(options),
    // `ValidateNested` tanımsız değeri geçirir; zorunlu iç içe nesne yoksa servis 500 verirdi.
    ...(options.optional || options.nullable ? [] : [IsDefined()]),
    // `ValidateNested` dizileri de "iç içe" sayar: tek nesne beklenen yerde `[]` geçmesin. Aynı nedenle liste elemanı da
    // düz nesne olmalı; yoksa `[[]]` ve `[[geçerli nesne]]` geçer, saklanır ve okuma uçları 500 verir ya da dizi sızdırır.
    ...(list ? [IsArray(), ArrayMinSize(options.minItems ?? 0), ArrayMaxSize(options.maxItems ?? 100), IsObject({ each: true })] : [IsObject()]),
    ValidateNested({ each: list }),
    Type(() => type),
  );
}

/** `completeLangs` yazma alanı: tekrarsız `en`/`es` listesi (Türkçe her zaman tamdır). */
export function CompleteLangsField(description?: string): PropertyDecorator {
  return applyDecorators(
    ApiPropertyOptional({
      enum: FOREIGN_LANGS as unknown as string[],
      isArray: true,
      description:
        description ??
        "Tam çevrilmiş diller (`en`, `es`). Verilmezse mevcut liste korunur (çevirisi silinen dil düşer). Listelenen dilin tüm zorunlu alanları dolu olmalı.",
    }),
    IsOptionalNotNull(),
    IsArray(),
    ArrayMaxSize(FOREIGN_LANGS.length),
    ArrayUnique(),
    IsIn(FOREIGN_LANGS, { each: true }),
  );
}
