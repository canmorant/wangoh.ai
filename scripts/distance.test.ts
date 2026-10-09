/**
 * "Kaç kilometre?" oyunu — haversine, puanlama, kaydırıcı, şehir verisi,
 * soru seçici, durum makinesi ve rehber bağlantıları.
 * Run:  npx tsx scripts/distance.test.ts
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import worldCountries from "world-countries";
import { haversineKm, EARTH_RADIUS_KM } from "../src/features/distance-game/haversine";
import {
  scoreFromError, scoreGuess, errorRatio, verdictFor,
  MAX_ROUND_SCORE, FULL_SCORE_ERROR, MIN_GUESS_KM, MAX_GUESS_KM, ROUNDS_PER_GAME,
} from "../src/features/distance-game/scoring";
import {
  kmFromPosition, positionFromKm, roundKm, stepPosition, SLIDER_STEPS, START_POSITION,
} from "../src/features/distance-game/slider";
import {
  CITIES, cityKey, isEligible, isTierA, isTierB, type City,
  FAMOUS_CAPITAL_POP_K, FAMOUS_POP_K, KNOWN_POP_K, RELAXED_POP_K,
} from "../src/features/distance-game/cities";
import {
  pickRounds, makeRng, bucketOf, MIN_QUESTION_KM, SHORT_MAX_KM, MID_MAX_KM,
} from "../src/features/distance-game/pickRounds";
import { reducer, INITIAL_STATE, type State } from "../src/features/distance-game/gameReducer";
import { TR_CITY_NAMES, cityDisplayName } from "../src/data/worldCityNames";
import { guideLinks, guideNames, countryNamesFor } from "../src/features/distance-game/serverData";
import { allCountries, citySlug, countrySlug, guideFor } from "../src/content/guides";
import { localizePath, internalPath } from "../src/i18n/paths";
import { LOCALES } from "../src/i18n/routing";

let pass = 0;
let fail = 0;
const ok = (n: string, c: boolean, d = "") => {
  if (c) pass++;
  else fail++;
  if (!c || process.env.VERBOSE) console.log(`${c ? "  PASS" : "  FAIL"}  ${n}${d ? `  — ${d}` : ""}`);
};
const near = (value: number, expected: number, tolerance: number) => Math.abs(value - expected) <= tolerance;

console.log("\nKAÇ KİLOMETRE?\n" + "=".repeat(64));

/* ----------------------------- haversine ----------------------------- */
{
  const LONDON = [51.5074, -0.1278] as const;
  const NEW_YORK = [40.7128, -74.006] as const;
  const ISTANBUL = [41.0082, 28.9784] as const;
  const SYDNEY = [-33.8688, 151.2093] as const;

  const lny = haversineKm(...LONDON, ...NEW_YORK);
  ok("Londra–New York ≈ 5.570 km (±30)", near(lny, 5570, 30), lny.toFixed(1));
  const ist = haversineKm(...ISTANBUL, ...LONDON);
  ok("İstanbul–Londra ≈ 2.500 km (±50)", near(ist, 2500, 50), ist.toFixed(1));
  const syd = haversineKm(...SYDNEY, ...LONDON);
  ok("Sydney–Londra ≈ 17.000 km (±100)", near(syd, 17000, 100), syd.toFixed(1));
  ok("aynı nokta = 0", haversineKm(...LONDON, ...LONDON) === 0);
  const antipode = haversineKm(0, 0, 0, 180);
  ok("antipod ≈ 20.015 km", near(antipode, 20015, 1), antipode.toFixed(2));
  ok("antipod = π·R", near(antipode, Math.PI * EARTH_RADIUS_KM, 1e-6));
  ok("kutuplar arası = π·R", near(haversineKm(90, 0, -90, 0), Math.PI * EARTH_RADIUS_KM, 1e-6));
  ok("simetrik", haversineKm(...LONDON, ...SYDNEY) === haversineKm(...SYDNEY, ...LONDON));
  ok("tarih değiştirme çizgisini doğru geçer", near(haversineKm(0, 179.5, 0, -179.5), (111.19), 0.5));
  ok("yarıçap 6371 km", EARTH_RADIUS_KM === 6371);
}

/* ------------------------------ puanlama ------------------------------ */
{
  ok("e = 0 → 1000", scoreFromError(0) === 1000);
  ok("tam isabet → 1000", scoreGuess(1234, 1234).score === 1000);
  ok("e = %2 (sınır) → 1000", scoreFromError(FULL_SCORE_ERROR) === 1000);
  ok("1000 km, tahmin 1020 (e = %2 tam) → 1000", scoreGuess(1020, 1000).score === 1000);
  ok("3000 km, tahmin 2940 (e = %2) → 1000", scoreGuess(2940, 3000).score === 1000);
  ok("e = %1 → 1000", scoreFromError(0.01) === 1000);
  ok("e hemen %2'nin üstünde → 1000'in altında", scoreFromError(0.0201) < 1000 && scoreFromError(0.0201) === 960);
  ok("e = %10 → 810", scoreFromError(0.1) === 810);
  ok("e = %50 → 250", scoreFromError(0.5) === 250);
  ok("e = 1 → 0", scoreFromError(1) === 0);
  ok("e = 3 → 0", scoreFromError(3) === 0);
  ok("e = ∞ → 0", scoreFromError(Infinity) === 0);
  ok("e = NaN → 0", scoreFromError(NaN) === 0);

  let monotone = true;
  let prev = Infinity;
  for (let i = 0; i <= 2000; i++) {
    const s = scoreFromError(i / 1000);
    if (s > prev) monotone = false;
    prev = s;
  }
  ok("e arttıkça puan asla artmaz (0 … %200)", monotone);

  let strict = true;
  for (let e = 0.02; e < 0.95; e += 0.01) if (!(scoreFromError(e + 0.01) < scoreFromError(e))) strict = false;
  ok("%2'den sonra kesin azalan", strict);

  let inRange = true;
  for (let i = 0; i <= 1500; i++) {
    const s = scoreFromError(i / 1000);
    if (!Number.isInteger(s) || s < 0 || s > MAX_ROUND_SCORE) inRange = false;
  }
  ok("puan 0–1000 arası tam sayı", inRange);

  ok("hata oranı: |tahmin − gerçek| / gerçek", errorRatio(900, 1000) === 0.1 && errorRatio(1100, 1000) === 0.1);
  ok("fazla ve eksik tahmin aynı oranda cezalanır", scoreGuess(900, 1000).score === scoreGuess(1100, 1000).score);
  ok("gerçek 0 ise bölme hatası yok", errorRatio(0, 0) === 0 && errorRatio(5, 0) === Infinity);
  ok("10 tur × 1000 = 10.000 üst sınır", ROUNDS_PER_GAME * MAX_ROUND_SCORE === 10000);

  ok("yorum eşikleri azalan puanla ilerler", verdictFor(1000) === "perfect" && verdictFor(900) === "great" && verdictFor(600) === "good" && verdictFor(300) === "fair" && verdictFor(0) === "far");
}

