import { createElement, useMemo, type ComponentProps } from "react";
import { useLocale } from "next-intl";
import { createNavigation } from "next-intl/navigation";
import { routing, type AppLocale } from "./routing";
import { internalPath, localizePath } from "./paths";

/**
 * Dil farkında navigasyon. next/link ve next/navigation yerine bunlar
 * kullanılmalı: href'e o anki dilin önekini (gerekiyorsa) kendileri ekliyor
 * ve yolu o dilin adresine çeviriyor (bkz. ./paths):
 *
 *   <Link href="/fransa/paris">        → tr: /fransa/paris, en: /en/france/paris
 *   getPathname({ href, locale })      → aynı kural, istemcide de çalışır
 *   usePathname()                      → her dilde İÇ yol ("/fransa/paris")
 *
 * Kodda her zaman iç (Türkçe) yol yazılır; dile özgü adres yalnız burada
 * üretilir.
 */
const nav = createNavigation(routing);

type Href = ComponentProps<typeof nav.Link>["href"];

function localizeHref<H extends Href>(href: H, locale: AppLocale): H {
  if (typeof href === "string") return localizePath(href, locale) as H;
  if (href && typeof href === "object" && typeof href.pathname === "string") {
    return { ...href, pathname: localizePath(href.pathname, locale) } as H;
  }
  return href;
}

export function Link({ href, locale, ...rest }: ComponentProps<typeof nav.Link>) {
  const current = useLocale() as AppLocale;
  return createElement(nav.Link, {
    href: localizeHref(href, (locale ?? current) as AppLocale),
    locale,
    ...rest,
  });
}

export const getPathname: typeof nav.getPathname = (args) =>
  nav.getPathname({ ...args, href: localizeHref(args.href, args.locale as AppLocale) });

export const redirect: typeof nav.redirect = (args, ...rest) =>
  nav.redirect({ ...args, href: localizeHref(args.href, args.locale as AppLocale) }, ...rest);

export const permanentRedirect: typeof nav.permanentRedirect = (args, ...rest) =>
  nav.permanentRedirect({ ...args, href: localizeHref(args.href, args.locale as AppLocale) }, ...rest);

export function usePathname(): string {
  const pathname = nav.usePathname();
  const locale = useLocale() as AppLocale;
  return internalPath(pathname, locale);
}

export function useRouter(): ReturnType<typeof nav.useRouter> {
  const router = nav.useRouter();
  const locale = useLocale() as AppLocale;
  return useMemo(() => {
    const target = (options?: { locale?: string }) => (options?.locale ?? locale) as AppLocale;
    return {
      ...router,
      push: (href, options) => router.push(localizeHref(href, target(options)), options),
      replace: (href, options) => router.replace(localizeHref(href, target(options)), options),
      prefetch: (href, options) => router.prefetch(localizeHref(href, target(options)), options),
    };
  }, [router, locale]);
}
