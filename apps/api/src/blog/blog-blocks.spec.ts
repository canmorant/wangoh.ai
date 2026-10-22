import { describe, expect, it } from "vitest";
import { AppException } from "../common/errors.js";
import { MAX_ERROR_DETAILS } from "../common/validation.js";
import { assertValidBlocks, BLOCK_LIMITS, BLOCK_TYPES, hasForbiddenChars, isBlankText, isHttpsUrl, validateBlocks } from "./blog-blocks.js";

const cp = (code: number): string => String.fromCodePoint(code);

describe("isHttpsUrl", () => {
  it.each([
    "https://wangoh.com/og/japonya.jpg",
    "https://cdn.example.com:8443/a/b.png?x=1#y",
    "HTTPS://Example.com/a.png",
    "https://xn--bcher-kva.example/kapak.jpg",
  ])("kabul eder: %s", (url) => {
    expect(isHttpsUrl(url)).toBe(true);
  });

  it.each([
    "javascript:alert(1)",
    "JavaScript:alert(1)",
    "http://example.com/a.png",
    "data:image/png;base64,AAAA",
    "//example.com/a.png",
    "/og/a.jpg",
    "a.png",
    "ftp://example.com/a.png",
    "file:///etc/passwd",
    "blob:https://example.com/uuid",
    "https:example.com",
    "https:///example.com/a.png",
    "https://",
    "https://user@example.com/a.png",
    "https://user:parola@example.com/a.png",
    "https://example.com/a b.png",
    "https://example.com/\n",
    " https://example.com/a.png",
    "https://example.com/a.png ",
    "https://exa\x00mple.com/a.png",
    "https://example.com\\@evil.com/a.png",
    // Görünmez/yön belirleyici karakterler adresi olduğundan farklı gösterir.
    `https://example.com/a${cp(0x202e)}.png`,
    `https://example.com/b${cp(0x2066)}.png`,
    `https://example.com/c${cp(0x200b)}.png`,
    `https://example.com/d${cp(0x2060)}.png`,
    `https://example.com/e${cp(0x200f)}.png`,
    `https://example.com/f${cp(0xfe0f)}.png`,
    `https://exa${cp(0x00ad)}mple.com/g.png`,
    `https://example.com/${"a".repeat(BLOCK_LIMITS.url)}`,
    "",
  ])("reddeder: %j", (url) => {
    expect(isHttpsUrl(url)).toBe(false);
  });

  it("dizgi olmayan değerleri reddeder", () => {
    for (const value of [undefined, null, 1, {}, ["https://example.com"]]) expect(isHttpsUrl(value)).toBe(false);
  });
});

describe("isBlankText", () => {
  it("boşluk ve görünmez karakterlerden oluşan metin boştur (trim() bunların çoğunu kırpmaz)", () => {
    for (const code of [0x20, 0x09, 0x0a, 0xa0, 0x1680, 0x2003, 0x3000, 0x200b, 0x200c, 0x200d, 0x2060, 0x00ad, 0x034f, 0x180e, 0x3164, 0xffa0, 0xfe0f, 0x2800, 0xfeff, 0x202e, 0x2066]) {
      expect(isBlankText(cp(code)), `U+${code.toString(16)}`).toBe(true);
      expect(isBlankText(`${cp(code)} ${cp(code)}`), `U+${code.toString(16)} çifti`).toBe(true);
    }
    expect(isBlankText("")).toBe(true);
    expect(isBlankText(`${cp(0x200b)}${cp(0x2060)}${cp(0x3164)}${cp(0x2800)}`)).toBe(true);
  });

  it("görünür tek bir karakter bile varsa dolu; metnin içindeki ZWJ/ZWNJ ve emoji bozulmaz", () => {
    for (const text of ["a", "İstanbul", "0", ".", "👍", "👨‍👩‍👧", `a${cp(0x200b)}`, `${cp(0x200b)}a${cp(0x200b)}`, "می‌خواهم", "\u0301"]) {
      expect(isBlankText(text), JSON.stringify(text)).toBe(false);
    }
  });
});

