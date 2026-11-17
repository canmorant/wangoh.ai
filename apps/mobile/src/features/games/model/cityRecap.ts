/**
 * "Bu Şehir Neresi?" oyununda açıklanan şehirlerin oturum içi kaydı.
 *
 * Sunucu doğru şehri (adı, rehber adresi, fotoğrafın tam atfı) yalnız cevap yanıtında verir; oturum özeti bunları
 * taşımaz. Sonuç ekranı "bu oyundaki şehirler" listesini ve fotoğrafların atıflarını buradan çizer. Bellek içidir:
 * uygulama yeniden açılırsa önceki turlar bilinmez ve liste yalnız bilinenleri gösterir. Saf modül, birim testle denenir.
 */

import type { AnswerResponseDto, GameQuestionDto, ImageCreditDto } from "@wangoh/api-client";

export interface CityRecapEntry {
  /** 0 tabanlı tur numarası. */
  index: number;
  /** Şehrin gösterim adı (API'den). */
  label: string;
  countryCode: string;
  citySlug: string;
  correct: boolean;
  /** Soruda gösterilen fotoğraf ve (atıf gerekiyorsa) tam atfı. */
  imageUrl: string | null;
  credit: { author: string | null; licenseName: string | null; licenseUrl: string | null; sourceUrl: string } | null;
}

export interface CityRecap {
  /** Tur sırasıyla; kayıt yoksa boş dizi. */
  get(sessionId: string): CityRecapEntry[];
  /** Aynı tur yeniden eklenirse eskisinin yerini alır. */
  add(sessionId: string, entry: CityRecapEntry): void;
  clear(): void;
}

const MAX_SESSIONS = 20;

export function createCityRecap(maxSessions = MAX_SESSIONS): CityRecap {
  const sessions = new Map<string, CityRecapEntry[]>();
  return {
    get: (sessionId) => [...(sessions.get(sessionId) ?? [])],
    add: (sessionId, entry) => {
      const entries = (sessions.get(sessionId) ?? []).filter((e) => e.index !== entry.index);
      entries.push(entry);
      entries.sort((a, b) => a.index - b.index);
      sessions.delete(sessionId);
      sessions.set(sessionId, entries);
      while (sessions.size > maxSessions) {
        const oldest = sessions.keys().next().value;
        if (oldest === undefined) break;
        sessions.delete(oldest);
      }
    },
    clear: () => sessions.clear(),
  };
}

/** Uygulamanın tek kaydı. */
export const cityRecap = createCityRecap();

/**
 * Cevap yanıtından liste kaydı. Şehir oyunu dışındaki türlerde (rehber adresi yok) `null`.
 * Ad ve adres API'den olduğu gibi alınır; burada içerik üretilmez.
 */
export function recapEntryFrom(response: AnswerResponseDto, question: GameQuestionDto, index: number): CityRecapEntry | null {
  const answer = response.correctAnswer;
  if (!answer.countryCode || !answer.citySlug) return null;
  return {
    index,
    label: answer.label,
    countryCode: answer.countryCode,
    citySlug: answer.citySlug,
    correct: response.correct,
    imageUrl: question.imageUrl ?? null,
    credit: answer.imageCredit ?? null,
  };
}

/** Atıf gerektiren fotoğrafların, atıf bileşeninin (`ImageCredits`) beklediği biçimdeki listesi. */
export function recapCredits(entries: readonly CityRecapEntry[]): ImageCreditDto[] {
  return entries.flatMap((entry) =>
    entry.credit && entry.imageUrl
      ? [
          {
            imageUrl: entry.imageUrl,
            author: entry.credit.author,
            licenseName: entry.credit.licenseName,
            licenseUrl: entry.credit.licenseUrl,
            sourceUrl: entry.credit.sourceUrl,
          },
        ]
      : [],
  );
}
