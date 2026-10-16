import { ParseUUIDPipe } from "@nestjs/common";
import { AppException } from "./errors.js";

/** Yol parametresi UUID değilse tutarlı `VALIDATION_FAILED` döner (ham 500/pg hatası değil). */
export function uuidParam(field = "id"): ParseUUIDPipe {
  return new ParseUUIDPipe({
    exceptionFactory: () => AppException.validation([{ field, code: "isUUID", message: "Geçerli bir kimlik olmalı." }]),
  });
}
