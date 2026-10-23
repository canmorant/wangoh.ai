/**
 * API hatalarını kullanıcıya gösterilecek Türkçe mesaja ve form alanı hatalarına çevirir (saf mantık,
 * Node altında test edilir; bkz. authErrors.test.ts).
 *
 * Hata gövdesi her yerde `{ statusCode, code, message, details? }` (belge bölüm 5); `message` zaten
 * Türkçedir ama bağlama göre daha yönlendirici bir metin gerektiğinde burada özelleştirilir.
 */
import { DEFAULT_ERROR_MESSAGE, getErrorCode, getErrorMessage, getErrorStatus, isNetworkError } from "../api/errors";

/** Hata mesajının bağlı olduğu form alanı (sunucudaki alan adlarıyla aynı). */
export type AuthField = "email" | "password" | "displayName" | "currentPassword" | "newPassword";

/** Hatanın geldiği işlem: aynı kod bağlama göre farklı anlatılır (yanlış parola giriş ile hesap silmede ayrı cümledir). */
export type AuthErrorContext = "login" | "register" | "updateProfile" | "changePassword" | "deleteAccount";

export type AuthErrorKind =
  | "network"
  | "credentials"
  | "emailTaken"
  | "disabled"
  | "validation"
  | "rateLimited"
  | "sessionExpired"
  | "server"
  | "other";

export interface AuthErrorInfo {
  kind: AuthErrorKind;
  /** Form üstünde gösterilecek genel mesaj (her zaman dolu). */
  message: string;
  /** Alan altında gösterilecek mesajlar; boşsa hata alana bağlanamadı, yalnız `message` gösterilir. */
  fieldErrors: Partial<Record<AuthField, string>>;
}

export const NETWORK_MESSAGE = "Sunucuya ulaşılamadı. İnternet bağlantını kontrol edip tekrar dene.";
export const RATE_LIMITED_MESSAGE = "Çok fazla deneme yaptın. Biraz bekleyip tekrar dene.";
export const SERVER_MESSAGE = "Sunucu şu an yanıt veremiyor. Biraz sonra tekrar dene.";
export const SESSION_EXPIRED_MESSAGE = "Oturumunun süresi dolmuş. Lütfen yeniden giriş yap.";
export const DISABLED_MESSAGE = "Hesabın devre dışı bırakılmış, bu hesapla giriş yapılamaz.";
export const EMAIL_TAKEN_MESSAGE = "Bu e-posta adresi zaten kayıtlı. Giriş yapmayı dene.";
export const VALIDATION_FALLBACK_MESSAGE = "Girdiğin bilgileri kontrol edip tekrar dene.";

const FIELDS: ReadonlySet<string> = new Set<AuthField>(["email", "password", "displayName", "currentPassword", "newPassword"]);

function isAuthField(value: string): value is AuthField {
  return FIELDS.has(value);
}

/** Alan + kısıt adı (class-validator) için yönlendirici Türkçe metin; bilinmeyen birleşimde sunucu metni kullanılır. */
function fieldDetailMessage(field: AuthField, constraint: string, serverMessage: string | undefined): string {
  switch (field) {
    case "email":
      if (constraint === "maxLength") return "E-posta en fazla 254 karakter olabilir.";
      if (constraint === "isNotEmpty" || constraint === "isDefined") return "E-posta adresini gir.";
      return "Geçerli bir e-posta adresi gir.";
    case "password":
    case "newPassword":
      if (constraint === "minLength") return field === "newPassword" ? "Yeni parola en az 8 karakter olmalı." : "Parola en az 8 karakter olmalı.";
      if (constraint === "maxLength") return "Parola en fazla 128 karakter olabilir.";
      break;
    case "currentPassword":
      if (constraint === "minLength" || constraint === "isNotEmpty") return "Mevcut parolanı gir.";
      if (constraint === "maxLength") return "Parola en fazla 128 karakter olabilir.";
      break;
    case "displayName":
      if (constraint === "minLength") return "Görünen ad en az 2 karakter olmalı.";
      if (constraint === "maxLength") return "Görünen ad en fazla 50 karakter olabilir.";
      if (constraint === "matches" || constraint === "noNullBytes") return "Görünen ad geçersiz karakter içeriyor.";
      break;
  }
  return serverMessage && serverMessage.trim() ? serverMessage : "Bu alan geçersiz.";
}

