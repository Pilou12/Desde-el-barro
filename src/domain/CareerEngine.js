import { Player } from "./Player.js";
import { EventManager } from "./EventManager.js";
import { MarketManager } from "./MarketManager.js";
import { MinigameEngine } from "./MinigameEngine.js";
import { ARGENTINE_LEAGUES } from "../data/leagues/argLeaguesData.js";
import { INTERNATIONAL_LEAGUES } from "../data/leagues/intlLeaguesData.js";
import { LeagueManager } from "./LeagueManager.js";

/**
 * Clase CareerEngine (POO)
 * Motor central de la simulación de carrera con flujo interactivo por etapas y mercado de pases con ofertas reales.
 */
export class CareerEngine {
  constructor() {
    this.player = null;
    this.currentTeam = null;
    this.currentLeague = null;
    this.currentYear = 2026;
    this.leagueManager = null;
    this.eventManager = new EventManager();
    this.marketManager = new MarketManager();
    this.mode = "random";
    this.seasonPhase = "PRESEASON"; // PRESEASON, MIDSEASON_EVENT, SEASON_END, TRANSFER_MARKET
    this.selectedTrainingCard = null;
    this.activeMidseasonEvent = null;     // evento actual (un objeto)
    this.midseasonEvents = [];            // array completo de eventos del año
    this.midseasonEventIndex = 0;         // cuál se está mostrando ahora
    this.midseasonEventResults = [];      // [{event, optionIndex, option}]
    this.currentTransferOffers = [];
    this.pendingMatchesPenalty = 0;       // penalización por lesión
    this.activeMinigame = null;           // Estado del minijuego activo
    this.cupResults = [];                 // Historial de copas jugadas este año
  }

  startNewCareer({ playerName = "El Pibe", positionKey = "delantero", mode = "random", customTeamId = null }) {
    this.mode = mode;
    this.currentYear = 2026;
    this.leagueManager = new LeagueManager(ARGENTINE_LEAGUES, INTERNATIONAL_LEAGUES);
    this.player = new Player({ name: playerName, positionKey, initialAge: 16 });
    this.seasonPhase = "PRESEASON";
    this.selectedTrainingCard = null;
    this.activeMidseasonEvent = null;
    this.midseasonEvents = [];
    this.midseasonEventIndex = 0;
    this.midseasonEventResults = [];
    this.currentTransferOffers = [];
    this.pendingMatchesPenalty = 0;
    this.activeMinigame = null;
    this.cupResults = [];

    // Por defecto, en el primer año todos juegan Copa Argentina
    this.player.qualifiedCups = ["copa_argentina"];

    if (mode === "random") {
      const isPrimeraC = Math.random() < 0.6;
      this.currentLeague = isPrimeraC
        ? this.leagueManager.getLeagueByCountryAndTier("ar", 4)
        : this.leagueManager.getLeagueByCountryAndTier("ar", 3);
      this.currentTeam = this.currentLeague.getRandomTeam();
    } else {
      const foundTeam = this.findTeamById(customTeamId);
      if (foundTeam) {
        this.currentTeam = foundTeam.team;
        this.currentLeague = foundTeam.league;
      } else {
        this.currentLeague = this.leagueManager.getLeagueByCountryAndTier("ar", 4);
        this.currentTeam = this.currentLeague.getRandomTeam();
      }
    }

    return {
      player: this.player,
      team: this.currentTeam,
      league: this.currentLeague
    };
  }

  findTeamById(teamId) {
    if (!this.leagueManager) return null;
    return this.leagueManager.findTeamById(teamId);
  }

  getTrainingOptions() {
    return this.eventManager.getTrainingCardsForPlayer(this.player, 3);
  }

  applyTrainingCard(card) {
    this.selectedTrainingCard = card;
    this.player.applyTraining(card);

    this.seasonPhase = "MIDSEASON_EVENT";
    // Cargar array de 2-3 eventos únicos para la temporada
    this.midseasonEvents = this.eventManager.getSeasonEventsForPlayer(this.player, this.currentTeam);
    this.midseasonEventIndex = 0;
    this.midseasonEventResults = [];
    this.activeMidseasonEvent = this.midseasonEvents[0] ?? null;
  }

