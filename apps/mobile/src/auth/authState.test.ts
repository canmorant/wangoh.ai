import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { AuthUser } from "./AuthContext";
import { authReducer, initialAuthState, isAdminUser, isSameUser, shouldClearQueryCache, toAuthUser, type AuthState } from "./authState";

const ayse: AuthUser = { id: "u1", email: "ayse@example.test", displayName: "Ayşe", role: "user" };
const signedIn: AuthState = { status: "signedIn", user: ayse };

describe("oturum durumu geçişleri", () => {
  it("açılış durumu restoring ve kullanıcı yok", () => {
    assert.deepEqual(initialAuthState, { status: "restoring", user: null });
  });

  it("restoring -> signedIn kullanıcıyı koyar", () => {
    assert.deepEqual(authReducer(initialAuthState, { type: "signedIn", user: ayse }), signedIn);
  });

  it("restoring -> signedOut kullanıcıyı boş bırakır", () => {
    assert.deepEqual(authReducer(initialAuthState, { type: "signedOut" }), { status: "signedOut", user: null });
  });

  it("signedIn -> signedOut kullanıcıyı siler", () => {
    assert.deepEqual(authReducer(signedIn, { type: "signedOut" }), { status: "signedOut", user: null });
  });

  it("signedOut -> signedIn", () => {
    const out: AuthState = { status: "signedOut", user: null };
    assert.deepEqual(authReducer(out, { type: "signedIn", user: ayse }), signedIn);
  });

  it("aynı durumu yeniden bildirmek AYNI nesneyi döndürür (gereksiz çizim yok)", () => {
    assert.equal(authReducer(signedIn, { type: "signedIn", user: { ...ayse } }), signedIn);
    const out: AuthState = { status: "signedOut", user: null };
    assert.equal(authReducer(out, { type: "signedOut" }), out);
  });

  it("farklı kullanıcıyla signedIn kullanıcıyı değiştirir", () => {
    const can: AuthUser = { ...ayse, id: "u2", displayName: "Can" };
    assert.deepEqual(authReducer(signedIn, { type: "signedIn", user: can }), { status: "signedIn", user: can });
  });

  it("userUpdated yalnız oturum açıkken ve aynı kimlikte uygulanır", () => {
    const renamed = { ...ayse, displayName: "Ayşe K." };
    assert.deepEqual(authReducer(signedIn, { type: "userUpdated", user: renamed }), { status: "signedIn", user: renamed });

    const out: AuthState = { status: "signedOut", user: null };
    assert.equal(authReducer(out, { type: "userUpdated", user: renamed }), out);
    assert.equal(authReducer(initialAuthState, { type: "userUpdated", user: renamed }), initialAuthState);
    assert.equal(authReducer(signedIn, { type: "userUpdated", user: { ...renamed, id: "baska" } }), signedIn);
  });

  it("userUpdated aynı içerikte durumu değiştirmez", () => {
    assert.equal(authReducer(signedIn, { type: "userUpdated", user: { ...ayse } }), signedIn);
  });
});

describe("kullanıcı dönüşümü", () => {
  it("API kullanıcısını oturum kullanıcısına çevirir ve fazla alanları atar", () => {
    const user = toAuthUser({ id: "u1", email: "a@b.test", displayName: "A", role: "admin", ...{ disabled: false, createdAt: "x" } });
    assert.deepEqual(user, { id: "u1", email: "a@b.test", displayName: "A", role: "admin" });
  });

  it("bilinmeyen rol en düşük yetkiye iner", () => {
    assert.equal(toAuthUser({ id: "u1", email: "a@b.test", displayName: "A", role: "root" }).role, "user");
    assert.equal(toAuthUser({ id: "u1", email: "a@b.test", displayName: "A", role: "" }).role, "user");
  });

  it("isAdminUser yalnız admin rolünde true", () => {
    assert.equal(isAdminUser({ ...ayse, role: "admin" }), true);
    assert.equal(isAdminUser(ayse), false);
    assert.equal(isAdminUser(null), false);
  });

  it("isSameUser alan alan karşılaştırır", () => {
    assert.equal(isSameUser(ayse, { ...ayse }), true);
    assert.equal(isSameUser(ayse, { ...ayse, displayName: "Başka" }), false);
    assert.equal(isSameUser(ayse, null), false);
    assert.equal(isSameUser(null, null), true);
  });
});

describe("sorgu önbelleği temizliği (regresyon: açılışta herkese açık istekler iptal edilmemeli)", () => {
  it("yalnız oturumlu durumdan çıkışta temizlenir", () => {
    assert.equal(shouldClearQueryCache("signedIn"), true);
  });

  it("açılışta (restoring) belirteç yoksa temizlenmez: sürmekte olan Keşfet/Blog istekleri iptal olmasın", () => {
    assert.equal(shouldClearQueryCache("restoring"), false);
  });

  it("zaten oturumsuzken (ör. tekrarlanan onAuthFailure) temizlenmez", () => {
    assert.equal(shouldClearQueryCache("signedOut"), false);
  });

  it("belirteçsiz açılışın durum akışı: restoring -> signedOut ve önbelleğe dokunulmaz", () => {
    const before = initialAuthState;
    const after = authReducer(before, { type: "signedOut" });
    assert.equal(after.status, "signedOut");
    assert.equal(shouldClearQueryCache(before.status), false);
  });

  it("kopyayla açılıp sunucu reddedince (signedIn -> signedOut) temizlenir", () => {
    const opened = authReducer(initialAuthState, { type: "signedIn", user: ayse });
    assert.equal(shouldClearQueryCache(opened.status), true);
  });
});
