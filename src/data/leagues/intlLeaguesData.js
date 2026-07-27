import { Team } from "../../domain/Team.js";
import { League } from "../../domain/League.js";

export const INTERNATIONAL_TEAMS = {
  // España (LaLiga)
  real_madrid: new Team({ id: "real_madrid", apiId: 541, name: "Real Madrid", nickname: "El Merengue", tier: 1, country: "es", colors: ["#FFFFFF", "#FEBE10"], rivals: ["barcelona", "atletico_madrid"] }),
  barcelona: new Team({ id: "barcelona", apiId: 529, name: "FC Barcelona", nickname: "El Blaugrana", tier: 1, country: "es", colors: ["#004D98", "#A50044"], rivals: ["real_madrid"] }),
  atletico_madrid: new Team({ id: "atletico_madrid", apiId: 530, name: "Atlético Madrid", nickname: "El Colchonero", tier: 1, country: "es", colors: ["#CB3524", "#FFFFFF"], rivals: ["real_madrid"] }),
  sevilla: new Team({ id: "sevilla", apiId: 536, name: "Sevilla FC", nickname: "Los Nervionenses", tier: 1, country: "es", colors: ["#E30613", "#FFFFFF"], rivals: ["betis"] }),
  betis: new Team({ id: "betis", apiId: 543, name: "Real Betis", nickname: "Los Verdiblancos", tier: 1, country: "es", colors: ["#006B3F", "#FFFFFF"], rivals: ["sevilla"] }),

  // Inglaterra (Premier League)
  man_city: new Team({ id: "man_city", apiId: 50, name: "Manchester City", nickname: "The Citizens", tier: 1, country: "en", colors: ["#6CABDD", "#FFFFFF"], rivals: ["man_utd"] }),
  liverpool: new Team({ id: "liverpool", apiId: 40, name: "Liverpool FC", nickname: "The Reds", tier: 1, country: "en", colors: ["#C8102E", "#FFFFFF"], rivals: ["man_utd"] }),
  arsenal: new Team({ id: "arsenal", apiId: 42, name: "Arsenal FC", nickname: "The Gunners", tier: 1, country: "en", colors: ["#EF0107", "#FFFFFF"], rivals: ["chelsea"] }),
  chelsea: new Team({ id: "chelsea", apiId: 49, name: "Chelsea FC", nickname: "The Blues", tier: 1, country: "en", colors: ["#034694", "#FFFFFF"], rivals: ["arsenal"] }),
  man_utd: new Team({ id: "man_utd", apiId: 33, name: "Manchester United", nickname: "The Red Devils", tier: 1, country: "en", colors: ["#DA020E", "#000000"], rivals: ["man_city"] }),

  // Italia (Serie A)
  inter_milan: new Team({ id: "inter_milan", apiId: 505, name: "Inter de Milán", nickname: "El Nerazzurro", tier: 1, country: "it", colors: ["#010E80", "#000000"], rivals: ["ac_milan", "juventus"] }),
  juventus: new Team({ id: "juventus", apiId: 496, name: "Juventus", nickname: "La Vecchia Signora", tier: 1, country: "it", colors: ["#000000", "#FFFFFF"], rivals: ["inter_milan"] }),
  ac_milan: new Team({ id: "ac_milan", apiId: 489, name: "AC Milan", nickname: "El Rossonero", tier: 1, country: "it", colors: ["#FB090B", "#000000"], rivals: ["inter_milan"] }),
  napoli: new Team({ id: "napoli", apiId: 492, name: "SSC Napoli", nickname: "Gli Azzurri", tier: 1, country: "it", colors: ["#0080FF", "#FFFFFF"], rivals: [] }),
  roma: new Team({ id: "roma", apiId: 497, name: "AS Roma", nickname: "I Giallorossi", tier: 1, country: "it", colors: ["#8E1F2F", "#F0BC00"], rivals: [] }),

  // Brasil (Brasileirão)
  flamengo: new Team({ id: "flamengo", apiId: 127, name: "Flamengo", nickname: "O Mengão", tier: 1, country: "br", colors: ["#C52613", "#000000"], rivals: ["fluminense"] }),
  palmeiras: new Team({ id: "palmeiras", apiId: 121, name: "Palmeiras", nickname: "O Verdão", tier: 1, country: "br", colors: ["#006437", "#FFFFFF"], rivals: ["corinthians"] }),
  sao_paulo: new Team({ id: "sao_paulo", apiId: 126, name: "São Paulo FC", nickname: "O Tricolor", tier: 1, country: "br", colors: ["#E30613", "#000000"], rivals: ["palmeiras"] }),

  // Uruguay
  penarol: new Team({ id: "penarol", apiId: 2348, name: "Peñarol", nickname: "El Carbonero", tier: 1, country: "uy", colors: ["#FCD116", "#000000"], rivals: ["nacional_uy"] }),
  nacional_uy: new Team({ id: "nacional_uy", apiId: 2356, name: "Nacional (Uruguay)", nickname: "El Bolso", tier: 1, country: "uy", colors: ["#0E4D9D", "#D81E05"], rivals: ["penarol"] }),

  // Arabia Saudita
  al_nassr: new Team({ id: "al_nassr", apiId: 2939, name: "Al-Nassr", nickname: "Los Caballeros", tier: 1, country: "sa", colors: ["#F9E300", "#1A4CA1"], rivals: ["al_hilal"] }),
  al_hilal: new Team({ id: "al_hilal", apiId: 2932, name: "Al-Hilal", nickname: "El Zaeem", tier: 1, country: "sa", colors: ["#0033A0", "#FFFFFF"], rivals: ["al_nassr"] })
};

