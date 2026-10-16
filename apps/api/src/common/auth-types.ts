import type { Request } from "express";
import type { UserRole } from "../db/schema/enums.js";

/** Kimliği doğrulanmış kullanıcı. Rol her istekte veritabanından yüklenir, belirteçten okunmaz. */
export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
}

export type AuthenticatedRequest = Request & { user?: AuthUser };
