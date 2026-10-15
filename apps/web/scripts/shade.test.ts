/**
 * Uçak penceresi perdesi — sürükleme sınırları, tıklama ve kayma davranışı.
 * Çalıştır:  npx tsx scripts/shade.test.ts
 */
import {
  clamp01,
  dragDelta,
  dragTo,
  glideStep,
  initialGlide,
  resolveClick,
  SHADE_CONFIG,
} from "../src/lib/shade";

let pass = 0;
let fail = 0;
const ok = (name: string, cond: boolean, detail = "") => {
  if (cond) pass++;
  else fail++;
  console.log(`${cond ? "  PASS" : "  FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
};

console.log("\nPENCERE PERDESİ\n" + "=".repeat(60));
console.log(JSON.stringify({ ...SHADE_CONFIG, spring: undefined }), "\n");

/* ----------------------------- sınırlar ------------------------------ */
{
  ok("tam açık konum korunur", dragTo(0, 0) === 0);
  ok("tam kapalı konum korunur", dragTo(1, 0) === 1);
  ok("aradaki konumlar birebir geçer", Math.abs(dragTo(0.3, 0.2) - 0.5) < 1e-12);

  // Açıkça istenen davranış: perde iki ucun ötesine ASLA geçmez.
  ok("tam açığın üstüne çıkamaz", dragTo(0.1, -5) === 0);
  ok("tam kapalının altına inemez", dragTo(0.9, 5) === 1);

  let bounded = true;
  for (let s = 0; s <= 1; s += 0.05) {
    for (let d = -4; d <= 4; d += 0.1) {
      const v = dragTo(s, d);
      if (v < 0 || v > 1) bounded = false;
    }
  }
  ok("her başlangıç ve mesafe için 0–1 arasında kalır", bounded);
  ok("clamp01 uçları doğru kesiyor", clamp01(-3) === 0 && clamp01(3) === 1 && clamp01(0.4) === 0.4);
}

/* --------------------- imleci birebir takip ------------------------- */
{
  // Sürükleme sırasında yay yok: ekran mesafesi doğrudan orana çevrilir.
  // Açıklığın yarısı kadar sürüklemek perdeyi tam yarım kapatmalı.
  const h = 400;
  ok("açıklığın yarısı = perdenin yarısı", Math.abs(dragTo(0, dragDelta(200, h, 1)) - 0.5) < 1e-12);
  ok("tam yükseklik = tam kapanma", dragTo(0, dragDelta(400, h, 1)) === 1);
  ok("yukarı sürüklemek açar", dragTo(1, dragDelta(-400, h, 1)) === 0);

  // Kamera yakınlaşsa da tutuş 1:1 kalmalı.
  ok(
    "kamera ölçeğinden bağımsız",
    Math.abs(dragDelta(100, h, 4) - dragDelta(25, h, 1)) < 1e-12,
    `${dragDelta(100, h, 4)} vs ${dragDelta(25, h, 1)}`
  );
  ok("sıfır ölçek bölme hatası vermez", Number.isFinite(dragDelta(50, h, 0)));

  // Monotonluk: aşağı çekmek her zaman kapatma yönünde ilerletir.
  let mono = true;
  let prev = -1;
  for (let px = 0; px <= 400; px += 5) {
    const v = dragTo(0, dragDelta(px, h, 1));
    if (v < prev) mono = false;
    prev = v;
  }
  ok("aşağı sürükleme tek yönde ilerler", mono);
}

/* ------------------------- tıkla aç/kapat ---------------------------- */
{
  ok("açıkken tıklamak kapatır", resolveClick(0) === 1);
  ok("kapalıyken tıklamak açar", resolveClick(1) === 0);
  ok("başlangıç konumundan tıklamak kapatır", resolveClick(SHADE_CONFIG.initial) === 1);
  ok("iki tıklama döngüyü tamamlar", resolveClick(resolveClick(0)) === 0);
  ok(
    "tıklama sonucu her zaman bir uçtur",
    [0, 0.2, 0.5, 0.8, 1].every((v) => [0, 1].includes(resolveClick(v)))
  );
}

/* --------------------- bırakınca yerinde kalır ----------------------- */
{
  // Şart: "kullanıcı bıraktığında perde bulunduğu yerde kalmalı." Yani uçlara
  // yapışma yok — yalnızca hıza bağlı kısa bir süzülme.
  const settle = (start: number, velPerMs: number) => {
    let v = start;
    let vel = initialGlide(velPerMs);
    for (let i = 0; i < 2000; i++) {
      const r = glideStep(v, vel);
      v = r.value;
      vel = r.velocity;
      if (r.done) break;
    }
    return v;
  };

  ok("hareketsiz bırakınca hiç kaymaz", settle(0.5, 0) === 0.5);
  ok("orta konumda kalır, uca yapışmaz", (() => {
    const v = settle(0.5, 0.0005);
    return v > 0.5 && v < 0.85;
  })(), `0.5 -> ${settle(0.5, 0.0005).toFixed(3)}`);

  ok("kayma her zaman 0–1 içinde biter", (() => {
    for (let i = 0; i < 3000; i++) {
      const v = settle(Math.random(), (Math.random() - 0.5) * 0.02);
      if (v < 0 || v > 1) return false;
    }
    return true;
  })());

  ok("kayma sonludur (sonsuz döngü yok)", (() => {
    let v = 0.5;
    let vel = initialGlide(0.02);
    let frames = 0;
    while (frames < 5000) {
      const r = glideStep(v, vel);
      v = r.value;
      vel = r.velocity;
      frames++;
      if (r.done) break;
    }
    return frames < 5000;
  })());

  const dist = Math.abs(settle(0.5, 0.05) - 0.5);
  ok("sert savurma bile sınırlı mesafe kaydırır", dist <= SHADE_CONFIG.maxGlide + 1e-9,
     `${dist.toFixed(3)} <= ${SHADE_CONFIG.maxGlide}`);

  ok("aşağı savurma kapatma yönünde gider", settle(0.4, 0.01) > 0.4);
  ok("yukarı savurma açma yönünde gider", settle(0.6, -0.01) < 0.6);
}

/* --------------------------- tıklama eşiği ---------------------------- */
{
  ok("eşik makul bir piksel değeri", SHADE_CONFIG.dragSlop >= 2 && SHADE_CONFIG.dragSlop <= 10);
  ok("başlangıç konumu tutamağı görünür bırakır",
     SHADE_CONFIG.initial > 0 && SHADE_CONFIG.initial < 0.5);
}

console.log("\n" + "=".repeat(60));
console.log(`${pass} passed, ${fail} failed\n`);
process.exit(fail === 0 ? 0 : 1);
