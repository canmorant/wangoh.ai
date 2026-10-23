import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  countdownLabel,
  deadlineForFreshRound,
  deadlineForRestoredRound,
  isExpired,
  isUrgent,
  remainingFraction,
  remainingMs,
  remainingSeconds,
} from "./countdown";

describe("geri sayım göstergesi", () => {
  it("yeni tur: bitiş yanıtın ulaştığı andan tur süresi kadar sonradır", () => {
    assert.equal(deadlineForFreshRound(1000, 20_000), 21_000);
    assert.equal(deadlineForFreshRound(1000, -5), 1000);
  });

  it("geri yüklenen tur: deadlineAt'tan hesaplanır", () => {
    const now = Date.parse("2026-01-01T00:00:10.000Z");
    const round = { timeLimitMs: 20_000, deadlineAt: "2026-01-01T00:00:25.000Z" };
    assert.equal(deadlineForRestoredRound(round, now), Date.parse(round.deadlineAt));
    assert.equal(remainingMs(deadlineForRestoredRound(round, now), now), 15_000);
  });

  it("geri yüklenen tur: geçmiş bitiş 0 kalan süre verir (cevap yine de sunucuda karara bağlanır)", () => {
    const now = Date.parse("2026-01-01T00:01:00.000Z");
    const round = { timeLimitMs: 20_000, deadlineAt: "2026-01-01T00:00:20.000Z" };
    assert.equal(remainingMs(deadlineForRestoredRound(round, now), now), 0);
    assert.equal(isExpired(deadlineForRestoredRound(round, now), now), true);
  });

  it("geri yüklenen tur: aygıt saati geride kalsa da gösterge tur süresini aşmaz; bozuk tarih tam süre verir", () => {
    const now = 1_000;
    assert.equal(deadlineForRestoredRound({ timeLimitMs: 20_000, deadlineAt: "2999-01-01T00:00:00Z" }, now), now + 20_000);
    assert.equal(deadlineForRestoredRound({ timeLimitMs: 20_000, deadlineAt: "tarih-degil" }, now), now + 20_000);
  });

  it("kalan süre negatif olmaz; saniye yukarı yuvarlanır", () => {
    assert.equal(remainingMs(5000, 9000), 0);
    assert.equal(remainingSeconds(0), 0);
    assert.equal(remainingSeconds(1), 1);
    assert.equal(remainingSeconds(1000), 1);
    assert.equal(remainingSeconds(1001), 2);
    assert.equal(remainingSeconds(19_999), 20);
  });

  it("çubuk oranı 0..1 arasında kalır", () => {
    assert.equal(remainingFraction(10_000, 20_000), 0.5);
    assert.equal(remainingFraction(30_000, 20_000), 1);
    assert.equal(remainingFraction(-5, 20_000), 0);
    assert.equal(remainingFraction(5, 0), 0);
  });

  it("son 5 saniye acil sayılır; 0 ve fazlası değil", () => {
    assert.equal(isUrgent(5000), true);
    assert.equal(isUrgent(5001), false);
    assert.equal(isUrgent(0), false);
  });

  it("ekran okuyucu etiketi", () => {
    assert.equal(countdownLabel(12_300), "Kalan süre 13 saniye");
  });
});
