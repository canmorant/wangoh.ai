import { type CallHandler, type ExecutionContext, Injectable, type NestInterceptor, UseInterceptors, applyDecorators } from "@nestjs/common";
import type { Response } from "express";
import { type Observable, tap } from "rxjs";
import { PUBLIC_CACHE_SECONDS } from "./content.constants.js";

export const PUBLIC_CACHE_CONTROL = `public, max-age=${PUBLIC_CACHE_SECONDS}`;

/**
 * Başarılı okumalara `Cache-Control: public, max-age=300` ekler. Başlık yalnız yanıt başarılıyken yazılır:
 * `@Header()` işleyiciden ÖNCE yazıldığı için 404/400 hatalarına da yapışırdı ve olmayan bir kaynağın 404'ü
 * (sonradan eklenince) önbellekte kalırdı. Uçlar `@Public()` olduğundan yanıt oturuma göre değişmez.
 */
@Injectable()
export class ContentCacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const res = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(tap(() => res.setHeader("Cache-Control", PUBLIC_CACHE_CONTROL)));
  }
}

/** Okuma (GET) uçlarına: `@PublicCache()`. */
export const PublicCache = (): MethodDecorator => applyDecorators(UseInterceptors(ContentCacheInterceptor));
