/**
 * Marka renkleri. Zemin ve altın web sitesiyle aynıdır (apps/web globals.css: --background, --gold).
 * Metin renklerinin zemine oranı WCAG AA'yı geçer (metin ≥ 4.5:1, bileşen kenarlığı ≥ 3:1):
 * text 16.9, textSecondary 8.5, textMuted 5.5, gold 8.2, danger 6.4, success 7.8 (zemin üzerinde).
 */
export const colors = {
  /** Lacivert ana zemin. */
  background: "#0a0e1a",
  /** Kart ve liste satırı yüzeyi. */
  surface: "#121828",
  /** Üstte duran yüzey: modal, seçili satır, giriş alanı dolgusu. */
  surfaceRaised: "#1a2237",

  /** Ayırıcı çizgi ve kart kenarı (dekoratif). */
  border: "#27304a",
  /** Giriş alanı ve ikincil düğme kenarı: bileşen sınırı olduğu için zemine ≥ 3:1. */
  borderStrong: "#5a6688",

  text: "#f0f0f0",
  textSecondary: "#a3acc2",
  /** Yer tutucu ve ipucu metni; en soluk metin tonu. */
  textMuted: "#7f89a3",

  gold: "#c8a45e",
  goldPressed: "#b3914f",
  /** Altın üzerindeki metin. */
  onGold: "#0a0e1a",
  /** Altının şeffaf dolgusu: seçili çip, rozet. */
  goldSoft: "rgba(200, 164, 94, 0.16)",

  success: "#52b788",
  successSoft: "rgba(82, 183, 136, 0.16)",
  danger: "#ef6b63",
  dangerSoft: "rgba(239, 107, 99, 0.16)",
  /** Tehlikeli düğmenin dolgusu (üzerinde beyaz metin 6.1:1). */
  dangerSolid: "#b3342b",
  onDangerSolid: "#ffffff",

  overlay: "rgba(5, 8, 16, 0.72)",
  skeleton: "#1a2237",
  skeletonHighlight: "#242e49",
  transparent: "transparent",
} as const;

export type ColorToken = keyof typeof colors;
