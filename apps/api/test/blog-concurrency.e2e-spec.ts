import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import pg from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { blogPosts } from "../src/db/schema/index.js";
import { bearer, createAdmin, createTestApp, TEST_DATABASE_URL, type TestApp, type TestSession } from "./helpers/index.js";

/**
 * Yalnız gerçek PostgreSQL'e karşı çalışır (`TEST_DATABASE_URL=postgres://... pnpm --filter api test`).
 * PGlite tek bağlantıdır ve işlemleri sıraya dizer; `SELECT ... FOR UPDATE` korumasını (kayıp güncelleme) ve
 * güncelleme/silme yarışını ancak gerçek paralel bağlantılar sınar.
 *
 * Yarışlar belirleyici olsun diye satırı ayrı bir bağlantıda kilitleriz, istekleri kilide takılana kadar
 * bekleriz, sonra kilidi bırakırız: iki istek de aynı anda "hazır" olur.
 */
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const uid = (): string => randomUUID().slice(0, 8);

const tr = { title: "Türkçe", excerpt: "Türkçe özet", body: [{ type: "paragraph", text: "Türkçe gövde" }] };
const translation = (title: string) => ({ title, excerpt: `${title} özeti`, body: [{ type: "paragraph", text: `${title} metni` }] });

describe.skipIf(!TEST_DATABASE_URL)("gerçek PostgreSQL: blog eşzamanlılığı", () => {
  let t: TestApp;
  let admin: TestSession;
  let locker: pg.Client;

  beforeAll(async () => {
    t = await createTestApp();
    admin = await createAdmin(t);
    locker = new pg.Client({ connectionString: t.config.databaseUrl });
    await locker.connect();
  });
  afterAll(async () => {
    await locker.end().catch(() => undefined);
    await t.close();
  });

  const asAdmin = () => bearer(admin.accessToken);
  const create = async (over: Record<string, unknown> = {}) => {
    const slug = `esz-${uid()}`;
    const res = await t.http.post("/v1/blog/posts").set(asAdmin()).send({ slug, status: "published", translations: { tr }, ...over });
    expect(res.status, JSON.stringify(res.body)).toBe(201);
    return res.body as { id: string; slug: string };
  };

  /** Kilide takılı (başka bir işlemi bekleyen) sunucu bağlantısı sayısı. */
  const waiters = async (): Promise<number> => {
    // `locker` bir işlemin içindedir ve istatistik görüntüsü işlem boyunca önbelleğe alınır: her yoklamada sıfırla.
    await locker.query("select pg_stat_clear_snapshot()");
    const res = await locker.query<{ n: string }>(
      "select count(*) as n from pg_stat_activity where datname = current_database() and pid <> pg_backend_pid() and wait_event_type = 'Lock'",
    );
    return Number(res.rows[0]!.n);
  };
  const untilWaiters = async (count: number): Promise<void> => {
    for (let i = 0; i < 400; i++) {
      if ((await waiters()) >= count) return;
      await sleep(10);
    }
    throw new Error(`${count} bağlantı kilide takılmadı (şu an ${await waiters()}).`);
  };
  /** Satırı ayrı bir bağlantıda kilitler; dönen işlev kilidi bırakır. */
  const holdRowLock = async (id: string): Promise<() => Promise<void>> => {
    await locker.query("begin");
    await locker.query("select id from blog_posts where id = $1 for update", [id]);
    return async () => {
      await locker.query("commit");
    };
  };

  it("eşzamanlı PATCH'ler farklı dilleri kaybetmez: okuma-değiştirme-yazma satır kilidiyle korunur", async () => {
    for (let round = 0; round < 3; round++) {
      const post = await create();
      const release = await holdRowLock(post.id);
      const en = t.http.patch(`/v1/blog/posts/${post.id}`).set(asAdmin()).send({ translations: { en: translation("English") } }).then((r) => r);
      const es = t.http.patch(`/v1/blog/posts/${post.id}`).set(asAdmin()).send({ translations: { es: translation("Español") } }).then((r) => r);
      const tags = t.http.patch(`/v1/blog/posts/${post.id}`).set(asAdmin()).send({ tags: ["eszamanli"] }).then((r) => r);
      await untilWaiters(3);
      await release();
      const results = await Promise.all([en, es, tags]);
      for (const r of results) expect(r.status, JSON.stringify(r.body)).toBe(200);

      const [stored] = await t.db.select().from(blogPosts).where(eq(blogPosts.id, post.id));
      // `FOR UPDATE` olmasaydı üçü de özgün satırı okur, sonuncu yazan ötekilerin değişikliğini ezerdi.
      expect(Object.keys(stored!.translations).sort(), `tur ${round}`).toEqual(["en", "es", "tr"]);
      expect(stored!.tags).toEqual(["eszamanli"]);
    }
  }, 60_000);

  it("PATCH ile DELETE yarışı 500 üretmez: önce sıralanan güncelleme 200, sonraki silme 204", async () => {
    for (let round = 0; round < 12; round++) {
      const post = await create();
      const release = await holdRowLock(post.id);
      // PATCH kilit kuyruğunda DELETE'ten önce olsun.
      const patch = t.http.patch(`/v1/blog/posts/${post.id}`).set(asAdmin()).send({ tags: [`tur${round}`] }).then((r) => r);
      await untilWaiters(1);
      const del = t.http.delete(`/v1/blog/posts/${post.id}`).set(asAdmin()).then((r) => r);
      await untilWaiters(2);
      await release();
      const [p, d] = await Promise.all([patch, del]);
      // Yanıt güncelleme işleminin içinde okunmazsa, commit ile okuma arasına giren silme PATCH'i 500'e düşürürdü.
      expect(p.status, `tur ${round}: ${JSON.stringify(p.body)}`).toBe(200);
      expect(p.body).toMatchObject({ id: post.id, tags: [`tur${round}`] });
      expect(d.status, `tur ${round}`).toBe(204);
      expect(await t.db.select().from(blogPosts).where(eq(blogPosts.id, post.id))).toHaveLength(0);
    }
  }, 60_000);

  it("DELETE önce sıralanırsa bekleyen PATCH 404 alır (500 değil)", async () => {
    for (let round = 0; round < 6; round++) {
      const post = await create();
      const release = await holdRowLock(post.id);
      const del = t.http.delete(`/v1/blog/posts/${post.id}`).set(asAdmin()).then((r) => r);
      await untilWaiters(1);
      const patch = t.http.patch(`/v1/blog/posts/${post.id}`).set(asAdmin()).send({ tags: ["x"] }).then((r) => r);
      await untilWaiters(2);
      await release();
      const [d, p] = await Promise.all([del, patch]);
      expect(d.status, `tur ${round}`).toBe(204);
      expect(p.status, `tur ${round}: ${JSON.stringify(p.body)}`).toBe(404);
    }
  }, 60_000);

  it("rastgele yarışan 20 PATCH + DELETE çifti: hiçbiri 5xx vermez", async () => {
    const results: Array<[number, number]> = [];
    for (let i = 0; i < 20; i++) {
      const post = await create();
      const patch = t.http.patch(`/v1/blog/posts/${post.id}`).set(asAdmin()).send({ tags: [`r${i}`] }).then((r) => r.status);
      await sleep(i % 4); // PATCH'in işlemi açıkken DELETE gelsin
      const del = t.http.delete(`/v1/blog/posts/${post.id}`).set(asAdmin()).then((r) => r.status);
      results.push([await patch, await del]);
    }
    for (const [p, d] of results) {
      expect([200, 404], `PATCH ${p}`).toContain(p);
      expect([204, 404], `DELETE ${d}`).toContain(d);
    }
  }, 60_000);

  it("aynı slug'a eşzamanlı oluşturma: biri 201, ötekiler 409 BLOG_SLUG_TAKEN (500 değil)", async () => {
    const slug = `ayni-${uid()}`;
    const results = await Promise.all(
      Array.from({ length: 6 }, () => t.http.post("/v1/blog/posts").set(asAdmin()).send({ slug, status: "published", translations: { tr } })),
    );
    expect(results.filter((r) => r.status === 201)).toHaveLength(1);
    for (const r of results.filter((x) => x.status !== 201)) expect(r.body, JSON.stringify(r.body)).toMatchObject({ statusCode: 409, code: "BLOG_SLUG_TAKEN" });
  }, 60_000);
});
