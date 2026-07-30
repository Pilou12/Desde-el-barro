import { CONMEBOL_TEAMS, INVITED_NATIONAL_TEAMS, getNationalTeamOVR } from "../data/leagues/nationalTeamsData.js";

export class CupManager {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  resolveCupMatrixClick(index) {
    this.stateManager.mutate((state) => {
      state.cupWinners = state.cupWinners || {};
      const minigame = state.activeMinigame;
      if (!minigame || minigame.type !== "matrix" || minigame.status !== "PLAYING") return;

      const randomOpponentTeam = state.currentLeague ? state.currentLeague.getRandomTeam() : null;
      
      // Delegar la resolución interna a la clase MatrixMinigame
      minigame.resolveClick(index, randomOpponentTeam);

      // Sincronizar el estado global según el resultado
      if (minigame.status === "WON") {
        state.cupResults.push({ cup: minigame.cupType, won: true });
        state.cupWinners[minigame.cupType] = state.currentTeam;
        state.currentTeam.addTitleBoost();
        state.player.addIdolScore(state.currentTeam.id, 50, state.currentTeam.power);
        state.player.reputation = Math.min(100, state.player.reputation + 10);
      } else if (minigame.status === "ELIMINATED") {
        state.cupResults.push({ cup: minigame.cupType, won: false });
        state.cupWinners[minigame.cupType] = this._simulateCupWinner(state, minigame.cupType, [state.currentTeam.id, ...(minigame.eliminatedOpponents || [])]);
      }
    });
  }

  resolvePenaltyKick(direction) {
    this.stateManager.mutate((state) => {
      const minigame = state.activeMinigame;
      if (!minigame || minigame.status !== "PENALTIES") return;
      const shootout = minigame.penaltyShootout;
      if (!shootout || shootout.status !== "PLAYING") return;

      // Delegar la resolución del penal
      shootout.resolveKick(direction);

      if (shootout.status !== "PLAYING") {
        this._resolvePenaltyEnd(state);
      }
    });
  }

  _resolvePenaltyEnd(state) {
    const minigame = state.activeMinigame;
    if (!minigame || minigame.status !== "PENALTIES") return;
    
    // Delegar la resolución de fin de penales a la matriz
    minigame.resolvePenaltyEnd();

    // Sincronizar el estado global según el resultado
    if (minigame.status === "WON") {
      state.cupResults.push({ cup: minigame.cupType, won: true });
      state.cupWinners[minigame.cupType] = state.currentTeam;
      state.currentTeam.addTitleBoost();
      state.player.addIdolScore(state.currentTeam.id, 50, state.currentTeam.power);
      state.player.reputation = Math.min(100, state.player.reputation + 10);
    } else if (minigame.status === "ELIMINATED") {
      state.cupResults.push({ cup: minigame.cupType, won: false });
      state.cupWinners[minigame.cupType] = this._simulateCupWinner(state, minigame.cupType, [state.currentTeam.id, ...(minigame.eliminatedOpponents || [])]);
    }
  }

  isPlayerCalledUpForNationalTeam(player) {
    // Para la Copa América, el jugador debe tener un nivel suficiente
    return player.calculateOVR() >= 75;
  }

  getNationalTeamsForCopaAmerica() {
    // 10 equipos fijos de CONMEBOL
    const conmebol = [...CONMEBOL_TEAMS];
    
    // 6 invitados al azar
    const invitadosDisponibles = [...INVITED_NATIONAL_TEAMS];
    const invitados = [];
    for (let i = 0; i < 6; i++) {
      if (invitadosDisponibles.length === 0) break;
      const randIdx = Math.floor(Math.random() * invitadosDisponibles.length);
      invitados.push(invitadosDisponibles[randIdx]);
      invitadosDisponibles.splice(randIdx, 1);
    }
    
    return [...conmebol, ...invitados];
  }

  _simulateCupWinner(state, cupType, excludeTeams = []) {
    let candidateTeams = [];
    
    if (cupType === "copa_argentina") {
      const primera = state.leagueManager.getLeagueByCountryAndTier("ar", 1)?.teams || [];
      const nacional = state.leagueManager.getLeagueByCountryAndTier("ar", 2)?.teams || [];
      candidateTeams = [...primera, ...nacional];
    } else if (cupType === "libertadores") {
      const argTop = state.leagueManager.getLeagueByCountryAndTier("ar", 1)?.teams.slice(0, 6) || [];
      const braTop = state.leagueManager.getLeagueByCountryAndTier("br", 1)?.teams.slice(0, 6) || [];
      candidateTeams = [...argTop, ...braTop];
    } else if (cupType === "sudamericana") {
      const argMid = state.leagueManager.getLeagueByCountryAndTier("ar", 1)?.teams.slice(6, 12) || [];
      const braMid = state.leagueManager.getLeagueByCountryAndTier("br", 1)?.teams.slice(6, 12) || [];
      candidateTeams = [...argMid, ...braMid];
    } else if (cupType === "copa_america") {
      candidateTeams = this.getNationalTeamsForCopaAmerica();
    } else {
      candidateTeams = state.leagueManager.getLeagueByCountryAndTier("ar", 1)?.teams.slice(0, 5) || [];
    }

    const availableTeams = candidateTeams.filter(t => !excludeTeams.includes(t.id));
    if (availableTeams.length === 0) return candidateTeams[0] || null;

    // Obtener poder (power o OVR para selecciones)
    const getPower = (team) => {
      if (cupType === "copa_america") return getNationalTeamOVR(team.id);
      return team.power || 50;
    };

    const totalPower = availableTeams.reduce((sum, t) => sum + getPower(t), 0);
    let randomVal = Math.random() * totalPower;
    
    for (const team of availableTeams) {
      randomVal -= getPower(team);
      if (randomVal <= 0) {
        return team;
      }
    }
    return availableTeams[0] || null;
  }
}
