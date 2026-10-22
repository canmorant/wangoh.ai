import { ValidateBy } from "class-validator";
import { hasForbiddenChars, isBlankText, isHttpsUrl } from "../blog-blocks.js";

/** Metinde kontrol ya da yön belirleyici karakter olmasın (`multiline`: satır sonu ve sekme serbest). */
export function NoControlChars(options: { multiline?: boolean } = {}): PropertyDecorator {
  return ValidateBy({
    name: "noControlChars",
    validator: {
      validate: (value: unknown) => typeof value !== "string" || !hasForbiddenChars(value, options.multiline === true),
      defaultMessage: () => "$property kontrol ya da yön belirleyici karakter içeremez",
    },
  });
}

/**
 * Metin yalnız görünmez karakterlerden (sıfır genişlikli boşluk, Hangul dolgusu, Braille boşluğu...) oluşmasın.
 * Boş dizgiyi `MinLength(1)` yakalar; çift hata üretmemek için burada geçer.
 */
export function NotBlank(): PropertyDecorator {
  return ValidateBy({
    name: "isNotEmpty",
    validator: {
      validate: (value: unknown) => typeof value !== "string" || value.length === 0 || !isBlankText(value),
      defaultMessage: () => "$property boş olamaz",
    },
  });
}

/** Yalnız https adresi (`javascript:`, `http:`, göreli yol ve kimlik bilgili adresler reddedilir). */
export function IsHttpsUrl(): PropertyDecorator {
  return ValidateBy({
    name: "isHttpsUrl",
    validator: {
      validate: (value: unknown) => typeof value !== "string" || isHttpsUrl(value),
      defaultMessage: () => "$property https:// ile başlayan geçerli bir adres olmalı",
    },
  });
}
