import assert from 'node:assert/strict';
const base = process.env.VALIDATION_BASE_URL ?? 'http://127.0.0.1:3100';
const canonical = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wangoh.com').replace(/\/$/, '');
async function read(path) {
  const response = await fetch(`${base}${path}`);
  assert.equal(response.status, 200, path);
  return response.text();
}
const [home, directory, sitemap, robots] = await Promise.all(['/', '/gezi-rehberleri', '/sitemap.xml', '/robots.txt'].map(read));
const hrefs = html => new Set([...html.matchAll(/<a\b[^>]*href="([^"#?]+)"/g)].map(m => m[1]));
const homeLinks = hrefs(home);
for (const path of ['/gezi-rehberleri', '/amerika-birlesik-devletleri/new-york', '/ispanya/madrid']) {
  assert(homeLinks.has(path), `JavaScript çalışmadan ana sayfada bağlantı yok: ${path}`);
}
const directoryLinks = hrefs(directory);
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
assert.equal(new Set(urls).size, urls.length, 'Sitemap yinelenen URL içeriyor');
let cityCount = 0;
for (const url of urls) {
  assert.equal(new URL(url).origin, canonical);
  const path = new URL(url).pathname;
  if (path.split('/').filter(Boolean).length === 2) {
    assert(directoryLinks.has(path), `Rehber dizininde bağlantı yok: ${path}`);
    cityCount++;
  }
}
assert(sitemap.includes(`${canonical}/gezi-rehberleri`));
assert(robots.includes(`Sitemap: ${canonical}/sitemap.xml`));
for (const html of [home, directory]) {
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert(!/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html));
  for (const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) JSON.parse(match[1]);
}
const missing = await fetch(`${base}/olmayan-seo-test-sayfasi`);
assert.equal(missing.status, 404);
console.log(`✓ ${cityCount} şehir rehberine JavaScript olmadan erişim, sitemap, ana sayfa bağlantıları ve 404 doğrulandı.`);
