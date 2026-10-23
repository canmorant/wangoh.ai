import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  MAX_SCALE,
  MIN_SCALE,
  centerOf,
  clampScale,
  clampView,
  doubleTapView,
  fitView,
  fromScreen,
  hasArea,
  initialView,
  isInitialView,
  panView,
  pathMatrix,
  pinchView,
  toScreen,
  worldRect,
  worldSize,
  zoomAbout,
  zoomBy,
  type Size,
  type View,
} from "./viewport";

const SIZE: Size = { width: 400, height: 280 };

function near(actual: number, expected: number, eps = 1e-6) {
  assert.ok(Math.abs(actual - expected) <= eps, `${actual} ≈ ${expected}`);
}

describe("worldSize / initialView", () => {
  it("geniş kapsayıcıda yüksekliğe, dar olanda genişliğe sığar (2:1)", () => {
    assert.deepEqual(worldSize({ width: 400, height: 280 }), { width: 400, height: 200 });
    assert.deepEqual(worldSize({ width: 800, height: 200 }), { width: 400, height: 200 });
  });

  it("geçersiz boyut 0x0", () => {
    assert.deepEqual(worldSize({ width: 0, height: 280 }), { width: 0, height: 0 });
    assert.deepEqual(worldSize({ width: Number.NaN, height: 280 }), { width: 0, height: 0 });
    assert.equal(hasArea({ width: 10, height: 0 }), false);
    assert.equal(hasArea(SIZE), true);
  });

  it("1x'te dünya ortalanır", () => {
    assert.deepEqual(initialView(SIZE), { scale: 1, tx: 0, ty: 40 });
    assert.deepEqual(initialView({ width: 800, height: 200 }), { scale: 1, tx: 200, ty: 0 });
    assert.equal(isInitialView(initialView(SIZE), SIZE), true);
    assert.equal(isInitialView({ scale: 2, tx: 0, ty: 0 }, SIZE), false);
  });

  it("boyut ölçülmeden hesap patlamaz", () => {
    const zero = { width: 0, height: 0 };
    assert.deepEqual(initialView(zero), { scale: 1, tx: 0, ty: 0 });
    assert.equal(fromScreen({ x: 10, y: 10 }, { scale: 1, tx: 0, ty: 0 }, zero), null);
    const z = zoomAbout({ scale: 1, tx: 0, ty: 0 }, 3, { x: 0, y: 0 }, zero);
    assert.ok(Number.isFinite(z.tx) && Number.isFinite(z.ty));
  });
});

describe("clampView / panView", () => {
  it("ölçek 1x–8x arasına kıskaçlanır; NaN 1x olur", () => {
    assert.equal(clampScale(0.2), MIN_SCALE);
    assert.equal(clampScale(100), MAX_SCALE);
    assert.equal(clampScale(Number.NaN), MIN_SCALE);
    assert.equal(clampView({ scale: 100, tx: 0, ty: 0 }, SIZE).scale, 8);
    assert.equal(clampView({ scale: 0, tx: 0, ty: 0 }, SIZE).scale, 1);
  });

  it("1x'te kaydırma etkisizdir (içerik görünüme tam sığar / ortalı)", () => {
    const v = panView(initialView(SIZE), 120, -90, SIZE);
    assert.deepEqual(v, initialView(SIZE));
  });

  it("yakınlaşmış görünüm harita dışına kayamaz", () => {
    // 2x: dünya 800x400; görünüm 400x280 → tx ∈ [-400, 0], ty ∈ [-120, 0]
    const base: View = { scale: 2, tx: -100, ty: -50 };
    assert.deepEqual(panView(base, 1000, 1000, SIZE), { scale: 2, tx: 0, ty: 0 });
    assert.deepEqual(panView(base, -1000, -1000, SIZE), { scale: 2, tx: -400, ty: -120 });
    assert.deepEqual(panView(base, 10, 5, SIZE), { scale: 2, tx: -90, ty: -45 });
  });

  it("bir eksen görünümden küçükken (yatay yeterli, dikey değil) o eksen ortalanır", () => {
    // 1.2x: dünya 480x240; yüksekliğe sığıyor (240 < 280) → dikey ortalı; yatay 480 > 400 kayar
    const v = clampView({ scale: 1.2, tx: -999, ty: 999 }, SIZE);
    near(v.tx, -80);
    near(v.ty, 20);
  });

  it("NaN öteleme ortaya düşer", () => {
    const v = clampView({ scale: 1, tx: Number.NaN, ty: Number.NaN }, SIZE);
    assert.deepEqual(v, { scale: 1, tx: 0, ty: 40 });
  });
});

