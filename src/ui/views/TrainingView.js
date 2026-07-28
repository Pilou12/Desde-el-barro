import { View } from './View.js';
import { ARGENTINE_LEAGUES } from '../../data/leagues/argLeaguesData.js';
import { STORE_ITEMS, getStoreItemById } from '../../domain/StoreCatalog.js';
import { PositionFactory } from '../../domain/positions/PositionStrategy.js';
import { SeasonNarrator } from '../../domain/SeasonNarrator.js';

export class TrainingView extends View {
  getTemplate() {
    const cards = this.state.currentTrainingOptions;

    if (!cards.length) {
      return `
        <div class="glass-card" style="text-align:center;">
          ${this.renderPlayerHeroCard()}
          <p style="color:var(--text-secondary); margin-top: 24px;">No hay cartas de entrenamiento disponibles para tu posición en este momento. El cuerpo técnico te da el día libre.</p>
          <button id="btn-skip-training" class="btn-secondary" style="margin-top:16px;">Saltear Pretemporada</button>
        </div>
      `;
    }

    const cardsHTML = cards.map((card, idx) => {
      const deltas = card.getFormattedDeltas();
      const deltasHTML = deltas.map(d => `
        <span class="delta-tag ${d.val >= 0 ? 'plus' : 'minus'}">${d.text}</span>
      `).join("");

      return `
        <div class="option-card" data-card-index="${idx}">
          <div>
            <span class="badge-rarity ${card.rarity}">${card.rarity}</span>
            <h4 style="font-family: var(--font-heading); margin: 6px 0; color: var(--text-primary);">${card.name}</h4>
            <p style="color: var(--text-secondary); font-size: 0.85rem; line-height: 1.4;">${card.copyText}</p>
            
            <div class="deltas-container">
              ${deltasHTML}
            </div>
          </div>
          <button class="btn-secondary btn-select-card" style="margin-top: 12px;" data-card-index="${idx}">Aplicar Entrenamiento</button>
        </div>
      `;
    }).join("");

    return `
      <div class="glass-card">
        ${this.renderPlayerHeroCard()}
        ${this.renderAttributesPanel()}

        <div style="margin-top: 20px;">
          <span style="color: var(--accent-green); font-weight: 800; font-size: 0.8rem; text-transform: uppercase;">Etapa 1 de 3 • Pretemporada</span>
          <h2 style="font-family: var(--font-heading); margin-top: 2px;">Plan de Entrenamiento ${this.state.currentYear}</h2>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">Elegí qué aspecto físico o táctico vas a mejorar este año antes de salir a la cancha:</p>

          <div class="options-grid">
            ${cardsHTML}
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const routeAfterTraining = () => {
        const state = this.deps.stateManager.getState();
        if (state.seasonPhase === "MIDSEASON_EVENT" && state.activeMidseasonEvent) {
            this.deps.stateManager.update({screen: "MIDSEASON"});
        } else if (state.seasonPhase === "CUP_NATIONAL" || state.seasonPhase === "CUP_INTERNATIONAL") {
            this.deps.stateManager.update({screen: "CUP_MATCH"});
        } else {
            this.deps.seasonSimulator.finishCurrentSeason();
        }
        this.deps.appRouter.render();
    };

    const cardBtns = document.querySelectorAll(".btn-select-card");
    cardBtns.forEach(btn => {
      btn.onclick = (e) => {
        const idx = Number(e.currentTarget.getAttribute("data-card-index"));
        const selectedCard = this.state.currentTrainingOptions[idx];
        if (selectedCard) {
          this.deps.gameManager.applyTrainingCard(selectedCard);
        }
        routeAfterTraining();
      };
    });

    const btnSkipTraining = document.getElementById("btn-skip-training");
    if (btnSkipTraining) {
      btnSkipTraining.onclick = () => {
        this.deps.gameManager.skipTraining();
        routeAfterTraining();
      };
    }
  }
}