describe("hasForbiddenChars", () => {
  it("kontrol karakterlerini, satır/paragraf ayırıcıları, yön belirleyicileri ve BOM'u reddeder", () => {
    for (const bad of ["a\x00b", "a\x1bb", "a\x7fb", "a\x85b", cp(0x2028), cp(0x2029), cp(0x202e), cp(0x2066), cp(0x200f), cp(0xfeff), "a\rb\x00"]) {
      expect(hasForbiddenChars(`x${bad}y`), JSON.stringify(bad)).toBe(true);
      expect(hasForbiddenChars(`x${bad}y`, true), `çok satırlı ${JSON.stringify(bad)}`).toBe(true);
    }
  });

  it("tek satırlıda satır sonu ve sekme de yasak, çok satırlıda serbest", () => {
    for (const ws of ["\n", "\r\n", "\t"]) {
      expect(hasForbiddenChars(`satır${ws}sonu`)).toBe(true);
      expect(hasForbiddenChars(`satır${ws}sonu`, true)).toBe(false);
    }
  });

  it("Türkçe harfler, emoji (ZWJ dizileri dahil) ve sıradan noktalama serbest", () => {
    for (const ok of ["Şişli'de çğüöıİ", "👨‍👩‍👧 aile", "Köln–Frankfurt: 8–10 gün", "日本語", "Tokyo Kyoto"]) {
      expect(hasForbiddenChars(ok), ok).toBe(false);
    }
  });
});