/* ------------------------- logaritmik kaydırıcı ------------------------- */
{
  ok("aralık 10 – 20.000 km", MIN_GUESS_KM === 10 && MAX_GUESS_KM === 20000);
  ok("konum 0 → 10 km", kmFromPosition(0) === 10);
  ok("konum 1000 → 20.000 km", kmFromPosition(SLIDER_STEPS) === 20000);
  ok("orta konum = geometrik orta (≈447 km)", near(kmFromPosition(500), Math.sqrt(10 * 20000), 1), String(kmFromPosition(500)));
  ok("başlangıç konumu orta", START_POSITION === 500);

  let monotone = true;
  for (let p = 1; p <= SLIDER_STEPS; p++) if (kmFromPosition(p) < kmFromPosition(p - 1)) monotone = false;
  ok("konum arttıkça km azalmaz", monotone);

  // Logaritmik: eşit konum farkı = eşit ORAN (yuvarlama payıyla).
  const ratios = [300, 400, 500, 600].map((p) => kmFromPosition(p + 200) / kmFromPosition(p));
  const expected = 2000 ** 0.2;
  ok("eşit konum farkı eşit oran verir (×2000^0,2)", ratios.every((r) => near(r, expected, expected * 0.01)), ratios.map((r) => r.toFixed(3)).join(", "));
  ok("her büyüklük mertebesi aynı genişlikte (10→100→1000)", near(positionFromKm(100) - positionFromKm(10), positionFromKm(1000) - positionFromKm(100), 1e-6));
  ok("positionFromKm ↔ kmFromPosition tutarlı", [10, 55, 447, 1234, 5570, 12000, 20000].every((km) => near(kmFromPosition(positionFromKm(km)), km, km * 0.006 + 1)));

  ok("yuvarlama: 3 anlamlı basamak, en az 1 km", roundKm(5573) === 5570 && roundKm(447.2) === 447 && roundKm(12.4) === 12 && roundKm(15380) === 15400 && roundKm(10) === 10);

  // Ok tuşu / düğme: her adımda gösterilen değer GERÇEKTEN değişir, yön doğru.
  let stuck = 0;
  let wrongWay = 0;
  let p = 0;
  let steps = 0;
  while (p < SLIDER_STEPS && steps < 5000) {
    const next = stepPosition(p, 1);
    if (kmFromPosition(next) === kmFromPosition(p) && next < SLIDER_STEPS) stuck++;
    if (next < p) wrongWay++;
    if (next === p) break;
    p = next;
    steps++;
  }
  ok("+ adımı baştan sona her seferinde değeri değiştirir", stuck === 0 && wrongWay === 0 && p === SLIDER_STEPS, `${steps} adım, ${stuck} takılma`);
  let back = SLIDER_STEPS;
  let stuckBack = 0;
  let stepsBack = 0;
  while (back > 0 && stepsBack < 5000) {
    const next = stepPosition(back, -1);
    if (kmFromPosition(next) === kmFromPosition(back) && next > 0) stuckBack++;
    if (next === back) break;
    back = next;
    stepsBack++;
  }
  ok("− adımı sondan başa her seferinde değeri değiştirir", stuckBack === 0 && back === 0, `${stepsBack} adım`);
  ok("uçlarda taşmaz", stepPosition(SLIDER_STEPS, 1) === SLIDER_STEPS && stepPosition(0, -1) === 0);
  ok("bir adım ≈ %1 civarı ince (500 → komşu değer)", (kmFromPosition(stepPosition(500, 1)) / kmFromPosition(500) - 1) < 0.02);
  ok("tüm aralık makul adım sayısında gezilir (200–1100)", steps >= 200 && steps <= 1100, String(steps));
}

