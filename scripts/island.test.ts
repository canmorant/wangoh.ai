/**
 * Pencerenin Dynamic Island çerçevesine dönüşümü (src/lib/islandMorph.ts).
 * Çalıştır:  npx tsx scripts/island.test.ts
 */
import { smooth } from "../src/lib/camera";
import { ISLAND, islandCenterY } from "../src/lib/island";
import { ISLAND_BANDS, WINDOW_BANDS, morphShape, type MorphFrame } from "../src/lib/islandMorph";

let pass = 0;
let fail = 0;
const ok = (name: string, cond: boolean, detail = "") => {
  if (cond) pass++;
  else fail++;
  console.log(`${cond ? "  PASS" : "  FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
};
const near = (a: number, b: number, eps = 1e-6) => Math.abs(a - b) <= eps;

// iPhone 15 Pro: 393×852, üst güvenli alan 59; 16 Pro Max: 440×956, 62.
for (const [viewW, viewH, safeTop] of [[393, 852, 59], [440, 956, 62], [402, 874, 62]] as const) {
  const f: MorphFrame = {
    viewW,
    viewH,
    glassW: Math.min(332, viewW * 0.6, viewH * 0.44),
    dockY: islandCenterY(safeTop),
  };
  const tag = `${viewW}×${viewH}`;
  const start = morphShape(0, f);
  const end = morphShape(1, f);

  ok(`${tag}: m=0 pencerenin kendisi (genişlik, yükseklik, yarıçap, merkez)`,
    near(start.w, f.glassW) && near(start.h, f.glassW / 0.74) && near(start.r, 0.42 * f.glassW, 1e-4) && near(start.cy, viewH / 2));
  ok(`${tag}: m=0 halkalar pencere oranlarında`, start.bands.every((b, i) => near(b, WINDOW_BANDS[i] * f.glassW, 1e-9)));
  ok(`${tag}: m=1 ada çerçevesi (128×39, tam hap, adanın ortası)`,
    near(end.w, ISLAND.W) && near(end.h, ISLAND.H) && near(end.r, ISLAND.H / 2) && near(end.cy, f.dockY));
  ok(`${tag}: m=1 halkalar adadaki ölçülerde`, end.bands.every((b, i) => near(b, ISLAND_BANDS[i], 1e-9)));

  let mono = true;
  let radiusOk = true;
  let aspectGrows = true;
  let moves = true;
  let prev = start;
  for (let i = 1; i <= 200; i++) {
    const s = morphShape(i / 200, f);
    // Her adımda küçülür (genişlik, yükseklik, halkalar), hiçbir adımda büyümez.
    if (s.w > prev.w + 1e-9 || s.h > prev.h + 1e-9 || s.bands.some((b, k) => b > prev.bands[k] + 1e-9)) mono = false;
    if (s.r > Math.min(s.w, s.h) / 2 + 1e-9) radiusOk = false;
    if (s.w / s.h < prev.w / prev.h - 1e-9) aspectGrows = false;
    if (s.cy > prev.cy + 1e-9) moves = false;
    prev = s;
  }
  ok(`${tag}: genişlik, yükseklik ve halkalar her adımda küçülüyor`, mono);
  ok(`${tag}: köşe yarıçapı kısa kenarın yarısını aşmıyor`, radiusOk);
  ok(`${tag}: şekil her adımda biraz daha yatık (ada oranına yaklaşıyor)`, aspectGrows);
  ok(`${tag}: şekil yalnız yukarı gidiyor`, moves);

  // "Daha küçülürken bile ada şekline benzesin": yolun yarısında en/boy oranı en az 1,5.
  const half = morphShape(0.5, f);
  ok(`${tag}: m=0,5'te şekil yatık (en/boy ≥ 1,5)`, half.w / half.h >= 1.5, `${(half.w / half.h).toFixed(2)}`);
  // Kaydırma adım adım ilerlerken (WindowHero'daki m = smooth(0,03; 0,88; q)) hiçbir adımda
  // boyutun ani küçülmesi/büyümesi yok: 400 eşit kaydırma adımında en büyük değişim %2'nin altında.
  let step = 0;
  let a = start;
  for (let i = 1; i <= 400; i++) {
    const s2 = morphShape(smooth(0.03, 0.88, i / 400), f);
    step = Math.max(step, 1 - s2.h / a.h, 1 - s2.w / a.w);
    a = s2;
  }
  ok(`${tag}: kaydırma adımlarında ani küçülme/büyüme yok`, step < 0.02, `en büyük adım %${(step * 100).toFixed(2)}`);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
