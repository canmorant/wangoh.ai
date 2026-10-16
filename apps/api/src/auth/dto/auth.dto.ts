import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Trim, TrimLowercase } from "../../common/transforms.js";
import { DISPLAY_NAME_PATTERN } from "../../users/dto/user-requests.dto.js";
import { UserDto } from "../../users/dto/user.dto.js";

export class RegisterDto {
  @ApiProperty({ type: String, format: "email", maxLength: 254, example: "ayse@example.com", description: "Küçük harfe çevrilir ve kırpılır; benzersizlik büyük/küçük harf duyarsızdır." })
  @TrimLowercase()
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @ApiProperty({ type: String, minLength: 8, maxLength: 128, format: "password" })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  @ApiProperty({ type: String, minLength: 2, maxLength: 50, example: "Ayşe" })
  @Trim()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Matches(DISPLAY_NAME_PATTERN)
  displayName!: string;
}

export class LoginDto {
  @ApiProperty({ type: String, format: "email", maxLength: 254, example: "ayse@example.com" })
  @TrimLowercase()
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @ApiProperty({ type: String, maxLength: 128, format: "password" })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  password!: string;
}

export class RefreshTokenDto {
  @ApiProperty({ type: String, minLength: 16, maxLength: 256, description: "Son verilen yenileme belirteci. Her yenilemede döner; eskisi bir daha kullanılamaz." })
  @IsString()
  @MinLength(16)
  @MaxLength(256)
  refreshToken!: string;
}

export class AuthResponseDto {
  @ApiProperty({ type: String, description: "Kısa ömürlü JWT (HS256). `Authorization: Bearer <accessToken>` ile gönderilir." })
  accessToken!: string;

  @ApiProperty({ type: String, description: "Opak yenileme belirteci (256 bit). Sunucuda yalnız SHA-256 özeti tutulur." })
  refreshToken!: string;

  @ApiProperty({ type: "integer", example: 900, description: "Erişim belirtecinin saniye cinsinden ömrü." })
  expiresIn!: number;

  @ApiProperty({ type: () => UserDto })
  user!: UserDto;
}
