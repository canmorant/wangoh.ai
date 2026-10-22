import { ApiProperty, ApiPropertyOptional, type ApiPropertyOptions, getSchemaPath } from "@nestjs/swagger";
import { BLOCK_LIMITS, type BlogBlock } from "../blog-blocks.js";

/**
 * Blok sınıfları YALNIZ OpenAPI belgesi içindir (istemci tipleri bunlardan üretilir): doğrulama
 * `blog-blocks.ts` içindeki `validateBlocks`ta yapılır. Sınır değerleri aynı sabitlerden gelir.
 */
export class HeadingBlockDto {
  @ApiProperty({ type: String, enum: ["heading"] })
  type!: "heading";

  @ApiProperty({ type: "integer", enum: [2, 3], description: "Başlık düzeyi (h2 ya da h3)." })
  level!: 2 | 3;

  @ApiProperty({ type: String, maxLength: BLOCK_LIMITS.heading })
  text!: string;
}

export class ParagraphBlockDto {
  @ApiProperty({ type: String, enum: ["paragraph"] })
  type!: "paragraph";

  @ApiProperty({ type: String, maxLength: BLOCK_LIMITS.paragraph, description: "Düz metin; satır sonu içerebilir." })
  text!: string;
}

export class ListBlockDto {
  @ApiProperty({ type: String, enum: ["list"] })
  type!: "list";

  @ApiProperty({ type: Boolean, description: "true: numaralı liste, false: madde işaretli liste." })
  ordered!: boolean;

  @ApiProperty({ type: [String], minItems: 1, maxItems: BLOCK_LIMITS.listItems })
  items!: string[];
}

export class QuoteBlockDto {
  @ApiProperty({ type: String, enum: ["quote"] })
  type!: "quote";

  @ApiProperty({ type: String, maxLength: BLOCK_LIMITS.quote })
  text!: string;

  @ApiPropertyOptional({ type: String, maxLength: BLOCK_LIMITS.cite, description: "Alıntının kaynağı." })
  cite?: string;
}

export class ImageBlockDto {
  @ApiProperty({ type: String, enum: ["image"] })
  type!: "image";

  @ApiProperty({ type: String, format: "uri", maxLength: BLOCK_LIMITS.url, description: "Yalnız https adresi." })
  url!: string;

  @ApiProperty({ type: String, maxLength: BLOCK_LIMITS.alt, description: "Erişilebilirlik için görsel açıklaması." })
  alt!: string;

  @ApiPropertyOptional({ type: String, maxLength: BLOCK_LIMITS.caption })
  caption?: string;
}

/** `body` alanının OpenAPI şeması: `type` ayırıcılı blok birleşimi (istek ve yanıtta aynı). */
export const BLOG_BODY_PROPERTY: ApiPropertyOptions = {
  type: "array",
  maxItems: BLOCK_LIMITS.maxBlocks,
  description:
    "Düz blok dizisi (HTML/Markdown yok). Bilinmeyen tür, aşırı uzun metin, kontrol karakteri ve https dışı görsel adresi reddedilir.",
  items: {
    oneOf: [
      { $ref: getSchemaPath(HeadingBlockDto) },
      { $ref: getSchemaPath(ParagraphBlockDto) },
      { $ref: getSchemaPath(ListBlockDto) },
      { $ref: getSchemaPath(QuoteBlockDto) },
      { $ref: getSchemaPath(ImageBlockDto) },
    ],
    discriminator: {
      propertyName: "type",
      mapping: {
        heading: getSchemaPath(HeadingBlockDto),
        paragraph: getSchemaPath(ParagraphBlockDto),
        list: getSchemaPath(ListBlockDto),
        quote: getSchemaPath(QuoteBlockDto),
        image: getSchemaPath(ImageBlockDto),
      },
    },
  },
};

export const BLOG_BLOCK_MODELS = [HeadingBlockDto, ParagraphBlockDto, ListBlockDto, QuoteBlockDto, ImageBlockDto] as const;

export type { BlogBlock };
