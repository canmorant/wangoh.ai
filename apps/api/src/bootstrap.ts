import { type DynamicModule, type LogLevel, Logger, type Type } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { SwaggerModule } from "@nestjs/swagger";
import type { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { AppModule } from "./app.module.js";
import { createJsonBodyParser } from "./common/body-limit.js";
import { rejectNullBytesInUrl } from "./common/request-guards.js";
import { createValidationPipe } from "./common/validation.js";
import { type AppConfig, loadConfig } from "./config/env.js";
import { createOpenApiDocument } from "./openapi/document.js";

export interface CreateAppOptions {
  /** Verilmezse ortam değişkenlerinden okunur (`loadConfig()`). */
  config?: AppConfig;
  /** Nest günlük düzeyleri; `false` tamamen susturur. */
  logger?: false | LogLevel[];
  /** Yalnız testler için ek modüller. */
  extraModules?: Array<Type<unknown> | DynamicModule>;
}

/** Genel önek: tüm rotalar `/v1` altında; Swagger (`/docs`) önek dışındadır. */
export const GLOBAL_PREFIX = "v1";

const LOCALHOST_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/;

/**
 * Uygulamayı kurar ama başlatmaz (`init`/`listen` çağıran yapar). `main.ts`, e2e testleri ve OpenAPI
 * dışa aktarma aynı kurulumu kullanır; böylece belgelenen davranış ile çalışan davranış ayrışmaz.
 */
export async function createApp(options: CreateAppOptions = {}): Promise<NestExpressApplication> {
  const config = options.config ?? loadConfig();
  const app = await NestFactory.create<NestExpressApplication>(AppModule.register(config, options.extraModules), {
    // Gövde ayrıştırıcıyı kendimiz kuruyoruz (yola göre sınır).
    bodyParser: false,
    logger: options.logger ?? (config.nodeEnv === "test" ? ["error", "warn"] : ["log", "warn", "error"]),
    // Kurulum hatası süreci sessizce öldürmesin; çağıran yakalayıp açık hata yazsın.
    abortOnError: false,
  });
  try {
    configureApp(app, config);
  } catch (err) {
    // Kurulum yarıda kaldıysa veritabanı bağlantısı açık kalmasın.
    await app.close().catch(() => undefined);
    throw err;
  }
  return app;
}

function configureApp(app: NestExpressApplication, config: AppConfig): void {
  app.disable("x-powered-by");
  app.set("trust proxy", config.trustProxy);

  if (config.httpLog) app.use(accessLog());
  app.use(securityHeaders());

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) =>
      callback(null, isOriginAllowed(origin, config)),
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type", "Accept"],
    exposedHeaders: ["Retry-After"],
    // Bearer belirteci kullanıyoruz; çerez yok, kimlik bilgisi paylaşımı gerekmiyor.
    credentials: false,
    maxAge: 600,
  });

  // Belirteç ve kişisel veri dönen yanıtlar ara önbelleklerde/tarayıcıda saklanmasın.
  app.use([`/${GLOBAL_PREFIX}/auth`, `/${GLOBAL_PREFIX}/users`], noStore);

  app.use(rejectNullBytesInUrl());
  app.use(createJsonBodyParser({ default: config.bodyLimit, large: config.bodyLimitLarge }));
  app.setGlobalPrefix(GLOBAL_PREFIX);
  app.useGlobalPipes(createValidationPipe());

  if (config.swaggerEnabled) {
    const document = createOpenApiDocument(app);
    SwaggerModule.setup("docs", app, document, {
      customSiteTitle: "Wangoh API",
      swaggerOptions: { persistAuthorization: true },
    });
  }

  if (config.jwt.insecureDefaultSecret && config.nodeEnv === "development") {
    new Logger("Config").warn("JWT_ACCESS_SECRET tanımlı değil: güvensiz geliştirme sırrı kullanılıyor. Üretimde zorunludur.");
  }
}

function noStore(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  next();
}

function isOriginAllowed(origin: string | undefined, config: AppConfig): boolean {
  // Origin başlığı olmayan istekler tarayıcı dışıdır (mobil uygulama, curl); CORS konusu değil.
  if (!origin) return true;
  if (config.cors.origins.includes(origin)) return true;
  return config.cors.allowLocalhost && LOCALHOST_ORIGIN.test(origin);
}

/** API yalnız JSON döner: sıkı CSP. Swagger arayüzü satır içi betik/stil kullandığından `/docs` için gevşetilir. */
function securityHeaders(): (req: Request, res: Response, next: NextFunction) => void {
  const api = helmet({
    contentSecurityPolicy: { directives: { defaultSrc: ["'none'"], frameAncestors: ["'none'"] } },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  });
  const docs = helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  });
  return (req, res, next) => (req.path.startsWith("/docs") ? docs(req, res, next) : api(req, res, next));
}

/** Tek satır erişim günlüğü: yöntem, yol (sorgu dizgisi YOK), durum, süre. Gövde/başlık asla yazılmaz. */
function accessLog(): (req: Request, res: Response, next: NextFunction) => void {
  const logger = new Logger("HTTP");
  return (req, res, next) => {
    const started = process.hrtime.bigint();
    res.on("finish", () => {
      const ms = Number((process.hrtime.bigint() - started) / 1_000_000n);
      logger.log(`${req.method} ${req.originalUrl.split("?")[0]} ${res.statusCode} ${ms}ms`);
    });
    next();
  };
}
