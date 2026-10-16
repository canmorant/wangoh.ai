import { Logger } from "@nestjs/common";
import { eq, sql } from "drizzle-orm";
import { hashPassword, verifyPassword } from "../auth/password.js";
import { isUniqueViolation } from "../common/errors.js";
import type { ScryptParams } from "../config/env.js";
import type { Database } from "./client.js";
import { users } from "./schema/index.js";

export type AdminBootstrapResult = "created" | "promoted" | "exists" | "skipped";

/**
 * `ADMIN_EMAIL`/`ADMIN_PASSWORD` ile admin oluşturur (idempotent: her açılışta güvenle çalışır).
 *
 * - Hesap yoksa oluşturulur.
 * - Zaten admin ise dokunulmaz (parola sonradan değişmiş olabilir; ezilmez).
 * - Aynı e-postayla `user` rolünde kayıtlı biri varsa YALNIZ ADMIN_PASSWORD o hesabın parolasıyla
 *   eşleşirse yükseltilir. E-postalar doğrulanmadığından, adresi önceden kayıt edip sonradan
 *   admin'liğe yükseltilmesini bekleyen biri bu yolla yetki kazanamasın diye.
 */
export async function ensureAdminUser(
  db: Database,
  admin: { email: string; password: string },
  params: ScryptParams,
  logger: Pick<Logger, "log" | "warn"> = new Logger("AdminBootstrap"),
): Promise<AdminBootstrapResult> {
  const [existing] = await db.select().from(users).where(sql`lower(${users.email}) = lower(${admin.email})`).limit(1);

  if (existing) {
    if (existing.role === "admin") return "exists";
    if (await verifyPassword(admin.password, existing.passwordHash)) {
      await db.update(users).set({ role: "admin", updatedAt: new Date() }).where(eq(users.id, existing.id));
      logger.log("ADMIN_EMAIL ile eşleşen mevcut hesap admin rolüne yükseltildi.");
      return "promoted";
    }
    logger.warn("ADMIN_EMAIL zaten kayıtlı bir kullanıcıya ait ve admin değil; ADMIN_PASSWORD eşleşmediği için yükseltilmedi.");
    return "skipped";
  }

  const passwordHash = await hashPassword(admin.password, params);
  try {
    await db.insert(users).values({ email: admin.email, passwordHash, displayName: "Yönetici", role: "admin" });
  } catch (err) {
    // Aynı anda açılan başka bir örnek hesabı oluşturmuş olabilir.
    if (isUniqueViolation(err)) return "exists";
    throw err;
  }
  logger.log("İlk admin hesabı oluşturuldu.");
  return "created";
}
