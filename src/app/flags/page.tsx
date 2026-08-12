import type { Metadata } from "next";
import FlagGame from "@/features/flag-game/FlagGame";

export const metadata: Metadata = {
  title: "Wangoh — Bayrağı Bil",
  description:
    "Dünyadaki her bayrak, teker teker. Üç ipucu, her biri daha az puan. Nereye kadar gidebilirsin?",
};

export default function FlagsPage() {
  return <FlagGame />;
}
