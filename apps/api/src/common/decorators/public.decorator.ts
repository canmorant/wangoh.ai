import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "wangoh:isPublic";
export const IS_OPTIONAL_AUTH_KEY = "wangoh:optionalAuth";
export const STRICT_THROTTLE_KEY = "wangoh:strictThrottle";

/**
 * Uç noktayı genel erişime açar. Global `JwtAuthGuard` varsayılan olarak her şeyi kapatır; belirteç
 * hiç okunmaz (`req.user` dolmaz).
 */
export const Public = (): MethodDecorator & ClassDecorator => SetMetadata(IS_PUBLIC_KEY, true);

/**
 * Herkese açık ama oturum varsa kullanıcıyı tanıyan uç (ör. blogda yöneticinin taslakları görmesi).
 * `Authorization` başlığı yoksa anonim geçer; başlık VARSA belirteç geçerli olmak zorundadır
 * (süresi dolmuş belirteç 401 döner ki istemci yenileme yapsın). Rol kontrolü için
 * `@CurrentUser()` ile kullanıcıya bakın.
 */
export const OptionalAuth = (): MethodDecorator & ClassDecorator => SetMetadata(IS_OPTIONAL_AUTH_KEY, true);

/** Kimlik uçları için sıkı hız sınırı (varsayılan 10/dk, IP başına ortak kova) uygular. */
export const StrictThrottle = (): MethodDecorator & ClassDecorator => SetMetadata(STRICT_THROTTLE_KEY, true);
