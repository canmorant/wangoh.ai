import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { parseInlineBold, stripInlineBold } from "./markup";

describe("parseInlineBold", () => {
  it("işaretsiz metni tek düz parça olarak verir", () => {
    assert.deepEqual(parseInlineBold("Düz bir cümle."), [{ text: "Düz bir cümle.", bold: false }]);
  });

  it("boş metinden parça üretmez", () => {
    assert.deepEqual(parseInlineBold(""), []);
  });

  it("tek kalın parçayı ayırır", () => {
    assert.deepEqual(parseInlineBold("Önce **Shibuya** sonra Shinjuku."), [
      { text: "Önce ", bold: false },
      { text: "Shibuya", bold: true },
      { text: " sonra Shinjuku.", bold: false },
    ]);
  });

  it("birden çok kalın parçayı sırayla ayırır", () => {
    assert.deepEqual(parseInlineBold("**Kuay teow** erişte, **khao man gai** pilav."), [
      { text: "Kuay teow", bold: true },
      { text: " erişte, ", bold: false },
      { text: "khao man gai", bold: true },
      { text: " pilav.", bold: false },
    ]);
  });

  it("metnin başındaki ve sonundaki kalın parçayı korur", () => {
    assert.deepEqual(parseInlineBold("**Başta** ve **sonda**"), [
      { text: "Başta", bold: true },
      { text: " ve ", bold: false },
      { text: "sonda", bold: true },
    ]);
  });

  it("yalnız kalın metni tek kalın parça yapar", () => {
    assert.deepEqual(parseInlineBold("**hepsi kalın**"), [{ text: "hepsi kalın", bold: true }]);
  });

  it("bitişik kalın parçaları tek kalın parçada birleştirir", () => {
    assert.deepEqual(parseInlineBold("**a****b**"), [{ text: "ab", bold: true }]);
  });

  it("kapanmamış ** ayraçlarını düz metin bırakır", () => {
    assert.deepEqual(parseInlineBold("Bu **kapanmıyor"), [{ text: "Bu **kapanmıyor", bold: false }]);
    assert.deepEqual(parseInlineBold("kapanmayan** son"), [{ text: "kapanmayan** son", bold: false }]);
    assert.deepEqual(parseInlineBold("**"), [{ text: "**", bold: false }]);
  });

  it("ayraçlar soldan sağa ikişer ikişer eşleşir (web ile aynı)", () => {
    // Tek başına kalan ilk ** ikinci ** ile eşleşir; sondaki kapanışsız ** düz kalır. Hiçbir metin kaybolmaz.
    const segments = parseInlineBold("tek ** burada, **kalın** orada");
    assert.deepEqual(segments, [
      { text: "tek ", bold: false },
      { text: " burada, ", bold: true },
      { text: "kalın** orada", bold: false },
    ]);
  });

  it("boş çifti (****) metin olarak bırakır", () => {
    assert.deepEqual(parseInlineBold("önce **** sonra"), [{ text: "önce **** sonra", bold: false }]);
    assert.deepEqual(parseInlineBold("****"), [{ text: "****", bold: false }]);
  });

  it("iç içe işaretlemede web ile aynı çözümlemeyi yapar", () => {
    // `**a **b** c**`: web `<strong>` parçaları "a " ve " c", aradaki "b" düz.
    assert.deepEqual(parseInlineBold("**a **b** c**"), [
      { text: "a ", bold: true },
      { text: "b", bold: false },
      { text: " c", bold: true },
    ]);
  });

  it("üç yıldızlı kenarda içteki çifti kalın yapar, dıştaki yıldızları korur", () => {
    assert.deepEqual(parseInlineBold("***x***"), [
      { text: "*", bold: false },
      { text: "x", bold: true },
      { text: "*", bold: false },
    ]);
  });

  it("tek yıldızı düz karakter sayar (ör. *pet nit noi*)", () => {
    assert.deepEqual(parseInlineBold("de ki *pet nit noi* ve *mai pet*"), [
      { text: "de ki *pet nit noi* ve *mai pet*", bold: false },
    ]);
    // Kalın içinde tek yıldız olan çift eşleşmez (web kuralı: [^*]+).
    assert.deepEqual(parseInlineBold("**a*b**"), [{ text: "**a*b**", bold: false }]);
  });

  it("HTML'i yorumlamaz, kalın içinde bile düz metin kalır", () => {
    assert.deepEqual(parseInlineBold("<b>x</b> **<script>alert(1)</script>**"), [
      { text: "<b>x</b> ", bold: false },
      { text: "<script>alert(1)</script>", bold: true },
    ]);
  });

  it("satır sonu ve Türkçe karakterleri korur", () => {
    assert.deepEqual(parseInlineBold("İlk satır\n**İstanbul’un ışığı**\nson"), [
      { text: "İlk satır\n", bold: false },
      { text: "İstanbul’un ışığı", bold: true },
      { text: "\nson", bold: false },
    ]);
  });

  it("uzun, kapanmayan girdide hızlıdır (3000 karakter)", () => {
    const text = `**${"a".repeat(3000)}`;
    const start = Date.now();
    const result = parseInlineBold(text);
    assert.equal(Date.now() - start < 200, true);
    assert.deepEqual(result, [{ text, bold: false }]);
  });

  it("hiçbir girdide metin kaybolmaz: ayraçlar dışındaki karakterler aynen korunur", () => {
    const samples = ["A **b** c ** d **e** f", "**", "****", "***", "a*b**c***d", "**a**b**", "\n**x**\n"];
    for (const sample of samples) {
      const joined = parseInlineBold(sample)
        .map((segment) => segment.text)
        .join("");
      // Yalnız eşleşen ayraç çiftleri silinir: yıldız harici içerik ve sırası değişmez.
      assert.equal(joined.replaceAll("*", ""), sample.replaceAll("*", ""));
    }
  });
});

describe("stripInlineBold", () => {
  it("geçerli çiftlerin ayraçlarını siler", () => {
    assert.equal(stripInlineBold("**Kuay teow** erişte"), "Kuay teow erişte");
  });

  it("eşleşmeyen ayraçlara dokunmaz", () => {
    assert.equal(stripInlineBold("a ** b"), "a ** b");
  });
});
