/**
 * "Haritada Bul" oyunu — puanlama, küre matematiği, soru seçici, durum makinesi,
 * mesajlar, çerez politikası ve adres çevirisi.
 * Run:  npx tsx scripts/map.test.ts
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CITIES, cityKey } from "../src/features/distance-game/cities";
import { dailySeed, parseStats, EMPTY_STATS, recordGame } from "../src/features/distance-game/daily";
import { haversineKm } from "../src/features/distance-game/haversine";
import { guideLinks } from "../src/features/distance-game/serverData";
import { shareUrl } from "../src/features/distance-game/share";
import {
  MAP_ROUNDS, MAX_GAME_SCORE, MAX_ROUND_SCORE, FULL_SCORE_KM, HINT_FACTOR, MAX_HINT_ROUND_SCORE,
  scoreFromKm, scoreRound,
} from "../src/features/map-game/scoring";
import {
  angleDeg, baseRadius, clampView, destinationPoint, dragView, fitView, flyDuration, flyView, hintCircle,
  HINT_RADIUS_KM, INITIAL_VIEW, isFacing, lngLatAt, makeProjection, MAX_ZOOM, MIN_ZOOM, radiusOf, wrapLng, zoomView,
  type View,
} from "../src/features/map-game/globeMath";
import {
  countryRanks, MIN_SPREAD_KM, pickTargets, targetTier, TIER_PLAN,
} from "../src/features/map-game/pickTargets";
import { INITIAL_STATE, reducer, type State } from "../src/features/map-game/gameReducer";
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

console.log("\nHARİTADA BUL\n" + "=".repeat(64));

/** Küçük, deterministik rastgele sayı üreteci (testlerin kendisi için). */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------- puanlama ------------------------------- */
{
  ok("tur sayısı 8, oyunun üst puanı 8.000", MAP_ROUNDS === 8 && MAX_GAME_SCORE === 8000 && MAX_ROUND_SCORE === 1000);
  ok("0 km ve 50 km (dahil) tam puan", scoreFromKm(0) === 1000 && scoreFromKm(FULL_SCORE_KM) === 1000);
  ok("50 km'nin hemen ötesi tam puanın altında", scoreFromKm(FULL_SCORE_KM + 1) < 1000 && scoreFromKm(FULL_SCORE_KM + 1) >= 999);
  ok("sabit değerler: 300 km → 812, 1000 km → 453, 2000 km → 197, 5000 km → 16", scoreFromKm(300) === 812 && scoreFromKm(1000) === 453 && scoreFromKm(2000) === 197 && scoreFromKm(5000) === 16);
  let monotone = true;
  for (let km = 0; km < 20100; km += 7) if (scoreFromKm(km + 7) > scoreFromKm(km)) monotone = false;
  ok("uzaklık arttıkça puan hiç artmaz", monotone);
  ok("puan hep 0–1000 arası tam sayı (0–20.100 km)", Array.from({ length: 2011 }, (_, i) => scoreFromKm(i * 10)).every((s) => Number.isInteger(s) && s >= 0 && s <= 1000));
  ok("geçersiz girdi 0 puan (NaN, Infinity, negatif)", scoreFromKm(NaN) === 0 && scoreFromKm(Infinity) === 0 && scoreFromKm(-5) === 0);
  ok("yarım dünya uzaklıkta puan 0'a yakın", scoreFromKm(20015) === 0);

  const plain = scoreRound(300, false);
  const hinted = scoreRound(300, true);
  ok("ipucu puanı yarıya indirir (yukarı yuvarlanmaz, çarpan 0,5)", plain.score === 812 && hinted.score === Math.round(812 * HINT_FACTOR) && hinted.base === plain.base);
  ok("ipuçlu turun üst sınırı 500", scoreRound(0, true).score === MAX_HINT_ROUND_SCORE && MAX_HINT_ROUND_SCORE === 500);
  ok("yorum ipucundan bağımsız (tahminin kendisine göre)", plain.verdict === hinted.verdict);
  ok("uzaklık tam sayıya yuvarlanır, negatif 0'a", scoreRound(300.6, false).km === 301 && scoreRound(-3, false).km === 0);
  ok("yorum eşikleri: tam isabet, çok yakın, iyi, fena değil, uzak", scoreRound(10, false).verdict === "perfect" && scoreRound(300, false).verdict === "great" && scoreRound(600, false).verdict === "good" && scoreRound(1400, false).verdict === "fair" && scoreRound(4000, false).verdict === "far");
}