  resolveMidseasonEvent(optionIndex) {
    const event = this.activeMidseasonEvent;
    let resolvedOption = null;

    if (optionIndex >= 0 && event && event.options[optionIndex]) {
      const opt = event.options[optionIndex];
      resolvedOption = opt;

      if (opt.action === "TAKE_PENALTY") {
        const playerStat = this.player.position.getPrimaryStatValue(this.player.attributes);
        this.activeMinigame = MinigameEngine.generatePenaltyShootout(playerStat);
        this.activeMinigame.isNarrative = true;
        this.seasonPhase = "NARRATIVE_MINIGAME";
        return; // Detenemos el flujo normal del evento.
      }

      if (opt.idolBonus) {
        let idelta = opt.idolBonus;
        if (idelta < 0 && this.player.hasItem("psicologo")) {
          idelta = Math.round(idelta / 2); // Psicólogo amortigua pérdida de ídolo
        }
        this.player.addIdolScore(this.currentTeam.id, idelta, this.currentTeam.power);
      }
      if (opt.famaBonus) {
        let delta = opt.famaBonus;
        if (delta > 0 && this.player.hasItem("agente_prensa")) {
          delta = Math.round(delta * 1.5); // Agente de prensa infla la fama
        }
        if (delta < 0 && this.player.getIdolScore(this.currentTeam.id) >= 50) {
          delta = Math.round(delta / 2); // Amortiguador por ser ídolo
        }
        if (delta < 0 && this.player.hasItem("psicologo")) {
          delta = Math.round(delta / 2); // Psicólogo amortigua pérdida de fama
        }
        this.player.reputation = Math.max(0, Math.min(100, this.player.reputation + delta));
      }
      if (opt.moneyBonus) this.player.bankBalance += opt.moneyBonus;
      if (opt.statPenalty) this.player.attributes.applyDelta(opt.statPenalty);
      if (opt.matchesPenalty) this.pendingMatchesPenalty += opt.matchesPenalty;
    }

    // Guardar resultado de este evento
    if (event) {
      this.midseasonEventResults.push({
        event,
        optionIndex,
        option: resolvedOption
      });
    }

    // Avanzar al siguiente evento
    this.midseasonEventIndex += 1;
    if (this.midseasonEventIndex < this.midseasonEvents.length) {
      this.activeMidseasonEvent = this.midseasonEvents[this.midseasonEventIndex];
      // Mantener la fase MIDSEASON_EVENT para que la UI muestre el siguiente
    } else {
      this.activeMidseasonEvent = null;
      this._transitionToNextCupOrEnd();
    }
  }

  _transitionToNextCupOrEnd() {
    // Buscar la próxima copa a jugar
    if (this.player.qualifiedCups && this.player.qualifiedCups.length > 0) {
      const nextCup = this.player.qualifiedCups.shift(); // Saca la primera de la lista
      if (nextCup === "copa_argentina") {
        this.seasonPhase = "CUP_NATIONAL";
      } else {
        this.seasonPhase = "CUP_INTERNATIONAL";
      }
      const playerStat = this.player.position.getPrimaryStatValue(this.player.attributes);
      this.activeMinigame = MinigameEngine.generateCupMatrix(nextCup, this.player.calculateOVR(), playerStat, this.currentTeam.power);
    } else {
      // Si no quedan copas, terminamos la temporada
      this.seasonPhase = "SEASON_END";
    }
  }

