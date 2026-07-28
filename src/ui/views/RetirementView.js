import { View } from './View.js';
import { ARGENTINE_LEAGUES } from '../../data/leagues/argLeaguesData.js';
import { STORE_ITEMS, getStoreItemById } from '../../domain/StoreCatalog.js';
import { PositionFactory } from '../../domain/positions/PositionStrategy.js';
import { SeasonNarrator } from '../../domain/SeasonNarrator.js';

export class RetirementView extends View {
  getTemplate() {
    const player = this.state.player;
    const totals = player.getCareerTotals();
    const seasons = player.seasonsHistory.length;
    const titles = player.seasonsHistory.filter(s => s.wonTitle).length;
    const currentTeam = this.state.currentTeam;

    const maxIdolScore = Math.max(0, ...Object.values(player.clubIdolScores));
    
    const careerNarrative = SeasonNarrator.generateCareerNarrative(
      totals, player.position.key, player.name, player.age, seasons, titles, maxIdolScore, currentTeam.name
    );

    return `
      <div class="glass-card" style="text-align: center;">
        <span class="badge-rarity dorada" style="font-size: 0.9rem;">Fin de Carrera</span>
        <h1 style="font-family: var(--font-heading); font-size: 2.2rem; margin: 12px 0;">¡GRACIAS POR TODO, LEYENDA!</h1>
        <p style="color: var(--text-secondary); margin-bottom: 16px;">Colgaste los botines a los <strong>${player.age} años</strong> tras ${seasons} temporada${seasons !== 1 ? 's' : ''} de carrera profesional.</p>

        <div class="narrative-box" style="margin-bottom: 20px;">
          <span class="narrative-quote">"</span>
          <p class="narrative-text">${careerNarrative}</p>
        </div>

        <div class="player-stats-bar">
          <div class="stat-item">
            <div class="stat-label">⚽ Partidos</div>
            <div class="stat-value">${totals.matches}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">🎯 Goles</div>
            <div class="stat-value" style="color: var(--accent-green);">${totals.goals}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">✨ Asistencias</div>
            <div class="stat-value" style="color: var(--accent-blue);">${totals.assists}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">🏆 Títulos</div>
            <div class="stat-value" style="color: var(--accent-gold);">${titles}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">⭐ Ídolo Histórico</div>
            <div class="stat-value" style="color: var(--accent-gold);">${Math.max(0, ...Object.values(player.clubIdolScores))}%</div>
          </div>
        </div>

        <button id="btn-restart" class="btn-primary" style="margin-top: 24px;">🎮 Jugar Otra Carrera</button>
      </div>

      ${this.renderSeasonsHistoryTable()}
    `;
  }

  renderSeasonsHistoryTable() {
    const history = this.state.player.seasonsHistory;
    if (!history.length) return "";

    const rowsHTML = history.map(s => `
      <tr style="border-bottom: 1px solid var(--border-glass);">
        <td style="padding: 12px 16px;">${s.year} (${s.age}a)</td>
        <td style="padding: 12px 16px;">${s.teamName}</td>
        <td style="padding: 12px 16px;">${s.matches}</td>
        <td style="padding: 12px 16px;">G:${s.goals ?? 0} A:${s.assists ?? 0}</td>
        <td style="padding: 12px 16px;">${s.wonTitle ? "🏆 Campeón" : "-"}</td>
      </tr>
    `).join("");

    return `
      <div style="margin-top: 40px; width: 100%; max-width: 800px; margin-left: auto; margin-right: auto; padding-bottom: 60px;">
        <h3 style="font-family: var(--font-heading); color: var(--text-secondary); margin-bottom: 12px;">Historial de Temporadas</h3>
        <div style="background: rgba(0,0,0,0.3); border-radius: 12px; overflow: hidden; border: 1px solid var(--border-glass);">
          <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
              <tr style="background: rgba(255,255,255,0.05); border-bottom: 1px solid var(--border-glass);">
                <th style="padding: 12px 16px; color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">Año</th>
                <th style="padding: 12px 16px; color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">Club</th>
                <th style="padding: 12px 16px; color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">PJ</th>
                <th style="padding: 12px 16px; color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">Stats</th>
                <th style="padding: 12px 16px; color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">Nota</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHTML}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  bindEvents() {
// Reiniciar
    const btnRestart = document.getElementById("btn-restart");
    if (btnRestart) {
      btnRestart.onclick = () => {
        this.deps.stateManager.update({screen: "START_MENU"});
        this.deps.appRouter.render();
      };
    }
  }
}
