import { type CallHandler, type ExecutionContext, Injectable, type NestInterceptor } from "@nestjs/common";
import type { Request, Response } from "express";
import { catchError, type Observable, tap, throwError } from "rxjs";

/** Anonim, yalnız yayındaki yazıları döndüren okumalar kısa süre ortak önbellekte tutulabilir. */
export const PUBLIC_CACHE_CONTROL = "public, max-age=60, stale-while-revalidate=300";
export const PRIVATE_CACHE_CONTROL = "private, no-store";

/**
 * Blog yanıtlarının önbellek başlıkları. Aynı adres oturuma göre farklı içerik verir (yönetici taslakları
 * da görür), bu yüzden:
 * - `Authorization` başlığı olan her istek (ve her yazma) `private, no-store`: taslak içerebilecek yanıt
 *   ortak önbelleğe ya da başka bir kullanıcıya hiçbir zaman gitmez;
 * - başlıksız (anonim) başarılı okuma `public` önbelleğe uygundur ve `Vary: Authorization` taşır;
 * - uca ulaşan hata yanıtları `no-store`: bir taslağın 404'ü yayınlandıktan sonra da önbellekte kalmasın.
 *
 * Interceptor guard'lardan ve gövde ayrıştırıcıdan sonra çalıştığı için uca hiç ulaşmayan yanıtlarda (401, 403, 413,
 * 429, bozuk JSON, bilinmeyen yol) bu başlık yoktur; bunlar taslak içeriği taşımaz.
 */
@Injectable()
export class BlogCacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();
    const anonymousRead = req.method === "GET" && req.headers.authorization === undefined;
    return next.handle().pipe(
      tap(() => {
        res.vary("Authorization");
        res.setHeader("Cache-Control", anonymousRead ? PUBLIC_CACHE_CONTROL : PRIVATE_CACHE_CONTROL);
      }),
      catchError((err: unknown) => {
        res.setHeader("Cache-Control", PRIVATE_CACHE_CONTROL);
        return throwError(() => err);
      }),
    );
  }
}
