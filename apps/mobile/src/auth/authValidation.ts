/**
 * Form doğrulaması (saf mantık, Node altında test edilir; bkz. authValidation.test.ts).
 *
 * Sunucu DTO sınırlarının aynasıdır (apps/api/src/auth/dto, users/dto): e-posta ≤ 254, parola 8–128,
 * görünen ad 2–50. Sunucu yine de son sözü söyler; buradaki amaç gereksiz isteği ve beklemeyi önlemek.
 */
import type { AuthField } from "./authErrors";

export const EMAIL_MAX_LENGTH = 254;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const DISPLAY_NAME_MIN_LENGTH = 2;
export const DISPLAY_NAME_MAX_LENGTH = 50;

export type FieldErrors<F extends AuthField = AuthField> = Partial<Record<F, string>>;

// Basit biçim denetimi: yerel@alan.uzantı, boşluk yok. Asıl denetim sunucudadır (class-validator isEmail).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(raw: string): string {
  return raw.trim();
}

/** Görünen ad kenar boşluklarından arındırılır ve iç boşluklar tek boşluğa indirilir. */
export function normalizeDisplayName(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

export function validateEmail(raw: string): string | null {
  const email = normalizeEmail(raw);
  if (!email) return "E-posta adresini gir.";
  if (email.length > EMAIL_MAX_LENGTH) return `E-posta en fazla ${EMAIL_MAX_LENGTH} karakter olabilir.`;
  if (!EMAIL_PATTERN.test(email)) return "Geçerli bir e-posta adresi gir.";
  return null;
}

/** Giriş: yalnız dolu olması ve sınır; kısa parolalı eski hesapların girişi engellenmez. */
export function validateLoginPassword(password: string): string | null {
  if (!password) return "Parolanı gir.";
  if (password.length > PASSWORD_MAX_LENGTH) return `Parola en fazla ${PASSWORD_MAX_LENGTH} karakter olabilir.`;
  return null;
}

export function validateNewPassword(password: string, label = "Parola"): string | null {
  if (!password) return `${label}yı gir.`;
  if (password.length < PASSWORD_MIN_LENGTH) return `${label} en az ${PASSWORD_MIN_LENGTH} karakter olmalı.`;
  if (password.length > PASSWORD_MAX_LENGTH) return `${label} en fazla ${PASSWORD_MAX_LENGTH} karakter olabilir.`;
  return null;
}

/**
 * Sunucu deseni `^[^\p{Cc}\p{Cf}]+$`: kontrol ve biçim karakterlerini (görünmez yönlendirme hileleri)
 * reddeder. Hermes'te Unicode özellik kaçışlarına güvenmemek için sık rastlananlar aralıkla denetlenir;
 * kaçanı sunucu yakalar ve alan hatası olarak gösterilir.
 */
export function hasControlOrFormatChars(text: string): boolean {
  for (let index = 0; index < text.length; index++) {
    const code = text.charCodeAt(index);
    if (code <= 0x1f || (code >= 0x7f && code <= 0x9f)) return true; // Cc
    if (code === 0xad || code === 0x061c || code === 0x180e || code === 0xfeff) return true; // Cf
    if (code >= 0x200b && code <= 0x200f) return true; // sıfır genişlik, LRM/RLM
    if (code >= 0x202a && code <= 0x202e) return true; // yön gömme/geçersiz kılma
    if (code >= 0x2060 && code <= 0x206f) return true; // kelime birleştirici, yalıtım
  }
  return false;
}

export function validateDisplayName(raw: string): string | null {
  const name = normalizeDisplayName(raw);
  if (!name) return "Görünen adını gir.";
  if (name.length < DISPLAY_NAME_MIN_LENGTH) return `Görünen ad en az ${DISPLAY_NAME_MIN_LENGTH} karakter olmalı.`;
  if (name.length > DISPLAY_NAME_MAX_LENGTH) return `Görünen ad en fazla ${DISPLAY_NAME_MAX_LENGTH} karakter olabilir.`;
  if (hasControlOrFormatChars(name)) return "Görünen ad geçersiz karakter içeriyor.";
  return null;
}

function compact<F extends AuthField>(entries: ReadonlyArray<readonly [F, string | null]>): FieldErrors<F> {
  const errors: FieldErrors<F> = {};
  for (const [field, message] of entries) {
    if (message) errors[field] = message;
  }
  return errors;
}

export function hasErrors(errors: object): boolean {
  return Object.keys(errors).length > 0;
}

export function validateLoginForm(form: { email: string; password: string }): FieldErrors<"email" | "password"> {
  return compact([
    ["email", validateEmail(form.email)],
    ["password", validateLoginPassword(form.password)],
  ]);
}

export function validateRegisterForm(form: {
  displayName: string;
  email: string;
  password: string;
}): FieldErrors<"displayName" | "email" | "password"> {
  return compact([
    ["displayName", validateDisplayName(form.displayName)],
    ["email", validateEmail(form.email)],
    ["password", validateNewPassword(form.password)],
  ]);
}

export function validateChangePasswordForm(form: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): FieldErrors<"currentPassword" | "newPassword"> & { confirmPassword?: string } {
  const errors: FieldErrors<"currentPassword" | "newPassword"> & { confirmPassword?: string } = compact([
    ["currentPassword", form.currentPassword ? null : "Mevcut parolanı gir."],
    ["newPassword", validateNewPassword(form.newPassword, "Yeni parola")],
  ]);
  if (!errors.newPassword && form.newPassword === form.currentPassword) {
    errors.newPassword = "Yeni parola mevcut parolayla aynı olamaz.";
  }
  if (!errors.newPassword && form.confirmPassword !== form.newPassword) {
    errors.confirmPassword = "Parolalar eşleşmiyor.";
  }
  return errors;
}

export function validateDeleteAccountForm(form: { password: string }): FieldErrors<"password"> {
  return compact([["password", form.password ? null : "Onaylamak için parolanı gir."]]);
}
