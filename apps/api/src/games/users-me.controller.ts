import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiErrors } from "../common/api-docs.js";
import type { AuthUser } from "../common/auth-types.js";
import { CurrentUser } from "../common/decorators/index.js";
import { ListMyScoresQueryDto, ScorePageDto, UserStatsDto } from "./dto/leaderboard.dto.js";
import { ScoresService } from "./scores.service.js";

/**
 * `/users/me/...` oyun istatistikleri. `UsersController` (kimlik/hesap) değişmeden kalır: bu sınıf yalnız
 * İKİ SEGMENTLİ yollar (`users/me/stats`, `users/me/scores`) tanımlar; `users/:id` tek segmentli olduğundan
 * çakışmaz (`test/games-stats.e2e-spec.ts`). `GET users/me` burada TANIMLANMAZ.
 */
@ApiTags("users")
@ApiBearerAuth()
@Controller("users/me")
export class UsersMeController {
  constructor(private readonly scoresService: ScoresService) {}

  @Get("stats")
  @ApiOperation({ summary: "Oyun istatistiklerim", description: "Oyun türü başına oynama sayısı, en iyi, toplam, ortalama ve son oynama; hiç oynanmayan türler sıfır/null." })
  @ApiOkResponse({ type: UserStatsDto })
  @ApiErrors(401, 429)
  stats(@CurrentUser() user: AuthUser): Promise<UserStatsDto> {
    return this.scoresService.stats(user.id);
  }

  @Get("scores")
  @ApiOperation({ summary: "Puan geçmişim (sayfalı)", description: "Yeniden eskiye. `gameType` ile süzülebilir." })
  @ApiOkResponse({ type: ScorePageDto })
  @ApiErrors(400, 401, 429)
  scores(@CurrentUser() user: AuthUser, @Query() query: ListMyScoresQueryDto): Promise<ScorePageDto> {
    return this.scoresService.history(user.id, query);
  }
}
