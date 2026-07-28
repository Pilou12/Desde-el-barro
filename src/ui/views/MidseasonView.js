import { View } from './View.js';
import { ARGENTINE_LEAGUES } from '../../data/leagues/argLeaguesData.js';
import { STORE_ITEMS, getStoreItemById } from '../../domain/StoreCatalog.js';
import { PositionFactory } from '../../domain/positions/PositionStrategy.js';
import { SeasonNarrator } from '../../domain/SeasonNarrator.js';

export class MidseasonView extends View {
  getTemplate() {
    const event = this.state.activeMidseasonEvent;
    const totalEvents = this.state.midseasonEvents.length;
    const currentIdx = this.state.midseasonEventIndex;
    const progressLabel = totalEvents > 1
      ? `Evento ${currentIdx + 1} de ${totalEvents}`
      : "Evento de Temporada";

    // Dots de progreso
    const dotsHTML = totalEvents > 1
      ? `<div style="display:flex; gap:6px; justify-content:center; margin-bottom:12px;">
          ${Array.from({length: totalEvents}, (_, i) => `
            <div style="width:10px; height:10px; border-radius:50%; background: ${i < currentIdx ? 'var(--accent-green)' : i === currentIdx ? 'var(--accent-gold)' : 'rgba(255,255,255,0.2)'};"></div>
          `).join('')}
        </div>`
      : '';

    const eventTitle = event ? event.title : "Mitad de Temporada: Fecha 19";
    const eventDesc = event ? event.description : "El equipo está en plena competencia. El DT exige máxima concentración para el tramo final del torneo.";

    const optionsHTML = (event && event.options) ? event.options.map((opt, idx) => `
      <button class="btn-primary btn-event-option" data-opt-index="${idx}" style="margin-bottom:10px;">
        ${opt.text}
      </button>
    `).join("") : '';

    return `
      <div class="glass-card">
        ${this.renderPlayerHeroCard()}
        ${this.renderAttributesPanel()}

        <div style="margin-top: 20px; border-top: 1px solid var(--border-glass); padding-top: 16px;">
          <span style="color: var(--accent-gold); font-weight: 800; font-size: 0.8rem; text-transform: uppercase;">Etapa 2 de 3 • Mitad de Temporada &nbsp;·&nbsp; ${progressLabel}</span>
          ${dotsHTML}
          <h2 style="font-family: var(--font-heading); margin: 6px 0;">${eventTitle}</h2>
          <p style="color: var(--text-secondary); margin-bottom: 20px; line-height: 1.5;">${eventDesc}</p>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${optionsHTML}
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
// Saltear pretemporada (sin cartas disponibles)
    const btnSkipTraining = document.getElementById("btn-skip-training");
    if (btnSkipTraining) {
      btnSkipTraining.onclick = () => {
        // Sin carta seleccionada, cargar eventos de mitad de temporada igualmente
        this.deps.stateManager.getState().seasonPhase = "MIDSEASON_EVENT";
        this.deps.gameManager.midseasonEvents = this.deps.gameManager.eventManager.getSeasonEventsForPlayer(this.deps.stateManager.getState().player, this.deps.stateManager.getState().currentTeam);
        this.deps.gameManager.midseasonEventIndex = 0;
        this.deps.gameManager.midseasonEventResults = [];
        this.deps.gameManager.activeMidseasonEvent = this.deps.gameManager.midseasonEvents[0] ?? null;
        this.deps.stateManager.update({screen: "MIDSEASON"});
        this.deps.appRouter.render();
      };
    }

    // Evento de Mitad de Temporada -> puede haber varios consecutivos
    const eventBtns = document.querySelectorAll(".btn-event-option");
    eventBtns.forEach(btn => {
      btn.onclick = (e) => {
        const idx = Number(e.currentTarget.getAttribute("data-opt-index"));
        this.deps.gameManager.resolveMidseasonEvent(idx);

        if (this.deps.stateManager.getState().seasonPhase === "NARRATIVE_MINIGAME") {
          this.deps.stateManager.update({screen: "NARRATIVE_MINIGAME"});
        } else if ((this.deps.stateManager.getState().activeMidseasonEvent !== null)) {
          this.deps.stateManager.update({screen: "MIDSEASON"});
        } else if (this.deps.stateManager.getState().seasonPhase === "CUP_NATIONAL" || this.deps.stateManager.getState().seasonPhase === "CUP_INTERNATIONAL") {
          this.deps.stateManager.update({screen: "CUP_MATCH"});
        } else {
          this.deps.seasonSimulator.finishCurrentSeason();
        }
        this.deps.appRouter.render();
      };
    });

    const btnContinueSeason = document.getElementById("btn-continue-season");
    if (btnContinueSeason) {
      btnContinueSeason.onclick = () => {
        this.deps.gameManager.resolveMidseasonEvent(-1);
        
        if (this.deps.stateManager.getState().seasonPhase === "NARRATIVE_MINIGAME") {
          this.deps.stateManager.update({screen: "NARRATIVE_MINIGAME"});
        } else if ((this.deps.stateManager.getState().activeMidseasonEvent !== null)) {
          this.deps.stateManager.update({screen: "MIDSEASON"});
        } else if (this.deps.stateManager.getState().seasonPhase === "CUP_NATIONAL" || this.deps.stateManager.getState().seasonPhase === "CUP_INTERNATIONAL") {
          this.deps.stateManager.update({screen: "CUP_MATCH"});
        } else {
          this.deps.seasonSimulator.finishCurrentSeason();
        }
        this.deps.appRouter.render();
      };
    }

    // Minijuegos Narrativos (Penales)
    const narrativePenaltyBtns = document.querySelectorAll(".btn-narrative-penalty");
    narrativePenaltyBtns.forEach(btn => {
      btn.onclick = (e) => {
        const dir = e.currentTarget.getAttribute("data-dir");
        this.deps.gameManager.resolveNarrativePenaltyKick(dir);
        this.deps.appRouter.render();
      };
    });

    const btnContinueNarrative = document.getElementById("btn-continue-narrative");
    if (btnContinueNarrative) {
      btnContinueNarrative.onclick = () => {
        this.deps.gameManager.continueFromNarrativeMinigame();
        if ((this.deps.stateManager.getState().activeMidseasonEvent !== null)) {
          this.deps.stateManager.update({screen: "MIDSEASON"});
        } else if (this.deps.stateManager.getState().seasonPhase === "CUP_NATIONAL" || this.deps.stateManager.getState().seasonPhase === "CUP_INTERNATIONAL") {
          this.deps.stateManager.update({screen: "CUP_MATCH"});
        } else {
          this.deps.seasonSimulator.finishCurrentSeason();
        }
        this.deps.appRouter.render();
      };
    }

    // Minijuego de Copa: Matriz
    const matrixBtns = document.querySelectorAll(".btn-matrix-cell");
    matrixBtns.forEach(btn => {
      btn.onclick = (e) => {
        const idx = Number(e.currentTarget.getAttribute("data-cell-index"));
        this.deps.cupManager.resolveCupMatrixClick(idx);
        this.deps.appRouter.render();
      };
    });

    // Minijuego de Copa: Penales
    const penaltyBtns = document.querySelectorAll(".btn-penalty-dir");
    penaltyBtns.forEach(btn => {
      btn.onclick = (e) => {
        const dir = e.currentTarget.getAttribute("data-dir");
        this.deps.cupManager.resolvePenaltyKick(dir);
        this.deps.appRouter.render();
      };
    });

    // El flujo de penales ahora es automático, no se necesita btn-end-penalty

    const btnContinueCup = document.getElementById("btn-continue-cup");
    if (btnContinueCup) {
      btnContinueCup.onclick = () => {
        this.deps.gameManager.continueFromCup();
        if (this.deps.stateManager.getState().seasonPhase === "CUP_NATIONAL" || this.deps.stateManager.getState().seasonPhase === "CUP_INTERNATIONAL") {
          this.deps.stateManager.update({screen: "CUP_MATCH"});
        } else {
          this.deps.seasonSimulator.finishCurrentSeason();
        }
        this.deps.appRouter.render();
      };
    }
  }
}
