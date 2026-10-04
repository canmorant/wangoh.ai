"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Script from "next/script";
import { useTranslations } from "next-intl";
import { Check, Cookie, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  GA_MEASUREMENT_ID,
  OPEN_CONSENT_EVENT,
  applyConsent,
  clearAnalyticsCookies,
  consentSnapshot,
  parseConsent,
  readConsent,
  subscribeConsent,
  writeConsent,
  type ConsentChoice,
} from "@/lib/consent";

const ALL: ConsentChoice = { analytics: true, ads: true };
const NONE: ConsentChoice = { analytics: false, ads: false };

/**
 * Çerez izin penceresi ve tercih merkezi.
 *
 * - İlk ziyarette (veya tercih süresi dolunca) altta bir pencere: "Tümünü
 *   reddet" ile "Tümünü kabul et" eşit ağırlıkta; ayrıntı için "Tercihleri yönet".
 * - Tercih merkezi: Zorunlu (kapatılamaz), Analitik, Reklam.
 * - Altbilgideki "Çerez tercihleri" bağlantısı OPEN_CONSENT_EVENT ile tercih
 *   merkezini yeniden açar.
 * - Google Analytics betiği yalnız analitik izni varken yüklenir.
 *
 * Sunucuda hiçbir şey render etmez; tercih tarayıcıda okunduğu için pencere
 * ilk boyamadan sonra gelir ve hidrasyon uyuşmazlığı doğurmaz.
 */
export default function ConsentManager() {
  const t = useTranslations("Consent");
  // Sunucuda ve hidrasyonda undefined: tercih yalnız tarayıcıda okunabilir.
  const raw = useSyncExternalStore(subscribeConsent, consentSnapshot, () => undefined);
  const hydrated = raw !== undefined;
  const consent = useMemo(() => (raw === undefined ? null : parseConsent(raw)), [raw]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draft, setDraft] = useState<ConsentChoice>(NONE);
  const [announce, setAnnounce] = useState("");

  // İzin yokken (ya da izin penceresinden önceki ziyaretlerden kalmışsa)
  // Google Analytics çerezlerini temizle.
  useEffect(() => {
    if (hydrated && consent?.analytics !== true) clearAnalyticsCookies();
  }, [hydrated, consent]);

  useEffect(() => {
    const open = () => {
      setDraft(readConsent() ?? NONE);
      setDialogOpen(true);
    };
    window.addEventListener(OPEN_CONSENT_EVENT, open);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, open);
  }, []);

  const save = useCallback(
    (choice: ConsentChoice) => {
      const hadAnalytics = readConsent()?.analytics === true;
      writeConsent(choice);
      applyConsent(choice);
      if (hadAnalytics && !choice.analytics) clearAnalyticsCookies();
      setDialogOpen(false);
      setAnnounce(t("saved"));
    },
    [t]
  );

  const openDialog = () => {
    setDraft(consent ?? NONE);
    setDialogOpen(true);
  };

  if (!hydrated) return null;
  const bannerOpen = consent === null;

  return (
    <>
      {consent?.analytics && (
        <>
          <Script
            id="google-analytics-lib"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`gtag('js', new Date()); gtag('config', '${GA_MEASUREMENT_ID}');`}
          </Script>
        </>
      )}

      <p role="status" aria-live="polite" className="sr-only">
        {announce}
      </p>

      {bannerOpen && !dialogOpen && (
        <ConsentBanner
          onAccept={() => save(ALL)}
          onReject={() => save(NONE)}
          onManage={openDialog}
        />
      )}

      {dialogOpen && (
        <ConsentDialog
          draft={draft}
          onChange={setDraft}
          onSave={() => save(draft)}
          onAccept={() => save(ALL)}
          onReject={() => save(NONE)}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </>
  );
}

/* ----------------------------------------------------------------------- */

