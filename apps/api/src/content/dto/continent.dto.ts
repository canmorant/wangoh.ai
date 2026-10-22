import { ApiProperty } from "@nestjs/swagger";
import { LANGS, type Lang } from "../../common/lang.js";
import { CONTINENT_SLUGS, type ContinentSlug } from "../content.constants.js";

export class ContinentDto {
  @ApiProperty({ enum: CONTINENT_SLUGS, example: "europe" })
  slug!: ContinentSlug;

  @ApiProperty({ type: "integer", description: "Gösterim sırası (0'dan)." })
  position!: number;

  @ApiProperty({ type: String, example: "Avrupa" })
  name!: string;

  @ApiProperty({ enum: LANGS, description: "Gerçekte sunulan dil. İstenen dil yok ya da tam değilse `tr`." })
  lang!: Lang;

  @ApiProperty({ type: Boolean, description: "İstenen dil tam olarak sunuldu mu? `false` ise Türkçeye düşülmüştür." })
  complete!: boolean;

  @ApiProperty({ type: "integer", description: "Kıtadaki ülke sayısı." })
  countryCount!: number;

  @ApiProperty({ type: "integer", description: "Seyahat içeriği (`hasTravel`) olan ülke sayısı." })
  travelCountryCount!: number;
}
