import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { validateBlocks } from "../src/blog/blog-blocks.js";
import { BLOG_SEED_FILE, parseSeedPost, seedBlogPosts } from "../src/blog/blog.seed.js";
import { blogPosts, continents, countries } from "../src/db/schema/index.js";
import { SEED_DIR } from "../src/paths.js";
import { createTestApp, type TestApp } from "./helpers/index.js";

/**
 * `apps/web/scripts/export-blog-seed.ts` çıktısı olan, commit'li `seed/blog-posts.json`. Betik web'de
 * çalışır (tsx); burada dosyanın API'nin yazma kurallarına uyduğu ve gerçek veritabanına yüklenebildiği sınanır.
 */
interface RawPost {
  slug: string;
  status: string;
  countryCode: string;
  coverImage: string;
  tags: string[];
  translations: Record<string, { title: string; excerpt: string; body: Array<{ type: string; level?: number; text?: string; items?: string[] }> }>;
}

const file = JSON.parse(readFileSync(join(SEED_DIR, BLOG_SEED_FILE), "utf8")) as { posts: RawPost[] };
const CONTINENTS = ["africa", "americas", "asia", "europe", "oceania"];

describe("commit'li blog tohum dosyası (seed/blog-posts.json)", () => {
  it("her ülke merkezi için bir yazı var; slug'lar benzersiz ve ülke yoluyla uyumlu", () => {
    expect(file.posts.length).toBeGreaterThanOrEqual(40);
    const slugs = file.posts.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs).toEqual([...slugs].sort());
    for (const post of file.posts) expect(post.slug, post.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*-gezi-rehberi$/);
    const codes = file.posts.map((p) => p.countryCode);
    expect(new Set(codes).size).toBe(codes.length);
    for (const code of codes) expect(code).toMatch(/^[A-Z]{2}$/);
    const japan = file.posts.find((p) => p.slug === "japonya-gezi-rehberi");
    expect(japan).toMatchObject({ countryCode: "JP", status: "published", tags: ["ülke-rehberi", "asia"] });
  });

  it("sitede bilerek gizli hedef olan Svalbard (SJ) için herkese açık yazı üretilmez", () => {
    expect(file.posts.find((p) => p.countryCode === "SJ")).toBeUndefined();
    expect(file.posts.some((p) => p.slug.startsWith("svalbard"))).toBe(false);
  });

  it("her yazının Türkçe çevirisi var; yalnız canlı diller; başlık, özet ve gövde dolu", () => {
    for (const post of file.posts) {
      const langs = Object.keys(post.translations);
      expect(langs, post.slug).toContain("tr");
      for (const lang of langs) expect(["tr", "en", "es"], `${post.slug}.${lang}`).toContain(lang);
      for (const [lang, tr] of Object.entries(post.translations)) {
        expect(tr.title.trim(), `${post.slug}.${lang}.title`).not.toBe("");
        expect(tr.excerpt.trim(), `${post.slug}.${lang}.excerpt`).not.toBe("");
        expect(tr.body.length, `${post.slug}.${lang}.body`).toBeGreaterThan(0);
        // Yapı dillerde aynı: aynı bloklar, aynı sırada (metin çevrilir, düzen değişmez).
        expect(tr.body.map((b) => b.type + (b.level ?? "")), `${post.slug}.${lang}`).toEqual(post.translations.tr!.body.map((b) => b.type + (b.level ?? "")));
      }
    }
  });

  it("gövde blokları geçerli şemada: API'nin blok doğrulayıcısından sorunsuz geçer", () => {
    for (const post of file.posts) {
      for (const [lang, translation] of Object.entries(post.translations)) {
        expect(validateBlocks(translation.body, `${post.slug}.${lang}.body`), `${post.slug}.${lang}`).toEqual([]);
      }
      const parsed = parseSeedPost(post);
      expect("post" in parsed, `${post.slug}: ${"problems" in parsed ? parsed.problems.join("; ") : ""}`).toBe(true);
    }
  });

  it("gövde yapısı: h2 ile başlar; yalnız h2/h3, paragraf ve liste; HTML/Markdown işareti yok", () => {
    for (const post of file.posts) {
      for (const [lang, translation] of Object.entries(post.translations)) {
        const where = `${post.slug}.${lang}`;
        expect(translation.body[0], where).toMatchObject({ type: "heading", level: 2 });
        expect(translation.body.filter((b) => b.type === "paragraph").length, where).toBeGreaterThanOrEqual(3);
        for (const block of translation.body) expect(["heading", "paragraph", "list"], where).toContain(block.type);
        const texts = [translation.title, translation.excerpt, ...translation.body.flatMap((b) => (b.items ?? (b.text === undefined ? [] : [b.text])))];
        for (const text of texts) {
          expect(text, where).not.toMatch(/<\/?[a-zA-Z][^>]*>|\*\*|`|\]\(/);
          expect(text, where).toBe(text.trim());
        }
        // Rota listeleri: süre ve (varsa) şehirler, her biri bir madde.
        const lists = translation.body.filter((b) => b.type === "list");
        for (const list of lists) {
          expect(list.items!.length, where).toBeGreaterThanOrEqual(1);
          expect(list.items!.length, where).toBeLessThanOrEqual(2);
        }
      }
    }
  });

  it("kapak /og/<ad>.jpg kuralıyla mutlak https adres; yayın tarihi YOK (hub verisinde tarih yok, uydurulmaz); etiketler [ülke-rehberi, kıta]", () => {
    for (const post of file.posts) {
      expect(post.coverImage, post.slug).toMatch(/^https:\/\/wangoh\.com\/og\/[a-z0-9][a-z0-9-]*\.jpg$/);
      expect(post.status).toBe("published");
      expect(post, post.slug).not.toHaveProperty("publishedAt");
      expect(post.tags, post.slug).toHaveLength(2);
      expect(post.tags[0]).toBe("ülke-rehberi");
      expect(CONTINENTS, post.slug).toContain(post.tags[1]);
    }
  });

  describe("gerçek veritabanına yükleme", () => {
    let t: TestApp;
    beforeAll(async () => {
      t = await createTestApp();
      await t.db.insert(continents).values(CONTINENTS.map((slug, position) => ({ slug, position, translations: { tr: { name: slug } } })));
      await t.db.insert(countries).values(
        file.posts.map((p) => ({
          code: p.countryCode,
          iso3: `${p.countryCode}X`,
          continentSlug: p.tags[1]!,
          translations: { tr: { name: p.countryCode } },
        })),
      );
    });
    afterAll(() => t.close());

    it("tüm yazılar eklenir (ülkeleri varsa), tekrar çalıştırmak hiçbir şey eklemez", async () => {
      const first = await seedBlogPosts(t.db, { dir: SEED_DIR });
      expect(first).toEqual({ inserted: file.posts.length, updated: 0, existing: 0, missingCountry: [], invalid: [] });
      expect(await seedBlogPosts(t.db, { dir: SEED_DIR })).toEqual({ inserted: 0, updated: 0, existing: file.posts.length, missingCountry: [], invalid: [] });
    });

    it("yayın zamanı yükleme anıdır (uydurma sabit tarih değil) ve force yeniden yüklemesi onu bozmaz", async () => {
      const rows = await t.db.select({ slug: blogPosts.slug, publishedAt: blogPosts.publishedAt, createdAt: blogPosts.createdAt }).from(blogPosts);
      expect(rows).toHaveLength(file.posts.length);
      const stamps = new Set(rows.map((r) => r.publishedAt?.toISOString()));
      expect(stamps.size).toBe(1);
      const loadedAt = [...stamps][0]!;
      expect(loadedAt).not.toBe("2026-01-01T00:00:00.000Z");
      expect(Math.abs(new Date(loadedAt).getTime() - Date.now())).toBeLessThan(10 * 60_000);
      expect(rows.every((r) => r.publishedAt!.getTime() === r.createdAt.getTime())).toBe(true);

      const forced = await seedBlogPosts(t.db, { dir: SEED_DIR, force: true });
      expect(forced).toMatchObject({ inserted: 0, updated: file.posts.length, invalid: [] });
      const after = await t.db.select({ publishedAt: blogPosts.publishedAt }).from(blogPosts);
      expect(new Set(after.map((r) => r.publishedAt?.toISOString()))).toEqual(new Set([loadedAt]));
    });

    it("herkese açık API: liste kartları, ayrıntı, dil geri düşüşü ve filtreler tohum verisiyle çalışır", async () => {
      const list = await t.http.get("/v1/blog/posts").query({ pageSize: 100 });
      expect(list.status).toBe(200);
      expect(list.body.total).toBe(file.posts.length);
      expect(list.body.items.map((i: any) => i.slug)).toEqual(file.posts.map((p) => p.slug));
      expect(list.body.items.every((i: any) => i.author === null && !("body" in i))).toBe(true);
      // Gövdesiz kart: 44 yazı yaklaşık 1 MB gövde taşır, liste yanıtı bunun çok altında kalır.
      expect(JSON.stringify(list.body).length).toBeLessThan(200_000);

      const japan = file.posts.find((p) => p.slug === "japonya-gezi-rehberi")!;
      const tr = await t.http.get("/v1/blog/posts/japonya-gezi-rehberi");
      expect(tr.body).toMatchObject({ lang: "tr", complete: true, title: japan.translations.tr!.title, countryCode: "JP", coverImage: japan.coverImage, availableLangs: ["tr", "en", "es"] });
      expect(tr.body.body).toEqual(japan.translations.tr!.body);
      for (const lang of ["en", "es"]) {
        const res = await t.http.get("/v1/blog/posts/japonya-gezi-rehberi").query({ lang });
        expect(res.body, lang).toMatchObject({ lang, complete: true, title: japan.translations[lang]!.title });
        expect(res.body.body).toEqual(japan.translations[lang]!.body);
      }
      expect((await t.http.get("/v1/blog/posts").query({ tag: "ülke-rehberi" })).body.total).toBe(file.posts.length);
      expect((await t.http.get("/v1/blog/posts").query({ country: "JP" })).body.items.map((i: any) => i.slug)).toEqual(["japonya-gezi-rehberi"]);
      const asia = file.posts.filter((p) => p.tags[1] === "asia").length;
      expect((await t.http.get("/v1/blog/posts").query({ tag: "asia", pageSize: 100 })).body.total).toBe(asia);
      expect((await t.http.get("/v1/blog/posts").query({ q: "Japonya" })).body.items.map((i: any) => i.slug)).toContain("japonya-gezi-rehberi");
    });
  });
});
