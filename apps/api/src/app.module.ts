import { type DynamicModule, Module, type Type } from "@nestjs/common";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AuthModule } from "./auth/auth.module.js";
import { BlogModule } from "./blog/blog.module.js";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter.js";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard.js";
import { RolesGuard } from "./common/guards/roles.guard.js";
import { STRICT_THROTTLE_KEY } from "./common/decorators/public.decorator.js";
import { APP_CONFIG, ConfigModule } from "./config/config.module.js";
import type { AppConfig } from "./config/env.js";
import { ContentModule } from "./content/content.module.js";
import { DbModule } from "./db/db.module.js";
import { GamesModule } from "./games/games.module.js";
import { HealthModule } from "./health/health.module.js";
import { UsersModule } from "./users/users.module.js";

/** Tracker + throttler adı: her IP için tüm uçlar tek kovada sayılır (uç başına değil). */
const sharedBucket = (_ctx: unknown, tracker: string, name: string): string => `${name}:${tracker}`;

@Module({})
export class AppModule {
  /**
   * Yapılandırma dışarıdan verilir; böylece testler ve OpenAPI dışa aktarma kendi ayarını kullanır.
   * `extraModules` yalnız testler içindir (ör. koruma davranışını sınayan prob denetleyicisi).
   */
  static register(config: AppConfig, extraModules: Array<Type<unknown> | DynamicModule> = []): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.register(config),
        DbModule,
        ThrottlerModule.forRootAsync({
          inject: [APP_CONFIG],
          useFactory: (cfg: AppConfig) => ({
            throttlers: [
              // Genel sınır: IP başına dakikada 120 istek.
              { name: "default", ttl: cfg.rateLimit.ttlMs, limit: cfg.rateLimit.defaultLimit, generateKey: sharedBucket, skipIf: () => !cfg.rateLimit.enabled },
              // Kimlik uçları (@StrictThrottle): IP başına dakikada 10 istek, ortak kova.
              {
                name: "auth",
                ttl: cfg.rateLimit.ttlMs,
                limit: cfg.rateLimit.authLimit,
                generateKey: sharedBucket,
                skipIf: (ctx) => !cfg.rateLimit.enabled || !isStrict(ctx.getHandler(), ctx.getClass()),
              },
            ],
          }),
        }),
        AuthModule,
        UsersModule,
        ContentModule,
        BlogModule,
        GamesModule,
        HealthModule,
        ...extraModules,
      ],
      providers: [
        // Sıra önemli: önce hız sınırı, sonra kimlik, sonra rol.
        { provide: APP_GUARD, useClass: ThrottlerGuard },
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: RolesGuard },
        { provide: APP_FILTER, useClass: AllExceptionsFilter },
      ],
    };
  }
}

function isStrict(handler: object, cls: object): boolean {
  return Reflect.getMetadata(STRICT_THROTTLE_KEY, handler) === true || Reflect.getMetadata(STRICT_THROTTLE_KEY, cls) === true;
}
