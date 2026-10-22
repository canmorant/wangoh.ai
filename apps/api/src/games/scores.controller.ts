import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiErrors } from "../common/api-docs.js";
import { Roles } from "../common/decorators/index.js";
import { uuidParam } from "../common/pipes.js";
import { AdminScorePageDto, ListScoresQueryDto } from "./dto/admin-scores.dto.js";
import { NoStore } from "./no-store.js";
import { ScoresService } from "./scores.service.js";

@ApiTags("scores")
@ApiBearerAuth()
@NoStore()
@Controller("scores")
export class ScoresController {
  constructor(private readonly scores: ScoresService) {}

  @Get()
  @Roles("admin")
  @ApiOperation({
    summary: "Puanları listeler (yönetici)",
    description:
      "Hile incelemesi için: liderlik yalnız görünen ad gösterdiğinden puan kimliği (`DELETE /v1/scores/{id}` için) buradan alınır. " +
      "Yeniden eskiye; `userId`, `sessionId`, `gameType` ve `maxDurationMs` (insanın ulaşamayacağı hızdaki oyunları bulmak için) ile süzülür. " +
      "Devre dışı kullanıcıların puanları da listelenir (`userDisabled`).",
  })
  @ApiOkResponse({ type: AdminScorePageDto })
  @ApiErrors(400, 401, 403, 429)
  list(@Query() query: ListScoresQueryDto): Promise<AdminScorePageDto> {
    return this.scores.listAll(query);
  }

  @Delete(":id")
  @Roles("admin")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Puanı siler (yönetici)", description: "Hileli puanı kaldırır; liderlik ve istatistikler anında değişir. Oturum kaydı kalır, aynı oturum yeniden puan yazamaz." })
  @ApiNoContentResponse({ description: "Puan silindi." })
  @ApiErrors(400, 401, 403, 404, 429)
  async delete(@Param("id", uuidParam()) id: string): Promise<void> {
    await this.scores.remove(id);
  }
}
