import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { isNetworkError } from "@/api/errors";
import { AuthGate, useAuth } from "@/auth";
import { WorldMap } from "@/features/games/map";
import { colors, radius, screenPadding, spacing } from "@/theme";
import { Badge, Button, EmptyState, Header, Icon, LoadingView, Screen, Text } from "@/ui";

import { ConfirmDialog } from "./components/ConfirmDialog";
import { CountdownBar } from "./components/CountdownBar";
import { FeedbackPanel } from "./components/FeedbackPanel";
import { NextRoundNotice } from "./components/NextRoundNotice";
import { OptionButton } from "./components/OptionButton";
import { ProgressSteps } from "./components/ProgressSteps";
import { QuestionCard } from "./components/QuestionCard";
import { StatusView } from "./components/StatusView";
import { useExitGuard, type ExitGuard } from "./hooks/useExitGuard";
import { usePlayGame, type PlayGame } from "./hooks/usePlayGame";
import { useScreenReaderEnabled } from "./hooks/useScreenReaderEnabled";
import { autoAdvanceDelay } from "./model/countdown";
import { feedbackCopy } from "./model/feedbackCopy";
import { endCopy, gameErrorMessage, isRetryable } from "./model/gameErrors";
import { GAME_INFO, firstParam, formatNumber, gameKindOf, isPlayableGameType, type PlayableGameType } from "./model/gameTypes";
import { monotonicNow } from "./model/monotonic";
import { isInProgress, type PlayState } from "./model/playMachine";
import { loadingMessage, optionViewFor, pointOf } from "./model/viewModel";
import { gamesRoutes, goBackOrHub } from "./routes";

/**
 * Geri bildirimden sonra otomatik ilerleme gecikmesi (ms); doğruda kısa, yanlışta cevabı okumaya yetecek kadar.
 * Sonraki turun sayacı sunucuda cevaptan 2 sn sonra (geri bildirim payı) başlar; gerçek gecikme `autoAdvanceDelay` ile bu payı
 * aşmayacak biçimde sınırlanır, yani oyuncu soruya geldiğinde süresi harcanmamış olur.
 */
const AUTO_ADVANCE_CORRECT_MS = 1400;
const AUTO_ADVANCE_WRONG_MS = 2000;
const MAP_HEIGHT = 300;

type RoundState = Extract<PlayState, { phase: "question" | "submitting" | "feedback" }>;

/**
 * Oyun ekranı: `/games/play/[gameType]`. Tür geçersizse "bulunamadı" durumu; oturum yoksa giriş çağrısı (AuthGate).
 * Çoktan seçmeli (bayrak, başkent) ve harita oyunu aynı oturum akışını kullanır.
 */
export function PlayScreen() {
  const params = useLocalSearchParams<{ gameType?: string | string[] }>();
  const router = useRouter();
  const { status, user } = useAuth();
  const gameType = firstParam(params.gameType);

  if (!isPlayableGameType(gameType)) {
    return (
      <Screen header={<Header title="Oyun bulunamadı" back={() => goBackOrHub(router)} />}>
        <EmptyState
          icon="help-circle-outline"
          title="Böyle bir oyun yok"
          message="Bağlantı eski ya da hatalı olabilir. Oyun merkezinden bir oyun seç."
          actionLabel="Oyun merkezi"
          onAction={() => router.dismissTo(gamesRoutes.hub)}
        />
      </Screen>
    );
  }

  if (status !== "signedIn" || !user) {
    return (
      <Screen header={<Header title={GAME_INFO[gameType].title} back={() => goBackOrHub(router)} />}>
        <AuthGate title="Oynamak için giriş yap" message="Puanların hesabına bağlı tutulur. Oyuna başlamak için önce giriş yapmalısın.">
          {null}
        </AuthGate>
      </Screen>
    );
  }

  return <PlayBody key={`${user.id}:${gameType}`} gameType={gameType} userId={user.id} />;
}

