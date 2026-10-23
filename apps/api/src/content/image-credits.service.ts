import { Inject, Injectable } from "@nestjs/common";
import { and, eq, inArray } from "drizzle-orm";
import { APP_CONFIG } from "../config/config.module.js";
import type { AppConfig } from "../config/env.js";
import { DATABASE, type Database } from "../db/client.js";
import { countryTravel, imageCredits } from "../db/schema/index.js";
import { CANONICAL_ASSETS_ORIGIN, imageUrl, isWebImagePath, webImagePathOf } from "./assets.js";
import type { ImageCreditDto } from "./dto/image-credit.dto.js";

/**
 * Görsel atıfları (CC BY / CC BY-SA lisansı yazar adı, lisans ve kaynak bağlantısını göstermeyi şart koşar). Kural web'in
 * `ImageCredits` bileşeniyle aynıdır: sayfada gösterilen görsellerin yolları tekilleştirilir (ilk geçiş sırası korunur),
 * kaydı olanların yalnız `attributionRequired` olanları döner. Kaydı olmayan görsel (harici https adresi, CC0, kamu malı)
 * boş dizi demektir. Liste uçları atıf taşımaz; yalnız ayrıntı yanıtları çağırır.
 */
@Injectable()
export class ImageCreditsService {
  /** Web adresi olarak tanınan kaynaklar (blog kapak adreslerini web görsel yoluna çevirirken). */
  private readonly origins: readonly string[];

  constructor(
    @Inject(DATABASE) private readonly db: Database,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {
    this.origins = [...new Set([originOf(config.assetsBaseUrl), CANONICAL_ASSETS_ORIGIN])];
  }

  /**
   * İçerik (seyahat ülkesi) var ama atıf tablosu boş mu? Yükseltmede tohum çalıştırılmazsa atıflar sessizce boş döner; bu,
   * lisans gereği gösterilmesi gereken bilginin eksik kalması demektir, bu yüzden açılışta uyarılır (`ContentModule`).
   */
  async isMissing(): Promise<boolean> {
    const [credit] = await this.db.select({ image: imageCredits.image }).from(imageCredits).limit(1);
    if (credit) return false;
    const [travel] = await this.db.select({ code: countryTravel.countryCode }).from(countryTravel).limit(1);
    return travel !== undefined;
  }

  /**
   * Veritabanındaki görsel yolları (`cities.image`, `country_travel.image`: `/images/<ad>.avif`) için gösterilmesi gereken
   * atıflar. Girdi sırası korunur, tekrarlar atılır; `null`/boş ve web yolu olmayan değerler yok sayılır.
   */
  async forImages(images: ReadonlyArray<string | null | undefined>): Promise<ImageCreditDto[]> {
    const wanted = [...new Set(images.filter((image): image is string => typeof image === "string" && isWebImagePath(image)))];
    if (wanted.length === 0) return [];
    const rows = await this.db
      .select({
        image: imageCredits.image,
        author: imageCredits.author,
        licenseName: imageCredits.licenseName,
        licenseUrl: imageCredits.licenseUrl,
        sourceUrl: imageCredits.sourceUrl,
      })
      .from(imageCredits)
      .where(and(inArray(imageCredits.image, wanted), eq(imageCredits.attributionRequired, true)));
    const byImage = new Map(rows.map((row) => [row.image, row]));
    return wanted.flatMap((image) => {
      const row = byImage.get(image);
      return row
        ? [{ imageUrl: imageUrl(this.config.assetsBaseUrl, image)!, author: row.author, licenseName: row.licenseName, licenseUrl: row.licenseUrl, sourceUrl: row.sourceUrl }]
        : [];
    });
  }

  /**
   * Blog kapağı: mutlak kapak adresi bir web görseline (`<kaynak>/og/<ad>.jpg`) işaret ediyorsa onun atfı; aksi halde boş dizi.
   * Atfın `imageUrl`ı yazının `coverImage` değeridir (istemci ikisini birebir eşleştirir).
   */
  async forCoverUrl(coverImage: string | null | undefined): Promise<ImageCreditDto[]> {
    const path = webImagePathOf(coverImage, this.origins);
    if (!path || !coverImage) return [];
    return (await this.forImages([path])).map((credit) => ({ ...credit, imageUrl: coverImage }));
  }
}

function originOf(base: string): string {
  try {
    return new URL(base).origin;
  } catch {
    return base;
  }
}