/* --------------------------- şehir verisi --------------------------- */
const independent = worldCountries.filter((c) => c.independent === true).map((c) => c.cca2);
{
  const rawText = readFileSync(join(__dirname, "..", "src", "data", "worldCities.json"), "utf8");
  const rows = JSON.parse(rawText) as unknown[][];
  ok("veri bir dizi ve boş değil", Array.isArray(rows) && rows.length > 3000, `${rows.length} satır`);
  ok(
    "satır biçimi [ad, ISO2, enlem, boylam, nüfus(bin), başkent 0|1]",
    rows.every(
      (r) =>
        r.length === 6 &&
        typeof r[0] === "string" && (r[0] as string).trim().length > 0 &&
        typeof r[1] === "string" && /^[A-Z]{2}$/.test(r[1] as string) &&
        typeof r[2] === "number" && typeof r[3] === "number" &&
        Number.isInteger(r[4]) && (r[4] as number) >= 0 &&
        (r[5] === 0 || r[5] === 1)
    )
  );
  ok("enlem [-90, 90], boylam [-180, 180]", CITIES.every((c) => c.lat >= -90 && c.lat <= 90 && c.lng >= -180 && c.lng <= 180));
  ok(
    "koordinatlar en çok 2 ondalık",
    CITIES.every((c) => Math.abs(Math.round(c.lat * 100) / 100 - c.lat) < 1e-9 && Math.abs(Math.round(c.lng * 100) / 100 - c.lng) < 1e-9)
  );
  const keys = CITIES.map((c) => `${c.iso2}:${c.name}`);
  const dupes = keys.filter((k, i) => keys.indexOf(k) !== i);
  ok("yinelenen (ad + ülke) yok", dupes.length === 0, dupes.slice(0, 5).join(", "));

  const countries = new Set(CITIES.map((c) => c.iso2));
  ok("bağımsız ülke sayısı 194", independent.length === 194, String(independent.length));
  const missing = independent.filter((c) => !countries.has(c));
  ok("194 ülkenin hepsi veride", missing.length === 0, missing.join(", "));
  const extra = [...countries].filter((c) => !independent.includes(c));
  ok("bağımsız olmayan ülke yok", extra.length === 0, extra.join(", "));

  const capitalsPerCountry = new Map<string, number>();
  for (const c of CITIES) if (c.capital) capitalsPerCountry.set(c.iso2, (capitalsPerCountry.get(c.iso2) ?? 0) + 1);
  const noCapital = independent.filter((c) => !capitalsPerCountry.has(c));
  const manyCapitals = [...capitalsPerCountry].filter(([, n]) => n !== 1).map(([c]) => c);
  ok("her ülkenin başkenti işaretli", noCapital.length === 0, noCapital.join(", "));
  ok("her ülkede tam bir başkent", manyCapitals.length === 0, manyCapitals.join(", "));

  const sorted = rows.every((r, i) => {
    if (i === 0) return true;
    const p = rows[i - 1];
    if (p[1] !== r[1]) return (p[1] as string) < (r[1] as string);
    return (p[4] as number) >= (r[4] as number);
  });
  ok("sıralama deterministik: ülke kodu, sonra nüfus azalan", sorted);
  ok("kompakt biçim: satır başına bir dizi", rawText.split("\n").length === rows.length + 3 || rawText.split("\n").length === rows.length + 2);

  const perCountry = new Map<string, number>();
  for (const c of CITIES) perCountry.set(c.iso2, (perCountry.get(c.iso2) ?? 0) + 1);
  const tiny = [...perCountry].filter(([, n]) => n < 5).map(([c]) => c);
  ok("5'ten az şehri olanlar yalnız çok küçük ülkeler", tiny.length <= 30, `${tiny.length}: ${tiny.join(" ")}`);
  ok("Ankara'nın semti Çankaya yok (30 km kuralı)", !CITIES.some((c) => c.iso2 === "TR" && /ankaya/i.test(c.name)));
  ok("eski ad Nur-Sultan yerine Astana", CITIES.some((c) => c.iso2 === "KZ" && c.name === "Astana") && !CITIES.some((c) => c.name === "Nur-Sultan"));
  const bigDistricts = CITIES.filter((c) => /^(Al Mawşil al Jadīdah|Teni|Pasragad Branch|Dadonghai)$/.test(c.name));
  ok("bilinen bozuk kayıtlar elendi", bigDistricts.length === 0, bigDistricts.map((c) => c.name).join(", "));
  const gorakhpur = CITIES.filter((c) => c.name === "Gorakhpur");
  ok("Gorakhpur tek ve Uttar Pradesh'te", gorakhpur.length === 1 && near(gorakhpur[0].lat, 26.77, 0.1) && near(gorakhpur[0].lng, 83.37, 0.1));

  // Bilinen şehirlerin konumu makul (veri kayması için kaba bir nöbetçi).
  const at = (iso2: string, name: string) => CITIES.find((c) => c.iso2 === iso2 && c.name === name)!;
  const rome = at("IT", "Rome");
  const tokyo = at("JP", "Tokyo");
  const romeTokyo = haversineKm(rome.lat, rome.lng, tokyo.lat, tokyo.lng);
  ok("Roma–Tokyo ≈ 9.850 km (±100)", near(romeTokyo, 9850, 100), romeTokyo.toFixed(0));
  const ankara = at("TR", "Ankara");
  const istanbul = at("TR", "Istanbul");
  ok("Ankara–İstanbul ≈ 350 km (±30)", near(haversineKm(ankara.lat, ankara.lng, istanbul.lat, istanbul.lng), 350, 30));
  ok("Ankara başkent, İstanbul değil", ankara.capital && !istanbul.capital);
}

