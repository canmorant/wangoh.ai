import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";
import { SITE, absolute } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "Wangoh — Hiç Gitmediğin Bir Yere Var",
  description:
    "Dünyanın en güzel şehirlerine açılan bir cam kenarı. Unutulmaz rotalar, büyüleyici duraklar, kesintisiz tek bir manzara.",
  keywords: ["seyahat", "keşif", "uçuş", "rotalar", "wangoh"],
  alternates: { canonical: absolute("/") },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${GeistSans.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
