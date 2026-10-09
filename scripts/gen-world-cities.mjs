/**
 * "Kaç kilometre?" oyununun şehir verisini üretir: src/data/worldCities.json
 *
 * Kaynak: all-the-cities 3.1.0 (MIT; GeoNames tabanlı, GeoNames verisi CC BY 4.0)
 * Ülke listesi: repodaki world-countries paketi (independent === true, 194 ülke).
 *
 * Çalıştırma (paket package.json'a EKLENMEZ, çıktı dosyası commit'lenir):
 *   npm i --no-save --no-package-lock all-the-cities@3.1.0
 *   node scripts/gen-world-cities.mjs
 *
 * Seçim algoritması:
 *   1. Her bağımsız ülkenin başkenti (featureCode "PPLC"). GeoNames'te PPLC'si
 *      olmayan ülkede (İsrail) world-countries'in `capital` alanındaki ad
 *      kullanılır; repodaki src/data/countries.ts de aynı kaynağı kullanıyor.
 *   2. Nüfusu >= 100.000 olan şehirler, nüfusa göre azalan sırada. Aynı
 *      ülkede, daha önce seçilmiş bir şehre 30 km'den yakınsa atlanır
 *      (ilçe/mahalle tekrarını önler: Ankara - Çankaya).
 *   3. Şehri 5'ten az kalan ülkeler, o ülkenin en kalabalık şehirleriyle
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
const cleanName = (c) =>
  c.country === "TR" ? c.name : c.name.normalize("NFD").replace(TRANSLITERATION_MARKS, "").normalize("NFC");

const displayName = (c) => NAME_FIXES[`${c.country}:${c.name}`] ?? cleanName(c);
const tooClose = (c) => (perCountry.get(c.country) ?? []).some((s) => km(s, c) < DUPLICATE_KM);
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

/* 2) Nüfusu >= 100.000 olanlar */
for (const c of byPopulation) {
  if (c.population < MIN_POPULATION) break;
  if (chosenIds.has(c.cityId) || tooClose(c) || nameTaken(c)) continue;
  take(c);
}

/* 3) Şehri 5'ten az kalan ülkeleri tamamla */
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
    Math.round(c.population / 1000),
    capitalIds.has(c.cityId) ? 1 : 0,
  ])
  .sort((a, b) => (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : b[4] - a[4] || (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0)));

writeFileSync(OUT, `[\n${rows.map((r) => JSON.stringify(r)).join(",\n")}\n]\n`);

const countryCount = new Set(rows.map((r) => r[1])).size;
console.log(`${rows.length} şehir, ${countryCount} ülke, ${rows.filter((r) => r[5]).length} başkent -> ${OUT}`);
for (const line of capitalLog) console.log(`  ${line}`);