function PlayBody({ gameType, userId }: { gameType: PlayableGameType; userId: string }) {
  const router = useRouter();
  const game = usePlayGame(gameType, userId);
  const { state } = game;
  const guard = useExitGuard(isInProgress(state), game.leave);
  const info = GAME_INFO[gameType];
  const goHub = () => goBackOrHub(router);

  // Oyun bitip sonuç alınınca sonuç ekranına geç (geri tuşu oyuna değil merkeze döner).
  const doneId = state.phase === "done" ? state.sessionId : null;
  const { allowLeave } = guard;
  useEffect(() => {
    if (!doneId) return;
    allowLeave();
    router.replace(gamesRoutes.results(doneId));
  }, [doneId, allowLeave, router]);

  let content: ReactNode;
  switch (state.phase) {
    case "question":
    case "submitting":
    case "feedback":
      content = <RoundView state={state} game={game} guard={guard} />;
      break;
    case "failed": {
      const titles = { start: "Oyun başlatılamadı", restore: "Oyun yüklenemedi", finish: "Sonuç alınamadı" } as const;
      const offline = isNetworkError(state.error);
      content = (
        <Screen header={<Header title={info.title} back={goHub} />}>
          <StatusView
            icon={offline ? "cloud-offline-outline" : "alert-circle-outline"}
            tone="danger"
            title={offline ? "Bağlantı kurulamadı" : titles[state.action]}
            message={gameErrorMessage(state.error)}
            primary={{ label: "Tekrar dene", onPress: game.retry, testID: "retry-load" }}
            secondary={{ label: "Oyun merkezi", onPress: () => router.dismissTo(gamesRoutes.hub) }}
            testID="play-failed"
          />
        </Screen>
      );
      break;
    }
    case "ended": {
      const copy = endCopy(state.reason);
      content = (
        <Screen header={<Header title={info.title} back={goHub} />}>
          <StatusView
            icon={state.reason === "expired" ? "time-outline" : "information-circle-outline"}
            title={copy.title}
            message={copy.message}
            primary={{ label: "Yeni oyun", onPress: game.startNew, testID: "start-new" }}
            secondary={{ label: "Oyun merkezi", onPress: () => router.dismissTo(gamesRoutes.hub) }}
            testID="play-ended"
          />
        </Screen>
      );
      break;
    }
    default:
      content = (
        <Screen header={<Header title={info.title} back={goHub} />}>
          <LoadingView message={loadingMessage(state.phase)} />
        </Screen>
      );
  }

  return (
    <>
      {content}
      <ConfirmDialog
        visible={guard.dialogVisible}
        title="Oyundan çıkılsın mı?"
        message="Çıkarsan bu oyun terk edilir ve puanın kaydedilmez."
        confirmLabel="Çık"
        cancelLabel="Oyuna dön"
        onConfirm={() => void guard.confirmLeave()}
        onCancel={guard.cancelLeave}
        testID="confirm-exit"
      />
    </>
  );
}

