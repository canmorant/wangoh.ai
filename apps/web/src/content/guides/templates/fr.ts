import type { GuideTemplates } from "./types";

/* Kural için en.ts başlığına bakın: yer adları artikel/kesme gerektiren
 * konuma girmez ("au Japon", "d’Osaka", "sur la côte amalfitaine" gibi). */
export const fr: GuideTemplates = {
  expanded: {
    seoTitle: (city, focus) => `${city} : guide de voyage — ${focus}`,
    metaLead: (city, lede) => `${city}, guide de voyage : ${lede}`,
    h1: (city) => `${city} : guide de voyage`,
    characterHeading: (city) => `${city} en bref : bien construire son itinéraire`,
    sightsHeading: (city) => `${city} : que voir`,
    sightsIntro: () =>
      "Regrouper la liste selon ce qui est proche sur la carte évite de refaire les mêmes trajets et de gaspiller la plus belle lumière de la journée en transferts. Fixez d’abord les grandes étapes avec billet, puis glissez entre elles places, parcs, marchés et promenades au bord de l’eau.",
    foodHeading: (city) => `${city} : où et quoi manger`,
    footballHeading: (city) => `${city} : football et jour de match`,
    practicalHeading: (city) => `${city} : à savoir avant de partir`,
  },
  shared: {
    bold: (name, detail) => `**${name}** : ${detail}`,
    bookingOrder: (sight) =>
      `Réservez d’abord : ${sight}, les liaisons entre villes et l’hébergement ; calez ensuite les repas flexibles dans les quartiers.`,
    dailyPace: () =>
      "Ne mettez pas trois zones éloignées dans la même journée. Une expérience principale, un quartier et un long repas donnent ici un rythme plus tenable.",
    faqDays: (city) => `${city} : combien de jours prévoir ?`,
    faqStay: (city) => `${city} : où loger ?`,
    faqWhen: (city) => `${city} : quand partir ?`,
    faqCombine: (city) => `${city} : avec quoi combiner le voyage ?`,
    relatedAnchor: (city) => `${city} : guide de voyage`,
    relatedDescription: () => "Ajoute au parcours un autre rythme urbain et une nouvelle étape.",
    day1Morning: (sight) =>
      `${sight} : commencez tôt et réglez toute incertitude d’accès ou de transport dès le début de la journée.`,
    day2Morning: (sight) => `${sight} : bouclez le parcours principal avant l’arrivée de la foule.`,
    day3Morning: (sight) => `${sight} : vérifiez la veille au soir la météo, les billets ou le transfert.`,
  },
  regional: {
    character: (_city, area1, area2, s1, s2, s3) =>
      `Ici, l’essentiel est d’observer, entre ${area1} et ${area2}, non seulement les monuments mais aussi la vie quotidienne. ${s1}, ${s2} et ${s3} n’ont pas à être entassés dans la même journée ; une expérience principale, un quartier et un long repas donnent un rythme plus fort.`,
    stay: (area1, area2) =>
      `Pour une première visite, loger dans le secteur ${area1} vous place près du parcours principal ; pour des soirées plus locales et un hébergement souvent plus calme, ${area2} est une bonne alternative. Ne regardez pas seulement la distance sur la carte, mais aussi le départ du matin et le dernier transport en commun.`,
    evening: (area2, sight) =>
      `Prévoyez un dîner et une courte promenade dans le secteur ${area2}. Gardez la vie nocturne à un niveau qui ne compromette pas la visite du lendemain matin (${sight}) ; pour un retour tardif, prenez un taxi agréé ou une application officielle.`,
    souvenirs: () =>
      "Les produits locaux et l’artisanat font de bons cadeaux. N’achetez ni produits naturels protégés, ni antiquités sans papiers, ni denrées dont les règles de bagage et de douane sont floues.",
    season: (best) =>
      `Pour la plupart des voyageurs, la fenêtre la plus équilibrée est ${best}, mais la météo moyenne n’est pas une prévision du jour. Réorganisez les journées en ville, sur la côte ou en montagne dans les dernières 48 heures selon les bulletins météo et les annonces officielles.`,
    budget: (sight) =>
      `Chiffrez d’abord l’hébergement, les liaisons entre villes et une expérience principale comme ${sight}. Prévoyez ensuite une part pour les transports locaux, les repas, les bagages et le transfert du dernier kilomètre ; le total vol + hôtel n’est pas le budget du voyage.`,
    day1Title: (sight) => `Jour 1 — ${sight} et un premier quartier`,
    day1Afternoon: (area) => `Promenez-vous dans le secteur ${area} et gardez du temps pour un café imprévu.`,
    day1Evening: (food) => `Terminez la journée par un dîner tranquille ; à l’honneur : ${food}.`,
    day2Title: (sight) => `Jour 2 — ${sight} et le rythme local`,
    day2Afternoon: (area) =>
      `Ajoutez au programme les petites rues, les marchés et la vie quotidienne du secteur ${area}.`,
    day2Evening: (food) => `${food} : renseignez-vous à l’avance sur les ingrédients, les portions et la réservation.`,
    day3Title: (sight) => `Jour 3 — ${sight} et les environs`,
    day3Afternoon: (dayTrip) => `${dayTrip} : à adapter selon votre énergie et la dernière liaison de retour.`,
    faqDaysAnswer: (days) =>
      `Comptez ${days} pour une première visite équilibrée. En gardant du temps pour les quartiers, la cuisine et d’éventuels retards dus à la météo ou aux transports, le voyage gagne en sens.`,
    faqStayAnswer: (area1, area2) =>
      `${area1} est pratique pour une première visite ; ${area2} est une alternative plus locale. Évaluez les liaisons du matin et de la nuit en même temps que le prix de la chambre.`,
    faqWhenAnswer: (best) =>
      `La période la plus équilibrée est en général ${best} ; vérifiez tout de même la météo, les festivals et la fréquentation auprès des sources officielles.`,
    faqCarQuestion: (city) => `${city} : faut-il une voiture ?`,
    faqCarAnswer: (local) =>
      `Pour se déplacer : ${local}. Avant de louer, pesez ensemble stationnement, permis, assurance, carburant et retour de nuit.`,
    faqCombineAnswer: (cities) =>
      `Suites naturelles : ${cities}. Raisonnez en temps de porte à porte plutôt qu’en distance sur la carte.`,
  },
  world: {
    shopping: () =>
      "Ne cantonnez pas vos achats à un seul bazar touristique. Pour les produits locaux, le design ou les cadeaux gourmands, vérifiez l’étiquette, le prix fixe et les règles de bagage ; n’achetez ni produits naturels protégés ni antiquités sans papiers.",
    season: (best) =>
      `Même si ${best} se détache dans le calendrier, vacances scolaires, fêtes nationales, festivals et affluence du week-end peuvent changer l’expérience. Ne confondez pas météo moyenne et prévision de dernière minute ; prévoyez pour chaque journée en plein air une alternative à l’intérieur ou une balade tranquille dans un quartier.`,
    budget: (sight) =>
      `Chiffrez d’abord l’hébergement, les liaisons entre villes et les expériences principales comme ${sight}. Mettez de côté un montant pour les petits paiements, les bagages, les frais de réservation et le transfert du dernier kilomètre ; le total vol + hôtel n’est pas le budget du voyage.`,
    day1Title: (sight) => `Jour 1 — ${sight} et premiers pas en ville`,
    day1Afternoon: (area) => `Découvrez le secteur ${area} à pied et gardez du temps pour un café imprévu.`,
    day1Evening: () => "Terminez la soirée par un repas tranquille de cuisine locale.",
    day2Title: (sight) => `Jour 2 — ${sight} et les quartiers`,
    day2Afternoon: (area) =>
      `Ajoutez au programme les petites rues, les marchés et la vie quotidienne du secteur ${area}.`,
    day3Title: (sight) => `Jour 3 — ${sight} et une fin de séjour souple`,
    faqDaysAnswer: (days) =>
      `Comptez ${days} pour une première visite équilibrée. Plutôt que de cocher les grands sites, gardez du temps pour les quartiers, la cuisine et d’éventuels retards dus à la météo ou aux transports : le lieu se révèle bien mieux.`,
    faqWhenAnswer: (best, season) => `La période la plus équilibrée est en général ${best}. ${season}`,
    faqCarQuestion: (city) => `${city} : faut-il louer une voiture ?`,
    faqCarAnswer: (local) =>
      `Pour se déplacer : ${local}. Avant de choisir la voiture, pesez ensemble stationnement, permis, assurance et retour de nuit.`,
    faqCombineAnswer: (cities) =>
      `Dans ce guide, les suites naturelles sont : ${cities}. Ne regardez pas seulement la distance sur la carte, mais le vrai temps de trajet de porte à porte.`,
  },
};
