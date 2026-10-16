import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  TOKEN_STORAGE_KEY,
  createMemoryStore,
  createTokenStorage,
  parseTokens,
  type KeyValueStore,
} from "./tokenStorageCore";

const tokens = { accessToken: "access-1", refreshToken: "refresh-1" };

/** Çağrıları geciktiren ve istenince hata veren sahte depo (sıralama ve hata yolları için). */
function createFlakyStore(options: { delayMs?: number } = {}) {
  const inner = createMemoryStore();
  const state = { failGet: false, failSet: false, failRemove: false };
  const wait = () => new Promise<void>((resolve) => setTimeout(resolve, options.delayMs ?? 0));
  const store: KeyValueStore = {
    async getItem(key) {
      await wait();
      if (state.failGet) throw new Error("okuma hatası");
      return inner.getItem(key);
    },
    async setItem(key, value) {
      await wait();
      if (state.failSet) throw new Error("yazma hatası");
      return inner.setItem(key, value);
    },
    async removeItem(key) {
      await wait();
      if (state.failRemove) throw new Error("silme hatası");
      return inner.removeItem(key);
    },
  };
  return { store, state, inner };
}

describe("parseTokens", () => {
  it("geçerli JSON'u belirteçlere çevirir", () => {
    assert.deepEqual(parseTokens(JSON.stringify(tokens)), tokens);
  });

  it("fazladan alanları atar", () => {
    assert.deepEqual(parseTokens(JSON.stringify({ ...tokens, extra: 1 })), tokens);
  });

  for (const [name, raw] of [
    ["null", null],
    ["boş metin", ""],
    ["bozuk JSON", "{kırık"],
    ["dizi", "[]"],
    ["alan eksik", JSON.stringify({ accessToken: "a" })],
    ["boş değer", JSON.stringify({ accessToken: "", refreshToken: "r" })],
    ["sayı değer", JSON.stringify({ accessToken: 1, refreshToken: "r" })],
  ] as const) {
    it(`${name} için null döner`, () => {
      assert.equal(parseTokens(raw), null);
    });
  }
});

describe("createTokenStorage", () => {
  it("boş depoda null okur", async () => {
    const storage = createTokenStorage(createMemoryStore());
    assert.equal(await storage.read(), null);
  });

  it("yazar ve okur; kalıcı depoya tek anahtarla JSON yazar", async () => {
    const store = createMemoryStore();
    const storage = createTokenStorage(store);
    assert.equal(await storage.write(tokens), true);
    assert.deepEqual(await storage.read(), tokens);
    assert.deepEqual(JSON.parse((await store.getItem(TOKEN_STORAGE_KEY)) ?? "null"), tokens);
  });

  it("yeniden açılışta (yeni örnek) kalıcı depodan geri yükler", async () => {
    const store = createMemoryStore();
    await createTokenStorage(store).write(tokens);
    assert.deepEqual(await createTokenStorage(store).read(), tokens);
  });

  it("clear bellekten ve depodan siler", async () => {
    const store = createMemoryStore();
    const storage = createTokenStorage(store);
    await storage.write(tokens);
    assert.equal(await storage.clear(), true);
    assert.equal(await storage.read(), null);
    assert.equal(await store.getItem(TOKEN_STORAGE_KEY), null);
    assert.equal(await createTokenStorage(store).read(), null);
  });

  it("yazma belirteci döndürülüp yenilenince son çifti okur", async () => {
    const storage = createTokenStorage(createMemoryStore());
    await storage.write(tokens);
    await storage.write({ accessToken: "access-2", refreshToken: "refresh-2" });
    assert.deepEqual(await storage.read(), { accessToken: "access-2", refreshToken: "refresh-2" });
  });

  it("bozuk kaydı null sayar ve depodan temizler", async () => {
    const store = createMemoryStore();
    await store.setItem(TOKEN_STORAGE_KEY, "{kırık");
    const storage = createTokenStorage(store);
    assert.equal(await storage.read(), null);
    assert.equal(await store.getItem(TOKEN_STORAGE_KEY), null);
  });

  it("geçersiz belirteci reddeder ve mevcut oturuma dokunmaz", async () => {
    const storage = createTokenStorage(createMemoryStore());
    await storage.write(tokens);
    await assert.rejects(storage.write({ accessToken: "", refreshToken: "r" }), TypeError);
    assert.deepEqual(await storage.read(), tokens);
  });

  it("depo yoksa (null) oturum bellekte yaşar", async () => {
    const storage = createTokenStorage(null);
    assert.equal(await storage.write(tokens), false);
    assert.deepEqual(await storage.read(), tokens);
    assert.equal(await storage.clear(), false);
    assert.equal(await storage.read(), null);
  });

  it("yazma hatasında false döner ama oturum bellekte kalır, fırlatmaz", async () => {
    const { store, state } = createFlakyStore();
    state.failSet = true;
    const storage = createTokenStorage(store);
    assert.equal(await storage.write(tokens), false);
    assert.deepEqual(await storage.read(), tokens);
  });

  it("silme hatasında false döner ama bellekten siler", async () => {
    const { store, state } = createFlakyStore();
    const storage = createTokenStorage(store);
    await storage.write(tokens);
    state.failRemove = true;
    assert.equal(await storage.clear(), false);
    assert.equal(await storage.read(), null);
  });

  it("okuma hatasında null döner; depo düzelince tekrar dener", async () => {
    const { store, state, inner } = createFlakyStore();
    await inner.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
    state.failGet = true;
    const storage = createTokenStorage(store);
    assert.equal(await storage.read(), null);
    state.failGet = false;
    assert.deepEqual(await storage.read(), tokens);
  });

  it("hızlı write ardından clear: eski yazma silmenin üstüne binmez", async () => {
    const { store, inner } = createFlakyStore({ delayMs: 5 });
    const storage = createTokenStorage(store);
    const pendingWrite = storage.write(tokens);
    const pendingClear = storage.clear();
    // Bellek anında güncel: çıkış yapılmış görünür.
    assert.equal(await storage.read(), null);
    await Promise.all([pendingWrite, pendingClear]);
    assert.equal(await inner.getItem(TOKEN_STORAGE_KEY), null);
  });

  it("eşzamanlı okumalar aynı sonucu verir", async () => {
    const store = createMemoryStore();
    await store.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
    const storage = createTokenStorage(store);
    const results = await Promise.all([storage.read(), storage.read(), storage.read()]);
    for (const result of results) assert.deepEqual(result, tokens);
  });
});
