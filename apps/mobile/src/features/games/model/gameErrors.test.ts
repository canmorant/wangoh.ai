import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  answerFailureAction,
  classifyGameError,
  endCopy,
  finishFailureAction,
  gameErrorMessage,
  isRetryable,
  restoreFailureAction,
} from "./gameErrors";

function apiError(status: number, code: string, message = "API mesajı") {
  return Object.assign(new Error(message), { status, code });
}

describe("oyun hataları: sınıflandırma", () => {
  const cases: Array<[string, unknown, ReturnType<typeof classifyGameError>]> = [
    ["ağ hatası", apiError(0, "NETWORK_ERROR"), "network"],
    ["süresi dolmuş oturum", apiError(410, "GAME_SESSION_EXPIRED"), "sessionExpired"],
    ["etkin olmayan oturum", apiError(409, "GAME_SESSION_NOT_ACTIVE"), "sessionNotActive"],
    ["tur zaten cevaplandı", apiError(409, "GAME_ROUND_ALREADY_ANSWERED"), "roundConflict"],
    ["tur sırası bozuk", apiError(409, "GAME_ROUND_OUT_OF_ORDER"), "roundConflict"],
    ["tur kalmadı", apiError(409, "GAME_NO_ROUND_LEFT"), "roundConflict"],
    ["oyun bitmedi", apiError(409, "GAME_NOT_FINISHED"), "notFinished"],
    ["puan kaldırıldı", apiError(410, "GAME_SCORE_REMOVED"), "scoreRemoved"],
    ["havuz küçük", apiError(409, "GAME_POOL_TOO_SMALL"), "poolTooSmall"],
    ["hız sınırı", apiError(429, "RATE_LIMITED"), "rateLimited"],
    ["oturum yok (401)", apiError(401, "AUTH_REQUIRED"), "unauthorized"],
    ["geçersiz belirteç", apiError(401, "AUTH_TOKEN_INVALID"), "unauthorized"],
    ["hesap devre dışı", apiError(403, "AUTH_ACCOUNT_DISABLED"), "unauthorized"],
    ["yasak", apiError(403, "FORBIDDEN"), "forbidden"],
    ["bulunamadı", apiError(404, "NOT_FOUND"), "sessionNotFound"],
    ["doğrulama", apiError(400, "VALIDATION_FAILED"), "validation"],
    ["sunucu hatası", apiError(500, "INTERNAL_ERROR"), "server"],
    ["geçici kesinti", apiError(503, "SERVICE_UNAVAILABLE"), "server"],
    ["bilinmeyen kod", apiError(418, "TEAPOT"), "unknown"],
    ["API hatası olmayan", new Error("x"), "unknown"],
  ];
  for (const [name, error, expected] of cases) {
    it(`${name} -> ${expected}`, () => assert.equal(classifyGameError(error), expected));
  }
});

describe("oyun hataları: Türkçe mesajlar", () => {
  it("her bilinen tür kendi mesajını verir (API mesajı yerine uygulama dili)", () => {
    assert.match(gameErrorMessage(apiError(0, "NETWORK_ERROR")), /Sunucuya ulaşılamadı/);
    assert.match(gameErrorMessage(apiError(410, "GAME_SESSION_EXPIRED", "Yeni bir oyun başlatın.")), /başlatabilirsin/);
    assert.match(gameErrorMessage(apiError(409, "GAME_SESSION_NOT_ACTIVE")), /artık etkin değil/);
    assert.match(gameErrorMessage(apiError(409, "GAME_ROUND_ALREADY_ANSWERED")), /zaten kayıtlıydı/);
    assert.match(gameErrorMessage(apiError(409, "GAME_NOT_FINISHED")), /tüm turları cevaplamalısın/);
    assert.match(gameErrorMessage(apiError(410, "GAME_SCORE_REMOVED")), /puanı kaldırıldı/);
    assert.match(gameErrorMessage(apiError(409, "GAME_POOL_TOO_SMALL")), /yeterli veri yok/);
    assert.match(gameErrorMessage(apiError(429, "RATE_LIMITED")), /Çok hızlı/);
    assert.match(gameErrorMessage(apiError(401, "AUTH_REQUIRED")), /yeniden giriş yap/);
    assert.match(gameErrorMessage(apiError(404, "NOT_FOUND")), /bulunamadı/);
    assert.match(gameErrorMessage(apiError(400, "VALIDATION_FAILED")), /kabul edilmedi/);
    assert.match(gameErrorMessage(apiError(500, "INTERNAL_ERROR")), /geçici bir sorun/);
  });

  it("bilinmeyen kodda API mesajına, o da yoksa genel Türkçe mesaja düşer", () => {
    assert.equal(gameErrorMessage(apiError(418, "TEAPOT", "Demlik hatası.")), "Demlik hatası.");
    assert.match(gameErrorMessage(undefined), /Bir şeyler ters gitti/);
  });

  it("yalnız geçici hatalar yeniden denenir", () => {
    assert.equal(isRetryable(apiError(0, "NETWORK_ERROR")), true);
    assert.equal(isRetryable(apiError(503, "SERVICE_UNAVAILABLE")), true);
    assert.equal(isRetryable(apiError(429, "RATE_LIMITED")), true);
    assert.equal(isRetryable(apiError(400, "VALIDATION_FAILED")), false);
    assert.equal(isRetryable(apiError(410, "GAME_SESSION_EXPIRED")), false);
  });
});

