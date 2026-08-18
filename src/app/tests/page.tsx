import type { Metadata } from "next";
import TravelTest from "@/components/TravelTest";
import { absolute } from "@/lib/site";

export const metadata: Metadata = {
  title: "Wangoh — Cam Kenarını Bul",
  description:
    "Beş soru, tek rota. Önce hangi şehri görmen gerektiğini söyleyen kısa bir test.",
  alternates: { canonical: absolute("/tests") },
};

export default function TestsPage() {
  return <TravelTest />;
}
