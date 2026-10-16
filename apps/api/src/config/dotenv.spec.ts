import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { loadDotEnv } from "./dotenv.js";

const KEYS = ["WANGOH_TEST_DOTENV_A", "WANGOH_TEST_DOTENV_B"] as const;

describe("loadDotEnv", () => {
  let dir: string;
  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), "wangoh-dotenv-"));
    for (const key of KEYS) delete process.env[key];
  });
  afterEach(async () => {
    for (const key of KEYS) delete process.env[key];
    await rm(dir, { recursive: true, force: true });
  });

  it("dosya yoksa sessizce false döner", () => {
    expect(loadDotEnv(join(dir, "yok.env"))).toBe(false);
  });

  it("değişkenleri yükler ama gerçek ortam değişkenini ezmez", async () => {
    const file = join(dir, ".env");
    await writeFile(file, "WANGOH_TEST_DOTENV_A=dosyadan\nWANGOH_TEST_DOTENV_B=dosyadan\n");
    process.env.WANGOH_TEST_DOTENV_B = "gercek";
    expect(loadDotEnv(file)).toBe(true);
    expect(process.env.WANGOH_TEST_DOTENV_A).toBe("dosyadan");
    expect(process.env.WANGOH_TEST_DOTENV_B).toBe("gercek");
  });
});
