import { ApiProperty } from "@nestjs/swagger";

/**
 * Bir görselin atfı (Wikimedia Commons görsellerinin çoğu CC BY / CC BY-SA: yazar adı, lisans ve kaynak bağlantısı
 * gösterilmek ZORUNDADIR). Web sitesi bunu rehber sayfalarının sonunda "Görsel atıfları" bloğunda gösterir; alanlar o
 * bloğun gösterdikleriyle aynıdır (`artist` → `author`, `licenseName`, `licenseUrl`, `sourceUrl`). Yalnız atıf gerektiren
 * görseller gelir: CC0, kamu malı ve atıf kaydı olmayan (harici) görseller listede yer almaz.
 */
export class ImageCreditDto {
  @ApiProperty({
    type: String,
    example: "https://wangoh.com/og/zagreb-29255640143-297b40ff.jpg",
    description: "Atfın ait olduğu görselin mutlak adresi; aynı yanıttaki `imageUrl` alanlarından biriyle (blogda `coverImage`) birebir aynıdır (eşleştirme anahtarı).",
  })
  imageUrl!: string;

  @ApiProperty({ type: String, nullable: true, example: "Nick Savchenko from Kiev, Ukraine", description: "Yazar / telif sahibi, kaynaktaki haliyle. Bazı kayıtlarda uzun ya da satır sonu içerebilir." })
  author!: string | null;

  @ApiProperty({ type: String, nullable: true, example: "CC BY-SA 2.0", description: "Lisansın görünen adı." })
  licenseName!: string | null;

  @ApiProperty({ type: String, nullable: true, example: "https://creativecommons.org/licenses/by-sa/2.0", description: "Lisans metninin adresi." })
  licenseUrl!: string | null;

  @ApiProperty({ type: String, example: "https://commons.wikimedia.org/wiki/File:Zagreb_(29255640143).jpg", description: "Kaynak sayfa (Wikimedia Commons dosya sayfası)." })
  sourceUrl!: string;
}
