import { type ChildProcess, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { cp, mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

/**
 * Derlenmiş çalıştırma yolu: `node dist/main.js` ve `node dist/db/seed/cli.js`. Diğer e2e testleri
 * `createApp()`i vitest içinden, elle verilmiş yapılandırmayla çağırır; bu yüzden `.env` yükleme, açılış
 * hatalarının çıktısı, çıkış kodları, SIGTERM ve kilit gibi yalnız gerçek süreçte görünen davranışlar
 * (OPS-02/03/06/07/09) başka hiçbir testle kapsanmıyordu. `pnpm test` önce `build` çalıştırmadığından
 * kaynak burada geçici bir klasöre derlenir; çalışma ağacındaki `dist/` ve `.env`e dokunulmaz.
 */
const API_ROOT = fileURLToPath(new URL("..", import.meta.url));

interface RunResult {
  code: number | null;
  signal: NodeJS.Signals | null;
  stdout: string;
  stderr: string;
}

let work: string;
let pkg: string; // derlenmiş "paket kökü": dist/, drizzle/, package.json, node_modules, (.env)
const children = new Set<ChildProcess>();

const baseEnv = (): Record<string, string> => ({ PATH: process.env.PATH ?? "", HOME: process.env.HOME ?? tmpdir() });

function collect(child: ChildProcess): { out: () => RunResult; exited: Promise<RunResult> } {
  let stdout = "";
  let stderr = "";
  child.stdout?.on("data", (d: Buffer) => (stdout += d.toString()));
  child.stderr?.on("data", (d: Buffer) => (stderr += d.toString()));
  const snapshot = (code: number | null = null, signal: NodeJS.Signals | null = null): RunResult => ({ code, signal, stdout, stderr });
  const exited = new Promise<RunResult>((resolve) => child.once("exit", (code, signal) => resolve(snapshot(code, signal))));
  return { out: () => snapshot(), exited };
}

function launch(entry: string, env: Record<string, string>): ChildProcess {
  const child = spawn(process.execPath, [join(pkg, entry)], { cwd: pkg, env: { ...baseEnv(), ...env }, stdio: ["ignore", "pipe", "pipe"] });
  children.add(child);
  child.once("exit", () => children.delete(child));
  return child;
}

/** Süreci başlatır ve bitmesini bekler (zaman aşımında öldürüp başarısız olur). */
async function run(entry: string, env: Record<string, string>, timeoutMs = 60_000): Promise<RunResult> {
  const child = launch(entry, env);
  const { exited } = collect(child);
  const timer = setTimeout(() => child.kill("SIGKILL"), timeoutMs);
  try {
    const result = await exited;
    if (result.signal === "SIGKILL") throw new Error(`${entry} ${timeoutMs} ms içinde bitmedi.\n${result.stdout}\n${result.stderr}`);
    return result;
  } finally {
    clearTimeout(timer);
  }
}

async function freePort(): Promise<number> {
  const server = createServer();
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address() as { port: number };
  await new Promise((resolve) => server.close(resolve));
  return port;
}

interface Server {
  port: number;
  child: ChildProcess;
  output: () => RunResult;
  /** SIGTERM gönderir ve çıkışı bekler. */
  stop: () => Promise<RunResult>;
}

/** `dist/main.js`i başlatır ve `/v1/health` 200 verene dek bekler. */
async function startServer(env: Record<string, string>, port?: number): Promise<Server> {
  const listenPort = port ?? (await freePort());
  const child = launch("dist/main.js", { PORT: String(listenPort), RATE_LIMIT_ENABLED: "false", ...env });
  const { out, exited } = collect(child);
  let finished = false;
  void exited.then(() => (finished = true));
  const deadline = Date.now() + 45_000;
  for (;;) {
    if (finished) throw new Error(`Sunucu açılırken çıktı:\n${out().stdout}\n${out().stderr}`);
    if (Date.now() > deadline) {
      child.kill("SIGKILL");
      throw new Error(`Sunucu zamanında açılmadı:\n${out().stdout}\n${out().stderr}`);
    }
    try {
      if ((await fetch(`http://127.0.0.1:${listenPort}/v1/health`)).status === 200) break;
    } catch {
      /* henüz dinlemiyor */
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  return {
    port: listenPort,
    child,
    output: out,
    stop: async () => {
      if (!finished) child.kill("SIGTERM");
      return Promise.race([
        exited,
        new Promise<RunResult>((_, reject) => setTimeout(() => (child.kill("SIGKILL"), reject(new Error("SIGTERM sonrası 15 sn içinde kapanmadı"))), 15_000)),
      ]);
    },
  };
}

beforeAll(async () => {
  work = await mkdtemp(join(tmpdir(), "wangoh-api-entry-"));
  pkg = join(work, "pkg");
  await mkdir(pkg);
  const tsc = join(API_ROOT, "node_modules", "typescript", "bin", "tsc");
  const build = await run_(process.execPath, [tsc, "-p", join(API_ROOT, "tsconfig.build.json"), "--outDir", join(pkg, "dist")]);
  if (build.code !== 0) throw new Error(`Geçici derleme başarısız:\n${build.stdout}\n${build.stderr}`);
  await cp(join(API_ROOT, "drizzle"), join(pkg, "drizzle"), { recursive: true });
  await cp(join(API_ROOT, "package.json"), join(pkg, "package.json"));
  await symlink(join(API_ROOT, "node_modules"), join(pkg, "node_modules"), "dir");
}, 240_000);

afterAll(async () => {
  for (const child of children) child.kill("SIGKILL");
  await rm(work, { recursive: true, force: true });
});

/** Yardımcı: rastgele komut çalıştırır (derleme için). */
async function run_(command: string, args: string[]): Promise<RunResult> {
  const child = spawn(command, args, { cwd: API_ROOT, env: baseEnv(), stdio: ["ignore", "pipe", "pipe"] });
  return collect(child).exited;
}

const noStackFrames = /\n\s+at /;

describe("node dist/main.js: yapılandırma ve açılış hataları", () => {
  it("production'da JWT_ACCESS_SECRET yoksa okunur Türkçe liste ve çıkış kodu 1 (yığın yok)", async () => {
    const r = await run("dist/main.js", { NODE_ENV: "production", PGLITE_DIR: "memory://" });
    expect(r.code).toBe(1);
    expect(r.stderr).toContain("Geçersiz yapılandırma");
    expect(r.stderr).toContain("JWT_ACCESS_SECRET");
    expect(r.stderr).not.toMatch(noStackFrames);
  }, 60_000);

  it("geçersiz TRUST_PROXY ham TypeError yığını değil, PORT gibi diğer hatalarla aynı listede Türkçe hata verir (OPS-06)", async () => {
    for (const value of ["yes", "1.2.3", "10.0.0.0/33", "-1"]) {
      const r = await run("dist/main.js", { TRUST_PROXY: value, PORT: "abc", PGLITE_DIR: "memory://" });
      expect(r.code, value).toBe(1);
      expect(r.stderr, value).toContain("Geçersiz yapılandırma");
      expect(r.stderr, value).toContain("TRUST_PROXY");
      expect(r.stderr, value).toContain("PORT"); // tek listede
      expect(r.stderr, value).not.toMatch(/TypeError|invalid IP|ExceptionHandler/);
      expect(r.stderr, value).not.toMatch(noStackFrames);
    }
  }, 120_000);

  it("açılışta veritabanı hatası ADMIN_EMAIL/parola/SQL parametrelerini günlüğe yazmaz (AUTHZ-5, OPS-02)", async () => {
    const r = await run("dist/main.js", {
      PGLITE_DIR: "memory://",
      MIGRATE_ON_BOOT: "false", // tablolar yok: admin oluşturma sorgusu patlar
      ADMIN_EMAIL: "gizli.admin@sirket.example",
      ADMIN_PASSWORD: "Cok-Gizli-Parola-1",
    });
    expect(r.code).toBe(1);
    const all = r.stdout + r.stderr;
    expect(r.stderr).toContain("Açılış hatası");
    expect(r.stderr).toContain("does not exist"); // asıl neden hâlâ görünür
    for (const secret of ["gizli.admin@sirket.example", "Cok-Gizli-Parola-1", "scrypt$", "params"]) expect(all, secret).not.toContain(secret);
  }, 60_000);

  it("veritabanına bağlanılamazsa bağlantı dizgisindeki parola yazılmaz ama neden görünür", async () => {
    const deadPort = await freePort();
    const databaseUrl = `postgres://uygulama:GizliParola99@127.0.0.1:${deadPort}/wangoh`;
    for (const entry of ["dist/main.js", "dist/db/seed/cli.js"]) {
      const r = await run(entry, { DATABASE_URL: databaseUrl });
      expect(r.code, entry).toBe(1);
      expect(r.stdout + r.stderr, entry).not.toContain("GizliParola99");
      expect(r.stderr, entry).toContain("ECONNREFUSED");
    }
  }, 120_000);
});

describe("node dist/main.js: .env, SIGTERM, PGlite kilidi", () => {
  const envFile = (): string => join(pkg, ".env");
  const writeEnv = (content: string) => writeFile(envFile(), content);
  const removeEnv = () => rm(envFile(), { force: true });

  it(".env okunur ama gerçek ortam değişkeni önceliklidir", async () => {
    const envPort = await freePort();
    await writeEnv(`PORT=${envPort}\nSWAGGER_ENABLED=false\nPGLITE_DIR=memory://\nSEED_ON_BOOT=false\n`);
    let server: Server | undefined;
    try {
      const realPort = await freePort();
      server = await startServer({}, realPort); // PORT ortamdan da geliyor: .env'deki ezilir
      expect(server.port).toBe(realPort);
      expect((await fetch(`http://127.0.0.1:${realPort}/docs-json`)).status).toBe(404); // SWAGGER_ENABLED=false yalnız .env'de
      await expect(fetch(`http://127.0.0.1:${envPort}/v1/health`)).rejects.toThrow(); // .env'deki port dinlenmedi
    } finally {
      await server?.stop().catch(() => undefined);
      await removeEnv();
    }
  }, 90_000);

  it("SIGTERM sunucuyu düzgün kapatır: hata satırı yok, sinyalle ya da 0 koduyla çıkar", async () => {
    const server = await startServer({ PGLITE_DIR: "memory://", SEED_ON_BOOT: "false" });
    const r = await server.stop();
    expect(r.signal === "SIGTERM" || r.code === 0 || r.code === 143, `code=${r.code} signal=${r.signal}`).toBe(true);
    expect(r.stdout + r.stderr).not.toMatch(/ERROR/);
  }, 90_000);

  it("PGlite klasörünü ikinci süreç açamaz (sunucu ve db:seed); ilk süreç kapanınca kilit düşer (OPS-07)", async () => {
    const dir = join(work, "paylasilan", "pglite");
    const env = { PGLITE_DIR: dir, SEED_ON_BOOT: "false" };
    const first = await startServer(env);
    try {
      expect(existsSync(`${dir}.lock`)).toBe(true);
      const second = await run("dist/main.js", { ...env, PORT: String(await freePort()) });
      expect(second.code).toBe(1);
      expect(second.stderr).toMatch(/başka bir süreç.*kullanılıyor/s);
      expect(second.stderr).toContain(`pid ${first.child.pid}`);
      const seed = await run("dist/db/seed/cli.js", env);
      expect(seed.code).toBe(1);
      expect(seed.stderr).toMatch(/kullanılıyor/);
    } finally {
      await first.stop();
    }
    expect(existsSync(`${dir}.lock`)).toBe(false);
    const third = await startServer(env); // kapanınca yeniden açılabilir
    await third.stop();
  }, 180_000);
});

describe("node dist/db/seed/cli.js", () => {
  it("apps/api/.env dosyasını okur: PGLITE_DIR yalnız .env'de olsa da o veritabanına yazar, varsayılan .data'ya değil (OPS-03)", async () => {
    const target = join(work, "seed-from-env", "pglite");
    await writeFile(join(pkg, ".env"), `PGLITE_DIR=${target}\n`);
    try {
      const r = await run("dist/db/seed/cli.js", {});
      expect(r.code, r.stderr).toBe(0);
      expect(r.stdout + r.stderr).toContain("Tohum yüklendi");
      expect(existsSync(join(target, "PG_VERSION"))).toBe(true);
      expect(existsSync(join(pkg, ".data"))).toBe(false);
    } finally {
      await rm(join(pkg, ".env"), { force: true });
    }
  }, 90_000);

  it("production'da JWT_ACCESS_SECRET istemez (belirteç imzalamaz) ama NODE_ENV'i yine doğrular", async () => {
    const dir = join(work, "seed-prod", "pglite");
    const ok = await run("dist/db/seed/cli.js", { NODE_ENV: "production", PGLITE_DIR: dir });
    expect(ok.code, ok.stderr).toBe(0);
    const bad = await run("dist/db/seed/cli.js", { NODE_ENV: "staging", PGLITE_DIR: dir });
    expect(bad.code).toBe(1);
    expect(bad.stderr).toContain("NODE_ENV");
    expect(bad.stderr).not.toMatch(noStackFrames);
  }, 120_000);
});
