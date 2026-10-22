import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { BlogService } from "../src/blog/blog.service.js";
import { blogPosts, continents, countries } from "../src/db/schema/index.js";
import { bearer, createAdmin, createTestApp, registerUser, type TestApp, type TestSession } from "./helpers/index.js";

const uid = (): string => randomUUID().slice(0, 8);

/** Liste kartının sahip olabileceği TÜM alanlar: gövde, e-posta, yazar kimliği yok. */
const SUMMARY_KEYS = [
  "author", "availableLangs", "complete", "countryCode", "coverImage", "createdAt", "excerpt", "id", "lang",
  "publishedAt", "slug", "status", "tags", "title", "updatedAt",
];

const bodyOf = (title: string) => [
  { type: "heading", level: 2, text: `${title} giriş` },
  { type: "paragraph", text: `${title} metni` },
];
const translation = (title: string) => ({ title, excerpt: `${title} özeti`, body: bodyOf(title) });

describe("blog", () => {
  let t: TestApp;
  let admin: TestSession;
  let user: TestSession;
  const asAdmin = () => bearer(admin.accessToken);

  beforeAll(async () => {
    t = await createTestApp();
    await t.db.insert(continents).values([
      { slug: "asia", position: 2, translations: { tr: { name: "Asya" } } },
      { slug: "europe", position: 3, translations: { tr: { name: "Avrupa" } } },
    ]);
    await t.db.insert(countries).values([
      { code: "JP", iso3: "JPN", continentSlug: "asia", translations: { tr: { name: "Japonya" } } },
      { code: "FR", iso3: "FRA", continentSlug: "europe", translations: { tr: { name: "Fransa" } } },
      { code: "TR", iso3: "TUR", continentSlug: "asia", translations: { tr: { name: "Türkiye" } } },
    ]);
    admin = await createAdmin(t, { displayName: "Yönetici Yazar" });
    user = await registerUser(t.http);
  });
  afterAll(() => t.close());

  /** API üzerinden yazı oluşturur (varsayılan: Türkçe, slug'a göre başlık). */
  const create = (over: Record<string, unknown> = {}) => {
    const slug = (over.slug as string | undefined) ?? `yazi-${uid()}`;
    return t.http.post("/v1/blog/posts").set(asAdmin()).send({ slug, translations: { tr: translation(slug) }, ...over });
  };
  const mustCreate = async (over: Record<string, unknown> = {}) => {
    const res = await create(over);
    expect(res.status, JSON.stringify(res.body)).toBe(201);
    return res.body as { id: string; slug: string; [key: string]: any };
  };
  /** Tarihi kontrol etmek için doğrudan veritabanına yazar. */
  const insertPost = async (over: Partial<typeof blogPosts.$inferInsert> & { slug: string }) => {
    const [row] = await t.db
      .insert(blogPosts)
      .values({ status: "published", publishedAt: new Date(), translations: { tr: translation(over.slug) }, ...over })
      .returning();
    return row!;
  };
  const row = async (id: string) => (await t.db.select().from(blogPosts).where(eq(blogPosts.id, id)))[0]!;
  const slugsOf = (res: { body: { items: Array<{ slug: string }> } }): string[] => res.body.items.map((i) => i.slug);

  describe("görünürlük ve yetki", () => {
    it("anonim yalnız yayındaki yazıları görür; taslak listede yok; kart gövde ve gizli alan taşımaz", async () => {
      const tag = `vis-${uid()}`;
      const live = await mustCreate({ status: "published", tags: [tag], countryCode: "JP", coverImage: "https://wangoh.com/og/a.jpg" });
      const draft = await mustCreate({ status: "draft", tags: [tag] });

      const res = await t.http.get("/v1/blog/posts").query({ tag });
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ page: 1, pageSize: 20, total: 1 });
      expect(slugsOf(res)).toEqual([live.slug]);
      const [card] = res.body.items;
      expect(Object.keys(card).sort()).toEqual(SUMMARY_KEYS);
      expect(card).toMatchObject({ status: "published", lang: "tr", complete: true, availableLangs: ["tr"], countryCode: "JP", coverImage: "https://wangoh.com/og/a.jpg" });
      expect(card.author).toEqual({ displayName: "Yönetici Yazar" });
      expect(JSON.stringify(res.body)).not.toContain(admin.email);
      expect(JSON.stringify(res.body)).not.toContain(draft.slug);
    });

    it("taslak slug'ı anonime ve kullanıcıya, hiç olmayan slug'la aynı 404 gövdesini verir (varlığı sızmaz)", async () => {
      const draft = await mustCreate({ status: "draft" });
      const missing = await t.http.get(`/v1/blog/posts/yok-${uid()}`);
      expect(missing.status).toBe(404);
      for (const headers of [{}, bearer(user.accessToken)]) {
        const res = await t.http.get(`/v1/blog/posts/${draft.slug}`).set(headers);
        expect(res.status).toBe(404);
        expect(res.body).toEqual(missing.body);
        expect(res.body.code).toBe("NOT_FOUND");
      }
    });

    it("admin taslakları listeler ve ayrıntısını görür; status filtreleri çalışır", async () => {
      const tag = `adm-${uid()}`;
      const live = await mustCreate({ status: "published", tags: [tag] });
      const draft = await mustCreate({ status: "draft", tags: [tag] });

      const all = await t.http.get("/v1/blog/posts").query({ tag, status: "all" }).set(asAdmin());
      expect(all.status).toBe(200);
      expect(slugsOf(all).sort()).toEqual([live.slug, draft.slug].sort());
      expect(all.body.items.find((i: any) => i.slug === draft.slug)).toMatchObject({ status: "draft", publishedAt: null });
      expect(slugsOf(await t.http.get("/v1/blog/posts").query({ tag, status: "draft" }).set(asAdmin()))).toEqual([draft.slug]);
      expect(slugsOf(await t.http.get("/v1/blog/posts").query({ tag, status: "published" }).set(asAdmin()))).toEqual([live.slug]);
      // status verilmeyen liste yönetici için de yayındakilerle sınırlı (herkese açık görünüm).
      expect(slugsOf(await t.http.get("/v1/blog/posts").query({ tag }).set(asAdmin()))).toEqual([live.slug]);

      // Ayrıntı: yönetici durum vermeden taslağı görür; status ile daraltabilir.
      const detail = await t.http.get(`/v1/blog/posts/${draft.slug}`).set(asAdmin());
      expect(detail.status).toBe(200);
      expect(detail.body).toMatchObject({ slug: draft.slug, status: "draft" });
      expect((await t.http.get(`/v1/blog/posts/${draft.slug}`).query({ status: "draft" }).set(asAdmin())).status).toBe(200);
      expect((await t.http.get(`/v1/blog/posts/${draft.slug}`).query({ status: "all" }).set(asAdmin())).status).toBe(200);
      expect((await t.http.get(`/v1/blog/posts/${draft.slug}`).query({ status: "published" }).set(asAdmin())).status).toBe(404);
      expect((await t.http.get(`/v1/blog/posts/${live.slug}`).query({ status: "draft" }).set(asAdmin())).status).toBe(404);
      expect((await t.http.get(`/v1/blog/posts/${live.slug}`).set(asAdmin())).status).toBe(200);
    });

    it("admin olmayan status=draft|all ister: oturumsuz 401, kullanıcı 403; parametre sessizce yok sayılmaz", async () => {
      const draft = await mustCreate({ status: "draft" });
      for (const status of ["draft", "all"]) {
        const anon = await t.http.get("/v1/blog/posts").query({ status });
        expect(anon.status, `anonim liste ${status}`).toBe(401);
        expect(anon.body.code).toBe("AUTH_REQUIRED");
        const asUser = await t.http.get("/v1/blog/posts").query({ status }).set(bearer(user.accessToken));
        expect(asUser.status, `kullanıcı liste ${status}`).toBe(403);
        expect(asUser.body.code).toBe("FORBIDDEN");
        expect((await t.http.get(`/v1/blog/posts/${draft.slug}`).query({ status })).status).toBe(401);
        expect((await t.http.get(`/v1/blog/posts/${draft.slug}`).query({ status }).set(bearer(user.accessToken))).status).toBe(403);
      }
      // status=published herkese açık.
      expect((await t.http.get("/v1/blog/posts").query({ status: "published" })).status).toBe(200);
      expect((await t.http.get("/v1/blog/posts").query({ status: "published" }).set(bearer(user.accessToken))).status).toBe(200);
      expect((await t.http.get("/v1/blog/posts").query({ status: "yayinda" })).status).toBe(400);
    });

    it("normal kullanıcı yayındaki yazıyı görür; bozuk belirteç 401 (OptionalAuth)", async () => {
      const live = await mustCreate({ status: "published" });
      expect((await t.http.get(`/v1/blog/posts/${live.slug}`).set(bearer(user.accessToken))).status).toBe(200);
      const bad = await t.http.get("/v1/blog/posts").set("Authorization", "Bearer bozuk");
      expect(bad.status).toBe(401);
      expect(bad.body.code).toBe("AUTH_TOKEN_INVALID");
    });

    it("yazma uçları: oturumsuz 401, kullanıcı 403, hiçbir şey değişmez", async () => {
      const post = await mustCreate({ status: "published" });
      const payload = { slug: `x-${uid()}`, translations: { tr: translation("X") } };
      const attempts: Array<[string, string, object | undefined]> = [
        ["post", "/v1/blog/posts", payload],
        ["patch", `/v1/blog/posts/${post.id}`, { status: "draft" }],
        ["delete", `/v1/blog/posts/${post.id}`, undefined],
      ];
      for (const [method, url, body] of attempts) {
        const anon = await (t.http as any)[method](url).send(body);
        expect(anon.status, `anonim ${method}`).toBe(401);
        const asUser = await (t.http as any)[method](url).set(bearer(user.accessToken)).send(body);
        expect(asUser.status, `kullanıcı ${method}`).toBe(403);
        expect(asUser.body.code).toBe("FORBIDDEN");
      }
      expect((await row(post.id)).status).toBe("published");
      expect(await t.db.select().from(blogPosts).where(eq(blogPosts.slug, payload.slug))).toHaveLength(0);
    });

    it("sorgu dizgisi: bilinmeyen parametre, geçersiz lang ve NUL 400", async () => {
      expect((await t.http.get("/v1/blog/posts").query({ foo: "1" })).status).toBe(400);
      expect((await t.http.get("/v1/blog/posts").query({ lang: "de" })).status).toBe(400);
      expect((await t.http.get("/v1/blog/posts").query({ country: "JPN" })).status).toBe(400);
      expect((await t.http.get("/v1/blog/posts?q=a%00b")).status).toBe(400);
      expect((await t.http.get("/v1/blog/posts/a%00b")).status).toBe(400);
      expect((await t.http.get("/v1/blog/posts").query({ tag: ["a", "b"] })).status).toBe(400);
    });

    it("garip slug'lar 500 değil 404 verir", async () => {
      for (const slug of ["%C3%9CL", "A".repeat(500), "bosluk%20var", "..%2F..%2Fetc"]) {
        const res = await t.http.get(`/v1/blog/posts/${slug}`);
        expect(res.status, slug).toBe(404);
      }
    });
  });

  describe("yönetici CRUD", () => {
    it("taslak oluşturur: varsayılanlar, yazar, normalleştirme", async () => {
      const slug = `taslak-${uid()}`;
      const res = await t.http
        .post("/v1/blog/posts")
        .set(asAdmin())
        .send({
          slug: `  ${slug.toUpperCase()}  `,
          tags: ["Ülke-Rehberi", "ASIA", "asia", "  gezi  "],
          countryCode: "jp",
          coverImage: "https://wangoh.com/og/kapak.jpg",
          translations: { tr: { title: "  Başlık  ", excerpt: " Özet ", body: bodyOf("T") } },
        });
      expect(res.status, JSON.stringify(res.body)).toBe(201);
      expect(res.body).toMatchObject({
        slug,
        status: "draft",
        publishedAt: null,
        lang: "tr",
        complete: true,
        availableLangs: ["tr"],
        title: "Başlık",
        excerpt: "Özet",
        tags: ["ülke-rehberi", "asia", "gezi"],
        countryCode: "JP",
        coverImage: "https://wangoh.com/og/kapak.jpg",
        author: { displayName: "Yönetici Yazar" },
        body: bodyOf("T"),
      });
      expect(res.body.id).toMatch(/^[0-9a-f-]{36}$/);
      expect(JSON.stringify(res.body)).not.toContain(admin.email);
      const stored = await row(res.body.id);
      expect(stored.authorId).toBe(admin.user.id);
      expect(stored.status).toBe("draft");
      expect(stored.publishedAt).toBeNull();
    });

    it("geçersiz girdiler 400 VALIDATION_FAILED (500 değil) ve alan yolunu gösterir", async () => {
      const ok = { slug: `ok-${uid()}`, translations: { tr: translation("Ok") } };
      const cases: Array<[string, Record<string, unknown>, string]> = [
        ["slug boşluklu", { ...ok, slug: "iki kelime" }, "slug"],
        ["slug tire ile başlar", { ...ok, slug: "-abc" }, "slug"],
        ["slug çift tire", { ...ok, slug: "a--b" }, "slug"],
        ["slug çok kısa", { ...ok, slug: "ab" }, "slug"],
        ["slug Türkçe karakter", { ...ok, slug: "gezi-rehberi-şehir" }, "slug"],
        ["slug çok uzun", { ...ok, slug: "a".repeat(121) }, "slug"],
        ["slug yok", { translations: ok.translations }, "slug"],
        ["geçersiz status", { ...ok, status: "archived" }, "status"],
        ["status null", { ...ok, status: null }, "status"],
        ["kapak http", { ...ok, coverImage: "http://wangoh.com/a.jpg" }, "coverImage"],
        ["kapak javascript", { ...ok, coverImage: "javascript:alert(1)" }, "coverImage"],
        ["kapak boş", { ...ok, coverImage: "" }, "coverImage"],
        ["kapak sayı", { ...ok, coverImage: 5 }, "coverImage"],
        ["etiket sayısı", { ...ok, tags: Array.from({ length: 21 }, (_, i) => `e${i}`) }, "tags"],
        ["etiket boşluklu", { ...ok, tags: ["iki kelime"] }, "tags"],
        ["etiket çok uzun", { ...ok, tags: ["a".repeat(51)] }, "tags"],
        ["etiket null", { ...ok, tags: null }, "tags"],
        ["ülke kodu 3 harf", { ...ok, countryCode: "JPN" }, "countryCode"],
        ["ülke kodu sayı", { ...ok, countryCode: 5 }, "countryCode"],
        ["translations yok", { slug: ok.slug }, "translations"],
        ["translations dizi", { ...ok, translations: [] }, "translations"],
        ["tr yok", { ...ok, translations: { en: translation("En") } }, "translations.tr"],
        ["desteklenmeyen dil", { ...ok, translations: { tr: translation("T"), de: translation("De") } }, "translations.de"],
        ["en dizi", { ...ok, translations: { tr: translation("T"), en: [] } }, "translations.en"],
        ["başlık yok", { ...ok, translations: { tr: { excerpt: "Ö", body: [] } } }, "translations.tr.title"],
        ["başlık boş", { ...ok, translations: { tr: { title: "   ", excerpt: "Ö", body: [] } } }, "translations.tr.title"],
        ["başlık uzun", { ...ok, translations: { tr: { title: "a".repeat(201), excerpt: "Ö", body: [] } } }, "translations.tr.title"],
        ["başlıkta NUL", { ...ok, translations: { tr: { title: "a\x00b", excerpt: "Ö", body: [] } } }, "translations.tr.title"],
        ["başlıkta satır sonu", { ...ok, translations: { tr: { title: "a\nb", excerpt: "Ö", body: [] } } }, "translations.tr.title"],
        ["başlık yalnız sıfır genişlikli boşluk", { ...ok, translations: { tr: { title: "\u200b", excerpt: "Ö", body: [] } } }, "translations.tr.title"],
        ["başlık yalnız Hangul dolgusu", { ...ok, translations: { tr: { title: "\u3164\u3164", excerpt: "Ö", body: [] } } }, "translations.tr.title"],
        ["özet yalnız kelime birleştirici", { ...ok, translations: { tr: { title: "T", excerpt: "\u2060", body: [] } } }, "translations.tr.excerpt"],
        ["özet yalnız Braille boşluğu", { ...ok, translations: { tr: { title: "T", excerpt: "\u2800 \u00ad", body: [] } } }, "translations.tr.excerpt"],
        ["en başlığı yalnız görünmez", { ...ok, translations: { tr: translation("T"), en: { title: "\u200c", excerpt: "Ö", body: [] } } }, "translations.en.title"],
        ["kapak yön geçersiz kılma", { ...ok, coverImage: "https://example.com/a\u202e.png" }, "coverImage"],
        ["kapak sıfır genişlikli", { ...ok, coverImage: "https://example.com/a\u200b.png" }, "coverImage"],
        ["özet yok", { ...ok, translations: { tr: { title: "T", body: [] } } }, "translations.tr.excerpt"],
        ["özet uzun", { ...ok, translations: { tr: { title: "T", excerpt: "a".repeat(1001), body: [] } } }, "translations.tr.excerpt"],
        ["özette ESC", { ...ok, translations: { tr: { title: "T", excerpt: "a\x1bb", body: [] } } }, "translations.tr.excerpt"],
        ["gövde yok", { ...ok, translations: { tr: { title: "T", excerpt: "Ö" } } }, "translations.tr.body"],
        ["gövde dizi değil", { ...ok, translations: { tr: { title: "T", excerpt: "Ö", body: "metin" } } }, "translations.tr.body"],
        ["gövde null", { ...ok, translations: { tr: { title: "T", excerpt: "Ö", body: null } } }, "translations.tr.body"],
        ["çeviride fazladan alan", { ...ok, translations: { tr: { ...translation("T"), html: "<b>" } } }, "translations.tr.html"],
        ["bilinmeyen üst düzey alan", { ...ok, authorId: randomUUID() }, "authorId"],
        ["yayın zamanı istemciden gelmez", { ...ok, publishedAt: "2020-01-01T00:00:00Z" }, "publishedAt"],
        ["id istemciden gelmez", { ...ok, id: randomUUID() }, "id"],
      ];
      for (const [name, body, field] of cases) {
        const res = await t.http.post("/v1/blog/posts").set(asAdmin()).send(body);
        expect(res.status, `${name}: ${JSON.stringify(res.body)}`).toBe(400);
        expect(res.body.code, name).toBe("VALIDATION_FAILED");
        expect(res.body.details.map((d: any) => d.field), name).toContain(field);
      }
      expect((await t.http.post("/v1/blog/posts").set(asAdmin()).send("düz metin").set("Content-Type", "text/plain")).status).toBeGreaterThanOrEqual(400);
      expect((await t.http.post("/v1/blog/posts").set(asAdmin()).set("Content-Type", "application/json").send("{bozuk")).status).toBe(400);
      expect(await t.db.select().from(blogPosts).where(eq(blogPosts.slug, ok.slug))).toHaveLength(0);
    });

    it("var olmayan ülke 400 (FK hatası 500 olmaz); slug çakışması 409 BLOG_SLUG_TAKEN", async () => {
      const unknown = await create({ countryCode: "ZZ" });
      expect(unknown.status).toBe(400);
      expect(unknown.body.details).toEqual([{ field: "countryCode", code: "unknownCountry", message: expect.any(String) }]);

      const first = await mustCreate();
      const clash = await create({ slug: first.slug });
      expect(clash.status).toBe(409);
      expect(clash.body).toMatchObject({ statusCode: 409, code: "BLOG_SLUG_TAKEN", details: [{ field: "slug" }] });
      // Büyük/küçük harf ve kenar boşluğu farkı aynı slug'tır.
      expect((await create({ slug: ` ${first.slug.toUpperCase()} ` })).status).toBe(409);
      expect(await t.db.select().from(blogPosts).where(eq(blogPosts.slug, first.slug))).toHaveLength(1);
    });

    it("güncelleme: yalnız gönderilen alanlar değişir; diller birleşir; null temizler/siler", async () => {
      const created = await mustCreate({
        status: "published",
        tags: ["a"],
        countryCode: "JP",
        coverImage: "https://wangoh.com/og/a.jpg",
        translations: { tr: translation("Özgün"), en: translation("Original") },
      });
      const before = await row(created.id);

      // Yalnız Türkçe başlık/özet/gövde bütün olarak değişir; en korunur.
      const trPatch = await t.http
        .patch(`/v1/blog/posts/${created.id}`)
        .set(asAdmin())
        .send({ translations: { tr: { title: "Yeni başlık", excerpt: "Yeni özet", body: [{ type: "paragraph", text: "Yeni gövde" }] } } });
      expect(trPatch.status, JSON.stringify(trPatch.body)).toBe(200);
      expect(trPatch.body).toMatchObject({
        title: "Yeni başlık",
        excerpt: "Yeni özet",
        body: [{ type: "paragraph", text: "Yeni gövde" }],
        tags: ["a"],
        countryCode: "JP",
        coverImage: "https://wangoh.com/og/a.jpg",
        availableLangs: ["tr", "en"],
        author: { displayName: "Yönetici Yazar" },
      });
      expect((await t.http.get(`/v1/blog/posts/${created.slug}`).query({ lang: "en" })).body.title).toBe("Original");
      expect(new Date(trPatch.body.updatedAt).getTime()).toBeGreaterThanOrEqual(new Date(before.updatedAt).getTime());
      expect(trPatch.body.createdAt).toBe(before.createdAt.toISOString());

      // es eklenir, en silinir.
      const langs = await t.http
        .patch(`/v1/blog/posts/${created.id}`)
        .set(asAdmin())
        .send({ translations: { es: translation("Original ES"), en: null } });
      expect(langs.status, JSON.stringify(langs.body)).toBe(200);
      expect(langs.body.availableLangs).toEqual(["tr", "es"]);
      expect((await row(created.id)).translations).toEqual({ tr: expect.objectContaining({ title: "Yeni başlık" }), es: expect.objectContaining({ title: "Original ES" }) });

      // Skalar alanlar: etiketler tümden değişir, null kapak/ülkeyi temizler.
      const scalars = await t.http
        .patch(`/v1/blog/posts/${created.id}`)
        .set(asAdmin())
        .send({ tags: ["b", "c", "b"], coverImage: null, countryCode: null });
      expect(scalars.status).toBe(200);
      expect(scalars.body).toMatchObject({ tags: ["b", "c"], coverImage: null, countryCode: null, title: "Yeni başlık" });
      expect(scalars.body.slug).toBe(created.slug);

      // Slug değişir; eski adres artık yok.
      const newSlug = `yeni-${uid()}`;
      expect((await t.http.patch(`/v1/blog/posts/${created.id}`).set(asAdmin()).send({ slug: newSlug })).body.slug).toBe(newSlug);
      expect((await t.http.get(`/v1/blog/posts/${created.slug}`)).status).toBe(404);
      expect((await t.http.get(`/v1/blog/posts/${newSlug}`)).status).toBe(200);
      // Kendi slug'ını yeniden göndermek çakışma değildir.
      expect((await t.http.patch(`/v1/blog/posts/${created.id}`).set(asAdmin()).send({ slug: newSlug })).status).toBe(200);
    });

    it("güncelleme hataları: boş gövde, bilinmeyen alan, tr silme, slug çakışması, ülke, kimlik", async () => {
      const a = await mustCreate();
      const b = await mustCreate();
      const patch = (id: string, body: object) => t.http.patch(`/v1/blog/posts/${id}`).set(asAdmin()).send(body);

      const empty = await patch(a.id, {});
      expect(empty.status).toBe(400);
      expect(empty.body.details).toEqual([{ field: "", code: "noChanges", message: expect.any(String) }]);
      for (const body of [{ authorId: randomUUID() }, { publishedAt: "2020-01-01T00:00:00Z" }, { id: randomUUID() }, { createdAt: "x" }]) {
        const res = await patch(a.id, body);
        expect(res.status, JSON.stringify(body)).toBe(400);
        expect(res.body.code).toBe("VALIDATION_FAILED");
      }
      for (const body of [
        { translations: { tr: null } },
        { translations: null },
        { status: null },
        { slug: null },
        { tags: null },
        { translations: { en: [] } },
        { translations: { tr: { title: "T" } } },
        { translations: { de: translation("De") } },
        { coverImage: "http://x.co/a.jpg" },
        { countryCode: "toolong" },
      ]) {
        const res = await patch(a.id, body);
        expect(res.status, JSON.stringify(body)).toBe(400);
      }
      const clash = await patch(a.id, { slug: b.slug });
      expect(clash.status).toBe(409);
      expect(clash.body.code).toBe("BLOG_SLUG_TAKEN");
      expect((await row(a.id)).slug).toBe(a.slug);
      const unknownCountry = await patch(a.id, { countryCode: "ZZ" });
      expect(unknownCountry.status).toBe(400);
      expect(unknownCountry.body.details[0].field).toBe("countryCode");

      expect((await patch(randomUUID(), { status: "draft" })).status).toBe(404);
      const notUuid = await patch("kimlik-degil", { status: "draft" });
      expect(notUuid.status).toBe(400);
      expect(notUuid.body.details[0].field).toBe("id");
      // Reddedilen güncellemeler yazıyı bozmadı.
      expect(await row(a.id)).toMatchObject({ slug: a.slug, status: "draft" });
    });

    it("silme: 204; sonra ayrıntı ve ikinci silme 404; var olmayan kimlik 404; geçersiz kimlik 400", async () => {
      const post = await mustCreate({ status: "published" });
      const del = await t.http.delete(`/v1/blog/posts/${post.id}`).set(asAdmin());
      expect(del.status).toBe(204);
      expect(del.text).toBe("");
      expect((await t.http.get(`/v1/blog/posts/${post.slug}`)).status).toBe(404);
      expect((await t.http.get(`/v1/blog/posts/${post.slug}`).set(asAdmin())).status).toBe(404);
      expect((await t.http.delete(`/v1/blog/posts/${post.id}`).set(asAdmin())).status).toBe(404);
      expect((await t.http.delete(`/v1/blog/posts/${randomUUID()}`).set(asAdmin())).status).toBe(404);
      expect((await t.http.delete("/v1/blog/posts/kimlik-degil").set(asAdmin())).status).toBe(400);
      expect(await t.db.select().from(blogPosts).where(eq(blogPosts.id, post.id))).toHaveLength(0);
    });
  });

  describe("etiketler", () => {
    const nfc = "\u00fcn"; // ü (tek karakter)
    const nfd = "u\u0308n"; // u + birleşik trema

    it("İ/I yerel ayarsız normalleşir, NFC/NFD tekrarı tek etiket olur; yazma ve ?tag= süzgeci aynı kuralı kullanır", async () => {
      const shared = `trk-${uid()}`;
      const a = await mustCreate({ status: "published", tags: ["İstanbul", "İZMİR", "IĞDIR", nfc, nfd, shared] });
      // "İstanbul" -> "istanbul" (U+0069 U+0307 değil); ayrık "ün" birleşik "ün" ile aynı etiket: tek kayıt.
      expect(a.tags).toEqual(["istanbul", "izmir", "iğdir", nfc, shared]);
      expect([...a.tags[0]].map((c: string) => c.codePointAt(0))).toEqual([...("istanbul")].map((c) => c.codePointAt(0)));
      const b = await mustCreate({ status: "published", tags: ["istanbul", shared] });

      // Büyük/küçük harf, noktalı/noktasız yazım ve kenar boşluğu fark etmez: iki yazı da bulunur.
      for (const query of ["istanbul", "İstanbul", "İSTANBUL", "Istanbul", "  İstanbul  "]) {
        const res = await t.http.get("/v1/blog/posts").query({ tag: query });
        expect(slugsOf(res).sort(), `?tag=${query}`).toEqual([a.slug, b.slug].sort());
      }
      expect(slugsOf(await t.http.get("/v1/blog/posts").query({ tag: "İzmir" }))).toEqual([a.slug]);
      expect(slugsOf(await t.http.get("/v1/blog/posts").query({ tag: "IĞDIR" }))).toEqual([a.slug]);
      // Ayrık ve birleşik biçim aynı sonucu verir.
      for (const query of [nfc, nfd, "U\u0308N", "\u00dcN"]) {
        expect(slugsOf(await t.http.get("/v1/blog/posts").query({ tag: query })).includes(a.slug), `?tag=${query}`).toBe(true);
      }

      // Güncelleme de aynı kuralı izler.
      const patched = await t.http.patch(`/v1/blog/posts/${b.id}`).set(asAdmin()).send({ tags: ["İzmir", "izmir", "İZMİR", shared] });
      expect(patched.status).toBe(200);
      expect(patched.body.tags).toEqual(["izmir", shared]);
      expect(slugsOf(await t.http.get("/v1/blog/posts").query({ tag: "izmir" })).sort()).toEqual([a.slug, b.slug].sort());
    });
  });

  describe("eşzamanlı silme", () => {
    it("güncelleme yanıtı işlemin içinde okunur: işlemden hemen sonra gelen DELETE başarılı güncellemeyi 500'e çevirmez", async () => {
      const post = await mustCreate({ status: "published", tags: ["ilk"] });
      const service = t.app.get(BlogService) as unknown as { findOne: (db: unknown, where: unknown) => Promise<unknown> };
      const original = service.findOne.bind(service);
      let outsideReads = 0;
      const spy = vi.spyOn(service, "findOne").mockImplementation(async (db, where) => {
        // İşlemin DIŞINDAN (üst düzey bağlantıyla) okuma, güncelleme işlemi bittikten sonra olur: araya giren
        // bir DELETE'i burada benzetiriz. İşlem içinden okuma (`db !== t.db`) bu yarışa hiç girmez.
        if (db === t.db) {
          outsideReads++;
          await t.db.delete(blogPosts).where(eq(blogPosts.id, post.id));
        }
        return original(db, where);
      });
      try {
        const res = await t.http.patch(`/v1/blog/posts/${post.id}`).set(asAdmin()).send({ tags: ["yeni"] });
        expect(res.status, JSON.stringify(res.body)).toBe(200);
        expect(res.body).toMatchObject({ id: post.id, tags: ["yeni"] });
        expect(outsideReads).toBe(0);
      } finally {
        spy.mockRestore();
      }
      // Güncelleme silmeden ÖNCE sıralanmış sayılır: sonraki silme normal çalışır.
      expect((await t.http.delete(`/v1/blog/posts/${post.id}`).set(asAdmin())).status).toBe(204);
      expect((await t.http.patch(`/v1/blog/posts/${post.id}`).set(asAdmin()).send({ tags: ["x"] })).status).toBe(404);
    });
  });

  describe("yayın zamanı kuralları", () => {
    it("doğrudan yayınlanan yazıya publishedAt atanır; taslak olarak açılanda null", async () => {
      const before = Date.now();
      const live = await mustCreate({ status: "published" });
      const after = Date.now();
      const publishedAt = new Date(live.publishedAt).getTime();
      expect(publishedAt).toBeGreaterThanOrEqual(before - 1000);
      expect(publishedAt).toBeLessThanOrEqual(after + 1000);
      expect((await row(live.id)).publishedAt?.toISOString()).toBe(live.publishedAt);
      expect((await mustCreate()).publishedAt).toBeNull();
    });

    it("ilk yayında atanır; taslağa almak korur; yeniden yayınlamak özgün zamanı değiştirmez", async () => {
      const draft = await mustCreate({ status: "draft" });
      const patch = (status: "draft" | "published") => t.http.patch(`/v1/blog/posts/${draft.id}`).set(asAdmin()).send({ status });
      expect((await row(draft.id)).publishedAt).toBeNull();

      const published = await patch("published");
      expect(published.status).toBe(200);
      expect(published.body.status).toBe("published");
      const firstAt = published.body.publishedAt as string;
      expect(new Date(firstAt).getTime()).toBeGreaterThan(Date.now() - 10_000);
      expect((await t.http.get(`/v1/blog/posts/${draft.slug}`)).status).toBe(200);

      await new Promise((resolve) => setTimeout(resolve, 15));
      const back = await patch("draft");
      expect(back.body).toMatchObject({ status: "draft", publishedAt: firstAt });
      expect((await row(draft.id)).publishedAt?.toISOString()).toBe(firstAt);
      expect((await t.http.get(`/v1/blog/posts/${draft.slug}`)).status).toBe(404);
      expect(slugsOf(await t.http.get("/v1/blog/posts").query({ q: draft.slug }))).toEqual([]);

      await new Promise((resolve) => setTimeout(resolve, 15));
      const again = await patch("published");
      expect(again.body).toMatchObject({ status: "published", publishedAt: firstAt });
      // Yayındaki yazıya yayın durumunu yeniden göndermek de zamanı değiştirmez.
      expect((await patch("published")).body.publishedAt).toBe(firstAt);
      expect((await t.http.get(`/v1/blog/posts/${draft.slug}`)).status).toBe(200);
    });

    it("başka alanı güncellemek publishedAt'e dokunmaz", async () => {
      const live = await mustCreate({ status: "published" });
      const res = await t.http.patch(`/v1/blog/posts/${live.id}`).set(asAdmin()).send({ tags: ["yeni"] });
      expect(res.body.publishedAt).toBe(live.publishedAt);
    });

    it("gövdesiz yazı yayınlanamaz; taslak olarak boş gövde serbest", async () => {
      const emptyTr = { tr: { title: "Boş", excerpt: "Boş özet", body: [] } };
      const draft = await create({ translations: emptyTr });
      expect(draft.status).toBe(201);
      const direct = await create({ status: "published", translations: emptyTr });
      expect(direct.status).toBe(400);
      expect(direct.body.details).toEqual([{ field: "translations.tr.body", code: "arrayNotEmpty", message: expect.any(String) }]);
      const promote = await t.http.patch(`/v1/blog/posts/${draft.body.id}`).set(asAdmin()).send({ status: "published" });
      expect(promote.status).toBe(400);
      expect((await row(draft.body.id)).status).toBe("draft");
      // Gövde eklenip birlikte yayınlanabilir.
      const ok = await t.http
        .patch(`/v1/blog/posts/${draft.body.id}`)
        .set(asAdmin())
        .send({ status: "published", translations: { tr: translation("Dolu") } });
      expect(ok.status).toBe(200);
      expect(ok.body.status).toBe("published");
      // Yayındaki yazının gövdesi boşaltılamaz.
      const empty = await t.http.patch(`/v1/blog/posts/${draft.body.id}`).set(asAdmin()).send({ translations: { tr: emptyTr.tr } });
      expect(empty.status).toBe(400);
      expect((await row(draft.body.id)).status).toBe("published");
    });
  });

  describe("dil geri düşüşü", () => {
    it("istenen dil varsa o dilde; yoksa Türkçe ve complete:false", async () => {
      const post = await mustCreate({
        status: "published",
        translations: {
          tr: { title: "Japonya Rehberi", excerpt: "Türkçe özet", body: [{ type: "paragraph", text: "Türkçe gövde" }] },
          en: { title: "Japan Guide", excerpt: "English excerpt", body: [{ type: "paragraph", text: "English body" }] },
        },
      });
      const en = await t.http.get(`/v1/blog/posts/${post.slug}`).query({ lang: "en" });
      expect(en.body).toMatchObject({ lang: "en", complete: true, title: "Japan Guide", excerpt: "English excerpt", body: [{ type: "paragraph", text: "English body" }], availableLangs: ["tr", "en"] });
      const es = await t.http.get(`/v1/blog/posts/${post.slug}`).query({ lang: "es" });
      expect(es.body).toMatchObject({ lang: "tr", complete: false, title: "Japonya Rehberi", excerpt: "Türkçe özet", body: [{ type: "paragraph", text: "Türkçe gövde" }] });
      const def = await t.http.get(`/v1/blog/posts/${post.slug}`);
      expect(def.body).toMatchObject({ lang: "tr", complete: true, title: "Japonya Rehberi" });
      expect((await t.http.get(`/v1/blog/posts/${post.slug}`).query({ lang: "tr" })).body.lang).toBe("tr");
      expect((await t.http.get(`/v1/blog/posts/${post.slug}`).query({ lang: "de" })).status).toBe(400);

      // Liste kartı aynı kuralı izler ve gövde taşımaz.
      const list = await t.http.get("/v1/blog/posts").query({ q: post.slug, lang: "es" });
      expect(list.body.items[0]).toMatchObject({ slug: post.slug, lang: "tr", complete: false, title: "Japonya Rehberi" });
      const listEn = await t.http.get("/v1/blog/posts").query({ q: post.slug, lang: "en" });
      expect(listEn.body.items[0]).toMatchObject({ lang: "en", complete: true, title: "Japan Guide", excerpt: "English excerpt" });
      expect(listEn.body.items[0]).not.toHaveProperty("body");
    });

    it("yarım çeviri (başlık/özet/gövdeden biri eksik) karışık dilli sayfa üretmez: Türkçeye düşer", async () => {
      const slug = `yarim-${uid()}`;
      await insertPost({
        slug,
        translations: {
          tr: { title: "Türkçe", excerpt: "Özet", body: [{ type: "paragraph", text: "Gövde" }] },
          en: { title: "English only title", excerpt: "English excerpt" },
          es: { title: "Solo título", excerpt: "Resumen", body: "no es un arreglo" },
        },
      });
      for (const lang of ["en", "es"]) {
        const detail = await t.http.get(`/v1/blog/posts/${slug}`).query({ lang });
        expect(detail.body, lang).toMatchObject({ lang: "tr", complete: false, title: "Türkçe", body: [{ type: "paragraph", text: "Gövde" }], availableLangs: ["tr"] });
        const list = await t.http.get("/v1/blog/posts").query({ q: slug, lang });
        expect(list.body.items[0], lang).toMatchObject({ lang: "tr", complete: false, title: "Türkçe" });
      }
    });

    it("boş gövdeli en/es çevirisi yarım sayılır: boş makale yerine Türkçe sunulur; gövde dolunca çeviri açılır", async () => {
      // API'den yazılabilir: başlık/özet çevrilmiş, metin henüz yok. Yayındaki yazıda hemen görünmemeli.
      const post = await mustCreate({
        status: "published",
        translations: {
          tr: { title: "Türkçe başlık", excerpt: "Türkçe özet", body: [{ type: "paragraph", text: "Türkçe gövde" }] },
          en: { title: "English title", excerpt: "English excerpt", body: [] },
          es: translation("Español"),
        },
      });
      const en = await t.http.get(`/v1/blog/posts/${post.slug}`).query({ lang: "en" });
      expect(en.body).toMatchObject({ lang: "tr", complete: false, title: "Türkçe başlık", body: [{ type: "paragraph", text: "Türkçe gövde" }], availableLangs: ["tr", "es"] });
      const card = (await t.http.get("/v1/blog/posts").query({ q: post.slug, lang: "en" })).body.items[0];
      expect(card).toMatchObject({ lang: "tr", complete: false, title: "Türkçe başlık", availableLangs: ["tr", "es"] });
      // Dolu çeviri etkilenmez.
      expect((await t.http.get(`/v1/blog/posts/${post.slug}`).query({ lang: "es" })).body).toMatchObject({ lang: "es", complete: true, title: "Español" });

      // Yayındaki yazıya sonradan boş gövdeli çeviri eklemek de (PATCH) Türkçeyi gizlemez.
      const patched = await t.http
        .patch(`/v1/blog/posts/${post.id}`)
        .set(asAdmin())
        .send({ translations: { es: { title: "Título", excerpt: "Resumen", body: [] } } });
      expect(patched.status, JSON.stringify(patched.body)).toBe(200);
      const es = await t.http.get(`/v1/blog/posts/${post.slug}`).query({ lang: "es" });
      expect(es.body).toMatchObject({ lang: "tr", complete: false, title: "Türkçe başlık", availableLangs: ["tr"] });

      // Gövde yazılınca çeviri açılır.
      await t.http
        .patch(`/v1/blog/posts/${post.id}`)
        .set(asAdmin())
        .send({ translations: { en: { title: "English title", excerpt: "English excerpt", body: [{ type: "paragraph", text: "English body" }] } } })
        .expect(200);
      expect((await t.http.get(`/v1/blog/posts/${post.slug}`).query({ lang: "en" })).body).toMatchObject({ lang: "en", complete: true, title: "English title", body: [{ type: "paragraph", text: "English body" }] });
    });

    it("görünmez karakterden oluşan başlık/özet kullanılabilir çeviri sayılmaz (doğrudan veritabanı yazısı da)", async () => {
      const slug = `gorunmez-${uid()}`;
      await insertPost({
        slug,
        translations: {
          tr: translation("Türkçe"),
          en: { title: "\u200b", excerpt: "English excerpt", body: [{ type: "paragraph", text: "English body" }] },
          es: { title: "Título", excerpt: "\u3164", body: [{ type: "paragraph", text: "Cuerpo" }] },
        },
      });
      for (const lang of ["en", "es"]) {
        expect((await t.http.get(`/v1/blog/posts/${slug}`).query({ lang })).body, lang).toMatchObject({ lang: "tr", complete: false, title: "Türkçe", availableLangs: ["tr"] });
        expect((await t.http.get("/v1/blog/posts").query({ q: slug, lang })).body.items[0], lang).toMatchObject({ lang: "tr", complete: false });
      }
    });

    it("gövdesi henüz boş Türkçe taslak yöneticiye başlığı ve özetiyle gösterilir (boş gövde yalnız yabancı dilde 'yarım' sayılır)", async () => {
      const draft = await mustCreate({ translations: { tr: { title: "Taslak başlık", excerpt: "Taslak özet", body: [] } } });
      const detail = await t.http.get(`/v1/blog/posts/${draft.slug}`).set(asAdmin());
      expect(detail.status).toBe(200);
      expect(detail.body).toMatchObject({ lang: "tr", complete: true, title: "Taslak başlık", excerpt: "Taslak özet", body: [], availableLangs: ["tr"] });
      const card = (await t.http.get("/v1/blog/posts").query({ status: "draft", q: draft.slug }).set(asAdmin())).body.items[0];
      expect(card).toMatchObject({ lang: "tr", complete: true, title: "Taslak başlık", availableLangs: ["tr"] });
    });
  });

  describe("blok gövdesi doğrulaması", () => {
    const everyBlock = [
      { type: "heading", level: 2, text: "İki" },
      { type: "heading", level: 3, text: "Üç" },
      { type: "paragraph", text: "Satır bir\nSatır iki" },
      { type: "list", ordered: false, items: ["a", "b"] },
      { type: "list", ordered: true, items: ["bir"] },
      { type: "quote", text: "Alıntı" },
      { type: "quote", text: "Alıntı", cite: "Kaynak" },
      { type: "image", url: "https://wangoh.com/og/a.jpg", alt: "Açıklama" },
      { type: "image", url: "https://cdn.example.com/b.png", alt: "Açıklama", caption: "Alt yazı" },
    ];

    it("her blok türü kabul edilir ve gidiş-dönüşte birebir korunur", async () => {
      const post = await mustCreate({ status: "published", translations: { tr: { title: "Bloklar", excerpt: "Hepsi", body: everyBlock } } });
      expect(post.body).toEqual(everyBlock);
      const got = await t.http.get(`/v1/blog/posts/${post.slug}`);
      expect(got.body.body).toEqual(everyBlock);
      expect((await row(post.id)).translations.tr.body).toEqual(everyBlock);
    });

    it("geçersiz bloklar 400 ve alan yolu hangi bloğun/alanın sorunlu olduğunu gösterir", async () => {
      const cases: Array<[string, unknown[], string, string]> = [
        ["bilinmeyen tür", [{ type: "paragraph", text: "ok" }, { type: "html", text: "<b>x</b>" }], "translations.tr.body.1.type", "isIn"],
        ["script türü", [{ type: "script", src: "https://x.co/a.js" }], "translations.tr.body.0.type", "isIn"],
        ["fazladan anahtar", [{ type: "paragraph", text: "x", style: "color:red" }], "translations.tr.body.0.style", "whitelistValidation"],
        ["başlık düzeyi 1", [{ type: "heading", level: 1, text: "x" }], "translations.tr.body.0.level", "isIn"],
        ["görsel javascript:", [{ type: "image", url: "javascript:alert(document.cookie)", alt: "x" }], "translations.tr.body.0.url", "isHttpsUrl"],
        ["görsel http:", [{ type: "image", url: "http://wangoh.com/a.jpg", alt: "x" }], "translations.tr.body.0.url", "isHttpsUrl"],
        ["görsel data:", [{ type: "image", url: "data:text/html,<script>alert(1)</script>", alt: "x" }], "translations.tr.body.0.url", "isHttpsUrl"],
        ["görsel kimlik bilgili", [{ type: "image", url: "https://admin:parola@wangoh.com/a.jpg", alt: "x" }], "translations.tr.body.0.url", "isHttpsUrl"],
        ["görsel altı yok", [{ type: "image", url: "https://wangoh.com/a.jpg" }], "translations.tr.body.0.alt", "isString"],
        ["paragrafta NUL", [{ type: "paragraph", text: "a\x00b" }], "translations.tr.body.0.text", "noControlChars"],
        ["paragrafta ESC", [{ type: "paragraph", text: "\x1b[2J" }], "translations.tr.body.0.text", "noControlChars"],
        ["paragrafta yön geçersiz kılma", [{ type: "paragraph", text: `a${String.fromCodePoint(0x202e)}b` }], "translations.tr.body.0.text", "noControlChars"],
        ["başlıkta satır sonu", [{ type: "heading", level: 2, text: "a\nb" }], "translations.tr.body.0.text", "noControlChars"],
        ["liste maddesinde kontrol karakteri", [{ type: "list", ordered: true, items: ["ok", "a\x07"] }], "translations.tr.body.0.items.1", "noControlChars"],
        ["alıntı kaynağı boş", [{ type: "quote", text: "x", cite: "" }], "translations.tr.body.0.cite", "isNotEmpty"],
        ["paragraf çok uzun", [{ type: "paragraph", text: "a".repeat(10_001) }], "translations.tr.body.0.text", "maxLength"],
        ["blok nesne değil", ["düz metin"], "translations.tr.body.0", "isObject"],
        ["başlık bloğu yalnız sıfır genişlikli boşluk", [{ type: "heading", level: 2, text: "\u200b" }], "translations.tr.body.0.text", "isNotEmpty"],
        ["paragraf yalnız Hangul dolgusu", [{ type: "paragraph", text: "\u3164" }], "translations.tr.body.0.text", "isNotEmpty"],
        ["liste maddesi yalnız Braille boşluğu", [{ type: "list", ordered: false, items: ["ok", "\u2800"] }], "translations.tr.body.0.items.1", "isNotEmpty"],
        ["görsel alt metni yalnız görünmez", [{ type: "image", url: "https://wangoh.com/a.jpg", alt: "\u2060\u200d" }], "translations.tr.body.0.alt", "isNotEmpty"],
        ["görsel adresinde yön geçersiz kılma", [{ type: "image", url: "https://example.com/b\u2066.png", alt: "x" }], "translations.tr.body.0.url", "isHttpsUrl"],
        ["görsel adresinde sıfır genişlikli boşluk", [{ type: "image", url: "https://example.com/b\u200b.png", alt: "x" }], "translations.tr.body.0.url", "isHttpsUrl"],
      ];
      for (const [name, body, field, code] of cases) {
        const res = await create({ translations: { tr: { title: "T", excerpt: "Ö", body } } });
        expect(res.status, `${name}: ${JSON.stringify(res.body)}`).toBe(400);
        expect(res.body.code).toBe("VALIDATION_FAILED");
        expect(res.body.details, name).toEqual(expect.arrayContaining([expect.objectContaining({ field, code })]));
      }
    });

    it("güncellemede de aynı doğrulama ve dil önekli yollar; reddedilen güncelleme yazıyı değiştirmez", async () => {
      const post = await mustCreate({ status: "published" });
      const res = await t.http
        .patch(`/v1/blog/posts/${post.id}`)
        .set(asAdmin())
        .send({ translations: { en: { title: "T", excerpt: "Ö", body: [{ type: "paragraph", text: "ok" }, { type: "image", url: "http://x.co/a.png", alt: "x" }] } } });
      expect(res.status).toBe(400);
      expect(res.body.details).toEqual([{ field: "translations.en.body.1.url", code: "isHttpsUrl", message: expect.any(String) }]);
      expect((await row(post.id)).translations).not.toHaveProperty("en");
    });

    it("blok sayısı ve toplam metin sınırı: 400 (500 değil)", async () => {
      const block = { type: "paragraph", text: "x" };
      const tooMany = await create({ translations: { tr: { title: "T", excerpt: "Ö", body: Array.from({ length: 301 }, () => block) } } });
      expect(tooMany.status).toBe(400);
      expect(tooMany.body.details.map((d: any) => d.field)).toContain("translations.tr.body");
      const exactly = await create({ translations: { tr: { title: "T", excerpt: "Ö", body: Array.from({ length: 300 }, () => block) } } });
      expect(exactly.status).toBe(201);

      // Her blok sınır içinde ama toplam 100.000 karakteri aşıyor (JSON ~110 kb: büyük gövde sınırı içinde).
      const big = { type: "paragraph", text: "a".repeat(10_000) };
      const over = await create({ translations: { tr: { title: "T", excerpt: "Ö", body: Array.from({ length: 11 }, () => big) } } });
      expect(over.status).toBe(400);
      expect(over.body.details).toEqual([{ field: "translations.tr.body", code: "maxTotalLength", message: expect.any(String) }]);
    });

    it("yönetici yazma uçları büyük gövde sınırı kullanır; diğer uçlar gevşemez; 1 MB üstü 413", async () => {
      // Üç dilde 90.000 karakterlik gövde ≈ 270 kb: varsayılan 100 kb sınırını aşar, blog yazma sınırına sığar.
      const longBody = Array.from({ length: 10 }, () => ({ type: "paragraph", text: "ş".repeat(9_000) }));
      const hugeSize = (translations: unknown) => JSON.stringify(translations).length;
      const translations = {
        tr: { title: "Uzun", excerpt: "Uzun yazı", body: longBody },
        en: { title: "Long", excerpt: "Long post", body: longBody },
        es: { title: "Largo", excerpt: "Post largo", body: longBody },
      };
      expect(hugeSize(translations)).toBeGreaterThan(100 * 1024);
      const ok = await create({ status: "published", translations });
      expect(ok.status, JSON.stringify(ok.body).slice(0, 300)).toBe(201);
      expect((await t.http.get(`/v1/blog/posts/${ok.body.slug}`).query({ lang: "es" })).body.body).toHaveLength(10);
      const patched = await t.http.patch(`/v1/blog/posts/${ok.body.id}`).set(asAdmin()).send({ translations });
      expect(patched.status).toBe(200);

      // Aynı boyut kullanıcı uçlarında 413: büyük sınır yalnız /v1/blog/posts yazma uçlarına tanındı.
      const padded = { displayName: "a".repeat(150 * 1024) };
      const users = await t.http.patch("/v1/users/me").set(bearer(user.accessToken)).send(padded);
      expect(users.status).toBe(413);
      expect(users.body.code).toBe("PAYLOAD_TOO_LARGE");
      const login = await t.http.post("/v1/auth/login").send({ email: "a@b.co", password: "x".repeat(150 * 1024) });
      expect(login.status).toBe(413);

      // 1 MB üstü blog yazma ucunda da 413 (JSON hatası ya da 500 değil).
      const tooBig = await t.http
        .post("/v1/blog/posts")
        .set(asAdmin())
        .send({ slug: `dev-${uid()}`, translations: { tr: { title: "T", excerpt: "Ö", body: [{ type: "paragraph", text: "a".repeat(1_100_000) }] } } });
      expect(tooBig.status).toBe(413);
      expect(tooBig.body).toMatchObject({ statusCode: 413, code: "PAYLOAD_TOO_LARGE" });
      // Okuma uçları gövde taşımaz; yine de büyük sınır GET'e uygulanmaz.
      expect((await t.http.get("/v1/blog/posts")).status).toBe(200);
    });
  });

  describe("filtreler, arama, sayfalama ve sıralama", () => {
    it("tag, country ve q filtreleri; birlikte kesişim; büyük/küçük harf duyarsız", async () => {
      const tag = `flt-${uid()}`;
      const kyoto = await mustCreate({
        status: "published",
        slug: `kyoto-${uid()}`,
        tags: [tag, "asia"],
        countryCode: "JP",
        translations: {
          tr: { title: "Kyoto sakura rehberi", excerpt: "Kiraz çiçekleri mevsimi", body: bodyOf("K") },
          en: { title: "Cherry blossoms in Kyoto", excerpt: "Hanami season", body: bodyOf("K") },
        },
      });
      const paris = await mustCreate({ status: "published", slug: `paris-${uid()}`, tags: [tag, "europe"], countryCode: "FR", translations: { tr: translation("Paris rehberi") } });
      const noCountry = await mustCreate({ status: "published", slug: `genel-${uid()}`, tags: [tag], translations: { tr: translation("Genel ipuçları") } });
      const other = await mustCreate({ status: "published", tags: ["baska"], countryCode: "JP" });
      const list = (query: Record<string, string>, headers: Record<string, string> = {}) => t.http.get("/v1/blog/posts").query({ tag, ...query }).set(headers);

      expect(slugsOf(await list({})).sort()).toEqual([kyoto.slug, paris.slug, noCountry.slug].sort());
      expect(slugsOf(await t.http.get("/v1/blog/posts").query({ tag: "baska" }))).toEqual([other.slug]);
      expect(slugsOf(await t.http.get("/v1/blog/posts").query({ tag: "ASIA" })).includes(kyoto.slug)).toBe(true);
      expect(slugsOf(await t.http.get("/v1/blog/posts").query({ tag: "yok-etiket" }))).toEqual([]);

      expect(slugsOf(await list({ country: "JP" }))).toEqual([kyoto.slug]);
      expect(slugsOf(await list({ country: "jp" }))).toEqual([kyoto.slug]);
      expect(slugsOf(await list({ country: "TR" }))).toEqual([]);

      expect(slugsOf(await list({ q: "sakura" }))).toEqual([kyoto.slug]);
      expect(slugsOf(await list({ q: "SAKURA" }))).toEqual([kyoto.slug]);
      expect(slugsOf(await list({ q: "  sakura  " }))).toEqual([kyoto.slug]);
      expect(slugsOf(await list({ q: "kiraz" }))).toEqual([kyoto.slug]); // özette
      expect(slugsOf(await list({ q: "paris" }))).toEqual([paris.slug]);
      expect(slugsOf(await list({ q: "cherry" }))).toEqual([]); // Türkçe istek İngilizce başlıkta aramaz
      expect(slugsOf(await list({ q: "cherry", lang: "en" }))).toEqual([kyoto.slug]);
      expect(slugsOf(await list({ q: "hanami", lang: "en" }))).toEqual([kyoto.slug]);
      expect(slugsOf(await list({ q: "rehberi", lang: "en" })).sort()).toEqual([kyoto.slug, paris.slug].sort()); // Türkçe de aranır
      expect(slugsOf(await list({ q: "   " })).length).toBe(3); // boş arama filtre değildir

      expect(slugsOf(await list({ country: "JP", q: "paris" }))).toEqual([]);
      expect(slugsOf(await list({ country: "FR", q: "paris" }))).toEqual([paris.slug]);
      expect((await list({ country: "JP", q: "sakura" })).body.total).toBe(1);
    });

    it("q içindeki % _ \\ joker değil sıradan karakterdir", async () => {
      const tag = `jok-${uid()}`;
      const percent = await mustCreate({ status: "published", tags: [tag], translations: { tr: translation("Yüzde%100 indirim") } });
      const under = await mustCreate({ status: "published", tags: [tag], translations: { tr: translation("a_b kodu") } });
      const plain = await mustCreate({ status: "published", tags: [tag], translations: { tr: translation("axb kodu") } });
      const slash = await mustCreate({ status: "published", tags: [tag], translations: { tr: translation("yol\\dosya") } });
      const list = (q: string) => t.http.get("/v1/blog/posts").query({ tag, q });
      expect(slugsOf(await list("%100"))).toEqual([percent.slug]);
      expect(slugsOf(await list("%"))).toEqual([percent.slug]);
      expect(slugsOf(await list("a_b"))).toEqual([under.slug]);
      expect(slugsOf(await list("_")).sort()).toEqual([under.slug].sort());
      expect(slugsOf(await list("\\")).sort()).toEqual([slash.slug]);
      expect(slugsOf(await list("x b"))).toEqual([]);
      expect(plain.slug).toBeTruthy();
    });

    it("taslaklar arama ve filtrelerde de gizli; admin status=all ile görür", async () => {
      const tag = `gz-${uid()}`;
      const draft = await mustCreate({ status: "draft", tags: [tag], countryCode: "TR", translations: { tr: translation("Gizli taslak") } });
      for (const query of [{ tag }, { country: "TR", tag }, { q: "Gizli taslak", tag }]) {
        expect(slugsOf(await t.http.get("/v1/blog/posts").query(query)), JSON.stringify(query)).toEqual([]);
      }
      expect(slugsOf(await t.http.get("/v1/blog/posts").query({ q: "Gizli taslak", tag, status: "all" }).set(asAdmin()))).toEqual([draft.slug]);
    });

    it("yayın tarihine göre yeniden eskiye; eşitlikte slug sırası; taslaklar oluşturulma zamanına göre", async () => {
      const tag = `srt-${uid()}`;
      const mk = (slug: string, publishedAt: string) => insertPost({ slug: `${tag}-${slug}`, tags: [tag], publishedAt: new Date(publishedAt) });
      await mk("eski", "2024-01-01T00:00:00Z");
      await mk("c-esit", "2025-05-01T00:00:00Z");
      await mk("b-esit", "2025-05-01T00:00:00Z");
      await mk("orta", "2025-03-01T00:00:00Z");
      await mk("yeni", "2026-01-01T00:00:00Z");

      const res = await t.http.get("/v1/blog/posts").query({ tag });
      expect(slugsOf(res)).toEqual([`${tag}-yeni`, `${tag}-b-esit`, `${tag}-c-esit`, `${tag}-orta`, `${tag}-eski`]);
      // Aynı sorgu her seferinde aynı sırayı verir.
      expect(slugsOf(await t.http.get("/v1/blog/posts").query({ tag }))).toEqual(slugsOf(res));

      // Hiç yayınlanmamış taslak (yeni oluşturuldu) yönetici görünümünde en başta.
      const draft = await mustCreate({ status: "draft", tags: [tag] });
      const all = await t.http.get("/v1/blog/posts").query({ tag, status: "all" }).set(asAdmin());
      expect(slugsOf(all)[0]).toBe(draft.slug);
      expect(all.body.total).toBe(6);
      expect(all.body.items.map((i: any) => i.publishedAt).slice(1)).toEqual([
        "2026-01-01T00:00:00.000Z", "2025-05-01T00:00:00.000Z", "2025-05-01T00:00:00.000Z", "2025-03-01T00:00:00.000Z", "2024-01-01T00:00:00.000Z",
      ]);
    });

    it("sayfalama: zarf, sayfa boyutu, sayfalar ayrışık ve toplam tutarlı; sınır dışı değerler 400", async () => {
      const tag = `syf-${uid()}`;
      for (let i = 0; i < 5; i++) await insertPost({ slug: `${tag}-${i}`, tags: [tag], publishedAt: new Date(Date.UTC(2025, 0, 10 - i)) });
      const page = (n: number, size: number) => t.http.get("/v1/blog/posts").query({ tag, page: n, pageSize: size });

      const p1 = await page(1, 2);
      expect(p1.body).toMatchObject({ page: 1, pageSize: 2, total: 5 });
      expect(p1.body.items).toHaveLength(2);
      const p2 = await page(2, 2);
      const p3 = await page(3, 2);
      expect(p3.body.items).toHaveLength(1);
      expect([...slugsOf(p1), ...slugsOf(p2), ...slugsOf(p3)]).toEqual([0, 1, 2, 3, 4].map((i) => `${tag}-${i}`));
      const beyond = await page(9, 2);
      expect(beyond.status).toBe(200);
      expect(beyond.body).toMatchObject({ items: [], total: 5, page: 9 });
      expect((await page(1, 100)).body.items).toHaveLength(5);

      expect((await t.http.get("/v1/blog/posts").query({ tag })).body).toMatchObject({ page: 1, pageSize: 20 });
      for (const query of [{ pageSize: 0 }, { pageSize: 101 }, { page: 0 }, { page: -1 }, { page: "abc" }, { pageSize: "x" }, { page: 1.5 }]) {
        expect((await t.http.get("/v1/blog/posts").query(query)).status, JSON.stringify(query)).toBe(400);
      }
    });
  });

  describe("yazar", () => {
    it("yazar kullanıcı silinince yazı kalır, author null olur; e-posta hiçbir yanıtta yok", async () => {
      const author = await createAdmin(t, { displayName: "Geçici Yazar" });
      const created = await t.http
        .post("/v1/blog/posts")
        .set(bearer(author.accessToken))
        .send({ slug: `yazar-${uid()}`, status: "published", translations: { tr: translation("Yazarlı") } });
      expect(created.status).toBe(201);
      expect(created.body.author).toEqual({ displayName: "Geçici Yazar" });
      expect(JSON.stringify(created.body)).not.toContain(author.email);
      expect((await t.http.get(`/v1/blog/posts/${created.body.slug}`)).body.author).toEqual({ displayName: "Geçici Yazar" });
      const listed = await t.http.get("/v1/blog/posts").query({ q: created.body.slug });
      expect(listed.body.items[0].author).toEqual({ displayName: "Geçici Yazar" });
      expect(JSON.stringify(listed.body)).not.toContain(author.email);

      await t.http.delete(`/v1/users/${author.user.id}`).set(asAdmin()).expect(204);

      const after = await t.http.get(`/v1/blog/posts/${created.body.slug}`);
      expect(after.status).toBe(200);
      expect(after.body.author).toBeNull();
      expect((await t.http.get("/v1/blog/posts").query({ q: created.body.slug })).body.items[0].author).toBeNull();
      expect((await row(created.body.id)).authorId).toBeNull();
      expect((await row(created.body.id)).status).toBe("published");
    });

    it("yazarı olmayan (tohum) yazı author:null döner", async () => {
      const slug = `tohum-${uid()}`;
      await insertPost({ slug });
      expect((await t.http.get(`/v1/blog/posts/${slug}`)).body.author).toBeNull();
    });
  });

  describe("Cache-Control", () => {
    const isPublic = (value: string | undefined) => /(^|,\s*)public(\s*,|$)/.test(value ?? "");

    it("anonim yayın okuması ortak önbelleğe uygun ve Authorization'a göre değişir", async () => {
      const live = await mustCreate({ status: "published" });
      for (const url of ["/v1/blog/posts", `/v1/blog/posts/${live.slug}`]) {
        const res = await t.http.get(url);
        expect(res.status).toBe(200);
        expect(res.headers["cache-control"], url).toBe("public, max-age=60, stale-while-revalidate=300");
        expect(res.headers.vary?.toLowerCase(), url).toContain("authorization");
      }
    });

    it("Authorization taşıyan her okuma ve her yazma private, no-store", async () => {
      const live = await mustCreate({ status: "published" });
      const draft = await mustCreate({ status: "draft" });
      for (const headers of [asAdmin(), bearer(user.accessToken)]) {
        for (const url of ["/v1/blog/posts", `/v1/blog/posts/${live.slug}`, "/v1/blog/posts?status=published"]) {
          const res = await t.http.get(url).set(headers);
          expect(res.status, url).toBe(200);
          expect(res.headers["cache-control"], url).toBe("private, no-store");
          expect(isPublic(res.headers["cache-control"])).toBe(false);
        }
      }
      // Taslak içeren her yanıt: yalnız yöneticiye, private/no-store.
      const withDraft = [
        await t.http.get("/v1/blog/posts").query({ status: "all" }).set(asAdmin()),
        await t.http.get("/v1/blog/posts").query({ status: "draft" }).set(asAdmin()),
        await t.http.get(`/v1/blog/posts/${draft.slug}`).set(asAdmin()),
      ];
      for (const res of withDraft) {
        expect(res.status).toBe(200);
        expect(JSON.stringify(res.body)).toContain(draft.slug);
        expect(res.headers["cache-control"]).toBe("private, no-store");
      }
      // Anonim aynı adrese sızan bir önbellek girdisi bulamaz: sunucu taslağı vermez ve hata önbelleğe alınmaz.
      const anon = await t.http.get(`/v1/blog/posts/${draft.slug}`);
      expect(anon.status).toBe(404);
      expect(isPublic(anon.headers["cache-control"])).toBe(false);
      expect(anon.headers["cache-control"]).toBe("private, no-store");

      const created = await create();
      const updated = await t.http.patch(`/v1/blog/posts/${draft.id}`).set(asAdmin()).send({ tags: ["x"] });
      const removed = await t.http.delete(`/v1/blog/posts/${draft.id}`).set(asAdmin());
      for (const res of [created, updated, removed]) expect(res.headers["cache-control"]).toBe("private, no-store");
    });

    it("hata yanıtları (404) ortak önbelleğe girmez", async () => {
      const missing = await t.http.get(`/v1/blog/posts/yok-${uid()}`);
      expect(missing.status).toBe(404);
      expect(isPublic(missing.headers["cache-control"])).toBe(false);
    });
  });
});