/* ----------------------- Türkçe şehir adları ----------------------- */
{
  const keys = new Set(CITIES.map((c) => `${c.iso2}:${c.name}`));
  const absent = Object.keys(TR_CITY_NAMES).filter((k) => !keys.has(k));
  ok("Türkçe tablodaki her anahtar veride var", absent.length === 0, absent.join(", "));
  const same = Object.entries(TR_CITY_NAMES).filter(([k, v]) => k.slice(3) === v);
  ok("tabloda veri adıyla aynı olan satır yok", same.length === 0, same.map(([k]) => k).join(", "));
  ok("Türkçe adlar boş değil", Object.values(TR_CITY_NAMES).every((v) => v.trim().length > 0));
  const capitals = CITIES.filter((c) => c.capital);
  ok("Türkçe adlar: Londra, Pekin, Moskova, Viyana, Münih (194 başkent var)",
    cityDisplayName("London", "GB", "tr") === "Londra" &&
    cityDisplayName("Beijing", "CN", "tr") === "Pekin" &&
    cityDisplayName("Moscow", "RU", "tr") === "Moskova" &&
    cityDisplayName("Vienna", "AT", "tr") === "Viyana" &&
    cityDisplayName("Munich", "DE", "tr") === "Münih" && capitals.length === 194);
  ok("tabloda olmayan şehir veri adıyla kalır", cityDisplayName("Paris", "FR", "tr") === "Paris");
  ok("en ve es'te veri adı kullanılır", cityDisplayName("London", "GB", "en") === "London" && cityDisplayName("London", "GB", "es") === "London");
  ok("tr: sitedeki ad (rehberi olan şehir) tablodan ve veri adından önce gelir",
    cityDisplayName("Ho Chi Minh City", "VN", "tr", "Ho Chi Minh Şehri") === "Ho Chi Minh Şehri" &&
    cityDisplayName("Munich", "DE", "tr", "Münchenx") === "Münchenx" &&
    cityDisplayName("Ho Chi Minh City", "VN", "tr") === "Ho Chi Minh City");
  ok("en ve es'te sitedeki Türkçe ad kullanılmaz (mevcut kural: veri adı)",
    cityDisplayName("Ho Chi Minh City", "VN", "en", "Ho Chi Minh Şehri") === "Ho Chi Minh City" &&
    cityDisplayName("Munich", "DE", "es", "Münih") === "Munich");
  ok("emin olunmayan adlar tabloda yok (Kyiv, Kraków, Mexico City)",
    !("UA:Kyiv" in TR_CITY_NAMES) && !("PL:Kraków" in TR_CITY_NAMES) && !("MX:Mexico City" in TR_CITY_NAMES));
}

