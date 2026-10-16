import { plainToInstance } from "class-transformer";
import { ValidationError, validate } from "class-validator";
import { describe, expect, it } from "vitest";
import { AppException, ErrorCode, isUniqueViolation } from "./errors.js";
import { escapeLike } from "./like.js";
import { pageWindow, toPage } from "./pagination.js";
import { LangQueryDto, resolveTranslation } from "./lang.js";
import { flattenValidationErrors, MAX_ERROR_DETAILS } from "./validation.js";
import { operationIdFactory, sortKeysDeep } from "../openapi/document.js";
import { summarizeError } from "./filters/all-exceptions.filter.js";

describe("escapeLike", () => {
  it("%, _ ve \\ karakterlerini kaçırır", () => {
    expect(escapeLike("100%")).toBe("100\\%");
    expect(escapeLike("a_b")).toBe("a\\_b");
    expect(escapeLike("a\\b")).toBe("a\\\\b");
    expect(escapeLike("%_\\")).toBe("\\%\\_\\\\");
    expect(escapeLike("normal")).toBe("normal");
  });
});

describe("sayfalama", () => {
  it("pencere ve zarf", () => {
    expect(pageWindow({ page: 1, pageSize: 20 })).toEqual({ limit: 20, offset: 0 });
    expect(pageWindow({ page: 3, pageSize: 25 })).toEqual({ limit: 25, offset: 50 });
    expect(toPage(["a"], 41, { page: 2, pageSize: 20 })).toEqual({ items: ["a"], page: 2, pageSize: 20, total: 41 });
  });
});

describe("resolveTranslation", () => {
  const tr = { name: "Fransa" };
  const en = { name: "France" };
  it("Türkçe istenirse her zaman tam", () => {
    expect(resolveTranslation({ tr, en }, ["en"], "tr")).toEqual({ lang: "tr", complete: true, value: tr });
  });
  it("istenen dil mevcut ve tam ise onu verir", () => {
    expect(resolveTranslation({ tr, en }, ["en"], "en")).toEqual({ lang: "en", complete: true, value: en });
  });
  it("çeviri yoksa Türkçeye düşer ve complete=false", () => {
    expect(resolveTranslation({ tr }, [], "es")).toEqual({ lang: "tr", complete: false, value: tr });
  });
  it("çeviri var ama complete_langs içinde değilse Türkçeye düşer", () => {
    expect(resolveTranslation({ tr, en }, ["es"], "en")).toEqual({ lang: "tr", complete: false, value: tr });
  });
  it("completeLangs verilmezse (blog) yalnız varlığa bakılır", () => {
    expect(resolveTranslation({ tr, en }, undefined, "en").lang).toBe("en");
    expect(resolveTranslation({ tr }, undefined, "en")).toEqual({ lang: "tr", complete: false, value: tr });
  });
});

describe("LangQueryDto", () => {
  const check = async (plain: object) => validate(plainToInstance(LangQueryDto, plain));
  it("tr|en|es kabul edilir, varsayılan tr, diğerleri reddedilir", async () => {
    expect(plainToInstance(LangQueryDto, {}).lang).toBe("tr");
    for (const lang of ["tr", "en", "es"]) expect(await check({ lang })).toHaveLength(0);
    for (const lang of ["de", "TR", "", "tr,en", 1]) expect((await check({ lang })).length, String(lang)).toBeGreaterThan(0);
  });
});

describe("doğrulama ayrıntıları", () => {
  it("iç içe hataları noktalı yolla, Türkçe düzleştirir", () => {
    const child = Object.assign(new ValidationError(), { property: "text", constraints: { maxLength: "x" } });
    const item = Object.assign(new ValidationError(), { property: "0", children: [child] });
    const root = Object.assign(new ValidationError(), { property: "items", children: [item] });
    const email = Object.assign(new ValidationError(), { property: "email", constraints: { isEmail: "email must be an email", madeUp: "x" } });
    expect(flattenValidationErrors([email, root])).toEqual([
      { field: "email", code: "isEmail", message: "Geçerli bir e-posta adresi girin." },
      { field: "email", code: "madeUp", message: "Değer geçersiz." },
      { field: "items.0.text", code: "maxLength", message: "Çok uzun." },
    ]);
  });
});

