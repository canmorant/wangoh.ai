import { SetMetadata } from "@nestjs/common";
import type { UserRole } from "../../db/schema/enums.js";

export const ROLES_KEY = "wangoh:roles";

/** Uç noktaya erişebilen roller: `@Roles("admin")`. Rol verilmezse oturum yeterlidir. */
export const Roles = (...roles: UserRole[]): MethodDecorator & ClassDecorator => SetMetadata(ROLES_KEY, roles);
