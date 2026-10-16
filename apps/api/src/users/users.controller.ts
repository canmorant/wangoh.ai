import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiErrors } from "../common/api-docs.js";
import type { AuthUser } from "../common/auth-types.js";
import { CurrentUser, Roles, StrictThrottle } from "../common/decorators/index.js";
import { uuidParam } from "../common/pipes.js";
import { UserDto } from "./dto/user.dto.js";
import { AdminUpdateUserDto, ChangePasswordDto, DeleteAccountDto, ListUsersQueryDto, UpdateMeDto, UserPageDto } from "./dto/user-requests.dto.js";
import { UsersService } from "./users.service.js";

/**
 * SIRA ÖNEMLİ: `me` yolları `:id` yollarından ÖNCE tanımlanır; yoksa `PATCH /users/me`
 * yönetici ucuna düşerdi. `:id` ayrıca UUID boru hattıyla korunur.
 */
@ApiTags("users")
@ApiBearerAuth()
@Controller("users")
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Patch("me")
  @ApiOperation({ summary: "Görünen adı günceller", description: "Rol, e-posta gibi alanlar kabul edilmez (400)." })
  @ApiOkResponse({ type: UserDto, description: "Güncellenmiş kullanıcı." })
  @ApiErrors(400, 401, 429)
  updateMe(@CurrentUser() user: AuthUser, @Body() dto: UpdateMeDto): Promise<UserDto> {
    return this.users.updateMe(user.id, dto.displayName);
  }

  @Post("me/password")
  @StrictThrottle()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Parolayı değiştirir",
    description: "Başarılı olunca tüm oturumlar (bu cihaz dahil) kapanır; istemci yeniden giriş ister.",
  })
  @ApiNoContentResponse({ description: "Parola değişti, tüm belirteçler iptal edildi." })
  @ApiErrors(400, 401, 403, 409, 429)
  async changePassword(@CurrentUser() user: AuthUser, @Body() dto: ChangePasswordDto): Promise<void> {
    await this.users.changePassword(user.id, dto.currentPassword, dto.newPassword);
  }

  @Delete("me")
  @StrictThrottle()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Hesabı kalıcı olarak siler", description: "Parola onayı ister. Son yönetici hesabı silinemez (409 `LAST_ADMIN`)." })
  @ApiNoContentResponse({ description: "Hesap ve ilişkili veriler silindi." })
  @ApiErrors(400, 401, 403, 409, 429)
  async deleteMe(@CurrentUser() user: AuthUser, @Body() dto: DeleteAccountDto): Promise<void> {
    await this.users.deleteMe(user.id, dto.password);
  }

  @Get()
  @Roles("admin")
  @ApiOperation({ summary: "Kullanıcıları listeler (yönetici)" })
  @ApiOkResponse({ type: UserPageDto, description: "Sayfalı kullanıcı listesi." })
  @ApiErrors(400, 401, 403, 429)
  list(@Query() query: ListUsersQueryDto): Promise<UserPageDto> {
    return this.users.list(query);
  }

  @Get(":id")
  @Roles("admin")
  @ApiOperation({ summary: "Kullanıcı ayrıntısı (yönetici)" })
  @ApiOkResponse({ type: UserDto, description: "Kullanıcı." })
  @ApiErrors(400, 401, 403, 404, 429)
  get(@Param("id", uuidParam()) id: string): Promise<UserDto> {
    return this.users.get(id);
  }

  @Patch(":id")
  @Roles("admin")
  @ApiOperation({ summary: "Rol, devre dışı durumu ya da adı günceller (yönetici)", description: "Son aktif yönetici düşürülemez/devre dışı bırakılamaz (409 `LAST_ADMIN`). Devre dışı bırakma oturumları anında kapatır." })
  @ApiOkResponse({ type: UserDto, description: "Güncellenmiş kullanıcı." })
  @ApiErrors(400, 401, 403, 404, 409, 429)
  update(@Param("id", uuidParam()) id: string, @Body() dto: AdminUpdateUserDto): Promise<UserDto> {
    return this.users.adminUpdate(id, dto);
  }

  @Delete(":id")
  @Roles("admin")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Kullanıcıyı siler (yönetici)" })
  @ApiNoContentResponse({ description: "Kullanıcı silindi." })
  @ApiErrors(400, 401, 403, 404, 409, 429)
  async remove(@Param("id", uuidParam()) id: string): Promise<void> {
    await this.users.adminDelete(id);
  }
}
