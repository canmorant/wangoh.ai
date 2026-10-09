/**
 * "Kaç kilometre?" oyunu — haversine, puanlama, kaydırıcı, şehir verisi,
 * soru seçici, durum makinesi ve rehber bağlantıları.
 * Run:  npx tsx scripts/distance.test.ts
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import worldCountries from "world-countries";
import { haversineKm, EARTH_RADIUS_KM } from "../src/features/distance-game/haversine";
import {
  scoreFromError, scoreGuess, errorRatio, verdictFor, emojiFor, emojiStrip,
  MAX_ROUND_SCORE, FULL_SCORE_ERROR, MIN_GUESS_KM, MAX_GUESS_KM, ROUNDS_PER_GAME,
} from "../src/features/distance-game/scoring";
import {
  kmFromPosition, positionFromKm, roundKm, stepPosition, SLIDER_STEPS, START_POSITION,
} from "../src/features/distance-game/slider";
import {
  CITIES, cityKey, isEligible, isStrong, isTierA, isTierB, type City,
  FAMOUS_CAPITAL_POP_K, FAMOUS_POP_K, KNOWN_POP_K, RELAXED_POP_K,
} from "../src/features/distance-game/cities";
import {
  pickRounds, makeRng, bucketOf, MIN_QUESTION_KM, SHORT_MAX_KM, MID_MAX_KM,
  MAX_PER_COUNTRY, MAX_WEAK_PER_GAME, MIN_SEPARATION_KM,
} from "../src/features/distance-game/pickRounds";
import { reducer, INITIAL_STATE, type State } from "../src/features/distance-game/gameReducer";
import { TR_CITY_NAMES, cityDisplayName } from "../src/data/worldCityNames";
import { guideLinks, guideNames, countryNamesFor } from "../src/features/distance-game/serverData";
import { GUIDE_ALIASES } from "../src/features/distance-game/guideMatch";
import { allCountries, citySlug, countrySlug, guideFor } from "../src/content/guides";
import {
  dateKeyOf, dailySeed, daysBetween, addDays, isDateKey, localDateFromKey, parseStats, recordGame, currentStreak, averageScore,
  EMPTY_STATS, DAILY_KEEP_DAYS, type Stats,
} from "../src/features/distance-game/daily";
import { shareText, shareUrl } from "../src/features/distance-game/share";
import { detentIndex, DETENTS_KM } from "../src/features/distance-game/feedback";
import {
  cameraEnds, guessCircle, kmToDegrees, placeLabels, pointAlong, estimateLabelWidth, midpoint, MIN_VIEW_KM, type LngLat,
} from "../src/features/distance-game/mapGeometry";
import { makeCamera, prepare, prepareIdle, MAP_WIDTH, MAP_HEIGHT } from "../src/features/distance-game/worldMap";
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

  // Büyük şehirler yakın komşu yüzünden kaybolmaz (üretici kuralı: >= 1 milyonda yarıçap 25 km).
  const has = (iso2: string, name: string) => CITIES.some((c) => c.iso2 === iso2 && c.name === name);
  ok("Incheon (2,6 milyon, Seul'e 27 km) veride", has("KR", "Incheon"));
  ok("Yokohama, Kobe (Tokyo ve Osaka'ya 29 km) ve Faridabad veride", has("JP", "Yokohama") && has("JP", "Kobe") && has("IN", "Faridabad"));
  const million = CITIES.filter((c) => c.popK >= 1000);
  let tooNear = "";
  for (let i = 0; i < million.length && !tooNear; i++) {
    for (let j = i + 1; j < million.length; j++) {
      const a = million[i];
      const b = million[j];
      if (a.iso2 === b.iso2 && haversineKm(a.lat, a.lng, b.lat, b.lng) < 25 && !a.capital && !b.capital) {
        tooNear = `${a.name}–${b.name}`;
        break;
      }
    }
  }
  ok("aynı ülkede iki >= 1 milyonluk şehir (başkent hariç) 25 km'den yakın değil (ilçe tekrarı yok)", tooNear === "", tooNear);
  ok("Delhi: başkent satırı Yeni Delhi, nüfusu metropolün (>= 10 milyon), A kademesine girer",
    (() => { const d = CITIES.find((c) => c.iso2 === "IN" && c.name === "New Delhi"); return !!d && d.capital && d.popK >= 10000; })());
  ok("bozuk ad kalıntıları temizlendi (Nara-shi, Fukui-shi, Hamāh, Ḩ harfleri)",
    !CITIES.some((c) => /-shi$|-si$/.test(c.name) || /[HhZz]\u0327/.test(c.name.normalize("NFD"))));

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
  ok("emin olunmayan adlar tabloda yok (Kyiv, Kraków, Mexico City, Jakarta, Ürümqi, Peshawar)",
    !("UA:Kyiv" in TR_CITY_NAMES) && !("PL:Kraków" in TR_CITY_NAMES) && !("MX:Mexico City" in TR_CITY_NAMES) &&
    !("ID:Jakarta" in TR_CITY_NAMES) && !("CN:Ürümqi" in TR_CITY_NAMES) && !("PK:Peshawar" in TR_CITY_NAMES));
  ok("standart Türkçe adlar: Kinşasa, Konakri, Kanberra, Çimkent, Köstence, Süveyş, Necef, Kerbela",
    cityDisplayName("Kinshasa", "CD", "tr") === "Kinşasa" && cityDisplayName("Conakry", "GN", "tr") === "Konakri" &&
    cityDisplayName("Canberra", "AU", "tr") === "Kanberra" && cityDisplayName("Shymkent", "KZ", "tr") === "Çimkent" &&
    cityDisplayName("Constanţa", "RO", "tr") === "Köstence" && cityDisplayName("Suez", "EG", "tr") === "Süveyş" &&
    cityDisplayName("Najaf", "IQ", "tr") === "Necef" && cityDisplayName("Karbala", "IQ", "tr") === "Kerbela");
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
  ok("A: rehberli şehir nüfusu ne olursa olsun A (Hvar 4 bin, Giethoorn 2 bin, nüfusu 0 bile); tek açık kural",
    isTierA(mk({ name: "Hvar", iso2: "HR", popK: 4 }), new Set(["HR:Hvar"])) &&
    isTierA(mk({ name: "Giethoorn", iso2: "NL", popK: 2 }), new Set(["NL:Giethoorn"])) &&
    isTierA(mk({ name: "Graz", iso2: "AT", popK: 0 }), graz) && !isTierA(mk({ name: "Hvar", iso2: "HR", popK: 4 })));
  ok("uygunluk: rehberli şehir nüfusu küçük olsa da uygun; rehbersiz < 100 bin değil",
    isEligible(mk({ name: "Hvar", iso2: "HR", popK: 4 }), new Set(["HR:Hvar"])) && !isEligible(mk({ name: "Hvar", iso2: "HR", popK: 4 })));
  ok("güçlü/zayıf: >= 2 milyon güçlü; rehberli ve >= 100 bin güçlü; rehberli küçük yer ve rehbersiz 1–2 milyonluk başkent zayıf",
    isStrong(mk({ popK: 2000 })) && !isStrong(mk({ popK: 1999, capital: true })) &&
    isStrong(mk({ name: "Graz", iso2: "AT", popK: 100 }), graz) && !isStrong(mk({ name: "Graz", iso2: "AT", popK: 99 }), graz) &&
    !isStrong(mk({ name: "Bamako", iso2: "ML", popK: 1297, capital: true })));
  ok("A: rehberi olan küçük başkent A (Valletta)", isTierA(mk({ name: "Valletta", iso2: "MT", capital: true, popK: 7 }), new Set(["MT:Valletta"])));
  ok("rehber anahtarı ülke kodu + veri adı (başka ülkedeki aynı ad etkilenmez)",
    !isTierA(mk({ name: "Graz", iso2: "XX", popK: 222 }), graz) && cityKey({ iso2: "AT", name: "Graz" }) === "AT:Graz");
  ok("B kademesi: başkent ya da nüfusu ≥ 500 bin", isTierB(mk({ capital: true, popK: 5 })) && isTierB(mk({ popK: 500 })) && !isTierB(mk({ popK: 499 })));
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
  ok("A ⊂ uygun şehirler (nüfusu < 100 bin olan yalnız başkent ya da rehberliyse A)", TIER_A.every((c) => isEligible(c, GUIDED)));
  ok("REHBERLİ ŞEHİR = HER ZAMAN A: rehberi olan her şehir (nüfusu ne olursa olsun) A'da", CITIES.filter((c) => GUIDED.has(cityKey(c))).every((c) => TIER_A.includes(c)));
  ok("B'de olmayan A şehirleri yalnız rehberli şehirler", TIER_A.filter((c) => !isTierB(c)).every((c) => GUIDED.has(cityKey(c))));
  const dropped = ["CY:Larnaca", "CY:Paphos", "CY:Famagusta", "AL:Shkodër", "HR:Zadar", "ME:Herceg Novi", "ME:Budva", "SI:Maribor"];
  ok("daha önce hiç çıkmayan rehberli şehirler veride, rehberli ve A'da: Larnaka, Baf, Gazimağusa, Shkodër, Zadar, Herceg Novi, Budva, Maribor",
    dropped.every((k) => CITIES.some((c) => cityKey(c) === k && GUIDED.has(k) && TIER_A.includes(c))), dropped.filter((k) => !GUIDED.has(k)).join(", "));
  ok("A kademesi geniş: ≥ 400 şehir ve ≥ 100 ülke", TIER_A.length >= 400 && countriesA.size >= 100, `${TIER_A.length} şehir, ${countriesA.size}/${countriesAll.size} ülke`);
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
  let weakGames = 0;
  let weakWeak = 0;
  let overCountry = 0;
  let tooClose = 0;
  let weakSlots = 0;
  let singletonSlots = 0;
  const A_PER_COUNTRY = new Map<string, number>();
  for (const c of TIER_A) A_PER_COUNTRY.set(c.iso2, (A_PER_COUNTRY.get(c.iso2) ?? 0) + 1);
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
        if (c.popK < 100 && !c.capital && !GUIDED.has(cityKey(c))) tooSmall++;
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
    // Yeni kalite kuralları: zayıf sınırı, ülke sınırı, aynı oyunda yakın şehir yok, her soruda güçlü uç.
    const weak = rounds.flatMap((r) => [r.a, r.b]).filter((c) => isTierA(c, GUIDED) && !isStrong(c, GUIDED));
    weakSlots += weak.length;
    if (weak.length > MAX_WEAK_PER_GAME) weakGames++;
    for (const r of rounds) if (!isStrong(r.a, GUIDED) && !isStrong(r.b, GUIDED)) weakWeak++;
    const perCountry = new Map<string, number>();
    for (const c of rounds.flatMap((r) => [r.a, r.b])) {
      perCountry.set(c.iso2, (perCountry.get(c.iso2) ?? 0) + 1);
      if (A_PER_COUNTRY.get(c.iso2) === 1) singletonSlots++;
    }
    if ([...perCountry.values()].some((n) => n > MAX_PER_COUNTRY)) overCountry++;
    for (let x = 0; x < rounds.length; x++) {
      for (let y = x + 1; y < rounds.length; y++) {
        for (const p of [rounds[x].a, rounds[x].b]) {
          for (const q of [rounds[y].a, rounds[y].b]) {
            if (haversineKm(p.lat, p.lng, q.lat, q.lng) < MIN_SEPARATION_KM) tooClose++;
          }
        }
      }
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
  ok("nüfusu < 100 bin olan yer yalnız başkent ya da rehberliyse çıkar", tooSmall === 0, `${tooSmall} ihlal`);
  ok("her oyunda aynı ülkeden en çok 1 soru", maxSame <= 1, `en çok ${maxSame}`);
  ok("aynı ülke soruları ≤ %10 (toplu)", sameTotal / allRounds <= 0.1, `${(100 * sameTotal / allRounds).toFixed(2)}%`);
  ok("aynı ülke soruları gerçekten de çıkıyor (> %1)", sameTotal / allRounds > 0.01, `${(100 * sameTotal / allRounds).toFixed(2)}%`);
  ok("her oyunda kovalar dengeli (3 / 3 / 4)", badBucketCount === 0, `${badBucketCount} oyun`);
  ok("her soruda en az bir uç güçlü: zayıf–zayıf soru hiç yok (Bamako–Konakri gibi)", weakWeak === 0, `${weakWeak} soru`);
  ok(`bir oyunda en çok ${MAX_WEAK_PER_GAME} zayıf A şehri`, weakGames === 0, `${weakGames} oyun`);
  ok(`bir oyunda aynı ülkeden en çok ${MAX_PER_COUNTRY} şehir`, overCountry === 0, `${overCountry} oyun`);
  ok(`bir oyunda farklı sorulardaki iki şehir ${MIN_SEPARATION_KM} km'den yakın değil (Tokyo–Yokohama aynı oyunda iki soruda çıkmaz)`, tooClose === 0, `${tooClose} çift`);
  ok("zayıf uçlar yuvaların %6'sından azı (önceki seçicide ~%19)", weakSlots / (allRounds * 2) < 0.06, `${(100 * weakSlots / (allRounds * 2)).toFixed(1)}%`);
  ok("A kademesinde tek şehri olan ülkeler yuvaların %15'inden azı (önceki seçicide ~%31)", singletonSlots / (allRounds * 2) < 0.15, `${(100 * singletonSlots / (allRounds * 2)).toFixed(1)}%`);
  console.log(`  (bilgi) seçici: zayıf uç ${(100 * weakSlots / (allRounds * 2)).toFixed(1)}%, tek-A ülke ${(100 * singletonSlots / (allRounds * 2)).toFixed(1)}%`);
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
  ok("A kademesindeki her şehir 3000 oyunda en az bir kez çıktı (küçük rehberli yerler dahil)", TIER_A.every((c) => cityUse.has(c.id)), TIER_A.filter((c) => !cityUse.has(c.id)).map((c) => c.name).join(", "));
  const topCities = [...cityUse].sort((x, y) => y[1] - x[1]).slice(0, 5);
  const topCityShare = topCities[0][1] / slots;
  ok("çeşitlilik: hiçbir şehir toplam yuvaların %1,2'sinden fazlasını almıyor", topCityShare <= 0.012,
    topCities.map(([id, n]) => `${CITIES[id].name} ${(100 * n / slots).toFixed(2)}%`).join(", "));
  ok("güçlü A şehirlerinin en çok geçeni en az geçenin 60 katını aşmıyor (ağırlık dengesi)", (() => {
    const counts = TIER_A.filter((c) => isStrong(c, GUIDED)).map((c) => cityUse.get(c.id) ?? 0);
    return Math.max(...counts) / Math.max(1, Math.min(...counts)) <= 60;
  })(), `${Math.max(...TIER_A.filter((c) => isStrong(c, GUIDED)).map((c) => cityUse.get(c.id) ?? 0))} / ${Math.min(...TIER_A.filter((c) => isStrong(c, GUIDED)).map((c) => cityUse.get(c.id) ?? 0))}`);

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
  const linkOnly = Object.entries(GUIDE_ALIASES).filter(([, a]) => a.linkOnly).map(([k]) => k);
  ok("A kademesinin rehber kuralı bu eşleşmeden gelir: guideNames anahtarları = guideLinks anahtarları − yalnız-bağlantı takma adları",
    JSON.stringify(Object.keys(guideNames()).sort()) === JSON.stringify(Object.keys(links).filter((k) => !linkOnly.includes(k)).sort()));
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


/* --------------------------- rehber takma adları --------------------------- */
{
  const links = guideLinks();
  const names = guideNames();
  ok("takma ad: Recife, Manaus, Salta, Guilin rehbere bağlanır", ["BR:Recife", "BR:Manaus", "AR:Salta", "CN:Guilin"].every((k) => k in links),
    ["BR:Recife", "BR:Manaus", "AR:Salta", "CN:Guilin"].filter((k) => !(k in links)).join(", "));
  ok("takma ad: ekranda 'Recife ve Olinda' yazmaz (yalnız bağlantı), Türkçede veri adı kalır",
    !("BR:Recife" in names) && cityDisplayName("Recife", "BR", "tr", names["BR:Recife"]) === "Recife" &&
    cityDisplayName("Guilin", "CN", "tr", names["CN:Guilin"]) === "Guilin");
  ok("takma ad: Pilsen → Plzeň ve Ko Samui → Koh Samui adı gösterir (aynı yerin başka yazımı)", names["CZ:Pilsen"] === "Plzeň" && names["TH:Ko Samui"] === "Koh Samui");
  ok("rehberi olmayan 'X ve Y' kayıtları bilerek eşleşmedi (Keukenhof ve Lisse, Postojna ve Predjama)",
    !Object.values(links).some((h) => /keukenhof|postojna/.test(h)));
  const hrefs = Object.values(links);
  const dup = hrefs.filter((h, i) => hrefs.indexOf(h) !== i);
  ok("bir rehber en çok bir oyun şehrine bağlanır", dup.length === 0, dup.slice(0, 3).join(", "));
  ok("her takma ad anahtarı veride var", Object.keys(GUIDE_ALIASES).every((k) => CITIES.some((c) => cityKey(c) === k)));
  ok("rehberli şehirlerin çoğu eşleşti (≥ 285 bağlantı)", Object.keys(links).length >= 285, String(Object.keys(links).length));
  const okinawa = Object.values(links).some((h) => h.endsWith("/okinawa"));
  ok("rehberi ada olan Okinawa, aynı adlı şehre bağlanmadı", !okinawa);
}

