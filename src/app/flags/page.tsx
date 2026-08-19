import type { Metadata } from "next";
import FlagGame from "@/features/flag-game/FlagGame";
import { absolute } from "@/lib/site";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Wangoh — Bayrağı Bil",
  description:
    "Dünyadaki her bayrak, teker teker. Üç ipucu, her biri daha az puan. Nereye kadar gidebilirsin?",
  alternates: { canonical: absolute("/flags") },
};

export default function FlagsPage() {
  return (
    <>
      <FlagGame />
      <SiteFooter />
    </>
  );
}
