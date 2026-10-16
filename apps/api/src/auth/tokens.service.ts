import { createHash, randomBytes, randomUUID } from "node:crypto";
import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { and, eq, isNull, lt } from "drizzle-orm";
import { APP_CONFIG } from "../config/config.module.js";
import type { AppConfig } from "../config/env.js";
import { DATABASE, type Database } from "../db/client.js";
import { refreshTokens, type UserRow, users } from "../db/schema/index.js";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DAY_MS = 86_400_000;

export interface AccessTokenClaims {
  /** Kullanıcı kimliği. */
  sub: string;
  /** `users.token_version` anındaki değer; parola değişince eski belirteçler düşer. */
  ver: number;
}

export interface SignedAccessToken {
  token: string;
  /** Saniye cinsinden ömür (yanıttaki `expiresIn`). */
  expiresIn: number;
}

/** Yenileme belirtecinin ham değerinin SHA-256 özeti (hex). Yalnız bu veritabanına yazılır. */
export function hashRefreshToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

/** 256 bit rastgele, opak, URL güvenli değer (43 karakter). */
export function generateRefreshTokenValue(): string {
  return randomBytes(32).toString("base64url");
}

/** Erişim (JWT) ve yenileme (opak, veritabanında özetli) belirteçlerinin yaşam döngüsü. */
@Injectable()
export class TokensService {
  constructor(
    private readonly jwt: JwtService,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
    @Inject(DATABASE) private readonly db: Database,
  ) {}

  // --- erişim belirteci -------------------------------------------------

  async signAccessToken(user: { id: string; tokenVersion: number }): Promise<SignedAccessToken> {
    const { accessTtlSeconds, issuer, audience } = this.config.jwt;
    const token = await this.jwt.signAsync(
      { ver: user.tokenVersion },
      { subject: user.id, algorithm: "HS256", issuer, audience, expiresIn: accessTtlSeconds, jwtid: randomUUID() },
    );
    return { token, expiresIn: accessTtlSeconds };
  }

  /** İmza, süre, `iss`, `aud` ve algoritma (yalnız HS256) doğrulanır; geçersizse `null`. */
  async verifyAccessToken(token: string): Promise<AccessTokenClaims | null> {
    try {
      const { issuer, audience } = this.config.jwt;
      const payload = await this.jwt.verifyAsync<{ sub?: unknown; ver?: unknown }>(token, {
        algorithms: ["HS256"],
        issuer,
        audience,
      });
      if (typeof payload.sub !== "string" || !UUID_RE.test(payload.sub)) return null;
      if (typeof payload.ver !== "number" || !Number.isInteger(payload.ver)) return null;
      return { sub: payload.sub, ver: payload.ver };
    } catch {
      return null;
    }
  }

  // --- kilit sırası -----------------------------------------------------

  /**
   * Kullanıcı satırını `FOR NO KEY UPDATE` ile kilitler ve kilitlendikten sonraki güncel halini döner
   * (satır yoksa ya da eşzamanlı silindiyse `undefined`).
   *
   * Yenilemeyi, girişi, çıkışı, yeniden kullanım tespitini ve yönetici işlemlerini (devre dışı bırakma,
   * silme, parola değişimi) tek bir kilit sırasına bağlar: `users` -> `refresh_tokens`. Sıra ters
   * olursa (belirteç satırı önce, kullanıcı sonra) yenilemenin `INSERT`ü FK denetimi için kullanıcı
   * satırında `FOR KEY SHARE` ister ve yöneticinin `FOR UPDATE`iyle karşılıklı bekleyip PostgreSQL
   * "deadlock detected" (500) üretir. Aynı kilit işlemleri kullanıcı başına sıraya dizdiği için aile
   * iptali (çıkış, yeniden kullanım) da sürmekte olan bir yenilemenin henüz işlenmemiş yeni
   * belirtecini kaçırmaz: iptal ifadesi kilit alındıktan SONRA, güncel görüntüyle çalışır.
   *
   * Her belirteç işlemi, `refresh_tokens` satırına dokunmadan önce bunu çağırmalıdır. `FOR NO KEY
   * UPDATE` kendisiyle çakışır ama yalnız FK denetiminin aldığı `FOR KEY SHARE` ile çakışmaz.
   */
  async lockUser(tx: Database, userId: string): Promise<UserRow | undefined> {
    const [row] = await tx.select().from(users).where(eq(users.id, userId)).for("no key update");
    return row;
  }

  // --- yenileme belirteci -----------------------------------------------

  /**
   * Yeni yenileme belirteci üretip özetini kaydeder; ham değeri döner. `familyId` verilmezse yeni
   * aile (yeni giriş) başlar. İşlem içinde çağrılırken `executor` olarak `tx` ver.
   */
  async issueRefreshToken(
    executor: Database,
    user: { id: string; tokenVersion: number },
    familyId: string = randomUUID(),
  ): Promise<string> {
    const raw = generateRefreshTokenValue();
    await executor.insert(refreshTokens).values({
      userId: user.id,
      familyId,
      tokenVersion: user.tokenVersion,
      tokenHash: hashRefreshToken(raw),
      expiresAt: new Date(Date.now() + this.config.refreshTokenTtlDays * DAY_MS),
    });
    return raw;
  }

  /** Kullanıcının süresi dolmuş satırlarını siler (süresi dolan belirteç zaten geçersizdir; tablo şişmesin). */
  async purgeExpired(executor: Database, userId: string): Promise<void> {
    await executor.delete(refreshTokens).where(and(eq(refreshTokens.userId, userId), lt(refreshTokens.expiresAt, new Date())));
  }

  /** Erişim + yeni aileden yenileme belirteci (kayıt/giriş). */
  async issueTokenPair(
    executor: Database,
    user: { id: string; tokenVersion: number },
  ): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    await this.purgeExpired(executor, user.id);
    const refreshToken = await this.issueRefreshToken(executor, user);
    const access = await this.signAccessToken(user);
    return { accessToken: access.token, refreshToken, expiresIn: access.expiresIn };
  }

  /** Bir ailenin henüz iptal edilmemiş tüm belirteçlerini iptal eder. */
  async revokeFamily(executor: Database, familyId: string): Promise<void> {
    await executor
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(and(eq(refreshTokens.familyId, familyId), isNull(refreshTokens.revokedAt)));
  }

  /** Kullanıcının tüm yenileme belirteçlerini iptal eder (parola değişimi, devre dışı bırakma). */
  async revokeAllForUser(executor: Database, userId: string): Promise<void> {
    await executor
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(and(eq(refreshTokens.userId, userId), isNull(refreshTokens.revokedAt)));
  }
}
