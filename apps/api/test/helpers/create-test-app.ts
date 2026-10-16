import type { DynamicModule, Type } from "@nestjs/common";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { randomUUID } from "node:crypto";
import type { AddressInfo } from "node:net";
import request from "supertest";
import { createApp } from "../../src/bootstrap.js";
import { type AppConfig, loadConfig } from "../../src/config/env.js";
import { DATABASE, type Database } from "../../src/db/client.js";

/** Testlerde kullanılan sabit JWT sırrı (32+ karakter). */
export const TEST_JWT_SECRET = "test-only-jwt-secret-0123456789-abcdefghijklmnopqrstuvwxyz";

/** Test için ucuz scrypt maliyeti: üretim varsayılanı (N=2^15, p=3) her kayıtta yüzlerce ms harcar. */
export const TEST_SCRYPT_PARAMS = { N: 1024, r: 8, p: 1 } as const;

export type TestHttp = ReturnType<typeof request>;

/**
 * `TEST_DATABASE_URL` (yönetici bağlantısı, ör. `postgres://postgres@127.0.0.1:5432/postgres`)
 * tanımlıysa testler PGlite yerine gerçek PostgreSQL'e karşı çalışır: her `createTestApp` kendi
 * geçici veritabanını açar ve kapanışta siler. Gerçek bağlantı havuzu ve satır kilidi davranışını
 * (eşzamanlılık) sınamak içindir; varsayılan değildir.
 */
export const TEST_DATABASE_URL: string | undefined = process.env.TEST_DATABASE_URL?.trim() || undefined;

export async function provisionPostgres(adminUrl: string): Promise<{ url: string; drop(): Promise<void> }> {
  const { default: pg } = await import("pg");
  const name = `wangoh_test_${randomUUID().replace(/-/g, "")}`;
  const withAdmin = async (fn: (client: InstanceType<typeof pg.Client>) => Promise<void>) => {
    const client = new pg.Client({ connectionString: adminUrl });
    await client.connect();
    try {
      await fn(client);
    } finally {
      await client.end();
    }
  };
  await withAdmin((c) => c.query(`create database ${name}`).then(() => undefined));
  const url = new URL(adminUrl);
  url.pathname = `/${name}`;
  return { url: url.toString(), drop: () => withAdmin((c) => c.query(`drop database if exists ${name} with (force)`).then(() => undefined)) };
}

export interface TestAppOptions {
  /** Yapılandırma geçersiz kılmaları (üstteki varsayılanlara bindirilir). */
  config?: Partial<AppConfig>;
  /**
   * Hız sınırı. Varsayılan KAPALI: aksi halde bir test dosyasındaki çok sayıda kayıt/giriş 10/dk
   * kimlik sınırına takılır. `true` gerçek sınırları (120/dk, kimlik 10/dk), nesne özel sınırları açar.
   */
  rateLimit?: boolean | Partial<Omit<AppConfig["rateLimit"], "enabled">>;
  /** Ek modüller (ör. koruma davranışını sınayan prob denetleyicisi). */
  extraModules?: Array<Type<unknown> | DynamicModule>;
}

export interface TestApp {
  app: NestExpressApplication;
  /** `supertest` istemcisi: `http.get("/v1/health")`. Uygulama boş bir yerel porta bağlanır. */
  http: TestHttp;
  /** Sunucunun taban adresi (`http://127.0.0.1:<port>`). */
  url: string;
  /** Bu test dosyasının kendi bellek içi PGlite veritabanı (migrasyonlar uygulanmış, tohum YOK). */
  db: Database;
  config: AppConfig;
  /** Uygulamayı ve veritabanı bağlantısını kapatır; `afterAll`'da çağır. */
  close(): Promise<void>;
}

/**
 * Gerçek uygulamayı gerçek (bellek içi) PGlite üzerinde başlatır; mock yok. Her çağrı kendi
 * veritabanını açar, bu yüzden test dosyaları birbirinden yalıtılıdır ve paralel çalışabilir.
 *
 * ```ts
 * let t: TestApp;
 * beforeAll(async () => { t = await createTestApp(); });
 * afterAll(() => t.close());
 * it("...", async () => {
 *   const { accessToken } = await registerUser(t.http);
 *   await t.http.get("/v1/auth/me").set(bearer(accessToken)).expect(200);
 * });
 * ```
 *
 * Tohum yüklenmez (`seedOnBoot: false`); test verisini kendin kur, başka modülün tohumuna bağlanma.
 */
export async function createTestApp(options: TestAppOptions = {}): Promise<TestApp> {
  const base = loadConfig({ NODE_ENV: "test", PGLITE_DIR: "memory://", JWT_ACCESS_SECRET: TEST_JWT_SECRET });
  const rateLimitOption = options.rateLimit;
  const config: AppConfig = {
    ...base,
    migrateOnBoot: true,
    seedOnBoot: false,
    httpLog: false,
    passwordHash: { ...TEST_SCRYPT_PARAMS },
    ...options.config,
    rateLimit: {
      ...base.rateLimit,
      enabled: rateLimitOption !== undefined && rateLimitOption !== false,
      ...(typeof rateLimitOption === "object" ? rateLimitOption : {}),
      ...options.config?.rateLimit,
    },
  };

  // Gerçek PostgreSQL istendiyse (ve test kendi PGlite klasörünü/adresini vermediyse) geçici veritabanı aç.
  const explicitDb = options.config?.databaseUrl !== undefined || options.config?.pgliteDir !== undefined;
  const provisioned = TEST_DATABASE_URL && !explicitDb ? await provisionPostgres(TEST_DATABASE_URL) : undefined;
  if (provisioned) config.databaseUrl = provisioned.url;

  const app = await createApp({ config, logger: false, extraModules: options.extraModules }).catch(async (err: unknown) => {
    await provisioned?.drop().catch(() => undefined);
    throw err;
  });
  // Rastgele boş porta gerçekten dinler (port çakışması olmaz); supertest her istekte dinleyici eklemez.
  await app.listen(0, "127.0.0.1").catch(async (err: unknown) => {
    await app.close().catch(() => undefined);
    await provisioned?.drop().catch(() => undefined);
    throw err;
  });
  const url = `http://127.0.0.1:${(app.getHttpServer().address() as AddressInfo).port}`;
  return {
    app,
    url,
    http: request(url),
    db: app.get<Database>(DATABASE),
    config,
    close: async () => {
      await app.close();
      await provisioned?.drop();
    },
  };
}
