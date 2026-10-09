/**
 * Uygulama paketi (Capacitor) bağlantı denetimi.
 *
 * Çalıştırma:
 *   npm run build:app && npm run test:app
 *   node scripts/validate-app-export.mjs [--dir out] [--mode both|capacitor|plain]
 *                                        [--start /,/tr/] [--max 500] [--port 3501] [-v]
 *
 * Ne yapar
 * --------
 * out/ klasörünü scripts/app-server.mjs ile, Capacitor'un yerel sunucusunun
 * kuralıyla sunar (uzantısız her yol → KÖK index.html; uzantılı yol → dosya
 * ya da 404) ve ayrıca sıradan bir statik sunucu gibi (dizin → index.html).
 * Her iki kipte de `/` adresinden başlayıp bağlantıları izleyerek (BFS) paketteki
 * tüm sayfaları gezer. Bağımlılık yok; tarayıcı çalıştırmaz.
 *
 * Hata verir (çıkış kodu 1):
 *   - 404 dönen ya da içeriği 404 sayfası olan iç bağlantı,
 *   - `/tr/` ile başlamayan iç `<a href>` (kök-dışı, dil önekisiz, göreli),
 *   - Capacitor kipinde uzantısız iç bağlantı (kök kabuğa düşer, sayfa açılmaz),
 *   - 404 dönen /_next varlığı ya da sayfanın başvurduğu yerel varlık,
 *   - out/index.html kabuğu yok; kabuğun adres çözümü yanlış (shellTarget),
 *   - çok az sayfa gezildi (paket ya da bağlantı çıkarımı bozuk).
 *
 * Kapsam dışı: kabuğun JavaScript'ini ve Next'in hidrasyonunu çalıştırmak
 * (tarayıcı gerekir); kabuğun adres kararı bu yüzden saf fonksiyon olarak
 * (app-shell.mjs → shellTarget) ve her sayfa için ayrıca sınanıyor.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { startAppServer } from "./app-server.mjs";
import { shellTarget } from "./app-shell.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i > -1 && args[i + 1] !== undefined ? args[i + 1] : fallback;
};
const OUT = resolve(opt("dir", join(ROOT, "out")));
const MODES = opt("mode", "both") === "both" ? ["capacitor", "plain"] : [opt("mode", "both")];
const STARTS = opt("start", "/").split(",");
const MAX = Number(opt("max", "100000"));
const PORT = Number(opt("port", "0"));
const VERBOSE = args.includes("-v") || args.includes("--verbose");
/** Bundan az sayfa gezildiyse paket ya da çıkarım bozuk demektir. */
const MIN_PAGES = 300;
const LOCALE_PREFIX = "/tr/";

const decodeEntities = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

/** <a href> değerleri (noscript içindekiler dahil). */
function anchorHrefs(html) {
  const out = [];
  for (const tag of html.match(/<a\b[^>]*>/gi) ?? []) {
    const m = tag.match(/\shref\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
    if (m) out.push(decodeEntities(m[1] ?? m[2]));
  }
  return out;
}

/** Sayfanın başvurduğu kök-göreli varlıklar: script, stylesheet, img, source, manifest, ikon… */
function assetRefs(html) {
  const out = new Set();
  const add = (v) => {
    const u = decodeEntities(v.trim());
    if (u.startsWith("/") && !u.startsWith("//")) out.add(u.split(/[?#]/)[0]);
  };
  for (const tag of html.match(/<(?:script|img|source|video|audio|track|iframe)\b[^>]*>/gi) ?? []) {
    const src = tag.match(/\ssrc\s*=\s*"([^"]*)"/i);
    if (src) add(src[1]);
    const poster = tag.match(/\sposter\s*=\s*"([^"]*)"/i);
    if (poster) add(poster[1]);
    const set = tag.match(/\ssrcset\s*=\s*"([^"]*)"/i);
    if (set) for (const part of decodeEntities(set[1]).split(",")) add(part.trim().split(/\s+/)[0]);
  }
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    const rel = (tag.match(/\srel\s*=\s*"([^"]*)"/i) ?? [])[1] ?? "";
    // canonical/alternate mutlak (https://wangoh.com/…) olduğu için zaten dışarıda.
    if (/(canonical|alternate)/i.test(rel)) continue;
    const href = tag.match(/\shref\s*=\s*"([^"]*)"/i);
    if (href) add(href[1]);
  }
  return [...out];
}

