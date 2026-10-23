import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { AnswerResponseDto, GameRoundDto, GameSessionDto, StartSessionResponseDto } from "@wangoh/api-client";

import {
  correctCountOf,
  initialPlayState,
  isBusy,
  isInProgress,
  playReducer,
  roundNumberOf,
  type PlayEvent,
  type PlayState,
} from "./playMachine";

const NOW = 1_000_000;

function round(index: number, extra: Partial<GameRoundDto> = {}): GameRoundDto {
  return {
    index,
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
    ...extra,
  };
}

function started(roundsTotal = 10): StartSessionResponseDto {
  return { sessionId: "s1", gameType: "flag-quiz", roundsTotal, expiresAt: new Date(NOW + 1_800_000).toISOString(), round: round(0) };
}

function answer(extra: Partial<AnswerResponseDto> = {}): AnswerResponseDto {
  return {
    correct: true,
    correctAnswer: { code: "AA", label: "A", lat: null, lng: null },
    distanceKm: null,
    nextRound: round(1),
    points: 140,
    score: 140,
    speedBonus: 40,
    streak: 1,
    streakBonus: 0,
    timedOut: false,
    ...extra,
  };
}

function snapshot(extra: Partial<GameSessionDto> = {}): GameSessionDto {
  return {
    correctCount: 0,
    currentRound: 0,
    expiresAt: new Date(NOW + 1_800_000).toISOString(),
    finishedAt: null,
    gameType: "flag-quiz",
    results: [],
    round: round(0),
    roundsTotal: 10,
    score: 0,
    sessionId: "s1",
    startedAt: new Date(NOW).toISOString(),
    status: "active",
    ...extra,
  };
}

function run(events: PlayEvent[], from: PlayState = initialPlayState): PlayState {
  return events.reduce(playReducer, from);
}

const inQuestion = (): PlayState => run([{ type: "START" }, { type: "STARTED", response: started(), now: NOW }]);

describe("oyun durum makinesi: başlatma", () => {
  it("START -> starting; STARTED -> ilk tur sorusu (puan 0, seçim yok)", () => {
    assert.equal(playReducer(initialPlayState, { type: "START" }).phase, "starting");
    const state = inQuestion();
    assert.equal(state.phase, "question");
    if (state.phase !== "question") return;
    assert.equal(state.session.sessionId, "s1");
    assert.equal(state.session.roundsTotal, 10);
    assert.equal(state.current.round.index, 0);
    assert.equal(state.score, 0);
    assert.equal(state.selection, null);
    assert.equal(state.error, null);
    // Yeni turun yerel bitişi yanıtın ulaştığı andan işler.
    assert.equal(state.current.deadline, NOW + 20_000);
    assert.equal(roundNumberOf(state), 1);
  });

  it("başlatma hatası -> failed(start); RETRY -> yeniden starting", () => {
    const error = Object.assign(new Error("x"), { status: 0, code: "NETWORK_ERROR" });
    const failed = run([{ type: "START" }, { type: "LOAD_FAILED", action: "start", error }]);
    assert.equal(failed.phase, "failed");
    if (failed.phase === "failed") assert.equal(failed.action, "start");
    assert.equal(playReducer(failed, { type: "RETRY" }).phase, "starting");
  });

  it("starting dışında gelen STARTED yok sayılır", () => {
    const state = playReducer(initialPlayState, { type: "STARTED", response: started(), now: NOW });
    assert.equal(state, initialPlayState);
  });
});

