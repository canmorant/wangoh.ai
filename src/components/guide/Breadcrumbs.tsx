import Link from "next/link";

export interface Crumb {
  name: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Sayfa yolu" className="mb-8">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] tracking-[0.14em] text-white/35 uppercase">
        {items.map((c, i) => (
          <li key={c.name} className="flex items-center gap-2">
            {c.href ? (
              <Link href={c.href} className="transition-colors duration-300 hover:text-white/80">
                {c.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-white/60">{c.name}</span>
            )}
            {i < items.length - 1 && <span className="text-white/15">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