/* ------------------------------ Günün Turu ------------------------------ */
{
  const guided = GUIDED;
  const dayA = "2026-10-09";
  const dayB = "2026-10-10";
  const run = (key: string) => pickRounds({ seed: dailySeed(key), guided });
  ok("aynı tarih → aynı 10 tur (dört kez, bayt bayt)", (() => {
    const first = JSON.stringify(run(dayA));
    return [1, 2, 3].every(() => JSON.stringify(run(dayA)) === first) && run(dayA).length === 10;
  })());
  ok("farklı tarih → farklı turlar", JSON.stringify(run(dayA)) !== JSON.stringify(run(dayB)));
  const days = Array.from({ length: 400 }, (_, i) => addDays("2026-01-01", i));
  const sigs = new Set(days.map((d) => JSON.stringify(run(d).map((r) => [r.a.id, r.b.id]))));
  ok("400 ardışık gün için 400 farklı oyun (tohum çakışması yok)", sigs.size === 400, String(sigs.size));
  const seeds = new Set(days.map(dailySeed));
  ok("400 gün için 400 farklı tohum", seeds.size === 400);
  ok("tohum tarihin saf işlevi: sabit değerler (FNV-1a, tuzlu)", dailySeed("2026-10-09") === 3551455644 && dailySeed("2026-10-10") !== dailySeed("2026-10-09"));
  ok("Günün Turu da seçici kurallarını taşır (10 tur, tekrarsız şehir, ≥ 1 güçlü uç)", days.slice(0, 60).every((d) => {
    const rounds = run(d);
    const ids = rounds.flatMap((r) => [r.a.id, r.b.id]);
    return rounds.length === 10 && new Set(ids).size === 20 && rounds.every((r) => isStrong(r.a, guided) || isStrong(r.b, guided));
  }));
  ok("tarih anahtarı biçimi", isDateKey("2026-10-09") && !isDateKey("2026-13-01") && !isDateKey("2026-02-30") && !isDateKey("26-10-09") && !isDateKey(20261009));
  ok("yerel tarih anahtarı: bileşenlerden", dateKeyOf(new Date(2026, 9, 9, 23, 59, 59)) === "2026-10-09" && dateKeyOf(new Date(2026, 9, 10, 0, 0, 1)) === "2026-10-10");
  ok("saat dilimi sınırı: aynı an, farklı yerel gün (İstanbul 10 Ekim, Los Angeles 9 Ekim)", (() => {
    const instant = new Date("2026-10-10T02:30:00Z");
    return dateKeyOf(instant, "Europe/Istanbul") === "2026-10-10" && dateKeyOf(instant, "America/Los_Angeles") === "2026-10-09" &&
      dateKeyOf(instant, "Pacific/Kiritimati") === "2026-10-10";
  })());
  ok("gün aritmetiği: ay, yıl ve artık gün sınırları", daysBetween("2026-02-28", "2026-03-01") === 1 && daysBetween("2028-02-28", "2028-03-01") === 2 &&
    daysBetween("2026-12-31", "2027-01-01") === 1 && addDays("2026-12-31", 1) === "2027-01-01" && addDays("2026-03-01", -1) === "2026-02-28" && daysBetween("2026-10-09", "2026-10-02") === -7);
  ok("yaz saati geçişi günü 1 gün sayılır (Avrupa 2026-03-29, ABD 2026-03-08 ileri; 2026-10-25 geri)",
    daysBetween("2026-03-28", "2026-03-29") === 1 && daysBetween("2026-03-29", "2026-03-30") === 1 && daysBetween("2026-10-24", "2026-10-26") === 2 && daysBetween("2026-03-07", "2026-03-09") === 2);
  ok("localDateFromKey öğlen yerel saat (gün kaymaz)", dateKeyOf(localDateFromKey("2026-10-09")) === "2026-10-09" && localDateFromKey("2026-10-09").getHours() === 12);
}