describe("oyun durum makinesi: tur akışı", () => {
  it("SUBMIT -> submitting; ANSWERED -> feedback (sunucu puanı taşınır, geçmişe eklenir)", () => {
    const submitting = playReducer(inQuestion(), { type: "SUBMIT", answer: "AA" });
    assert.equal(submitting.phase, "submitting");
    assert.equal(isBusy(submitting), true);

    const feedback = playReducer(submitting, { type: "ANSWERED", response: answer(), now: NOW + 3000 });
    assert.equal(feedback.phase, "feedback");
    if (feedback.phase !== "feedback") return;
    assert.equal(feedback.score, 140);
    assert.deepEqual(feedback.history, [{ index: 0, correct: true, timedOut: false, points: 140 }]);
    assert.equal(feedback.next?.round.index, 1);
    // Sonraki turun yerel bitişi yanıtın ulaştığı andan işler.
    assert.equal(feedback.next?.deadline, NOW + 3000 + 20_000);
    assert.equal(correctCountOf(feedback.history), 1);
  });

  it("çift dokunma: submitting sırasında gelen ikinci SUBMIT durumu değiştirmez", () => {
    const submitting = playReducer(inQuestion(), { type: "SUBMIT", answer: "AA" });
    const again = playReducer(submitting, { type: "SUBMIT", answer: "BB" });
    assert.equal(again, submitting);
    if (again.phase === "submitting") assert.equal(again.answer, "AA");
  });

  it("feedback sırasında gelen SUBMIT ve soru dışındaki SELECT yok sayılır", () => {
    const feedback = run([{ type: "SUBMIT", answer: "AA" }, { type: "ANSWERED", response: answer(), now: NOW }], inQuestion());
    assert.equal(playReducer(feedback, { type: "SUBMIT", answer: "BB" }), feedback);
    assert.equal(playReducer(feedback, { type: "SELECT", answer: { lat: 1, lng: 2 } }), feedback);
  });

  it("NEXT: sonraki tur varsa question, yoksa finishing", () => {
    const afterFirst = run([{ type: "SUBMIT", answer: "AA" }, { type: "ANSWERED", response: answer(), now: NOW }, { type: "NEXT" }], inQuestion());
    assert.equal(afterFirst.phase, "question");
    assert.equal(roundNumberOf(afterFirst), 2);

    const last = run(
      [
        { type: "SUBMIT", answer: null },
        { type: "ANSWERED", response: answer({ nextRound: null, correct: false, timedOut: true, points: 0, score: 900 }), now: NOW },
        { type: "NEXT" },
      ],
      inQuestion(),
    );
    assert.equal(last.phase, "finishing");
    if (last.phase === "finishing") assert.equal(last.score, 900);
  });

  it("süre aşımı yanıtı geçmişe timedOut olarak yazılır, doğru sayısını artırmaz", () => {
    const feedback = run(
      [{ type: "SUBMIT", answer: null }, { type: "ANSWERED", response: answer({ correct: false, timedOut: true, points: 0, score: 0, streak: 0 }), now: NOW }],
      inQuestion(),
    );
    if (feedback.phase !== "feedback") throw new Error("feedback bekleniyordu");
    assert.equal(feedback.history[0]?.timedOut, true);
    assert.equal(correctCountOf(feedback.history), 0);
  });

  it("gönderim hatası: question'a döner, seçim korunur, hata saklanır; yeniden gönderilebilir", () => {
    const error = Object.assign(new Error("ağ"), { status: 0, code: "NETWORK_ERROR" });
    const back = run([{ type: "SUBMIT", answer: "CC" }, { type: "SUBMIT_FAILED", error }], inQuestion());
    assert.equal(back.phase, "question");
    if (back.phase !== "question") return;
    assert.equal(back.selection, "CC");
    assert.equal(back.error, error);
    assert.equal(playReducer(back, { type: "SUBMIT", answer: back.selection }).phase, "submitting");
  });

  it("harita: SELECT noktayı saklar, yeniden SELECT değiştirir, SUBMIT noktayı gönderir", () => {
    const state = run(
      [
        { type: "SELECT", answer: { lat: 10, lng: 20 } },
        { type: "SELECT", answer: { lat: 11, lng: 21 } },
      ],
      inQuestion(),
    );
    if (state.phase !== "question") throw new Error("question bekleniyordu");
    assert.deepEqual(state.selection, { lat: 11, lng: 21 });
    const submitting = playReducer(state, { type: "SUBMIT", answer: state.selection });
    assert.equal(submitting.phase, "submitting");
    if (submitting.phase === "submitting") assert.deepEqual(submitting.answer, { lat: 11, lng: 21 });
  });
});

