import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { AuthenticatedRequest, AuthUser } from "../auth-types.js";

/**
 * Oturumdaki kullanıcıyı verir. `@Public()` uçlarda her zaman `undefined`, `@OptionalAuth()` uçlarda
 * oturum yoksa `undefined` olur; tipi buna göre daraltın.
 */
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): AuthUser | undefined => {
  return ctx.switchToHttp().getRequest<AuthenticatedRequest>().user;
});