/* -------------------------- emoji şeridi ve puan eşikleri -------------------------- */
{
  ok("eşikler: 1000 → 🟩, 800 → 🟩, 799 → 🟨, 400 → 🟨, 399 → 🟧, 100 → 🟧, 99 → 🟥, 0 → 🟥",
    emojiFor(1000) === "🟩" && emojiFor(800) === "🟩" && emojiFor(799) === "🟨" && emojiFor(400) === "🟨" &&
    emojiFor(399) === "🟧" && emojiFor(100) === "🟧" && emojiFor(99) === "🟥" && emojiFor(0) === "🟥");
  ok("şerit: 10 tur → 10 kare, sırayla", emojiStrip([1000, 800, 799, 400, 399, 100, 99, 0, 650, 250]) === "🟩🟩🟨🟨🟧🟧🟥🟥🟨🟧");
  ok("şerit: her kare tek bir emoji (UTF-16 uzunluğu 2)", [...emojiStrip(Array(10).fill(900))].length === 10);
  const base = { header: "Wangoh · Kaç kilometre? — Günün Turu 9 Ekim 2026 · seri 3", scores: [900, 500, 150, 20, 810, 820, 450, 120, 990, 5], scoreLine: "4.765 / 10.000", url: "wangoh.com/mesafe" };
  const text = shareText(base);
  ok("paylaşım metni: başlık, emoji şeridi, puan, adres (4 satır)", text.split("\n").length === 4 && text.split("\n")[0] === base.header && text.split("\n")[1] === "🟩🟨🟧🟥🟩🟩🟨🟧🟩🟥" && text.endsWith("wangoh.com/mesafe") && text.includes("4.765 / 10.000"));
  ok("paylaşım adresi dile göre: tr wangoh.com/mesafe, en /en/distance, es /es/distancia", shareUrl("tr") === "wangoh.com/mesafe" && shareUrl("en") === "wangoh.com/en/distance" && shareUrl("es") === "wangoh.com/es/distancia" && shareUrl("xx") === "wangoh.com/mesafe");
}

