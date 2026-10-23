import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { BlogPostDto } from "@wangoh/api-client";

import { blocksToText, parseBlocks } from "./blocks";
import {
  buildCreateDto,
  buildUpdateDto,
  emptyForm,
  formFromPost,
  hasErrors,
  mapServerErrors,
  parseTags,
  suggestSlug,
  validatePostForm,
  type PostFormValues,
} from "./postForm";
import { DURATION_PRESETS, formatDuration, gameTypeLabel, scoreSummary } from "./scoreRules";
import { slugify, validateSlug } from "./slug";
import { LAST_ADMIN_MESSAGE, deleteUserWarning, describeUserActionError, isSelf, roleLabel } from "./userRules";

const apiError = (status: number, code: string, message: string, details?: unknown) => Object.assign(new Error(message), { status, code, details });

function post(overrides: Partial<BlogPostDto> = {}): BlogPostDto {
  return {
    id: "p1",
    slug: "japonya-gezi-rehberi",
    status: "published",
    lang: "tr",
    complete: true,
    availableLangs: ["tr", "en", "es"],
    title: "Japonya Gezi Rehberi",
    excerpt: "Kısa özet.",
    coverImage: "https://wangoh.com/og/a.jpg",
    imageCredits: [],
    tags: ["ülke-rehberi", "asia"],
    countryCode: "JP",
    author: null,
    publishedAt: "2026-10-22T22:06:49.566Z",
    createdAt: "2026-10-22T22:06:49.566Z",
    updatedAt: "2026-10-22T22:06:49.566Z",
    body: [
      { type: "heading", level: 2, text: "Rota" },
      { type: "paragraph", text: "Birinci paragraf." },
    ],
    ...overrides,
  };
}

describe("slugify", () => {
  it("Türkçe harfleri çevirir, simgeleri tireye indirger", () => {
    assert.equal(slugify("Japonya Gezi Rehberi: 8 Şehir ve Rota Planı!"), "japonya-gezi-rehberi-8-sehir-ve-rota-plani");
    assert.equal(slugify("İstanbul'da ÇOK güzel Ğ Ü Ö Ş Ç ı"), "istanbul-da-cok-guzel-g-u-o-s-c-i");
    assert.equal(slugify("  --Merhaba   Dünya--  "), "merhaba-dunya");
    assert.equal(slugify("Café São Paulo"), "cafe-sao-paulo");
  });

  it("üretilemezse boş döner", () => {
    assert.equal(slugify(""), "");
    assert.equal(slugify("🙂🙂 !!!"), "");
  });

  it("en çok 120 karakter ve sonda tire kalmaz", () => {
    const slug = slugify(Array.from({ length: 60 }, () => "abc").join(" "));
    assert.ok(slug.length <= 120);
    assert.equal(slug.endsWith("-"), false);
    assert.equal(validateSlug(slug), null);
  });

  it("önerilen her slug geçerlidir (3 karakterden uzunsa)", () => {
    for (const title of ["Paris", "Gezi rehberi 2026", "İğne ve iplik", "A B C D E F"]) {
      const slug = suggestSlug(title);
      if (slug.length >= 3) assert.equal(validateSlug(slug), null, title);
    }
  });
});

describe("validateSlug", () => {
  it("geçerli adresler", () => {
    for (const ok of ["abc", "japonya-gezi-rehberi", "a1-b2", "  Paris  ", "123"]) assert.equal(validateSlug(ok), null, ok);
  });

  it("geçersiz adresler Türkçe mesaj verir", () => {
    assert.match(validateSlug("")!, /gerekli/);
    assert.match(validateSlug("ab")!, /en az 3/);
    assert.match(validateSlug("a".repeat(121))!, /en fazla 120/);
    for (const bad of ["-abc", "abc-", "a--b", "a_b", "a b", "ağa", "a/b", "a.b"]) assert.match(validateSlug(bad)!, /küçük harf/, bad);
  });
});

