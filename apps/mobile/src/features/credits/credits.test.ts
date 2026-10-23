import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { ImageCreditDto } from "@wangoh/api-client";

import { buildCreditRows, creditRowText, normalizeText, openSafeUrl, safeHttpUrl } from "./creditRows";

function credit(overrides: Partial<ImageCreditDto> = {}): ImageCreditDto {
  return {
    imageUrl: "https://wangoh.com/og/zagreb-29255640143-297b40ff.jpg",
    author: "Nick Savchenko from Kiev, Ukraine",
    licenseName: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Zagreb_(29255640143).jpg",
    ...overrides,
  };
}

describe("yazar metni", () => {
  it("her boşluk dizisi (satır sonları dahil) tek boşluk olur, kırpılır", () => {
    assert.equal(normalizeText("  Ali \n\n  Veli\t Can  "), "Ali Veli Can");
    assert.equal(normalizeText("This Photo was taken by X.\n\nFeel free to use"), "This Photo was taken by X. Feel free to use");
    assert.equal(normalizeText("Pudelek (Marcin Szala)"), "Pudelek (Marcin Szala)");
  });

  it("boş ya da yok -> null", () => {
    assert.equal(normalizeText(""), null);
    assert.equal(normalizeText(" \n\t "), null);
    assert.equal(normalizeText(null), null);
    assert.equal(normalizeText(undefined), null);
  });

  it("uzun metin KIRPILMAZ (630+ karakterlik gerçek yazar açıklaması aynen kalır)", () => {
    const long = `This image was produced by me, David Castor (user:dcastor).${"\n".repeat(2)}${"Bu bir test cümlesidir. ".repeat(28)}`;
    const out = normalizeText(long);
    assert.ok(out !== null && out.length > 600);
    assert.equal(out, long.replace(/\s+/g, " ").trim());
    assert.ok(!out.includes("\n"));
  });

  it("Unicode yazar adları bozulmaz", () => {
    assert.equal(normalizeText("铁头娃蛤蛤"), "铁头娃蛤蛤");
    assert.equal(normalizeText("Pudelek  (Marcin Szała)"), "Pudelek (Marcin Szała)");
  });
});

