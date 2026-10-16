import { applyDecorators } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional, ApiResponse } from "@nestjs/swagger";

/** Doğrulama hatası ayrıntısı (`details` dizisinin elemanı). */
export class FieldErrorDetailDto {
  @ApiProperty({ type: String, example: "email", description: "Noktalı alan yolu (`items.0.text`). Gövde düzeyi hatalarda boş." })
  field!: string;

  @ApiProperty({ type: String, example: "isEmail", description: "Makine okur kısıt adı (class-validator): `isEmail`, `maxLength`, `whitelistValidation`..." })
  code!: string;

  @ApiProperty({ type: String, example: "Geçerli bir e-posta adresi girin.", description: "Kullanıcıya gösterilebilir Türkçe açıklama." })
  message!: string;
}

/** Tüm hata yanıtlarının gövdesi. */
export class ErrorResponseDto {
  @ApiProperty({ type: "integer", example: 400 })
  statusCode!: number;

  @ApiProperty({ type: String, example: "VALIDATION_FAILED", description: "Makine okur hata kodu." })
  code!: string;

  @ApiProperty({ type: String, example: "Girilen bilgiler geçersiz.", description: "Kullanıcıya gösterilebilir Türkçe mesaj." })
  message!: string;

  @ApiPropertyOptional({
    type: () => [FieldErrorDetailDto],
    description: "Doğrulama hatalarında (`VALIDATION_FAILED`) alan başına ayrıntı; diğer hatalarda yoktur.",
  })
  details?: FieldErrorDetailDto[];
}

const STATUS_TEXT: Record<number, string> = {
  400: "Geçersiz istek ya da doğrulama hatası.",
  401: "Kimlik doğrulama gerekli ya da belirteç geçersiz.",
  403: "Bu işlem için yetki yok.",
  404: "Kayıt bulunamadı.",
  409: "Çakışma (ör. e-posta kayıtlı, sıra bozuk).",
  413: "İstek gövdesi çok büyük.",
  429: "Çok fazla istek (hız sınırı).",
};

/** Standart hata yanıtlarını belgeler: `@ApiErrors(400, 401, 403)`. */
export function ApiErrors(...statuses: number[]): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ...statuses.map((status) =>
      ApiResponse({ status, description: STATUS_TEXT[status] ?? "Hata.", type: ErrorResponseDto }),
    ),
  );
}
