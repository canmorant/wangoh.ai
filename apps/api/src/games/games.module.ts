import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module.js";
import { GamesController } from "./games.controller.js";
import { GameClock, GameRandom } from "./games.runtime.js";
import { GamesService } from "./games.service.js";
import { LeaderboardsController } from "./leaderboards.controller.js";
import { LeaderboardsService } from "./leaderboards.service.js";
import { LeaderboardCacheInterceptor, NoStoreInterceptor } from "./no-store.js";
import { ScoresController } from "./scores.controller.js";
import { ScoresService } from "./scores.service.js";
import { UsersMeController } from "./users-me.controller.js";

/**
 * Oyunlar, puanlama ve liderlik tabloları (`docs/backend-mobil-mimarisi.md` bölüm 8; ayrıntı `README.md`).
 * Veritabanı ve yapılandırma global modüllerden gelir; `TokensService` kullanıcı kilidi içindir.
 */
@Module({
  imports: [AuthModule],
  controllers: [GamesController, LeaderboardsController, UsersMeController, ScoresController],
  providers: [GamesService, LeaderboardsService, ScoresService, GameClock, GameRandom, NoStoreInterceptor, LeaderboardCacheInterceptor],
  exports: [GamesService, LeaderboardsService, ScoresService],
})
export class GamesModule {}
