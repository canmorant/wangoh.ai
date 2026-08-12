"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Globe, MapPin, ArrowRight, CornerDownLeft } from "lucide-react";
import { countries, Country } from "@/data/destinations";
import { citySlug, cityHref, countryHref } from "@/content/guides";
import { slugify } from "@/lib/slug";
import { EASE_OUT } from "@/lib/motion";

export interface SearchResultItem {
  id: string;
  type: "country" | "city";
  title: string;
  shortTitle: string;
  subtitle: string;
  flag: string;
  href: string;
  image: string;
  countryName: string;
  keywords: string;
}

export function buildSearchIndex(): SearchResultItem[] {
  const items: SearchResultItem[] = [];

  for (const country of countries) {
    const shortName = country.shortName || country.name;

    // Add Country
    items.push({
      id: `country-${country.code}`,
      type: "country",
      title: country.name,
      shortTitle: shortName,
      subtitle: `${country.gateway} · ${country.cities.length} Şehir Rehberi`,
      flag: country.flag,
      href: countryHref(country),
      image: country.image,
      countryName: country.name,
      keywords: slugify(
        `${country.name} ${shortName} ${country.code} ${country.capital} ${country.gateway} ulke`
      ),
    });

    // Add Cities
    for (const city of country.cities) {
      items.push({
        id: `city-${country.code}-${citySlug(city)}`,
        type: "city",
        title: city.name,
        shortTitle: city.name,
        subtitle: `${shortName} ${country.flag} · Gezi Rehberi`,
        flag: country.flag,
        href: cityHref(country, city),
        image: city.image,
        countryName: country.name,
        keywords: slugify(
          `${city.name} ${city.description} ${country.name} ${shortName} ${country.code} sehir rehber`
        ),
      });
    }
  }

  return items;
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  onSelectCountry?: (country: Country) => void;
}

export default function SearchModal({ open, onClose, onSelectCountry }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<"all" | "country" | "city">("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const searchIndex = useMemo(() => buildSearchIndex(), []);

  // Filter items based on query & category
  const results = useMemo(() => {
    const q = slugify(query.trim());
    if (!q) {
      // Popular / featured default list
      return searchIndex.filter((item) => {
        if (activeFilter === "country") return item.type === "country";
        if (activeFilter === "city") return item.type === "city";
        return true;
      });
    }

    return searchIndex.filter((item) => {
      if (activeFilter === "country" && item.type !== "country") return false;
      if (activeFilter === "city" && item.type !== "city") return false;
      return item.keywords.includes(q) || slugify(item.title).includes(q);
    });
  }, [query, activeFilter, searchIndex]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setQuery("");
        setSelectedIndex(0);
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Handle item selection
  const handleSelect = useCallback(
    (item: SearchResultItem) => {
      onClose();

      // If selecting a country on home page with an onSelectCountry callback
      if (item.type === "country" && onSelectCountry) {
        const countryObj = countries.find((c) => c.code === item.id.replace("country-", ""));
        if (countryObj) {
          onSelectCountry(countryObj);
          return;
        }
      }

      // Navigate to destination URL
      router.push(item.href);
    },
    [onClose, onSelectCountry, router]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          results.length > 0 ? (prev - 1 + results.length) % results.length : 0
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    },
    [results, selectedIndex, handleSelect, onClose]
  );

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-xl"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            onKeyDown={handleKeyDown}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-[#0b0e17]/95 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-white"
          >
            {/* Input Header */}
            <div className="relative flex items-center border-b border-white/10 px-5 py-4">
              <Search className="h-5 w-5 shrink-0 text-white/50" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Şehir veya ülke ara... (örn: Tokyo, Japonya, Paris, New York)"
                className="ml-3.5 flex-1 bg-transparent text-[15px] sm:text-[16px] text-white placeholder-white/40 outline-none"
              />
              <button
                type="button"
                onClick={onClose}
                className="ml-2 rounded-full p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Aramayı kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-white/5 px-5 py-2.5 text-[12px]">
              <button
                type="button"
                onClick={() => {
                  setActiveFilter("all");
                  setSelectedIndex(0);
                }}
                className={`rounded-full px-3 py-1 transition-colors ${
                  activeFilter === "all"
                    ? "bg-white text-black font-semibold"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                Tümü
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveFilter("city");
                  setSelectedIndex(0);
                }}
                className={`rounded-full px-3 py-1 transition-colors flex items-center gap-1.5 ${
                  activeFilter === "city"
                    ? "bg-white text-black font-semibold"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                <MapPin className="h-3 w-3" /> Şehirler
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveFilter("country");
                  setSelectedIndex(0);
                }}
                className={`rounded-full px-3 py-1 transition-colors flex items-center gap-1.5 ${
                  activeFilter === "country"
                    ? "bg-white text-black font-semibold"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                <Globe className="h-3 w-3" /> Ülkeler
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10">
              {results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`group flex cursor-pointer items-center justify-between rounded-xl p-3 transition-colors ${
                          isSelected
                            ? "bg-white/10 text-white"
                            : "text-white/80 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Image thumbnail */}
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              unoptimized={item.image.includes("upload.wikimedia.org")}
                              sizes="48px"
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <span className="absolute bottom-0.5 right-0.5 text-[14px] leading-none drop-shadow">
                              {item.flag}
                            </span>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-[15px] truncate text-white">
                                {item.title}
                              </h4>
                              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/70 uppercase font-semibold">
                                {item.type === "country" ? "Ülke" : "Şehir"}
                              </span>
                            </div>
                            <p className="mt-0.5 text-[12.5px] text-white/50 truncate">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="ml-3 flex items-center gap-2 shrink-0">
                          {isSelected && (
                            <span className="hidden sm:flex items-center gap-1 text-[11px] text-white/50">
                              Git <CornerDownLeft className="h-3 w-3" />
                            </span>
                          )}
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                              isSelected
                                ? "border-white/40 bg-white text-black"
                                : "border-white/10 bg-white/5 text-white/50 group-hover:border-white/20 group-hover:text-white"
                            }`}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="px-6 py-12 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white/40">
                    <Search className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-medium text-[15px] text-white">
                    Sonuç bulunamadı
                  </h3>
                  <p className="mt-1 text-[13px] text-white/50">
                    &quot;{query}&quot; ile eşleşen bir şehir veya ülke bulunamadı.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                    <span className="text-[12px] text-white/40">Örnek aramalar:</span>
                    {["Tokyo", "Paris", "New York", "Roma", "Japonya", "Seul"].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setQuery(tag);
                          setSelectedIndex(0);
                        }}
                        className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[12px] text-white/70 hover:border-white/40 hover:text-white transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 text-[11px] text-white/40">
              <span>Wangoh Seyahat & Keşif Rehberi</span>
              <span className="text-white/30">Hızlı Arama</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
