import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  View,
  type AccessibilityActionEvent,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type ViewStyle,
} from "react-native";
import Svg, { Circle, G, Line, Path, Polygon, Rect } from "react-native-svg";

import { colors, minTouchTarget, radius, spacing } from "@/theme";
import { Icon } from "@/ui";

import { describePointSpoken } from "./describePoint";
import { GestureTracker } from "./gestures";
import { graticuleLines, graticulePath } from "./graticule";
import { clampLatLng, roundCoord, sameLatLng, type LatLng } from "./projection";
import {
  MAX_SCALE,
  MIN_SCALE,
  ZOOM_STEP,
  centerOf,
  clampView,
  doubleTapView,
  fitView,
  fromScreen,
  hasArea,
  initialView,
  isInitialView,
  pathMatrix,
  sameView,
  toScreen,
  worldRect,
  zoomBy,
  type Point,
  type Size,
  type View as MapView,
} from "./viewport";
import { BORDER_PATH, LAND_PATH, WORLD_WIDTH } from "./worldPaths";

export interface WorldMapProps {
  /** Harita yüksekliği (genişlik ebeveynden gelir). Varsayılan 280. */
  height?: number;
  /** Kullanıcının işareti (altın). */
  guess?: LatLng | null;
  /** Cevap sonrası: hedef işaretçisi (yeşil) + tahminden hedefe kesikli çizgi; görünüm ikisini de gösterir. */
  target?: LatLng | null;
  /** Cevap sonrası seçim kapalı: dokunuş işaretlemez, gezinme (kaydırma/yakınlaştırma) çalışır. */
  disabled?: boolean;
  /** Dokunulan konum (enlem [-90, 90], boylam [-180, 180]; 4 ondalık). Kaydırma/kıstırma işaretlemez. */
  onSelect?: (p: LatLng) => void;
  accessibilityLabel?: string;
  /**
   * İsteğe bağlı: harita parmakla/fareyle kullanılırken true, bırakılınca false. Haritayı dikey kaydırılan bir
   * ekrana koyan ebeveyn, bu sürede kaydırmayı kapatır (iOS'ta ScrollView kaydırması JS'ten engellenemez).
   */
  onInteractionChange?: (active: boolean) => void;
  testID?: string;
}

const DEFAULT_LABEL = "Dünya haritası";
const ACTIONS = [
  { name: "zoomIn", label: "Yakınlaştır" },
  { name: "zoomOut", label: "Uzaklaştır" },
  { name: "reset", label: "Tüm dünyayı göster" },
];

/** Haritanın kenarlığı olmayan, sabit içerik: kara + sınırlar. Prop almaz; yeniden çizilmez (memo). */
const WorldLayer = memo(function WorldLayer() {
  return (
    <>
      <Path d={LAND_PATH} fill={colors.borderStrong} fillRule="evenodd" />
      {/* Sınır kalınlığı yol birimidir (1/20 derece): ölçekle büyür, 1x'te ince, 8x'te ~1 px. */}
      <Path d={BORDER_PATH} fill="none" stroke={colors.surface} strokeWidth={3} strokeLinejoin="round" />
    </>
  );
});

