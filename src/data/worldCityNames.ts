/**
 * "Kaç kilometre?" oyunu: şehirlerin Türkçe adları.
 *
 * worldCities.json'daki adlar GeoNames'ten, İngilizce ya da yerel yazımla
 * gelir (Munich, Köln, Beijing). Türkçe arayüzde yerleşik Türkçe adı olanlar
 * burada. İngilizce ve İspanyolcada veri adı olduğu gibi kullanılır; onlar için
 * ayrı tablo yok.
 *
 * Kural: YALNIZ emin olunan adlar yazılır. Tabloda olmayan şehir veri adıyla
 * görünür (Türkçesi veri adıyla aynıysa zaten yazmaya gerek yok: Paris, Berlin).
 * Emin olunamayan ya da kaynaklara göre değişen adlar bilerek dışarıda:
 * Vagadugu, Yamusukro, Nuakşot, Naypyidaw, Kiev/Kyiv, Krakov/Kraków,
 * Meksiko/Mexico City, Cakarta/Jakarta, Tiencin, Kum, Hemedan, Kirmanşah,
 * Urumçi/Ürümçi, Peşaver, Rangun/Yangon, Tebük/Tabuk, Filibe/Plovdiv,
 * Temeşvar, Yaş, Vroclav, Dıraç, Nis/Nice, Hudeyde, Taiz.
 * Rehberi olan şehirlerde (örn. Xi'an, St. Petersburg, Québec City) adın
 * sitedeki rehberle aynı yazılması için rehberdeki ad esas alındı. Ekranda ise
 * rehberi olan şehrin adı doğrudan sitedeki addan gelir (cityDisplayName siteName,
 * serverData.guideNames); bu tablo rehberi olmayan şehirlerin adıdır.
 *
 * Anahtar: "ISO2:veri adı". Değer: Türkçe ad.
 * scripts/distance.test.ts her anahtarın veride var olduğunu denetler.
 */