describe("parseTags", () => {
  it("virgül, boşluk ve satır sonuyla ayırır; normalleştirir; tekrarları atar", () => {
    assert.deepEqual(parseTags("Ülke-Rehberi, EUROPE;  europe\nİstanbul  "), ["ülke-rehberi", "europe", "istanbul"]);
    assert.deepEqual(parseTags(""), []);
    assert.deepEqual(parseTags(" , ;; "), []);
  });
});

describe("validatePostForm", () => {
  const valid: PostFormValues = {
    slug: "yeni-yazi",
    title: "Yeni yazı",
    excerpt: "Özet metni.",
    tags: "ülke-rehberi, europe",
    coverImage: "https://wangoh.com/og/a.jpg",
    countryCode: "tr",
    body: "## Başlık\n\nParagraf.",
  };

  it("geçerli form sorunsuz", () => {
    assert.equal(hasErrors(validatePostForm(valid, { publish: true })), false);
    assert.equal(hasErrors(validatePostForm({ ...valid, coverImage: "", countryCode: "", tags: "" }, { publish: true })), false);
  });

  it("boş form: zorunlu alanlar hata verir", () => {
    const errors = validatePostForm(emptyForm(), { publish: false });
    assert.deepEqual(Object.keys(errors.fields).sort(), ["excerpt", "slug", "title"]);
    assert.deepEqual(errors.body, []);
  });

  it("yayın için gövde boş olamaz, taslak için olabilir", () => {
    assert.equal(validatePostForm({ ...valid, body: "" }, { publish: false }).body.length, 0);
    assert.equal(validatePostForm({ ...valid, body: "" }, { publish: true }).body.length, 1);
  });

  it("alan sınırları", () => {
    const errors = validatePostForm(
      { ...valid, title: "a".repeat(201), excerpt: "b".repeat(1001), coverImage: "http://x.co/a.png", countryCode: "TUR", tags: "ok, geçersiz!" },
      { publish: false },
    );
    assert.match(errors.fields.title!, /en fazla 200/);
    assert.match(errors.fields.excerpt!, /en fazla 1000/);
    assert.match(errors.fields.coverImage!, /https/);
    assert.match(errors.fields.countryCode!, /iki harfli/);
    assert.match(errors.fields.tags!, /geçerli bir etiket değil/);
  });

  it("21 etiket ve çok uzun etiket reddedilir", () => {
    const many = Array.from({ length: 21 }, (_, i) => `t${i}`).join(",");
    assert.match(validatePostForm({ ...valid, tags: many }, { publish: false }).fields.tags!, /En fazla 20 etiket/);
    assert.match(validatePostForm({ ...valid, tags: "x".repeat(51) }, { publish: false }).fields.tags!, /en fazla 50/);
  });

  it("yalnız görünmez karakterden oluşan başlık reddedilir", () => {
    assert.match(validatePostForm({ ...valid, title: "​​" }, { publish: false }).fields.title!, /boş/);
  });

  it("gövdedeki geçersiz görsel satır numarasıyla bildirilir", () => {
    const errors = validatePostForm({ ...valid, body: "giriş\n\n![x](http://x.co/a.png)" }, { publish: true });
    assert.equal(errors.body.length, 1);
    assert.match(errors.body[0]!, /^Satır 3: /);
  });

  it("ülke kodu küçük harfle de kabul edilir", () => {
    assert.equal(validatePostForm({ ...valid, countryCode: "jp" }, { publish: false }).fields.countryCode, undefined);
  });
});

