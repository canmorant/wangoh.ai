import { describe, expect, it } from "vitest";
import { flagUrl, imageUrl, isAcceptedImage, isHttpsUrl } from "./assets.js";

const BASE = "https://wangoh.com";

describe("imageUrl", () => {
  it("web AVIF yolu → /og/<ad>.jpg (JPEG varyantı)", () => {
    expect(imageUrl(BASE, "/images/photo-1493976040374-85c8e12f0c0e-9fc55608.avif")).toBe(`${BASE}/og/photo-1493976040374-85c8e12f0c0e-9fc55608.jpg`);
  });

  it("https adresi olduğu gibi kalır", () => {
    expect(imageUrl(BASE, "https://example.com/a.jpg?x=1")).toBe("https://example.com/a.jpg?x=1");
  });

  it("boş değer null; /og kuralına uymayan web yolu mutlaklaştırılır (AVIF'e dokunulmaz)", () => {
    expect(imageUrl(BASE, null)).toBeNull();
    expect(imageUrl(BASE, "")).toBeNull();
    expect(imageUrl(BASE, "/images/Buyuk-Harf.avif")).toBe(`${BASE}/images/Buyuk-Harf.avif`);
    expect(imageUrl(BASE, "/images/x.png")).toBe(`${BASE}/images/x.png`);
    expect(imageUrl("http://localhost:3000", "/images/a-b.avif")).toBe("http://localhost:3000/og/a-b.jpg");
  });
});

describe("flagUrl", () => {
  it("küçük harfli iso2 ile SVG", () => {
    expect(flagUrl(BASE, "FR")).toBe(`${BASE}/flags/fr.svg`);
    expect(flagUrl(BASE, "sj")).toBe(`${BASE}/flags/sj.svg`);
  });
});

describe("isHttpsUrl / isAcceptedImage", () => {
  it.each([
    ["https://example.com/a", true],
    ["https://sub.example.com/path?q=1#x", true],
    ["http://example.com/a", false],
    ["javascript:alert(1)", false],
    ["data:text/html;base64,AAAA", false],
    ["//example.com/a", false],
    ["https://user:pass@example.com/", false],
    ["https://localhost/", false],
    ["https://exa mple.com/", false],
    ["https://example.com/\u0000", false],
    ["ftp://example.com/", false],
    ["", false],
  ])("%s → %s", (value, expected) => {
    expect(isHttpsUrl(value)).toBe(expected);
  });

  it("görsel: AVIF yolu ya da https; başka yol reddedilir", () => {
    expect(isAcceptedImage("/images/photo-1-abcdef12.avif")).toBe(true);
    expect(isAcceptedImage("https://example.com/a.jpg")).toBe(true);
    expect(isAcceptedImage("/images/x.png")).toBe(false);
    expect(isAcceptedImage("/etc/passwd")).toBe(false);
    expect(isAcceptedImage("http://example.com/a.jpg")).toBe(false);
  });
});
