import type { Type as NestType } from "@nestjs/common";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsObject, IsOptional, ValidateNested } from "class-validator";
import { IsOptionalNotNull } from "../../common/validators.js";

/**
 * Yönetici güncellemesinde dil başına çeviri yaması: `{ tr?: {...}, en?: {...} | null, es?: {...} | null }`.
 * Gönderilen alanlar o dildeki mevcut alanlarla BİRLEŞİR (gönderilmeyen korunur). `en`/`es` için `null` o dili siler;
 * Türkçe silinemez. Kullanım: `class XPatchDto extends TranslationsPatchDto(XFieldsDto) {}` (alt sınıf adı şema adı olur).
 */
export function TranslationsPatchDto<T>(Fields: NestType<T>): NestType<{ tr?: T; en?: T | null; es?: T | null }> {
  class Patch {
    @ApiPropertyOptional({ type: Fields, description: "Türkçe (kaynak) alanlar; silinemez." })
    @IsOptionalNotNull()
    @IsObject()
    @ValidateNested()
    @Type(() => Fields)
    tr?: T;

    @ApiPropertyOptional({ type: Fields, nullable: true, description: "İngilizce alanlar; `null` dili siler." })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => Fields)
    en?: T | null;

    @ApiPropertyOptional({ type: Fields, nullable: true, description: "İspanyolca alanlar; `null` dili siler." })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => Fields)
    es?: T | null;
  }
  return Patch;
}
