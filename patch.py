import sys

def patch_app_router():
    with open('src/ui/AppRouter.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace AppUI with AppRouter
    content = content.replace('class AppUI {', 'class AppRouter {')
    
    # Extract the top imports and replace them
    new_top = '''import { PositionFactory } from "../domain/positions/PositionStrategy.js";
import { ARGENTINE_LEAGUES } from "../data/leagues/argLeaguesData.js";
import { SeasonNarrator } from "../domain/SeasonNarrator.js";
import { STORE_ITEMS, getStoreItemById } from '../domain/StoreCatalog.js';
import { MinigameView } from "./views/MinigameView.js";

export class AppRouter {
  constructor(appContainer, gameManager, stateManager, eventBus, cupManager, seasonSimulator, economyManager) {
    this.container = appContainer;
    this.gameManager = gameManager;
    this.stateManager = stateManager;
    this.eventBus = eventBus;
    this.cupManager = cupManager;
    this.seasonSimulator = seasonSimulator;
    this.economyManager = economyManager;
    
    // Vista aislada para evitar parpadeos
    this.minigameView = new MinigameView(this.container, this.stateManager, this.eventBus, this.cupManager);
    
    this.eventBus.on("stateChanged", () => {
      // Re-render global solo si no estamos en minijuegos que se auto-renderizan
      const s = this.stateManager.getState();
      if (s.screen !== "CUP_MATCH" && s.screen !== "NARRATIVE_MINIGAME") {
        this.render();
      }
    });
  }

  // Proxy de compatibilidad para evitar tocar 1500 líneas de golpe
  get state() { return this.stateManager.getState(); }
  set state(val) { /* ignorar, ahora usamos stateManager.update */ }

  get engine() { 
    return {
      player: this.state.player,
      currentTeam: this.state.currentTeam,
      currentLeague: this.state.currentLeague,
      activeMidseasonEvent: this.state.activeMidseasonEvent,
      midseasonEvents: this.state.midseasonEvents,
      activeMinigame: this.state.activeMinigame,
      getTrainingOptions: () => this.gameManager.getTrainingOptions(),
      applyTrainingCard: (c) => this.gameManager.applyTrainingCard(c),
      startNewCareer: (args) => this.gameManager.startNewCareer(args),
      acceptTransferOffer: (idx) => this.economyManager.acceptTransferOffer(idx),
      rejectAllTransferOffers: () => this.economyManager.rejectAllTransferOffers(),
      finishCurrentSeason: () => this.seasonSimulator.finishCurrentSeason(),
      resolveCupMatrixClick: (idx) => this.cupManager.resolveCupMatrixClick(idx),
      resolvePenaltyKick: (dir) => this.cupManager.resolvePenaltyKick(dir),
      resolveNarrativePenaltyKick: (dir) => { /* Temporalmente en minigameView */ }
    };
  }

  init() {
    this.render();
  }

  render() {
    if (this.state.screen === "CUP_MATCH" || this.state.screen === "NARRATIVE_MINIGAME") {
      this.minigameView.render(this.state);
      return;
    }

    this.container.innerHTML = "";'''

    # Find the start and end of what to replace
    import_start = content.find('import { CareerEngine }')
    render_start = content.find('  render() {\\n    this.container.innerHTML = "";')
    
    # We replace from import_start up to render_start with our new_top
    if import_start != -1 and render_start != -1:
        content = content[:import_start] + new_top + content[render_start + len('  render() {\\n    this.container.innerHTML = "";'):]

    # Also remove the renderCupMatch and renderNarrativeMinigame to ensure they are fully delegated
    # (Optional, we just won't call them)

    with open('src/ui/AppRouter.js', 'w', encoding='utf-8') as f:
        f.write(content)

patch_app_router()
