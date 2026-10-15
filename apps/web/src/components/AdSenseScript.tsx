"use client";

import Script from "next/script";
import { ADSENSE_CLIENT } from "@/lib/adsense";

export default function AdSenseScript() {
  if (!ADSENSE_CLIENT) return null;

  return (
    <Script
      id="google-adsense"
      strategy="afterInteractive"
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
    />
  );
}
