import { MatrixMinigame } from "./minigames/MatrixMinigame.js";
import { PenaltyShootoutMinigame } from "./minigames/PenaltyShootoutMinigame.js";
import { FreeKickMinigame } from "./minigames/FreeKickMinigame.js";
import { getCupMatrixConfig } from "../data/cups/cupsCatalog.js";

/**
 * Motor para la generación de minijuegos interactivos (Copas, Penales, Tiros Libres).
 * Actúa como Factory para traducir el estado del jugador a una configuración puramente matemática.
 */
export class MinigameEngine {

  /**
   * Genera el estado inicial del "Buscaminas de Copas".
   */
  static generateCupMatrix(cupType, playerOVR, playerStat, teamPower) {
    const cupConfig = getCupMatrixConfig(cupType);
    const gridSize = cupConfig.gridSize ?? 64;
    const hasGroupStage = cupConfig.hasGroupStage ?? false;
    const requiredWins = cupConfig.knockoutWins ?? 6;

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

    let hintsCount = 0;
    if (playerStat >= 95) hintsCount = 12;
    else if (playerStat >= 90) hintsCount = 8;
    else if (playerStat >= 85) hintsCount = 4;
    else hintsCount = 0;

    const penaltyConfig = MinigameEngine.generatePenaltyShootout(playerStat).config;

    const config = {
      cupType,
      gridSize,
      hasGroupStage,
      requiredWins,
      winCount,
      drawCount,
      hintsCount,
      difficultyLabel,
      penaltyConfig
    };

    return new MatrixMinigame(config, false);
  }

  /**
   * Genera las tendencias del arquero para una tanda de penales.
   */
  static generatePenaltyShootout(playerStat, isNarrative = false) {
    const totalKicks = 3;
    let kicksWithHints = 0;
    if (playerStat >= 85) {
      kicksWithHints = 3; // Todos los tiros tienen pista
    }

    const config = {
      totalKicks,
      kicksWithHints
    };

    const shootout = new PenaltyShootoutMinigame(config, isNarrative);
    shootout.config = config; // Guardamos la config para poder reusarla
    return shootout;
  }

  /**
   * Genera un tiro libre.
   */
  static generateFreeKick(playerStat, isNarrative = true) {
    let hasHint = false;
    if (playerStat >= 85) {
      hasHint = true;
    }

    const config = {
      hasHint
    };

    return new FreeKickMinigame(config, isNarrative);
  }
}