describe("oyun hataları: akışın yapacağı şey", () => {
  it("cevap: 409 tur çakışması durumu sunucudan yeniden çeker (idempotent değil)", () => {
    assert.deepEqual(answerFailureAction(apiError(409, "GAME_ROUND_ALREADY_ANSWERED")), { type: "resync" });
    assert.deepEqual(answerFailureAction(apiError(409, "GAME_ROUND_OUT_OF_ORDER")), { type: "resync" });
    assert.deepEqual(answerFailureAction(apiError(409, "GAME_NO_ROUND_LEFT")), { type: "resync" });
  });

  it("cevap: oturum sonları son ekrana, geçici hatalar yeniden denemeye gider", () => {
    assert.deepEqual(answerFailureAction(apiError(410, "GAME_SESSION_EXPIRED")), { type: "end", reason: "expired" });
    assert.deepEqual(answerFailureAction(apiError(409, "GAME_SESSION_NOT_ACTIVE")), { type: "end", reason: "notActive" });
    assert.deepEqual(answerFailureAction(apiError(404, "NOT_FOUND")), { type: "end", reason: "notFound" });
    assert.deepEqual(answerFailureAction(apiError(0, "NETWORK_ERROR")), { type: "retry" });
    assert.deepEqual(answerFailureAction(apiError(500, "INTERNAL_ERROR")), { type: "retry" });
    assert.deepEqual(answerFailureAction(apiError(400, "VALIDATION_FAILED")), { type: "retry" });
  });

  it("bitirme: erken bitirme eşitlenir; puan kaldırıldı ve oturum sonları son ekrana gider", () => {
    assert.deepEqual(finishFailureAction(apiError(409, "GAME_NOT_FINISHED")), { type: "resync" });
    assert.deepEqual(finishFailureAction(apiError(410, "GAME_SESSION_EXPIRED")), { type: "end", reason: "expired" });
    assert.deepEqual(finishFailureAction(apiError(410, "GAME_SCORE_REMOVED")), { type: "end", reason: "scoreRemoved" });
    assert.deepEqual(finishFailureAction(apiError(0, "NETWORK_ERROR")), { type: "retry" });
  });

  it("geri yükleme: 404/410 oturum kaybı (yerel kayıt silinir), ağ hatası yeniden dene", () => {
    assert.deepEqual(restoreFailureAction(apiError(404, "NOT_FOUND")), { type: "end", reason: "notFound" });
    assert.deepEqual(restoreFailureAction(apiError(410, "GAME_SESSION_EXPIRED")), { type: "end", reason: "expired" });
    assert.deepEqual(restoreFailureAction(apiError(0, "NETWORK_ERROR")), { type: "retry" });
  });

  it("son ekran metinleri anlaşılır Türkçe", () => {
    for (const reason of ["expired", "notActive", "notFound", "scoreRemoved"] as const) {
      const copy = endCopy(reason);
      assert.ok(copy.title.length > 0);
      assert.ok(copy.message.length > 0);
    }
    assert.match(endCopy("expired").title, /süresi doldu/);
  });
});
