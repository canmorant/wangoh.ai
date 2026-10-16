import { rmSync } from "node:fs";
import { mkdir, open, readFile, rm } from "node:fs/promises";
import type { PGlite } from "@electric-sql/pglite";
import { Logger } from "@nestjs/common";
import { sql } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import type { Pool } from "pg";
import { OperationalError } from "../common/startup-error.js";
import type { AppConfig } from "../config/env.js";
import * as schema from "./schema/index.js";

/**
 * Hem node-postgres hem PGlite için ortak Drizzle arayüzü. `select/insert/update/delete/transaction`
 * her iki sürücüde aynı çalışır. Ham SQL sonuçları için `rowsOf()` kullan. `int8` (bigint) sonuçları
 * (`count(*)`, `sum(...)::bigint`, `rank() over (...)`) iki sürücüde de JS `number` gelir; yalnız güvenli
 * tamsayı aralığı dışındakiler `bigint` olur (aşağıda `parseInt8`). `numeric` iki sürücüde de dizgidir.
 *
 * DİKKAT (PGlite tek bağlantıdır): `db.transaction(async (tx) => ...)` içinde dış `db` yerine
 * daima `tx` kullan; aksi halde PGlite'ta işlem kilidi yüzünden kilitlenme olur.
 */
export type Database = PgDatabase<PgQueryResultHKT, typeof schema>;

/** DI belirteci: `@Inject(DATABASE) db: Database` */
export const DATABASE = Symbol("DATABASE");
/** DI belirteci: bağlantı kolu (kapatma, migrasyon). Alan modülleri genelde `DATABASE` kullanır. */
export const DATABASE_HANDLE = Symbol("DATABASE_HANDLE");

export type DatabaseHandle =
  | { kind: "pg"; db: Database; pool: Pool; close(): Promise<void> }
  | { kind: "pglite"; db: Database; client: PGlite; close(): Promise<void> };

const log = new Logger("Database");

/** `db.execute(sql...)` sonucundan satırları sürücüden bağımsız çıkarır. */
export function rowsOf<T = Record<string, unknown>>(result: unknown): T[] {
  if (Array.isArray(result)) return result as T[];
  const rows = (result as { rows?: unknown } | null)?.rows;
  return Array.isArray(rows) ? (rows as T[]) : [];
}

/**
 * `int8` metnini PGlite'ın kuralıyla çevirir: güvenli tamsayı aralığındaysa `number`, değilse `bigint`.
 * node-postgres varsayılan olarak `int8` için dizgi döner; testler (PGlite) sayı görüp geçer, üretimde
 * sayaç/sıra alanları "1" olarak gelirdi.
 */
export function parseInt8(value: string): number | bigint {
  const n = Number(value);
  return Number.isSafeInteger(n) ? n : BigInt(value);
}

type PgTypes = typeof import("pg").types;
/** `_int8` (int8[]) kimliği; @types/pg yerleşik kimlikler arasında listelemez. */
const INT8_ARRAY_OID = 1016 as unknown as Parameters<PgTypes["getTypeParser"]>[0];

/**
 * node-postgres tip ayrıştırıcılarını PGlite ile hizalar (`int8` ve `int8[]`). `pg.types` süreç geneli bir
 * kayıt defteridir ve Drizzle sorgu başına kendi `types` nesnesinde kalan tipleri buradan çözer; bu yüzden
 * havuz seçeneği değil genel kayıt gerekir. Tekrar çağrılması zararsızdır.
 */
function alignPgTypeParsers(types: PgTypes): void {
  types.setTypeParser(types.builtins.INT8, parseInt8);
  // `int8[]` (oid 1016): yerleşik dizi ayrıştırıcının dizgi öğelerini aynı kuralla çevir.
  const parseInt8Array = types.getTypeParser(INT8_ARRAY_OID) as (value: string) => Array<string | null>;
  types.setTypeParser(INT8_ARRAY_OID, (value: string) => parseInt8Array(value).map((item) => (item === null ? null : parseInt8(item))));
}

/** Aynı süreçte kilidi tutulan PGlite klasörlerinin kilit dosyaları. */
const heldPgliteLocks = new Set<string>();

function isProcessAlive(pid: number): boolean {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    return (err as NodeJS.ErrnoException).code === "EPERM"; // var ama bize ait değil
  }
}

