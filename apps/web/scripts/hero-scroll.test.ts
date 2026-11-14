/**
 * Pencere sahnesinin kaydırma mesafesi: en çok iki kaydırmada pencereden geçilir.
 * Çalıştır:  npx tsx scripts/hero-scroll.test.ts
 */
import { CAMERA } from "../src/lib/camera";
import {
  HERO_STAGE_HEIGHT,
  WHEEL,
  nextTarget,
  scrollToWheel,
  wheelDelta,
  wheelToScroll,
} from "../src/lib/heroScroll";

let pass = 0;
let fail = 0;
const ok = (name: string, cond: boolean, detail = "") => {
  if (cond) pass++;
  else fail++;
  if (!cond) console.log(`  FAIL  ${name}${detail ? `  — ${detail}` : ""}`);
};
const near = (a: number, b: number, eps = 1e-6) => Math.abs(a - b) < eps;

/* ---------- sahne yüksekliği ---------- */
const heights = [...HERO_STAGE_HEIGHT.matchAll(/h-\[(\d+)(svh|vh)\]/g)].map((m) => Number(m[1]));
ok("iki kırılım için yükseklik tanımlı", heights.length === 2, HERO_STAGE_HEIGHT);
for (const h of heights) {
  // Kaydırma mesafesi = yükseklik − 100. Bir ekran boyunu geçmezse dokunmatikte iki
  // yarım ekranlık sürükleme pencereden (ilerleme CAMERA.pushEnd) geçirir.
  ok(`mesafe en çok bir ekran (${h})`, h - 100 <= 100 && h - 100 >= 60, String(h - 100));
  ok(`iki yarım ekran sürükleme pencereden geçirir (${h})`, 100 / (h - 100) >= CAMERA.pushEnd);
}

/* ---------- tekerlek eşlemesi ---------- */
for (const [start, travel] of [
  [0, 900],
  [0, 675],
  [0, 1440],
  [120, 800],
] as const) {
  const end = start + travel;
  const tag = `(${start}, ${travel})`;

  // Fare tekerleği: çentik başına 100 px.
  const one = nextTarget(start, 100, start, travel);
  const two = nextTarget(one, 100, start, travel);
  ok(`bir çentik yarı yol ${tag}`, near(one, start + travel / 2), String(one));
  ok(`iki çentik sahnenin sonu ${tag}`, near(two, end), String(two));
  ok(`iki çentik pencereden geçirir ${tag}`, (two - start) / travel >= CAMERA.pushEnd);

  // Geri: iki çentik başa döndürür.
  ok(`iki çentik geri başa döner ${tag}`, near(nextTarget(nextTarget(end, -100, start, travel), -100, start, travel), start));

  // Sahnenin dışı bire bir.
  ok(`sonun ötesi bire bir ${tag}`, near(nextTarget(end + 50, 100, start, travel), end + 150));
  ok(`başın öncesi bire bir ${tag}`, near(nextTarget(start, -40, start, travel), start - 40));

  // Sınırı aşan hareket kaybolmaz: artan kısım bire bir devam eder.
  ok(`taşan kısım devam eder ${tag}`, near(nextTarget(start, WHEEL.full + 300, start, travel), end + 300));
  ok(`yukarı taşan kısım devam eder ${tag}`, near(nextTarget(end + 30, -(30 + WHEEL.full / 2), start, travel), start + travel / 2));

  // Sürekli (izleme dörtgeni): küçük adımların toplamı tek adımla aynı yere varır.
  let y: number = start;
  for (let i = 0; i < 80; i++) y = nextTarget(y, 5, start, travel);
  ok(`küçük adımlar toplanır ${tag}`, near(y, nextTarget(start, 400, start, travel), 1e-3), String(y));

  // Eşleme tersinir ve artan.
  let monotone = true;
  let invertible = true;
  let prev = -Infinity;
  for (let v = -300; v <= 700; v += 7) {
    const pos = wheelToScroll(v, start, travel);
    if (pos <= prev) monotone = false;
    prev = pos;
    if (!near(scrollToWheel(pos, start, travel), v, 1e-6)) invertible = false;
  }
  ok(`eşleme artan ${tag}`, monotone);
  ok(`eşleme tersinir ${tag}`, invertible);
}

// Çok kısa sahnede (mesafe < WHEEL.full) tekerlek yavaşlatılmaz.
ok("kısa sahnede kazanç 1", near(nextTarget(0, 100, 0, 150), 100));

/* ---------- tekerlek olayının karşılığı ---------- */
ok("Chrome/Windows çentiği olduğu gibi", wheelDelta({ deltaY: 100, deltaMode: 0, wheelDeltaY: -120 }, 900) === 100);
ok("büyük çentik küçültülmez", wheelDelta({ deltaY: 300, deltaMode: 0, wheelDeltaY: -360 }, 900) === 300);
ok("macOS'ta küçük bildirilen çentik tamamlanır", wheelDelta({ deltaY: 4, deltaMode: 0, wheelDeltaY: -120 }, 900) === WHEEL.notch);
ok("yukarı çentik işaretini korur", wheelDelta({ deltaY: -4, deltaMode: 0, wheelDeltaY: 120 }, 900) === -WHEEL.notch);
ok("Firefox satır birimi çentik sayılır", wheelDelta({ deltaY: 3, deltaMode: 1 }, 900) === WHEEL.notch);
ok("Firefox yukarı", wheelDelta({ deltaY: -3, deltaMode: 1 }, 900) === -WHEEL.notch);
ok("izleme dörtgeni olduğu gibi", wheelDelta({ deltaY: 7, deltaMode: 0, wheelDeltaY: -21 }, 900) === 7);
ok("wheelDeltaY yoksa olduğu gibi", wheelDelta({ deltaY: 12.5, deltaMode: 0 }, 900) === 12.5);
ok("sıfır hareket sıfır", wheelDelta({ deltaY: 0, deltaMode: 0, wheelDeltaY: 0 }, 900) === 0);
ok("iki çentik her sistemde tamamı eder", 2 * WHEEL.notch >= WHEEL.full);

console.log(`${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
