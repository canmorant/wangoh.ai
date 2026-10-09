/**
 * "Kaç kilometre?" oyununun şehir verisini üretir: src/data/worldCities.json
 *
 * Kaynak: all-the-cities 3.1.0 (MIT; GeoNames tabanlı, GeoNames verisi CC BY 4.0)
 * Ülke listesi: repodaki world-countries paketi (independent === true, 194 ülke).
 * Rehberli şehirler: sitenin kendi rehber kayıtları (src/content/guides) ve
 * eşleştirme kuralı (src/features/distance-game/guideMatch.ts).
 *
 * Çalıştırma (paket package.json'a EKLENMEZ, çıktı dosyası commit'lenir). Betik
 * TypeScript modüllerini içe aktardığı için node değil tsx ile çalışır:
 *   npm i --no-save --no-package-lock all-the-cities@3.1.0
 *   npx tsx scripts/gen-world-cities.mjs
 * (Paketi başka bir klasöre kurduysan: NODE_PATH=<klasör>/node_modules npx tsx ...)
 *
 * Seçim algoritması (sırayla):
 *   1. Her bağımsız ülkenin başkenti (featureCode "PPLC"). GeoNames'te PPLC'si
 *      olmayan ülkede (İsrail) world-countries'in `capital` alanındaki ad
 *      kullanılır; repodaki src/data/countries.ts de aynı kaynağı kullanıyor.
 *   2. Nüfusu >= 100.000 olan şehirler, nüfusa göre azalan sırada. Aynı
 *      ülkede, daha önce seçilmiş bir şehre 30 km'den yakınsa atlanır
 *      (ilçe/mahalle tekrarını önler: Ankara - Çankaya). Nüfusu >= 1.000.000
 *      olan şehir için bu yarıçap 25 km: gerçekten ayrı büyük şehirler
 *      (Incheon-Seul 27 km, Yokohama-Tokyo 29 km, Kobe-Osaka 29 km) yakın
 *      komşu yüzünden kaybolmasın; daha yakın olanlar (Brooklyn, Giza, Quezon
 *      City, Soweto gibi aynı kentsel alanın ilçeleri) elenmeye devam eder.
 *   3. SİTENİN REHBERİ OLAN şehirler, nüfusu ne olursa olsun ve yakınlığa
 *      bakılmaksızın (rehberli şehir = her zaman veride; oyunda da her zaman A
 *      kademesi). Rehber kaydıyla GeoNames kaydı aynı ülkede ad üzerinden
 *      eşleşir (guideMatch.ts); bölge/ada/milli park gibi şehir olmayan rehber
 *      kayıtlarının GeoNames karşılığı yoktur ve atlanır.
 *   4. Şehri 5'ten az kalan ülkeler, o ülkenin en kalabalık şehirleriyle
 *      (yine 30 km kuralıyla) 5'e tamamlanır. Çok küçük ülkelerde 5'e
 *      ulaşılamaz (Vatikan, Monako, Nauru...); orada kaç şehir varsa o.
 *
 * Sapmalar (kullanıcının ilk denemesinden):
 *   - "Bir yerleşimin bölümü" (PPLX), terk edilmiş (PPLQ), tarihî (PPLH),
 *     yok olmuş (PPLW) kayıtlar dışarıda tutulur. Yoksa Musul yerine onun
 *     bir semti ("Al Mawşil al Jadīdah"), Theni yerine "Teni" gibi adlar
 *     soru olarak çıkıyordu.
 *   - Aynı (ad + ülke) iki kez geçerse nüfusu küçük olan atlanır; oyunda
 *     aynı adlı iki yer belirsiz soru olurdu.
 *   - NAME_FIXES: GeoNames'te eskimiş ya da gösterimi bozuk birkaç ad.
 *   - Transliterasyon işaretleri (macron, nokta altı/üstü) atılır: Rājkot → Rajkot.
 *   - EXCLUDED_IDS: yanlış ya da oyun için uygunsuz birkaç kayıt (gerekçeleri aşağıda).
 *
 * Çıktı: kompakt dizi satırları
 *   [ad, ülkeKodu(ISO2), enlem(2 ondalık), boylam(2 ondalık), nüfus(bin), başkentMi(0|1)]
 * Sıralama deterministik: ülke kodu, nüfus (azalan), ad.
 */
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import worldCountries from "world-countries";
import { allCountries, guideFor } from "../src/content/guides/index.ts";
import { placeName } from "../src/content/localized.ts";
import { GUIDE_ALIASES, GUIDE_SKIP, guideMatchesName } from "../src/features/distance-game/guideMatch.ts";

