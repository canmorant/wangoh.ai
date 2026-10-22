import { readFileSync } from "node:fs";
import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, type OpenAPIObject, SwaggerModule } from "@nestjs/swagger";
import { PACKAGE_JSON_PATH } from "../paths.js";

/**
 * `operationId` = `<DenetleyiciAdıSonekSiz><MetotAdıBüyükHarfle>`: `AuthController.login` → `authLogin`,
 * `ContentController.listCountries` → `contentListCountries`. Orval kanca adlarını buradan türetir.
 */
export function operationIdFactory(controllerKey: string, methodKey: string): string {
  const base = controllerKey.replace(/Controller$/, "");
  return `${base.charAt(0).toLowerCase()}${base.slice(1)}${methodKey.charAt(0).toUpperCase()}${methodKey.slice(1)}`;
}

/** Nesne anahtarlarını özyinelemeli sıralar: üretim çalıştırmalar arasında bayt bayt aynı kalır. */
export function sortKeysDeep<T>(value: T): T {
  if (Array.isArray(value)) return value.map(sortKeysDeep) as T;
  if (value && typeof value === "object") {
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(value).sort()) sorted[key] = sortKeysDeep((value as Record<string, unknown>)[key]);
    return sorted as T;
  }
  return value;
}

const PARAMETER_ORDER: Record<string, number> = { path: 0, query: 1, header: 2, cookie: 3 };

/**
 * Parametre dizilerini (yol, sorgu, başlık; sonra ad) sıralar. Dizi sırası, parametre dekoratörlerinin
 * çalışma sırasına bağlıdır ve derlenmiş kodla (tsc) test ortamında (oxc) farklı çıkabilir.
 */
export function sortParameters<T>(value: T): T {
  if (Array.isArray(value)) return value.map(sortParameters) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(value)) {
      if (key === "parameters" && Array.isArray(child)) {
        out[key] = [...child]
          .map(sortParameters)
          .sort((a, b) => {
            const pa = a as { in?: string; name?: string };
            const pb = b as { in?: string; name?: string };
            return (PARAMETER_ORDER[pa.in ?? ""] ?? 9) - (PARAMETER_ORDER[pb.in ?? ""] ?? 9) || (pa.name ?? "").localeCompare(pb.name ?? "");
          });
      } else {
        out[key] = sortParameters(child);
      }
    }
    return out as T;
  }
  return value;
}

/** Uygulamanın (global önek dahil) OpenAPI belgesini üretir; anahtarlar ve parametreler sıralıdır. */
export function createOpenApiDocument(app: INestApplication): OpenAPIObject {
  const { version } = JSON.parse(readFileSync(PACKAGE_JSON_PATH, "utf8")) as { version: string };
  const config = new DocumentBuilder()
    .setTitle("Wangoh API")
    .setDescription(
      "Wangoh mobil ve web istemcileri için REST API. Tüm yollar `/v1` altındadır. Kimlik doğrulama: " +
        "`Authorization: Bearer <accessToken>`. Hata gövdesi her yerde `{ statusCode, code, message, details? }`.",
    )
    .setVersion(version)
    .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" })
    .build();
  const document = SwaggerModule.createDocument(app, config, { operationIdFactory });
  return sortKeysDeep(sortParameters(document));
}

/** `openapi.json` dosyasının tam metni (sondaki satır sonu dahil). */
export function serializeOpenApi(document: OpenAPIObject): string {
  return `${JSON.stringify(document, null, 2)}\n`;
}
