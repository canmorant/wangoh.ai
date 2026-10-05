/**
 * Teknik SEO denetimi — çalışan bir sunucuya karşı (next start).
 *   VALIDATION_BASE_URL=http://127.0.0.1:3200 node scripts/validate-seo.mjs
 *
 * Sitemap'teki HER adres için:
 *   - 200 döner (yönlendirme yok), noindex değil, tek H1,
 *   - canonical kendisi, title ve description dolu ve dil içinde tekil,
 *   - hreflang: kendisi listede, karşılıklı (tr ↔ en ↔ es), x-default var,
 *     her alternatif de sitemap'te,
 *   - JSON-LD sözdizimi geçerli.
 * Ayrıca: sayfalardaki her iç bağlantı yönlendirmesiz 200 döner (kırık
 * bağlantı ve yönlendirme zinciri yok), rehber dizini her şehir rehberine
 * JavaScript olmadan bağlanır, öksüz sayfa yok, robots.txt sitemap'i gösterir,
 * olmayan adres 404.
 */
import assert from "node:assert/strict";

const base = (process.env.VALIDATION_BASE_URL ?? "http://127.0.0.1:3100").replace(/\/$/, "");
const canonical = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://wangoh.com").replace(/\/$/, "");
/** "https://wangoh.com" ile "https://wangoh.com/" aynı adres. */
const norm = (url) => (url ? new URL(url).href : url);
const failures = [];
const fail = (msg) => failures.push(msg);

async function get(path) {
  const response = await fetch(`${base}${path}`, { redirect: "manual" });
  return { status: response.status, location: response.headers.get("location"), html: await response.text() };
}

/** Sınırlı eşzamanlılıkla eşleme. */
async function pool(items, size, fn) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i], i);
      }
    })
  );
  return out;
}

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");

const sitemap = (await get("/sitemap.xml")).html;
const robots = (await get("/robots.txt")).html;
assert(robots.includes(`Sitemap: ${canonical}/sitemap.xml`), "robots.txt sitemap'i göstermiyor");
assert(!/Disallow:\s*\/\s*$/m.test(robots), "robots.txt tüm siteyi kapatıyor");

const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => norm(decode(m[1])));
assert(urls.length > 0, "sitemap boş");
assert.equal(new Set(urls).size, urls.length, "Sitemap yinelenen URL içeriyor");
const inSitemap = new Set(urls);

const pages = await pool(urls, 12, async (url) => {
  assert.equal(new URL(url).origin, canonical, `Sitemap'te yabancı köken: ${url}`);
  const path = new URL(url).pathname;
  const { status, location, html } = await get(path);
  return { url, path, status, location, html };
});

const titles = new Map();
const descriptions = new Map();
const internalLinks = new Set();

for (const { url, path, status, location, html } of pages) {
  if (status !== 200) {
    fail(`${path}: ${status}${location ? ` → ${location}` : ""}`);
    continue;
  }
  const lang = html.match(/<html lang="([^"]+)"/)?.[1] ?? "?";
  const canon = norm(html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]);
  if (canon !== url) fail(`${path}: canonical ${canon}`);
  if (/<meta name="robots" content="[^"]*noindex/.test(html)) fail(`${path}: noindex ama sitemap'te`);
  const h1 = (html.match(/<h1\b/g) ?? []).length;
  if (h1 !== 1) fail(`${path}: ${h1} adet H1`);

  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  const description = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "");
  if (!title) fail(`${path}: title yok`);
  if (!description) fail(`${path}: description yok`);
  for (const [map, value] of [[titles, title], [descriptions, description]]) {
    const key = `${lang}|${value}`;
    if (value) map.set(key, [...(map.get(key) ?? []), path]);
  }

  const alternates = new Map(
    [...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], norm(decode(m[2]))])
  );
  if (alternates.size) {
    if (alternates.get(lang) !== url) fail(`${path}: hreflang ${lang} kendini göstermiyor (${alternates.get(lang)})`);
    if (!alternates.has("x-default")) fail(`${path}: x-default yok`);
    for (const [hl, href] of alternates) {
      if (hl !== "x-default" && !inSitemap.has(href)) fail(`${path}: hreflang ${hl} sitemap'te yok: ${href}`);
    }
  }
  pages.find((p) => p.url === url).alternates = alternates;

  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(match[1]);
    } catch {
      fail(`${path}: JSON-LD bozuk`);
    }
  }
  for (const m of html.matchAll(/<a\b[^>]*href="(\/[^"#]*)"/g)) internalLinks.add(decode(m[1]).split("?")[0] || "/");
}

// hreflang karşılıklılığı: A, B'yi gösteriyorsa B de A'yı göstermeli.
const byUrl = new Map(pages.map((p) => [p.url, p]));
for (const page of pages) {
  for (const [hl, href] of page.alternates ?? []) {
    if (hl === "x-default") continue;
    const other = byUrl.get(href)?.alternates;
    if (other && ![...other.values()].includes(page.url)) fail(`hreflang karşılıksız: ${page.path} → ${href}`);
  }
}

for (const [map, kind] of [[titles, "title"], [descriptions, "description"]]) {
  for (const [key, paths] of map) if (paths.length > 1) fail(`Yinelenen ${kind} (${paths.length}): ${key.slice(0, 90)} — ${paths.slice(0, 3).join(", ")}`);
}

// Öksüz sayfa yok: sitemap'teki her adrese en az bir sayfadan bağlantı var.
for (const page of pages) {
  if (page.path !== "/" && !internalLinks.has(page.path)) fail(`Öksüz sayfa (iç bağlantı yok): ${page.path}`);
}

// İç bağlantılar: kırık ya da yönlendiren bağlantı yok.
const linkResults = await pool([...internalLinks], 12, async (path) => [path, await fetch(`${base}${path}`, { method: "HEAD", redirect: "manual" })]);
for (const [path, response] of linkResults) {
  if (response.status !== 200) fail(`İç bağlantı ${path}: ${response.status}${response.headers.get("location") ? ` → ${response.headers.get("location")}` : ""}`);
}

// Rehber dizinleri her şehre JavaScript olmadan bağlanıyor.
const directories = pages.filter((p) => /^\/(?:[a-z]{2}\/)?(gezi-rehberleri|travel-guides|guias-de-viaje)$/.test(p.path));
assert(directories.length > 0, "Rehber dizini sitemap'te yok");
const cityRoutes = new Set(
  pages.filter((p) => p.html.includes('"@type":"TouristDestination"') && p.html.includes('"@type":"Article"')).map((p) => p.path)
);
for (const dir of directories) {
  const prefix = dir.path.match(/^\/([a-z]{2})\//)?.[1];
  const links = new Set([...dir.html.matchAll(/<a\b[^>]*href="([^"#?]+)"/g)].map((m) => m[1]));
  for (const city of cityRoutes) {
    const cityPrefix = city.match(/^\/([a-z]{2})\//)?.[1];
    if (cityPrefix === prefix && !links.has(city)) fail(`Rehber dizininde (${dir.path}) bağlantı yok: ${city}`);
  }
}

const missing = await fetch(`${base}/olmayan-seo-test-sayfasi`);
if (missing.status !== 404) fail(`Olmayan sayfa ${missing.status} döndü`);

if (failures.length) {
  console.error(`✗ ${failures.length} sorun:\n  ${failures.slice(0, 80).join("\n  ")}`);
  process.exit(1);
}
console.log(
  `✓ ${pages.length} sitemap adresi (${cityRoutes.size} şehir rehberi), ${internalLinks.size} iç bağlantı, hreflang karşılıklılığı, canonical ve tekil meta verisi doğrulandı.`
);