describe("validateBlocks", () => {
  const valid = [
    { type: "heading", level: 2, text: "Başlık" },
    { type: "heading", level: 3, text: "Alt başlık" },
    { type: "paragraph", text: "Birinci satır\nİkinci satır" },
    { type: "list", ordered: false, items: ["bir", "iki"] },
    { type: "list", ordered: true, items: ["tek"] },
    { type: "quote", text: "Alıntı" },
    { type: "quote", text: "Alıntı", cite: "Kaynak" },
    { type: "image", url: "https://wangoh.com/og/a.jpg", alt: "Açıklama" },
    { type: "image", url: "https://wangoh.com/og/a.jpg", alt: "Açıklama", caption: "Alt yazı" },
  ];

  it("her türden geçerli blok kabul edilir; boş dizi (taslak) de geçerli", () => {
    expect(validateBlocks(valid)).toEqual([]);
    expect(validateBlocks([])).toEqual([]);
    expect(BLOCK_TYPES.every((type) => valid.some((b) => b.type === type))).toBe(true);
  });

  const cases: Array<[string, unknown, string, string]> = [
    ["dizi değil", { type: "paragraph", text: "x" }, "body", "isArray"],
    ["null", null, "body", "isArray"],
    ["blok nesne değil", ["metin"], "body.0", "isObject"],
    ["blok null", [null], "body.0", "isObject"],
    ["blok dizi", [[]], "body.0", "isObject"],
    ["tür yok", [{ text: "x" }], "body.0.type", "isIn"],
    ["bilinmeyen tür", [{ type: "html", text: "<b>x</b>" }], "body.0.type", "isIn"],
    ["tür dizgi değil", [{ type: 1, text: "x" }], "body.0.type", "isIn"],
    ["tür büyük harfli", [{ type: "Paragraph", text: "x" }], "body.0.type", "isIn"],
    ["paragrafa fazladan anahtar", [{ type: "paragraph", text: "x", html: "<b>" }], "body.0.html", "whitelistValidation"],
    ["başlığa fazladan anahtar", [{ type: "heading", level: 2, text: "x", id: "a" }], "body.0.id", "whitelistValidation"],
    ["görsele fazladan anahtar", [{ type: "image", url: "https://a.co/x.png", alt: "a", onerror: "x" }], "body.0.onerror", "whitelistValidation"],
    ["__proto__ anahtarı", [JSON.parse('{"type":"paragraph","text":"x","__proto__":{"a":1}}')], "body.0.__proto__", "whitelistValidation"],
    ["başlık düzeyi 1", [{ type: "heading", level: 1, text: "x" }], "body.0.level", "isIn"],
    ["başlık düzeyi 4", [{ type: "heading", level: 4, text: "x" }], "body.0.level", "isIn"],
    ["başlık düzeyi dizgi", [{ type: "heading", level: "2", text: "x" }], "body.0.level", "isIn"],
    ["başlık düzeyi yok", [{ type: "heading", text: "x" }], "body.0.level", "isIn"],
    ["başlık boş", [{ type: "heading", level: 2, text: "" }], "body.0.text", "isNotEmpty"],
    ["başlık yalnız boşluk", [{ type: "heading", level: 2, text: "   " }], "body.0.text", "isNotEmpty"],
    ["başlık çok uzun", [{ type: "heading", level: 2, text: "a".repeat(BLOCK_LIMITS.heading + 1) }], "body.0.text", "maxLength"],
    ["başlıkta satır sonu", [{ type: "heading", level: 2, text: "a\nb" }], "body.0.text", "noControlChars"],
    ["paragraf metin değil", [{ type: "paragraph", text: 5 }], "body.0.text", "isString"],
    ["paragraf yok", [{ type: "paragraph" }], "body.0.text", "isString"],
    ["paragraf çok uzun", [{ type: "paragraph", text: "a".repeat(BLOCK_LIMITS.paragraph + 1) }], "body.0.text", "maxLength"],
    ["paragrafta NUL", [{ type: "paragraph", text: "a\x00b" }], "body.0.text", "noControlChars"],
    ["paragrafta ESC", [{ type: "paragraph", text: "a\x1b[31mb" }], "body.0.text", "noControlChars"],
    ["paragrafta yön geçersiz kılma", [{ type: "paragraph", text: `a${cp(0x202e)}b` }], "body.0.text", "noControlChars"],
    ["liste ordered yok", [{ type: "list", items: ["a"] }], "body.0.ordered", "isBoolean"],
    ["liste ordered dizgi", [{ type: "list", ordered: "true", items: ["a"] }], "body.0.ordered", "isBoolean"],
    ["liste boş", [{ type: "list", ordered: false, items: [] }], "body.0.items", "arrayNotEmpty"],
    ["liste dizi değil", [{ type: "list", ordered: false, items: "a" }], "body.0.items", "isArray"],
    ["liste çok madde", [{ type: "list", ordered: false, items: Array.from({ length: BLOCK_LIMITS.listItems + 1 }, () => "a") }], "body.0.items", "arrayMaxSize"],
    ["liste maddesi dizgi değil", [{ type: "list", ordered: false, items: ["a", 1] }], "body.0.items.1", "isString"],
    ["liste maddesi boş", [{ type: "list", ordered: false, items: [""] }], "body.0.items.0", "isNotEmpty"],
    ["liste maddesi uzun", [{ type: "list", ordered: false, items: ["a".repeat(BLOCK_LIMITS.listItem + 1)] }], "body.0.items.0", "maxLength"],
    ["liste maddesinde satır sonu", [{ type: "list", ordered: false, items: ["a\nb"] }], "body.0.items.0", "noControlChars"],
    ["alıntı metni yok", [{ type: "quote" }], "body.0.text", "isString"],
    ["alıntı çok uzun", [{ type: "quote", text: "a".repeat(BLOCK_LIMITS.quote + 1) }], "body.0.text", "maxLength"],
    ["alıntı kaynağı null", [{ type: "quote", text: "x", cite: null }], "body.0.cite", "isString"],
    ["alıntı kaynağı boş", [{ type: "quote", text: "x", cite: "" }], "body.0.cite", "isNotEmpty"],
    ["alıntı kaynağı uzun", [{ type: "quote", text: "x", cite: "a".repeat(BLOCK_LIMITS.cite + 1) }], "body.0.cite", "maxLength"],
    ["görsel javascript:", [{ type: "image", url: "javascript:alert(1)", alt: "a" }], "body.0.url", "isHttpsUrl"],
    ["görsel http:", [{ type: "image", url: "http://example.com/a.png", alt: "a" }], "body.0.url", "isHttpsUrl"],
    ["görsel data:", [{ type: "image", url: "data:image/svg+xml;base64,PHN2Zz4=", alt: "a" }], "body.0.url", "isHttpsUrl"],
    ["görsel göreli", [{ type: "image", url: "/a.png", alt: "a" }], "body.0.url", "isHttpsUrl"],
    ["görsel adresi dizgi değil", [{ type: "image", url: 5, alt: "a" }], "body.0.url", "isString"],
    ["görsel adresi çok uzun", [{ type: "image", url: `https://example.com/${"a".repeat(BLOCK_LIMITS.url)}`, alt: "a" }], "body.0.url", "maxLength"],
    ["görsel alt yok", [{ type: "image", url: "https://a.co/x.png" }], "body.0.alt", "isString"],
    ["görsel alt boş", [{ type: "image", url: "https://a.co/x.png", alt: "" }], "body.0.alt", "isNotEmpty"],
    ["görsel alt uzun", [{ type: "image", url: "https://a.co/x.png", alt: "a".repeat(BLOCK_LIMITS.alt + 1) }], "body.0.alt", "maxLength"],
    ["görsel alt yazı uzun", [{ type: "image", url: "https://a.co/x.png", alt: "a", caption: "a".repeat(BLOCK_LIMITS.caption + 1) }], "body.0.caption", "maxLength"],
    ["görsel alt yazı kontrol karakteri", [{ type: "image", url: "https://a.co/x.png", alt: "a", caption: "a\x07" }], "body.0.caption", "noControlChars"],
  ];

  it.each(cases)("%s reddedilir", (_name, body, field, code) => {
    const issues = validateBlocks(body);
    expect(issues, JSON.stringify(issues)).toEqual(expect.arrayContaining([expect.objectContaining({ field, code })]));
    for (const issue of issues) expect(issue.message).not.toBe("");
  });

  it("alan yolları verilen öneki taşır ve dizindeki bloğu gösterir", () => {
    const issues = validateBlocks([{ type: "paragraph", text: "iyi" }, { type: "image", url: "http://x.co/a.png", alt: "a" }], "translations.en.body");
    expect(issues).toEqual([{ field: "translations.en.body.1.url", code: "isHttpsUrl", message: expect.any(String) }]);
  });

  it("blok sayısı sınırı: tam sınır geçerli, bir fazlası reddedilir", () => {
    const block = { type: "paragraph", text: "x" };
    expect(validateBlocks(Array.from({ length: BLOCK_LIMITS.maxBlocks }, () => block))).toEqual([]);
    expect(validateBlocks(Array.from({ length: BLOCK_LIMITS.maxBlocks + 1 }, () => block))).toEqual([
      { field: "body", code: "arrayMaxSize", message: expect.any(String) },
    ]);
  });

  it("toplam metin sınırı: blok başına sınırlar geçerli olsa da toplam aşılırsa reddedilir", () => {
    const big = { type: "paragraph", text: "a".repeat(BLOCK_LIMITS.paragraph) };
    const fits = Array.from({ length: BLOCK_LIMITS.maxTotalChars / BLOCK_LIMITS.paragraph }, () => big);
    expect(validateBlocks(fits)).toEqual([]);
    expect(validateBlocks([...fits, { type: "paragraph", text: "b" }])).toEqual([{ field: "body", code: "maxTotalLength", message: expect.any(String) }]);
  });

  it("çok sayıda sorun olsa da en fazla MAX_ERROR_DETAILS kayıt döner", () => {
    const issues = validateBlocks(Array.from({ length: 200 }, () => ({ type: "nope" })));
    expect(issues).toHaveLength(MAX_ERROR_DETAILS);
  });

  it("bir bloktaki birden çok sorun birlikte raporlanır", () => {
    const issues = validateBlocks([{ type: "image", url: "http://x.co/a.png", alt: "", extra: 1 }]);
    expect(issues.map((i) => i.field).sort()).toEqual(["body.0.alt", "body.0.extra", "body.0.url"]);
  });

  it("assertValidBlocks geçersizde 400 VALIDATION_FAILED fırlatır, geçerlide dönmez", () => {
    expect(() => assertValidBlocks(valid, "translations.tr.body")).not.toThrow();
    try {
      assertValidBlocks([{ type: "html" }], "translations.tr.body");
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(AppException);
      const e = err as AppException;
      expect(e.getStatus()).toBe(400);
      expect(e.code).toBe("VALIDATION_FAILED");
      expect(e.details).toEqual([{ field: "translations.tr.body.0.type", code: "isIn", message: expect.any(String) }]);
    }
  });
});

