/**
 * Görsel atıflarının (`imageCredits`) saf mantığı: metin düzeltme, bağlantı şeması süzme, satır oluşturma.
 * React Native içe aktarmaz; birim testle kanıtlanır.
 *
 * Neden var: Wikimedia Commons görsellerinin çoğu CC BY / CC BY-SA lisanslıdır; bu lisanslar yazar adının, lisans
 * bağlantısının ve kaynak bağlantısının gösterilmesini şart koşar (web: `apps/web/src/components/ImageCredits.tsx`).
 * API yalnız atıf gerektiren görselleri listeler; boş dizi hata değil, "gösterilecek atıf yok" demektir.
 */

import type { ImageCreditDto } from "@wangoh/api-client";

/** Bağlantı etiketleri (arayüz metni). */
export const CREDITS_TITLE = "Görsel atıfları";
export const SOURCE_LABEL = "Kaynak";

const MAX_URL_LENGTH = 2048;

/**
 * Boşluk, denetim karakterleri ve ters eğik çizgi: tarayıcı/işletim sistemi URL ayrıştırıcıları bunları sessizce
 * siler ya da çevirir ("java\tscript:", "https:\\host" gibi gizleme/yanlış şema yolları); bu yüzden hiç kabul edilmez.
 */
// eslint-disable-next-line no-control-regex
const FORBIDDEN_URL_CHARS = /[\u0000- \u007f-\u009f\\]/;
/** Şema (http/https), ardından `//` ve bir ana makine adı (kullanıcı bilgisi `@` olmadan; isteğe bağlı bağlantı noktası). */
const HTTP_URL = /^(https?):\/\/([\p{L}\p{N}.-]+)(?::\d{1,5})?(?=[/?#]|$)/iu;

/**
 * Yazar/lisans adı gibi kaynak metni: her boşluk dizisi (satır sonları dahil) tek boşluk olur, kırpılır; boş kalırsa null.
 * Metin KISALTILMAZ (uzun yazar açıklamaları da olduğu gibi gösterilir, satırlara sarılır).
 */
export function normalizeText(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const text = value.replace(/\s+/g, " ").trim();
  return text === "" ? null : text;
}

/**
 * Yalnız http/https bağlantıları geçer; başka her şey (javascript:, data:, file:, intent:, tel:, mailto:, şemasız,
 * protokol-göreli, boş ana makine, kullanıcı bilgili) null döner. Geçerliyse kırpılmış ve küçük harf şemalı adres döner.
 */
export function safeHttpUrl(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const url = value.trim();
  if (url === "" || url.length > MAX_URL_LENGTH || FORBIDDEN_URL_CHARS.test(url)) return null;
  const match = HTTP_URL.exec(url);
  if (!match) return null;
  const scheme = match[1] ?? "";
  return scheme.toLowerCase() + url.slice(scheme.length);
}

/**
 * Bağlantıyı yalnız güvenliyse açar. `open` enjekte edilir (uygulamada `Linking.openURL`), böylece "güvensiz şema ASLA açılmaz"
 * kuralı testle kanıtlanır. Açıldıysa true; açılamayan sistem hatası sessizce yutulur (tarayıcı yok, engelli).
 */
export function openSafeUrl(url: string | null | undefined, open: (url: string) => Promise<unknown>): boolean {
  const safe = safeHttpUrl(url);
  if (safe === null) return false;
  try {
    open(safe).catch(() => undefined);
  } catch {
    return false;
  }
  return true;
}

export interface CreditRow {
  /** Görselin mutlak adresi (listede benzersiz anahtar). */
  key: string;
  /** Yazar, boşlukları düzeltilmiş. */
  author: string | null;
  /** Güvenli kaynak sayfası bağlantısı. */
  sourceUrl: string | null;
  /** Lisansın görünen adı. */
  licenseName: string | null;
  /** Lisans bağlantısı: yalnız lisans adı varsa ve adres güvenliyse. */
  licenseUrl: string | null;
  /** Ekran okuyucu: kaynak bağlantısı. */
  sourceA11yLabel: string;
  /** Ekran okuyucu: lisans bağlantısı. */
  licenseA11yLabel: string | null;
}

/**
 * API kayıtlarını gösterilecek satırlara çevirir. Kurallar web'in `ImageCredits` bileşeniyle aynıdır:
 * `yazar · Kaynak · lisans`; lisans adı yoksa lisans bağlantısı gösterilmez, yalnız kaynak kalır; aynı görsel tek satır.
 * Güvensiz adresler satırdan çıkarılır (bağlantı olmaz, metin kalır); gösterilecek hiçbir şeyi kalmayan kayıt atlanır.
 */
export function buildCreditRows(credits: readonly ImageCreditDto[] | null | undefined): CreditRow[] {
  if (!credits) return [];
  const seen = new Set<string>();
  const rows: CreditRow[] = [];
  for (const credit of credits) {
    if (!credit || seen.has(credit.imageUrl)) continue;
    const author = normalizeText(credit.author);
    const sourceUrl = safeHttpUrl(credit.sourceUrl);
    const licenseName = normalizeText(credit.licenseName);
    const licenseUrl = licenseName === null ? null : safeHttpUrl(credit.licenseUrl);
    if (author === null && sourceUrl === null && licenseName === null) continue;
    seen.add(credit.imageUrl);
    rows.push({
      key: credit.imageUrl,
      author,
      sourceUrl,
      licenseName,
      licenseUrl,
      sourceA11yLabel: `${SOURCE_LABEL}${author ? `: ${author}` : ""}. Tarayıcıda açılır`,
      licenseA11yLabel: licenseName && licenseUrl ? `Lisans: ${licenseName}. Tarayıcıda açılır` : null,
    });
  }
  return rows;
}

/** Satırın düz metin karşılığı (`yazar · Kaynak · lisans`): ekran görüntüsü/test karşılaştırması ve günlük için. */
export function creditRowText(row: Pick<CreditRow, "author" | "sourceUrl" | "licenseName">): string {
  return [row.author, row.sourceUrl ? SOURCE_LABEL : null, row.licenseName].filter((part): part is string => part !== null).join(" · ");
}
