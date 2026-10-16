import { describe, expect, it } from "vitest";
import { ConfigError, INSECURE_DEV_JWT_SECRET, loadConfig, parseDurationSeconds } from "./env.js";

const SECRET = "x".repeat(32);

function problemsOf(env: Record<string, string | undefined>): string[] {
  try {
    loadConfig(env);
  } catch (err) {
    if (err instanceof ConfigError) return err.problems;
    throw err;
  }
  return [];
}

describe("yapılandırma doğrulaması", () => {
  it("varsayılanlar: geliştirme, port 3001, PGlite, güvensiz sır işaretli", () => {
    const c = loadConfig({});
    expect(c.nodeEnv).toBe("development");
    expect(c.port).toBe(3001);
    expect(c.databaseUrl).toBeUndefined();
    expect(c.pgliteDir.endsWith(".data/pglite")).toBe(true);
    expect(c.jwt.secret).toBe(INSECURE_DEV_JWT_SECRET);
    expect(c.jwt.insecureDefaultSecret).toBe(true);
    expect(c.jwt.accessTtlSeconds).toBe(900);
    expect(c.refreshTokenTtlDays).toBe(30);
    expect(c.assetsBaseUrl).toBe("https://wangoh.com");
    expect(c.seedOnBoot).toBe(true);
    expect(c.migrateOnBoot).toBe(true);
    expect(c.swaggerEnabled).toBe(true);
    expect(c.cors.allowLocalhost).toBe(true);
    expect(c.admin).toBeUndefined();
    expect(c.rateLimit).toMatchObject({ enabled: true, defaultLimit: 120, authLimit: 10 });
  });

  it("production'da JWT_ACCESS_SECRET zorunlu", () => {
    const problems = problemsOf({ NODE_ENV: "production" });
    expect(problems).toHaveLength(1);
    expect(problems[0]).toContain("JWT_ACCESS_SECRET");
    expect(problems[0]).toContain("zorunlu");
  });

  it("production'da 32 karakterden kısa sır reddedilir, tam 32 kabul edilir", () => {
    expect(problemsOf({ NODE_ENV: "production", JWT_ACCESS_SECRET: "x".repeat(31) })[0]).toContain("en az 32");
    const ok = loadConfig({ NODE_ENV: "production", JWT_ACCESS_SECRET: SECRET });
    expect(ok.isProduction).toBe(true);
    expect(ok.jwt.insecureDefaultSecret).toBe(false);
  });

  it("production'da geliştirme varsayılan sırrı açıkça verilse bile reddedilir", () => {
    const problems = problemsOf({ NODE_ENV: "production", JWT_ACCESS_SECRET: INSECURE_DEV_JWT_SECRET });
    expect(problems.join(" ")).toContain("varsayılan");
  });

  it("production'da seed varsayılan kapalı, localhost CORS kapalı", () => {
    const c = loadConfig({ NODE_ENV: "production", JWT_ACCESS_SECRET: SECRET });
    expect(c.seedOnBoot).toBe(false);
    expect(c.cors.allowLocalhost).toBe(false);
    expect(loadConfig({ NODE_ENV: "production", JWT_ACCESS_SECRET: SECRET, SEED_ON_BOOT: "true" }).seedOnBoot).toBe(true);
  });

  it("boş string tanımsız sayılır", () => {
    expect(loadConfig({ JWT_ACCESS_SECRET: "  ", PORT: "" }).jwt.insecureDefaultSecret).toBe(true);
    expect(problemsOf({ NODE_ENV: "production", JWT_ACCESS_SECRET: "" })).toHaveLength(1);
  });

  it("tüm sorunlar tek hatada, Türkçe listelenir", () => {
    const problems = problemsOf({
      NODE_ENV: "staging",
      PORT: "99999",
      DATABASE_URL: "mysql://x",
      ACCESS_TOKEN_TTL: "abc",
      REFRESH_TOKEN_TTL_DAYS: "0",
      CORS_ORIGINS: "https://ok.example,not a url",
      SEED_ON_BOOT: "belki",
      ASSETS_BASE_URL: "ftp://x",
      BODY_LIMIT: "yüz",
    });
    expect(problems.length).toBeGreaterThanOrEqual(9);
    const err = (() => {
      try {
        loadConfig({ PORT: "abc" });
      } catch (e) {
        return e as ConfigError;
      }
    })();
    expect(err?.message).toContain("Geçersiz yapılandırma");
    expect(err?.message).toContain("PORT");
  });

  it("ADMIN_EMAIL ve ADMIN_PASSWORD birlikte olmalı; e-posta normalize edilir", () => {
    expect(problemsOf({ ADMIN_EMAIL: "a@b.co" })[0]).toContain("birlikte");
    expect(problemsOf({ ADMIN_PASSWORD: "parola-123" })[0]).toContain("birlikte");
    expect(problemsOf({ ADMIN_EMAIL: "yok", ADMIN_PASSWORD: "parola-123" }).join(" ")).toContain("ADMIN_EMAIL");
    expect(problemsOf({ ADMIN_EMAIL: "a@b.co", ADMIN_PASSWORD: "kisa" }).join(" ")).toContain("ADMIN_PASSWORD");
    expect(loadConfig({ ADMIN_EMAIL: "  Admin@Wangoh.COM ", ADMIN_PASSWORD: "parola-123" }).admin).toEqual({
      email: "admin@wangoh.com",
      password: "parola-123",
    });
  });

  it("ADMIN_PASSWORD kırpılmaz (boşluklu parola olduğu gibi kalır)", () => {
    expect(loadConfig({ ADMIN_EMAIL: "a@b.co", ADMIN_PASSWORD: "  parola 123  " }).admin?.password).toBe("  parola 123  ");
  });

  it("CORS_ORIGINS virgülle ayrılır, sondaki / atılır", () => {
    const c = loadConfig({ CORS_ORIGINS: "https://wangoh.com/, http://localhost:3200 ," });
    expect(c.cors.origins).toEqual(["https://wangoh.com", "http://localhost:3200"]);
  });

  it("TRUST_PROXY: bool, sayı ya da dizgi", () => {
    expect(loadConfig({}).trustProxy).toBe(false);
    expect(loadConfig({ TRUST_PROXY: "true" }).trustProxy).toBe(true);
    expect(loadConfig({ TRUST_PROXY: "1" }).trustProxy).toBe(1);
    expect(loadConfig({ TRUST_PROXY: "loopback" }).trustProxy).toBe("loopback");
  });

  it("TRUST_PROXY: Express'in kabul ettiği her biçim geçer", () => {
    for (const value of ["true", "TRUE", "false", "0", "2", "loopback", "linklocal", "uniquelocal", "10.0.0.1", "10.0.0.0/8", "1.2.3.4/255.255.255.0", "::1", "fe80::/10", "2001:db8::/32", "loopback, 10.0.0.0/8 ,192.168.0.0/16"]) {
      expect(problemsOf({ TRUST_PROXY: value }), value).toEqual([]);
    }
    expect(loadConfig({ TRUST_PROXY: "loopback, 10.0.0.0/8" }).trustProxy).toBe("loopback, 10.0.0.0/8");
  });

  it("TRUST_PROXY: geçersiz değer ham TypeError yerine Türkçe yapılandırma hatası olur", () => {
    for (const value of ["yes", "no", "1.2.3", "10.0.0.0/33", "10.0.0.0/0", "-1", "foo", "1.2.3.4/", "300.1.1.1", "10.0.0.0/8,", ",", "loopbak"]) {
      const problems = problemsOf({ TRUST_PROXY: value });
      expect(problems, value).toHaveLength(1);
      expect(problems[0], value).toContain("TRUST_PROXY");
      expect(problems[0], value).toContain(`"${value}"`);
    }
    // loadConfig kendisi fırlatır (createApp'e hiç ulaşmaz): ConfigError, TypeError değil
    expect(() => loadConfig({ TRUST_PROXY: "yes" })).toThrow(ConfigError);
  });

  it("TRUST_PROXY hatası diğer sorunlarla aynı listede raporlanır (önce PORT, sonra bu patlamaz)", () => {
    const problems = problemsOf({ PORT: "abc", TRUST_PROXY: "yes" });
    expect(problems).toHaveLength(2);
    expect(problems.map((p) => p.split(/[ ,]/)[0]).sort()).toEqual(["PORT", "TRUST_PROXY"]);
  });

  it("JWT_ACCESS_SECRET zorunluluğu db:seed gibi komut satırı araçları için gevşetilebilir", () => {
    const env = { NODE_ENV: "production" };
    expect(problemsOf(env)).toHaveLength(1);
    const cli = loadConfig(env, { requireJwtSecret: false });
    expect(cli.isProduction).toBe(true);
    expect(cli.jwt.insecureDefaultSecret).toBe(true);
    // verilmiş ama geçersiz sır yine reddedilir (yanlış yapılandırmayı sessizce geçirme)
    expect(() => loadConfig({ ...env, JWT_ACCESS_SECRET: "kisa" }, { requireJwtSecret: false })).toThrow(ConfigError);
    expect(loadConfig({ ...env, JWT_ACCESS_SECRET: "x".repeat(40) }, { requireJwtSecret: false }).jwt.secret).toBe("x".repeat(40));
  });

  it("ACCESS_TOKEN_TTL: süre biçimleri ve sınırlar", () => {
    expect(parseDurationSeconds("15m")).toBe(900);
    expect(parseDurationSeconds("1h")).toBe(3600);
    expect(parseDurationSeconds("900")).toBe(900);
    expect(parseDurationSeconds("2d")).toBe(172800);
    expect(parseDurationSeconds("-5m")).toBeNull();
    expect(parseDurationSeconds("5 dakika")).toBeNull();
    expect(loadConfig({ ACCESS_TOKEN_TTL: "1h" }).jwt.accessTtlSeconds).toBe(3600);
    expect(problemsOf({ ACCESS_TOKEN_TTL: "2d" })[0]).toContain("ACCESS_TOKEN_TTL");
    expect(problemsOf({ ACCESS_TOKEN_TTL: "0" })[0]).toContain("ACCESS_TOKEN_TTL");
  });

  it("PORT 0 (rastgele) kabul edilir, sayısal olmayan reddedilir", () => {
    expect(loadConfig({ PORT: "0" }).port).toBe(0);
    expect(problemsOf({ PORT: "3001abc" })[0]).toContain("PORT");
  });

  it("DATABASE_URL ve PGLITE_DIR", () => {
    expect(loadConfig({ DATABASE_URL: "postgres://u:p@h:5432/db" }).databaseUrl).toBe("postgres://u:p@h:5432/db");
    expect(loadConfig({ PGLITE_DIR: "memory://" }).pgliteDir).toBe("memory://");
  });
});
