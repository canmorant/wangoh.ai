import type { PipeTransform } from "@nestjs/common";
import { AppException } from "../common/errors.js";
import { GAME_TYPES, type GameType } from "../db/schema/enums.js";
import { LEADERBOARD_TYPES, type LeaderboardType } from "./games.constants.js";

/** `:gameType` — `flag-quiz | capital-quiz | map-guess`; başka değer 400 (UUID borusu gibi). */
export class GameTypePipe implements PipeTransform<string, GameType> {
  transform(value: string): GameType {
    if (!(GAME_TYPES as readonly string[]).includes(value)) {
      throw AppException.validation([{ field: "gameType", code: "isIn", message: `Oyun türü şunlardan biri olmalı: ${GAME_TYPES.join(", ")}.` }]);
    }
    return value as GameType;
  }
}

/** Liderlikte `overall` de geçerlidir. */
export class LeaderboardTypePipe implements PipeTransform<string, LeaderboardType> {
  transform(value: string): LeaderboardType {
    if (!(LEADERBOARD_TYPES as readonly string[]).includes(value)) {
      throw AppException.validation([{ field: "gameType", code: "isIn", message: `Tür şunlardan biri olmalı: ${LEADERBOARD_TYPES.join(", ")}.` }]);
    }
    return value as LeaderboardType;
  }
}
