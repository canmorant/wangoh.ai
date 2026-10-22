import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";
import { LANGS, type Lang } from "../../common/lang.js";
import { CalendarDate, Choice, Flag, HttpsUrl, Nested, Text, TextList } from "./decorators.js";

/** Kaba fiyat kategorisi (web verisi Türkçe tutar; kesin fiyat asla yazılmaz). */
export const PRICE_LEVELS = ["Ekonomik", "Orta", "Yüksek"] as const;
export const PLACES_KINDS = ["food", "sights"] as const;
export const DIETARY_CATEGORIES = ["vegan", "halal"] as const;
export const DIETARY_STATUSES = [
  "fully-vegan",
  "vegan-focused",
  "vegan-options",
  "certified-halal",
  "restaurant-confirmed",
  "halal-options",
  "muslim-friendly",
  "verification-recommended",
] as const;
export const DIETARY_SOURCE_TYPES = ["certifier", "official-tourism", "restaurant", "specialist-directory", "vegan-directory"] as const;
const SECTION_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/* ------------------------- rehber gövdesi öğeleri ------------------------- */
// Bu sınıflar hem yanıtta hem yönetici yazma gövdesinde kullanılır.

export class GuideQuickFactDto {
  @Text({ max: 120, example: "Para birimi" })
  label!: string;

  @Text({ max: 800 })
  value!: string;
}

/**
 * Rehber paragraflarında tek satır içi işaretleme vardır: `**kalın**` (web, içinde `*` olmayan çift yıldız ayraçlı parçaları
 * `<strong>` çizer). HTML, bağlantı, başlık ya da liste işaretlemesi yoktur; web başka işaretlemeyi de çizmez (birkaç metindeki
 * tek `*` düz karakterdir).
 */
const PARAGRAPH_DOC =
  "Paragraflar. `**kalın**` satır içi işaretlemesi içerebilir (web `<strong>` çizer); düz metin çizen istemci `**` ayraçlarını ayıklamalıdır. Başka işaretleme işlenmez.";

export class GuideSubsectionDto {
  @Text({ max: 300 })
  heading!: string;

  @TextList({ maxItems: 30, maxLength: 4000, minItems: 1, description: PARAGRAPH_DOC })
  body!: string[];
}

export class GuideSectionDto {
  @Text({ max: 300, description: "H2 başlığı." })
  heading!: string;

  @Text({ max: 80, pattern: SECTION_ID, example: "ulasim", description: "URL parçası / içindekiler kimliği." })
  id!: string;

  @TextList({ maxItems: 30, maxLength: 4000, description: PARAGRAPH_DOC })
  body!: string[];

  @Nested(GuideSubsectionDto, { array: true, maxItems: 20, optional: true, description: "İsteğe bağlı H3 alt bölümleri." })
  subsections?: GuideSubsectionDto[];
}

export class GuidePlaceDto {
  @Text({ max: 200 })
  name!: string;

  @Text({ max: 200, description: "Semt / bölge." })
  area!: string;

  @Text({ max: 600, description: "Ne ile bilinir." })
  known!: string;

  @Text({ max: 1500, description: "Neden gidilir." })
  why!: string;

  @Choice(PRICE_LEVELS, { optional: true, description: "Kaba kategori (Türkçe): kesin fiyat yoktur." })
  price?: (typeof PRICE_LEVELS)[number];

  @Text({ max: 800, optional: true, description: "Rezervasyon / sıra beklentisi gibi pratik not." })
  tip?: string;
}

export class GuideItineraryDayDto {
  @Text({ max: 300 })
  title!: string;

  @Text({ max: 1500 })
  morning!: string;

  @Text({ max: 1500 })
  afternoon!: string;

  @Text({ max: 1500 })
  evening!: string;
}

export class GuidePracticalTipDto {
  @Text({ max: 300 })
  title!: string;

  @Text({ max: 1500 })
  body!: string;
}

export class GuideFaqDto {
  @Text({ max: 400 })
  q!: string;

  @Text({ max: 3000 })
  a!: string;
}

export class GuideRelatedDto {
  @Text({ max: 120, description: "Aynı ülkedeki şehrin Türkçe adı (anahtar; çevrilmez)." })
  city!: string;

  @Text({ max: 300, description: "Bağlantı metni." })
  anchor!: string;

