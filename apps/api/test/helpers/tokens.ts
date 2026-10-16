import { JwtService } from "@nestjs/jwt";
import { eq } from "drizzle-orm";
import { refreshTokens, users } from "../../src/db/schema/index.js";
import { hashRefreshToken } from "../../src/auth/tokens.service.js";
import type { TestApp } from "./create-test-app.js";

export interface SignOptions {
  /** Varsayılan: kullanıcının veritabanındaki güncel `token_version`. */
  ver?: number;
  /** Saniye. Varsayılan: yapılandırmadaki ömür. Süresi dolmuş belirteç için negatif ver: `-60`. */
  expiresIn?: number;
  secret?: string;
  issuer?: string;
  audience?: string;
  algorithm?: "HS256" | "HS384" | "HS512";
}

/**
 * Var olan bir kullanıcı için geçerli (ya da bilerek bozulmuş) erişim belirteci imzalar. Giriş ucuna
 * gitmeden hızlıca oturum kurmak ya da sahte/süresi dolmuş belirteç denemek için.
 */
export async function signAccessToken(testApp: Pick<TestApp, "app" | "db" | "config">, userId: string, opts: SignOptions = {}): Promise<string> {
  const jwt = testApp.app.get(JwtService, { strict: false });
  let ver = opts.ver;
  if (ver === undefined) {
    const [row] = await testApp.db.select({ ver: users.tokenVersion }).from(users).where(eq(users.id, userId)).limit(1);
    ver = row?.ver ?? 0;
  }
  const { issuer, audience, secret, accessTtlSeconds } = testApp.config.jwt;
  return jwt.signAsync(
    { ver },
    {
      subject: userId,
      secret: opts.secret ?? secret,
      issuer: opts.issuer ?? issuer,
      audience: opts.audience ?? audience,
      algorithm: opts.algorithm ?? "HS256",
      expiresIn: opts.expiresIn ?? accessTtlSeconds,
    },
  );
}

/** İmzasız (`alg: none`) belirteç: kabul edilmemeli. */
export function unsignedToken(userId: string, ver = 0): string {
  const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const exp = Math.floor(Date.now() / 1000) + 600;
  return `${b64({ alg: "none", typ: "JWT" })}.${b64({ sub: userId, ver, exp })}.`;
}

/** Belirtecin yük kısmını doğrulamadan çözer (talepleri incelemek için). */
export function decodeJwt(token: string): Record<string, unknown> {
  return JSON.parse(Buffer.from(token.split(".")[1]!, "base64url").toString("utf8")) as Record<string, unknown>;
}

/** Ham yenileme belirtecinin süresini geçmişe çeker (süre dolumu testleri). */
export async function expireRefreshToken(testApp: Pick<TestApp, "db">, rawToken: string): Promise<void> {
  await testApp.db
    .update(refreshTokens)
    .set({ expiresAt: new Date(Date.now() - 60_000) })
    .where(eq(refreshTokens.tokenHash, hashRefreshToken(rawToken)));
}
