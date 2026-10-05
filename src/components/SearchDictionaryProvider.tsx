"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ContentTextProvider } from "./ContentText";

type Dictionary = Record<string, string>;
const requests = new Map<string, Promise<Dictionary>>();

/** Arama açılınca yüklenir; aynı sözlük yüzlerce sayfanın çıktısına eklenmez. */
export default function SearchDictionaryProvider({ url, children }: { url: string; children: ReactNode }) {
  const [dictionary, setDictionary] = useState<Dictionary>({});

  useEffect(() => {
    let active = true;
    let request = requests.get(url);
    if (!request) {
      request = fetch(url).then(async (response) => {
        if (!response.ok) throw new Error("Search dictionary unavailable");
        return await response.json() as Dictionary;
      }).catch((error: unknown) => {
        requests.delete(url);
        throw error;
      });
      requests.set(url, request);
    }
    void request.then((value) => {
      if (active) setDictionary(value);
    }).catch(() => {
      // Çevrimdışıysa kaynak yer adlarıyla arama çalışmaya devam eder.
    });
    return () => { active = false; };
  }, [url]);

  return <ContentTextProvider dictionary={dictionary}>{children}</ContentTextProvider>;
}
