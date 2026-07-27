/**
 * Motor para la generación de minijuegos interactivos (Copas, Penales, Tiros Libres).
 */
export class MinigameEngine {

  /**
   * Genera el estado inicial del "Buscaminas de Copas".
   * 
   * @param {string} cupType - "copa_argentina", "libertadores", "sudamericana", "recopa"
   * @param {number} playerOVR - OVR del jugador para calcular las pistas (hints).
   * @param {number} teamPower - Power del equipo para ajustar dificultad.
   * @returns {Object} Estado del minijuego.
   */
  static generateCupMatrix(cupType, playerOVR, playerStat, teamPower) {
    const size = 64; // 8x8 matrix
    let requiredWins = 6;
    let maxDraws = 4;

    switch (cupType) {
      case "libertadores": requiredWins = 7; maxDraws = 3; break;
      case "sudamericana": requiredWins = 7; maxDraws = 3; break;
      case "recopa": requiredWins = 2; maxDraws = 2; break; // Ida y vuelta
      case "copa_argentina": requiredWins = 6; maxDraws = 4; break;
    }

    const collectiveStrength = (teamPower * 0.7) + (playerOVR * 0.3);
    let difficultyLabel = "NORMAL";
    let winCount = 30;
    let drawCount = 12;

    if (collectiveStrength < 50) {
      difficultyLabel = "EXTREMA";
      winCount = 15; drawCount = 15;
    } else if (collectiveStrength < 65) {
      difficultyLabel = "DIFÍCIL";
      winCount = 22; drawCount = 15;
    } else if (collectiveStrength < 80) {
      difficultyLabel = "NORMAL";
      winCount = 30; drawCount = 12;
    } else {
      difficultyLabel = "FÁCIL";
      winCount = 42; drawCount = 8;
    }

    const grid = new Array(size).fill("LOSS");
    this._placeRandomly(grid, "WIN", winCount);
    this._placeRandomly(grid, "DRAW", drawCount);

    // Dificultad y Pistas
    // Solo mostramos pistas de calaveras si el jugador tiene 85+ de definición.
    let hints = 0;

    if (playerStat >= 95) hints = 12;
    else if (playerStat >= 90) hints = 8;
    else if (playerStat >= 85) hints = 4;
    else hints = 0;

    // Colocar pistas sobre casilleros que son LOSS
    let hintsPlaced = 0;
    while (hintsPlaced < hints) {
      const idx = Math.floor(Math.random() * size);
      if (grid[idx] === "LOSS") {
        grid[idx] = "HINT_LOSS";
        hintsPlaced++;
      }
    }

    return {
      type: "matrix",
      cupType,
      grid,
      requiredWins,
      currentWins: 0,
      difficultyLabel,
      matchLogs: [],
      status: "PLAYING" // PLAYING, WON, ELIMINATED, PENALTIES
    };
  }

  static _placeRandomly(grid, type, count) {
    let placed = 0;
    while (placed < count) {
      const idx = Math.floor(Math.random() * grid.length);
      if (grid[idx] === "LOSS") {
        grid[idx] = type;
        placed++;
      }
    }
  }

  /**
   * Genera las tendencias del arquero para una tanda de 3 penales.
   * Si el jugador tiene buena definición, el arquero "avisa" antes a dónde va.
   */
  static generatePenaltyShootout(playerStat) {
    const directions = ["LEFT", "CENTER", "RIGHT"];
    const kicks = [];

    for (let i = 0; i < 3; i++) {
      const correctDirection = directions[Math.floor(Math.random() * directions.length)];
      kicks.push({
        correctDirection,
        hasHint: false,
        wrongDirectionHint: null
      });
    }

    // Pistas según stat principal (Reflejos o Definición)
    if (playerStat >= 95) {
      // Te avisa en 2 de los 3 penales
      kicks[0].hasHint = true;
      kicks[1].hasHint = true;
    } else if (playerStat >= 85) {
      // Te avisa en 1 de los 3 penales
      kicks[0].hasHint = true;
    }

    // Calcular la pista (qué dirección incorrecta descartar)
    kicks.forEach(k => {
      if (k.hasHint) {
        const incorrects = directions.filter(d => d !== k.correctDirection);
        k.wrongDirectionHint = incorrects[Math.floor(Math.random() * incorrects.length)];
      }
    });

    // Mezclar para que la pista no sea siempre en el primero
    kicks.sort(() => Math.random() - 0.5);

    return {
      type: "penalties",
      kicks,
      currentKick: 0,
      playerScore: 0,
      status: "PLAYING" // PLAYING, WON, ELIMINATED
    };
  }
}
