import { DrizzleQueryError } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { ConfigError } from "../config/env.js";
import { summarizeError } from "./filters/all-exceptions.filter.js";
import { formatStartupError, OperationalError } from "./startup-error.js";

const EMAIL = "gizli.admin@sirket.example";
const HASH = "scrypt$32768$8$3$tuzTUZtuzTUZtuz$ozetOZETozetOZETozetOZETozetOZETozetOZETozet";

describe("formatStartupError", () => {
  it("Drizzle sorgu hatasında bağlı değerler (ADMIN_EMAIL, parola özeti) çıktıya girmez", () => {
    const err = new DrizzleQueryError(
      'insert into "users" ("email", "password_hash", "display_name", "role") values ($1, $2, $3, $4)',
      [EMAIL, HASH, "Yönetici", "admin"],
      Object.assign(new Error("cannot execute INSERT in a read-only transaction"), { code: "25006" }),
    );
    // ham hata gerçekten sızdıracak türdendi: bu test aracı geçerli
    expect(err.message).toContain(EMAIL);
    expect(JSON.stringify(Object.getOwnPropertyNames(err))).toContain("params");

    const out = formatStartupError(err);
    expect(out).toContain("cannot execute INSERT in a read-only transaction");
    expect(out).toContain("25006");
    expect(out).not.toContain(EMAIL);
    expect(out).not.toContain("scrypt$");
    expect(out).not.toContain(HASH);
    expect(out).not.toContain("params");
    expect(out).not.toContain("insert into");
  });

  it("select hatasında da e-posta parametresi sızmaz (tablo yok)", () => {
    const err = new DrizzleQueryError('select "id" from "users" where lower("users"."email") = lower($1) limit $2', [EMAIL, 1], new Error('relation "users" does not exist'));
    const out = formatStartupError(err);
    expect(out).toContain('relation "users" does not exist');
    expect(out).not.toContain(EMAIL);
  });

  it("yapılandırma ve işletim hataları yığınsız, yalnız mesajla yazılır", () => {
    const config = new ConfigError(["PORT geçersiz", "TRUST_PROXY geçersiz"]);
    expect(formatStartupError(config)).toBe(config.message);
    expect(formatStartupError(config)).not.toMatch(/\bat /);
    const op = new OperationalError('PGlite klasörü "x" başka bir süreç tarafından kullanılıyor.');
    expect(formatStartupError(op)).toBe(op.message);
  });

  it("bilinmeyen hata türü çökmez", () => {
    expect(formatStartupError("düz metin")).toContain("bilinmeyen hata");
    expect(formatStartupError(undefined)).toContain("bilinmeyen hata");
  });
});

describe("summarizeError: teşhis bilgisi korunur", () => {
  it("sürücü kodunu ekler (ECONNREFUSED gibi) ve kod zaten mesajdaysa tekrarlamaz", () => {
    const refused = Object.assign(new Error("connect ECONNREFUSED 127.0.0.1:5432"), { code: "ECONNREFUSED" });
    expect(summarizeError(refused, false)).toBe("Error: connect ECONNREFUSED 127.0.0.1:5432");
    const auth = Object.assign(new Error("password authentication failed for user \"app\""), { code: "28P01" });
    expect(summarizeError(auth, false)).toBe('Error: password authentication failed for user "app" [28P01]');
  });

  it("çift yığınlı bağlantı hatasında (boş mesajlı AggregateError) ilk iç hatanın mesajı kullanılır", () => {
    const inner = Object.assign(new Error("connect ECONNREFUSED ::1:5432"), { code: "ECONNREFUSED" });
    const agg = Object.assign(new AggregateError([inner, new Error("ikinci")]), { code: "ECONNREFUSED" });
    expect(summarizeError(agg, false)).toBe("AggregateError: connect ECONNREFUSED ::1:5432");
  });

  it("sorgu hatasında kod, sürücü hatasından (cause) alınır", () => {
    const cause = Object.assign(new Error('relation "users" does not exist'), { code: "42P01" });
    const query = new DrizzleQueryError("select 1 from users", ["gizli"], cause);
    expect(summarizeError(query, false)).toBe('Error: relation "users" does not exist [42P01]');
  });
});
