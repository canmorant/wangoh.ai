import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { sanitizeBlocks, bodyWordCount } from "./blockModel";
import { hasForbiddenChars, isBlankText, isHttpsUrl, normalizeTag } from "./contentRules";
import { capitalizeTr, countWords, formatDateTimeTr, formatDateTr, readingMinutes, tagLabel } from "./format";
import { flattenPages, nextPageNumber, totalOf } from "./pagination";
import { collectTags } from "./tags";

describe("formatDateTr", () => {
  it("Türkçe ay adıyla biçimler", () => {
    assert.equal(formatDateTr("2026-10-22T12:00:00.000Z", { utc: true }), "22 Ekim 2026");
    assert.equal(formatDateTr("2026-01-01T00:00:00.000Z", { utc: true }), "1 Ocak 2026");
    assert.equal(formatDateTr("2026-12-31T23:59:59.000Z", { utc: true }), "31 Aralık 2026");
  });

  it("boş ve geçersiz girdide boş metin", () => {
    assert.equal(formatDateTr(null), "");
    assert.equal(formatDateTr(undefined), "");
    assert.equal(formatDateTr(""), "");
    assert.equal(formatDateTr("dün"), "");
  });

  it("tarih ve saat", () => {
    assert.equal(formatDateTimeTr("2026-10-22T14:05:00.000Z", { utc: true }), "22 Eki 2026 14:05");
    assert.equal(formatDateTimeTr("2026-03-04T03:09:00.000Z", { utc: true }), "4 Mar 2026 03:09");
    assert.equal(formatDateTimeTr("x"), "");
  });
});

describe("tagLabel", () => {
  it("kıta etiketini API'den gelen adla gösterir", () => {
    assert.equal(tagLabel("europe", { europe: "Avrupa" }), "Avrupa");
  });

  it("diğer etiketleri okunur yapar", () => {
    assert.equal(tagLabel("ülke-rehberi"), "Ülke rehberi");
    assert.equal(tagLabel("istanbul"), "İstanbul");
    assert.equal(tagLabel("ığdır"), "Iğdır");
    assert.equal(tagLabel("a--b"), "A b");
    assert.equal(tagLabel("europe", {}), "Europe");
    assert.equal(tagLabel(""), "");
  });

  it("capitalizeTr Türkçe i/ı kurallarını uygular", () => {
    assert.equal(capitalizeTr("iyi"), "İyi");
    assert.equal(capitalizeTr("ışık"), "Işık");
    assert.equal(capitalizeTr("çay"), "Çay");
  });
});

describe("okuma süresi", () => {
  it("kelime sayar", () => {
    assert.equal(countWords(""), 0);
    assert.equal(countWords("  bir  iki\nüç\t"), 3);
  });

  it("en az 1 dakika, 200 kelime/dk", () => {
    assert.equal(readingMinutes(0), 1);
    assert.equal(readingMinutes(150), 1);
    assert.equal(readingMinutes(450), 2);
    assert.equal(readingMinutes(1000), 5);
  });

  it("gövde kelime sayısı başlık, paragraf, liste ve alıntıyı sayar; görseli saymaz", () => {
    assert.equal(
      bodyWordCount([
        { type: "heading", level: 2, text: "bir iki" },
        { type: "paragraph", text: "üç dört beş" },
        { type: "list", ordered: false, items: ["altı", "yedi sekiz"] },
        { type: "quote", text: "dokuz" },
        { type: "image", url: "https://x.co/a.png", alt: "on on bir" },
      ]),
      9,
    );
  });
});

describe("sayfalama", () => {
  const page = (ids: string[], p: number, total: number, pageSize = 2) => ({ items: ids.map((id) => ({ id })), page: p, pageSize, total });

  it("sonraki sayfa numarasını verir, sonda undefined", () => {
    assert.equal(nextPageNumber(page(["a", "b"], 1, 5)), 2);
    assert.equal(nextPageNumber(page(["e"], 3, 5)), undefined);
    assert.equal(nextPageNumber(page(["c", "d"], 2, 4)), undefined);
  });

  it("boş sayfada durur (sonsuz döngü yok)", () => {
    assert.equal(nextPageNumber(page([], 1, 99)), undefined);
  });

  it("sayfaları birleştirir ve yinelenenleri atar", () => {
    const pages = [page(["a", "b"], 1, 4), page(["b", "c"], 2, 4)];
    assert.deepEqual(
      flattenPages(pages).map((x) => x.id),
      ["a", "b", "c"],
    );
    assert.deepEqual(flattenPages(undefined), []);
    assert.deepEqual(flattenPages([]), []);
  });

  it("toplamı son sayfadan okur", () => {
    assert.equal(totalOf([page(["a"], 1, 10), page(["b"], 2, 9)]), 9);
    assert.equal(totalOf(undefined), 0);
    assert.equal(totalOf([]), 0);
  });
});

