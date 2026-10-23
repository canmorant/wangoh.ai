import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { AnswerResponseDto, GameRoundDto, StartSessionResponseDto } from "@wangoh/api-client";

import { initialPlayState, playReducer, type PlayEvent, type PlayState } from "./playMachine";
import { loadingMessage, optionViewFor, resultPlan } from "./viewModel";

const NOW = 5_000;

const round: GameRoundDto = {
  index: 0,
  question: { flag: "🏳️", flagUrl: null, countryName: null },
  options: [
    { id: "AA", label: "A" },
    { id: "BB", label: "B" },
    { id: "CC", label: "C" },
    { id: "DD", label: "D" },
  ],
  timeLimitMs: 20_000,
  startedAt: new Date(NOW).toISOString(),
  deadlineAt: new Date(NOW + 20_000).toISOString(),
};

const started: StartSessionResponseDto = {
  sessionId: "s1",
  gameType: "flag-quiz",
  roundsTotal: 10,
  expiresAt: new Date(NOW + 1_800_000).toISOString(),
  round,
};

const answered = (extra: Partial<AnswerResponseDto> = {}): AnswerResponseDto => ({
  correct: false,
  correctAnswer: { code: "CC", label: "C", lat: null, lng: null },
  distanceKm: null,
  nextRound: null,
  points: 0,
  score: 0,
  speedBonus: 0,
  streak: 0,
  streakBonus: 0,
  timedOut: false,
  ...extra,
});

const run = (events: PlayEvent[]): PlayState => events.reduce(playReducer, initialPlayState);
const question = () => run([{ type: "START" }, { type: "STARTED", response: started, now: NOW }]);

describe("seçenek görünümü (oturum durumu -> ekran)", () => {
  it("soru: hiçbir seçenek seçili değil, hepsi dokunulabilir", () => {
    for (const id of ["AA", "BB", "CC", "DD"]) {
      assert.deepEqual(optionViewFor(question(), id), { visual: "idle", chosen: false, disabled: false });
    }
  });

  it("gönderiliyor: seçilen 'pending', hepsi kilitli", () => {
    const state = playReducer(question(), { type: "SUBMIT", answer: "BB" });
    assert.deepEqual(optionViewFor(state, "BB"), { visual: "pending", chosen: true, disabled: true });
    assert.deepEqual(optionViewFor(state, "AA"), { visual: "idle", chosen: false, disabled: true });
  });

  it("gönderim hatası: seçim vurgulu kalır ama başka seçenek seçilebilir", () => {
    const state = playReducer(playReducer(question(), { type: "SUBMIT", answer: "BB" }), {
      type: "SUBMIT_FAILED",
      error: Object.assign(new Error("ağ"), { status: 0, code: "NETWORK_ERROR" }),
    });
    assert.deepEqual(optionViewFor(state, "BB"), { visual: "pending", chosen: true, disabled: false });
    assert.deepEqual(optionViewFor(state, "CC"), { visual: "idle", chosen: false, disabled: false });
  });

  it("cevap sonrası yanlış seçimde: seçilen kırmızı, doğru yeşil, kalanlar silik", () => {
    const state = playReducer(playReducer(question(), { type: "SUBMIT", answer: "BB" }), {
      type: "ANSWERED",
      response: answered(),
      now: NOW,
    });
    assert.deepEqual(optionViewFor(state, "BB"), { visual: "wrong", chosen: true, disabled: true });
    assert.deepEqual(optionViewFor(state, "CC"), { visual: "correct", chosen: false, disabled: true });
    assert.deepEqual(optionViewFor(state, "AA"), { visual: "dimmed", chosen: false, disabled: true });
  });

  it("doğru seçimde: seçilen yeşil ve 'chosen'", () => {
    const state = playReducer(playReducer(question(), { type: "SUBMIT", answer: "CC" }), {
      type: "ANSWERED",
      response: answered({ correct: true, points: 140, score: 140 }),
      now: NOW,
    });
    assert.deepEqual(optionViewFor(state, "CC"), { visual: "correct", chosen: true, disabled: true });
  });

  it("süre aşımında (cevap yok): doğru cevap yeşil, hiçbiri 'chosen' değil", () => {
    const state = playReducer(playReducer(question(), { type: "SUBMIT", answer: null }), {
      type: "ANSWERED",
      response: answered({ timedOut: true }),
      now: NOW,
    });
    assert.deepEqual(optionViewFor(state, "CC"), { visual: "correct", chosen: false, disabled: true });
    assert.equal(optionViewFor(state, "AA").visual, "dimmed");
  });

  it("soru dışı aşamalarda seçenekler kilitli", () => {
    assert.equal(optionViewFor(initialPlayState, "AA").disabled, true);
  });
});

describe("sonuç ekranı planı (oturum durumu -> ekran)", () => {
  it("bitmiş oturum ve tüm turları cevaplanmış etkin oturum -> bitirme çağrısı", () => {
    assert.deepEqual(resultPlan({ status: "finished", round: null }), { type: "finish" });
    assert.deepEqual(resultPlan({ status: "active", round: null }), { type: "finish" });
  });

  it("turu kalan etkin oturum -> bitmedi", () => {
    assert.deepEqual(resultPlan({ status: "active", round }), { type: "unfinished" });
  });

  it("süresi dolmuş / terk edilmiş -> son ekran", () => {
    assert.deepEqual(resultPlan({ status: "expired", round: null }), { type: "ended", reason: "expired" });
    assert.deepEqual(resultPlan({ status: "abandoned", round: null }), { type: "ended", reason: "notActive" });
  });
});

describe("yükleniyor metinleri", () => {
  it("aşamaya göre", () => {
    assert.equal(loadingMessage("starting"), "Oyun hazırlanıyor…");
    assert.equal(loadingMessage("restoring"), "Oyun yükleniyor…");
    assert.equal(loadingMessage("finishing"), "Sonuç hesaplanıyor…");
    assert.equal(loadingMessage("done"), "Sonuç açılıyor…");
    assert.equal(loadingMessage("idle"), "Yükleniyor…");
  });
});
