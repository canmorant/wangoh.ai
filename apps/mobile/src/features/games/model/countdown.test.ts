import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";

import {
  autoAdvanceDelay,
  countdownLabel,
  isUrgent,
  msToStartAt,
  nextRoundNotice,
  progressAt,
  remainingFraction,
  remainingSeconds,
  roundTimingOf,
  type ServerRoundClock,
} from "./countdown";
import { monotonicNow } from "./monotonic";

/** Sunucu duvar saati örneği; testlerde `serverNow` ve `deadlineAt` bunun etrafında kurulur. */
const SERVER = Date.parse("2026-03-01T12:00:00.000Z");
const iso = (ms: number) => new Date(ms).toISOString();

/** `serverNow` anında üretilmiş tur görünümü; `startOffset` = startedAt − serverNow. */
function view(startOffset: number, serverNow = SERVER, timeLimitMs = 20_000): ServerRoundClock {
  return {
    timeLimitMs,
    startedAt: iso(serverNow + startOffset),
    deadlineAt: iso(serverNow + startOffset + timeLimitMs),
    serverNow: iso(serverNow),
  };
}

describe("tur saati: sunucu saatinden hesap", () => {
  it("ilk tur / başlamış tur: msToStart 0, bitişe kalan deadlineAt − serverNow", () => {
    assert.deepEqual(roundTimingOf(view(0), 5000), { receivedAt: 5000, msToStart: 0, msToDeadline: 20_000 });
    // Sayaç 8 sn önce başlamış (geri yüklenen oturum): geriye 12 sn.
    assert.deepEqual(roundTimingOf(view(-8000), 5000), { receivedAt: 5000, msToStart: 0, msToDeadline: 12_000 });
  });

  it("cevap yanıtındaki sonraki tur: startedAt − serverNow ≈ pay (çoktan seçmeli 2 sn, harita 5 sn)", () => {
    assert.deepEqual(roundTimingOf(view(2000), 0), { receivedAt: 0, msToStart: 2000, msToDeadline: 22_000 });
    assert.deepEqual(roundTimingOf(view(5000), 0), { receivedAt: 0, msToStart: 5000, msToDeadline: 25_000 });
  });

  it("süresi geçmiş tur: bitişe kalan negatif, başlamaya kalan 0", () => {
    const timing = roundTimingOf(view(-30_000), 0);
    assert.equal(timing.msToStart, 0);
    assert.equal(timing.msToDeadline, -10_000);
    assert.equal(progressAt(timing, 20_000, 0).expired, true);
  });

  it("bozuk sunucu saati ya da bitiş: tam süre, hemen başlamış sayılır", () => {
    const base = view(0);
    assert.deepEqual(roundTimingOf({ ...base, serverNow: "tarih-degil" }, 7), { receivedAt: 7, msToStart: 0, msToDeadline: 20_000 });
    assert.deepEqual(roundTimingOf({ ...base, deadlineAt: "" }, 7), { receivedAt: 7, msToStart: 0, msToDeadline: 20_000 });
    // startedAt bozuksa pay yok sayılır, bitiş serverNow'a göre.
    assert.deepEqual(roundTimingOf({ ...base, startedAt: "x" }, 7), { receivedAt: 7, msToStart: 0, msToDeadline: 20_000 });
  });

  it("bozuk bitiş göstergeyi sonsuza uzatmaz: bitiş startedAt + süreden ileri olamaz", () => {
    const timing = roundTimingOf({ ...view(2000), deadlineAt: "2999-01-01T00:00:00Z" }, 0);
    assert.equal(timing.msToStart, 2000);
    assert.equal(timing.msToDeadline, 22_000);
  });

  it("negatif tur süresi 0 sayılır", () => {
    assert.equal(roundTimingOf({ ...view(0), timeLimitMs: -5, deadlineAt: "bozuk" }, 0).msToDeadline, 0);
  });
});

