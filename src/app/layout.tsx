import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { SITE, absolute } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

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
    <html lang="tr" className={`${geistSans.variable} ${display.variable} antialiased`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
