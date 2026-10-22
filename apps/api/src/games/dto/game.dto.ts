import { ApiProperty } from "@nestjs/swagger";
import { GAME_STATUSES, GAME_TYPES, type GameStatus, type GameType } from "../../db/schema/enums.js";

const GAME_TYPE_PROPERTY = { enum: GAME_TYPES, enumName: "GameType" } as const;

/**
 * Soru görünümü. Hedefin kodu, koordinatı ya da doğru seçeneği BURADA YOKTUR (bayrak sorusunda bayrağın
 * kendisi sorudur; adres/emoji sorunun parçasıdır).
 */
export class GameQuestionDto {
  @ApiProperty({ type: String, nullable: true, example: "🇫🇷", description: "Emoji bayrak. Yalnız `flag-quiz` sorusunda dolu." })
  flag!: string | null;

  @ApiProperty({ type: String, nullable: true, example: "https://wangoh.com/flags/fr.svg", description: "Bayrak görseli (SVG). Yalnız `flag-quiz` sorusunda dolu." })
  flagUrl!: string | null;

  @ApiProperty({ type: String, nullable: true, example: "Fransa", description: "Sorulan ülkenin adı (`capital-quiz` ve `map-guess`), istenen dilde." })
  countryName!: string | null;
}

export class GameOptionDto {
  @ApiProperty({ type: String, example: "FR", description: "Seçenek kimliği = ülke kodu. Cevap olarak bu değer gönderilir." })
  id!: string;

  @ApiProperty({ type: String, example: "Paris", description: "Gösterilecek metin: `flag-quiz` için ülke adı, `capital-quiz` için başkent." })
  label!: string;
}

export class GameRoundDto {
  @ApiProperty({ type: "integer", minimum: 0, description: "0 tabanlı tur numarası. Cevap gönderirken `roundIndex` olarak aynen yollanır." })
  index!: number;

  @ApiProperty({ type: () => GameQuestionDto })
  question!: GameQuestionDto;

  @ApiProperty({ type: () => [GameOptionDto], nullable: true, description: "Çoktan seçmeli oyunlarda 4 seçenek; `map-guess`te null (haritada nokta işaretlenir)." })
  options!: GameOptionDto[] | null;

  @ApiProperty({ type: "integer", example: 20000, description: "Tur süresi (ms). Sunucu süreyi kendi ölçer; bu süre ve 3 sn ağ payı aşılırsa cevap 0 puan sayılır." })
  timeLimitMs!: number;

  @ApiProperty({ type: String, format: "date-time", description: "Turun başladığı an (sunucu saati)." })
  startedAt!: string;

  @ApiProperty({ type: String, format: "date-time", description: "`startedAt + timeLimitMs`. Bu andan sonra gelen cevap yine 3 sn'ye kadar kabul edilir ama hız bonusu almaz." })
  deadlineAt!: string;
}

export class StartSessionResponseDto {
  @ApiProperty({ type: String, format: "uuid" })
  sessionId!: string;

  @ApiProperty(GAME_TYPE_PROPERTY)
  gameType!: GameType;

  @ApiProperty({ type: "integer", example: 10 })
  roundsTotal!: number;

  @ApiProperty({ type: String, format: "date-time", description: "Oturumun son geçerlilik anı (başlangıç + 30 dk)." })
  expiresAt!: string;

  @ApiProperty({ type: () => GameRoundDto, description: "İlk tur." })
  round!: GameRoundDto;
}

export class RoundResultDto {
  @ApiProperty({ type: "integer", minimum: 0 })
  index!: number;

  @ApiProperty({ type: Boolean })
  correct!: boolean;

  @ApiProperty({ type: "integer" })
  points!: number;

  @ApiProperty({ type: Boolean })
  timedOut!: boolean;
}

export class GameSessionDto {
  @ApiProperty({ type: String, format: "uuid" })
  sessionId!: string;

  @ApiProperty(GAME_TYPE_PROPERTY)
  gameType!: GameType;

  @ApiProperty({ enum: GAME_STATUSES, enumName: "GameStatus", description: "Süresi dolmuş oturum bu istekte `expired` olarak işaretlenir." })
  status!: GameStatus;

  @ApiProperty({ type: "integer" })
  roundsTotal!: number;

  @ApiProperty({ type: "integer", minimum: 0, description: "Cevap bekleyen turun numarası; tüm turlar cevaplandıysa `roundsTotal`." })
  currentRound!: number;

  @ApiProperty({ type: "integer", description: "Şimdiye kadarki toplam puan." })
  score!: number;

  @ApiProperty({ type: "integer" })
  correctCount!: number;