/* ------------------------------ seri ve istatistik ------------------------------ */
{
  const game = (mode: "free" | "daily", dateKey: string, total: number) => ({ mode, dateKey, total, scores: Array(10).fill(Math.round(total / 10)) });
  let st: Stats = EMPTY_STATS;
  const play = (mode: "free" | "daily", dateKey: string, total: number) => {
    const r = recordGame(st, game(mode, dateKey, total));
    st = r.stats;
    return r;
  };

  let r = play("daily", "2026-10-01", 5000);
  ok("ilk günün turu: resmî, seri 1, istatistik 1 oyun", r.official && r.counted && st.streak === 1 && st.played === 1 && st.best === 5000 && st.daily["2026-10-01"].total === 5000);
  ok("ilk oyunda 'yeni rekor' denmez (geçilecek rekor yok)", r.newBest === false);
  r = play("daily", "2026-10-01", 9000);
  ok("aynı gün tekrar: resmî puan, istatistik, seri DEĞİŞMEZ", !r.official && !r.counted && st.daily["2026-10-01"].total === 5000 && st.played === 1 && st.best === 5000 && st.streak === 1);
  r = play("daily", "2026-10-02", 6000);
  ok("ertesi gün: seri 2", r.official && st.streak === 2 && st.bestStreak === 2 && r.newBest && st.best === 6000);
  r = play("free", "2026-10-02", 4000);
  ok("serbest oyun seriyi değiştirmez, istatistiğe işler", !r.official && r.counted && st.streak === 2 && st.played === 3 && !r.newBest);
  r = play("daily", "2026-10-03", 7000);
  ok("üçüncü gün: seri 3", st.streak === 3 && st.bestStreak === 3 && r.streak === 3);
  r = play("daily", "2026-10-06", 3000);
  ok("gün atlayınca (4 ve 5 Ekim oynanmadı) seri 1'e döner, en uzun seri 3 kalır", st.streak === 1 && st.bestStreak === 3 && r.streak === 1);
  ok("ortalama: toplam puan / sayılan oyun", st.played === 5 && averageScore(st) === Math.round((5000 + 6000 + 4000 + 7000 + 3000) / 5), String(averageScore(st)));
  ok("güncel seri: oynadığı gün ve ertesi gün süregelir, iki gün sonra kopar",
    currentStreak(st, "2026-10-06") === 1 && currentStreak(st, "2026-10-07") === 1 && currentStreak(st, "2026-10-08") === 0 && currentStreak(EMPTY_STATS, "2026-10-08") === 0);
  ok("güncel seri: cihaz saati / saat dilimi geriye gitse (bir gün önce) seri bozulmaz", currentStreak(st, "2026-10-05") === 1);
  // saat dilimi sınırı: doğuya uçuş (aynı takvim günü atlandı) ve batıya uçuş (aynı gün iki kez görünür)
  let travel: Stats = EMPTY_STATS;
  travel = recordGame(travel, game("daily", "2026-10-09", 5000)).stats;
  const west = recordGame(travel, game("daily", "2026-10-08", 6000));
  ok("batıya uçuş: yerel gün geri gitti (8 Ekim) — yeni gün sayılır ama seri/son gün ilerlemez, çökmez",
    west.official && west.stats.lastDaily === "2026-10-09" && west.stats.streak === 1 && currentStreak(west.stats, "2026-10-08") === 1);
  const east = recordGame(travel, game("daily", "2026-10-11", 6000));
  ok("doğuya uçuş: bir gün atlandı (10 Ekim yok) → seri 1'e döner", east.stats.streak === 1 && east.stats.lastDaily === "2026-10-11");
  // eski kayıttan göç
  const legacy = parseStats({ best: 7300, played: 12 });
  ok("v1 kaydı ({best, played}) göçü: rekor ve oyun sayısı korunur, ortalama bilinmez", legacy.best === 7300 && legacy.played === 12 && averageScore(legacy) === null && legacy.streak === 0 && legacy.sound === false);
  const afterLegacy = recordGame(legacy, game("free", "2026-10-09", 5000)).stats;
  ok("göç sonrası ortalama yalnız yeni oyunlardan", averageScore(afterLegacy) === 5000 && afterLegacy.played === 13);
  ok("bozuk kayıt güvenle okunur (null, dizi, sayı, çöp alanlar)", [null, undefined, 5, "x", [], { best: "a", played: -3, streak: 99, daily: { bad: 1, "2026-01-01": { total: 1, scores: [1] } } }].every((v) => {
    const p = parseStats(v);
    return p.played >= 0 && p.best >= 0 && p.streak === 0 && Object.keys(p.daily).length === 0 && p.sound === false;
  }));
  ok("ses tercihi kayda işlenir ve okunur", parseStats({ ...st, sound: true }).sound === true && parseStats({ ...st, sound: "yes" }).sound === false);
  ok("kayıt gidiş-dönüş: JSON'dan okununca aynı", JSON.stringify(parseStats(JSON.parse(JSON.stringify(st)))) === JSON.stringify(st));
  // eski günlükler budanır
  let long: Stats = EMPTY_STATS;
  for (let i = 0; i < DAILY_KEEP_DAYS + 20; i++) long = recordGame(long, game("daily", addDays("2026-01-01", i), 5000)).stats;
  ok("günlük sonuçlar son 45 günle sınırlı; seri budamadan etkilenmez", Object.keys(long.daily).length <= DAILY_KEEP_DAYS + 1 && long.streak === DAILY_KEEP_DAYS + 20);
}

