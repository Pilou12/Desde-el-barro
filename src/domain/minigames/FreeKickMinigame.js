import { BaseMinigame } from "./BaseMinigame.js";

export class FreeKickMinigame extends BaseMinigame {
  /**
   * Genera el minijuego de Tiro Libre.
   * @param {Object} config - Configuración genérica del minijuego.
   * @param {boolean} isNarrative - Indica si pertenece a un evento narrativo.
   */
  constructor(config, isNarrative = true) {
    super("free_kick", isNarrative);
    this.points = ["TOP_LEFT", "BOTTOM_LEFT", "CENTER", "TOP_RIGHT", "BOTTOM_RIGHT"];
    
    // Parejas contiguas que el arquero puede tapar simultáneamente
    this.validPairs = [
      ["TOP_LEFT", "BOTTOM_LEFT"],
      ["TOP_RIGHT", "BOTTOM_RIGHT"],
      ["TOP_LEFT", "CENTER"],
      ["BOTTOM_LEFT", "CENTER"],
      ["TOP_RIGHT", "CENTER"],
      ["BOTTOM_RIGHT", "CENTER"]
    ];
    
    // Elige al azar la pareja que cubrirá el arquero
    const randomIndex = Math.floor(Math.random() * this.validPairs.length);
    this.coveredPoints = this.validPairs[randomIndex];
    
    // Pistas (Ej: te avisa un punto que seguro va a tapar)
    this.hintPoint = null;
    if (config.hasHint) {
      // Revela uno de los dos puntos que va a tapar
      this.hintPoint = this.coveredPoints[Math.floor(Math.random() * this.coveredPoints.length)];
    }
    
    this.playerScore = 0; // 0 (Falló) o 1 (Gol)
    this.chosenPoint = null;
  }
  
  /**
   * Resuelve el click del usuario en uno de los puntos.
   * @param {string} direction - "TOP_LEFT", "BOTTOM_LEFT", "CENTER", "TOP_RIGHT", "BOTTOM_RIGHT"
   */
  resolveKick(direction) {
    if (this.status !== "PLAYING") return;
    this.chosenPoint = direction;
    
    // Si el jugador elige un punto que el arquero tapó, erra
    if (this.coveredPoints.includes(direction)) {
      this.status = "ELIMINATED";
      this.matchLogs.push(`❌ Pateaste hacia ${this.formatDirection(direction)}... ¡Atajó el arquero!`);
    } else {
      // Si elige uno descubierto, es gol
      this.playerScore = 1;
      this.status = "WON";
      this.matchLogs.push(`⚽ Pateaste hacia ${this.formatDirection(direction)}... ¡GOLAZO!`);
    }
  }

  formatDirection(dir) {
    const map = {
      "TOP_LEFT": "arriba a la izquierda",
      "BOTTOM_LEFT": "abajo a la izquierda",
      "CENTER": "el centro",
      "TOP_RIGHT": "arriba a la derecha",
      "BOTTOM_RIGHT": "abajo a la derecha"
    };
    return map[dir] || dir;
  }
}
