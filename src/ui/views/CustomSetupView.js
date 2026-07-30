import { View } from './View.js';
import { ARGENTINE_LEAGUES } from '../../data/leagues/argLeaguesData.js';
import { STORE_ITEMS, getStoreItemById } from '../../domain/StoreCatalog.js';
import { PositionFactory } from '../../domain/positions/PositionStrategy.js';
import { SeasonNarrator } from '../../domain/SeasonNarrator.js';
import { NATIONALITIES } from '../../domain/Player.js';

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
      // Inline styles for premium look: gradient background, hover transition (we use CSS classes for hover in index.css typically, but we can do it inline with onmouseover or just rely on CSS we'll add if needed. I'll add inline transition)
      return `
        <div class="club-card-select ${isActive}" data-team-id="${team.id}" style="transition: transform 0.2s, box-shadow 0.2s; background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.5) 100%); border-radius: 12px; border: 1px solid ${isActive ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'};" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
          <div style="height: 52px; display: flex; align-items: center; justify-content: center;">
            ${team.renderCrestHTML(48)}
          </div>
          <div class="club-card-name" style="font-weight: 700;">${team.name}</div>
          <div class="club-card-nickname" style="color: var(--accent-gold);">"${team.nickname}"</div>
        </div>
      `;
    }).join("");

    const isRandomMode = this.state.setupMode === "random";

    return `
      <div class="glass-card">
        <h2 style="font-family: var(--font-heading); margin-bottom: 16px;">${isRandomMode ? 'Modo Carrera: Destino Aleatorio' : 'Configuración de Inicio'}</h2>
        
        <div style="background: rgba(0,0,0,0.2); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 24px;">
          <h3 style="font-family: var(--font-heading); font-size: 1rem; color: var(--text-secondary); margin-bottom: 12px;">Identidad del Jugador</h3>
          <div class="form-group" style="display: flex; gap: 15px; margin: 0;">
            <div style="flex: 2;">
              <label for="input-name" style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Nombre del Jugador</label>
              <input id="input-name" type="text" class="form-control" value="El Pibe" placeholder="Ej: Lionel" style="background-color: rgba(0,0,0,0.4); border: 1px solid var(--border-glass); border-left: 3px solid var(--accent-gold); box-shadow: inset 0 2px 4px rgba(0,0,0,0.5); font-size: 1.1rem; padding: 12px; transition: border-color 0.3s; color: #fff;" onfocus="this.style.borderColor='var(--accent-gold)'" onblur="this.style.borderColor='var(--border-glass)'"/>
            </div>
            <div style="flex: 1;">
              <label style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Nacionalidad</label>
              <div class="custom-select-container" style="position: relative; user-select: none;">
                <div id="custom-select-btn" class="form-control" style="background-color: rgba(0,0,0,0.4); border: 1px solid var(--border-glass); border-left: 3px solid var(--accent-green); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: space-between; height: 100%; padding: 12px; transition: border-color 0.3s;" onmouseover="this.style.borderColor='var(--accent-green)'" onmouseout="this.style.borderColor='var(--border-glass)'">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <img src="${(NATIONALITIES[this.state.selectedNationality || 'AR']).flagUrl}" style="width: 24px; height: 18px; border-radius: 3px; box-shadow: 0 1px 3px rgba(0,0,0,0.5);">
                    <span style="font-weight: 500;">${(NATIONALITIES[this.state.selectedNationality || 'AR']).name}</span>
                  </div>
                  <span style="font-size: 0.8rem; color: var(--text-muted);">▼</span>
                </div>
                <div id="custom-select-dropdown" style="display: none; position: absolute; top: 100%; left: 0; right: 0; background-color: #111827; border: 1px solid var(--border-glass); border-radius: 8px; margin-top: 4px; z-index: 100; max-height: 250px; overflow-y: auto; box-shadow: 0 8px 24px rgba(0,0,0,0.8);">
                  ${Object.entries(NATIONALITIES).map(([code, nat]) => `
                    <div class="custom-select-option" data-value="${code}" style="padding: 12px; display: flex; align-items: center; gap: 10px; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.05); transition: background-color 0.2s;">
                      <img src="${nat.flagUrl}" style="width: 24px; height: 18px; border-radius: 3px;">
                      <span style="font-weight: 500;">${nat.name}</span>
                    </div>
                  `).join("")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-group" style="margin-top: 20px;">
          <label>Elegí tu Posición en la Cancha (Hacé clic en el nodo)</label>
          ${this.renderPitchSelector()}
        </div>

        ${isRandomMode ? `
          <div class="form-group" style="margin-top: 24px;">
            <label>Destino de Club</label>
            <div style="background: linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(20,20,20,0.8) 100%); border: 1px dashed var(--accent-gold); border-radius: 12px; padding: 30px; text-align: center; color: var(--text-secondary);">
              <div style="font-size: 3rem; margin-bottom: 12px; animation: pulse 2s infinite;">🎲</div>
              <h3 style="font-family: var(--font-heading); font-size: 1.5rem; color: #fff; margin-bottom: 8px;">Sorteo Aleatorio</h3>
              <p style="font-size: 0.95rem;">Tu carrera comenzará en un club sorteado al azar de las divisiones de ascenso (Primera B o Primera C). ¡Demostrá tu talento desde abajo!</p>
            </div>
          </div>
        ` : `
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
        `}

        <div style="display: flex; gap: 16px; margin-top: 32px;">
          <button id="btn-confirm-custom" class="btn-primary" style="flex: 2; padding: 16px; font-size: 1.2rem; font-weight: 900; letter-spacing: 1px;">Comenzar Carrera</button>
          <button id="btn-back-menu" class="btn-secondary" style="flex: 1; padding: 16px; font-size: 1.2rem;">Volver al Menú</button>
        </div>
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

    // Custom Setup - Nationality Dropdown
    const selectBtn = document.getElementById("custom-select-btn");
    const dropdown = document.getElementById("custom-select-dropdown");
    if (selectBtn && dropdown) {
      selectBtn.onclick = (e) => {
        e.stopPropagation();
        dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
      };

      const options = dropdown.querySelectorAll(".custom-select-option");
      options.forEach(opt => {
        opt.onmouseover = () => opt.style.backgroundColor = "rgba(255,255,255,0.1)";
        opt.onmouseout = () => opt.style.backgroundColor = "transparent";

        opt.onclick = () => {
          const val = opt.getAttribute("data-value");
          this.deps.stateManager.update({ selectedNationality: val });
          dropdown.style.display = "none";
          this.deps.appRouter.render();
        };
      });

      // Cerrar al clickear afuera (solo se registra una vez por render para no acumular eventos)
      const closeDropdown = (e) => {
        if (dropdown.style.display === "block" && !e.target.closest('.custom-select-container')) {
          dropdown.style.display = "none";
        }
      };
      document.addEventListener('click', closeDropdown, { once: true });
    }

    const btnConfirmCustom = document.getElementById("btn-confirm-custom");
    if (btnConfirmCustom) {
      btnConfirmCustom.onclick = () => {
        const name = document.getElementById("input-name").value.trim() || "El Pibe";
        const nationality = this.state.selectedNationality || "AR";
        const positionKey = this.state.selectedPositionKey || "delantero";
        const customTeamId = this.state.selectedCustomTeamId || "river";
        
        const mode = this.state.setupMode === "random" ? "random" : "custom_start";

        this.deps.gameManager.startNewCareer({ playerName: name, nationality, positionKey, mode, customTeamId });
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