describe("tur durumu: monotonik zamanla ilerleme", () => {
  it("başlamadan önce çubuk %100'de bekler, tam süre görünür", () => {
    const timing = roundTimingOf(view(2000), 10_000);
    for (const elapsed of [0, 500, 1999]) {
      const p = progressAt(timing, 20_000, 10_000 + elapsed);
      assert.equal(p.waiting, true);
      assert.equal(p.remainingMs, 20_000, `geçen ${elapsed} ms`);
      assert.equal(p.fraction, 1);
      assert.equal(p.expired, false);
    }
    assert.equal(progressAt(timing, 20_000, 10_000).msToStart, 2000);
    assert.equal(progressAt(timing, 20_000, 11_250).msToStart, 750);
  });

  it("başlayınca kalan süre deadlineAt'e göre azalır (başlama anı = 20 sn, sonra düşer)", () => {
    const timing = roundTimingOf(view(2000), 10_000);
    const atStart = progressAt(timing, 20_000, 12_000);
    assert.equal(atStart.waiting, false);
    assert.equal(atStart.msToStart, 0);
    assert.equal(atStart.remainingMs, 20_000);
    const later = progressAt(timing, 20_000, 12_000 + 5000);
    assert.equal(later.remainingMs, 15_000);
    assert.equal(later.fraction, 0.75);
    const end = progressAt(timing, 20_000, 12_000 + 20_000);
    assert.equal(end.remainingMs, 0);
    assert.equal(end.fraction, 0);
    assert.equal(end.expired, true);
  });

  it("geri bildirimde 3-4 sn beklenince çubuk gerçekten daha az süre gösterir (pay 2 sn)", () => {
    const timing = roundTimingOf(view(2000), 0);
    assert.equal(progressAt(timing, 20_000, 3500).remainingMs, 18_500);
    assert.equal(remainingSeconds(progressAt(timing, 20_000, 3500).remainingMs), 19);
    assert.equal(progressAt(timing, 20_000, 4000).remainingMs, 18_000);
  });

  it("geri yüklenen turda kalan süre: yanıttan sonra geçen süre düşülür", () => {
    // 8 sn önce başlamış tur, geri yükleme yanıtı alındı; 3 sn sonra 9 sn kalmalı.
    const timing = roundTimingOf(view(-8000), 100);
    assert.equal(progressAt(timing, 20_000, 100).remainingMs, 12_000);
    assert.equal(progressAt(timing, 20_000, 3100).remainingMs, 9000);
  });

  it("kıskaçlama: kalan süre 0..süre, oran 0..1; `now` receivedAt'ten önceyse geçen 0 sayılır", () => {
    const timing = roundTimingOf(view(0), 1000);
    const before = progressAt(timing, 20_000, 400);
    assert.equal(before.remainingMs, 20_000);
    assert.equal(before.fraction, 1);
    const after = progressAt(timing, 20_000, 1_000_000);
    assert.equal(after.remainingMs, 0);
    assert.equal(after.fraction, 0);
    assert.equal(after.msToStart, 0);
    assert.equal(progressAt(timing, 0, 1000).fraction, 0);
  });

  it("bitişten sonra expired kalır (yeniden artmaz)", () => {
    const timing = roundTimingOf(view(0), 0);
    assert.equal(progressAt(timing, 20_000, 19_999).expired, false);
    assert.equal(progressAt(timing, 20_000, 20_000).expired, true);
    assert.equal(progressAt(timing, 20_000, 99_000).expired, true);
  });
});

