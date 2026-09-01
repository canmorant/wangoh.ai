/**
 * Görsel envanteri ve sağlık taraması.
 *
 * Kaynak dosyalardaki tüm uzak görsel URL'lerini toplar, her birinin hâlâ
 * yaşayıp yaşamadığını kontrol eder ve Wikimedia görselleri için lisans +
 * yazar bilgisini çeker (CC BY-SA atıf zorunluluğu var — kendi sunucumuza
 * taşıyacaksak bu veriyi saklamamız gerekiyor).
 *
 * Hiçbir şey indirmez, hiçbir dosyayı değiştirmez. Sadece rapor + manifest.
 *
 * Çalıştır:  node scripts/images-audit.mjs
 * Çıktı:     scripts/.image-manifest.json
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

// fileURLToPath: proje yolunda boşluk var, URL.pathname bunu %20 yapıyor.
const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT = join(ROOT, "scripts/.image-manifest.json");

// Wikimedia açıklayıcı bir User-Agent istiyor; yoksa 403 döner.
const UA =
  "WangohImageAudit/1.0 (https://wangoh.com; travel guide site) node-fetch";

// Wikimedia agresif isteklere 429 ile cevap veriyor. İlk denemede 6 eşzamanlı
// istekle taradığımda 344 URL'in 255'i "ölü" göründü — hepsi 429'du, yani
// görseller değil tarayıcı hatalıydı. Düşük eşzamanlılık + istekler arası
// bekleme + 429'da geri çekilme ile gerçek durumu ölçüyoruz.
const CONCURRENCY = 2;
const DELAY_MS = 220;
const MAX_RETRY = 4;
const IMAGE_HOSTS = /^https:\/\/(upload\.wikimedia\.org|images\.unsplash\.com)\//;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** 429/5xx durumunda Retry-After'a saygı göstererek yeniden dener. */
async function politeFetch(url, init = {}) {
  let wait = 800;
  for (let attempt = 0; attempt <= MAX_RETRY; attempt++) {
    const res = await fetch(url, init);
    if (res.status !== 429 && res.status < 500) return res;
    if (attempt === MAX_RETRY) return res;
    const retryAfter = Number(res.headers.get("retry-after"));
    await sleep(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : wait);
    wait = Math.min(wait * 2, 15000);
  }
}

/* ----------------------------- toplama ----------------------------- */

/**
 * Taranmayacak dosyalar.
 *
 * imageCredits.ts'teki URL'ler görsel değil, atfın işaret ettiği KAYNAK sayfa.
 * Onları görsel sanmak manifesti bozuyordu: yerelleştirmeden sonra kaynak
 * dosyalarda uzak URL kalmadığı için manifest yalnızca bu atıf bağlantılarına
 * düşüyor, localize de credits dosyasını o küçük listeyle eziyordu — 340
 * kayıt 45'e inip 265 görselin atfı siliniyordu.
 */
const SKIP = new Set(["src/data/imageCredits.ts"]);

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, acc);
    else if (/\.(ts|tsx)$/.test(entry) && !SKIP.has(p.replace(ROOT, ""))) acc.push(p);
  }
  return acc;
}

/**
 * Yerelleştirilmiş dosyalarda artık uzak URL yok, ama atıf verisini yeniden
 * üretebilmek için orijinal listeye ihtiyacımız var. Git'teki son sürüm bu
 * listenin kaydı: çalışma ağacındaki URL'lerle birleştiriliyor, böylece script
 * kaç kez çalışırsa çalışsın tam envanteri görüyor.
 */
