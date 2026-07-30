import { NationalTeam } from "../../domain/NationalTeam.js";

// CONMEBOL (10 Selecciones Fijas)
export const CONMEBOL_TEAMS = [
  new NationalTeam({ id: "AR", name: "Argentina", nickname: "La Albiceleste", tier: 1, wageBudget: 0, colors: ["#75AADB", "#FFFFFF"], customLogoUrls: ["https://flagcdn.com/w40/ar.png"] }),
  new NationalTeam({ id: "BR", name: "Brasil", nickname: "La Verdeamarela", tier: 1, wageBudget: 0, colors: ["#F6B40E", "#006B3F"], customLogoUrls: ["https://flagcdn.com/w40/br.png"] }),
  new NationalTeam({ id: "UY", name: "Uruguay", nickname: "La Celeste", tier: 1, wageBudget: 0, colors: ["#75AADB", "#000000"], customLogoUrls: ["https://flagcdn.com/w40/uy.png"] }),
  new NationalTeam({ id: "CO", name: "Colombia", nickname: "Los Cafeteros", tier: 1, wageBudget: 0, colors: ["#F6B40E", "#103F79"], customLogoUrls: ["https://flagcdn.com/w40/co.png"] }),
  new NationalTeam({ id: "EC", name: "Ecuador", nickname: "La Tri", tier: 1, wageBudget: 0, colors: ["#F6B40E", "#103F79"], customLogoUrls: ["https://flagcdn.com/w40/ec.png"] }),
  new NationalTeam({ id: "CL", name: "Chile", nickname: "La Roja", tier: 1, wageBudget: 0, colors: ["#E10A17", "#103F79"], customLogoUrls: ["https://flagcdn.com/w40/cl.png"] }),
  new NationalTeam({ id: "VE", name: "Venezuela", nickname: "La Vinotinto", tier: 1, wageBudget: 0, colors: ["#830B2C", "#FFFFFF"], customLogoUrls: ["https://flagcdn.com/w40/ve.png"] }),
  new NationalTeam({ id: "PE", name: "Perú", nickname: "La Blanquirroja", tier: 1, wageBudget: 0, colors: ["#FFFFFF", "#E10A17"], customLogoUrls: ["https://flagcdn.com/w40/pe.png"] }),
  new NationalTeam({ id: "PY", name: "Paraguay", nickname: "La Albirroja", tier: 1, wageBudget: 0, colors: ["#E10A17", "#FFFFFF"], customLogoUrls: ["https://flagcdn.com/w40/py.png"] }),
  new NationalTeam({ id: "BO", name: "Bolivia", nickname: "La Verde", tier: 1, wageBudget: 0, colors: ["#0E7A3C", "#FFFFFF"], customLogoUrls: ["https://flagcdn.com/w40/bo.png"] })
];

// OVR BASE para CONMEBOL
export const CONMEBOL_OVR = {
  AR: 92, BR: 89, UY: 87, CO: 86, EC: 82, CL: 79, VE: 78, PE: 77, PY: 76, BO: 72
};

// CONCACAF E INVITADOS HISTÓRICOS (Pool Ampliado)
export const INVITED_NATIONAL_TEAMS = [
  new NationalTeam({ id: "US", name: "Estados Unidos", nickname: "The Yanks", tier: 1, wageBudget: 0, colors: ["#103F79", "#E10A17"], customLogoUrls: ["https://flagcdn.com/w40/us.png"] }),
  new NationalTeam({ id: "MX", name: "México", nickname: "El Tri", tier: 1, wageBudget: 0, colors: ["#0E7A3C", "#E10A17"], customLogoUrls: ["https://flagcdn.com/w40/mx.png"] }),
  new NationalTeam({ id: "CA", name: "Canadá", nickname: "Los Rojos", tier: 1, wageBudget: 0, colors: ["#E10A17", "#FFFFFF"], customLogoUrls: ["https://flagcdn.com/w40/ca.png"] }),
  new NationalTeam({ id: "JP", name: "Japón", nickname: "Los Samuráis Azules", tier: 1, wageBudget: 0, colors: ["#143C8B", "#FFFFFF"], customLogoUrls: ["https://flagcdn.com/w40/jp.png"] }),
  new NationalTeam({ id: "PA", name: "Panamá", nickname: "Los Canaleros", tier: 1, wageBudget: 0, colors: ["#E10A17", "#103F79"], customLogoUrls: ["https://flagcdn.com/w40/pa.png"] }),
  new NationalTeam({ id: "CR", name: "Costa Rica", nickname: "Los Ticos", tier: 1, wageBudget: 0, colors: ["#E10A17", "#103F79"], customLogoUrls: ["https://flagcdn.com/w40/cr.png"] }),
  new NationalTeam({ id: "JM", name: "Jamaica", nickname: "Reggae Boyz", tier: 1, wageBudget: 0, colors: ["#FFD100", "#006B3F"], customLogoUrls: ["https://flagcdn.com/w40/jm.png"] }),
  new NationalTeam({ id: "QA", name: "Qatar", nickname: "El Marrón", tier: 1, wageBudget: 0, colors: ["#8A1538", "#FFFFFF"], customLogoUrls: ["https://flagcdn.com/w40/qa.png"] }),
  new NationalTeam({ id: "HN", name: "Honduras", nickname: "La H", tier: 1, wageBudget: 0, colors: ["#103F79", "#FFFFFF"], customLogoUrls: ["https://flagcdn.com/w40/hn.png"] }),
  new NationalTeam({ id: "HT", name: "Haití", nickname: "Les Grenadiers", tier: 1, wageBudget: 0, colors: ["#103F79", "#E10A17"], customLogoUrls: ["https://flagcdn.com/w40/ht.png"] }),
  new NationalTeam({ id: "TT", name: "Trinidad y Tobago", nickname: "Soca Warriors", tier: 1, wageBudget: 0, colors: ["#E10A17", "#000000"], customLogoUrls: ["https://flagcdn.com/w40/tt.png"] })
];

// OVR BASE para INVITADOS
export const INVITED_OVR = {
  US: 83, MX: 82, CA: 80, JP: 79, PA: 76, CR: 75, JM: 74, QA: 73, HN: 71, HT: 68, TT: 67
};

export function getNationalTeamOVR(teamId) {
  return CONMEBOL_OVR[teamId] || INVITED_OVR[teamId] || 70;
}