const require = createRequire(import.meta.url);
let allTheCities;
try {
  allTheCities = require("all-the-cities");
} catch {
  console.error(
    "all-the-cities bulunamadı. Önce şunu çalıştırın:\n  npm i --no-save --no-package-lock all-the-cities@3.1.0"
  );
  process.exit(1);
}

const OUT = fileURLToPath(new URL("../src/data/worldCities.json", import.meta.url));

const MIN_POPULATION = 100_000;
const MIN_PER_COUNTRY = 5;
const DUPLICATE_KM = 30;
/** Nüfusu bu sayıda ya da fazla olan şehir için daha dar yakınlık yarıçapı. */
const BIG_POPULATION = 1_000_000;
const BIG_DUPLICATE_KM = 25;
/** Başkent kaydının 5 km içinde en az 3 kat kalabalık (ve >= 100 bin) bir kayıt varsa aynı kentsel alandır (aşağıda). */
const CAPITAL_MERGE_KM = 5;
const EARTH_RADIUS_KM = 6371;

/** Bağımsız bir yerleşim değil: semt/bölüm, terk edilmiş, tarihî, yok olmuş. */
const EXCLUDED_FEATURES = new Set(["PPLX", "PPLQ", "PPLH", "PPLW", "PPLCH"]);

/**
 * GeoNames adı → oyunda görünecek ad. Yalnız kesin düzeltmeler:
 *   - Kazakistan başkentinin adı 2022'de Astana'ya döndü; veri hâlâ Nur-Sultan diyor.
 *   - Mikronezya başkenti kaydı "Palikir - National Government Center".
 */
const NAME_FIXES = {
  "KZ:Nur-Sultan": "Astana",
  "FM:Palikir - National Government Center": "Palikir",
  // "Şehir"/"City" eki ad olarak kalmış kayıtlar.
  "CN:Zhu Cheng City": "Zhucheng",
  "CN:Changshu City": "Changshu",
  "ID:City of Balikpapan": "Balikpapan",
  // GeoNames'in resmî/uzun adı; bilinen ad (rehberlerle de bu yazım eşleşir).
  "JP:Nara-shi": "Nara",
  "TH:Phra Nakhon Si Ayutthaya": "Ayutthaya",
  "MA:Chefchaouene": "Chefchaouen",
  "AR:San Carlos de Bariloche": "Bariloche",
  "SY:Ḩamāh": "Hama",
  // Japonca/Korece "şehir" son eki ad olarak kalmış kayıtlar.
  "JP:Fukui-shi": "Fukui",
  "JP:Kashihara-shi": "Kashihara",
  "KR:Cheongju-si": "Cheongju",
  "KR:Icheon-si": "Icheon",
  // Bilinen İngilizce yazım / aksan bozukluğu.
  "GR:Ródos": "Rhodes",
  "VN:Hội An": "Hoi An",
};

/**
 * GeoNames'te yanlış ya da oyun için uygunsuz olan kayıtlar (cityId).
 *   1270926   Gorakhpur (Haryana): bir köy 1,3 milyon nüfuslu görünüyor; gerçek
 *             Gorakhpur Uttar Pradesh'te (1270927, ~674 bin). Ad çakışma kuralı
 *             büyük olanı tutacağı için yanlış konum oyuna girerdi.
 *   10630176  Pasragad Branch (IR): şehir değil, bir banka şubesi kaydı.
 *   1723510   Budta, 1978681 Malingao (PH), 1917790 Dadonghai (CN, Sanya'da bir
 *             plaj): şehir değil, nüfusları şişkin; yakınındaki gerçek şehrin
 *             (Cotabato, Sanya) önüne geçiyordu.
 *   1802875   Guankou, 1809412 Guli, 2035513 Panshan, 1798422 Puyang
 *             Chengguanzhen (CN), 1261162 Nowrangapur (IN): ilçe/kasaba kayıtları
 *             ilçenin tüm nüfusuyla geliyor ve tanınan şehir sayılıyordu.
 *   1787824   Tongshan (CN) ve 23814 Kahrīz (IR): Xuzhou ve Kermanshah'ın semt
 *             adları; 30 km kuralıyla asıl şehirlerin yerine geçiyorlardı.
 */
const EXCLUDED_IDS = new Set([
  1270926, 10630176, 1723510, 1978681, 1917790, 1802875, 1809412, 2035513, 1798422, 1261162, 1787824, 23814,
]);

const independent = worldCountries.filter((c) => c.independent === true);
const independentCodes = new Set(independent.map((c) => c.cca2));

