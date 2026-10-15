import type { GuideTemplates } from "./types";

/* Kural için en.ts başlığına bakın: yer adları edat/çekim konumuna girmez
 * ("an der Algarve", "im Schwarzwald" gibi artikel sorunları olmasın). */
export const de: GuideTemplates = {
  expanded: {
    seoTitle: (city, focus) => `Reiseführer ${city}: ${focus}`,
    metaLead: (city, lede) => `Reiseführer ${city}: ${lede}`,
    h1: (city) => `Reiseführer ${city}`,
    characterHeading: (city) => `${city} im Überblick: die Route richtig planen`,
    sightsHeading: (city) => `${city}: Sehenswürdigkeiten`,
    sightsIntro: () =>
      "Wenn du die Liste danach ordnest, was auf der Karte nah beieinanderliegt, läufst du keine Wege doppelt und verschenkst das beste Tageslicht nicht an Transfers. Leg die großen Stationen mit Ticket zuerst fest und setz Plätze, Parks, Märkte und Spaziergänge am Wasser dazwischen.",
    foodHeading: (city) => `${city}: Essen und Trinken`,
    footballHeading: (city) => `${city}: Fußball und Spieltag`,
    practicalHeading: (city) => `${city}: Gut zu wissen vor der Reise`,
  },
  shared: {
    bold: (name, detail) => `**${name}:** ${detail}`,
    bookingOrder: (sight) =>
      `Zuerst ${sight}, die Verbindungen zwischen den Städten und die Unterkunft fest buchen; flexible Mahlzeiten in den Vierteln erst danach.`,
    dailyPace: () =>
      "Pack nicht drei weit auseinanderliegende Gegenden in einen Tag. Ein Haupterlebnis, ein Viertel und ein ausgiebiges Essen ergeben hier einen Rhythmus, den du durchhältst.",
    faqDays: (city) => `${city}: Wie viele Tage brauche ich?`,
    faqStay: (city) => `${city}: Wo übernachte ich am besten?`,
    faqWhen: (city) => `${city}: Wann ist die beste Reisezeit?`,
    faqCombine: (city) => `${city}: Womit lässt es sich gut kombinieren?`,
    relatedAnchor: (city) => `Reiseführer ${city}`,
    relatedDescription: () => "Bringt einen anderen Stadtrhythmus und eine neue Ebene in die Route.",
    day1Morning: (sight) =>
      `${sight}: früh starten und Fragen zu Einlass oder Anreise gleich am Morgen klären.`,
    day2Morning: (sight) => `${sight}: die Hauptroute erledigen, bevor es voll wird.`,
    day3Morning: (sight) => `${sight}: Wetter, Tickets oder Transfer am Vorabend bestätigen.`,
  },
  regional: {
    character: (_city, area1, area2, s1, s2, s3) =>
      `Entscheidend ist hier, zwischen ${area1} und ${area2} nicht nur auf die Wahrzeichen zu achten, sondern auch auf den Alltag. ${s1}, ${s2} und ${s3} müssen nicht in einen Tag gequetscht werden; ein Haupterlebnis, ein Viertel und ein ausgiebiges Essen ergeben einen stärkeren Rhythmus.`,
    stay: (area1, area2) =>
      `Beim ersten Besuch bist du mit einer Unterkunft in der Gegend ${area1} nah an der wichtigsten Route; für lokalere Abende und oft ruhigere Nächte ist ${area2} eine gute Alternative. Achte nicht nur auf die Entfernung auf der Karte, sondern auch auf den Start am Morgen und die letzte Verbindung mit Bus und Bahn.`,
    evening: (area2, sight) =>
      `Plane rund um ${area2} ein Abendessen und einen kurzen Spaziergang. Halte das Nachtleben so, dass die Reservierung für ${sight} am nächsten Morgen nicht leidet; nimm für späte Rückwege ein lizenziertes Taxi oder eine offizielle App.`,
    souvenirs: (food) =>
      `${food} und lokale Erzeugnisse sind gute Mitbringsel. Kauf keine geschützten Naturprodukte, keine Antiquitäten ohne Papiere und keine Lebensmittel, bei denen Gepäck- und Zollregeln unklar sind.`,
    season: (best) =>
      `Für die meisten Reisenden ist ${best} das ausgewogenste Zeitfenster, doch Durchschnittswetter ist keine Tagesprognose. Ordne Stadt-, Küsten- oder Bergtage in den letzten 48 Stunden anhand offizieller Wetter- und Betreiberhinweise neu.`,
    budget: (sight) =>
      `Kalkuliere zuerst Unterkunft, Verbindungen zwischen den Städten und ein Haupterlebnis wie ${sight}. Plane danach Geld für Nahverkehr, Essen, Gepäck und den Transfer auf der letzten Strecke ein; Flug plus Hotel ist noch nicht das Reisebudget.`,
    day1Title: (sight) => `Tag 1 — ${sight} und ein erstes Viertel`,
    day1Afternoon: (area) => `Durch ${area} spazieren und Zeit für eine spontane Kaffeepause lassen.`,
    day1Evening: (food) => `Den Tag mit einem entspannten Abendessen ausklingen lassen — Schwerpunkt: ${food}.`,
    day2Title: (sight) => `Tag 2 — ${sight} und der lokale Rhythmus`,
    day2Afternoon: (area) => `Kleine Straßen, Märkte und Alltag in ${area} ins Programm nehmen.`,
    day2Evening: (food) => `${food}: Zutaten, Portionsgröße und Reservierung vorher klären.`,
    day3Title: (sight) => `Tag 3 — ${sight} und die Umgebung`,
    day3Afternoon: (dayTrip) => `${dayTrip}: je nach Energie und letzter Rückverbindung einplanen.`,
    faqDaysAnswer: (days) =>
      `Mit ${days} gelingt ein ausgewogener erster Besuch. Wenn du Zeit für Viertel, Essen und mögliche Verzögerungen durch Wetter oder Verkehr lässt, wird die Reise reicher.`,
    faqStayAnswer: (area1, area2) =>
      `${area1} ist für den ersten Besuch praktisch; ${area2} ist eine lokalere Alternative. Bewerte die Verbindungen am Morgen und in der Nacht zusammen mit dem Zimmerpreis.`,
    faqWhenAnswer: (best) =>
      `Am ausgewogensten ist meist ${best}; prüf trotzdem aktuelles Wetter, Festivals und Kapazitäten bei offiziellen Quellen.`,
    faqCarQuestion: (city) => `${city}: Brauche ich ein Auto?`,
    faqCarAnswer: (local) =>
      `Unterwegs vor Ort: ${local}. Bevor du ein Auto mietest, bedenke Parken, Führerschein, Versicherung, Kraftstoff und die Rückfahrt in der Nacht.`,
    faqCombineAnswer: (cities) =>
      `${cities} sind naheliegende nächste Stationen. Rechne mit der Reisezeit von Tür zu Tür statt mit der Entfernung auf der Karte.`,
  },
  world: {
    shopping: () =>
      "Quetsch das Einkaufen nicht in einen einzigen Touristenbasar. Prüfe bei lokalen Produkten, Design oder essbaren Mitbringseln Etikett, Festpreis und Gepäckregeln; kauf keine geschützten Naturprodukte und keine Antiquitäten ohne Papiere.",
    season: (best) =>
      `Auch wenn ${best} im Kalender heraussticht, können Schulferien, Nationalfeiertage, Festivals und Wochenendandrang das Erlebnis verändern. Verwechsle Durchschnittswetter nicht mit einer kurzfristigen Prognose; plane für jeden Tag im Freien eine Alternative drinnen oder einen gemütlichen Spaziergang durchs Viertel ein.`,
    budget: (sight) =>
      `Kalkuliere zuerst Unterkunft, Verbindungen zwischen den Städten und Haupterlebnisse wie ${sight}. Leg für kleine Zahlungen, Gepäck, Buchungsgebühren und den Transfer auf der letzten Strecke einen eigenen Betrag zurück; Flug plus Hotel ist noch nicht das Reisebudget.`,
    day1Title: (sight) => `Tag 1 — ${sight} und erstes Kennenlernen`,
    day1Afternoon: (area) => `${area} zu Fuß erkunden und Zeit für eine spontane Kaffeepause lassen.`,
    day1Evening: () => "Den Abend mit einem entspannten Essen aus der lokalen Küche ausklingen lassen.",
    day2Title: (sight) => `Tag 2 — ${sight} und die Viertel`,
    day2Afternoon: (area) => `Kleine Straßen, Märkte und Alltag in ${area} ins Programm nehmen.`,
    day3Title: (sight) => `Tag 3 — ${sight} und ein flexibler Abschluss`,
    faqDaysAnswer: (days) =>
      `Mit ${days} gelingt ein ausgewogener erster Besuch. Statt nur die Hauptsehenswürdigkeiten abzuhaken, lass Zeit für Viertel, Essen und mögliche Verzögerungen durch Wetter oder Verkehr — dann erschließt sich der Ort viel besser.`,
    faqWhenAnswer: (best, season) => `Am ausgewogensten ist meist ${best}. ${season}`,
    faqCarQuestion: (city) => `${city}: Sollte ich ein Auto mieten?`,
    faqCarAnswer: (local) =>
      `Unterwegs vor Ort: ${local}. Bevor du dich für ein Auto entscheidest, bedenke Parken, Führerschein, Versicherung und die Rückfahrt in der Nacht.`,
    faqCombineAnswer: (cities) =>
      `${cities} sind in diesem Reiseführer die naheliegenden nächsten Stationen. Schau nicht nur auf die Entfernung auf der Karte, sondern auf die echte Reisezeit von Tür zu Tür.`,
  },
};
