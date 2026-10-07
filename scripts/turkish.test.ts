/** Şehir adlarına gelen Türkçe çekim ekleri. Çalıştır: npx tsx scripts/turkish.test.ts */
import assert from "node:assert/strict";
import { turkishAccusative as acc, turkishDativeCase as dat, turkishLocative as loc } from "../src/lib/turkish";

const cases: [string, string, string, string][] = [
  // ad, bulunma, yönelme, belirtme
  ["Londra", "Londra'da", "Londra'ya", "Londra'yı"],
  ["İstanbul", "İstanbul'da", "İstanbul'a", "İstanbul'u"],
  ["Berlin", "Berlin'de", "Berlin'e", "Berlin'i"],
  ["Paris", "Paris'te", "Paris'e", "Paris'i"],
  ["Madrid", "Madrid'de", "Madrid'e", "Madrid'i"],
  ["Barcelona", "Barcelona'da", "Barcelona'ya", "Barcelona'yı"],
  ["Viyana", "Viyana'da", "Viyana'ya", "Viyana'yı"],
  ["Köln", "Köln'de", "Köln'e", "Köln'ü"],
  ["Münih", "Münih'te", "Münih'e", "Münih'i"],
  ["Kaş", "Kaş'ta", "Kaş'a", "Kaş'ı"],
  ["Girit", "Girit'te", "Girit'e", "Girit'i"],
  ["Tokyo", "Tokyo'da", "Tokyo'ya", "Tokyo'yu"],
  ["Seul", "Seul'de", "Seul'e", "Seul'ü"],
  ["Nice", "Nice'te", "Nice'e", "Nice'i"],
  ["Los Angeles", "Los Angeles'ta", "Los Angeles'a", "Los Angeles'ı"],
  ["Toba Gölü", "Toba Gölü'nde", "Toba Gölü'ne", "Toba Gölü'nü"],
  ["Amalfi Kıyısı", "Amalfi Kıyısı'nda", "Amalfi Kıyısı'na", "Amalfi Kıyısı'nı"],
  ["Wachau Vadisi", "Wachau Vadisi'nde", "Wachau Vadisi'ne", "Wachau Vadisi'ni"],
  ["Çek Cumhuriyeti", "Çek Cumhuriyeti'nde", "Çek Cumhuriyeti'ne", "Çek Cumhuriyeti'ni"],
  ["Lake District", "Lake District'te", "Lake District'e", "Lake District'i"],
  ["Tromsø", "Tromsø'de", "Tromsø'ye", "Tromsø'yü"],
];
for (const [name, l, d, a] of cases) {
  assert.equal(loc(name), l, `bulunma: ${name}`);
  assert.equal(dat(name), d, `yönelme: ${name}`);
  assert.equal(acc(name), a, `belirtme: ${name}`);
}
console.log(`${cases.length} ad × 3 hâl doğru.`);
