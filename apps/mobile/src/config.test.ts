import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { DEFAULT_API_URL, resolveApiUrl } from "./config";

describe("resolveApiUrl", () => {
  it("tanımsız ya da boşsa varsayılan adres", () => {
    assert.equal(DEFAULT_API_URL, "http://localhost:3001");
    assert.equal(resolveApiUrl(undefined), DEFAULT_API_URL);
    assert.equal(resolveApiUrl(null), DEFAULT_API_URL);
    assert.equal(resolveApiUrl(""), DEFAULT_API_URL);
    assert.equal(resolveApiUrl("   "), DEFAULT_API_URL);
  });

  it("verilen adresi kırpar ve sondaki / işaretlerini atar", () => {
    assert.equal(resolveApiUrl(" https://api.wangoh.com/ "), "https://api.wangoh.com");
    assert.equal(resolveApiUrl("http://10.0.2.2:3001///"), "http://10.0.2.2:3001");
  });
});
