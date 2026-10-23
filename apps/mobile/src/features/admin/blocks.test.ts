import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { BlogBlock } from "../blog/blockTypes";
import { BLOCK_LIMITS } from "../blog/contentRules";
import { blocksToText, locateIssue, parseBlocks, textToBlocks, validateBlocks, validateBodyText } from "./blocks";

const para = (text: string): BlogBlock => ({ type: "paragraph", text });
const h2 = (text: string): BlogBlock => ({ type: "heading", level: 2, text });
const h3 = (text: string): BlogBlock => ({ type: "heading", level: 3, text });
const ul = (...items: string[]): BlogBlock => ({ type: "list", ordered: false, items });
const ol = (...items: string[]): BlogBlock => ({ type: "list", ordered: true, items });
const quote = (text: string, cite?: string): BlogBlock => (cite === undefined ? { type: "quote", text } : { type: "quote", text, cite });
const image = (url: string, alt: string, caption?: string): BlogBlock =>
  caption === undefined ? { type: "image", url, alt } : { type: "image", url, alt, caption };

describe("textToBlocks: temel biçimler", () => {
  it("boş girdi ve yalnız boşluk blok üretmez", () => {
    assert.deepEqual(textToBlocks(""), []);
    assert.deepEqual(textToBlocks("   \n\t\n  \n"), []);
    assert.deepEqual(textToBlocks("\n\n\n"), []);
  });

  it("boş satırla ayrılan paragraflar", () => {
    assert.deepEqual(textToBlocks("Bir.\n\nİki.\n\n\n\nÜç."), [para("Bir."), para("İki."), para("Üç.")]);
  });

  it("ardışık satırlar tek paragraf olur, satır sonu korunur", () => {
    assert.deepEqual(textToBlocks("ilk satır\nikinci satır"), [para("ilk satır\nikinci satır")]);
  });

  it("CRLF ve CR satır sonları LF gibi okunur", () => {
    assert.deepEqual(textToBlocks("a\r\nb\r\n\r\nc\rd"), [para("a\nb"), para("c\nd")]);
  });

  it("satır kenarlarındaki boşluk atılır, iç boşluk korunur", () => {
    assert.deepEqual(textToBlocks("   merhaba   dünya   \n\t"), [para("merhaba   dünya")]);
  });

  it("## ve ### başlık olur", () => {
    assert.deepEqual(textToBlocks("## Büyük\n\n### Küçük"), [h2("Büyük"), h3("Küçük")]);
  });

  it("başlık, paragrafı boş satır olmadan da böler", () => {
    assert.deepEqual(textToBlocks("önce\n## Başlık\nsonra"), [para("önce"), h2("Başlık"), para("sonra")]);
  });

  it("# ve #### başlık değildir, # ile boşluksuz yazı da değil", () => {
    assert.deepEqual(textToBlocks("# Bir\n\n#### Dört\n\n##boşluksuz\n\n#etiket"), [
      para("# Bir"),
      para("#### Dört"),
      para("##boşluksuz"),
      para("#etiket"),
    ]);
  });

  it("boş başlık sorun bildirir ve blok üretmez", () => {
    const result = parseBlocks("a\n\n##\n\n### \n\nb");
    assert.deepEqual(result.blocks, [para("a"), para("b")]);
    assert.deepEqual(
      result.issues.map((i) => i.line),
      [3, 5],
    );
  });

  it("madde işaretli ve numaralı listeler", () => {
    assert.deepEqual(textToBlocks("- elma\n- armut\n\n1. bir\n2. iki\n10. on"), [ul("elma", "armut"), ol("bir", "iki", "on")]);
  });

  it("numaralar yok sayılır: sıra çizimde yeniden verilir", () => {
    assert.deepEqual(textToBlocks("3. üç\n1. bir"), [ol("üç", "bir")]);
  });

  it("farklı türde liste satırları boş satır olmadan ayrı liste olur", () => {
    assert.deepEqual(textToBlocks("- a\n1. b\n- c"), [ul("a"), ol("b"), ul("c")]);
  });

  it("liste sonrası düz satır yeni paragraftır", () => {
    assert.deepEqual(textToBlocks("- a\n- b\nsonra"), [ul("a", "b"), para("sonra")]);
  });

  it("'-5 derece' ve '2026. yılında' liste değildir", () => {
    assert.deepEqual(textToBlocks("-5 derece\n\n2026. yılında\n\n1.5 litre"), [para("-5 derece"), para("2026. yılında"), para("1.5 litre")]);
  });

  it("boş liste maddesi sorun bildirir", () => {
    const result = parseBlocks("- a\n-\n- b\n1.");
    assert.deepEqual(result.blocks, [ul("a", "b")]);
    assert.deepEqual(
      result.issues.map((i) => i.line),
      [2, 4],
    );
  });

  it("alıntı: ardışık > satırları tek blok", () => {
    assert.deepEqual(textToBlocks("> ilk\n> ikinci\n>\n> üçüncü"), [quote("ilk\nikinci\n\nüçüncü")]);
  });

  it("alıntı kaynağı: son satır '— Kaynak'", () => {
    assert.deepEqual(textToBlocks("> Gezmek öğrenmektir.\n> — Bir gezgin"), [quote("Gezmek öğrenmektir.", "Bir gezgin")]);
  });

  it("'—' ile başlayan ara satır kaynak sayılmaz, yalnız son satır sayılır", () => {
    assert.deepEqual(textToBlocks("> — ilk\n> son"), [quote("— ilk\nson")]);
  });

  it("boş alıntı ve yalnız kaynaklı alıntı sorun bildirir", () => {
    assert.equal(parseBlocks(">").issues.length, 1);
    assert.equal(parseBlocks("> — Kaynak").issues.length, 1);
    assert.equal(parseBlocks(">\n>").blocks.length, 0);
  });

  it("boş kaynak ('> —') sorun bildirir, alıntı korunur", () => {
    const result = parseBlocks("> metin\n> —");
    assert.deepEqual(result.blocks, [quote("metin")]);
    assert.equal(result.issues.length, 1);
  });

  it("alıntıdaki özel söz dizimi alıntı metnidir", () => {
    assert.deepEqual(textToBlocks("> ## başlık değil\n> - liste değil"), [quote("## başlık değil\n- liste değil")]);
  });
});

