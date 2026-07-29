import { View } from './View.js';
import { ARGENTINE_LEAGUES } from '../../data/leagues/argLeaguesData.js';
import { STORE_ITEMS, getStoreItemById } from '../../domain/StoreCatalog.js';
import { PositionFactory } from '../../domain/positions/PositionStrategy.js';
import { SeasonNarrator } from '../../domain/SeasonNarrator.js';

export class CustomSetupView extends View {
  getTemplate() {
    const tabMap = {
      primera: ARGENTINE_LEAGUES.primera,
      b_nacional: ARGENTINE_LEAGUES.b_nacional,
      b_metro: ARGENTINE_LEAGUES.b_metro,
      primera_c: ARGENTINE_LEAGUES.primera_c
    };

    const currentLeague = tabMap[this.state.selectedDivisionTab] || ARGENTINE_LEAGUES.primera;

    const clubCardsHTML = currentLeague.teams.map(team => {
      const isActive = team.id === this.state.selectedCustomTeamId ? "active" : "";
      return `
        <div class="club-card-select ${isActive}" data-team-id="${team.id}">
          <div style="height: 52px; display: flex; align-items: center; justify-content: center;">
            ${team.renderCrestHTML(48)}
          </div>
          <div class="club-card-name">${team.name}</div>
          <div class="club-card-nickname">"${team.nickname}"</div>
        </div>
      `;
    }).join("");

    return `
      <div class="glass-card">
        <h2 style="font-family: var(--font-heading); margin-bottom: 16px;">Configuración de Inicio</h2>
        
        <div class="form-group">
          <label for="input-name">Nombre del Jugador</label>
          <input id="input-name" type="text" class="form-control" value="El Pibe" placeholder="Ej: Lionel" />
        </div>

        <div class="form-group" style="margin-top: 20px;">
          <label>Elegí tu Posición en la Cancha (Hacé clic en el nodo)</label>
          ${this.renderPitchSelector()}
        </div>

        <div class="form-group" style="margin-top: 24px;">
          <label>Elegí tu Club Inicial (${currentLeague.teams.length} Clubes Disponibles)</label>
          
          <div class="division-tabs">
            <button class="tab-btn ${this.state.selectedDivisionTab === 'primera' ? 'active' : ''}" data-tab="primera">Liga Profesional (${ARGENTINE_LEAGUES.primera.teams.length})</button>
            <button class="tab-btn ${this.state.selectedDivisionTab === 'b_nacional' ? 'active' : ''}" data-tab="b_nacional">Primera Nacional (${ARGENTINE_LEAGUES.b_nacional.teams.length})</button>
            <button class="tab-btn ${this.state.selectedDivisionTab === 'b_metro' ? 'active' : ''}" data-tab="b_metro">Primera B Metro (${ARGENTINE_LEAGUES.b_metro.teams.length})</button>
            <button class="tab-btn ${this.state.selectedDivisionTab === 'primera_c' ? 'active' : ''}" data-tab="primera_c">Primera C (${ARGENTINE_LEAGUES.primera_c.teams.length})</button>
          </div>

          <div class="club-picker-grid">
            ${clubCardsHTML}
          </div>
        </div>

        <button id="btn-confirm-custom" class="btn-primary">Comenzar Carrera</button>
        <button id="btn-back-menu" class="btn-secondary">Volver al Menú</button>
      </div>
    `;
  }

  renderPlayerHeroCard() {
    const player = this.state.player;
    const team = this.state.currentTeam;
    const league = this.state.currentLeague;
    const ovr = player.calculateOVR();

    return `
      <div class="player-hero-card">
        <div class="player-identity">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 52px; height: 52px; display: flex; align-items: center; justify-content: center;">
              ${team.renderCrestHTML(48)}
            </div>
            <div class="player-ovr-badge">
              <span class="ovr-num">${ovr}</span>
              <span class="ovr-pos">${player.position.number}</span>
            </div>
          </div>
          <div>
            <span style="color: var(--accent-green); font-weight: 800; text-transform: uppercase; font-size: 0.75rem;">Año ${this.state.currentYear} • ${player.age} Años</span>
            <h2 style="font-family: var(--font-heading); font-size: 1.8rem; margin-top: 2px;">${player.name}</h2>
            <p style="color: var(--text-secondary); font-size: 0.88rem;">${player.position.label} en <strong>${team.name}</strong> (${league.name})</p>
          </div>
        </div>

        <div style="display: flex; gap: 12px; align-items: center; justify-content: flex-end;">
          <div style="text-align: right;">
            <div style="font-size: 0.7rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">
              ${player.getIdolScore(team.id) < 0 ? `Resistido en ${team.name}` : `Ídolo en ${team.name}`}
            </div>
            <div style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 900; color: ${player.getIdolScore(team.id) < 0 ? '#ff4d4d' : 'var(--accent-gold)'};">
              ${player.getIdolScore(team.id)}%
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.7rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Reputación</div>
            <div style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 900; color: var(--accent-blue);">${player.reputation}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.7rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">📡 Exposición</div>
            <div style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 900; color: #ff9500;">${player.exposure ?? 0}</div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Custom Setup - Clic en Nodos de Cancha Táctica
    const pitchNodes = document.querySelectorAll(".pitch-node");
    pitchNodes.forEach(node => {
      node.onclick = () => {
        const key = node.getAttribute("data-pos-key");
        this.deps.stateManager.update({ selectedPositionKey: key });
        this.deps.appRouter.render();
      };
    });

    // Custom Setup - Cambiar pestañas de división
    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach(btn => {
      btn.onclick = () => {
        const tab = btn.getAttribute("data-tab");
        this.deps.stateManager.update({ selectedDivisionTab: tab });

        const tabMap = {
          primera: ARGENTINE_LEAGUES.primera,
          b_nacional: ARGENTINE_LEAGUES.b_nacional,
          b_metro: ARGENTINE_LEAGUES.b_metro,
          primera_c: ARGENTINE_LEAGUES.primera_c
        };
        const league = tabMap[tab] || ARGENTINE_LEAGUES.primera;
        if (league.teams.length) {
          this.deps.stateManager.update({ selectedCustomTeamId: league.teams[0].id });
        }

        this.deps.appRouter.render();
      };
    });

    // Custom Setup - Selección visual de club
    const clubCards = document.querySelectorAll(".club-card-select");
    clubCards.forEach(card => {
      card.onclick = () => {
        const teamId = card.getAttribute("data-team-id");
        this.deps.stateManager.update({ selectedCustomTeamId: teamId });
        this.deps.appRouter.render();
      };
    });

    const btnConfirmCustom = document.getElementById("btn-confirm-custom");
    if (btnConfirmCustom) {
      btnConfirmCustom.onclick = () => {
        const name = document.getElementById("input-name").value.trim() || "El Pibe";
        const positionKey = this.state.selectedPositionKey || "delantero";
        const customTeamId = this.state.selectedCustomTeamId || "river";

        this.deps.gameManager.startNewCareer({ playerName: name, positionKey, mode: "custom_start", customTeamId });
        this.deps.stateManager.update({ screen: "DASHBOARD" });
        this.deps.appRouter.render();
      };
    }

    const btnBackMenu = document.getElementById("btn-back-menu");
    if (btnBackMenu) {
      btnBackMenu.onclick = () => {
        this.deps.stateManager.update({ screen: "START_MENU" });
        this.deps.appRouter.render();
      };
    }
  }
}