describe("bağlantı şeması: yalnız http/https", () => {
  it("http ve https geçer; adres kırpılır, şema küçük harfe çekilir, gerisi aynen kalır", () => {
    assert.equal(safeHttpUrl("https://commons.wikimedia.org/wiki/File:Zagreb_(29255640143).jpg"), "https://commons.wikimedia.org/wiki/File:Zagreb_(29255640143).jpg");
    assert.equal(safeHttpUrl("http://creativecommons.org/licenses/by-sa/3.0/"), "http://creativecommons.org/licenses/by-sa/3.0/");
    assert.equal(safeHttpUrl("  HTTPS://Commons.Wikimedia.org/Wiki/File:A.jpg \n"), "https://Commons.Wikimedia.org/Wiki/File:A.jpg");
    assert.equal(safeHttpUrl("https://example.org:8443/yol?x=1#bolum"), "https://example.org:8443/yol?x=1#bolum");
    assert.equal(safeHttpUrl("https://example.org"), "https://example.org");
    assert.equal(safeHttpUrl("https://example.org?x=1"), "https://example.org?x=1");
    assert.equal(safeHttpUrl("https://commons.wikimedia.org/wiki/File:%C5%A0ibenik_harbour_-_panorama.jpg"), "https://commons.wikimedia.org/wiki/File:%C5%A0ibenik_harbour_-_panorama.jpg");
  });

  it("başka şemalar ASLA geçmez", () => {
    for (const url of [
      "javascript:alert(1)",
      "JavaScript:alert(1)",
      " javascript:alert(1)",
      "data:text/html;base64,PHNjcmlwdD4=",
      "file:///etc/passwd",
      "intent://scan/#Intent;scheme=zxing;end",
      "tel:+900000000000",
      "mailto:biri@example.org",
      "sms:+900000000000",
      "ftp://example.org/dosya",
      "market://details?id=com.example",
      "wangoh://country/HR",
      "vbscript:msgbox(1)",
      "blob:https://example.org/uuid",
      "about:blank",
    ]) {
      assert.equal(safeHttpUrl(url), null, url);
    }
  });

  it("gizlenmiş şemalar ve bozuk adresler geçmez", () => {
    for (const url of [
      "java\tscript:alert(1)",
      "java\nscript:alert(1)",
      "jav&#x61;script:alert(1)",
      "\u0000javascript:alert(1)",
      "https://exa mple.org",
      "https://example.org/yol yol",
      "https:\\\\example.org",
      "https://example.org\\@evil.test",
      "https:/example.org",
      "https:example.org",
      "http//example.org",
      "//example.org/yol",
      "example.org/yol",
      "/wiki/File:A.jpg",
      "https://",
      "https:///yol",
      "https://:443/yol",
      "https://user@example.org/",
      "https://commons.wikimedia.org@evil.test/",
      "https://[::1]/",
    ]) {
      assert.equal(safeHttpUrl(url), null, JSON.stringify(url));
    }
  });

  it("boş, yok ve metin olmayan değerler -> null; aşırı uzun adres -> null", () => {
    assert.equal(safeHttpUrl(""), null);
    assert.equal(safeHttpUrl("   "), null);
    assert.equal(safeHttpUrl(null), null);
    assert.equal(safeHttpUrl(undefined), null);
    assert.equal(safeHttpUrl(42 as unknown as string), null);
    assert.equal(safeHttpUrl(`https://example.org/${"a".repeat(2100)}`), null);
  });

  it("openSafeUrl yalnız güvenli adresi açar; güvensizde opener HİÇ çağrılmaz", () => {
    const opened: string[] = [];
    const open = (url: string) => {
      opened.push(url);
      return Promise.resolve(true);
    };
    assert.equal(openSafeUrl("https://commons.wikimedia.org/wiki/File:A.jpg", open), true);
    assert.equal(openSafeUrl("javascript:alert(1)", open), false);
    assert.equal(openSafeUrl("file:///etc/passwd", open), false);
    assert.equal(openSafeUrl("intent://x#Intent;end", open), false);
    assert.equal(openSafeUrl(null, open), false);
    assert.equal(openSafeUrl(" http://creativecommons.org/licenses/by/3.0 ", open), true);
    assert.deepEqual(opened, ["https://commons.wikimedia.org/wiki/File:A.jpg", "http://creativecommons.org/licenses/by/3.0"]);
  });

  it("açma hatası (yanıtlanmayan söz ya da eşzamanlı istisna) yutulur", async () => {
    assert.equal(openSafeUrl("https://example.org", () => Promise.reject(new Error("tarayıcı yok"))), true);
    assert.equal(
      openSafeUrl("https://example.org", () => {
        throw new Error("eşzamanlı");
      }),
      false,
    );
    await new Promise((resolve) => setTimeout(resolve, 5));
  });
});

