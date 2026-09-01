import { Country } from "./destinations";

/**
 * Not shown in the destinations grid. Reachable only by shaking the scroll —
 * see `useScrollShake`. Shaped as a Country so it can reuse the flight
 * animation and city view unchanged.
 */
export const SECRET_DESTINATION: Country = {
  name: "Svalbard",
  code: "SJ",
  flag: "🇸🇯",
  description:
    "Yetmiş sekizinci enlem. Dört ay gün doğmuyor, dört ay batmıyor; insandan çok kutup ayısı var.",
  // Every image below was checked in-browser to be genuinely polar. Antarctic
  // imagery (penguins in particular) is deliberately excluded — wrong
  // hemisphere for a place whose copy mentions polar bears.
  image: "/images/photo-1531366936337-7c912a4589a7-c0909022.avif",
  coordinates: { lat: 78.2232, lng: 15.6469 },
  iata: "LYR",
  gateway: "Longyearbyen",
  capital: "Longyearbyen",
  flightTime: "7sa 45dk",
  accent: "#56d6b2",
  bestSeason: "Mart–Mayıs · Eylül–Ekim",
  budget: "Yüksek",
  signature: "Kutup gecesi — dört ay boyunca gün doğmuyor",
  cities: [
    {
      name: "Longyearbyen",
      description: "Dünyanın en kuzeydeki kasabası — buz dağının altında boyalı ahşap evler.",
      image: "/images/longyearbyen-spisshus-2022-e290d300.avif",
    },
    {
      name: "Ny-Ålesund",
      description: "Bir avuç bilim insanının neredeyse tam karanlıkta kışladığı araştırma yerleşimi.",
      image: "/images/ny-lesund-town-and-mine-museum-4b8593ab.avif",
    },
    {
      name: "Pyramiden",
      description: "1998'de bırakıldığı hâliyle donmuş, terk edilmiş bir Sovyet maden kasabası.",
      image: "/images/pyramiden-svalbard-buiobuione-bfe4be42.avif",
    },
    {
      name: "Barentsburg",
      description: "Hâlâ yaşayan, hâlâ Rus; yalnızca tekne ya da kar motoruyla ulaşılıyor.",
      image: "/images/barentsburg-late-winter-38f625de.avif",
    },
  ],
};
