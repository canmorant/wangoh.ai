import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildApiClientConfig } from "./apiConfig";

const tokens = { accessToken: "a-1", refreshToken: "r-1" };

describe("buildApiClientConfig", () => {
  it("sondaki / işaretlerini atar", () => {
    const config = buildApiClientConfig({
      baseUrl: "http://localhost:3001//",
      getTokens: () => null,
      saveTokens: () => undefined,
      onAuthFailure: () => undefined,
    });
    assert.equal(config.baseUrl, "http://localhost:3001");
  });

  it("erişim ve yenileme belirteçlerini belirteç deposundan okur (eşzamanlı ve asenkron)", async () => {
    const sync = buildApiClientConfig({
      baseUrl: "http://x",
      getTokens: () => tokens,
      saveTokens: () => undefined,
      onAuthFailure: () => undefined,
    });
    assert.equal(await sync.getAccessToken(), "a-1");
    assert.equal(await sync.getRefreshToken(), "r-1");

    const asynchronous = buildApiClientConfig({
      baseUrl: "http://x",
      getTokens: async () => tokens,
      saveTokens: () => undefined,
      onAuthFailure: () => undefined,
    });
    assert.equal(await asynchronous.getAccessToken(), "a-1");
    assert.equal(await asynchronous.getRefreshToken(), "r-1");
  });

  it("oturum yoksa null döner", async () => {
    const config = buildApiClientConfig({
      baseUrl: "http://x",
      getTokens: () => null,
      saveTokens: () => undefined,
      onAuthFailure: () => undefined,
    });
    assert.equal(await config.getAccessToken(), null);
    assert.equal(await config.getRefreshToken(), null);
  });

  it("yenilenen çifti yalnız iki alanla saveTokens'a iletir", async () => {
    const saved: unknown[] = [];
    const config = buildApiClientConfig({
      baseUrl: "http://x",
      getTokens: () => tokens,
      saveTokens: (value) => {
        saved.push(value);
      },
      onAuthFailure: () => undefined,
    });
    await config.onTokensRefreshed({ accessToken: "a-2", refreshToken: "r-2" });
    assert.deepEqual(saved, [{ accessToken: "a-2", refreshToken: "r-2" }]);
  });

  it("onAuthFailure'ı olduğu gibi bağlar; fetch yalnız verilirse eklenir", () => {
    let failed = 0;
    const withoutFetch = buildApiClientConfig({
      baseUrl: "http://x",
      getTokens: () => null,
      saveTokens: () => undefined,
      onAuthFailure: () => {
        failed += 1;
      },
    });
    withoutFetch.onAuthFailure();
    assert.equal(failed, 1);
    assert.equal("fetch" in withoutFetch, false);

    const customFetch = (async () => new Response(null)) as typeof fetch;
    const withFetch = buildApiClientConfig({
      baseUrl: "http://x",
      getTokens: () => null,
      saveTokens: () => undefined,
      onAuthFailure: () => undefined,
      fetch: customFetch,
    });
    assert.equal(withFetch.fetch, customFetch);
  });
});