export const TR_CITY_NAMES: Readonly<Record<string, string>> = {
  /* ---- başkentler ---- */
  "AE:Abu Dhabi": "Abu Dabi",
  "AF:Kabul": "Kabil",
  "AL:Tirana": "Tiran",
  "AM:Yerevan": "Erivan",
  "AT:Vienna": "Viyana",
  "AU:Canberra": "Kanberra",
  "AZ:Baku": "Bakü",
  "BA:Sarajevo": "Saraybosna",
  "BD:Dhaka": "Dakka",
  "BE:Brussels": "Brüksel",
  "BG:Sofia": "Sofya",
  "BR:Brasília": "Brasilia",
  "CD:Kinshasa": "Kinşasa",
  "CN:Beijing": "Pekin",
  "CO:Bogotá": "Bogota",
  "CY:Nicosia": "Lefkoşa",
  "CZ:Prague": "Prag",
  "DJ:Djibouti": "Cibuti",
  "DK:Copenhagen": "Kopenhag",
  "DZ:Algiers": "Cezayir",
  "EG:Cairo": "Kahire",
  "GB:London": "Londra",
  "GE:Tbilisi": "Tiflis",
  "GH:Accra": "Akra",
  "GN:Conakry": "Konakri",
  "GR:Athens": "Atina",
  "HU:Budapest": "Budapeşte",
  "IL:Jerusalem": "Kudüs",
  "IN:New Delhi": "Yeni Delhi",
  "IQ:Baghdad": "Bağdat",
  "IR:Tehran": "Tahran",
  "IS:Reykjavík": "Reykjavik",
  "IT:Rome": "Roma",
  "KG:Bishkek": "Bişkek",
  "KR:Seoul": "Seul",
  "KW:Kuwait City": "Kuveyt",
  "LB:Beirut": "Beyrut",
  "LU:Luxembourg": "Lüksemburg",
  "LY:Tripoli": "Trablus",
  "MC:Monaco": "Monako",
  "MD:Chisinau": "Kişinev",
  "MK:Skopje": "Üsküp",
  "MN:Ulan Bator": "Ulan Batur",
  "NP:Kathmandu": "Katmandu",
  "OM:Muscat": "Maskat",
  "PL:Warsaw": "Varşova",
  "PT:Lisbon": "Lizbon",
  "RO:Bucharest": "Bükreş",
  "RS:Belgrade": "Belgrad",
  "RU:Moscow": "Moskova",
  "SA:Riyadh": "Riyad",
  "SD:Khartoum": "Hartum",
  "SG:Singapore": "Singapur",
  "SO:Mogadishu": "Mogadişu",
  "SY:Damascus": "Şam",
  "TJ:Dushanbe": "Duşenbe",
  "TM:Ashgabat": "Aşkabat",
  "TN:Tunis": "Tunus",
  "UZ:Tashkent": "Taşkent",
  "VA:Vatican City": "Vatikan",
  "YE:Sanaa": "Sana",

  /* ---- diğer tanınmış şehirler ---- */
  "AF:Mazar-e Sharif": "Mezar-ı Şerif",
  "AM:Gyumri": "Gümrü",
  "AU:Sydney": "Sidney",
  "AZ:Ganja": "Gence",
  "BE:Antwerpen": "Anvers",
  "CA:Montréal": "Montreal",
  "CA:Québec": "Québec City",
  "CH:Genève": "Cenevre",
  "CH:Lausanne": "Lozan",
  "CH:Zürich": "Zürih",
  "CN:Shanghai": "Şanghay",
  "CN:Xi’an": "Xi'an",
  "CY:Limassol": "Limasol",
  "DE:Frankfurt am Main": "Frankfurt",
  "DE:Munich": "Münih",
  "DK:Århus": "Aarhus",
  "EG:Alexandria": "İskenderiye",
  "EG:Luxor": "Luksor",
  "EG:Suez": "Süveyş",
  "ES:Donostia / San Sebastián": "San Sebastián",
  "ES:Palma": "Palma de Mallorca",
  "FR:Bordeaux": "Bordo",
  "FR:Marseille": "Marsilya",
  "FR:Strasbourg": "Strazburg",
  "GE:Batumi": "Batum",
  "GR:Thessaloníki": "Selanik",
  "IL:Haifa": "Hayfa",
  "IN:Kolkata": "Kalküta",
  "IQ:As Sulaymaniyah": "Süleymaniye",
  "IQ:Basrah": "Basra",
  "IQ:Karbala": "Kerbela",
  "IQ:Kirkuk": "Kerkük",
  "IQ:Mosul": "Musul",
  "IQ:Najaf": "Necef",
  "IQ:Nasiriyah": "Nasıriye",
  "IR:Isfahan": "İsfahan",
  "IR:Mashhad": "Meşhed",
  "IR:Shiraz": "Şiraz",
  "IR:Tabriz": "Tebriz",
  "IT:Florence": "Floransa",
  "IT:Genoa": "Cenova",
  "IT:Milan": "Milano",
  "IT:Naples": "Napoli",
  "IT:Turin": "Torino",
  "LB:Tripoli": "Trablus",
  "LY:Benghazi": "Bingazi",
  "KZ:Shymkent": "Çimkent",
  "MA:Casablanca": "Kazablanka",
  "MA:Fès": "Fes",
  "MA:Marrakesh": "Marakeş",
  "MA:Tangier": "Tanca",
  "PK:Karachi": "Karaçi",
  "PK:Lahore": "Lahor",
  "RS:Niš": "Niş",
  "RO:Constanţa": "Köstence",
  "RU:Nizhniy Novgorod": "Nijni Novgorod",
  "RU:Saint Petersburg": "St. Petersburg",
  "RU:Sochi": "Soçi",
  "SA:Jeddah": "Cidde",
  "SA:Mecca": "Mekke",
  "SA:Medina": "Medine",
  "SA:Ta’if": "Taif",
  "SY:Aleppo": "Halep",
  "SY:Homs": "Humus",
  "SY:Latakia": "Lazkiye",
  "TR:Istanbul": "İstanbul",
  "UA:Kharkiv": "Harkov",
  "US:New York City": "New York",
  "UZ:Andijon": "Andican",
  "UZ:Bukhara": "Buhara",
  "UZ:Samarkand": "Semerkant",
};

/**
 * Şehrin dile göre görünen adı. Yalnız Türkçede ad tablosu var; en ve es'te
 * (ve henüz yayında olmayan dillerde) veri adı olduğu gibi kullanılır.
 * `siteName`: şehrin rehberi varsa sitedeki Türkçe adı (serverData.guideNames);
 * Türkçede tablodan da önce gelir, çünkü oyun ile rehber aynı yazımı göstermeli.
 */
export function cityDisplayName(name: string, iso2: string, locale: string, siteName?: string): string {
  return locale === "tr" ? (siteName ?? TR_CITY_NAMES[`${iso2}:${name}`] ?? name) : name;
}
