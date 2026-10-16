import { ApiProperty } from "@nestjs/swagger";
import { USER_ROLES, type UserRole } from "../../db/schema/enums.js";
import type { UserRow } from "../../db/schema/users.js";

/** Herkese dönen kullanıcı biçimi. `passwordHash`, `tokenVersion` ve belirteç özetleri asla yer almaz. */
export class UserDto {
  @ApiProperty({ type: String, format: "uuid" })
  id!: string;

  @ApiProperty({ type: String, format: "email", example: "ayse@example.com" })
  email!: string;

  @ApiProperty({ type: String, example: "Ayşe" })
  displayName!: string;

  @ApiProperty({ enum: USER_ROLES })
  role!: UserRole;

  @ApiProperty({ type: Boolean, description: "Devre dışı hesaplar giriş yapamaz; mevcut belirteçleri anında reddedilir." })
  disabled!: boolean;

  @ApiProperty({ type: String, format: "date-time" })
  createdAt!: string;

  @ApiProperty({ type: String, format: "date-time" })
  updatedAt!: string;
}

/** Satırdan açık alan eşlemesi: yeni bir hassas sütun eklense bile yanıta kendiliğinden sızmaz. */
export function toUserDto(row: Pick<UserRow, "id" | "email" | "displayName" | "role" | "disabled" | "createdAt" | "updatedAt">): UserDto {
  return {
    id: row.id,
    email: row.email,
    displayName: row.displayName,
    role: row.role,
    disabled: row.disabled,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
