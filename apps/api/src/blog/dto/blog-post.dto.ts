import { ApiProperty } from "@nestjs/swagger";
import { PaginatedDto } from "../../common/pagination.js";
import { type Lang, LANGS } from "../../db/schema/types.js";
import { BLOG_STATUSES, type BlogStatus } from "../../db/schema/enums.js";
import type { BlogBlock } from "../blog-blocks.js";
import { BLOG_BODY_PROPERTY } from "./blog-block.dto.js";

/** Yazar: yalnız görünen ad. E-posta ve kimlik asla yanıtta yer almaz. */
export class BlogAuthorDto {
  @ApiProperty({ type: String, example: "Ayşe" })
  displayName!: string;
}

/** Liste kartı: gövde YOK. */
export class BlogPostSummaryDto {
  @ApiProperty({ type: String, format: "uuid" })
  id!: string;

  @ApiProperty({ type: String, example: "japonya-gezi-rehberi", description: "Benzersiz adres parçası (küçük harf, rakam ve tire)." })
  slug!: string;

  @ApiProperty({ enum: BLOG_STATUSES, description: "Herkese açık uçlarda her zaman `published`; taslaklar yalnız yöneticiye döner." })
  status!: BlogStatus;

  @ApiProperty({ enum: LANGS, description: "Gerçekte sunulan dil." })
  lang!: Lang;

  @ApiProperty({ type: Boolean, description: "İstenen dil tam sunuldu mu? `false` ise başlık, özet ve gövde Türkçeye düşmüştür." })
  complete!: boolean;

  @ApiProperty({ enum: LANGS, isArray: true, description: "Yazının çevirisi bulunan diller." })
  availableLangs!: Lang[];

  @ApiProperty({ type: String })
  title!: string;

  @ApiProperty({ type: String, description: "Kısa özet (kart metni)." })
  excerpt!: string;

  @ApiProperty({ type: String, format: "uri", nullable: true, description: "Kapak görselinin mutlak https adresi." })
  coverImage!: string | null;

  @ApiProperty({ type: [String] })
  tags!: string[];

  @ApiProperty({ type: String, nullable: true, example: "JP", description: "Bağlı ülkenin ISO 3166-1 alpha-2 kodu." })
  countryCode!: string | null;

  @ApiProperty({ type: () => BlogAuthorDto, nullable: true, description: "Yazar silinmişse ya da yoksa null." })
  author!: BlogAuthorDto | null;

  @ApiProperty({ type: String, format: "date-time", nullable: true, description: "İlk yayın zamanı; hiç yayınlanmamış taslaklarda null. Taslağa geri almak değeri silmez." })
  publishedAt!: string | null;

  @ApiProperty({ type: String, format: "date-time" })
  createdAt!: string;

  @ApiProperty({ type: String, format: "date-time" })
  updatedAt!: string;
}

/** Yazı ayrıntısı: özet alanları + tam gövde. */
export class BlogPostDto extends BlogPostSummaryDto {
  @ApiProperty(BLOG_BODY_PROPERTY)
  body!: BlogBlock[];
}

export class BlogPostPageDto extends PaginatedDto(BlogPostSummaryDto) {}
