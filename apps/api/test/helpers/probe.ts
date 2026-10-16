import { Controller, Get, Module } from "@nestjs/common";
import type { AuthUser } from "../../src/common/auth-types.js";
import { CurrentUser, OptionalAuth, Public, Roles } from "../../src/common/decorators/index.js";

/**
 * Koruma davranışını (Public / OptionalAuth / Roles / varsayılan kapalı kapı) ve iç hata
 * maskelemesini sınamak için test amaçlı denetleyici. `createTestApp({ extraModules: [ProbeModule] })`.
 */
@Controller("_probe")
export class ProbeController {
  @Get("default")
  protectedByDefault(@CurrentUser() user?: AuthUser) {
    return { id: user?.id ?? null };
  }

  @Public()
  @Get("public")
  open(@CurrentUser() user?: AuthUser) {
    return { id: user?.id ?? null };
  }

  @OptionalAuth()
  @Get("optional")
  optional(@CurrentUser() user?: AuthUser) {
    return { id: user?.id ?? null, role: user?.role ?? null };
  }

  @Roles("admin")
  @Get("admin")
  adminOnly(@CurrentUser() user?: AuthUser) {
    return { id: user?.id ?? null };
  }

  /** Yanlış yapılandırma: genel açık ama rol ister. Rol denetimi kullanıcıyı bulamayıp reddetmeli. */
  @Public()
  @Roles("admin")
  @Get("public-admin")
  publicButAdmin() {
    return { reachable: true };
  }

  @Public()
  @Get("boom")
  boom(): never {
    throw new Error("veritabani-parolasi=hunter2 sizdi");
  }
}

@Module({ controllers: [ProbeController] })
export class ProbeModule {}