function ConsentBanner({
  onAccept,
  onReject,
  onManage,
}: {
  onAccept: () => void;
  onReject: () => void;
  onManage: () => void;
}) {
  const t = useTranslations("Consent");
  const titleId = useId();
  const bodyId = useId();
  return (
    <section
      role="region"
      aria-labelledby={titleId}
      aria-describedby={bodyId}
      className="consent-enter fixed inset-x-3 bottom-3 z-[1000] mx-auto max-w-[760px] sm:inset-x-6 sm:bottom-6"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="rounded-[22px] border border-white/[0.1] bg-[#0b1020]/[0.98] p-5 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:p-6">
        <div className="flex items-start gap-4">
          <span
            aria-hidden
            className="mt-0.5 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--gold)]/25 bg-[var(--gold)]/[0.08] sm:flex"
          >
            <Cookie className="h-[18px] w-[18px] text-[var(--gold)]" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[9.5px] tracking-[0.28em] text-[var(--gold)]/75 uppercase">{t("eyebrow")}</p>
            <h2 id={titleId} className="font-display mt-1.5 text-[1.55rem] leading-tight text-white">
              {t("title")}
            </h2>
            <p id={bodyId} className="mt-2.5 text-[13.5px] leading-relaxed text-white/60">
              {t("body")}{" "}
              <Link
                href="/cerez-politikasi"
                className="text-[var(--gold)]/85 underline decoration-[var(--gold)]/35 underline-offset-4 transition-colors hover:text-[var(--gold)]"
              >
                {t("policyLink")}
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onManage}
            className="rounded-full px-4 py-3 text-[12.5px] text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline sm:mr-auto sm:px-2"
          >
            {t("manage")}
          </button>
          <button type="button" onClick={onReject} className={secondaryButton}>
            {t("rejectAll")}
          </button>
          <button type="button" onClick={onAccept} className={primaryButton}>
            {t("acceptAll")}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------- */

function ConsentDialog({
  draft,
  onChange,
  onSave,
  onAccept,
  onReject,
  onClose,
}: {
  draft: ConsentChoice;
  onChange: (next: ConsentChoice) => void;
  onSave: () => void;
  onAccept: () => void;
  onReject: () => void;
  onClose: () => void;
}) {
  const t = useTranslations("Consent");
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  // Üst bileşen her seçimde yeniden render olur; kapatma işlevi değişse de
  // odak/kaydırma ayarları yalnız pencere açılırken bir kez kurulsun.
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  // Odak pencerede kalsın, Esc kapatsın, arka plan kaymasın; kapanınca odak
  // pencereyi açan öğeye dönsün.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const focusable = [
        ...panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])"),
      ];
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = overflow;
      previous?.focus?.();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[1001] flex items-end justify-center sm:items-center sm:p-6">
      <div aria-hidden className="consent-fade absolute inset-0 bg-[#03050b]/75 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="consent-enter relative flex max-h-[92dvh] w-full max-w-[600px] flex-col overflow-hidden rounded-t-[24px] border border-white/[0.1] bg-[#0b1020] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.9)] sm:rounded-[24px]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-white/[0.07] px-6 pb-5 pt-6">
          <div>
            <p className="text-[9.5px] tracking-[0.28em] text-[var(--gold)]/75 uppercase">{t("eyebrow")}</p>
            <h2 id={titleId} className="font-display mt-1.5 text-[1.75rem] leading-tight text-white">
              {t("dialogTitle")}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="-mr-2 rounded-full p-2 text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-6 py-5">
          <p className="text-[13.5px] leading-relaxed text-white/58">
            {t("dialogIntro")}{" "}
            <Link
              href="/cerez-politikasi"
              onClick={onClose}
              className="text-[var(--gold)]/85 underline decoration-[var(--gold)]/35 underline-offset-4 hover:text-[var(--gold)]"
            >
              {t("policyLink")}
            </Link>
          </p>

          <ul className="mt-5 space-y-3">
            <Category title={t("necessaryTitle")} body={t("necessaryBody")}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--gold)]/25 bg-[var(--gold)]/[0.08] px-3 py-1 text-[10.5px] tracking-[0.06em] text-[var(--gold)]/90">
                <Check className="h-3 w-3" aria-hidden />
                {t("alwaysOn")}
              </span>
            </Category>
            <Category title={t("analyticsTitle")} body={t("analyticsBody")}>
              <Toggle
                label={t("analyticsTitle")}
                checked={draft.analytics}
                autoFocus
                onChange={(analytics) => onChange({ ...draft, analytics })}
              />
            </Category>
            <Category title={t("adsTitle")} body={t("adsBody")}>
              <Toggle label={t("adsTitle")} checked={draft.ads} onChange={(ads) => onChange({ ...draft, ads })} />
            </Category>
          </ul>
        </div>

        <footer
          className="flex flex-col gap-2.5 border-t border-white/[0.07] px-6 py-5 sm:flex-row sm:justify-end"
          style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
        >
          <button type="button" onClick={onReject} className={secondaryButton}>
            {t("rejectAll")}
          </button>
          <button type="button" onClick={onSave} className={secondaryButton}>
            {t("save")}
          </button>
          <button type="button" onClick={onAccept} className={primaryButton}>
            {t("acceptAll")}
          </button>
        </footer>
      </div>
    </div>
  );
}

function Category({ title, body, children }: { title: string; body: string; children: React.ReactNode }) {
  return (
    <li className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-[14.5px] font-medium text-white/90">{title}</h3>
        {children}
      </div>
      <p className="mt-2 text-[12.5px] leading-relaxed text-white/48">{body}</p>
    </li>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  autoFocus = false,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  autoFocus?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      data-autofocus={autoFocus ? "" : undefined}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)] ${
        checked ? "border-[var(--gold)]/60 bg-[var(--gold)]" : "border-white/15 bg-white/[0.08]"
      }`}
    >
      <span
        aria-hidden
        className={`inline-block h-5 w-5 rounded-full shadow transition-transform ${
          checked ? "translate-x-[22px] bg-[#0b1020]" : "translate-x-[3px] bg-white/80"
        }`}
      />
    </button>
  );
}

const baseButton =
  "rounded-full px-6 py-3 text-[12.5px] font-medium tracking-[0.02em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)] sm:min-w-[156px]";
const primaryButton = `${baseButton} bg-[var(--gold)] text-[#0b1020] hover:bg-[#d6b46f]`;
const secondaryButton = `${baseButton} border border-white/20 text-white/85 hover:border-white/40 hover:bg-white/[0.04] hover:text-white`;
