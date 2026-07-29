import { BaseMinigame } from "./BaseMinigame.js";
import { PenaltyShootoutMinigame } from "./PenaltyShootoutMinigame.js";
import { getCupMatrixConfig } from "../../data/cups/cupsCatalog.js";

export class MatrixMinigame extends BaseMinigame {
  /**
   * Genera el estado inicial del "Buscaminas de Copas".
   */
  constructor(cupType, playerOVR, playerStat, teamPower, isNarrative = false) {
    super("matrix", isNarrative);
    this.cupType = cupType;
    this.playerStat = playerStat;

    // Obtener configuración desde el catálogo centralizado
    const cupConfig = getCupMatrixConfig(cupType);
    const size = cupConfig.gridSize ?? 64;
    this.requiredWins = cupConfig.requiredWins ?? 6;
    let maxDraws = cupConfig.maxDraws ?? 4;

    const collectiveStrength = (teamPower * 0.7) + (playerOVR * 0.3);
    this.difficultyLabel = "NORMAL";
    let winCount = 30;
    let drawCount = 12;

    if (collectiveStrength < 50) {
      this.difficultyLabel = "EXTREMA";
      winCount = 15; drawCount = 15;
    } else if (collectiveStrength < 65) {
      this.difficultyLabel = "DIFÍCIL";
      winCount = 22; drawCount = 15;
    } else if (collectiveStrength < 80) {
      this.difficultyLabel = "NORMAL";
      winCount = 30; drawCount = 12;
    } else {
      this.difficultyLabel = "FÁCIL";
      winCount = 42; drawCount = 8;
    }

    this.grid = new Array(size).fill("LOSS");
    this._placeRandomly(this.grid, "WIN", winCount);
    this._placeRandomly(this.grid, "DRAW", drawCount);

    let hints = 0;
    if (playerStat >= 95) hints = 12;
    else if (playerStat >= 90) hints = 8;
    else if (playerStat >= 85) hints = 4;
    else hints = 0;

    let hintsPlaced = 0;
    while (hintsPlaced < hints) {
      const idx = Math.floor(Math.random() * size);
      if (this.grid[idx] === "LOSS") {
        this.grid[idx] = "HINT_LOSS";
        hintsPlaced++;
      }
    }

    this.currentWins = 0;
    this.eliminatedOpponents = [];
    this.currentOpponent = null;
    this.currentOpponentTeamId = null;
    this.matchScore = null;
    this.penaltyShootout = null;
  }

  _placeRandomly(grid, type, count) {
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
   * Resuelve el click en un casillero de la matriz.
   */
  resolveClick(index, randomOpponentTeam) {
    if (this.status !== "PLAYING") return;

    const result = this.grid[index];
    const oppName = randomOpponentTeam ? randomOpponentTeam.name : "Rival";
    const roundName = `Ronda ${this.currentWins + 1}`;

    const randomGoalsPlayer = Math.floor(Math.random() * 3) + 1;
    const randomGoalsOpponent = Math.floor(Math.random() * 3) + 1;

    if (result === "WIN") {
      this.currentWins += 1;
      this.grid[index] = "REVEALED_WIN";
      const gO = Math.floor(Math.random() * randomGoalsPlayer);
      this.matchLogs.push(`✅ Victoria ${randomGoalsPlayer}-${gO} vs ${oppName} en ${roundName}`);

      if (randomOpponentTeam) {
        this.eliminatedOpponents.push(randomOpponentTeam.id);
      }

      if (this.currentWins >= this.requiredWins) {
        this.status = "WON";
      }
    } else if (result === "LOSS" || result === "HINT_LOSS") {
      this.grid[index] = "REVEALED_LOSS";
      this.status = "ELIMINATED";
      const gP = Math.floor(Math.random() * randomGoalsOpponent);
      this.matchLogs.push(`❌ Derrota ${gP}-${randomGoalsOpponent} vs ${oppName} en ${roundName}. Eliminado.`);
    } else if (result === "DRAW") {
      this.grid[index] = "REVEALED_DRAW";
      this.status = "PENALTIES";
      const goals = Math.floor(Math.random() * 3);
      this.matchLogs.push(`⚖️ Empate ${goals}-${goals} vs ${oppName} en ${roundName}. ¡Hay Penales!`);
      this.currentOpponentTeamId = randomOpponentTeam ? randomOpponentTeam.id : null;
      this.currentOpponent = oppName;
      this.matchScore = `${goals}-${goals}`;

      this.penaltyShootout = new PenaltyShootoutMinigame(this.playerStat, false);
    }
  }

  resolvePenaltyEnd() {
    if (this.status !== "PENALTIES" || !this.penaltyShootout) return;

    const shootout = this.penaltyShootout;
    const opp = this.currentOpponent || "Rival";
    const score = this.matchScore || "1-1";

    if (shootout.status === "WON") {
      this.status = "PLAYING";
      this.currentWins += 1;

      const penWin = Math.floor(Math.random() * 2) + 4;
      const penLoss = penWin - Math.floor(Math.random() * 2) - 1;
      this.matchLogs.push(`🏆 ¡Victoria ${score} (${penWin}-${penLoss}) vs ${opp}!`);

      if (this.currentOpponentTeamId) {
        this.eliminatedOpponents.push(this.currentOpponentTeamId);
      }

      if (this.currentWins >= this.requiredWins) {
        this.status = "WON";
      }
    } else if (shootout.status === "ELIMINATED") {
      this.status = "ELIMINATED";
      const penWin = Math.floor(Math.random() * 2) + 4;
      const penLoss = penWin - Math.floor(Math.random() * 2) - 1;
      this.matchLogs.push(`💀 Derrota ${score} (${penLoss}-${penWin}) vs ${opp}. Eliminado.`);
    }
  }
}