describe("buildCreateDto", () => {
  it("Türkçe çeviri, normalleşmiş alanlar ve durum", () => {
    const dto = buildCreateDto(
      { slug: "  Yeni-Yazi ", title: " Başlık ", excerpt: " Özet ", tags: "A, b, a", coverImage: " https://x.co/a.png ", countryCode: " jp ", body: "## H\n\nP" },
      "draft",
    );
    assert.deepEqual(dto, {
      slug: "yeni-yazi",
      status: "draft",
      tags: ["a", "b"],
      coverImage: "https://x.co/a.png",
      countryCode: "JP",
      translations: {
        tr: {
          title: "Başlık",
          excerpt: "Özet",
          body: [
            { type: "heading", level: 2, text: "H" },
            { type: "paragraph", text: "P" },
          ],
        },
      },
    });
  });

  it("isteğe bağlı alanlar boşsa gönderilmez; en/es asla gönderilmez", () => {
    const dto = buildCreateDto({ ...emptyForm(), slug: "abc", title: "T", excerpt: "E" }, "published");
    assert.equal("coverImage" in dto, false);
    assert.equal("countryCode" in dto, false);
    assert.deepEqual(Object.keys(dto.translations), ["tr"]);
    assert.equal(dto.status, "published");
  });
});

describe("buildUpdateDto", () => {
  it("hiçbir şey değişmediyse null", () => {
    const original = post();
    assert.equal(buildUpdateDto(formFromPost(original), original), null);
  });

  it("durum aynıysa değişiklik sayılmaz, farklıysa gönderilir", () => {
    const original = post();
    assert.equal(buildUpdateDto(formFromPost(original), original, { status: "published" }), null);
    assert.deepEqual(buildUpdateDto(formFromPost(original), original, { status: "draft" }), { status: "draft" });
  });

  it("yalnız değişen alanları gönderir", () => {
    const original = post();
    const values = { ...formFromPost(original), coverImage: "", countryCode: "", tags: "asia, yeni" };
    assert.deepEqual(buildUpdateDto(values, original), { coverImage: null, countryCode: null, tags: ["asia", "yeni"] });
  });

  it("başlık değişince çeviri bütün olarak (title, excerpt, body) ama yalnız tr gönderilir", () => {
    const original = post();
    const dto = buildUpdateDto({ ...formFromPost(original), title: "Yeni başlık" }, original)!;
    assert.deepEqual(Object.keys(dto), ["translations"]);
    assert.deepEqual(Object.keys(dto.translations!), ["tr"]);
    assert.deepEqual(dto.translations!.tr, { title: "Yeni başlık", excerpt: "Kısa özet.", body: original.body });
  });

  it("gövde değişmediyse özgün bloklar aynen gönderilir (editör normalleştirmesi dokunmaz)", () => {
    const original = post({
      body: [
        { type: "paragraph", text: "  başında boşluk olan paragraf  " },
        { type: "quote", text: "alıntı\n" },
      ],
    });
    const dto = buildUpdateDto({ ...formFromPost(original), excerpt: "Yeni özet" }, original)!;
    assert.deepEqual(dto.translations!.tr!.body, original.body);
  });

  it("gövde değişince yeni bloklar gönderilir", () => {
    const original = post();
    const dto = buildUpdateDto({ ...formFromPost(original), body: blocksToText(original.body) + "\n\n- yeni madde" }, original)!;
    assert.equal(dto.translations!.tr!.body.length, 3);
    assert.deepEqual(dto.translations!.tr!.body[2], { type: "list", ordered: false, items: ["yeni madde"] });
  });

  it("slug değişimi küçük harfe çevrilip gönderilir", () => {
    const original = post();
    assert.deepEqual(buildUpdateDto({ ...formFromPost(original), slug: " Yeni-Adres " }, original), { slug: "yeni-adres" });
  });

  it("yayınlarken değişiklikle birlikte tek istekte gider", () => {
    const original = post({ status: "published" });
    const dto = buildUpdateDto({ ...formFromPost(original), title: "T2" }, original, { status: "draft" })!;
    assert.equal(dto.status, "draft");
    assert.ok(dto.translations);
  });

  it("CRLF içeren metin değişiklik sayılmaz", () => {
    const original = post();
    const values = formFromPost(original);
    assert.equal(buildUpdateDto({ ...values, body: values.body.replace(/\n/g, "\r\n") }, original), null);
  });
});

