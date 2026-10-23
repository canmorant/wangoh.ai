import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  DOUBLE_TAP_MAX_DISTANCE,
  DOUBLE_TAP_MAX_INTERVAL_MS,
  GestureTracker,
  TAP_SLOP,
  distance,
  exceedsSlop,
  isDoubleTap,
  midpoint,
} from "./gestures";
import { fromScreen, initialView, zoomAbout, type Size } from "./viewport";

const SIZE: Size = { width: 400, height: 280 };
const V1 = initialView(SIZE);

function near(actual: number, expected: number, eps = 1e-6) {
  assert.ok(Math.abs(actual - expected) <= eps, `${actual} ≈ ${expected}`);
}

describe("yardımcılar", () => {
  it("mesafe, orta nokta, eşik", () => {
    assert.equal(distance({ x: 0, y: 0 }, { x: 3, y: 4 }), 5);
    assert.deepEqual(midpoint({ x: 0, y: 0 }, { x: 10, y: 20 }), { x: 5, y: 10 });
    assert.equal(exceedsSlop({ x: 0, y: 0 }, { x: TAP_SLOP, y: 0 }), false);
    assert.equal(exceedsSlop({ x: 0, y: 0 }, { x: TAP_SLOP + 0.5, y: 0 }), true);
  });

  it("isDoubleTap: süre ve mesafe sınırları", () => {
    const first = { point: { x: 100, y: 100 }, time: 1000 };
    assert.equal(isDoubleTap(null, first), false);
    assert.equal(isDoubleTap(first, { point: { x: 105, y: 100 }, time: 1000 + DOUBLE_TAP_MAX_INTERVAL_MS }), true);
    assert.equal(isDoubleTap(first, { point: { x: 105, y: 100 }, time: 1001 + DOUBLE_TAP_MAX_INTERVAL_MS }), false);
    assert.equal(isDoubleTap(first, { point: { x: 100 + DOUBLE_TAP_MAX_DISTANCE + 1, y: 100 }, time: 1100 }), false);
    assert.equal(isDoubleTap(first, { point: { x: 100, y: 100 }, time: 900 }), false);
  });
});

describe("GestureTracker: dokunma ve sürükleme ayrımı", () => {
  it("hareketsiz basıp kaldırma işaretlemedir", () => {
    const g = new GestureTracker();
    g.begin([{ x: 100, y: 100 }], V1);
    assert.deepEqual(g.end({ x: 100, y: 100 }, 1000), { kind: "tap", point: { x: 100, y: 100 } });
    assert.equal(g.isActive, false);
  });

  it("eşik içindeki titreme hâlâ dokunmadır ve görünümü oynatmaz", () => {
    const g = new GestureTracker();
    const v = zoomAbout(V1, 3, { x: 200, y: 140 }, SIZE);
    g.begin([{ x: 100, y: 100 }], v);
    assert.deepEqual(g.move([{ x: 106, y: 104 }], SIZE), v);
    assert.deepEqual(g.move([{ x: 100 + TAP_SLOP, y: 100 }], SIZE), v);
    assert.equal(g.isDragging, false);
    assert.equal(g.end({ x: 106, y: 104 }, 1000).kind, "tap");
  });

  it("eşiği aşan hareket sürüklemedir: görünüm kayar, işaretleme olmaz", () => {
    const g = new GestureTracker();
    const v = zoomAbout(V1, 3, { x: 200, y: 140 }, SIZE);
    g.begin([{ x: 100, y: 100 }], v);
    // eşiği aşan ilk hareket kaydırmayı başlatır ama sıçratmaz
    assert.deepEqual(g.move([{ x: 120, y: 100 }], SIZE), v);
    assert.equal(g.isDragging, true);
    const moved = g.move([{ x: 150, y: 110 }], SIZE);
    near(moved.tx, v.tx + 30);
    near(moved.ty, v.ty + 10);
    assert.deepEqual(g.end({ x: 150, y: 110 }, 1000), { kind: "none" });
  });

  it("sürükleme harita dışına taşırmaz", () => {
    const g = new GestureTracker();
    const v = zoomAbout(V1, 2, { x: 200, y: 140 }, SIZE);
    g.begin([{ x: 100, y: 100 }], v);
    g.move([{ x: 130, y: 100 }], SIZE);
    const moved = g.move([{ x: 2000, y: 2000 }], SIZE);
    assert.equal(moved.tx, 0);
    assert.equal(moved.ty, 0);
  });

  it("1x'te sürükleme görünümü değiştirmez", () => {
    const g = new GestureTracker();
    g.begin([{ x: 100, y: 100 }], V1);
    g.move([{ x: 150, y: 100 }], SIZE);
    assert.deepEqual(g.move([{ x: 220, y: 160 }], SIZE), V1);
    assert.equal(g.end(null, 10).kind, "none");
  });

  it("konum bilinmiyorsa (end(null)) son bilinen konum kullanılır", () => {
    const g = new GestureTracker();
    g.begin([{ x: 50, y: 60 }], V1);
    g.move([{ x: 52, y: 61 }], SIZE);
    assert.deepEqual(g.end(null, 5), { kind: "tap", point: { x: 52, y: 61 } });
  });

  it("boş begin sonrası ilk bilinen konum başlangıç sayılır", () => {
    const g = new GestureTracker();
    g.begin([], V1);
    g.move([{ x: 300, y: 200 }], SIZE);
    assert.equal(g.isDragging, false);
    assert.equal(g.end({ x: 300, y: 200 }, 5).kind, "tap");
  });

  it("iptal edilen hareket işaretlemez ve çift dokunmayı sıfırlar", () => {
    const g = new GestureTracker();
    g.begin([{ x: 10, y: 10 }], V1);
    assert.equal(g.end({ x: 10, y: 10 }, 100).kind, "tap");
    g.begin([{ x: 10, y: 10 }], V1);
    g.cancel();
    assert.equal(g.isActive, false);
    assert.equal(g.end({ x: 10, y: 10 }, 200).kind, "none");
    g.begin([{ x: 10, y: 10 }], V1);
    assert.equal(g.end({ x: 10, y: 10 }, 250).kind, "tap");
  });
});