describe("oyun durum makinesi: bitirme", () => {
  const finishing = (): PlayState =>
    run(
      [
        { type: "SUBMIT", answer: null },
        { type: "ANSWERED", response: answer({ nextRound: null }), now: NOW },
        { type: "NEXT" },
      ],
      inQuestion(),
    );

  it("FINISHED -> done (oturum kimliğiyle)", () => {
    const done = playReducer(finishing(), { type: "FINISHED" });
    assert.deepEqual(done, { phase: "done", sessionId: "s1" });
  });

  it("FINISH_FAILED -> failed(finish); RETRY -> finishing (oturum ve puan korunur)", () => {
    const error = Object.assign(new Error("5xx"), { status: 503, code: "SERVICE_UNAVAILABLE" });
    const failed = playReducer(finishing(), { type: "FINISH_FAILED", error });
    assert.equal(failed.phase, "failed");
    const retried = playReducer(failed, { type: "RETRY" });
    assert.equal(retried.phase, "finishing");
    if (retried.phase === "finishing") assert.equal(retried.session.sessionId, "s1");
  });
});

describe("oyun durum makinesi: geri yükleme ve oturum durumu -> ekran", () => {
  it("etkin oturum + tur -> question (geçmiş ve puan sunucudan; bitiş saati deadlineAt'tan)", () => {
    const snap = snapshot({
      currentRound: 3,
      score: 420,
      results: [
        { index: 0, correct: true, points: 150, timedOut: false },
        { index: 1, correct: false, points: 0, timedOut: true },
        { index: 2, correct: true, points: 270, timedOut: false },
      ],
      round: round(3, { deadlineAt: new Date(NOW + 12_000).toISOString() }),
    });
    const state = run([{ type: "RESTORE", sessionId: "s1" }, { type: "RESTORED", snapshot: snap, now: NOW }]);
    assert.equal(state.phase, "question");
    if (state.phase !== "question") return;
    assert.equal(state.score, 420);
    assert.equal(roundNumberOf(state), 4);
    assert.equal(state.history.length, 3);
    assert.equal(correctCountOf(state.history), 2);
    assert.equal(state.current.deadline, NOW + 12_000);
  });

  it("etkin ama tüm turlar cevaplanmış (round null) -> finishing", () => {
    const state = run([
      { type: "RESTORE", sessionId: "s1" },
      { type: "RESTORED", snapshot: snapshot({ round: null, currentRound: 10, score: 1200 }), now: NOW },
    ]);
    assert.equal(state.phase, "finishing");
    if (state.phase === "finishing") assert.equal(state.score, 1200);
  });

  it("bitmiş oturum -> finishing (finish idempotent: sonuç alınır)", () => {
    const state = run([
      { type: "RESTORE", sessionId: "s1" },
      { type: "RESTORED", snapshot: snapshot({ status: "finished", round: null, finishedAt: new Date(NOW).toISOString() }), now: NOW },
    ]);
    assert.equal(state.phase, "finishing");
  });

  it("süresi dolmuş oturum -> ended(expired); terk edilmiş -> ended(notActive)", () => {
    const expired = run([{ type: "RESTORE", sessionId: "s1" }, { type: "RESTORED", snapshot: snapshot({ status: "expired", round: null }), now: NOW }]);
    assert.deepEqual(expired, { phase: "ended", reason: "expired", sessionId: "s1" });
    const abandoned = run([{ type: "RESTORE", sessionId: "s1" }, { type: "RESTORED", snapshot: snapshot({ status: "abandoned", round: null }), now: NOW }]);
    assert.deepEqual(abandoned, { phase: "ended", reason: "notActive", sessionId: "s1" });
  });

  it("geri yükleme hatası -> failed(restore); RETRY aynı oturumu yeniden dener", () => {
    const error = Object.assign(new Error("ağ"), { status: 0, code: "NETWORK_ERROR" });
    const failed = run([{ type: "RESTORE", sessionId: "s9" }, { type: "LOAD_FAILED", action: "restore", error }]);
    assert.equal(failed.phase, "failed");
    assert.deepEqual(playReducer(failed, { type: "RETRY" }), { phase: "restoring", sessionId: "s9" });
  });

  it("409 sonrası eşitleme: submitting'den RESTORED güncel tura geçer ve bilgi notunu taşır", () => {
    const submitting = playReducer(inQuestion(), { type: "SUBMIT", answer: "AA" });
    const synced = playReducer(submitting, {
      type: "RESTORED",
      snapshot: snapshot({ currentRound: 1, score: 140, round: round(1), results: [{ index: 0, correct: true, points: 140, timedOut: false }] }),
      now: NOW + 500,
      notice: "devam",
    });
    assert.equal(synced.phase, "question");
    if (synced.phase !== "question") return;
    assert.equal(roundNumberOf(synced), 2);
    assert.equal(synced.notice, "devam");
    assert.equal(synced.score, 140);
  });

  it("finishing sırasında 409 (oyun bitmedi) sonrası eşitleme: RESTORED güncel tura döner", () => {
    const finishing = run([
      { type: "SUBMIT", answer: null },
      { type: "ANSWERED", response: answer({ nextRound: null }), now: NOW },
      { type: "NEXT" },
    ], inQuestion());
    assert.equal(finishing.phase, "finishing");
    const synced = playReducer(finishing, { type: "RESTORED", snapshot: snapshot({ currentRound: 8, round: round(8) }), now: NOW });
    assert.equal(synced.phase, "question");
    assert.equal(roundNumberOf(synced), 9);
  });

  it("geri yüklemede aygıt saati sunucudan geriyse gösterge tur süresini aşmaz", () => {
    // deadlineAt çok ileride (aygıt saati geride): üst sınır tur süresidir.
    const snap = snapshot({ round: round(0, { deadlineAt: new Date(NOW + 10 * 60_000).toISOString() }) });
    const state = run([{ type: "RESTORE", sessionId: "s1" }, { type: "RESTORED", snapshot: snap, now: NOW }]);
    if (state.phase !== "question") throw new Error("question bekleniyordu");
    assert.equal(state.current.deadline, NOW + 20_000);
  });
});

