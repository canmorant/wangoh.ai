"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Menu, Search, X } from "lucide-react";
import Magnetic from "./Magnetic";
import IntentLink from "./IntentLink";
import type { Country } from "@/data/destinations";
import { cssEase, EASE_OUT, EASE_SOFT } from "@/lib/motion";
import LanguageSwitcher from "./LanguageSwitcher";
import { routing } from "@/i18n/routing";

const SearchModal = dynamic(() => import("./SearchModal"), { ssr: false });

export interface NavAction {
  label: string;
  onClick?: () => void;
  href?: string;
}

/**
 * Mobil menü kapanırken çıkış geçişi bitene kadar DOM'da kalır ("closing").
 * Menü her sayfada olduğu için geçişler bir animasyon kütüphanesiyle değil,
 * CSS geçişleri ve Web Animations API ile yapılır; kütüphane yalnız onu
 * gerçekten kullanan sayfalarda (ana sayfa, arama penceresi) yüklenir.
 */
type MenuState = "closed" | "open" | "closing";
const closeMenu = (state: MenuState): MenuState => (state === "open" ? "closing" : state);
const toggleMenu = (state: MenuState): MenuState => (state === "open" ? "closing" : "open");

const HEADER_EASE = cssEase(EASE_OUT);
const HEADER_TRANSITION = `transform 0.55s ${HEADER_EASE}, opacity 0.55s ${HEADER_EASE}`;
const MENU_FADE: KeyframeAnimationOptions = { duration: 250, easing: "ease-out" };
const MENU_PANEL: KeyframeAnimationOptions = { duration: 350, easing: HEADER_EASE };
const MENU_EXIT_MS = 350;

/**
 * Öğeyi `from` karesinden (verilmezse o anki görünümünden) `to` karesine götürür.
 * Giriş bitince animasyon bırakılır, öğe kendi stiline döner; çıkış son karede
 * kalır (`hold`), çünkü öğe az sonra DOM'dan kalkacak.
 */
function playMenu(
  el: HTMLElement,
  from: Keyframe | null,
  to: Keyframe,
  options: KeyframeAnimationOptions,
  hold: boolean,
) {
  const current = getComputedStyle(el);
  const start = from ?? { opacity: current.opacity, transform: current.transform };
  for (const running of el.getAnimations()) running.cancel();
  el.animate([start, to], hold ? { ...options, fill: "forwards" } : options);
}

/**
 * Floating pill nav with integrated global Search.
 */
