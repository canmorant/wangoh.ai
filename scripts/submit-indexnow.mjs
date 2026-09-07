const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://wangoh.com").replace(/\/$/, "");
const key = "3871ce4f5e1754cfe5ed126c5431e25c";
const keyLocation = `${siteUrl}/${key}.txt`;

const sitemapResponse = await fetch(`${siteUrl}/sitemap.xml`);
if (!sitemapResponse.ok) {
  throw new Error(`Sitemap alınamadı: ${sitemapResponse.status}`);
}

const sitemap = await sitemapResponse.text();
const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
if (urlList.length === 0) throw new Error("Sitemap içinde URL bulunamadı.");

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(siteUrl).host, key, keyLocation, urlList }),
});

if (![200, 202].includes(response.status)) {
  throw new Error(`IndexNow bildirimi reddedildi: ${response.status} ${await response.text()}`);
}

console.log(`✓ ${urlList.length} URL IndexNow'a gönderildi (${response.status}).`);
