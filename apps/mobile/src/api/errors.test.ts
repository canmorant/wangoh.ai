import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { DEFAULT_ERROR_MESSAGE, getErrorCode, getErrorMessage, getErrorStatus, isNetworkError } from "./errors";

describe("hata yardımcıları", () => {
  const apiError = Object.assign(new Error("E-posta kullanılıyor."), { status: 409, code: "AUTH_EMAIL_TAKEN" });
  const networkError = Object.assign(new Error("Sunucuya ulaşılamadı."), { status: 0, code: "NETWORK_ERROR" });

  it("durum kodunu ve kodu okur", () => {
    assert.equal(getErrorStatus(apiError), 409);
    assert.equal(getErrorCode(apiError), "AUTH_EMAIL_TAKEN");
  });

  it("API hatası olmayanda durum kodu undefined", () => {
    assert.equal(getErrorStatus(new Error("x")), undefined);
    assert.equal(getErrorStatus(null), undefined);
    assert.equal(getErrorStatus("metin"), undefined);
  });

  it("ağ hatasını ayırt eder", () => {
    assert.equal(isNetworkError(networkError), true);
    assert.equal(isNetworkError({ code: "NETWORK_ERROR" }), true);
    assert.equal(isNetworkError(apiError), false);
    assert.equal(isNetworkError(new Error("x")), false);
  });

  it("mesajı verir; yoksa yedek Türkçe metni", () => {
    assert.equal(getErrorMessage(apiError), "E-posta kullanılıyor.");
    assert.equal(getErrorMessage("Düz metin"), "Düz metin");
    assert.equal(getErrorMessage(new Error("   ")), DEFAULT_ERROR_MESSAGE);
    assert.equal(getErrorMessage(undefined), DEFAULT_ERROR_MESSAGE);
    assert.equal(getErrorMessage(undefined, "Yedek"), "Yedek");
  });
});
