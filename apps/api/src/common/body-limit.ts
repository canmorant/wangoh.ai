import type { NextFunction, Request, RequestHandler, Response } from "express";
import express from "express";
import { guardParsedBody } from "./request-guards.js";

/**
 * Büyük gövdeli yazma uçları (ör. blog yönetimi). Bu yol önekleriyle başlayan POST/PUT/PATCH
 * istekleri `BODY_LIMIT_LARGE` sınırını, diğer her şey `BODY_LIMIT` sınırını kullanır.
 */
export const LARGE_BODY_PATH_PREFIXES = ["/v1/blog/posts"] as const;

const WRITE_METHODS = new Set(["POST", "PUT", "PATCH"]);

/**
 * JSON gövde ayrıştırıcı; yola göre sınır seçer. Aşılırsa 413 (filtre tutarlı gövdeye çevirir). Ayrıştırılan
 * gövde ayrıca derinlik/anahtar sayısı ve geçersiz Unicode açısından denetlenir (`request-guards.ts`);
 * aksi halde doğrulama boru hattı bu girdilerde 400 yerine 500 üretirdi.
 */
export function createJsonBodyParser(limits: { default: string; large: string }): RequestHandler {
  const small = express.json({ limit: limits.default, strict: true });
  const large = express.json({ limit: limits.large, strict: true });
  return (req: Request, res: Response, next: NextFunction) => {
    const isLarge = WRITE_METHODS.has(req.method) && LARGE_BODY_PATH_PREFIXES.some((prefix) => req.path.startsWith(prefix));
    (isLarge ? large : small)(req, res, (err?: unknown) => (err ? next(err) : guardParsedBody(req, next)));
  };
}
