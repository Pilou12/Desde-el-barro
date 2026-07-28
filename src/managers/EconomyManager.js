export class EconomyManager {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  acceptTransferOffer(offerIndex) {
    this.stateManager.mutate((state) => {
      if (state.currentTransferOffers[offerIndex]) {
        const offer = state.currentTransferOffers[offerIndex];
        if (offer.team.id === state.currentTeam.id) {
          // Renovación
          state.player.bankBalance += offer.signingBonus;
          state.player.addIdolScore(state.currentTeam.id, 10, state.currentTeam.power);
        } else {
          // Sistema de traición
          let isTraitor = false;
          if (offer.team.rivals && offer.team.rivals.length > 0) {
            for (const rivalId of offer.team.rivals) {
              if (state.player.getIdolScore(rivalId) >= 30) {
                isTraitor = true;
                state.player.clubIdolScores[rivalId] = 0;
              }
            }
          }

          state.currentTeam = offer.team;
          state.currentLeague = offer.league;
          state.player.bankBalance += offer.signingBonus;

          if (isTraitor) {
            state.player.clubIdolScores[offer.team.id] = -20;
            state.player.reputation = Math.max(0, state.player.reputation - 5);
          }
        }
      }
      state.currentTransferOffers = [];
      state.seasonPhase = "PRESEASON";
      state.screen = "DASHBOARD";
    });
  }

  rejectAllTransferOffers() {
    this.stateManager.mutate((state) => {
      state.player.addIdolScore(state.currentTeam.id, 10, state.currentTeam.power);
      state.currentTransferOffers = [];
      state.seasonPhase = "PRESEASON";
      state.screen = "DASHBOARD";
    });
  }

  buyStoreItem(item) {
    let success = false;
    this.stateManager.mutate((state) => {
      if (state.player.buyItem(item)) {
        success = true;
      }
    });
    return success;
  }
}
