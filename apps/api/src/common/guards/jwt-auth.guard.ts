import { type CanActivate, type ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { eq } from "drizzle-orm";
import { TokensService } from "../../auth/tokens.service.js";
import { DATABASE, type Database } from "../../db/client.js";
import { users } from "../../db/schema/index.js";
import type { AuthenticatedRequest } from "../auth-types.js";
import { IS_OPTIONAL_AUTH_KEY, IS_PUBLIC_KEY } from "../decorators/public.decorator.js";
import { AppException, ErrorCode } from "../errors.js";

const BEARER_RE = /^Bearer\s+(\S+)$/i;

/**
 * Varsayılan kapalı kapı: `@Public()` olmayan her uç geçerli bir erişim belirteci ister.
 * Rol belirteçten DEĞİL veritabanından okunur; her istekte kullanıcı yüklenir, silinmiş ya da
 * devre dışı kullanıcı (ve eski `ver` taşıyan belirteç) anında reddedilir.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokens: TokensService,
    @Inject(DATABASE) private readonly db: Database,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const targets = [context.getHandler(), context.getClass()];
    if (this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, targets)) return true;
    const optional = this.reflector.getAllAndOverride<boolean>(IS_OPTIONAL_AUTH_KEY, targets) === true;

    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const header = req.headers.authorization;
    if (header === undefined) {
      if (optional) return true;
      throw AppException.unauthorized(ErrorCode.AUTH_REQUIRED, "Bu işlem için giriş yapmalısınız.");
    }

    const match = BEARER_RE.exec(header);
    const claims = match ? await this.tokens.verifyAccessToken(match[1]!) : null;
    if (!claims) throw invalidToken();

    const [user] = await this.db
      .select({
        id: users.id,
        email: users.email,
        displayName: users.displayName,
        role: users.role,
        disabled: users.disabled,
        tokenVersion: users.tokenVersion,
      })
      .from(users)
      .where(eq(users.id, claims.sub))
      .limit(1);

    if (!user) throw invalidToken();
    // İmza geçerli olduğundan durum açıkça söylenebilir; istemci her iki durumda da (401) oturumu kapatır.
    if (user.disabled) throw AppException.unauthorized(ErrorCode.AUTH_ACCOUNT_DISABLED, "Hesabınız devre dışı bırakıldı.");
    if (user.tokenVersion !== claims.ver) throw invalidToken();

    req.user = { id: user.id, email: user.email, displayName: user.displayName, role: user.role };
    return true;
  }
}

function invalidToken(): AppException {
  return AppException.unauthorized(ErrorCode.AUTH_TOKEN_INVALID, "Oturumunuz geçersiz ya da süresi dolmuş. Lütfen yeniden giriş yapın.");
}
