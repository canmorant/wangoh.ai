import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  hasControlOrFormatChars,
  hasErrors,
  normalizeDisplayName,
  validateChangePasswordForm,
  validateDeleteAccountForm,
  validateDisplayName,
  validateEmail,
  validateLoginForm,
  validateLoginPassword,
  validateNewPassword,
  validateRegisterForm,
} from "./authValidation";

describe("e-posta", () => {
  it("geçerli adresleri kabul eder (kenar boşlukları kırpılır)", () => {
    assert.equal(validateEmail("ayse@example.com"), null);
    assert.equal(validateEmail("  ayse.k+etiket@alt.example.co.uk  "), null);
  });

  it("boş, biçimi bozuk ve çok uzun adresleri reddeder", () => {
    assert.equal(validateEmail(""), "E-posta adresini gir.");
    assert.equal(validateEmail("   "), "E-posta adresini gir.");
    for (const bad of ["ayse", "ayse@", "@example.com", "ayse@example", "ay se@example.com", "ayse@@example.com"]) {
      assert.equal(validateEmail(bad), "Geçerli bir e-posta adresi gir.", bad);
    }
    assert.match(validateEmail(`${"a".repeat(250)}@b.co`) ?? "", /en fazla 254/);
  });
});

describe("parola", () => {
  it("girişte yalnız dolu olması aranır", () => {
    assert.equal(validateLoginPassword("x"), null);
    assert.equal(validateLoginPassword(""), "Parolanı gir.");
    assert.match(validateLoginPassword("a".repeat(129)) ?? "", /en fazla 128/);
  });

  it("yeni parola 8–128 karakter olmalı", () => {
    assert.equal(validateNewPassword("12345678"), null);
    assert.equal(validateNewPassword("1234567"), "Parola en az 8 karakter olmalı.");
    assert.equal(validateNewPassword(""), "Parolayı gir.");
    assert.equal(validateNewPassword("", "Yeni parola"), "Yeni parolayı gir.");
    assert.equal(validateNewPassword("a".repeat(128)), null);
    assert.match(validateNewPassword("a".repeat(129)) ?? "", /en fazla 128/);
  });

  it("parolanın kenar boşlukları korunur (kırpılmaz)", () => {
    assert.equal(validateNewPassword("   1234  "), null);
  });
});

describe("görünen ad", () => {
  it("2–50 karakter, kenar ve iç boşluklar normalleşir", () => {
    assert.equal(validateDisplayName("Ay"), null);
    assert.equal(validateDisplayName("  Ayşe   Kaya "), null);
    assert.equal(normalizeDisplayName("  Ayşe   Kaya "), "Ayşe Kaya");
    assert.equal(validateDisplayName("a".repeat(50)), null);
  });

  it("boş, kısa ve uzun adları reddeder", () => {
    assert.equal(validateDisplayName("   "), "Görünen adını gir.");
    assert.equal(validateDisplayName(" A "), "Görünen ad en az 2 karakter olmalı.");
    assert.equal(validateDisplayName("a".repeat(51)), "Görünen ad en fazla 50 karakter olabilir.");
  });

  it("denetim ve biçim karakterlerini reddeder (sunucu deseniyle uyumlu)", () => {
    assert.equal(validateDisplayName("Ay\u0000şe"), "Görünen ad geçersiz karakter içeriyor.");
    assert.equal(validateDisplayName("Ay‮şe"), "Görünen ad geçersiz karakter içeriyor.");
    assert.equal(validateDisplayName("Ay​şe"), "Görünen ad geçersiz karakter içeriyor.");
    assert.equal(hasControlOrFormatChars("normal ad çğıöşü İ"), false);
    assert.equal(hasControlOrFormatChars("emoji 😀 olur"), false);
  });
});

describe("formlar", () => {
  it("giriş formu", () => {
    assert.deepEqual(validateLoginForm({ email: "a@b.co", password: "x" }), {});
    assert.deepEqual(validateLoginForm({ email: "", password: "" }), { email: "E-posta adresini gir.", password: "Parolanı gir." });
    assert.equal(hasErrors(validateLoginForm({ email: "a@b.co", password: "" })), true);
  });

  it("kayıt formu", () => {
    assert.deepEqual(validateRegisterForm({ displayName: "Ayşe", email: "a@b.co", password: "12345678" }), {});
    const errors = validateRegisterForm({ displayName: "A", email: "x", password: "123" });
    assert.deepEqual(Object.keys(errors).sort(), ["displayName", "email", "password"]);
  });

  it("parola değiştirme formu", () => {
    assert.deepEqual(validateChangePasswordForm({ currentPassword: "eski-parola", newPassword: "yeni-parola", confirmPassword: "yeni-parola" }), {});
    assert.equal(validateChangePasswordForm({ currentPassword: "", newPassword: "yeni-parola", confirmPassword: "yeni-parola" }).currentPassword, "Mevcut parolanı gir.");
    assert.equal(validateChangePasswordForm({ currentPassword: "a", newPassword: "kisa", confirmPassword: "kisa" }).newPassword, "Yeni parola en az 8 karakter olmalı.");
    assert.equal(
      validateChangePasswordForm({ currentPassword: "ayni-parola", newPassword: "ayni-parola", confirmPassword: "ayni-parola" }).newPassword,
      "Yeni parola mevcut parolayla aynı olamaz.",
    );
    assert.equal(
      validateChangePasswordForm({ currentPassword: "eski-parola", newPassword: "yeni-parola", confirmPassword: "baska-parola" }).confirmPassword,
      "Parolalar eşleşmiyor.",
    );
  });

  it("hesap silme formu parola ister", () => {
    assert.deepEqual(validateDeleteAccountForm({ password: "x" }), {});
    assert.deepEqual(validateDeleteAccountForm({ password: "" }), { password: "Onaylamak için parolanı gir." });
  });
});
