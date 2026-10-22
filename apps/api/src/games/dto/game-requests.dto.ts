import { ApiProperty } from "@nestjs/swagger";
import { getSchemaPath } from "@nestjs/swagger";
import { IsInt, Max, Min, ValidateBy } from "class-validator";
import { MapPointDto } from "./game.dto.js";

/** En fazla tur sayısı (map-guess 5, çoktan seçmeli 10) çok altında bir güvenlik sınırı. */
const MAX_ROUND_INDEX = 100;

/**
 * Alan gönderilmiş olmalı; `null` GEÇERLİDİR ("cevap yok"). `@IsDefined()` null'ı da reddeder, `@IsOptional()` ise
 * alanın hiç gönderilmemesine izin verirdi. Kısıt adı `isDefined`: hata mesajı ortak çeviri tablosundan gelir.
 */
function IsPresent(): PropertyDecorator {
  return ValidateBy({ name: "isDefined", validator: { validate: (value: unknown) => value !== undefined } });
}

export class SubmitAnswerDto {
  @ApiProperty({ type: "integer", minimum: 0, maximum: MAX_ROUND_INDEX, description: "Cevaplanan turun numarası (`round.index`). Sırası bozuk ya da yinelenen cevap 409 döner." })
  @IsInt()
  @Min(0)
  @Max(MAX_ROUND_INDEX)
  roundIndex!: number;

  @ApiProperty({
    oneOf: [{ type: "string", example: "FR", description: "Çoktan seçmeli: seçilen seçeneğin kimliği (ülke kodu)." }, { $ref: getSchemaPath(MapPointDto) }],
    nullable: true,
    description:
      "Çoktan seçmeli oyunlarda seçenek kimliği (ülke kodu), `map-guess`te `{ lat, lng }` (lat -90..90, lng -180..180, sonlu sayı). " +
      "`null`: cevap yok (süre doldu ya da pas): 0 puan, seri sıfırlanır, oyun sonraki tura geçer; `timedOut` yalnız süre (20 sn) aşıldıysa true. " +
      "Alan hiç gönderilmezse 400. Biçim oyun türüne göre sunucuda doğrulanır.",
  })
  @IsPresent()
  answer!: unknown;
}