describe("oyun durum makinesi: oturum sonları", () => {
  it("cevap sırasında SESSION_ENDED -> ended (oturum kimliği korunur)", () => {
    const submitting = playReducer(inQuestion(), { type: "SUBMIT", answer: "AA" });
    const ended = playReducer(submitting, { type: "SESSION_ENDED", reason: "expired" });
    assert.deepEqual(ended, { phase: "ended", reason: "expired", sessionId: "s1" });
    assert.equal(isInProgress(ended), false);
  });

  it("ended'dan START yeni oyun açar; done ve idle'da SESSION_ENDED yok sayılır", () => {
    const ended: PlayState = { phase: "ended", reason: "notFound", sessionId: null };
    assert.equal(playReducer(ended, { type: "START" }).phase, "starting");
    const done: PlayState = { phase: "done", sessionId: "s1" };
    assert.equal(playReducer(done, { type: "SESSION_ENDED", reason: "expired" }), done);
    assert.equal(playReducer(initialPlayState, { type: "SESSION_ENDED", reason: "expired" }), initialPlayState);
  });

  it("çıkış onayı yalnız oyun sürerken gerekir", () => {
    assert.equal(isInProgress(initialPlayState), false);
    assert.equal(isInProgress(inQuestion()), true);
    assert.equal(isInProgress(playReducer(inQuestion(), { type: "SUBMIT", answer: null })), true);
    assert.equal(isInProgress({ phase: "done", sessionId: "s1" }), false);
  });
});
