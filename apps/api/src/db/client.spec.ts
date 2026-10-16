import { type ChildProcess, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { sql } from "drizzle-orm";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createDatabase, type DatabaseHandle, rowsOf } from "./client.js";

/** PGlite tek kullanıcılıdır; aynı klasörü iki süreç açarsa ikincinin yazıları sessizce kaybolurdu (OPS-07). */
describe("PGlite klasör kilidi", () => {
  let root: string;
  let dir: string;
  let lockFile: string;
  const opened: DatabaseHandle[] = [];
  const children: ChildProcess[] = [];

  const open = async (target = dir): Promise<DatabaseHandle> => {
    const handle = await createDatabase({ databaseUrl: undefined, pgliteDir: target });
    opened.push(handle);
    return handle;
  };

  beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), "wangoh-pglite-lock-"));
    dir = join(root, "ic-ice", "pglite");
    lockFile = `${dir}.lock`;
  });

  afterEach(async () => {
    for (const child of children.splice(0)) child.kill("SIGKILL");
    for (const handle of opened.splice(0)) await handle.close().catch(() => undefined);
    await rm(root, { recursive: true, force: true });
  });

  /** Çıkmış (artık var olmayan) bir sürecin pid'i. */
  const deadPid = async (): Promise<number> => {
    const child = spawn(process.execPath, ["-e", ""], { stdio: "ignore" });
    const pid = child.pid!;
    await new Promise((resolve) => child.once("exit", resolve));
    return pid;
  };

  it("açık klasör ikinci kez açılamaz: net hata, ilk bağlantı sağlam kalır", async () => {
    const first = await open();
    await first.db.execute(sql`create table t (x int)`);
    await expect(createDatabase({ databaseUrl: undefined, pgliteDir: dir })).rejects.toThrow(/başka bir süreç.*kullanılıyor/s);
    await expect(createDatabase({ databaseUrl: undefined, pgliteDir: `${dir}/` })).rejects.toThrow(/kullanılıyor/); // sondaki / aynı klasör
    await first.db.execute(sql`insert into t values (1)`);
    expect(rowsOf<{ x: number }>(await first.db.execute(sql`select x from t`))).toEqual([{ x: 1 }]);
  }, 60_000);

  it("kilit dosyası klasörün yanındadır (PGlite veri klasörüne dokunmaz) ve kapatınca silinir", async () => {
    const handle = await open();
    expect(existsSync(lockFile)).toBe(true);
    expect((await readFile(lockFile, "utf8")).trim()).toBe(String(process.pid));
    expect(existsSync(join(dir, "wangoh.lock"))).toBe(false);
    await handle.close();
    expect(existsSync(lockFile)).toBe(false);
    const again = await open(); // kapatılınca yeniden açılabilir, veri korunur
    expect(rowsOf(await again.db.execute(sql`select 1 as one`))).toEqual([{ one: 1 }]);
  }, 60_000);

  it("bellek içi veritabanı kilit istemez: aynı anda birden çok açılabilir", async () => {
    const [a, b] = await Promise.all([open("memory://"), open("memory://")]);
    expect(a.kind).toBe("pglite");
    expect(b.kind).toBe("pglite");
  }, 60_000);

  it("ölmüş sürecin bıraktığı bayat kilit devralınır", async () => {
    await open().then((h) => h.close());
    await writeFile(lockFile, `${await deadPid()}\n`);
    const handle = await open();
    expect((await readFile(lockFile, "utf8")).trim()).toBe(String(process.pid));
    await handle.close();
  }, 60_000);

  it("bozuk/boş kilit dosyası bayat sayılır", async () => {
    await open().then((h) => h.close());
    await writeFile(lockFile, "");
    await open().then((h) => h.close());
    await writeFile(lockFile, "çöp\n");
    await open();
  }, 60_000);

  it("aynı pid'li ama bu süreçte tutulmayan kilit (önceki çalıştırmadan, ör. kapsayıcıda pid yeniden kullanımı) bayattır", async () => {
    await open().then((h) => h.close());
    await writeFile(lockFile, `${process.pid}\n`);
    await open();
  }, 60_000);

  it("yaşayan başka bir sürecin kilidi reddedilir ve pid bildirilir; süreç ölünce açılır", async () => {
    await open().then((h) => h.close());
    const other = spawn(process.execPath, ["-e", "setTimeout(() => {}, 120000)"], { stdio: "ignore" });
    children.push(other);
    await writeFile(lockFile, `${other.pid}\n`);
    await expect(createDatabase({ databaseUrl: undefined, pgliteDir: dir })).rejects.toThrow(new RegExp(`pid ${other.pid}`));
    expect((await readFile(lockFile, "utf8")).trim()).toBe(String(other.pid)); // reddedilen kilidi bozmaz
    other.kill("SIGKILL");
    await new Promise((resolve) => other.once("exit", resolve));
    await open();
  }, 60_000);

  it("klasör açılamazsa kilit dosyası geride kalmaz", async () => {
    // Klasör yolu bir DOSYA: açılış başarısız olur.
    const blocker = join(root, "dosya");
    await writeFile(blocker, "x");
    await expect(createDatabase({ databaseUrl: undefined, pgliteDir: blocker })).rejects.toBeTruthy();
    expect(existsSync(`${blocker}.lock`)).toBe(false);
  }, 60_000);
});