  @ApiProperty({ type: String, format: "date-time" })
  startedAt!: string;

  @ApiProperty({ type: String, format: "date-time" })
  expiresAt!: string;

  @ApiProperty({ type: String, format: "date-time", nullable: true })
  finishedAt!: string | null;

  @ApiProperty({ type: () => GameRoundDto, nullable: true, description: "Devam eden oturumda cevap bekleyen tur; aksi halde null. Doğru cevap hiçbir zaman dönmez." })
  round!: GameRoundDto | null;

  @ApiProperty({ type: () => [RoundResultDto], description: "Cevaplanmış turların özeti (doğru cevap içermez)." })
  results!: RoundResultDto[];
}

export class CorrectAnswerDto {
  @ApiProperty({ type: String, example: "FR", description: "Doğru ülkenin kodu." })
  code!: string;

  @ApiProperty({ type: String, example: "Paris", description: "Gösterim metni: ülke adı (`flag-quiz`, `map-guess`) ya da başkent (`capital-quiz`)." })
  label!: string;

  @ApiProperty({ type: "number", nullable: true, description: "Yalnız `map-guess`: hedef enlem." })
  lat!: number | null;

  @ApiProperty({ type: "number", nullable: true, description: "Yalnız `map-guess`: hedef boylam." })
  lng!: number | null;
}

export class AnswerResponseDto {
  @ApiProperty({ type: Boolean, description: "`map-guess`te tur puanı ≥ 500 ise (≈ 880 km içi) doğru sayılır." })
  correct!: boolean;

  @ApiProperty({ type: () => CorrectAnswerDto, description: "Cevaplanan turun doğru cevabı (yalnız bu turunki; sonraki turlar sır kalır)." })
  correctAnswer!: CorrectAnswerDto;

  @ApiProperty({ type: "integer", description: "Bu turun puanı." })
  points!: number;

  @ApiProperty({ type: "integer", description: "Oturumun şimdiye kadarki toplam puanı." })
  score!: number;

  @ApiProperty({ type: Boolean, description: "Süre (20 sn + 3 sn ağ payı) aşıldı: 0 puan, `correct: false`." })
  timedOut!: boolean;

  @ApiProperty({ type: "integer", description: "Çoktan seçmeli: hız bonusu (0-50). `map-guess`te 0." })
  speedBonus!: number;

  @ApiProperty({ type: "integer", description: "Çoktan seçmeli: seri bonusu (0-50). `map-guess`te 0." })
  streakBonus!: number;

  @ApiProperty({ type: "integer", description: "Bu turdan sonraki art arda doğru sayısı (çoktan seçmeli)." })
  streak!: number;

  @ApiProperty({ type: "integer", nullable: true, description: "Yalnız `map-guess`: tahmin ile hedef arasındaki uzaklık (km, tam sayıya yuvarlanmış)." })
  distanceKm!: number | null;

  @ApiProperty({ type: () => GameRoundDto, nullable: true, description: "Sonraki tur; son turdan sonra null (oyunu `finish` ile bitirin)." })
  nextRound!: GameRoundDto | null;
}

export class FinishResponseDto {
  @ApiProperty({ type: String, format: "uuid" })
  sessionId!: string;

  @ApiProperty({ type: String, format: "uuid", description: "Kaydedilen puan satırının kimliği." })
  scoreId!: string;

  @ApiProperty(GAME_TYPE_PROPERTY)
  gameType!: GameType;

  @ApiProperty({ type: "integer" })
  score!: number;

  @ApiProperty({ type: "integer" })
  correctCount!: number;

  @ApiProperty({ type: "integer" })
  roundsTotal!: number;

  @ApiProperty({ type: "integer", description: "Sunucunun ölçtüğü toplam oyun süresi (ms)." })
  durationMs!: number;

  @ApiProperty({ type: "integer", minimum: 1, description: "Tüm zamanlar liderliğinde sıranız (en iyi puanınıza göre; eşit puan aynı sıra)." })
  rank!: number;

  @ApiProperty({ type: "integer", description: "Bu oyun türündeki en iyi puanınız." })
  personalBest!: number;

  @ApiProperty({ type: Boolean, description: "Bu oyun, öncekilerin hepsinden yüksek mi (ilk oyun da true)." })
  isPersonalBest!: boolean;
}

/** Cevap gövdesindeki konum. */
export class MapPointDto {
  @ApiProperty({ type: "number", minimum: -90, maximum: 90 })
  lat!: number;

  @ApiProperty({ type: "number", minimum: -180, maximum: 180 })
  lng!: number;
}