describe("sanitizeBlocks (güvenli çizim)", () => {
  it("bilinmeyen blok türlerini ve geçersiz girdiyi sessizce atlar", () => {
    const result = sanitizeBlocks([
      { type: "html", html: "<script>alert(1)</script>" },
      { type: "markdown", text: "# x" },
      { type: "paragraph", text: "kalır" },
      null,
      7,
      "x",
      [],
      { type: "video", url: "https://x.co/v.mp4" },
    ]);
    assert.deepEqual(result, [{ type: "paragraph", text: "kalır" }]);
  });

  it("dizi olmayan değer boş sonuç verir", () => {
    assert.deepEqual(sanitizeBlocks(undefined), []);
    assert.deepEqual(sanitizeBlocks(null), []);
    assert.deepEqual(sanitizeBlocks({ type: "paragraph", text: "a" }), []);
    assert.deepEqual(sanitizeBlocks("metin"), []);
  });

  it("metni olmayan ya da boş blokları atlar; fazladan alanları taşımaz", () => {
    assert.deepEqual(
      sanitizeBlocks([
        { type: "heading", level: 2 },
        { type: "heading", level: 3, text: "   " },
        { type: "paragraph", text: 5 },
        { type: "list", ordered: true, items: [] },
        { type: "list", ordered: true, items: [1, null, "  "] },
        { type: "quote", text: "" },
        { type: "paragraph", text: "ok", onPress: "x", style: { color: "red" } },
      ]),
      [{ type: "paragraph", text: "ok" }],
    );
  });

  it("başlık düzeyi 3 değilse 2 olur; liste maddeleri süzülür", () => {
    assert.deepEqual(sanitizeBlocks([{ type: "heading", level: 9, text: "a" }, { type: "heading", level: 3, text: "b" }]), [
      { type: "heading", level: 2, text: "a" },
      { type: "heading", level: 3, text: "b" },
    ]);
    assert.deepEqual(sanitizeBlocks([{ type: "list", ordered: "evet", items: ["a", 3, "", "b"] }]), [{ type: "list", ordered: false, items: ["a", "b"] }]);
  });

  it("alıntı kaynağı isteğe bağlı", () => {
    assert.deepEqual(sanitizeBlocks([{ type: "quote", text: "a", cite: "b" }, { type: "quote", text: "c", cite: "  " }]), [
      { type: "quote", text: "a", cite: "b" },
      { type: "quote", text: "c" },
    ]);
  });

  it("görsel: yalnız https adresi; alt yoksa boş; alt yazı isteğe bağlı", () => {
    assert.deepEqual(
      sanitizeBlocks([
        { type: "image", url: "http://x.co/a.png", alt: "a" },
        { type: "image", url: "javascript:alert(1)", alt: "b" },
        { type: "image", url: "data:image/png;base64,AAAA", alt: "c" },
        { type: "image", url: "/a.png", alt: "d" },
        { type: "image", alt: "e" },
        { type: "image", url: "https://x.co/f.png" },
        { type: "image", url: "https://x.co/g.png", alt: "g", caption: "yazı" },
      ]),
      [
        { type: "image", url: "https://x.co/f.png", alt: "" },
        { type: "image", url: "https://x.co/g.png", alt: "g", caption: "yazı" },
      ],
    );
  });
});

describe("contentRules", () => {
  it("isHttpsUrl sunucu kurallarını izler", () => {
    for (const ok of ["https://x.co", "https://x.co/a.png", "HTTPS://X.CO/A", "https://x.co:8443/a?b=1#c", "https://sub.x.co/a_(b)", "https://[2001:db8::1]/a", "https://örnek.com/a"]) {
      assert.equal(isHttpsUrl(ok), true, ok);
    }
    for (const bad of ["", "http://x.co", "javascript:alert(1)", "//x.co/a", "/a", "x.co", "https:x.co", "https:///x.co", "https://", "https://u@x.co", "https://u:p@x.co", "https://x.co/a b", "https://x.co/\\a", "https://x.co/​", "https://x.co/‮", "https://.x.co", "https://x..co", "https://-x.co", "https://x.co:99999999", " https://x.co", 5, null, undefined]) {
      assert.equal(isHttpsUrl(bad), false, String(bad));
    }
    assert.equal(isHttpsUrl("https://x.co/" + "a".repeat(2_048)), false);
    assert.equal(isHttpsUrl("https://x.co/" + "a".repeat(2_048 - 13)), true);
  });

  it("isBlankText ve hasForbiddenChars", () => {
    assert.equal(isBlankText(""), true);
    assert.equal(isBlankText(" ​⠀"), true);
    assert.equal(isBlankText("a"), false);
    assert.equal(hasForbiddenChars("a\nb"), true);
    assert.equal(hasForbiddenChars("a\nb", true), false);
    assert.equal(hasForbiddenChars("a‮b", true), true);
  });

  it("normalizeTag İ ve büyük harfi sunucu gibi çevirir", () => {
    assert.equal(normalizeTag("  İstanbul "), "istanbul");
    assert.equal(normalizeTag("IĞDIR"), "iğdir");
    assert.equal(normalizeTag("Ülke-Rehberi"), "ülke-rehberi");
  });
});

describe("collectTags", () => {
  const posts = [
    { tags: ["ülke-rehberi", "europe"] },
    { tags: ["ülke-rehberi", "asia"] },
    { tags: ["ülke-rehberi", "europe", "europe"] },
    { tags: [] },
  ];

  it("görülme sayısına göre sıralar; yinelenen etiket bir yazıda tek sayılır", () => {
    assert.deepEqual(collectTags(posts), ["ülke-rehberi", "europe", "asia"]);
  });

  it("sınırı uygular; seçili etiket sınır dışında kalsa da başa eklenir", () => {
    assert.deepEqual(collectTags(posts, 2), ["ülke-rehberi", "europe"]);
    assert.deepEqual(collectTags(posts, 1, "asia"), ["asia", "ülke-rehberi"]);
    assert.deepEqual(collectTags(posts, 1, "ülke-rehberi"), ["ülke-rehberi"]);
  });

  it("boş girdi", () => {
    assert.deepEqual(collectTags([]), []);
    assert.deepEqual(collectTags([], 5, "x"), ["x"]);
  });
});
