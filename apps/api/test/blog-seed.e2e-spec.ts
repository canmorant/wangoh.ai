import { randomUUID } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Logger } from "@nestjs/common";
import { eq, inArray } from "drizzle-orm";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { BLOG_SEED_FILE, parseSeedPost, seedBlog, seedBlogPosts } from "../src/blog/blog.seed.js";
import { runSeed } from "../src/db/seed/index.js";
import { blogPosts, continents, countries } from "../src/db/schema/index.js";
import { bearer, createAdmin, createTestApp, type TestApp, type TestSession } from "./helpers/index.js";

const uid = (): string => randomUUID().slice(0, 8);

type SeedPost = Record<string, unknown> & { slug: string };

/** Geçerli bir tohum yazısı (JSON dosyasındaki biçim). */
const seedPost = (slug: string, over: Record<string, unknown> = {}): SeedPost => ({
  slug,
  status: "published",
  countryCode: "JP",
  coverImage: "https://wangoh.com/og/kapak.jpg",
  tags: ["ülke-rehberi", "asia"],
  // `publishedAt` yok: hub verisinde tarih olmadığından dışa aktarılan tohum da taşımaz (bkz. export-blog-seed.ts).
  translations: {
    tr: { title: `${slug} başlık`, excerpt: `${slug} özet`, body: [{ type: "heading", level: 2, text: "Giriş" }, { type: "paragraph", text: "Metin" }] },
    en: { title: `${slug} title`, excerpt: `${slug} excerpt`, body: [{ type: "paragraph", text: "Text" }] },
  },
  ...over,
});

