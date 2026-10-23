import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { seedBlogPosts } from "../src/blog/blog.seed.js";
import { loadContentSeed } from "../src/content/content.seed.js";
import { imageCredits } from "../src/db/schema/index.js";
import { SEED_DIR } from "../src/paths.js";
import { bearer, createAdmin, createTestApp, type TestApp, type TestSession } from "./helpers/index.js";

/**
 * Blog yazısı ayrıntısında kapak görselinin atfı (`imageCredits`). Kapak sitenin kendi görsellerinden biriyse
 * (`<site>/og/<ad>.jpg`) ve görsel atıf gerektiriyorsa tek öğe, aksi halde boş dizi. Liste kartı atıf taşımaz.
 */

const uid = (): string => randomUUID().slice(0, 8);
const KAPAK = "blog-kapak-aaaa1111";
const CC0 = "blog-cc0-bbbb2222";
const KAYITSIZ = "blog-kayitsiz-cccc3333";
const og = (name: string, origin = "https://wangoh.com"): string => `${origin}/og/${name}.jpg`;

const kapakCredit = (imageUrl: string) => ({
  imageUrl,
  author: "Kapak Yazarı",
  licenseName: "CC BY 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by/4.0",
  sourceUrl: "https://commons.wikimedia.org/wiki/File:Blog_Kapak.jpg",
});

const translation = (title: string) => ({ title, excerpt: `${title} özeti`, body: [{ type: "paragraph", text: `${title} metni` }] });

