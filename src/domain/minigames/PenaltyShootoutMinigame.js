import { BaseMinigame } from "./BaseMinigame.js";

export class PenaltyShootoutMinigame extends BaseMinigame {
  /**
   * Genera las tendencias del arquero para una tanda de penales (3 penales).
   * @param {number} playerStat - Stat principal (Reflejos o Definición) para pistas.
   * @param {boolean} isNarrative - Si es parte de un evento narrativo.
   */
  constructor(playerStat, isNarrative = false) {
    super("penalty_shootout", isNarrative);
    this.directions = ["LEFT", "CENTER", "RIGHT"];
    this.kicks = [];
    
    for (let i = 0; i < 3; i++) {
      const correctDirection = this.directions[Math.floor(Math.random() * this.directions.length)];
      this.kicks.push({
        correctDirection,
        hasHint: false,
        wrongDirectionHint: null,
        scored: null,
        playerDirection: null
      });
    }

    // Pistas según stat principal
    if (playerStat >= 95) {
      this.kicks[0].hasHint = true;
      this.kicks[1].hasHint = true;
    } else if (playerStat >= 85) {
      this.kicks[0].hasHint = true;
    }

    // Calcular pista (qué dirección descartar)
    this.kicks.forEach(k => {
      if (k.hasHint) {
        const incorrects = this.directions.filter(d => d !== k.correctDirection);
        k.wrongDirectionHint = incorrects[Math.floor(Math.random() * incorrects.length)];
      }
    });

    this.kicks.sort(() => Math.random() - 0.5);

    this.currentKick = 0;
    this.playerScore = 0;
  }

  /**
   * Resuelve el tiro de penal actual.
   * @param {string} direction - "LEFT", "CENTER", "RIGHT"
   */
  resolveKick(direction) {
    if (this.status !== "PLAYING") return;
    
    const currentKick = this.kicks[this.currentKick];
    currentKick.playerDirection = direction;

    if (direction === currentKick.correctDirection) {
      this.playerScore += 1;
      currentKick.scored = true;
      this.matchLogs.push(`⚽ Penal ${this.currentKick + 1}: ¡Gol!`);
    } else {
      currentKick.scored = false;
      this.matchLogs.push(`❌ Penal ${this.currentKick + 1}: ¡Fallaste!`);
    }

    this.currentKick += 1;

    // Lógica de muerte súbita (3 penales, pero si falla uno queda eliminado automáticamente)
    // El juego asume muerte súbita para hacer la experiencia más intensa.
    if (!currentKick.scored) {
      this.status = "ELIMINATED";
    } else if (this.currentKick >= 3) {
      this.status = "WON";
    }
  }
}