export const INTERNATIONAL_LEAGUES = {
  laliga:      new League({ id: "es_laliga",       name: "LaLiga (España)",              country: "es", tier: 1, exposureGain: 40, teams: [INTERNATIONAL_TEAMS.real_madrid, INTERNATIONAL_TEAMS.barcelona, INTERNATIONAL_TEAMS.atletico_madrid, INTERNATIONAL_TEAMS.sevilla, INTERNATIONAL_TEAMS.betis] }),
  premier:     new League({ id: "en_premier",      name: "Premier League (Inglaterra)",  country: "en", tier: 1, exposureGain: 40, teams: [INTERNATIONAL_TEAMS.man_city, INTERNATIONAL_TEAMS.liverpool, INTERNATIONAL_TEAMS.arsenal, INTERNATIONAL_TEAMS.chelsea, INTERNATIONAL_TEAMS.man_utd] }),
  serie_a:     new League({ id: "it_seriea",       name: "Serie A (Italia)",             country: "it", tier: 1, exposureGain: 35, teams: [INTERNATIONAL_TEAMS.inter_milan, INTERNATIONAL_TEAMS.juventus, INTERNATIONAL_TEAMS.ac_milan, INTERNATIONAL_TEAMS.napoli, INTERNATIONAL_TEAMS.roma] }),
  brasileirao: new League({ id: "br_brasileirao",  name: "Brasileirão (Brasil)",         country: "br", tier: 1, exposureGain: 25, teams: [INTERNATIONAL_TEAMS.flamengo, INTERNATIONAL_TEAMS.palmeiras, INTERNATIONAL_TEAMS.sao_paulo] }),
  uruguay:     new League({ id: "uy_primera",      name: "Campeonato Uruguayo",          country: "uy", tier: 1, exposureGain: 15, teams: [INTERNATIONAL_TEAMS.penarol, INTERNATIONAL_TEAMS.nacional_uy] }),
  saudi:       new League({ id: "sa_pro_league",   name: "Saudi Pro League",             country: "sa", tier: 1, exposureGain: 30, teams: [INTERNATIONAL_TEAMS.al_nassr, INTERNATIONAL_TEAMS.al_hilal] })
};
