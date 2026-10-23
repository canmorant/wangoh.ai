import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { DEFAULT_ERROR_MESSAGE } from "../api/errors";
import {
  DISABLED_MESSAGE,
  EMAIL_TAKEN_MESSAGE,
  NETWORK_MESSAGE,
  RATE_LIMITED_MESSAGE,
  SERVER_MESSAGE,
  SESSION_EXPIRED_MESSAGE,
  VALIDATION_FALLBACK_MESSAGE,
  describeAuthError,
  fieldErrorsFromDetails,
} from "./authErrors";

function apiError(status: number, code: string | undefined, message: string, details?: unknown) {
  return Object.assign(new Error(message), { status, code, details });
}

describe("describeAuthError", () => {
  it("ağ hatası (status 0 ya da NETWORK_ERROR)", () => {
    const info = describeAuthError(apiError(0, "NETWORK_ERROR", "x"), "login");
    assert.equal(info.kind, "network");
    assert.equal(info.message, NETWORK_MESSAGE);
    assert.deepEqual(info.fieldErrors, {});
    assert.equal(describeAuthError({ code: "NETWORK_ERROR" }, "register").kind, "network");
  });

  it("girişte yanlış e-posta/parola genel mesajdır, alana bağlanmaz", () => {
    const info = describeAuthError(apiError(401, "AUTH_INVALID_CREDENTIALS", "E-posta veya parola hatalı."), "login");
    assert.equal(info.kind, "credentials");
    assert.equal(info.message, "E-posta veya parola hatalı.");
    assert.deepEqual(info.fieldErrors, {});
  });

  it("parola değiştirmede yanlış mevcut parola (403) mevcut parola alanına bağlanır", () => {
    const info = describeAuthError(apiError(403, "AUTH_INVALID_CREDENTIALS", "Mevcut parola hatalı."), "changePassword");
    assert.equal(info.kind, "credentials");
    assert.deepEqual(info.fieldErrors, { currentPassword: "Mevcut parola hatalı." });
  });

  it("hesap silmede yanlış parola parola alanına bağlanır", () => {
    const info = describeAuthError(apiError(403, "AUTH_INVALID_CREDENTIALS", "Mevcut parola hatalı."), "deleteAccount");
    assert.deepEqual(info.fieldErrors, { password: "Parola hatalı." });
  });

  it("e-posta kayıtlı (409) e-posta alanına bağlanır", () => {
    const info = describeAuthError(apiError(409, "AUTH_EMAIL_TAKEN", "Bu e-posta adresi zaten kayıtlı."), "register");
    assert.equal(info.kind, "emailTaken");
    assert.equal(info.message, EMAIL_TAKEN_MESSAGE);
    assert.deepEqual(info.fieldErrors, { email: EMAIL_TAKEN_MESSAGE });
  });

  it("devre dışı hesap", () => {
    const info = describeAuthError(apiError(403, "AUTH_ACCOUNT_DISABLED", "Hesabınız devre dışı bırakıldı."), "login");
    assert.equal(info.kind, "disabled");
    assert.equal(info.message, DISABLED_MESSAGE);
  });

  it("hız sınırı (kodla ya da 429 ile)", () => {
    assert.equal(describeAuthError(apiError(429, "RATE_LIMITED", "çok"), "login").message, RATE_LIMITED_MESSAGE);
    assert.equal(describeAuthError(apiError(429, undefined, "çok"), "register").kind, "rateLimited");
  });

  it("doğrulama hatası alan alan eşlenir", () => {
    const details = [
      { field: "email", code: "isEmail", message: "Geçerli bir e-posta adresi girin." },
      { field: "password", code: "minLength", message: "Çok kısa." },
      { field: "displayName", code: "maxLength", message: "Çok uzun." },
    ];
    const info = describeAuthError(apiError(400, "VALIDATION_FAILED", "Girilen bilgiler geçersiz.", details), "register");
    assert.equal(info.kind, "validation");
    assert.equal(info.message, VALIDATION_FALLBACK_MESSAGE);
    assert.deepEqual(info.fieldErrors, {
      email: "Geçerli bir e-posta adresi gir.",
      password: "Parola en az 8 karakter olmalı.",
      displayName: "Görünen ad en fazla 50 karakter olabilir.",
    });
  });

  it("doğrulama: yeni parola, görünen ad deseni ve bilinmeyen kısıt", () => {
    const info = describeAuthError(
      apiError(400, "VALIDATION_FAILED", "x", [
        { field: "newPassword", code: "minLength", message: "Çok kısa." },
        { field: "displayName", code: "matches", message: "Biçim geçersiz." },
        { field: "email", code: "baskaKisit", message: "Sunucu metni." },
      ]),
      "changePassword",
    );
    assert.equal(info.fieldErrors.newPassword, "Yeni parola en az 8 karakter olmalı.");
    assert.equal(info.fieldErrors.displayName, "Görünen ad geçersiz karakter içeriyor.");
    assert.equal(info.fieldErrors.email, "Geçerli bir e-posta adresi gir.");
  });

  it("doğrulama: alana bağlanamayan hatada sunucu mesajı gösterilir", () => {
    const info = describeAuthError(apiError(400, "VALIDATION_FAILED", "Girilen bilgiler geçersiz.", [{ field: "", code: "whitelistValidation", message: "Bu alana izin verilmiyor." }]), "login");
    assert.deepEqual(info.fieldErrors, {});
    assert.equal(info.message, "Girilen bilgiler geçersiz.");
  });

  it("oturum biten işlemlerde 401 oturum süresi mesajına döner; girişte döndürmez", () => {
    assert.equal(describeAuthError(apiError(401, "AUTH_TOKEN_INVALID", "x"), "updateProfile").kind, "sessionExpired");
    assert.equal(describeAuthError(apiError(401, "AUTH_REQUIRED", "x"), "deleteAccount").message, SESSION_EXPIRED_MESSAGE);
    assert.equal(describeAuthError(apiError(401, undefined, "x"), "changePassword").kind, "sessionExpired");
    assert.equal(describeAuthError(apiError(401, undefined, "Bu işlem için oturum açman gerekiyor."), "login").kind, "other");
  });

  it("sunucu hatası (5xx)", () => {
    const info = describeAuthError(apiError(503, "SERVICE_UNAVAILABLE", "x"), "login");
    assert.equal(info.kind, "server");
    assert.equal(info.message, SERVER_MESSAGE);
  });

  it("son yönetici çakışması sunucu mesajını gösterir", () => {
    const info = describeAuthError(apiError(409, "LAST_ADMIN", "Son yönetici hesabı silinemez."), "deleteAccount");
    assert.equal(info.kind, "other");
    assert.equal(info.message, "Son yönetici hesabı silinemez.");
  });

  it("bilinmeyen hata: mesaj yoksa genel Türkçe metin", () => {
    assert.equal(describeAuthError(new Error("   "), "login").message, DEFAULT_ERROR_MESSAGE);
    assert.equal(describeAuthError(undefined, "login").message, DEFAULT_ERROR_MESSAGE);
    assert.equal(describeAuthError(null, "register").kind, "other");
  });
});

describe("fieldErrorsFromDetails", () => {
  it("dizi olmayan ya da bozuk girdide boş döner", () => {
    assert.deepEqual(fieldErrorsFromDetails(undefined), {});
    assert.deepEqual(fieldErrorsFromDetails("x"), {});
    assert.deepEqual(fieldErrorsFromDetails([null, 3, "a", {}]), {});
  });

  it("bir alanın ilk hatasını tutar, bilinmeyen alanı atlar", () => {
    const result = fieldErrorsFromDetails([
      { field: "email", code: "isEmail", message: "a" },
      { field: "email", code: "maxLength", message: "b" },
      { field: "items.0.text", code: "isString", message: "c" },
    ]);
    assert.deepEqual(result, { email: "Geçerli bir e-posta adresi gir." });
  });
});
