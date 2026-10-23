import { useUsersMeScores, type ScoreDto } from "@wangoh/api-client";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { spacing } from "@/theme";
import { Button, Card, Divider, ListRow, SectionHeader, SkeletonList, Text } from "@/ui";

import { formatCorrect, formatDateTime, formatDuration, formatInteger, gameTypeLabel, hasMoreItems } from "../format";
import { SectionError } from "./SectionError";

export const SCORES_PAGE_SIZE = 10;

function ScoreRows({ items, firstPage }: { items: readonly ScoreDto[]; firstPage: boolean }) {
  return (
    <>
      {items.map((score, index) => {
        const details = `${formatCorrect(score.correctCount, score.roundsTotal)} · ${formatDuration(score.durationMs)}`;
        const label = gameTypeLabel(score.gameType);
        return (
          <View key={score.id}>
            {firstPage && index === 0 ? null : <Divider />}
            <View style={styles.row}>
              <ListRow
                title={label}
                subtitle={`${formatDateTime(score.createdAt)}\n${details}`}
                accessibilityLabel={`${label}, ${formatInteger(score.score)} puan. ${formatDateTime(score.createdAt)}. ${details}`}
                trailing={
                  <View style={styles.score}>
                    <Text variant="heading" color="gold">
                      {formatInteger(score.score)}
                    </Text>
                    <Text variant="caption" color="textSecondary">
                      puan
                    </Text>
                  </View>
                }
              />
            </View>
          </View>
        );
      })}
    </>
  );
}

/** İlk sayfadan sonraki sayfalar: her biri kendi sorgusunu yönetir (yükleniyor / hata / satırlar). */
function ExtraScoresPage({ page }: { page: number }) {
  const query = useUsersMeScores({ page, pageSize: SCORES_PAGE_SIZE });
  if (query.isPending) {
    return (
      <View style={styles.padded}>
        <SkeletonList count={2} itemHeight={64} label="Skorlar yükleniyor" />
      </View>
    );
  }
  if (query.isError) {
    return (
      <View style={styles.padded}>
        <SectionError error={query.error} title="Skorlar yüklenemedi" onRetry={() => void query.refetch()} retrying={query.isRefetching} />
      </View>
    );
  }
  return <ScoreRows items={query.data.items} firstPage={false} />;
}

/** Son skorlar: yeniden eskiye, sayfalı; "Daha fazla göster" bir sonraki sayfayı ekler. */
export function ScoresSection() {
  const [pages, setPages] = useState(1);
  const first = useUsersMeScores({ page: 1, pageSize: SCORES_PAGE_SIZE });

  let body;
  if (first.isPending) {
    body = <SkeletonList count={3} itemHeight={64} label="Skorlar yükleniyor" />;
  } else if (first.isError) {
    body = (
      <SectionError
        error={first.error}
        title="Skorlar yüklenemedi"
        onRetry={() => void first.refetch()}
        retrying={first.isRefetching}
        testID="profile-scores-error"
      />
    );
  } else if (first.data.total === 0) {
    body = (
      <Card testID="profile-scores-empty">
        <Text variant="small" color="textSecondary" align="center">
          Henüz kayıtlı skorun yok. Oynadığın oyunların puanları burada listelenir.
        </Text>
      </Card>
    );
  } else {
    const total = first.data.total;
    body = (
      <View style={styles.stack}>
        <Card padded={false} testID="profile-scores-list">
          <ScoreRows items={first.data.items} firstPage />
          {Array.from({ length: pages - 1 }, (_, index) => (
            <ExtraScoresPage key={index + 2} page={index + 2} />
          ))}
        </Card>
        {hasMoreItems(pages, SCORES_PAGE_SIZE, total) ? (
          <Button
            title="Daha fazla göster"
            variant="secondary"
            onPress={() => setPages((current) => current + 1)}
            accessibilityHint={`${formatInteger(total)} skorun ${formatInteger(Math.min(pages * SCORES_PAGE_SIZE, total))} tanesi gösteriliyor`}
            testID="profile-scores-more"
          />
        ) : null}
      </View>
    );
  }

  return (
    <View testID="profile-scores">
      <SectionHeader title="Son skorlarım" />
      {body}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: spacing.md },
  row: { paddingHorizontal: spacing.lg },
  padded: { padding: spacing.lg },
  score: { alignItems: "flex-end" },
});
