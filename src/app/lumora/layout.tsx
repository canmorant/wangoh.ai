/* eslint-disable @next/next/no-page-custom-font -- isolated concept route owns its font */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lumora — Clarity in an Endlessly Noisy Universe",
  description: "A mindfulness and focus app to protect your presence and create with intention.",
};

export default function LumoraLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
      {children}
    </>
  );
}
