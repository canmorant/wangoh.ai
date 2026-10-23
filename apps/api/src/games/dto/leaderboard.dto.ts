import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, Max, Min } from "class-validator";
import { GAME_TYPES, type GameType } from "../../db/schema/enums.js";
import { PaginatedDto, PaginationQueryDto } from "../../common/pagination.js";
import {
  LEADERBOARD_DEFAULT_LIMIT,
  LEADERBOARD_MAX_LIMIT,
  LEADERBOARD_TYPES,
  type LeaderboardType,
  PERIODS,
  type Period,
} from "../games.constants.js";

const PERIOD_PROPERTY = { enum: PERIODS, enumName: "LeaderboardPeriod" } as const;
const TYPE_PROPERTY = { enum: LEADERBOARD_TYPES, enumName: "LeaderboardType" } as const;

export class LeaderboardPeriodQueryDto {
  @ApiPropertyOptional({ ...PERIOD_PROPERTY, default: "all", description: "`all`: tüm zamanlar; `week`: son 7 gün; `day`: son 24 saat (kayan pencere, UTC)." })
  @IsOptional()
  @IsIn(PERIODS)
  period: Period = "all";
}

export class LeaderboardQueryDto extends LeaderboardPeriodQueryDto {
  @ApiPropertyOptional({ type: "integer", minimum: 1, maximum: LEADERBOARD_MAX_LIMIT, default: LEADERBOARD_DEFAULT_LIMIT, description: "Listelenecek en fazla oyuncu sayısı." })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(LEADERBOARD_MAX_LIMIT)
  limit: number = LEADERBOARD_DEFAULT_LIMIT;
}

/** Liderlik satırı: yalnız görünen ad. E-posta ve kullanıcı kimliği hiçbir zaman dönmez. */
export class LeaderboardEntryDto {
  @ApiProperty({ type: "integer", minimum: 1, description: "Sıra. Eşit puanlar aynı sırayı paylaşır (1, 2, 2, 4)." })
  rank!: number;

  @ApiProperty({ type: String, example: "Ayşe" })
  displayName!: string;

  @ApiProperty({ type: "integer", description: "Kullanıcının dönemdeki en iyi tek oyun puanı (`overall`te oyun türü başına en iyilerin toplamı)." })
  score!: number;

  @ApiProperty({ type: String, format: "date-time", description: "Bu puana ilk ulaşıldığı an (eşitlik bozucu: erken olan üstte). `overall`te son tamamlanan türün anı." })
  achievedAt!: string;

  @ApiProperty({ type: Boolean, description: "Satır, isteği yapan oturumun sahibi mi? Oturum yoksa her zaman false." })
  isMe!: boolean;
}

export class LeaderboardDto {
  @ApiProperty(TYPE_PROPERTY)
  gameType!: LeaderboardType;

  @ApiProperty(PERIOD_PROPERTY)
  period!: Period;

  @ApiProperty({ type: "integer", description: "Dönemde en az bir puanı olan toplam oyuncu sayısı." })
  totalPlayers!: number;

  @ApiProperty({ type: () => [LeaderboardEntryDto], description: "Puana göre azalan; eşitlikte puana önce ulaşan üstte." })
  entries!: LeaderboardEntryDto[];
}

export class LeaderboardMeDto {
  @ApiProperty(TYPE_PROPERTY)
  gameType!: LeaderboardType;

  @ApiProperty(PERIOD_PROPERTY)
  period!: Period;

  @ApiProperty({ type: "integer", nullable: true, minimum: 1, description: "Sıranız; dönemde puanınız yoksa null." })
  rank!: number | null;

  @ApiProperty({ type: "integer", nullable: true, description: "Dönemdeki en iyi puanınız (`overall`te toplam); yoksa null." })
  personalBest!: number | null;

  @ApiProperty({ type: "integer", description: "Dönemde en az bir puanı olan toplam oyuncu sayısı." })
  totalPlayers!: number;
}

export class GameTypeStatsDto {
  @ApiProperty({ enum: GAME_TYPES, enumName: "GameType" })
  gameType!: GameType;

  @ApiProperty({ type: "integer", description: "Bitirilip puanı kaydedilen oyun sayısı." })
  gamesPlayed!: number;

  @ApiProperty({ type: "integer", nullable: true, description: "En iyi puan; hiç oynanmadıysa null." })
  bestScore!: number | null;

  @ApiProperty({ type: "integer", description: "Tüm oyunların puan toplamı." })
  totalScore!: number;

  @ApiProperty({ type: "number", nullable: true, description: "Ortalama puan (bir ondalık); hiç oynanmadıysa null." })
  averageScore!: number | null;

  @ApiProperty({ type: String, format: "date-time", nullable: true, description: "Son oyunun bitiş anı." })
  lastPlayedAt!: string | null;
}

export class UserStatsDto {
  @ApiProperty({ type: () => [GameTypeStatsDto], description: "Her oyun türü için bir kayıt (hiç oynanmamışlar sıfır/null)." })
  items!: GameTypeStatsDto[];

  @ApiProperty({ type: "integer" })
  gamesPlayed!: number;

  @ApiProperty({ type: "integer", description: "Tüm oyunların puan toplamı." })
  totalScore!: number;

  @ApiProperty({ type: "integer", description: "Oyun türü başına en iyi puanların toplamı (liderlikteki `overall` ile aynı ölçüt)." })
  overallBest!: number;
}

export class ScoreDto {
  @ApiProperty({ type: String, format: "uuid" })
  id!: string;

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

export class ScorePageDto extends PaginatedDto(ScoreDto) {}

export class ListMyScoresQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: GAME_TYPES, enumName: "GameType", description: "Yalnız bu oyun türünün puanları." })
  @IsOptional()
  @IsIn(GAME_TYPES)
  gameType?: GameType;
}
