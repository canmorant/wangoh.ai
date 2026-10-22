import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { ApiErrors } from "../common/api-docs.js";
import type { AuthUser } from "../common/auth-types.js";
import { CurrentUser, OptionalAuth } from "../common/decorators/index.js";
import { LeaderboardDto, LeaderboardMeDto, LeaderboardPeriodQueryDto, LeaderboardQueryDto } from "./dto/leaderboard.dto.js";
import { LEADERBOARD_TYPES, type LeaderboardType } from "./games.constants.js";
import { LeaderboardTypePipe } from "./games.pipes.js";
import { LeaderboardsService } from "./leaderboards.service.js";
import { LeaderboardCache, NoStore } from "./no-store.js";

const TYPE_PARAM = { name: "gameType", enum: LEADERBOARD_TYPES, description: "Oyun türü ya da `overall` (oyun türü başına en iyilerin toplamı)." } as const;

@ApiTags("leaderboards")
@NoStore()
@Controller("leaderboards")
export class LeaderboardsController {
  constructor(private readonly leaderboards: LeaderboardsService) {}

  @Get(":gameType")
  @OptionalAuth()
  @LeaderboardCache()
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Liderlik tablosu",
    description:
      "Herkese açık. Kullanıcı başına en iyi tek oyun puanı; eşit puan aynı sırayı paylaşır, listede puana önce ulaşan üstte. " +
      "`period`: `all`, `week` (son 7 gün), `day` (son 24 saat). Yalnız görünen ad döner (e-posta ve kimlik asla); " +
      "oturum açıksa kendi satırınızda `isMe: true`. Authorization başlığı VARSA geçerli olmalıdır.",
  })
  @ApiParam(TYPE_PARAM)
  @ApiOkResponse({ type: LeaderboardDto })
  @ApiErrors(400, 401, 429)
  get(
    @CurrentUser() user: AuthUser | undefined,
    @Param("gameType", new LeaderboardTypePipe()) gameType: LeaderboardType,
    @Query() query: LeaderboardQueryDto,
  ): Promise<LeaderboardDto> {
    return this.leaderboards.list(gameType, query.period, query.limit, user?.id);
  }

  @Get(":gameType/me")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Liderlikteki sıram", description: "Sıram, en iyi puanım ve toplam oyuncu sayısı. Dönemde puanım yoksa `rank` ve `personalBest` null." })
  @ApiParam(TYPE_PARAM)
  @ApiOkResponse({ type: LeaderboardMeDto })
  @ApiErrors(400, 401, 429)
  me(
    @CurrentUser() user: AuthUser,
    @Param("gameType", new LeaderboardTypePipe()) gameType: LeaderboardType,
    @Query() query: LeaderboardPeriodQueryDto,
  ): Promise<LeaderboardMeDto> {
    return this.leaderboards.me(user.id, gameType, query.period);
  }
}
