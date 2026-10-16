import { Inject, Injectable } from "@nestjs/common";
import { and, eq, gt, isNull, type SQL, sql } from "drizzle-orm";
import { AppException, ErrorCode, isUniqueViolation } from "../common/errors.js";
import { DATABASE, type Database } from "../db/client.js";
import { refreshTokens, type UserRow, users } from "../db/schema/index.js";
import { toUserDto, type UserDto } from "../users/dto/user.dto.js";
import type { AuthResponseDto, LoginDto, RegisterDto } from "./dto/auth.dto.js";
import { PasswordService } from "./password.service.js";
import { hashRefreshToken, TokensService } from "./tokens.service.js";

const EMAIL_INDEX = "users_email_lower_idx";

/** Benzersizlik `lower(email)` üzerinde olduğundan sorgu da iki yanı veritabanında küçültür. */
const emailEquals = (email: string): SQL => sql`lower(${users.email}) = lower(${email})`;

const invalidCredentials = (): AppException =>
  AppException.unauthorized(ErrorCode.AUTH_INVALID_CREDENTIALS, "E-posta veya parola hatalı.");
const invalidRefresh = (): AppException =>
  AppException.unauthorized(ErrorCode.AUTH_TOKEN_INVALID, "Oturumunuzun süresi doldu. Lütfen yeniden giriş yapın.");
