import { MatrixMinigame } from "./minigames/MatrixMinigame.js";
import { PenaltyShootoutMinigame } from "./minigames/PenaltyShootoutMinigame.js";
import { FreeKickMinigame } from "./minigames/FreeKickMinigame.js";

/**
 * Motor para la generación de minijuegos interactivos (Copas, Penales, Tiros Libres).
 * Actúa como Factory para mantener compatibilidad con las clases existentes.
 */
export class MinigameEngine {

  /**
   * Genera el estado inicial del "Buscaminas de Copas".
   * 
   * @param {string} cupType - "copa_argentina", "libertadores", "sudamericana", "recopa"
   * @param {number} playerOVR - OVR del jugador para calcular las pistas (hints).
   * @param {number} playerStat - Stat principal para pistas.
   * @param {number} teamPower - Power del equipo para ajustar dificultad.
   * @returns {MatrixMinigame} Estado del minijuego.
   */
  static generateCupMatrix(cupType, playerOVR, playerStat, teamPower) {
    return new MatrixMinigame(cupType, playerOVR, playerStat, teamPower, false);
  }

  /**
   * Genera las tendencias del arquero para una tanda de 3 penales.
   * @param {number} playerStat - Stat del jugador.
   * @param {boolean} isNarrative - Indica si es de evento narrativo.
   */
  static generatePenaltyShootout(playerStat, isNarrative = false) {
    return new PenaltyShootoutMinigame(playerStat, isNarrative);
  }

  /**
   * Genera un tiro libre de 5 puntos.
   * @param {number} playerStat - Stat del jugador.
   * @param {boolean} isNarrative - Indica si es de evento narrativo.
   */
  static generateFreeKick(playerStat, isNarrative = true) {
    return new FreeKickMinigame(playerStat, isNarrative);
  }
}