/* ------------------------------ küre matematiği ------------------------------ */
{
  ok("wrapLng: -180..180 aralığı", wrapLng(190) === -170 && wrapLng(-190) === 170 && wrapLng(0) === 0 && wrapLng(540) === -180 && wrapLng(-180) === -180);
  const clamped = clampView({ lng: 400, lat: 120, zoom: 99 });
  ok("clampView: boylam sarılır, enlem ve yakınlık sınırlanır", near(clamped.lng, 40, 1e-9) && clamped.lat === 88 && clamped.zoom === MAX_ZOOM && clampView({ lng: 0, lat: -120, zoom: 0.1 }).zoom === MIN_ZOOM);
  ok("ilk görünüm geçerli", JSON.stringify(clampView(INITIAL_VIEW)) === JSON.stringify(INITIAL_VIEW));

  // Ekran ↔ coğrafya gidiş dönüş.
  const r = rng(7);
  let roundTripBad = 0;
  let tested = 0;
  for (let i = 0; i < 400; i++) {
    const view: View = clampView({ lng: r() * 360 - 180, lat: r() * 150 - 75, zoom: 1 + r() * 12 });
    const [w, h] = [320 + Math.round(r() * 200), 320 + Math.round(r() * 200)];
    const projection = makeProjection(view, w, h);
    const target: [number, number] = [view.lng + (r() - 0.5) * (60 / view.zoom), view.lat + (r() - 0.5) * (50 / view.zoom)];
    const xy = projection(target);
    if (!xy) continue;
    tested++;
    const back = lngLatAt(view, w, h, xy[0], xy[1]);
    if (!back || haversineKm(back[1], back[0], target[1], target[0]) > 0.5) roundTripBad++;
  }
  ok("dokunulan nokta geri bulunur (400 görünüm, ≤ 0,5 km sapma)", tested > 300 && roundTripBad === 0, `${tested} denendi, ${roundTripBad} sapma`);
  ok("kürenin dışına dokunmak null döner", lngLatAt(INITIAL_VIEW, 360, 360, 2, 2) === null && lngLatAt(INITIAL_VIEW, 360, 360, 358, 180) === null);
  const center = lngLatAt(INITIAL_VIEW, 360, 360, 180, 180);
  ok("ekranın ortası görünümün merkezidir", !!center && near(center[0], INITIAL_VIEW.lng, 1e-6) && near(center[1], INITIAL_VIEW.lat, 1e-6));
  ok("zoom 1'de küre kadraja sığar (yarıçap ≤ kısa kenarın yarısı)", radiusOf({ ...INITIAL_VIEW, zoom: 1 }, 400, 300) <= 150 && baseRadius(400, 300) > 100);

  // Sürükleme.
  const base: View = { lng: 10, lat: 20, zoom: 1 };
  const right = dragView(base, 40, 0, radiusOf(base, 360, 360));
  const down = dragView(base, 0, 40, radiusOf(base, 360, 360));
  ok("sağa sürüklemek boylamı azaltır (küre parmakla döner)", right.lng < base.lng && right.lat === base.lat);
  ok("aşağı sürüklemek enlemi artırır", down.lat > base.lat && down.lng === base.lng);
  const near1 = dragView(base, 40, 0, radiusOf({ ...base, zoom: 1 }, 360, 360));
  const near8 = dragView({ ...base, zoom: 8 }, 40, 0, radiusOf({ ...base, zoom: 8 }, 360, 360));
  ok("yakınlaştıkça aynı parmak hareketi daha az döndürür", Math.abs(near8.lng - base.lng) < Math.abs(near1.lng - base.lng) / 4);
  ok("kutba yakın yatay sürükleme daha çok boylam döndürür", Math.abs(dragView({ ...base, lat: 80 }, 40, 0, 160).lng - base.lng) > Math.abs(dragView({ ...base, lat: 0 }, 40, 0, 160).lng - base.lng));
  ok("enlem ±88'i aşmaz", dragView({ ...base, lat: 80 }, 0, 9999, 160).lat === 88 && dragView({ ...base, lat: -80 }, 0, -9999, 160).lat === -88);
  ok("zoomView sınırlı", zoomView(base, 1000).zoom === MAX_ZOOM && zoomView(base, 0.001).zoom === MIN_ZOOM && zoomView(base, 2).zoom === 2);

  // Kadraja alma (cevap ekranı): iki uç da kadrajın içinde, çok yakınsa üst sınırda.
  let fitBad = 0;
  let fitCases = 0;
  for (let i = 0; i < 300; i++) {
    const a: [number, number] = [r() * 360 - 180, r() * 140 - 70];
    const km = [30, 150, 600, 2000, 6000, 12000][i % 6];
    const b = destinationPoint(a, r() * 2 * Math.PI, km);
    const view = fitView(a, b);
    const [w, h] = [360, 360];
    const projection = makeProjection(view, w, h);
    const pa = projection(a);
    const pb = projection(b);
    fitCases++;
    if (!pa || !pb) {
      fitBad++;
      continue;
    }
    const inside = (p: number[]) => p[0] > 8 && p[0] < w - 8 && p[1] > 8 && p[1] < h - 8;
    if (!inside(pa) || !inside(pb)) fitBad++;
  }
  ok("fitView iki ucu da kadraja alır (300 çift, 30–12.000 km)", fitBad === 0, `${fitBad}/${fitCases} dışarıda`);
  ok("aynı noktada fitView üst yakınlıkta (≤ 14)", fitView([10, 10], [10, 10]).zoom <= 14 && fitView([10, 10], [10, 10]).zoom > 5);
  ok("çok uzak çiftte yakınlık 1'e iner", fitView([0, 0], [179, 0]).zoom <= 1.2);

  // Uçuş.
  const from: View = { lng: -30, lat: 10, zoom: 1 };
  const to: View = { lng: 120, lat: 40, zoom: 6 };
  const f0 = flyView(from, to, 0);
  const f1 = flyView(from, to, 1);
  ok("uçuş t=0 başlangıç, t=1 hedef", near(f0.lng, from.lng, 1e-6) && near(f0.lat, from.lat, 1e-6) && near(f0.zoom, from.zoom, 1e-9) && near(f1.lng, to.lng, 1e-6) && near(f1.lat, to.lat, 1e-6) && near(f1.zoom, to.zoom, 1e-9));
  let flyOk = true;
  for (let t = 0; t <= 1; t += 0.05) {
    const v = flyView(from, to, t);
    if (!(v.zoom >= MIN_ZOOM && v.zoom <= MAX_ZOOM && Math.abs(v.lat) <= 88 && v.lng >= -180 && v.lng <= 180)) flyOk = false;
  }
  ok("uçuş boyunca görünüm hep geçerli", flyOk);
  ok("uçuş yakınlıkta ani sıçrama yapmaz (komşu adımlarda ≤ ×1,6)", Array.from({ length: 40 }, (_, i) => [flyView(from, to, i / 40).zoom, flyView(from, to, (i + 1) / 40).zoom]).every(([a, b]) => Math.max(a, b) / Math.min(a, b) < 1.6));
  ok("uçuş süresi 420–1300 ms ve uzak sıçrama daha uzun", flyDuration(from, to) >= 420 && flyDuration(from, to) <= 1300 && flyDuration(from, to) > flyDuration(from, { ...from, lng: -29 }));
  ok("aynı görünüme uçuş süresi alt sınırda", flyDuration(from, from) === 420);
  ok("aynı yere uçuşta NaN yok", Number.isFinite(flyView(from, from, 0.5).lng) && Number.isFinite(flyView(from, from, 0.5).lat));

  ok("isFacing: merkez görünür, karşı yüz değil", isFacing({ lng: 0, lat: 0, zoom: 1 }, [10, 10]) && !isFacing({ lng: 0, lat: 0, zoom: 1 }, [180, 0]));
  ok("angleDeg: ekvatorda 90° boylam = 90°", near(angleDeg([0, 0], [90, 0]), 90, 1e-9));
}

