import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiErrors } from "../common/api-docs.js";
import type { AuthUser } from "../common/auth-types.js";
import { CurrentUser, Public, StrictThrottle } from "../common/decorators/index.js";
import { UserDto } from "../users/dto/user.dto.js";
import { AuthService } from "./auth.service.js";
import { AuthResponseDto, LoginDto, RefreshTokenDto, RegisterDto } from "./dto/auth.dto.js";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @StrictThrottle()
  @Post("register")
  @ApiOperation({ summary: "Yeni hesap oluşturur", description: "Her zaman `user` rolü verir. Yanıt oturum açılmış gibi belirteç çiftini de döner." })
  @ApiCreatedResponse({ type: AuthResponseDto, description: "Hesap oluşturuldu; oturum belirteçleri döner." })
  @ApiErrors(400, 409, 429)
  register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    return this.auth.register(dto);
  }

  @Public()
  @StrictThrottle()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "E-posta ve parolayla giriş yapar" })
  @ApiOkResponse({ type: AuthResponseDto, description: "Giriş başarılı." })
  @ApiErrors(400, 401, 403, 429)
  login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.auth.login(dto);
  }

  @Public()
  @StrictThrottle()
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Yenileme belirtecini döndürür",
    description: "Yeni erişim + yenileme belirteci çifti verir; gönderilen belirteç tek kullanımlıktır. Kullanılmış bir belirteç tekrar gelirse oturumun tamamı iptal edilir.",
  })
  @ApiOkResponse({ type: AuthResponseDto, description: "Yeni belirteç çifti." })
  @ApiErrors(400, 401, 429)
  refresh(@Body() dto: RefreshTokenDto): Promise<AuthResponseDto> {
    return this.auth.refresh(dto.refreshToken);
  }

  @Public()
  @StrictThrottle()
  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Oturumu kapatır", description: "Belirtecin ailesini iptal eder. Bilinmeyen belirteç de 204 döner." })
  @ApiNoContentResponse({ description: "Oturum kapatıldı." })
  @ApiErrors(400, 429)
  async logout(@Body() dto: RefreshTokenDto): Promise<void> {
    await this.auth.logout(dto.refreshToken);
  }

  @Get("me")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Oturumdaki kullanıcıyı döner" })
  @ApiOkResponse({ type: UserDto, description: "Oturumdaki kullanıcı." })
  @ApiErrors(401, 429)
  me(@CurrentUser() user: AuthUser): Promise<UserDto> {
    return this.auth.getProfile(user.id);
  }
}
