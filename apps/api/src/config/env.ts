import express from "express";
import { DEFAULT_PGLITE_DIR, SEED_DIR } from "../paths.js";

export type NodeEnv = "development" | "test" | "production";

/** scrypt maliyet parametreleri (`scrypt$N$r$p$...` biçiminde saklanır). */
export interface ScryptParams {
  N: number;
  r: number;
  p: number;
}

export interface AppConfig {
  nodeEnv: NodeEnv;
  isProduction: boolean;
  port: number;
  /** Yoksa PGlite kullanılır. */
  databaseUrl: string | undefined;
  /** `memory://` ya da mutlak klasör yolu (yalnız PGlite). */
  pgliteDir: string;
  jwt: {
    secret: string;
    /** Güvensiz geliştirme varsayılanı kullanılıyor mu (yalnız dev/test). */
    insecureDefaultSecret: boolean;
    accessTtlSeconds: number;
    issuer: string;
    audience: string;
  };
  refreshTokenTtlDays: number;
  cors: { origins: string[]; allowLocalhost: boolean };
  trustProxy: boolean | number | string;
  /** İkisi de tanımlıysa açılışta idempotent admin oluşturulur. */
  admin: { email: string; password: string } | undefined;
  assetsBaseUrl: string;
  seedOnBoot: boolean;
  seedDir: string;
  migrateOnBoot: boolean;
  swaggerEnabled: boolean;
  /** Genel JSON gövde sınırı (ör. `100kb`). */
  bodyLimit: string;
  /** Blog yönetimi gibi büyük gövdeli yazma uçları için sınır (ör. `1mb`). */
  bodyLimitLarge: string;
  /** İstek başına tek satır erişim günlüğü (gövde/başlık/sorgu asla yazılmaz). */
  httpLog: boolean;
  rateLimit: { enabled: boolean; ttlMs: number; defaultLimit: number; authLimit: number };
  passwordHash: ScryptParams;
}

/** dev/test için sabit, bilerek güvensiz varsayılan; production'da reddedilir. */
export const INSECURE_DEV_JWT_SECRET = "wangoh-dev-only-insecure-secret-change-me-0123456789";

/** OWASP'ın scrypt için listelediği eşdeğer ayarlardan biri (N=2^15, r=8, p=3). */
export const DEFAULT_SCRYPT_PARAMS: ScryptParams = { N: 32768, r: 8, p: 3 };

export const JWT_ISSUER = "wangoh-api";
export const JWT_AUDIENCE = "wangoh-app";

/** Yapılandırma hatası: tüm sorunlar tek seferde, Türkçe listelenir. */
export class ConfigError extends Error {
  constructor(public readonly problems: string[]) {
    super(`Geçersiz yapılandırma:\n${problems.map((p) => `  - ${p}`).join("\n")}`);
    this.name = "ConfigError";
  }
}

type Env = Record<string, string | undefined>;

const DURATION_RE = /^(\d+)\s*(s|m|h|d)?$/i;
const SIZE_RE = /^\d+(b|kb|mb)$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** `15m`, `1h`, `900` (saniye), `7d` biçimlerini saniyeye çevirir; geçersizse null. */
export function parseDurationSeconds(value: string): number | null {
  const m = DURATION_RE.exec(value.trim());
  if (!m) return null;
  const amount = Number(m[1]);
  const unit = (m[2] ?? "s").toLowerCase();
  const factor = unit === "d" ? 86400 : unit === "h" ? 3600 : unit === "m" ? 60 : 1;
  const seconds = amount * factor;
  return Number.isSafeInteger(seconds) ? seconds : null;
}

export interface LoadConfigOptions {
  /**
   * Production'da `JWT_ACCESS_SECRET` zorunlu mu (varsayılan: evet). Sunucu belirteç imzalar, bu yüzden
   * ister; `db:seed` gibi belirteçle işi olmayan komut satırı araçları `false` verir. Sır verilmişse her
   * durumda doğrulanır.
   */
  requireJwtSecret?: boolean;
}

/**
 * `TRUST_PROXY` dizgisini Express'in kendisine doğrulatır: `createApp` aynı değeri `app.set("trust proxy", ...)`
 * ile verir ve geçersizse `proxy-addr` ham `TypeError` fırlatıp açılışı yığın izleriyle çökertirdi. Kuralları
 * burada yeniden yazmak yerine aynı çağrıyı sınarız; böylece kabul edilen küme Express'ten ayrışamaz.
 */