describe("textToBlocks: görsel", () => {
  it("![alt](https://adres)", () => {
    assert.deepEqual(textToBlocks("![Kule](https://wangoh.com/a.jpg)"), [image("https://wangoh.com/a.jpg", "Kule")]);
  });

  it("isteğe bağlı alt yazı (caption)", () => {
    assert.deepEqual(textToBlocks('![Kule](https://wangoh.com/a.jpg "Gün batımında kule")'), [
      image("https://wangoh.com/a.jpg", "Kule", "Gün batımında kule"),
    ]);
  });

  it("adreste parantez ve sorgu olabilir", () => {
    assert.deepEqual(textToBlocks("![x](https://tr.wikipedia.org/wiki/Paris_(şehir)?a=1&b=2#c)"), [
      image("https://tr.wikipedia.org/wiki/Paris_(şehir)?a=1&b=2#c", "x"),
    ]);
  });

  it("açıklamada kaçışlı köşeli parantez", () => {
    assert.deepEqual(textToBlocks("![a \\[b\\] c](https://x.co/i.png)"), [image("https://x.co/i.png", "a [b] c")]);
  });

  it("http, javascript, data, göreli ve protokolsüz adresler geçersizdir", () => {
    for (const url of ["http://x.co/a.png", "javascript:alert(1)", "data:image/png;base64,AAAA", "/a.png", "//x.co/a.png", "x.co/a.png", "ftp://x.co/a", "https://", "https:///x", "https://u:p@x.co/a", "https://x.co\\a"]) {
      const result = parseBlocks(`![alt](${url})`);
      assert.equal(result.issues.length, 1, `${url} reddedilmeli`);
      assert.equal(result.blocks.every((b) => b.type !== "image"), true, `${url} görsel olmamalı`);
    }
  });

  it("geçersiz görsel satırı düz paragraf olarak korunur ve sorun bildirir", () => {
    const result = parseBlocks("önce\n\n![alt](http://x.co/a.png)\n\nsonra");
    assert.deepEqual(result.blocks, [para("önce"), para("![alt](http://x.co/a.png)"), para("sonra")]);
    assert.deepEqual(result.issues.map((i) => i.line), [3]);
  });

  it("alt metni boş görsel sorun bildirir", () => {
    const result = parseBlocks("![](https://x.co/a.png)\n\n![   ](https://x.co/a.png)");
    assert.equal(result.issues.length, 2);
    assert.equal(result.blocks.every((b) => b.type === "paragraph"), true);
  });

  it("bozuk görsel sözdizimi sorun bildirir (kapanmayan, parantezsiz, fazla metin)", () => {
    for (const line of ["![alt", "![alt]", "![alt](", "![alt](https://x.co/a.png", "![alt](https://x.co/a.png) fazla", "![a](https://x.co/a.png boş)"]) {
      assert.equal(parseBlocks(line).issues.length, 1, line);
    }
  });

  it("görsel paragrafı böler", () => {
    assert.deepEqual(textToBlocks("a\n![x](https://x.co/i.png)\nb"), [para("a"), image("https://x.co/i.png", "x"), para("b")]);
  });
});

