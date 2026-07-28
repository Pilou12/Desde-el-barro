import sys

def patch_app_router():
    with open('src/ui/AppRouter.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace constructor state initialization with getter/setter & sync
    old_state_init = '''    this.state = {
      screen: "START_MENU", // START_MENU, CUSTOM_SETUP, DASHBOARD, TRAINING, MIDSEASON, SEASON_SUMMARY, TRANSFER_MARKET, STORE, RETIREMENT
      currentTrainingOptions: [],
      lastSeasonResult: null,
      selectedDivisionTab: "primera", // primera, b_nacional, b_metro, primera_c
      selectedCustomTeamId: "river",
      selectedPositionKey: "delantero",
      summaryLeagueIndex: 0 // Índice para el carrusel de ligas
    };'''

    new_state_init = '''    this._localState = {
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
    }'''

    if old_state_init in content:
        content = content.replace(old_state_init, new_state_init)

    # Add getter/setter for this.state in AppRouter class
    getter_code = '''  get state() {
    return this.stateManager ? this.stateManager.getState() : this._localState;
  }

  syncEngineState() {
    if (this.stateManager && this.engine) {
      this.stateManager.update({
        player: this.engine.player,
        currentTeam: this.engine.currentTeam,
        currentLeague: this.engine.currentLeague,
        leagueManager: this.engine.leagueManager,
        activeMinigame: this.engine.activeMinigame,
        seasonPhase: this.engine.seasonPhase
      });
    }
  }
'''

    if 'get state()' not in content:
        content = content.replace('init() {', getter_code + '\n  init() {')

    # Patch btn.onclick for btn-event-option to call syncEngineState()
    old_event_handler = '''        this.engine.resolveMidseasonEvent(idx);

        if (this.engine.seasonPhase === "NARRATIVE_MINIGAME") {'''

    new_event_handler = '''        this.engine.resolveMidseasonEvent(idx);
        this.syncEngineState();

        if (this.engine.seasonPhase === "NARRATIVE_MINIGAME") {'''

    if old_event_handler in content:
        content = content.replace(old_event_handler, new_event_handler)

    # Patch btnContinueSeason to call syncEngineState()
    old_cont_handler = '''        this.engine.resolveMidseasonEvent(-1);
        
        if (this.engine.seasonPhase === "NARRATIVE_MINIGAME") {'''

    new_cont_handler = '''        this.engine.resolveMidseasonEvent(-1);
        this.syncEngineState();
        
        if (this.engine.seasonPhase === "NARRATIVE_MINIGAME") {'''

    if old_cont_handler in content:
        content = content.replace(old_cont_handler, new_cont_handler)

    # Patch btnNextTraining
    old_train_handler = '''        this.state.currentTrainingOptions = this.engine.getTrainingOptions();
        this.state.screen = "TRAINING";'''

    new_train_handler = '''        this.syncEngineState();
        this.state.currentTrainingOptions = this.engine.getTrainingOptions();
        this.state.screen = "TRAINING";'''

    if old_train_handler in content:
        content = content.replace(old_train_handler, new_train_handler)

    # Patch startNewCareer
    old_start_career = '''        this.engine.startNewCareer({ mode: "random" });
        this.state.screen = "DASHBOARD";'''

    new_start_career = '''        this.engine.startNewCareer({ mode: "random" });
        this.syncEngineState();
        this.state.screen = "DASHBOARD";'''

    if old_start_career in content:
        content = content.replace(old_start_career, new_start_career)

    old_custom_career = '''        this.engine.startNewCareer({ playerName: name, positionKey, mode: "custom_start", customTeamId });
        this.state.screen = "DASHBOARD";'''

    new_custom_career = '''        this.engine.startNewCareer({ playerName: name, positionKey, mode: "custom_start", customTeamId });
        this.syncEngineState();
        this.state.screen = "DASHBOARD";'''

    if old_custom_career in content:
        content = content.replace(old_custom_career, new_custom_career)

    with open('src/ui/AppRouter.js', 'w', encoding='utf-8') as f:
        f.write(content)

patch_app_router()
