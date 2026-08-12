import type { Metadata } from "next";
import TravelTest from "@/components/TravelTest";

export const metadata: Metadata = {
  title: "Wangoh — Cam Kenarını Bul",
  description:
    "Beş soru, tek rota. Önce hangi şehri görmen gerektiğini söyleyen kısa bir test.",
};

export default function TestsPage() {
  return <TravelTest />;
}
