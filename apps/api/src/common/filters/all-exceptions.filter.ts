import { type ArgumentsHost, Catch, type ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import type { Response } from "express";
import { ErrorCode } from "../errors.js";

interface ErrorBody {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
}

/** Çerçeve istisnaları (404, 429...) İngilizce ve girdi yansıtabilir; bunların yerine sabit Türkçe metin kullanılır. */
const DEFAULTS: Record<number, { code: string; message: string }> = {
  400: { code: ErrorCode.BAD_REQUEST, message: "İstek geçersiz." },
  401: { code: ErrorCode.AUTH_REQUIRED, message: "Bu işlem için giriş yapmalısınız." },
  403: { code: ErrorCode.FORBIDDEN, message: "Bu işlem için yetkiniz yok." },
  404: { code: ErrorCode.NOT_FOUND, message: "İstenen kaynak bulunamadı." },
  405: { code: ErrorCode.BAD_REQUEST, message: "Bu yöntem bu adreste desteklenmiyor." },
  409: { code: ErrorCode.CONFLICT, message: "İstek mevcut durumla çakışıyor." },
  413: { code: ErrorCode.PAYLOAD_TOO_LARGE, message: "İstek gövdesi çok büyük." },
  415: { code: ErrorCode.BAD_REQUEST, message: "Desteklenmeyen içerik türü." },
  422: { code: ErrorCode.VALIDATION_FAILED, message: "Girilen bilgiler geçersiz." },
  429: { code: ErrorCode.RATE_LIMITED, message: "Çok fazla istek gönderdiniz. Lütfen biraz bekleyip tekrar deneyin." },
};

const INTERNAL: { code: string; message: string } = { code: ErrorCode.INTERNAL_ERROR, message: "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin." };

/** Her hatayı `{ statusCode, code, message, details? }` gövdesine çevirir. */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger("Exceptions");

  catch(exception: unknown, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<Response>();
    if (res.headersSent) {
      // Yanıt zaten akmaya başlamış: durumu değiştiremeyiz, bağlantıyı kapatalım.
      res.end();
      return;
    }

    const body = this.toBody(exception);
    if (body.statusCode >= 500) {
      // İstek gövdesi/başlıkları ve SQL parametreleri günlüğe gitmez; yalnız temizlenmiş özet ve yığın.
      this.logger.error(`${body.statusCode} ${body.code}: ${summarizeError(exception, true)}`);
    }
    if (body.statusCode === HttpStatus.UNAUTHORIZED && !res.hasHeader("WWW-Authenticate")) {
      res.setHeader("WWW-Authenticate", 'Bearer realm="wangoh"');
    }
    if (body.statusCode === HttpStatus.TOO_MANY_REQUESTS && !res.hasHeader("Retry-After")) {
      // Adlandırılmış sınırlayıcı (`auth`) başlığı `Retry-After-auth` yazar; istemciler standart adı bekler.
      const retryAfter = res.getHeader("Retry-After-auth");
      if (retryAfter !== undefined) res.setHeader("Retry-After", retryAfter);
    }
    res.status(body.statusCode).json(body);
  }

  private toBody(exception: unknown): ErrorBody {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      // `AppException` ve doğrulama hataları kendi Türkçe `code`/`message`'ını taşır.
      if (isAppBody(response)) {
        return { statusCode: status, code: response.code, message: response.message, ...(response.details === undefined ? {} : { details: response.details }) };
      }
      const fallback = DEFAULTS[status] ?? (status >= 500 ? INTERNAL : { code: ErrorCode.BAD_REQUEST, message: "İstek işlenemedi." });
      return { statusCode: status, ...fallback };
    }

    // body-parser / http-errors: yalnız istemci hataları (4xx) status taşır (ör. 413, 400 bozuk JSON).
    const status = httpErrorStatus(exception);
    if (status !== undefined && status >= 400 && status < 500) {
      const fallback = DEFAULTS[status] ?? { code: ErrorCode.BAD_REQUEST, message: "İstek işlenemedi." };
      return { statusCode: status, ...fallback };
    }

    // İç ayrıntı hiçbir ortamda istemciye gitmez; ayrıntı yalnız sunucu günlüğündedir.
    return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, ...INTERNAL };
  }
}

function isAppBody(value: unknown): value is { code: string; message: string; details?: unknown } {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.code === "string" && typeof v.message === "string";
}

function httpErrorStatus(err: unknown): number | undefined {
  if (!err || typeof err !== "object") return undefined;
  const e = err as { status?: unknown; statusCode?: unknown; expose?: unknown };
  const status = typeof e.status === "number" ? e.status : typeof e.statusCode === "number" ? e.statusCode : undefined;
  return status !== undefined && Number.isInteger(status) ? status : undefined;
}

/**
 * Günlük/ayrıntı için güvenli hata özeti. Drizzle sorgu hataları mesajlarına SQL parametrelerini
 * (e-posta, özetler) gömer; bu yüzden yalnız sürücü hatasının (`cause`) ilk satırı alınır. Yığından
 * mesaj satırları atılır, yalnız `at ...` çerçeveleri kalır.
 */
export function summarizeError(err: unknown, withStack: boolean): string {
  if (!(err instanceof Error)) return "bilinmeyen hata";
  const cause = err.cause instanceof Error ? err.cause : undefined;
  const isQueryError = err.name === "DrizzleQueryError" || err.message.startsWith("Failed query:");
  // Çift yığınlı (IPv4/IPv6) bağlantı hatası `AggregateError` olarak gelir ve kendi mesajı boştur.
  const inner = err instanceof AggregateError && err.errors[0] instanceof Error ? err.errors[0] : undefined;
  const raw = isQueryError ? (cause?.message ?? "sorgu hatası") : err.message || inner?.message || "";
  const message = (raw.split("\n")[0] ?? "").slice(0, 300);
  // Sürücü kodu (ECONNREFUSED, 42P01...) teşhis için değerlidir ve değer içermez.
  const codeOf = (e: unknown): string | undefined => {
    const value = (e as { code?: unknown } | undefined)?.code;
    return typeof value === "string" ? value : undefined;
  };
  const code = codeOf(isQueryError ? cause : err) ?? codeOf(inner);
  const head = `${err.name}: ${message}${code && !message.includes(code) ? ` [${code}]` : ""}`;
  if (!withStack) return head;
  const frames = (err.stack ?? "")
    .split("\n")
    .filter((line) => line.trimStart().startsWith("at "))
    .slice(0, 8)
    .join("\n");
  return frames ? `${head}\n${frames}` : head;
}
