import { NextResponse, type NextRequest } from "next/server";

/**
 * Ziyaretçinin yaklaşık konumu: uçuş animasyonunun kalkış noktası.
 *
 * Bilgi, Vercel'in her isteğe IP adresinden çıkarıp eklediği coğrafi
 * başlıklardan geliyor; üçüncü taraf bir servise sorulmuyor, IP adresi
 * yanıta konmuyor ve hiçbir yerde saklanmıyor. Şehir düzeyinde ve yaklaşık:
 * VPN ya da operatör merkezi yüzünden yanlış olabilir, bu yüzden arayüz
 * kullanıcıya kalkış şehrini değiştirme imkânı veriyor.
 *
 * Başlıklar yoksa (yerel geliştirme, başka barındırma) boş nesne döner;
 * istemci o zaman kalkış şehrini kullanıcıya sorar.
 *
 * Dosya adı route.web.ts: yalnız web derlemesinin pageExtensions listesinde.
 * Uygulama paketi statik export ve orada sunucu yok (bkz. next.config.ts).
 */
export function GET(request: NextRequest) {
  const headers = request.headers;
  const lat = Number(headers.get("x-vercel-ip-latitude") ?? NaN);
  const lng = Number(headers.get("x-vercel-ip-longitude") ?? NaN);
  const rawCity = headers.get("x-vercel-ip-city");
  let city: string | null = null;
  if (rawCity) {
    try {
      city = decodeURIComponent(rawCity);
    } catch {
      city = rawCity;
    }
  }

  const valid =
    Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;

  return NextResponse.json(valid ? { city, lat, lng } : {}, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
