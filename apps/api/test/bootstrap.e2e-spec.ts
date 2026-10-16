import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { eq, sql } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { hashPassword } from "../src/auth/password.js";
import { createDatabase, rowsOf } from "../src/db/client.js";
import { ensureAdminUser } from "../src/db/admin-bootstrap.js";
import { runMigrations } from "../src/db/migrate.js";
import { runSeed } from "../src/db/seed/index.js";
import { users } from "../src/db/schema/index.js";
import { TEST_SCRYPT_PARAMS, bearer, createTestApp, findUserRow, loginUser, registerUser, type TestApp, uniqueEmail } from "./helpers/index.js";

describe("açılış: migrasyon, admin, tohum", () => {
  let t: TestApp;
  beforeAll(async () => {
    t = await createTestApp();
  });
  afterAll(() => t.close());

  it("migrasyon tüm tabloları, enum'ları ve dizinleri kurar", async () => {
    const tables = rowsOf<{ table_name: string }>(
      await t.db.execute(sql`select table_name from information_schema.tables where table_schema = 'public' order by table_name`),
    ).map((r) => r.table_name);
    expect(tables).toEqual(
      expect.arrayContaining(["users", "refresh_tokens", "continents", "countries", "country_travel", "cities", "city_guides", "blog_posts", "game_sessions", "scores"]),
    );
    const idx = rowsOf<{ indexname: string }>(await t.db.execute(sql`select indexname from pg_indexes where schemaname = 'public'`)).map((r) => r.indexname);
    expect(idx).toEqual(expect.arrayContaining(["users_email_lower_idx", "scores_game_type_score_idx", "scores_user_game_type_idx", "blog_posts_tags_idx"]));
    const enums = rowsOf<{ typname: string }>(await t.db.execute(sql`select typname from pg_type where typtype = 'e'`)).map((r) => r.typname);
    expect(enums).toEqual(expect.arrayContaining(["user_role", "blog_status", "game_type", "game_status"]));
  });

  it("e-posta benzersizliği veritabanında lower(email) üzerinde", async () => {
    const email = uniqueEmail("kucuk");
    const hash = await hashPassword("Parola-12345", TEST_SCRYPT_PARAMS);
    await t.db.insert(users).values({ email, passwordHash: hash, displayName: "Bir" });
    await expect(t.db.insert(users).values({ email: email.toUpperCase(), passwordHash: hash, displayName: "İki" })).rejects.toBeTruthy();
  });

  it("tohum yükleyici imzası: runSeed(db, { dir }) boş iskeletlerle sorunsuz çalışır", async () => {
    await expect(runSeed(t.db)).resolves.toBeUndefined();
    await expect(runSeed(t.db, { dir: "/yok/boyle/bir/klasor" })).resolves.toBeUndefined();
  });

  describe("ensureAdminUser", () => {
    const admin = { email: "ilk.admin@example.test", password: "Yonetici-Parola-1" };

    it("oluşturur; tekrar çağrı idempotent ve parolayı ezmez", async () => {
      expect(await ensureAdminUser(t.db, admin, TEST_SCRYPT_PARAMS)).toBe("created");
      const first = (await t.db.select().from(users).where(eq(users.email, admin.email)))[0]!;
      expect(first.role).toBe("admin");
      expect(await ensureAdminUser(t.db, admin, TEST_SCRYPT_PARAMS)).toBe("exists");
      expect(await ensureAdminUser(t.db, { ...admin, password: "Baska-Parola-123" }, TEST_SCRYPT_PARAMS)).toBe("exists");
      const rows = await t.db.select().from(users).where(eq(users.email, admin.email));
      expect(rows).toHaveLength(1);
      expect(rows[0]!.passwordHash).toBe(first.passwordHash);

      const session = await loginUser(t.http, admin.email, admin.password);
      expect(session.user.role).toBe("admin");
      await t.http.get("/v1/users").set(bearer(session.accessToken)).expect(200);
    });

    it("eşzamanlı çağrılar tek hesap üretir", async () => {
      const email = uniqueEmail("es-admin");
      const results = await Promise.all([1, 2, 3].map(() => ensureAdminUser(t.db, { email, password: "Yonetici-Parola-1" }, TEST_SCRYPT_PARAMS)));
      expect(results.filter((r) => r === "created")).toHaveLength(1);
      expect(await t.db.select().from(users).where(eq(users.email, email))).toHaveLength(1);
    });

    it("mevcut user hesabı yalnız parola eşleşirse yükseltilir (e-posta ele geçirme koruması)", async () => {
      const mine = await registerUser(t.http, { password: "Benim-Parolam-12" });
      expect(await ensureAdminUser(t.db, { email: mine.email, password: "Benim-Parolam-12" }, TEST_SCRYPT_PARAMS)).toBe("promoted");
      expect((await findUserRow(t, mine.user.id))!.role).toBe("admin");

      const squatted = await registerUser(t.http, { password: "Saldirgan-Parola-1" });
      expect(await ensureAdminUser(t.db, { email: squatted.email, password: "Operator-Parola-1" }, TEST_SCRYPT_PARAMS)).toBe("skipped");
      expect((await findUserRow(t, squatted.user.id))!.role).toBe("user");
    });
  });
});

