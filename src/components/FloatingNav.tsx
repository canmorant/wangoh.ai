import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import Magnetic from "./Magnetic";
import type { Country } from "@/data/destinations";
import { EASE_OUT, EASE_SOFT } from "@/lib/motion";

const SearchModal = dynamic(() => import("./SearchModal"), { ssr: false });

export interface NavAction {
  label: string;
  onClick?: () => void;
  href?: string;
}

/**
 * Floating pill nav with integrated global Search.
 */
export default function FloatingNav({
  actions,
  onHome,
  onSelectCountry,
}: {
  actions: NavAction[];
  onHome?: () => void;
  onSelectCountry?: (country: Country) => void;
}) {
  const [visible, setVisible] = useState(true);
  const [solid, setSolid] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchRequested, setSearchRequested] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastY = useRef(0);
  const solidRef = useRef(false);
  const visibleRef = useRef(true);

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
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K / /)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchRequested(true);
        setSearchOpen((prev) => !prev);
      } else if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        setSearchRequested(true);
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: visible || mobileOpen ? 0 : -96, opacity: visible || mobileOpen ? 1 : 0 }}
        transition={{ duration: 0.55, ease: EASE_OUT }}
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-center px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-4 sm:pt-6"
      >
        <nav
          className="pointer-events-auto flex w-full max-w-[calc(100vw-1.5rem)] items-center justify-between gap-1 overflow-hidden rounded-full px-2 py-2 whitespace-nowrap transition-[background-color,border-color,box-shadow,backdrop-filter] duration-700 sm:w-auto sm:justify-start"
          style={{
            backgroundColor: solid || mobileOpen ? "rgba(14,17,26,0.82)" : "rgba(14,17,26,0)",
            border: `1px solid ${solid || mobileOpen ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0)"}`,
            backdropFilter: solid || mobileOpen ? "blur(22px) saturate(160%)" : "blur(0px)",
            WebkitBackdropFilter: solid || mobileOpen ? "blur(22px) saturate(160%)" : "blur(0px)",
            boxShadow: solid || mobileOpen ? "0 8px 40px -12px rgba(0,0,0,0.6)" : "none",
          }}
          onPointerLeave={() => setHovered(null)}
        >
          <Link
            href="/"
            onClick={() => {
              setMobileOpen(false);
              onHome?.();
            }}
            className="ml-3 shrink-0 text-[13px] tracking-[0.32em] text-white/90 uppercase transition-opacity duration-300 hover:opacity-70 sm:mr-2"
          >
            Wangoh
          </Link>

          <div className="flex shrink-0 items-center gap-1">
            {/* Search Trigger Button */}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setSearchRequested(true);
                setSearchOpen(true);
              }}
              className="flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 text-[12px] text-white/80 transition-all hover:bg-white/20 hover:text-white sm:mr-1 sm:min-h-0 sm:py-1.5"
              aria-label="Arama yap"
            >
              <Search className="h-3.5 w-3.5 text-white/70" />
              <span className="font-medium">Ara</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((current) => !current)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white sm:hidden"
              aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <div className="hidden items-center sm:flex">
            {actions.map((a) => {
              const inner = (
                <span className="relative z-10 whitespace-nowrap">{a.label}</span>
              );

              const shared =
                "relative cursor-pointer rounded-full px-4 py-2 text-[13px] text-white/70 transition-colors duration-300 hover:text-white sm:px-5";

              return (
                <div key={a.label} className="relative" onPointerEnter={() => setHovered(a.label)}>
                  <AnimatePresence>
                    {hovered === a.label && (
                      <motion.span
                        layoutId="nav-highlight"
                        className="absolute inset-0 rounded-full bg-white/[0.09]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE_SOFT }}
                      />
                    )}
                  </AnimatePresence>

                  <Magnetic strength={0.25}>
                    {a.href ? (
                      <Link href={a.href} className={shared}>
                        {inner}
                      </Link>
                    ) : (
                      <button type="button" onClick={a.onClick} className={shared}>
                        {inner}
                      </button>
                    )}
                  </Magnetic>
                </div>
              );
            })}
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Mobil menü"
            className="fixed inset-0 z-[55] sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              aria-label="Menüyü kapat"
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-[#05070c]/80 backdrop-blur-xl"
            />
            <motion.nav
              initial={{ opacity: 0, y: -18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
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
                    onClick={() => setMobileOpen(false)}
                    className={className}
                  >
                    {content}
                  </Link>
                ) : (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      action.onClick?.();
                    }}
                    className={className}
                    style={{ borderTop: index ? "1px solid rgba(255,255,255,0.05)" : undefined }}
                  >
                    {content}
                  </button>
                );
              })}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Search Modal */}
      {searchRequested && (
        <SearchModal
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          onSelectCountry={onSelectCountry}
        />
      )}
    </>
  );
}