/** `details` dizisinden alan hatalarını çıkarır; bir alanın ilk hatası gösterilir. Bilinmeyen alanlar atlanır. */
export function fieldErrorsFromDetails(details: unknown): Partial<Record<AuthField, string>> {
  const result: Partial<Record<AuthField, string>> = {};
  if (!Array.isArray(details)) return result;
  for (const item of details) {
    if (typeof item !== "object" || item === null) continue;
    const record = item as Record<string, unknown>;
    const field = typeof record.field === "string" ? record.field : "";
    if (!isAuthField(field) || result[field]) continue;
    const constraint = typeof record.code === "string" ? record.code : "";
    const serverMessage = typeof record.message === "string" ? record.message : undefined;
    result[field] = fieldDetailMessage(field, constraint, serverMessage);
  }
  return result;
}

function credentialsInfo(context: AuthErrorContext): AuthErrorInfo {
  switch (context) {
    case "changePassword":
      return { kind: "credentials", message: "Mevcut parolan hatalı.", fieldErrors: { currentPassword: "Mevcut parola hatalı." } };
    case "deleteAccount":
      return { kind: "credentials", message: "Parola hatalı.", fieldErrors: { password: "Parola hatalı." } };
    case "login":
      return { kind: "credentials", message: "E-posta veya parola hatalı.", fieldErrors: {} };
    default:
      return { kind: "credentials", message: "Bilgiler hatalı.", fieldErrors: {} };
  }
}

export function describeAuthError(error: unknown, context: AuthErrorContext): AuthErrorInfo {
  if (isNetworkError(error)) return { kind: "network", message: NETWORK_MESSAGE, fieldErrors: {} };

  const status = getErrorStatus(error);
  const code = getErrorCode(error);

  if (code === "RATE_LIMITED" || status === 429) return { kind: "rateLimited", message: RATE_LIMITED_MESSAGE, fieldErrors: {} };

  switch (code) {
    case "AUTH_INVALID_CREDENTIALS":
      return credentialsInfo(context);
    case "AUTH_EMAIL_TAKEN":
      return { kind: "emailTaken", message: EMAIL_TAKEN_MESSAGE, fieldErrors: { email: EMAIL_TAKEN_MESSAGE } };
    case "AUTH_ACCOUNT_DISABLED":
      // Giriş dışındaki bağlamda (oturum açıkken devre dışı bırakıldı) 401 ile gelir ve oturum zaten düşer.
      return { kind: "disabled", message: DISABLED_MESSAGE, fieldErrors: {} };
    case "VALIDATION_FAILED": {
      const details = (error as { details?: unknown }).details;
      const fieldErrors = fieldErrorsFromDetails(details);
      const hasFields = Object.keys(fieldErrors).length > 0;
      return { kind: "validation", message: hasFields ? VALIDATION_FALLBACK_MESSAGE : getErrorMessage(error, VALIDATION_FALLBACK_MESSAGE), fieldErrors };
    }
    case "AUTH_TOKEN_INVALID":
    case "AUTH_REQUIRED":
      return { kind: "sessionExpired", message: SESSION_EXPIRED_MESSAGE, fieldErrors: {} };
  }

  // Giriş ve kayıt dışındaki işlemlerde 401, oturumun bittiği anlamına gelir (api-client yenilemeyi zaten denedi).
  if (status === 401 && context !== "login" && context !== "register") {
    return { kind: "sessionExpired", message: SESSION_EXPIRED_MESSAGE, fieldErrors: {} };
  }
  if (status !== undefined && status >= 500) return { kind: "server", message: SERVER_MESSAGE, fieldErrors: {} };

  return { kind: "other", message: getErrorMessage(error, DEFAULT_ERROR_MESSAGE), fieldErrors: {} };
}
