import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { flattenPages, nextPageParam, totalOf } from "./pagination";

const page = (items: string[], pageNo: number, pageSize: number, total: number) => ({ items, page: pageNo, pageSize, total });

describe("nextPageParam", () => {
  it("toplam sayfa sayısına kadar sıradaki sayfayı verir", () => {
    assert.equal(nextPageParam(page(["a", "b"], 1, 2, 5)), 2);
    assert.equal(nextPageParam(page(["c", "d"], 2, 2, 5)), 3);
  });

  it("son sayfada undefined döner", () => {
    assert.equal(nextPageParam(page(["e"], 3, 2, 5)), undefined);
    assert.equal(nextPageParam(page(["a", "b"], 1, 2, 2)), undefined);
  });

  it("boş sayfada ve boş sonuçta durur (sonsuz istek döngüsü olmaz)", () => {
    assert.equal(nextPageParam(page([], 1, 20, 0)), undefined);
    assert.equal(nextPageParam(page([], 2, 20, 99)), undefined);
  });
});

describe("flattenPages", () => {
  it("sayfaları sırayla birleştirir", () => {
    const pages = [page(["a", "b"], 1, 2, 4), page(["c", "d"], 2, 2, 4)];
    assert.deepEqual(flattenPages(pages, (x) => x), ["a", "b", "c", "d"]);
  });

  it("sayfalar arası yinelenen anahtarı bir kez bırakır", () => {
    const pages = [page(["a", "b"], 1, 2, 4), page(["b", "c"], 2, 2, 4)];
    assert.deepEqual(flattenPages(pages, (x) => x), ["a", "b", "c"]);
  });

  it("veri yokken boş liste verir", () => {
    assert.deepEqual(flattenPages(undefined, (x: string) => x), []);
    assert.deepEqual(flattenPages([], (x: string) => x), []);
  });
});

describe("totalOf", () => {
  it("toplamı ilk sayfadan okur", () => {
    assert.equal(totalOf([page(["a"], 1, 1, 7)]), 7);
    assert.equal(totalOf(undefined), undefined);
    assert.equal(totalOf([]), undefined);
  });
});