  /**
   * Simula dinámicamente un ganador de copa, excluyendo a ciertos equipos (como el tuyo si perdiste,
   * y los que eliminaste durante el torneo).
   * Utiliza "Weighted Random" basado en el Power del equipo para mayor realismo.
   */
  simulateCupWinner(cupType, excludeTeams = []) {
    let candidateTeams = [];
    
    if (cupType === "copa_argentina") {
      const primera = this.leagueManager.getLeagueByCountryAndTier("ar", 1)?.teams || [];
      const nacional = this.leagueManager.getLeagueByCountryAndTier("ar", 2)?.teams || [];
      candidateTeams = [...primera, ...nacional];
    } else if (cupType === "libertadores") {
      const argTop = this.leagueManager.getLeagueByCountryAndTier("ar", 1)?.teams.slice(0, 6) || [];
      const braTop = this.leagueManager.getLeagueByCountryAndTier("br", 1)?.teams.slice(0, 6) || [];
      candidateTeams = [...argTop, ...braTop];
    } else if (cupType === "sudamericana") {
      const argMid = this.leagueManager.getLeagueByCountryAndTier("ar", 1)?.teams.slice(6, 12) || [];
      const braMid = this.leagueManager.getLeagueByCountryAndTier("br", 1)?.teams.slice(6, 12) || [];
      candidateTeams = [...argMid, ...braMid];
    } else {
      candidateTeams = this.leagueManager.getLeagueByCountryAndTier("ar", 1)?.teams.slice(0, 5) || [];
    }

    const availableTeams = candidateTeams.filter(t => !excludeTeams.includes(t.id));
    if (availableTeams.length === 0) return candidateTeams[0] || null;

    // Sorteo ponderado (Weighted Random)
    const totalPower = availableTeams.reduce((sum, t) => sum + (t.power || 50), 0);
    let randomVal = Math.random() * totalPower;
    
    for (const team of availableTeams) {
      randomVal -= (team.power || 50);
      if (randomVal <= 0) {
        return team;
      }
    }
    return availableTeams[0] || null;
  }

  /**
   * Resuelve el resultado de un click en la matriz de la copa.
   */
  resolveCupMatrixClick(index) {
    if (!this.activeMinigame || this.activeMinigame.type !== "matrix" || this.activeMinigame.status !== "PLAYING") return;

    const result = this.activeMinigame.grid[index];

    // Simular un rival aleatorio de la liga actual para darle color y lógica real
    const randomOpponentTeam = this.currentLeague ? this.currentLeague.getRandomTeam() : null;
    const randomOpponent = randomOpponentTeam ? randomOpponentTeam.name : "Rival";
    const roundName = `Ronda ${this.activeMinigame.currentWins + 1}`;

    // Generar resultado aleatorio
    const randomGoalsPlayer = Math.floor(Math.random() * 3) + 1; // 1 a 3
    const randomGoalsOpponent = Math.floor(Math.random() * 3) + 1;

    if (result === "WIN") {
      this.activeMinigame.currentWins += 1;
      this.activeMinigame.grid[index] = "REVEALED_WIN";
      const gO = Math.floor(Math.random() * randomGoalsPlayer); // Asegurar que sea menor
      this.activeMinigame.matchLogs.push(`✅ Victoria ${randomGoalsPlayer}-${gO} vs ${randomOpponent} en ${roundName}`);

      if (randomOpponentTeam) {
        this.activeMinigame.eliminatedOpponents = this.activeMinigame.eliminatedOpponents || [];
        this.activeMinigame.eliminatedOpponents.push(randomOpponentTeam.id);
      }

      if (this.activeMinigame.currentWins >= this.activeMinigame.requiredWins) {
        this.activeMinigame.status = "WON";
        this.cupResults.push({ cup: this.activeMinigame.cupType, won: true });
        this.cupWinners[this.activeMinigame.cupType] = this.currentTeam;
        this.currentTeam.addTitleBoost();
        this.player.addIdolScore(this.currentTeam.id, 50, this.currentTeam.power);
        this.player.reputation = Math.min(100, this.player.reputation + 10);
      }
    } else if (result === "LOSS" || result === "HINT_LOSS") {
      this.activeMinigame.grid[index] = "REVEALED_LOSS";
      this.activeMinigame.status = "ELIMINATED";
      const gP = Math.floor(Math.random() * randomGoalsOpponent);
      this.activeMinigame.matchLogs.push(`❌ Derrota ${gP}-${randomGoalsOpponent} vs ${randomOpponent} en ${roundName}. Eliminado.`);
      this.cupResults.push({ cup: this.activeMinigame.cupType, won: false });
      
      // Simular al ganador real ignorando a tu equipo y a los que eliminaste
      this.cupWinners[this.activeMinigame.cupType] = this.simulateCupWinner(
        this.activeMinigame.cupType,
        [this.currentTeam.id, ...(this.activeMinigame.eliminatedOpponents || [])]
      );
    } else if (result === "DRAW") {
      this.activeMinigame.grid[index] = "REVEALED_DRAW";
      this.activeMinigame.status = "PENALTIES";
      // Empate con mismos goles
      const goals = Math.floor(Math.random() * 3);
      this.activeMinigame.matchLogs.push(`⚖️ Empate ${goals}-${goals} vs ${randomOpponent} en ${roundName}. ¡Hay Penales!`);
      this.activeMinigame.currentOpponentTeamId = randomOpponentTeam ? randomOpponentTeam.id : null;
      this.activeMinigame.currentOpponent = randomOpponent; // Guardar rival para el log post-penales
      this.activeMinigame.matchScore = `${goals}-${goals}`;
      const playerStat = this.player.position.getPrimaryStatValue(this.player.attributes);
      this.activeMinigame.penaltyShootout = MinigameEngine.generatePenaltyShootout(playerStat);
    }
  }

