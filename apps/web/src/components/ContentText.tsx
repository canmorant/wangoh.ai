"use client";

import { createContext, useCallback, useContext, type ReactNode } from "react";
import { textKey } from "@/content/i18n/core";

/**
 * Ana sayfa gibi istemci bileşenlerinin gösterdiği Türkçe veri metinlerinin
 * (destinasyon açıklaması, şehir adı, slogan…) seçili dildeki hâli.
 *
 * Sözlüğü sunucu kurar (content/localized.ts → destinationDictionary) ve
 * yalnız o dilin çevirilerini gönderir; anahtar Türkçe metnin karması.
 * Türkçede sözlük boş, metinler olduğu gibi döner.
 */
const DictionaryContext = createContext<Record<string, string> | null>(null);

export function ContentTextProvider({
  dictionary,
  children,
}: {
  dictionary: Record<string, string>;
  children: ReactNode;
}) {
  return <DictionaryContext.Provider value={dictionary}>{children}</DictionaryContext.Provider>;
}

export function useContentText() {
  const dictionary = useContext(DictionaryContext);
  return useCallback(
    (source: string) => (dictionary ? (dictionary[textKey(source)] ?? source) : source),
    [dictionary]
  );
}
