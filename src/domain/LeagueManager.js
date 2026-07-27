import { League } from "./League.js";
import { Team } from "./Team.js";

/**
 * Gestor dinámico de ligas y equipos.
 * Permite ascensos y descensos, manteniendo el estado encapsulado para cada partida.
 */
export class LeagueManager {
  constructor(argLeaguesData, intlLeaguesData) {
    this.leagues = {};
    
    // Clonar ligas para que las mutaciones no afecten a los datos estáticos globales
    this._cloneAndAddLeagues(argLeaguesData);
    this._cloneAndAddLeagues(intlLeaguesData);
  }

  _cloneAndAddLeagues(leaguesData) {
    for (const key in leaguesData) {
      const origLeague = leaguesData[key];
      const clonedTeams = origLeague.teams.map(t => new Team({
        id: t.id,
        apiId: t.apiId,
        name: t.name,
        nickname: t.nickname,
        tier: t.tier,
        country: t.country,
        colors: [...t.colors],
        rivals: [...t.rivals],
        customLogoUrls: [...(t.customLogoUrls || [])],
        wageBudget: t.baseWageBudget,
        power: t.power
      }));
      this.leagues[origLeague.id] = new League({
        id: origLeague.id,
        name: origLeague.name,
        country: origLeague.country,
        tier: origLeague.tier,
        exposureGain: origLeague.exposureGain,
        teams: clonedTeams
      });
    }
  }

  /**
   * Busca un equipo en todas las ligas activas.
   */
  findTeamById(teamId) {
    for (const leagueId in this.leagues) {
      const league = this.leagues[leagueId];
      const team = league.getTeamById(teamId);
      if (team) return { team, league };
    }
    return null;
  }

  /**
   * Devuelve todas las ligas como un array.
   */
  getAllLeagues() {
    return Object.values(this.leagues);
  }

  /**
   * Obtiene la liga de un país específico por su Tier.
   */
  getLeagueByCountryAndTier(country, tier) {
    const targetCountry = (country === "Argentina" || country === "ar") ? "ar" : country;
    return this.getAllLeagues().find(l => (l.country === targetCountry || l.country === country) && l.tier === tier) || null;
  }

  /**
   * Asciende a un equipo a la categoría superior de su país.
   * Intercambia su lugar con un equipo aleatorio de esa liga.
   */
  promoteTeam(teamId) {
    const match = this.findTeamById(teamId);
    if (!match) return { success: false, message: "Equipo no encontrado." };
    
    const { team, league: currentLeague } = match;
    const targetTier = currentLeague.tier - 1;
    
    if (targetTier < 1) return { success: false, message: "El equipo ya está en la máxima categoría." };

    const targetLeague = this.getLeagueByCountryAndTier(currentLeague.country, targetTier);
    if (!targetLeague) return { success: false, message: "No hay liga superior configurada en este país." };

    // Intercambio
    const swappedTeam = targetLeague.getRandomTeam();
    
    this._swapTeams(team, currentLeague, targetLeague, swappedTeam, targetLeague, currentLeague);

    return { 
      success: true, 
      newLeague: targetLeague, 
      swappedTeam 
    };
  }

  /**
   * Desciende a un equipo a la categoría inferior de su país.
   * Intercambia su lugar con un equipo aleatorio de esa liga.
   */
  relegateTeam(teamId) {
    const match = this.findTeamById(teamId);
    if (!match) return { success: false, message: "Equipo no encontrado." };
    
    const { team, league: currentLeague } = match;
    const targetTier = currentLeague.tier + 1;
    
    const targetLeague = this.getLeagueByCountryAndTier(currentLeague.country, targetTier);
    if (!targetLeague) return { success: false, message: "No hay liga inferior configurada en este país." };

    // Intercambio
    const swappedTeam = targetLeague.getRandomTeam();
    
    this._swapTeams(team, currentLeague, targetLeague, swappedTeam, targetLeague, currentLeague);

    return { 
      success: true, 
      newLeague: targetLeague, 
      swappedTeam 
    };
  }

  _swapTeams(teamA, leagueA, targetLeagueForA, teamB, leagueB, targetLeagueForB) {
    // Quitar a TeamA de LeagueA
    leagueA.teams = leagueA.teams.filter(t => t.id !== teamA.id);
    // Agregar a TeamA a TargetLeagueA
    targetLeagueForA.teams.push(teamA);
    teamA.updateTier(targetLeagueForA.tier);

    // Quitar a TeamB de LeagueB
    leagueB.teams = leagueB.teams.filter(t => t.id !== teamB.id);
    // Agregar a TeamB a TargetLeagueB
    targetLeagueForB.teams.push(teamB);
    teamB.updateTier(targetLeagueForB.tier);
  }

  /**
   * Procesa los ascensos y descensos al final de la temporada
   * basándose en las tablas de posiciones simuladas.
   */
  processPromotionsAndRelegations(allStandings) {
    const changes = [];

    // Iteramos por las ligas en orden de jerarquía (1 a 3)
    // No iteramos la 4 porque no tiene descensos, sus ascensos se manejan al mirar la 3.
    for (let tier = 1; tier <= 3; tier++) {
      const currentLeague = this.getLeagueByCountryAndTier("ar", tier);
      const lowerLeague = this.getLeagueByCountryAndTier("ar", tier + 1);

      if (currentLeague && lowerLeague) {
        const currentStandings = allStandings[currentLeague.id];
        const lowerStandings = allStandings[lowerLeague.id];

        if (currentStandings && lowerStandings) {
          // Descienden los 2 peores (últimos de la tabla) de la liga actual
          // Ascienden los 2 mejores (primeros de la tabla) de la liga inferior
          // Excepto en B Metro (tier 3) donde ascienden 2 pero desciende 1 (asumamos 2 y 2 para mantener consistencia de cantidad de equipos por ahora, o 1 y 1)
          // Usaremos 2 ascensos y 2 descensos uniformemente.
          
          const relegated = [
            currentStandings[currentStandings.length - 1].team,
            currentStandings[currentStandings.length - 2].team
          ];

          const promoted = [
            lowerStandings[0].team,
            lowerStandings[1].team
          ];

          // Swap de los equipos
          this._swapTeams(relegated[0], currentLeague, lowerLeague, promoted[0], lowerLeague, currentLeague);
          this._swapTeams(relegated[1], currentLeague, lowerLeague, promoted[1], lowerLeague, currentLeague);

          // Registrar cambios para notificar si el jugador estuvo involucrado
          changes.push({ team: relegated[0], from: currentLeague.name, to: lowerLeague.name, type: 'relegation' });
          changes.push({ team: relegated[1], from: currentLeague.name, to: lowerLeague.name, type: 'relegation' });
          changes.push({ team: promoted[0], from: lowerLeague.name, to: currentLeague.name, type: 'promotion' });
          changes.push({ team: promoted[1], from: lowerLeague.name, to: currentLeague.name, type: 'promotion' });
        }
      }
    }
    return changes;
  }
}