/* ------------------------------ ipucu halkası ------------------------------ */
{
  const r = rng(11);
  let distBad = 0;
  for (let i = 0; i < 300; i++) {
    const from: [number, number] = [r() * 360 - 180, r() * 160 - 80];
    const km = 100 + r() * 4000;
    const to = destinationPoint(from, r() * 2 * Math.PI, km);
    if (Math.abs(haversineKm(from[1], from[0], to[1], to[0]) - km) > 0.5) distBad++;
  }
  ok("destinationPoint istenen uzaklıkta (300 deneme, ≤ 0,5 km)", distBad === 0, String(distBad));

  const insideBad: string[] = [];
  const centerBad: string[] = [];
  let distinct = 0;
  const offsets: number[] = [];
  for (const c of CITIES.slice(0, 1500)) {
    const ring = hintCircle([c.lng, c.lat], c.id);
    const d = haversineKm(ring.center[1], ring.center[0], c.lat, c.lng);
    offsets.push(d);
    if (d > ring.radiusKm * 0.56) insideBad.push(c.name);
    if (d < ring.radiusKm * 0.2) centerBad.push(c.name);
    const again = hintCircle([c.lng, c.lat], c.id);
    if (again.center[0] !== ring.center[0] || again.center[1] !== ring.center[1]) distinct++;
  }
  ok("gerçek yer halkanın içinde (merkezden ≤ 0,56 yarıçap)", insideBad.length === 0, insideBad.slice(0, 5).join(", "));
  ok("halkanın merkezi gerçek yerden kayık (≥ 0,2 yarıçap): ipucu cevabı vermez", centerBad.length === 0, centerBad.slice(0, 5).join(", "));
  ok("aynı şehir her seferinde aynı halkayı alır", distinct === 0);
  ok("kayma yönü çeşitli (halka merkezleri hep aynı yönde değil)", new Set(offsets.map((d) => Math.round(d / 100))).size > 3);
  ok("halka yarıçapı 1.500 km", HINT_RADIUS_KM === 1500 && hintCircle([0, 0], 1).radiusKm === 1500);
}