/* ------------------------ A / B kademeleri ------------------------ */
// Sitenin rehberi olan şehirler (oyundaki "Bu şehrin rehberini oku" eşleşmesi): A'nın birinci kuralı.
const GUIDED = new Set(Object.keys(guideLinks()));
const TIER_A = CITIES.filter((c) => isTierA(c, GUIDED));
const TIER_B = CITIES.filter(isTierB);
{
  const mk = (over: Partial<City>): City => ({ id: -1, name: "X", iso2: "ZZ", lat: 0, lng: 0, popK: 0, capital: false, ...over });
  ok("eşikler: A başkent ≥ 1.000, A nüfus ≥ 2.000, B ≥ 500, uygunluk ≥ 100 (bin)",
    FAMOUS_CAPITAL_POP_K === 1000 && FAMOUS_POP_K === 2000 && KNOWN_POP_K === 500 && RELAXED_POP_K === 100);
  ok("A: nüfusu ≥ 2.000 bin (başkent olmasa da), 1.999 değil", isTierA(mk({ popK: 2000 })) && !isTierA(mk({ popK: 1999 })));
  ok("A: başkent ve nüfusu ≥ 1.000 bin; 999 değil", isTierA(mk({ capital: true, popK: 1000 })) && !isTierA(mk({ capital: true, popK: 999 })));
  const graz = new Set(["AT:Graz"]);
  ok("A: rehberi olan şehir (nüfusu küçük olsa da ≥ 100 bin); rehbersizse değil",
    isTierA(mk({ name: "Graz", iso2: "AT", popK: 222 }), graz) && !isTierA(mk({ name: "Graz", iso2: "AT", popK: 222 })));
  ok("A: rehberi olsa da nüfusu < 100 bin ve başkent değilse çıkmaz (isEligible kuralı aynen)",
    !isTierA(mk({ name: "Graz", iso2: "AT", popK: 99 }), graz) && isTierA(mk({ name: "Graz", iso2: "AT", popK: 100 }), graz));
  ok("A: rehberi olan küçük başkent A (Valletta)", isTierA(mk({ name: "Valletta", iso2: "MT", capital: true, popK: 7 }), new Set(["MT:Valletta"])));
  ok("rehber anahtarı ülke kodu + veri adı (başka ülkedeki aynı ad etkilenmez)",
    !isTierA(mk({ name: "Graz", iso2: "XX", popK: 222 }), graz) && cityKey({ iso2: "AT", name: "Graz" }) === "AT:Graz");
  ok("B (eski kural): başkent ya da nüfusu ≥ 500 bin", isTierB(mk({ capital: true, popK: 5 })) && isTierB(mk({ popK: 500 })) && !isTierB(mk({ popK: 499 })));
  ok("isEligible: başkent ya da ≥ 100 bin", isEligible(mk({ capital: true, popK: 1 })) && isEligible(mk({ popK: 100 })) && !isEligible(mk({ popK: 99 })));
  ok("rehberi olmayan şehirler hâlâ nüfus kurallarıyla A olur (rehber listesi boşken de)", isTierA(mk({ popK: 2500 })) && !isTierA(mk({ popK: 1200 })));

  // Gerçek oyunda sinir bozan şehirler A değil (Nelspruit, Gweru, Ta'izz, Ta'if, Pietermaritzburg, Santiago de los Caballeros, Porto-Novo).
  const find = (iso2: string, name: string) => CITIES.find((c) => c.iso2 === iso2 && c.name === name);
  const annoying = [["ZA", "Nelspruit"], ["ZW", "Gweru"], ["YE", "Ta‘izz"], ["SA", "Ta’if"], ["ZA", "Pietermaritzburg"], ["DO", "Santiago de los Caballeros"], ["BJ", "Porto-Novo"]].map(([i, n]) => find(i, n));
  ok("şikâyet edilen 7 şehir veride var ve hiçbiri A değil", annoying.every((c) => c !== undefined && !isTierA(c, GUIDED)), annoying.map((c) => c?.name).join(", "));
  ok("A büyük şehirler: Tokyo, Mumbai, Roma (rehber), Dubai (rehber), Kinshasa (başkent ≥ 1M)",
    ["JP:Tokyo", "IN:Mumbai", "IT:Rome", "AE:Dubai", "CD:Kinshasa"].every((k) => TIER_A.some((c) => cityKey(c) === k)));

  const countriesA = new Set(TIER_A.map((c) => c.iso2));
  const countriesAll = new Set(CITIES.map((c) => c.iso2));
  ok("A ⊂ uygun şehirler (nüfusu < 100 bin olan yalnız başkentse A)", TIER_A.every(isEligible));
  ok("rehberi olan her uygun şehir A'da", CITIES.filter((c) => GUIDED.has(cityKey(c)) && isEligible(c)).every((c) => TIER_A.includes(c)));
  ok("B'de olmayan A şehirleri yalnız rehberli 100–500 bin arası şehirler",
    TIER_A.filter((c) => !isTierB(c)).every((c) => GUIDED.has(cityKey(c)) && c.popK >= 100));
  ok("A kademesi geniş: ≥ 300 şehir ve ≥ 100 ülke", TIER_A.length >= 300 && countriesA.size >= 100, `${TIER_A.length} şehir, ${countriesA.size}/${countriesAll.size} ülke`);
  ok("A'nın tek ülkeyi doldurması yok: hiçbir ülkenin A şehir payı %15'i geçmez", Math.max(...[...countriesA].map((k) => TIER_A.filter((c) => c.iso2 === k).length)) / TIER_A.length <= 0.15);

  // Kovalar için yeterli A×A çifti var mı? (farklı ülke çiftleri ve aynı ülke kısa çiftleri)
  const pairs = { short: 0, mid: 0, long: 0 };
  const samePairs = { short: 0, mid: 0, long: 0 };
  const partnerless = { short: 0, mid: 0, long: 0 };
  const sameCountryShort = new Set<string>();
  for (const a of TIER_A) {
    const own = { short: 0, mid: 0, long: 0 };
    for (const b of TIER_A) {
      if (a.id === b.id) continue;
      const km = Math.round(haversineKm(a.lat, a.lng, b.lat, b.lng));
      if (km < MIN_QUESTION_KM) continue;
      const k = bucketOf(km);
      if (a.iso2 === b.iso2) {
        if (a.id < b.id) samePairs[k]++;
        if (k === "short") sameCountryShort.add(a.iso2);
      } else {
        if (a.id < b.id) pairs[k]++;
        own[k]++;
      }
    }
    for (const k of ["short", "mid", "long"] as const) if (own[k] === 0) partnerless[k]++;
  }
  ok("A×A farklı ülke çiftleri: kısa, orta, uzun kovaların her birinde ≥ 1.500 çift",
    Object.values(pairs).every((n) => n >= 1500), JSON.stringify(pairs));
  ok("A×A aynı ülke kısa çiftleri var (≥ 30 ülkede)", samePairs.short >= 300 && sameCountryShort.size >= 30, `${samePairs.short} çift, ${sameCountryShort.size} ülke`);
  ok("orta ve uzun kovada eşi olmayan A şehri yok; kısa kovada olanlar azınlıkta (< %20)",
    partnerless.mid === 0 && partnerless.long === 0 && partnerless.short < TIER_A.length * 0.2, JSON.stringify(partnerless));
  console.log(`  (bilgi) A: ${TIER_A.length} şehir / ${countriesA.size} ülke (B: ${TIER_B.length}); A×A farklı ülke çifti ${JSON.stringify(pairs)}, aynı ülke ${JSON.stringify(samePairs)}`);
}

