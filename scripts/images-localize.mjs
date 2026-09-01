/**
 * Görselleri yerelleştirir.
 *
 * Manifestteki yaşayan her görseli indirir, WebP'ye çevirip boyutlandırır ve
 * public/images altına yazar. Yanında iki dosya üretir:
 *
 *   src/data/imageCredits.ts   — atıf verisi (yazar, lisans, kaynak)
 *   scripts/.image-map.json    — uzak URL → yerel yol eşlemesi
 *
 * Kaynak dosyalara DOKUNMAZ; yeniden yazma ayrı bir adım (images-rewrite.mjs).
 * Böylece indirme yarıda kalırsa kod bozulmuş olmaz.
 *
 * Tekrar çalıştırılabilir: zaten inen dosyayı yeniden indirmez.
 *
 * Çalıştır:  node scripts/images-localize.mjs
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import sharp from "sharp";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const MANIFEST = join(ROOT, "scripts/.image-manifest.json");
const OUT_DIR = join(ROOT, "public/images");
const MAP_OUT = join(ROOT, "scripts/.image-map.json");
const CREDITS_OUT = join(ROOT, "src/data/imageCredits.ts");

const UA = "WangohImageLocalize/1.0 (https://wangoh.com; travel guide site)";
const CONCURRENCY = 2;
const DELAY_MS = 250;
const MAX_RETRY = 4;

/**
 * Kodlama ayarları — ölçülerek seçildi (bkz. scripts/images-experiment.mjs).
 *
 * Genişlik 1280: şehir rehberindeki kahraman görsel telefonda tam genişlikte
 * duruyor; 3x ekranda 430pt ≈ 1290px eder, yani 1280 tam yerinde. 1080'e
 * düşürmek pakette %30 daha kazandırıyor ama detaylı şehir fotoğraflarında
 * gözle görülür yumuşama yapıyor — çözünürlükten ödün vermiyoruz.
 *
 * AVIF q58: aynı çözünürlükte WebP q78'e göre ~%30 daha küçük ve yan yana
 * bakıldığında ayırt edilemiyor. PSNR'de daha düşük çıkıyor, çünkü AVIF
 * algısal optimize eder; sayı yanıltıcı.
 *
 * effort 4: 7 ve 9 denendi, boyutu DÜŞÜRMÜYOR (hatta hafif artırıyor) ama
 * 3–9 kat yavaşlıyor.
 *
 * chroma 4:2:0: fotoğrafta gözle fark etmiyor, ~%5 daha kazandırıyor.
 */
const MAX_WIDTH = 1280;
const FORMAT = "avif";
const AVIF_OPTS = { quality: 58, effort: 4, chromaSubsampling: "4:2:0" };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function politeFetch(url, init = {}) {
  let wait = 800;
  for (let attempt = 0; attempt <= MAX_RETRY; attempt++) {
    try {
      const res = await fetch(url, init);
      if (res.status !== 429 && res.status < 500) return res;
      if (attempt === MAX_RETRY) return res;
      const ra = Number(res.headers.get("retry-after"));
      await sleep(Number.isFinite(ra) && ra > 0 ? ra * 1000 : wait);
    } catch (err) {
      if (attempt === MAX_RETRY) throw err;
      await sleep(wait);
    }
    wait = Math.min(wait * 2, 15000);
  }
}

/** URL'den kararlı, okunabilir bir dosya adı üretir. */
function slugFor(url) {
  const hash = createHash("sha1").update(url).digest("hex").slice(0, 8);
  let base = "";
  try {
    const parts = new URL(url).pathname.split("/");
    const thumbIdx = parts.indexOf("thumb");
    const raw = thumbIdx >= 0 ? parts[parts.length - 2] : parts[parts.length - 1];
    base = decodeURIComponent(raw)
      .replace(/\.[a-z0-9]+$/i, "")
      .toLowerCase()
      .replace(/[àáâãä]/g, "a").replace(/[èéêë]/g, "e").replace(/[ìíîï]/g, "i")
      .replace(/[òóôõö]/g, "o").replace(/[ùúûü]/g, "u").replace(/[ç]/g, "c")
      .replace(/[ğ]/g, "g").replace(/[ş]/g, "s").replace(/[ı]/g, "i")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48);
  } catch {
    /* URL çözümlenemezse sadece hash kullanılır */
  }
  return base ? `${base}-${hash}` : hash;
}

/* ------------------------------ lisans tamiri ------------------------------ */

function commonsFileName(url) {
  if (!url.includes("upload.wikimedia.org")) return null;
  const parts = url.split("/");
  const thumbIdx = parts.indexOf("thumb");
  const name = thumbIdx >= 0 ? parts[parts.length - 2] : parts[parts.length - 1];
  try {
    return decodeURIComponent(name);
  } catch {
    return name;
  }
}

