import { localizePath } from "@/i18n/paths";
import { DEFAULT_LOCALE, LOCALES, type AppLocale } from "@/i18n/routing";
import { emojiStrip } from "./scoring";

/**
 * Sonuç paylaşım metni (saf; tarayıcı API'si yok):
 *
 *   Wangoh · Kaç kilometre? — Günün Turu 9 Ekim 2026 · seri 3
 *   🟩🟨🟧🟥🟩🟩🟨🟧🟩🟥
 *   7.240 / 10.000
 *   wangoh.com/mesafe
 */
export interface ShareInput {
  /** Başlık satırı (oyun adı, mod, tarih, seri; dile göre çağıran kurar). */
  header: string;
  scores: readonly number[];
  /** Hazır biçimlenmiş "7.240 / 10.000" satırı. */
  scoreLine: string;
  /** Sitenin adresi, protokolsüz ("wangoh.com/mesafe"). */
  url: string;
}

export const shareText = ({ header, scores, scoreLine, url }: ShareInput): string =>
  [header, emojiStrip(scores), scoreLine, url].join("\n");

/** Dile göre oyunun herkese açık adresi, protokolsüz (tr wangoh.com/mesafe, en wangoh.com/en/distance...). */
export const SHARE_HOST = "wangoh.com";
export function shareUrl(locale: string): string {
  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as AppLocale) : DEFAULT_LOCALE;
  // Türkçe öneksiz (as-needed); diğer diller /en/distance gibi önekli.
  return `${SHARE_HOST}${l === DEFAULT_LOCALE ? "" : `/${l}`}${localizePath("/mesafe", l)}`;
}

export type ShareResult = "shared" | "copied" | "failed" | "cancelled";

/**
 * Paylaş: tarayıcıda/telefonda paylaşım sayfası varsa o, yoksa panoya kopyala.
 * Kullanıcı hareketinin (tıklama) içinde çağrılmalı. Hiçbir durumda fırlatmaz.
 */
export async function shareOrCopy(text: string, title: string): Promise<ShareResult> {
  try {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      const data: ShareData = { title, text };
      if (!navigator.canShare || navigator.canShare(data)) {
        try {
          await navigator.share(data);
          return "shared";
        } catch (error) {
          // Kullanıcı paylaşım penceresini kapattı: kopyalamaya düşme.
          if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
          // Başka hata (izin, desteklenmeyen WebView): kopyalamaya düş.
        }
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return "copied";
    }
  } catch {
    /* kopyalama reddedildi: son çare aşağıda */
  }
  return legacyCopy(text) ? "copied" : "failed";
}

/** Eski WebView'lar için: gizli metin alanı + execCommand. */
function legacyCopy(text: string): boolean {
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
    document.body.appendChild(area);
    area.select();
    area.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  } catch {
    return false;
  }
}
