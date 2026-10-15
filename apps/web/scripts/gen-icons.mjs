/**
 * Uygulama ikonlarını üretir.
 *
 * Sitenin kimliği uçak penceresi, o yüzden ikon da o şekil: lacivert zemin
 * üzerinde altın rengi dikey yuvarlatılmış pencere, içinde ufuk çizgisi.
 * 192px'te bile okunur, jenerik bir "W" harfinden çok daha ayırt edici.
 *
 * Çalıştır:  node scripts/gen-icons.mjs
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT = join(ROOT, "public/icons");

const NAVY = "#0a0e1a";
const GOLD = "#c8a45e";

/**
 * @param size  kenar uzunluğu
 * @param inset pencerenin kenarlardan boşluğu (maskable ikonlar için daha çok:
 *              Android ikonun dış %20'sini kırpabiliyor)
 */
function svg(size, inset) {
  const s = size;
  const w = s * (1 - inset * 2) * 0.74; // pencere eni
  const h = s * (1 - inset * 2); // pencere boyu
  const x = (s - w) / 2;
  const y = (s - h) / 2;
  const r = w * 0.42;
  const stroke = Math.max(2, s * 0.045);
  const horizon = y + h * 0.62;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <rect width="${s}" height="${s}" fill="${NAVY}"/>
  <defs>
    <clipPath id="win">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ry="${r}"/>
    </clipPath>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2b3a52"/>
      <stop offset="1" stop-color="#4a6076"/>
    </linearGradient>
  </defs>
  <g clip-path="url(#win)">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#sky)"/>
    <rect x="${x}" y="${horizon}" width="${w}" height="${y + h - horizon}" fill="#1b2b22"/>
    <circle cx="${s * 0.5}" cy="${horizon - h * 0.16}" r="${w * 0.13}" fill="${GOLD}" opacity="0.9"/>
  </g>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ry="${r}"
        fill="none" stroke="${GOLD}" stroke-width="${stroke}"/>
</svg>`;
}

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const targets = [
  { name: "icon-192.png", size: 192, inset: 0.16 },
  { name: "icon-512.png", size: 512, inset: 0.16 },
  // Maskable: Android ikonu daire/kare maskeye kırpar, güvenli alan içeride kalmalı.
  { name: "icon-maskable-192.png", size: 192, inset: 0.26 },
  { name: "icon-maskable-512.png", size: 512, inset: 0.26 },
  // iOS ana ekran ikonu — şeffaflık desteklemiyor, zemin zaten dolu.
  { name: "apple-touch-icon.png", size: 180, inset: 0.16 },
];

for (const t of targets) {
  const buf = await sharp(Buffer.from(svg(t.size, t.inset))).png().toBuffer();
  writeFileSync(join(OUT, t.name), buf);
  console.log(`  ${t.name.padEnd(26)} ${t.size}x${t.size}  ${(buf.length / 1024).toFixed(1)} KB`);
}

// Tarayıcı sekmesi için SVG favicon (ölçeklenebilir, keskin).
writeFileSync(join(ROOT, "public/icon.svg"), svg(64, 0.12));
console.log("  icon.svg");
console.log("\nikonlar public/icons/ altına yazıldı\n");
