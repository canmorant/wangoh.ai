import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { safeReturnTo } from "./returnTo";

describe("safeReturnTo", () => {
  it("uygulama içi yolları kabul eder (sorgu ve parça dahil)", () => {
    assert.equal(safeReturnTo("/games"), "/games");
    assert.equal(safeReturnTo("/profile/edit-name"), "/profile/edit-name");
    assert.equal(safeReturnTo("/blog/yazi?sayfa=2#baslik"), "/blog/yazi?sayfa=2#baslik");
    assert.equal(safeReturnTo("/"), "/");
  });

  it("dizi gelirse ilk değeri alır (expo-router yinelenen parametre)", () => {
    assert.equal(safeReturnTo(["/games", "/blog"]), "/games");
    assert.equal(safeReturnTo([]), null);
  });

  it("boş ya da tanımsız değerde null", () => {
    assert.equal(safeReturnTo(undefined), null);
    assert.equal(safeReturnTo(null), null);
    assert.equal(safeReturnTo(""), null);
    assert.equal(safeReturnTo("   "), null);
  });

  it("dış adres ve ağ yollarını reddeder (açık yönlendirme)", () => {
    for (const bad of ["https://kotu.example", "http://kotu.example/games", "//kotu.example", "/\\kotu.example", "javascript:alert(1)", "games", "wangoh://x"]) {
      assert.equal(safeReturnTo(bad), null, bad);
    }
  });

  it("denetim karakteri ve ters bölü içerenleri reddeder", () => {
    assert.equal(safeReturnTo("/games\nSet-Cookie: x"), null);
    assert.equal(safeReturnTo("/games\u0000"), null);
    assert.equal(safeReturnTo("/ga\\mes"), null);
  });

  it("giriş ve kayıt ekranına dönüşü (döngü) reddeder", () => {
    for (const bad of ["/login", "/register", "/login?returnTo=%2Fgames", "/(auth)/login", "/login/"]) {
      assert.equal(safeReturnTo(bad), null, bad);
    }
    assert.equal(safeReturnTo("/loginx"), "/loginx");
  });

  it("aşırı uzun değeri reddeder", () => {
    assert.equal(safeReturnTo(`/${"a".repeat(400)}`), null);
  });
});
