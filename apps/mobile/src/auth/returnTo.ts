/**
 * Giriş sonrası dönüş yolu (`returnTo`). AuthGate bunu geçerli yolla verir; URL'den de geldiği için
 * (web'de `?returnTo=` herkesin yazabileceği bir değerdir) yalnız uygulama içi, güvenli yollar kabul edilir.
 */

const MAX_LENGTH = 300;

/** Giriş akışının kendisi: oraya dönmek döngü olurdu. */
const AUTH_PATHS: ReadonlySet<string> = new Set(["/login", "/register"]);

function firstValue(raw: string | string[] | undefined | null): string | undefined {
  return Array.isArray(raw) ? raw[0] : (raw ?? undefined);
}

/**
 * Güvenli uygulama içi yolu döndürür; geçersizse null.
 * Reddedilenler: "/" ile başlamayanlar (şemalı adresler dahil), "//" ve "/\" (ağ yolu), denetim
 * karakterleri, ters bölü, çok uzun değerler ve giriş/kayıt ekranının kendisi.
 */
export function safeReturnTo(raw: string | string[] | undefined | null): string | null {
  const value = firstValue(raw)?.trim();
  if (!value || value.length > MAX_LENGTH) return null;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return null;
  // Denetim karakterleri (satır sonu, NUL...) ve ters bölü.
  for (let index = 0; index < value.length; index++) {
    const code = value.charCodeAt(index);
    if (code <= 0x1f || code === 0x7f || value[index] === "\\") return null;
  }
  const pathname = (value.split(/[?#]/, 1)[0] ?? "").replace(/^\/\(auth\)/, "").replace(/\/+$/, "");
  if (AUTH_PATHS.has(pathname)) return null;
  return value;
}