  /**
   * Resuelve un tiro en la tanda de penales.
   */
  resolvePenaltyKick(direction) {
    if (!this.activeMinigame || this.activeMinigame.status !== "PENALTIES") return;
    const shootout = this.activeMinigame.penaltyShootout;
    if (shootout.status !== "PLAYING") return;

    const currentKick = shootout.kicks[shootout.currentKick];
    currentKick.playerDirection = direction;

    // Evaluamos: Solo se anota (o ataja) si elegís la correcta exactamente.
    if (direction === currentKick.correctDirection) {
      shootout.playerScore += 1;
      currentKick.scored = true;
    } else {
      currentKick.scored = false;
    }

    shootout.currentKick += 1;

    // Condición de fin de penales a Muerte Súbita (3/3)
    if (!currentKick.scored) {
      shootout.status = "ELIMINATED";
      this.resolvePenaltyEnd();
    } else if (shootout.currentKick >= 3) {
      shootout.status = "WON";
      this.resolvePenaltyEnd();
    }
  }

  /**
   * Llamado internamente cuando terminan los penales de la copa.
   */
  resolvePenaltyEnd() {
    if (!this.activeMinigame || this.activeMinigame.status !== "PENALTIES") return;
    const shootout = this.activeMinigame.penaltyShootout;
    const roundName = `Ronda ${this.activeMinigame.currentWins + 1}`;
    const opp = this.activeMinigame.currentOpponent || "Rival";
    const score = this.activeMinigame.matchScore || "1-1";

    if (shootout.status === "WON") {
      this.activeMinigame.status = "PLAYING";
      this.activeMinigame.currentWins += 1;

      const penWin = Math.floor(Math.random() * 2) + 4; // 4 o 5
      const penLoss = penWin - Math.floor(Math.random() * 2) - 1; // win-1 o win-2
      this.activeMinigame.matchLogs.push(`🏆 ¡Victoria ${score} (${penWin}-${penLoss}) vs ${opp}!`);

      if (this.activeMinigame.currentOpponentTeamId) {
        this.activeMinigame.eliminatedOpponents = this.activeMinigame.eliminatedOpponents || [];
        this.activeMinigame.eliminatedOpponents.push(this.activeMinigame.currentOpponentTeamId);
      }

      if (this.activeMinigame.currentWins >= this.activeMinigame.requiredWins) {
        this.activeMinigame.status = "WON";
        this.cupResults.push({ cup: this.activeMinigame.cupType, won: true });
        this.cupWinners[this.activeMinigame.cupType] = this.currentTeam;
        this.currentTeam.addTitleBoost();
        this.player.addIdolScore(this.currentTeam.id, 50, this.currentTeam.power);
        this.player.reputation = Math.min(100, this.player.reputation + 10);
      }
    } else if (shootout.status === "ELIMINATED") {
      this.activeMinigame.status = "ELIMINATED";
      const penWin = Math.floor(Math.random() * 2) + 4; // 4 o 5
      const penLoss = penWin - Math.floor(Math.random() * 2) - 1;
      this.activeMinigame.matchLogs.push(`💀 Derrota ${score} (${penLoss}-${penWin}) vs ${opp}. Eliminado.`);
      this.cupResults.push({ cup: this.activeMinigame.cupType, won: false });
      
      this.cupWinners[this.activeMinigame.cupType] = this.simulateCupWinner(
        this.activeMinigame.cupType,
        [this.currentTeam.id, ...(this.activeMinigame.eliminatedOpponents || [])]
      );
    }
  }