/* --------------------------- durum makinesi: modlar --------------------------- */
{
  const rounds = pickRounds({ seed: 5 });
  const daily = reducer(INITIAL_STATE, { type: "start", rounds, mode: "daily", dateKey: "2026-10-09" });
  ok("günün turu başlangıcı mod ve tarihi taşır", daily.mode === "daily" && daily.dateKey === "2026-10-09");
  const free = reducer(daily, { type: "start", rounds, mode: "free" });
  ok("serbest başlangıç tarihi temizler; modsuz start serbest sayılır", free.mode === "free" && free.dateKey === null && reducer(INITIAL_STATE, { type: "start", rounds }).mode === "free");
  ok("home → giriş ekranı", reducer(daily, { type: "home" }) === INITIAL_STATE);
}

/* ------------------------------ geri bildirim ------------------------------ */
{
  ok("kaydırıcı tık eşikleri 1-2-5 dizisi: 100, 200, 500, 1000, 2000, 5000, 10000", JSON.stringify(DETENTS_KM) === JSON.stringify([100, 200, 500, 1000, 2000, 5000, 10000]));
  ok("tık sayısı km ile azalmaz; 99→100 ve 4999→5000 eşik geçer, 101→199 geçmez",
    detentIndex(10) === 0 && detentIndex(99) === 0 && detentIndex(100) === 1 && detentIndex(199) === 1 && detentIndex(200) === 2 && detentIndex(4999) === 5 && detentIndex(5000) === 6 && detentIndex(20000) === 7);
  let prev = -1;
  let mono = true;
  for (let p = 0; p <= SLIDER_STEPS; p++) {
    const d = detentIndex(kmFromPosition(p));
    if (d < prev) mono = false;
    prev = d;
  }
  ok("kaydırıcıyı baştan sona sürüklemek tam 7 eşik geçer", mono && prev === 7);
}

