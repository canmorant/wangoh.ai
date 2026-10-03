import { notFound } from "next/navigation";

/**
 * Hiçbir route'a uymayan derin yollar (/en/a/b/c) kök 404'e değil, dilin
 * kendi 404'üne ([locale]/not-found.tsx) düşsün diye. Tek ve iki parçalı
 * yollar zaten [ulke] ve [ulke]/[sehir]'e gidiyor; Next onları bu genel
 * yakalayıcıdan önce eşliyor.
 */
export default function CatchAll() {
  notFound();
}
