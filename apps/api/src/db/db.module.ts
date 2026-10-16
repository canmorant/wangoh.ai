import { Global, Inject, Injectable, Logger, Module, type OnApplicationBootstrap, type OnModuleDestroy } from "@nestjs/common";
import { APP_CONFIG } from "../config/config.module.js";
import type { AppConfig } from "../config/env.js";
import { ensureAdminUser } from "./admin-bootstrap.js";
import { createDatabase, DATABASE, DATABASE_HANDLE, type Database, type DatabaseHandle } from "./client.js";
import { runMigrations } from "./migrate.js";
import { runSeed } from "./seed/index.js";

/** Açılış sırası: (1) migrasyon (bağlantı sağlayıcıda), (2) idempotent admin, (3) tohum. */
@Injectable()
class DatabaseLifecycle implements OnApplicationBootstrap, OnModuleDestroy {
  private readonly logger = new Logger("Database");

  constructor(
    @Inject(APP_CONFIG) private readonly config: AppConfig,
    @Inject(DATABASE) private readonly db: Database,
    @Inject(DATABASE_HANDLE) private readonly handle: DatabaseHandle,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (this.config.admin) {
      await ensureAdminUser(this.db, this.config.admin, this.config.passwordHash);
    }
    if (this.config.seedOnBoot) {
      this.logger.log("Tohum yükleniyor (SEED_ON_BOOT)...");
      await runSeed(this.db, { dir: this.config.seedDir });
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.handle.close();
  }
}

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_HANDLE,
      inject: [APP_CONFIG],
      // Migrasyon burada, bağlantı hazır olmadan HİÇBİR tüketici örneklenmeden çalışır: modüllerin
      // başlatma sırasına bağımlı değiliz. Başarısızsa açılış açık bir hatayla çöker.
      useFactory: async (config: AppConfig): Promise<DatabaseHandle> => {
        const handle = await createDatabase(config);
        if (config.migrateOnBoot) {
          try {
            await runMigrations(handle);
          } catch (err) {
            await handle.close().catch(() => undefined);
            throw err;
          }
        }
        return handle;
      },
    },
    { provide: DATABASE, inject: [DATABASE_HANDLE], useFactory: (handle: DatabaseHandle): Database => handle.db },
    DatabaseLifecycle,
  ],
  exports: [DATABASE, DATABASE_HANDLE],
})
export class DbModule {}
