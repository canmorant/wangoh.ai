import { fileURLToPath } from "node:url";

// Yollar yalnız bu dosyanın konumuna göre çözülür (process.cwd()'ye güvenme).
// Bu dosya hem `src/` hem `dist/` altında aynı derinlikte durur; bu yüzden
// `../` her iki durumda da `apps/api` köküne çıkar.
const root = (relative: string): string => fileURLToPath(new URL(`../${relative}`, import.meta.url));

export const PACKAGE_ROOT = root("");
export const DRIZZLE_DIR = root("drizzle");
export const SEED_DIR = root("seed");
export const OPENAPI_PATH = root("openapi.json");
export const PACKAGE_JSON_PATH = root("package.json");
export const ENV_FILE = root(".env");
export const DEFAULT_PGLITE_DIR = root(".data/pglite");