/* ------------------------------ soru seçici ------------------------------ */
{
  const GAMES = 3000;
  const seeds = Array.from({ length: GAMES }, (_, i) => i + 1);
  const pick = (seed?: number, rounds?: number) => pickRounds({ seed, rounds, guided: GUIDED });
  const bothA = (r: { a: City; b: City }) => isTierA(r.a, GUIDED) && isTierA(r.b, GUIDED);
  const outsiderOk = (c: City) => isTierA(c, GUIDED) || isTierB(c);

  const a = pick(12345);
  const b = pick(12345);
  ok("aynı seed → aynı sorular", JSON.stringify(a) === JSON.stringify(b));
  ok("farklı seed → farklı sorular", JSON.stringify(pick(1)) !== JSON.stringify(pick(2)));
  ok("rehber listesi verilmezse de çalışır (yalnız nüfus kuralları)", pickRounds({ seed: 3 }).length === 10);
  ok("makeRng deterministik ve [0,1)", (() => {
    const r1 = makeRng(9);
    const r2 = makeRng(9);
    let same = true;
    for (let i = 0; i < 1000; i++) {
      const x = r1();
      if (x !== r2() || x < 0 || x >= 1) same = false;
    }
    return same;
  })());
  ok("10 tur", a.length === 10 && ROUNDS_PER_GAME === 10);

  let repeat = 0;
  let nonARounds = 0;
  let allRounds = 0;
  let badRelaxed = 0;
  let tooSmall = 0;
  let maxSame = 0;
  let sameTotal = 0;
  let badBucketCount = 0;
  let badBucket = 0;
  let tooShort = 0;
  let sameName = 0;
  let badKm = 0;
  let tooMany = 0;
  let looseGames = 0;
  let bothObscure = 0;
  const countryUse = new Map<string, number>();
  const cityUse = new Map<number, number>();
  const bucketTotals = { short: 0, mid: 0, long: 0 };
  const seenCountries = new Set<string>();

  for (const seed of seeds) {
    const rounds = pick(seed);
    const ids = rounds.flatMap((r) => [r.a.id, r.b.id]);
    if (new Set(ids).size !== ids.length) repeat++;
    const counts = { short: 0, mid: 0, long: 0 };
    let same = 0;
    let loose = 0;
    for (const r of rounds) {
      allRounds++;
      if (!bothA(r)) {
        nonARounds++;
        loose++;
        // A dışı tur: 'gevşek', iki şehir B, en çok bir ucu A dışı.
        if (!r.relaxed || !outsiderOk(r.a) || !outsiderOk(r.b)) badRelaxed++;
        if (!isTierA(r.a, GUIDED) && !isTierA(r.b, GUIDED)) bothObscure++;
      } else if (r.relaxed) {
        badRelaxed++; // gevşek tur A–A olamaz
      }
      for (const c of [r.a, r.b]) {
        if (c.popK < 100 && !c.capital) tooSmall++;
        countryUse.set(c.iso2, (countryUse.get(c.iso2) ?? 0) + 1);
        cityUse.set(c.id, (cityUse.get(c.id) ?? 0) + 1);
        seenCountries.add(c.iso2);
      }
      if (r.a.iso2 === r.b.iso2) same++;
      if (r.a.name === r.b.name) sameName++;
      const exact = Math.round(haversineKm(r.a.lat, r.a.lng, r.b.lat, r.b.lng));
      if (r.km !== exact) badKm++;
      if (r.km < MIN_QUESTION_KM) tooShort++;
      if (r.km > 20015) tooMany++;
      if (bucketOf(r.km) !== r.bucket) badBucket++;
      counts[r.bucket]++;
      bucketTotals[r.bucket]++;
    }
    sameTotal += same;
    maxSame = Math.max(maxSame, same);
    if (loose > 1) looseGames++;
    if (Object.values(counts).some((n) => n < 3 || n > 4)) badBucketCount++;
  }
  ok(`${GAMES} oyunda aynı şehir bir oturumda iki kez çıkmadı`, repeat === 0, `${repeat} oyunda tekrar`);
  ok("soruların ≥ %90'ında iki şehir de A kademesinden", nonARounds * 10 <= allRounds, `${(100 * (1 - nonARounds / allRounds)).toFixed(2)}% (${nonARounds}/${allRounds} A dışı)`);
  ok("her oyunda en çok 1 tur A dışı (10 turda %90)", looseGames === 0, `${looseGames} oyun`);
  ok("A dışı tur her zaman 'gevşek', iki şehir de B ya da A; gevşek tur hiç A–A değil", badRelaxed === 0, `${badRelaxed} hatalı`);
  ok("bir soruda iki şehir birden A dışı değil (en çok bir ucu görece az bilinir)", bothObscure === 0, `${bothObscure} soru`);
  ok("nüfusu < 100 bin olan yer yalnız başkentse çıkar", tooSmall === 0, `${tooSmall} ihlal`);
  ok("her oyunda aynı ülkeden en çok 1 soru", maxSame <= 1, `en çok ${maxSame}`);
  ok("aynı ülke soruları ≤ %10 (toplu)", sameTotal / allRounds <= 0.1, `${(100 * sameTotal / allRounds).toFixed(2)}%`);
  ok("aynı ülke soruları gerçekten de çıkıyor (> %1)", sameTotal / allRounds > 0.01, `${(100 * sameTotal / allRounds).toFixed(2)}%`);
  ok("her oyunda kovalar dengeli (3 / 3 / 4)", badBucketCount === 0, `${badBucketCount} oyun`);
  const share = (n: number) => n / allRounds;
  ok("toplu kova payları ≈ üçte bir (her biri %29–%38)", Object.values(bucketTotals).every((n) => share(n) > 0.29 && share(n) < 0.38), JSON.stringify(bucketTotals));
  ok("kova sınırları: kısa < 1000, orta 1000–5000, uzun > 5000", bucketOf(999) === "short" && bucketOf(1000) === "mid" && bucketOf(5000) === "mid" && bucketOf(5001) === "long" && SHORT_MAX_KM === 1000 && MID_MAX_KM === 5000);
  ok("kova etiketi gerçek mesafeyle uyumlu", badBucket === 0);
  ok(`mesafe ≥ ${MIN_QUESTION_KM} km (kaydırıcıda tahmin edilebilir)`, tooShort === 0, `${tooShort} ihlal`);
  ok("mesafe ≤ 20.015 km", tooMany === 0);
  ok("soru ekranındaki iki şehrin adı aynı değil", sameName === 0);
  ok("km = yuvarlanmış haversine", badKm === 0);

  const slots = allRounds * 2;
  const topCountry = Math.max(...countryUse.values()) / slots;
  ok("çeşitlilik: hiçbir ülke şehir yuvalarının %6'sından fazlasını almıyor", topCountry < 0.06, `en yüksek ${(100 * topCountry).toFixed(1)}%`);
  ok("çeşitlilik: 3000 oyunda ≥ 185 farklı ülke göründü", seenCountries.size >= 185, `${seenCountries.size} ülke`);
  ok("A kademesindeki her ülke göründü", [...new Set(TIER_A.map((c) => c.iso2))].every((k) => seenCountries.has(k)));
  ok("A kademesindeki her şehir 3000 oyunda en az bir kez çıktı", TIER_A.every((c) => cityUse.has(c.id)), TIER_A.filter((c) => !cityUse.has(c.id)).map((c) => c.name).join(", "));
  const topCities = [...cityUse].sort((x, y) => y[1] - x[1]).slice(0, 5);
  const topCityShare = topCities[0][1] / slots;
  ok("çeşitlilik: hiçbir şehir toplam yuvaların %1'inden fazlasını almıyor", topCityShare <= 0.01,
    topCities.map(([id, n]) => `${CITIES[id].name} ${(100 * n / slots).toFixed(2)}%`).join(", "));
  ok("A şehirlerinin en çok geçeni en az geçenin 60 katını aşmıyor (ağırlık dengesi)", (() => {
    const counts = TIER_A.map((c) => cityUse.get(c.id) ?? 0);
    return Math.max(...counts) / Math.max(1, Math.min(...counts)) <= 60;
  })(), `${Math.max(...TIER_A.map((c) => cityUse.get(c.id) ?? 0))} / ${Math.min(...TIER_A.map((c) => cityUse.get(c.id) ?? 0))}`);

  // Math.random yolu (seed yok).
  let randomOk = true;
  for (let i = 0; i < 300; i++) {
    const rounds = pickRounds({ guided: GUIDED });
    const ids = rounds.flatMap((r) => [r.a.id, r.b.id]);
    if (rounds.length !== 10 || new Set(ids).size !== 20) randomOk = false;
    const loose = rounds.filter((r) => !bothA(r)).length;
    if (loose > 1) randomOk = false;
  }
  ok("seed verilmezse (Math.random) de kurallar geçerli (300 oyun)", randomOk);

  // Başka tur sayıları patlamaz.
  ok("3, 7, 12, 20 turluk oyunlar kurulabilir", [3, 7, 12, 20].every((n) => pick(5, n).length === n));

  // Küçük havuzda (yalnız bir ülkenin şehirleri) sessizce yanlış sonuç vermez, hata fırlatır.
  let threw = false;
  try {
    pickRounds({ seed: 1, cities: CITIES.filter((c: City) => c.iso2 === "VA") });
  } catch {
    threw = true;
  }
  ok("uygun çift yoksa açık hata verir", threw);
}