/* --------------------------- cevap haritası geometrisi --------------------------- */
{
  const rounds = Array.from({ length: 60 }, (_, i) => pickRounds({ seed: 7000 + i, guided: GUIDED })).flat();
  const lonLat = (c: City): LngLat => [c.lng, c.lat];
  ok("yayın A'dan 'tahmin' km uzaktaki noktası gerçekten o kadar uzakta (haversine, ±%1)", rounds.slice(0, 200).every((r) => {
    const g = pointAlong(lonLat(r.a), lonLat(r.b), r.km, r.km * 0.5);
    const d = haversineKm(r.a.lat, r.a.lng, g[1], g[0]);
    return Math.abs(d - r.km * 0.5) <= r.km * 0.01 + 1;
  }));
  ok("pointAlong B'nin ötesine uzanır (1,3 × mesafe) ve büyük daire üzerinde kalır", rounds.slice(0, 120).every((r) => {
    const g = pointAlong(lonLat(r.a), lonLat(r.b), r.km, r.km * 1.3);
    const dA = haversineKm(r.a.lat, r.a.lng, g[1], g[0]);
    return Math.abs(dA - Math.min(r.km * 1.3, 40030 - r.km * 1.3)) <= r.km * 0.02 + 2;
  }));
  ok("tahmin dairesi: her köşe merkezden tahmin km uzakta (±%1)", [10, 120, 1500, 9000, 19000].every((km) => {
    const center: LngLat = [28.97, 41.01];
    const ring = guessCircle(center, km).coordinates[0] as LngLat[];
    return ring.length > 20 && ring.every((p) => Math.abs(haversineKm(center[1], center[0], p[1], p[0]) - km) <= km * 0.01 + 0.5);
  }));
  ok("kmToDegrees: 111,19 km ≈ 1 derece", near(kmToDegrees(111.195), 1, 0.001));
  ok("kamera uçları: en az MIN_VIEW_KM genişliğinde bir bölge (50 km'lik çiftte bile)", (() => {
    const [e1, e2] = cameraEnds([2.35, 48.85], [2.9, 48.85], 41, ) as [LngLat, LngLat];
    return haversineKm(e1[1], e1[0], e2[1], e2[0]) >= MIN_VIEW_KM * 0.98;
  })());
  ok("kamera uçları: çok uzak çiftte yarım küreyi aşmaz", rounds.filter((r) => r.km > 15000).every((r) => {
    const [e1, e2] = cameraEnds(lonLat(r.a), lonLat(r.b), r.km);
    return haversineKm(e1[1], e1[0], e2[1], e2[0]) <= 19500 + 1;
  }));

  // Kamera: 480 gerçek soruda iki şehir de kadrajın içinde ve kenarlardan uzak.
  let cameraBad = 0;
  let nullPoint = 0;
  let tinyArc = 0;
  for (const r of rounds.slice(0, 480)) {
    const camera = makeCamera(lonLat(r.a), lonLat(r.b), r.km);
    const pa = camera.projection(lonLat(r.a));
    const pb = camera.projection(lonLat(r.b));
    if (!pa || !pb) { nullPoint++; continue; }
    const inside = (p: number[]) => p[0] >= 20 && p[0] <= MAP_WIDTH - 20 && p[1] >= 24 && p[1] <= MAP_HEIGHT - 24;
    if (!inside(pa) || !inside(pb)) cameraBad++;
    if (Math.hypot(pa[0] - pb[0], pa[1] - pb[1]) < 8) tinyArc++;
  }
  ok("kamera: 480 soruda iki şehir de kadrajda (kenardan ≥ 20 px) ve görünür yarım kürede", cameraBad === 0 && nullPoint === 0, `${cameraBad} dışarıda, ${nullPoint} görünmez`);
  ok("kamera: en yakın çiftte bile iki nokta ayırt edilir (≥ 8 px)", tinyArc === 0, `${tinyArc} çift`);

  // Etiketler hiçbir soruda birbirinin üstüne binmez, kutudan taşmaz ve tahmin işaretini nadiren örter.
  let labelBad = 0;
  let coversGuess = 0;
  const rng = makeRng(42);
  const rounds480 = rounds.slice(0, 480);
  for (const r of rounds480) {
    const camera = makeCamera(lonLat(r.a), lonLat(r.b), r.km);
    const pa = camera.projection(lonLat(r.a))! as [number, number];
    const pb = camera.projection(lonLat(r.b))! as [number, number];
    const guessKm = r.km * (0.3 + rng() * 2.2);
    const gp = camera.projection(pointAlong(lonLat(r.a), lonLat(r.b), r.km, guessKm)) as [number, number] | null;
    const wa = estimateLabelWidth(r.a.name);
    const wb = estimateLabelWidth(r.b.name);
    const { a, b } = placeLabels(pa, pb, wa, wb, { width: MAP_WIDTH, height: MAP_HEIGHT }, gp ? [gp] : []);
    const rect = (spot: { x: number; y: number }, w: number) => ({ l: spot.x - w / 2, r: spot.x + w / 2, t: spot.y - 11, b: spot.y + 4 });
    const ra = rect(a, wa);
    const rb = rect(b, wb);
    const overlap = ra.l < rb.r && rb.l < ra.r && ra.t < rb.b && rb.t < ra.b;
    const out = [ra, rb].some((q) => q.l < 0 || q.r > MAP_WIDTH || q.t < 0 || q.b > MAP_HEIGHT);
    if (overlap || out) labelBad++;
    if (gp && [ra, rb].some((q) => gp[0] > q.l - 4 && gp[0] < q.r + 4 && gp[1] > q.t - 4 && gp[1] < q.b + 4)) coversGuess++;
  }
  ok("etiketler: 480 soruda birbirine binmez ve harita kutusundan taşmaz", labelBad === 0, `${labelBad} sorun`);
  ok("etiketler: tahmin işaretini örtmez (480 soruda ≤ %2)", coversGuess <= rounds480.length * 0.02, `${coversGuess} soru`);

  // Harita yolları gerçekten üretiliyor (dünya verisi, çevrimdışı JSON).
  const sample = rounds.slice(0, 12);
  const t0 = Date.now();
  const drawn = sample.map((r) => prepare(lonLat(r.a), lonLat(r.b), r.km).paths);
  ok("dünya yolları: kara, sınır, küre ve çizgi ağı üretilir", drawn.every((d) => d.land.length > 500 && d.borders.length > 100 && d.sphere.length > 10 && d.graticule.length > 100));
  console.log(`  (bilgi) ${sample.length} haritanın yolları ${Date.now() - t0} ms (Node, ${Math.round((Date.now() - t0) / sample.length)} ms/harita)`);
  ok("vurgu: Paris ve Tokyo'nun ülkeleri bulunur", (() => {
    const paris: LngLat = [2.35, 48.85];
    const tokyo: LngLat = [139.69, 35.69];
    const d = prepare(paris, tokyo, 9712).paths;
    return !!d.highlightA && !!d.highlightB;
  })());
  ok("orta nokta iki şehre eşit uzaklıkta", (() => {
    const a: LngLat = [2.35, 48.85];
    const b: LngLat = [139.69, 35.69];
    const m = midpoint(a, b);
    return near(haversineKm(a[1], a[0], m[1], m[0]), haversineKm(b[1], b[0], m[1], m[0]), 1);
  })());
}

