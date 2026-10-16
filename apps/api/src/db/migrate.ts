import { DRIZZLE_DIR } from "../paths.js";
import type { DatabaseHandle } from "./client.js";

/** Aynı veritabanına birden çok örnek aynı anda açılırsa migrasyonlar sıraya girsin. */
const MIGRATION_LOCK_KEY = 727_274_001;

/**
 * `drizzle/` klasöründeki SQL migrasyonlarını uygular (idempotent). Klasör `import.meta.url`'e göre
 * çözülür; `process.cwd()`'ye bağımlı değildir.
 */
export async function runMigrations(handle: DatabaseHandle, folder: string = DRIZZLE_DIR): Promise<void> {
  if (handle.kind === "pglite") {
    const { migrate } = await import("drizzle-orm/pglite/migrator");
    const { drizzle } = await import("drizzle-orm/pglite");
    await migrate(drizzle({ client: handle.client }), { migrationsFolder: folder });
    return;
  }

  const { migrate } = await import("drizzle-orm/node-postgres/migrator");
  const { drizzle } = await import("drizzle-orm/node-postgres");
  // Danışma kilidi oturum düzeyindedir: kilidi tutan bağlantıyı migrasyon sürerken ayrı tutarız.
  const lock = await handle.pool.connect();
  try {
    await lock.query("select pg_advisory_lock($1)", [MIGRATION_LOCK_KEY]);
    await migrate(drizzle({ client: handle.pool }), { migrationsFolder: folder });
  } finally {
    try {
      await lock.query("select pg_advisory_unlock($1)", [MIGRATION_LOCK_KEY]);
    } finally {
      lock.release();
    }
  }
}
