import type { ValidationError } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";
import { AppException, type FieldErrorDetail } from "./errors.js";

/** class-validator kısıt adlarının kullanıcıya gösterilebilir Türkçe karşılıkları. */
const CONSTRAINT_MESSAGES: Record<string, string> = {
  whitelistValidation: "Bu alana izin verilmiyor.",
  isNotEmpty: "Bu alan boş olamaz.",
  isDefined: "Bu alan zorunludur.",
  isString: "Metin olmalı.",
  isEmail: "Geçerli bir e-posta adresi girin.",
  minLength: "Çok kısa.",
  maxLength: "Çok uzun.",
  length: "Uzunluk geçersiz.",
  matches: "Biçim geçersiz.",
  isInt: "Tam sayı olmalı.",
  isNumber: "Sayı olmalı.",
  isPositive: "Pozitif bir sayı olmalı.",
  min: "Değer çok küçük.",
  max: "Değer çok büyük.",
  isBoolean: "Evet/hayır değeri olmalı.",
  isIn: "İzin verilen değerlerden biri olmalı.",
  isEnum: "İzin verilen değerlerden biri olmalı.",
  isArray: "Liste olmalı.",
  arrayMinSize: "Liste çok kısa.",
  arrayMaxSize: "Liste çok uzun.",
  arrayUnique: "Liste tekrarlı değer içeremez.",
  arrayNotEmpty: "Liste boş olamaz.",
  isObject: "Nesne olmalı.",
  isUUID: "Geçerli bir kimlik olmalı.",
  isUrl: "Geçerli bir adres olmalı.",
  isDateString: "Geçerli bir tarih olmalı.",
  isISO8601: "Geçerli bir tarih olmalı.",
  isLatitude: "Geçerli bir enlem olmalı.",
  isLongitude: "Geçerli bir boylam olmalı.",
  nestedValidation: "İç içe değer geçersiz.",
  unknownValue: "Değer geçersiz.",
  noNullBytes: "Geçersiz karakter içeriyor.",
};

const FALLBACK_MESSAGE = "Değer geçersiz.";

/**
 * Yanıttaki `details` en fazla bu kadar kayıt taşır. `forbidNonWhitelisted` her bilinmeyen anahtar için
 * ayrı hata üretir; sınır olmazsa küçük bir istek ~9 kat büyük bir yanıta dönüşürdü. Biçim hataları
 * için 50 alan fazlasıyla yeter.
 */
export const MAX_ERROR_DETAILS = 50;

/**
 * `ValidationError` ağacını düz, Türkçe `details` dizisine çevirir (iç içe alanlar noktalı yol). En fazla
 * `limit` (varsayılan `MAX_ERROR_DETAILS`) kayıt üretir; sınıra varınca ağacı gezmeyi bırakır.
 */
export function flattenValidationErrors(errors: ValidationError[], parentPath = "", limit = MAX_ERROR_DETAILS): FieldErrorDetail[] {
  const out: FieldErrorDetail[] = [];
  collect(errors, parentPath, limit, out);
  return out;
}

function collect(errors: ValidationError[], parentPath: string, limit: number, out: FieldErrorDetail[]): void {
  for (const error of errors) {
    if (out.length >= limit) return;
    const field = parentPath ? `${parentPath}.${error.property}` : error.property;
    for (const code of Object.keys(error.constraints ?? {})) {
      if (out.length >= limit) return;
      out.push({ field, code, message: CONSTRAINT_MESSAGES[code] ?? FALLBACK_MESSAGE });
    }
    if (error.children?.length) collect(error.children, field, limit, out);
  }
}

/** Uygulama genelindeki doğrulama borusu: bilinmeyen alan reddedilir, tipler dönüştürülür. */
export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    // Örtük dönüştürme kapalı: "false" dizgisi sessizce true olmasın. Sayılar `@Type`, mantıksal
    // değerler `@ToBoolean` ile açıkça dönüştürülür.
    transformOptions: { enableImplicitConversion: false },
    exceptionFactory: (errors) => AppException.validation(flattenValidationErrors(errors)),
  });
}
