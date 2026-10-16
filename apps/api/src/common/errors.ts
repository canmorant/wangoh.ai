import { HttpException, HttpStatus } from "@nestjs/common";

/** Makine okur hata kodları. İstemciler `message` yerine bunlara göre dallanır. */
export const ErrorCode = {
  VALIDATION_FAILED: "VALIDATION_FAILED",
  BAD_REQUEST: "BAD_REQUEST",
  NOT_FOUND: "NOT_FOUND",
  FORBIDDEN: "FORBIDDEN",
  CONFLICT: "CONFLICT",
  RATE_LIMITED: "RATE_LIMITED",
  PAYLOAD_TOO_LARGE: "PAYLOAD_TOO_LARGE",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  AUTH_REQUIRED: "AUTH_REQUIRED",
  AUTH_INVALID_CREDENTIALS: "AUTH_INVALID_CREDENTIALS",
  AUTH_EMAIL_TAKEN: "AUTH_EMAIL_TAKEN",
  AUTH_TOKEN_INVALID: "AUTH_TOKEN_INVALID",
  AUTH_ACCOUNT_DISABLED: "AUTH_ACCOUNT_DISABLED",
  LAST_ADMIN: "LAST_ADMIN",
} as const;
export type ErrorCodeValue = (typeof ErrorCode)[keyof typeof ErrorCode] | (string & {});

/** Doğrulama hatası ayrıntısı (`details` dizisinin elemanı). */
export interface FieldErrorDetail {
  /** Noktalı yol: `email`, `items.0.text`. Gövde düzeyi hatalarda boş. */
  field: string;
  /** Makine okur kısıt adı (class-validator): `isEmail`, `maxLength`... */
  code: string;
  /** Kullanıcıya gösterilebilir Türkçe açıklama. */
  message: string;
}

/**
 * Tutarlı hata gövdesi `{ statusCode, code, message, details? }` üreten özel istisna.
 * Alan görevleri hata fırlatırken bunu (ya da aşağıdaki kısayolları) kullanır; `message` Türkçe
 * ve kullanıcıya gösterilebilir olmalı, iç ayrıntı içermemeli.
 */
export class AppException extends HttpException {
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, code: ErrorCodeValue, message: string, details?: unknown) {
    super({ statusCode: status, code, message, ...(details === undefined ? {} : { details }) }, status);
    this.code = code;
    this.details = details;
  }

  static badRequest(message: string, code: ErrorCodeValue = ErrorCode.BAD_REQUEST, details?: unknown): AppException {
    return new AppException(HttpStatus.BAD_REQUEST, code, message, details);
  }
  static unauthorized(code: ErrorCodeValue, message: string): AppException {
    return new AppException(HttpStatus.UNAUTHORIZED, code, message);
  }
  static forbidden(message = "Bu işlem için yetkiniz yok.", code: ErrorCodeValue = ErrorCode.FORBIDDEN): AppException {
    return new AppException(HttpStatus.FORBIDDEN, code, message);
  }
  static notFound(message = "Kayıt bulunamadı.", code: ErrorCodeValue = ErrorCode.NOT_FOUND): AppException {
    return new AppException(HttpStatus.NOT_FOUND, code, message);
  }
  static conflict(message: string, code: ErrorCodeValue = ErrorCode.CONFLICT, details?: unknown): AppException {
    return new AppException(HttpStatus.CONFLICT, code, message, details);
  }
  static validation(details: FieldErrorDetail[], message = "Girilen bilgiler geçersiz."): AppException {
    return new AppException(HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_FAILED, message, details);
  }
}

/**
 * Veritabanı benzersizlik ihlali mi (PostgreSQL 23505)? Drizzle sürücü hatasını `cause` zincirine
 * sarar; hem node-postgres hem PGlite için zinciri gezer. `constraint` verilirse ad da eşleşmeli.
 */
export function isUniqueViolation(err: unknown, constraint?: string): boolean {
  let current: unknown = err;
  for (let depth = 0; depth < 5 && current && typeof current === "object"; depth++) {
    const e = current as { code?: unknown; constraint?: unknown; message?: unknown; cause?: unknown };
    if (e.code === "23505") {
      if (constraint === undefined) return true;
      if (e.constraint === constraint) return true;
      if (typeof e.message === "string" && e.message.includes(constraint)) return true;
    }
    current = e.cause;
  }
  return false;
}
