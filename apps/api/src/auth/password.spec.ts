import { describe, expect, it } from "vitest";
import { DEFAULT_SCRYPT_PARAMS } from "../config/env.js";
import { hashPassword, parsePasswordHash, verifyPassword } from "./password.js";

const FAST = { N: 1024, r: 8, p: 1 };

describe("parola özetleme (scrypt)", () => {
  it("biçim scrypt$N$r$p$tuz$özet ve rastgele tuz", async () => {
    const a = await hashPassword("Parola-12345", FAST);
    const b = await hashPassword("Parola-12345", FAST);
    expect(a).toMatch(/^scrypt\$1024\$8\$1\$[A-Za-z0-9_-]+\$[A-Za-z0-9_-]+$/);
    expect(a).not.toBe(b);
    expect(a).not.toContain("Parola-12345");
    const parsed = parsePasswordHash(a)!;
    expect(parsed.salt).toHaveLength(16);
    expect(parsed.key).toHaveLength(64);
  });

  it("doğru parolayı kabul eder, yanlışı reddeder", async () => {
    const hash = await hashPassword("Parola-12345", FAST);
    expect(await verifyPassword("Parola-12345", hash)).toBe(true);
    expect(await verifyPassword("parola-12345", hash)).toBe(false);
    expect(await verifyPassword("", hash)).toBe(false);
    expect(await verifyPassword("Parola-12345 ", hash)).toBe(false);
  });

  it("üretim varsayılanı N=2^15, r=8, p=3 ile üretir ve doğrular", async () => {
    expect(DEFAULT_SCRYPT_PARAMS).toEqual({ N: 32768, r: 8, p: 3 });
    const hash = await hashPassword("Parola-12345");
    expect(hash.startsWith("scrypt$32768$8$3$")).toBe(true);
    expect(await verifyPassword("Parola-12345", hash)).toBe(true);
    expect(await verifyPassword("yanlis-parola", hash)).toBe(false);
  });

  it("parametreler özetin içinde: farklı maliyetle üretilmiş eski özet hâlâ doğrulanır", async () => {
    const old = await hashPassword("Parola-12345", { N: 2048, r: 8, p: 2 });
    expect(await verifyPassword("Parola-12345", old)).toBe(true);
  });

  it("Unicode: aynı parolanın bileşik/ayrık biçimi eşleşir (NFKC)", async () => {
    const composed = "Şifre-é-12345"; // é tek karakter
    const decomposed = "Şifre-é-12345"; // e + birleştirici vurgu
    const hash = await hashPassword(composed, FAST);
    expect(await verifyPassword(decomposed, hash)).toBe(true);
  });

  it("bozuk ya da zararlı özet hata fırlatmadan false döner", async () => {
    for (const bad of [
      "",
      "plaintext",
      "scrypt$1024$8$1$abc",
      "bcrypt$10$abc$def$ghi$jkl",
      "scrypt$1000$8$1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", // N 2'nin kuvveti değil
      "scrypt$4294967296$8$1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", // sınırsız bellek
      "scrypt$1024$8$999$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      "scrypt$1024$8$1$$",
    ]) {
      expect(await verifyPassword("x", bad)).toBe(false);
    }
  });

  it("geçersiz parametrelerle üretmeyi reddeder", async () => {
    await expect(hashPassword("x", { N: 1000, r: 8, p: 1 })).rejects.toThrow();
    await expect(hashPassword("x", { N: 2 ** 21, r: 8, p: 1 })).rejects.toThrow();
  });
});
