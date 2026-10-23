import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { describePoint, describePointSpoken } from "./describePoint";

describe("describePoint", () => {
  it("kuzey-doğu, kuzey-batı, güney-doğu, güney-batı", () => {
    assert.equal(describePoint(41, 29), "Kuzey yarımküre, 41° K 29° D");
    assert.equal(describePoint(40.7, -74), "Kuzey yarımküre, 41° K 74° B");
    assert.equal(describePoint(-33.9, 151.2), "Güney yarımküre, 34° G 151° D");
    assert.equal(describePoint(-34.6, -58.4), "Güney yarımküre, 35° G 58° B");
  });

  it("derece tam sayıya yuvarlanır (Tokyo)", () => {
    assert.equal(describePoint(35.7, 139.7), "Kuzey yarımküre, 36° K 140° D");
  });

  it("ekvator ve başlangıç meridyeninde yön harfi yok", () => {
    assert.equal(describePoint(0, 29), "Ekvator, 0° 29° D");
    assert.equal(describePoint(51.5, 0), "Kuzey yarımküre, 52° K 0°");
    assert.equal(describePoint(0, 0), "Ekvator, 0° 0°");
    // Yuvarlamayla 0'a inen küçük değerler de aynı: -0,4 → "0°", yön yok.
    assert.equal(describePoint(-0.4, 0.3), "Ekvator, 0° 0°");
  });

  it("kutuplar ve ±180", () => {
    assert.equal(describePoint(90, 0), "Kuzey yarımküre, 90° K 0°");
    assert.equal(describePoint(-90, 180), "Güney yarımküre, 90° G 180° D");
    assert.equal(describePoint(0, -180), "Ekvator, 0° 180° B");
  });

  it("aralık dışı ve geçersiz değerler kıskaçlanır", () => {
    assert.equal(describePoint(120, 200), "Kuzey yarımküre, 90° K 180° D");
    assert.equal(describePoint(Number.NaN, Number.NaN), "Ekvator, 0° 0°");
  });
});

describe("describePointSpoken", () => {
  it("harf kısaltması yerine tam sözcük", () => {
    assert.equal(describePointSpoken(41, 29), "Kuzey yarımküre, 41 derece kuzey, 29 derece doğu");
    assert.equal(describePointSpoken(-34.6, -58.4), "Güney yarımküre, 35 derece güney, 58 derece batı");
    assert.equal(describePointSpoken(0, 0), "Ekvator, 0 derece, 0 derece");
  });
});
