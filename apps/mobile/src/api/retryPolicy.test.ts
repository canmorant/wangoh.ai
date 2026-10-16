import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createQueryClient, QUERY_STALE_TIME_MS } from "./queryClient";
import { MAX_QUERY_RETRIES, retryDelay, shouldRetry } from "./retryPolicy";

const httpError = (status: number) => Object.assign(new Error(`HTTP ${status}`), { status });

describe("shouldRetry", () => {
  it("ağ hatasını (status 0) yeniden dener", () => {
    assert.equal(shouldRetry(0, httpError(0)), true);
  });

  for (const status of [500, 502, 503, 504]) {
    it(`${status} yeniden denenir`, () => {
      assert.equal(shouldRetry(0, httpError(status)), true);
    });
  }

  for (const status of [400, 401, 403, 404, 409, 422, 429]) {
    it(`${status} (4xx) denenmez`, () => {
      assert.equal(shouldRetry(0, httpError(status)), false);
    });
  }

  it("durum kodu olmayan hata (kod hatası) denenmez", () => {
    assert.equal(shouldRetry(0, new TypeError("undefined is not a function")), false);
  });

  it("üst sınırdan sonra durur", () => {
    assert.equal(shouldRetry(MAX_QUERY_RETRIES - 1, httpError(503)), true);
    assert.equal(shouldRetry(MAX_QUERY_RETRIES, httpError(503)), false);
  });
});

describe("retryDelay", () => {
  it("üstel artar ve 8 sn'de sınırlanır", () => {
    assert.equal(retryDelay(0), 1000);
    assert.equal(retryDelay(1), 2000);
    assert.equal(retryDelay(2), 4000);
    assert.equal(retryDelay(3), 8000);
    assert.equal(retryDelay(10), 8000);
  });
});

describe("createQueryClient", () => {
  it("sorgu varsayılanları: bayatlama süresi, yeniden deneme politikası", () => {
    const options = createQueryClient().getDefaultOptions();
    assert.equal(options.queries?.staleTime, QUERY_STALE_TIME_MS);
    assert.equal(options.queries?.retry, shouldRetry);
    assert.equal(options.queries?.retryDelay, retryDelay);
  });

  it("yazma işlemleri asla otomatik tekrarlanmaz", () => {
    assert.equal(createQueryClient().getDefaultOptions().mutations?.retry, false);
  });

  it("her çağrı yeni, bağımsız istemci üretir", () => {
    assert.notEqual(createQueryClient(), createQueryClient());
  });
});