  /**
   * Resuelve un tiro en la tanda de penales narrativa.
   * Exigencia máxima: Debe meter los 3 para ganar. Falla 1 = Fracaso.
   */
  resolveNarrativePenaltyKick(direction) {
    if (!this.activeMinigame || !this.activeMinigame.isNarrative || this.activeMinigame.status !== "PLAYING") return;

    const currentKick = this.activeMinigame.kicks[this.activeMinigame.currentKick];
    currentKick.playerDirection = direction;

    // Exigencia máxima: coincidir exactamente con la correcta
    if (direction === currentKick.correctDirection) {
      this.activeMinigame.playerScore += 1;
      currentKick.scored = true;
    } else {
      currentKick.scored = false;
    }

    this.activeMinigame.currentKick += 1;

    // Si falló 1, termina en FRACASO total
    if (!currentKick.scored) {
      this.activeMinigame.status = "ELIMINATED";
      // Castigo
      this.player.reputation = Math.max(0, this.player.reputation - 15);
      this.player.addIdolScore(this.currentTeam.id, -10, this.currentTeam.power); // IdolScore method now limits to 0 anyway
      // Baja anímica (Rating)
      this.player.attributes.applyDelta({ definicion: -2, mentalidad: -3 });
    }
    // Si metió los 3, gana la gloria
    else if (this.activeMinigame.currentKick >= 3) {
      this.activeMinigame.status = "WON";
      // Recompensa GIGANTE
      this.player.reputation = Math.min(100, this.player.reputation + 25);
      this.player.addIdolScore(this.currentTeam.id, 50, this.currentTeam.power); // Usará el scaling dinámico
      this.player.attributes.applyDelta({ definicion: 2, mentalidad: 3 });
    }
  }

  /** Llama el usuario para terminar el evento narrativo de minijuego */
  continueFromNarrativeMinigame() {
    this.activeMinigame = null;

    // Guardar resultado de este evento (concluído)
    if (this.activeMidseasonEvent) {
      this.midseasonEventResults.push({
        event: this.activeMidseasonEvent,
        optionIndex: 0,
        option: this.activeMidseasonEvent.options[0]
      });
    }

    // Avanzar al siguiente evento
    this.midseasonEventIndex += 1;
    if (this.midseasonEventIndex < this.midseasonEvents.length) {
      this.activeMidseasonEvent = this.midseasonEvents[this.midseasonEventIndex];
      this.seasonPhase = "MIDSEASON_EVENT";
    } else {
      this.activeMidseasonEvent = null;
      this._transitionToNextCupOrEnd();
    }
  }

  /** Llama el usuario para pasar a la próxima etapa si la copa terminó */
  continueFromCup() {
    this._transitionToNextCupOrEnd();
  }

  /** Indica si aún hay eventos pendientes de resolver en la mitad de temporada */
  get hasPendingMidseasonEvents() {
    return this.midseasonEventIndex < this.midseasonEvents.length;
  }

