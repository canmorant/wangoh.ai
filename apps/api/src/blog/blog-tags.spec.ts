import { describe, expect, it } from "vitest";
import { normalizeTag } from "./blog-tags.js";

describe("normalizeTag", () => {
  it("Türkçe büyük İ/I yerel ayarsız küçük harfe çevrilir ve birleşik nokta üretmez", () => {
    expect(normalizeTag("İstanbul")).toBe("istanbul");
    expect(normalizeTag("İZMİR")).toBe("izmir");
    expect(normalizeTag("IĞDIR")).toBe("iğdir");
    // Yerel ayarsız `toLowerCase()` "i" + U+0307 üretirdi.
    expect(normalizeTag("İstanbul")).not.toContain("̇");
    expect(normalizeTag("İ").length).toBe(1);
  });

  it("noktasız ı olduğu gibi kalır; İngilizce büyük I Türkçe kuralıyla ı olmaz", () => {
    expect(normalizeTag("ışık")).toBe("ışık");
    expect(normalizeTag("IT")).toBe("it");
    expect(normalizeTag("ITALY")).toBe("italy");
  });

  it("Unicode NFC: birleşik ve ayrık biçim aynı etikettir", () => {
    const nfc = "ün";
    const nfd = "ün";
    expect(nfd).not.toBe(nfc);
    expect(normalizeTag(nfd)).toBe(nfc);
    expect(normalizeTag(nfc)).toBe(nfc);
    expect(normalizeTag("ÜN")).toBe(nfc);
    expect(normalizeTag("ÜN")).toBe(nfc);
  });

  it("kırpar, küçük harfe çevirir; zaten normal olan etiketi değiştirmez (idempotent)", () => {
    expect(normalizeTag("  Asia ")).toBe("asia");
    expect(normalizeTag("ÜLKE-REHBERİ")).toBe("ülke-rehberi");
    for (const tag of ["ülke-rehberi", "asia", "europe", "istanbul", "iğdir", "ün"]) expect(normalizeTag(tag)).toBe(tag);
    expect(normalizeTag(normalizeTag("İstanbul"))).toBe("istanbul");
  });
});
