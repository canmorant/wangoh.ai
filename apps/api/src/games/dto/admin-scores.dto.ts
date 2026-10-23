import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsInt, IsUUID, Max, Min } from "class-validator";
import { IsOptionalNotNull } from "../../common/validators.js";
import { PaginatedDto, PaginationQueryDto } from "../../common/pagination.js";
import { GAME_TYPES, type GameType } from "../../db/schema/enums.js";

/** `durationMs` sütunu `integer`: üst sınırı aşan değer PostgreSQL'de 500 olurdu. */
const MAX_DURATION_FILTER_MS = 2_147_483_647;

export class ListScoresQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ type: String, format: "uuid", description: "Yalnız bu kullanıcının puanları (kullanıcıyı görünen adla `GET /v1/users?q=` bulur)." })
  @IsOptionalNotNull()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({ type: String, format: "uuid", description: "Yalnız bu oyun oturumunun puanı (oyuncunun `finish` yanıtındaki `sessionId`)." })
  @IsOptionalNotNull()
  @IsUUID()
  sessionId?: string;

  @ApiPropertyOptional({ enum: GAME_TYPES, enumName: "GameType", description: "Yalnız bu oyun türünün puanları." })
  @IsOptionalNotNull()
  @IsIn(GAME_TYPES)
  gameType?: GameType;

  @ApiPropertyOptional({
    type: "integer",
    minimum: 1,
    maximum: MAX_DURATION_FILTER_MS,
    description: "Yalnız toplam süresi bu değere (ms, dahil) eşit ya da daha kısa olan oyunlar: insanın ulaşamayacağı hızdaki (bot) oyunları bulmak için.",
  })
  @IsOptionalNotNull()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_DURATION_FILTER_MS)
  maxDurationMs?: number;
}

/** Yönetici görünümündeki puan: liderliğin göstermediği puan, oturum ve kullanıcı kimlikleri dahil (e-posta yok). */
export class AdminScoreDto {
  @ApiProperty({ type: String, format: "uuid", description: "Puan kimliği: `DELETE /v1/scores/{id}` bunu ister." })
  id!: string;

  @ApiProperty({ type: String, format: "uuid" })
  sessionId!: string;

  @ApiProperty({ type: String, format: "uuid" })
  userId!: string;

  @ApiProperty({ type: String, example: "Ayşe", description: "Liderlikte görünen ad." })
  displayName!: string;

  @ApiProperty({ type: Boolean, description: "Kullanıcı devre dışı bırakılmışsa true: puanı liderlikte, sırada ve oyuncu sayısında yer almaz." })
  userDisabled!: boolean;

  @ApiProperty({ enum: GAME_TYPES, enumName: "GameType" })
  gameType!: GameType;

  @ApiProperty({ type: "integer" })
  score!: number;

  @ApiProperty({ type: "integer" })
  correctCount!: number;

  @ApiProperty({ type: "integer" })
  roundsTotal!: number;

  @ApiProperty({ type: "integer", description: "Oyunun gerçek süresi (ms): oturum başından son cevaba, geri bildirim payı dahil." })
  durationMs!: number;

  @ApiProperty({ type: String, format: "date-time" })
  createdAt!: string;
}

export class AdminScorePageDto extends PaginatedDto(AdminScoreDto) {}
