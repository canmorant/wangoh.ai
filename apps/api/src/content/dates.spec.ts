import { describe, expect, it } from "vitest";
import { isCalendarDate } from "./dates.js";

describe("isCalendarDate", () => {
  it("takvimde var olan günleri kabul eder (artık yıl dahil)", () => {
    for (const value of ["2026-01-31", "2026-12-31", "2024-02-29", "2000-02-29", "2026-04-30", "0000-01-01", "9999-12-31"]) {
      expect(isCalendarDate(value), value).toBe(true);
    }
  });

  it("olmayan günleri, ayları ve biçimi bozuk değerleri reddeder", () => {
    for (const value of ["2026-13-45", "0000-00-00", "9999-99-99", "2026-00-10", "2026-01-00", "2026-04-31", "2025-02-29", "1900-02-29", "2026-02-30"]) {
      expect(isCalendarDate(value), value).toBe(false);
    }
    for (const value of ["", "2026-1-05", "31.01.2026", "2026/01/31", "2026-01-31 ", " 2026-01-31", "2026-01-31T00:00:00Z", "٢٠٢٦-٠١-٣١"]) {
      expect(isCalendarDate(value), JSON.stringify(value)).toBe(false);
    }
  });
});
