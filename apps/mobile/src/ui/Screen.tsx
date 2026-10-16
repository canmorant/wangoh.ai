import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  type RefreshControlProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

import { colors, screenPadding } from "@/theme";

/** Alt kenarı sekme çubuğu karşılar; yerel başlık çubuğu kapalı olduğundan üst kenarı ekran karşılar. */
const DEFAULT_EDGES: readonly Edge[] = ["top", "left", "right"];

export interface ScreenProps {
  children: ReactNode;
  /** Kaydırma alanının üstünde sabit duran başlık (genellikle `<Header />`). */
  header?: ReactNode;
  /** `false`: kendi FlatList'ini kullanan ekranlar için; yalnız güvenli alan ve zemin sağlanır. */
  scroll?: boolean;
  /** İçerik yan boşluğu (varsayılan açık). */
  padded?: boolean;
  /** Güvenli alan kenarları. Sekmesiz (modal) ekranlarda alt kenar da eklenir: `["top", "bottom", "left", "right"]`. */
  edges?: readonly Edge[];
  /** Çek-yenile. Verilirse kaydırma alanına RefreshControl eklenir; dönen söz bitince gösterge kapanır. */
  onRefresh?: () => void | Promise<unknown>;
  /** Yenileme durumunu dışarıdan yönetmek için (ör. `query.isRefetching`). Verilmezse söz üzerinden izlenir. */
  refreshing?: boolean;
  /** Form ekranları: klavye açılınca içerik yukarı kayar. */
  keyboardAvoiding?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** `onRefresh` sözünü izleyip `refreshing` durumunu üretir. */
function useRefreshState(onRefresh: ScreenProps["onRefresh"], controlled: boolean | undefined) {
  const [internal, setInternal] = useState(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleRefresh = useCallback(async () => {
    if (!onRefresh) return;
    setInternal(true);
    try {
      await onRefresh();
    } catch {
      // Hata gösterimi çağıranın işi (sorgu hata durumu); gösterge yine de kapanmalı.
    } finally {
      if (mounted.current) setInternal(false);
    }
  }, [onRefresh]);

  return { refreshing: controlled ?? internal, handleRefresh };
}

/** Marka renginde çek-yenile göstergesi; Screen dışındaki FlatList'ler de kullanabilir. */
export function ThemedRefreshControl(props: RefreshControlProps) {
  return (
    <RefreshControl
      tintColor={colors.gold}
      colors={[colors.gold]}
      progressBackgroundColor={colors.surfaceRaised}
      {...props}
    />
  );
}

export function Screen({
  children,
  header,
  scroll = true,
  padded = true,
  edges = DEFAULT_EDGES,
  onRefresh,
  refreshing,
  keyboardAvoiding = false,
  contentContainerStyle,
  style,
  testID,
}: ScreenProps) {
  const refresh = useRefreshState(onRefresh, refreshing);

  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.grow, padded && styles.padded, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? <ThemedRefreshControl refreshing={refresh.refreshing} onRefresh={refresh.handleRefresh} /> : undefined
      }
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, padded && styles.padded, contentContainerStyle]}>{children}</View>
  );

  const content = (
    <>
      {header}
      {body}
    </>
  );

  return (
    <SafeAreaView edges={edges} style={[styles.root, style]} testID={testID}>
      {keyboardAvoiding ? (
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  grow: { flexGrow: 1 },
  padded: { paddingHorizontal: screenPadding, paddingBottom: screenPadding },
});