function RoundView({ state, game, guard }: { state: RoundState; game: PlayGame; guard: ExitGuard }) {
  const { session, current, score, history } = state;
  const round = current.round;
  const kind = gameKindOf(session.gameType);
  const info = GAME_INFO[session.gameType];
  const feedback = state.phase === "feedback" ? state : null;
  const lastRound = feedback !== null && feedback.next === null;
  const scrollRef = useRef<ScrollView>(null);
  const [mapBusy, setMapBusy] = useState(false);
  const screenReader = useScreenReaderEnabled();

  // Geri bildirim ya da gönderim hatası görününce altına kaydır (panel, banner ve düğmesi görünür kalsın).
  const inFeedback = feedback !== null;
  const hasSubmitError = state.phase === "question" && state.error !== null;
  useEffect(() => {
    if (inFeedback || hasSubmitError) scrollRef.current?.scrollToEnd({ animated: true });
  }, [inFeedback, hasSubmitError]);

  // Çoktan seçmelide kısa gecikmeyle otomatik ilerle (sonraki turun sayacı başlamadan); ekran okuyucu açıksa kullanıcı "Devam" der.
  // Haritada otomatik ilerleme yok: oyuncu hedefi ve çizgiyi incelesin.
  const autoAdvanceMs = feedback ? (feedback.result.correct ? AUTO_ADVANCE_CORRECT_MS : AUTO_ADVANCE_WRONG_MS) : null;
  const nextTiming = feedback?.next?.timing ?? null;
  const { next } = game;
  useEffect(() => {
    if (!inFeedback || kind !== "choice" || screenReader || autoAdvanceMs === null) return;
    const timer = setTimeout(next, autoAdvanceDelay(autoAdvanceMs, nextTiming, monotonicNow()));
    return () => clearTimeout(timer);
  }, [inFeedback, kind, screenReader, autoAdvanceMs, nextTiming, round.index, next]);

  const answerPoint = state.phase === "question" ? pointOf(state.selection) : pointOf(state.answer);
  const targetPoint =
    feedback && feedback.result.correctAnswer.lat !== null && feedback.result.correctAnswer.lng !== null
      ? { lat: feedback.result.correctAnswer.lat, lng: feedback.result.correctAnswer.lng }
      : null;
  const copy = feedback ? feedbackCopy(kind, feedback.result, feedback.answer !== null) : null;

  const footer =
    kind === "map" && !feedback ? (
      <Button
        title="Onayla"
        fullWidth
        disabled={!answerPoint}
        loading={state.phase === "submitting"}
        onPress={game.confirm}
        accessibilityHint="Haritada işaretlediğin yeri cevap olarak gönderir"
        testID="map-confirm"
      />
    ) : feedback ? (
      <Button
        title={lastRound ? "Sonucu gör" : kind === "map" ? "Sonraki tur" : "Devam"}
        fullWidth
        onPress={game.next}
        testID="next-round"
      />
    ) : null;

  return (
    <Screen
      scroll={false}
      padded={false}
      header={
        <Header
          title={info.title}
          back={guard.requestExit}
          right={
            <View testID="score-badge">
              <Badge label={`${formatNumber(score)} puan`} tone="gold" />
            </View>
          }
        />
      }
    >
      <ScrollView
        ref={scrollRef}
        style={styles.flex}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={!mapBusy}
      >
        <ProgressSteps total={session.roundsTotal} history={history} currentIndex={round.index} testID="progress" />

        {feedback ? (
          feedback.next ? (
            // Sonraki turun sayacı geri bildirim payının (sunucu saati) sonunda başlar: o âna kadar çubuk dolu bekler, sonra azalır.
            <CountdownBar
              key={`next-${feedback.next.round.index}`}
              timing={feedback.next.timing}
              durationMs={feedback.next.round.timeLimitMs}
              label="Sonraki"
              testID="countdown-next"
            />
          ) : (
            <View style={styles.countdownSpacer} />
          )
        ) : (
          <CountdownBar
            key={round.index}
            timing={current.timing}
            durationMs={round.timeLimitMs}
            onExpire={game.timeUp}
            waitingLabel="Hazır"
            testID="countdown"
          />
        )}

        {state.phase === "question" && state.notice ? (
          <View style={styles.notice} accessibilityLiveRegion="polite" testID="sync-notice">
            <Icon name="information-circle" size={20} color="gold" />
            <Text variant="small" color="gold" style={styles.bannerText}>
              {state.notice}
            </Text>
          </View>
        ) : null}

        <QuestionCard gameType={session.gameType} question={round.question} />

        {kind === "choice" ? (
          <View style={styles.options} testID="options">
            {(round.options ?? []).map((option) => {
              const view = optionViewFor(state, option.id);
              return (
                <OptionButton
                  key={option.id}
                  label={option.label}
                  visual={view.visual}
                  chosen={view.chosen}
                  disabled={view.disabled}
                  onPress={() => game.choose(option.id)}
                  testID={`option-${option.id}`}
                />
              );
            })}
          </View>
        ) : (
          <View style={styles.mapWrap}>
            <WorldMap
              height={MAP_HEIGHT}
              guess={answerPoint}
              target={targetPoint}
              disabled={state.phase !== "question"}
              onSelect={game.select}
              onInteractionChange={setMapBusy}
              accessibilityLabel={`Dünya haritası. ${round.question.countryName ?? "Ülke"} için haritada bir yere dokunarak tahminini işaretle.`}
              testID="world-map"
            />
            {!feedback ? (
              <Text variant="small" color="textSecondary" align="center" testID="map-hint">
                {answerPoint ? "İşaretini değiştirmek için başka bir yere dokun, sonra Onayla." : "Haritaya dokunarak tahminini işaretle."}
              </Text>
            ) : null}
          </View>
        )}

        {state.phase === "question" && state.error !== null ? (
          <View style={styles.errorBanner} accessibilityRole="alert" accessibilityLiveRegion="assertive" testID="submit-error">
            <View style={styles.bannerHead}>
              <Icon name="alert-circle" size={20} color="danger" />
              <Text variant="bodyStrong" color="danger">
                Cevabın gönderilemedi
              </Text>
            </View>
            <Text variant="small" color="textSecondary">
              {gameErrorMessage(state.error)}
            </Text>
            {isRetryable(state.error) && state.selection !== null ? (
              <Button title="Tekrar dene" size="sm" variant="secondary" onPress={game.retrySubmit} testID="retry-submit" />
            ) : null}
          </View>
        ) : null}

        {copy && feedback ? <FeedbackPanel copy={copy} timedOut={feedback.result.timedOut} testID="feedback" /> : null}

        {feedback && feedback.next && kind === "map" ? (
          <NextRoundNotice key={`notice-${feedback.next.round.index}`} timing={feedback.next.timing} durationMs={feedback.next.round.timeLimitMs} testID="next-round-notice" />
        ) : null}
      </ScrollView>

      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  body: { padding: screenPadding, paddingBottom: spacing.xl, gap: spacing.md },
  options: { gap: spacing.md },
  mapWrap: { gap: spacing.sm },
  countdownSpacer: { height: 28 },
  footer: {
    paddingHorizontal: screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  notice: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.goldSoft,
  },
  bannerText: { flex: 1 },
  errorBanner: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.danger,
    backgroundColor: colors.dangerSoft,
  },
  bannerHead: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
});