function urlsFromGitHead() {
  const out = new Map();
  let files = [];
  try {
    files = execSync("git ls-files 'src/**/*.ts' 'src/**/*.tsx'", {
      cwd: ROOT,
      encoding: "utf8",
    })
      .split("\n")
      .filter((f) => f && !SKIP.has(f));
  } catch {
    return out; // git yoksa sessizce atla
  }
  for (const f of files) {
    let text = "";
    try {
      text = execSync(`git show HEAD:${JSON.stringify(f)}`, {
        cwd: ROOT,
        encoding: "utf8",
        maxBuffer: 32 * 1024 * 1024,
      });
    } catch {
      continue;
    }
    const re = /["'`](https:\/\/[^"'`\s]+)["'`]/g;
    let m;
    while ((m = re.exec(text))) {
      if (IMAGE_HOSTS.test(m[1])) {
        if (!out.has(m[1])) out.set(m[1], new Set());
        out.get(m[1]).add(f);
      }
    }
  }
  return out;
}

function collect() {
  const found = new Map(); // url -> { files:Set, count }
  for (const file of walk(join(ROOT, "src"))) {
    const text = readFileSync(file, "utf8");
    // Tırnak içindeki URL'leri al; sondaki tırnağa kadar.
    const re = /["'`](https:\/\/[^"'`\s]+)["'`]/g;
    let m;
    while ((m = re.exec(text))) {
      const url = m[1];
      if (!IMAGE_HOSTS.test(url)) continue;
      const rel = file.replace(ROOT, "");
      if (!found.has(url)) found.set(url, { files: new Set(), count: 0 });
      const rec = found.get(url);
      rec.files.add(rel);
      rec.count++;
    }
  }
  return found;
}

/* --------------------------- sağlık kontrolü --------------------------- */

async function check(url) {
  try {
    // HEAD bazı CDN'lerde desteklenmiyor; Range ile küçük bir GET daha güvenilir.
    const res = await politeFetch(url, {
      headers: { "User-Agent": UA, Range: "bytes=0-2047" },
      redirect: "follow",
    });
    return {
      ok: res.ok || res.status === 206,
      status: res.status,
      type: res.headers.get("content-type") || null,
      size: Number(res.headers.get("content-range")?.split("/")?.[1]) || null,
    };
  } catch (err) {
    return { ok: false, status: 0, type: null, size: null, error: String(err.message || err) };
  }
}

/* --------------------------- lisans bilgisi --------------------------- */

/** upload.wikimedia.org URL'inden Commons dosya adını çıkarır. */
function commonsFileName(url) {
  if (!url.includes("upload.wikimedia.org")) return null;
  // .../commons/thumb/a/ab/Foo.jpg/800px-Foo.jpg  ya da  .../commons/a/ab/Foo.jpg
  const parts = url.split("/");
  const thumbIdx = parts.indexOf("thumb");
  const name = thumbIdx >= 0 ? parts[parts.length - 2] : parts[parts.length - 1];
  try {
    return decodeURIComponent(name);
  } catch {
    return name;
  }
}

async function license(fileName) {
  const api =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo" +
    "&iiprop=extmetadata|url&titles=" +
    encodeURIComponent("File:" + fileName);
  try {
    const res = await politeFetch(api, { headers: { "User-Agent": UA } });
    if (!res.ok) return { error: `api ${res.status}` };
    const json = await res.json();
    const pages = json?.query?.pages || {};
    const page = Object.values(pages)[0];
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
  } catch (err) {
    return { error: String(err.message || err) };
  }
}

/* ------------------------------ havuz ------------------------------ */

async function pool(items, limit, worker) {
  const results = [];
  let i = 0;
  let done = 0;
  const total = items.length;
  const runners = Array.from({ length: Math.min(limit, total) }, async () => {
    while (i < total) {
      const idx = i++;
      results[idx] = await worker(items[idx], idx);
      await sleep(DELAY_MS);
      done++;
      if (done % 25 === 0 || done === total) {
        process.stdout.write(`\r  taranan: ${done}/${total}`);
      }
    }
  });
  await Promise.all(runners);
  process.stdout.write("\n");
  return results;
}

/* ------------------------------- main ------------------------------- */

const found = collect();

// Git'teki orijinal URL'leri de ekle — yerelleştirme sonrası çalışma ağacında
// kalmamış olabilirler ve atıf verisi onlara bağlı.
const fromGit = urlsFromGitHead();
let recovered = 0;
for (const [url, files] of fromGit) {
  if (!found.has(url)) {
    found.set(url, { files: new Set(files), count: 1 });
    recovered++;
  }
}

const urls = [...found.keys()];

console.log("\nGÖRSEL ENVANTERİ\n" + "=".repeat(64));
console.log(`benzersiz URL      : ${urls.length}`);
console.log(`toplam referans    : ${[...found.values()].reduce((n, r) => n + r.count, 0)}`);
if (recovered) console.log(`git'ten kurtarılan : ${recovered}`);
const byHost = {};
for (const u of urls) {
  const h = new URL(u).hostname;
  byHost[h] = (byHost[h] || 0) + 1;
}
for (const [h, n] of Object.entries(byHost).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${h.padEnd(28)} ${n}`);
}

console.log("\nSAĞLIK KONTROLÜ (her URL'e istek atılıyor)");
const health = await pool(urls, CONCURRENCY, (u) => check(u));

const dead = urls.filter((_, i) => !health[i].ok);
console.log(`\n  yaşayan : ${urls.length - dead.length}`);
console.log(`  ÖLÜ     : ${dead.length}`);
if (dead.length) {
  console.log("\n  ölü URL'ler:");
  for (const u of dead) {
    const i = urls.indexOf(u);
    console.log(`    [${health[i].status || "ERR"}] ${u}`);
    for (const f of found.get(u).files) console.log(`           ↳ ${f}`);
  }
}

const wikimedia = urls.filter((u) => u.includes("upload.wikimedia.org"));
console.log(`\nLİSANS BİLGİSİ (${wikimedia.length} Wikimedia görseli)`);
const licenses = await pool(wikimedia, CONCURRENCY, (u) => license(commonsFileName(u)));

const licCount = {};
for (const l of licenses) {
  const k = l.error ? `HATA: ${l.error}` : l.licenseName || "bilinmiyor";
  licCount[k] = (licCount[k] || 0) + 1;
}
console.log();
for (const [k, n] of Object.entries(licCount).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(k).padEnd(34)} ${n}`);
}

const manifest = urls.map((u, i) => ({
  url: u,
  files: [...found.get(u).files],
  refCount: found.get(u).count,
  health: health[i],
  commonsFile: commonsFileName(u),
  license: u.includes("upload.wikimedia.org")
    ? licenses[wikimedia.indexOf(u)] || null
    : { licenseName: "Unsplash License", licenseUrl: "https://unsplash.com/license" },
}));

/**
 * Manifesti birleştirerek yaz — asla komple değiştirme.
 *
 * Kaynak dosyada bir URL yerel yola çevrildikten sonra artık taramada
 * görünmez; git kurtarması da o dosyanın ESKİ hâlindeki URL'i getirir. Arada
 * değiştirilmiş bir görsel (ölüyken yenisiyle takas edilen gibi) bu boşluğa
 * düşüp manifestten siliniyor, dolayısıyla dosyası hiç üretilmiyordu.
 * Birleştirme, bir kez görülen URL'in bir daha kaybolmamasını garanti eder.
 */
let previous = [];
try {
  previous = JSON.parse(readFileSync(OUT, "utf8"));
} catch {
  previous = [];
}
const byUrl = new Map(previous.map((m) => [m.url, m]));
for (const m of manifest) byUrl.set(m.url, m);
const mergedManifest = [...byUrl.values()];
const kept = mergedManifest.length - manifest.length;
if (kept > 0) console.log(`önceki manifestten korunan: ${kept}`);

writeFileSync(OUT, JSON.stringify(mergedManifest, null, 2));
console.log("\n" + "=".repeat(64));
console.log(`manifest yazıldı: scripts/.image-manifest.json`);
console.log(`ölü: ${dead.length} / ${urls.length}`);
console.log(`manifest kayıt: ${mergedManifest.length}\n`);