/* --------------------------- durum makinesi --------------------------- */
{
  const rounds = pickRounds({ seed: 99 });
  let s: State = reducer(INITIAL_STATE, { type: "start", rounds });
  ok("start → oynama ekranı, ilk tur, orta konum", s.screen === "playing" && s.index === 0 && s.phase === "guessing" && s.position === START_POSITION && s.results.length === 0);

  s = reducer(s, { type: "next" });
  ok("tahminden önce 'sıradaki' etkisiz", s.phase === "guessing" && s.index === 0);

  s = reducer(s, { type: "position", position: 700 });
  ok("konum değişir", s.position === 700);
  const nudged = reducer(s, { type: "nudge", direction: 1 });
  ok("nudge konumu artırır", nudged.position > 700);

  s = reducer(s, { type: "submit" });
  const first = s.results[0];
  ok("tahmin sonucu kaydedilir", s.phase === "revealed" && s.results.length === 1 && first.guess === kmFromPosition(700) && first.round === rounds[0]);
  ok("puan formülden gelir", first.score === scoreGuess(first.guess, rounds[0].km).score && first.error === errorRatio(first.guess, rounds[0].km));

  const again = reducer(s, { type: "submit" });
  ok("çift tıklama ikinci sonuç eklemez", again.results.length === 1);
  ok("cevaptan sonra kaydırıcı kilitli", reducer(s, { type: "position", position: 10 }).position === 700 && reducer(s, { type: "nudge", direction: 1 }).position === 700);

  s = reducer(s, { type: "next" });
  ok("sıradaki tur: indeks +1, kaydırıcı sıfırlanır", s.index === 1 && s.phase === "guessing" && s.position === START_POSITION);

  for (let i = 1; i < rounds.length; i++) {
    s = reducer(s, { type: "submit" });
    s = reducer(s, { type: "next" });
  }
  ok("10 tur sonunda sonuç ekranı ve 10 sonuç", s.screen === "results" && s.results.length === 10);
  ok("sonuç ekranında tahmin/ilerleme etkisiz", reducer(s, { type: "submit" }) === s && reducer(s, { type: "next" }) === s);
  const restarted = reducer(s, { type: "start", rounds: pickRounds({ seed: 100 }) });
  ok("tekrar oyna: temiz başlangıç", restarted.screen === "playing" && restarted.results.length === 0 && restarted.index === 0);
  ok("toplam puan en çok 10.000", s.results.reduce((x, r) => x + r.score, 0) <= 10000);
}