/* ------------------------------- soru seçici ------------------------------- */
{
  const guided = new Set(Object.keys(guideLinks()));
  const ranks = countryRanks(CITIES);
  ok("plan: üç kolay, üç orta, iki zor", TIER_PLAN.join() === "easy,easy,easy,medium,medium,medium,hard,hard" && TIER_PLAN.length === MAP_ROUNDS);

  const a = pickTargets({ seed: 12345, guided });
  const b = pickTargets({ seed: 12345, guided });
  ok("aynı tohum aynı oyunu verir", JSON.stringify(a.map((t) => t.city.id)) === JSON.stringify(b.map((t) => t.city.id)));
  ok("farklı tohum farklı oyun verir", JSON.stringify(a.map((t) => t.city.id)) !== JSON.stringify(pickTargets({ seed: 12346, guided }).map((t) => t.city.id)));

  const days = Array.from({ length: 400 }, (_, i) => `2026-${String(1 + Math.floor(i / 31) % 12).padStart(2, "0")}-${String(1 + (i % 28)).padStart(2, "0")}-${i}`);
  const seeds = new Set(days.map((d) => dailySeed(d, "wangoh.haritada")));
  ok("günlük tohum: 400 gün için 400 farklı tohum", seeds.size === 400);
  ok("günlük tohum Kaç kilometre?'den ayrı bir dizi", dailySeed("2026-10-09", "wangoh.haritada") !== dailySeed("2026-10-09") && dailySeed("2026-10-09") === 3551455644);

  const games = Array.from({ length: 600 }, (_, i) => pickTargets({ seed: i * 7919 + 3, guided }));
  const bad: Record<string, number> = {};
  const hit = (key: string) => (bad[key] = (bad[key] ?? 0) + 1);
  const countries = new Map<string, number>();
  let minPair = Infinity;
  for (const game of games) {
    if (game.length !== MAP_ROUNDS) hit("uzunluk");
    if (new Set(game.map((t) => t.city.id)).size !== MAP_ROUNDS) hit("tekrar");
    if (new Set(game.map((t) => t.city.iso2)).size !== MAP_ROUNDS) hit("aynı ülke");
    game.forEach((t, i) => {
      if (t.tier !== TIER_PLAN[i]) hit("kademe sırası");
      if (targetTier(t.city, ranks.get(t.city.id) ?? 99, guided) !== t.tier) hit("kademe tanımı");
      countries.set(t.city.iso2, (countries.get(t.city.iso2) ?? 0) + 1);
    });
    for (let i = 0; i < game.length; i++)
      for (let j = i + 1; j < game.length; j++) {
        const d = haversineKm(game[i].city.lat, game[i].city.lng, game[j].city.lat, game[j].city.lng);
        minPair = Math.min(minPair, d);
        if (d < MIN_SPREAD_KM - 1e-6) hit("yakın şehirler");
      }
  }
  ok("600 oyun: 8 şehir, tekrar yok, ülke tekrarı yok", !bad["uzunluk"] && !bad["tekrar"] && !bad["aynı ülke"], JSON.stringify(bad));
  ok("600 oyun: kademeler sırasıyla ve tanımına uygun", !bad["kademe sırası"] && !bad["kademe tanımı"], JSON.stringify(bad));
  ok(`600 oyun: şehirler birbirine ≥ ${MIN_SPREAD_KM} km (dünyayı gezer)`, !bad["yakın şehirler"], `en yakın çift ${Math.round(minPair)} km`);

  const tiers = { easy: new Set<number>(), medium: new Set<number>(), hard: new Set<number>() };
  for (const game of games) for (const t of game) tiers[t.tier].add(t.city.id);
  ok("çeşitlilik: 600 oyunda kolay ≥ 35, orta ≥ 120, zor ≥ 100 farklı şehir", tiers.easy.size >= 35 && tiers.medium.size >= 120 && tiers.hard.size >= 100, `${tiers.easy.size}/${tiers.medium.size}/${tiers.hard.size}`);
  ok("hiçbir ülke bir oyunda %25'ten fazla çıkmaz (600 oyunda en çok 150 oyun)", Math.max(...countries.values()) <= 150, String(Math.max(...countries.values())));

  // Kademe tanımları: ünlü şehirler doğru kademede, bilinmeyenler dışarıda.
  const find = (iso2: string, name: string) => CITIES.find((c) => c.iso2 === iso2 && c.name === name)!;
  const tierOf = (iso2: string, name: string) => targetTier(find(iso2, name), ranks.get(find(iso2, name).id) ?? 99, guided);
  ok("Paris, Tokyo, Kahire kolay", tierOf("FR", "Paris") === "easy" && tierOf("JP", "Tokyo") === "easy" && tierOf("EG", "Cairo") === "easy");
  ok("Nairobi ve Atina orta", tierOf("KE", "Nairobi") === "medium" && tierOf("GR", "Athens") === "medium");
  ok("Hvar ve Tallinn zor", tierOf("HR", "Hvar") === "hard" && tierOf("EE", "Tallinn") === "hard");
  ok("il nüfusuyla şişen Çin şehirleri (Puyang, Tai'an) soruya girmez", tierOf("CN", "Puyang") === null && tierOf("CN", "Tai’an") === null);
  const eligible = CITIES.filter((c) => targetTier(c, ranks.get(c.id) ?? 99, guided));
  ok("soruya girebilen şehir sayısı makul (400–700)", eligible.length > 400 && eligible.length < 700, String(eligible.length));
  ok("rehbersiz ve başkent olmayan küçük şehir soruya girmez", CITIES.filter((c) => !c.capital && !guided.has(cityKey(c)) && c.popK < 100).every((c) => targetTier(c, ranks.get(c.id) ?? 99, guided) === null));

  // Havuz daralınca bile fırlatmaz (yalnız birkaç şehirle).
  const tiny = CITIES.filter((c) => c.capital).slice(0, 40);
  let threw = false;
  try {
    pickTargets({ seed: 1, cities: tiny, guided });
  } catch {
    threw = true;
  }
  ok("dar havuzda gevşetilmiş kurallarla yine de 8 şehir ya da açık hata (çökme yok)", threw || pickTargets({ seed: 1, cities: tiny, guided }).length === MAP_ROUNDS);
}