/* ------------------- erişilebilirlik: kontrast ve kaynak taraması ------------------- */
{
  const lum = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const lumRgb = (r: number, g: number, b: number) => {
    const [R, G, B] = [r, g, b].map((v) => v / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  };
  const ratio = (l1: number, l2: number) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  const BG = lum("#06090f");
  const PANEL = lumRgb(6 + 0.06 * (255 - 6), 9 + 0.06 * (255 - 9), 15 + 0.06 * (255 - 15)); // bg-white/[0.06] üstü
  // Not: Renk sabitleri ui.tsx'te; dosyadan okunur ki test gerçek değerleri denetlesin.
  const uiSource = readFileSync(join(__dirname, "..", "src", "features", "distance-game", "ui.tsx"), "utf8");
  const tintMatch = /TINTS = \{ great: "(#\w+)", good: ACCENT, fair: "(#\w+)", far: "(#\w+)" \}/.exec(uiSource)!;
  const tints = [tintMatch[1], "#c8a45e", tintMatch[2], tintMatch[3]];
  ok("tur sonucu renkleri koyu zeminde ≥ 4,5:1", tints.every((c) => ratio(lum(c), BG) >= 4.5), tints.map((c) => ratio(lum(c), BG).toFixed(2)).join(", "));
  ok("tur sonucu renkleri cevap panelinin (hafif açık) zemininde de ≥ 4,5:1", tints.every((c) => ratio(lum(c), PANEL) >= 4.5), tints.map((c) => ratio(lum(c), PANEL).toFixed(2)).join(", "));
  const whiteAt = (alpha: number, under = BG) => ratio(lumRgb(...([6, 9, 15].map((v) => v + alpha * (255 - v)) as [number, number, number])), under);
  ok("ikincil yazı beyaz/%55 ve üstü koyu zeminde ≥ 4,5:1 (en düşük izin verilen)", whiteAt(0.55) >= 4.5, whiteAt(0.55).toFixed(2));
  ok("kaydırıcının dolmamış rayı (beyaz/%38) zeminden ≥ 3:1 (arayüz bileşeni)", whiteAt(0.38) >= 3, whiteAt(0.38).toFixed(2));
  const css = readFileSync(join(__dirname, "..", "src", "app", "globals.css"), "utf8");
  ok("kaydırıcı rayı CSS'i 0,38 opaklıkta", /rgba\(255, 255, 255, 0\.38\) var\(--fill\)/.test(css));

  // Kaynak taraması: oyunun hiçbir bileşeni %55'ten sönük metin rengi kullanmaz.
  const dir = join(__dirname, "..", "src", "features", "distance-game");
  const files = readdirSync(dir).filter((f) => f.endsWith(".tsx"));
  const low: string[] = [];
  for (const f of files) {
    const src = readFileSync(join(dir, f), "utf8");
    for (const m of src.matchAll(/text-white\/(\d+)/g)) if (Number(m[1]) < 55) low.push(`${f}: ${m[0]}`);
    for (const m of src.matchAll(/text-\[var\(--gold\)\]\/(\d+)/g)) if (Number(m[1]) < 80) low.push(`${f}: ${m[0]}`);
  }
  ok("oyun bileşenlerinde sönük metin rengi yok (text-white/<55, altın metin <%80)", low.length === 0, low.join("; "));

  // Dokunma hedefi ve erişilebilirlik işaretleri (kaynakta).
  const play = readFileSync(join(dir, "PlayScreen.tsx"), "utf8");
  ok("kaydırıcı: aria-valuetext, aria-label ve soruya aria-describedby", /aria-valuetext=\{t\("sliderValueText"/.test(play) && /aria-label=\{t\("sliderLabel"\)\}/.test(play) && /aria-describedby="dg-question dg-scale-hint"/.test(play));
  ok("tur sonucu kalıcı canlı bölgede duyurulur (role=status aria-live=polite)", /role="status" aria-live="polite" className="sr-only"/.test(play));
  ok("odak: yeni turda kaydırıcıya, cevaptan sonra 'sıradaki tur' düğmesine", /\(revealed \? nextRef : sliderRef\)\.current\?\.focus/.test(play));
  ok("−/+ düğmeleri 44 px (size-11) ve kaydırıcı 44 px yükseklikte", /size-11/.test(play) && /height: 44px;/.test(css));
  ok("güvenli alan: çentik ve ev çubuğu payı (env(safe-area-inset-*)) oyun kabuğunda", ["top", "right", "bottom", "left"].every((side) => css.includes(`env(safe-area-inset-${side})`)));
  ok("hareket azaltma: dg-* animasyonları prefers-reduced-motion'da kapanır", /@media \(prefers-reduced-motion: reduce\) \{\s*\.dg-rise[^}]*animation: none/.test(css));
  const feedback = readFileSync(join(dir, "feedback.ts"), "utf8");
  ok("titreşim: try/catch içinde, varlık denetimiyle, hareket azaltılmışsa yok", /typeof navigator\.vibrate !== "function"/.test(feedback) && /reducedMotion\(\)/.test(feedback) && /catch \{/.test(feedback));
  ok("ses varsayılan KAPALI (EMPTY_STATS.sound = false) ve dosya yok (WebAudio)", EMPTY_STATS.sound === false && /createOscillator/.test(feedback) && !/new Audio\(|\.mp3|\.wav|\.ogg/.test(feedback));
}

/* ----------------- ağ yok: oyun kodu hiçbir uzak adres çağırmaz ----------------- */
{
  const dir = join(__dirname, "..", "src", "features", "distance-game");
  const offenders: string[] = [];
  for (const f of readdirSync(dir)) {
    if (!/\.(tsx?|css)$/.test(f)) continue;
    const src = readFileSync(join(dir, f), "utf8");
    if (/\bfetch\(|XMLHttpRequest|sendBeacon|new WebSocket|https?:\/\/(?!www\.geonames\.org|creativecommons\.org)[a-z]/i.test(src.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, ""))) offenders.push(f);
  }
  ok("oyun kodunda fetch / XHR / uzak adres yok (GeoNames atıf bağlantıları hariç)", offenders.length === 0, offenders.join(", "));
  const mapSrc = readFileSync(join(dir, "worldMap.ts"), "utf8");
  ok("harita verisi world-atlas paketinden içe aktarılır (ikinci kopya ve CDN yok)", /from "world-atlas\/countries-110m\.json"/.test(mapSrc) && !/jsdelivr|unpkg|cdn\./.test(mapSrc));
  const game = readFileSync(join(dir, "DistanceGame.tsx"), "utf8") + readFileSync(join(dir, "PlayScreen.tsx"), "utf8") + readFileSync(join(dir, "IntroScreen.tsx"), "utf8");
  ok("ana pakete harita verisi girmez: oyun ekranları worldMap/RevealMap'i yalnız dinamik içe aktarır", !/from "\.\/(worldMap|RevealMap)"/.test(game) && /import\("\.\/RevealMap"\)/.test(game));
}

/* ------------------------------- çerez politikası ------------------------------- */
{
  const files = [
    join(__dirname, "..", "src", "app", "[locale]", "(kurumsal)", "cerez-politikasi", "page.tsx"),
    join(__dirname, "..", "src", "components", "legal", "en", "Cookies.tsx"),
    join(__dirname, "..", "src", "components", "legal", "es", "Cookies.tsx"),
  ];
  ok("yeni localStorage anahtarı (wangoh.distancegame.v2) üç dilde çerez politikasında", files.every((f) => readFileSync(f, "utf8").includes("wangoh.distancegame.v2")));
  const hook = readFileSync(join(__dirname, "..", "src", "features", "distance-game", "useDistanceGame.ts"), "utf8");
  ok("oyun kodu yalnız belgelenmiş anahtarı yazar (v2); v1 yalnız okunur", /setItem\(STORAGE_KEY/.test(hook) && !/setItem\(LEGACY_KEY/.test(hook) && /STORAGE_KEY = "wangoh\.distancegame\.v2"/.test(hook) && !/document\.cookie/.test(hook));
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

/* ------------------------- eşzamansız: kademeli hazırlık ------------------------- */
const pending: Promise<void>[] = [];
{
  const a: LngLat = [28.97, 41.01];
  const b: LngLat = [-0.13, 51.51];
  let pauses = 0;
  pending.push(
    prepareIdle(a, b, 2500, async () => {
      pauses++;
      await new Promise((r) => setTimeout(r, 0));
    }).then(() => {
      const t0 = Date.now();
      const paths = prepare(a, b, 2500).paths;
      ok("kademeli hazırlık: dört adım arasında ana iş parçacığına nefes verir", pauses === 4, String(pauses));
      ok("kademeli hazırlık sonrası prepare() anında döner ve tüm yollar hazır", Date.now() - t0 < 5 && paths.land.length > 500 && paths.borders.length > 100 && paths.graticule.length > 50 && paths.sphere.length > 10);
    })
  );
}

Promise.all(pending).then(() => {
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
});
