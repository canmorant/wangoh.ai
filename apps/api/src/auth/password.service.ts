import { Inject, Injectable } from "@nestjs/common";
import { APP_CONFIG } from "../config/config.module.js";
import type { AppConfig } from "../config/env.js";
import { hashPassword, verifyPassword } from "./password.js";

@Injectable()
export class PasswordService {
  private dummyHash: Promise<string> | undefined;

  constructor(@Inject(APP_CONFIG) private readonly config: AppConfig) {}

  hash(password: string): Promise<string> {
    return hashPassword(password, this.config.passwordHash);
  }

  verify(password: string, stored: string): Promise<boolean> {
    return verifyPassword(password, stored);
  }

  /**
   * Bilinmeyen e-postada da gerçek bir doğrulama süresi harcar (kullanıcı varlığı zamanlamayla
   * sızmasın). Her zaman `false` döner.
   */
  async verifyAgainstDummy(password: string): Promise<false> {
    this.dummyHash ??= hashPassword("wangoh-dummy-password-for-timing", this.config.passwordHash);
    await verifyPassword(password, await this.dummyHash);
    return false;
  }
}
