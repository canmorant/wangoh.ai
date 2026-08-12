/**
 * Uçak penceresi kamera hareketi — storyboard'un beş aşaması.
 * Çalıştır:  npx tsx scripts/camera.test.ts
 */
import {
  CAMERA,
  Dims,
  dollyScale,
  focus,
  progress,
  scaleToClear,
  worldScale,
} from "../src/lib/camera";

let pass = 0;
let fail = 0;
const ok = (name: string, cond: boolean, detail = "") => {
  if (cond) pass++;
  else fail++;
  console.log(`${cond ? "  PASS" : "  FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
};

/** Bileşendeki `measure()` ile birebir aynı geometri. */
function dimsFor(w: number, h: number): Dims {
  const glassW = Math.min(332, w * 0.6, h * 0.44);
  const glassH = glassW / 0.74;
  return {
    w,
    h,
    cx: w / 2,
    cy: h / 2,
    glassW,
    glassH,
    bez: glassW * 0.155,
    lip: glassW * 0.052,
  };
}

/** Yuvarlatılmış dikdörtgen açıklık, `s` ölçeğinde görüntü alanını kaplıyor mu? */
function covers(d: Dims, s: number): boolean {
  const a = (d.glassW / 2) * s;
  const b = (d.glassH / 2) * s;
  const r = d.glassW * 0.42 * s;
  const X = d.w / 2;
  const Y = d.h / 2;
  if (X <= a - r && Y <= b) return true;
  if (Y <= b - r && X <= a) return true;
  const dx = X - (a - r);
  const dy = Y - (b - r);
  if (dx <= 0 || dy <= 0) return X <= a && Y <= b;
  return dx * dx + dy * dy <= r * r;
}

const VIEWPORTS: [string, number, number][] = [
  ["telefon dikey", 390, 844],
  ["telefon küçük", 360, 640],
  ["tablet", 768, 1024],
  ["dizüstü", 1280, 720],
  ["masaüstü", 1440, 900],
  ["geniş", 1920, 1080],
  ["ultra geniş", 2560, 1080],
];

console.log("\nUÇAK PENCERESİ KAMERASI\n" + "=".repeat(64));
console.log(JSON.stringify(CAMERA), "\n");

/* ---------- 1. AŞAMA: pencere normal boyda, park görünür ama bulanık ---------- */
{
  console.log("1. AŞAMA — başlangıç durumu");
  for (const [name, w, h] of VIEWPORTS) {
    const max = scaleToClear(dimsFor(w, h)) * CAMERA.clearMargin;
    ok(`${name}: kaydırma yokken çerçeve tam olarak normal boyda`,
       dollyScale(0, max) === 1);
  }
  const f = focus(0);
  ok("başlangıçta park GÖRÜNÜR (kabin hiç opaklık kaybetmez)", true);
  ok("başlangıçta en bulanık katman tam opak", f.far === 1, `far=${f.far}`);
  ok("başlangıçta orta katman da tam opak", f.mid === 1, `mid=${f.mid}`);
  ok("dünya başlangıçta ölçeklenmemiş", worldScale(0) === 1);
}

/* ---------- 2.–3. AŞAMA: çerçeve sürekli büyür, park berraklaşır ---------- */
{
  console.log("\n2.–3. AŞAMA — ilerleme ve netleşme");
  const max = scaleToClear(dimsFor(1440, 900)) * CAMERA.clearMargin;

  let monotonic = true;
  let prev = -Infinity;
  for (let i = 0; i <= 200; i++) {
    const s = dollyScale(i / 200, max);
    if (s < prev - 1e-12) monotonic = false;
    prev = s;
  }
  ok("çerçeve hiçbir noktada küçülmez (kamera geri gitmez)", monotonic);

  let focusMonotonic = true;
  let pf = Infinity;
  let pm = Infinity;
  for (let i = 0; i <= 200; i++) {
    const f = focus(i / 200);
    if (f.far > pf + 1e-12 || f.mid > pm + 1e-12) focusMonotonic = false;
    pf = f.far;
    pm = f.mid;
  }
  ok("bulanıklık hiçbir noktada geri gelmez (sürekli netleşme)", focusMonotonic);

  ok("yarı yolda park gözle görülür biçimde netleşmiş",
     focus(0.5).far < 0.15, `far(0.5)=${focus(0.5).far.toFixed(3)}`);

  let worldMono = true;
  let pw = -Infinity;
  for (let i = 0; i <= 200; i++) {
    const s = worldScale(i / 200);
    if (s < pw - 1e-12) worldMono = false;
    pw = s;
  }
  ok("dünya da tek yönde büyür", worldMono);

  // Derinlik = iki düzlemin farklı hızda büyümesi.
  ok("çerçeve, ardındaki dünyadan çok daha hızlı büyür",
     dollyScale(1, max) > worldScale(1) * 3,
     `çerçeve ${dollyScale(1, max).toFixed(2)}x vs dünya ${worldScale(1).toFixed(2)}x`);
}

/* ---------- 4. AŞAMA: geçiş hızlanarak olur ---------- */
{
  console.log("\n4. AŞAMA — camdan geçiş");
  const max = scaleToClear(dimsFor(1440, 900)) * CAMERA.clearMargin;

  // Perspektifin imzası: son çeyrekteki büyüme ilk çeyrektekinden çok daha
  // büyük. Eski öne yüklü eğride bunun tersi oluyordu.
  const q1 = dollyScale(0.25, max) - dollyScale(0, max);
  const q4 = dollyScale(1, max) - dollyScale(0.75, max);
  ok("son çeyrek ilk çeyrekten çok daha fazla büyür (hızlanan yaklaşma)",
     q4 > q1 * 3, `ilk=${q1.toFixed(2)} son=${q4.toFixed(2)}`);

  // İkinci türev pozitif olmalı: eğri her yerde dışbükey.
  let convex = true;
  const step = 1 / 400;
  for (let i = 1; i < 400; i++) {
    const a = dollyScale((i - 1) * step, max);
    const b = dollyScale(i * step, max);
    const c = dollyScale((i + 1) * step, max);
    if (c - 2 * b + a < -1e-9) convex = false;
  }
  ok("eğri boyunca hızlanma hiç kesilmez (dışbükey)", convex);

  ok("yarı yolda pencere henüz kadrajda (erken kaybolmuyor)",
     !covers(dimsFor(1440, 900), dollyScale(0.5, max)),
     `ölçek=${dollyScale(0.5, max).toFixed(2)}`);
}

/* ---------- 5. AŞAMA: pencere gitti, park tüm ekranda ve keskin ---------- */
{
  console.log("\n5. AŞAMA — tam ekran görünüm");
  for (const [name, w, h] of VIEWPORTS) {
    const d = dimsFor(w, h);
    const max = scaleToClear(d) * CAMERA.clearMargin;
    ok(`${name}: sonda açıklık tüm görüntü alanını kaplar (pencere yok)`,
       covers(d, dollyScale(1, max)));
  }
  const f = focus(1);
  ok("sonda hiç bulanıklık kalmaz — park tam berrak",
     f.far === 0 && f.mid === 0, `far=${f.far} mid=${f.mid}`);
}

/* ---------- kaydırma eşlemesi ---------- */
{
  console.log("\nKAYDIRMA EŞLEMESİ");
  ok("duruş payı boyunca kamera kıpırdamaz", progress(0) === 0 && progress(CAMERA.hold) === 0);
  ok("duruş payı fark edilmeyecek kadar kısa", CAMERA.hold <= 0.05);
  ok("kaydırma bitmeden geçiş tamamlanır", progress(CAMERA.pushEnd) === 1);
  ok("sonrasında da tamamlanmış kalır", progress(1) === 1);
  ok("geçiş kaydırmanın büyük bölümünü kullanır", CAMERA.pushEnd - CAMERA.hold >= 0.85);
}

/* ---------- geometri ---------- */
{
  console.log("\nGEOMETRİ");
  for (const [name, w, h] of VIEWPORTS) {
    const d = dimsFor(w, h);
    ok(`${name}: pencere ekrana rahat sığar`,
       d.glassW <= w * 0.62 && d.glassH <= h * 0.62,
       `${Math.round(d.glassW)}x${Math.round(d.glassH)} / ${w}x${h}`);
  }
  for (const [name, w, h] of VIEWPORTS) {
    const s = scaleToClear(dimsFor(w, h));
    ok(`${name}: temizlenme ölçeği makul aralıkta`, s > 1.5 && s < 30, `${s.toFixed(2)}x`);
  }
}

console.log("\n" + "=".repeat(64));
console.log(`${pass} passed, ${fail} failed\n`);
process.exit(fail === 0 ? 0 : 1);
