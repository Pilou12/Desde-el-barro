import { EventBus } from "./core/EventBus.js";
import { StateManager } from "./core/StateManager.js";
import { GameManager } from "./core/GameManager.js";
import { CupManager } from "./managers/CupManager.js";
import { SeasonSimulator } from "./managers/SeasonSimulator.js";
import { EconomyManager } from "./managers/EconomyManager.js";
import { MarketManager } from "./domain/MarketManager.js";
import { AppRouter } from "./ui/AppRouter.js";

document.addEventListener("DOMContentLoaded", () => {
  const appContainer = document.getElementById("app");
  if (appContainer) {
    // 1. Inicializar Core
    const eventBus = new EventBus();
    const stateManager = new StateManager(eventBus);

    // 2. Inicializar Managers de Negocio
    const gameManager = new GameManager(stateManager, eventBus);
    const cupManager = new CupManager(stateManager);
    const economyManager = new EconomyManager(stateManager);
    const marketManager = new MarketManager();
    const seasonSimulator = new SeasonSimulator(stateManager, cupManager, marketManager);

    // 3. Inicializar Router de UI
    const router = new AppRouter(appContainer, gameManager, stateManager, eventBus, cupManager, seasonSimulator, economyManager);
    router.init();
  }
});
