import { useQueryClient } from "@tanstack/react-query";
import { getScoresListQueryKey, scoresList, useScoresDelete, type AdminScoreDto, type ScoresListParams } from "@wangoh/api-client";
import { memo, useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { getErrorMessage } from "@/api/errors";
import { colors, screenPadding, spacing } from "@/theme";
import { Badge, Button, Card, Chip, Text } from "@/ui";

import { FilterChips } from "../../blog/components/FilterChips";
import { formatDateTimeTr } from "../../blog/format";
import { usePagedQuery } from "../../blog/usePagedQuery";
import { Banner } from "../components/Banner";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { PagedList } from "../components/PagedList";
import { invalidateScores } from "../invalidate";
import { DURATION_PRESETS, GAME_TYPES, formatDuration, gameTypeLabel, scoreSummary, type GameTypeValue } from "../scoreRules";

const PAGE_SIZE = 20;

const GAME_OPTIONS = GAME_TYPES.map((value) => ({ value, label: gameTypeLabel(value) }));
const DURATION_OPTIONS = DURATION_PRESETS.filter((preset) => preset.value !== undefined).map((preset) => ({
  value: String(preset.value),
  label: preset.label,
}));

interface ScoreRowProps {
  score: AdminScoreDto;
  onDelete: (score: AdminScoreDto) => void;
}

const ScoreRow = memo(function ScoreRow({ score, onDelete }: ScoreRowProps) {
  const summary = scoreSummary(score.score, score.correctCount, score.roundsTotal);
  const duration = formatDuration(score.durationMs);
  const label = [score.displayName, gameTypeLabel(score.gameType), summary, `süre ${duration}`, score.userDisabled ? "devre dışı kullanıcı" : null].filter(Boolean).join(", ");
  return (
    <Card accessibilityLabel={label} testID={`score-row-${score.id}`}>
      <View style={styles.row}>
        <View style={styles.top}>
          <Text variant="bodyStrong" numberOfLines={1} style={styles.name}>
            {score.displayName}
          </Text>
          <Badge label={gameTypeLabel(score.gameType)} />
        </View>
        <Text variant="small" color="textSecondary">
          {summary}
        </Text>
        <View style={styles.meta}>
          <Text variant="small" style={{ color: score.durationMs <= 5_000 ? colors.danger : colors.textSecondary }}>
            Süre: {duration}
          </Text>
          <Text variant="caption" color="textMuted">
            {formatDateTimeTr(score.createdAt)}
          </Text>
          {score.userDisabled ? <Badge label="Devre dışı kullanıcı" tone="danger" /> : null}
        </View>
        <View style={styles.actions}>
          <Button
            title="Puanı sil"
            size="sm"
            variant="ghost"
            onPress={() => onDelete(score)}
            accessibilityLabel={`${score.displayName} kullanıcısının ${score.score} puanlık skorunu sil`}
          />
        </View>
      </View>
    </Card>
  );
});

export interface ScoresSectionProps {
  /** Kullanıcı ayrıntısından gelen kullanıcı süzgeci. */
  userId?: string;
  onClearUser: () => void;
}

/**
 * Skorlar: oyun türü, “şüpheli” (çok kısa süre) ve kullanıcı süzgeçleri, sayfalı liste, onaylı silme.
 * Hile incelemesi içindir; `maxDurationMs` insan için imkânsız hızdaki oyunları bulur.
 */
export function ScoresSection({ userId, onClearUser }: ScoresSectionProps) {
  const queryClient = useQueryClient();
  const [gameType, setGameType] = useState<GameTypeValue | null>(null);
  const [maxDuration, setMaxDuration] = useState<string | null>(null);
  const [target, setTarget] = useState<AdminScoreDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const remove = useScoresDelete();

  const params = useMemo<ScoresListParams>(
    () => ({
      pageSize: PAGE_SIZE,
      ...(gameType ? { gameType } : {}),
      ...(maxDuration ? { maxDurationMs: Number(maxDuration) } : {}),
      ...(userId ? { userId } : {}),
    }),
    [gameType, maxDuration, userId],
  );
  const feed = usePagedQuery<AdminScoreDto>({
    queryKey: getScoresListQueryKey(params),
    fetchPage: (page, signal) => scoresList({ ...params, page }, { signal }),
    keepPrevious: true,
    staleTime: 0,
  });

  const confirmDelete = useCallback(async () => {
    if (!target) return;
    setError(null);
    setNotice(null);
    try {
      await remove.mutateAsync({ id: target.id });
      await invalidateScores(queryClient);
      setNotice(`${target.displayName} kullanıcısının ${target.score} puanlık skoru silindi.`);
    } catch (caught) {
      const status = (caught as { status?: unknown } | null)?.status;
      setError(status === 404 ? "Skor bulunamadı; zaten silinmiş olabilir." : getErrorMessage(caught, "Skor silinemedi."));
    } finally {
      setTarget(null);
    }
  }, [queryClient, remove, target]);

  const renderItem = useCallback((score: AdminScoreDto) => <ScoreRow score={score} onDelete={setTarget} />, []);
  const clear = useCallback(() => {
    setGameType(null);
    setMaxDuration(null);
    onClearUser();
  }, [onClearUser]);

  return (
    <View style={styles.fill}>
      <View style={styles.filters}>
        <FilterChips options={GAME_OPTIONS} value={gameType} onChange={setGameType} allLabel="Tüm oyunlar" accessibilityLabel="Oyun türüne göre süz" />
        <FilterChips options={DURATION_OPTIONS} value={maxDuration} onChange={setMaxDuration} allLabel="Tüm süreler" accessibilityLabel="Şüpheli oyun süzgeci: süreye göre" />
        {userId ? <Chip label="Seçili kullanıcıya göre süzüldü ✕" selected onPress={onClearUser} accessibilityHint="Kullanıcı süzgecini kaldırır" /> : null}
        {notice ? <Banner tone="success" message={notice} testID="scores-notice" /> : null}
        {error ? <Banner message={error} testID="scores-error" /> : null}
      </View>
      <PagedList
        feed={feed}
        renderItem={renderItem}
        filtered={gameType !== null || maxDuration !== null || Boolean(userId)}
        onClearFilters={clear}
        emptyIcon="trophy-outline"
        emptyTitle="Henüz skor yok"
        emptyMessage="Oyuncular oyun bitirdikçe skorları burada listelenir."
        errorTitle="Skorlar yüklenemedi"
        skeletonLabel="Skorlar yükleniyor"
        skeletonHeight={130}
        noun="skor"
      />
      <ConfirmDialog
        visible={target !== null}
        title="Puan silinsin mi?"
        message={
          target
            ? `${target.displayName} · ${gameTypeLabel(target.gameType)} · ${target.score} puan (${formatDuration(target.durationMs)}). Liderlik ve istatistikler anında değişir; aynı oyun oturumu yeniden puan yazamaz. Bu işlem geri alınamaz.`
            : ""
        }
        confirmLabel="Puanı sil"
        destructive
        loading={remove.isPending}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setTarget(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  filters: { gap: spacing.xs, paddingHorizontal: screenPadding, paddingBottom: spacing.sm },
  row: { gap: spacing.xs },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
  name: { flex: 1 },
  meta: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, alignItems: "center" },
  actions: { flexDirection: "row", justifyContent: "flex-end" },
});