function isFiniteNumber(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

/** Dokunuşların kapsayıcıya göre konumları. Çocuklar pointerEvents "none" olduğundan hedef her zaman yüzeydir. */
function pointsOf(e: GestureResponderEvent): Point[] {
  const { touches, locationX, locationY } = e.nativeEvent;
  const list: Point[] = [];
  for (const t of touches ?? []) {
    if (isFiniteNumber(t.locationX) && isFiniteNumber(t.locationY)) list.push({ x: t.locationX, y: t.locationY });
  }
  if (list.length === 0 && isFiniteNumber(locationX) && isFiniteNumber(locationY)) list.push({ x: locationX, y: locationY });
  return list;
}

/** Kalkış konumu: kalkan parmak (changedTouches) ya da olayın kendi konumu; okunamazsa null. */
function releasePoint(e: GestureResponderEvent): Point | null {
  const { changedTouches, locationX, locationY } = e.nativeEvent;
  const t = changedTouches?.[0];
  if (t && isFiniteNumber(t.locationX) && isFiniteNumber(t.locationY)) return { x: t.locationX, y: t.locationY };
  if (isFiniteNumber(locationX) && isFiniteNumber(locationY)) return { x: locationX, y: locationY };
  return null;
}

/** Web'de tarayıcının kaydırma/yakınlaştırma jestini kapatır, fare imleci tutamaç olur. */
const webSurface = (Platform.OS === "web" ? { touchAction: "none", userSelect: "none", cursor: "grab" } : null) as ViewStyle | null;

/**
 * Dokunmatik dünya haritası (eşdikdörtgen izdüşüm). Yalnız sunum: API çağrısı yok.
 *
 * - Dokunma → `onSelect({lat, lng})`. Sürükleme/kıstırma/çift dokunma işaretlemez (hareket eşiği 10 px).
 * - Yakınlaştırma 1x–8x: +/- düğmeleri, çift dokunma (2x; 8x'teyken sıfırlar), iki parmakla kıstırma.
 *   Kaydırma sürükleyerek; harita dışına kayma yok. "Tüm dünya" düğmesi görünümü sıfırlar.
 * - Çift dokunmada ilk dokunma işaretler (gecikme olmasın diye), ikincisi yalnız yakınlaştırır.
 * - Tahmin ile hedef arasındaki çizgi ekranda DÜZ bir doğrudur; 180° boylamını aşarken kısa yol (haritanın
 *   öbür kenarından dolanan çizgi) çizilmez.
 * - `guess` dışarıdan değişince (kendi işaretlememizin dönüşü değilse; ör. yeni tur için null) görünüm sıfırlanır.
 *   `target` belirince görünüm tahmin ve hedefi birlikte gösterecek biçimde ayarlanır, kalkınca sıfırlanır.
 * - Konum ipucu verecek çizim (ülke adı, etiket) yoktur.
 */
export function WorldMap({
  height = 280,
  guess = null,
  target = null,
  disabled = false,
  onSelect,
  accessibilityLabel = DEFAULT_LABEL,
  onInteractionChange,
  testID,
}: WorldMapProps) {
  const [size, setSize] = useState<Size>({ width: 0, height });
  const [view, setView] = useState<MapView>({ scale: MIN_SCALE, tx: 0, ty: 0 });

  // Hareket işleyicileri bir kez oluşturulur; güncel değerleri ref'lerden okur.
  const viewRef = useRef(view);
  const sizeRef = useRef(size);
  const trackerRef = useRef<GestureTracker | null>(null);
  if (trackerRef.current === null) trackerRef.current = new GestureTracker();
  const tracker = trackerRef.current;
  const latest = useRef({ disabled, onSelect, onInteractionChange });
  latest.current = { disabled, onSelect, onInteractionChange };
  const lastEmitted = useRef<LatLng | null>(null);

  sizeRef.current = size;

  const applyView = useCallback(
    (next: MapView) => {
      if (sameView(next, viewRef.current)) return;
      viewRef.current = next;
      tracker.syncView(next);
      setView(next);
    },
    [tracker],
  );

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height: h } = e.nativeEvent.layout;
    setSize((prev) => (prev.width === width && prev.height === h ? prev : { width, height: h }));
  }, []);

  // Boyut (ilk yerleşim, döndürme) değişince görünümü sınırlar içinde tut.
  useEffect(() => {
    if (hasArea(size)) applyView(clampView(viewRef.current, size));
  }, [size, applyView]);

  // Yeni tur: guess dışarıdan değişti ya da temizlendi → görünüm sıfırlanır. Kendi işaretlememiz sıfırlamaz.
  const guessKey = guess ? `${guess.lat},${guess.lng}` : "";
  useEffect(() => {
    if (guess && sameLatLng(guess, lastEmitted.current, 1e-3)) return;
    lastEmitted.current = null;
    applyView(initialView(sizeRef.current));
    // Yalnız konum değişince çalışır; nesne kimliği önemsiz.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guessKey, applyView]);

  // Hedef belirince: tahmin + hedefi birlikte göster. Hedef kalkınca (sonraki tur) sıfırla.
  const targetKey = target ? `${target.lat},${target.lng}` : "";
  const ready = hasArea(size);
  const hadTarget = useRef(false);
  useEffect(() => {
    if (!ready) return;
    if (target) {
      const points = guess ? [clampLatLng(guess), clampLatLng(target)] : [clampLatLng(target)];
      applyView(fitView(points, sizeRef.current));
      hadTarget.current = true;
    } else if (hadTarget.current) {
      hadTarget.current = false;
      applyView(initialView(sizeRef.current));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetKey, ready, applyView]);

  const finish = useCallback(
    (e: GestureResponderEvent) => {
      const result = tracker.end(releasePoint(e), Date.now());
      latest.current.onInteractionChange?.(false);
      // Hareket sırasında görünüm değişmiş olabilir.
      if (result.kind === "tap") {
        if (latest.current.disabled || !latest.current.onSelect) return;
        const ll = fromScreen(result.point, viewRef.current, sizeRef.current);
        if (!ll) return;
        const picked = { lat: roundCoord(ll.lat), lng: roundCoord(ll.lng) };
        lastEmitted.current = picked;
        latest.current.onSelect(picked);
      } else if (result.kind === "doubleTap") {
        applyView(doubleTapView(viewRef.current, result.point, sizeRef.current));
      }
    },
    [tracker, applyView],
  );

  const trackMove = useCallback(
    (e: GestureResponderEvent) => {
      const next = tracker.move(pointsOf(e), sizeRef.current);
      if (!sameView(next, viewRef.current)) {
        viewRef.current = next;
        setView(next);
      }
    },
    [tracker],
  );

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        // Ebeveyn kaydırma görünümü hareketi elimizden almasın.
        onPanResponderTerminationRequest: () => false,
        onShouldBlockNativeResponder: () => true,
        onPanResponderGrant: (e) => {
          tracker.begin(pointsOf(e), viewRef.current);
          latest.current.onInteractionChange?.(true);
        },
        onPanResponderMove: trackMove,
        // Parmak sayısı değişince (ikinci parmak indi ya da biri kalktı) başlangıç hemen yeniden alınır.
        onPanResponderStart: trackMove,
        onPanResponderEnd: trackMove,
        onPanResponderRelease: finish,
        onPanResponderTerminate: () => {
          tracker.cancel();
          latest.current.onInteractionChange?.(false);
        },
      }),
    [tracker, finish, trackMove],
  );

  const zoomIn = useCallback(() => {
    const s = sizeRef.current;
    applyView(zoomBy(viewRef.current, ZOOM_STEP, centerOf(s), s));
  }, [applyView]);
  const zoomOut = useCallback(() => {
    const s = sizeRef.current;
    applyView(zoomBy(viewRef.current, 1 / ZOOM_STEP, centerOf(s), s));
  }, [applyView]);
  const reset = useCallback(() => applyView(initialView(sizeRef.current)), [applyView]);

  const onAccessibilityAction = useCallback(
    (e: AccessibilityActionEvent) => {
      if (e.nativeEvent.actionName === "zoomIn") zoomIn();
      else if (e.nativeEvent.actionName === "zoomOut") zoomOut();
      else if (e.nativeEvent.actionName === "reset") reset();
    },
    [zoomIn, zoomOut, reset],
  );

  const guessLL = guess ? clampLatLng(guess) : null;
  const targetLL = target ? clampLatLng(target) : null;

  const a11yValue = [
    guessLL ? `Tahmininiz: ${describePointSpoken(guessLL.lat, guessLL.lng)}` : null,
    targetLL ? `Doğru konum: ${describePointSpoken(targetLL.lat, targetLL.lng)}` : null,
  ]
    .filter(Boolean)
    .join(". ");

  const canZoomIn = view.scale < MAX_SCALE - 1e-6;
  const canZoomOut = view.scale > MIN_SCALE + 1e-6;
  const canReset = ready && !isInitialView(view, size);

  return (
    <View style={[styles.root, { height }]} onLayout={onLayout} testID={testID}>
      <View
        {...responder.panHandlers}
        style={[styles.surface, webSurface]}
        accessible
        accessibilityRole="image"
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={a11yValue ? { text: a11yValue } : undefined}
        accessibilityActions={ACTIONS}
        onAccessibilityAction={onAccessibilityAction}
        testID={testID ? `${testID}-surface` : undefined}
      >
        {ready ? (
          <View style={styles.canvas}>
            <MapCanvas size={size} view={view} guess={guessLL} target={targetLL} />
          </View>
        ) : null}
      </View>

      <View style={styles.controls}>
        <ZoomButton
          icon="globe-outline"
          label="Tüm dünyayı göster"
          onPress={reset}
          disabled={!canReset}
          testID={testID ? `${testID}-reset` : undefined}
        />
        <ZoomButton
          icon="remove"
          label="Uzaklaştır"
          onPress={zoomOut}
          disabled={!canZoomOut}
          testID={testID ? `${testID}-zoom-out` : undefined}
        />
        <ZoomButton
          icon="add"
          label="Yakınlaştır"
          onPress={zoomIn}
          disabled={!canZoomIn}
          testID={testID ? `${testID}-zoom-in` : undefined}
        />
      </View>

      <View style={styles.frame} />
    </View>
  );
}

