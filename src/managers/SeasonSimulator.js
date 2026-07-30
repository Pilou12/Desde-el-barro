import { calculateQualifiedCups } from "../data/cups/cupsCatalog.js";

export class SeasonSimulator {
  constructor(stateManager, cupManager, marketManager) {
    this.stateManager = stateManager;
    this.cupManager = cupManager; // Necesario para simular ganadores de copa pendientes
    this.marketManager = marketManager;
  }

  finishCurrentSeason() {
    this.stateManager.mutate((state) => {
      // Sistema de Lesiones
      let injuryChance = Math.max(0, 85 - state.player.attributes.res);
      if (state.player.hasItem("kinesiologo")) {
        injuryChance = 0;
      }

      let injuryMissedMatches = 0;
      if (Math.random() * 100 < injuryChance) {
        injuryMissedMatches = Math.floor(Math.random() * (12 - state.player.attributes.res / 15)) + 3;
      }

      const matchesToPlay = Math.max(1, 32 - state.pendingMatchesPenalty - injuryMissedMatches);
      state.pendingMatchesPenalty = 0;

      const seasonStats = state.player.position.simulateSeason(state.player, state.currentTeam, matchesToPlay);
      seasonStats.injuryMatches = injuryMissedMatches;

      const playerOVR = state.player.calculateOVR();

      if (state.player.hasItem("asesor_financiero")) {
        const interests = Math.floor(state.player.bankBalance * 0.10);
        state.player.bankBalance += interests;
      }

      // Simulación Global
      const allStandings = {};
      const allLeagues = state.leagueManager.getAllLeagues();

      for (const league of allLeagues) {
        allStandings[league.id] = league.simulateStandings(state.currentTeam.id, playerOVR);
      }

      state.cupWinners = state.cupWinners || {};
      const cupsToSimulate = ["libertadores", "sudamericana", "copa_argentina"];
      if (state.currentYear % 4 === 0) {
        cupsToSimulate.push("copa_america");
      }
      for (const cup of cupsToSimulate) {
        if (!state.cupWinners[cup]) {
          const excludes = Object.values(state.cupWinners).filter(t => t).map(t => t.id);
          // REGLA DE ORO: El equipo del jugador nunca puede ganar por simulación, solo jugando.
          excludes.push(state.currentTeam.id);
          state.cupWinners[cup] = this.cupManager._simulateCupWinner(state, cup, excludes);
        }
      }

      const myLeagueStandings = allStandings[state.currentLeague.id];
      const wonTitle = myLeagueStandings[0].team.id === state.currentTeam.id;

      if (wonTitle) {
        state.currentTeam.addTitleBoost();
      }

      let promotionMessage = null;
      let relegationMessage = null;
      let baseExposureBonus = 0;

      const tierChanges = state.leagueManager.processPromotionsAndRelegations(allStandings);
      const myTeamChange = tierChanges.find(c => c.team.id === state.currentTeam.id);
      let recordPromotion = false;
      let recordRelegation = false;

      if (myTeamChange) {
        if (myTeamChange.type === "promotion") {
          recordPromotion = true;
          promotionMessage = `¡Hiciste historia! Llevaste a ${state.currentTeam.name} a la ${myTeamChange.to}.`;
          state.currentLeague = state.leagueManager.getLeagueByCountryAndTier("ar", state.currentTeam.tier);
          baseExposureBonus += 20;
          state.player.addIdolScore(state.currentTeam.id, 50, state.currentTeam.power);
        } else if (myTeamChange.type === "relegation") {
          recordRelegation = true;
          relegationMessage = `¡Fracaso rotundo! El equipo descendió a la ${myTeamChange.to}.`;
          state.currentLeague = state.leagueManager.getLeagueByCountryAndTier("ar", state.currentTeam.tier);
          state.player.clubIdolScores[state.currentTeam.id] = 0;
          state.player.reputation = Math.max(0, state.player.reputation - 15);
        }
      }

      const record = {
        year: state.currentYear,
        age: state.player.age,
        teamId: state.currentTeam.id,
        teamName: state.currentTeam.name,
        teamTier: state.currentTeam.tier,
        teamWageBudget: state.currentTeam.wageBudget,
        leagueName: state.currentLeague.name,
        wonTitle,
        promotion: recordPromotion,
        relegation: recordRelegation,
        promotionMessage,
        relegationMessage,
        wasCalledUp: state.player.wasCalledUp,
        trainingCardName: state.selectedTrainingCard ? state.selectedTrainingCard.name : "Entrenamiento regular",
        eventResults: [...state.midseasonEventResults],
        cupResults: [...state.cupResults],
        allStandings,
        cupWinners: { ...state.cupWinners },
        ...seasonStats
      };

      state.player.addSeasonRecord(record);
      state.lastSeasonResult = {
        seasonRecord: record,
        isRetired: state.player.isRetired
      };

      let exposureGained = state.currentLeague.exposureGain ?? 5;
      exposureGained += baseExposureBonus;

      if (seasonStats.rating >= 7.5) exposureGained += Math.round((seasonStats.rating - 7.5) * 8);

      if (wonTitle) {
        exposureGained += 5;
        state.player.addIdolScore(state.currentTeam.id, 50, state.currentTeam.power);
      }

      // Calcular clasificaciones del año siguiente usando el catálogo centralizado
      const myRankNext = myLeagueStandings
        ? myLeagueStandings.findIndex(s => s.team.id === state.currentTeam.id) + 1
        : 999;

      state.player.qualifiedCups = calculateQualifiedCups({
        currentTeam: state.currentTeam,
        leagueRank: myRankNext,
        leagueTier: state.currentTeam.tier,
        cupWinners: state.cupWinners,
        country: state.currentTeam.country ?? "ar",
      });

      const nextYear = state.currentYear + 1;
      if (nextYear % 4 === 0) {
        if (this.cupManager.isPlayerCalledUpForNationalTeam(state.player)) {
          state.player.qualifiedCups.push("copa_america");
          state.player.wasCalledUp = true;
        } else {
          state.player.wasCalledUp = false;
        }
      } else {
        delete state.player.wasCalledUp;
      }

      const avgWageByTier = { 1: 200000, 2: 20000, 3: 5000, 4: 1500 };
      if (state.currentTeam.wageBudget > (avgWageByTier[state.currentTeam.tier] ?? 5000)) {
        exposureGained += 4;
      }

      state.player.exposure = Math.min(100, state.player.exposure + exposureGained);
      state.currentYear += 1;
      state.selectedTrainingCard = null;
      state.activeMidseasonEvent = null;
      state.midseasonEvents = [];
      state.midseasonEventIndex = 0;
      state.midseasonEventResults = [];
      state.cupResults = [];

      const allLgs = state.leagueManager.getAllLeagues();
      state.currentTransferOffers = this.marketManager.generateOffersForPlayer(state.player, state.currentTeam, allLgs, 3);
      state.seasonPhase = "TRANSFER_MARKET";

      // Limpiar registros de torneos para la próxima temporada
      state.cupWinners = {};

      state.screen = state.player.isRetired ? "RETIREMENT" : "SEASON_SUMMARY";
    });
  }
}