function isAcceptedTrustProxy(value: string): boolean {
  try {
    express().set("trust proxy", value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Ortam değişkenlerini doğrular ve tipli yapılandırmaya çevirir. Saf bir fonksiyondur
 * (varsayılan olarak `process.env` okur); testler ve OpenAPI dışa aktarma kendi `env`ini verir.
 * Geçersiz değer varsa tüm sorunları içeren `ConfigError` fırlatır.
 */
export function loadConfig(env: Env = process.env, options: LoadConfigOptions = {}): AppConfig {
  const requireJwtSecret = options.requireJwtSecret ?? true;
  const problems: string[] = [];

  const read = (name: string): string | undefined => {
    const raw = env[name];
    if (raw === undefined) return undefined;
    const trimmed = raw.trim();
    return trimmed === "" ? undefined : trimmed;
  };
  const int = (name: string, fallback: number, min: number, max: number): number => {
    const raw = read(name);
    if (raw === undefined) return fallback;
    const n = Number(raw);
    if (!/^-?\d+$/.test(raw) || !Number.isSafeInteger(n) || n < min || n > max) {
      problems.push(`${name}, ${min} ile ${max} arasında bir tam sayı olmalı (verilen: "${raw}").`);
      return fallback;
    }
    return n;
  };
  const bool = (name: string, fallback: boolean): boolean => {
    const raw = read(name);
    if (raw === undefined) return fallback;
    const v = raw.toLowerCase();
    if (["true", "1", "yes"].includes(v)) return true;
    if (["false", "0", "no"].includes(v)) return false;
    problems.push(`${name}, "true" ya da "false" olmalı (verilen: "${raw}").`);
    return fallback;
  };

  // NODE_ENV
  const rawEnv = read("NODE_ENV") ?? "development";
  let nodeEnv: NodeEnv = "development";
  if (rawEnv === "development" || rawEnv === "test" || rawEnv === "production") {
    nodeEnv = rawEnv;
  } else {
    problems.push(`NODE_ENV "development", "test" ya da "production" olmalı (verilen: "${rawEnv}").`);
  }
  const isProduction = nodeEnv === "production";

  const port = int("PORT", 3001, 0, 65535);

  // Veritabanı
  const databaseUrl = read("DATABASE_URL");
  if (databaseUrl !== undefined && !/^postgres(ql)?:\/\//i.test(databaseUrl)) {
    problems.push('DATABASE_URL "postgres://" ya da "postgresql://" ile başlamalı.');
  }
  const pgliteDir = read("PGLITE_DIR") ?? DEFAULT_PGLITE_DIR;

  // JWT
  const providedSecret = read("JWT_ACCESS_SECRET");
  const secret = providedSecret ?? INSECURE_DEV_JWT_SECRET;
  const insecureDefaultSecret = providedSecret === undefined;
  if (isProduction) {
    if (providedSecret === undefined) {
      if (requireJwtSecret) problems.push("JWT_ACCESS_SECRET production ortamında zorunludur (en az 32 karakter).");
    } else if (providedSecret.length < 32) {
      problems.push(`JWT_ACCESS_SECRET en az 32 karakter olmalı (şu an ${providedSecret.length}).`);
    } else if (providedSecret === INSECURE_DEV_JWT_SECRET) {
      problems.push("JWT_ACCESS_SECRET geliştirme varsayılanı olamaz; rastgele bir değer üretin.");
    }
  }

  const ttlRaw = read("ACCESS_TOKEN_TTL") ?? "15m";
  let accessTtlSeconds = 900;
  const parsedTtl = parseDurationSeconds(ttlRaw);
  if (parsedTtl === null || parsedTtl < 1 || parsedTtl > 86400) {
    problems.push(`ACCESS_TOKEN_TTL 1 saniye ile 1 gün arasında olmalı; örnekler: "15m", "1h", "900" (verilen: "${ttlRaw}").`);
  } else {
    accessTtlSeconds = parsedTtl;
  }

  const refreshTokenTtlDays = int("REFRESH_TOKEN_TTL_DAYS", 30, 1, 365);

  // CORS
  const origins = (read("CORS_ORIGINS") ?? "")
    .split(",")
    .map((o) => o.trim().replace(/\/+$/, ""))
    .filter(Boolean);
  for (const origin of origins) {
    try {
      const u = new URL(origin);
      if ((u.protocol !== "http:" && u.protocol !== "https:") || u.origin !== origin) throw new Error("origin");
    } catch {
      problems.push(`CORS_ORIGINS içinde geçersiz kaynak: "${origin}" (örnek: https://wangoh.com).`);
    }
  }

  // Ters vekil
  const trustRaw = read("TRUST_PROXY");
  let trustProxy: boolean | number | string = false;
  if (trustRaw !== undefined) {
    const v = trustRaw.toLowerCase();
    if (v === "true") trustProxy = true;
    else if (v === "false") trustProxy = false;
    else if (/^\d+$/.test(trustRaw)) trustProxy = Number(trustRaw);
    else {
      trustProxy = trustRaw;
      if (!isAcceptedTrustProxy(trustRaw)) {
        problems.push(
          `TRUST_PROXY geçersiz (verilen: "${trustRaw}"). "true", "false", atlama sayısı (ör. "1"), "loopback"/"linklocal"/"uniquelocal" ` +
            'ya da virgülle ayrılmış IP/alt ağ listesi (ör. "10.0.0.0/8, 192.168.0.0/16") olmalı.',
        );
      }
    }
  }

  // Admin bootstrap
  const adminEmail = read("ADMIN_EMAIL")?.toLowerCase();
  const adminPassword = env.ADMIN_PASSWORD === undefined || env.ADMIN_PASSWORD === "" ? undefined : env.ADMIN_PASSWORD;
  let admin: AppConfig["admin"];
  if ((adminEmail === undefined) !== (adminPassword === undefined)) {
    problems.push("ADMIN_EMAIL ve ADMIN_PASSWORD birlikte tanımlanmalı (yalnız biri verilmiş).");
  } else if (adminEmail !== undefined && adminPassword !== undefined) {
    if (!EMAIL_RE.test(adminEmail) || adminEmail.length > 254) problems.push("ADMIN_EMAIL geçerli bir e-posta adresi olmalı.");
    if (adminPassword.length < 8 || adminPassword.length > 128) problems.push("ADMIN_PASSWORD 8 ile 128 karakter arasında olmalı.");
    admin = { email: adminEmail, password: adminPassword };
  }

  // Görseller
  const assetsRaw = (read("ASSETS_BASE_URL") ?? "https://wangoh.com").replace(/\/+$/, "");
  try {
    const u = new URL(assetsRaw);
    if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error("protocol");
  } catch {
    problems.push(`ASSETS_BASE_URL geçerli bir http(s) adresi olmalı (verilen: "${assetsRaw}").`);
  }

  const bodyLimit = read("BODY_LIMIT") ?? "100kb";
  const bodyLimitLarge = read("BODY_LIMIT_LARGE") ?? "1mb";
  for (const [name, value] of [
    ["BODY_LIMIT", bodyLimit],
    ["BODY_LIMIT_LARGE", bodyLimitLarge],
  ] as const) {
    if (!SIZE_RE.test(value)) problems.push(`${name} "100kb" ya da "1mb" biçiminde olmalı (verilen: "${value}").`);
  }

  const config: AppConfig = {
    nodeEnv,
    isProduction,
    port,
    databaseUrl,
    pgliteDir,
    jwt: { secret, insecureDefaultSecret, accessTtlSeconds, issuer: JWT_ISSUER, audience: JWT_AUDIENCE },
    refreshTokenTtlDays,
    cors: { origins, allowLocalhost: !isProduction },
    trustProxy,
    admin,
    assetsBaseUrl: assetsRaw,
    seedOnBoot: bool("SEED_ON_BOOT", !isProduction),
    seedDir: SEED_DIR,
    migrateOnBoot: bool("MIGRATE_ON_BOOT", true),
    swaggerEnabled: bool("SWAGGER_ENABLED", true),
    bodyLimit,
    bodyLimitLarge,
    httpLog: nodeEnv !== "test",
    rateLimit: { enabled: bool("RATE_LIMIT_ENABLED", true), ttlMs: 60_000, defaultLimit: 120, authLimit: 10 },
    passwordHash: DEFAULT_SCRYPT_PARAMS,
  };

  if (problems.length > 0) throw new ConfigError(problems);
  return config;
}
