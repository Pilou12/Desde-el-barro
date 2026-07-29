import { Player } from "../domain/Player.js";
import { LeagueManager } from "../domain/LeagueManager.js";
import { ARGENTINE_LEAGUES } from "../data/leagues/argLeaguesData.js";
import { INTERNATIONAL_LEAGUES } from "../data/leagues/intlLeaguesData.js";
import { EventManager } from "../domain/EventManager.js";
import { MarketManager } from "../domain/MarketManager.js";
import { MinigameEngine } from "../domain/MinigameEngine.js";

/**
 * GameManager.js
 * Orquestador principal de la lógica central del juego.
 * Extrae la responsabilidad inicial de CareerEngine.
 */
export class GameManager {
  constructor(stateManager, eventBus) {
    this.stateManager = stateManager;
    this.eventBus = eventBus;
    this.eventManager = new EventManager();
    this.marketManager = new MarketManager();
  }

  startNewCareer({ playerName = "El Pibe", positionKey = "delantero", mode = "random", customTeamId = null }) {
    const leagueManager = new LeagueManager(ARGENTINE_LEAGUES, INTERNATIONAL_LEAGUES);
    const player = new Player({ name: playerName, positionKey, initialAge: 16 });

    // Por defecto, en el primer año todos juegan Copa Argentina
    player.qualifiedCups = ["copa_argentina"];

    let currentLeague, currentTeam;

    if (mode === "random") {
      const isPrimeraC = Math.random() < 0.6;
      currentLeague = isPrimeraC
        ? leagueManager.getLeagueByCountryAndTier("ar", 4)
        : leagueManager.getLeagueByCountryAndTier("ar", 3);
      currentTeam = currentLeague.getRandomTeam();
    } else {
      const foundTeam = leagueManager.findTeamById(customTeamId);
      if (foundTeam) {
        currentTeam = foundTeam.team;
        currentLeague = foundTeam.league;
      } else {
        currentLeague = leagueManager.getLeagueByCountryAndTier("ar", 4);
        currentTeam = currentLeague.getRandomTeam();
      }
    }

    this.stateManager.update({
      mode,
      currentYear: 2026,
      leagueManager,
      player,
      currentTeam,
      currentLeague,
      seasonPhase: "PRESEASON",
      selectedTrainingCard: null,
      activeMidseasonEvent: null,
      midseasonEvents: [],
      midseasonEventIndex: 0,
      midseasonEventResults: [],
      currentTransferOffers: [],
      pendingMatchesPenalty: 0,
      activeMinigame: null,
      cupResults: [],
      screen: "DASHBOARD" // Cambiamos de pantalla directamente a través del estado
    });
  }

  getTrainingOptions() {
    const state = this.stateManager.getState();
    return this.eventManager.getTrainingCardsForPlayer(state.player, 3);
  }

  applyTrainingCard(card) {
    this.stateManager.mutate((state) => {
      state.selectedTrainingCard = card;
      if (card) state.player.applyTraining(card);
      this._startMidseasonPhase(state);
    });
  }

  skipTraining() {
    this.stateManager.mutate((state) => {
      state.selectedTrainingCard = null;
      this._startMidseasonPhase(state);
    });
  }

  _startMidseasonPhase(state) {
    state.seasonPhase = "MIDSEASON_EVENT";
    state.midseasonEvents = this.eventManager.getSeasonEventsForPlayer(state.player, state.currentTeam);
    state.midseasonEventIndex = 0;
    state.midseasonEventResults = [];
    if (state.midseasonEvents.length > 0) {
      state.activeMidseasonEvent = state.midseasonEvents[0];
    } else {
      state.activeMidseasonEvent = null;
      this._transitionToNextCupOrEnd(state);
    }
  }

