// Otomatik üretilir: node scripts/enrichment-register.mjs — elle düzenleme.
import type { Enrichment } from "../index";
import d0 from "./b01-1.json";
import d1 from "./b02-1.json";
import d2 from "./b02-2.json";
import d3 from "./b05-1.json";
import d4 from "./b05-2.json";
import d5 from "./b05-3.json";
import d6 from "./b07-1.json";
import d7 from "./b07-2.json";
import d8 from "./b07-3.json";
import d9 from "./b08-1.json";
import d10 from "./b08-2.json";
import d11 from "./b09-1.json";
import d12 from "./b10-1.json";
import d13 from "./b11-1.json";
import d14 from "./b12-1.json";
import d15 from "./b12-2.json";
import d16 from "./b13-1.json";
import d17 from "./b13-2.json";
import d18 from "./b13-3.json";
import d19 from "./pilot.json";

/** Kayıtlı veri dosyaları (hepsi birleştirilir). */
export const DATA_FILES = [d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17, d18, d19] as unknown as Record<string, Enrichment>[];
