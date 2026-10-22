import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { ApiErrors } from "../common/api-docs.js";
import { Public, Roles } from "../common/decorators/index.js";
import { LangQueryDto } from "../common/lang.js";
import { CitiesService } from "./cities.service.js";
import { ContinentsService } from "./continents.service.js";
import { PublicCache } from "./content-cache.interceptor.js";
import { CountriesService } from "./countries.service.js";
import { CityDetailDto, CityPageDto, CreateCityDto, UpdateCityDto } from "./dto/city.dto.js";
import { ContinentDto } from "./dto/continent.dto.js";
import { CountryDetailDto, CountryPageDto, UpdateCountryDto } from "./dto/country.dto.js";
import { ListCitiesQueryDto, ListCountriesQueryDto } from "./dto/queries.dto.js";
import { CountryCodePipe, SlugPipe } from "./params.js";

const CODE_PARAM = { name: "code", description: "ISO 3166-1 alpha-2 ülke kodu (büyük/küçük harf fark etmez).", example: "FR" } as const;
const CITY_SLUG_PARAM = { name: "slug", description: "Şehir adresi (web adresindeki parça).", example: "paris" } as const;

/**
 * Kıtalar, ülkeler, şehirler ve rehberler. Okuma uçları herkese açıktır (`Cache-Control: public, max-age=300`);
 * yazma uçları yöneticiye aittir. `?lang=tr|en|es`: istenen dil yok ya da tam değilse Türkçe sunulur; yanıt
 * sunulan dili (`lang`) ve istenen dilin tam olup olmadığını (`complete`) söyler.
 */
@ApiTags("content")
@Controller()
export class ContentController {
  constructor(
    private readonly continents: ContinentsService,
    private readonly countries: CountriesService,
    private readonly cities: CitiesService,
  ) {}

  @Get("continents")
  @Public()
  @PublicCache()
  @ApiOperation({ summary: "Kıtaları listeler", description: "Beş kıta, gösterim sırasıyla; ülke sayıları dahil." })
  @ApiOkResponse({ type: [ContinentDto] })
  @ApiErrors(400, 429)
  listContinents(@Query() query: LangQueryDto): Promise<ContinentDto[]> {
    return this.continents.list(query.lang);
  }

  @Get("continents/:slug")
  @Public()
  @PublicCache()
  @ApiOperation({ summary: "Kıta ayrıntısı" })
  @ApiParam({ name: "slug", description: "Kıta adresi.", enum: ["africa", "americas", "asia", "europe", "oceania"] })
  @ApiOkResponse({ type: ContinentDto })
  @ApiErrors(400, 404, 429)
  getContinent(@Param("slug", new SlugPipe()) slug: string, @Query() query: LangQueryDto): Promise<ContinentDto> {
    return this.continents.get(slug, query.lang);
  }

  @Get("countries")
  @Public()
  @PublicCache()
  @ApiOperation({
    summary: "Ülkeleri listeler (sayfalı)",
    description:
      "Tüm dünya ülkeleri. Süzgeçler: `continent`, `hasTravel` (öne çıkan ülkeler), `q` (ad/resmî ad/başkent; Türkçe `İ/ı` duyarlı, büyük/küçük harf duyarsız). " +
      "Sıra: `hasTravel=true` ise destinasyon sırası, aksi halde istenen dildeki ad. Liste seyahat metinlerini ve hub'ı taşımaz; ayrıntı için `GET /v1/countries/{code}`.",
  })
  @ApiOkResponse({ type: CountryPageDto })
  @ApiErrors(400, 429)
  listCountries(@Query() query: ListCountriesQueryDto): Promise<CountryPageDto> {
    return this.countries.list(query);
  }

  @Get("countries/:code")
  @Public()
  @PublicCache()
  @ApiOperation({ summary: "Ülke ayrıntısı", description: "Ülke + varsa seyahat bilgisi (hub dahil) + şehir özetleri." })
  @ApiParam(CODE_PARAM)
  @ApiOkResponse({ type: CountryDetailDto })
  @ApiErrors(400, 404, 429)
  getCountry(@Param("code", new CountryCodePipe()) code: string, @Query() query: LangQueryDto): Promise<CountryDetailDto> {
    return this.countries.get(code, query.lang);
  }

  @Get("countries/:code/cities")
  @Public()
  @PublicCache()
  @ApiOperation({ summary: "Ülkenin şehirleri (sayfalı)", description: "Şehir özetleri `position` sırasıyla; rehber gövdesi taşımaz." })
  @ApiParam(CODE_PARAM)
  @ApiOkResponse({ type: CityPageDto })
  @ApiErrors(400, 404, 429)
  listCountryCities(@Param("code", new CountryCodePipe()) code: string, @Query() query: ListCitiesQueryDto): Promise<CityPageDto> {
    return this.cities.list(code, query);
  }