async function fetchLicense(fileName) {
  const api =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo" +
    "&iiprop=extmetadata|url&titles=" +
    encodeURIComponent("File:" + fileName);
  const res = await politeFetch(api, { headers: { "User-Agent": UA } });
  if (!res.ok) return { error: `api ${res.status}` };
  const json = await res.json();
  const page = Object.values(json?.query?.pages || {})[0];
  const meta = page?.imageinfo?.[0]?.extmetadata;
  if (!meta) return { error: "metadata yok" };
  const strip = (v) =>
    v ? String(v).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() : null;
  return {
    licenseName: strip(meta.LicenseShortName?.value),
    licenseUrl: strip(meta.LicenseUrl?.value),
    artist: strip(meta.Artist?.value),
    credit: strip(meta.Credit?.value),
    attributionRequired: strip(meta.AttributionRequired?.value),
    descriptionUrl: page?.imageinfo?.[0]?.descriptionurl || null,
  };
}

/* --------------------------------- indirme --------------------------------- */

async function localize(entry) {
  const slug = slugFor(entry.url);
  const file = `${slug}.${FORMAT}`;
  const dest = join(OUT_DIR, file);

  if (existsSync(dest) && statSync(dest).size > 0) {
    // Yeniden indirme yok, ama LQIP'i yine de üret: aksi hâlde script ikinci kez
    // çalıştırıldığında bütün önizlemeler sessizce null'a düşüyor.
    const local = await sharp(dest, { failOn: "none" });
    const meta = await local.metadata();
    const lqip = await sharp(dest, { failOn: "none" })
      .resize({ width: 20 })
      .blur(1.2)
      .webp({ quality: 40 })
      .toBuffer();
    return {
      ...entry,
      slug,
      file,
      bytes: statSync(dest).size,
      width: meta.width,
      height: meta.height,
      lqip: `data:image/webp;base64,${lqip.toString("base64")}`,
      skipped: true,
    };
  }

  const res = await politeFetch(entry.url, { headers: { "User-Agent": UA }, redirect: "follow" });
  if (!res.ok) return { ...entry, slug, file, error: `indirme ${res.status}` };
  const buf = Buffer.from(await res.arrayBuffer());

  const img = sharp(buf, { failOn: "none" });
  const meta = await img.metadata();
  const out = await img
    .resize({ width: Math.min(MAX_WIDTH, meta.width || MAX_WIDTH), withoutEnlargement: true })
    .avif(AVIF_OPTS)
    .toBuffer();
  writeFileSync(dest, out);

  // Yükleme sırasında yerine geçecek küçük bulanık önizleme (LQIP).
  const lqip = await sharp(buf, { failOn: "none" })
    .resize({ width: 20 })
    .blur(1.2)
    .webp({ quality: 40 })
    .toBuffer();

  return {
    ...entry,
    slug,
    file,
    bytes: out.length,
    originalBytes: buf.length,
    width: meta.width,
    height: meta.height,
    lqip: `data:image/webp;base64,${lqip.toString("base64")}`,
  };
}

async function pool(items, limit, worker) {
  const results = [];
  let i = 0;
  let done = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      try {
        results[idx] = await worker(items[idx]);
      } catch (err) {
        results[idx] = { ...items[idx], error: String(err.message || err) };
      }
      if (!results[idx]?.skipped) await sleep(DELAY_MS);
      done++;
      if (done % 10 === 0 || done === items.length) {
        process.stdout.write(`\r  ${done}/${items.length}`);
      }
    }
  });
  await Promise.all(runners);
  process.stdout.write("\n");
  return results;
}

/* ---------------------------------- main ---------------------------------- */

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
const live = manifest.filter((m) => m.health.ok);
const dead = manifest.filter((m) => !m.health.ok);

console.log("\nGÖRSEL YERELLEŞTİRME\n" + "=".repeat(64));
console.log(`indirilecek : ${live.length}`);
console.log(`atlanan (ölü): ${dead.length}\n`);

// Taramada hata veren lisansları burada tamamla.
const broken = live.filter((m) => m.license?.error && m.commonsFile);
if (broken.length) {
  console.log(`eksik lisans bilgisi tamamlanıyor (${broken.length})`);
  const fixed = await pool(broken, CONCURRENCY, async (m) => ({
    url: m.url,
    license: await fetchLicense(m.commonsFile),
  }));
  const byUrl = new Map(fixed.map((f) => [f.url, f.license]));
  for (const m of live) if (byUrl.has(m.url)) m.license = byUrl.get(m.url);
}

console.log("\nindiriliyor + WebP'ye çevriliyor");
const results = await pool(live, CONCURRENCY, localize);

const ok = results.filter((r) => r && !r.error);
const failed = results.filter((r) => r?.error);
const totalBytes = ok.reduce((n, r) => n + (r.bytes || 0), 0);
const originalBytes = ok.reduce((n, r) => n + (r.originalBytes || 0), 0);

