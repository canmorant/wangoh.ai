import type { PipeTransform } from "@nestjs/common";
import { AppException } from "../common/errors.js";
import { MAX_SLUG_LENGTH, SLUG_PATTERN } from "./slug.js";

/** `:code` — ISO 3166-1 alpha-2. Küçük harf kabul edilir (`fr` → `FR`); biçim yanlışsa 400 (UUID borusu gibi). */
export class CountryCodePipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!/^[A-Za-z]{2}$/.test(value)) {
      throw AppException.validation([{ field: "code", code: "isIso2", message: "İki harfli ülke kodu (ISO 3166-1 alpha-2) olmalı." }]);
    }
    return value.toUpperCase();
  }
}

/** `:slug` — küçük harfe çevrilir; küçük harf/rakam/tire dışında ya da çok uzunsa 400. */
export class SlugPipe implements PipeTransform<string, string> {
  constructor(private readonly field = "slug") {}

  transform(value: string): string {
    const slug = value.toLowerCase();
    if (slug.length > MAX_SLUG_LENGTH || !SLUG_PATTERN.test(slug)) {
      throw AppException.validation([{ field: this.field, code: "isSlug", message: "Küçük harf, rakam ve tireden oluşan geçerli bir adres olmalı." }]);
    }
    return slug;
  }
}