describe("validateBlocks: görünmez karakterden oluşan metin boştur", () => {
  const invisible = [cp(0x200b), cp(0x2060), cp(0x00ad), cp(0x3164), cp(0x2800), cp(0x200c), cp(0xfe0f), cp(0x034f), cp(0x180e), `${cp(0x200b)} ${cp(0xa0)}`];

  it.each(invisible.map((v) => [`U+${v.codePointAt(0)!.toString(16)}`, v] as const))("%s: başlık, paragraf, liste maddesi, alıntı, kaynak, alt metin ve alt yazı reddedilir", (_name, v) => {
    const blocks = [
      { type: "heading", level: 2, text: v },
      { type: "paragraph", text: v },
      { type: "list", ordered: false, items: ["ok", v] },
      { type: "quote", text: v, cite: v },
      { type: "image", url: "https://wangoh.com/a.jpg", alt: v, caption: v },
    ];
    const issues = validateBlocks(blocks);
    expect(issues.map((i) => `${i.field}:${i.code}`)).toEqual([
      "body.0.text:isNotEmpty",
      "body.1.text:isNotEmpty",
      "body.2.items.1:isNotEmpty",
      "body.3.text:isNotEmpty",
      "body.3.cite:isNotEmpty",
      "body.4.alt:isNotEmpty",
      "body.4.caption:isNotEmpty",
    ]);
  });

  it("görünür metin ZWJ/ZWNJ ya da başka görünmez karakterle çevrili olsa da kabul edilir", () => {
    const blocks = [
      { type: "heading", level: 2, text: `${cp(0x200b)}Başlık` },
      { type: "paragraph", text: "👨‍👩‍👧 aile" },
      { type: "list", ordered: false, items: ["می‌خواهم"] },
    ];
    expect(validateBlocks(blocks)).toEqual([]);
  });
});

describe("validateBlocks: yansıyan alan yolu", () => {
  it("bilinmeyen anahtar adı 200 karaktere kırpılarak raporlanır", () => {
    const issues = validateBlocks([{ type: "paragraph", text: "x", ["k".repeat(5000)]: 1 }]);
    expect(issues).toHaveLength(1);
    expect(issues[0]!.field.length).toBe(200);
    expect(issues[0]!.code).toBe("whitelistValidation");
  });
});
