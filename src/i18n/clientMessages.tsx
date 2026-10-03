import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

/**
 * Tarayıcıya giden mesajlar sayfa bazında.
 *
 * Kök layout yalnız her sayfada bulunan istemci bileşenlerinin mesajını
 * (dil seçici) veriyor; büyük istemci ağaçları olan sayfalar (ana sayfa,
 * testler, bayrak oyunu) kendi ihtiyaçlarını <ClientMessages> ile ekliyor.
 * Böylece örneğin bir şehir rehberi ana sayfa animasyonlarının metinlerini
 * HTML'inde taşımıyor.
 *
 * Bir istemci bileşeni yeni bir namespace kullanmaya başlarsa ilgili listeye
 * eklenmeli; scripts/i18n.test.ts kullanılan her namespace'in en az bir
 * listede olduğunu, tarayıcı da eksikleri MISSING_MESSAGE olarak denetler.
 */
export const CLIENT_NAMESPACES = {
  /** Her sayfa: SiteFooter içindeki dil seçici. */
  global: ["LanguageSwitcher"],
  home: [
    "LanguageSwitcher",
    "Nav",
    "Home",
    "Hero",
    "Search",
    "Destinations",
    "BoardingPass",
    "TravelData",
    "Flight",
    "CityCards",
    "ClubReveal",
    "SecretRoute",
    "Wheel",
    "Geo",
    "Common",
    "Footer",
  ],
  tests: ["LanguageSwitcher", "TravelTest"],
  flags: ["LanguageSwitcher", "FlagGame", "Geo", "Common"],
} as const;

type Namespace = (typeof CLIENT_NAMESPACES)[keyof typeof CLIENT_NAMESPACES][number];

export async function clientMessages(namespaces: readonly Namespace[]) {
  const messages = await getMessages();
  return Object.fromEntries(namespaces.map((ns) => [ns, messages[ns]]));
}

export async function ClientMessages({
  namespaces,
  children,
}: {
  namespaces: readonly Namespace[];
  children: ReactNode;
}) {
  return <NextIntlClientProvider messages={await clientMessages(namespaces)}>{children}</NextIntlClientProvider>;
}