describe("blog tohumu", () => {
  let t: TestApp;
  let admin: TestSession;
  const dirs: string[] = [];

  beforeAll(async () => {
    t = await createTestApp();
    await t.db.insert(continents).values([{ slug: "asia", position: 2, translations: { tr: { name: "Asya" } } }, { slug: "europe", position: 3, translations: { tr: { name: "Avrupa" } } }]);
    await t.db.insert(countries).values([
      { code: "JP", iso3: "JPN", continentSlug: "asia", translations: { tr: { name: "Japonya" } } },
      { code: "FR", iso3: "FRA", continentSlug: "europe", translations: { tr: { name: "Fransa" } } },
    ]);
    admin = await createAdmin(t);
  });
  afterAll(async () => {
    await t.close();
    await Promise.all(dirs.map((dir) => rm(dir, { recursive: true, force: true })));
  });
  afterEach(() => vi.restoreAllMocks());

  /** Geçici tohum klasörü; `posts` dizisini `blog-posts.json` olarak yazar. */
  const seedDir = async (posts: unknown[] | string = []): Promise<string> => {
    const dir = await mkdtemp(join(tmpdir(), "wangoh-blog-seed-"));
    dirs.push(dir);
    await writeFile(join(dir, BLOG_SEED_FILE), typeof posts === "string" ? posts : JSON.stringify({ posts }));
    return dir;
  };
  const rowOf = async (slug: string) => (await t.db.select().from(blogPosts).where(eq(blogPosts.slug, slug)))[0];
  const warnSpy = () => vi.spyOn(Logger.prototype, "warn").mockImplementation(() => undefined);
  const group = () => {
    const tag = `tohum-${uid()}`;
    const mk = (name: string, over: Record<string, unknown> = {}) => seedPost(`${tag}-${name}`, { tags: [tag, "asia"], ...over });
    return { tag, mk };
  };

  it("eksik slug'ları ekler: yazılar herkese açık, yazarsız; tarihsiz tohum yükleme anında yayınlanmış sayılır", async () => {
    const { tag, mk } = group();
    const dir = await seedDir([mk("jp"), mk("fr", { countryCode: "FR" }), mk("genel", { countryCode: null, coverImage: null })]);

    const before = Date.now();
    const result = await seedBlogPosts(t.db, { dir });
    const after = Date.now();
    expect(result).toEqual({ inserted: 3, updated: 0, existing: 0, missingCountry: [], invalid: [] });

    const list = await t.http.get("/v1/blog/posts").query({ tag });
    expect(list.body.total).toBe(3);
    // Yayın zamanı eşit (tek yükleme): sıra slug'a göre sabit.
    expect(list.body.items.map((i: any) => i.slug)).toEqual([`${tag}-fr`, `${tag}-genel`, `${tag}-jp`]);
    expect(list.body.items.every((i: any) => i.author === null && i.status === "published")).toBe(true);
    // Tarih uydurulmaz: yayın zamanı, yazının bu veritabanına ilk yüklendiği andır.
    const stamps = new Set(list.body.items.map((i: any) => i.publishedAt));
    expect(stamps.size).toBe(1);
    const loadedAt = new Date([...stamps][0] as string).getTime();
    expect(loadedAt).toBeGreaterThanOrEqual(before - 1000);
    expect(loadedAt).toBeLessThanOrEqual(after + 1000);
    const jp = await t.http.get(`/v1/blog/posts/${tag}-jp`).query({ lang: "en" });
    expect(jp.body).toMatchObject({
      countryCode: "JP",
      coverImage: "https://wangoh.com/og/kapak.jpg",
      tags: [tag, "asia"],
      lang: "en",
      complete: true,
      availableLangs: ["tr", "en"],
      title: `${tag}-jp title`,
      body: [{ type: "paragraph", text: "Text" }],
    });
    expect((await t.http.get(`/v1/blog/posts/${tag}-genel`)).body).toMatchObject({ countryCode: null, coverImage: null });
  });

  it("seedBlog (sabit imza) aynı işi yapar ve void döner", async () => {
    const { tag, mk } = group();
    const dir = await seedDir([mk("a")]);
    await expect(seedBlog(t.db, { dir })).resolves.toBeUndefined();
    expect((await t.http.get("/v1/blog/posts").query({ tag })).body.total).toBe(1);
  });

  it("idempotent: tekrar çalıştırmak satır eklemez ve içeriği/kimliği değiştirmez", async () => {
    const { tag, mk } = group();
    const dir = await seedDir([mk("a"), mk("b"), mk("c")]);
    await seedBlogPosts(t.db, { dir });
    const before = await t.db.select().from(blogPosts).where(inArray(blogPosts.slug, [`${tag}-a`, `${tag}-b`, `${tag}-c`]));

    const again = await seedBlogPosts(t.db, { dir });
    expect(again).toEqual({ inserted: 0, updated: 0, existing: 3, missingCountry: [], invalid: [] });
    await seedBlogPosts(t.db, { dir });

    const after = await t.db.select().from(blogPosts).where(inArray(blogPosts.slug, [`${tag}-a`, `${tag}-b`, `${tag}-c`]));
    expect(after).toHaveLength(3);
    expect(after.sort((x, y) => x.slug.localeCompare(y.slug))).toEqual(before.sort((x, y) => x.slug.localeCompare(y.slug)));
  });

  it("yönetici düzenlemesi ezilmez; tohum yalnız eksik slug'ı ekler", async () => {
    const { tag, mk } = group();
    const dir = await seedDir([mk("duzenlenen"), mk("silinen"), mk("dokunulmayan")]);
    await seedBlogPosts(t.db, { dir });

    const edited = await rowOf(`${tag}-duzenlenen`);
    await t.http
      .patch(`/v1/blog/posts/${edited!.id}`)
      .set(bearer(admin.accessToken))
      .send({ status: "draft", tags: ["yonetici"], coverImage: null, translations: { tr: { title: "Yönetici başlığı", excerpt: "Yönetici özeti", body: [{ type: "paragraph", text: "Yönetici metni" }] }, en: null } })
      .expect(200);
    const afterEdit = (await rowOf(`${tag}-duzenlenen`))!;
    const removed = await rowOf(`${tag}-silinen`);
    await t.http.delete(`/v1/blog/posts/${removed!.id}`).set(bearer(admin.accessToken)).expect(204);

    const result = await seedBlogPosts(t.db, { dir });
    // Yalnız silinen (artık eksik) slug yeniden eklenir; düzenlenen ve dokunulmayan olduğu gibi kalır.
    expect(result).toMatchObject({ inserted: 1, updated: 0, existing: 2 });
    const kept = await rowOf(`${tag}-duzenlenen`);
    expect(kept).toMatchObject({ id: edited!.id, status: "draft", tags: ["yonetici"], coverImage: null });
    expect(kept!.translations).toEqual({ tr: { title: "Yönetici başlığı", excerpt: "Yönetici özeti", body: [{ type: "paragraph", text: "Yönetici metni" }] } });
    // Tohum yönetici düzenlemesine hiç dokunmadı: satır, düzenleme sonrasıyla bayt bayt aynı.
    expect(kept).toEqual(afterEdit);
    expect(await rowOf(`${tag}-silinen`)).toBeDefined();
  });

  it("force: var olanları tohumla değiştirir; kimlik, oluşturulma zamanı ve yazar korunur", async () => {
    const { tag, mk } = group();
    const dir = await seedDir([mk("a"), mk("b")]);
    await seedBlogPosts(t.db, { dir });
    const a = (await rowOf(`${tag}-a`))!;
    await t.db.update(blogPosts).set({ authorId: admin.user.id }).where(eq(blogPosts.id, a.id));
    await t.http
      .patch(`/v1/blog/posts/${a.id}`)
      .set(bearer(admin.accessToken))
      .send({ tags: ["yonetici"], translations: { tr: { title: "Düzenlendi", excerpt: "Ö", body: [{ type: "paragraph", text: "x" }] } } })
      .expect(200);

    const forced = await seedBlogPosts(t.db, { dir, force: true });
    expect(forced).toMatchObject({ inserted: 0, updated: 2, existing: 0 });
    const restored = (await rowOf(`${tag}-a`))!;
    expect(restored.id).toBe(a.id);
    expect(restored.createdAt.getTime()).toBe(a.createdAt.getTime());
    expect(restored.authorId).toBe(admin.user.id);
    expect(restored.tags).toEqual([tag, "asia"]);
    expect(restored.translations.tr).toMatchObject({ title: `${tag}-a başlık` });
    // Tarihsiz tohum: özgün yayın zamanı yeniden yüklemede bozulmaz.
    expect(restored.publishedAt?.toISOString()).toBe(a.publishedAt?.toISOString());
    expect(a.publishedAt).not.toBeNull();

    // force ile yeni slug da eklenir.
    const dir2 = await seedDir([mk("a"), mk("b"), mk("c")]);
    expect(await seedBlogPosts(t.db, { dir: dir2, force: true })).toMatchObject({ inserted: 1, updated: 2 });
  });

  it("bağlı ülkesi olmayan yazı atlanır ve loglanır; ülke gelince sonraki çalıştırmada eklenir", async () => {
    const warn = warnSpy();
    const { tag, mk } = group();
    const dir = await seedDir([mk("var"), mk("eksik", { countryCode: "ZZ" })]);

    const first = await seedBlogPosts(t.db, { dir });
    expect(first).toMatchObject({ inserted: 1, missingCountry: [`${tag}-eksik`], invalid: [] });
    expect(await rowOf(`${tag}-eksik`)).toBeUndefined();
    expect(await rowOf(`${tag}-var`)).toBeDefined();
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(/ülke.*1 blog yazısı atlandı/));

    await t.db.insert(countries).values({ code: "ZZ", iso3: "ZZZ", continentSlug: "asia", translations: { tr: { name: "Zzz" } } });
    const second = await seedBlogPosts(t.db, { dir });
    expect(second).toMatchObject({ inserted: 1, existing: 1, missingCountry: [] });
    expect((await rowOf(`${tag}-eksik`))!.countryCode).toBe("ZZ");
    await t.db.delete(countries).where(eq(countries.code, "ZZ"));
  });

  it("geçersiz yazılar atlanır ve loglanır; geçerli olanlar yüklenir", async () => {
    const warn = warnSpy();
    const { tag, mk } = group();
    const ok = mk("gecerli");
    const body = (blocks: unknown[]) => ({ tr: { title: "T", excerpt: "Ö", body: blocks } });
    const invalid: unknown[] = [
      mk("kotu slug", { slug: "Kötü Slug" }),
      mk("http", { coverImage: "http://wangoh.com/a.jpg" }),
      mk("js-url", { translations: body([{ type: "image", url: "javascript:alert(1)", alt: "x" }]) }),
      mk("tur", { translations: body([{ type: "script", text: "x" }]) }),
      mk("tr-yok", { translations: { en: { title: "T", excerpt: "Ö", body: [] } } }),
      mk("dil", { translations: { tr: body([{ type: "paragraph", text: "x" }]).tr, de: { title: "T", excerpt: "Ö", body: [] } } }),
      mk("durum", { status: "archived" }),
      mk("ulke", { countryCode: "japonya" }),
      mk("etiket", { tags: ["iki kelime"] }),
      mk("tarih", { publishedAt: "dün" }),
      mk("tarih-sayi", { publishedAt: 5 }),
      mk("baslik-gorunmez", { translations: { tr: { title: "\u200b", excerpt: "Ö", body: [{ type: "paragraph", text: "x" }] } } }),
      mk("ozet-gorunmez", { translations: { tr: { title: "T", excerpt: "\u3164\u2800", body: [{ type: "paragraph", text: "x" }] } } }),
      mk("blok-gorunmez", { translations: { tr: { title: "T", excerpt: "Ö", body: [{ type: "paragraph", text: "\u2060" }] } } }),
      mk("kapak-yon", { coverImage: "https://wangoh.com/og/a\u202e.jpg" }),
      mk("bos-govde", { translations: body([]) }),
      mk("kontrol", { translations: body([{ type: "paragraph", text: "a\x00b" }]) }),
      "metin",
      null,
      { ...ok }, // yinelenen slug
    ];
    const dir = await seedDir([ok, ...invalid]);

    const result = await seedBlogPosts(t.db, { dir });
    expect(result.inserted).toBe(1);
    expect(result.invalid).toHaveLength(invalid.length);
    expect(result.invalid.some((m) => m.includes("yinelenen slug"))).toBe(true);
    expect(await t.db.select().from(blogPosts).where(eq(blogPosts.slug, `${tag}-gecerli`))).toHaveLength(1);
    expect(await t.db.select({ slug: blogPosts.slug }).from(blogPosts).where(inArray(blogPosts.slug, [`${tag}-http`, `${tag}-js-url`, `${tag}-tur`, `${tag}-bos-govde`]))).toEqual([]);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("Geçersiz blog tohum yazısı atlandı"));
  });

  it("parseSeedPost: API yazma kurallarıyla aynı doğrulama; yayın tarihi isteğe bağlı (tarihsiz = yükleme anı)", () => {
    const dated = parseSeedPost(seedPost("gecerli-yazi", { publishedAt: "2026-01-01T00:00:00.000Z" }));
    expect("post" in dated && dated.post.publishedAt?.toISOString()).toBe("2026-01-01T00:00:00.000Z");
    const undated = parseSeedPost(seedPost("tarihsiz-yazi"));
    expect("post" in undated && undated.post.publishedAt).toBeNull();
    const nulled = parseSeedPost(seedPost("null-tarihli", { publishedAt: null }));
    expect("post" in nulled && nulled.post).toMatchObject({ status: "published", publishedAt: null });
    const draft = parseSeedPost(seedPost("taslak-yazi", { status: "draft", publishedAt: null }));
    expect("post" in draft && draft.post.status).toBe("draft");
    const bad = parseSeedPost(seedPost("kotu-yazi", { translations: { tr: { title: "T", excerpt: "Ö", body: [{ type: "image", url: "http://x.co/a.png", alt: "a" }] } } }));
    expect("problems" in bad && bad.problems.join(" ")).toContain("translations.tr.body.0.url");
  });

  it("açıkça yazılmış gerçek yayın tarihi korunur (sıralamada kullanılır); force da onu tohumdan yeniler", async () => {
    const { tag, mk } = group();
    const dir = await seedDir([mk("eski", { publishedAt: "2024-05-01T10:00:00.000Z" }), mk("yeni", { publishedAt: "2025-02-03T04:05:06.000Z" }), mk("tarihsiz")]);
    await seedBlogPosts(t.db, { dir });
    const list = await t.http.get("/v1/blog/posts").query({ tag });
    // Tarihsiz yazı yükleme anında yayınlandı: en yeni; ardından açık tarihliler.
    expect(list.body.items.map((i: any) => [i.slug, i.publishedAt])).toEqual([
      [`${tag}-tarihsiz`, expect.any(String)],
      [`${tag}-yeni`, "2025-02-03T04:05:06.000Z"],
      [`${tag}-eski`, "2024-05-01T10:00:00.000Z"],
    ]);

    // Dosyadaki açık tarih değişirse force yeni tarihi yazar.
    const dir2 = await seedDir([mk("eski", { publishedAt: "2023-01-01T00:00:00.000Z" })]);
    await seedBlogPosts(t.db, { dir: dir2, force: true });
    expect((await rowOf(`${tag}-eski`))!.publishedAt?.toISOString()).toBe("2023-01-01T00:00:00.000Z");
  });

  it("force: tarihsiz tohum var olan yayın zamanını korur; yönetici taslağa aldıysa zaman silinmez", async () => {
    const { tag, mk } = group();
    const dir = await seedDir([mk("a"), mk("b")]);
    await seedBlogPosts(t.db, { dir });
    const a = (await rowOf(`${tag}-a`))!;
    const originalAt = a.publishedAt!.toISOString();
    await t.http.patch(`/v1/blog/posts/${a.id}`).set(bearer(admin.accessToken)).send({ status: "draft" }).expect(200);

    await new Promise((resolve) => setTimeout(resolve, 15));
    await seedBlogPosts(t.db, { dir, force: true });
    for (const slug of [`${tag}-a`, `${tag}-b`]) {
      const row = (await rowOf(slug))!;
      expect(row.status, slug).toBe("published");
      expect(row.publishedAt?.toISOString(), slug).toBe(originalAt);
    }
  });

  it("tarihsiz taslak tohumu tarihsiz kalır (force dahil); yönetici sonradan yayınlayınca zaman atanır", async () => {
    const { tag, mk } = group();
    const dir = await seedDir([mk("taslak", { status: "draft" })]);
    await seedBlogPosts(t.db, { dir });
    await seedBlogPosts(t.db, { dir, force: true });
    const draft = (await rowOf(`${tag}-taslak`))!;
    expect(draft).toMatchObject({ status: "draft", publishedAt: null });
    const published = await t.http.patch(`/v1/blog/posts/${draft.id}`).set(bearer(admin.accessToken)).send({ status: "published" });
    expect(published.status).toBe(200);
    expect(published.body.publishedAt).toEqual(expect.any(String));
  });

  it("etiketler API yazma uçlarıyla aynı kuralla normalleşir: büyük harfli/NFD/İ'li tohum etiketi ?tag= ile bulunur", async () => {
    const { tag, mk } = group();
    const nfc = "\u00fcn";
    const dir = await seedDir([mk("etiket", { tags: [tag, "Asia", "İstanbul", "IĞDIR", "u\u0308n", nfc, "ASIA"] })]);
    const result = await seedBlogPosts(t.db, { dir });
    expect(result).toMatchObject({ inserted: 1, invalid: [] });
    expect((await rowOf(`${tag}-etiket`))!.tags).toEqual([tag, "asia", "istanbul", "iğdir", nfc]);
    for (const query of ["asia", "Asia", "istanbul", "İstanbul", "iğdir", "IĞDIR", nfc, "u\u0308n"]) {
      const res = await t.http.get("/v1/blog/posts").query({ tag: query });
      expect(res.body.items.map((i: any) => i.slug).includes(`${tag}-etiket`), `?tag=${query}`).toBe(true);
    }
  });

  it("runSeed (db:seed --force yolu): force blog yazılarını da tohumla yeniler; force yoksa yönetici düzenlemesi korunur", async () => {
    const { tag, mk } = group();
    const dir = await seedDir([mk("almanya"), mk("fransa", { countryCode: "FR" })]);
    await runSeed(t.db, { dir });
    const edited = (await rowOf(`${tag}-almanya`))!;
    await t.http
      .patch(`/v1/blog/posts/${edited.id}`)
      .set(bearer(admin.accessToken))
      .send({ translations: { tr: { title: "ELLE DÜZENLENDİ", excerpt: "Ö", body: [{ type: "paragraph", text: "x" }] } } })
      .expect(200);
    const keepsAt = (await rowOf(`${tag}-almanya`))!.publishedAt;

    // force yok: düzenleme korunur.
    await runSeed(t.db, { dir });
    expect((await rowOf(`${tag}-almanya`))!.translations.tr.title).toBe("ELLE DÜZENLENDİ");

    // force: tohum metni geri gelir; kimlik ve yayın zamanı korunur.
    await runSeed(t.db, { dir, force: true });
    const refreshed = (await rowOf(`${tag}-almanya`))!;
    expect(refreshed.translations.tr.title).toBe(`${tag}-almanya başlık`);
    expect(refreshed.id).toBe(edited.id);
    expect(refreshed.publishedAt).toEqual(keepsAt);
    expect((await rowOf(`${tag}-fransa`))!.translations.tr.title).toBe(`${tag}-fransa başlık`);
  });

  it("klasör ya da dosya yoksa sessizce atlar; hiçbir uyarı yazmaz", async () => {
    const warn = warnSpy();
    const empty = await mkdtemp(join(tmpdir(), "wangoh-blog-seed-"));
    dirs.push(empty);
    const none = { inserted: 0, updated: 0, existing: 0, missingCountry: [], invalid: [] };
    expect(await seedBlogPosts(t.db, { dir: join(empty, "yok-klasor") })).toEqual(none);
    expect(await seedBlogPosts(t.db, { dir: empty })).toEqual(none);
    await expect(seedBlog(t.db, { dir: join(empty, "yok") })).resolves.toBeUndefined();
    expect(await seedBlogPosts(t.db, { dir: await seedDir([]) })).toEqual(none);
    expect(warn).not.toHaveBeenCalled();
  });

  it("bozuk JSON ve yanlış biçim açık hatadır (sessizce yutulmaz)", async () => {
    await expect(seedBlogPosts(t.db, { dir: await seedDir("{bozuk") })).rejects.toThrow(/blog-posts\.json geçerli bir JSON değil/);
    await expect(seedBlogPosts(t.db, { dir: await seedDir(JSON.stringify([])) })).rejects.toThrow(/"posts"/);
    await expect(seedBlogPosts(t.db, { dir: await seedDir(JSON.stringify({ posts: "x" })) })).rejects.toThrow(/"posts"/);
  });

  it("eşzamanlı iki çalıştırma çakışmaz: her slug bir kez eklenir", async () => {
    const { tag, mk } = group();
    const dir = await seedDir([mk("a"), mk("b"), mk("c"), mk("d")]);
    const [one, two] = await Promise.all([seedBlogPosts(t.db, { dir }), seedBlogPosts(t.db, { dir })]);
    expect(one.inserted + two.inserted).toBe(4);
    expect((await t.http.get("/v1/blog/posts").query({ tag })).body.total).toBe(4);
  });

  it("taslak tohumu taslak kalır ve anonime görünmez", async () => {
    const { tag, mk } = group();
    const dir = await seedDir([mk("canli"), mk("taslak", { status: "draft", publishedAt: null })]);
    await seedBlogPosts(t.db, { dir });
    expect((await rowOf(`${tag}-taslak`))).toMatchObject({ status: "draft", publishedAt: null });
    expect((await t.http.get("/v1/blog/posts").query({ tag })).body.items.map((i: any) => i.slug)).toEqual([`${tag}-canli`]);
    expect((await t.http.get(`/v1/blog/posts/${tag}-taslak`)).status).toBe(404);
  });
});
