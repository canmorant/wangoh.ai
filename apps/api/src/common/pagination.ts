import { Type } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import type { Type as NestType } from "@nestjs/common";

export const MAX_PAGE_SIZE = 100;
export const DEFAULT_PAGE_SIZE = 20;

/** Sayfalı uçların ortak sorgu parametreleri: `?page=1&pageSize=20` (pageSize ≤ 100). */
export class PaginationQueryDto {
  @ApiPropertyOptional({ type: "integer", minimum: 1, default: 1, description: "Sayfa numarası (1'den başlar)." })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100_000)
  page: number = 1;

  @ApiPropertyOptional({ type: "integer", minimum: 1, maximum: MAX_PAGE_SIZE, default: DEFAULT_PAGE_SIZE, description: "Sayfa boyutu (en fazla 100)." })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_PAGE_SIZE)
  pageSize: number = DEFAULT_PAGE_SIZE;
}

/** `LIMIT`/`OFFSET` değerleri. */
export function pageWindow(query: Pick<PaginationQueryDto, "page" | "pageSize">): { limit: number; offset: number } {
  return { limit: query.pageSize, offset: (query.page - 1) * query.pageSize };
}

export interface Page<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

/** Ortak sayfa zarfını kurar: `{ items, page, pageSize, total }`. */
export function toPage<T>(items: T[], total: number, query: Pick<PaginationQueryDto, "page" | "pageSize">): Page<T> {
  return { items, page: query.page, pageSize: query.pageSize, total };
}

/**
 * Swagger için sayfalı yanıt sınıfı üretir. Kullanım:
 * `export class UserPageDto extends PaginatedDto(UserDto) {}` (alt sınıf adı şema adı olur).
 */
export function PaginatedDto<T>(Item: NestType<T>): NestType<Page<T>> {
  class PageDto implements Page<T> {
    @ApiProperty({ type: [Item] })
    items!: T[];
    @ApiProperty({ type: "integer", example: 1 })
    page!: number;
    @ApiProperty({ type: "integer", example: DEFAULT_PAGE_SIZE })
    pageSize!: number;
    @ApiProperty({ type: "integer", description: "Filtreyle eşleşen toplam kayıt sayısı.", example: 0 })
    total!: number;
  }
  return PageDto;
}
