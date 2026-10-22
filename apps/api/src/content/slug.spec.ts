import { describe, expect, it } from "vitest";
import { MAX_SLUG_LENGTH, SLUG_PATTERN, slugify } from "./slug.js";

describe("slugify (web ile aynı kurallar)", () => {
  it.each([
    ["Tokyo", "tokyo"],
    ["İstanbul", "istanbul"],
    ["Şanlıurfa", "sanliurfa"],
    ["Kuşadası", "kusadasi"],
    ["Amalfi Kıyısı", "amalfi-kiyisi"],
    ["Ny-Ålesund", "ny-alesund"],
    ["Tromsø", "tromso"],
    ["Šibenik", "sibenik"],
    ["Gjirokastër", "gjirokaster"],
    ["Koh Samui", "koh-samui"],
    ["  Los  Angeles  ", "los-angeles"],
    ["Mexico City", "mexico-city"],
    ["!!!", ""],
  ])("%s → %s", (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });

  it("üretilen slug geçerli desene uyar (boş değilse)", () => {
    for (const name of ["İzmir", "Çanakkale", "Ürgüp", "Bad Ischl", "Zürich"]) {
      const slug = slugify(name);
      expect(slug.length).toBeGreaterThan(0);
      expect(slug.length).toBeLessThanOrEqual(MAX_SLUG_LENGTH);
      expect(SLUG_PATTERN.test(slug)).toBe(true);
    }
  });
});