describe("formFromPost", () => {
  it("alanları forma çevirir; boş ülke/kapak boş metin olur", () => {
    const form = formFromPost(post({ coverImage: null, countryCode: null, tags: [] }));
    assert.equal(form.coverImage, "");
    assert.equal(form.countryCode, "");
    assert.equal(form.tags, "");
    assert.equal(form.body, "## Rota\n\nBirinci paragraf.");
    assert.deepEqual(parseBlocks(form.body).blocks, post().body);
  });
});

describe("mapServerErrors", () => {
  it("doğrulama ayrıntılarını alanlara eşler", () => {
    const error = apiError(400, "VALIDATION_FAILED", "Girilen bilgiler geçersiz.", [
      { field: "slug", code: "matches", message: "Biçim geçersiz." },
      { field: "coverImage", code: "isHttpsUrl", message: "Değer geçersiz." },
      { field: "tags", code: "matches", message: "Biçim geçersiz." },
      { field: "translations.tr.title", code: "minLength", message: "Çok kısa." },
      { field: "translations.tr.excerpt", code: "maxLength", message: "Çok uzun." },
      { field: "countryCode", code: "unknownCountry", message: "Böyle bir ülke yok." },
    ]);
    const errors = mapServerErrors(error);
    assert.match(errors.fields.slug!, /küçük harf/);
    assert.match(errors.fields.coverImage!, /https/);
    assert.match(errors.fields.tags!, /harf, rakam ve tire/);
    assert.equal(errors.fields.title, "Başlık boş olamaz.");
    assert.match(errors.fields.excerpt!, /en fazla 1000/);
    assert.match(errors.fields.countryCode!, /Böyle bir ülke yok/);
    assert.equal(errors.form, null);
  });

  it("gövde hatalarını satıra bağlar", () => {
    const error = apiError(400, "VALIDATION_FAILED", "Girilen bilgiler geçersiz.", [
      { field: "translations.tr.body.1.url", code: "isHttpsUrl", message: "Adres https:// ile başlayan geçerli bir adres olmalı." },
      { field: "translations.tr.body.0.items.2", code: "maxLength", message: "En fazla 1000 karakter olabilir." },
      { field: "translations.tr.body", code: "arrayNotEmpty", message: "Yayınlanan yazının gövdesi boş olamaz." },
    ]);
    const errors = mapServerErrors(error, { bodyLines: [4, 9] });
    assert.deepEqual(errors.body, [
      "Satır 9: Adres https:// ile başlayan geçerli bir adres olmalı.",
      "Satır 6: En fazla 1000 karakter olabilir.",
      "Yayınlanan yazının gövdesi boş olamaz.",
    ]);
  });

  it("slug çakışması slug alanında görünür", () => {
    const errors = mapServerErrors(apiError(409, "BLOG_SLUG_TAKEN", "Bu adres (slug) başka bir yazıda kullanılıyor.", [{ field: "slug", code: "unique", message: "Bu adres başka bir yazıda kullanılıyor." }]));
    assert.match(errors.fields.slug!, /başka bir yazıda kullanılıyor/);
    assert.equal(errors.form, null);
  });

  it("alana bağlanamayan hata genel hata olur", () => {
    assert.match(mapServerErrors(apiError(0, "NETWORK_ERROR", "Sunucuya ulaşılamadı.")).form!, /Sunucuya ulaşılamadı/);
    assert.match(mapServerErrors(apiError(403, "FORBIDDEN", "x")).form!, /yönetici yetkin yok/);
    assert.match(mapServerErrors(apiError(404, "NOT_FOUND", "x")).form!, /bulunamadı/);
    assert.match(mapServerErrors(apiError(413, "PAYLOAD_TOO_LARGE", "x")).form!, /çok büyük/);
    assert.match(mapServerErrors(apiError(401, "AUTH_TOKEN_INVALID", "x")).form!, /Oturumun sona ermiş/);
    assert.match(mapServerErrors(new Error("")).form!, /kaydedilemedi/);
    assert.match(mapServerErrors(null).form!, /kaydedilemedi/);
  });

  it("bilinmeyen alan hatasında sunucu mesajını gösterir", () => {
    const errors = mapServerErrors(apiError(400, "VALIDATION_FAILED", "Girilen bilgiler geçersiz.", [{ field: "status", code: "isIn", message: "Geçersiz." }]));
    assert.equal(errors.form, "Girilen bilgiler geçersiz.");
  });
});

