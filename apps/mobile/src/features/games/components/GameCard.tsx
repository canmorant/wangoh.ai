import { StyleSheet, View } from "react-native";

import { Badge, Button, Card, Icon, Text, type IconName } from "@/ui";
import { colors, radius, spacing } from "@/theme";

import { GAME_INFO, formatNumber, type PlayableGameType } from "../model/gameTypes";

const ICONS: Record<PlayableGameType, IconName> = {
  "flag-quiz": "flag",
  "capital-quiz": "business",
  "map-guess": "map",
};

export interface GameCardProps {
  gameType: PlayableGameType;
  /** İstatistik durumu: yükleniyor, hazır ya da alınamadı. */
  statsState: "loading" | "ready" | "error";
  bestScore: number | null;
  gamesPlayed: number;
  /** Devam eden oturum varsa tur bilgisi; yoksa null. */
  resume: { roundNumber: number | null; roundsTotal: number | null } | null;
  onPlay: () => void;
  onResume: () => void;
}

/** Oyun kartı: ad, açıklama, tur sayısı, kişisel en iyi ve eylemler (Oyna ya da Devam et / Yeni oyun). */
export function GameCard({ gameType, statsState, bestScore, gamesPlayed, resume, onPlay, onResume }: GameCardProps) {
  const info = GAME_INFO[gameType];

  let bestLabel: string;
  if (statsState === "loading") bestLabel = "Kişisel en iyi yükleniyor…";
  else if (statsState === "error") bestLabel = "Kişisel en iyi alınamadı";
  else if (bestScore === null || gamesPlayed === 0) bestLabel = "Henüz oynamadın";
  else bestLabel = `Kişisel en iyi: ${formatNumber(bestScore)}`;

  const resumeLabel =
    resume?.roundNumber && resume.roundsTotal ? `Devam eden oyun: Tur ${resume.roundNumber} / ${resume.roundsTotal}` : "Devam eden oyun var";

  return (
    <Card testID={`game-card-${gameType}`} style={styles.card}>
      <View style={styles.head}>
        <View style={styles.iconWrap}>
          <Icon name={ICONS[gameType]} size={28} color="gold" />
        </View>
        <View style={styles.headTexts}>
          <Text variant="heading">{info.title}</Text>
          <Text variant="small" color="textSecondary">
            {info.description}
          </Text>
        </View>
      </View>

      <View style={styles.meta}>
        <Badge label={`${info.rounds} tur`} />
        <Text variant="small" color={statsState === "error" ? "danger" : "textSecondary"} style={styles.best} testID={`best-${gameType}`}>
          {bestLabel}
        </Text>
      </View>

      {resume ? (
        <View style={styles.resume} accessibilityLiveRegion="polite">
          <Icon name="play-circle" size={20} color="gold" />
          <Text variant="small" color="gold" style={styles.resumeText} testID={`resume-info-${gameType}`}>
            {resumeLabel}
          </Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        {resume ? (
          <>
            <Button title="Devam et" fullWidth onPress={onResume} accessibilityLabel={`${info.title}: devam et`} testID={`resume-${gameType}`} />
            <Button
              title="Yeni oyun"
              variant="secondary"
              fullWidth
              onPress={onPlay}
              accessibilityLabel={`${info.title}: yeni oyun başlat`}
              accessibilityHint="Devam eden oyun terk edilir"
              testID={`play-${gameType}`}
            />
          </>
        ) : (
          <Button title="Oyna" fullWidth onPress={onPlay} accessibilityLabel={`${info.title}: oyna`} testID={`play-${gameType}`} />
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  head: { flexDirection: "row", gap: spacing.md },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.goldSoft,
  },
  headTexts: { flex: 1, gap: spacing.xs },
  meta: { flexDirection: "row", alignItems: "center", gap: spacing.md, flexWrap: "wrap" },
  best: { flexShrink: 1 },
  resume: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  resumeText: { flex: 1 },
  actions: { gap: spacing.sm },
});
