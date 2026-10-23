import { ApiProperty } from "@nestjs/swagger";
import { LANGS, type Lang } from "../../common/lang.js";
import { PaginatedDto } from "../../common/pagination.js";
import { BUDGETS, type Budget, CONTINENT_SLUGS, type ContinentSlug, type ForeignLang } from "../content.constants.js";
import { CitySummaryDto } from "./city.dto.js";
import { Choice, CompleteLangsField, ContentImage, Nested, Text, TextList } from "./decorators.js";
import { ImageCreditDto } from "./image-credit.dto.js";
import { TranslationsPatchDto } from "./translations-patch.js";

/* ------------------------------ ülke hub'ı ------------------------------ */
// Hub sınıfları hem yanıtta hem yönetici yazma gövdesinde kullanılır.

export class HubEssentialDto {
  @Text({ max: 300 })
  title!: string;

  @Text({ max: 2500 })
  body!: string;
}

export class HubCityLinkDto {
  @Text({ max: 80, description: "Şehir slug'ı." })
  slug!: string;

  @Text({ max: 120, description: "Şehir adı (istenen dilde, yoksa Türkçe)." })
  name!: string;
}

export class HubRouteIdeaDto {
  @Text({ max: 200 })
  title!: string;

  @Text({ max: 80, example: "9–11 gün" })
  duration!: string;

  @TextList({ maxItems: 12, maxLength: 120, description: "Rotadaki şehirler: Türkçe şehir adları (anahtar; çevrilmez). Görüntü adı ve slug için `cityLinks`." })
  cities!: string[];

  @Text({ max: 1500 })
  description!: string;

  @Nested(HubCityLinkDto, { array: true, maxItems: 12, optional: true, description: "Yalnız yanıtta: `cities` için slug ve görünen ad. Yazarken kabul edilir ama yok sayılır." })
  cityLinks?: HubCityLinkDto[];
}

export class CountryHubDto {
  @Text({ max: 200 })
  seoTitle!: string;

  @Text({ max: 500 })
  seoDescription!: string;

  @Text({ max: 300 })
  planningHeading!: string;

  @Text({ max: 300, optional: true })
  essentialsHeading?: string;

  @Text({ max: 300, optional: true })
  citiesHeading?: string;

  @Text({ max: 3000, description: "Şehir kartlarının üstündeki kısa ülke özeti." })
  cityGridIntro!: string;

  @TextList({ maxItems: 10, maxLength: 3000, minItems: 1 })
  intro!: string[];

  @Nested(HubEssentialDto, { array: true, maxItems: 30, optional: true })
  essentials?: HubEssentialDto[];

  @Nested(HubRouteIdeaDto, { array: true, maxItems: 20 })
  routeIdeas!: HubRouteIdeaDto[];
}

/* --------------------------- ülke: yanıt DTO'ları --------------------------- */

export class CountryTravelDto {
  @ApiProperty({ enum: LANGS, description: "Gerçekte sunulan dil. İstenen dil yok ya da tam değilse `tr`." })
  lang!: Lang;

  @ApiProperty({ type: Boolean, description: "İstenen dil tam olarak sunuldu mu? `false` ise Türkçeye düşülmüştür." })
  complete!: boolean;

  @ApiProperty({ type: "integer", description: "Öne çıkan ülkeler arasındaki sıra." })
  position!: number;

  @ApiProperty({ type: String, nullable: true, example: "https://wangoh.com/og/photo-1493976040374-85c8e12f0c0e-9fc55608.jpg", description: "Mutlak görsel adresi (JPEG)." })
  imageUrl!: string | null;

  @ApiProperty({ type: String, nullable: true, example: "#e0537a", description: "Biniş kartı vurgu rengi." })
  accent!: string | null;

  @ApiProperty({ enum: BUDGETS, nullable: true, description: "Bütçe düzeyi (dilden bağımsız anahtar); görünen ad `budgetLabel`." })
  budget!: Budget | null;

  @ApiProperty({ type: String, nullable: true, example: "Yüksek" })
  budgetLabel!: string | null;

  @ApiProperty({ type: String, nullable: true, example: "HND", description: "Ana varış havalimanı IATA kodu." })
  iata!: string | null;

  @ApiProperty({ type: String, nullable: true })
  description!: string | null;

  @ApiProperty({ type: String, nullable: true, description: "Ülkeyi anlatan tek cümle." })
  signature!: string | null;

  @ApiProperty({ type: String, nullable: true, description: "Varış şehri." })
  gateway!: string | null;

  @ApiProperty({ type: String, nullable: true, description: "Başkent (seyahat metni)." })
  capital!: string | null;

  @ApiProperty({ type: String, nullable: true, example: "Mart–Mayıs · Ekim–Kasım" })
  bestSeason!: string | null;

  @ApiProperty({ type: String, nullable: true, example: "11sa 30dk", description: "İstanbul kalkışlı yaklaşık uçuş süresi." })
  flightTime!: string | null;

  @ApiProperty({ type: CountryHubDto, nullable: true, description: "Ülke sayfası içeriği." })
  hub!: CountryHubDto | null;
}

export class CountrySummaryDto {
  @ApiProperty({ type: String, example: "FR", description: "ISO 3166-1 alpha-2." })
  code!: string;

  @ApiProperty({ type: String, example: "FRA" })
  iso3!: string;

  @ApiProperty({ enum: CONTINENT_SLUGS })
  continent!: ContinentSlug;

  @ApiProperty({
    type: String,
    nullable: true,
    example: "Batı Avrupa",
    description: "Alt bölge, `lang` dilinde. Ülke çevirisinde dil başına yalnız ad zorunludur: sunulan dilde alt bölge yoksa `null` döner (Türkçe değer karıştırılmaz).",
  })
  subregion!: string | null;

