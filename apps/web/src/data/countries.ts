/**
 * CANONICAL COUNTRY DATASET — the single source of truth for both the
 * Wheel of Countries and the Guess the Flag game.
 *
 * GENERATED FILE — do not edit by hand.
 * Regenerate with: node scripts/gen-countries.js
 *
 * Source: the `world-countries` package (ISO 3166-1 / mledoze). Capitals,
 * continents and land borders are sourced data rather than recalled facts,
 * because the flag game asserts them to the player as hints.
 *
 * Country names are the package's Turkish translations (`translations.tur`),
 * so they are sourced too rather than hand-translated. English names and
 * official forms are retained in `aliases`, which keeps them valid answers in
 * the flag game. Capitals are left in their source form: the package carries no
 * translated capitals, and inventing them would be guessing.
 *
 * Scope: all UN member states plus the two UN observer states (Vatican City,
 * Palestine). Borders are filtered to codes inside this set AND required to be
 * reciprocal, which removes one-directional errors in the source.
 */
export interface Country {
  name: string;
  officialName: string;
  iso2: string;
  iso3: string;
  /** Emoji flag. UI renders local SVGs from /flags/{iso2}.svg instead. */
  flag: string;
  capital: string[];
  continent: string;
  subregion: string;
  /** iso3 codes of land-border neighbours. Empty for islands. */
  borders: string[];
  /** Accepted alternative spellings, native names and ISO codes. */
  aliases: string[];
  latlng: number[];
  landlocked: boolean;
}

