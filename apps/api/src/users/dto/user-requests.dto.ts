import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsIn, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { PaginatedDto, PaginationQueryDto } from "../../common/pagination.js";
import { Trim } from "../../common/transforms.js";
import { IsOptionalNotNull, NoNullBytes } from "../../common/validators.js";
import { USER_ROLES, type UserRole } from "../../db/schema/enums.js";
import { UserDto } from "./user.dto.js";

/** Bidi/kontrol karakterlerini (görünmez yönlendirme hileleri) reddeder. */
export const DISPLAY_NAME_PATTERN = /^[^\p{Cc}\p{Cf}]+$/u;

export class UpdateMeDto {
  @ApiProperty({ type: String, minLength: 2, maxLength: 50, example: "Ayşe" })
  @Trim()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Matches(DISPLAY_NAME_PATTERN)
  displayName!: string;
}

export class ChangePasswordDto {
  @ApiProperty({ type: String, maxLength: 128, format: "password" })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  currentPassword!: string;

  @ApiProperty({ type: String, minLength: 8, maxLength: 128, format: "password" })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  newPassword!: string;
}

export class DeleteAccountDto {
  @ApiProperty({ type: String, maxLength: 128, format: "password", description: "Hesabı silmeyi onaylamak için mevcut parola." })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  password!: string;
}

export class AdminUpdateUserDto {
  // `@IsOptional()` değil: o null'ı da geçirir ve `NOT NULL` sütunlarda 500 olurdu (common/validators.ts).
  @ApiPropertyOptional({ enum: USER_ROLES })
  @IsOptionalNotNull()
  @IsIn(USER_ROLES)
  role?: UserRole;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptionalNotNull()
  @IsBoolean()
  disabled?: boolean;

  @ApiPropertyOptional({ type: String, minLength: 2, maxLength: 50 })
  @IsOptionalNotNull()
  @Trim()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Matches(DISPLAY_NAME_PATTERN)
  displayName?: string;
}

export class ListUsersQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ type: String, maxLength: 100, description: "E-posta ya da görünen adda arama (büyük/küçük harf duyarsız, joker karakterler kaçırılır)." })
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(100)
  @NoNullBytes()
  q?: string;

  @ApiPropertyOptional({ enum: USER_ROLES })
  @IsOptional()
  @IsIn(USER_ROLES)
  role?: UserRole;
}

export class UserPageDto extends PaginatedDto(UserDto) {}