const accountDisabled = (status: "login" | "refresh"): AppException =>
  status === "login"
    ? AppException.forbidden("Hesabınız devre dışı bırakıldı.", ErrorCode.AUTH_ACCOUNT_DISABLED)
    : AppException.unauthorized(ErrorCode.AUTH_ACCOUNT_DISABLED, "Hesabınız devre dışı bırakıldı.");

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE) private readonly db: Database,
    private readonly passwords: PasswordService,
    private readonly tokens: TokensService,
  ) {}

  /** Kayıt her zaman `user` rolü verir; rol istemciden alınmaz. */
  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const [existing] = await this.db.select({ id: users.id }).from(users).where(emailEquals(dto.email)).limit(1);
    if (existing) throw emailTaken();

    const passwordHash = await this.passwords.hash(dto.password);
    let created: UserRow;
    try {
      const [row] = await this.db
        .insert(users)
        .values({ email: dto.email, passwordHash, displayName: dto.displayName, role: "user" })
        .returning();
      created = row!;
    } catch (err) {
      // Eşzamanlı aynı e-posta kaydı: benzersiz dizin son sözü söyler.
      if (isUniqueViolation(err, EMAIL_INDEX)) throw emailTaken();
      throw err;
    }
    const pair = await this.tokens.issueTokenPair(this.db, created);
    return { ...pair, user: toUserDto(created) };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const [user] = await this.db.select().from(users).where(emailEquals(dto.email)).limit(1);
    if (!user) {
      // Süre farkı e-postanın kayıtlı olup olmadığını sızdırmasın.
      await this.passwords.verifyAgainstDummy(dto.password);
      throw invalidCredentials();
    }
    if (!(await this.passwords.verify(dto.password, user.passwordHash))) throw invalidCredentials();
    // Devre dışı bildirimi yalnız doğru parolayı bilen kişiye verilir.
    if (user.disabled) throw accountDisabled("login");

    // Pahalı parola doğrulaması işlem dışında bitti; belirteç verme kullanıcı kilidi altında yapılır
    // (kilit sırası users -> refresh_tokens) ve durum kilit altında yeniden denetlenir.
    const session = await this.db.transaction(async (tx) => {
      const locked = await this.tokens.lockUser(tx, user.id);
      // Doğrulama ile belirteç verme arasında hesap silindi ya da parola değişti: bu giriş geçersiz.
      if (!locked || locked.passwordHash !== user.passwordHash) return { kind: "invalid" as const };
      if (locked.disabled) return { kind: "disabled" as const };
      return { kind: "ok" as const, user: locked, pair: await this.tokens.issueTokenPair(tx, locked) };
    });
    if (session.kind === "invalid") throw invalidCredentials();
    if (session.kind === "disabled") throw accountDisabled("login");
    return { ...session.pair, user: toUserDto(session.user) };
  }

  /**
   * Yenileme belirtecini döndürür (rotation). Talep atomiktir: `used_at` yalnız bir kez doldurulabilir,
   * bu yüzden aynı belirteçle eşzamanlı iki istekten yalnız biri kazanır. Kullanılmış bir belirteç
   * yeniden gelirse (çalıntı/çoğaltılmış) ailenin tamamı iptal edilir.
   *
   * Kilit sırası `users` -> `refresh_tokens`: belirteç satırına dokunmadan önce sahibinin satırı
   * kilitlenir (`TokensService.lockUser`); böylece yönetici işlemleri ve çıkış ile kilitlenmeye
   * girilmez ve aile iptali bu işlemin yeni belirtecini kaçırmaz.
   */
  async refresh(rawToken: string): Promise<AuthResponseDto> {
    const hash = hashRefreshToken(rawToken);
    const outcome = await this.db.transaction(async (tx) => {
      // Sahip kilitsiz okunur (belirteç satırı kilitlenmez); asıl kilit hemen ardından kullanıcıda alınır.
      const [stored] = await tx.select({ userId: refreshTokens.userId }).from(refreshTokens).where(eq(refreshTokens.tokenHash, hash)).limit(1);
      if (!stored) return { kind: "invalid" as const };
      const user = await this.tokens.lockUser(tx, stored.userId);
      if (!user) return { kind: "invalid" as const }; // hesap eşzamanlı silindi

      const now = new Date();
      const [claimed] = await tx
        .update(refreshTokens)
        .set({ usedAt: now })
        .where(
          and(
            eq(refreshTokens.tokenHash, hash),
            isNull(refreshTokens.usedAt),
            isNull(refreshTokens.revokedAt),
            gt(refreshTokens.expiresAt, now),
          ),
        )
        .returning();

      if (!claimed) {
        const [row] = await tx.select().from(refreshTokens).where(eq(refreshTokens.tokenHash, hash)).limit(1);
        // Daha önce harcanmış belirteç tekrar geldi: yeniden kullanım, ailenin tamamı iptal.
        if (row?.usedAt) await this.tokens.revokeFamily(tx, row.familyId);
        return { kind: "invalid" as const };
      }

      if (user.disabled) {
        await this.tokens.revokeFamily(tx, claimed.familyId);
        return { kind: "disabled" as const };
      }
      // Parola değişimiyle yarışıp geç kalmış bir belirteç: sürüm uyuşmaz, aile kapanır.
      if (claimed.tokenVersion !== user.tokenVersion) {
        await this.tokens.revokeFamily(tx, claimed.familyId);
        return { kind: "invalid" as const };
      }

      await this.tokens.purgeExpired(tx, user.id);
      const refreshToken = await this.tokens.issueRefreshToken(tx, user, claimed.familyId);
      const access = await this.tokens.signAccessToken(user);
      return { kind: "ok" as const, user, refreshToken, access };
    });

    if (outcome.kind === "disabled") throw accountDisabled("refresh");
    if (outcome.kind === "invalid") throw invalidRefresh();
    return {
      accessToken: outcome.access.token,
      refreshToken: outcome.refreshToken,
      expiresIn: outcome.access.expiresIn,
      user: toUserDto(outcome.user),
    };
  }

  /**
   * Belirtecin ailesini iptal eder. Bilinmeyen belirteç de başarılı sayılır (varlık sızmaz). Kullanıcı
   * kilidi altında çalışır: sürmekte olan bir yenilemenin bastığı yeni belirteç de iptal edilir.
   */
  async logout(rawToken: string): Promise<void> {
    const hash = hashRefreshToken(rawToken);
    await this.db.transaction(async (tx) => {
      const [row] = await tx
        .select({ familyId: refreshTokens.familyId, userId: refreshTokens.userId })
        .from(refreshTokens)
        .where(eq(refreshTokens.tokenHash, hash))
        .limit(1);
      if (!row) return;
      if (!(await this.tokens.lockUser(tx, row.userId))) return;
      await this.tokens.revokeFamily(tx, row.familyId);
    });
  }

  async getProfile(userId: string): Promise<UserDto> {
    const [user] = await this.db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) throw AppException.notFound("Kullanıcı bulunamadı.");
    return toUserDto(user);
  }
}

function emailTaken(): AppException {
  return AppException.conflict("Bu e-posta adresi zaten kayıtlı.", ErrorCode.AUTH_EMAIL_TAKEN);
}
