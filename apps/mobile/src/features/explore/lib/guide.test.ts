import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { GUIDE_BLOCK_IDS, buildToc, formatReviewedDate, initialOpenIds, placesSection, type GuideLike } from "./guide";

const base: GuideLike = {
  sections: [
    { id: "sehri-anlamak", heading: "Şehri anlamak" },
    { id: "ulasim", heading: "Ulaşım" },
  ],
  places: [{}],
  itinerary: [{}],
  practicalTips: [{}],
  practicalHeading: "Tokyo’da işinizi kolaylaştıracaklar",
  relatedGuides: [{}],
  faqs: [{}],
  sources: [{}],
};

describe("buildToc", () => {
  it("bölümleri ekrandaki sırayla listeler", () => {
    assert.deepEqual(
      buildToc(base).map((entry) => entry.id),
      [
        "sehri-anlamak",
        "ulasim",
        GUIDE_BLOCK_IDS.places,
        GUIDE_BLOCK_IDS.itinerary,
        GUIDE_BLOCK_IDS.practical,
        GUIDE_BLOCK_IDS.related,
        GUIDE_BLOCK_IDS.faq,
        GUIDE_BLOCK_IDS.sources,
      ],
    );
  });

  it("boş bölümleri atlar", () => {
    const toc = buildToc({ sections: [], places: [], itinerary: [], faqs: [] });
    assert.deepEqual(toc, []);
  });

  it("pratik ipuçları başlığı yoksa varsayılanı kullanır", () => {
    const toc = buildToc({ ...base, practicalHeading: undefined });
    assert.equal(toc.find((entry) => entry.id === GUIDE_BLOCK_IDS.practical)?.label, "Bilmeden gitme");
  });

  it("mekân bölümünün etiketi türüne göre değişir", () => {
    assert.equal(buildToc({ ...base, placesKind: "sights" }).find((e) => e.id === GUIDE_BLOCK_IDS.places)?.label, "Öne çıkan duraklar");
    assert.equal(buildToc(base).find((e) => e.id === GUIDE_BLOCK_IDS.places)?.label, "Nerede yenir?");
  });

  it("API bölüm kimlikleri blok kimlikleriyle çakışmaz", () => {
    const ids = buildToc(base).map((entry) => entry.id);
    assert.equal(new Set(ids).size, ids.length);
  });
});

describe("initialOpenIds / placesSection", () => {
  it("yalnız ilk bölüm açık başlar", () => {
    assert.deepEqual(initialOpenIds(buildToc(base)), ["sehri-anlamak"]);
    assert.deepEqual(initialOpenIds([]), []);
  });

  it("restoran kartlarında yemek, gezi duraklarında durak metnini verir", () => {
    assert.match(placesSection("food").title, /Nerede yenir/);
    assert.match(placesSection(undefined).title, /Nerede yenir/);
    assert.equal(placesSection("sights").title, "Öne çıkan duraklar");
  });
});

describe("formatReviewedDate", () => {
  it("ISO tarihini Türkçe yazar", () => {
    assert.equal(formatReviewedDate("2026-08-09"), "9 Ağustos 2026");
    assert.equal(formatReviewedDate("2026-01-31"), "31 Ocak 2026");
    assert.equal(formatReviewedDate("2025-12-01"), "1 Aralık 2025");
  });

  it("bozuk girdiyi aynen döndürür, tarih uydurmaz", () => {
    assert.equal(formatReviewedDate("dün"), "dün");
    assert.equal(formatReviewedDate("2026-13-01"), "2026-13-01");
    assert.equal(formatReviewedDate("2026-00-10"), "2026-00-10");
    assert.equal(formatReviewedDate(""), "");
  });
});
