import { TransferOffer } from "./TransferOffer.js";

/**
 * Clase MarketManager (POO)
 * Genera ofertas de traspaso de clubes reales en base al rendimiento, reputación y EXPOSICIÓN del jugador.
 * La exposición limita qué ligas te "ven": aunque seas crack, si estás en Primera C nadie de Europa te mira.
 */
export class MarketManager {
  generateOffersForPlayer(player, currentTeam, allLeagues, count = 3) {
    const ovr = player.calculateOVR();
    const exposure = player.exposure ?? 0;

    // --- Determinar tiers/ligas alcanzables según EXPOSICIÓN + OVR ---
    // La exposición define el "techo" de visibilidad: qué tan lejos llegan a verte.
    // El OVR define si sos lo suficientemente bueno para ese techo.
    let targetTiers = [currentTeam.tier]; // por defecto, solo tu mismo tier

    // INTERNACIONAL (solo con mucha exposición Y muy buen OVR)
    const canReachInternational = exposure >= 65 && ovr >= 72;
    // SALTO A PRIMERA (Argentina) — necesitás exposición media y buen OVR
    const canReachPrimera = exposure >= 30 && ovr >= 68;
    // SALTO A NACIONAL — exposición baja-media
    const canReachNacional = exposure >= 12 && ovr >= 60;
    // MEJORA DE UN TIER — mínimo de exposición
    const canClimbOneTier = exposure >= 5 && currentTeam.tier > 1;

    // Golpe de suerte (5%): saltás un escalón aunque no llegues al umbral
    const luckyBreak = Math.random() < 0.05;

    if (canReachInternational || (luckyBreak && exposure >= 45)) {
      // Podés llegar a ligas internacionales y Primera Argentina
      targetTiers = [1];
      // También incluimos las ligas internacionales en el pool
    } else if (canReachPrimera) {
      targetTiers = [1, 2];
    } else if (canReachNacional) {
      targetTiers = [2, 3];
    } else if (canClimbOneTier || luckyBreak) {
      targetTiers = [currentTeam.tier, Math.max(1, currentTeam.tier - 1)];
    }

    // Filtrar ligas: si no tiene mucha exposición, solo ligas argentinas
    const leaguePool = allLeagues.filter(league => {
      if (!targetTiers.includes(league.tier)) return false;
      // Solo accede a ligas internacionales si tiene suficiente exposición
      if (league.country !== "ar" && exposure < 65 && !luckyBreak) return false;
      return true;
    });

    // Generar candidatos
    const candidateOffers = [];
    for (const league of leaguePool) {
      for (const team of league.teams) {
        if (team.id === currentTeam.id) continue;
        const ovrFactor = Math.min(1.2, Math.max(0.15, (ovr / 65)));
        const reputationBonus = 1 + (player.reputation / 200);
        const monthlySalary = Math.round((team.wageBudget * ovrFactor * reputationBonus) / 12);
        const signingBonus = Math.round(monthlySalary * 2);

        candidateOffers.push(new TransferOffer({
          team,
          league,
          monthlySalary,
          contractYears: Math.floor(Math.random() * 2) + 2,
          signingBonus
        }));
      }
    }

    // Mezclar y retornar la cantidad de ofertas deseada
    const shuffled = [...candidateOffers].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }
}

