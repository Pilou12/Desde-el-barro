import sys

def patch_app_router():
    with open('src/ui/AppRouter.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Add MinigameView import
    if 'MinigameView' not in content:
        content = 'import { MinigameView } from "./views/MinigameView.js";\n' + content

    # 2. Patch constructor
    old_constructor = '''  constructor(appContainer) {
    this.container = appContainer;
    this.engine = new CareerEngine();'''
    
    new_constructor = '''  constructor(appContainer, gameManager, stateManager, eventBus, cupManager, seasonSimulator, economyManager) {
    this.container = appContainer;
    this.gameManager = gameManager;
    this.stateManager = stateManager;
    this.eventBus = eventBus;
    this.cupManager = cupManager;
    this.seasonSimulator = seasonSimulator;
    this.economyManager = economyManager;
    
    this.minigameView = new MinigameView(this.container, this.stateManager, this.eventBus, this.cupManager);
    this.engine = new CareerEngine();
    
    if (this.eventBus) {
      this.eventBus.on("stateChanged", () => {
        if (this.state.screen !== "CUP_MATCH" && this.state.screen !== "NARRATIVE_MINIGAME") {
          this.render();
        }
      });
    }'''

    if old_constructor in content:
        content = content.replace(old_constructor, new_constructor)

    # 3. Patch render() method to delegate minigames
    old_render_start = '  render() {\n    this.container.innerHTML = "";'
    new_render_start = '''  render() {
    if (this.state.screen === "CUP_MATCH" || this.state.screen === "NARRATIVE_MINIGAME") {
      this.minigameView.render(this.state);
      return;
    }
    this.container.innerHTML = "";'''

    if old_render_start in content:
        content = content.replace(old_render_start, new_render_start)

    with open('src/ui/AppRouter.js', 'w', encoding='utf-8') as f:
        f.write(content)

patch_app_router()