/* ----------------------------- durum makinesi ----------------------------- */
{
  const guided = new Set(Object.keys(guideLinks()));
  const targets = pickTargets({ seed: 99, guided });
  const t0 = targets[0].city;
  let s: State = reducer(INITIAL_STATE, { type: "start", targets, mode: "free" });
  ok("başlangıç: oyun ekranı, ilk tur, işaret yok", s.screen === "playing" && s.index === 0 && s.pin === null && s.phase === "guessing" && !s.hinted);
  ok("işaretsiz tahmin edilemez", reducer(s, { type: "submit" }) === s);
  ok("geçersiz işaret (NaN) yok sayılır", reducer(s, { type: "place", point: [NaN, 3] }) === s);
  s = reducer(s, { type: "place", point: [10, 20] });
  s = reducer(s, { type: "place", point: [t0.lng, t0.lat] });
  ok("işaret istenildiği kadar taşınabilir (son işaret geçerli)", s.pin?.[0] === t0.lng && s.pin?.[1] === t0.lat);
  const hinted = reducer(s, { type: "hint" });
  ok("ipucu bir kez alınır", hinted.hinted && reducer(hinted, { type: "hint" }) === hinted);
  const revealedHint = reducer(hinted, { type: "submit" });
  const revealed = reducer(s, { type: "submit" });
  ok("tam isabet: 0 km, 1000 puan, tam isabet yorumu", revealed.results[0].km === 0 && revealed.results[0].score === 1000 && revealed.results[0].verdict === "perfect" && revealed.phase === "revealed");
  ok("ipuçlu tam isabet 500 puan", revealedHint.results[0].score === 500 && revealedHint.results[0].hinted && revealedHint.results[0].base === 1000);
  ok("çift tahmin tek sonuç sayılır", reducer(revealed, { type: "submit" }) === revealed && revealed.results.length === 1);
  ok("cevaptan sonra işaret ve ipucu değişmez", reducer(revealed, { type: "place", point: [0, 0] }) === revealed && reducer(revealed, { type: "hint" }) === revealed);
  const far = reducer(reducer(s, { type: "place", point: [t0.lng + 20, t0.lat] }), { type: "submit" });
  ok("uzak işaret: uzaklık gerçek kuş uçuşu, puan formüle uyar", far.results[0].km > 500 && far.results[0].score === scoreFromKm(far.results[0].km));
  ok("sıradaki tura geçince işaret ve ipucu sıfırlanır", (() => { const n = reducer(hinted.pin ? revealedHint : revealed, { type: "next" }); return n.index === 1 && n.pin === null && !n.hinted && n.phase === "guessing"; })());
  ok("tahmin edilmeden sıradaki tura geçilemez", reducer(s, { type: "next" }) === s);

  let g: State = reducer(INITIAL_STATE, { type: "start", targets, mode: "daily", dateKey: "2026-10-09" });
  for (let i = 0; i < MAP_ROUNDS; i++) {
    const c = targets[i].city;
    g = reducer(g, { type: "place", point: [c.lng, c.lat] });
    g = reducer(g, { type: "submit" });
    g = reducer(g, { type: "next" });
  }
  ok("8 tur sonunda sonuç ekranı, toplam 8.000", g.screen === "results" && g.results.length === MAP_ROUNDS && g.results.reduce((a, r) => a + r.score, 0) === MAX_GAME_SCORE);
  ok("günün turunda tarih korunur, serbestte null", g.dateKey === "2026-10-09" && reducer(INITIAL_STATE, { type: "start", targets, mode: "free", dateKey: "2026-10-09" }).dateKey === null);
  ok("home başlangıç durumuna döner", reducer(g, { type: "home" }) === INITIAL_STATE);

  // İstatistik: 8 turlu günlük kayıt kabul edilir, 10 turlu (Kaç kilometre?) reddedilir.
  const scores = g.results.map((r) => r.score);
  const rec = recordGame(EMPTY_STATS, { mode: "daily", dateKey: "2026-10-09", total: 8000, scores });
  const parsed = parseStats(JSON.parse(JSON.stringify(rec.stats)), MAP_ROUNDS);
  ok("kayıt: günlük sonuç 8 turla geri okunur", parsed.daily["2026-10-09"]?.scores.length === 8 && parsed.daily["2026-10-09"].total === 8000);
  ok("kayıt: 10 turlu günlük kayıt bu oyunun deposunda yok sayılır", Object.keys(parseStats({ daily: { "2026-10-09": { total: 5000, scores: Array(10).fill(500) } } }, MAP_ROUNDS).daily).length === 0);
  ok("kayıt: varsayılan (10 tur) kaç kilometre davranışı değişmedi", Object.keys(parseStats({ daily: { "2026-10-09": { total: 5000, scores: Array(10).fill(500) } } }).daily).length === 1);
}