  @ApiProperty({ type: String, nullable: true, example: "🇫🇷", description: "Emoji bayrak." })
  flag!: string | null;

  @ApiProperty({ type: String, example: "https://wangoh.com/flags/fr.svg" })
  flagUrl!: string;

  @ApiProperty({ type: Number, nullable: true })
  latitude!: number | null;

  @ApiProperty({ type: Number, nullable: true })
  longitude!: number | null;

  @ApiProperty({ type: Boolean })
  landlocked!: boolean;

  @ApiProperty({ type: [String], description: "Başkent(ler), kaynak biçimiyle (çevrilmemiş)." })
  capital!: string[];

  @ApiProperty({ type: Boolean, description: "Seyahat içeriği (öne çıkan ülke) var mı?" })
  hasTravel!: boolean;

  @ApiProperty({ type: String, nullable: true, description: "Öne çıkan ülkelerin mutlak görsel adresi (JPEG); diğerlerinde `null`." })
  imageUrl!: string | null;

  @ApiProperty({ type: String, example: "Fransa" })
  name!: string;

  @ApiProperty({ type: String, nullable: true, example: "Fransa Cumhuriyeti", description: "Resmî ad, `lang` dilinde; sunulan dilde yoksa `null` (Türkçe değer karıştırılmaz)." })
  officialName!: string | null;

  @ApiProperty({ enum: LANGS, description: "`name`, `officialName` ve `subregion`un gerçekte sunulan dili. İstenen dil yok ya da tam değilse `tr`." })
  lang!: Lang;

  @ApiProperty({ type: Boolean, description: "İstenen dil tam olarak sunuldu mu? `false` ise Türkçeye düşülmüştür." })
  complete!: boolean;
}

export class CountryPageDto extends PaginatedDto(CountrySummaryDto) {}

export class CountryDetailDto extends CountrySummaryDto {
  @ApiProperty({ type: [String], description: "Kara sınırı olan komşuların ISO3 kodları." })
  borders!: string[];

  @ApiProperty({ type: CountryTravelDto, nullable: true, description: "Seyahat bilgisi; yalnız öne çıkan ülkelerde." })
  travel!: CountryTravelDto | null;

  @ApiProperty({ type: [CitySummaryDto], description: "Ülkenin şehirleri (sıralı)." })
  cities!: CitySummaryDto[];

  @ApiProperty({
    type: [ImageCreditDto],
    description:
      "Bu ülke sayfasında gösterilen görsellerin (ülke görseli ve şehir kartı görselleri; yinelenenler tek kez, bu sırayla) zorunlu görsel atıfları. " +
      "Web'deki \"Görsel atıfları\" bloğuyla aynı kuraldır: yalnız atıf gerektiren (CC BY / CC BY-SA...) görseller gelir; atfı olmayanlar ve harici görseller listede yer almaz. Yalnız ayrıntıda gelir. Lisans gereği ekranda gösterilmelidir.",
  })
  imageCredits!: ImageCreditDto[];
}

/* ---------------------------- ülke: yazma (yönetici) ---------------------------- */

export class CountryFieldsPatchDto {
  @Text({ max: 120, optional: true })
  name?: string;

  @Text({ max: 250, optional: true })
  officialName?: string;

  @Text({ max: 120, optional: true })
  subregion?: string;
}

export class CountryTranslationsPatchDto extends TranslationsPatchDto(CountryFieldsPatchDto) {}

export class TravelFieldsPatchDto {
  @Text({ max: 800, optional: true })
  description?: string;

  @Text({ max: 400, optional: true })
  signature?: string;

  @Text({ max: 120, optional: true })
  gateway?: string;

  @Text({ max: 120, optional: true })
  capital?: string;

  @Text({ max: 200, optional: true })
  bestSeason?: string;

  @Text({ max: 80, optional: true })
  flightTime?: string;

  @Text({ max: 60, optional: true, description: "Bütçe düzeyinin görünen adı (ör. `Yüksek`, `High`)." })
  budget?: string;

  @Nested(CountryHubDto, { optional: true, description: "Ülke sayfası içeriği; verilirse o dildeki hub'ın tümüyle yerine geçer." })
  hub?: CountryHubDto;
}

export class TravelTranslationsPatchDto extends TranslationsPatchDto(TravelFieldsPatchDto) {}

export class CountryTravelPatchDto {
  @ContentImage({ optional: true })
  image?: string;

  @Text({ max: 7, min: 7, pattern: /^#[0-9a-fA-F]{6}$/, optional: true, example: "#e0537a" })
  accent?: string;

  @Choice(BUDGETS, { optional: true })
  budget?: Budget;

  @Text({ max: 3, min: 3, pattern: /^[A-Z]{3}$/, optional: true, example: "HND", description: "IATA havalimanı kodu." })
  iata?: string;

  @Nested(TravelTranslationsPatchDto, { optional: true })
  translations?: TravelTranslationsPatchDto;

  @CompleteLangsField()
  completeLangs?: ForeignLang[];
}

/**
 * Ülke güncelleme gövdesi. Çeviri alanları dil başına BİRLEŞTİRİLİR (gönderilmeyen alan korunur). Hiçbir alan
 * yoksa değişiklik yapılmaz. Seyahat bilgisi yalnız öne çıkan ülkelerde güncellenir (yoksa 404).
 */
export class UpdateCountryDto {
  @Nested(CountryTranslationsPatchDto, { optional: true, description: "Ülke adı, resmî ad ve alt bölge çevirileri." })
  translations?: CountryTranslationsPatchDto;

  @Nested(CountryTravelPatchDto, { optional: true, description: "Seyahat bilgisi (öne çıkan ülkeler)." })
  travel?: CountryTravelPatchDto;
}
