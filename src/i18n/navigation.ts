import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Dil farkında navigasyon. next/link ve next/navigation yerine bunlar
 * kullanılmalı: href'e o anki dilin önekini (gerekiyorsa) kendileri ekliyor.
 *
 *   <Link href="/japonya">           → tr: /japonya, en: /en/japonya
 *   getPathname({ href, locale })    → aynı kural, istemcide de çalışır
 */
export const { Link, redirect, permanentRedirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
