import { ValidateBy, ValidateIf, type ValidationOptions } from "class-validator";

/**
 * JSON gövdede "alan hiç gönderilmeyebilir ama gönderilirse null OLAMAZ" için `@IsOptional()` yerine
 * bunu kullan. `@IsOptional()` yalnız `undefined` değil `null` değerini de doğrulamadan geçirir; servis
 * `dto.x !== undefined` ile yama kurduğunda `null` `NOT NULL` sütuna gider ve 400 yerine 500 olur.
 * (Gerçekten "alanı temizle" anlamı taşıyan `null` isteniyorsa `@IsOptional()` bilerek kullanılır.)
 */
export function IsOptionalNotNull(): PropertyDecorator {
  return ValidateIf((_object, value) => value !== undefined);
}

/**
 * Metinde NUL (`\u0000`) karakterini reddeder: PostgreSQL `text` ve `jsonb` bunu kabul etmez ve istek
 * 500 olur. Veritabanına yazılan ya da aramada kullanılan serbest metin alanlarına ekle.
 */
export function NoNullBytes(options?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: "noNullBytes",
      validator: {
        validate: (value: unknown) => typeof value !== "string" || !value.includes("\u0000"),
        defaultMessage: () => "$property NUL karakteri içeremez",
      },
    },
    options,
  );
}
