import { Country, ORIGIN } from "@/data/destinations";

export interface BoardingDetails {
  flight: string;
  gate: string;
  seat: string;
  boards: string;
  date: string;
  sequence: string;
  from: string;
  to: string;
}

/**
 * Derived deterministically from the country code — never Math.random().
 * Random values here would differ between the server render and the client
 * hydration and blow up as a mismatch, and they would also reshuffle on every
 * re-render, which destroys the illusion that this is *your* ticket.
 */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function boardingFor(country: Country): BoardingDetails {
  const h = hash(country.code + country.name);
  const hh = 6 + (h % 16);
  const mm = (h >> 3) % 60;

  return {
    flight: `WG ${(h % 899) + 100}`,
    gate: `${"ABCDE"[h % 5]}${((h >> 5) % 34) + 1}`,
    seat: `${((h >> 7) % 18) + 1}${"ABCDEF"[(h >> 2) % 6]}`,
    boards: `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`,
    // Static label — a real date would go stale and force a client-only render.
    date: "SEASON OPEN",
    sequence: String((h % 180) + 1).padStart(3, "0"),
    from: ORIGIN.iata,
    to: (country.shortName || country.name).toUpperCase(),
  };
}

/**
 * Deterministic barcode bar widths, so the SVG is identical on server and
 * client and stays stable across renders.
 */
export function barcodeBars(seed: string, count = 46): number[] {
  let h = hash(seed);
  const bars: number[] = [];
  for (let i = 0; i < count; i++) {
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    bars.push(1 + (Math.abs(h) % 4));
  }
  return bars;
}
