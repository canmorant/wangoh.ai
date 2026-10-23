import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import {
  getLeaderboardsGetQueryKey,
  getLeaderboardsMeQueryKey,
  useLeaderboardsGet,
  useLeaderboardsMe,
  type LeaderboardEntryDto,
} from "@wangoh/api-client";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { useAuth } from "@/auth";
import { colors, screenPadding, spacing } from "@/theme";
import { Chip, EmptyState, ErrorState, Header, Screen, SkeletonList, Text, ThemedRefreshControl } from "@/ui";

import { LeaderboardRow } from "./components/LeaderboardRow";
import { MyRankCard } from "./components/MyRankCard";
import { emptyLeaderboardMessage, rankSummary } from "./model/feedbackCopy";
import {
  LEADERBOARD_LIMIT,
  LEADERBOARD_PERIODS,
  LEADERBOARD_PERIOD_DESCRIPTIONS,
  LEADERBOARD_PERIOD_LABELS,
  LEADERBOARD_TYPES,
  LEADERBOARD_TYPE_LABELS,
  LEADERBOARD_TYPE_TITLES,
  firstParam,
  formatNumber,
  isLeaderboardType,
  type LeaderboardPeriodKey,
  type LeaderboardTypeKey,
} from "./model/gameTypes";
import { gamesRoutes, goBackOrHub } from "./routes";

/** Liste sorgusu bu süre içinde yeniden istenmez; çek-yenile ve oyun bitişi (invalidate) yine tazeler. */
const BOARD_STALE_MS = 15_000;

/** Liderlik tablosu: `/games/leaderboard/[gameType]` (flag-quiz | capital-quiz | map-guess | overall). Herkese açıktır. */
export function LeaderboardScreen() {
  const params = useLocalSearchParams<{ gameType?: string | string[] }>();
  const router = useRouter();
  const type = firstParam(params.gameType);

  if (!isLeaderboardType(type)) {
    return (
      <Screen header={<Header title="Liderlik" back={() => goBackOrHub(router)} />}>
        <EmptyState
          icon="help-circle-outline"
          title="Böyle bir liderlik tablosu yok"
          message="Bağlantı eski ya da hatalı olabilir."
          actionLabel="Genel liderlik"
          onAction={() => router.replace(gamesRoutes.leaderboard("overall"))}
        />
      </Screen>
    );
  }
  return <LeaderboardBody type={type} />;
}

function LeaderboardBody({ type }: { type: LeaderboardTypeKey }) {
  const router = useRouter();
  const pathname = usePathname();
  const { status, user } = useAuth();
  const signedIn = status === "signedIn" && user !== null;
  const [period, setPeriod] = useState<LeaderboardPeriodKey>("all");
  const [refreshing, setRefreshing] = useState(false);

  // Anahtara görüntüleyen eklenir: girişsiz önbellekteki liste (isMe hep false) girişten sonra gösterilmesin.
  const viewer = signedIn ? user.id : "anon";
  const boardParams = { period, limit: LEADERBOARD_LIMIT };
  const board = useLeaderboardsGet(type, boardParams, {
    query: { staleTime: BOARD_STALE_MS, queryKey: [...getLeaderboardsGetQueryKey(type, boardParams), viewer] },
  });
  const me = useLeaderboardsMe(
    type,
    { period },
    { query: { enabled: signedIn, staleTime: BOARD_STALE_MS, queryKey: [...getLeaderboardsMeQueryKey(type, { period }), viewer] } },
  );
  const { refetch: refetchBoard } = board;
  const { refetch: refetchMe } = me;

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchBoard(), signedIn ? refetchMe() : Promise.resolve()]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchBoard, refetchMe, signedIn]);

  const emptyAction = signedIn
    ? {
        label: type === "overall" ? "Oyun merkezi" : "Oyna",
        onPress: () => (type === "overall" ? router.dismissTo(gamesRoutes.hub) : router.push(gamesRoutes.play(type))),
      }
    : { label: "Giriş yap", onPress: () => router.push({ pathname: "/login", params: { returnTo: pathname } }) };

  const entries = board.data?.entries ?? [];

  const listHeader = (
    <View style={styles.headerBlock}>
      <View style={styles.chips} accessibilityRole="tablist" testID="type-chips">
        {LEADERBOARD_TYPES.map((key) => (
          <Chip
            key={key}
            label={LEADERBOARD_TYPE_LABELS[key]}
            selected={key === type}
            onPress={() => router.setParams({ gameType: key })}
            accessibilityHint={`${LEADERBOARD_TYPE_TITLES[key]} tablosunu gösterir`}
          />
        ))}
      </View>
      <View style={styles.chips} accessibilityRole="tablist" testID="period-chips">
        {LEADERBOARD_PERIODS.map((key) => (
          <Chip
            key={key}
            label={LEADERBOARD_PERIOD_LABELS[key]}
            selected={key === period}
            onPress={() => setPeriod(key)}
            accessibilityHint={`Dönem: ${LEADERBOARD_PERIOD_DESCRIPTIONS[key]}`}
          />
        ))}
      </View>
      {signedIn && me.data ? <MyRankCard summary={rankSummary(me.data, period)} /> : null}
      {board.data ? (
        <Text variant="small" color="textSecondary" testID="total-players">
          {formatNumber(board.data.totalPlayers)} oyuncu · {LEADERBOARD_PERIOD_DESCRIPTIONS[period]}
        </Text>
      ) : null}
    </View>
  );

  const listEmpty = board.isPending ? (
    <SkeletonList count={6} itemHeight={56} label="Liderlik tablosu yükleniyor" />
  ) : board.isError ? (
    <ErrorState error={board.error} onRetry={() => void refetchBoard()} retrying={board.isRefetching} />
  ) : (
    <EmptyState
      icon="trophy-outline"
      title="Henüz kimse yok"
      message={emptyLeaderboardMessage(period)}
      actionLabel={emptyAction.label}
      onAction={emptyAction.onPress}
    />
  );

  return (
    <Screen
      scroll={false}
      padded={false}
      header={<Header title={LEADERBOARD_TYPE_TITLES[type]} subtitle="Her oyuncunun en iyi tek oyunu" back={() => goBackOrHub(router)} />}
    >
      <FlatList<LeaderboardEntryDto>
        data={entries}
        keyExtractor={(entry, index) => `${entry.rank}-${index}`}
        renderItem={({ item }) => <LeaderboardRow entry={item} />}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
        contentContainerStyle={styles.list}
        refreshControl={<ThemedRefreshControl refreshing={refreshing} onRefresh={() => void refresh()} />}
        initialNumToRender={12}
        windowSize={7}
        showsVerticalScrollIndicator={false}
        testID="leaderboard-list"
      />
    </Screen>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: screenPadding, paddingBottom: spacing.xxl, flexGrow: 1 },
  headerBlock: { gap: spacing.md, paddingBottom: spacing.md },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  separator: { height: spacing.xs, backgroundColor: colors.transparent },
});
