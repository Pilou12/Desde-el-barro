import { PositionFactory } from '../../domain/positions/PositionStrategy.js';

export class View {
  constructor(container, deps = {}) {
    this.container = container;
    this.deps = deps;
  }

  get state() {
    return this.deps.stateManager ? this.deps.stateManager.getState() : {};
  }

  getTemplate() {
    return "";
  }

  bindEvents() {}

  render() {
    this.container.innerHTML = this.getTemplate();
    this.bindEvents();
  }

  renderPitchSelector() {
    const pitchNodes = [
      { key: "delantero", num: "9", label: "DC", top: "16%", left: "50%" },
      { key: "extremo_izquierdo", num: "11", label: "EI", top: "26%", left: "20%" },
      { key: "extremo_derecho", num: "7", label: "ED", top: "26%", left: "80%" },
      { key: "enganche", num: "10", label: "ENG", top: "38%", left: "50%" },
      { key: "mediocampista_central", num: "8", label: "MC", top: "52%", left: "68%" },
      { key: "mediocampista_defensivo", num: "5", label: "MCD", top: "54%", left: "34%" },
      { key: "lateral_izquierdo", num: "3", label: "LI", top: "70%", left: "16%" },
      { key: "defensor_central_izq", num: "2", label: "DFI", top: "72%", left: "38%" },
      { key: "defensor_central_der", num: "6", label: "DFD", top: "72%", left: "62%" },
      { key: "lateral_derecho", num: "4", label: "LD", top: "70%", left: "84%" },
      { key: "arquero", num: "1", label: "ARQ", top: "88%", left: "50%" }
    ];

    const nodesHTML = pitchNodes.map(n => {
      const isActive = n.key === this.state.selectedPositionKey ? "active" : "";
      return `
        <div class="pitch-node ${isActive}" data-pos-key="${n.key}" style="top: ${n.top}; left: ${n.left};">
          <span class="pitch-node-num">${n.num}</span>
          <span class="pitch-node-label">${n.label}</span>
        </div>
      `;
    }).join("");

    const currentPosObj = PositionFactory.create(this.state.selectedPositionKey);

    return `
      <div class="pitch-container" style="height: 380px;">
        <svg class="pitch-lines-svg" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="94" height="94" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="0.8" />
          <line x1="3" y1="50" x2="97" y2="50" stroke="rgba(255,255,255,0.4)" stroke-width="0.8" />
          <circle cx="50" cy="50" r="12" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="0.8" />
          <rect x="25" y="3" width="50" height="15" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="0.8" />
          <rect x="35" y="3" width="30" height="6" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="0.8" />
          <rect x="25" y="82" width="50" height="15" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="0.8" />
          <rect x="35" y="91" width="30" height="6" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="0.8" />
        </svg>

        ${nodesHTML}
      </div>

      <div class="pitch-info-box">
        <div class="pitch-info-num">${currentPosObj.number}</div>
        <div>
          <div class="pitch-info-title">${currentPosObj.label}</div>
          <div class="pitch-info-desc">${currentPosObj.tagline}</div>
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

  renderWorldSimulationUI(record) {
    if (!record.allStandings || !record.cupWinners) return '';

    const allStandings = record.allStandings;
    const leagueKeys = Object.keys(allStandings);
    
    // Si la liga actual es nueva, podríamos forzar que el índice empiece ahí, pero 
    // asumimos que el estado actual summaryLeagueIndex es válido.
    const currentLeagueKey = leagueKeys[this.state.summaryLeagueIndex] || leagueKeys[0];
    const currentStandings = allStandings[currentLeagueKey];
    
    const leagueNames = {
      arg_primera: "Liga Profesional",
      arg_b_nacional: "Primera Nacional",
      arg_b_metro: "Primera B Metro",
      arg_primera_c: "Primera C",
      br_brasileirao: "Brasileirão",
      eu_laliga: "La Liga (ESP)",
      eu_premier: "Premier League (ENG)",
      eu_seriea: "Serie A (ITA)"
    };

    const displayLeagueName = leagueNames[currentLeagueKey] || currentLeagueKey;

    const tableRows = currentStandings.map((s, index) => {
      const isPlayer = s.isPlayerTeam;
      // Estilos de ascensos/descensos muy básicos: 
      // Si es top 2 (en ligas bajas) lo pintamos verde clarito. Si es bottom 2, rojito.
      let rowStyle = "border-bottom: 1px solid rgba(255,255,255,0.05);";
      let posStyle = "color: var(--text-muted);";
      
      const isPrimera = currentLeagueKey === "arg_primera";
      const isUltima = currentLeagueKey === "arg_primera_c";
      const isInternacional = currentLeagueKey.startsWith("br_") || currentLeagueKey.startsWith("eu_");
      
      // Reglas super generales para pintar la UI (no afecta lógica real)
      if (index < 2 && !isPrimera && !isInternacional) {
        rowStyle += " background: rgba(76, 175, 80, 0.1);"; // Ascenso
        posStyle = "color: #4caf50; font-weight: bold;";
      } else if (index >= currentStandings.length - 2 && !isUltima && !isInternacional) {
        rowStyle += " background: rgba(255, 77, 77, 0.1);"; // Descenso
        posStyle = "color: #ff4d4d; font-weight: bold;";
      }

      if (isPlayer) {
        rowStyle += " background: rgba(255, 215, 0, 0.2); border: 1px solid var(--accent-gold); border-left: 4px solid var(--accent-gold);";
      }

      return `
        <tr style="${rowStyle}">
          <td style="padding: 8px 12px; font-weight: bold; width: 40px; text-align: center; ${posStyle}">${index + 1}</td>
          <td style="padding: 8px 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 24px; height: 24px; display:flex; align-items:center; justify-content:center;">${s.team.renderCrestHTML(20)}</div>
              <span style="font-size: 0.9rem; font-weight: ${isPlayer ? '900' : '500'}; color: ${isPlayer ? 'var(--accent-gold)' : '#fff'};">${s.team.name}</span>
            </div>
          </td>
          <td style="padding: 8px 12px; text-align: right; font-family: var(--font-heading); font-weight: bold;">${s.points}</td>
        </tr>
      `;
    }).join("");

    const renderCupWinner = (title, team) => {
      if (!team) return '';
      return `
        <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-glass); border-radius: 12px; padding: 12px; flex: 1; min-width: 150px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
          <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: bold; margin-bottom: 8px;">${title}</div>
          <div style="margin-bottom: 8px;">${team.renderCrestHTML(40)}</div>
          <div style="font-family: var(--font-heading); font-size: 0.95rem; font-weight: bold;">${team.name}</div>
        </div>
      `;
    };

    return `
      <div style="margin-top: 32px; text-align: left;">
        <h3 style="font-family: var(--font-heading); font-size: 1.3rem; margin-bottom: 16px; color: var(--accent-blue); display: flex; align-items: center; gap: 8px;">
          🌎 Simulación Global
        </h3>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
          
