import { describe, expect, it } from "vitest";
import { FOLD_FROM, FOLD_TO, foldContains, foldSearch } from "./search.js";

describe("foldSearch (Türkçe duyarlı katlama)", () => {
  it("i, ı, İ, I hepsi i olur; büyük/küçük harf farkı kalkar", () => {
    expect(foldSearch("İstanbul")).toBe("istanbul");
    expect(foldSearch("ISTANBUL")).toBe("istanbul");
    expect(foldSearch("ıstanbul")).toBe("istanbul");
    expect(foldSearch("İSTANBUL")).toBe("istanbul");
    expect(foldSearch("Isparta")).toBe("isparta");
    expect(foldSearch("ISPARTA")).toBe("isparta");
    expect(foldSearch("ısparta")).toBe("isparta");
    expect(foldSearch("IŞIK")).toBe("isik");
    expect(foldSearch("ışık")).toBe("isik");
  });

  it("Türkçe aksanlı harfler aksansıza iner", () => {
    expect(foldSearch("Çankaya Şanlıurfa Ğ Ö Ü")).toBe("cankaya sanliurfa g o u");
    expect(foldSearch("ÖĞRENCİ")).toBe("ogrenci");
    expect(foldSearch("Muğla")).toBe("mugla");
  });

  it("diğer Latin aksanları da iner (Šibenik, Tromsø, Łódź, Åland, Gjirokastër)", () => {
    expect(foldSearch("Šibenik")).toBe("sibenik");
    expect(foldSearch("Tromsø")).toBe("tromso");
    expect(foldSearch("Łódź")).toBe("lodz");
    expect(foldSearch("Ny-Ålesund")).toBe("ny-alesund");
    expect(foldSearch("Gjirokastër")).toBe("gjirokaster");
    expect(foldSearch("Žabljak")).toBe("zabljak");
    expect(foldSearch("Bucureşti Bucureşti")).toBe("bucuresti bucuresti");
  });

  it("birleşik (NFD) girdi aynı sonucu verir", () => {
    expect(foldSearch("İstanbul")).toBe("istanbul");
    expect(foldSearch("Çankaya".normalize("NFD"))).toBe("cankaya");
    expect(foldSearch("São Paulo")).toBe("sao paulo");
  });

  it("ASCII ve rakamlara dokunmaz, boşluk korunur", () => {
    expect(foldSearch("New York 2")).toBe("new york 2");
    expect(foldSearch("a-b_c%d")).toBe("a-b_c%d");
  });

  it("tablo tutarlı: iki dizgi eşit uzunlukta, kaynak karakterler benzersiz, her biri hedefine iner", () => {
    const from = [...FOLD_FROM];
    const to = [...FOLD_TO];
    expect(from.length).toBe(to.length);
    expect(new Set(from).size).toBe(from.length);
    from.forEach((ch, i) => expect(foldSearch(ch), `U+${ch.codePointAt(0)!.toString(16)} ${ch}`).toBe(to[i]));
    expect(to.every((ch) => /^[a-z]$/.test(ch))).toBe(true);
  });
});

describe("foldContains", () => {
  it("boş ya da yalnız boşluk terimi koşul üretmez", () => {
    // sql nesnesine bağlı kalmadan: undefined dönmesi yeter.
    expect(foldContains(undefined as never, "")).toBeUndefined();
    expect(foldContains(undefined as never, "   ")).toBeUndefined();
  });
});
