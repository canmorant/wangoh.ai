import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { hashPassword } from "../../src/auth/password.js";
import { users, type UserRow } from "../../src/db/schema/index.js";
import type { TestApp, TestHttp } from "./create-test-app.js";

export const DEFAULT_TEST_PASSWORD = "Parola-12345";

/** Bir kullanıcının oturum bilgileri. */
export interface TestSession {
  /** API'nin döndürdüğü kullanıcı (`passwordHash` yok). */
  user: { id: string; email: string; displayName: string; role: "user" | "admin"; disabled: boolean; createdAt: string; updatedAt: string };
  accessToken: string;
  refreshToken: string;
  /** Kullanılan açık e-posta ve parola (yeniden giriş testleri için). */
  email: string;
  password: string;
}

export interface UserOverrides {
  email?: string;
  password?: string;
  displayName?: string;
}

/** Çakışmayan, geçerli bir test e-postası. */
export function uniqueEmail(prefix = "kullanici"): string {
  return `${prefix}-${randomUUID().slice(0, 8)}@example.test`;
}

/**
 * `POST /v1/auth/register` ile gerçek kayıt yapar ve oturum bilgilerini döner. Beklenmeyen durumda
 * yanıtı içeren açık bir hata fırlatır.
 */
export async function registerUser(http: TestHttp, over: UserOverrides = {}): Promise<TestSession> {
  const email = over.email ?? uniqueEmail();
  const password = over.password ?? DEFAULT_TEST_PASSWORD;
  const res = await http.post("/v1/auth/register").send({ email, password, displayName: over.displayName ?? "Test Kullanıcı" });
  if (res.status !== 201) throw new Error(`registerUser beklenmedik yanıt ${res.status}: ${JSON.stringify(res.body)}`);
  return { user: res.body.user, accessToken: res.body.accessToken, refreshToken: res.body.refreshToken, email: email.trim().toLowerCase(), password };
}

/** `POST /v1/auth/login` ile giriş yapar. */
export async function loginUser(http: TestHttp, email: string, password: string = DEFAULT_TEST_PASSWORD): Promise<TestSession> {
  const res = await http.post("/v1/auth/login").send({ email, password });
  if (res.status !== 200) throw new Error(`loginUser beklenmedik yanıt ${res.status}: ${JSON.stringify(res.body)}`);
  return { user: res.body.user, accessToken: res.body.accessToken, refreshToken: res.body.refreshToken, email, password };
}

/**
 * Veritabanına doğrudan admin yazar (kayıt ucu admin üretmez) ve gerçek girişle belirteç alır.
 * Her çağrı yeni bir admin oluşturur.
 */
export async function createAdmin(testApp: Pick<TestApp, "db" | "http" | "config">, over: UserOverrides = {}): Promise<TestSession> {
  const email = (over.email ?? uniqueEmail("admin")).trim().toLowerCase();
  const password = over.password ?? DEFAULT_TEST_PASSWORD;
  const passwordHash = await hashPassword(password, testApp.config.passwordHash);
  await testApp.db.insert(users).values({ email, passwordHash, displayName: over.displayName ?? "Test Yönetici", role: "admin" });
  return loginUser(testApp.http, email, password);
}

/** Doğrudan veritabanından kullanıcı satırı (parola özeti dahil; yalnız testlerde). */
export async function findUserRow(testApp: Pick<TestApp, "db">, id: string): Promise<UserRow | undefined> {
  const [row] = await testApp.db.select().from(users).where(eq(users.id, id)).limit(1);
  return row;
}

/** `Authorization: Bearer <token>` başlığı: `http.get(url).set(bearer(token))`. */
export function bearer(token: string): { Authorization: string } {
  return { Authorization: `Bearer ${token}` };
}
