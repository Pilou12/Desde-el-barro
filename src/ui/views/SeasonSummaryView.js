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

    // --- Crónica de eventos (Integrada en la narrativa) ---
    const eventResults = record.eventResults || [];
    let eventsListHTML = "";
    if (eventResults.length > 0) {
      eventsListHTML = `
        <div style="margin-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px;">
          <h4 style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 12px; letter-spacing: 1px;">Eventos Destacados del Año:</h4>
          <ul style="list-style-type: none; padding-left: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
            ${eventResults.map(({ event, option }) => {
              const effects = [];
              if (option) {
                if (option.idolBonus > 0) effects.push(`<span style="color:var(--accent-green);">+${option.idolBonus} Ídolo</span>`);
                if (option.famaBonus > 0) effects.push(`<span style="color:var(--accent-blue);">+${option.famaBonus} Rep.</span>`);
                if (option.moneyBonus > 0) effects.push(`<span style="color:#4caf50;">+$${option.moneyBonus.toLocaleString()}</span>`);
                if (option.matchesPenalty) effects.push(`<span style="color:#ff6b6b;">-${option.matchesPenalty} PJ</span>`);
                if (option.statPenalty) effects.push(`<span style="color:#ff6b6b;">Atributos ⚠️</span>`);
              }
              const effectsStr = effects.length > 0 ? effects.join(' · ') : '<span style="color:var(--text-muted);">Sin efecto notable</span>';

              return `
                <li style="display: flex; align-items: baseline; gap: 8px; font-size: 0.95rem; text-shadow: none;">
                  <span style="color: var(--accent-gold); font-size: 1.2rem; line-height: 1;">•</span>
                  <div style="flex-grow: 1; text-align: left; line-height: 1.4;">
                    <strong style="color: #fff; font-family: var(--font-heading);">${event.title}</strong>: 
                    <span style="color: rgba(255,255,255,0.85); font-style: normal;">${option ? option.text : "Sin acción"}</span>
                  </div>
                  <div style="font-size: 0.8rem; text-align: right; white-space: nowrap;">${effectsStr}</div>
                </li>
              `;
            }).join('')}
          </ul>
        </div>
      `;
    }

    return `
      <div class="glass-card" style="text-align: center; max-width: 900px; margin: 0 auto;">
        <span style="color: var(--accent-green); font-weight: 800; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 2px;">Etapa 3 de 3 • Balance Anual</span>
        <h2 style="font-family: var(--font-heading); font-size: 2.6rem; margin: 8px 0; background: linear-gradient(to right, #ffffff, #aaaaaa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Temporada ${record.year} completada</h2>
        <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 1.1rem;">Jugaste con <strong>${record.teamName}</strong> — ${record.leagueName ?? "Liga Argentina"}</p>

        ${record.wonTitle ? `
          <div style="background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 215, 0, 0.02)); border: 1px solid var(--accent-gold); padding: 16px; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 4px 15px rgba(255, 215, 0, 0.1);">
            <h3 style="color: var(--accent-gold); font-family: var(--font-heading); margin: 0; font-size: 1.4rem;">🏆 ¡CAMPEONES DE LA LIGA!</h3>
            <p style="font-size: 0.9rem; color: var(--text-primary); margin: 4px 0 0 0;">Diste la vuelta olímpica con tu club. Historia pura.</p>
          </div>
        ` : ""}

        <!-- Narrativa Integrada con Eventos -->
        <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 28px; margin-bottom: 24px; box-shadow: inset 0 2px 20px rgba(0,0,0,0.5);">
          <div style="font-size: 1.15rem; color: #fff; line-height: 1.7; font-style: italic; text-shadow: 0 1px 3px rgba(0,0,0,0.8); text-align: justify;">
            <span style="color: var(--accent-green); font-size: 2rem; line-height: 0; vertical-align: bottom; font-family: var(--font-heading);">"</span>
            ${narrativa}
            <span style="color: var(--accent-green); font-size: 2rem; line-height: 0; vertical-align: bottom; font-family: var(--font-heading);">"</span>
          </div>
          
          ${eventsListHTML}
        </div>
        
        ${promotionAlertHTML}
        ${injuryAlertHTML}

        <!-- Stats Premium -->
        <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin: 32px 0;">
          ${statsHTML}
        </div>

        <!-- Botón de Acción Principal -->
        <button id="btn-open-market" class="btn-primary" style="margin-top: 10px; font-size: 1.2rem; padding: 18px 32px; width: 100%; max-width: 450px; box-shadow: 0 8px 25px rgba(0,255,170,0.25); border-radius: 12px;">
          💼 Entrar al Mercado de Pases (Ver Ofertas)
        </button>
      </div>

      <div class="glass-card" style="max-width: 900px; margin: 24px auto;">
        ${this.renderAttributesPanel()}
      </div>

      <div class="glass-card" style="max-width: 900px; margin: 24px auto;">
        <div style="text-align: center; margin-bottom: 16px;">
          <h3 style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.5px;">Simulación Global de la Temporada</h3>
        </div>
        ${this.renderWorldSimulationUI(record)}
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