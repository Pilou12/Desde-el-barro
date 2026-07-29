import { View } from './View.js';
import { SeasonNarrator } from '../../domain/SeasonNarrator.js';

export class SeasonSummaryView extends View {
  getTemplate() {
    const res = this.state.lastSeasonResult;
    if (!res) return "";

    const record = res.seasonRecord;
    const player = this.state.player;
    const positionKey = player.position.key;

    // Stats dinámicas según posición
    const posStats = SeasonNarrator.getPositionStats(record, positionKey);

    // Agregar OVR y Exposición como métricas de progreso de carrera extra
    posStats.push({ icon: "📈", label: "OVR Final", value: player.calculateOVR(), color: "var(--accent-green)" });
    posStats.push({ icon: "📡", label: "Exposición", value: player.exposure ?? 0, color: "#ff9500" });
    const statsHTML = posStats.map(s => `
      <div style="flex: 1; min-width: 90px; text-align: center; padding: 12px 8px; background: rgba(255,255,255,0.03); border-radius: 10px; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 4px;">
          <span>${s.icon}</span> <span>${s.label}</span>
        </div>
        <div style="color: ${s.color}; font-size: 1.7rem; font-weight: 900; font-family: var(--font-heading); margin-top: 6px;">${s.value}</div>
      </div>
    `).join("");

    // Narrativa de temporada
    const narrativa = SeasonNarrator.generateSeasonNarrative(
      record, positionKey, player.name,
      record.teamName, record.leagueName, record.age
    );

    // --- Feedback de Ascenso / Descenso ---
    let promotionAlertHTML = "";
    if (record.promotion) {
      promotionAlertHTML = `
        <div style="background: rgba(76, 175, 80, 0.15); border: 1px solid var(--accent-green); border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
          <h3 style="color: var(--accent-green); margin: 0 0 8px 0; font-family: var(--font-heading);">🏆 ¡ASCENSO HISTÓRICO!</h3>
          <p style="margin: 0; color: #fff;">${record.promotionMessage}</p>
        </div>
      `;
    } else if (record.relegation) {
      promotionAlertHTML = `
        <div style="background: rgba(255, 77, 77, 0.15); border: 1px solid #ff4d4d; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
          <h3 style="color: #ff4d4d; margin: 0 0 8px 0; font-family: var(--font-heading);">⬇️ DESCENSO</h3>
          <p style="margin: 0; color: #fff;">${record.relegationMessage}</p>
        </div>
      `;
    }

    let injuryAlertHTML = "";
    if (record.injuryMatches && record.injuryMatches > 0) {
      injuryAlertHTML = `
        <div style="background: rgba(255, 153, 0, 0.15); border: 1px solid #ff9900; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
          <h3 style="color: #ff9900; margin: 0 0 8px 0; font-family: var(--font-heading);">🚑 LESIÓN GRAVE</h3>
          <p style="margin: 0; color: #fff;">Tu baja Resistencia Física te pasó factura. Te perdiste <strong>${record.injuryMatches}</strong> partidos de la temporada por lesión, perdiendo la chance de sumar más goles y mejor Rating.</p>
        </div>
      `;
    }

    // --- Crónica de eventos ---
    const eventResults = record.eventResults || [];
    const eventChronicleHTML = eventResults.length > 0 ? `
      <div style="margin-top: 24px; border-top: 1px solid var(--border-glass); padding-top: 20px; text-align: left;">
        <h3 style="font-family: var(--font-heading); font-size: 1.1rem; margin-bottom: 16px; color: var(--accent-gold);">📋 Crónica de la Temporada</h3>
        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${eventResults.map(({ event, option }, i) => {
      // Construir los efectos del outcome
      const effects = [];
      if (option) {
        if (option.idolBonus > 0) effects.push(`<span style="color:var(--accent-green);">+${option.idolBonus} Ídolo 💛</span>`);
        if (option.famaBonus > 0) effects.push(`<span style="color:var(--accent-blue);">+${option.famaBonus} Reputación 🌟</span>`);
        if (option.moneyBonus > 0) effects.push(`<span style="color:#4caf50;">+$${option.moneyBonus.toLocaleString()} USD 💵</span>`);
        if (option.matchesPenalty) effects.push(`<span style="color:#ff6b6b;">-${option.matchesPenalty} partidos 🩺</span>`);
        if (option.statPenalty) effects.push(`<span style="color:#ff6b6b;">Penalidad de atributo ⚠️</span>`);
      }
      const effectsStr = effects.length > 0
        ? effects.join('  ·  ')
        : '<span style="color:var(--text-muted);">Sin bonificaciones</span>';

      return `
              <div style="background: rgba(0,0,0,0.25); border-radius: 12px; padding: 14px 16px; border-left: 3px solid var(--accent-gold);">
                <div style="display:flex; align-items:baseline; gap:8px; margin-bottom:6px;">
                  <span style="font-size: 0.7rem; color: var(--text-muted); font-weight:700; text-transform:uppercase;">Evento ${i + 1}</span>
                  <span style="font-family: var(--font-heading); font-size: 1rem; color: var(--text-primary);">${event.title}</span>
                </div>
                ${option ? `
                  <p style="font-size: 0.83rem; color: var(--text-secondary); margin-bottom: 8px; font-style:italic;">
                    → Elegiste: "${option.text}"
                  </p>
                ` : `
                  <p style="font-size: 0.83rem; color: var(--text-muted); margin-bottom: 8px;">No hubo acción disponible.</p>
                `}
                <div style="font-size: 0.82rem;">${effectsStr}</div>
              </div>
            `;
    }).join('')}
        </div>
      </div>
    ` : '';

    return `
      <div class="glass-card" style="text-align: center;">
        <span style="color: var(--accent-green); font-weight: 800; font-size: 0.8rem; text-transform: uppercase;">Etapa 3 de 3 • Balance Anual</span>
        <h2 style="font-family: var(--font-heading); font-size: 2rem; margin: 8px 0;">Temporada ${record.year} completada</h2>
        <p style="color: var(--text-secondary); margin-bottom: 16px;">Jugaste con <strong>${record.teamName}</strong> — ${record.leagueName ?? "Liga Argentina"}</p>

        ${record.wonTitle ? `
          <div style="background: rgba(255, 215, 0, 0.15); border: 1px solid var(--accent-gold); padding: 14px; border-radius: 12px; margin-bottom: 16px;">
            <h3 style="color: var(--accent-gold); font-family: var(--font-heading);">🏆 ¡CAMPEONES DE LA LIGA!</h3>
            <p style="font-size: 0.85rem; color: var(--text-primary);">Diste la vuelta olímpica con tu club.</p>
          </div>
        ` : ""}

        <div class="narrative-box">
          <span class="narrative-quote">"</span>
          <p class="narrative-text">${narrativa}</p>
        </div>
        
        ${promotionAlertHTML}
        ${injuryAlertHTML}

        <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin: 24px 0; background: rgba(0,0,0,0.2); padding: 16px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.03);">
          ${statsHTML}
        </div>

        ${this.renderWorldSimulationUI(record)}

        ${eventChronicleHTML}

        <button id="btn-open-market" class="btn-primary" style="margin-top: 20px;">
          💼 Entrar al Mercado de Pases (Ver Ofertas)
        </button>
      </div>

      <div class="glass-card">
        ${this.renderAttributesPanel()}
      </div>

      ${this.renderSeasonsHistoryTable()}
    `;
  }

