/**
 * API blog tohumunun (apps/api/seed/blog-posts.json) web içeriğiyle uyumu.
 * Run:  npx tsx scripts/export-blog-seed.test.ts   (apps/web içinden)
 *
 * Denetlenenler:
 *  - güncellik: diskteki tohum, web verisinden şimdi üretilenle bayt bayt aynı (aksi halde
 *    `npx tsx scripts/export-blog-seed.ts` çalıştırın) ve üretim deterministik
 *  - yayın tarihi YAZILMAZ (hub verisinde tarih yok; API yükleme anını atar)
 *  - sitede bilerek gizli hedef (Svalbard) için herkese açık yazı yok
 *  - her yazının Türkçe çevirisi var; en/es yalnız canlı diller ve dolu gövdeli
 */
import { existsSync, readFileSync } from "node:fs";
import { OUT_FILE, buildPosts, render } from "./export-blog-seed";

let pass = 0;
let fail = 0;
const ok = (name: string, condition: boolean, detail = "") => {
  if (condition) pass++;
  else fail++;
  if (!condition || process.env.VERBOSE) console.log(`${condition ? "  PASS" : "  FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
};

const posts = buildPosts();
const output = render(posts);

ok("tohum dosyası var", existsSync(OUT_FILE), OUT_FILE);
const onDisk = existsSync(OUT_FILE) ? readFileSync(OUT_FILE, "utf8") : "";
ok("diskteki tohum web içeriğinden üretilenle aynı (güncel)", onDisk === output, "npx tsx scripts/export-blog-seed.ts");
ok("üretim deterministik: iki çalıştırma aynı çıktıyı verir", render(buildPosts()) === output);
ok("en az 40 yazı; slug'lar benzersiz ve sıralı", posts.length >= 40 && new Set(posts.map((p) => p.slug)).size === posts.length && posts.every((p, i) => i === 0 || posts[i - 1]!.slug < p.slug));
ok("yayın tarihi yazılmaz (uydurma tarih yok)", posts.every((p) => !("publishedAt" in p)) && !onDisk.includes("publishedAt"));
ok("gizli hedef Svalbard (SJ) için yazı yok", posts.every((p) => p.countryCode !== "SJ" && !p.slug.startsWith("svalbard")));
ok(
  "her yazıda Türkçe çeviri var; yabancı diller yalnız en/es ve gövdeleri dolu",
  posts.every((p) => {
    const langs = Object.keys(p.translations);
    return langs.includes("tr") && langs.every((l) => ["tr", "en", "es"].includes(l)) && Object.values(p.translations).every((t) => t && t.title.trim() !== "" && t.excerpt.trim() !== "" && t.body.length > 0);
  }),
);

console.log(`\n${pass} passed, ${fail} failed  (${posts.length} yazı)`);
process.exit(fail ? 1 : 0);