export const countries: Country[] = [
 {
  "name": "Afganistan",
  "officialName": "Afganistan İslam Cumhuriyeti",
  "iso2": "AF",
  "iso3": "AFG",
  "flag": "🇦🇫",
  "capital": [
   "Kabul"
  ],
  "continent": "Asia",
  "subregion": "Southern Asia",
  "borders": [
   "IRN",
   "PAK",
   "TKM",
   "UZB",
   "TJK",
   "CHN"
  ],
  "aliases": [
   "Afghanistan",
   "Islamic Republic of Afghanistan",
   "Afganistan İslam Cumhuriyeti",
   "AF",
   "Afġānistān",
   "AFG"
  ],
  "latlng": [
   33,
   65
  ],
  "landlocked": true
 },
 {
  "name": "Almanya",
  "officialName": "Almanya Federal Cumhuriyeti",
  "iso2": "DE",
  "iso3": "DEU",
  "flag": "🇩🇪",
  "capital": [
   "Berlin"
  ],
  "continent": "Europe",
  "subregion": "Western Europe",
  "borders": [
   "AUT",
   "BEL",
   "CZE",
   "DNK",
   "FRA",
   "LUX",
   "NLD",
   "POL",
   "CHE"
  ],
  "aliases": [
   "Germany",
   "Federal Republic of Germany",
   "Almanya Federal Cumhuriyeti",
   "DE",
   "Bundesrepublik Deutschland",
   "DEU"
  ],
  "latlng": [
   51,
   9
  ],
  "landlocked": false
 },
 {
  "name": "Amerika Birleşik Devletleri",
  "officialName": "Amerika Birleşik Devletleri",
  "iso2": "US",
  "iso3": "USA",
  "flag": "🇺🇸",
  "capital": [
   "Washington D.C."
  ],
  "continent": "Americas",
  "subregion": "North America",
  "borders": [
   "CAN",
   "MEX"
  ],
  "aliases": [
   "United States",
   "United States of America",
   "US",
   "USA"
  ],
  "latlng": [
   38,
   -97
  ],
  "landlocked": false
 },
 {
  "name": "Andorra",
  "officialName": "Andorra Prensliği",
  "iso2": "AD",
  "iso3": "AND",
  "flag": "🇦🇩",
  "capital": [
   "Andorra la Vella"
  ],
  "continent": "Europe",
  "subregion": "Southern Europe",
  "borders": [
   "FRA",
   "ESP"
  ],
  "aliases": [
   "Principality of Andorra",
   "Andorra Prensliği",
   "AD",
   "Principat d'Andorra",
   "AND"
  ],
  "latlng": [
   42.5,
   1.5
  ],
  "landlocked": true
 },
 {
  "name": "Angola",
  "officialName": "Angola Cumhuriyeti",
  "iso2": "AO",
  "iso3": "AGO",
  "flag": "🇦🇴",
  "capital": [
   "Luanda"
  ],
  "continent": "Africa",
  "subregion": "Middle Africa",
  "borders": [
   "COG",
   "COD",
   "ZMB",
   "NAM"
  ],
  "aliases": [
   "Republic of Angola",
   "Angola Cumhuriyeti",
   "AO",
   "República de Angola",
   "ʁɛpublika de an'ɡɔla",
   "AGO"
  ],
  "latlng": [
   -12.5,
   18.5
  ],
  "landlocked": false
 },
 {
  "name": "Antigua ve Barbuda",
  "officialName": "Antigua ve Barbuda",
  "iso2": "AG",
  "iso3": "ATG",
  "flag": "🇦🇬",
  "capital": [
   "Saint John's"
  ],
  "continent": "Americas",
  "subregion": "Caribbean",
  "borders": [],
  "aliases": [
   "Antigua and Barbuda",
   "AG",
   "ATG"
  ],
  "latlng": [
   17.05,
   -61.8
  ],
  "landlocked": false
 },
 {
  "name": "Arjantin",
  "officialName": "Arjantin Cumhuriyeti",
  "iso2": "AR",
  "iso3": "ARG",
  "flag": "🇦🇷",
  "capital": [
   "Buenos Aires"
  ],
  "continent": "Americas",
  "subregion": "South America",
  "borders": [
   "BOL",
   "BRA",
   "CHL",
   "PRY",
   "URY"
  ],
  "aliases": [
   "Argentina",
   "Argentine Republic",
   "Arjantin Cumhuriyeti",
   "AR",
   "República Argentina",
   "ARG"
  ],
  "latlng": [
   -34,
   -64
  ],
  "landlocked": false
 },
 {
  "name": "Arnavutluk",
  "officialName": "Arnavutluk Cumhuriyeti",
  "iso2": "AL",
  "iso3": "ALB",
  "flag": "🇦🇱",
  "capital": [
   "Tirana"
  ],
  "continent": "Europe",
  "subregion": "Southeast Europe",
  "borders": [
   "MNE",
   "GRC",
   "MKD"
  ],
  "aliases": [
   "Albania",
   "Republic of Albania",
   "Arnavutluk Cumhuriyeti",
   "AL",
   "Shqipëri",
   "Shqipëria",
   "Shqipnia",
   "ALB"
  ],
  "latlng": [
   41,
   20
  ],
  "landlocked": false
 },
 {
  "name": "Avustralya",
  "officialName": "Avustralya Federal Devleti",
  "iso2": "AU",
  "iso3": "AUS",
  "flag": "🇦🇺",
  "capital": [
   "Canberra"
  ],
  "continent": "Oceania",
  "subregion": "Australia and New Zealand",
  "borders": [],
  "aliases": [
   "Australia",
   "Commonwealth of Australia",
   "Avustralya Federal Devleti",
   "AU",
   "AUS"
  ],
  "latlng": [
   -27,
   133
  ],
  "landlocked": false
 },
 {
  "name": "Avusturya",
  "officialName": "Avusturya Cumhuriyeti",
  "iso2": "AT",
  "iso3": "AUT",
  "flag": "🇦🇹",
  "capital": [
   "Vienna"
  ],
  "continent": "Europe",
  "subregion": "Central Europe",
  "borders": [
   "CZE",
   "DEU",
   "HUN",
   "ITA",
   "LIE",
   "SVK",
   "SVN",
   "CHE"
  ],
  "aliases": [
   "Austria",
   "Republic of Austria",
   "Avusturya Cumhuriyeti",
   "AT",
   "Osterreich",
   "Oesterreich",
   "AUT"
  ],
  "latlng": [
   47.33333333,
   13.33333333
  ],
  "landlocked": true
 },
 {
  "name": "Azerbaycan",
  "officialName": "Azerbaycan Cumhuriyeti",
  "iso2": "AZ",
  "iso3": "AZE",
  "flag": "🇦🇿",
  "capital": [
   "Baku"
  ],
  "continent": "Asia",
  "subregion": "Western Asia",
  "borders": [
   "ARM",
   "GEO",
   "IRN",
   "RUS",
   "TUR"
  ],
  "aliases": [
   "Azerbaijan",
   "Republic of Azerbaijan",
   "Azerbaycan Cumhuriyeti",
   "AZ",
   "Azərbaycan Respublikası",
   "AZE"
  ],
  "latlng": [
   40.5,
   47.5
  ],
  "landlocked": true
 },
 {
  "name": "Bağımsız Samoa Devleti",
  "officialName": "Bağımsız Samoa Devleti",
  "iso2": "WS",
  "iso3": "WSM",
  "flag": "🇼🇸",
  "capital": [
   "Apia"
  ],
  "continent": "Oceania",
  "subregion": "Polynesia",
  "borders": [],
  "aliases": [
   "Samoa",
   "Independent State of Samoa",
   "WS",
   "Malo Saʻoloto Tutoʻatasi o Sāmoa",
   "WSM"
  ],
  "latlng": [
   -13.58333333,
   -172.33333333
  ],
  "landlocked": false
 },
 {
  "name": "Bahamalar",
  "officialName": "Bahama Milletler Topluluğu",
  "iso2": "BS",
  "iso3": "BHS",
  "flag": "🇧🇸",
  "capital": [
   "Nassau"
  ],
  "continent": "Americas",
  "subregion": "Caribbean",
  "borders": [],
  "aliases": [
   "Bahamas",
   "Commonwealth of the Bahamas",
   "Bahama Milletler Topluluğu",
   "BS",
   "BHS"
  ],
  "latlng": [
   24.25,
   -76
  ],
  "landlocked": false
 },
 {
  "name": "Bahreyn",
  "officialName": "Bahreyn Krallığı",
  "iso2": "BH",
  "iso3": "BHR",
  "flag": "🇧🇭",
  "capital": [
   "Manama"
  ],
  "continent": "Asia",
  "subregion": "Western Asia",
  "borders": [],
  "aliases": [
   "Bahrain",
   "Kingdom of Bahrain",
   "Bahreyn Krallığı",
   "BH",
   "Mamlakat al-Baḥrayn",
   "BHR"
  ],
  "latlng": [
   26,
   50.55
  ],
  "landlocked": false
 },
 {
  "name": "Bangladeş",
  "officialName": "Bangladeş Halk Cumhuriyeti",
  "iso2": "BD",
  "iso3": "BGD",
  "flag": "🇧🇩",
  "capital": [
   "Dhaka"
  ],
  "continent": "Asia",
  "subregion": "Southern Asia",
  "borders": [
   "MMR",
   "IND"
  ],
  "aliases": [
   "Bangladesh",
   "People's Republic of Bangladesh",
   "Bangladeş Halk Cumhuriyeti",
   "BD",
   "Gônôprôjatôntri Bangladesh",
   "BGD"
  ],
  "latlng": [
   24,
   90
  ],
  "landlocked": false
 },
 {
  "name": "Barbados",
  "officialName": "Barbados",
  "iso2": "BB",
  "iso3": "BRB",
  "flag": "🇧🇧",
  "capital": [
   "Bridgetown"
  ],
  "continent": "Americas",
  "subregion": "Caribbean",
  "borders": [],
  "aliases": [
   "BB",
   "BRB"
  ],
  "latlng": [
   13.16666666,
   -59.53333333
  ],
  "landlocked": false
 },
 {
  "name": "Belarus",
  "officialName": "Belarus Cumhuriyeti",
  "iso2": "BY",
  "iso3": "BLR",
  "flag": "🇧🇾",
  "capital": [
   "Minsk"
  ],
  "continent": "Europe",
  "subregion": "Eastern Europe",
  "borders": [
   "LVA",
   "LTU",
   "POL",
   "RUS",
   "UKR"
  ],
  "aliases": [
   "Republic of Belarus",
   "Belarus Cumhuriyeti",
   "BY",
   "Bielaruś",
   "Белоруссия",
   "Республика Белоруссия",
   "BLR"
  ],
  "latlng": [
   53,
   28
  ],
  "landlocked": true
 },
 {
  "name": "Belçika",
  "officialName": "Belçika Krallığı",
  "iso2": "BE",
  "iso3": "BEL",
  "flag": "🇧🇪",
  "capital": [
   "Brussels"
  ],
  "continent": "Europe",
  "subregion": "Western Europe",
  "borders": [
   "FRA",
   "DEU",
   "LUX",
   "NLD"
  ],
  "aliases": [
   "Belgium",
   "Kingdom of Belgium",
   "Belçika Krallığı",
   "BE",
   "België",
   "Belgie",
   "Belgien",
   "Belgique",
   "Koninkrijk België",
   "Royaume de Belgique",
   "Königreich Belgien",
   "BEL"
  ],
  "latlng": [
   50.83333333,
   4
  ],
  "landlocked": false
 },
 {
  "name": "Belize",
  "officialName": "Belize",
  "iso2": "BZ",
  "iso3": "BLZ",
  "flag": "🇧🇿",
  "capital": [
   "Belmopan"
  ],
  "continent": "Americas",
  "subregion": "Central America",
  "borders": [
   "GTM",
   "MEX"
  ],
  "aliases": [
   "BZ",
   "BLZ"
  ],
  "latlng": [
   17.25,
   -88.75
  ],
  "landlocked": false
 },
 {
  "name": "Benin",
  "officialName": "Benin Cumhuriyeti",
  "iso2": "BJ",
  "iso3": "BEN",
  "flag": "🇧🇯",
  "capital": [
   "Porto-Novo"
  ],
  "continent": "Africa",
  "subregion": "Western Africa",
  "borders": [
   "BFA",
   "NER",
   "NGA",
   "TGO"
  ],
  "aliases": [
   "Republic of Benin",
   "Benin Cumhuriyeti",
   "BJ",
   "République du Bénin",
   "BEN"
  ],
  "latlng": [
   9.5,
   2.25
  ],
  "landlocked": false
 },
 {
  "name": "Birleşik Arap Emirlikleri",
  "officialName": "Birleşik Arap Emirlikleri",
  "iso2": "AE",
  "iso3": "ARE",
  "flag": "🇦🇪",
  "capital": [
   "Abu Dhabi"
  ],
  "continent": "Asia",
  "subregion": "Western Asia",
  "borders": [
   "OMN",
   "SAU"
  ],
  "aliases": [
   "United Arab Emirates",
   "AE",
   "UAE",
   "Emirates",
   "ARE"
  ],
  "latlng": [
   24,
   54
  ],
  "landlocked": false
 },
 {
  "name": "Birleşik Krallık",
  "officialName": "Büyük Britanya ve Kuzey İrlanda Birleşik Krallığı",
  "iso2": "GB",
  "iso3": "GBR",
  "flag": "🇬🇧",
  "capital": [
   "London"
  ],
  "continent": "Europe",
  "subregion": "Northern Europe",
  "borders": [
   "IRL"
  ],
  "aliases": [
   "United Kingdom",
   "United Kingdom of Great Britain and Northern Ireland",
   "Büyük Britanya ve Kuzey İrlanda Birleşik Krallığı",
   "GB",
   "UK",
   "Great Britain",
   "GBR"
  ],
  "latlng": [
   54,
   -2
  ],
  "landlocked": false
 },
 {
  "name": "Bolivya",
  "officialName": "Bolivya çokuluslu Devleti",
  "iso2": "BO",
  "iso3": "BOL",
  "flag": "🇧🇴",
  "capital": [
   "Sucre"
  ],
  "continent": "Americas",
  "subregion": "South America",
  "borders": [
   "ARG",
   "BRA",
   "CHL",
   "PRY",
   "PER"
  ],
  "aliases": [
   "Bolivia",
   "Plurinational State of Bolivia",
   "Bolivya çokuluslu Devleti",
   "BO",
   "Buliwya",
   "Wuliwya",
   "Bolivia, Plurinational State of",
   "Estado Plurinacional de Bolivia",
   "Buliwya Mamallaqta",
   "Wuliwya Suyu",
   "Tetã Volívia",
   "BOL"
  ],
  "latlng": [
   -17,
   -65
  ],
  "landlocked": true
 },
 {
  "name": "Bosna-Hersek",
  "officialName": "Bosna ve Hersek",
  "iso2": "BA",
  "iso3": "BIH",
  "flag": "🇧🇦",
  "capital": [
   "Sarajevo"
  ],
  "continent": "Europe",
  "subregion": "Southeast Europe",
  "borders": [
   "HRV",
   "MNE",
   "SRB"
  ],
  "aliases": [
   "Bosnia and Herzegovina",
   "Bosna ve Hersek",
   "BA",
   "Bosnia-Herzegovina",
   "Босна и Херцеговина",
   "BIH"
  ],
  "latlng": [
   44,
   18
  ],
  "landlocked": false
 },
 {
  "name": "Botsvana",
  "officialName": "Botsvana Cumhuriyeti",
  "iso2": "BW",
  "iso3": "BWA",
  "flag": "🇧🇼",
  "capital": [
   "Gaborone"
  ],
  "continent": "Africa",
  "subregion": "Southern Africa",
  "borders": [
   "NAM",
   "ZAF",
   "ZMB",
   "ZWE"
  ],
  "aliases": [
   "Botswana",
   "Republic of Botswana",
   "Botsvana Cumhuriyeti",
   "BW",
   "Lefatshe la Botswana",
   "BWA"
  ],
  "latlng": [
   -22,
   24
  ],
  "landlocked": true
 },
 {
  "name": "Brezilya",
  "officialName": "Brezilya Federal Cumhuriyeti",
  "iso2": "BR",
  "iso3": "BRA",
  "flag": "🇧🇷",
  "capital": [
   "Brasília"
  ],
  "continent": "Americas",
  "subregion": "South America",
  "borders": [
   "ARG",
   "BOL",
   "COL",
   "GUY",
   "PRY",
   "PER",
   "SUR",
   "URY",
   "VEN"
  ],
  "aliases": [
   "Brazil",
   "Federative Republic of Brazil",
   "Brezilya Federal Cumhuriyeti",
   "BR",
   "Brasil",
   "República Federativa do Brasil",
   "BRA"
  ],
  "latlng": [
   -10,
   -55
  ],
  "landlocked": false
 },
 {
  "name": "Brunei",
  "officialName": "Brunei Barış ülkesi Devleti (Darü's-Selam)",
  "iso2": "BN",
  "iso3": "BRN",
  "flag": "🇧🇳",
  "capital": [
   "Bandar Seri Begawan"
  ],
  "continent": "Asia",
  "subregion": "South-Eastern Asia",
  "borders": [
   "MYS"
  ],
  "aliases": [
   "Nation of Brunei, Abode of Peace",
   "Brunei Barış ülkesi Devleti (Darü's-Selam)",
   "BN",
   "Brunei Darussalam",
   "Nation of Brunei",
   "the Abode of Peace",
   "BRN"
  ],
  "latlng": [
   4.5,
   114.66666666
  ],
  "landlocked": false
 },
 {
  "name": "Bulgaristan",
  "officialName": "Bulgaristan Cumhuriyeti",
  "iso2": "BG",
  "iso3": "BGR",
  "flag": "🇧🇬",
  "capital": [
   "Sofia"
  ],
  "continent": "Europe",
  "subregion": "Southeast Europe",
  "borders": [
   "GRC",
   "MKD",
   "ROU",
   "SRB",
   "TUR"
  ],
  "aliases": [
   "Bulgaria",
   "Republic of Bulgaria",
   "Bulgaristan Cumhuriyeti",
   "BG",
   "Република България",
   "BGR"
  ],
  "latlng": [
   43,
   25
  ],
  "landlocked": false
 },
 {
  "name": "Burkina Faso",
  "officialName": "Burkina Faso",
  "iso2": "BF",
  "iso3": "BFA",
  "flag": "🇧🇫",
  "capital": [
   "Ouagadougou"
  ],
  "continent": "Africa",
  "subregion": "Western Africa",
  "borders": [
   "BEN",
   "CIV",
   "GHA",
   "MLI",
   "NER",
   "TGO"
  ],
  "aliases": [
   "BF",
   "BFA"
  ],
  "latlng": [
   13,
   -2
  ],
  "landlocked": true
 },
 {
  "name": "Burundi",
  "officialName": "Burundi Cumhuriyeti",
  "iso2": "BI",
  "iso3": "BDI",
  "flag": "🇧🇮",
  "capital": [
   "Gitega"
  ],
  "continent": "Africa",
  "subregion": "Eastern Africa",
  "borders": [
   "COD",
   "RWA",
   "TZA"
  ],
  "aliases": [
   "Republic of Burundi",
   "Burundi Cumhuriyeti",
   "BI",
   "Republika y'Uburundi",
   "République du Burundi",
   "BDI"
  ],
  "latlng": [
   -3.5,
   30
  ],
  "landlocked": true
 },
 {
  "name": "Butan",
  "officialName": "Butan Krallığı",
  "iso2": "BT",
  "iso3": "BTN",
  "flag": "🇧🇹",
  "capital": [
   "Thimphu"
  ],
  "continent": "Asia",
  "subregion": "Southern Asia",
  "borders": [
   "CHN",
   "IND"
  ],
  "aliases": [
   "Bhutan",
   "Kingdom of Bhutan",
   "Butan Krallığı",
   "BT",
   "BTN"
  ],
  "latlng": [
   27.5,
   90.5
  ],
  "landlocked": true
 },
 {
  "name": "Çad",
  "officialName": "Çad Cumhuriyeti",
  "iso2": "TD",
  "iso3": "TCD",
  "flag": "🇹🇩",
  "capital": [
   "N'Djamena"
  ],
  "continent": "Africa",
  "subregion": "Middle Africa",
  "borders": [
   "CMR",
   "CAF",
   "LBY",
   "NER",
   "NGA",
   "SDN"
  ],
  "aliases": [
   "Chad",
   "Republic of Chad",
   "çad Cumhuriyeti",
   "TD",
   "Tchad",
   "République du Tchad",
   "TCD"
  ],
  "latlng": [
   15,
   19
  ],
  "landlocked": true
 },
 {
  "name": "Çekya",
  "officialName": "Çek Cumhuriyeti",
  "iso2": "CZ",
  "iso3": "CZE",
  "flag": "🇨🇿",
  "capital": [
   "Prague"
  ],
  "continent": "Europe",
  "subregion": "Central Europe",
  "borders": [
   "AUT",
   "DEU",
   "POL",
   "SVK"
  ],
  "aliases": [
   "Czechia",
   "Czech Republic",
   "çek Cumhuriyeti",
   "CZ",
   "Česká republika",
   "Česko",
   "CZE"
  ],
  "latlng": [
   49.75,
   15.5
  ],
  "landlocked": true
 },
 {
  "name": "Cezayir",
  "officialName": "Cezayir Demokratik Halk Cumhuriyeti",
  "iso2": "DZ",
  "iso3": "DZA",
  "flag": "🇩🇿",
  "capital": [
   "Algiers"
  ],
  "continent": "Africa",
  "subregion": "Northern Africa",
  "borders": [
   "TUN",
   "LBY",
   "NER",
   "MRT",
   "MLI",
   "MAR"
  ],
  "aliases": [
   "Algeria",
   "People's Democratic Republic of Algeria",
   "Cezayir Demokratik Halk Cumhuriyeti",
   "DZ",
   "Dzayer",
   "Algérie",
   "DZA"
  ],
  "latlng": [
   28,
   3
  ],
  "landlocked": false
 },
 {
  "name": "Cibuti",
  "officialName": "Cibuti Cumhuriyeti",
  "iso2": "DJ",
  "iso3": "DJI",
  "flag": "🇩🇯",
  "capital": [
   "Djibouti"
  ],
  "continent": "Africa",
  "subregion": "Eastern Africa",
  "borders": [
   "ERI",
   "ETH",
   "SOM"
  ],
  "aliases": [
   "Djibouti",
   "Republic of Djibouti",
   "Cibuti Cumhuriyeti",
   "DJ",
   "Jabuuti",
   "Gabuuti",
   "République de Djibouti",
   "Gabuutih Ummuuno",
   "Jamhuuriyadda Jabuuti",
   "DJI"
  ],
  "latlng": [
   11.5,
   43
  ],
  "landlocked": false
 },
 {
  "name": "Çin",
  "officialName": "Çin Halk Cumhuriyeti",
  "iso2": "CN",
  "iso3": "CHN",
  "flag": "🇨🇳",
  "capital": [
   "Beijing"
  ],
  "continent": "Asia",
  "subregion": "Eastern Asia",
  "borders": [
   "AFG",
   "BTN",
   "MMR",
   "IND",
   "KAZ",
   "NPL",
   "PRK",
   "KGZ",
   "LAO",
   "MNG",
   "PAK",
   "RUS",
   "TJK",
   "VNM"
  ],
  "aliases": [
   "China",
   "People's Republic of China",
   "çin Halk Cumhuriyeti",
   "CN",
   "Zhōngguó",
   "Zhongguo",
   "Zhonghua",
   "中华人民共和国",
   "Zhōnghuá Rénmín Gònghéguó",
   "CHN"
  ],
  "latlng": [
   35,
   105
  ],
  "landlocked": false
 },
 {
  "name": "Danimarka",
  "officialName": "Danimarka Krallığı",
  "iso2": "DK",
  "iso3": "DNK",
  "flag": "🇩🇰",
  "capital": [
   "Copenhagen"
  ],
  "continent": "Europe",
  "subregion": "Northern Europe",
  "borders": [
   "DEU"
  ],
  "aliases": [
   "Denmark",
   "Kingdom of Denmark",
   "Danimarka Krallığı",
   "DK",
   "Danmark",
   "Kongeriget Danmark",
   "DNK"
  ],
  "latlng": [
   56,
   10
  ],
  "landlocked": false
 },
 {
  "name": "Doğu Timor",
  "officialName": "Doğu Timor Demokratik Cumhuriyeti",
  "iso2": "TL",
  "iso3": "TLS",
  "flag": "🇹🇱",
  "capital": [
   "Dili"
  ],
  "continent": "Asia",
  "subregion": "South-Eastern Asia",
  "borders": [
   "IDN"
  ],
  "aliases": [
   "Timor-Leste",
   "Democratic Republic of Timor-Leste",
   "Doğu Timor Demokratik Cumhuriyeti",
   "TL",
   "East Timor",
   "Timor",
   "República Democrática de Timor-Leste",
   "Repúblika Demokrátika Timór-Leste",
   "Timór Lorosa'e",
   "Timor Lorosae",
   "TLS"
  ],
  "latlng": [
   -8.83333333,
   125.91666666
  ],
  "landlocked": false
 },
 {
  "name": "Dominik Cumhuriyeti",
  "officialName": "Dominik Cumhuriyeti",
  "iso2": "DO",
  "iso3": "DOM",
  "flag": "🇩🇴",
  "capital": [
   "Santo Domingo"
  ],
  "continent": "Americas",
  "subregion": "Caribbean",
  "borders": [
   "HTI"
  ],
  "aliases": [
   "Dominican Republic",
   "DO",
   "DOM"
  ],
  "latlng": [
   19,
   -70.66666666
  ],
  "landlocked": false
 },
 {
  "name": "Dominika",
  "officialName": "Dominika Topluluğu",
  "iso2": "DM",
  "iso3": "DMA",
  "flag": "🇩🇲",
  "capital": [
   "Roseau"
  ],
  "continent": "Americas",
  "subregion": "Caribbean",
  "borders": [],
  "aliases": [
   "Dominica",
   "Commonwealth of Dominica",
   "Dominika Topluluğu",
   "DM",
   "Dominique",
   "Wai‘tu kubuli",
   "DMA"
  ],
  "latlng": [
   15.41666666,
   -61.33333333
  ],
  "landlocked": false
 },
 {
  "name": "Ekvador",
  "officialName": "Ekvador Cumhuriyeti",
  "iso2": "EC",
  "iso3": "ECU",
  "flag": "🇪🇨",
  "capital": [
   "Quito"
  ],
  "continent": "Americas",
  "subregion": "South America",
  "borders": [
   "COL",
   "PER"
  ],
  "aliases": [
   "Ecuador",
   "Republic of Ecuador",
   "Ekvador Cumhuriyeti",
   "EC",
   "República del Ecuador",
   "ECU"
  ],
  "latlng": [
   -2,
   -77.5
  ],
  "landlocked": false
 },
 {
  "name": "Ekvator Ginesi",
  "officialName": "Ekvator Ginesi Cumhuriyeti",
  "iso2": "GQ",
  "iso3": "GNQ",
  "flag": "🇬🇶",
  "capital": [
   "Malabo"
  ],
  "continent": "Africa",
  "subregion": "Middle Africa",
  "borders": [
   "CMR",
   "GAB"
  ],
  "aliases": [
   "Equatorial Guinea",
   "Republic of Equatorial Guinea",
   "Ekvator Ginesi Cumhuriyeti",
   "GQ",
   "República de Guinea Ecuatorial",
   "République de Guinée équatoriale",
   "República da Guiné Equatorial",
   "GNQ"
  ],
  "latlng": [
   2,
   10
  ],
  "landlocked": false
 },
 {
  "name": "El Salvador",
  "officialName": "El Salvador Cumhuriyeti",
  "iso2": "SV",
  "iso3": "SLV",
  "flag": "🇸🇻",
  "capital": [
   "San Salvador"
  ],
  "continent": "Americas",
  "subregion": "Central America",
  "borders": [
   "GTM",
   "HND"
  ],
  "aliases": [
   "Republic of El Salvador",
   "El Salvador Cumhuriyeti",
   "SV",
   "República de El Salvador",
   "SLV"
  ],
  "latlng": [
   13.83333333,
   -88.91666666
  ],
  "landlocked": false
 },
 {
  "name": "Endonezya",
  "officialName": "Endonezya Cumhuriyeti",
  "iso2": "ID",
  "iso3": "IDN",
  "flag": "🇮🇩",
  "capital": [
   "Jakarta"
  ],
  "continent": "Asia",
  "subregion": "South-Eastern Asia",
  "borders": [
   "TLS",
   "MYS",
   "PNG"
  ],
  "aliases": [
   "Indonesia",
   "Republic of Indonesia",
   "Endonezya Cumhuriyeti",
   "ID",
   "Republik Indonesia",
   "IDN"
  ],
  "latlng": [
   -5,
   120
  ],
  "landlocked": false
 },
 {
  "name": "Eritre",
  "officialName": "Eritre Devleti",
  "iso2": "ER",
  "iso3": "ERI",
  "flag": "🇪🇷",
  "capital": [
   "Asmara"
  ],
  "continent": "Africa",
  "subregion": "Eastern Africa",
  "borders": [
   "DJI",
   "ETH",
   "SDN"
  ],
  "aliases": [
   "Eritrea",
   "State of Eritrea",
   "Eritre Devleti",
   "ER",
   "ሃገረ ኤርትራ",
   "Dawlat Iritriyá",
   "ʾErtrā",
   "Iritriyā",
   "ERI"
  ],
  "latlng": [
   15,
   39
  ],
  "landlocked": false
 },
 {
  "name": "Ermenistan",
  "officialName": "Ermenistan Cumhuriyeti",
  "iso2": "AM",
  "iso3": "ARM",
  "flag": "🇦🇲",
  "capital": [
   "Yerevan"
  ],
  "continent": "Asia",
  "subregion": "Western Asia",
  "borders": [
   "AZE",
   "GEO",
   "IRN",
   "TUR"
  ],
  "aliases": [
   "Armenia",
   "Republic of Armenia",
   "Ermenistan Cumhuriyeti",
   "AM",
   "Hayastan",
   "Հայաստանի Հանրապետություն",
   "ARM"
  ],
  "latlng": [
   40,
   45
  ],
  "landlocked": true
 },
 {
  "name": "Estonya",
  "officialName": "Estonya Cumhuriyeti",
  "iso2": "EE",
  "iso3": "EST",
  "flag": "🇪🇪",
  "capital": [
   "Tallinn"
  ],
  "continent": "Europe",
  "subregion": "Northern Europe",
  "borders": [
   "LVA",
   "RUS"
  ],
  "aliases": [
   "Estonia",
   "Republic of Estonia",
   "Estonya Cumhuriyeti",
   "EE",
   "Eesti",
   "Eesti Vabariik",
   "EST"
  ],
  "latlng": [
   59,
   26
  ],
  "landlocked": false
 },
 {
  "name": "Esvatini",
  "officialName": "Esvatini Krallığı",
  "iso2": "SZ",
  "iso3": "SWZ",
  "flag": "🇸🇿",
  "capital": [
   "Lobamba"
  ],
  "continent": "Africa",
  "subregion": "Southern Africa",
  "borders": [
   "MOZ",
   "ZAF"
  ],
  "aliases": [
   "Eswatini",
   "Kingdom of Eswatini",
   "Esvatini Krallığı",
   "SZ",
   "Swaziland",
   "weSwatini",
   "Swatini",
   "Ngwane",
   "Umbuso weSwatini",
   "SWZ"
  ],
  "latlng": [
   -26.5,
   31.5
  ],
  "landlocked": true
 },
 {
  "name": "Etiyopya",
  "officialName": "Etiyopya Federal Demokratik Cumhuriyeti",
  "iso2": "ET",
  "iso3": "ETH",
  "flag": "🇪🇹",
  "capital": [
   "Addis Ababa"
  ],
  "continent": "Africa",
  "subregion": "Eastern Africa",
  "borders": [
   "DJI",
   "ERI",
   "KEN",
   "SOM",
   "SSD",
   "SDN"
  ],
  "aliases": [
   "Ethiopia",
   "Federal Democratic Republic of Ethiopia",
   "Etiyopya Federal Demokratik Cumhuriyeti",
   "ET",
   "ʾĪtyōṗṗyā",
   "የኢትዮጵያ ፌዴራላዊ ዲሞክራሲያዊ ሪፐብሊክ",
   "ETH"
  ],
  "latlng": [
   8,
   38
  ],
  "landlocked": true
 },
 {
  "name": "Fas",
  "officialName": "Fas Krallığı",
  "iso2": "MA",
  "iso3": "MAR",
  "flag": "🇲🇦",
  "capital": [
   "Rabat"
  ],
  "continent": "Africa",
  "subregion": "Northern Africa",
  "borders": [
   "DZA",
   "ESP"
  ],
  "aliases": [
   "Morocco",
   "Kingdom of Morocco",
   "Fas Krallığı",
   "MA",
   "Al-Mamlakah al-Maġribiyah",
   "MAR"
  ],
  "latlng": [
   32,
   -5
  ],
  "landlocked": false
 },
 {
  "name": "Fiji",
  "officialName": "Fiji Cumhuriyeti",
  "iso2": "FJ",
  "iso3": "FJI",
  "flag": "🇫🇯",
  "capital": [
   "Suva"
  ],
  "continent": "Oceania",
  "subregion": "Melanesia",
  "borders": [],
  "aliases": [
   "Republic of Fiji",
   "Fiji Cumhuriyeti",
   "FJ",
   "Viti",
   "Matanitu ko Viti",
   "Fijī Gaṇarājya",
   "FJI"
  ],
  "latlng": [
   -18,
   175
  ],
  "landlocked": false
 },
 {
  "name": "Fildişi Sahili",
  "officialName": "Fildişi Sahili",
  "iso2": "CI",
  "iso3": "CIV",
  "flag": "🇨🇮",
  "capital": [
   "Yamoussoukro"
  ],
  "continent": "Africa",
  "subregion": "Western Africa",
  "borders": [
   "BFA",
   "GHA",
   "GIN",
   "LBR",
   "MLI"
  ],
  "aliases": [
   "Ivory Coast",
   "Republic of Côte d'Ivoire",
   "CI",
   "Côte d'Ivoire",
   "Cote d'Ivoire",
   "République de Côte d'Ivoire",
   "CIV"
  ],
  "latlng": [
   8,
   -5
  ],
  "landlocked": false
 },
 {
  "name": "Filipinler",
  "officialName": "Filipinler Cumhuriyeti",
  "iso2": "PH",
  "iso3": "PHL",
  "flag": "🇵🇭",
  "capital": [
   "Manila"
  ],
  "continent": "Asia",
  "subregion": "South-Eastern Asia",
  "borders": [],
  "aliases": [
   "Philippines",
   "Republic of the Philippines",
   "Filipinler Cumhuriyeti",
   "PH",
   "Repúblika ng Pilipinas",
   "PHL"
  ],
  "latlng": [
   13,
   122
  ],
  "landlocked": false
 },
 {
  "name": "Filistin",
  "officialName": "Filistin Devleti",
  "iso2": "PS",
  "iso3": "PSE",
  "flag": "🇵🇸",
  "capital": [
   "Ramallah"
  ],
  "continent": "Asia",
  "subregion": "Western Asia",
  "borders": [
   "ISR",
   "EGY",
   "JOR"
  ],
  "aliases": [
   "Palestine",
   "State of Palestine",
   "Filistin Devleti",
   "PS",
   "Palestine, State of",
   "Dawlat Filasṭin",
   "PSE"
  ],
  "latlng": [
   31.9,
   35.2
  ],
  "landlocked": false
 },
 {
  "name": "Finlandiya",
  "officialName": "Finlandiya Cumhuriyeti",
  "iso2": "FI",
  "iso3": "FIN",
  "flag": "🇫🇮",
  "capital": [
   "Helsinki"
  ],
  "continent": "Europe",
  "subregion": "Northern Europe",
  "borders": [
   "NOR",
   "SWE",
   "RUS"
  ],
  "aliases": [
   "Finland",
   "Republic of Finland",
   "Finlandiya Cumhuriyeti",
   "FI",
   "Suomi",
   "Suomen tasavalta",
   "Republiken Finland",
   "FIN"
  ],
  "latlng": [
   64,
   26
  ],
  "landlocked": false
 },
 {
  "name": "Fransa",
  "officialName": "Fransa Cumhuriyeti",
  "iso2": "FR",
  "iso3": "FRA",
  "flag": "🇫🇷",
  "capital": [
   "Paris"
  ],
  "continent": "Europe",
  "subregion": "Western Europe",
  "borders": [
   "AND",
   "BEL",
   "DEU",
   "ITA",
   "LUX",
   "MCO",
   "ESP",
   "CHE"
  ],
  "aliases": [
   "France",
   "French Republic",
   "Fransa Cumhuriyeti",
   "FR",
   "République française",
   "FRA"
  ],
  "latlng": [
   46,
   2
  ],
  "landlocked": false
 },
 {
  "name": "Gabon",
  "officialName": "Gabon Cumhuriyeti",
  "iso2": "GA",
  "iso3": "GAB",
  "flag": "🇬🇦",
  "capital": [
   "Libreville"
  ],
  "continent": "Africa",
  "subregion": "Middle Africa",
  "borders": [
   "CMR",
   "COG",
   "GNQ"
  ],
  "aliases": [
   "Gabonese Republic",
   "Gabon Cumhuriyeti",
   "GA",
   "République Gabonaise",
   "GAB"
  ],
  "latlng": [
   -1,
   11.75
  ],
  "landlocked": false
 },
 {
  "name": "Gambiya",
  "officialName": "Gambiya Cumhuriyeti",
  "iso2": "GM",
  "iso3": "GMB",
  "flag": "🇬🇲",
  "capital": [
   "Banjul"
  ],
  "continent": "Africa",
  "subregion": "Western Africa",
  "borders": [
   "SEN"
  ],
  "aliases": [
   "Gambia",
   "Republic of the Gambia",
   "Gambiya Cumhuriyeti",
   "GM",
   "GMB"
  ],
  "latlng": [
   13.46666666,
   -16.56666666
  ],
  "landlocked": false
 },
 {
  "name": "Gana",
  "officialName": "Gana Cumhuriyeti",
  "iso2": "GH",
  "iso3": "GHA",
  "flag": "🇬🇭",
  "capital": [
   "Accra"
  ],
  "continent": "Africa",
  "subregion": "Western Africa",
  "borders": [
   "BFA",
   "CIV",
   "TGO"
  ],
  "aliases": [
   "Ghana",
   "Republic of Ghana",
   "Gana Cumhuriyeti",
   "GH",
   "GHA"
  ],
  "latlng": [
   8,
   -2
  ],
  "landlocked": false
 },
 {
  "name": "Gine",
  "officialName": "Gine Cumhuriyeti",
  "iso2": "GN",
  "iso3": "GIN",
  "flag": "🇬🇳",
  "capital": [
   "Conakry"
  ],
  "continent": "Africa",
  "subregion": "Western Africa",
  "borders": [
   "CIV",
   "GNB",
   "LBR",
   "MLI",
   "SEN",
   "SLE"
  ],
  "aliases": [
   "Guinea",
   "Republic of Guinea",
   "Gine Cumhuriyeti",
   "GN",
   "République de Guinée",
   "GIN"
  ],
  "latlng": [
   11,
   -10
  ],
  "landlocked": false
 },
 {
  "name": "Gine-Bissau",
  "officialName": "Gine-Bissau Cumhuriyeti",
  "iso2": "GW",
  "iso3": "GNB",
  "flag": "🇬🇼",
  "capital": [
   "Bissau"
  ],
  "continent": "Africa",
  "subregion": "Western Africa",
  "borders": [
   "GIN",
   "SEN"
  ],
  "aliases": [
   "Guinea-Bissau",
   "Republic of Guinea-Bissau",
   "Gine-Bissau Cumhuriyeti",
   "GW",
   "República da Guiné-Bissau",
   "GNB"
  ],
  "latlng": [
   12,
   -15
  ],
  "landlocked": false
 },
 {
  "name": "Grenada",
  "officialName": "Grenada",
  "iso2": "GD",
  "iso3": "GRD",
  "flag": "🇬🇩",
  "capital": [
   "St. George's"
  ],
  "continent": "Americas",
  "subregion": "Caribbean",
  "borders": [],
  "aliases": [
   "GD",
   "GRD"
  ],
  "latlng": [
   12.11666666,
   -61.66666666
  ],
  "landlocked": false
 },
 {
  "name": "Guatemala",
  "officialName": "Guatemala Cumhuriyeti",
  "iso2": "GT",
  "iso3": "GTM",
  "flag": "🇬🇹",
  "capital": [
   "Guatemala City"
  ],
  "continent": "Americas",
  "subregion": "Central America",
  "borders": [
   "BLZ",
   "SLV",
   "HND",
   "MEX"
  ],
  "aliases": [
   "Republic of Guatemala",
   "Guatemala Cumhuriyeti",
   "GT",
   "GTM"
  ],
  "latlng": [
   15.5,
   -90.25
  ],
  "landlocked": false
 },
 {
  "name": "Güney Afrika",
  "officialName": "Güney Afrika Cumhuriyeti",
  "iso2": "ZA",
  "iso3": "ZAF",
  "flag": "🇿🇦",
  "capital": [
   "Pretoria",
   "Bloemfontein",
   "Cape Town"
  ],
  "continent": "Africa",
  "subregion": "Southern Africa",
  "borders": [
   "BWA",
   "LSO",
   "MOZ",
   "NAM",
   "SWZ",
   "ZWE"
  ],
  "aliases": [
   "South Africa",
   "Republic of South Africa",
   "Güney Afrika Cumhuriyeti",
   "ZA",
   "RSA",
   "Suid-Afrika",
   "ZAF"
  ],
  "latlng": [
   -29,
   24
  ],
  "landlocked": false
 },
 {
  "name": "Güney Kore",
  "officialName": "Kore Cumhuriyeti",
  "iso2": "KR",
  "iso3": "KOR",
  "flag": "🇰🇷",
  "capital": [
   "Seoul"
  ],
  "continent": "Asia",
  "subregion": "Eastern Asia",
  "borders": [
   "PRK"
  ],
  "aliases": [
   "South Korea",
   "Republic of Korea",
   "Kore Cumhuriyeti",
   "KR",
   "Korea, Republic of",
   "남한",
   "남조선",
   "KOR"
  ],
  "latlng": [
   37,
   127.5
  ],
  "landlocked": false
 },
 {
  "name": "Güney Sudan",
  "officialName": "Güney Sudan Cumhuriyeti",
  "iso2": "SS",
  "iso3": "SSD",
  "flag": "🇸🇸",
  "capital": [
   "Juba"
  ],
  "continent": "Africa",
  "subregion": "Middle Africa",
  "borders": [
   "CAF",
   "COD",
   "ETH",
   "KEN",
   "SDN",
   "UGA"
  ],
  "aliases": [
   "South Sudan",
   "Republic of South Sudan",
   "Güney Sudan Cumhuriyeti",
   "SS",
   "SSD"
  ],
  "latlng": [
   7,
   30
  ],
  "landlocked": true
 },
 {
  "name": "Gürcistan",
  "officialName": "Gürcistan",
  "iso2": "GE",
  "iso3": "GEO",
  "flag": "🇬🇪",
  "capital": [
   "Tbilisi"
  ],
  "continent": "Asia",
  "subregion": "Western Asia",
  "borders": [
   "ARM",
   "AZE",
   "RUS",
   "TUR"
  ],
  "aliases": [
   "Georgia",
   "GE",
   "Sakartvelo",
   "GEO"
  ],
  "latlng": [
   42,
   43.5
  ],
  "landlocked": false
 },
 {
  "name": "Guyana",
  "officialName": "Guyana Kooperatif Cumhuriyeti",
  "iso2": "GY",
  "iso3": "GUY",
  "flag": "🇬🇾",
  "capital": [
   "Georgetown"
  ],
  "continent": "Americas",
  "subregion": "South America",
  "borders": [
   "BRA",
   "SUR",
   "VEN"
  ],
  "aliases": [
   "Co-operative Republic of Guyana",
   "Guyana Kooperatif Cumhuriyeti",
   "GY",
   "GUY"
  ],
  "latlng": [
   5,
   -59
  ],
  "landlocked": false
 },
 {
  "name": "Haiti",
  "officialName": "Haiti Cumhuriyeti",
  "iso2": "HT",
  "iso3": "HTI",
  "flag": "🇭🇹",
  "capital": [
   "Port-au-Prince"
  ],
  "continent": "Americas",
  "subregion": "Caribbean",
  "borders": [
   "DOM"
  ],
  "aliases": [
   "Republic of Haiti",
   "Haiti Cumhuriyeti",
   "HT",
   "République d'Haïti",
   "Repiblik Ayiti",
   "HTI"
  ],
  "latlng": [
   19,
   -72.41666666
  ],
  "landlocked": false
 },
 {
  "name": "Hindistan",
  "officialName": "Hindistan Cumhuriyeti",
  "iso2": "IN",
  "iso3": "IND",
  "flag": "🇮🇳",
  "capital": [
   "New Delhi"
  ],
  "continent": "Asia",
  "subregion": "Southern Asia",
  "borders": [
   "BGD",
   "BTN",
   "MMR",
   "CHN",
   "NPL",
   "PAK"
  ],
  "aliases": [
   "India",
   "Republic of India",
   "Hindistan Cumhuriyeti",
   "IN",
   "Bhārat",
   "Bharat Ganrajya",
   "இந்தியா",
   "IND"
  ],
  "latlng": [
   20,
   77
  ],
  "landlocked": false
 },
 {
  "name": "Hırvatistan",
  "officialName": "Hırvatistan Cumhuriyeti",
  "iso2": "HR",
  "iso3": "HRV",
  "flag": "🇭🇷",
  "capital": [
   "Zagreb"
  ],
  "continent": "Europe",
  "subregion": "Southeast Europe",
  "borders": [
   "BIH",
   "HUN",
   "MNE",
   "SRB",
   "SVN"
  ],
  "aliases": [
   "Croatia",
   "Republic of Croatia",
   "Hırvatistan Cumhuriyeti",
   "HR",
   "Hrvatska",
   "Republika Hrvatska",
   "HRV"
  ],
  "latlng": [
   45.16666666,
   15.5
  ],
  "landlocked": false
 },
 {
  "name": "Hollanda",
  "officialName": "Hollanda Krallığı",
  "iso2": "NL",
  "iso3": "NLD",
  "flag": "🇳🇱",
  "capital": [
   "Amsterdam"
  ],
  "continent": "Europe",
  "subregion": "Western Europe",
  "borders": [
   "BEL",
   "DEU"
  ],
  "aliases": [
   "Netherlands",
   "Kingdom of the Netherlands",
   "Hollanda Krallığı",
   "NL",
   "Holland",
   "Nederland",
   "The Netherlands",
   "NLD"
  ],
  "latlng": [
   52.5,
   5.75
  ],
  "landlocked": false
 },
 {
  "name": "Honduras",
  "officialName": "Honduras Cumhuriyeti",
  "iso2": "HN",
  "iso3": "HND",
  "flag": "🇭🇳",
  "capital": [
   "Tegucigalpa"
  ],
  "continent": "Americas",
  "subregion": "Central America",
  "borders": [
   "GTM",
   "SLV",
   "NIC"
  ],
  "aliases": [
   "Republic of Honduras",
   "Honduras Cumhuriyeti",
   "HN",
   "República de Honduras",
   "HND"
  ],
  "latlng": [
   15,
   -86.5
  ],
  "landlocked": false
 },
 {
  "name": "Irak",
  "officialName": "Irak Cumhuriyeti",
  "iso2": "IQ",
  "iso3": "IRQ",
  "flag": "🇮🇶",
  "capital": [
   "Baghdad"
  ],
  "continent": "Asia",
  "subregion": "Western Asia",
  "borders": [
   "IRN",
   "JOR",
   "KWT",
   "SAU",
   "SYR",
   "TUR"
  ],
  "aliases": [
   "Iraq",
   "Republic of Iraq",
   "Irak Cumhuriyeti",
   "IQ",
   "Jumhūriyyat al-‘Irāq",
   "IRQ"
  ],
  "latlng": [
   33,
   44
  ],
  "landlocked": false
 },
 {
  "name": "İran",
  "officialName": "İran İslam Cumhuriyeti",
  "iso2": "IR",
  "iso3": "IRN",
  "flag": "🇮🇷",
  "capital": [
   "Tehran"
  ],
  "continent": "Asia",
  "subregion": "Southern Asia",
  "borders": [
   "AFG",
   "ARM",
   "AZE",
   "IRQ",
   "PAK",
   "TUR",
   "TKM"
  ],
  "aliases": [
   "Iran",
   "Islamic Republic of Iran",
   "İran İslam Cumhuriyeti",
   "IR",
   "Iran, Islamic Republic of",
   "Jomhuri-ye Eslāmi-ye Irān",
   "IRN"
  ],
  "latlng": [
   32,
   53
  ],
  "landlocked": false
 },
 {
  "name": "İrlanda",
  "officialName": "İrlanda Cumhuriyeti",
  "iso2": "IE",
  "iso3": "IRL",
  "flag": "🇮🇪",
  "capital": [
   "Dublin"
  ],
  "continent": "Europe",
  "subregion": "Northern Europe",
  "borders": [
   "GBR"
  ],
  "aliases": [
   "Ireland",
   "Republic of Ireland",
   "İrlanda Cumhuriyeti",
   "IE",
   "Éire",
   "Poblacht na hÉireann",
   "IRL"
  ],
  "latlng": [
   53,
   -8
  ],
  "landlocked": false
 },
 {
  "name": "İspanya",
  "officialName": "İspanya Krallığı",
  "iso2": "ES",
  "iso3": "ESP",
  "flag": "🇪🇸",
  "capital": [
   "Madrid"
  ],
  "continent": "Europe",
  "subregion": "Southern Europe",
  "borders": [
   "AND",
   "FRA",
   "PRT",
   "MAR"
  ],
  "aliases": [
   "Spain",
   "Kingdom of Spain",
   "İspanya Krallığı",
   "ES",
   "Reino de España",
   "ESP"
  ],
  "latlng": [
   40,
   -4
  ],
  "landlocked": false
 },
 {
  "name": "İsrail",
  "officialName": "İsrail Devleti",
  "iso2": "IL",
  "iso3": "ISR",
  "flag": "🇮🇱",
  "capital": [
   "Jerusalem"
  ],
  "continent": "Asia",
  "subregion": "Western Asia",
  "borders": [
   "EGY",
   "JOR",
   "LBN",
   "PSE",
   "SYR"
  ],
  "aliases": [
   "Israel",
   "State of Israel",
   "İsrail Devleti",
   "IL",
   "Medīnat Yisrā'el",
   "ISR"
  ],
  "latlng": [
   31.47,
   35.13
  ],
  "landlocked": false
 },
 {
  "name": "İsveç",
  "officialName": "İsveç Krallığı",
  "iso2": "SE",
  "iso3": "SWE",
  "flag": "🇸🇪",
  "capital": [
   "Stockholm"
  ],
  "continent": "Europe",
  "subregion": "Northern Europe",
  "borders": [
   "FIN",
   "NOR"
  ],
  "aliases": [
   "Sweden",
   "Kingdom of Sweden",
   "İsveç Krallığı",
   "SE",
   "Konungariket Sverige",
   "SWE"
  ],
  "latlng": [
   62,
   15
  ],
  "landlocked": false
 },
 {
  "name": "İsviçre",
  "officialName": "İsviçre Konfederasyonu",
  "iso2": "CH",
  "iso3": "CHE",
  "flag": "🇨🇭",
  "capital": [
   "Bern"
  ],
  "continent": "Europe",
  "subregion": "Western Europe",
  "borders": [
   "AUT",
   "FRA",
   "ITA",
   "LIE",
   "DEU"
  ],
  "aliases": [
   "Switzerland",
   "Swiss Confederation",
   "İsviçre Konfederasyonu",
   "CH",
   "Schweiz",
   "Suisse",
   "Svizzera",
   "Svizra",
   "CHE"
  ],
  "latlng": [
   47,
   8
  ],
  "landlocked": true
 },
 {
  "name": "İtalya",
  "officialName": "İtalya Cumhuriyeti",
  "iso2": "IT",
  "iso3": "ITA",
  "flag": "🇮🇹",
  "capital": [
   "Rome"
  ],
  "continent": "Europe",
  "subregion": "Southern Europe",
  "borders": [
   "AUT",
   "FRA",
   "SMR",
   "SVN",
   "CHE",
   "VAT"
  ],
  "aliases": [
   "Italy",
   "Italian Republic",
   "İtalya Cumhuriyeti",
   "IT",
   "Repubblica italiana",
   "ITA"
  ],
  "latlng": [
   42.83333333,
   12.83333333
  ],
  "landlocked": false
 },
 {
  "name": "İzlanda",
  "officialName": "İzlanda",
  "iso2": "IS",
  "iso3": "ISL",
  "flag": "🇮🇸",
  "capital": [
   "Reykjavik"
  ],
  "continent": "Europe",
  "subregion": "Northern Europe",
  "borders": [],
  "aliases": [
   "Iceland",
   "IS",
   "Island",
   "Republic of Iceland",
   "Lýðveldið Ísland",
   "ISL"
  ],
  "latlng": [
   65,
   -18
  ],
  "landlocked": false
 },
 {
  "name": "Jamaika",
  "officialName": "Jamaika",
  "iso2": "JM",
  "iso3": "JAM",
  "flag": "🇯🇲",
  "capital": [
   "Kingston"
  ],
  "continent": "Americas",
  "subregion": "Caribbean",
  "borders": [],
  "aliases": [
   "Jamaica",
   "JM",
   "JAM"
  ],
  "latlng": [
   18.25,
   -77.5
  ],
  "landlocked": false
 },
 {
  "name": "Japonya",
  "officialName": "Japonya",
  "iso2": "JP",
  "iso3": "JPN",
  "flag": "🇯🇵",
  "capital": [
   "Tokyo"
  ],
  "continent": "Asia",
  "subregion": "Eastern Asia",
  "borders": [],
  "aliases": [
   "Japan",
   "JP",
   "Nippon",
   "Nihon",
   "JPN"
  ],
  "latlng": [
   36,
   138
  ],
  "landlocked": false
 },
 {
  "name": "Kamboçya",
  "officialName": "Kamboçya Krallığı",
  "iso2": "KH",
  "iso3": "KHM",
  "flag": "🇰🇭",
  "capital": [
   "Phnom Penh"
  ],
  "continent": "Asia",
  "subregion": "South-Eastern Asia",
  "borders": [
   "LAO",
   "THA",
   "VNM"
  ],
  "aliases": [
   "Cambodia",
   "Kingdom of Cambodia",
   "Kamboçya Krallığı",
   "KH",
   "KHM"
  ],
  "latlng": [
   13,
   105
  ],
  "landlocked": false
 },
 {
  "name": "Kamerun",
  "officialName": "Kamerun Cumhuriyeti",
  "iso2": "CM",
  "iso3": "CMR",
  "flag": "🇨🇲",
  "capital": [
   "Yaoundé"
  ],
  "continent": "Africa",
  "subregion": "Middle Africa",
  "borders": [
   "CAF",
   "TCD",
   "COG",
   "GNQ",
   "GAB",
   "NGA"
  ],
  "aliases": [
   "Cameroon",
   "Republic of Cameroon",
   "Kamerun Cumhuriyeti",
   "CM",
   "République du Cameroun",
   "CMR"
  ],
  "latlng": [
   6,
   12
  ],
  "landlocked": false
 },
 {
  "name": "Kanada",
  "officialName": "Kanada",
  "iso2": "CA",
  "iso3": "CAN",
  "flag": "🇨🇦",
  "capital": [
   "Ottawa"
  ],
  "continent": "Americas",
  "subregion": "North America",
  "borders": [
   "USA"
  ],
  "aliases": [
   "Canada",
   "CA",
   "CAN"
  ],
  "latlng": [
   60,
   -95
  ],
  "landlocked": false
 },
 {
  "name": "Karadağ",
  "officialName": "Karadağ",
  "iso2": "ME",
  "iso3": "MNE",
  "flag": "🇲🇪",
  "capital": [
   "Podgorica"
  ],
  "continent": "Europe",
  "subregion": "Southeast Europe",
  "borders": [
   "ALB",
   "BIH",
   "HRV",
   "SRB"
  ],
  "aliases": [
   "Montenegro",
   "ME",
   "Crna Gora",
   "MNE"
  ],
  "latlng": [
   42.5,
   19.3
  ],
  "landlocked": false
 },
 {
  "name": "Katar",
  "officialName": "Katar Devleti",
  "iso2": "QA",
  "iso3": "QAT",
  "flag": "🇶🇦",
  "capital": [
   "Doha"
  ],
  "continent": "Asia",
  "subregion": "Western Asia",
  "borders": [
   "SAU"
  ],
  "aliases": [
   "Qatar",
   "State of Qatar",
   "Katar Devleti",
   "QA",
   "Dawlat Qaṭar",
   "QAT"
  ],
  "latlng": [
   25.5,
   51.25
  ],
  "landlocked": false
 },
 {
  "name": "Kazakistan",
  "officialName": "Kazakistan Cumhuriyeti",
  "iso2": "KZ",
  "iso3": "KAZ",
  "flag": "🇰🇿",
  "capital": [
   "Astana"
  ],
  "continent": "Asia",
  "subregion": "Central Asia",
  "borders": [
   "CHN",
   "KGZ",
   "RUS",
   "TKM",
   "UZB"
  ],
  "aliases": [
   "Kazakhstan",
   "Republic of Kazakhstan",
   "Kazakistan Cumhuriyeti",
   "KZ",
   "Qazaqstan",
   "Казахстан",
   "Қазақстан Республикасы",
   "Qazaqstan Respublïkası",
   "Республика Казахстан",
   "Respublika Kazakhstan",
   "KAZ"
  ],
  "latlng": [
   48,
   68
  ],
  "landlocked": true
 },
 {
  "name": "Kenya",
  "officialName": "Kenya Cumhuriyeti",
  "iso2": "KE",
  "iso3": "KEN",
  "flag": "🇰🇪",
  "capital": [
   "Nairobi"
  ],
  "continent": "Africa",
  "subregion": "Eastern Africa",
  "borders": [
   "ETH",
   "SOM",
   "SSD",
   "TZA",
   "UGA"
  ],
  "aliases": [
   "Republic of Kenya",
   "Kenya Cumhuriyeti",
   "KE",
   "Jamhuri ya Kenya",
   "KEN"
  ],
  "latlng": [
   1,
   38
  ],
  "landlocked": false
 },
 {
  "name": "Kiribati",
  "officialName": "Kiribati Cumhuriyeti",
  "iso2": "KI",
  "iso3": "KIR",
  "flag": "🇰🇮",
  "capital": [
   "South Tarawa"
  ],
  "continent": "Oceania",
  "subregion": "Micronesia",
  "borders": [],
  "aliases": [
   "Independent and Sovereign Republic of Kiribati",
   "Kiribati Cumhuriyeti",
   "KI",
   "Republic of Kiribati",
   "Ribaberiki Kiribati",
   "KIR"
  ],
  "latlng": [
   1.41666666,
   173
  ],
  "landlocked": false
 },
 {
  "name": "Kıbrıs",
  "officialName": "Kıbrıs Cumhuriyeti",
  "iso2": "CY",
  "iso3": "CYP",
  "flag": "🇨🇾",
  "capital": [
   "Nicosia"
  ],
  "continent": "Europe",
  "subregion": "Southern Europe",
  "borders": [],
  "aliases": [
   "Cyprus",
   "Republic of Cyprus",
   "Kıbrıs Cumhuriyeti",
   "CY",
   "Kýpros",
   "Κυπριακή Δημοκρατία",
   "CYP"
  ],
  "latlng": [
   35,
   33
  ],
  "landlocked": false
 },
 {
  "name": "Kırgızistan",
  "officialName": "Kırgız Cumhuriyeti",
  "iso2": "KG",
  "iso3": "KGZ",
  "flag": "🇰🇬",
  "capital": [
   "Bishkek"
  ],
  "continent": "Asia",
  "subregion": "Central Asia",
  "borders": [
   "CHN",
   "KAZ",
   "TJK",
   "UZB"
  ],
  "aliases": [
   "Kyrgyzstan",
   "Kyrgyz Republic",
   "Kırgız Cumhuriyeti",
   "KG",
   "Киргизия",
   "Кыргыз Республикасы",
   "Kyrgyz Respublikasy",
   "KGZ"
  ],
  "latlng": [
   41,
   75
  ],
  "landlocked": true
 },
 {
  "name": "Kolombiya",
  "officialName": "Kolombiya Cumhuriyeti",
  "iso2": "CO",
  "iso3": "COL",
  "flag": "🇨🇴",
  "capital": [
   "Bogotá"
  ],
  "continent": "Americas",
  "subregion": "South America",
  "borders": [
   "BRA",
   "ECU",
   "PAN",
   "PER",
   "VEN"
  ],
  "aliases": [
   "Colombia",
   "Republic of Colombia",
   "Kolombiya Cumhuriyeti",
   "CO",
   "República de Colombia",
   "COL"
  ],
  "latlng": [
   4,
   -72
  ],
  "landlocked": false
 },
 {
  "name": "Komorlar",
  "officialName": "Komorlar Birliği",
  "iso2": "KM",
  "iso3": "COM",
  "flag": "🇰🇲",
  "capital": [
   "Moroni"
  ],
  "continent": "Africa",
  "subregion": "Eastern Africa",
  "borders": [],
  "aliases": [
   "Comoros",
   "Union of the Comoros",
   "Komorlar Birliği",
   "KM",
   "Union des Comores",
   "Udzima wa Komori",
   "al-Ittiḥād al-Qumurī",
   "COM"
  ],
  "latlng": [
   -12.16666666,
   44.25
  ],
  "landlocked": false
 },
 {
  "name": "Kongo Cumhuriyeti",
  "officialName": "Kongo Cumhuriyeti",
  "iso2": "CG",
  "iso3": "COG",
  "flag": "🇨🇬",
  "capital": [
   "Brazzaville"
  ],
  "continent": "Africa",
  "subregion": "Middle Africa",
  "borders": [
   "AGO",
   "CMR",
   "CAF",
   "COD",
   "GAB"
  ],
  "aliases": [
   "Republic of the Congo",
   "CG",
   "Congo",
   "Congo-Brazzaville",
   "COG"
  ],
  "latlng": [
   -1,
   15
  ],
  "landlocked": false
 },
 {
  "name": "Kongo Demokratik Cumhuriyeti",
  "officialName": "Kongo Demokratik Cumhuriyeti",
  "iso2": "CD",
  "iso3": "COD",
  "flag": "🇨🇩",
  "capital": [
   "Kinshasa"
  ],
  "continent": "Africa",
  "subregion": "Middle Africa",
  "borders": [
   "AGO",
   "BDI",
   "CAF",
   "COG",
   "RWA",
   "SSD",
   "TZA",
   "UGA",
   "ZMB"
  ],
  "aliases": [
   "DR Congo",
   "Democratic Republic of the Congo",
   "CD",
   "Congo-Kinshasa",
   "Congo, the Democratic Republic of the",
   "Democratic Republic of Congo",
   "DRC",
   "COD"
  ],
  "latlng": [
   0,
   25
  ],
  "landlocked": false
 },
 {
  "name": "Kosta Rika",
  "officialName": "Kosta Rika Cumhuriyeti",
  "iso2": "CR",
  "iso3": "CRI",
  "flag": "🇨🇷",
  "capital": [
   "San José"
  ],
  "continent": "Americas",
  "subregion": "Central America",
  "borders": [
   "NIC",
   "PAN"
  ],
  "aliases": [
   "Costa Rica",
   "Republic of Costa Rica",
   "Kosta Rika Cumhuriyeti",
   "CR",
   "República de Costa Rica",
   "CRI"
  ],
  "latlng": [
   10,
   -84
  ],
  "landlocked": false
 },
 {
  "name": "Küba",
  "officialName": "Küba Cumhuriyeti",
  "iso2": "CU",
  "iso3": "CUB",
  "flag": "🇨🇺",
  "capital": [
   "Havana"
  ],
  "continent": "Americas",
  "subregion": "Caribbean",
  "borders": [],
  "aliases": [
   "Cuba",
   "Republic of Cuba",
   "Küba Cumhuriyeti",
   "CU",
   "República de Cuba",
   "CUB"
  ],
  "latlng": [
   21.5,
   -80
  ],
  "landlocked": false
 },
 {
  "name": "Kuveyt",
  "officialName": "Kuveyt Devleti",
  "iso2": "KW",
  "iso3": "KWT",
  "flag": "🇰🇼",
  "capital": [
   "Kuwait City"
  ],
  "continent": "Asia",
  "subregion": "Western Asia",
  "borders": [
   "IRQ",
   "SAU"
  ],
  "aliases": [
   "Kuwait",
   "State of Kuwait",
   "Kuveyt Devleti",
   "KW",
   "Dawlat al-Kuwait",
   "KWT"
  ],
  "latlng": [
   29.5,
   45.75
  ],
  "landlocked": false
 },
 {
  "name": "Kuzey Kore",
  "officialName": "Kore Demokratik Halk Cumhuriyeti",
  "iso2": "KP",
  "iso3": "PRK",
  "flag": "🇰🇵",
  "capital": [
   "Pyongyang"
  ],
  "continent": "Asia",
  "subregion": "Eastern Asia",
  "borders": [
   "CHN",
   "KOR",
   "RUS"
  ],
  "aliases": [
   "North Korea",
   "Democratic People's Republic of Korea",
   "Kore Demokratik Halk Cumhuriyeti",
   "KP",
   "DPRK",
   "조선민주주의인민공화국",
   "Chosŏn Minjujuŭi Inmin Konghwaguk",
   "Korea, Democratic People's Republic of",
   "북한",
   "북조선",
   "PRK"
  ],
  "latlng": [
   40,
   127
  ],
  "landlocked": false
 },
 {
  "name": "Kuzey Makedonya",
  "officialName": "Kuzey Makedonya Cumhuriyeti",
  "iso2": "MK",
  "iso3": "MKD",
  "flag": "🇲🇰",
  "capital": [
   "Skopje"
  ],
  "continent": "Europe",
  "subregion": "Southeast Europe",
  "borders": [
   "ALB",
   "BGR",
   "GRC",
   "SRB"
  ],
  "aliases": [
   "North Macedonia",
   "Republic of North Macedonia",
   "Kuzey Makedonya Cumhuriyeti",
   "MK",
   "The former Yugoslav Republic of Macedonia",
   "Macedonia, The Former Yugoslav Republic of",
   "Република Северна Македонија",
   "Macedonia",
   "MKD"
  ],
  "latlng": [
   41.83333333,
   22
  ],
  "landlocked": true
 },
 {
  "name": "Laos",
  "officialName": "Laos Demokratik Halk Cumhuriyeti",
  "iso2": "LA",
  "iso3": "LAO",
  "flag": "🇱🇦",
  "capital": [
   "Vientiane"
  ],
  "continent": "Asia",
  "subregion": "South-Eastern Asia",
  "borders": [
   "MMR",
   "KHM",
   "CHN",
   "THA",
   "VNM"
  ],
  "aliases": [
   "Lao People's Democratic Republic",
   "Laos Demokratik Halk Cumhuriyeti",
   "LA",
   "Lao",
   "Sathalanalat Paxathipatai Paxaxon Lao",
   "LAO"
  ],
  "latlng": [
   18,
   105
  ],
  "landlocked": true
 },
 {
  "name": "Lesotho",
  "officialName": "Lesotho Krallığı",
  "iso2": "LS",
  "iso3": "LSO",
  "flag": "🇱🇸",
  "capital": [
   "Maseru"
  ],
  "continent": "Africa",
  "subregion": "Southern Africa",
  "borders": [
   "ZAF"
  ],
  "aliases": [
   "Kingdom of Lesotho",
   "Lesotho Krallığı",
   "LS",
   "Muso oa Lesotho",
   "LSO"
  ],
  "latlng": [
   -29.5,
   28.5
  ],
  "landlocked": true
 },
 {
  "name": "Letonya",
  "officialName": "Letonya Cumhuriyeti",
  "iso2": "LV",
  "iso3": "LVA",
  "flag": "🇱🇻",
  "capital": [
   "Riga"
  ],
  "continent": "Europe",
  "subregion": "Northern Europe",
  "borders": [
   "BLR",
   "EST",
   "LTU",
   "RUS"
  ],
  "aliases": [
   "Latvia",
   "Republic of Latvia",
   "Letonya Cumhuriyeti",
   "LV",
   "Latvijas Republika",
   "LVA"
  ],
  "latlng": [
   57,
   25
  ],
  "landlocked": false
 },
 {
  "name": "Liberya",
  "officialName": "Liberya Cumhuriyeti",
  "iso2": "LR",
  "iso3": "LBR",
  "flag": "🇱🇷",
  "capital": [
   "Monrovia"
  ],
  "continent": "Africa",
  "subregion": "Western Africa",
  "borders": [
   "GIN",
   "CIV",
   "SLE"
  ],
  "aliases": [
   "Liberia",
   "Republic of Liberia",
   "Liberya Cumhuriyeti",
   "LR",
   "LBR"
  ],
  "latlng": [
   6.5,
   -9.5
  ],
  "landlocked": false
 },
 {
  "name": "Libya",
  "officialName": "Libya Devleti",
  "iso2": "LY",
  "iso3": "LBY",
  "flag": "🇱🇾",
  "capital": [
   "Tripoli"
  ],
  "continent": "Africa",
  "subregion": "Northern Africa",
  "borders": [
   "DZA",
   "TCD",
   "EGY",
   "NER",
   "SDN",
   "TUN"
  ],
  "aliases": [
   "State of Libya",
   "Libya Devleti",
   "LY",
   "Dawlat Libya",
   "LBY"
  ],
  "latlng": [
   25,
   17
  ],
  "landlocked": false
 },
 {
  "name": "Lihtenştayn",
  "officialName": "Lihtenştayn Prensliği",
  "iso2": "LI",
  "iso3": "LIE",
  "flag": "🇱🇮",
  "capital": [
   "Vaduz"
  ],
  "continent": "Europe",
  "subregion": "Western Europe",
  "borders": [
   "AUT",
   "CHE"
  ],
  "aliases": [
   "Liechtenstein",
   "Principality of Liechtenstein",
   "Lihtenştayn Prensliği",
   "LI",
   "Fürstentum Liechtenstein",
   "LIE"
  ],
  "latlng": [
   47.26666666,
   9.53333333
  ],
  "landlocked": true
 },
 {
  "name": "Litvanya",
  "officialName": "Litvanya Cumhuriyeti",
  "iso2": "LT",
  "iso3": "LTU",
  "flag": "🇱🇹",
  "capital": [
   "Vilnius"
  ],
  "continent": "Europe",
  "subregion": "Northern Europe",
  "borders": [
   "BLR",
   "LVA",
   "POL",
   "RUS"
  ],
  "aliases": [
   "Lithuania",
   "Republic of Lithuania",
   "Litvanya Cumhuriyeti",
   "LT",
   "Lietuvos Respublika",
   "LTU"
  ],
  "latlng": [
   56,
   24
  ],
  "landlocked": false
 },
 {
  "name": "Lübnan",
  "officialName": "Lübnan Cumhuriyeti",
  "iso2": "LB",
  "iso3": "LBN",
  "flag": "🇱🇧",
  "capital": [
   "Beirut"
  ],
  "continent": "Asia",
  "subregion": "Western Asia",
  "borders": [
   "ISR",
   "SYR"
  ],
  "aliases": [
   "Lebanon",
   "Lebanese Republic",
   "Lübnan Cumhuriyeti",
   "LB",
   "Al-Jumhūrīyah Al-Libnānīyah",
   "LBN"
  ],
  "latlng": [
   33.83333333,
   35.83333333
  ],
  "landlocked": false
 },
 {
  "name": "Lüksemburg",
  "officialName": "Lüksemburg Büyük Dükalığı",
  "iso2": "LU",
  "iso3": "LUX",
  "flag": "🇱🇺",
  "capital": [
   "Luxembourg"
  ],
  "continent": "Europe",
  "subregion": "Western Europe",
  "borders": [
   "BEL",
   "FRA",
   "DEU"
  ],
  "aliases": [
   "Luxembourg",
   "Grand Duchy of Luxembourg",
   "Lüksemburg Büyük Dükalığı",
   "LU",
   "Grand-Duché de Luxembourg",
   "Großherzogtum Luxemburg",
   "Groussherzogtum Lëtzebuerg",
   "LUX"
  ],
  "latlng": [
   49.75,
   6.16666666
  ],
  "landlocked": true
 },
 {
  "name": "Macaristan",
  "officialName": "Macaristan",
  "iso2": "HU",
  "iso3": "HUN",
  "flag": "🇭🇺",
  "capital": [
   "Budapest"
  ],
  "continent": "Europe",
  "subregion": "Central Europe",
  "borders": [
   "AUT",
   "HRV",
   "ROU",
   "SRB",
   "SVK",
   "SVN",
   "UKR"
  ],
  "aliases": [
   "Hungary",
   "HU",
   "HUN"
  ],
  "latlng": [
   47,
   20
  ],
  "landlocked": true
 },
 {
  "name": "Madagaskar",
  "officialName": "Madagaskar Cumhuriyeti",
  "iso2": "MG",
  "iso3": "MDG",
  "flag": "🇲🇬",
  "capital": [
   "Antananarivo"
  ],
  "continent": "Africa",
  "subregion": "Eastern Africa",
  "borders": [],
  "aliases": [
   "Madagascar",
   "Republic of Madagascar",
   "Madagaskar Cumhuriyeti",
   "MG",
   "Repoblikan'i Madagasikara",
   "République de Madagascar",
   "MDG"
  ],
  "latlng": [
   -20,
   47
  ],
  "landlocked": false
 },
 {
  "name": "Malavi",
  "officialName": "Malavi Cumhuriyeti",
  "iso2": "MW",
  "iso3": "MWI",
  "flag": "🇲🇼",
  "capital": [
   "Lilongwe"
  ],
  "continent": "Africa",
  "subregion": "Eastern Africa",
  "borders": [
   "MOZ",
   "TZA",
   "ZMB"
  ],
  "aliases": [
   "Malawi",
   "Republic of Malawi",
   "Malavi Cumhuriyeti",
   "MW",
   "MWI"
  ],
  "latlng": [
   -13.5,
   34
  ],
  "landlocked": true
 },
 {
  "name": "Maldivler",
  "officialName": "Maldivler Cumhuriyeti",
  "iso2": "MV",
  "iso3": "MDV",
  "flag": "🇲🇻",
  "capital": [
   "Malé"
  ],
  "continent": "Asia",
  "subregion": "Southern Asia",
  "borders": [],
  "aliases": [
   "Maldives",
   "Republic of the Maldives",
   "Maldivler Cumhuriyeti",
   "MV",
   "Maldive Islands",
   "Dhivehi Raajjeyge Jumhooriyya",
   "MDV"
  ],
  "latlng": [
   3.25,
   73
  ],
  "landlocked": false
 },
 {
  "name": "Malezya",
  "officialName": "Malezya",
  "iso2": "MY",
  "iso3": "MYS",
  "flag": "🇲🇾",
  "capital": [
   "Kuala Lumpur"
  ],
  "continent": "Asia",
  "subregion": "South-Eastern Asia",
  "borders": [
   "BRN",
   "IDN",
   "THA"
  ],
  "aliases": [
   "Malaysia",
   "MY",
   "MYS"
  ],
  "latlng": [
   2.5,
   112.5
  ],
  "landlocked": false
 },
 {
  "name": "Mali",
  "officialName": "Mali Cumhuriyeti",
  "iso2": "ML",
  "iso3": "MLI",
  "flag": "🇲🇱",
  "capital": [
   "Bamako"
  ],
  "continent": "Africa",
  "subregion": "Western Africa",
  "borders": [
   "DZA",
   "BFA",
   "GIN",
   "CIV",
   "MRT",
   "NER",
   "SEN"
  ],
  "aliases": [
   "Republic of Mali",
   "Mali Cumhuriyeti",
   "ML",
   "République du Mali",
   "MLI"
  ],
  "latlng": [
   17,
   -4
  ],
  "landlocked": true
 },
 {
  "name": "Malta",
  "officialName": "Malta Cumhuriyeti",
  "iso2": "MT",
  "iso3": "MLT",
  "flag": "🇲🇹",
  "capital": [
   "Valletta"
  ],
  "continent": "Europe",
  "subregion": "Southern Europe",
  "borders": [],
  "aliases": [
   "Republic of Malta",
   "Malta Cumhuriyeti",
   "MT",
   "Repubblika ta' Malta",
   "MLT"
  ],
  "latlng": [
   35.83333333,
   14.58333333
  ],
  "landlocked": false
 },
 {
  "name": "Marshall Adaları",
  "officialName": "Marshall Adaları Cumhuriyeti",
  "iso2": "MH",
  "iso3": "MHL",
  "flag": "🇲🇭",
  "capital": [
   "Majuro"
  ],
  "continent": "Oceania",
  "subregion": "Micronesia",
  "borders": [],
  "aliases": [
   "Marshall Islands",
   "Republic of the Marshall Islands",
   "Marshall Adaları Cumhuriyeti",
   "MH",
   "Aolepān Aorōkin M̧ajeļ",
   "MHL"
  ],
  "latlng": [
   9,
   168
  ],
  "landlocked": false
 },
 {
  "name": "Mauritius",
  "officialName": "Mauritius Cumhuriyeti",
  "iso2": "MU",
  "iso3": "MUS",
  "flag": "🇲🇺",
  "capital": [
   "Port Louis"
  ],
  "continent": "Africa",
  "subregion": "Eastern Africa",
  "borders": [],
  "aliases": [
   "Republic of Mauritius",
   "Mauritius Cumhuriyeti",
   "MU",
   "République de Maurice",
   "MUS"
  ],
  "latlng": [
   -20.28333333,
   57.55
  ],
  "landlocked": false
 },
 {
  "name": "Meksika",
  "officialName": "Birleşik Meksika Devletleri",
  "iso2": "MX",
  "iso3": "MEX",
  "flag": "🇲🇽",
  "capital": [
   "Mexico City"
  ],
  "continent": "Americas",
  "subregion": "North America",
  "borders": [
   "BLZ",
   "GTM",
   "USA"
  ],
  "aliases": [
   "Mexico",
   "United Mexican States",
   "Birleşik Meksika Devletleri",
   "MX",
   "Mexicanos",
   "Estados Unidos Mexicanos",
   "MEX"
  ],
  "latlng": [
   23,
   -102
  ],
  "landlocked": false
 },
 {
  "name": "Mikronezya",
  "officialName": "Mikronezya Federal Devletleri",
  "iso2": "FM",
  "iso3": "FSM",
  "flag": "🇫🇲",
  "capital": [
   "Palikir"
  ],
  "continent": "Oceania",
  "subregion": "Micronesia",
  "borders": [],
  "aliases": [
   "Micronesia",
   "Federated States of Micronesia",
   "Mikronezya Federal Devletleri",
   "FM",
   "Micronesia, Federated States of",
   "FSM"
  ],
  "latlng": [
   6.91666666,
   158.25
  ],
  "landlocked": false
 },
 {
  "name": "Mısır",
  "officialName": "Mısır Arap Cumhuriyeti",
  "iso2": "EG",
  "iso3": "EGY",
  "flag": "🇪🇬",
  "capital": [
   "Cairo"
  ],
  "continent": "Africa",
  "subregion": "Northern Africa",
  "borders": [
   "ISR",
   "LBY",
   "PSE",
   "SDN"
  ],
  "aliases": [
   "Egypt",
   "Arab Republic of Egypt",
   "Mısır Arap Cumhuriyeti",
   "EG",
   "EGY"
  ],
  "latlng": [
   27,
   30
  ],
  "landlocked": false
 },
 {
  "name": "Moğolistan",
  "officialName": "Moğolistan",
  "iso2": "MN",
  "iso3": "MNG",
  "flag": "🇲🇳",
  "capital": [
   "Ulan Bator"
  ],
  "continent": "Asia",
  "subregion": "Eastern Asia",
  "borders": [
   "CHN",
   "RUS"
  ],
  "aliases": [
   "Mongolia",
   "MN",
   "MNG"
  ],
  "latlng": [
   46,
   105
  ],
  "landlocked": true
 },
 {
  "name": "Moldova",
  "officialName": "Moldova Cumhuriyeti",
  "iso2": "MD",
  "iso3": "MDA",
  "flag": "🇲🇩",
  "capital": [
   "Chișinău"
  ],
  "continent": "Europe",
  "subregion": "Eastern Europe",
  "borders": [
   "ROU",
   "UKR"
  ],
  "aliases": [
   "Republic of Moldova",
   "Moldova Cumhuriyeti",
   "MD",
   "Moldova, Republic of",
   "Republica Moldova",
   "MDA"
  ],
  "latlng": [
   47,
   29
  ],
  "landlocked": true
 },
 {
  "name": "Monako",
  "officialName": "Monako Prensliği",
  "iso2": "MC",
  "iso3": "MCO",
  "flag": "🇲🇨",
  "capital": [
   "Monaco"
  ],
  "continent": "Europe",
  "subregion": "Western Europe",
  "borders": [
   "FRA"
  ],
  "aliases": [
   "Monaco",
   "Principality of Monaco",
   "Monako Prensliği",
   "MC",
   "Principauté de Monaco",
   "MCO"
  ],
  "latlng": [
   43.73333333,
   7.4
  ],
  "landlocked": false
 },
 {
  "name": "Moritanya",
  "officialName": "Moritanya İslam Cumhuriyeti",
  "iso2": "MR",
  "iso3": "MRT",
  "flag": "🇲🇷",
  "capital": [
   "Nouakchott"
  ],
  "continent": "Africa",
  "subregion": "Western Africa",
  "borders": [
   "DZA",
   "MLI",
   "SEN"
  ],
  "aliases": [
   "Mauritania",
   "Islamic Republic of Mauritania",
   "Moritanya İslam Cumhuriyeti",
   "MR",
   "al-Jumhūriyyah al-ʾIslāmiyyah al-Mūrītāniyyah",
   "MRT"
  ],
  "latlng": [
   20,
   -12
  ],
  "landlocked": false
 },
 {
  "name": "Mozambik",
  "officialName": "Mozambik Cumhuriyeti",
  "iso2": "MZ",
  "iso3": "MOZ",
  "flag": "🇲🇿",
  "capital": [
   "Maputo"
  ],
  "continent": "Africa",
  "subregion": "Eastern Africa",
  "borders": [
   "MWI",
   "ZAF",
   "SWZ",
   "TZA",
   "ZMB",
   "ZWE"
  ],
  "aliases": [
   "Mozambique",
   "Republic of Mozambique",
   "Mozambik Cumhuriyeti",
   "MZ",
   "República de Moçambique",
   "MOZ"
  ],
  "latlng": [
   -18.25,
   35
  ],
  "landlocked": false
 },
 {
  "name": "Myanmar",
  "officialName": "Myanmar Birliği Cumhuriyeti",
  "iso2": "MM",
  "iso3": "MMR",
  "flag": "🇲🇲",
  "capital": [
   "Naypyidaw"
  ],
  "continent": "Asia",
  "subregion": "South-Eastern Asia",
  "borders": [
   "BGD",
   "CHN",
   "IND",
   "LAO",
   "THA"
  ],
  "aliases": [
   "Republic of the Union of Myanmar",
   "Myanmar Birliği Cumhuriyeti",
   "MM",
   "Burma",
   "Pyidaunzu Thanmăda Myăma Nainngandaw",
   "MMR"
  ],
  "latlng": [
   22,
   98
  ],
  "landlocked": false
 },
 {
  "name": "Namibya",
  "officialName": "Namibya Cumhuriyeti",
  "iso2": "NA",
  "iso3": "NAM",
  "flag": "🇳🇦",
  "capital": [
   "Windhoek"
  ],
  "continent": "Africa",
  "subregion": "Southern Africa",
  "borders": [
   "AGO",
   "BWA",
   "ZAF",
   "ZMB"
  ],
  "aliases": [
   "Namibia",
   "Republic of Namibia",
   "Namibya Cumhuriyeti",
   "NA",
   "Namibië",
   "NAM"
  ],
  "latlng": [
   -22,
   17
  ],
  "landlocked": false
 },
 {
  "name": "Nauru",
  "officialName": "Nauru Cumhuriyeti",
  "iso2": "NR",
  "iso3": "NRU",
  "flag": "🇳🇷",
  "capital": [
   "Yaren"
  ],
  "continent": "Oceania",
  "subregion": "Micronesia",
  "borders": [],
  "aliases": [
   "Republic of Nauru",
   "Nauru Cumhuriyeti",
   "NR",
   "Naoero",
   "Pleasant Island",
   "Ripublik Naoero",
   "NRU"
  ],
  "latlng": [
   -0.53333333,
   166.91666666
  ],
  "landlocked": false
 },
 {
  "name": "Nepal",
  "officialName": "Nepal Federal Demokratik Cumhuriyeti",
  "iso2": "NP",
  "iso3": "NPL",
  "flag": "🇳🇵",
  "capital": [
   "Kathmandu"
  ],
  "continent": "Asia",
  "subregion": "Southern Asia",
  "borders": [
   "CHN",
   "IND"
  ],
  "aliases": [
   "Federal Democratic Republic of Nepal",
   "Nepal Federal Demokratik Cumhuriyeti",
   "NP",
   "Loktāntrik Ganatantra Nepāl",
   "NPL"
  ],
  "latlng": [
   28,
   84
  ],
  "landlocked": true
 },
 {
  "name": "Nijer",
  "officialName": "Nijer Cumhuriyeti",
  "iso2": "NE",
  "iso3": "NER",
  "flag": "🇳🇪",
  "capital": [
   "Niamey"
  ],
  "continent": "Africa",
  "subregion": "Western Africa",
  "borders": [
   "DZA",
   "BEN",
   "BFA",
   "TCD",
   "LBY",
   "MLI",
   "NGA"
  ],
  "aliases": [
   "Niger",
   "Republic of Niger",
   "Nijer Cumhuriyeti",
   "NE",
   "Nijar",
   "NER"
  ],
  "latlng": [
   16,
   8
  ],
  "landlocked": true
 },
 {
  "name": "Nijerya",
  "officialName": "Nijerya Federal Cumhuriyeti",
  "iso2": "NG",
  "iso3": "NGA",
  "flag": "🇳🇬",
  "capital": [
   "Abuja"
  ],
  "continent": "Africa",
  "subregion": "Western Africa",
  "borders": [
   "BEN",
   "CMR",
   "TCD",
   "NER"
  ],
  "aliases": [
   "Nigeria",
   "Federal Republic of Nigeria",
   "Nijerya Federal Cumhuriyeti",
   "NG",
   "Nijeriya",
   "Naíjíríà",
   "NGA"
  ],
  "latlng": [
   10,
   8
  ],
  "landlocked": false
 },
 {
  "name": "Nikaragua",
  "officialName": "Nikaragua Cumhuriyeti",
  "iso2": "NI",
  "iso3": "NIC",
  "flag": "🇳🇮",
  "capital": [
   "Managua"
  ],
  "continent": "Americas",
  "subregion": "Central America",
  "borders": [
   "CRI",
   "HND"
  ],
  "aliases": [
   "Nicaragua",
   "Republic of Nicaragua",
   "Nikaragua Cumhuriyeti",
   "NI",
   "República de Nicaragua",
   "NIC"
  ],
  "latlng": [
   13,
   -85
  ],
  "landlocked": false
 },
 {
  "name": "Norveç",
  "officialName": "Norveç Krallığı",
  "iso2": "NO",
  "iso3": "NOR",
  "flag": "🇳🇴",
  "capital": [
   "Oslo"
  ],
  "continent": "Europe",
  "subregion": "Northern Europe",
  "borders": [
   "FIN",
   "SWE",
   "RUS"
  ],
  "aliases": [
   "Norway",
   "Kingdom of Norway",
   "Norveç Krallığı",
   "NO",
   "Norge",
   "Noreg",
   "Kongeriket Norge",
   "Kongeriket Noreg",
   "NOR"
  ],
  "latlng": [
   62,
   10
  ],
  "landlocked": false
 },
 {
  "name": "Orta Afrika Cumhuriyeti",
  "officialName": "Orta Afrika Cumhuriyeti",
  "iso2": "CF",
  "iso3": "CAF",
  "flag": "🇨🇫",
  "capital": [
   "Bangui"
  ],
  "continent": "Africa",
  "subregion": "Middle Africa",
  "borders": [
   "CMR",
   "TCD",
   "COD",
   "COG",
   "SSD",
   "SDN"
  ],
  "aliases": [
   "Central African Republic",
   "CF",
   "République centrafricaine",
   "CAF"
  ],
  "latlng": [
   7,
   21
  ],
  "landlocked": true
 },
 {
  "name": "Özbekistan",
  "officialName": "Özbekistan Cumhuriyeti",
  "iso2": "UZ",
  "iso3": "UZB",
  "flag": "🇺🇿",
  "capital": [
   "Tashkent"
  ],
  "continent": "Asia",
  "subregion": "Central Asia",
  "borders": [
   "AFG",
   "KAZ",
   "KGZ",
   "TJK",
   "TKM"
  ],
  "aliases": [
   "Uzbekistan",
   "Republic of Uzbekistan",
   "özbekistan Cumhuriyeti",
   "UZ",
   "O‘zbekiston Respublikasi",
   "Ўзбекистон Республикаси",
   "UZB"
  ],
  "latlng": [
   41,
   64
  ],
  "landlocked": true
 },
 {
  "name": "Pakistan",
  "officialName": "Pakistan İslam Cumhuriyeti",
  "iso2": "PK",
  "iso3": "PAK",
  "flag": "🇵🇰",
  "capital": [
   "Islamabad"
  ],
  "continent": "Asia",
  "subregion": "Southern Asia",
  "borders": [
   "AFG",
   "CHN",
   "IND",
   "IRN"
  ],
  "aliases": [
   "Islamic Republic of Pakistan",
   "Pakistan İslam Cumhuriyeti",
   "PK",
   "Pākistān",
   "Islāmī Jumhūriya'eh Pākistān",
   "PAK"
  ],
  "latlng": [
   30,
   70
  ],
  "landlocked": false
 },
 {
  "name": "Palau",
  "officialName": "Palau Cumhuriyeti",
  "iso2": "PW",
  "iso3": "PLW",
  "flag": "🇵🇼",
  "capital": [
   "Ngerulmud"
  ],
  "continent": "Oceania",
  "subregion": "Micronesia",
  "borders": [],
  "aliases": [
   "Republic of Palau",
   "Palau Cumhuriyeti",
   "PW",
   "Beluu er a Belau",
   "PLW"
  ],
  "latlng": [
   7.5,
   134.5
  ],
  "landlocked": false
 },
 {
  "name": "Panama",
  "officialName": "Panama Cumhuriyeti",
  "iso2": "PA",
  "iso3": "PAN",
  "flag": "🇵🇦",
  "capital": [
   "Panama City"
  ],
  "continent": "Americas",
  "subregion": "Central America",
  "borders": [
   "COL",
   "CRI"
  ],
  "aliases": [
   "Republic of Panama",
   "Panama Cumhuriyeti",
   "PA",
   "República de Panamá",
   "PAN"
  ],
  "latlng": [
   9,
   -80
  ],
  "landlocked": false
 },
 {
  "name": "Papua Yeni Gine",
  "officialName": "Papua Yeni Gine Bağımsız Devleti",
  "iso2": "PG",
  "iso3": "PNG",
  "flag": "🇵🇬",
  "capital": [
   "Port Moresby"
  ],
  "continent": "Oceania",
  "subregion": "Melanesia",
  "borders": [
   "IDN"
  ],
  "aliases": [
   "Papua New Guinea",
   "Independent State of Papua New Guinea",
   "Papua Yeni Gine Bağımsız Devleti",
   "PG",
   "Independen Stet bilong Papua Niugini",
   "PNG"
  ],
  "latlng": [
   -6,
   147
  ],
  "landlocked": false
 },
 {
  "name": "Paraguay",
  "officialName": "Paraguay Cumhuriyeti",
  "iso2": "PY",
  "iso3": "PRY",
  "flag": "🇵🇾",
  "capital": [
   "Asunción"
  ],
  "continent": "Americas",
  "subregion": "South America",
  "borders": [
   "ARG",
   "BOL",
   "BRA"
  ],
  "aliases": [
   "Republic of Paraguay",
   "Paraguay Cumhuriyeti",
   "PY",
   "República del Paraguay",
   "Tetã Paraguái",
   "PRY"
  ],
  "latlng": [
   -23,
   -58
  ],
  "landlocked": true
 },
 {
  "name": "Peru",
  "officialName": "Peru Cumhuriyeti",
  "iso2": "PE",
  "iso3": "PER",
  "flag": "🇵🇪",
  "capital": [
   "Lima"
  ],
  "continent": "Americas",
  "subregion": "South America",
  "borders": [
   "BOL",
   "BRA",
   "CHL",
   "COL",
   "ECU"
  ],
  "aliases": [
   "Republic of Peru",
   "Peru Cumhuriyeti",
   "PE",
   "República del Perú",
   "PER"
  ],
  "latlng": [
   -10,
   -76
  ],
  "landlocked": false
 },
 {
  "name": "Polonya",
  "officialName": "Polonya Cumhuriyeti",
  "iso2": "PL",
  "iso3": "POL",
  "flag": "🇵🇱",
  "capital": [
   "Warsaw"
  ],
  "continent": "Europe",
  "subregion": "Central Europe",
  "borders": [
   "BLR",
   "CZE",
   "DEU",
   "LTU",
   "RUS",
   "SVK",
   "UKR"
  ],
  "aliases": [
   "Poland",
   "Republic of Poland",
   "Polonya Cumhuriyeti",
   "PL",
   "Rzeczpospolita Polska",
   "POL"
  ],
  "latlng": [
   52,
   20
  ],
  "landlocked": false
 },
 {
  "name": "Portekiz",
  "officialName": "Portekiz Cumhuriyeti",
  "iso2": "PT",
  "iso3": "PRT",
  "flag": "🇵🇹",
  "capital": [
   "Lisbon"
  ],
  "continent": "Europe",
  "subregion": "Southern Europe",
  "borders": [
   "ESP"
  ],
  "aliases": [
   "Portugal",
   "Portuguese Republic",
   "Portekiz Cumhuriyeti",
   "PT",
   "Portuguesa",
   "República Portuguesa",
   "PRT"
  ],
  "latlng": [
   39.5,
   -8
  ],
  "landlocked": false
 },
 {
  "name": "Romanya",
  "officialName": "Romanya",
  "iso2": "RO",
  "iso3": "ROU",
  "flag": "🇷🇴",
  "capital": [
   "Bucharest"
  ],
  "continent": "Europe",
  "subregion": "Southeast Europe",
  "borders": [
   "BGR",
   "HUN",
   "MDA",
   "SRB",
   "UKR"
  ],
  "aliases": [
   "Romania",
   "RO",
   "Rumania",
   "Roumania",
   "România",
   "ROU"
  ],
  "latlng": [
   46,
   25
  ],
  "landlocked": false
 },
 {
  "name": "Ruanda",
  "officialName": "Ruanda Cumhuriyeti",
  "iso2": "RW",
  "iso3": "RWA",
  "flag": "🇷🇼",
  "capital": [
   "Kigali"
  ],
  "continent": "Africa",
  "subregion": "Eastern Africa",
  "borders": [
   "BDI",
   "COD",
   "TZA",
   "UGA"
  ],
  "aliases": [
   "Rwanda",
   "Republic of Rwanda",
   "Ruanda Cumhuriyeti",
   "RW",
   "Repubulika y'u Rwanda",
   "République du Rwanda",
   "RWA"
  ],
  "latlng": [
   -2,
   30
  ],
  "landlocked": true
 },
 {
  "name": "Rusya",
  "officialName": "Rusya Federasyonu",
  "iso2": "RU",
  "iso3": "RUS",
  "flag": "🇷🇺",
  "capital": [
   "Moscow"
  ],
  "continent": "Europe",
  "subregion": "Eastern Europe",
  "borders": [
   "AZE",
   "BLR",
   "CHN",
   "EST",
   "FIN",
   "GEO",
   "KAZ",
   "PRK",
   "LVA",
   "LTU",
   "MNG",
   "NOR",
   "POL",
   "UKR"
  ],
  "aliases": [
   "Russia",
   "Russian Federation",
   "Rusya Federasyonu",
   "RU",
   "Российская Федерация",
   "RUS"
  ],
  "latlng": [
   60,
   100
  ],
  "landlocked": false
 },
 {
  "name": "Saint Kitts ve Nevis",
  "officialName": "Saint Kitts ve Nevis Federasyonu",
  "iso2": "KN",
  "iso3": "KNA",
  "flag": "🇰🇳",
  "capital": [
   "Basseterre"
  ],
  "continent": "Americas",
  "subregion": "Caribbean",
  "borders": [],
  "aliases": [
   "Saint Kitts and Nevis",
   "Federation of Saint Christopher and Nevis",
   "Saint Kitts ve Nevis Federasyonu",
   "KN",
   "KNA"
  ],
  "latlng": [
   17.33333333,
   -62.75
  ],
  "landlocked": false
 },
 {
  "name": "Saint Lucia",
  "officialName": "Saint Lucia",
  "iso2": "LC",
  "iso3": "LCA",
  "flag": "🇱🇨",
  "capital": [
   "Castries"
  ],
  "continent": "Americas",
  "subregion": "Caribbean",
  "borders": [],
  "aliases": [
   "LC",
   "LCA"
  ],
  "latlng": [
   13.88333333,
   -60.96666666
  ],
  "landlocked": false
 },
 {
  "name": "Saint Vincent ve Grenadinler",
  "officialName": "Saint Vincent ve Grenadinler",
  "iso2": "VC",
  "iso3": "VCT",
  "flag": "🇻🇨",
  "capital": [
   "Kingstown"
  ],
  "continent": "Americas",
  "subregion": "Caribbean",
  "borders": [],
  "aliases": [
   "Saint Vincent and the Grenadines",
   "VC",
   "VCT"
  ],
  "latlng": [
   13.25,
   -61.2
  ],
  "landlocked": false
 },
 {
  "name": "San Marino",
  "officialName": "San Marino Cumhuriyeti",
  "iso2": "SM",
  "iso3": "SMR",
  "flag": "🇸🇲",
  "capital": [
   "City of San Marino"
  ],
  "continent": "Europe",
  "subregion": "Southern Europe",
  "borders": [
   "ITA"
  ],
  "aliases": [
   "Most Serene Republic of San Marino",
   "San Marino Cumhuriyeti",
   "SM",
   "Republic of San Marino",
   "Repubblica di San Marino",
   "SMR"
  ],
  "latlng": [
   43.76666666,
   12.41666666
  ],
  "landlocked": true
 },
 {
  "name": "São Tomé ve Príncipe",
  "officialName": "São Tomé ve Príncipe Demokratik Cumhuriyeti",
  "iso2": "ST",
  "iso3": "STP",
  "flag": "🇸🇹",
  "capital": [
   "São Tomé"
  ],
  "continent": "Africa",
  "subregion": "Middle Africa",
  "borders": [],
  "aliases": [
   "São Tomé and Príncipe",
   "Democratic Republic of São Tomé and Príncipe",
   "São Tomé ve Príncipe Demokratik Cumhuriyeti",
   "ST",
   "Sao Tome and Principe",
   "República Democrática de São Tomé e Príncipe",
   "STP"
  ],
  "latlng": [
   1,
   7
  ],
  "landlocked": false
 },
 {
  "name": "Senegal",
  "officialName": "Senegal Cumhuriyeti",
  "iso2": "SN",
  "iso3": "SEN",
  "flag": "🇸🇳",
  "capital": [
   "Dakar"
  ],
  "continent": "Africa",
  "subregion": "Western Africa",
  "borders": [
   "GMB",
   "GIN",
   "GNB",
   "MLI",
   "MRT"
  ],
  "aliases": [
   "Republic of Senegal",
   "Senegal Cumhuriyeti",
   "SN",
   "République du Sénégal",
   "SEN"
  ],
  "latlng": [
   14,
   -14
  ],
  "landlocked": false
 },
 {
  "name": "Seyşeller",
  "officialName": "Seyşeller Cumhuriyeti",
  "iso2": "SC",
  "iso3": "SYC",
  "flag": "🇸🇨",
  "capital": [
   "Victoria"
  ],
  "continent": "Africa",
  "subregion": "Eastern Africa",
  "borders": [],
  "aliases": [
   "Seychelles",
   "Republic of Seychelles",
   "Seyşeller Cumhuriyeti",
   "SC",
   "Repiblik Sesel",
   "République des Seychelles",
   "SYC"
  ],
  "latlng": [
   -4.58333333,
   55.66666666
  ],
  "landlocked": false
 },
 {
  "name": "Sierra Leone",
  "officialName": "Sierra Leone Cumhuriyeti",
  "iso2": "SL",
  "iso3": "SLE",
  "flag": "🇸🇱",
  "capital": [
   "Freetown"
  ],
  "continent": "Africa",
  "subregion": "Western Africa",
  "borders": [
   "GIN",
   "LBR"
  ],
  "aliases": [
   "Republic of Sierra Leone",
   "Sierra Leone Cumhuriyeti",
   "SL",
   "SLE"
  ],
  "latlng": [
   8.5,
   -11.5
  ],
  "landlocked": false
 },
 {
  "name": "Şili",
  "officialName": "Şili Cumhuriyeti",
  "iso2": "CL",
  "iso3": "CHL",
  "flag": "🇨🇱",
  "capital": [
   "Santiago"
  ],
  "continent": "Americas",
  "subregion": "South America",
  "borders": [
   "ARG",
   "BOL",
   "PER"
  ],
  "aliases": [
   "Chile",
   "Republic of Chile",
   "şili Cumhuriyeti",
   "CL",
   "República de Chile",
   "CHL"
  ],
  "latlng": [
   -30,
   -71
  ],
  "landlocked": false
 },
 {
  "name": "Singapur",
  "officialName": "Singapur Cumhuriyeti",
  "iso2": "SG",
  "iso3": "SGP",
  "flag": "🇸🇬",
  "capital": [
   "Singapore"
  ],
  "continent": "Asia",
  "subregion": "South-Eastern Asia",
  "borders": [],
  "aliases": [
   "Singapore",
   "Republic of Singapore",
   "Singapur Cumhuriyeti",
   "SG",
   "Singapura",
   "Republik Singapura",
   "新加坡共和国",
   "SGP"
  ],
  "latlng": [
   1.36666666,
   103.8
  ],
  "landlocked": false
 },
 {
  "name": "Sırbistan",
  "officialName": "Sırbistan Cumhuriyeti",
  "iso2": "RS",
  "iso3": "SRB",
  "flag": "🇷🇸",
  "capital": [
   "Belgrade"
  ],
  "continent": "Europe",
  "subregion": "Southeast Europe",
  "borders": [
   "BIH",
   "BGR",
   "HRV",
   "HUN",
   "MKD",
   "MNE",
   "ROU"
  ],
  "aliases": [
   "Serbia",
   "Republic of Serbia",
   "Sırbistan Cumhuriyeti",
   "RS",
   "Srbija",
   "Republika Srbija",
   "Србија",
   "Република Србија",
   "SRB"
  ],
  "latlng": [
   44,
   21
  ],
  "landlocked": true
 },
 {
  "name": "Slovakya",
  "officialName": "Slovak Cumhuriyeti",
  "iso2": "SK",
  "iso3": "SVK",
  "flag": "🇸🇰",
  "capital": [
   "Bratislava"
  ],
  "continent": "Europe",
  "subregion": "Central Europe",
  "borders": [
   "AUT",
   "CZE",
   "HUN",
   "POL",
   "UKR"
  ],
  "aliases": [
   "Slovakia",
   "Slovak Republic",
   "Slovak Cumhuriyeti",
   "SK",
   "Slovenská republika",
   "SVK"
  ],
  "latlng": [
   48.66666666,
   19.5
  ],
  "landlocked": true
 },
 {
  "name": "Slovenya",
  "officialName": "Slovenya Cumhuriyeti",
  "iso2": "SI",
  "iso3": "SVN",
  "flag": "🇸🇮",
  "capital": [
   "Ljubljana"
  ],
  "continent": "Europe",
  "subregion": "Central Europe",
  "borders": [
   "AUT",
   "HRV",
   "ITA",
   "HUN"
  ],
  "aliases": [
   "Slovenia",
   "Republic of Slovenia",
   "Slovenya Cumhuriyeti",
   "SI",
   "Republika Slovenija",
   "SVN"
  ],
  "latlng": [
   46.11666666,
   14.81666666
  ],
  "landlocked": false
 },
 {
  "name": "Solomon Adaları",
  "officialName": "Solomon Adaları",
  "iso2": "SB",
  "iso3": "SLB",
  "flag": "🇸🇧",
  "capital": [
   "Honiara"
  ],
  "continent": "Oceania",
  "subregion": "Melanesia",
  "borders": [],
  "aliases": [
   "Solomon Islands",
   "SB",
   "SLB"
  ],
  "latlng": [
   -8,
   159
  ],
  "landlocked": false
 },
 {
  "name": "Somali",
  "officialName": "Somali Federal Cumhuriyeti",
  "iso2": "SO",
  "iso3": "SOM",
  "flag": "🇸🇴",
  "capital": [
   "Mogadishu"
  ],
  "continent": "Africa",
  "subregion": "Eastern Africa",
  "borders": [
   "DJI",
   "ETH",
   "KEN"
  ],
  "aliases": [
   "Somalia",
   "Federal Republic of Somalia",
   "Somali Federal Cumhuriyeti",
   "SO",
   "aṣ-Ṣūmāl",
   "Jamhuuriyadda Federaalka Soomaaliya",
   "Jumhūriyyat aṣ-Ṣūmāl al-Fiderāliyya",
   "SOM"
  ],
  "latlng": [
   10,
   49
  ],
  "landlocked": false
 },
 {
  "name": "Sri Lanka",
  "officialName": "Sri Lanka Demokratik Sosyalist Cumhuriyeti",
  "iso2": "LK",
  "iso3": "LKA",
  "flag": "🇱🇰",
  "capital": [
   "Colombo"
  ],
  "continent": "Asia",
  "subregion": "Southern Asia",
  "borders": [],
  "aliases": [
   "Democratic Socialist Republic of Sri Lanka",
   "Sri Lanka Demokratik Sosyalist Cumhuriyeti",
   "LK",
   "ilaṅkai",
   "LKA"
  ],
  "latlng": [
   7,
   81
  ],
  "landlocked": false
 },
 {
  "name": "Sudan",
  "officialName": "Sudan Cumhuriyeti",
  "iso2": "SD",
  "iso3": "SDN",
  "flag": "🇸🇩",
  "capital": [
   "Khartoum"
  ],
  "continent": "Africa",
  "subregion": "Northern Africa",
  "borders": [
   "CAF",
   "TCD",
   "EGY",
   "ERI",
   "ETH",
   "LBY",
   "SSD"
  ],
  "aliases": [
   "Republic of the Sudan",
   "Sudan Cumhuriyeti",
   "SD",
   "Jumhūrīyat as-Sūdān",
   "SDN"
  ],
  "latlng": [
   15,
   30
  ],
  "landlocked": false
 },
 {
  "name": "Surinam",
  "officialName": "Surinam Cumhuriyeti",
  "iso2": "SR",
  "iso3": "SUR",
  "flag": "🇸🇷",
  "capital": [
   "Paramaribo"
  ],
  "continent": "Americas",
  "subregion": "South America",
  "borders": [
   "BRA",
   "GUY"
  ],
  "aliases": [
   "Suriname",
   "Republic of Suriname",
   "Surinam Cumhuriyeti",
   "SR",
   "Sarnam",
   "Sranangron",
   "Republiek Suriname",
   "SUR"
  ],
  "latlng": [
   4,
   -56
  ],
  "landlocked": false
 },
 {
  "name": "Suriye",
  "officialName": "Suriye Arap Cumhuriyeti",
  "iso2": "SY",
  "iso3": "SYR",
  "flag": "🇸🇾",
  "capital": [
   "Damascus"
  ],
  "continent": "Asia",
  "subregion": "Western Asia",
  "borders": [
   "IRQ",
   "ISR",
   "JOR",
   "LBN",
   "TUR"
  ],
  "aliases": [
   "Syria",
   "Syrian Arab Republic",
   "Suriye Arap Cumhuriyeti",
   "SY",
   "Al-Jumhūrīyah Al-ʻArabīyah As-Sūrīyah",
   "SYR"
  ],
  "latlng": [
   35,
   38
  ],
  "landlocked": false
 },
 {
  "name": "Suudi Arabistan",
  "officialName": "Suudi Arabistan Krallığı",
  "iso2": "SA",
  "iso3": "SAU",
  "flag": "🇸🇦",
  "capital": [
   "Riyadh"
  ],
  "continent": "Asia",
  "subregion": "Western Asia",
  "borders": [
   "IRQ",
   "JOR",
   "KWT",
   "OMN",
   "QAT",
   "ARE",
   "YEM"
  ],
  "aliases": [
   "Saudi Arabia",
   "Kingdom of Saudi Arabia",
   "Suudi Arabistan Krallığı",
   "Saudi",
   "SA",
   "Al-Mamlakah al-‘Arabiyyah as-Su‘ūdiyyah",
   "SAU"
  ],
  "latlng": [
   25,
   45
  ],
  "landlocked": false
 },
 {
  "name": "Tacikistan",
  "officialName": "Tacikistan Cumhuriyeti",
  "iso2": "TJ",
  "iso3": "TJK",
  "flag": "🇹🇯",
  "capital": [
   "Dushanbe"
  ],
  "continent": "Asia",
  "subregion": "Central Asia",
  "borders": [
   "AFG",
   "CHN",
   "KGZ",
   "UZB"
  ],
  "aliases": [
   "Tajikistan",
   "Republic of Tajikistan",
   "Tacikistan Cumhuriyeti",
   "TJ",
   "Toçikiston",
   "Ҷумҳурии Тоҷикистон",
   "Çumhuriyi Toçikiston",
   "TJK"
  ],
  "latlng": [
   39,
   71
  ],
  "landlocked": true
 },
 {
  "name": "Tanzanya",
  "officialName": "Tanzanya Birleşik Cumhuriyeti",
  "iso2": "TZ",
  "iso3": "TZA",
  "flag": "🇹🇿",
  "capital": [
   "Dodoma"
  ],
  "continent": "Africa",
  "subregion": "Eastern Africa",
  "borders": [
   "BDI",
   "COD",
   "KEN",
   "MWI",
   "MOZ",
   "RWA",
   "UGA",
   "ZMB"
  ],
  "aliases": [
   "Tanzania",
   "United Republic of Tanzania",
   "Tanzanya Birleşik Cumhuriyeti",
   "TZ",
   "Tanzania, United Republic of",
   "Jamhuri ya Muungano wa Tanzania",
   "TZA"
  ],
  "latlng": [
   -6,
   35
  ],
  "landlocked": false
 },
 {
  "name": "Tayland",
  "officialName": "Tayland Krallığı",
  "iso2": "TH",
  "iso3": "THA",
  "flag": "🇹🇭",
  "capital": [
   "Bangkok"
  ],
  "continent": "Asia",
  "subregion": "South-Eastern Asia",
  "borders": [
   "MMR",
   "KHM",
   "LAO",
   "MYS"
  ],
  "aliases": [
   "Thailand",
   "Kingdom of Thailand",
   "Tayland Krallığı",
   "TH",
   "Prathet",
   "Thai",
   "ราชอาณาจักรไทย",
   "Ratcha Anachak Thai",
   "THA"
  ],
  "latlng": [
   15,
   100
  ],
  "landlocked": false
 },
 {
  "name": "Togo",
  "officialName": "Togo Cumhuriyeti",
  "iso2": "TG",
  "iso3": "TGO",
  "flag": "🇹🇬",
  "capital": [
   "Lomé"
  ],
  "continent": "Africa",
  "subregion": "Western Africa",
  "borders": [
   "BEN",
   "BFA",
   "GHA"
  ],
  "aliases": [
   "Togolese Republic",
   "Togo Cumhuriyeti",
   "TG",
   "Togolese",
   "République Togolaise",
   "TGO"
  ],
  "latlng": [
   8,
   1.16666666
  ],
  "landlocked": false
 },
 {
  "name": "Tonga",
  "officialName": "Tonga Krallığı",
  "iso2": "TO",
  "iso3": "TON",
  "flag": "🇹🇴",
  "capital": [
   "Nuku'alofa"
  ],
  "continent": "Oceania",
  "subregion": "Polynesia",
  "borders": [],
  "aliases": [
   "Kingdom of Tonga",
   "Tonga Krallığı",
   "TO",
   "TON"
  ],
  "latlng": [
   -20,
   -175
  ],
  "landlocked": false
 },
 {
  "name": "Trinidad ve Tobago",
  "officialName": "Trinidad ve Tobago Cumhuriyeti",
  "iso2": "TT",
  "iso3": "TTO",
  "flag": "🇹🇹",
  "capital": [
   "Port of Spain"
  ],
  "continent": "Americas",
  "subregion": "Caribbean",
  "borders": [],
  "aliases": [
   "Trinidad and Tobago",
   "Republic of Trinidad and Tobago",
   "Trinidad ve Tobago Cumhuriyeti",
   "TT",
   "TTO"
  ],
  "latlng": [
   11,
   -61
  ],
  "landlocked": false
 },
 {
  "name": "Tunus",
  "officialName": "Tunus Cumhuriyeti",
  "iso2": "TN",
  "iso3": "TUN",
  "flag": "🇹🇳",
  "capital": [
   "Tunis"
  ],
  "continent": "Africa",
  "subregion": "Northern Africa",
  "borders": [
   "DZA",
   "LBY"
  ],
  "aliases": [
   "Tunisia",
   "Tunisian Republic",
   "Tunus Cumhuriyeti",
   "TN",
   "Republic of Tunisia",
   "al-Jumhūriyyah at-Tūnisiyyah",
   "TUN"
  ],
  "latlng": [
   34,
   9
  ],
  "landlocked": false
 },
 {
  "name": "Türkiye",
  "officialName": "Türkiye Cumhuriyeti",
  "iso2": "TR",
  "iso3": "TUR",
  "flag": "🇹🇷",
  "capital": [
   "Ankara"
  ],
  "continent": "Asia",
  "subregion": "Western Asia",
  "borders": [
   "ARM",
   "AZE",
   "BGR",
   "GEO",
   "GRC",
   "IRN",
   "IRQ",
   "SYR"
  ],
  "aliases": [
   "Republic of Türkiye",
   "Türkiye Cumhuriyeti",
   "TR",
   "Turkiye",
   "Republic of Turkey",
   "TUR"
  ],
  "latlng": [
   39,
   35
  ],
  "landlocked": false
 },
 {
  "name": "Türkmenistan",
  "officialName": "Türkmenistan",
  "iso2": "TM",
  "iso3": "TKM",
  "flag": "🇹🇲",
  "capital": [
   "Ashgabat"
  ],
  "continent": "Asia",
  "subregion": "Central Asia",
  "borders": [
   "AFG",
   "IRN",
   "KAZ",
   "UZB"
  ],
  "aliases": [
   "Turkmenistan",
   "TM",
   "TKM"
  ],
  "latlng": [
   40,
   60
  ],
  "landlocked": true
 },
 {
  "name": "Tuvalu",
  "officialName": "Tuvalu",
  "iso2": "TV",
  "iso3": "TUV",
  "flag": "🇹🇻",
  "capital": [
   "Funafuti"
  ],
  "continent": "Oceania",
  "subregion": "Polynesia",
  "borders": [],
  "aliases": [
   "TV",
   "TUV"
  ],
  "latlng": [
   -8,
   178
  ],
  "landlocked": false
 },
 {
  "name": "Uganda",
  "officialName": "Uganda Cumhuriyeti",
  "iso2": "UG",
  "iso3": "UGA",
  "flag": "🇺🇬",
  "capital": [
   "Kampala"
  ],
  "continent": "Africa",
  "subregion": "Eastern Africa",
  "borders": [
   "COD",
   "KEN",
   "RWA",
   "SSD",
   "TZA"
  ],
  "aliases": [
   "Republic of Uganda",
   "Uganda Cumhuriyeti",
   "UG",
   "Jamhuri ya Uganda",
   "UGA"
  ],
  "latlng": [
   1,
   32
  ],
  "landlocked": true
 },
 {
  "name": "Ukrayna",
  "officialName": "Ukrayna",
  "iso2": "UA",
  "iso3": "UKR",
  "flag": "🇺🇦",
  "capital": [
   "Kyiv"
  ],
  "continent": "Europe",
  "subregion": "Eastern Europe",
  "borders": [
   "BLR",
   "HUN",
   "MDA",
   "POL",
   "ROU",
   "RUS",
   "SVK"
  ],
  "aliases": [
   "Ukraine",
   "UA",
   "Ukrayina",
   "UKR"
  ],
  "latlng": [
   49,
   32
  ],
  "landlocked": false
 },
 {
  "name": "Umman",
  "officialName": "Umman Sultanlığı",
  "iso2": "OM",
  "iso3": "OMN",
  "flag": "🇴🇲",
  "capital": [
   "Muscat"
  ],
  "continent": "Asia",
  "subregion": "Western Asia",
  "borders": [
   "SAU",
   "ARE",
   "YEM"
  ],
  "aliases": [
   "Oman",
   "Sultanate of Oman",
   "Umman Sultanlığı",
   "OM",
   "Salṭanat ʻUmān",
   "OMN"
  ],
  "latlng": [
   21,
   57
  ],
  "landlocked": false
 },
 {
  "name": "Ürdün",
  "officialName": "Ürdün Hâşimi Krallığı",
  "iso2": "JO",
  "iso3": "JOR",
  "flag": "🇯🇴",
  "capital": [
   "Amman"
  ],
  "continent": "Asia",
  "subregion": "Western Asia",
  "borders": [
   "IRQ",
   "ISR",
   "PSE",
   "SAU",
   "SYR"
  ],
  "aliases": [
   "Jordan",
   "Hashemite Kingdom of Jordan",
   "ürdün Hâşimi Krallığı",
   "JO",
   "al-Mamlakah al-Urdunīyah al-Hāshimīyah",
   "JOR"
  ],
  "latlng": [
   31,
   36
  ],
  "landlocked": false
 },
 {
  "name": "Uruguay",
  "officialName": "Uruguay Doğu Cumhuriyeti",
  "iso2": "UY",
  "iso3": "URY",
  "flag": "🇺🇾",
  "capital": [
   "Montevideo"
  ],
  "continent": "Americas",
  "subregion": "South America",
  "borders": [
   "ARG",
   "BRA"
  ],
  "aliases": [
   "Oriental Republic of Uruguay",
   "Uruguay Doğu Cumhuriyeti",
   "UY",
   "República Oriental del Uruguay",
   "URY"
  ],
  "latlng": [
   -33,
   -56
  ],
  "landlocked": false
 },
 {
  "name": "Vanuatu",
  "officialName": "Vanuatu Cumhuriyeti",
  "iso2": "VU",
  "iso3": "VUT",
  "flag": "🇻🇺",
  "capital": [
   "Port Vila"
  ],
  "continent": "Oceania",
  "subregion": "Melanesia",
  "borders": [],
  "aliases": [
   "Republic of Vanuatu",
   "Vanuatu Cumhuriyeti",
   "VU",
   "Ripablik blong Vanuatu",
   "République de Vanuatu",
   "VUT"
  ],
  "latlng": [
   -16,
   167
  ],
  "landlocked": false
 },
 {
  "name": "Vatikan",
  "officialName": "Vatikan şehir Devleti",
  "iso2": "VA",
  "iso3": "VAT",
  "flag": "🇻🇦",
  "capital": [
   "Vatican City"
  ],
  "continent": "Europe",
  "subregion": "Southern Europe",
  "borders": [
   "ITA"
  ],
  "aliases": [
   "Vatican City",
   "Vatican City State",
   "Vatikan şehir Devleti",
   "VA",
   "Holy See (Vatican City State)",
   "Vatican",
   "Stato della Città del Vaticano",
   "VAT"
  ],
  "latlng": [
   41.9,
   12.45
  ],
  "landlocked": true
 },
 {
  "name": "Venezuela",
  "officialName": "Bolivarcı Venezuela Cumhuriyeti",
  "iso2": "VE",
  "iso3": "VEN",
  "flag": "🇻🇪",
  "capital": [
   "Caracas"
  ],
  "continent": "Americas",
  "subregion": "South America",
  "borders": [
   "BRA",
   "COL",
   "GUY"
  ],
  "aliases": [
   "Bolivarian Republic of Venezuela",
   "Bolivarcı Venezuela Cumhuriyeti",
   "VE",
   "Venezuela, Bolivarian Republic of",
   "República Bolivariana de Venezuela",
   "VEN"
  ],
  "latlng": [
   8,
   -66
  ],
  "landlocked": false
 },
 {
  "name": "Vietnam",
  "officialName": "Vietnam Sosyalist Cumhuriyeti",
  "iso2": "VN",
  "iso3": "VNM",
  "flag": "🇻🇳",
  "capital": [
   "Hanoi"
  ],
  "continent": "Asia",
  "subregion": "South-Eastern Asia",
  "borders": [
   "KHM",
   "CHN",
   "LAO"
  ],
  "aliases": [
   "Socialist Republic of Vietnam",
   "Vietnam Sosyalist Cumhuriyeti",
   "VN",
   "Cộng hòa Xã hội chủ nghĩa Việt Nam",
   "Viet Nam",
   "VNM"
  ],
  "latlng": [
   16.16666666,
   107.83333333
  ],
  "landlocked": false
 },
 {
  "name": "Yemen",
  "officialName": "Yemen Cumhuriyeti",
  "iso2": "YE",
  "iso3": "YEM",
  "flag": "🇾🇪",
  "capital": [
   "Sana'a"
  ],
  "continent": "Asia",
  "subregion": "Western Asia",
  "borders": [
   "OMN",
   "SAU"
  ],
  "aliases": [
   "Republic of Yemen",
   "Yemen Cumhuriyeti",
   "YE",
   "Yemeni Republic",
   "al-Jumhūriyyah al-Yamaniyyah",
   "YEM"
  ],
  "latlng": [
   15,
   48
  ],
  "landlocked": false
 },
 {
  "name": "Yeni Zelanda",
  "officialName": "Yeni Zelanda",
  "iso2": "NZ",
  "iso3": "NZL",
  "flag": "🇳🇿",
  "capital": [
   "Wellington"
  ],
  "continent": "Oceania",
  "subregion": "Australia and New Zealand",
  "borders": [],
  "aliases": [
   "New Zealand",
   "NZ",
   "Aotearoa",
   "NZL"
  ],
  "latlng": [
   -41,
   174
  ],
  "landlocked": false
 },
 {
  "name": "Yeşil Burun",
  "officialName": "Yeşil Burun Cumhuriyeti",
  "iso2": "CV",
  "iso3": "CPV",
  "flag": "🇨🇻",
  "capital": [
   "Praia"
  ],
  "continent": "Africa",
  "subregion": "Western Africa",
  "borders": [],
  "aliases": [
   "Cape Verde",
   "Republic of Cabo Verde",
   "Yeşil Burun Cumhuriyeti",
   "CV",
   "República de Cabo Verde",
   "CPV"
  ],
  "latlng": [
   16,
   -24
  ],
  "landlocked": false
 },
 {
  "name": "Yunanistan",
  "officialName": "Helen Cumhuriyeti",
  "iso2": "GR",
  "iso3": "GRC",
  "flag": "🇬🇷",
  "capital": [
   "Athens"
  ],
  "continent": "Europe",
  "subregion": "Southern Europe",
  "borders": [
   "ALB",
   "BGR",
   "TUR",
   "MKD"
  ],
  "aliases": [
   "Greece",
   "Hellenic Republic",
   "Helen Cumhuriyeti",
   "GR",
   "Elláda",
   "Ελληνική Δημοκρατία",
   "GRC"
  ],
  "latlng": [
   39,
   22
  ],
  "landlocked": false
 },
 {
  "name": "Zambiya",
  "officialName": "Zambiya Cumhuriyeti",
  "iso2": "ZM",
  "iso3": "ZMB",
  "flag": "🇿🇲",
  "capital": [
   "Lusaka"
  ],
  "continent": "Africa",
  "subregion": "Eastern Africa",
  "borders": [
   "AGO",
   "BWA",
   "COD",
   "MWI",
   "MOZ",
   "NAM",
   "TZA",
   "ZWE"
  ],
  "aliases": [
   "Zambia",
   "Republic of Zambia",
   "Zambiya Cumhuriyeti",
   "ZM",
   "ZMB"
  ],
  "latlng": [
   -15,
   30
  ],
  "landlocked": true
 },
 {
  "name": "Zimbabve",
  "officialName": "Zimbabve Cumhuriyeti",
  "iso2": "ZW",
  "iso3": "ZWE",
  "flag": "🇿🇼",
  "capital": [
   "Harare"
  ],
  "continent": "Africa",
  "subregion": "Eastern Africa",
  "borders": [
   "BWA",
   "MOZ",
   "ZAF",
   "ZMB"
  ],
  "aliases": [
   "Zimbabwe",
   "Republic of Zimbabwe",
   "Zimbabve Cumhuriyeti",
   "ZW",
   "ZWE"
  ],
  "latlng": [
   -20,
   30
  ],
  "landlocked": true
 }
];

export const COUNTRY_COUNT = countries.length;
