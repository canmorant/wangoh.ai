import { Inject, Injectable } from "@nestjs/common";
import { and, desc, eq, or, type SQL, sql } from "drizzle-orm";
import type { PgUpdateSetSource } from "drizzle-orm/pg-core";
import { PasswordService } from "../auth/password.service.js";
import { TokensService } from "../auth/tokens.service.js";
import { containsIlike } from "../common/like.js";
import { AppException, ErrorCode } from "../common/errors.js";
import { type Page, pageWindow, toPage } from "../common/pagination.js";
import { DATABASE, type Database } from "../db/client.js";
import { type UserRow, users } from "../db/schema/index.js";
import { toUserDto, type UserDto } from "./dto/user.dto.js";
import type { AdminUpdateUserDto, ListUsersQueryDto } from "./dto/user-requests.dto.js";

const userNotFound = (): AppException => AppException.notFound("Kullanıcı bulunamadı.");
const wrongPassword = (): AppException =>
  // 401 değil: istemci 401'i "oturum bitti" sayıp çıkış yapar; burada oturum geçerli, parola yanlış.
  AppException.forbidden("Mevcut parola hatalı.", ErrorCode.AUTH_INVALID_CREDENTIALS);
const lastAdmin = (): AppException =>
  AppException.conflict("Son yönetici hesabı silinemez, devre dışı bırakılamaz ya da kullanıcı rolüne düşürülemez.", ErrorCode.LAST_ADMIN);

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE) private readonly db: Database,
    private readonly passwords: PasswordService,
    private readonly tokens: TokensService,
  ) {}

  // --- kendi hesabı -----------------------------------------------------

  async updateMe(userId: string, displayName: string): Promise<UserDto> {
    const [row] = await this.db.update(users).set({ displayName, updatedAt: new Date() }).where(eq(users.id, userId)).returning();
    if (!row) throw userNotFound();
    return toUserDto(row);
  }

  /**
   * Parolayı değiştirir ve kullanıcının TÜM oturumlarını kapatır: yenileme belirteçleri iptal edilir,
   * `token_version` artar (eski erişim belirteçleri anında düşer). Maliyetli özetleme işlem dışında
   * yapılır; güncelleme "eski özet hâlâ aynıysa" koşuluyla yarışa karşı korunur.
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.requireUser(userId);
    if (!(await this.passwords.verify(currentPassword, user.passwordHash))) throw wrongPassword();
    const passwordHash = await this.passwords.hash(newPassword);

    await this.db.transaction(async (tx) => {
      const updated = await tx
        .update(users)
        .set({ passwordHash, tokenVersion: sql`${users.tokenVersion} + 1`, updatedAt: new Date() })
        .where(and(eq(users.id, userId), eq(users.passwordHash, user.passwordHash)))
        .returning({ id: users.id });
      // Eşzamanlı başka bir parola değişimi kazandı: sessizce ezme.
      if (updated.length === 0) throw AppException.conflict("Parola eş zamanlı olarak değiştirildi. Lütfen tekrar deneyin.");
      await this.tokens.revokeAllForUser(tx, userId);
    });
  }

  /** Hesabı kalıcı siler (App Store gerekliliği). Son aktif admin kendini silemez. */
  async deleteMe(userId: string, password: string): Promise<void> {
    const user = await this.requireUser(userId);
    if (!(await this.passwords.verify(password, user.passwordHash))) throw wrongPassword();
    await this.deleteUserGuarded(userId);
  }

  // --- yönetici ---------------------------------------------------------

  async list(query: ListUsersQueryDto): Promise<Page<UserDto>> {
    const filters: SQL[] = [];
    if (query.role) filters.push(eq(users.role, query.role));
    if (query.q) {
      const term = query.q;
      filters.push(or(containsIlike(users.email, term), containsIlike(users.displayName, term))!);
    }
    const where = filters.length > 0 ? and(...filters) : undefined;
    const { limit, offset } = pageWindow(query);

    const [rows, [count]] = await Promise.all([
      this.db.select().from(users).where(where).orderBy(desc(users.createdAt), desc(users.id)).limit(limit).offset(offset),
      this.db.select({ total: sql<number>`count(*)::int` }).from(users).where(where),
    ]);
    return toPage(rows.map(toUserDto), count?.total ?? 0, query);
  }

  async get(id: string): Promise<UserDto> {
    return toUserDto(await this.requireUser(id));
  }

  /**
   * Rol/devre dışı/ad günceller. Son aktif admini düşürmeyi ya da devre dışı bırakmayı reddeder.
   * Aktif admin satırları sabit sırayla kilitlenir (`FOR UPDATE`), böylece iki admin aynı anda
   * birbirini düşürerek sistemi admin'siz bırakamaz. Hedef satır `FOR NO KEY UPDATE` ile (yenileme,
   * giriş ve çıkışın aldığı kilitle aynı) kilitlenir ve ancak SONRA belirteç satırlarına dokunulur:
   * kilit sırası her yerde `users` -> `refresh_tokens` olduğundan eşzamanlı yenilemeyle kilitlenme olmaz
   * (`TokensService.lockUser`). `FOR UPDATE` burada kullanılmaz: FK denetiminin `FOR KEY SHARE`ine
   * gereksiz yere takılırdı.
   */
  async adminUpdate(id: string, dto: AdminUpdateUserDto): Promise<UserDto> {
    const touchesAccess = dto.role !== undefined || dto.disabled !== undefined;
    return this.db.transaction(async (tx) => {
      const activeAdmins = touchesAccess ? await lockActiveAdmins(tx) : [];
      const target = await this.tokens.lockUser(tx, id);
      if (!target) throw userNotFound();

      const isActiveAdmin = target.role === "admin" && !target.disabled;
      const losesAdmin = isActiveAdmin && (dto.role === "user" || dto.disabled === true);
      if (losesAdmin && activeAdmins.length <= 1) throw lastAdmin();

      const patch: PgUpdateSetSource<typeof users> = { updatedAt: new Date() };
      if (dto.role !== undefined) patch.role = dto.role;
      if (dto.displayName !== undefined) patch.displayName = dto.displayName;
      if (dto.disabled !== undefined) patch.disabled = dto.disabled;
      const disabling = dto.disabled === true && !target.disabled;
      if (disabling) patch.tokenVersion = sql`${users.tokenVersion} + 1`;

      const [row] = await tx.update(users).set(patch).where(eq(users.id, id)).returning();
      if (disabling) await this.tokens.revokeAllForUser(tx, id);
      return toUserDto(row!);
    });
  }

  async adminDelete(id: string): Promise<void> {
    await this.deleteUserGuarded(id);
  }

  // --- yardımcılar ------------------------------------------------------

  private async requireUser(id: string): Promise<UserRow> {
    const [row] = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!row) throw userNotFound();
    return row;
  }

  /**
   * Silme: yenileme belirteçleri, oyun oturumları ve puanlar FK `cascade` ile gider. Satır `FOR UPDATE`
   * ile kilitlenir; eşzamanlı yenileme/giriş/çıkış önce kullanıcı kilidini aldığından (kilit sırası
   * `users` -> `refresh_tokens`) silme onlarla kilitlenmeye girmez, yalnız sırasını bekler.
   */
  private async deleteUserGuarded(id: string): Promise<void> {
    await this.db.transaction(async (tx) => {
      const activeAdmins = await lockActiveAdmins(tx);
      const [target] = await tx.select().from(users).where(eq(users.id, id)).for("update");
      if (!target) throw userNotFound();
      if (target.role === "admin" && !target.disabled && activeAdmins.length <= 1) throw lastAdmin();
      await tx.delete(users).where(eq(users.id, id));
    });
  }
}

/** Aktif adminleri `id` sırasıyla kilitler (tutarlı kilit sırası = kilitlenme yok). */
async function lockActiveAdmins(tx: Database): Promise<{ id: string }[]> {
  return tx
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.role, "admin"), eq(users.disabled, false)))
    .orderBy(users.id)
    .for("update");
}