describe("GestureTracker: çift dokunma", () => {
  function tap(g: GestureTracker, x: number, y: number, t: number) {
    g.begin([{ x, y }], V1);
    return g.end({ x, y }, t);
  }

  it("iki hızlı yakın dokunma: ikincisi çift dokunma, üçüncüsü yeniden dokunma", () => {
    const g = new GestureTracker();
    assert.equal(tap(g, 100, 100, 1000).kind, "tap");
    assert.deepEqual(tap(g, 104, 98, 1200), { kind: "doubleTap", point: { x: 104, y: 98 } });
    assert.equal(tap(g, 104, 98, 1300).kind, "tap");
  });

  it("yavaş ya da uzak ikinci dokunma çift sayılmaz", () => {
    const g = new GestureTracker();
    tap(g, 100, 100, 1000);
    assert.equal(tap(g, 100, 100, 1000 + DOUBLE_TAP_MAX_INTERVAL_MS + 50).kind, "tap");
    tap(g, 100, 100, 5000);
    assert.equal(tap(g, 100 + DOUBLE_TAP_MAX_DISTANCE + 10, 100, 5100).kind, "tap");
  });

  it("araya sürükleme girerse çift dokunma kaybolur", () => {
    const g = new GestureTracker();
    tap(g, 100, 100, 1000);
    g.begin([{ x: 100, y: 100 }], V1);
    g.move([{ x: 160, y: 100 }], SIZE);
    g.end({ x: 160, y: 100 }, 1100);
    assert.equal(tap(g, 100, 100, 1150).kind, "tap");
  });
});

describe("GestureTracker: iki parmakla kıstırma", () => {
  const a0 = { x: 150, y: 140 };
  const b0 = { x: 250, y: 140 };

  it("mesafe iki katına çıkınca 2x; orta nokta altındaki konum yerinde", () => {
    const g = new GestureTracker();
    g.begin([a0, b0], V1);
    assert.equal(g.isDragging, true);
    const before = fromScreen(midpoint(a0, b0), V1, SIZE)!;
    const v = g.move([{ x: 100, y: 140 }, { x: 300, y: 140 }], SIZE);
    assert.equal(v.scale, 2);
    const after = fromScreen({ x: 200, y: 140 }, v, SIZE)!;
    near(after.lat, before.lat);
    near(after.lng, before.lng);
    assert.deepEqual(g.end(null, 100), { kind: "none" });
  });

  it("tek parmakla başlayıp ikinci parmak gelince sıçrama olmaz", () => {
    const g = new GestureTracker();
    const v0 = zoomAbout(V1, 3, { x: 200, y: 140 }, SIZE);
    g.begin([{ x: 100, y: 100 }], v0);
    const v1 = g.move([{ x: 100, y: 100 }, { x: 200, y: 100 }], SIZE);
    assert.deepEqual(v1, v0);
    assert.equal(g.isDragging, true);
    const v2 = g.move([{ x: 100, y: 100 }, { x: 300, y: 100 }], SIZE);
    assert.equal(v2.scale, 6);
  });

  it("iki parmaktan biri kalkınca kalan parmakla kaydırma sıçramadan sürer, işaretlenmez", () => {
    const g = new GestureTracker();
    const v0 = zoomAbout(V1, 4, { x: 200, y: 140 }, SIZE);
    g.begin([a0, b0], v0);
    const pinched = g.move([{ x: 140, y: 140 }, { x: 260, y: 140 }], SIZE);
    const single = g.move([{ x: 140, y: 140 }], SIZE);
    assert.deepEqual(single, pinched);
    const panned = g.move([{ x: 160, y: 150 }], SIZE);
    near(panned.tx, pinched.tx + 20);
    near(panned.ty, pinched.ty + 10);
    assert.equal(g.end({ x: 160, y: 150 }, 500).kind, "none");
  });

  it("iki parmak aynı noktadaysa (sıfır mesafe) ölçek değişmez, NaN çıkmaz", () => {
    const g = new GestureTracker();
    const v0 = zoomAbout(V1, 2, { x: 200, y: 140 }, SIZE);
    g.begin([{ x: 200, y: 140 }, { x: 200, y: 140 }], v0);
    const v = g.move([{ x: 210, y: 140 }, { x: 250, y: 140 }], SIZE);
    assert.equal(v.scale, 2);
    assert.ok(Number.isFinite(v.tx) && Number.isFinite(v.ty));
  });

  it("ikiden fazla parmak: ilk ikisi kullanılır", () => {
    const g = new GestureTracker();
    g.begin([a0, b0, { x: 10, y: 10 }], V1);
    const v = g.move([{ x: 100, y: 140 }, { x: 300, y: 140 }, { x: 5, y: 5 }], SIZE);
    assert.equal(v.scale, 2);
  });
});
