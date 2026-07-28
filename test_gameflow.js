import { StateManager } from './src/core/StateManager.js';
import { EventBus } from './src/core/EventBus.js';
import { GameManager } from './src/core/GameManager.js';
import { SeasonSimulator } from './src/managers/SeasonSimulator.js';
import { CupManager } from './src/managers/CupManager.js';
import { MarketManager } from './src/domain/MarketManager.js';

const eventBus = new EventBus();
const stateManager = new StateManager(eventBus);
const gameManager = new GameManager(stateManager, eventBus);
const cupManager = new CupManager(stateManager);
const marketManager = new MarketManager();
const seasonSimulator = new SeasonSimulator(stateManager, cupManager, marketManager);

const originalLog = console.log;
console.log = () => {};

try {
  originalLog("Iniciando carrera...");
  gameManager.startNewCareer({ playerName: "Test", positionKey: "delantero", mode: "random" });

  let loops = 0;
  while (stateManager.getState().player.age < 22 && loops < 1000) {
    loops++;
    const state = stateManager.getState();
    const phase = state.seasonPhase;
    const screen = state.screen;

    if (screen === 'DASHBOARD') {
      stateManager.update({ screen: 'TRAINING' });
    } else if (screen === 'TRAINING') {
      gameManager.skipTraining();
      
      const st = stateManager.getState();
      if (st.seasonPhase === "MIDSEASON_EVENT" && st.activeMidseasonEvent) {
          stateManager.update({screen: "MIDSEASON"});
      } else if (st.seasonPhase === "CUP_NATIONAL" || st.seasonPhase === "CUP_INTERNATIONAL") {
          stateManager.update({screen: "CUP_MATCH"});
      } else {
          seasonSimulator.finishCurrentSeason();
      }
    } else if (screen === 'MIDSEASON') {
      gameManager.resolveMidseasonEvent(0);
      
      const st = stateManager.getState();
      if (st.seasonPhase === "NARRATIVE_MINIGAME") {
          stateManager.update({screen: "NARRATIVE_MINIGAME"});
      } else if (st.activeMidseasonEvent !== null) {
          stateManager.update({screen: "MIDSEASON"});
      } else if (st.seasonPhase === "CUP_NATIONAL" || st.seasonPhase === "CUP_INTERNATIONAL") {
          stateManager.update({screen: "CUP_MATCH"});
      } else {
          seasonSimulator.finishCurrentSeason();
      }
    } else if (screen === 'NARRATIVE_MINIGAME') {
      gameManager.continueFromNarrativeMinigame();
      const st = stateManager.getState();
      if (st.activeMidseasonEvent !== null) {
          stateManager.update({screen: "MIDSEASON"});
      } else if (st.seasonPhase === "CUP_NATIONAL" || st.seasonPhase === "CUP_INTERNATIONAL") {
          stateManager.update({screen: "CUP_MATCH"});
      } else {
          seasonSimulator.finishCurrentSeason();
      }
    } else if (screen === 'CUP_MATCH') {
      if (state.activeMinigame && state.activeMinigame.type === 'CUP_MATRIX' && state.activeMinigame.status === 'PLAYING') {
          cupManager.resolveCupMatrixClick(0);
      } else if (state.activeMinigame && state.activeMinigame.type === 'PENALTY_SHOOTOUT' && state.activeMinigame.status === 'PLAYING') {
          cupManager.resolvePenaltyKick("C");
      } else {
          gameManager.continueFromCup();
          const st = stateManager.getState();
          if (st.seasonPhase === "CUP_NATIONAL" || st.seasonPhase === "CUP_INTERNATIONAL") {
              stateManager.update({screen: "CUP_MATCH"});
          } else {
              seasonSimulator.finishCurrentSeason();
          }
      }
    } else if (screen === 'SEASON_SUMMARY') {
      stateManager.update({screen: "TRANSFER_MARKET"});
    } else if (screen === 'TRANSFER_MARKET') {
      const allLgs = state.leagueManager.getAllLeagues();
      const offers = marketManager.generateOffersForPlayer(state.player, state.currentTeam, allLgs, 3);
      stateManager.update({currentTransferOffers: offers});
      state.player.age++;
      state.currentYear++;
      stateManager.update({
          seasonPhase: "PRESEASON",
          screen: "DASHBOARD",
          currentTransferOffers: [],
          midseasonEventResults: [],
          cupResults: [],
          lastSeasonResult: null
      });
      originalLog(`Temporada finalizada. Jugador ahora tiene ${state.player.age} años.`);
    } else if (screen === 'RETIREMENT') {
      originalLog("El jugador se retiró prematuramente.");
      break;
    } else {
      originalLog("PANTALLA DESCONOCIDA: " + screen);
      break;
    }
  }

  if (stateManager.getState().player.age >= 22) {
    originalLog("¡Éxito! El jugador llegó a los 22 años sin errores de transición.");
  } else {
    originalLog("La simulación se detuvo antes de los 22 años.");
  }
} catch (e) {
  originalLog("¡ERROR DURANTE LA SIMULACIÓN!");
  originalLog(e.stack);
}