/* ------------------------- rehber bağlantıları ------------------------- */
{
  const links = guideLinks();
  const entries = Object.entries(links);
  ok("rehberi olan şehirler eşleşti (≥ 150)", entries.length >= 150, `${entries.length} bağlantı`);
  const byCode = new Map(allCountries.map((c) => [c.code, c]));
  const cityKeys = new Set(CITIES.map((c) => `${c.iso2}:${c.name}`));
  const strayKeys = entries.filter(([k]) => !cityKeys.has(k));
  ok("her bağlantı anahtarı oyundaki bir şehir", strayKeys.length === 0, strayKeys.slice(0, 3).map(([k]) => k).join(", "));
  const wrongCountry = entries.filter(([k, href]) => !href.startsWith(`/${countrySlug(byCode.get(k.slice(0, 2))!)}/`));
  ok("bağlantı aynı ülkenin altında", wrongCountry.length === 0, wrongCountry.slice(0, 3).map(([k]) => k).join(", "));
  const broken = entries.filter(([k, href]) => {
    const country = byCode.get(k.slice(0, 2))!;
    return !country.cities.some((c) => `/${countrySlug(country)}/${citySlug(c)}` === href && guideFor(country.code, c.name));
  });
  ok("her bağlantı, rehberi yazılmış gerçek bir şehir sayfasına gider", broken.length === 0, broken.slice(0, 3).map(([k]) => k).join(", "));
  ok("örnekler: Münih, Roma, Tokyo, Londra",
    links["DE:Munich"] === "/almanya/munih" && links["IT:Rome"] === "/italya/roma" && links["JP:Tokyo"] === "/japonya/tokyo" && links["GB:London"] === "/birlesik-krallik/londra");
  ok("rehberi olmayan şehir bağlantı almaz (Kinshasa)", !("CD:Kinshasa" in links));
  for (const locale of ["en", "es"] as const) {
    const back = entries.filter(([, href]) => internalPath(localizePath(href, locale), locale) !== href);
    ok(`${locale}: bağlantılar yerelleştirilip geri çevrilebiliyor`, back.length === 0, back.slice(0, 3).map(([k]) => k).join(", "));
  }
  const linkedA = TIER_A.filter((c) => cityKey(c) in links).length;
  console.log(`  (bilgi) A kademesindeki ${TIER_A.length} şehirden ${linkedA} tanesinin rehberi var; toplam ${entries.length}/${CITIES.length}`);
  ok("A kademesinin rehber kuralı bu eşleşmeden gelir: guideNames ve guideLinks aynı anahtarlar",
    JSON.stringify(Object.keys(guideNames()).sort()) === JSON.stringify(Object.keys(links).sort()));
  const siteNames = guideNames();
  const badName = Object.entries(siteNames).filter(([k, name]) => !byCode.get(k.slice(0, 2))!.cities.some((c) => c.name === name));
  ok("guideNames: her ad rehberdeki gerçek şehir adı", badName.length === 0, badName.slice(0, 3).map(([k]) => k).join(", "));
  ok("guideNames örnekleri: Münih, Roma, Tokyo", siteNames["DE:Munich"] === "Münih" && siteNames["IT:Rome"] === "Roma" && siteNames["JP:Tokyo"] === "Tokyo");
  ok("rehberi olmayan şehir için site adı yok (Kinshasa)", !("CD:Kinshasa" in siteNames));
  const shownDiffers = TIER_A.filter((c) => cityKey(c) in siteNames && cityDisplayName(c.name, c.iso2, "tr", siteNames[cityKey(c)]) !== siteNames[cityKey(c)]);
  ok("Türkçe arayüzde rehberi olan her A şehri sitedeki adla görünür", shownDiffers.length === 0);
  const enShown = TIER_A.filter((c) => cityKey(c) in siteNames && (["en", "es"] as const).some((l) => cityDisplayName(c.name, c.iso2, l, siteNames[cityKey(c)]) !== c.name));
  ok("en ve es'te rehberi olan şehirler veri adıyla görünür", enShown.length === 0);

  for (const locale of LOCALES) {
    const names = countryNamesFor(locale);
    ok(`${locale}: 194 ülke adı, hiçbiri ISO koduna düşmedi`, Object.keys(names).length === 194 && Object.entries(names).every(([code, n]) => n && n !== code));
  }
  const tr = countryNamesFor("tr");
  const en = countryNamesFor("en");
  const es = countryNamesFor("es");
  ok("ülke adları: Almanya / Germany / Alemania", tr.DE === "Almanya" && en.DE === "Germany" && es.DE === "Alemania");
}

/* ------------------------------ mesajlar ------------------------------ */
{
  type Tree = { [key: string]: string | Tree };
  const load = (locale: string): Tree => JSON.parse(readFileSync(join(__dirname, "..", "messages", `${locale}.json`), "utf8"));
  const get = (tree: Tree, path: string) => path.split(".").reduce<string | Tree | undefined>((t, k) => (typeof t === "object" ? t[k] : undefined), tree);
  for (const locale of LOCALES) {
    const tree = load(locale);
    const title = get(tree, "Metadata.distance.title");
    const description = get(tree, "Metadata.distance.description");
    ok(`${locale}: Metadata.distance başlık ≤ 60`, typeof title === "string" && title.length > 0 && title.length <= 60, String(title?.length));
    ok(`${locale}: Metadata.distance açıklama 120–160 karakter`, typeof description === "string" && description.length >= 120 && description.length <= 160, String((description as string)?.length));
    ok(`${locale}: Nav.distance var`, typeof get(tree, "Nav.distance") === "string");
    ok(`${locale}: veri atfı GeoNames (CC BY 4.0) içeriyor`, /GeoNames<\/geo>/.test(String(get(tree, "DistanceGame.dataCredit"))) && /CC BY 4\.0/.test(String(get(tree, "DistanceGame.dataCredit"))));
  }
  ok("tr atıf satırı birebir 'Şehir verisi: GeoNames (CC BY 4.0)'", String(get(load("tr"), "DistanceGame.dataCredit")).replace(/<[^>]+>/g, "") === "Şehir verisi: GeoNames (CC BY 4.0)");
  ok("en atıf satırı 'City data: GeoNames (CC BY 4.0)'", String(get(load("en"), "DistanceGame.dataCredit")).replace(/<[^>]+>/g, "") === "City data: GeoNames (CC BY 4.0)");
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