const rad = (d) => (d * Math.PI) / 180;
function km(a, b) {
  const [lng1, lat1] = a.loc.coordinates;
  const [lng2, lat2] = b.loc.coordinates;
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

const norm = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const pool = allTheCities.filter(
  (c) => independentCodes.has(c.country) && !EXCLUDED_FEATURES.has(c.featureCode) && !EXCLUDED_IDS.has(c.cityId)
);
// Aynı nüfusta kararlı olması için: nüfus azalan, sonra cityId.
const byPopulation = [...pool].sort((a, b) => b.population - a.population || a.cityId - b.cityId);

const selected = [];
const chosenIds = new Set();
const capitalIds = new Set();
const perCountry = new Map();
const names = new Set();

/**
 * Arapça/Hint yazısından gelen transliterasyon işaretleri (macron, nokta altı/üstü):
 * "Rājkot", "Sūrat", "Al Aḩmadī". İngilizcede ve oyunda yaygın yazım işaretsizdir
 * (Rajkot, Surat, Al Ahmadi). Başka ek işaretler (Köln, São Paulo, Kraków,
 * Timişoara) yerel yazım olarak korunur; Türkiye'de İ harfi nokta üstü işaret
 * taşıdığı için TR hiç dokunulmaz.
 */
const TRANSLITERATION_MARKS = /[\u0304\u0323\u0307\u0331]/g;
/** Arapça/Farsça h ve z harflerindeki sedil: "Ḩamah", "Al Ḩillah", "Naz̧arabad" (Romence ş/ţ sedili korunur). */
const ARABIC_CEDILLA = /([HhZz])\u0327/g;
const cleanName = (c) =>
  c.country === "TR"
    ? c.name
    : c.name.normalize("NFD").replace(TRANSLITERATION_MARKS, "").replace(ARABIC_CEDILLA, "$1").normalize("NFC");

const displayName = (c) => NAME_FIXES[`${c.country}:${c.name}`] ?? cleanName(c);
const duplicateRadius = (c) => (c.population >= BIG_POPULATION ? BIG_DUPLICATE_KM : DUPLICATE_KM);
const tooClose = (c) => (perCountry.get(c.country) ?? []).some((s) => km(s, c) < duplicateRadius(c));
const nameTaken = (c) => names.has(`${c.country}:${displayName(c)}`);
function take(c, isCapital = false) {
  selected.push(c);
  chosenIds.add(c.cityId);
  if (isCapital) capitalIds.add(c.cityId);
  if (!perCountry.has(c.country)) perCountry.set(c.country, []);
  perCountry.get(c.country).push(c);
  names.add(`${c.country}:${displayName(c)}`);
}

/* 1) Başkentler */
const capitalLog = [];
for (const country of independent) {
  const code = country.cca2;
  let capital = byPopulation.find((c) => c.country === code && c.featureCode === "PPLC");
  if (!capital) {
    // GeoNames'te PPLC yok: world-countries'in başkent adıyla eşleştir.
    const wanted = country.capital.map(norm);
    capital = byPopulation.find((c) => c.country === code && wanted.includes(norm(c.name)));
    if (capital) capitalLog.push(`${code}: PPLC yok, world-countries başkenti kullanıldı -> ${capital.name}`);
  }
  if (!capital) {
    console.error(`HATA: ${code} (${country.name.common}) için başkent bulunamadı`);
    process.exit(1);
  }
  take(capital, true);
}

/*
 * Başkent kaydı yalnız yönetim çekirdeğini kapsıyorsa (Yeni Delhi 318 bin; metropol
 * "Delhi" 10,9 milyon ve 2 km ötede) başkent satırı o bölgenin nüfusunu alır:
 * yoksa Hindistan'ın başkenti hiçbir yerde "tanınan şehir" sayılmazdı. Yalnızca
 * 5 km içindeki, en az 3 kat kalabalık (ve >= 100 bin) kayıtlar için; başkentin adı ve konumu değişmez.
 */
const populationOverride = new Map();
const mergeLog = [];
for (const c of selected) {
  const bigger = byPopulation.find(
    (r) =>
      r.country === c.country &&
      r.population >= Math.max(MIN_POPULATION, 3 * c.population) &&
      r.cityId !== c.cityId &&
      km(r, c) < CAPITAL_MERGE_KM
  );
  if (bigger) {
    populationOverride.set(c.cityId, bigger.population);
    mergeLog.push(`${c.country}:${displayName(c)} ${Math.round(c.population / 1000)} bin -> ${Math.round(bigger.population / 1000)} bin (${bigger.name}, ${km(bigger, c).toFixed(0)} km)`);
  }
}

/* 2) Nüfusu >= 100.000 olanlar */
for (const c of byPopulation) {
  if (c.population < MIN_POPULATION) break;
  if (chosenIds.has(c.cityId) || tooClose(c) || nameTaken(c)) continue;
  take(c);
}

/* 3) Sitenin rehberi olan şehirler: nüfus ve yakınlık aranmaz */
const guidedLog = [];
const guidedSkipped = [];
for (const country of allCountries) {
  const code = country.code;
  for (const guideCity of country.cities) {
    if (!guideFor(code, guideCity.name)) continue;
    if (GUIDE_SKIP.has(`${code}:${guideCity.name}`)) {
      guidedSkipped.push(`${code}:${guideCity.name} (GUIDE_SKIP)`);
      continue;
    }
    const alias = Object.entries(GUIDE_ALIASES).find(([key, a]) => key.startsWith(`${code}:`) && a.guide === guideCity.name);
    const english = placeName(guideCity.name, "en");
    const candidates = byPopulation.filter((c) =>
      c.country === code &&
      (alias
        ? displayName(c) === alias[0].slice(3)
        : guideMatchesName(code, displayName(c), guideCity.name, english))
    );
    const record = candidates[0];
    if (!record) {
      guidedSkipped.push(`${code}:${guideCity.name} (GeoNames kaydı yok: bölge/ada/küçük yer)`);
      continue;
    }
    if (chosenIds.has(record.cityId)) continue;
    if (nameTaken(record)) continue;
    take(record);
    guidedLog.push(`${code}:${displayName(record)} (${Math.round(record.population / 1000)} bin) <- rehber "${guideCity.name}"`);
  }
}

/* 4) Şehri 5'ten az kalan ülkeleri tamamla */
for (const country of independent) {
  const code = country.cca2;
  for (const c of byPopulation) {
    if ((perCountry.get(code)?.length ?? 0) >= MIN_PER_COUNTRY) break;
    if (c.country !== code || chosenIds.has(c.cityId) || tooClose(c) || nameTaken(c)) continue;
    take(c);
  }
}

const rows = selected
  .map((c) => [
    displayName(c),
    c.country,
    Math.round(c.loc.coordinates[1] * 100) / 100,
    Math.round(c.loc.coordinates[0] * 100) / 100,
    Math.round((populationOverride.get(c.cityId) ?? c.population) / 1000),
    capitalIds.has(c.cityId) ? 1 : 0,
  ])
  .sort((a, b) => (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : b[4] - a[4] || (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0)));

writeFileSync(OUT, `[\n${rows.map((r) => JSON.stringify(r)).join(",\n")}\n]\n`);

const countryCount = new Set(rows.map((r) => r[1])).size;
console.log(`${rows.length} şehir, ${countryCount} ülke, ${rows.filter((r) => r[5]).length} başkent -> ${OUT}`);
for (const line of capitalLog) console.log(`  ${line}`);
if (process.env.VERBOSE) {
  console.log(`\nbaşkent satırı komşu kaydın nüfusunu aldı (${mergeLog.length}):`);
  for (const line of mergeLog) console.log(`  ${line}`);
  const bigLost = byPopulation.filter((c) => c.population >= BIG_POPULATION && !chosenIds.has(c.cityId));
  console.log(`\n>= 1 milyon olup veriye alınmayanlar (${bigLost.length}); hepsi bir komşunun ${BIG_DUPLICATE_KM} km içinde:`);
  for (const c of bigLost) {
    const near = (perCountry.get(c.country) ?? [])
      .filter((x) => x.population >= c.population || capitalIds.has(x.cityId))
      .map((x) => [x, km(x, c)])
      .filter(([, d]) => d < BIG_DUPLICATE_KM)
      .sort((a, b) => a[1] - b[1])[0];
    console.log(
      `  ${c.country}:${displayName(c)} (${Math.round(c.population / 1000)} bin, ${c.featureCode})` +
        (near ? ` <- ${displayName(near[0])} ${near[1].toFixed(0)} km` : " <- NEDEN? (yakın komşu yok)")
    );
  }
  console.log(`\nrehberli şehir olarak eklenen/doğrulanan (${guidedLog.length}):`);
  for (const line of guidedLog) console.log(`  ${line}`);
  console.log(`\nveriye alınmayan rehber kayıtları (${guidedSkipped.length}):`);
  for (const line of guidedSkipped) console.log(`  ${line}`);
}