describe("dokunma → enlem-boylam (fromScreen) ve toScreen", () => {
  const v1 = initialView(SIZE);

  it("1x: merkez, köşeler ve bilinen noktalar piksel hesabıyla", () => {
    const c = fromScreen({ x: 200, y: 140 }, v1, SIZE)!;
    near(c.lat, 0);
    near(c.lng, 0);
    // sol üst (0, 40) = (90, -180); sağ alt (400, 240) = (-90, 180)
    assert.deepEqual(fromScreen({ x: 0, y: 40 }, v1, SIZE), { lat: 90, lng: -180 });
    assert.deepEqual(fromScreen({ x: 400, y: 240 }, v1, SIZE), { lat: -90, lng: 180 });
    // İstanbul (41, 29): x = 209/360*400, y = 40 + 49/180*200
    const ist = toScreen({ lat: 41, lng: 29 }, v1, SIZE);
    near(ist.x, (209 / 360) * 400);
    near(ist.y, 40 + (49 / 180) * 200);
    const back = fromScreen(ist, v1, SIZE)!;
    near(back.lat, 41);
    near(back.lng, 29);
  });

  it("kutup ötesi dokunuş kıskaçlanır", () => {
    assert.equal(fromScreen({ x: 200, y: 0 }, v1, SIZE)!.lat, 90);
    assert.equal(fromScreen({ x: 200, y: 279 }, v1, SIZE)!.lat, -90);
    assert.equal(fromScreen({ x: -50, y: 140 }, v1, SIZE)!.lng, -180);
    assert.equal(fromScreen({ x: 450, y: 140 }, v1, SIZE)!.lng, 180);
  });

  it("yakınlaştırma ve kaydırma sonrası da doğru", () => {
    const view = zoomAbout(v1, 4, { x: 232, y: 94 }, SIZE); // İstanbul civarı
    for (const p of [
      { lat: 41, lng: 29 },
      { lat: 35.7, lng: 139.7 },
      { lat: -33.9, lng: 151.2 },
      { lat: 0, lng: 0 },
    ]) {
      const screen = toScreen(p, view, SIZE);
      const back = fromScreen(screen, view, SIZE)!;
      near(back.lat, p.lat, 1e-9);
      near(back.lng, p.lng, 1e-9);
    }
    const panned = panView(view, -73, 41, SIZE);
    const p = { lat: 48.85, lng: 2.35 };
    const back = fromScreen(toScreen(p, panned, SIZE), panned, SIZE)!;
    near(back.lat, p.lat, 1e-9);
    near(back.lng, p.lng, 1e-9);
  });
});

describe("zoomAbout / zoomBy / doubleTapView", () => {
  const v1 = initialView(SIZE);

  it("odak noktasının altındaki konum yakınlaşırken yerinde kalır", () => {
    const focal = { x: 300, y: 100 };
    const before = fromScreen(focal, v1, SIZE)!;
    const zoomed = zoomAbout(v1, 3, focal, SIZE);
    assert.equal(zoomed.scale, 3);
    const after = fromScreen(focal, zoomed, SIZE)!;
    near(after.lat, before.lat, 1e-9);
    near(after.lng, before.lng, 1e-9);
  });

  it("sınırlar: 8x'ten fazlası 8x, 1x'ten azı başlangıç görünümü", () => {
    const max = zoomAbout(v1, 50, { x: 10, y: 50 }, SIZE);
    assert.equal(max.scale, MAX_SCALE);
    const out = zoomAbout(max, 0.01, { x: 10, y: 50 }, SIZE);
    assert.deepEqual(out, v1);
  });

  it("kenara yakın odakta harita dışına taşmaz", () => {
    const z = zoomAbout(v1, 8, { x: 0, y: 40 }, SIZE); // sol üst köşe
    assert.equal(z.tx, 0);
    assert.equal(z.ty, 0);
    const z2 = zoomAbout(v1, 8, { x: 400, y: 240 }, SIZE); // sağ alt
    near(z2.tx, 400 - 3200);
    near(z2.ty, 280 - 1600);
  });

  it("zoomBy çarpanı; geçersiz çarpan etkisiz", () => {
    assert.equal(zoomBy(v1, 2, centerOf(SIZE), SIZE).scale, 2);
    assert.equal(zoomBy(v1, 0, centerOf(SIZE), SIZE).scale, 1);
    assert.equal(zoomBy(v1, Number.NaN, centerOf(SIZE), SIZE).scale, 1);
    assert.equal(zoomBy({ scale: 8, tx: -100, ty: -100 }, 2, centerOf(SIZE), SIZE).scale, 8);
  });

  it("çift dokunma: 2x; en yakındaysa sıfırla", () => {
    const d = doubleTapView(v1, { x: 200, y: 140 }, SIZE);
    assert.equal(d.scale, 2);
    const max = zoomAbout(v1, 8, { x: 200, y: 140 }, SIZE);
    assert.deepEqual(doubleTapView(max, { x: 200, y: 140 }, SIZE), v1);
  });
});