  resolveMidseasonEvent(optionIndex) {
    this.stateManager.mutate((state) => {
      if (!state.activeMidseasonEvent) return;

      if (optionIndex === -1) {
        this._continueFromMidseasonEvent(state);
        return;
      }

      const option = state.activeMidseasonEvent.options[optionIndex];
      if (option.logic) {
        option.logic(state.player, state.currentTeam);
      }

      const resolvedOption = { ...option };
      const needsMinigame = option.triggerMinigame || option.action === "TAKE_FREEKICK" || option.action === "TAKE_PENALTY";
      if (needsMinigame) {
        state.seasonPhase = "NARRATIVE_MINIGAME";
        const playerStat = state.player.position.getPrimaryStatValue(state.player.attributes);
        if (option.action === "TAKE_FREEKICK") {
          state.activeMinigame = MinigameEngine.generateFreeKick(playerStat, true);
        } else {
          // TAKE_PENALTY o triggerMinigame genérico → penal
          state.activeMinigame = MinigameEngine.generatePenaltyShootout(playerStat, true);
        }
      }

      state.midseasonEventResults.push({
        event: state.activeMidseasonEvent,
        optionIndex,
        option: resolvedOption
      });

      if (!needsMinigame) {
        this._continueFromMidseasonEvent(state);
      }
    });
  }

  _continueFromMidseasonEvent(state) {
    state.midseasonEventIndex += 1;
    if (state.midseasonEventIndex < state.midseasonEvents.length) {
      state.activeMidseasonEvent = state.midseasonEvents[state.midseasonEventIndex];
    } else {
      state.activeMidseasonEvent = null;
      this._transitionToNextCupOrEnd(state);
    }
  }

  resolveNarrativePenaltyKick(direction) {
    this.stateManager.mutate((state) => {
      if (!state.activeMinigame || !state.activeMinigame.isNarrative || state.activeMinigame.status !== "PLAYING") return;

      const currentKick = state.activeMinigame.kicks[state.activeMinigame.currentKick];
      currentKick.playerDirection = direction;

      if (direction === currentKick.correctDirection) {
        state.activeMinigame.playerScore += 1;
        currentKick.scored = true;
      } else {
        currentKick.scored = false;
      }

      state.activeMinigame.currentKick += 1;

      if (!currentKick.scored) {
        state.activeMinigame.status = "ELIMINATED";
        state.player.reputation = Math.max(0, state.player.reputation - 15);
        state.player.addIdolScore(state.currentTeam.id, -10, state.currentTeam.power);
        state.player.attributes.applyDelta({ definicion: -2, mentalidad: -3 });
      } else if (state.activeMinigame.currentKick >= 3) {
        state.activeMinigame.status = "WON";
        state.player.reputation = Math.min(100, state.player.reputation + 25);
        state.player.addIdolScore(state.currentTeam.id, 50, state.currentTeam.power);
        state.player.attributes.applyDelta({ definicion: 2, mentalidad: 3 });
      }
    });
  }

  continueFromNarrativeMinigame() {
    this.stateManager.mutate((state) => {
      state.activeMinigame = null;
      this._continueFromMidseasonEvent(state);
    });
  }

  continueFromCup() {
    this.stateManager.mutate((state) => {
      this._transitionToNextCupOrEnd(state);
    });
  }

  _transitionToNextCupOrEnd(state) {
    if (state.player.qualifiedCups && state.player.qualifiedCups.length > 0) {
      const nextCup = state.player.qualifiedCups.shift();
      if (nextCup === "copa_argentina") {
        state.seasonPhase = "CUP_NATIONAL";
      } else {
        state.seasonPhase = "CUP_INTERNATIONAL";
      }
      const playerStat = state.player.position.getPrimaryStatValue(state.player.attributes);
      state.activeMinigame = MinigameEngine.generateCupMatrix(nextCup, state.player.calculateOVR(), playerStat, state.currentTeam.power);
    } else {
      state.activeMinigame = null;
      state.seasonPhase = "SEASON_END";
    }
  }

}