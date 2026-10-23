import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { AnswerResponseDto } from "@wangoh/api-client";

import { emptyLeaderboardMessage, entryLabel, feedbackCopy, outcomeLabel, pointsLabel, rankSummary } from "./feedbackCopy";
import {
  firstParam,
  formatDuration,
  formatNumber,
  gameKindOf,
  isLeaderboardPeriod,
  isLeaderboardType,
  isPlayableGameType,
} from "./gameTypes";

function result(extra: Partial<AnswerResponseDto> = {}): AnswerResponseDto {
  return {
    correct: true,
    correctAnswer: { code: "TR", label: "Türkiye", lat: null, lng: null },
    distanceKm: null,
    nextRound: null,
    points: 140,
    score: 140,
    speedBonus: 40,
    streak: 1,
    streakBonus: 0,
    timedOut: false,
    ...extra,
  };
}

describe("geri bildirim metni", () => {
  it("doğru cevap: sunucunun puanı ve bonusları; seri yalnız 2 ve üstünde", () => {
    const copy = feedbackCopy("choice", result({ streak: 3, streakBonus: 20 }), true);
    assert.equal(copy.tone, "success");
    assert.equal(copy.title, "Doğru!");
    assert.equal(copy.pointsLabel, "+140 puan");
    assert.deepEqual(copy.chips, ["Hız bonusu +40", "Seri bonusu +20", "3 üst üste"]);
    assert.deepEqual(copy.lines, []);
    assert.match(copy.announcement, /Doğru!/);

    const first = feedbackCopy("choice", result({ streak: 1, streakBonus: 0, speedBonus: 0 }), true);
    assert.deepEqual(first.chips, []);
  });

  it("yanlış cevap: doğru cevap gösterilir, 0 puan", () => {
    const copy = feedbackCopy("choice", result({ correct: false, points: 0, speedBonus: 0, streak: 0 }), true);
    assert.equal(copy.tone, "danger");
    assert.equal(copy.title, "Yanlış");
    assert.equal(copy.pointsLabel, "0 puan");
    assert.deepEqual(copy.lines, ["Doğru cevap: Türkiye"]);
    assert.deepEqual(copy.chips, []);
  });

  it("süre aşımı ve cevapsız tur ayrı başlık alır", () => {
    assert.equal(feedbackCopy("choice", result({ correct: false, timedOut: true, points: 0 }), false).title, "Süre doldu");
    assert.equal(feedbackCopy("choice", result({ correct: false, timedOut: false, points: 0 }), false).title, "Cevap verilmedi");
  });

  it("harita: hedef adı ve uzaklık (km) gösterilir", () => {
    const near = feedbackCopy("map", result({ distanceKm: 1250, points: 900, speedBonus: 0 }), true);
    assert.equal(near.title, "Yakın tahmin!");
    assert.deepEqual(near.lines, ["Hedef: Türkiye", "Tahminin hedefe 1.250 km uzaklıkta"]);
    assert.equal(near.pointsLabel, "+900 puan");

    const far = feedbackCopy("map", result({ correct: false, distanceKm: 6000, points: 10 }), true);
    assert.equal(far.title, "Hedeften uzak kaldın");
    assert.equal(far.tone, "danger");

    const timeout = feedbackCopy("map", result({ correct: false, timedOut: true, distanceKm: null, points: 0 }), false);
    assert.equal(timeout.title, "Süre doldu");
    assert.deepEqual(timeout.lines, ["Hedef: Türkiye"]);
  });

  it("tur şeridi etiketleri", () => {
    assert.equal(outcomeLabel({ index: 2, correct: true, timedOut: false, points: 150 }), "Tur 3: doğru, +150 puan");
    assert.equal(outcomeLabel({ index: 0, correct: false, timedOut: false, points: 0 }), "Tur 1: yanlış");
    assert.equal(outcomeLabel({ index: 4, correct: false, timedOut: true, points: 0 }), "Tur 5: süre doldu");
    assert.equal(outcomeLabel({ index: 1, correct: false, timedOut: false, points: 120 }), "Tur 2: +120 puan");
  });

  it("puan etiketi", () => {
    assert.equal(pointsLabel(0), "0 puan");
    assert.equal(pointsLabel(1850), "+1.850 puan");
  });
});

describe("liderlik metinleri", () => {
  it("satır etiketi kendi satırını belirtir", () => {
    assert.equal(entryLabel({ rank: 2, displayName: "Ayşe", score: 1850, isMe: false }), "2. sıra, Ayşe, 1.850 puan");
    assert.equal(entryLabel({ rank: 1, displayName: "Can", score: 900, isMe: true }), "1. sıra, Can, 900 puan. Bu sensin");
  });

  it("kendi sıram: sıralı ve sırasız durum", () => {
    const ranked = rankSummary({ gameType: "overall", period: "all", rank: 12, personalBest: 1450, totalPlayers: 340 }, "all");
    assert.deepEqual(ranked, { headline: "12. sıradasın / 340 oyuncu", detail: "En iyi puanın: 1.450", ranked: true });
    const none = rankSummary({ gameType: "flag-quiz", period: "week", rank: null, personalBest: null, totalPlayers: 5 }, "week");
    assert.equal(none.ranked, false);
    assert.equal(none.headline, "Bu dönemde puanın yok");
    assert.match(none.detail, /^Son 7 günde puanlı bir oyunun yok/);
  });

  it("boş liste metni döneme göre", () => {
    assert.match(emptyLeaderboardMessage("all"), /Henüz puanlı oyun yok/);
    assert.match(emptyLeaderboardMessage("week"), /Son 7 gün/);
    assert.match(emptyLeaderboardMessage("day"), /Son 24 saat/);
  });
});

describe("oyun türleri ve biçimlendirme", () => {
  it("rota parametrelerini doğrular (geçersiz tür 404 durumuna gider)", () => {
    assert.equal(isPlayableGameType("flag-quiz"), true);
    assert.equal(isPlayableGameType("map-guess"), true);
    assert.equal(isPlayableGameType("overall"), false);
    assert.equal(isPlayableGameType("yok"), false);
    assert.equal(isPlayableGameType(undefined), false);
    assert.equal(isLeaderboardType("overall"), true);
    assert.equal(isLeaderboardType("capital-quiz"), true);
    assert.equal(isLeaderboardType("x"), false);
    assert.equal(isLeaderboardPeriod("week"), true);
    assert.equal(isLeaderboardPeriod("month"), false);
    assert.equal(firstParam(["a", "b"]), "a");
    assert.equal(firstParam("c"), "c");
    assert.equal(firstParam(undefined), undefined);
  });

  it("oyun biçimi: harita ve çoktan seçmeli", () => {
    assert.equal(gameKindOf("map-guess"), "map");
    assert.equal(gameKindOf("flag-quiz"), "choice");
    assert.equal(gameKindOf("capital-quiz"), "choice");
  });

  it("sayı ve süre biçimi", () => {
    assert.equal(formatNumber(0), "0");
    assert.equal(formatNumber(999), "999");
    assert.equal(formatNumber(1000), "1.000");
    assert.equal(formatNumber(1234567), "1.234.567");
    assert.equal(formatNumber(Number.NaN), "0");
    assert.equal(formatDuration(42_300), "42,3 sn");
    assert.equal(formatDuration(83_400), "1 dk 23 sn");
    assert.equal(formatDuration(119_800), "2 dk");
    assert.equal(formatDuration(-1), "—");
  });
});