  @Text({ max: 800 })
  description!: string;

  @ApiPropertyOptional({ type: String, nullable: true, readOnly: true, description: "Yalnız yanıtta: şehrin slug'ı (`/v1/countries/:code/cities/:slug`). Yazarken kabul edilir ama yok sayılır." })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  slug?: string | null;
}

export class GuideSourceDto {
  @Text({ max: 300 })
  name!: string;

  @HttpsUrl({})
  url!: string;
}

export class DietaryVerificationDto {
  @Choice(DIETARY_STATUSES)
  status!: (typeof DIETARY_STATUSES)[number];

  @Text({ max: 300 })
  sourceName!: string;

  @HttpsUrl({})
  sourceUrl!: string;

  @Choice(DIETARY_SOURCE_TYPES)
  sourceType!: (typeof DIETARY_SOURCE_TYPES)[number];

  @Text({ max: 1500, description: "Etiketin sınırları: alkol, ortak mutfak ya da yeniden teyit ihtiyacı." })
  note!: string;
}

export class DietaryRestaurantDto {
  @Text({ max: 200, description: "Özel isim: çevrilmez." })
  name!: string;

  @Choice(DIETARY_CATEGORIES)
  category!: (typeof DIETARY_CATEGORIES)[number];

  @Text({ max: 200 })
  cuisine!: string;

  @Text({ max: 200 })
  area!: string;

  @Text({ max: 1500 })
  description!: string;

  @Text({ max: 1500 })
  why!: string;

  @Choice(PRICE_LEVELS, { optional: true })
  price?: (typeof PRICE_LEVELS)[number];

  @Text({ max: 400, optional: true })
  address?: string;

  @HttpsUrl({ optional: true })
  officialUrl?: string;

  @Text({ max: 120, optional: true, description: "Kaynak verideki şehir adı (Türkçe)." })
  city?: string;

  @Nested(DietaryVerificationDto, {})
  verification!: DietaryVerificationDto;

  @CalendarDate({ example: "2026-01-31", description: "Son editoryal kontrol (YYYY-AA-GG; takvimde var olan bir gün)." })
  lastVerified!: string;
}

export class DietaryGuideDto {
  @Nested(DietaryRestaurantDto, { array: true, maxItems: 50 })
  vegan!: DietaryRestaurantDto[];

  @Nested(DietaryRestaurantDto, { array: true, maxItems: 50 })
  halal!: DietaryRestaurantDto[];

  @Text({ max: 3000, optional: true, description: "Güçlü kanıt bulunamadığında boş kart yerine açık araştırma notu." })
  researchNote?: string;
}

/* ----------------------- rehber gövdesi: yazma (kısmi) ----------------------- */

/**
 * Yönetici güncellemesinde bir dilin rehber gövdesi. Her alan isteğe bağlıdır; gönderilen alan o dildeki alanın
 * YERİNE geçer (diziler tümüyle değişir), gönderilmeyen alan korunur. Yeni bir dil/rehber oluştururken zorunlu
 * alanlar (seoTitle, seoDescription, h1, lede, quickFacts, sections, places, itinerary, faqs, reviewedAt) birleşmiş sonuçta bulunmalıdır.
 */
export class GuideBodyInputDto {
  @Text({ max: 200, optional: true })
  seoTitle?: string;

  @Text({ max: 400, optional: true })
  seoDescription?: string;

  @Text({ max: 300, optional: true, description: "Sayfadaki tek H1." })
  h1?: string;

  @Text({ max: 1500, optional: true, description: "Hero altındaki giriş cümlesi." })
  lede?: string;

  @Nested(GuideQuickFactDto, { array: true, maxItems: 30, optional: true })
  quickFacts?: GuideQuickFactDto[];

  @Nested(GuideSectionDto, { array: true, maxItems: 40, optional: true })
  sections?: GuideSectionDto[];

  @Nested(GuidePlaceDto, { array: true, maxItems: 40, optional: true })
  places?: GuidePlaceDto[];

  @Choice(PLACES_KINDS, { optional: true, description: "`food` (varsayılan): yeme-içme kartları; `sights`: gezi durakları." })
  placesKind?: (typeof PLACES_KINDS)[number];

