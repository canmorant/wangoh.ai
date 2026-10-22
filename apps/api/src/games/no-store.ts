import { type CallHandler, type ExecutionContext, Injectable, type NestInterceptor, UseInterceptors } from "@nestjs/common";
import type { Response } from "express";
import { type Observable, tap } from "rxjs";
import type { AuthenticatedRequest } from "../common/auth-types.js";

/**
 * Oyun yanıtları oturuma özeldir (sorular, puanlar, `isMe`); ara önbelleklerde saklanmaz. Başlık işleyiciden
 * ÖNCE yazılır, böylece hata yanıtları da kapsanır.
 */
@Injectable()
export class NoStoreInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    context.switchToHttp().getResponse<Response>().setHeader("Cache-Control", "no-store");
    return next.handle();
  }
}

export const NoStore = (): ClassDecorator & MethodDecorator => UseInterceptors(NoStoreInterceptor);

/**
 * Liderlik listesi: oturumsuz (anonim) istek herkes için aynıdır (`isMe` hep false), bu yüzden ara önbellek
 * 15 sn tutabilir; kısa süre, yeni puanların hızla görünmesi içindir. Oturumlu istek (`isMe` kişiye özel) önbelleğe
 * alınmaz. Başlık yalnız başarılı yanıtta yazılır (hatalar `no-store` kalır).
 */
@Injectable()
export class LeaderboardCacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest<AuthenticatedRequest>();
    const res = http.getResponse<Response>();
    return next.handle().pipe(
      tap(() => {
        res.setHeader("Vary", "Authorization");
        res.setHeader("Cache-Control", req.user ? "no-store" : "public, max-age=15");
      }),
    );
  }
}

export const LeaderboardCache = (): MethodDecorator => UseInterceptors(LeaderboardCacheInterceptor);
