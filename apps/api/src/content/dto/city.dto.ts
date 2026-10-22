import { ApiProperty } from "@nestjs/swagger";
import { LANGS, type Lang } from "../../common/lang.js";
import { PaginatedDto } from "../../common/pagination.js";
import type { ForeignLang } from "../content.constants.js";
import { MAX_SLUG_LENGTH, SLUG_PATTERN } from "../slug.js";
import { CompleteLangsField, ContentImage, Flag, Nested, Text, Whole } from "./decorators.js";
import { CityGuideDto, GuideBodyInputDto } from "./guide.dto.js";
import { TranslationsPatchDto } from "./translations-patch.js";

/* ------------------------------ şehir: yanıt ------------------------------ */

export class CitySummaryDto {
  @ApiProperty({ type: String, example: "tokyo", description: "Web adresindeki şehir parçası (`/japonya/tokyo`)." })
  slug!: string;

  @ApiProperty({ type: String, example: "JP" })
  countryCode!: string;

  @ApiProperty({ type: "integer", description: "Ülke içindeki sıra." })
  position!: number;

  @ApiProperty({ type: String, example: "Tokyo" })
  name!: string;

  @ApiProperty({ type: String, nullable: true })
  description!: string | null;

  @ApiProperty({ type: String, nullable: true, example: "https://wangoh.com/og/photo-1540959733332-eab4deabeeaf-a87af73a.jpg", description: "Mutlak görsel adresi (JPEG)." })
  imageUrl!: string | null;

  @ApiProperty({ type: Boolean, description: "Şehir rehberi (`GET .../cities/:slug` içinde `guide`) var mı?" })
  hasGuide!: boolean;

  @ApiProperty({ enum: LANGS, description: "`name` ve `description`ın gerçekte sunulan dili. İstenen dil yok ya da tam değilse `tr`." })
  lang!: Lang;

  @ApiProperty({ type: Boolean, description: "İstenen dil tam olarak sunuldu mu? `false` ise Türkçeye düşülmüştür." })
  complete!: boolean;
}

export class CityPageDto extends PaginatedDto(CitySummaryDto) {}

export class CityCountryDto {
  @ApiProperty({ type: String, example: "JP" })
  code!: string;

  @ApiProperty({ type: String, example: "Japonya", description: "Ülke adı (istenen dilde, yoksa Türkçe)." })
  name!: string;

  @ApiProperty({ type: String, nullable: true })
  flag!: string | null;

  @ApiProperty({ type: String })
  flagUrl!: string;
}

export class CityDetailDto extends CitySummaryDto {
  @ApiProperty({ type: CityCountryDto })
  country!: CityCountryDto;

  @ApiProperty({ type: CityGuideDto, nullable: true, description: "Rehber gövdesi; `lang`/`complete` rehberin kendi durumudur (şehir kartından farklı olabilir)." })
  guide!: CityGuideDto | null;
}

/* ------------------------------ şehir: yazma ------------------------------ */

export class CityFieldsDto {
  @Text({ max: 120 })
  name!: string;

  @Text({ max: 800 })
  description!: string;
}

export class CityFieldsPatchDto {
  @Text({ max: 120, optional: true })
  name?: string;

  @Text({ max: 800, optional: true })
  description?: string;
}

export class CityTranslationsPatchDto extends TranslationsPatchDto(CityFieldsPatchDto) {}

export class GuideTranslationsPatchDto extends TranslationsPatchDto(GuideBodyInputDto) {}

/** Şehir rehberi yaması. Rehber yoksa oluşturulur (Türkçe gövdede zorunlu alanlar bulunmalı). */
export class CityGuidePatchDto {
  @Nested(GuideTranslationsPatchDto, { optional: true })
  translations?: GuideTranslationsPatchDto;

  @CompleteLangsField()
  completeLangs?: ForeignLang[];

  @Flag({ optional: true, description: "Editoryal olarak gözden geçirildi mi." })
  reviewed?: boolean;
}

/**
 * Şehir güncelleme gövdesi. Çeviri alanları dil başına BİRLEŞTİRİLİR. Adres (slug) değişmez: farklı adres için şehri
 * silip yeniden ekleyin.
 */
export class UpdateCityDto {
  @Whole({ min: 0, max: 10_000, optional: true })
  position?: number;

  @ContentImage({ nullable: true, description: "`null` görseli kaldırır." })
  image?: string | null;

  @Nested(CityTranslationsPatchDto, { optional: true })
  translations?: CityTranslationsPatchDto;

  @CompleteLangsField()
  completeLangs?: ForeignLang[];

  @Nested(CityGuidePatchDto, { optional: true })
  guide?: CityGuidePatchDto;
}

export class CreateCityTranslationsDto {
  @Nested(CityFieldsDto, { description: "Türkçe (kaynak) ad ve açıklama; zorunlu." })
  tr!: CityFieldsDto;

  @Nested(CityFieldsDto, { optional: true })
  en?: CityFieldsDto;

  @Nested(CityFieldsDto, { optional: true })
  es?: CityFieldsDto;
}

export class CreateCityDto {
  @Text({ max: MAX_SLUG_LENGTH, pattern: SLUG_PATTERN, optional: true, example: "yeni-sehir", description: "Web adresi parçası. Verilmezse Türkçe addan web'in `slugify` kuralıyla türetilir. Ülkede benzersiz olmalı (409)." })
  slug?: string;

  @Whole({ min: 0, max: 10_000, optional: true, description: "Verilmezse ülkenin son sırasına eklenir." })
  position?: number;

  @ContentImage({ optional: true })
  image?: string;

  @Nested(CreateCityTranslationsDto, {})
  translations!: CreateCityTranslationsDto;

  @CompleteLangsField("Tam çevrilmiş diller (`en`, `es`). Verilmezse gönderilen yabancı dillerin hepsi tam sayılır (her birinde ad ve açıklama zorunludur).")
  completeLangs?: ForeignLang[];

  @Nested(CityGuidePatchDto, { optional: true, description: "İsteğe bağlı rehber (Türkçe gövdede zorunlu alanlar bulunmalı)." })
  guide?: CityGuidePatchDto;
}
