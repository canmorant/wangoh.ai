import { Inject, Logger, Module, type OnModuleInit } from "@nestjs/common";
import { DATABASE, type Database } from "../db/client.js";
import { CitiesService } from "./cities.service.js";
import { ContinentsService } from "./continents.service.js";
import { ContentCacheInterceptor } from "./content-cache.interceptor.js";
import { ContentController } from "./content.controller.js";
import { CountriesService } from "./countries.service.js";
import { unsupportedServerEncoding } from "./encoding.js";

/**
 * Kıtalar, ülkeler, şehirler ve rehberler (bkz. `docs/backend-mobil-mimarisi.md` bölüm 6). Veritabanı ve
 * yapılandırma global modüllerden gelir. Tohum: `content.seed.ts` (`runSeed` çağırır).
 */
@Module({
  controllers: [ContentController],
  providers: [ContinentsService, CountriesService, CitiesService, ContentCacheInterceptor],
  exports: [ContinentsService, CountriesService, CitiesService],
})
export class ContentModule implements OnModuleInit {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

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
}
