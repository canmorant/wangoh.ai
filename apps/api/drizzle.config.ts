import { defineConfig } from "drizzle-kit";

// `pnpm db:generate` yalnız SQL üretir; veritabanına bağlanmaz.
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  strict: true,
  verbose: true,
});