export default function FloatingNav({
  actions,
  onHome,
  onSelectCountry,
  searchDictionaryUrl,
}: {
  actions: NavAction[];
  onHome?: () => void;
  onSelectCountry?: (country: Country) => void;
  searchDictionaryUrl?: string;
}) {
  const t = useTranslations("Nav");
  const [visible, setVisible] = useState(true);
  const [solid, setSolid] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchRequested, setSearchRequested] = useState(false);
  const [menu, setMenu] = useState<MenuState>("closed");
  const mobileOpen = menu === "open";
  const lastY = useRef(0);
  const solidRef = useRef(false);
  const visibleRef = useRef(true);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const highlightShown = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  /**
   * Masaüstünde imlecin altındaki bağlantının arkasındaki vurgu: ilk girişte
   * yerinde belirir, bağlantıdan bağlantıya geçerken kayar, menüden çıkınca söner.
   */
  const moveHighlight = (item: HTMLElement | null) => {
    const mark = highlightRef.current;
    if (!mark) return;
    if (!item) {
      mark.style.opacity = "0";
      highlightShown.current = false;
      return;
    }
    // Kesirli ölçü: offsetWidth tam sayıya yuvarlar, vurgu bağlantıdan yarım piksel taşardı.
    const box = item.getBoundingClientRect();
    const origin = (mark.offsetParent ?? mark).getBoundingClientRect();
    mark.style.transitionProperty = highlightShown.current ? "transform, width, height, opacity" : "opacity";
    mark.style.transform = `translate(${box.left - origin.left}px, ${box.top - origin.top}px)`;
    mark.style.width = `${box.width}px`;
    mark.style.height = `${box.height}px`;
    mark.style.opacity = "1";
    highlightShown.current = true;
  };

  useEffect(() => {
    lastY.current = window.scrollY;

    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY.current;
      const nextSolid = y > 40;

      if (nextSolid !== solidRef.current) {
        solidRef.current = nextSolid;
        setSolid(nextSolid);
      }

      // Small deltas are ignored so the bar doesn't flicker on micro-scrolls.
      if (Math.abs(delta) > 6) {
        const nextVisible = delta < 0 || y < 80;
        if (nextVisible !== visibleRef.current) {
          visibleRef.current = nextVisible;
          setVisible(nextVisible);
        }
        lastY.current = y;
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 768px)");
    const onViewportChange = () => {
      if (desktop.matches) setMenu(closeMenu);
    };
    desktop.addEventListener("change", onViewportChange);
    onViewportChange();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(closeMenu);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onViewportChange);
    };
  }, [mobileOpen]);

  // Mobil menünün giriş ve çıkış geçişi. Yarıda kesilen geçiş (hızlı aç-kapa)
  // o anki görünümden devam eder, sıçramaz.
  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (menu === "closed" || !overlay || !panel) return;
    try {
      if (menu === "open") {
        const fresh = overlay.getAnimations().length === 0;
        playMenu(overlay, fresh ? { opacity: 0 } : null, { opacity: 1 }, MENU_FADE, false);
        playMenu(
          panel,
          fresh ? { opacity: 0, transform: "translateY(-18px) scale(0.98)" } : null,
          { opacity: 1, transform: "none" },
          MENU_PANEL,
          false,
        );
      } else {
        playMenu(overlay, null, { opacity: 0 }, MENU_FADE, true);
        playMenu(panel, null, { opacity: 0, transform: "translateY(-12px) scale(0.98)" }, MENU_PANEL, true);
      }
    } catch {
      // Web Animations API'yi tam desteklemeyen eski tarayıcı: menü geçişsiz açılıp kapanır.
    }
  }, [menu]);

  useEffect(() => {
    if (menu !== "closing") return;
    const timer = window.setTimeout(
      () => setMenu((state) => (state === "closing" ? "closed" : state)),
      MENU_EXIT_MS,
    );
    return () => window.clearTimeout(timer);
  }, [menu]);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K / /)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setMenu(closeMenu);
        setSearchRequested(true);
        setSearchOpen((prev) => !prev);
      } else if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        setMenu(closeMenu);
        setSearchRequested(true);
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const shown = visible || mobileOpen;

  return (
    <>
      <header
        style={{
          transform: shown ? "none" : "translateY(-96px)",
          opacity: shown ? 1 : 0,
          transition: HEADER_TRANSITION,
        }}
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-center px-3 pt-[max(0.75rem,env(safe-area-inset-top))] lg:px-4 lg:pt-6"
      >
        <nav
          className="pointer-events-auto flex w-full max-w-[calc(100vw-1.5rem)] items-center justify-between gap-1 overflow-hidden rounded-full px-2 py-2 whitespace-nowrap transition-[background-color,border-color,box-shadow,backdrop-filter] duration-700 lg:w-auto lg:justify-start"
          style={{
            backgroundColor: solid || mobileOpen ? "rgba(14,17,26,0.82)" : "rgba(14,17,26,0)",
            border: `1px solid ${solid || mobileOpen ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0)"}`,
            backdropFilter: solid || mobileOpen ? "blur(22px) saturate(160%)" : "blur(0px)",
            WebkitBackdropFilter: solid || mobileOpen ? "blur(22px) saturate(160%)" : "blur(0px)",
            boxShadow: solid || mobileOpen ? "0 8px 40px -12px rgba(0,0,0,0.6)" : "none",
          }}
          onPointerLeave={() => moveHighlight(null)}
        >
          <IntentLink
            href="/"
            onClick={() => {
              setMenu(closeMenu);
              onHome?.();
            }}
            className="ml-3 shrink-0 text-[13px] tracking-[0.32em] text-white/90 uppercase transition-opacity duration-300 hover:opacity-70 lg:mr-2"
          >
            Wangoh
          </IntentLink>

          <div className="flex shrink-0 items-center gap-1">
            {/* Search Trigger Button */}
            <button
              type="button"
              onClick={() => {
                setMenu(closeMenu);
                setSearchRequested(true);
                setSearchOpen(true);
              }}
              className="flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 text-[12px] text-white/80 transition-all hover:bg-white/20 hover:text-white lg:mr-1 lg:min-h-0 lg:py-1.5"
              aria-label={t("searchLabel")}
            >
              <Search className="h-3.5 w-3.5 text-white/70" />
              <span className="font-medium">{t("search")}</span>
            </button>

            <button
              type="button"
              onClick={() => setMenu(toggleMenu)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
              aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <div className="relative hidden items-center lg:flex">
            <span
              ref={highlightRef}
              aria-hidden
              className="pointer-events-none absolute top-0 left-0 rounded-full bg-white/[0.09] opacity-0"
              style={{ transitionDuration: "0.35s", transitionTimingFunction: cssEase(EASE_SOFT) }}
            />
            {actions.map((a) => {
              const inner = (
                <span className="relative z-10 whitespace-nowrap">{a.label}</span>
              );

              const shared =
                "relative cursor-pointer rounded-full px-4 py-2 text-[13px] text-white/70 transition-colors duration-300 hover:text-white lg:px-3.5 xl:px-5";

              return (
                <div
                  key={a.label}
                  className="relative"
                  onPointerEnter={(event) => moveHighlight(event.currentTarget)}
                >
                  <Magnetic strength={0.25}>
                    {a.href ? (
                      <IntentLink href={a.href} className={shared}>
                        {inner}
                      </IntentLink>
                    ) : (
                      <button type="button" onClick={a.onClick} className={shared}>
                        {inner}
                      </button>
                    )}
                  </Magnetic>
                </div>
              );
            })}
            <LanguageSwitcher className="ml-1" />
          </div>
        </nav>
      </header>

      {menu !== "closed" && (
        <div
          ref={overlayRef}
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label={t("mobileMenu")}
          className="fixed inset-0 z-[55] lg:hidden"
        >
          <button
            type="button"
            aria-label={t("closeMenu")}
            onClick={() => setMenu(closeMenu)}
            className="absolute inset-0 bg-[#05070c]/80 backdrop-blur-xl"
          />
          <nav
            ref={panelRef}
            className="absolute inset-x-3 top-[calc(max(0.75rem,env(safe-area-inset-top))_+_4rem)] overflow-hidden rounded-[24px] border border-white/10 bg-[#0d111b]/[0.96] p-2 shadow-2xl"
          >
            {actions.map((action, index) => {
              const content = (
                <>
                  <span className="text-[15px] text-white/85">{action.label}</span>
                  <span className="text-white/25" aria-hidden>→</span>
                </>
              );
              const className =
                "flex min-h-14 w-full items-center justify-between rounded-2xl px-5 text-left transition-colors hover:bg-white/[0.07] focus-visible:bg-white/[0.07] focus-visible:outline-none";
              return action.href ? (
                <Link
                  key={action.label}
                  href={action.href}
                  onClick={() => setMenu(closeMenu)}
                  className={className}
                >
                  {content}
                </Link>
              ) : (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => {
                    setMenu(closeMenu);
                    action.onClick?.();
                  }}
                  className={className}
                  style={{ borderTop: index ? "1px solid rgba(255,255,255,0.05)" : undefined }}
                >
                  {content}
                </button>
              );
            })}
            {routing.locales.length > 1 && (
              <div className="mt-1 flex items-center justify-between rounded-2xl border-t border-white/[0.05] px-3 pt-1">
                <LanguageSwitcher />
              </div>
            )}
          </nav>
        </div>
      )}

      {/* Global Search Modal */}
      {searchRequested && (
        <SearchModal
          dictionaryUrl={searchDictionaryUrl}
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          onSelectCountry={onSelectCountry}
        />
      )}
    </>
  );
}
