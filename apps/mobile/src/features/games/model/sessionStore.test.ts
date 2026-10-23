import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createResultCache } from "./resultCache";
import { createActiveSessionStore, parseSnapshot, SESSION_STORE_KEY, type KeyValueStore } from "./sessionStore";

function memoryBackend(initial: Record<string, string> = {}): KeyValueStore & { data: Map<string, string> } {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: async (key) => data.get(key) ?? null,
    setItem: async (key, value) => {
      data.set(key, value);
    },
    removeItem: async (key) => {
      data.delete(key);
    },
  };
}

describe("devam eden oturum deposu", () => {
  it("kullanıcı ve tür başına oturum kimliğini saklar ve okur", async () => {
    const backend = memoryBackend();
    const store = createActiveSessionStore(backend);
    assert.equal(await store.get("u1", "flag-quiz"), null);
    await store.set("u1", "flag-quiz", "s1");
    await store.set("u1", "map-guess", "s2");
    await store.set("u2", "flag-quiz", "s3");
    assert.equal(await store.get("u1", "flag-quiz"), "s1");
    assert.equal(await store.get("u1", "map-guess"), "s2");
    assert.equal(await store.get("u2", "flag-quiz"), "s3");
    assert.equal(await store.get("u1", "capital-quiz"), null);
  });

  it("uygulama yeniden açılınca (yeni depo örneği) kayıt kalıcı depodan gelir", async () => {
    const backend = memoryBackend();
    await createActiveSessionStore(backend).set("u1", "flag-quiz", "s1");
    const reopened = createActiveSessionStore(backend);
    assert.equal(await reopened.get("u1", "flag-quiz"), "s1");
  });

  it("clear yalnız o kullanıcının o türünü siler; son kayıt gidince anahtar kalkar", async () => {
    const backend = memoryBackend();
    const store = createActiveSessionStore(backend);
    await store.set("u1", "flag-quiz", "s1");
    await store.set("u1", "map-guess", "s2");
    await store.clear("u1", "flag-quiz");
    assert.equal(await store.get("u1", "flag-quiz"), null);
    assert.equal(await store.get("u1", "map-guess"), "s2");
    await store.clear("u1", "map-guess");
    assert.equal(backend.data.has(SESSION_STORE_KEY), false);
  });

  it("clearIfMatches başka bir oturumun kaydını silmez", async () => {
    const store = createActiveSessionStore(memoryBackend());
    await store.set("u1", "flag-quiz", "yeni");
    await store.clearIfMatches("u1", "flag-quiz", "eski");
    assert.equal(await store.get("u1", "flag-quiz"), "yeni");
    await store.clearIfMatches("u1", "flag-quiz", "yeni");
    assert.equal(await store.get("u1", "flag-quiz"), null);
  });

  it("bozuk ya da yabancı veri boş sayılır, hiçbir zaman fırlatmaz", async () => {
    assert.deepEqual(parseSnapshot(null), {});
    assert.deepEqual(parseSnapshot("{bozuk"), {});
    assert.deepEqual(parseSnapshot("[]"), {});
    assert.deepEqual(parseSnapshot(JSON.stringify({ u1: { "flag-quiz": 5, "bilinmeyen-oyun": "x", "map-guess": "ok" } })), {
      u1: { "map-guess": "ok" },
    });
    const store = createActiveSessionStore(memoryBackend({ [SESSION_STORE_KEY]: "{bozuk" }));
    assert.equal(await store.get("u1", "flag-quiz"), null);
  });

  it("kalıcı depo hata verirse oturum bellekte yaşar", async () => {
    const broken: KeyValueStore = {
      getItem: async () => {
        throw new Error("okunamıyor");
      },
      setItem: async () => {
        throw new Error("yazılamıyor");
      },
      removeItem: async () => {
        throw new Error("silinemiyor");
      },
    };
    const store = createActiveSessionStore(broken);
    await store.set("u1", "flag-quiz", "s1");
    assert.equal(await store.get("u1", "flag-quiz"), "s1");
    await store.clear("u1", "flag-quiz");
    assert.equal(await store.get("u1", "flag-quiz"), null);
  });

  it("depo hiç yoksa (null) bellekten çalışır", async () => {
    const store = createActiveSessionStore(null);
    await store.set("u1", "map-guess", "s1");
    assert.equal(await store.get("u1", "map-guess"), "s1");
  });

  it("art arda yazmalar birbirini ezmez", async () => {
    const store = createActiveSessionStore(memoryBackend());
    await Promise.all([
      store.set("u1", "flag-quiz", "a"),
      store.set("u1", "capital-quiz", "b"),
      store.set("u1", "map-guess", "c"),
    ]);
    assert.equal(await store.get("u1", "flag-quiz"), "a");
    assert.equal(await store.get("u1", "capital-quiz"), "b");
    assert.equal(await store.get("u1", "map-guess"), "c");
  });
});

describe("sonuç önbelleği", () => {
  const result = (sessionId: string) => ({
    sessionId,
    scoreId: `score-${sessionId}`,
    gameType: "flag-quiz" as const,
    score: 1200,
    correctCount: 8,
    roundsTotal: 10,
    durationMs: 60_000,
    rank: 3,
    personalBest: 1200,
    isPersonalBest: true,
  });

  it("koyar, okur; olmayanı undefined verir", () => {
    const cache = createResultCache();
    cache.put(result("s1"));
    assert.equal(cache.get("s1")?.score, 1200);
    assert.equal(cache.get("yok"), undefined);
  });

  it("en eski kayıt sınır aşılınca atılır", () => {
    const cache = createResultCache();
    for (let i = 0; i < 25; i += 1) cache.put(result(`s${i}`));
    assert.equal(cache.get("s0"), undefined);
    assert.ok(cache.get("s24"));
  });
});
