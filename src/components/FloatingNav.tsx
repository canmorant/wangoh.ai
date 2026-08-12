import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search } from "lucide-react";
import Magnetic from "./Magnetic";
import SearchModal from "./SearchModal";
import { Country } from "@/data/destinations";
import { EASE_OUT, EASE_SOFT } from "@/lib/motion";

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
  onSelectCountry,
}: {
  actions: NavAction[];
  onSelectCountry?: (country: Country) => void;
}) {
  const [visible, setVisible] = useState(true);
  const [solid, setSolid] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;

      setSolid(y > 40);

      // Small deltas are ignored so the bar doesn't flicker on micro-scrolls.
      if (Math.abs(delta) > 6) {
        setVisible(delta < 0 || y < 80);
        lastY.current = y;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K / /)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
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
        animate={{ y: visible ? 0 : -96, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.55, ease: EASE_OUT }}
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-center px-4 pt-4 sm:pt-6"
      >
        <nav
          className="pointer-events-auto flex items-center gap-1 rounded-full px-2 py-2 max-w-[calc(100vw-1.5rem)] overflow-x-auto scrollbar-none whitespace-nowrap transition-[background-color,border-color,box-shadow,backdrop-filter] duration-700"
          style={{
            backgroundColor: solid ? "rgba(14,17,26,0.55)" : "rgba(14,17,26,0)",
            border: `1px solid ${solid ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0)"}`,
            backdropFilter: solid ? "blur(22px) saturate(160%)" : "blur(0px)",
            WebkitBackdropFilter: solid ? "blur(22px) saturate(160%)" : "blur(0px)",
            boxShadow: solid ? "0 8px 40px -12px rgba(0,0,0,0.6)" : "none",
          }}
          onPointerLeave={() => setHovered(null)}
        >
          <Link
            href="/"
            className="mr-2 ml-3 text-[13px] tracking-[0.32em] text-white/90 uppercase transition-opacity duration-300 hover:opacity-70"
          >
            Wangoh
          </Link>

          {/* Search Trigger Button */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[12px] text-white/80 hover:bg-white/20 hover:text-white transition-all mr-1 sm:mr-2 cursor-pointer"
            aria-label="Arama yap"
          >
            <Search className="h-3.5 w-3.5 text-white/70" />
            <span className="font-medium">Ara</span>
          </button>

          {actions.map((a) => {
            const inner = (
              <span className="relative z-10 whitespace-nowrap">{a.label}</span>
            );

            const shared =
              "relative cursor-pointer rounded-full px-4 py-2 text-[13px] text-white/70 transition-colors duration-300 hover:text-white sm:px-5";

            return (
              <div key={a.label} className="relative" onPointerEnter={() => setHovered(a.label)}>
                {/* The highlight is a single shared element that slides between
                    items, rather than one fading in per item. */}
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
        </nav>
      </motion.header>

      {/* Global Search Modal */}
      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectCountry={onSelectCountry}
      />
    </>
  );
}