describe("textToBlocks: kaçış", () => {
  it("ters eğik çizgiyle kaçırılan satır paragraf metnidir", () => {
    assert.deepEqual(textToBlocks("\\## başlık değil\n\n\\- madde değil\n\n\\1. numara değil\n\n\\> alıntı değil\n\n\\![x](y)"), [
      para("## başlık değil"),
      para("- madde değil"),
      para("1. numara değil"),
      para("> alıntı değil"),
      para("![x](y)"),
    ]);
  });

  it("özel olmayan satırdaki ters eğik çizgi olduğu gibi kalır", () => {
    assert.deepEqual(textToBlocks("C:\\Users\\wangoh\n\n\\n satır"), [para("C:\\Users\\wangoh"), para("\\n satır")]);
  });

  it("tek başına \\ satırı paragraf içinde boş satırdır", () => {
    assert.deepEqual(textToBlocks("birinci\n\\\nikinci"), [para("birinci\n\nikinci")]);
  });
});

describe("blocksToText", () => {
  it("tüm blok türlerini yazar", () => {
    const text = blocksToText([
      h2("Başlık"),
      para("Paragraf"),
      h3("Alt başlık"),
      ul("a", "b"),
      ol("x", "y"),
      quote("Söz", "Kişi"),
      image("https://x.co/i.png", "Açıklama", "Yazı"),
    ]);
    assert.equal(
      text,
      '## Başlık\n\nParagraf\n\n### Alt başlık\n\n- a\n- b\n\n1. x\n2. y\n\n> Söz\n> — Kişi\n\n![Açıklama](https://x.co/i.png "Yazı")',
    );
  });

  it("boş ve geçersiz girdi boş metin verir", () => {
    assert.equal(blocksToText([]), "");
    assert.equal(blocksToText(null), "");
    assert.equal(blocksToText(undefined), "");
    assert.equal(blocksToText("metin" as unknown as BlogBlock[]), "");
  });

  it("bilinmeyen ve bozuk blokları sessizce atlar", () => {
    const blocks = [para("a"), { type: "video", url: "https://x.co/v.mp4" }, null, 5, { type: "heading" }, { type: "list", items: "x" }, { type: "list", items: [] }, para("b")] as unknown as BlogBlock[];
    assert.equal(blocksToText(blocks), "a\n\nb");
  });

  it("paragraf içindeki özel görünümlü satırları kaçırır", () => {
    assert.equal(blocksToText([para("## a\n- b\n1. c\n> d\n![e](f)\n\\")]), "\\## a\n\\- b\n\\1. c\n\\> d\n\\![e](f)\n\\\\");
  });

  it("alıntıda '— ' ile başlayan metin satırını kaçırır", () => {
    assert.equal(blocksToText([quote("— kaynak gibi")]), "> \\— kaynak gibi");
  });
});