  bindEvents() {
    // Resumen de Temporada (Carrusel)
    const btnPrevLeague = document.getElementById("btn-prev-league");
    if (btnPrevLeague) {
      btnPrevLeague.onclick = () => {
        const res = this.state.lastSeasonResult;
        if (res && res.seasonRecord && res.seasonRecord.allStandings) {
          const keys = Object.keys(res.seasonRecord.allStandings);
          this.deps.stateManager.update({ summaryLeagueIndex: (this.state.summaryLeagueIndex - 1 + keys.length) % keys.length });
          this.deps.appRouter.render();
        }
      };
    }

    const btnNextLeague = document.getElementById("btn-next-league");
    if (btnNextLeague) {
      btnNextLeague.onclick = () => {
        const res = this.state.lastSeasonResult;
        if (res && res.seasonRecord && res.seasonRecord.allStandings) {
          const keys = Object.keys(res.seasonRecord.allStandings);
          this.deps.stateManager.update({ summaryLeagueIndex: (this.state.summaryLeagueIndex + 1) % keys.length });
          this.deps.appRouter.render();
        }
      };
    }

    const btnOpenMarket = document.getElementById("btn-open-market");
    if (btnOpenMarket) {
      btnOpenMarket.onclick = () => {
        this.deps.stateManager.update({ screen: "TRANSFER_MARKET" });
        this.deps.appRouter.render();
      };
    }
  }
}