describe("kullanıcı kuralları", () => {
  it("kendi hesabını tanır", () => {
    assert.equal(isSelf("u1", { id: "u1" }), true);
    assert.equal(isSelf("u1", { id: "u2" }), false);
    assert.equal(isSelf("u1", null), false);
    assert.equal(isSelf("u1", undefined), false);
  });

  it("rol etiketleri", () => {
    assert.equal(roleLabel("admin"), "Yönetici");
    assert.equal(roleLabel("user"), "Kullanıcı");
  });

  it("son yönetici hatası anlaşılır mesaj verir", () => {
    for (const action of ["role", "disable", "delete"] as const) {
      assert.equal(describeUserActionError(apiError(409, "LAST_ADMIN", "Son yönetici hesabı silinemez..."), action), LAST_ADMIN_MESSAGE);
    }
    assert.match(LAST_ADMIN_MESSAGE, /son aktif yönetici/);
  });

  it("diğer hatalar", () => {
    assert.match(describeUserActionError(apiError(404, "NOT_FOUND", "x"), "delete"), /bulunamadı/);
    assert.match(describeUserActionError(apiError(403, "FORBIDDEN", "x"), "role"), /yetkin yok/);
    assert.equal(describeUserActionError(apiError(500, "INTERNAL_ERROR", "Sunucu hatası."), "role"), "Sunucu hatası.");
    assert.equal(describeUserActionError(undefined, "enable"), "Hesap etkinleştirilemedi.");
    assert.equal(describeUserActionError(new Error("  "), "delete"), "Kullanıcı silinemedi.");
  });

  it("silme uyarısı geri alınamaz der ve adı içerir", () => {
    const text = deleteUserWarning("Ayşe");
    assert.match(text, /Ayşe/);
    assert.match(text, /geri alınamaz/);
  });
});

describe("skor kuralları", () => {
  it("süre biçimi", () => {
    assert.equal(formatDuration(0), "0 sn");
    assert.equal(formatDuration(52), "0,05 sn");
    assert.equal(formatDuration(205), "0,2 sn");
    assert.equal(formatDuration(1800), "1,8 sn");
    assert.equal(formatDuration(2000), "2 sn");
    assert.equal(formatDuration(9990), "9,99 sn");
    assert.equal(formatDuration(18500), "18,5 sn");
    assert.equal(formatDuration(30000), "30 sn");
    assert.equal(formatDuration(59960), "60 sn");
    assert.equal(formatDuration(60000), "1 dk");
    assert.equal(formatDuration(125000), "2 dk 5 sn");
    assert.equal(formatDuration(119600), "2 dk");
    assert.equal(formatDuration(-1), "");
    assert.equal(formatDuration(Number.NaN), "");
  });

  it("ön ayarlar: ilki süzgeci kapatır, kalanlar artan ve 2 sn içerir", () => {
    assert.equal(DURATION_PRESETS[0]!.value, undefined);
    const values = DURATION_PRESETS.slice(1).map((p) => p.value!);
    assert.deepEqual(values, [...values].sort((a, b) => a - b));
    assert.ok(values.includes(2000));
  });

  it("oyun türü etiketi; bilinmeyen tür olduğu gibi", () => {
    assert.equal(gameTypeLabel("flag-quiz"), "Bayrak");
    assert.equal(gameTypeLabel("capital-quiz"), "Başkent");
    assert.equal(gameTypeLabel("map-guess"), "Harita");
    assert.equal(gameTypeLabel("yeni-oyun"), "yeni-oyun");
  });

  it("özet", () => {
    assert.equal(scoreSummary(1850, 10, 10), "1850 puan · 10/10 doğru");
  });
});
