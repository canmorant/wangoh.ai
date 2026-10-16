/**
 * Mobil uygulama ikonlarını ve açılış görselini üretir.
 *
 * Çizim, web'in apps/web/scripts/gen-icons.mjs betiğiyle aynıdır (uçak penceresi: lacivert zemin,
 * altın çerçeve, ufuk çizgisi); web ikonlarıyla aynı marka kimliği korunur. Web'deki betik yalnız
 * 512px'e kadar üretir, mağaza ikonları için burada 1024px'den çizilir.
 *
 * Çalıştır (apps/mobile içinde):  node scripts/gen-assets.mjs
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const OUT = fileURLToPath(new URL("../assets", import.meta.url));

const NAVY = "#0a0e1a";
const GOLD = "#c8a45e";

/**
 * @param size   kenar uzunluğu
 * @param inset  pencerenin kenarlardan boşluğu (oran)
 * @param opts.background  true: lacivert zemin; false: şeffaf (uyarlanabilir ikon ön planı, açılış)
 * @param opts.mono        true: tek renk silüet (Android temalı ikon; sistem boyar)
 */
function svg(size, inset, { background = true, mono = false } = {}) {
  const s = size;
  const w = s * (1 - inset * 2) * 0.74;
  const h = s * (1 - inset * 2);
  const x = (s - w) / 2;
  const y = (s - h) / 2;
  const r = w * 0.42;
  const stroke = Math.max(2, s * 0.045);
  const horizon = y + h * 0.62;

  const bg = background ? `<rect width="${s}" height="${s}" fill="${NAVY}"/>` : "";

  if (mono) {
    // Temalı ikon yalnız alfa kanalına bakar: çerçeve, ufuk ve güneş dolu beyaz.
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <defs>
    <clipPath id="win"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ry="${r}"/></clipPath>
  </defs>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ry="${r}"
        fill="none" stroke="#ffffff" stroke-width="${stroke}"/>
  <g clip-path="url(#win)">
    <rect x="${x}" y="${horizon}" width="${w}" height="${y + h - horizon}" fill="#ffffff"/>
    <circle cx="${s * 0.5}" cy="${horizon - h * 0.16}" r="${w * 0.13}" fill="#ffffff"/>
  </g>
</svg>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  ${bg}
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

mkdirSync(OUT, { recursive: true });

const targets = [
  // iOS ve genel ikon: şeffaflık yok (App Store reddeder), zemin dolu.
  { name: "icon.png", size: 1024, inset: 0.16, opts: { background: true }, flatten: true },
  // Android uyarlanabilir ikon: sistem dış kısmı maskeleyip kırpar; pencere güvenli alanın (orta %66) içinde.
  { name: "android-icon-foreground.png", size: 1024, inset: 0.22, opts: { background: false } },
  { name: "android-icon-monochrome.png", size: 1024, inset: 0.22, opts: { background: false, mono: true } },
  // Açılış ekranı: zemin rengi app.json'daki splash eklentisinden gelir, görsel şeffaf.
  { name: "splash-icon.png", size: 1024, inset: 0.1, opts: { background: false } },
  { name: "favicon.png", size: 96, inset: 0.12, opts: { background: true } },
];

for (const t of targets) {
  let img = sharp(Buffer.from(svg(t.size, t.inset, t.opts)));
  if (t.flatten) img = img.flatten({ background: NAVY });
  const buf = await img.png({ compressionLevel: 9 }).toBuffer();
  await sharp(buf).toFile(join(OUT, t.name));
  console.log(`  ${t.name.padEnd(32)} ${t.size}x${t.size}  ${(buf.length / 1024).toFixed(1)} KB`);
}
console.log("\nassets/ altına yazıldı");
