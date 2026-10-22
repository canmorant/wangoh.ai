import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsIn, IsOptional, IsString, MaxLength } from "class-validator";
import { type Lang, DEFAULT_LANG, LangField } from "../../common/lang.js";
import { PaginationQueryDto } from "../../common/pagination.js";
import { ToBoolean, Trim } from "../../common/transforms.js";
import { NoNullBytes } from "../../common/validators.js";
import { CONTINENT_SLUGS, type ContinentSlug, MAX_QUERY_LENGTH } from "../content.constants.js";

const SEARCH_DESCRIPTION =
  "Arama (büyük/küçük harf ve aksan duyarsız; Türkçe `i/ı/İ/I` aynı sayılır, `%` `_` `\\` düz karakterdir).";

export class ListCountriesQueryDto extends PaginationQueryDto {
  @LangField()
  lang: Lang = DEFAULT_LANG;

  @ApiPropertyOptional({ enum: CONTINENT_SLUGS, description: "Kıta filtresi." })
  @IsOptional()
  @IsIn(CONTINENT_SLUGS)
  continent?: ContinentSlug;

  @ApiPropertyOptional({
    type: String,
    maxLength: MAX_QUERY_LENGTH,
    description: `${SEARCH_DESCRIPTION} Ülke adı (tr/en/es), resmî ad ve başkentte aranır.`,
  })
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(MAX_QUERY_LENGTH)
  @NoNullBytes()
  q?: string;

  @ApiPropertyOptional({
    type: Boolean,
    description: "`true`: yalnız seyahat içeriği olan (öne çıkan) ülkeler, destinasyon sırasıyla. `false`: yalnız diğerleri. Verilmezse hepsi, ada göre.",
  })
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  hasTravel?: boolean;
}

export class ListCitiesQueryDto extends PaginationQueryDto {
  @LangField()
  lang: Lang = DEFAULT_LANG;

  @ApiPropertyOptional({ type: String, maxLength: MAX_QUERY_LENGTH, description: `${SEARCH_DESCRIPTION} Şehir adında (tr/en/es) ve adreste (slug) aranır.` })
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(MAX_QUERY_LENGTH)
  @NoNullBytes()
  q?: string;
}