  @Nested(GuideItineraryDayDto, { array: true, maxItems: 30, optional: true })
  itinerary?: GuideItineraryDayDto[];

  @Text({ max: 300, optional: true })
  practicalHeading?: string;

  @Nested(GuidePracticalTipDto, { array: true, maxItems: 40, optional: true })
  practicalTips?: GuidePracticalTipDto[];

  @Nested(GuideFaqDto, { array: true, maxItems: 40, optional: true })
  faqs?: GuideFaqDto[];

  @Nested(GuideRelatedDto, { array: true, maxItems: 30, optional: true })
  relatedGuides?: GuideRelatedDto[];

  @Nested(GuideSourceDto, { array: true, maxItems: 60, optional: true })
  sources?: GuideSourceDto[];

  @Text({ max: 1500, optional: true, description: "Zamanla değişebilecek bilgiler için not." })
  volatileNote?: string;

  @CalendarDate({ optional: true, example: "2026-01-31", description: "Son gözden geçirme tarihi (YYYY-AA-GG; takvimde var olan bir gün)." })
  reviewedAt?: string;

  @Flag({ optional: true, description: "Ülke düzeyindeki pratik bilgiler ülke sayfasında." })
  countryInfoOnHub?: boolean;

  @Nested(DietaryGuideDto, { optional: true, description: "Vegan ve helal öneriler." })
  dietary?: DietaryGuideDto;
}

/** Bir şehir rehberinin yazma gövdesindeki zorunlu alanlar (birleşmiş sonuçta aranır). */
export const REQUIRED_GUIDE_FIELDS = ["seoTitle", "seoDescription", "h1", "lede", "quickFacts", "sections", "places", "itinerary", "faqs", "reviewedAt"] as const;

/* ------------------------------ rehber: yanıt ------------------------------ */

/** Şehir rehberi: istenen dilde (ya da Türkçe) gövde. */
export class CityGuideDto {
  @ApiProperty({ enum: LANGS, description: "Gerçekte sunulan dil. İstenen dil yok ya da tam değilse `tr`." })
  lang!: Lang;

  @ApiProperty({ type: Boolean, description: "İstenen dil tam olarak sunuldu mu? `false` ise Türkçeye düşülmüştür." })
  complete!: boolean;

  @ApiProperty({ type: Boolean, description: "Editoryal olarak gözden geçirildi mi (son tarih: `reviewedAt`)." })
  reviewed!: boolean;

  @ApiProperty({ type: String })
  seoTitle!: string;

  @ApiProperty({ type: String })
  seoDescription!: string;

  @ApiProperty({ type: String })
  h1!: string;

  @ApiProperty({ type: String })
  lede!: string;

  @ApiProperty({ type: [GuideQuickFactDto] })
  quickFacts!: GuideQuickFactDto[];

  @ApiProperty({ type: [GuideSectionDto] })
  sections!: GuideSectionDto[];

  @ApiProperty({ type: [GuidePlaceDto] })
  places!: GuidePlaceDto[];

  @ApiPropertyOptional({ enum: PLACES_KINDS })
  placesKind?: (typeof PLACES_KINDS)[number];

  @ApiProperty({ type: [GuideItineraryDayDto] })
  itinerary!: GuideItineraryDayDto[];

  @ApiPropertyOptional({ type: String })
  practicalHeading?: string;

  @ApiPropertyOptional({ type: [GuidePracticalTipDto] })
  practicalTips?: GuidePracticalTipDto[];

  @ApiProperty({ type: [GuideFaqDto] })
  faqs!: GuideFaqDto[];

  @ApiPropertyOptional({ type: [GuideRelatedDto] })
  relatedGuides?: GuideRelatedDto[];

  @ApiPropertyOptional({ type: [GuideSourceDto] })
  sources?: GuideSourceDto[];

  @ApiPropertyOptional({ type: String })
  volatileNote?: string;

  @ApiProperty({ type: String, example: "2026-01-31", description: "Son gözden geçirme tarihi (YYYY-AA-GG; takvimde var olan bir gün)." })
  reviewedAt!: string;

  @ApiPropertyOptional({ type: Boolean })
  countryInfoOnHub?: boolean;

  @ApiPropertyOptional({ type: DietaryGuideDto })
  dietary?: DietaryGuideDto;
}
