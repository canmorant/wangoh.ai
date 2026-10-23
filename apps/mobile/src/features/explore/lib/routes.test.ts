import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  cityPath,
  continentPath,
  countryPath,
  parseCitySlug,
  parseContinentSlug,
  parseCountryCode,
  searchPath,
} from "./routes";

describe("rota parçası ayrıştırma", () => {
  it("kıta slug'ını yalnız bilinen beş değerle kabul eder", () => {
    assert.equal(parseContinentSlug("europe"), "europe");
    assert.equal(parseContinentSlug(" Asia "), "asia");
    assert.equal(parseContinentSlug("atlantis"), null);
    assert.equal(parseContinentSlug(""), null);
    assert.equal(parseContinentSlug(undefined), null);
    assert.equal(parseContinentSlug(["oceania", "x"]), "oceania");
  });

  it("ülke kodunu büyük harfe çevirir, iki harf dışını reddeder", () => {
    assert.equal(parseCountryCode("jp"), "JP");
    assert.equal(parseCountryCode("TR"), "TR");
    assert.equal(parseCountryCode(" fr "), "FR");
    assert.equal(parseCountryCode("JPN"), null);
    assert.equal(parseCountryCode("J"), null);
    assert.equal(parseCountryCode("1A"), null);
    assert.equal(parseCountryCode("../"), null);
    assert.equal(parseCountryCode(undefined), null);
    assert.equal(parseCountryCode(["de"]), "DE");
  });

  it("şehir slug'ını küçük harfe çevirir, biçimi bozuk olanı reddeder", () => {
    assert.equal(parseCitySlug("tokyo"), "tokyo");
    assert.equal(parseCitySlug("New-York"), "new-york");
    assert.equal(parseCitySlug("sao-paulo-2"), "sao-paulo-2");
    assert.equal(parseCitySlug("a b"), null);
    assert.equal(parseCitySlug("--x"), null);
    assert.equal(parseCitySlug("x/y"), null);
    assert.equal(parseCitySlug("ş"), null);
    assert.equal(parseCitySlug(""), null);
    assert.equal(parseCitySlug("a".repeat(81)), null);
  });
});

describe("rota yolları", () => {
  it("kararlı adresler üretir (diğer sekmelerin kullandığı /country/XX dahil)", () => {
    assert.equal(continentPath("europe"), "/continent/europe");
    assert.equal(countryPath("jp"), "/country/JP");
    assert.equal(cityPath("jp", "tokyo"), "/country/JP/city/tokyo");
  });

  it("arama adresinde sorguyu kodlar; boşsa sorgu eklemez", () => {
    assert.equal(searchPath(), "/search");
    assert.equal(searchPath("  "), "/search");
    assert.equal(searchPath("türk"), "/search?q=t%C3%BCrk");
    assert.equal(searchPath("a&b=c"), "/search?q=a%26b%3Dc");
  });
});