  finishCurrentSeason() {
    // Sistema de Lesiones basado en Resistencia Física (res)
    let injuryChance = Math.max(0, 85 - this.player.attributes.res); // Si tenés 85 de res, tenés 0 chance. Si tenés 50, tenés 35%
    if (this.player.hasItem("kinesiologo")) {
      injuryChance = 0; // Kinesiólogo anula lesiones musculares por fatiga
    }

    let injuryMissedMatches = 0;
    if (Math.random() * 100 < injuryChance) {
      // Perdés entre 3 y 12 partidos (más bajo res, más perdés)
      injuryMissedMatches = Math.floor(Math.random() * (12 - this.player.attributes.res / 15)) + 3;
    }

    const matchesToPlay = Math.max(1, 32 - this.pendingMatchesPenalty - injuryMissedMatches);
    this.pendingMatchesPenalty = 0; // resetear para la próxima temporada

    const seasonStats = this.player.position.simulateSeason(this.player, this.currentTeam, matchesToPlay);
    seasonStats.injuryMatches = injuryMissedMatches; // Para mostrarlo en la UI

    const playerOVR = this.player.calculateOVR();
    const collectivePower = this.currentTeam.power + (playerOVR * 0.3); // El jugador influye pero el equipo pesa.

    // Intereses pasivos del Asesor Financiero
    if (this.player.hasItem("asesor_financiero")) {
      const interests = Math.floor(this.player.bankBalance * 0.10);
      this.player.bankBalance += interests;
    }

    // --- SIMULACIÓN GLOBAL DEL MUNDO ---
    const allStandings = {};
    const allLeagues = this.leagueManager.getAllLeagues();

    // Simular todas las ligas
    for (const league of allLeagues) {
      allStandings[league.id] = league.simulateStandings(this.currentTeam.id, playerOVR);
    }
    
    // Asegurar simulación de copas que el jugador no jugó (o no resolvió)
    const cups = ["libertadores", "sudamericana", "copa_argentina"];
    for (const cup of cups) {
      if (!this.cupWinners[cup]) {
        // Excluir a los ganadores de otras copas para evitar tripletes irreales
        const excludes = Object.values(this.cupWinners).filter(t => t).map(t => t.id);
        this.cupWinners[cup] = this.simulateCupWinner(cup, excludes);
      }
    }

    // Determinar si el jugador fue campeón de liga según la tabla
    const myLeagueStandings = allStandings[this.currentLeague.id];
    const wonTitle = myLeagueStandings[0].team.id === this.currentTeam.id;

    if (wonTitle) {
      this.currentTeam.addTitleBoost();
    }

    // --- LÓGICA DE ASCENSOS Y DESCENSOS DINÁMICOS ---
    let promotionMessage = null;
    let relegationMessage = null;
    let baseExposureBonus = 0;

    // Procesamos todos los cambios globalmente
    const tierChanges = this.leagueManager.processPromotionsAndRelegations(allStandings);

    // Verificamos si nuestro equipo está entre los que cambiaron de tier
    const myTeamChange = tierChanges.find(c => c.team.id === this.currentTeam.id);
    let recordPromotion = false;
    let recordRelegation = false;

    if (myTeamChange) {
      if (myTeamChange.type === "promotion") {
        recordPromotion = true;
        promotionMessage = `¡Hiciste historia! Llevaste a ${this.currentTeam.name} a la ${myTeamChange.to}.`;
        this.currentLeague = this.leagueManager.getLeagueByCountryAndTier("ar", this.currentTeam.tier);
        baseExposureBonus += 20;
        this.player.addIdolScore(this.currentTeam.id, 50, this.currentTeam.power);
      } else if (myTeamChange.type === "relegation") {
        recordRelegation = true;
        relegationMessage = `¡Fracaso rotundo! El equipo descendió a la ${myTeamChange.to}.`;
        this.currentLeague = this.leagueManager.getLeagueByCountryAndTier("ar", this.currentTeam.tier);
        this.player.clubIdolScores[this.currentTeam.id] = 0;
        this.player.reputation = Math.max(0, this.player.reputation - 15);
      }
    }

    const record = {
      year: this.currentYear,
      age: this.player.age,
      teamId: this.currentTeam.id,
      teamName: this.currentTeam.name,
      teamTier: this.currentTeam.tier,
      teamWageBudget: this.currentTeam.wageBudget,
      leagueName: this.currentLeague.name, // Ojo, ahora es la liga *nueva* si hubo descenso
      wonTitle,
      promotion: recordPromotion,
      relegation: recordRelegation,
      promotionMessage,
      relegationMessage,
      trainingCardName: this.selectedTrainingCard ? this.selectedTrainingCard.name : "Entrenamiento regular",
      eventResults: [...this.midseasonEventResults],
      cupResults: [...this.cupResults],
      allStandings, // Guardamos para la UI
      cupWinners: { ...this.cupWinners },   // Guardamos para la UI
      ...seasonStats
    };

    this.player.addSeasonRecord(record);

    // --- Calcular exposición ganada esta temporada ---
    // Base: la que da la liga por defecto
    let exposureGained = this.currentLeague.exposureGain ?? 5;
    exposureGained += baseExposureBonus;

    // Bonus por rendimiento excepcional (rating > 7.5 = la rompiste)
    if (seasonStats.rating >= 7.5) exposureGained += Math.round((seasonStats.rating - 7.5) * 8);

    // Bonus por título
    if (wonTitle) {
      exposureGained += 5;
      this.player.addIdolScore(this.currentTeam.id, 50, this.currentTeam.power);
    }

    // --- CLASIFICACIÓN A COPAS (Basada en la tabla real simulada) ---
    this.player.qualifiedCups = [];
    if (this.currentTeam.country === "ar") {
      this.player.qualifiedCups.push("copa_argentina"); // Siempre la juegan
    }

    if (this.currentTeam.tier === 1 && myLeagueStandings) {
      // Buscar la posición de tu equipo en la tabla
      const myRank = myLeagueStandings.findIndex(s => s.team.id === this.currentTeam.id) + 1;

      if (myRank <= 4) { // Top 4 a Libertadores
        this.player.qualifiedCups.push("libertadores");
      } else if (myRank <= 10) { // Del 5 al 10 a Sudamericana
        this.player.qualifiedCups.push("sudamericana");
      }
    }

    // Bonus si estás en un club "grande" del tier (wageBudget mayor al promedio del tier)
    const avgWageByTier = { 1: 200000, 2: 20000, 3: 5000, 4: 1500 };
    if (this.currentTeam.wageBudget > (avgWageByTier[this.currentTeam.tier] ?? 5000)) {
      exposureGained += 4;
    }

    this.player.exposure = Math.min(100, this.player.exposure + exposureGained);
    this.currentYear += 1;
    this.selectedTrainingCard = null;
    this.activeMidseasonEvent = null;
    this.midseasonEvents = [];
    this.midseasonEventIndex = 0;
    this.midseasonEventResults = [];
    this.cupResults = [];

    // Generar ofertas de mercado de pases usando el leagueManager
    const allLgs = this.leagueManager.getAllLeagues();
    this.currentTransferOffers = this.marketManager.generateOffersForPlayer(this.player, this.currentTeam, allLgs, 3);
    this.seasonPhase = "TRANSFER_MARKET";

    return {
      seasonRecord: record,
      transferOffers: this.currentTransferOffers,
      isRetired: this.player.isRetired
    };
  }

