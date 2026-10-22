import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiExtraModels, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ApiErrors, ErrorResponseDto } from "../common/api-docs.js";
import type { AuthUser } from "../common/auth-types.js";
import { CurrentUser } from "../common/decorators/index.js";
import { LangQueryDto } from "../common/lang.js";
import { uuidParam } from "../common/pipes.js";
import { GAME_TYPES, type GameType } from "../db/schema/enums.js";
import { AnswerResponseDto, FinishResponseDto, GameSessionDto, MapPointDto, StartSessionResponseDto } from "./dto/game.dto.js";
import { SubmitAnswerDto } from "./dto/game-requests.dto.js";
import { GamesService } from "./games.service.js";
import { GameTypePipe } from "./games.pipes.js";
import { NoStore } from "./no-store.js";

/**
 * Sunucu kontrollü oyunlar (`docs/backend-mobil-mimarisi.md` bölüm 8). Hepsi giriş ister. Başkasının
 * oturumu 404 döner (varlığı sızmaz). Doğru cevap yalnız cevaplanmış turun yanıtında görünür.
 */
@ApiTags("games")
@ApiBearerAuth()
@ApiExtraModels(MapPointDto)
@NoStore()
@Controller("games")
export class GamesController {
  constructor(private readonly games: GamesService) {}

  @Post(":gameType/sessions")
  @ApiOperation({
    summary: "Yeni oyun oturumu başlatır",
    description:
      "İlk turu döner. Aynı türde önceki etkin oturum `abandoned` olur (kullanıcı başına tür başına tek etkin oturum). " +
      "Havuzda yeterli ülke yoksa 409 `GAME_POOL_TOO_SMALL`. Oturum 30 dk geçerlidir. " +
      "`flag-quiz` ve `capital-quiz` 10 tur, 4 seçenek; `map-guess` 5 tur.",
  })
  @ApiParam({ name: "gameType", enum: GAME_TYPES })
  @ApiCreatedResponse({ type: StartSessionResponseDto })
  @ApiErrors(400, 401, 409, 429)
  startSession(@CurrentUser() user: AuthUser, @Param("gameType", new GameTypePipe()) gameType: GameType, @Query() query: LangQueryDto): Promise<StartSessionResponseDto> {
    return this.games.startSession(user, gameType, query.lang);
  }

  @Get("sessions/:id")
  @ApiOperation({
    summary: "Oturumu geri yükler (yalnız sahibi)",
    description:
      "Devam eden oturumun cevap bekleyen turunu, puanını ve cevaplanmış turların özetini döner. Doğru cevap dönmez. " +
      "Süresi dolmuş oturum bu istekte `expired` olarak işaretlenir ve `round` null gelir. Başkasının ya da olmayan oturum: 404.",
  })
  @ApiOkResponse({ type: GameSessionDto })
  @ApiErrors(400, 401, 404, 429)
  getSession(@CurrentUser() user: AuthUser, @Param("id", uuidParam()) id: string, @Query() query: LangQueryDto): Promise<GameSessionDto> {
    return this.games.getSession(user, id, query.lang);
  }

  @Post("sessions/:id/answers")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Turu cevaplar",
    description:
      "Turlar sırayla cevaplanır: `roundIndex` bekleyen turla aynı olmalı (yinelenen ya da erken cevap 409 `GAME_ROUND_ALREADY_ANSWERED` / `GAME_ROUND_OUT_OF_ORDER`). " +
      "Süreyi sunucu ölçer; tur süresi (20 sn) ve 3 sn ağ payı aşılırsa cevap 0 puan, `correct: false`, `timedOut: true` sayılır ve oyun sonraki tura geçer. " +
      "Süresi dolan ya da pas geçilen tur için `answer: null` gönderilir (0 puan, seri sıfırlanır). " +
      "Çoktan seçmeli: `100 + hız bonusu (≤ 50) + seri bonusu (≤ 50)`; `map-guess`: haversine uzaklığına göre en çok 1000. " +
      "Süresi dolmuş oturum 410 `GAME_SESSION_EXPIRED`; bitmiş/terk edilmiş oturum 409 `GAME_SESSION_NOT_ACTIVE`; seçenek dışı cevap ya da geçersiz koordinat 400.",
  })
  @ApiOkResponse({ type: AnswerResponseDto })
  @ApiResponse({ status: 410, description: "Oturumun süresi doldu (`GAME_SESSION_EXPIRED`).", type: ErrorResponseDto })
  @ApiErrors(400, 401, 404, 409, 429)
  submitAnswer(
    @CurrentUser() user: AuthUser,
    @Param("id", uuidParam()) id: string,
    @Body() dto: SubmitAnswerDto,
    @Query() query: LangQueryDto,
  ): Promise<AnswerResponseDto> {
    return this.games.submitAnswer(user, id, dto, query.lang);
  }

  @Post("sessions/:id/finish")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Oyunu bitirir ve puanı kaydeder",
    description:
      "Tüm turlar cevaplanmadıysa 409 `GAME_NOT_FINISHED`. İdempotent: yinelenen ve eşzamanlı çağrılar tek puan satırı yazar ve aynı sonucu döner. " +
      "Süresi dolmuş oturum 410 `GAME_SESSION_EXPIRED`; puanı yönetici sildiyse 410 `GAME_SCORE_REMOVED`.",
  })
  @ApiOkResponse({ type: FinishResponseDto })
  @ApiResponse({ status: 410, description: "Oturumun süresi doldu (`GAME_SESSION_EXPIRED`) ya da puan yönetici tarafından silindi (`GAME_SCORE_REMOVED`).", type: ErrorResponseDto })
  @ApiErrors(400, 401, 404, 409, 429)
  finishSession(@CurrentUser() user: AuthUser, @Param("id", uuidParam()) id: string): Promise<FinishResponseDto> {
    return this.games.finishSession(user, id);
  }
}