async function seedCredits(t: TestApp): Promise<void> {
  await t.db.insert(imageCredits).values([
    { image: `/images/${KAPAK}.avif`, author: "Kapak Yazarı", licenseName: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0", sourceUrl: "https://commons.wikimedia.org/wiki/File:Blog_Kapak.jpg", attributionRequired: true },
    { image: `/images/${CC0}.avif`, author: "Başka Yazar", licenseName: "CC0", licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en", sourceUrl: "https://commons.wikimedia.org/wiki/File:Blog_Cc0.jpg", attributionRequired: false },
  ]);
}

describe("blog kapak görseli atfı", () => {
  let t: TestApp;
  let admin: TestSession;
  const asAdmin = () => bearer(admin.accessToken);
  beforeAll(async () => {
    t = await createTestApp();
    await seedCredits(t);
    admin = await createAdmin(t);
  });
  afterAll(() => t.close());

  const create = async (over: Record<string, unknown> = {}) => {
    const slug = `kapak-${uid()}`;
    const res = await t.http.post("/v1/blog/posts").set(asAdmin()).send({ slug, status: "published", translations: { tr: translation(slug) }, ...over });
    expect(res.status, JSON.stringify(res.body)).toBe(201);
    return res.body as { id: string; slug: string; imageCredits: unknown[] };
  };
  const detail = async (slug: string, query = "") => (await t.http.get(`/v1/blog/posts/${slug}${query}`)).body;

  it("atıf gerektiren web görseli kapaksa ayrıntı atfı taşır; atfın imageUrl'ı kapakla birebir aynıdır; liste kartı atıf taşımaz", async () => {
    const cover = og(KAPAK);
    const post = await create({ coverImage: cover, tags: [`atif-${uid()}`] });
    const body = await detail(post.slug);
    expect(body.coverImage).toBe(cover);
    expect(body.imageCredits).toEqual([kapakCredit(cover)]);
    expect(Object.keys(body.imageCredits[0]).sort()).toEqual(["author", "imageUrl", "licenseName", "licenseUrl", "sourceUrl"]);

    const list = await t.http.get("/v1/blog/posts").query({ q: post.slug });
    expect(list.body.items).toHaveLength(1);
    expect(list.body.items[0]).not.toHaveProperty("imageCredits");
    expect(list.body.items[0].coverImage).toBe(cover);
  });

  it("dilden bağımsız; yönetici yazma yanıtları (oluşturma, güncelleme) da imageCredits taşır", async () => {
    const cover = og(KAPAK);
    const created = await create({ coverImage: cover, translations: { tr: translation("Başlık"), en: translation("Title") } });
    expect(created.imageCredits).toEqual([kapakCredit(cover)]);
    for (const lang of ["tr", "en", "es"]) expect((await detail(created.slug, `?lang=${lang}`)).imageCredits, lang).toEqual([kapakCredit(cover)]);

    const cleared = await t.http.patch(`/v1/blog/posts/${created.id}`).set(asAdmin()).send({ coverImage: null });
    expect(cleared.status).toBe(200);
    expect(cleared.body.imageCredits).toEqual([]);
    const set = await t.http.patch(`/v1/blog/posts/${created.id}`).set(asAdmin()).send({ coverImage: og(KAPAK) });
    expect(set.body.imageCredits).toEqual([kapakCredit(cover)]);
    // Başlık güncellemesi kapağa dokunmaz; atıf yerinde kalır.
    const retitled = await t.http.patch(`/v1/blog/posts/${created.id}`).set(asAdmin()).send({ tags: ["x"] });
    expect(retitled.body.imageCredits).toEqual([kapakCredit(cover)]);
  });

  it("taslak yazının ayrıntısında da gelir (yönetici); anonim taslağı yine göremez", async () => {
    const draft = await create({ status: "draft", coverImage: og(KAPAK) });
    expect((await t.http.get(`/v1/blog/posts/${draft.slug}`).set(asAdmin())).body.imageCredits).toEqual([kapakCredit(og(KAPAK))]);
    expect((await t.http.get(`/v1/blog/posts/${draft.slug}`)).status).toBe(404);
  });

  it("atfı olmayan kapak boş dizi verir: CC0, atıf kaydı olmayan web görseli, kapaksız yazı", async () => {
    for (const [label, coverImage] of [
      ["CC0 (atıf gerekmiyor)", og(CC0)],
      ["kaydı olmayan web görseli", og(KAYITSIZ)],
      ["kapak yok", undefined],
      ["kapak null", null],
    ] as const) {
      const post = await create(coverImage === undefined ? {} : { coverImage });
      expect(post.imageCredits, label).toEqual([]);
      expect((await detail(post.slug)).imageCredits, label).toEqual([]);
    }
  });

  it("harici kapak (başka site) aynı adda olsa da başkasının görseline atıf bağlamaz", async () => {
    for (const cover of [
      og(KAPAK, "https://example.com"),
      "https://wangoh.com.evil.example/og/" + KAPAK + ".jpg",
      `https://wangoh.com/baska/${KAPAK}.jpg`,
      `https://wangoh.com/og/${KAPAK}.png`,
      `https://wangoh.com/og/${KAPAK}/x.jpg`,
      `https://example.com/images/${KAPAK}.avif`,
    ]) {
      const post = await create({ coverImage: cover });
      expect((await detail(post.slug)).imageCredits, cover).toEqual([]);
    }
  });

  it("sitenin ham görsel adresi (/images/<ad>.avif) ve sorgu dizgili kapak da tanınır; atfın imageUrl'ı kapağın kendisidir", async () => {
    for (const cover of [`https://wangoh.com/images/${KAPAK}.avif`, `${og(KAPAK)}?v=2`]) {
      const post = await create({ coverImage: cover });
      expect((await detail(post.slug)).imageCredits, cover).toEqual([kapakCredit(cover)]);
    }
  });

  it("atıf bayrağı kapatılırsa yanıttan düşer; açılırsa geri gelir", async () => {
    const post = await create({ coverImage: og(KAPAK) });
    await t.db.update(imageCredits).set({ attributionRequired: false }).where(eq(imageCredits.image, `/images/${KAPAK}.avif`));
    expect((await detail(post.slug)).imageCredits).toEqual([]);
    await t.db.update(imageCredits).set({ attributionRequired: true }).where(eq(imageCredits.image, `/images/${KAPAK}.avif`));
    expect((await detail(post.slug)).imageCredits).toEqual([kapakCredit(og(KAPAK))]);
  });
});

describe("blog kapak görseli atfı: ASSETS_BASE_URL farklıyken", () => {
  let t: TestApp;
  beforeAll(async () => {
    t = await createTestApp({ config: { assetsBaseUrl: "https://assets.example.org" } });
    await seedCredits(t);
  });
  afterAll(() => t.close());

  it("yapılandırılmış kaynağın ve tohum yazıların sabit kaynağının (wangoh.com) görselleri çözülür; üçüncü site çözülmez", async () => {
    const admin = await createAdmin(t);
    const post = async (cover: string) => {
      const slug = `kapak-${uid()}`;
      const res = await t.http.post("/v1/blog/posts").set(bearer(admin.accessToken)).send({ slug, status: "published", coverImage: cover, translations: { tr: translation(slug) } });
      expect(res.status).toBe(201);
      return res.body.imageCredits as unknown[];
    };
    const own = og(KAPAK, "https://assets.example.org");
    expect(await post(own)).toEqual([kapakCredit(own)]);
    expect(await post(og(KAPAK))).toEqual([kapakCredit(og(KAPAK))]);
    expect(await post(og(KAPAK, "https://baska.example.net"))).toEqual([]);
  });
});

describe("blog kapak görseli atfı: gerçek tohum", () => {
  let t: TestApp;
  beforeAll(async () => {
    t = await createTestApp();
    await loadContentSeed(t.db, { dir: SEED_DIR });
    const result = await seedBlogPosts(t.db, { dir: SEED_DIR });
    expect(result.inserted).toBe(44);
  }, 180_000);
  afterAll(() => t.close());

  it("her tohum yazısının kapağı için atıf, görsel atıf tablosundaki kayda göre verilir (yazı sayısı 44; kayıt zorunluysa dolu, değilse boş)", async () => {
    const seedCredits = JSON.parse(readFileSync(join(SEED_DIR, "image-credits.json"), "utf8")) as Array<{ image: string; author: string | null; licenseName: string | null; licenseUrl: string | null; sourceUrl: string; attributionRequired: boolean }>;
    const byImage = new Map(seedCredits.map((c) => [c.image, c]));
    const posts = (JSON.parse(readFileSync(join(SEED_DIR, "blog-posts.json"), "utf8")) as { posts: Array<{ slug: string; coverImage: string | null }> }).posts;
    expect(posts).toHaveLength(44);

    let withCredit = 0;
    for (const post of posts) {
      const match = /^https:\/\/wangoh\.com\/og\/([a-z0-9][a-z0-9-]*)\.jpg$/.exec(post.coverImage ?? "");
      expect(match, `${post.slug}: kapak /og/<ad>.jpg biçiminde değil`).not.toBeNull();
      const credit = byImage.get(`/images/${match![1]}.avif`);
      expect(credit, `${post.slug}: kapak görselinin atıf kaydı yok`).toBeDefined(); // web verisinde her kapağın kaydı var
      const expected = credit!.attributionRequired
        ? [{ imageUrl: post.coverImage, author: credit!.author, licenseName: credit!.licenseName, licenseUrl: credit!.licenseUrl, sourceUrl: credit!.sourceUrl }]
        : [];
      if (expected.length > 0) withCredit++;
      const res = await t.http.get(`/v1/blog/posts/${post.slug}`);
      expect(res.status, post.slug).toBe(200);
      expect(res.body.imageCredits, post.slug).toEqual(expected);
    }
    expect(withCredit).toBeGreaterThan(0);
    expect(withCredit).toBeLessThan(44); // bazı kapaklar Unsplash/CC0/kamu malı: atıf gerekmez
  }, 120_000);
});
