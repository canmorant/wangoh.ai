import type { GuideTemplates } from "./types";

/*
 * Kural (tüm Türkçe dışı paketler): yer adları (şehir, bölge, semt, gezi
 * noktası) edat/çekim gerektiren konuma girmez. "the Lake District",
 * "the Algarve", "the Azores" gibi artikel isteyen bölge adları da olduğu için
 * yer adı başlık biçiminde, iki nokta ile ya da ad öbeği olarak kullanılır.
 */
export const en: GuideTemplates = {
  expanded: {
    seoTitle: (city, focus) => `${city} Travel Guide: ${focus}`,
    metaLead: (city, lede) => `${city} travel guide: ${lede}`,
    h1: (city) => `${city} Travel Guide`,
    characterHeading: (city) => `${city} at a glance: planning the right route`,
    sightsHeading: (city) => `${city}: things to see`,
    sightsIntro: () =>
      "Grouping the list by what is close together on the map stops you retracing your steps and spending the day's best light on transfers. Fix the big ticketed stops first, then slot squares, parks, markets and waterfront walks in between.",
    foodHeading: (city) => `${city} food and drink guide`,
    footballHeading: (city) => `${city}: football and match day`,
    practicalHeading: (city) => `${city}: what to know before you go`,
  },
  shared: {
    bold: (name, detail) => `**${name}:** ${detail}`,
    bookingOrder: (sight) =>
      `Lock in ${sight}, intercity connections and accommodation first; fix flexible neighbourhood meals later.`,
    dailyPace: () =>
      "Don't put three far-apart areas into one day. One main experience, one neighbourhood and one long meal make for a more sustainable rhythm here.",
    faqDays: (city) => `${city}: how many days do you need?`,
    faqStay: (city) => `${city}: where should you stay?`,
    faqWhen: (city) => `${city}: when is the best time to go?`,
    faqCombine: (city) => `${city}: what does it combine well with?`,
    relatedAnchor: (city) => `${city} travel guide`,
    relatedDescription: () => "Adds a different city rhythm and a new layer to the route.",
    day1Morning: (sight) =>
      `Start early with ${sight}; sort out any entry or transport uncertainty at the beginning of the day.`,
    day2Morning: (sight) => `Cover the main route around ${sight} before the crowds build.`,
    day3Morning: (sight) => `Confirm the weather, tickets or transfers for ${sight} the night before.`,
  },
  regional: {
    character: (_city, area1, area2, s1, s2, s3) =>
      `The key here is to watch everyday life between ${area1} and ${area2}, not just the landmarks. ${s1}, ${s2} and ${s3} don't have to be squeezed into the same day; one main experience, one neighbourhood and one long meal give a stronger rhythm.`,
    stay: (area1, area2) =>
      `On a first visit, staying around ${area1} keeps you close to the main sightseeing route; for more local evenings and often quieter accommodation, ${area2} is a good alternative. Look not only at the distance on the map but at your morning start and the last public transport.`,
    evening: (area2, sight) =>
      `Plan dinner and a short walk around ${area2}. Keep nightlife to a level that won't spoil the next morning's booking for ${sight}; for late returns use a licensed taxi or an official app.`,
    souvenirs: (food) =>
      `${food} and locally made products make good gifts. Don't buy protected natural products, undocumented antiques or food with unclear baggage and customs rules.`,
    season: (best) =>
      `For most visitors the most balanced window is ${best}, but average weather is not a daily forecast. Reorder city, coast or mountain days in the last 48 hours using official weather and operator updates.`,
    budget: (sight) =>
      `First price accommodation, intercity connections and a main experience such as ${sight}. Then set money aside for local transport, meals, luggage and last-mile transfers; don't mistake the flight-plus-hotel total for the trip budget.`,
    day1Title: (sight) => `Day 1 — ${sight} and a first neighbourhood`,
    day1Afternoon: (area) => `Walk around ${area} and leave room for an unplanned coffee break.`,
    day1Evening: (food) => `End the day with a relaxed dinner built around ${food}.`,
    day2Title: (sight) => `Day 2 — ${sight} and the local rhythm`,
    day2Afternoon: (area) => `Add the small streets, markets and everyday life around ${area} to the plan.`,
    day2Evening: (food) => `For ${food}, ask about ingredients, portions and booking in advance.`,
    day3Title: (sight) => `Day 3 — ${sight} and the surroundings`,
    day3Afternoon: (dayTrip) => `Fit in ${dayTrip} according to your energy and the last connection back.`,
    faqDaysAnswer: (days) =>
      `A stay of ${days} makes for a balanced first visit. Leave room for neighbourhoods, food and possible weather or transport delays and the trip becomes more rewarding.`,
    faqStayAnswer: (area1, area2) =>
      `${area1} is practical for a first visit; ${area2} is a more local alternative. Weigh the morning and late-night connections together with the room price.`,
    faqWhenAnswer: (best) =>
      `The most balanced period is generally ${best}; still, check the latest weather, festivals and capacity with official sources.`,
    faqCarQuestion: (city) => `${city}: do you need a car?`,
    faqCarAnswer: (local) =>
      `Getting around: ${local}. Before renting, weigh up parking, licence, insurance, fuel and getting back at night together.`,
    faqCombineAnswer: (cities) =>
      `${cities} are natural next stops. Use door-to-door travel time rather than distance on the map.`,
  },
  world: {
    shopping: () =>
      "Don't squeeze your shopping into a single tourist bazaar. When buying local products, design or food gifts, check the label, fixed prices and baggage rules; don't buy protected natural products or undocumented antiques.",
    season: (best) =>
      `Even if ${best} stands out on the calendar, school holidays, national holidays, festivals and weekend crowds can change the experience. Don't treat average weather as a last-minute forecast; give every outdoor day an indoor or slow neighbourhood-walk alternative.`,
    budget: (sight) =>
      `Price accommodation, intercity connections and main experiences such as ${sight} first. Set aside a separate amount for small payments, luggage, booking fees and last-mile transfers; don't mistake the flight-plus-hotel total for the travel budget.`,
    day1Title: (sight) => `Day 1 — ${sight} and getting to know the city`,
    day1Afternoon: (area) => `Take in ${area} on foot and leave room for an unplanned coffee break.`,
    day1Evening: () => "Round off the evening with a relaxed meal of local dishes.",
    day2Title: (sight) => `Day 2 — ${sight} and the neighbourhoods`,
    day2Afternoon: (area) => `Add the small streets, markets and local daily life around ${area} to the plan.`,
    day3Title: (sight) => `Day 3 — ${sight} and a flexible finish`,
    faqDaysAnswer: (days) =>
      `A stay of ${days} makes for a balanced first visit. Rather than ticking off the main sights, leave room for neighbourhoods, food and possible weather or transport delays and the city opens up in a more meaningful way.`,
    faqWhenAnswer: (best, season) => `The most balanced period is generally ${best}. ${season}`,
    faqCarQuestion: (city) => `${city}: should you rent a car?`,
    faqCarAnswer: (local) =>
      `Getting around: ${local}. Before deciding on a car, weigh up parking, licence, insurance and getting back at night together.`,
    faqCombineAnswer: (cities) =>
      `${cities} are the natural next stops in this guide. Look not only at the distance on the map but at the real door-to-door travel time.`,
  },
};
