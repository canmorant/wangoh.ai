import type { Metadata } from "next";
import { absolute } from "@/lib/site";

export const metadata: Metadata = {
  title: "Lumora — Clarity in an Endlessly Noisy Universe",
  description: "A mindfulness and focus app to protect your presence and create with intention.",
  alternates: { canonical: absolute("/lumora") },
  robots: { index: false, follow: false, noarchive: true },
};

export default function LumoraLayout({ children }: { children: React.ReactNode }) {
  return children;
}
