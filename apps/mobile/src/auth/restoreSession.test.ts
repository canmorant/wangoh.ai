import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { AuthUser } from "./AuthContext";
import { authReducer, initialAuthState, type AuthAction, type AuthState } from "./authState";
import { isSessionRejected, restoreSession, type RestoreDeps } from "./restoreSession";

const ayse: AuthUser = { id: "u1", email: "ayse@example.test", displayName: "Ayşe", role: "user" };
const aysePlus: AuthUser = { ...ayse, displayName: "Ayşe K.", role: "admin" };
const tokens = { accessToken: "a", refreshToken: "r" };

const apiError = (status: number, code?: string) => Object.assign(new Error("hata"), { status, code });

interface Harness {
  deps: RestoreDeps;
  actions: AuthAction[];
  saved: AuthUser[];
  cleared: () => number;
  state: () => AuthState;
  setStale: (value: boolean) => void;
}

function harness(options: {
  tokens?: typeof tokens | null;
  cached?: AuthUser | null;
  fetchMe?: () => Promise<AuthUser>;
  timeoutMs?: number;
}): Harness {
  const actions: AuthAction[] = [];
  const saved: AuthUser[] = [];
  let clearedCount = 0;
  let state = initialAuthState;
  let stale = false;
  const deps: RestoreDeps = {
    readTokens: async () => (options.tokens === undefined ? tokens : options.tokens),
    readCachedUser: async () => options.cached ?? null,
    fetchMe: options.fetchMe ?? (async () => ayse),
    saveUser: async (user) => {
      saved.push(user);
    },
    clearSession: async () => {
      clearedCount += 1;
    },
    emit: (action) => {
      actions.push(action);
      state = authReducer(state, action);
    },
    isStale: () => stale,
    verifyTimeoutMs: options.timeoutMs ?? 50,
  };
  return { deps, actions, saved, cleared: () => clearedCount, state: () => state, setStale: (value) => (stale = value) };
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

describe("isSessionRejected", () => {
  it("401/403 ve diğer 4xx reddi gösterir", () => {
    for (const status of [400, 401, 403, 404, 410]) assert.equal(isSessionRejected(apiError(status)), true, String(status));
  });

  it("ağ, zaman aşımı, hız sınırı ve 5xx geçicidir", () => {
    for (const status of [0, 408, 429, 500, 502, 503]) assert.equal(isSessionRejected(apiError(status)), false, String(status));
  });

  it("durum kodsuz hata oturumu silmez", () => {
    assert.equal(isSessionRejected(new Error("kod hatası")), false);
    assert.equal(isSessionRejected(undefined), false);
    assert.equal(isSessionRejected("metin"), false);
  });
});

describe("restoreSession", () => {
  it("belirteç yoksa oturumsuz olur ve kalıntıyı siler", async () => {
    const h = harness({ tokens: null, cached: ayse });
    assert.equal(await restoreSession(h.deps), "none");
    assert.deepEqual(h.state(), { status: "signedOut", user: null });
    assert.equal(h.cleared(), 1);
  });

  it("belirteç + doğrulama başarılı: güncel kullanıcıyla oturum açar ve kopyayı yeniler", async () => {
    const h = harness({ fetchMe: async () => aysePlus });
    assert.equal(await restoreSession(h.deps), "verified");
    assert.deepEqual(h.state(), { status: "signedIn", user: aysePlus });
    assert.deepEqual(h.saved, [aysePlus]);
    assert.equal(h.cleared(), 0);
  });

  it("kopya varsa doğrulamadan ÖNCE oturumlu gösterir (ağ beklenmez)", async () => {
    let release: (user: AuthUser) => void = () => undefined;
    const h = harness({
      cached: ayse,
      fetchMe: () => new Promise<AuthUser>((resolve) => (release = resolve)),
      timeoutMs: 1000,
    });
    const done = restoreSession(h.deps);
    await sleep(10);
    assert.deepEqual(h.state(), { status: "signedIn", user: ayse }, "doğrulama sürerken zaten oturumlu");
    release(aysePlus);
    assert.equal(await done, "verified");
    assert.deepEqual(h.state(), { status: "signedIn", user: aysePlus });
  });

  it("sunucu reddederse (401) oturum kapanır ve kayıt silinir", async () => {
    const h = harness({ cached: ayse, fetchMe: async () => Promise.reject(apiError(401, "AUTH_TOKEN_INVALID")) });
    assert.equal(await restoreSession(h.deps), "rejected");
    assert.deepEqual(h.state(), { status: "signedOut", user: null });
    assert.equal(h.cleared(), 1);
  });

  it("ağ hatasında kopyayla oturum KORUNUR, belirteç silinmez", async () => {
    const h = harness({ cached: ayse, fetchMe: async () => Promise.reject(apiError(0, "NETWORK_ERROR")) });
    assert.equal(await restoreSession(h.deps), "unverified");
    assert.deepEqual(h.state(), { status: "signedIn", user: ayse });
    assert.equal(h.cleared(), 0);
  });

  it("5xx ve 429'da da oturum korunur", async () => {
    for (const status of [500, 503, 429]) {
      const h = harness({ cached: ayse, fetchMe: async () => Promise.reject(apiError(status)) });
      assert.equal(await restoreSession(h.deps), "unverified", String(status));
      assert.equal(h.state().status, "signedIn");
      assert.equal(h.cleared(), 0);
    }
  });

  it("kopya yok + ağ hatası: oturumsuz görünür ama belirteç korunur (yeniden denenebilir)", async () => {
    const h = harness({ cached: null, fetchMe: async () => Promise.reject(apiError(0, "NETWORK_ERROR")) });
    assert.equal(await restoreSession(h.deps), "unverified");
    assert.deepEqual(h.state(), { status: "signedOut", user: null });
    assert.equal(h.cleared(), 0);
  });

  it("zaman aşımı: beklemeden devam eder, takılma olmaz", async () => {
    const h = harness({ cached: null, fetchMe: () => new Promise<AuthUser>(() => undefined), timeoutMs: 20 });
    const started = Date.now();
    assert.equal(await restoreSession(h.deps), "unverified");
    assert.ok(Date.now() - started < 500);
    assert.deepEqual(h.state(), { status: "signedOut", user: null });
    assert.equal(h.cleared(), 0);
  });

  it("zaman aşımından sonra gelen başarılı yanıt oturumu açar", async () => {
    let release: (user: AuthUser) => void = () => undefined;
    const h = harness({ cached: null, fetchMe: () => new Promise<AuthUser>((resolve) => (release = resolve)), timeoutMs: 10 });
    assert.equal(await restoreSession(h.deps), "unverified");
    assert.equal(h.state().status, "signedOut");
    release(ayse);
    await sleep(10);
    assert.deepEqual(h.state(), { status: "signedIn", user: ayse });
    assert.deepEqual(h.saved, [ayse]);
  });

  it("zaman aşımından sonra gelen ret oturumu kapatır ve siler", async () => {
    let fail: (error: unknown) => void = () => undefined;
    const h = harness({ cached: ayse, fetchMe: () => new Promise<AuthUser>((_, reject) => (fail = reject)), timeoutMs: 10 });
    assert.equal(await restoreSession(h.deps), "unverified");
    assert.equal(h.state().status, "signedIn");
    fail(apiError(401));
    await sleep(10);
    assert.deepEqual(h.state(), { status: "signedOut", user: null });
    assert.equal(h.cleared(), 1);
  });

  it("oturum arada değiştiyse (stale) eski sonuç uygulanmaz", async () => {
    let release: (user: AuthUser) => void = () => undefined;
    const h = harness({ cached: null, fetchMe: () => new Promise<AuthUser>((resolve) => (release = resolve)), timeoutMs: 1000 });
    const done = restoreSession(h.deps);
    await sleep(5);
    h.setStale(true); // ör. kullanıcı bu sırada başka hesapla giriş yaptı
    release(ayse);
    assert.equal(await done, "stale");
    assert.deepEqual(h.actions, []);
    assert.deepEqual(h.saved, []);
  });

  it("geç gelen yanıt da stale ise uygulanmaz", async () => {
    let release: (user: AuthUser) => void = () => undefined;
    const h = harness({ cached: null, fetchMe: () => new Promise<AuthUser>((resolve) => (release = resolve)), timeoutMs: 10 });
    assert.equal(await restoreSession(h.deps), "unverified");
    h.setStale(true);
    release(ayse);
    await sleep(10);
    assert.equal(h.state().status, "signedOut");
    assert.deepEqual(h.saved, []);
  });
});
