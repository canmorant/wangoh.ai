/**
 * Kodlama ayarı denemesi.
 *
 * Paket boyutunu düşürmek için hangi format/kalite/genişlik kombinasyonunun
 * ne kazandırdığını ÖLÇER. Orijinal kaynaklardan indirir — mevcut WebP'lerden
 * yeniden kodlamak kayıplı üstüne kayıplı olur ve yanıltıcı sonuç verir.
 *
 * Kalite ölçüsü olarak orijinale karşı PSNR hesaplanır (dB, yüksek = iyi).
 * Fotoğrafta ~38 dB üstü gözle ayırt edilemez kabul edilir.
 *
 * Çalıştır:  node scripts/images-experiment.mjs
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const UA = "WangohImageExperiment/1.0 (https://wangoh.com; travel guide site)";
const SAMPLE = 10;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const VARIANTS = [
  { ad: "webp q78 @1280  (şu anki)", fmt: "webp", q: 78, w: 1280 },
  { ad: "webp q70 @1280", fmt: "webp", q: 70, w: 1280 },
  { ad: "webp q78 @1080", fmt: "webp", q: 78, w: 1080 },
  { ad: "avif q58 @1280", fmt: "avif", q: 58, w: 1280 },
  { ad: "avif q50 @1280", fmt: "avif", q: 50, w: 1280 },
  { ad: "avif q58 @1080", fmt: "avif", q: 58, w: 1080 },
  { ad: "avif q50 @1080", fmt: "avif", q: 50, w: 1080 },
  { ad: "avif q45 @1024", fmt: "avif", q: 45, w: 1024 },
];

/** Ortalama kare hatadan PSNR. Referans, aynı genişliğe indirgenmiş orijinal. */
async function psnr(refBuf, testBuf, width) {
  const opts = { width, fit: "inside", withoutEnlargement: true };
  const a = await sharp(refBuf, { failOn: "none" }).resize(opts).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const b = await sharp(testBuf, { failOn: "none" }).resize(opts).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const n = Math.min(a.data.length, b.data.length);
  if (!n) return 0;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const d = a.data[i] - b.data[i];
    sum += d * d;
  }
  const mse = sum / n;
  return mse === 0 ? 99 : 10 * Math.log10((255 * 255) / mse);
}

const manifest = JSON.parse(readFileSync(join(ROOT, "scripts/.image-manifest.json"), "utf8"));
const live = manifest.filter((m) => m.health.ok);

// Eşit aralıklı örnekleme — hep aynı ülkenin görselleri seçilmesin.
const step = Math.max(1, Math.floor(live.length / SAMPLE));
const sample = Array.from({ length: SAMPLE }, (_, i) => live[i * step]).filter(Boolean);

console.log("\nKODLAMA DENEYİ\n" + "=".repeat(72));
console.log(`örnek: ${sample.length} görsel, orijinal kaynaklardan indiriliyor\n`);

const originals = [];
for (const s of sample) {
  try {
    const res = await fetch(s.url, { headers: { "User-Agent": UA } });
    if (!res.ok) continue;
    originals.push(Buffer.from(await res.arrayBuffer()));
    process.stdout.write(`\r  indirilen: ${originals.length}/${sample.length}`);
    await sleep(250);
  } catch {
    /* atla */
  }
}
console.log("\n");

const results = [];
for (const v of VARIANTS) {
  let bytes = 0;
  let psnrSum = 0;
  let count = 0;
  for (const buf of originals) {
    const pipeline = sharp(buf, { failOn: "none" }).resize({ width: v.w, withoutEnlargement: true });
    const out =
      v.fmt === "avif"
        ? await pipeline.avif({ quality: v.q, effort: 4 }).toBuffer()
        : await pipeline.webp({ quality: v.q }).toBuffer();
    bytes += out.length;
    psnrSum += await psnr(buf, out, v.w);
    count++;
  }
  results.push({ ...v, bytes, psnr: psnrSum / count });
  console.log(
    `  ${v.ad.padEnd(26)} ${(bytes / 1024).toFixed(0).padStart(6)} KB   PSNR ${(psnrSum / count).toFixed(1)} dB`
  );
}

const base = results[0];
console.log("\n" + "=".repeat(72));
console.log("344 GÖRSEL İÇİN TAHMİNİ PAKET BOYUTU\n");
for (const r of results) {
  const total = (r.bytes / originals.length) * 344;
  const delta = ((r.bytes / base.bytes - 1) * 100).toFixed(0);
  console.log(
    `  ${r.ad.padEnd(26)} ${(total / 1e6).toFixed(1).padStart(5)} MB   ${
      delta > 0 ? "+" : ""
    }${delta}%   PSNR ${r.psnr.toFixed(1)} dB`
  );
}
console.log();
