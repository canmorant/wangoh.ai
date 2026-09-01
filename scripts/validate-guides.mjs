const baseUrl = process.env.VALIDATION_BASE_URL ?? "http://127.0.0.1:3000";
const canonicalBase = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wangoh.com";
const scopes = [
  {
    country: "japonya",
    cities: ["tokyo", "kyoto", "osaka", "hiroshima", "nara", "sapporo", "kobe", "okinawa"],
    planningHeading: "Japonya rotası nasıl kurulur?",
  },
  {
    country: "amerika-birlesik-devletleri",
    cities: ["new-york", "los-angeles", "miami", "chicago", "san-francisco", "las-vegas"],
    planningHeading: "Amerika rotası nasıl kurulur?",
  },
  {
    country: "tayland",
    cities: ["bangkok", "chiang-mai", "phuket", "krabi", "koh-samui", "ayutthaya"],
    planningHeading: "Tayland rotası nasıl kurulur?",
  },
  {
    country: "italya",
    cities: ["roma", "venedik", "floransa", "milano", "amalfi-kiyisi", "napoli"],
    planningHeading: "İtalya rotası nasıl kurulur?",
  },
  {
    country: "fransa",
    cities: ["paris", "nice", "lyon", "marsilya", "bordo", "strazburg"],
    planningHeading: "Fransa rotası nasıl kurulur?",
  },
  {
    country: "guney-kore",
    cities: ["seul", "busan", "jeju-adasi", "gyeongju", "incheon", "sokcho"],
    planningHeading: "Güney Kore rotası nasıl kurulur?",
  },
  {
    country: "ispanya",
    cities: ["barcelona", "madrid", "sevilla", "valencia", "malaga", "granada", "bilbao", "cordoba", "alicante", "san-sebastian", "toledo", "salamanca", "palma-de-mallorca", "ibiza", "tenerife", "gran-canaria"],
    planningHeading: "İspanya rotası nasıl kurulur?",
  },
  {
    country: "turkiye",
    cities: ["istanbul", "antalya", "izmir", "mugla", "bodrum", "fethiye", "marmaris", "kapadokya", "ankara", "bursa", "canakkale", "trabzon", "mardin", "gaziantep", "sanliurfa", "eskisehir", "konya", "kas", "alanya"],
    planningHeading: "Türkiye rotası nasıl kurulur?",
  },
  {
    country: "birlesik-krallik",
    cities: ["londra", "edinburgh", "manchester", "liverpool", "oxford", "cambridge", "bath", "york", "glasgow", "belfast", "brighton", "bristol", "cardiff", "iskocya-highlands", "cotswolds", "lake-district"],
    planningHeading: "Birleşik Krallık rotası nasıl kurulur?",
  },
  {
    country: "endonezya",
    cities: ["jakarta", "yogyakarta", "ubud", "canggu", "uluwatu", "nusa-penida", "lombok", "gili-adalari", "labuan-bajo", "bromo-dagi", "banyuwangi", "bandung", "surabaya", "toba-golu", "bukittinggi", "raja-ampat", "makassar", "tana-toraja"],
    planningHeading: "Endonezya rotası nasıl kurulur?",
  },
  {
    country: "cin",
    cities: ["pekin", "sanghay", "xi-an", "chengdu", "chongqing", "hangzhou", "suzhou", "nanjing", "guilin-ve-yangshuo", "zhangjiajie", "guangzhou", "shenzhen", "kunming", "dali", "lijiang", "harbin"],
    planningHeading: "Çin rotası nasıl kurulur?",
  },
  {
    country: "hollanda",
    cities: ["amsterdam", "rotterdam", "lahey", "utrecht", "haarlem", "leiden", "delft", "maastricht", "groningen", "eindhoven", "giethoorn", "zaanse-schans", "keukenhof-ve-lisse", "texel"],
    planningHeading: "Hollanda rotası nasıl kurulur?",
  },
  {
    country: "avusturya",
    cities: ["viyana", "salzburg", "innsbruck", "graz", "hallstatt", "wachau-vadisi", "linz", "zell-am-see"],
    planningHeading: "Avusturya rotası nasıl kurulur?",
  },
  {
    country: "portekiz",
    cities: ["lizbon", "porto", "sintra", "algarve", "madeira", "azor-adalari", "coimbra", "evora"],
    planningHeading: "Portekiz rotası nasıl kurulur?",
  },
  {
    country: "almanya",
    cities: ["berlin", "munih", "hamburg", "koln", "frankfurt", "dresden", "nurnberg", "kara-orman"],
    planningHeading: "Almanya rotası nasıl kurulur?",
  },
  {
    country: "meksika",
    cities: ["mexico-city", "oaxaca", "cancun", "tulum", "merida", "guadalajara", "san-miguel-de-allende", "chiapas"],
    planningHeading: "Meksika rotası nasıl kurulur?",
  },
  {
    country: "brezilya",
    cities: ["rio-de-janeiro", "sao-paulo", "salvador", "foz-do-iguacu", "florianopolis", "recife-ve-olinda", "manaus-ve-amazon", "lencois-maranhenses"],
    planningHeading: "Brezilya rotası nasıl kurulur?",
  },
  {
    country: "arjantin",
    cities: ["buenos-aires", "mendoza", "bariloche", "el-calafate", "ushuaia", "salta-ve-jujuy", "puerto-iguazu", "el-chalten"],
    planningHeading: "Arjantin rotası nasıl kurulur?",
  },
  {
    country: "kanada",
    cities: ["toronto", "vancouver", "montreal", "quebec-city", "banff", "jasper", "niagara-selaleleri", "yukon"],
    planningHeading: "Kanada rotası nasıl kurulur?",
  },
  {
    country: "isvicre",
    cities: ["zurih", "luzern", "bern", "cenevre", "lozan", "interlaken", "zermatt", "st-moritz"],
    planningHeading: "İsviçre rotası nasıl kurulur?",
  },
  {
    country: "belcika",
    cities: ["bruksel", "brugge", "gent", "anvers", "leuven", "liege", "dinant", "ardenler"],
    planningHeading: "Belçika rotası nasıl kurulur?",
  },
  {
    country: "macaristan",
    cities: ["budapeste", "szentendre", "eger", "pecs", "szeged", "debrecen", "balaton-golu", "sopron"],
    planningHeading: "Macaristan rotası nasıl kurulur?",
  },
  {
    country: "cek-cumhuriyeti",
    cities: ["prag", "cesky-krumlov", "brno", "karlovy-vary", "kutna-hora", "olomouc", "plzen", "bohemya-isvicresi"],
    planningHeading: "Çek Cumhuriyeti rotası nasıl kurulur?",
  },
  {
    country: "polonya",
    cities: ["varsova", "krakow", "gdansk", "wroclaw", "poznan", "zakopane", "torun", "lublin"],
    planningHeading: "Polonya rotası nasıl kurulur?",
  },
  {
    country: "rusya",
    cities: ["moskova", "st-petersburg", "kazan", "soci", "kaliningrad", "murmansk", "baykal-golu", "vladivostok"],
    planningHeading: "Rusya rotası nasıl kurulur?",
  },
  {
    country: "sirbistan",
    cities: ["belgrad", "novi-sad", "nis", "subotica", "zlatibor", "tara-milli-parki", "kopaonik", "demir-kapi"],
    planningHeading: "Sırbistan rotası nasıl kurulur?",
  },
  {
    country: "karadag",
    cities: ["kotor", "budva", "podgorica", "cetinje", "perast", "herceg-novi", "durmitor", "ulcinj"],
    planningHeading: "Karadağ rotası nasıl kurulur?",
  },
  {
    country: "bosna-hersek",
    cities: ["saraybosna", "mostar", "blagaj", "travnik", "jajce", "banja-luka", "trebinje", "una-milli-parki"],
    planningHeading: "Bosna-Hersek rotası nasıl kurulur?",
  },
  {
    country: "arnavutluk",
    cities: ["tiran", "berat", "gjirokaster", "shkoder", "kruje", "theth", "sarande", "himare"],
    planningHeading: "Arnavutluk rotası nasıl kurulur?",
  },
  {
    country: "yunanistan",
    cities: ["atina", "selanik", "santorini", "mikonos", "girit", "rodos", "korfu", "meteora"],
    planningHeading: "Yunanistan rotası nasıl kurulur?",
  },
  {
    country: "hirvatistan",
    cities: ["zagreb", "dubrovnik", "split", "zadar", "hvar", "istria", "plitvice-golleri", "sibenik"],
    planningHeading: "Hırvatistan rotası nasıl kurulur?",
  },
  {
    country: "slovenya",
    cities: ["ljubljana", "bled-golu", "bohinj", "piran", "postojna-ve-predjama", "soca-vadisi", "maribor", "kranjska-gora"],
    planningHeading: "Slovenya rotası nasıl kurulur?",
  },
  {
    country: "norvec",
    cities: ["oslo", "bergen", "tromso", "lofoten", "geirangerfjord", "flam", "trondheim", "stavanger"],
    planningHeading: "Norveç rotası nasıl kurulur?",
  },
  {
    country: "isvec",
    cities: ["stockholm", "goteborg", "malmo", "uppsala", "gotland", "kiruna", "abisko", "dalarna"],
    planningHeading: "İsveç rotası nasıl kurulur?",
  },
  {
    country: "danimarka",
    cities: ["kopenhag", "aarhus", "odense", "aalborg", "ribe", "skagen", "bornholm", "roskilde"],
    planningHeading: "Danimarka rotası nasıl kurulur?",
  },
  {
    country: "finlandiya",
    cities: ["helsinki", "rovaniemi", "turku", "tampere", "porvoo", "finlandiya-goller-bolgesi", "inari-ve-saariselka", "aland-adalari"],
    planningHeading: "Finlandiya rotası nasıl kurulur?",
  },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function attributeTag(html, tagName, attribute, value) {
  const tags = html.match(new RegExp(`<${tagName}\\b[^>]*>`, "gi")) ?? [];
  return tags.find((tag) =>
    new RegExp(`\\b${attribute}=["']${value}["']`, "i").test(tag)
  );
}

function attributeValue(tag, attribute) {
  return tag?.match(new RegExp(`\\b${attribute}=["']([^"']*)["']`, "i"))?.[1];
}

async function htmlFor(path) {
  const response = await fetch(`${baseUrl}${path}`);
  assert(response.ok, `${path}: HTTP ${response.status}`);
  return response.text();
}

const titles = new Set();
const descriptions = new Set();

for (const scope of scopes) {
  for (const city of scope.cities) {
    const path = `/${scope.country}/${city}`;
    const html = await htmlFor(path);
    const h1Count = (html.match(/<h1\b/gi) ?? []).length;
    const title = html.match(/<title>(.*?)<\/title>/i)?.[1];
    const descriptionTag = attributeTag(html, "meta", "name", "description");
    const canonicalTag = attributeTag(html, "link", "rel", "canonical");
    const robotsTag = attributeTag(html, "meta", "name", "robots");
    const ogTitleTag = attributeTag(html, "meta", "property", "og:title");
    const twitterCardTag = attributeTag(html, "meta", "name", "twitter:card");

    assert(h1Count === 1, `${path}: tek H1 bekleniyordu, ${h1Count} bulundu`);
    assert(title && !titles.has(title), `${path}: title eksik veya yineleniyor`);
    titles.add(title);
    const description = attributeValue(descriptionTag, "content");
    assert(description && !descriptions.has(description), `${path}: meta description eksik veya yineleniyor`);
    descriptions.add(description);
    assert(
      attributeValue(canonicalTag, "href") === `${canonicalBase}${path}`,
      `${path}: canonical hatalı`
    );
    assert(attributeValue(robotsTag, "content")?.includes("index"), `${path}: index robots eksik`);
    assert(!attributeValue(robotsTag, "content")?.includes("noindex"), `${path}: yanlış noindex`);
    assert(attributeValue(ogTitleTag, "content"), `${path}: og:title eksik`);
    assert(attributeValue(twitterCardTag, "content") === "summary_large_image", `${path}: Twitter kartı eksik`);
    assert(html.includes('"@type":"Article"'), `${path}: Article JSON-LD eksik`);
    assert(html.includes('"@type":"BreadcrumbList"'), `${path}: breadcrumb JSON-LD eksik`);
    assert(html.includes('"@type":"FAQPage"'), `${path}: FAQ JSON-LD eksik`);
    assert(html.includes('"@type":"TouristDestination"'), `${path}: TouristDestination JSON-LD eksik`);
    assert(html.includes("<details"), `${path}: görünür SSS eksik`);
    assert(html.includes("Resmî kaynaklar ve son kontrol"), `${path}: görünür kaynak bölümü eksik`);
    assert(html.includes('lang="tr"'), `${path}: Türkçe belge dili eksik`);
    assert(!html.toLocaleLowerCase("tr").includes("hazırlanıyor"), `${path}: taslak metni görünüyor`);
    assert(html.includes("Beslenme tercihleri"), `${path}: beslenme tercihleri bölümü eksik`);
    assert(html.includes("Vegan Pick"), `${path}: vegan önerisi eksik`);
    assert(html.includes("Halal Pick"), `${path}: helal önerisi eksik`);
    assert(html.includes("Google Maps"), `${path}: restoran harita bağlantısı eksik`);
    assert(html.includes("Doğrulama notu"), `${path}: restoran doğrulama notu eksik`);
    assert((html.match(/dateTime="\d{4}-\d{2}-\d{2}"/g) ?? []).length >= 2, `${path}: restoran kontrol tarihi eksik`);
    const dietaryCards = html.match(/<article\b[^>]*data-dietary-card[^>]*>/gi) ?? [];
    const dietaryCategories = dietaryCards.map((tag) => attributeValue(tag, "data-dietary-category"));
    const dietaryNames = dietaryCards.map((tag) => attributeValue(tag, "data-restaurant-name"));
    assert(dietaryCards.length === 2, `${path}: iki beslenme kartı bekleniyordu, ${dietaryCards.length} bulundu`);
    assert(dietaryCategories.includes("vegan"), `${path}: vegan kart kategorisi eksik`);
    assert(dietaryCategories.includes("halal"), `${path}: helal kart kategorisi eksik`);
    assert(new Set(dietaryNames).size === 2, `${path}: aynı restoran iki kez kullanılmış`);

    for (const sibling of scope.cities.filter((candidate) => candidate !== city)) {
      assert(html.includes(`href="/${scope.country}/${sibling}"`), `${path}: ${sibling} iç bağlantısı eksik`);
    }
  }

  const hubPath = `/${scope.country}`;
  const hub = await htmlFor(hubPath);
  assert((hub.match(/<h1\b/gi) ?? []).length === 1, `${hubPath}: tek H1 bulunmalı`);
  assert(hub.includes(scope.planningHeading), `${hubPath}: rota merkezi içeriği eksik`);
  assert(hub.includes('"@type":"TouristDestination"'), `${hubPath}: TouristDestination JSON-LD eksik`);
  assert(hub.includes('"@type":"ItemList"'), `${hubPath}: ItemList JSON-LD eksik`);
  assert(!hub.toLocaleLowerCase("tr").includes("hazırlanıyor"), `${hubPath}: tamamlanmamış kart görünüyor`);
  for (const city of scope.cities) {
    assert(hub.includes(`href="/${scope.country}/${city}"`), `${hubPath}: ${city} kartı eksik`);
  }
}

const sitemap = await htmlFor("/sitemap.xml");
for (const scope of scopes) {
  assert(sitemap.includes(`${canonicalBase}/${scope.country}`), `Sitemap'te ${scope.country} merkezi eksik`);
  for (const city of scope.cities) {
    assert(sitemap.includes(`${canonicalBase}/${scope.country}/${city}`), `Sitemap'te ${city} eksik`);
  }
}
const guideCount = scopes.reduce((total, scope) => total + scope.cities.length, 0);
console.log(`✓ ${guideCount} rehber, ${scopes.length} ülke merkezi ve sitemap doğrulandı.`);
