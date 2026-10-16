import { type DynamicModule, Global, Module } from "@nestjs/common";
import type { AppConfig } from "./env.js";

/** DI belirteci: `@Inject(APP_CONFIG) config: AppConfig` */
export const APP_CONFIG = Symbol("APP_CONFIG");

/** Doğrulanmış yapılandırmayı tüm modüllere sağlar (global). */
@Global()
@Module({})
export class ConfigModule {
  static register(config: AppConfig): DynamicModule {
    return {
      module: ConfigModule,
      providers: [{ provide: APP_CONFIG, useValue: config }],
      exports: [APP_CONFIG],
    };
  }
}