describe("gidiş-dönüş (blok -> metin -> blok)", () => {
  const samples: Array<[string, BlogBlock[]]> = [
    ["boş", []],
    ["tek paragraf", [para("Merhaba dünya")]],
    ["çok satırlı paragraf", [para("bir\niki\nüç")]],
    ["paragrafta iç boş satır", [para("bir\n\niki")]],
    ["paragrafın başında ve sonunda boş satır", [para("\nortada\n")]],
    ["her tür", [h2("A"), para("p"), h3("B"), ul("1", "2"), ol("x", "y", "z"), quote("q1\nq2", "Kaynak"), image("https://x.co/a.png", "alt", "alt yazı")]],
    ["özel görünümlü paragraf satırları", [para("## başlık"), para("- madde"), para("1. bir"), para("> alıntı"), para("![x](https://y.co/z.png)"), para("\\"), para("\\\\"), para("\\## x")]],
    ["paragrafın ortasında özel satır", [para("önce\n## sonra\n- şu\n1. bu")]],
    ["ters eğik çizgiler", [para("C:\\Users\\x"), para("\\n"), para("sonu \\")]],
    ["alıntı: '—' metin satırları", [quote("— a"), quote("b\n— c"), quote("— d", "Kaynak"), quote("\\— e")]],
    ["alıntı boş iç satır", [quote("a\n\nb")]],
    ["görsel kaçışları", [image("https://x.co/a_(b).png?x=1&y=2#z", "köşeli [parantez] ve \\ ters"), image("https://x.co/i.png", "a", 'tırnak " ve \\ ters')]],
    ["emoji ve Türkçe", [h2("İstanbul'da 3 gün 🇹🇷"), para("Çay, simit ve ığdır — ğüşiöç İĞÜŞİÖÇ")]],
    ["art arda aynı tür bloklar", [ul("a"), ul("b"), ol("c"), ol("d"), quote("x"), quote("y"), para("p"), para("q")]],
    ["uzun liste", [ul(...Array.from({ length: 100 }, (_, i) => `madde ${i + 1}`))]],
  ];

  for (const [name, blocks] of samples) {
    it(name, () => {
      assert.deepEqual(textToBlocks(blocksToText(blocks)), blocks);
      assert.deepEqual(validateBlocks(blocks), [], "örnek bloklar geçerli olmalı");
    });
  }

  it("metin -> blok -> metin kurallı metinde aynı metni verir", () => {
    const text = "## Başlık\n\nParagraf bir.\nParagraf iki.\n\n- a\n- b\n\n1. x\n2. y\n\n> Söz\n> — Kişi\n\n![Alt](https://x.co/a.png)";
    assert.equal(blocksToText(textToBlocks(text)), text);
  });

  it("gerçek sunucu gövdesi biçimi (başlık, paragraf, liste) kayıpsız", () => {
    const body: BlogBlock[] = [
      h2("Japonya rotası nasıl kurulur?"),
      para("Japonya'yı tek bir uzun kontrol listesi gibi değil, birbirini tamamlayan bölgesel duraklar olarak planlamak daha iyi sonuç verir."),
      h3("İlk Japonya yolculuğu"),
      ul("Süre: 9–11 gün", "Şehirler: Tokyo, Kyoto, Osaka"),
      para("Tokyo'da dört gün, Kyoto'da üç gün, Osaka'da iki gün."),
    ];
    assert.deepEqual(textToBlocks(blocksToText(body)), body);
  });
});

