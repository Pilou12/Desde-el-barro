import { View } from './View.js';
import { ARGENTINE_LEAGUES } from '../../data/leagues/argLeaguesData.js';
import { STORE_ITEMS, getStoreItemById } from '../../domain/StoreCatalog.js';
import { PositionFactory } from '../../domain/positions/PositionStrategy.js';
import { SeasonNarrator } from '../../domain/SeasonNarrator.js';

export class DashboardView extends View {
  getTemplate() {
    const totals = this.state.player.getCareerTotals();

    return `
      <div class="glass-card">
        ${this.renderPlayerHeroCard()}
        ${this.renderAttributesPanel()}

        <div style="margin-top: 20px;">
          <h3 style="font-family: var(--font-heading); font-size: 1rem; color: var(--text-secondary); margin-bottom: 10px;">Estadísticas Totales de Carrera</h3>
          <div class="attributes-grid" style="grid-template-columns: repeat(4, 1fr);">
            <div style="text-align: center; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 10px;">
              <div style="font-size: 0.7rem; color: var(--text-muted);">PARTIDOS</div>
              <div style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 900;">${totals.matches}</div>
            </div>
            <div style="text-align: center; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 10px;">
              <div style="font-size: 0.7rem; color: var(--text-muted);">GOLES</div>
              <div style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 900; color: var(--accent-green);">${totals.goals}</div>
            </div>
            <div style="text-align: center; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 10px;">
              <div style="font-size: 0.7rem; color: var(--text-muted);">ASISTENCIAS</div>
              <div style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 900; color: var(--accent-blue);">${totals.assists}</div>
            </div>
            <div style="text-align: center; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 10px;">
              <div style="font-size: 0.7rem; color: var(--text-muted);">QUITES / ATAJADAS</div>
              <div style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 900; color: var(--accent-gold);">${totals.tackles + totals.saves}</div>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 12px; margin-top: 20px;">
          <button id="btn-next-training" class="btn-primary" style="flex: 1;">
            🏃‍♂️ Iniciar Pretemporada ${this.state.currentYear} (Etapa 1/3)
          </button>
          <button id="btn-open-store" class="btn-secondary" style="flex: 1; border-color: var(--accent-gold); color: var(--accent-gold);">
            🛒 Tienda de Lujos y Mejoras
          </button>
        </div>
      </div>

      ${this.renderSeasonsHistoryTable()}
    `;
  }

  renderAttributesPanel() {
    const player = this.state.player;
    const attrList = player.attributes.getFormattedList(player.position.key);

    const itemsHTML = attrList.map(item => {
      let colorClass = "low";
      if (item.val >= 80) colorClass = "high";
      else if (item.val >= 68) colorClass = "mid";

      return `
        <div class="attr-item">
          <div class="attr-header">
            <span class="attr-label">${item.label}</span>
            <span class="attr-val">${item.val}</span>
          </div>
          <div class="attr-bar-bg">
            <div class="attr-bar-fill ${colorClass}" style="width: ${item.val}%;"></div>
          </div>
        </div>
      `;
    }).join("");

    return `
      <div class="attributes-panel">
        <div class="attributes-panel-title">⚡ Atributos del Jugador</div>
        <div class="attributes-grid">
          ${itemsHTML}
        </div>
      </div>
    `;
  }

  bindEvents() {
// Dashboard -> Pretemporada
    const btnNextTraining = document.getElementById("btn-next-training");
    if (btnNextTraining) {
      btnNextTraining.onclick = () => {
        this.deps.stateManager.update({currentTrainingOptions: this.deps.gameManager.getTrainingOptions()});
        this.deps.stateManager.update({screen: "TRAINING"});
        this.deps.appRouter.render();
      };
    }
  }
}