describe("kalıcı PGlite ve ADMIN_EMAIL/ADMIN_PASSWORD ile açılış", () => {
  it("iki açılışta aynı veri: migrasyon ve admin oluşturma idempotent", async () => {
    const dir = await mkdtemp(join(tmpdir(), "wangoh-api-"));
    const admin = { email: "kalici.admin@example.test", password: "Yonetici-Parola-1" };
    try {
      const first = await createTestApp({ config: { pgliteDir: join(dir, "yok", "ic-ice", "pg"), admin } });
      const before = await loginUser(first.http, admin.email, admin.password);
      const normal = await registerUser(first.http);
      await first.close();

      const second = await createTestApp({ config: { pgliteDir: join(dir, "yok", "ic-ice", "pg"), admin } });
      try {
        const after = await loginUser(second.http, admin.email, admin.password);
        expect(after.user.id).toBe(before.user.id);
        expect((await second.db.select().from(users).where(eq(users.email, admin.email)))).toHaveLength(1);
        await loginUser(second.http, normal.email, normal.password); // veri kalıcı
      } finally {
        await second.close();
      }
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  }, 60_000);

  it("runMigrations iki kez çağrılabilir", async () => {
    const handle = await createDatabase({ databaseUrl: undefined, pgliteDir: "memory://" });
    try {
      await runMigrations(handle);
      await runMigrations(handle);
      const rows = rowsOf<{ count: number }>(await handle.db.execute(sql`select count(*)::int as count from users`));
      expect(rows[0]!.count).toBe(0);
    } finally {
      await handle.close();
    }
  });

  it("migrateOnBoot kapalıysa tablolar kurulmaz", async () => {
    const t = await createTestApp({ config: { migrateOnBoot: false } });
    try {
      const res = await t.http.get("/v1/health");
      expect(res.status).toBe(200); // `select 1` tablo istemez
      const reg = await t.http.post("/v1/auth/register").send({ email: uniqueEmail(), password: "Parola-12345", displayName: "Ad Soyad" });
      expect(reg.status).toBe(500);
      expect(reg.body.code).toBe("INTERNAL_ERROR");
    } finally {
      await t.close();
    }
  });

  it("SEED_ON_BOOT açıkken tohum yükleyici açılışta çağrılır ve açılış bozulmaz", async () => {
    const t = await createTestApp({ config: { seedOnBoot: true } });
    try {
      expect((await t.http.get("/v1/health")).status).toBe(200);
    } finally {
      await t.close();
    }
  });
});
