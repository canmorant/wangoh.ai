"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { useFormatter } from "next-intl";
import { Volume2, VolumeX } from "lucide-react";

/** Sitenin altın vurgusu (globals.css --gold ile aynı). */
export const ACCENT = "#c8a45e";

/**
 * Puana göre renk: bayrak oyunundaki mod renkleriyle aynı dil. Dördü de koyu
 * zeminde (#06090f) en az 4,5:1 kontrast verir (distance.test.ts denetler).
 */
export const TINTS = { great: "#3fae9a", good: ACCENT, fair: "#d4795a", far: "#e0537a" } as const;
export const tintFor = (score: number) =>
  score >= 810 ? TINTS.great : score >= 560 ? TINTS.good : score >= 250 ? TINTS.fair : TINTS.far;

export const primaryButton =
  "inline-flex min-h-12 items-center justify-center rounded-full bg-white px-9 py-3.5 text-[12px] font-semibold tracking-[0.2em] text-black uppercase transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white";

export const secondaryButton =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-[11.5px] font-medium tracking-[0.16em] text-white/80 uppercase transition-colors duration-300 hover:border-white/40 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white";

/** Sayıyı dile göre biçimler (tr 1.234, en 1,234). */
export function Num({ value }: { value: number }) {
  const format = useFormatter();
  return <>{format.number(value)}</>;
}

export function Stat({ label, value, align = "left" }: { label: string; value: ReactNode; align?: "left" | "right" }) {
  return (
    <div className={align === "right" ? "text-right" : undefined}>
      <p className="text-[9.5px] tracking-[0.24em] text-white/60 uppercase">{label}</p>
      <p className="font-display mt-0.5 text-[1.4rem] leading-none text-white tabular-nums">{value}</p>
    </div>
  );
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/**
 * Sayıyı `from`'dan `value`'ya sayarak gösterir. DOM'a doğrudan yazar (her karede
 * React yeniden çizimi yok). `reduced` ya da süre 0 ise anında son değer.
 * İlk karede (JS çalışmadan) son değer yazılı: ekran okuyucu ve JS'siz görünüm doğru kalır.
 */
export function CountUp({
  value,
  from = 0,
  duration = 800,
  delay = 0,
  reduced,
}: {
  value: number;
  from?: number;
  duration?: number;
  delay?: number;
  reduced: boolean;
}) {
  const format = useFormatter();
  const ref = useRef<HTMLSpanElement>(null);

  // Boyamadan önce: ilk karede son değer görünüp sonra `from`'a atlamasın.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const write = (n: number) => {
      el.textContent = format.number(Math.round(n));
    };
    if (reduced || duration <= 0 || from === value) {
      write(value);
      return;
    }
    write(from);
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, Math.max(0, (now - start - delay) / duration));
      write(from + (value - from) * easeOutCubic(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      write(value);
    };
  }, [value, from, duration, delay, reduced, format]);

  return (
    <span ref={ref}>
      <Num value={value} />
    </span>
  );
}

/** Ses aç/kapat düğmesi (44 px hedef). Tercih localStorage'da, varsayılan kapalı. */
export function SoundToggle({
  on,
  onToggle,
  label,
}: {
  on: boolean;
  onToggle: (next: boolean) => void;
  /** Sabit ad ("Ses efektleri"); durum aria-pressed ile bildirilir, ad durumla değişmez. */
  label: string;
}) {
  const Icon = on ? Volume2 : VolumeX;
  return (
    <button
      type="button"
      onClick={() => onToggle(!on)}
      aria-pressed={on}
      aria-label={label}
      title={label}
      className={`flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
        on
          ? "border-[var(--gold)]/60 bg-[var(--gold)]/10 text-[var(--gold)]"
          : "border-white/20 text-white/70 hover:border-white/40 hover:text-white"
      }`}
    >
      <Icon className="size-[18px]" aria-hidden strokeWidth={1.8} />
    </button>
  );
}

/** Paylaşım karelerinin ekrandaki renkleri (🟩🟨🟧🟥 ile aynı eşikler: scoring.ts SHARE_TIERS). */
const STRIP_COLORS = ["#4cb97a", "#e5c04a", "#e0883a", "#d9534f"] as const;
export const stripColor = (score: number) =>
  score >= 800 ? STRIP_COLORS[0] : score >= 400 ? STRIP_COLORS[1] : score >= 100 ? STRIP_COLORS[2] : STRIP_COLORS[3];

/** 10 turun renkli kare şeridi. Ekran okuyucu için puanlar sözle okunur. */
export function ScoreStrip({
  scores,
  label,
  size = "md",
}: {
  scores: readonly number[];
  label: string;
  size?: "sm" | "md";
}) {
  return (
    <div role="img" aria-label={label} className={`flex ${size === "sm" ? "gap-1" : "gap-1.5"}`}>
      {scores.map((score, i) => (
        <span
          key={i}
          className={`dg-pop-html block flex-1 rounded-[5px] ${size === "sm" ? "h-4 max-w-5" : "h-7 max-w-9"}`}
          style={{ background: stripColor(score), ["--dg-delay" as string]: `${i * 45}ms` }}
        />
      ))}
    </div>
  );
}
