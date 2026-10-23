import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { AUTH_NOTICES, parseAuthNotice } from "./notices";

describe("parseAuthNotice", () => {
  it("bilinen bildirimleri kabul eder", () => {
    assert.equal(parseAuthNotice("password-changed"), "password-changed");
    assert.equal(parseAuthNotice("account-deleted"), "account-deleted");
    assert.equal(parseAuthNotice(["name-saved", "x"]), "name-saved");
  });

  it("serbest metni ve nesne anahtarlarını asla kabul etmez", () => {
    for (const bad of ["<b>merhaba</b>", "toString", "__proto__", "constructor", "", "PASSWORD-CHANGED"]) {
      assert.equal(parseAuthNotice(bad), null, bad);
    }
    assert.equal(parseAuthNotice(undefined), null);
    assert.equal(parseAuthNotice(null), null);
    assert.equal(parseAuthNotice([]), null);
  });

  it("her bildirimin metni dolu", () => {
    for (const notice of Object.values(AUTH_NOTICES)) {
      assert.ok(notice.title.length > 0 && notice.message.length > 0);
    }
  });
});
