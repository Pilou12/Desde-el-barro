/**
 * StateManager.js
 * Repositorio centralizado del estado del juego.
 */
export class StateManager {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.state = {
      // Estado UI (Router)
      screen: "START_MENU",

      // Estado Carrera
      player: null,
      currentTeam: null,
      currentLeague: null,
      currentYear: 2026,
      leagueManager: null,
      mode: "random",
      seasonPhase: "PRESEASON",

      // Estado UI Detallado (antes en AppUI)
      currentTrainingOptions: [],
      lastSeasonResult: null,
      selectedDivisionTab: "primera",
      selectedCustomTeamId: "river",
      selectedPositionKey: "delantero",
      summaryLeagueIndex: 0,

      // Estado de Minijuegos y Eventos
      selectedTrainingCard: null,
      activeMidseasonEvent: null,
      midseasonEvents: [],
      midseasonEventIndex: 0,
      midseasonEventResults: [],
      currentTransferOffers: [],
      pendingMatchesPenalty: 0,
      activeMinigame: null,
      cupResults: [],
      cupWinners: {}
    };
  }

  get(key) {
    return this.state[key];
  }

  getState() {
    return this.state;
  }

  update(newStateMap) {
    this.state = { ...this.state, ...newStateMap };
    this.eventBus.emit("stateChanged", this.state);
  }

  // Helper para modificar propiedades anidadas o empujar arrays sin reescribir todo
  mutate(mutatorFn) {
    mutatorFn(this.state);
    this.eventBus.emit("stateChanged", this.state);
  }
}