  acceptTransferOffer(offerIndex) {
    if (this.currentTransferOffers[offerIndex]) {
      const offer = this.currentTransferOffers[offerIndex];
      if (offer.team.id === this.currentTeam.id) {
        // Renovación
        this.player.bankBalance += offer.signingBonus;
        // Renovar aumenta tu nivel de ídolo con el club actual
        this.player.addIdolScore(this.currentTeam.id, 10, this.currentTeam.power);
      } else {
        // --- SISTEMA DE TRAICIÓN ---
        // Verificamos si el jugador es querido en alguno de los rivales del club de destino
        let isTraitor = false;
        if (offer.team.rivals && offer.team.rivals.length > 0) {
          for (const rivalId of offer.team.rivals) {
            if (this.player.getIdolScore(rivalId) >= 30) {
              isTraitor = true;
              // La hinchada rival te odia: perdés todo tu progreso de ídolo ahí
              this.player.clubIdolScores[rivalId] = 0;
            }
          }
        }

        this.currentTeam = offer.team;
        this.currentLeague = offer.league;
        this.player.bankBalance += offer.signingBonus;

        if (isTraitor) {
          // Si sos traidor, arrancás con ídolo negativo en tu nuevo club
          this.player.clubIdolScores[offer.team.id] = -20;
          // Además, la prensa hace un escándalo y tu reputación puede sufrir un poco por la polémica
          this.player.reputation = Math.max(0, this.player.reputation - 5);
        }
      }
    }
    this.currentTransferOffers = [];
    this.seasonPhase = "PRESEASON";
  }

  rejectAllTransferOffers() {
    // Bono de lealtad e ídolo por quedarse en su club actual
    this.player.addIdolScore(this.currentTeam.id, 10, this.currentTeam.power);
    this.currentTransferOffers = [];
    this.seasonPhase = "PRESEASON";
  }
}
