import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { AnswerResponseDto, GameQuestionDto } from "@wangoh/api-client";

import { createCityRecap, recapCredits, recapEntryFrom, type CityRecapEntry } from "./cityRecap";
import { GAME_INFO, LEADERBOARD_TYPES, PLAYABLE_GAME_TYPES, gameKindOf, isLeaderboardType, isPlayableGameType } from "./gameTypes";

const CREDIT = { author: "Yazar", licenseName: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", sourceUrl: "https://commons.example.org/wiki/File:X.jpg" };

const question = (extra: Partial<GameQuestionDto> = {}): GameQuestionDto => ({
  flag: null,
  flagUrl: null,
  countryName: null,
  imageUrl: "https://assets.test/og/gorsel-1.jpg",
  imageCredit: { author: "Yazar", licenseName: "CC BY-SA 4.0", licenseUrl: CREDIT.licenseUrl },
  ...extra,
});

const answer = (extra: Partial<AnswerResponseDto["correctAnswer"]> = {}, correct = true): AnswerResponseDto =>
  ({
    correct,
    correctAnswer: { code: "FR:nice", label: "Nice", lat: null, lng: null, countryCode: "FR", citySlug: "nice", imageCredit: CREDIT, ...extra },
  }) as AnswerResponseDto;

const entry = (index: number, extra: Partial<CityRecapEntry> = {}): CityRecapEntry => ({
  index,
  label: `Şehir ${index}`,
  countryCode: "FR",
  citySlug: `sehir-${index}`,
  correct: true,
  imageUrl: `https://assets.test/og/gorsel-${index}.jpg`,
  credit: null,
  ...extra,
});

describe("şehir oyunu: tür tanımı", () => {
  it("oynanabilir ve liderlik türleri arasında; çoktan seçmeli, 10 tur", () => {
    assert.ok(PLAYABLE_GAME_TYPES.includes("city-photo"));
    assert.ok(LEADERBOARD_TYPES.includes("city-photo"));
    assert.equal(isPlayableGameType("city-photo"), true);
    assert.equal(isLeaderboardType("city-photo"), true);
    assert.equal(gameKindOf("city-photo"), "choice");
    assert.equal(GAME_INFO["city-photo"].rounds, 10);
    assert.equal(GAME_INFO["city-photo"].title, "Bu Şehir Neresi?");
  });
});

describe("recapEntryFrom", () => {
  it("cevap yanıtından şehir kaydı: ad, rehber adresi, doğru/yanlış, fotoğraf ve tam atıf", () => {
    assert.deepEqual(recapEntryFrom(answer(), question(), 3), {
      index: 3,
      label: "Nice",
      countryCode: "FR",
      citySlug: "nice",
      correct: true,
      imageUrl: "https://assets.test/og/gorsel-1.jpg",
      credit: CREDIT,
    });
    assert.equal(recapEntryFrom(answer({}, false), question(), 0)?.correct, false);
    assert.equal(recapEntryFrom(answer({ imageCredit: null }), question({ imageCredit: null }), 0)?.credit, null);
  });

  it("öteki oyunlarda (rehber adresi yok) kayıt üretilmez", () => {
    assert.equal(recapEntryFrom(answer({ countryCode: null, citySlug: null, imageCredit: null }), question({ imageUrl: null, imageCredit: null }), 0), null);
    assert.equal(recapEntryFrom(answer({ citySlug: null }), question(), 0), null);
  });
});

describe("createCityRecap", () => {
  it("kayıtları tur sırasıyla verir; aynı tur yeniden eklenirse yerini alır; bilinmeyen oturum boş", () => {
    const recap = createCityRecap();
    recap.add("s1", entry(2));
    recap.add("s1", entry(0));
    recap.add("s1", entry(1, { correct: false }));
    recap.add("s1", entry(2, { label: "Güncel" }));
    assert.deepEqual(recap.get("s1").map((e) => [e.index, e.label, e.correct]), [
      [0, "Şehir 0", true],
      [1, "Şehir 1", false],
      [2, "Güncel", true],
    ]);
    assert.deepEqual(recap.get("yok"), []);
  });

  it("dönen dizi kopyadır: dışarıdan değiştirmek kaydı bozmaz", () => {
    const recap = createCityRecap();
    recap.add("s1", entry(0));
    recap.get("s1").push(entry(9));
    assert.equal(recap.get("s1").length, 1);
  });

  it("en eski oturumlar atılır (sınır), son kullanılan kalır; clear hepsini siler", () => {
    const recap = createCityRecap(2);
    recap.add("a", entry(0));
    recap.add("b", entry(0));
    recap.add("a", entry(1)); // a tazelendi: en eski artık b
    recap.add("c", entry(0));
    assert.equal(recap.get("b").length, 0);
    assert.equal(recap.get("a").length, 2);
    assert.equal(recap.get("c").length, 1);
    recap.clear();
    assert.equal(recap.get("a").length, 0);
  });
});

describe("recapCredits", () => {
  it("yalnız atıf gerektiren fotoğraflar, atıf bileşeninin biçiminde ve tur sırasıyla", () => {
    const credits = recapCredits([entry(0, { credit: CREDIT }), entry(1), entry(2, { credit: { ...CREDIT, author: null } }), entry(3, { credit: CREDIT, imageUrl: null })]);
    assert.deepEqual(credits, [
      { imageUrl: "https://assets.test/og/gorsel-0.jpg", ...CREDIT },
      { imageUrl: "https://assets.test/og/gorsel-2.jpg", ...CREDIT, author: null },
    ]);
    assert.deepEqual(recapCredits([]), []);
  });
});