describe("satır oluşturma", () => {
  it("tam kayıt: yazar · Kaynak · lisans; bağlantılar ve erişilebilirlik etiketleri", () => {
    const [row] = buildCreditRows([credit()]);
    assert.ok(row);
    assert.equal(row.author, "Nick Savchenko from Kiev, Ukraine");
    assert.equal(row.sourceUrl, "https://commons.wikimedia.org/wiki/File:Zagreb_(29255640143).jpg");
    assert.equal(row.licenseName, "CC BY-SA 2.0");
    assert.equal(row.licenseUrl, "https://creativecommons.org/licenses/by-sa/2.0");
    assert.equal(row.sourceA11yLabel, "Kaynak: Nick Savchenko from Kiev, Ukraine. Tarayıcıda açılır");
    assert.equal(row.licenseA11yLabel, "Lisans: CC BY-SA 2.0. Tarayıcıda açılır");
    assert.equal(creditRowText(row), "Nick Savchenko from Kiev, Ukraine · Kaynak · CC BY-SA 2.0");
  });

  it("lisans adı yoksa lisans bağlantısı gösterilmez, yalnız yazar ve kaynak kalır", () => {
    const [row] = buildCreditRows([credit({ licenseName: null })]);
    assert.ok(row);
    assert.equal(row.licenseName, null);
    assert.equal(row.licenseUrl, null);
    assert.equal(row.licenseA11yLabel, null);
    assert.equal(creditRowText(row), "Nick Savchenko from Kiev, Ukraine · Kaynak");
    // Boşluktan ibaret ad da "yok" sayılır.
    const [blank] = buildCreditRows([credit({ licenseName: " \n " })]);
    assert.equal(blank?.licenseName, null);
    assert.equal(blank?.licenseUrl, null);
  });

  it("lisans adı var ama adres yok ya da güvensiz: ad düz metin kalır", () => {
    const [none] = buildCreditRows([credit({ licenseUrl: null })]);
    assert.equal(creditRowText(none!), "Nick Savchenko from Kiev, Ukraine · Kaynak · CC BY-SA 2.0");
    assert.equal(none?.licenseUrl, null);
    assert.equal(none?.licenseA11yLabel, null);
    const [bad] = buildCreditRows([credit({ licenseUrl: "javascript:alert(1)" })]);
    assert.equal(bad?.licenseName, "CC BY-SA 2.0");
    assert.equal(bad?.licenseUrl, null);
  });

  it("yazar yoksa satır kaynak ve lisansla başlar", () => {
    const [row] = buildCreditRows([credit({ author: null })]);
    assert.equal(creditRowText(row!), "Kaynak · CC BY-SA 2.0");
    assert.equal(row?.sourceA11yLabel, "Kaynak. Tarayıcıda açılır");
  });

  it("güvensiz kaynak bağlantısı satırdan çıkar (metin kalır); gösterilecek hiçbir şeyi kalmayan kayıt atlanır", () => {
    const [row] = buildCreditRows([credit({ sourceUrl: "javascript:alert(1)" })]);
    assert.equal(row?.sourceUrl, null);
    assert.equal(creditRowText(row!), "Nick Savchenko from Kiev, Ukraine · CC BY-SA 2.0");
    assert.deepEqual(buildCreditRows([credit({ author: null, licenseName: null, licenseUrl: null, sourceUrl: "file:///x" })]), []);
  });

  it("çok satırlı uzun yazar tek boşlukla birleşir ve kırpılmaz", () => {
    const author = "This Photo was taken by Supanut Arunoprayote.\n\nFeel free to use any of my images, but please mention me as the author.";
    const [row] = buildCreditRows([credit({ author })]);
    assert.equal(row?.author, "This Photo was taken by Supanut Arunoprayote. Feel free to use any of my images, but please mention me as the author.");
  });

  it("aynı görsel tek satır (ilk geçiş), sıra korunur", () => {
    const rows = buildCreditRows([
      credit({ imageUrl: "https://wangoh.com/og/a.jpg", author: "A" }),
      credit({ imageUrl: "https://wangoh.com/og/b.jpg", author: "B" }),
      credit({ imageUrl: "https://wangoh.com/og/a.jpg", author: "A tekrar" }),
    ]);
    assert.deepEqual(
      rows.map((r) => r.author),
      ["A", "B"],
    );
  });

  it("boş dizi, null ve undefined: satır yok (hata değil)", () => {
    assert.deepEqual(buildCreditRows([]), []);
    assert.deepEqual(buildCreditRows(null), []);
    assert.deepEqual(buildCreditRows(undefined), []);
  });

  it("http:// lisans adresi (kaynakta var) bağlantı olarak korunur", () => {
    const [row] = buildCreditRows([credit({ licenseUrl: "http://creativecommons.org/licenses/by-sa/3.0/" })]);
    assert.equal(row?.licenseUrl, "http://creativecommons.org/licenses/by-sa/3.0/");
  });
});