  @Get("countries/:code/cities/:slug")
  @Public()
  @PublicCache()
  @ApiOperation({ summary: "Şehir ayrıntısı ve rehberi", description: "Şehir kartı + rehber gövdesi (varsa). Rehberin `lang`/`complete` alanları kendi durumudur." })
  @ApiParam(CODE_PARAM)
  @ApiParam(CITY_SLUG_PARAM)
  @ApiOkResponse({ type: CityDetailDto })
  @ApiErrors(400, 404, 429)
  getCity(
    @Param("code", new CountryCodePipe()) code: string,
    @Param("slug", new SlugPipe()) slug: string,
    @Query() query: LangQueryDto,
  ): Promise<CityDetailDto> {
    return this.cities.get(code, slug, query.lang);
  }

  @Patch("countries/:code")
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Ülke çevirilerini ve seyahat bilgisini günceller (yönetici)",
    description:
      "Çeviri alanları dil başına BİRLEŞTİRİLİR (gönderilmeyen alan korunur; `en`/`es` için `null` dili siler). Bilinmeyen alan 400. " +
      "Yanıt, `lang` sorgusundaki dilde güncel ayrıntıdır.",
  })
  @ApiParam(CODE_PARAM)
  @ApiOkResponse({ type: CountryDetailDto })
  @ApiErrors(400, 401, 403, 404, 429)
  updateCountry(
    @Param("code", new CountryCodePipe()) code: string,
    @Body() dto: UpdateCountryDto,
    @Query() query: LangQueryDto,
  ): Promise<CountryDetailDto> {
    return this.countries.update(code, dto, query.lang);
  }

  @Post("countries/:code/cities")
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Şehir ekler (yönetici)",
    description:
      "Adres (`slug`) verilmezse Türkçe addan türetilir; ülkede benzersiz olmalı (409 `SLUG_TAKEN`). Türkçe ad de ülkede benzersizdir (409 `CITY_NAME_TAKEN`): " +
      "hub rotaları ve ilgili rehberler şehre bu adla bağlanır. Rehber isteğe bağlıdır.",
  })
  @ApiParam(CODE_PARAM)
  @ApiCreatedResponse({ type: CityDetailDto })
  @ApiErrors(400, 401, 403, 404, 409, 429)
  createCity(
    @Param("code", new CountryCodePipe()) code: string,
    @Body() dto: CreateCityDto,
    @Query() query: LangQueryDto,
  ): Promise<CityDetailDto> {
    return this.cities.create(code, dto, query.lang);
  }

  @Patch("countries/:code/cities/:slug")
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Şehri ve rehberini günceller (yönetici)",
    description:
      "Çeviri alanları dil başına BİRLEŞTİRİLİR. Rehber yoksa `guide` ile oluşturulur. Adres (`slug`) değişmez. Türkçe ad değişirse ülkenin hub rotalarındaki " +
      "ve rehberlerindeki başvurular (tüm dillerde) aynı işlemde yeni ada taşınır; ad ülkede başka bir şehirde varsa 409 `CITY_NAME_TAKEN`.",
  })
  @ApiParam(CODE_PARAM)
  @ApiParam(CITY_SLUG_PARAM)
  @ApiOkResponse({ type: CityDetailDto })
  @ApiErrors(400, 401, 403, 404, 409, 429)
  updateCity(
    @Param("code", new CountryCodePipe()) code: string,
    @Param("slug", new SlugPipe()) slug: string,
    @Body() dto: UpdateCityDto,
    @Query() query: LangQueryDto,
  ): Promise<CityDetailDto> {
    return this.cities.update(code, slug, dto, query.lang);
  }

  @Delete("countries/:code/cities/:slug")
  @Roles("admin")
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Şehri siler (yönetici)", description: "Şehrin rehberi de silinir. Tohum yeniden çalışırsa (`--force` olmadan bile) silinen tohum şehirleri yeniden eklenir." })
  @ApiParam(CODE_PARAM)
  @ApiParam(CITY_SLUG_PARAM)
  @ApiNoContentResponse({ description: "Şehir ve rehberi silindi." })
  @ApiErrors(400, 401, 403, 404, 429)
  async deleteCity(@Param("code", new CountryCodePipe()) code: string, @Param("slug", new SlugPipe()) slug: string): Promise<void> {
    await this.cities.remove(code, slug);
  }
}