          <!-- LIGAS -->
          <div style="background: rgba(0,0,0,0.2); border-radius: 14px; border: 1px solid rgba(255,255,255,0.03); overflow: hidden; display: flex; flex-direction: column;">
            
            <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.4); padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05);">
              <button id="btn-prev-league" class="btn-secondary" style="padding: 4px 12px; min-width: 0; font-size: 1rem;">◀</button>
              <div style="font-family: var(--font-heading); font-weight: bold; text-transform: uppercase; font-size: 0.9rem;">
                ${displayLeagueName}
              </div>
              <button id="btn-next-league" class="btn-secondary" style="padding: 4px 12px; min-width: 0; font-size: 1rem;">▶</button>
            </div>
            
            <div style="overflow-y: auto; max-height: 350px;">
              <table style="width: 100%; border-collapse: collapse; text-align: left;">
                <thead style="position: sticky; top: 0; background: rgba(20,20,20,0.95); z-index: 1;">
                  <tr>
                    <th style="padding: 8px 12px; color: var(--text-muted); font-size: 0.7rem; text-align: center;">POS</th>
                    <th style="padding: 8px 12px; color: var(--text-muted); font-size: 0.7rem;">CLUB</th>
                    <th style="padding: 8px 12px; color: var(--text-muted); font-size: 0.7rem; text-align: right;">PTS</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableRows}
                </tbody>
              </table>
            </div>

          </div>

          <!-- COPAS -->
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; gap: 16px; flex-wrap: wrap;">
              ${renderCupWinner("🏆 Libertadores", record.cupWinners["libertadores"])}
              ${renderCupWinner("🌎 Sudamericana", record.cupWinners["sudamericana"])}
            </div>
            <div style="display: flex; gap: 16px; flex-wrap: wrap;">
              ${renderCupWinner("🇦🇷 Copa Argentina", record.cupWinners["copa_argentina"])}
            </div>
          </div>

        </div>
      </div>
    `;
  }


}
