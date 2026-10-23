import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildCountryFacts, countrySubtitle, flightFact, gatewayFact, joinCapitals, type CountryFactsSource } from "./facts";

const japan: CountryFactsSource = {
  name: "Japonya",
  officialName: "Japonya",
  capital: ["Tokyo"],
  subregion: "Doğu Asya",
  landlocked: false,
  travel: {
    capital: "Tokyo",
    gateway: "Tokyo",
    iata: "HND",
    flightTime: "11sa 30dk",
    bestSeason: "Mart–Mayıs · Ekim–Kasım",
    budgetLabel: "Yüksek",
  },
};

describe("buildCountryFacts", () => {
  it("seyahat rehberi olan ülkede beş kutu verir", () => {
    assert.deepEqual(buildCountryFacts(japan, "Asya"), [
      { label: "Başkent", value: "Tokyo" },
      { label: "Giriş noktası", value: "Tokyo · HND" },
      { label: "İstanbul’dan uçuş", value: "11sa 30dk" },
      { label: "En iyi dönem", value: "Mart–Mayıs · Ekim–Kasım" },
      { label: "Bütçe", value: "Yüksek" },
    ]);
  });

  it("seyahat başkenti yoksa dünya verisindeki başkente düşer", () => {
    const facts = buildCountryFacts({ ...japan, travel: { ...japan.travel!, capital: null } }, null);
    assert.equal(facts[0]?.value, "Tokyo");
  });

  it("olmayan alanı hiç göstermez", () => {
    const facts = buildCountryFacts(
      { ...japan, travel: { capital: null, gateway: null, iata: null, flightTime: null, bestSeason: "Kasım–Mart", budgetLabel: "" } },
      null,
    );
    assert.deepEqual(facts, [
      { label: "Başkent", value: "Tokyo" },
      { label: "En iyi dönem", value: "Kasım–Mart" },
    ]);
  });

  it("seyahat bilgisi olmayan ülkede temel dünya verisini verir", () => {
    const andorra: CountryFactsSource = {
      name: "Andorra",
      officialName: "Andorra Prensliği",
      capital: ["Andorra la Vella"],
      subregion: "Güney Avrupa",
      landlocked: true,
      travel: null,
    };
    assert.deepEqual(buildCountryFacts(andorra, "Avrupa"), [
      { label: "Başkent", value: "Andorra la Vella" },
      { label: "Resmî ad", value: "Andorra Prensliği" },
      { label: "Kıta", value: "Avrupa" },
      { label: "Alt bölge", value: "Güney Avrupa" },
      { label: "Denize kıyısı", value: "Yok" },
    ]);
  });

  it("resmî ad ülke adıyla aynıysa tekrarlamaz; kıta adı bilinmiyorsa Kıta kutusu çıkmaz", () => {
    const facts = buildCountryFacts({ ...japan, travel: null, capital: [] }, null);
    assert.deepEqual(facts, [{ label: "Alt bölge", value: "Doğu Asya" }]);
  });
});

describe("flightFact", () => {
  it("süre biçimindeki değeri İstanbul kalkışlı gösterir", () => {
    assert.deepEqual(flightFact("11sa 30dk"), { label: "İstanbul’dan uçuş", value: "11sa 30dk" });
    assert.deepEqual(flightFact("14sa+"), { label: "İstanbul’dan uçuş", value: "14sa+" });
  });

  it("süre olmayan metni (Türkiye) yalın etiketle verir", () => {
    assert.deepEqual(flightFact("Başlangıç noktası"), { label: "Uçuş süresi", value: "Başlangıç noktası" });
  });

  it("boşta null", () => {
    assert.equal(flightFact(null), null);
    assert.equal(flightFact("  "), null);
  });
});

describe("gatewayFact / joinCapitals / countrySubtitle", () => {
  it("giriş noktası şehir ve IATA'dan hangisi varsa onu verir", () => {
    assert.deepEqual(gatewayFact("Roma", "FCO"), { label: "Giriş noktası", value: "Roma · FCO" });
    assert.deepEqual(gatewayFact(null, "FCO"), { label: "Giriş noktası", value: "FCO" });
    assert.deepEqual(gatewayFact("Roma", null), { label: "Giriş noktası", value: "Roma" });
    assert.equal(gatewayFact(null, ""), null);
  });

  it("birden çok başkenti virgülle birleştirir", () => {
    assert.equal(joinCapitals(["Pretoria", "Cape Town", "Bloemfontein"]), "Pretoria, Cape Town, Bloemfontein");
    assert.equal(joinCapitals([]), null);
    assert.equal(joinCapitals([" "]), null);
    assert.equal(joinCapitals(undefined), null);
  });

  it("konum satırını kıta ve alt bölgeden kurar", () => {
    assert.equal(countrySubtitle("Asya", "Doğu Asya"), "Asya · Doğu Asya");
    assert.equal(countrySubtitle("Asya", null), "Asya");
    assert.equal(countrySubtitle(null, "Doğu Asya"), "Doğu Asya");
    assert.equal(countrySubtitle(null, null), undefined);
  });
});
