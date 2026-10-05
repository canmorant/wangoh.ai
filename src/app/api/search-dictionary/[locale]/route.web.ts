import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { destinationDictionary } from "@/content/i18n/destinations";

// Her dilin küçük arama sözlüğü bir kez üretilir ve statik dosya olarak sunulur.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return new Response(null, { status: 404 });
  return Response.json(destinationDictionary(locale), {
    headers: { "Cache-Control": "public, max-age=0, s-maxage=86400, must-revalidate" },
  });
}