describe("saat sapması: aygıt saati kayık olsa da sonuç değişmez", () => {
  it("yanıt serverNow'ı aygıt saatinden 10 dk farklı olsa da kalan süre aynıdır", () => {
    const aligned = view(2000, SERVER);
    const skewedAhead = view(2000, SERVER + 10 * 60_000);
    const skewedBehind = view(2000, SERVER - 10 * 60_000);
    // Aygıt saati (duvar) SERVER'a göre +10 dk kaymış gibi davran: Date.now herkese yanlış değer versin.
    const wall = mock.method(Date, "now", () => SERVER + 10 * 60_000);
    try {
      const results = [aligned, skewedAhead, skewedBehind].map((v) => {
        const timing = roundTimingOf(v, 50_000);
        return [3000, 4000, 12_000, 30_000].map((elapsed) => progressAt(timing, 20_000, 50_000 + elapsed));
      });
      assert.deepEqual(results[1], results[0]);
      assert.deepEqual(results[2], results[0]);
      assert.equal(wall.mock.callCount(), 0, "hesap Date.now'a hiç bakmamalı");
      // Somut değerler: 3 sn sonra pay bitmiş (2 sn), 1 sn sayaç işlemiş.
      assert.equal(results[0][0]?.remainingMs, 19_000);
      assert.equal(results[0][2]?.remainingMs, 10_000);
      assert.equal(results[0][3]?.expired, true);
    } finally {
      wall.mock.restore();
    }
  });

  it("monotonicNow aygıt saatinden bağımsızdır ve geri gitmez", () => {
    const wall = mock.method(Date, "now", () => 0);
    try {
      const a = monotonicNow();
      const b = monotonicNow();
      assert.equal(typeof a, "number");
      assert.ok(b >= a);
    } finally {
      wall.mock.restore();
    }
  });
});

describe("otomatik ilerleme payı", () => {
  it("istenen gecikme sonraki turun başlamasına kalan süreyi aşmaz", () => {
    const timing = roundTimingOf(view(2000), 1000);
    assert.equal(autoAdvanceDelay(2400, timing, 1000), 2000);
    assert.equal(autoAdvanceDelay(1400, timing, 1000), 1400);
    // Efekt biraz geç çalıştıysa kalan pay düşer.
    assert.equal(autoAdvanceDelay(2000, timing, 1500), 1500);
    assert.equal(autoAdvanceDelay(2000, timing, 9000), 0);
  });

  it("pay yoksa (son tur ya da pay 0) istenen süre aynen döner", () => {
    assert.equal(autoAdvanceDelay(1400, null, 0), 1400);
    assert.equal(autoAdvanceDelay(1400, roundTimingOf(view(0), 0), 0), 1400);
    assert.equal(autoAdvanceDelay(-5, null, 0), 0);
  });

  it("harita payı (5 sn) çoktan seçmeli otomatik ilerlemeyi etkilemez; msToStartAt kalanı verir", () => {
    const timing = roundTimingOf(view(5000), 0);
    assert.equal(msToStartAt(timing, 0), 5000);
    assert.equal(msToStartAt(timing, 3200), 1800);
    assert.equal(msToStartAt(timing, 9999), 0);
    assert.equal(autoAdvanceDelay(2000, timing, 0), 2000);
  });
});

describe("gösterge yardımcıları", () => {
  it("kalan süre negatif olmaz; saniye yukarı yuvarlanır", () => {
    assert.equal(remainingSeconds(-5), 0);
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

  it("ekran okuyucu etiketi: başlamışsa kalan süre, başlamadıysa kaç sn sonra başlayacağı", () => {
    assert.equal(countdownLabel(12_300), "Kalan süre 13 saniye");
    assert.equal(countdownLabel(20_000, 1200), "Tur 2 saniye sonra başlıyor. Süre 20 saniye");
  });

  it("harita geri bildirimi: payda 'başlıyor', sonra 'Süre işliyor' ve kalan süre", () => {
    const timing = roundTimingOf(view(5000), 0);
    assert.equal(nextRoundNotice(progressAt(timing, 20_000, 0)), "Sonraki tur 5 sn içinde başlıyor");
    assert.equal(nextRoundNotice(progressAt(timing, 20_000, 1500)), "Sonraki tur 4 sn içinde başlıyor");
    assert.equal(nextRoundNotice(progressAt(timing, 20_000, 4999)), "Sonraki tur 1 sn içinde başlıyor");
    assert.equal(nextRoundNotice(progressAt(timing, 20_000, 5000)), "Süre işliyor: 20 sn kaldı");
    assert.equal(nextRoundNotice(progressAt(timing, 20_000, 12_000)), "Süre işliyor: 13 sn kaldı");
  });
});