console.log(`\n  başarılı : ${ok.length}`);
console.log(`  hatalı   : ${failed.length}`);
for (const f of failed) console.log(`    ${f.error}  ${f.url}`);
console.log(`  toplam boyut : ${(totalBytes / 1e6).toFixed(1)} MB`);
if (originalBytes) {
  console.log(`  (orijinaller : ${(originalBytes / 1e6).toFixed(1)} MB — yeni inenler için)`);
}

/* --------------------------- çıktı dosyaları --------------------------- */

const map = {};
for (const r of ok) map[r.url] = `/images/${r.file}`;
writeFileSync(MAP_OUT, JSON.stringify(map, null, 2));

/**
 * Atıf ZORUNLU OLMAYAN lisanslar.
 *
 * CC0 ve kamu malı hiçbir şart koşmuyor. Unsplash lisansı da atıf zorunlu
 * kılmıyor (tavsiye ediyor, şart koşmuyor) — ayrıca Unsplash görselleri için
 * fotoğrafçı adını API anahtarı olmadan çekemiyoruz, dolayısıyla listede
 * yazarsız "kaynak · Unsplash License" satırları çıkıyordu. Bunlar
 * gösterilmiyor; CC BY / CC BY-SA / FAL olanların hepsi gösteriliyor.
 */
const NO_ATTRIBUTION = /^(CC0|Public domain|Unsplash License)/i;

/**
 * Var olan atıfları oku ve üzerine ekle — asla komple ezme.
 *
 * Script daha önce credits dosyasını her çalışmada sıfırdan yazıyordu. Manifest
 * herhangi bir sebeple küçüldüğünde (ki yerelleştirmeden sonra tam olarak bu
 * oluyordu) 340 kayıt 45'e düşüp 265 görselin lisans atfı sessizce siliniyordu.
 * Birleştirme, kısmi bir çalıştırmanın veri kaybettirmesini imkânsız kılıyor.
 */
function existingCredits() {
  try {
    const src = readFileSync(CREDITS_OUT, "utf8");
    const m = src.match(/export const IMAGE_CREDITS: ImageCredit\[\] = ([\s\S]*?);\n\nconst byFile/);
    return m ? JSON.parse(m[1]) : [];
  } catch {
    return [];
  }
}

const fresh = ok.map((r) => {
  const lic = r.license || {};
  return {
    file: `/images/${r.file}`,
    artist: lic.artist || null,
    licenseName: lic.licenseName || null,
    licenseUrl: lic.licenseUrl || null,
    sourceUrl: lic.descriptionUrl || r.url,
    attributionRequired: !!(lic.licenseName && !NO_ATTRIBUTION.test(lic.licenseName)),
    lqip: r.lqip || null,
  };
});

// Yeni kayıtlar eskilerin üzerine yazar, eskiler korunur.
const merged = new Map(existingCredits().map((c) => [c.file, c]));
for (const c of fresh) merged.set(c.file, c);
const credits = [...merged.values()].sort((a, b) => a.file.localeCompare(b.file));

const ts = `/**
 * Görsel atıfları — otomatik üretildi, elle düzenlemeyin.
 * Üreten: scripts/images-localize.mjs
 *
 * Görsellerin çoğu Wikimedia Commons'tan ve CC BY / CC BY-SA lisanslı.
 * Bu lisanslar yazar adının ve lisans bağlantısının gösterilmesini ZORUNLU
 * kılıyor; bu yüzden veri kodda tutuluyor ve arayüzde gösteriliyor.
 */

export interface ImageCredit {
  /** public/ altındaki yol — aynı zamanda anahtar. */
  file: string;
  artist: string | null;
  licenseName: string | null;
  licenseUrl: string | null;
  sourceUrl: string;
  /** CC0 ve kamu malı dışındaki her şey için true. */
  attributionRequired: boolean;
  /** Yüklenirken gösterilecek küçük bulanık önizleme (base64 WebP). */
  lqip: string | null;
}

export const IMAGE_CREDITS: ImageCredit[] = ${JSON.stringify(credits, null, 2)};

const byFile = new Map(IMAGE_CREDITS.map((c) => [c.file, c]));

export const creditFor = (file: string): ImageCredit | null => byFile.get(file) ?? null;
`;

writeFileSync(CREDITS_OUT, ts);

console.log(`\n  yazıldı: public/images/  (${ok.length} dosya)`);
console.log(`  yazıldı: scripts/.image-map.json`);
console.log(`  yazıldı: src/data/imageCredits.ts`);
console.log(`  atıf gerektiren: ${credits.filter((c) => c.attributionRequired).length}`);
console.log("\n" + "=".repeat(64) + "\n");