/** Tekrarlanabilir sözde rastgele sayılar (Mulberry32). */
function rng(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe("gidiş-dönüş: rastgele (tohumlu) sınama", () => {
  const WORDS = ["Paris", "çay", "ığdır", "—", "-", "1.", "##", ">", "!", "[x]", "(y)", "\\", "\\\\", "#", "2026", "a", "ü", "🙂", "https://x.co/a", '"'];

  const text = (r: () => number, min = 1, max = 4) =>
    Array.from({ length: min + Math.floor(r() * (max - min + 1)) }, () => WORDS[Math.floor(r() * WORDS.length)]!)
      .join(" ")
      .trim();

  /** Geçerli, kurallı bir blok üretir: satır kenarında boşluk yok. */
  function randomBlock(r: () => number): BlogBlock {
    const pick = Math.floor(r() * 6);
    const nonBlank = (min = 1, max = 4) => {
      const t = text(r, min, max);
      return t === "" ? "x" : t;
    };
    switch (pick) {
      case 0:
        return r() < 0.5 ? h2(nonBlank()) : h3(nonBlank());
      case 1: {
        const lines = Array.from({ length: 1 + Math.floor(r() * 4) }, () => (r() < 0.2 ? "" : nonBlank()));
        const joined = lines.join("\n");
        return para(joined.trim() === "" ? "x" : joined);
      }
      case 2:
        return { type: "list", ordered: r() < 0.5, items: Array.from({ length: 1 + Math.floor(r() * 4) }, () => nonBlank()) };
      case 3: {
        const lines = Array.from({ length: 1 + Math.floor(r() * 3) }, () => (r() < 0.2 ? "" : nonBlank()));
        // Başı/sonu boş satır kurallı değildir.
        const body = lines.join("\n").replace(/^\n+|\n+$/g, "");
        const q = body === "" ? "x" : body;
        return r() < 0.5 ? quote(q) : quote(q, nonBlank(1, 2));
      }
      case 4:
        return r() < 0.5 ? image("https://wangoh.com/i/" + Math.floor(r() * 1000) + ".jpg", nonBlank()) : image("https://x.co/a_(b).png", nonBlank(), nonBlank());
      default:
        return para(nonBlank(1, 6));
    }
  }

  it("500 rastgele kurallı belge: textToBlocks(blocksToText(b)) == b", () => {
    const r = rng(20260520);
    for (let n = 0; n < 500; n++) {
      const blocks = Array.from({ length: Math.floor(r() * 8) }, () => randomBlock(r));
      const roundTripped = textToBlocks(blocksToText(blocks));
      assert.deepEqual(roundTripped, blocks, `tur ${n}\n${blocksToText(blocks)}`);
    }
  });

  it("rastgele metin: ayrıştırma çökmez ve ikinci gidiş-dönüş değişmez (sabit nokta)", () => {
    const LINES = ["", "", "düz satır", "## Başlık", "### Alt", "- madde", "-", "1. bir", "2.", "> alıntı", ">", "> — Kaynak", "— tek", "\\", "\\## x", "\\\\", "![a](https://x.co/i.png)", "![a](http://x.co/i.png)", "![](https://x.co/i.png)", "  boşluklu  ", "\t- sekme", "#", "####"];
    const r = rng(7);
    for (let n = 0; n < 600; n++) {
      const input = Array.from({ length: 1 + Math.floor(r() * 12) }, () => LINES[Math.floor(r() * LINES.length)]!).join(r() < 0.1 ? "\r\n" : "\n");
      const first = textToBlocks(input);
      const again = textToBlocks(blocksToText(first));
      assert.deepEqual(again, first, `tur ${n}\n${JSON.stringify(input)}`);
    }
  });

  it("rastgele karakter dizisi hata fırlatmaz", () => {
    const alphabet = ["#", "-", ">", "!", "[", "]", "(", ")", "\\", "\n", "\r", " ", "\t", "\"", "a", "1", ".", "—", "\u200b", "\u0000", "https://", "🙂"];
    const r = rng(99);
    for (let n = 0; n < 500; n++) {
      const input = Array.from({ length: Math.floor(r() * 60) }, () => alphabet[Math.floor(r() * alphabet.length)]!).join("");
      assert.doesNotThrow(() => {
        blocksToText(textToBlocks(input));
        validateBodyText(input);
      }, JSON.stringify(input));
    }
  });
});

describe("validateBlocks (sunucu sınırları)", () => {
  const field = (blocks: unknown) => validateBlocks(blocks).map((i) => i.field);

  it("geçerli diziler ve boş dizi sorunsuz", () => {
    assert.deepEqual(validateBlocks([]), []);
    assert.deepEqual(validateBlocks([h2("a"), para("b"), ul("c"), quote("d", "e"), image("https://x.co/a.png", "f", "g")]), []);
  });

  it("dizi olmayan değer reddedilir", () => {
    assert.deepEqual(field("x"), ["body"]);
    assert.deepEqual(field(null), ["body"]);
  });

  it("en çok 300 blok", () => {
    assert.deepEqual(validateBlocks(Array.from({ length: 300 }, () => para("a"))), []);
    assert.deepEqual(field(Array.from({ length: 301 }, () => para("a"))), ["body"]);
  });

  it("başlık 200, paragraf 10 000, madde 1 000, alıntı 2 000, kaynak 200, alt 300, alt yazı 500", () => {
    assert.deepEqual(validateBlocks([h2("a".repeat(BLOCK_LIMITS.heading))]), []);
    assert.deepEqual(field([h2("a".repeat(BLOCK_LIMITS.heading + 1))]), ["body.0.text"]);
    assert.deepEqual(validateBlocks([para("a".repeat(BLOCK_LIMITS.paragraph))]), []);
    assert.deepEqual(field([para("a".repeat(BLOCK_LIMITS.paragraph + 1))]), ["body.0.text"]);
    assert.deepEqual(field([ul("a".repeat(BLOCK_LIMITS.listItem + 1))]), ["body.0.items.0"]);
    assert.deepEqual(field([quote("a".repeat(BLOCK_LIMITS.quote + 1))]), ["body.0.text"]);
    assert.deepEqual(field([quote("a", "b".repeat(BLOCK_LIMITS.cite + 1))]), ["body.0.cite"]);
    assert.deepEqual(field([image("https://x.co/a.png", "a".repeat(BLOCK_LIMITS.alt + 1))]), ["body.0.alt"]);
    assert.deepEqual(field([image("https://x.co/a.png", "a", "b".repeat(BLOCK_LIMITS.caption + 1))]), ["body.0.caption"]);
  });

  it("liste 1-100 madde", () => {
    assert.deepEqual(field([{ type: "list", ordered: false, items: [] }]), ["body.0.items"]);
    assert.deepEqual(validateBlocks([ul(...Array.from({ length: 100 }, () => "a"))]), []);
    assert.deepEqual(field([ul(...Array.from({ length: 101 }, () => "a"))]), ["body.0.items"]);
  });

  it("toplam metin 100 000 karakteri aşamaz", () => {
    const blocks = Array.from({ length: 11 }, () => para("a".repeat(9_500)));
    assert.deepEqual(field(blocks), ["body"]);
  });

  it("boş, yalnız boşluk ve görünmez karakterden oluşan metin reddedilir", () => {
    for (const blank of ["", "   ", "\u200b", "\u00ad", "\u2800", "\u3164", "\u00a0\u200b"]) {
      assert.deepEqual(field([para(blank)]), ["body.0.text"], JSON.stringify(blank));
      assert.deepEqual(field([h2(blank)]), ["body.0.text"], JSON.stringify(blank));
    }
  });

  it("emoji dizisindeki ZWJ serbest", () => {
    assert.deepEqual(validateBlocks([para("👨\u200d👩\u200d👧")]), []);
  });

  it("kontrol ve yön belirleyici karakterler reddedilir; paragrafta satır sonu ve sekme serbest", () => {
    for (const bad of ["a\u0000b", "a\u001bb", "a\u007fb", "a\u2028b", "a\u202eb", "a\u2066b", "a\ufeffb", "a\u200eb"]) {
      assert.deepEqual(field([para(bad)]), ["body.0.text"], JSON.stringify(bad));
    }
    assert.deepEqual(validateBlocks([para("a\nb\tc\r\nd")]), []);
    assert.deepEqual(field([h2("a\nb")]), ["body.0.text"], "başlıkta satır sonu yok");
    assert.deepEqual(field([ul("a\tb")]), ["body.0.items.0"], "madde içinde sekme yok");
  });

  it("görsel adresi: yalnız https", () => {
    assert.deepEqual(field([image("http://x.co/a.png", "a")]), ["body.0.url"]);
    assert.deepEqual(field([image("javascript:alert(1)", "a")]), ["body.0.url"]);
    assert.deepEqual(field([image("https://" + "a".repeat(2_050), "a")]), ["body.0.url"]);
    assert.deepEqual(field([image("https://x.co/a b.png", "a")]), ["body.0.url"]);
    assert.deepEqual(field([image("https://x.co/\u202e.png", "a")]), ["body.0.url"]);
    assert.deepEqual(validateBlocks([image("https://x.co:8443/a.png?q=1#z", "a")]), []);
    assert.deepEqual(validateBlocks([image("HTTPS://X.CO/a.png", "a")]), []);
    assert.deepEqual(validateBlocks([image("https://[::1]/a.png", "a")]), []);
  });

  it("bilinmeyen tür, nesne olmayan blok, geçersiz düzey", () => {
    assert.deepEqual(field([{ type: "video" }]), ["body.0.type"]);
    assert.deepEqual(field(["x"]), ["body.0"]);
    assert.deepEqual(field([{ type: "heading", level: 4, text: "a" }]), ["body.0.level"]);
  });

  it("en çok 50 sorun toplanır", () => {
    assert.equal(validateBlocks(Array.from({ length: 200 }, () => para(""))).length, 50);
  });
});

describe("validateBodyText", () => {
  it("geçerli metin sorunsuz", () => {
    assert.deepEqual(validateBodyText("## a\n\nb\n\n- c"), []);
    assert.deepEqual(validateBodyText(""), []);
  });

  it("yayın için boş gövde reddedilir, taslak için serbest", () => {
    assert.equal(validateBodyText("  \n", { requireContent: true }).length, 1);
    assert.deepEqual(validateBodyText("  \n"), []);
  });

  it("sorunları satır numarasına bağlar", () => {
    const text = "giriş\n\n## Başlık\n\n![x](http://x.co/a.png)\n\nson";
    assert.deepEqual(validateBodyText(text), [{ line: 5, message: "Görsel adresi https:// ile başlayan geçerli bir adres olmalı." }]);
  });

  it("sunucu sınırı ihlalini bloğun başladığı satıra bağlar", () => {
    const text = "kısa\n\n" + "a".repeat(BLOCK_LIMITS.paragraph + 1);
    assert.deepEqual(validateBodyText(text), [{ line: 3, message: `En fazla ${BLOCK_LIMITS.paragraph} karakter olabilir.` }]);
  });

  it("liste maddesi sorununu madde satırına bağlar", () => {
    const text = "- a\n- b\u0000c\n- d";
    assert.deepEqual(validateBodyText(text), [{ line: 2, message: "Kontrol ya da yön belirleyici karakter içeremez." }]);
  });

  it("görünmez karakterden oluşan paragraf yakalanır", () => {
    assert.equal(validateBodyText("a\n\n\u200b").length, 1);
  });
});

describe("locateIssue", () => {
  it("blok ve madde sırasını çıkarır", () => {
    assert.deepEqual(locateIssue("body.3.text"), { block: 3, item: null });
    assert.deepEqual(locateIssue("body.2.items.5"), { block: 2, item: 5 });
    assert.deepEqual(locateIssue("translations.tr.body.4.url", "translations.tr.body"), { block: 4, item: null });
  });

  it("blok sırası olmayan yolda null", () => {
    assert.equal(locateIssue("body"), null);
    assert.equal(locateIssue("title"), null);
    assert.equal(locateIssue("body.x.text"), null);
  });
});
