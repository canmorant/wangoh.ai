import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { clamp, clampLatLng, project, roundCoord, sameLatLng, unproject, wrapLng } from "./projection";

function near(actual: number, expected: number, eps = 1e-9) {
  assert.ok(Math.abs(actual - expected) <= eps, `${actual} ≈ ${expected}`);
}

describe("project", () => {
  it("köşeler ve merkez", () => {
    assert.deepEqual(project({ lat: 90, lng: -180 }), { x: 0, y: 0 });
    assert.deepEqual(project({ lat: -90, lng: 180 }), { x: 1, y: 1 });
    assert.deepEqual(project({ lat: 0, lng: 0 }), { x: 0.5, y: 0.5 });
  });

  it("İstanbul (41, 29) ve Tokyo (35,7, 139,7) beklenen yerde", () => {
    const ist = project({ lat: 41, lng: 29 });
    near(ist.x, (29 + 180) / 360);
    near(ist.y, (90 - 41) / 180);
    const tok = project({ lat: 35.7, lng: 139.7 });
    near(tok.x, 319.7 / 360);
    near(tok.y, 54.3 / 180);
  });

  it("kutuplar ve ±180 sınırda kalır; taşan değer kıskaçlanır/sarılır", () => {
    assert.equal(project({ lat: 90, lng: 0 }).y, 0);
    assert.equal(project({ lat: -90, lng: 0 }).y, 1);
    assert.equal(project({ lat: 0, lng: 180 }).x, 1);
    assert.equal(project({ lat: 0, lng: -180 }).x, 0);
    assert.equal(project({ lat: 120, lng: 0 }).y, 0);
    assert.equal(project({ lat: -120, lng: 0 }).y, 1);
    near(project({ lat: 0, lng: 190 }).x, (-170 + 180) / 360);
  });

  it("geçersiz sayı 0'a düşer", () => {
    assert.deepEqual(project({ lat: Number.NaN, lng: Number.POSITIVE_INFINITY }), { x: 0.5, y: 0.5 });
  });
});

describe("unproject", () => {
  it("project ile gidiş-dönüş", () => {
    for (const p of [
      { lat: 41, lng: 29 },
      { lat: 35.7, lng: 139.7 },
      { lat: -33.9, lng: 151.2 },
      { lat: 0, lng: 0 },
      { lat: 89.99, lng: -179.99 },
    ]) {
      const back = unproject(project(p));
      near(back.lat, p.lat);
      near(back.lng, p.lng);
    }
  });

  it("köşeler tam sınırda", () => {
    assert.deepEqual(unproject({ x: 0, y: 0 }), { lat: 90, lng: -180 });
    assert.deepEqual(unproject({ x: 1, y: 1 }), { lat: -90, lng: 180 });
  });

  it("harita dışı (kutup ötesi / kenar ötesi) kenara kıskaçlanır", () => {
    assert.deepEqual(unproject({ x: 2, y: -3 }), { lat: 90, lng: 180 });
    assert.deepEqual(unproject({ x: -5, y: 7 }), { lat: -90, lng: -180 });
  });

  it("NaN merkeze düşer, -0 çıkmaz", () => {
    assert.deepEqual(unproject({ x: Number.NaN, y: Number.NaN }), { lat: 0, lng: 0 });
    const eq = unproject({ x: 0.5, y: 0.5 });
    assert.ok(Object.is(eq.lat, 0) && Object.is(eq.lng, 0));
  });
});

describe("yardımcılar", () => {
  it("wrapLng", () => {
    assert.equal(wrapLng(180), 180);
    assert.equal(wrapLng(-180), -180);
    assert.equal(wrapLng(190), -170);
    assert.equal(wrapLng(-190), 170);
    assert.equal(wrapLng(540), -180);
    assert.equal(wrapLng(Number.NaN), 0);
  });

  it("clamp ve clampLatLng", () => {
    assert.equal(clamp(5, 0, 3), 3);
    assert.equal(clamp(-1, 0, 3), 0);
    assert.equal(clamp(Number.NaN, 0, 3, 2), 2);
    assert.deepEqual(clampLatLng({ lat: 100, lng: -200 }), { lat: 90, lng: -180 });
    assert.deepEqual(clampLatLng({ lat: Number.NaN, lng: 5 }), { lat: 0, lng: 5 });
  });

  it("roundCoord", () => {
    assert.equal(roundCoord(41.012345), 41.0123);
    assert.equal(roundCoord(-0.00001), 0);
    assert.ok(Object.is(roundCoord(-0.00001), 0));
    assert.equal(roundCoord(Number.NaN), 0);
    assert.equal(roundCoord(1.23456, 2), 1.23);
  });

  it("sameLatLng", () => {
    assert.equal(sameLatLng(null, null), true);
    assert.equal(sameLatLng(null, undefined), true);
    assert.equal(sameLatLng({ lat: 1, lng: 2 }, null), false);
    assert.equal(sameLatLng({ lat: 1, lng: 2 }, { lat: 1, lng: 2 }), true);
    assert.equal(sameLatLng({ lat: 1, lng: 2 }, { lat: 1.1, lng: 2 }), false);
  });
});
