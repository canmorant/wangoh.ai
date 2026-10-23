import { Inject, Logger, Module, type OnApplicationBootstrap, type OnModuleInit } from "@nestjs/common";
import { APP_CONFIG } from "../config/config.module.js";
import type { AppConfig } from "../config/env.js";
import { DATABASE, type Database } from "../db/client.js";
import { CitiesService } from "./cities.service.js";
import { ContinentsService } from "./continents.service.js";
import { ContentCacheInterceptor } from "./content-cache.interceptor.js";
import { ContentController } from "./content.controller.js";
import { CountriesService } from "./countries.service.js";
import { unsupportedServerEncoding } from "./encoding.js";
import { ImageCreditsService } from "./image-credits.service.js";

/**
 * Kıtalar, ülkeler, şehirler ve rehberler (bkz. `docs/backend-mobil-mimarisi.md` bölüm 6). Veritabanı ve
 * yapılandırma global modüllerden gelir. Tohum: `content.seed.ts` (`runSeed` çağırır).
 */
@Module({
  controllers: [ContentController],
  providers: [ContinentsService, CountriesService, CitiesService, ImageCreditsService, ContentCacheInterceptor],
  exports: [ContinentsService, CountriesService, CitiesService, ImageCreditsService],
})
export class ContentModule implements OnModuleInit, OnApplicationBootstrap {
  constructor(
    @Inject(DATABASE) private readonly db: Database,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
    private readonly credits: ImageCreditsService,
  ) {}

  /** Türkçe arama UTF8 veritabanı ister (bkz. `encoding.ts`); aksi halde sessizce bozulur. Denetim açılışı engellemez. */
  async onModuleInit(): Promise<void> {
    try {
      const encoding = await unsupportedServerEncoding(this.db);
      if (encoding) {
        new Logger("Content").warn(`Veritabanı kodlaması ${encoding}: Türkçe arama ve ad sıralaması çalışmaz. PostgreSQL veritabanını UTF8 kodlamasıyla oluşturun.`);
      }
    } catch {
      /* Denetim isteğe bağlıdır; bağlantı sorunları zaten kendi yerinde bildirilir. */
    }
  }

  /**
   * İçerik var ama görsel atıfları yüklenmemişse uyarır (tohum açılışta çalışmıyorsa): CC BY / CC BY-SA görsellerin yazar ve lisans bilgisi
   * yanıtlarda boş kalırdı. `SEED_ON_BOOT` açıksa tohum zaten açılışta yükler. Denetim açılışı engellemez.
   */
  async onApplicationBootstrap(): Promise<void> {
    if (this.config.seedOnBoot) return;
    try {
      if (await this.credits.isMissing()) {
        new Logger("Content").warn(
          "Görsel atıfları tablosu (image_credits) boş: CC BY / CC BY-SA görsellerin yazar ve lisans bilgisi yanıtlarda görünmez. `pnpm --filter api db:seed` çalıştırın (yalnız eksikleri ekler).",
        );
      }
    } catch {
      /* Denetim isteğe bağlıdır; tablo yoksa (MIGRATE_ON_BOOT=false) bağlantı sorunları kendi yerinde bildirilir. */
    }
  }
}
