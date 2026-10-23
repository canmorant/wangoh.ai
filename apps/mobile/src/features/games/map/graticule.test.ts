import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { graticuleLines, graticulePath, graticuleStep } from "./graticule";
import { initialView, zoomAbout, type Size } from "./viewport";

const SIZE: Size = { width: 400, height: 280 };

describe("graticuleStep", () => {
  it("yakınlaştıkça sıklaşır", () => {
    assert.equal(graticuleStep(1), 30);
    assert.equal(graticuleStep(1.99), 30);
    assert.equal(graticuleStep(2), 15);
    assert.equal(graticuleStep(4), 10);
    assert.equal(graticuleStep(8), 5);
    assert.equal(graticuleStep(Number.NaN), 30);
  });
});

describe("graticuleLines", () => {
  it("1x'te 30 derecede: 11 dikey, 5 yatay çizgi; kenarlar çizgi değil", () => {
    const g = graticuleLines(initialView(SIZE), SIZE);
    assert.equal(g.xs.length, 11); // -150 … 150
    assert.equal(g.ys.length, 5); // -60 … 60
    assert.equal(g.xs[0], (30 / 360) * 400);
    // Ekvator tam ortada: y = 40 + 100
    assert.ok(g.ys.includes(140));
    // harita dikdörtgeni: 0..400 x 40..240
    assert.deepEqual([g.x0, g.x1, g.y0, g.y1], [0, 400, 40, 240]);
  });

  it("yakınlaşınca yalnız görünür çizgiler kalır", () => {
    const v = zoomAbout(initialView(SIZE), 8, { x: 232, y: 94 }, SIZE);
    const g = graticuleLines(v, SIZE);
    assert.ok(g.xs.length > 0 && g.xs.length < 15, `dikey: ${g.xs.length}`);
    assert.ok(g.ys.length > 0 && g.ys.length < 15, `yatay: ${g.ys.length}`);
    for (const x of g.xs) assert.ok(x >= 0 && x <= SIZE.width);
    for (const y of g.ys) assert.ok(y >= 0 && y <= SIZE.height);
  });

  it("boyut ölçülmediyse boş", () => {
    const g = graticuleLines({ scale: 1, tx: 0, ty: 0 }, { width: 0, height: 0 });
    assert.deepEqual([g.xs.length, g.ys.length], [0, 0]);
  });

  it("yol dizesi", () => {
    const d = graticulePath({ xs: [10.04], ys: [20], x0: 0, x1: 100, y0: 5, y1: 50 });
    assert.equal(d, "M10 5V50M0 20H100");
    assert.equal(graticulePath({ xs: [], ys: [], x0: 0, x1: 0, y0: 0, y1: 0 }), "");
  });
});
