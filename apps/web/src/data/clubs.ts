/**
 * Football clubs mapped onto cities that already exist in `destinations.ts`,
 * so a random club can always hand off to a real flight.
 *
 * Deliberately no crest artwork: inventing marks that look official would
 * misrepresent real organisations. The cards are typographic, and `accent` is
 * only used as an abstract colour wash.
 */
export interface Club {
  name: string;
  city: string;
  countryCode: string;
  stadium: string;
  league: string;
  accent: string;
}

export const clubs: Club[] = [
  // Serie A
  { name: "AC Milan", city: "Milano", countryCode: "IT", stadium: "San Siro", league: "Serie A", accent: "#c8102e" },
  { name: "SSC Napoli", city: "Napoli", countryCode: "IT", stadium: "Stadio Diego Armando Maradona", league: "Serie A", accent: "#12a0d7" },
  { name: "AS Roma", city: "Roma", countryCode: "IT", stadium: "Stadio Olimpico", league: "Serie A", accent: "#8e1f2f" },
  { name: "ACF Fiorentina", city: "Floransa", countryCode: "IT", stadium: "Stadio Artemio Franchi", league: "Serie A", accent: "#7b2f8f" },

  // Ligue 1
  { name: "Paris Saint-Germain", city: "Paris", countryCode: "FR", stadium: "Parc des Princes", league: "Ligue 1", accent: "#004170" },
  { name: "Olympique de Marseille", city: "Marsilya", countryCode: "FR", stadium: "Stade Vélodrome", league: "Ligue 1", accent: "#2faee0" },
  { name: "Olympique Lyonnais", city: "Lyon", countryCode: "FR", stadium: "Groupama Stadium", league: "Ligue 1", accent: "#d4001f" },
  { name: "OGC Nice", city: "Nice", countryCode: "FR", stadium: "Allianz Riviera", league: "Ligue 1", accent: "#c8102e" },

  // J1 League
  { name: "FC Tokyo", city: "Tokyo", countryCode: "JP", stadium: "Ajinomoto Stadium", league: "J1 Ligi", accent: "#0a2f7b" },
  { name: "Gamba Osaka", city: "Osaka", countryCode: "JP", stadium: "Panasonic Stadium Suita", league: "J1 Ligi", accent: "#00306e" },
  { name: "Kyoto Sanga", city: "Kyoto", countryCode: "JP", stadium: "Sanga Stadium", league: "J1 Ligi", accent: "#8e2a8b" },
  { name: "Sanfrecce Hiroshima", city: "Hiroshima", countryCode: "JP", stadium: "Edion Peace Wing", league: "J1 Ligi", accent: "#4b2a7b" },
  { name: "Hokkaido Consadole Sapporo", city: "Sapporo", countryCode: "JP", stadium: "Sapporo Dome", league: "J1 Ligi", accent: "#c8102e" },

  // K League 1
  { name: "FC Seoul", city: "Seul", countryCode: "KR", stadium: "Seoul World Cup Stadium", league: "K Ligi 1", accent: "#c8102e" },
  { name: "Busan IPark", city: "Busan", countryCode: "KR", stadium: "Busan Gudeok Stadium", league: "K Ligi 1", accent: "#c8102e" },
  { name: "Jeju United", city: "Jeju Adası", countryCode: "KR", stadium: "Jeju World Cup Stadium", league: "K Ligi 1", accent: "#e05a1a" },
  { name: "Incheon United", city: "Incheon", countryCode: "KR", stadium: "Incheon Football Stadium", league: "K Ligi 1", accent: "#0a5ba8" },

  // MLS
  { name: "New York City FC", city: "New York", countryCode: "US", stadium: "Yankee Stadium", league: "MLS", accent: "#6caddf" },
  { name: "LA Galaxy", city: "Los Angeles", countryCode: "US", stadium: "Dignity Health Sports Park", league: "MLS", accent: "#00245d" },
  { name: "Inter Miami CF", city: "Miami", countryCode: "US", stadium: "Chase Stadium", league: "MLS", accent: "#f7b5cd" },
  { name: "Chicago Fire FC", city: "Chicago", countryCode: "US", stadium: "Soldier Field", league: "MLS", accent: "#c8102e" },

  // Thai League 1
  { name: "Bangkok United", city: "Bangkok", countryCode: "TH", stadium: "Thammasat Stadium", league: "Tayland Ligi 1", accent: "#0a3b8c" },
  { name: "Chiangmai United", city: "Chiang Mai", countryCode: "TH", stadium: "700th Anniversary Stadium", league: "Tayland Ligi 1", accent: "#c8102e" },
];
