"use client";

import { useEffect } from "react";

/**
 * Service worker kaydı.
 *
 * Sayfanın yükünü ağırlaştırmamak için `load` olayından sonra kaydediliyor:
 * ilk boyamayla yarışmasın. Geliştirme ortamında kayıt yapılmıyor, çünkü
 * önbellek HMR ile çakışıp değişikliklerin görünmemesine yol açıyor.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Kayıt başarısızsa site normal çalışmaya devam eder; sessizce geç.
      });
    };

    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });

    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
