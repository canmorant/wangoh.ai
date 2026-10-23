import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { AuthUser } from "./AuthContext";
import { USER_CACHE_KEY, createUserCache, parseCachedUser } from "./userCacheCore";
import { createMemoryStore, type KeyValueStore } from "./tokenStorageCore";

const ayse: AuthUser = { id: "u1", email: "ayse@example.test", displayName: "Ayşe", role: "user" };

describe("parseCachedUser", () => {
  it("geçerli kaydı okur", () => {
    assert.deepEqual(parseCachedUser(JSON.stringify(ayse)), ayse);
  });

  it("boş, bozuk ve eksik kayıtta null", () => {
    assert.equal(parseCachedUser(null), null);
    assert.equal(parseCachedUser(""), null);
    assert.equal(parseCachedUser("{bozuk"), null);
    assert.equal(parseCachedUser("42"), null);
    assert.equal(parseCachedUser("null"), null);
    assert.equal(parseCachedUser(JSON.stringify({ id: "u1" })), null);
    assert.equal(parseCachedUser(JSON.stringify({ id: "", email: "a@b.test", displayName: "A" })), null);
  });

  it("bilinmeyen ya da eksik rol en düşük yetkiye iner", () => {
    assert.equal(parseCachedUser(JSON.stringify({ ...ayse, role: "root" }))?.role, "user");
    assert.equal(parseCachedUser(JSON.stringify({ id: "u1", email: "a@b.test", displayName: "A" }))?.role, "user");
    assert.equal(parseCachedUser(JSON.stringify({ ...ayse, role: "admin" }))?.role, "admin");
  });

  it("fazladan alanları (ör. eski sürümden kalan) atar", () => {
    const parsed = parseCachedUser(JSON.stringify({ ...ayse, accessToken: "gizli" }));
    assert.deepEqual(parsed, ayse);
  });
});

describe("createUserCache", () => {
  it("yazar, okur ve siler", async () => {
    const cache = createUserCache(createMemoryStore());
    assert.equal(await cache.read(), null);
    await cache.write(ayse);
    assert.deepEqual(await cache.read(), ayse);
    await cache.clear();
    assert.equal(await cache.read(), null);
  });

  it("yalnız kullanıcı alanlarını saklar", async () => {
    const store = createMemoryStore();
    const cache = createUserCache(store);
    await cache.write({ ...ayse, ...{ accessToken: "sızmamalı" } } as AuthUser);
    const raw = await store.getItem(USER_CACHE_KEY);
    assert.ok(raw);
    assert.deepEqual(Object.keys(JSON.parse(raw)).sort(), ["displayName", "email", "id", "role"]);
  });

  it("depo yoksa ya da hata verirse fırlatmaz", async () => {
    const none = createUserCache(null);
    await none.write(ayse);
    await none.clear();
    assert.equal(await none.read(), null);

    const broken: KeyValueStore = {
      getItem: () => Promise.reject(new Error("okuma")),
      setItem: () => Promise.reject(new Error("yazma")),
      removeItem: () => Promise.reject(new Error("silme")),
    };
    const cache = createUserCache(broken);
    await cache.write(ayse);
    await cache.clear();
    assert.equal(await cache.read(), null);
  });

  it("bozuk kaydı okurken temizler", async () => {
    const store = createMemoryStore();
    await store.setItem(USER_CACHE_KEY, "{bozuk");
    const cache = createUserCache(store);
    assert.equal(await cache.read(), null);
    assert.equal(await store.getItem(USER_CACHE_KEY), null);
  });
});
