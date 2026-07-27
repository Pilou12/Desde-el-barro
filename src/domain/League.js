/**
 * Clase League (POO)
 * Modela una división / competición de fútbol con sus equipos integrantes y categoría.
 */
export class League {
  constructor({ id, name, country, tier, teams = [], exposureGain = 5 }) {
    this.id = id;
    this.name = name;
    this.country = country;
    this.tier = tier;
    this.teams = teams;
    // Exposición que gana el jugador por temporada en esta liga (base, antes de bonus por rendimiento)
    this.exposureGain = exposureGain;
  }

  getTeamById(id) {
    return this.teams.find(team => team.id === id) || null;
  }

  getRandomTeam() {
    if (!this.teams.length) return null;
    const index = Math.floor(Math.random() * this.teams.length);
    return this.teams[index];
  }

  simulateStandings(playerTeamId, playerOVR) {
    const standings = this.teams.map(team => {
      // Si es el equipo del jugador, su poder aumenta por el jugador
      let actualPower = team.power;
      if (team.id === playerTeamId && playerOVR) {
        actualPower += (playerOVR * 0.05); // Efecto del jugador fuertemente nerfeado
      }

      // Simular puntos en 38 fechas promedio
      // Poder 90 saca ~80-90 pts, Poder 50 saca ~30-40 pts
      const basePoints = actualPower - 10;
      const randomVariance = Math.floor(Math.random() * 20) - 10; // +/- 10 pts
      const points = Math.max(10, Math.min(114, basePoints + randomVariance));

      return {
        team: team,
        points: Math.floor(points),
        isPlayerTeam: team.id === playerTeamId
      };
    });

    // Ordenar de mayor a menor puntaje
    standings.sort((a, b) => b.points - a.points);
    return standings;
  }
}