interface MapCanvasProps {
  size: Size;
  view: MapView;
  guess: LatLng | null;
  target: LatLng | null;
}

/** Görünüme bağlı çizim: sabit harita katmanı dönüşümle, ızgara ve işaretçiler ekran pikselinde (sabit boyut). */
function MapCanvas({ size, view, guess, target }: MapCanvasProps) {
  const rect = worldRect(view, size);
  const matrix = pathMatrix(view, size, WORLD_WIDTH);
  const gridPath = graticulePath(graticuleLines(view, size));
  const guessAt = guess ? toScreen(guess, view, size) : null;
  const targetAt = target ? toScreen(target, view, size) : null;

  return (
    <Svg width={size.width} height={size.height}>
      {/* Harita dışı (kutup ötesi / kenar boşluğu) */}
      <Rect x={0} y={0} width={size.width} height={size.height} fill={colors.background} />
      {/* Deniz */}
      <Rect x={rect.x} y={rect.y} width={rect.width} height={rect.height} fill={colors.surface} />
      <G transform={matrix}>
        <WorldLayer />
      </G>
      {gridPath ? <Path d={gridPath} fill="none" stroke={colors.border} strokeWidth={1} /> : null}

      {guessAt && targetAt ? (
        <Line
          x1={guessAt.x}
          y1={guessAt.y}
          x2={targetAt.x}
          y2={targetAt.y}
          stroke={colors.text}
          strokeWidth={2}
          strokeDasharray="6 5"
          strokeLinecap="round"
        />
      ) : null}
      {targetAt ? <TargetMarker x={targetAt.x} y={targetAt.y} /> : null}
      {guessAt ? <GuessMarker x={guessAt.x} y={guessAt.y} /> : null}
    </Svg>
  );
}

