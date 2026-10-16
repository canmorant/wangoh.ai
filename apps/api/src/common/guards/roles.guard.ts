import { type CanActivate, type ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { UserRole } from "../../db/schema/enums.js";
import type { AuthenticatedRequest } from "../auth-types.js";
import { ROLES_KEY } from "../decorators/roles.decorator.js";
import { AppException } from "../errors.js";

/**
 * `@Roles(...)` ile işaretli uçlarda kullanıcının rolünü denetler. Kullanıcı yoksa (ör. yanlışlıkla
 * `@Public()` ile birleştirilmiş uç) varsayılan olarak REDDEDİLİR.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<UserRole[] | undefined>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!required || required.length === 0) return true;
    const user = context.switchToHttp().getRequest<AuthenticatedRequest>().user;
    if (!user || !required.includes(user.role)) throw AppException.forbidden();
    return true;
  }
}
