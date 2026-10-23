import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  formatAverage,
  formatCorrect,
  formatDate,
  formatDateTime,
  formatDuration,
  formatInteger,
  formatLastPlayed,
  formatScore,
  gameTypeLabel,
  hasMoreItems,
  initialOf,
  roleLabel,
} from "./format";

/** Yerel saat diliminde sabit an: testler TZ'den bağımsız kalır. */
const localIso = (year: number, month: number, day: number, hour = 12, minute = 0) => new Date(year, month - 1, day, hour, minute).toISOString();

describe("oyun türü ve rol etiketleri", () => {
  it("bilinen türleri Türkçe adlandırır", () => {
    assert.equal(gameTypeLabel("flag-quiz"), "Bayrağı Bil");
    assert.equal(gameTypeLabel("capital-quiz"), "Başkenti Bil");
    assert.equal(gameTypeLabel("map-guess"), "Haritada Bul");
  });

  it("bilinmeyen tür ham adıyla görünür", () => {
    assert.equal(gameTypeLabel("yeni-oyun"), "yeni-oyun");
  });

  it("rol etiketi", () => {
    assert.equal(roleLabel("admin"), "Yönetici");
    assert.equal(roleLabel("user"), "Üye");
    assert.equal(roleLabel("bilinmeyen"), "Üye");
  });
});

describe("sayı biçimleri", () => {
  it("binlik ayraç Türkçe nokta", () => {
    assert.equal(formatInteger(0), "0");
    assert.equal(formatInteger(999), "999");
    assert.equal(formatInteger(1850), "1.850");
    assert.equal(formatInteger(1234567), "1.234.567");
    assert.equal(formatInteger(-4200), "-4.200");
    assert.equal(formatInteger(Number.NaN), "—");
  });

  it("ortalama en çok bir ondalık ve virgül", () => {
    assert.equal(formatAverage(812.5), "812,5");
    assert.equal(formatAverage(1000), "1.000");
    assert.equal(formatAverage(1234.56), "1.234,6");
    assert.equal(formatAverage(0), "0");
    assert.equal(formatAverage(null), "—");
    assert.equal(formatAverage(undefined), "—");
  });

  it("boş olabilen puan", () => {
    assert.equal(formatScore(null), "—");
    assert.equal(formatScore(1850), "1.850");
    assert.equal(formatScore(0), "0");
  });

  it("doğru sayısı", () => {
    assert.equal(formatCorrect(7, 10), "7/10 doğru");
  });

  it("daha fazla göster koşulu", () => {
    assert.equal(hasMoreItems(1, 10, 10), false);
    assert.equal(hasMoreItems(1, 10, 11), true);
    assert.equal(hasMoreItems(2, 10, 20), false);
    assert.equal(hasMoreItems(2, 10, 21), true);
    assert.equal(hasMoreItems(1, 10, 0), false);
  });
});

describe("süre", () => {
  it("saniye, dakika ve saat", () => {
    assert.equal(formatDuration(0), "0 sn");
    assert.equal(formatDuration(42_400), "42 sn");
    assert.equal(formatDuration(59_600), "1 dk");
    assert.equal(formatDuration(60_000), "1 dk");
    assert.equal(formatDuration(125_000), "2 dk 5 sn");
    assert.equal(formatDuration(3_600_000), "1 sa");
    assert.equal(formatDuration(3_720_000), "1 sa 2 dk");
  });

  it("geçersiz süre", () => {
    assert.equal(formatDuration(-1), "—");
    assert.equal(formatDuration(Number.NaN), "—");
  });
});

describe("tarih", () => {
  it("Türkçe ay adıyla yazar", () => {
    assert.equal(formatDate(localIso(2026, 3, 5)), "5 Mart 2026");
    assert.equal(formatDate(localIso(2026, 12, 31)), "31 Aralık 2026");
    assert.equal(formatDate(localIso(2026, 8, 9)), "9 Ağustos 2026");
  });

  it("saatle birlikte", () => {
    assert.equal(formatDateTime(localIso(2026, 3, 5, 14, 7)), "5 Mart 2026, 14:07");
    assert.equal(formatDateTime(localIso(2026, 1, 2, 0, 5)), "2 Ocak 2026, 00:05");
  });

  it("geçersiz ya da boş tarih", () => {
    assert.equal(formatDate("bozuk"), "—");
    assert.equal(formatDate(null), "—");
    assert.equal(formatDateTime(undefined), "—");
  });

  it("son oynama: yoksa açık ifade", () => {
    assert.equal(formatLastPlayed(null), "Hiç oynanmadı");
    assert.equal(formatLastPlayed(localIso(2026, 3, 5)), "5 Mart 2026");
  });
});

describe("avatar harfi", () => {
  it("ilk harf büyük yazılır", () => {
    assert.equal(initialOf("ayşe"), "A");
    assert.equal(initialOf("  can"), "C");
  });

  it("Türkçe i/ı kuralı", () => {
    assert.equal(initialOf("ipek"), "İ");
    assert.equal(initialOf("ılgaz"), "I");
  });

  it("boş ad ve emoji", () => {
    assert.equal(initialOf(""), "?");
    assert.equal(initialOf("   "), "?");
    assert.equal(initialOf("😀 gezgin"), "😀");
  });
});