/** Tahmin: altın daire; koyu kenar, kara ve denizden ayırır. Hedef işaretçisinden şekliyle de ayrılır. */
function GuessMarker({ x, y }: { x: number; y: number }) {
  return <Circle cx={x} cy={y} r={7} fill={colors.gold} stroke={colors.background} strokeWidth={3} />;
}

/** Hedef: yeşil baklava (elmas). */
function TargetMarker({ x, y }: { x: number; y: number }) {
  const r = 10;
  return (
    <Polygon
      points={`${x},${y - r} ${x + r},${y} ${x},${y + r} ${x - r},${y}`}
      fill={colors.success}
      stroke={colors.background}
      strokeWidth={3}
      strokeLinejoin="round"
    />
  );
}

interface ZoomButtonProps {
  icon: "add" | "remove" | "globe-outline";
  label: string;
  onPress: () => void;
  disabled: boolean;
  testID?: string;
}

function ZoomButton({ icon, label, onPress, disabled, testID }: ZoomButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <Icon name={icon} size={22} color={disabled ? "textMuted" : "text"} />
    </Pressable>
  );
}

const fill = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 } as const;

const styles = StyleSheet.create({
  root: {
    alignSelf: "stretch",
    overflow: "hidden",
    borderRadius: radius.md,
    backgroundColor: colors.background,
  },
  surface: { ...fill },
  canvas: { ...fill, pointerEvents: "none" },
  // Sağ altta yatay sıra: 1x'te harita dışı bandına denk gelir, kuzey yarımküre ve Asya açıkta kalır.
  controls: {
    position: "absolute",
    bottom: spacing.sm,
    right: spacing.sm,
    flexDirection: "row",
    gap: spacing.xs,
  },
  button: {
    width: minTouchTarget,
    height: minTouchTarget,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceRaised,
  },
  buttonPressed: { backgroundColor: colors.surface },
  frame: {
    ...fill,
    pointerEvents: "none",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
});
