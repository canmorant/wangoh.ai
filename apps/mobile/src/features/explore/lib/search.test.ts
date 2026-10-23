import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { MAX_SEARCH_LENGTH, isSearchable, normalizeSearchQuery } from "./search";

describe("normalizeSearchQuery", () => {
  it("kenar ve iç boşlukları düzeltir", () => {
    assert.equal(normalizeSearchQuery("   türk  "), "türk");
    assert.equal(normalizeSearchQuery("güney \t  kore\n"), "güney kore");
  });

  it("harf büyüklüğünü ve Türkçe harfleri değiştirmez (API katlar)", () => {
    assert.equal(normalizeSearchQuery("TÜRK"), "TÜRK");
    assert.equal(normalizeSearchQuery("Isparta ıİ"), "Isparta ıİ");
  });

  it("100 karakterle sınırlar", () => {
    const long = "a".repeat(250);
    assert.equal(normalizeSearchQuery(long).length, MAX_SEARCH_LENGTH);
  });

  it("yalnız boşluktan oluşan girdiyi boş yapar", () => {
    assert.equal(normalizeSearchQuery("   \n\t "), "");
  });
});

describe("isSearchable", () => {
  it("iki karakterden kısa sorguyu geçirmez", () => {
    assert.equal(isSearchable(""), false);
    assert.equal(isSearchable("a"), false);
    assert.equal(isSearchable("ab"), true);
    assert.equal(isSearchable("İ"), false);
  });
});
