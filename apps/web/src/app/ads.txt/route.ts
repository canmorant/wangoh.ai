import { ADSENSE_PUBLISHER } from "@/lib/adsense";

export const dynamic = "force-static";

export function GET() {
  const body = ADSENSE_PUBLISHER
    ? `google.com, ${ADSENSE_PUBLISHER}, DIRECT, f08c47fec0942fa0\n`
    : "# Google AdSense publisher ID is not configured yet.\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

