import type { AnswerImageCreditDto, GameQuestionDto } from "@wangoh/api-client";
import { Linking, Pressable, StyleSheet, View } from "react-native";

import { normalizeText, openSafeUrl, safeHttpUrl, SOURCE_LABEL } from "@/features/credits/creditRows";
import { RemoteImage, Text } from "@/ui";
import { colors, minTouchTarget, radius, spacing } from "@/theme";

import type { PlayableGameType } from "../model/gameTypes";

export interface QuestionCardProps {
  gameType: PlayableGameType;
  question: GameQuestionDto;
  /** Yalnız `city-photo`, cevap açıklandıktan sonra: fotoğrafın tam atfı (kaynak bağlantısıyla). */
  answerCredit?: AnswerImageCreditDto | null;
}

const PROMPTS: Record<PlayableGameType, string> = {
  "flag-quiz": "Bu bayrak hangi ülkeye ait?",
  "capital-quiz": "Bu ülkenin başkenti neresi?",
  "map-guess": "Haritada bu ülkeyi işaretle",
  // Rehberlerin bir kısmı şehir değil bölge, ada ya da milli parktır; soru bu yüzden "şehir" demez.
  "city-photo": "Burası neresi?",
};

/** API'nin şehir fotoğrafı oranı (1200×630). */
const PHOTO_ASPECT = 1200 / 630;

/**
 * Fotoğrafın atfı. Soru sırasında yalnız yazar ve lisans adı görünür: kaynak bağlantısı dosya adıyla şehri ele
 * verir, üstelik bağlantıya dokunmak oyuncuyu süre işlerken uygulamadan çıkarırdı. Cevap açıklanınca kaynak ve
 * lisans bağlantıları eklenir; fotoğrafların tam atıfları ayrıca sonuç ekranının sonunda listelenir.
 */
function PhotoCredit({ question, answerCredit }: { question: GameQuestionDto; answerCredit: AnswerImageCreditDto | null }) {
  const credit = answerCredit ?? question.imageCredit;
  if (!credit) return null;
  const author = normalizeText(credit.author);
  const license = normalizeText(credit.licenseName);
  const sourceUrl = answerCredit ? safeHttpUrl(answerCredit.sourceUrl) : null;
  const licenseUrl = answerCredit ? safeHttpUrl(answerCredit.licenseUrl) : null;
  const summary = ["Fotoğraf", author].filter(Boolean).join(": ");
  if (!author && !license) return null;
  return (
    <View style={styles.credit} testID="question-credit">
      <Text variant="small" color="textMuted" numberOfLines={2} style={styles.creditText}>
        {[summary, licenseUrl ? null : license].filter(Boolean).join(" · ")}
      </Text>
      {sourceUrl || licenseUrl ? (
        <View style={styles.creditLinks}>
          {sourceUrl ? (
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="Fotoğrafın kaynak sayfasını aç"
              onPress={() => openSafeUrl(sourceUrl, (url) => Linking.openURL(url))}
              style={styles.creditLink}
              testID="question-credit-source"
            >
              <Text variant="small" color="gold" style={styles.underline}>
                {SOURCE_LABEL}
              </Text>
            </Pressable>
          ) : null}
          {licenseUrl && license ? (
            <Pressable
              accessibilityRole="link"
              accessibilityLabel={`${license} lisans metnini aç`}
              onPress={() => openSafeUrl(licenseUrl, (url) => Linking.openURL(url))}
              style={styles.creditLink}
              testID="question-credit-license"
            >
              <Text variant="small" color="gold" style={styles.underline}>
                {license}
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

/**
 * Soru kartı. Bayrak için önce API'nin verdiği emoji gösterilir (ağ beklemez; süre sunucuda işlerken
 * görsel yüklemesi oyuncunun süresinden yemesin), emoji yoksa `flagUrl` görseli kullanılır.
 * Ülke adı ve bayrak API'den gelir; burada içerik verisi tutulmaz.
 */
export function QuestionCard({ gameType, question, answerCredit = null }: QuestionCardProps) {
  const prompt = PROMPTS[gameType];

  if (gameType === "city-photo") {
    return (
      <View style={[styles.card, styles.photoCard]} testID="question-card">
        <Text variant="label" color="textSecondary" align="center">
          {prompt}
        </Text>
        <View style={styles.photo} testID="question-photo">
          <RemoteImage uri={question.imageUrl} alt="Tahmin edilecek yerin fotoğrafı" aspectRatio={PHOTO_ASPECT} />
        </View>
        <PhotoCredit question={question} answerCredit={answerCredit} />
      </View>
    );
  }

  if (gameType === "flag-quiz") {
    return (
      <View style={styles.card} testID="question-card">
        <Text variant="label" color="textSecondary" align="center">
          {prompt}
        </Text>
        {question.flag ? (
          <Text
            style={styles.emoji}
            allowFontScaling={false}
            accessibilityRole="image"
            testID="question-flag"
          >
            {question.flag}
          </Text>
        ) : question.flagUrl ? (
          <RemoteImage uri={question.flagUrl} alt="Bayrak" width={192} aspectRatio={3 / 2} contentFit="contain" />
        ) : (
          <Text variant="body" color="textSecondary" align="center">
            Bayrak yüklenemedi
          </Text>
        )}
      </View>
    );
  }

  const compact = gameType === "map-guess";
  return (
    <View style={[styles.card, compact && styles.compact]} testID="question-card">
      <Text variant="label" color="textSecondary" align="center">
        {prompt}
      </Text>
      <Text variant={compact ? "title" : "display"} align="center" testID="question-country">
        {question.countryName ?? "—"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  compact: { paddingVertical: spacing.md, gap: spacing.xs },
  photoCard: { paddingVertical: spacing.md, paddingHorizontal: spacing.md },
  photo: { alignSelf: "stretch" },
  credit: { alignSelf: "stretch", alignItems: "center", gap: spacing.xs },
  creditText: { textAlign: "center" },
  creditLinks: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  creditLink: { minHeight: minTouchTarget, minWidth: minTouchTarget, justifyContent: "center", alignItems: "center", paddingHorizontal: spacing.xs },
  underline: { textDecorationLine: "underline" },
  // Emoji satır yüksekliği yazı boyutundan küçük olursa Android'de kırpılır.
  emoji: { fontSize: 76, lineHeight: 92, textAlign: "center" },
});