async function readLockOwner(lockPath: string): Promise<number | undefined> {
  // Yazan süreç dosyayı açıp henüz pid'i yazmamış olabilir: bir kez kısa bekleyip yeniden oku.
  for (let attempt = 0; attempt < 2; attempt++) {
    const text = await readFile(lockPath, "utf8").catch(() => "");
    const pid = Number.parseInt(text.trim(), 10);
    if (Number.isInteger(pid) && pid > 0) return pid;
    if (attempt === 0) await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return undefined;
}

/**
 * PGlite tek kullanıcılı bir gömülü veritabanıdır: aynı klasörü iki süreç açarsa hata vermez, son kapanan
 * süreç diğerinin yazılarını ezer. Klasörün yanına (`<klasör>.lock`, PGlite veri klasörünün içine değil)
 * pid'li bir kilit dosyası yazıp ikinci açılışı net bir hatayla reddederiz. Sahibi ölmüş (bayat) kilit
 * devralınır; kilit çıkışta ve `close()`ta silinir. Döndürülen işlev kilidi bırakır.
 */
async function acquirePgliteLock(dir: string): Promise<() => void> {
  const lockPath = `${dir.replace(/[\\/]+$/, "")}.lock`;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const file = await open(lockPath, "wx");
      try {
        await file.writeFile(`${process.pid}\n`);
      } finally {
        await file.close();
      }
      heldPgliteLocks.add(lockPath);
      const onExit = (): void => release();
      const release = (): void => {
        process.off("exit", onExit);
        if (heldPgliteLocks.delete(lockPath)) rmSync(lockPath, { force: true });
      };
      process.once("exit", onExit);
      return release;
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== "EEXIST") throw err;
    }

    const owner = await readLockOwner(lockPath);
    // Bu süreç tutuyorsa ya da başka bir yaşayan süreç tutuyorsa reddet. `owner === process.pid` ama bu
    // süreç tutmuyorsa kilit önceki bir çalıştırmadan kalmıştır (ör. kapsayıcıda aynı pid yeniden verildi).
    if (heldPgliteLocks.has(lockPath) || (owner !== undefined && owner !== process.pid && isProcessAlive(owner))) {
      throw new OperationalError(
        `PGlite klasörü "${dir}" başka bir süreç (pid ${owner ?? process.pid}) tarafından kullanılıyor. PGlite tek kullanıcılıdır: ` +
          "aynı klasörü iki süreç açarsa yazılar sessizce kaybolur. Diğer süreci kapatın, ayrı bir PGLITE_DIR verin ya da PostgreSQL " +
          `için DATABASE_URL tanımlayın. Böyle bir süreç yoksa kilit bayattır: "${lockPath}" dosyasını silin.`,
      );
    }
    // Bayat kilit: yalnız hâlâ aynı bayat sahibe aitse sil (arada başkası devralmış olabilir).
    if ((await readLockOwner(lockPath)) === owner) await rm(lockPath, { force: true });
  }
  throw new OperationalError(`PGlite kilidi alınamadı: "${lockPath}". Dosyayı silip yeniden deneyin.`);
}

/** `DATABASE_URL` varsa node-postgres, yoksa PGlite (`memory://` bellek, aksi halde klasör). */
export async function createDatabase(config: Pick<AppConfig, "databaseUrl" | "pgliteDir">): Promise<DatabaseHandle> {
  if (config.databaseUrl) {
    const [{ default: pg }, { drizzle }] = await Promise.all([import("pg"), import("drizzle-orm/node-postgres")]);
    alignPgTypeParsers(pg.types);
    const pool = new pg.Pool({
      connectionString: config.databaseUrl,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
      statement_timeout: 30_000,
    });
    // Boştaki bağlantı hatası süreci düşürmesin.
    pool.on("error", (err) => log.error(`Boştaki bağlantıda hata: ${err.message}`));
    const db = drizzle({ client: pool, schema }) as unknown as Database;
    return { kind: "pg", db, pool, close: () => pool.end() };
  }

  const [{ PGlite }, { drizzle }] = await Promise.all([import("@electric-sql/pglite"), import("drizzle-orm/pglite")]);
  const inMemory = config.pgliteDir.startsWith("memory://");
  // PGlite'ın dosya sistemi üst klasörleri kendisi oluşturmaz (`.data/` ilk çalıştırmada yoktur).
  if (!inMemory) await mkdir(config.pgliteDir, { recursive: true });
  const releaseLock = inMemory ? undefined : await acquirePgliteLock(config.pgliteDir);
  let client: PGlite;
  try {
    client = inMemory ? new PGlite() : new PGlite(config.pgliteDir);
    await client.waitReady;
  } catch (err) {
    releaseLock?.();
    throw err;
  }
  const db = drizzle({ client, schema }) as unknown as Database;
  return {
    kind: "pglite",
    db,
    client,
    close: async () => {
      try {
        await client.close();
      } finally {
        releaseLock?.();
      }
    },
  };
}

/** Bağlantının çalıştığını doğrular (sağlık denetimi). */
export async function pingDatabase(db: Database): Promise<boolean> {
  try {
    await db.execute(sql`select 1`);
    return true;
  } catch {
    return false;
  }
}