/* ------------------------- adresler, çerez, mesajlar ------------------------- */
{
  ok("adres çevirisi: tr /haritada-bul, en /find-on-map, es /encuentra-en-el-mapa", localizePath("/haritada-bul", "tr") === "/haritada-bul" && localizePath("/haritada-bul", "en") === "/find-on-map" && localizePath("/haritada-bul", "es") === "/encuentra-en-el-mapa");
  ok("adres geri çevirisi iç yola döner", internalPath("/find-on-map", "en") === "/haritada-bul" && internalPath("/encuentra-en-el-mapa", "es") === "/haritada-bul");
  ok("paylaşım adresi dile göre", shareUrl("tr", "/haritada-bul") === "wangoh.com/haritada-bul" && shareUrl("en", "/haritada-bul") === "wangoh.com/en/find-on-map" && shareUrl("es", "/haritada-bul") === "wangoh.com/es/encuentra-en-el-mapa");
  ok("paylaşım adresi varsayılanı hâlâ mesafe oyunu", shareUrl("en") === "wangoh.com/en/distance");

  const files = [
    join(__dirname, "..", "src", "app", "[locale]", "(kurumsal)", "cerez-politikasi", "page.tsx"),
    join(__dirname, "..", "src", "components", "legal", "en", "Cookies.tsx"),
    join(__dirname, "..", "src", "components", "legal", "es", "Cookies.tsx"),
  ];
  ok("localStorage anahtarı (wangoh.mapgame.v1) üç dilde çerez politikasında", files.every((f) => readFileSync(f, "utf8").includes("wangoh.mapgame.v1")));
  const hook = readFileSync(join(__dirname, "..", "src", "features", "map-game", "useMapGame.ts"), "utf8");
  ok("oyun kodu yalnız belgelenmiş anahtarı yazar; çerez kullanmaz", /setItem\(STORAGE_KEY/.test(hook) && /STORAGE_KEY = "wangoh\.mapgame\.v1"/.test(hook) && !/document\.cookie/.test(hook) && (hook.match(/localStorage\.setItem/g) ?? []).length === 1);

  type Tree = { [key: string]: string | Tree };
  const load = (locale: string): Tree => JSON.parse(readFileSync(join(__dirname, "..", "messages", `${locale}.json`), "utf8"));
  const get = (tree: Tree, path: string) => path.split(".").reduce<string | Tree | undefined>((t, k) => (typeof t === "object" ? t[k] : undefined), tree);
  const trKeys = Object.keys(load("tr").MapGame as Tree).sort();
  for (const locale of LOCALES) {
    const tree = load(locale);
    const title = get(tree, "Metadata.mapGame.title");
    const description = get(tree, "Metadata.mapGame.description");
    ok(`${locale}: Metadata.mapGame başlık ≤ 60`, typeof title === "string" && title.length > 0 && title.length <= 60, String(title?.length));
    ok(`${locale}: Metadata.mapGame açıklama 120–160 karakter`, typeof description === "string" && description.length >= 120 && description.length <= 160, String((description as string)?.length));
    ok(`${locale}: Nav.mapGame var`, typeof get(tree, "Nav.mapGame") === "string" && String(get(tree, "Nav.mapGame")).length > 0);
    ok(`${locale}: MapGame anahtarları tr ile aynı`, JSON.stringify(Object.keys(tree.MapGame as Tree).sort()) === JSON.stringify(trKeys));
    const credit = String(get(tree, "MapGame.dataCredit"));
    ok(`${locale}: atıf GeoNames (CC BY 4.0) ve Natural Earth içeriyor`, /GeoNames<\/geo>/.test(credit) && /CC BY 4\.0/.test(credit) && /Natural Earth<\/ne>/.test(credit));
    const howScore = String(get(tree, "MapGame.howScore"));
    ok(`${locale}: puan açıklaması gerçek eşiği (${FULL_SCORE_KM} km) söylüyor`, howScore.includes(String(FULL_SCORE_KM)));
    const desc = String(description);
    ok(`${locale}: açıklama tur sayısını (${MAP_ROUNDS}) doğru söylüyor`, desc.includes(String(MAP_ROUNDS)));
  }
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