/** <title> metni, yoksa "". */
const titleOf = (html) => decodeEntities((html.match(/<title>([^<]*)<\/title>/i) ?? [])[1] ?? "");

/** out/ içindeki *.html sayfaları (URL yolu olarak): /tr/mesafe/index.html */
function diskPages(dir, base = "") {
  const found = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) found.push(...diskPages(join(dir, e.name), `${base}/${e.name}`));
    else if (e.name === "index.html") found.push(`${base}/index.html`);
  }
  return found;
}

async function get(base, path, method = "GET") {
  try {
    const res = await fetch(base + path, { method, redirect: "manual" });
    const body = method === "GET" ? await res.text() : "";
    return { status: res.status, body, type: res.headers.get("content-type") ?? "" };
  } catch (e) {
    return { status: 0, body: "", type: "", error: String(e) };
  }
}

/** Sınırlı eşzamanlılıkla map. */
async function pool(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        results[i] = await fn(items[i], i);
      }
    })
  );
  return results;
}

/**
 * Bir kipte tüm gezinti. Hata listesini döner.
 * errors: [{ kind, path, from, detail }]
 */
async function crawl(mode, index) {
  // Sabit port verildiyse her kip yanında bir sonrakini kullanır (undici bağlantı havuzu
  // aynı porttaki kapanmış sunucuya yeniden bağlanmaya çalışmasın).
  const server = await startAppServer({ root: OUT, mode, port: PORT ? PORT + index : 0 });
  const base = server.url;
  const errors = [];
  const err = (kind, path, from, detail = "") => errors.push({ kind, path, from, detail });

  const pages = new Map(); // yol → { html }
  const queue = [];
  const queued = new Set();
  const cameFrom = new Map();
  const assets = new Map(); // yol → ilk gördüğü sayfa
  let anchorCount = 0;
  let externalCount = 0;
  const targets = new Set();

  const enqueue = (path, from) => {
    if (queued.has(path)) return;
    queued.add(path);
    cameFrom.set(path, from);
    queue.push(path);
  };
  for (const s of STARTS) enqueue(s, "(başlangıç)");

  /** Bir iç bağlantıyı denetle; gezilecekse kuyruğa ekle. */
  const checkLink = (href, from) => {
    anchorCount++;
    if (/^(https?:|mailto:|tel:|sms:|geo:|maps:|javascript:|data:)/i.test(href)) {
      if (/^javascript:/i.test(href)) err("javascript: bağlantı", href, from);
      externalCount++;
      return;
    }
    if (href === "" || href.startsWith("#")) return;
    if (!href.startsWith("/") || href.startsWith("//")) {
      err("göreli ya da protokol-göreli bağlantı", href, from, "kök yoldan (/tr/...) başlamalı");
      return;
    }
    const path = href.split(/[?#]/)[0];
    targets.add(path);
    if (!path.startsWith(LOCALE_PREFIX)) {
      err("/tr/ ile başlamıyor", href, from);
      return;
    }
    const last = path.split("/").filter(Boolean).pop() ?? "";
    if (mode === "capacitor" && !last.includes(".")) {
      err(
        "uzantısız bağlantı (Capacitor kök kabuğu döndürür)",
        href,
        from,
        "/tr/…/index.html biçiminde olmalı"
      );
      return;
    }
    enqueue(path, from);
  };

  let visited = 0;
  while (queue.length && visited < MAX) {
    const batch = queue.splice(0, 24);
    await pool(batch, 12, async (path) => {
      visited++;
      const from = cameFrom.get(path);
      const res = await get(base, path);
      if (res.status !== 200) {
        err(`HTTP ${res.status || "bağlantı hatası"}`, path, from, res.error ?? "");
        return;
      }
      if (!/html/.test(res.type)) {
        // Sayfa bağlantısı HTML dışı bir dosyaya gidiyor (pdf, json…): açılır, gezilmez.
        return;
      }
      const html = res.body;
      const isEntryShell = path === "/" || path === "/index.html";
      if (!isEntryShell && /\sdata-app-shell[\s>]/.test(html)) {
        err("sayfa yerine kök kabuk döndü", path, from);
        return;
      }
      if (!isEntryShell && html.includes("NEXT_HTTP_ERROR_FALLBACK;404")) {
        err("404 sayfası içeriği", path, from, titleOf(html));
        return;
      }
      if (!isEntryShell && !/<(main|h1)\b/i.test(html)) {
        err("boş sayfa (<main>/<h1> yok)", path, from, titleOf(html));
        return;
      }
      pages.set(path, { title: titleOf(html) });
      for (const href of anchorHrefs(html)) checkLink(href, path);
      for (const a of assetRefs(html)) if (!assets.has(a)) assets.set(a, path);
    });
  }
  if (queue.length) console.log(`  (uyarı) --max ${MAX} sınırında durdu; ${queue.length} yol gezilmedi.`);

  // Varlıklar: /_next ve diğer yerel dosyalar.
  const assetList = [...assets.entries()];
  const cssFiles = [];
  await pool(assetList, 16, async ([path, from]) => {
    const res = await get(base, path, "HEAD");
    if (res.status !== 200) err(`varlık HTTP ${res.status || "hata"}`, path, from);
    else if (path.endsWith(".css")) cssFiles.push(path);
  });
  // Stil dosyalarındaki url(...) başvuruları (yazı tipleri, görseller).
  const cssAssets = new Map();
  await pool(cssFiles, 8, async (cssPath) => {
    const res = await get(base, cssPath);
    // Gömülü data: adreslerinin içindeki url(#filtre) vb. dosya başvurusu değil.
    const css = res.body
      .replace(/url\(\s*"data:[^"]*"\s*\)/g, "")
      .replace(/url\(\s*'data:[^']*'\s*\)/g, "")
      .replace(/url\(\s*data:[^)]*\)/g, "");
    for (const m of css.matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/g)) {
      const raw = m[1];
      if (/^(data:|https?:|#)/.test(raw)) continue;
      const abs = raw.startsWith("/")
        ? raw
        : new URL(raw, `http://x${cssPath}`).pathname;
      const clean = abs.split(/[?#]/)[0];
      if (!assets.has(clean) && !cssAssets.has(clean)) cssAssets.set(clean, cssPath);
    }
  });
  await pool([...cssAssets.entries()], 16, async ([path, from]) => {
    const res = await get(base, path, "HEAD");
    if (res.status !== 200) err(`stil varlığı HTTP ${res.status || "hata"}`, path, from);
  });

  // Düz sunucu kipi: kullanıcının modeli. Her sayfanın dizin adresi de açılmalı.
  if (mode === "plain") {
    const dirChecks = [...pages.keys()].filter((p) => p.endsWith("/index.html")).slice(0, 2000);
    await pool(dirChecks, 16, async (p) => {
      const dir = p.replace(/index\.html$/, "");
      const res = await get(base, dir, "HEAD");
      if (res.status !== 200) err(`dizin adresi HTTP ${res.status}`, dir, p);
    });
  }

  await server.close();
  return {
    mode,
    errors,
    pages: pages.size,
    anchors: anchorCount,
    targets: targets.size,
    external: externalCount,
    assets: assets.size + cssAssets.size,
  };
}

// ---------------------------------------------------------------------------

let failed = false;
const fail = (msg) => {
  failed = true;
  console.log(`  ✗ ${msg}`);
};
const ok = (msg) => console.log(`  ✓ ${msg}`);

console.log("\nUYGULAMA PAKETİ BAĞLANTI DENETİMİ");
console.log("=".repeat(64));
console.log(`  klasör: ${OUT}`);

if (!existsSync(join(OUT, "tr", "index.html"))) {
  console.error("\nout/tr/index.html yok — önce `npm run build:app` çalıştırın.");
  process.exit(1);
}

// 1) Statik koşullar
console.log("\n[1] Kök kabuk ve adres çözümü");
const shellFile = join(OUT, "index.html");
if (!existsSync(shellFile)) {
  fail("out/index.html yok: Capacitor açılışta kök index.html arar (npm run build:app üretir)");
} else {
  const shell = readFileSync(shellFile, "utf8");
  if (!/\sdata-app-shell[\s>]/.test(shell)) fail("out/index.html uygulama kabuğu değil (data-app-shell yok)");
  else if (!shell.includes("/tr/index.html")) fail("kabukta /tr/index.html hedefi yok");
  else if (!/<noscript>/.test(shell)) fail("kabukta <noscript> yedeği yok");
  else if (!/#0a0e1a/i.test(shell)) fail("kabukta arka plan rengi (#0a0e1a) yok");
  else ok("out/index.html kabuğu var (noscript yedeği, #0a0e1a zemin)");
}
const cases = [
  ["/", "/tr/index.html"],
  ["/index.html", "/tr/index.html"],
  ["/tr", "/tr/index.html"],
  ["/tr/", "/tr/index.html"],
  ["/tr/mesafe/", "/tr/mesafe/index.html"],
  ["/tr/mesafe", "/tr/mesafe/index.html"],
  ["/mesafe/", "/tr/mesafe/index.html"],
  ["/japonya/tokyo", "/tr/japonya/tokyo/index.html"],
  ["/tr/japonya/tokyo/index.html", "/tr/japonya/tokyo/index.html"],
  ["//tr//mesafe//", "/tr/mesafe/index.html"],
  ["/trabzon/", "/tr/trabzon/index.html"],
];
const wrong = cases.filter(([i, want]) => shellTarget(i) !== want);
if (wrong.length) for (const [i, want] of wrong) fail(`shellTarget(${JSON.stringify(i)}) = ${shellTarget(i)} (beklenen ${want})`);
else ok(`shellTarget ${cases.length} örnekte doğru`);

const onDisk = diskPages(join(OUT, "tr"));
// Her sayfa için: dizin biçimi (/tr/x/) ve önek-siz biçim (/x/) kabukta aynı dosyaya çözülmeli.
let healBad = 0;
for (const p of onDisk) {
  const file = `/tr${p}`;
  const dir = file.replace(/index\.html$/, "");
  const bare = dir.replace(/^\/tr/, "") || "/";
  if (shellTarget(dir) !== file || (bare !== "/" && shellTarget(bare) !== file)) {
    if (healBad++ < 5) fail(`shellTarget ${dir} / ${bare} → ${shellTarget(dir)} (beklenen ${file})`);
  }
}
if (!healBad) ok(`${onDisk.length} sayfanın dizin ve önek-siz adresi kabukta doğru dosyaya çözülüyor`);

// 2) Sunucu kipleri
const summaries = [];
for (const [index, mode] of MODES.entries()) {
  console.log(`\n[2] Gezinti — kip: ${mode}${mode === "capacitor" ? " (uzantısız yol → kök kabuk, gerçek cihaz davranışı)" : " (düz statik sunucu)"}`);
  const r = await crawl(mode, index);
  summaries.push(r);
  console.log(
    `  gezilen sayfa: ${r.pages} | iç bağlantı hedefi: ${r.targets} | <a> sayısı: ${r.anchors} | dış: ${r.external} | varlık: ${r.assets}`
  );
  if (r.pages < MIN_PAGES && MAX >= MIN_PAGES) fail(`yalnız ${r.pages} sayfa gezildi (en az ${MIN_PAGES} bekleniyor)`);
  else ok(`${r.pages} sayfa gezildi`);
  if (r.errors.length) {
    failed = true;
    const groups = new Map();
    for (const e of r.errors) {
      if (!groups.has(e.kind)) groups.set(e.kind, []);
      groups.get(e.kind).push(e);
    }
    for (const [kind, list] of groups) {
      console.log(`  ✗ ${kind}: ${list.length}`);
      for (const e of list.slice(0, VERBOSE ? 200 : 5)) {
        console.log(`      ${e.path}  ← ${e.from}${e.detail ? `  (${e.detail})` : ""}`);
      }
      if (!VERBOSE && list.length > 5) console.log(`      … ${list.length - 5} tane daha (-v ile hepsi)`);
    }
  } else {
    ok("bozuk bağlantı, kök-dışı bağlantı ya da eksik varlık yok");
  }
}

console.log("\n" + "=".repeat(64));
if (failed) {
  console.log("BAŞARISIZ");
  process.exit(1);
}
console.log("BAŞARILI");