describe("doğrulama ayrıntı sınırı", () => {
  const unknownKeys = (n: number) =>
    Array.from({ length: n }, (_, i) => Object.assign(new ValidationError(), { property: `k${i}`, constraints: { whitelistValidation: "x" } }));

  it("varsayılan olarak en fazla 50 kayıt döner ve ağacı fazla gezmez", () => {
    expect(flattenValidationErrors(unknownKeys(9_500))).toHaveLength(MAX_ERROR_DETAILS);
    expect(flattenValidationErrors(unknownKeys(49))).toHaveLength(49);
    expect(flattenValidationErrors(unknownKeys(51), "", 10)).toHaveLength(10);
  });

  it("iç içe hatalar ve çoklu kısıtlar da aynı sınıra tabidir; ilk kayıtlar korunur", () => {
    const many = Array.from({ length: 80 }, (_, i) =>
      Object.assign(new ValidationError(), { property: `a${i}`, constraints: { isString: "x", maxLength: "y" } }),
    );
    const root = Object.assign(new ValidationError(), { property: "items", children: many });
    const out = flattenValidationErrors([root], "", 5);
    expect(out.map((d) => `${d.field}:${d.code}`)).toEqual(["items.a0:isString", "items.a0:maxLength", "items.a1:isString", "items.a1:maxLength", "items.a2:isString"]);
  });
});

describe("hata yardımcıları", () => {
  it("AppException gövdeyi taşır", () => {
    const e = AppException.conflict("Çakıştı", ErrorCode.AUTH_EMAIL_TAKEN);
    expect(e.getStatus()).toBe(409);
    expect(e.getResponse()).toEqual({ statusCode: 409, code: "AUTH_EMAIL_TAKEN", message: "Çakıştı" });
  });

  it("isUniqueViolation: cause zincirinde 23505 arar", () => {
    const pg = Object.assign(new Error("duplicate key value violates unique constraint \"users_email_lower_idx\""), { code: "23505", constraint: "users_email_lower_idx" });
    const wrapped = Object.assign(new Error("Failed query"), { cause: pg });
    expect(isUniqueViolation(wrapped)).toBe(true);
    expect(isUniqueViolation(wrapped, "users_email_lower_idx")).toBe(true);
    expect(isUniqueViolation(wrapped, "baska_dizin")).toBe(false);
    expect(isUniqueViolation(new Error("x"))).toBe(false);
    expect(isUniqueViolation(null)).toBe(false);
    expect(isUniqueViolation(Object.assign(new Error("x"), { code: "23503" }))).toBe(false);
  });
});

describe("OpenAPI yardımcıları", () => {
  it("operationId = denetleyici (sonek siz, küçük harf) + metot (baş harf büyük)", () => {
    expect(operationIdFactory("AuthController", "login")).toBe("authLogin");
    expect(operationIdFactory("UsersController", "list")).toBe("usersList");
    expect(operationIdFactory("ContentController", "listCountries")).toBe("contentListCountries");
  });

  it("sortKeysDeep anahtarları sıralar, dizi sırasını korur", () => {
    const sorted = sortKeysDeep({ b: 1, a: { d: [3, 1, { z: 1, y: 2 }], c: null } });
    expect(JSON.stringify(sorted)).toBe('{"a":{"c":null,"d":[3,1,{"y":2,"z":1}]},"b":1}');
  });
});

describe("summarizeError (günlükte sızıntı yok)", () => {
  it("Drizzle sorgu hatasında SQL parametreleri günlüğe girmez", () => {
    const pg = Object.assign(new Error('duplicate key value violates unique constraint "users_email_lower_idx"'), { code: "23505" });
    const drizzleLike = Object.assign(new Error("Failed query: insert into users (email, password_hash) values ($1, $2)\nparams: ayse@example.com,scrypt$32768$8$3$salt$hash"), {
      name: "DrizzleQueryError",
      cause: pg,
    });
    const summary = summarizeError(drizzleLike, true);
    expect(summary).toContain("duplicate key value violates unique constraint");
    expect(summary).not.toContain("ayse@example.com");
    expect(summary).not.toContain("scrypt$");
    expect(summary).not.toContain("params:");
    expect(summary).toMatch(/at /);
  });

  it("sıradan hatada ilk satır ve yığın çerçeveleri; mesajın devamı atılır", () => {
    const err = new Error("ilk satır\nikinci satır gizli=hunter2");
    const summary = summarizeError(err, true);
    expect(summary.startsWith("Error: ilk satır")).toBe(true);
    expect(summary).not.toContain("hunter2");
    expect(summarizeError(err, false)).toBe("Error: ilk satır");
    expect(summarizeError("metin", true)).toBe("bilinmeyen hata");
  });
});
