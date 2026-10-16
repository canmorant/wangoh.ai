import type { NextFunction, Request, RequestHandler, Response } from "express";
import { AppException, type FieldErrorDetail } from "./errors.js";

/**
 * Doğrulama borusu (class-transformer, class-validator ve Nest'in `stripProtoKeys`i) özyinelemelidir:
 * 100 kb altındaki ama binlerce seviye iç içe bir gövde yığın taşırır ve 400 yerine 500 verir. Meşru
 * gövdeler (blog blokları, çeviri nesneleri) birkaç seviyeyi geçmez; bu sınır ayrıştırıcıdan hemen sonra,
 * hiçbir özyineleme çalışmadan uygulanır.
 */
export const MAX_JSON_DEPTH = 64;

/**
 * Tek nesnedeki anahtar sayısı üst sınırı. `forbidNonWhitelisted` her bilinmeyen anahtar için ayrı hata
 * üretir; 100 kb içine ~9500 anahtar sığar ve bu, tek iş parçacıklı sunucuda ~120 ms CPU harcatır.
 */
export const MAX_JSON_OBJECT_KEYS = 500;

/** Eşleşmemiş (tek başına) vekil kod birimi: `u` bayrağıyla yalnız geçersiz olanlar `Cs` sınıfında kalır. */
const LONE_SURROGATE = /\p{Cs}/u;

/** Yanıtta yankılanan alan yolu bu uzunluğa kırpılır (anahtar adları kullanıcı girdisidir). */
const MAX_REPORTED_FIELD = 200;

function problem(field: string, code: string, message: string): FieldErrorDetail {
  return { field: field.slice(0, MAX_REPORTED_FIELD), code, message };
}

/**
 * Ayrıştırılmış JSON gövdesinde doğrulama borusunu çökertebilecek ya da veritabanı/doğrulayıcı
 * kütüphanelerinde işlenmemiş istisna üretecek ilk sorunu döner (yoksa `undefined`):
 *
 * - eşleşmemiş vekil karakter (`"\ud800"`): `validator.js` `isEmail` içinde `encodeURI` `URIError` fırlatır
 *   ve istek 500 olurdu;
 * - `MAX_JSON_DEPTH` üstü iç içe yapı; `MAX_JSON_OBJECT_KEYS` üstü anahtar.
 *
 * Özyineleme derinliği `MAX_JSON_DEPTH` ile sınırlıdır, bu yüzden bu işlev kendisi yığın taşıramaz.
 */
export function findJsonProblem(root: unknown): FieldErrorDetail | undefined {
  return visit(root, 0, "");
}

function visit(value: unknown, depth: number, path: string): FieldErrorDetail | undefined {
  if (typeof value === "string") {
    return LONE_SURROGATE.test(value) ? problem(path, "isWellFormed", "Geçersiz Unicode karakter içeriyor.") : undefined;
  }
  if (value === null || typeof value !== "object") return undefined;
  // Derinlik hatası, iç içeliğin başladığı üst düzey alanı gösterir (yolun tamamı yüzlerce `0.0.0...` olurdu).
  if (depth >= MAX_JSON_DEPTH) return problem(path.split(".")[0] ?? "", "maxDepth", "İç içe yapı çok derin.");

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const found = visit(value[i], depth + 1, path ? `${path}.${i}` : String(i));
      if (found) return found;
    }
    return undefined;
  }

  const keys = Object.keys(value);
  if (keys.length > MAX_JSON_OBJECT_KEYS) return problem(path, "maxKeys", "Çok fazla alan gönderildi.");
  for (const key of keys) {
    // Anahtarın kendisi yankılanmaz: geçersiz karakterli bir ad yanıtı da geçersiz kılardı.
    if (LONE_SURROGATE.test(key)) return problem(path, "isWellFormed", "Geçersiz Unicode karakter içeriyor.");
    const found = visit((value as Record<string, unknown>)[key], depth + 1, path ? `${path}.${key}` : key);
    if (found) return found;
  }
  return undefined;
}

/** Gövde ayrıştırıcıdan sonra çalışır; sorun varsa tutarlı 400 `VALIDATION_FAILED` ile durdurur. */
export function guardParsedBody(req: Request, next: NextFunction): void {
  const found = findJsonProblem(req.body);
  next(found ? AppException.validation([found]) : undefined);
}

/**
 * Yolda ya da sorgu dizgisinde yüzde-kodlu NUL baytı (`%00`) içeren isteği reddeder. PostgreSQL metin
 * değerinde NUL kabul etmez (`invalid byte sequence ... 0x00`); `q`, `slug`, `tag`, `country` gibi
 * dizgi parametreleri sorguya girince 500 olurdu. `%2500` (yüzde işaretinin kodlanmış hâli) sıradan
 * metindir ve geçer.
 */
export function rejectNullBytesInUrl(): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (req.originalUrl.includes("%00")) {
      next(AppException.validation([problem("", "noNullBytes", "İstek adresi geçersiz karakter içeriyor.")]));
      return;
    }
    next();
  };
}
