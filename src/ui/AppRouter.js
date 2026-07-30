import { MinigameView } from "./views/MinigameView.js";
import { StartMenuView } from "./views/StartMenuView.js";
import { CustomSetupView } from "./views/CustomSetupView.js";
import { DashboardView } from "./views/DashboardView.js";
import { TrainingView } from "./views/TrainingView.js";
import { MidseasonView } from "./views/MidseasonView.js";
import { SeasonSummaryView } from "./views/SeasonSummaryView.js";
import { TransferMarketView } from "./views/TransferMarketView.js";
import { StoreView } from "./views/StoreView.js";
import { RetirementView } from "./views/RetirementView.js";
import { DebugMenuView } from "./views/DebugMenuView.js";

/**
 * AppRouter
 * Despacha el estado global hacia la vista correspondiente.
 */
export class AppRouter {
  constructor(appContainer, gameManager, stateManager, eventBus, cupManager, seasonSimulator, economyManager) {
    this.container = appContainer;
    this.gameManager = gameManager;
    this.stateManager = stateManager;
    this.eventBus = eventBus;
    this.cupManager = cupManager;
    this.seasonSimulator = seasonSimulator;
    this.economyManager = economyManager;

    // View Dependencies Map
    this.viewDeps = {
      gameManager,
      stateManager,
      eventBus,
      cupManager,
      seasonSimulator,
      economyManager,
      appRouter: this
    };

    if (this.eventBus) {
      this.eventBus.on("stateChanged", () => {
        if (this.state.screen !== "CUP_MATCH" && this.state.screen !== "NARRATIVE_MINIGAME") {
          this.render();
        }
      });
    }

    this._localState = {
      screen: "START_MENU",
      currentTrainingOptions: [],
      lastSeasonResult: null,
      selectedDivisionTab: "primera",
      selectedCustomTeamId: "river",
      selectedPositionKey: "delantero",
      summaryLeagueIndex: 0
    };

    if (this.stateManager) {
      this.stateManager.update(this._localState);
    }
  }

  get state() {
    return this.stateManager ? this.stateManager.getState() : this._localState;
  }

  init() {
    this.render();
  }

  render() {
    // Destruir vista activa anterior si tiene cleanup (ej: MinigameView desuscribe listeners)
    if (this._activeView && typeof this._activeView.destroy === "function") {
      this._activeView.destroy();
    }
    this._activeView = null;

    this.container.innerHTML = "";

    const brandHeader = `
      <header class="header-brand">
        <h1>DESDE EL BARRO</h1>
        <p>Hacé tu carrera profesional en el Fútbol Argentino y Mundial</p>
      </header>
    `;

    // Contenedor principal de la vista
    const mainContent = document.createElement("main");

    this.container.innerHTML = brandHeader;
    this.container.appendChild(mainContent);

    let activeView = null;

    switch (this.state.screen) {
      case "START_MENU":
        activeView = new StartMenuView(mainContent, this.viewDeps);
        break;
      case "CUSTOM_SETUP":
        activeView = new CustomSetupView(mainContent, this.viewDeps);
        break;
      case "DASHBOARD":
        activeView = new DashboardView(mainContent, this.viewDeps);
        break;
      case "TRAINING":
        activeView = new TrainingView(mainContent, this.viewDeps);
        break;
      case "MIDSEASON":
        activeView = new MidseasonView(mainContent, this.viewDeps);
        break;
      case "SEASON_SUMMARY":
        activeView = new SeasonSummaryView(mainContent, this.viewDeps);
        break;
      case "TRANSFER_MARKET":
        activeView = new TransferMarketView(mainContent, this.viewDeps);
        break;
      case "STORE":
        activeView = new StoreView(mainContent, this.viewDeps);
        break;
      case "RETIREMENT":
        activeView = new RetirementView(mainContent, this.viewDeps);
        break;
      case "CUP_MATCH":
      case "NARRATIVE_MINIGAME":
        activeView = new MinigameView(mainContent, this.viewDeps);
        break;
      case "DEBUG_MENU":
        activeView = new DebugMenuView(mainContent, this.viewDeps);
        break;
      default:
        activeView = new StartMenuView(mainContent, this.viewDeps);
    }

    if (activeView) {
      this._activeView = activeView;
      activeView.render();
    }
  }
}