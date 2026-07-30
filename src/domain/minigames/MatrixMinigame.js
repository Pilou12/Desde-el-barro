import { BaseMinigame } from "./BaseMinigame.js";
import { PenaltyShootoutMinigame } from "./PenaltyShootoutMinigame.js";

export class MatrixMinigame extends BaseMinigame {
  /**
   * Genera el estado inicial del "Buscaminas de Copas".
   * Ahora recibe una configuración 100% genérica.
   */
  constructor(config, isNarrative = false) {
    super("matrix", isNarrative);
    this.cupType = config.cupType;

    const size = config.gridSize ?? 64;
    this.hasGroupStage = config.hasGroupStage ?? false;
    this.requiredWins = config.requiredWins ?? 6;

    this.currentPhase = this.hasGroupStage ? "GROUP_STAGE" : "KNOCKOUT";
    this.groupMatchesPlayed = 0;
    this.groupPoints = 0;

    this.difficultyLabel = config.difficultyLabel || "NORMAL";
    let winCount = config.winCount ?? 30;
    let drawCount = config.drawCount ?? 12;

    this.grid = new Array(size).fill("LOSS");
    this._placeRandomly(this.grid, "WIN", winCount);
    this._placeRandomly(this.grid, "DRAW", drawCount);

    let hints = config.hintsCount ?? 0;
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

    this.penaltyConfig = config.penaltyConfig || { totalKicks: 3, kicksWithHints: 0 };

    if (this.cupType === "recopa") {
      this.status = "PENALTIES";
      this.currentOpponent = "Rival de Recopa";
      this.matchScore = "1-1";
      this.penaltyShootout = new PenaltyShootoutMinigame(this.penaltyConfig, false);
    }
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
    
    const randomGoalsPlayer = Math.floor(Math.random() * 3) + 1;
    const randomGoalsOpponent = Math.floor(Math.random() * 3) + 1;

    if (this.currentPhase === "GROUP_STAGE") {
      this.groupMatchesPlayed += 1;
      const matchDesc = `Fase de Grupos (Partido ${this.groupMatchesPlayed}/3)`;

      if (result === "WIN") {
        this.grid[index] = "REVEALED_WIN";
        this.groupPoints += 3;
        const gO = Math.floor(Math.random() * randomGoalsPlayer);
        this.matchLogs.push(`✅ Victoria ${randomGoalsPlayer}-${gO} vs ${oppName} en ${matchDesc}`);
      } else if (result === "DRAW") {
        this.grid[index] = "REVEALED_DRAW";
        this.groupPoints += 1;
        const goals = Math.floor(Math.random() * 3);
        this.matchLogs.push(`⚖️ Empate ${goals}-${goals} vs ${oppName} en ${matchDesc}`);
      } else {
        this.grid[index] = "REVEALED_LOSS";
        const gP = Math.floor(Math.random() * randomGoalsOpponent);
        this.matchLogs.push(`❌ Derrota ${gP}-${randomGoalsOpponent} vs ${oppName} en ${matchDesc}`);
      }

      if (this.groupMatchesPlayed >= 3) {
        if (this.groupPoints >= 4) {
          this.currentPhase = "KNOCKOUT";
          this.matchLogs.push(`⭐ ¡Clasificaste a la siguiente fase con ${this.groupPoints} puntos!`);
        } else if (this.groupPoints === 3 && this.cupType !== "copa_america") {
          this.currentPhase = "KNOCKOUT";
          this.requiredWins = 5; // Requiere 16avos también
          if (this.cupType === "libertadores") {
            this.cupType = "sudamericana"; // Relegado
            this.matchLogs.push(`⚠️ Quedaste 3ro (${this.groupPoints} pts). Relegado a 16avos de Copa Sudamericana.`);
          } else {
            this.matchLogs.push(`⚠️ Clasificaste con lo justo (${this.groupPoints} pts) a 16avos de Final.`);
          }
        } else {
          this.status = "ELIMINATED";
          this.matchLogs.push(`💀 Eliminado en Fase de Grupos con ${this.groupPoints} puntos.`);
        }
      }
      return;
    }

    // KNOCKOUT PHASE (or cup without group stage)
    const roundName = `Ronda ${this.currentWins + 1}`;

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

      this.penaltyShootout = new PenaltyShootoutMinigame(this.penaltyConfig, false);
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