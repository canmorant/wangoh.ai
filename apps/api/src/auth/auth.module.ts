import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { APP_CONFIG } from "../config/config.module.js";
import type { AppConfig } from "../config/env.js";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { PasswordService } from "./password.service.js";
import { TokensService } from "./tokens.service.js";

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [APP_CONFIG],
      useFactory: (config: AppConfig) => ({ secret: config.jwt.secret }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordService, TokensService],
  exports: [AuthService, PasswordService, TokensService],
})
export class AuthModule {}