describe("pinchView (kıstırma)", () => {
  const v1 = initialView(SIZE);

  it("mesafe iki katına çıkınca ölçek 2x, orta nokta yerinde", () => {
    const mid = { x: 250, y: 120 };
    const anchorDist = 100;
    const before = fromScreen(mid, v1, SIZE)!;
    const v = pinchView(v1, mid, anchorDist, mid, 200, SIZE);
    assert.equal(v.scale, 2);
    const after = fromScreen(mid, v, SIZE)!;
    near(after.lat, before.lat, 1e-9);
    near(after.lng, before.lng, 1e-9);
  });

  it("orta nokta kayarsa görünüm de kayar (yakınlaşmış durumda)", () => {
    const zoomed = zoomAbout(v1, 4, centerOf(SIZE), SIZE);
    const anchorMid = { x: 200, y: 140 };
    const moved = pinchView(zoomed, anchorMid, 120, { x: 230, y: 150 }, 120, SIZE);
    assert.equal(moved.scale, 4);
    near(moved.tx, zoomed.tx + 30);
    near(moved.ty, zoomed.ty + 10);
  });

  it("ölçek sınırı: kıstırma 8x'i aşmaz, 1x'in altına inmez", () => {
    assert.equal(pinchView(v1, { x: 200, y: 140 }, 10, { x: 200, y: 140 }, 10000, SIZE).scale, 8);
    const out = pinchView(zoomAbout(v1, 4, centerOf(SIZE), SIZE), { x: 200, y: 140 }, 400, { x: 200, y: 140 }, 1, SIZE);
    assert.equal(out.scale, 1);
    assert.deepEqual(out, v1);
  });

  it("sıfır başlangıç mesafesi (sıfıra bölme) yalnız kaydırır, NaN üretmez", () => {
    const zoomed = zoomAbout(v1, 2, centerOf(SIZE), SIZE);
    const v = pinchView(zoomed, { x: 200, y: 140 }, 0, { x: 210, y: 140 }, 50, SIZE);
    assert.equal(v.scale, 2);
    assert.ok(Number.isFinite(v.tx) && Number.isFinite(v.ty));
    near(v.tx, zoomed.tx + 10);
    const nan = pinchView(zoomed, { x: 200, y: 140 }, 100, { x: 200, y: 140 }, Number.NaN, SIZE);
    assert.equal(nan.scale, 2);
  });
});

describe("fitView", () => {
  it("konum yoksa başlangıç görünümü", () => {
    assert.deepEqual(fitView([], SIZE), initialView(SIZE));
  });

  it("tek nokta: en çok 4x ve nokta merkezde (kenar sınırı elverdiği ölçüde)", () => {
    const v = fitView([{ lat: 41, lng: 29 }], SIZE);
    assert.equal(v.scale, 4);
    const p = toScreen({ lat: 41, lng: 29 }, v, SIZE);
    near(p.x, 200, 1e-6);
    near(p.y, 140, 1e-6);
  });

  it("uzak iki nokta tüm dünyayı gösterir", () => {
    const v = fitView(
      [
        { lat: 60, lng: -170 },
        { lat: -40, lng: 170 },
      ],
      SIZE,
    );
    assert.equal(v.scale, 1);
  });

  it("yakın iki nokta: ikisi de görünümde ve ölçek > 1", () => {
    const a = { lat: 41, lng: 29 };
    const b = { lat: 48.85, lng: 2.35 };
    const v = fitView([a, b], SIZE);
    assert.ok(v.scale > 1);
    for (const p of [a, b]) {
      const s = toScreen(p, v, SIZE);
      assert.ok(s.x >= 0 && s.x <= SIZE.width && s.y >= 0 && s.y <= SIZE.height, `${JSON.stringify(s)} görünümde`);
    }
  });
});

describe("worldRect / pathMatrix", () => {
  it("1x'te dünya dikdörtgeni ve yol matrisi", () => {
    const v = initialView(SIZE);
    assert.deepEqual(worldRect(v, SIZE), { x: 0, y: 40, width: 400, height: 200 });
    const m = pathMatrix(v, SIZE, 7200);
    near(m[0], 400 / 7200);
    assert.deepEqual([m[1], m[2], m[3] === m[0] ? 0 : m[3], m[4], m[5]], [0, 0, 0, 0, 40]);
    const z = pathMatrix({ scale: 4, tx: -10, ty: -20 }, SIZE, 7200);
    near(z[0], (400 * 4) / 7200);
    assert.deepEqual([z[4], z[5]], [-10, -20]);
    assert.deepEqual(pathMatrix(v, SIZE, 0), [0, 0, 0, 0, 0, 40]);
  });
});
