/**
 * Ekranlar arası tek seferlik bilgi mesajları. Rota parametresiyle (`?notice=`) taşınır; yalnız bu listedeki
 * değerler kabul edilir, serbest metin asla gösterilmez.
 */
export type AuthNotice = "password-changed" | "account-deleted" | "name-saved";

export const AUTH_NOTICES: Record<AuthNotice, { tone: "info" | "success"; title: string; message: string }> = {
  "password-changed": {
    tone: "info",
    title: "Parolan değişti",
    message: "Güvenlik için tüm cihazlardaki oturumların kapatıldı. Yeni parolanla yeniden giriş yap.",
  },
  "account-deleted": {
    tone: "success",
    title: "Hesabın silindi",
    message: "Hesabın ve ona bağlı oyun verilerin kalıcı olarak silindi.",
  },
  "name-saved": { tone: "success", title: "Kaydedildi", message: "Görünen adın güncellendi." },
};

export function parseAuthNotice(raw: string | string[] | undefined | null): AuthNotice | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value !== undefined && value !== null && Object.prototype.hasOwnProperty.call(AUTH_NOTICES, value) ? (value as AuthNotice) : null;
}
