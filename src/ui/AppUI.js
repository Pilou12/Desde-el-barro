import { CareerEngine } from "../domain/CareerEngine.js";
import { PositionFactory } from "../domain/positions/PositionStrategy.js";
import { ARGENTINE_LEAGUES } from "../data/leagues/argLeaguesData.js";
import { SeasonNarrator } from "../domain/SeasonNarrator.js";
import { STORE_ITEMS, getStoreItemById } from '../domain/StoreCatalog.js';

/**
 * Clase AppUI (POO)
 * Controlador principal de la Interfaz de Usuario y renderizado de pantallas.
 */
export class AppUI {
  constructor(appContainer) {
    this.container = appContainer;
    this.engine = new CareerEngine();
    this.state = {
      screen: "START_MENU", // START_MENU, CUSTOM_SETUP, DASHBOARD, TRAINING, MIDSEASON, SEASON_SUMMARY, TRANSFER_MARKET, STORE, RETIREMENT
      currentTrainingOptions: [],
      lastSeasonResult: null,
      selectedDivisionTab: "primera", // primera, b_nacional, b_metro, primera_c
      selectedCustomTeamId: "river",
      selectedPositionKey: "delantero",
      summaryLeagueIndex: 0 // Índice para el carrusel de ligas
    };
  }

  init() {
    this.render();
  }

  render() {
    this.container.innerHTML = "";

    const brandHeader = `
      <header class="header-brand">
        <h1>EL ÍDOLO ENHANCED</h1>
        <p>Hacé tu carrera profesional en el Fútbol Argentino y Mundial</p>
      </header>
    `;

    let screenContent = "";
    switch (this.state.screen) {
      case "START_MENU":
        screenContent = this.renderStartMenu();
        break;
      case "CUSTOM_SETUP":
        screenContent = this.renderCustomSetup();
        break;
      case "DASHBOARD":
        screenContent = this.renderDashboard();
        break;
      case "TRAINING":
        screenContent = this.renderTraining();
        break;
      case "MIDSEASON":
        screenContent = this.renderMidseason();
        break;
      case "SEASON_SUMMARY":
        screenContent = this.renderSeasonSummary();
        break;
      case "TRANSFER_MARKET":
        screenContent = this.renderTransferMarket();
        break;
      case "STORE":
        screenContent = this.renderStore();
        break;
      case "CUP_MATCH":
        screenContent = this.renderCupMatch();
        break;
      case "NARRATIVE_MINIGAME":
        screenContent = this.renderNarrativeMinigame();
        break;
      case "RETIREMENT":
        screenContent = this.renderRetirement();
        break;
      default:
        screenContent = this.renderStartMenu();
    }

    this.container.innerHTML = `${brandHeader}<main>${screenContent}</main>`;
    this.bindEvents();
  }

  renderStartMenu() {
    return `
      <div class="hero-banner">
        <span class="badge-rarity dorada" style="font-size: 0.8rem; margin-bottom: 8px;">EDICIÓN PROFESIONAL V0.0.11</span>
        <h2 style="font-family: var(--font-heading); font-size: 2.2rem; font-weight: 900; margin-bottom: 8px;">CONVERTITE EN LEYENDA DEL FÚTBOL</h2>
        <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto; font-size: 0.95rem;">
          Arrancás a los 16 años en el ascenso profundo o en tu club soñado. Tomá decisiones clave, entrená tus atributos, jugá el clásico y negociá contratos millonarios.
        </p>

        <div class="hero-features-grid">
          <div class="feature-pill">
            <strong>30 CLUBES LPF</strong>
            Formato oficial AFA 2026
          </div>
          <div class="feature-pill">
            <strong>11 POSICIONES</strong>
            Cancha Táctica interactiva limpia
          </div>
          <div class="feature-pill">
            <strong>ESCUDOS REALES</strong>
            Triple CDN + Respaldo Wikimedia
          </div>
        </div>

        <div class="mode-cards-grid">
          <div id="btn-start-random" class="mode-card">
            <div>
              <div class="mode-icon">🎲</div>
              <h3 style="font-family: var(--font-heading); font-size: 1.3rem; margin-bottom: 6px;">Modo Aleatorio</h3>
              <p style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.4;">
                Del Ascenso a la Gloria. Arrancás desde un club al azar de Primera C o B Metro a los 16 años y te abrís paso a pura gambeta y gol.
              </p>
            </div>
            <button class="btn-primary" style="margin-top: 16px;">Iniciar Modo Carrera Aleatoria</button>
          </div>

          <div id="btn-start-custom" class="mode-card">
            <div>
              <div class="mode-icon">🎯</div>
              <h3 style="font-family: var(--font-heading); font-size: 1.3rem; margin-bottom: 6px;">Modo Selección</h3>
              <p style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.4;">
                Seleccioná tu posición táctica exacta entre 11 puestos y elegí tu Club de Origen con escudos reales de CDN.
              </p>
            </div>
            <button class="btn-secondary" style="margin-top: 16px;">Elegir Club y Posición</button>
          </div>
        </div>
      </div>
    `;
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

  renderCustomSetup() {
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
    const player = this.engine.player;
    const team = this.engine.currentTeam;
    const league = this.engine.currentLeague;
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
            <span style="color: var(--accent-green); font-weight: 800; text-transform: uppercase; font-size: 0.75rem;">Año ${this.engine.currentYear} • ${player.age} Años</span>
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
    const player = this.engine.player;
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

  renderDashboard() {
    const totals = this.engine.player.getCareerTotals();

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
            🏃‍♂️ Iniciar Pretemporada ${this.engine.currentYear} (Etapa 1/3)
          </button>
          <button id="btn-open-store" class="btn-secondary" style="flex: 1; border-color: var(--accent-gold); color: var(--accent-gold);">
            🛒 Tienda de Lujos y Mejoras
          </button>
        </div>
      </div>

      ${this.renderSeasonsHistoryTable()}
    `;
  }

  renderTraining() {
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
          <h2 style="font-family: var(--font-heading); margin-top: 2px;">Plan de Entrenamiento ${this.engine.currentYear}</h2>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">Elegí qué aspecto físico o táctico vas a mejorar este año antes de salir a la cancha:</p>

          <div class="options-grid">
            ${cardsHTML}
          </div>
        </div>
      </div>
    `;
  }

  renderMidseason() {
    const event = this.engine.activeMidseasonEvent;
    const totalEvents = this.engine.midseasonEvents.length;
    const currentIdx = this.engine.midseasonEventIndex;
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
    `).join("") : `
      <button id="btn-continue-season" class="btn-primary">
        ⚽ Jugar Tramo Final de la Temporada
      </button>
    `;

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

  renderCupMatch() {
    const minigame = this.engine.activeMinigame;
    if (!minigame) return this.renderDashboard();

    const formatCupName = (type) => {
      if (type === "copa_argentina") return "Copa Argentina";
      if (type === "libertadores") return "Copa Libertadores";
      if (type === "sudamericana") return "Copa Sudamericana";
      if (type === "recopa") return "Recopa";
      return "Copa";
    };

    const headerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="color: var(--accent-gold); font-weight: 800; font-size: 0.8rem; text-transform: uppercase;">Competición Oficial</span>
        <h2 style="font-family: var(--font-heading); font-size: 2rem; margin: 6px 0;">${formatCupName(minigame.cupType)}</h2>
        <p style="color: var(--text-secondary);">Rondas ganadas: <strong>${minigame.currentWins} / ${minigame.requiredWins}</strong> para ser Campeón</p>
        <div style="margin-top: 8px;">
          <span style="background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; color: #fff;">
            DIFICULTAD: ${minigame.difficultyLabel}
          </span>
        </div>
      </div>
    `;

    if (minigame.status === "PLAYING" || minigame.status === "ELIMINATED" || minigame.status === "WON") {
      // Render Matrix
      const matrixHTML = minigame.grid.map((cell, idx) => {
        let content = "❓";
        let cellClass = "btn-matrix-cell";
        let disabled = "";

        if (cell === "HINT_LOSS") {
          content = "💀";
          cellClass += " hint";
        } else if (cell === "REVEALED_WIN") {
          content = "✅";
          cellClass += " win";
          disabled = "disabled";
        } else if (cell === "REVEALED_LOSS") {
          content = "❌";
          cellClass += " loss";
          disabled = "disabled";
        } else if (cell === "REVEALED_DRAW") {
          content = "⚖️";
          cellClass += " draw";
          disabled = "disabled";
        }

        // Si terminó el juego, deshabilitamos todo y revelamos
        if (minigame.status !== "PLAYING" && !disabled) {
          disabled = "disabled";
          if (cell === "WIN") content = "✅";
          if (cell === "LOSS") content = "❌";
          if (cell === "DRAW") content = "⚖️";
        }

        return `<button class="${cellClass}" data-cell-index="${idx}" ${disabled}>${content}</button>`;
      }).join("");

      let statusMsg = "";
      let continueBtn = "";
      if (minigame.status === "WON") {
        statusMsg = `<div class="alert-success" style="margin-top: 16px;">🏆 ¡CAMPEONES DE LA COPA! Has ganado todas las rondas.</div>`;
        continueBtn = `<button id="btn-continue-cup" class="btn-primary" style="margin-top: 16px;">Siguiente</button>`;
      } else if (minigame.status === "ELIMINATED") {
        statusMsg = `<div class="alert-danger" style="margin-top: 16px;">💀 Derrota. Has sido eliminado de la competición.</div>`;
        continueBtn = `<button id="btn-continue-cup" class="btn-primary" style="margin-top: 16px;">Siguiente</button>`;
      }

      const logHTML = (minigame.matchLogs && minigame.matchLogs.length > 0) 
        ? minigame.matchLogs.map(log => `<p style="margin-bottom: 4px; font-weight: bold; color: var(--text-secondary);">${log}</p>`).join("")
        : "";

      let bottomInfo = "";
      if (logHTML) {
        bottomInfo = `
          <div style="background: rgba(0,0,0,0.4); padding: 12px; border-radius: 8px; margin-top: 20px; font-size: 0.9rem; text-align: left; max-height: 150px; overflow-y: auto;">
            ${logHTML}
          </div>
        `;
      }

      return `
        <div class="glass-card">
          ${headerHTML}
          <div style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 4px; max-width: 400px; margin: 0 auto;">
            ${matrixHTML}
          </div>
          ${bottomInfo}
          ${statusMsg}
          ${continueBtn}
        </div>
      `;
    } else if (minigame.status === "PENALTIES") {
      const shootout = minigame.penaltyShootout;
      
      const kicksHistoryHTML = shootout.kicks.map((k, i) => {
        if (i < shootout.currentKick) {
          return k.scored ? `<span style="color:var(--accent-green); font-size: 1.5rem;">✅</span>` : `<span style="color:var(--accent-red); font-size: 1.5rem;">❌</span>`;
        }
        return `<span style="color:var(--text-muted); font-size: 1.5rem;">⚪</span>`;
      }).join(" ");

      let hintMsg = "";
      const currentKick = shootout.kicks[shootout.currentKick];
      if (currentKick && currentKick.hasHint && currentKick.wrongDirectionHint) {
        let dirTrans = currentKick.wrongDirectionHint === "LEFT" ? "Izquierda" : currentKick.wrongDirectionHint === "RIGHT" ? "Derecha" : "EL CENTRO";
        hintMsg = `
          <div style="background: linear-gradient(135deg, rgba(3,169,244,0.3) 0%, rgba(3,169,244,0.1) 100%); 
                      border: 2px solid var(--accent-blue); 
                      border-left: 6px solid var(--accent-blue);
                      border-radius: 12px; 
                      padding: 16px; 
                      margin: 20px 0; 
                      box-shadow: 0 0 20px rgba(3,169,244,0.4);
                      text-align: left;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
              <span style="font-size: 1.8rem; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">👁️</span>
              <h3 style="color: #fff; margin: 0; text-transform: uppercase; font-family: var(--font-heading); font-size: 1.2rem; letter-spacing: 0.5px;">
                ¡VENTAJA TÁCTICA!
              </h3>
            </div>
            <p style="color: rgba(255,255,255,0.95); font-size: 1.05rem; margin: 0; font-weight: 500;">
              Gracias a tus excelentes estadísticas, sabemos con seguridad que la respuesta <strong style="color: #ff4d4d; font-weight: 900; background: rgba(255,0,0,0.2); padding: 2px 6px; border-radius: 4px;">NO ES</strong> hacia <span style="color: var(--accent-gold); font-weight: 900; text-transform: uppercase; text-decoration: underline;">${dirTrans}</span>.
            </p>
          </div>
        `;
      }

      let penaltyInterface = "";
      if (shootout.status === "PLAYING") {
        penaltyInterface = `
          ${hintMsg}
          <div style="display: flex; gap: 12px; justify-content: center; margin-top: 20px;">
            <button class="btn-primary btn-penalty-dir" data-dir="LEFT">Izquierda</button>
            <button class="btn-primary btn-penalty-dir" data-dir="CENTER">Centro</button>
            <button class="btn-primary btn-penalty-dir" data-dir="RIGHT">Derecha</button>
          </div>
        `;
      } else {
        let outcome = shootout.status === "WON" 
          ? `<div class="alert-success">🏆 ¡Ganaste la tanda de penales! Avanzás de ronda.</div>`
          : `<div class="alert-danger">💀 Perdiste la tanda de penales. Eliminado.</div>`;
        penaltyInterface = `
          ${outcome}
        `;
      }

      return `
        <div class="glass-card" style="text-align: center;">
          ${headerHTML}
          <h3 style="color: #fff; margin-bottom: 10px;">TANDA DE PENALES</h3>
          <p style="color: var(--accent-gold); font-weight: bold; margin-bottom: 20px;">⚠️ Hubo un empate. Tenés que meter los 3 penales seguidos para avanzar. Un fallo = Eliminado.</p>
          
          <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            ${kicksHistoryHTML}
          </div>

          ${penaltyInterface}
        </div>
      `;
    }
  }

  renderNarrativeMinigame() {
    const minigame = this.engine.activeMinigame;
    if (!minigame || !minigame.isNarrative) return this.renderDashboard();

    if (minigame.type === "penalties") {
      const eventTitle = minigame.eventContext?.title || "Minijuego Narrativo";
      const eventDesc = minigame.eventContext?.description || "Resolvé esta situación de vida o muerte.";
      
      const shootout = minigame;
      
      const kicksHistoryHTML = shootout.kicks.map((k, i) => {
        if (i < shootout.currentKick) {
          return k.scored ? `<span style="color:var(--accent-green); font-size: 1.5rem;">✅</span>` : `<span style="color:var(--accent-red); font-size: 1.5rem;">❌</span>`;
        }
        return `<span style="color:var(--text-muted); font-size: 1.5rem;">⚪</span>`;
      }).join(" ");

      let hintMsg = "";
      const currentKick = shootout.kicks[shootout.currentKick];
      if (currentKick && currentKick.hasHint && currentKick.wrongDirectionHint) {
        let dirTrans = currentKick.wrongDirectionHint === "LEFT" ? "Izquierda" : currentKick.wrongDirectionHint === "RIGHT" ? "Derecha" : "EL CENTRO";
        hintMsg = `
          <div style="background: linear-gradient(135deg, rgba(3,169,244,0.3) 0%, rgba(3,169,244,0.1) 100%); 
                      border: 2px solid var(--accent-blue); 
                      border-left: 6px solid var(--accent-blue);
                      border-radius: 12px; 
                      padding: 16px; 
                      margin: 20px 0; 
                      box-shadow: 0 0 20px rgba(3,169,244,0.4);
                      text-align: left;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
              <span style="font-size: 1.8rem; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">👁️</span>
              <h3 style="color: #fff; margin: 0; text-transform: uppercase; font-family: var(--font-heading); font-size: 1.2rem; letter-spacing: 0.5px;">
                ¡VENTAJA TÁCTICA!
              </h3>
            </div>
            <p style="color: rgba(255,255,255,0.95); font-size: 1.05rem; margin: 0; font-weight: 500;">
              Gracias a tus excelentes estadísticas, sabemos con seguridad que la respuesta <strong style="color: #ff4d4d; font-weight: 900; background: rgba(255,0,0,0.2); padding: 2px 6px; border-radius: 4px;">NO ES</strong> hacia <span style="color: var(--accent-gold); font-weight: 900; text-transform: uppercase; text-decoration: underline;">${dirTrans}</span>.
            </p>
          </div>
        `;
      }

      let penaltyInterface = "";
      if (shootout.status === "PLAYING") {
        penaltyInterface = `
          ${hintMsg}
          <div style="display: flex; gap: 12px; justify-content: center; margin-top: 20px;">
            <button class="btn-primary btn-narrative-penalty" data-dir="LEFT">Izquierda</button>
            <button class="btn-primary btn-narrative-penalty" data-dir="CENTER">Centro</button>
            <button class="btn-primary btn-narrative-penalty" data-dir="RIGHT">Derecha</button>
          </div>
        `;
      } else {
        let outcome = shootout.status === "WON" 
          ? `<div class="alert-success">🏆 ¡Héroe absoluto! Metiste los 3 penales, sos leyenda.</div>`
          : `<div class="alert-danger">💀 ¡Fracaso! Fallaste y te comiste las puteadas de todo el estadio.</div>`;
        penaltyInterface = `
          ${outcome}
          <button id="btn-continue-narrative" class="btn-primary" style="margin-top: 16px;">Siguiente</button>
        `;
      }

      return `
        <div class="glass-card" style="text-align: center;">
          <h2 style="font-family: var(--font-heading); color: #fff; margin-bottom: 10px;">${eventTitle}</h2>
          <p style="color: var(--text-secondary); margin-bottom: 20px;">${eventDesc}</p>
          <p style="color: var(--accent-gold); font-weight: bold; margin-bottom: 16px; font-size: 0.9rem;">⚠️ REGLA DE ORO: Tenés que meter los 3 para ganar. Un fallo = Fracaso.</p>
          
          <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            ${kicksHistoryHTML}
          </div>

          ${penaltyInterface}
        </div>
      `;
    }

    return this.renderDashboard();
  }

  renderSeasonSummary() {
    const res = this.state.lastSeasonResult;
    if (!res) return this.renderDashboard();

    const record = res.seasonRecord;
    const player = this.engine.player;
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
          ${eventResults.map(({event, option}, i) => {
            // Construir los efectos del outcome
            const effects = [];
            if (option) {
              if (option.idolBonus   > 0)  effects.push(`<span style="color:var(--accent-green);">+${option.idolBonus} Ídolo 💛</span>`);
              if (option.famaBonus   > 0)  effects.push(`<span style="color:var(--accent-blue);">+${option.famaBonus} Reputación 🌟</span>`);
              if (option.moneyBonus  > 0)  effects.push(`<span style="color:#4caf50;">+$${option.moneyBonus.toLocaleString()} USD 💵</span>`);
              if (option.matchesPenalty)   effects.push(`<span style="color:#ff6b6b;">-${option.matchesPenalty} partidos 🩺</span>`);
              if (option.statPenalty)      effects.push(`<span style="color:#ff6b6b;">Penalidad de atributo ⚠️</span>`);
            }
            const effectsStr = effects.length > 0
              ? effects.join('  ·  ')
              : '<span style="color:var(--text-muted);">Sin bonificaciones</span>';

            return `
              <div style="background: rgba(0,0,0,0.25); border-radius: 12px; padding: 14px 16px; border-left: 3px solid var(--accent-gold);">
                <div style="display:flex; align-items:baseline; gap:8px; margin-bottom:6px;">
                  <span style="font-size: 0.7rem; color: var(--text-muted); font-weight:700; text-transform:uppercase;">Evento ${i+1}</span>
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

  renderTransferMarket() {
    const offers = this.engine.currentTransferOffers;
    
    const offersHTML = offers.map((offer, idx) => {
      return `
        <div class="transfer-card">
          <div>
            <div style="display: flex; justify-content: center; margin-bottom: 12px; height: 68px; align-items: center;">
              ${offer.team.renderCrestHTML(64)}
            </div>

            <span class="badge-rarity dorada">Oferta Oficial</span>
            <h3 style="font-family: var(--font-heading); font-size: 1.2rem; margin: 6px 0;">${offer.team.name}</h3>
            <p style="color: var(--accent-green); font-weight: 700; font-size: 0.85rem;">"${offer.team.nickname}"</p>
            <p style="color: var(--text-secondary); font-size: 0.8rem; margin-top: 4px;">${offer.league.name}</p>

            <div class="salary-badge">
              💵 ${offer.getFormattedSalary()}
            </div>

            <p style="font-size: 0.8rem; color: var(--text-muted);">
              Contrato por ${offer.contractYears} años • Prima de firma: ${offer.getFormattedBonus()}
            </p>
          </div>

          <button class="btn-primary btn-accept-transfer" data-offer-index="${idx}" style="margin-top: 14px;">
            ✍️ Firmar Contrato con ${offer.team.name}
          </button>
        </div>
      `;
    }).join("");

    return `
      <div class="glass-card">
        ${this.renderPlayerHeroCard()}

        <div style="margin-top: 16px;">
          <span style="color: var(--accent-gold); font-weight: 800; font-size: 0.8rem; text-transform: uppercase;">💼 Mercado de Pases ${this.engine.currentYear}</span>
          <h2 style="font-family: var(--font-heading); margin-top: 2px;">Ofertas de Transferencia Recibidas</h2>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">
            Tus buenas actuaciones despertaron el interés de los siguientes clubes. Podés firmar con uno o renovar en tu equipo actual:
          </p>

          <div class="transfer-grid">
            ${offersHTML}
          </div>

          <button id="btn-reject-transfers" class="btn-secondary" style="margin-top: 20px; padding: 14px;">
            ❤️ Rechazar todo y Renovar en ${this.engine.currentTeam.name} (+10% Ídolo)
          </button>
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

  renderStore() {
    const player = this.engine.player;
    const items = STORE_ITEMS;
    
    const lujos = items.filter(i => i.category === "lujo");
    const mejoras = items.filter(i => i.category === "mejora");

    const renderItemCard = (item) => {
      const isPurchased = player.hasItem(item.id);
      const canAfford = player.bankBalance >= item.price;
      
      return `
        <div class="glass-card" style="padding: 12px; margin-bottom: 12px; display: flex; align-items: center; gap: 16px; opacity: ${isPurchased ? '0.6' : '1'}; border-left: 4px solid ${item.category === 'mejora' ? 'var(--accent-blue)' : 'var(--accent-gold)'};">
          <div style="font-size: 2.2rem; min-width: 40px; text-align: center;">${item.icon}</div>
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
              <h4 style="font-family: var(--font-heading); color: var(--text-primary); margin: 0; font-size: 1.05rem;">${item.name}</h4>
              <div style="font-family: var(--font-heading); font-size: 1rem; font-weight: 900; color: ${isPurchased ? 'var(--text-muted)' : '#4caf50'};">
                $${item.price.toLocaleString()}
              </div>
            </div>
            <p style="color: var(--text-secondary); font-size: 0.8rem; line-height: 1.3; margin: 0;">${item.description}</p>
          </div>
          <div style="min-width: 100px;">
            <button class="${isPurchased ? 'btn-secondary' : 'btn-primary btn-buy-store'}" data-item-id="${item.id}" ${isPurchased || !canAfford ? 'disabled' : ''} style="width: 100%; padding: 8px; font-size: 0.8rem; ${isPurchased ? 'cursor: default;' : ''}">
              ${isPurchased ? 'Comprado ✅' : (canAfford ? 'Comprar 🛒' : 'Fondos Insuficientes')}
            </button>
          </div>
        </div>
      `;
    };

    return `
      <div style="max-width: 1000px; margin: 0 auto;">
        <div class="glass-card" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <div>
            <h2 style="font-family: var(--font-heading); font-size: 1.8rem; margin: 0 0 4px 0;">Tienda Exclusiva</h2>
            <p style="color: var(--text-secondary); margin: 0;">Invertí los millones que ganaste en tu carrera.</p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Tu Saldo Bancario</div>
            <div style="font-family: var(--font-heading); font-size: 2rem; color: #4caf50; font-weight: 900;">$${player.bankBalance.toLocaleString()}</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 32px;">
          <!-- Mejoras -->
          <div>
            <h3 style="font-family: var(--font-heading); color: var(--accent-blue); margin-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
              ⚙️ Ventajas de Carrera
            </h3>
            <div>
              ${mejoras.map(renderItemCard).join('')}
            </div>
          </div>

          <!-- Lujos -->
          <div>
            <h3 style="font-family: var(--font-heading); color: var(--accent-gold); margin-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
              💎 Lujos de Estrella
            </h3>
            <div>
              ${lujos.map(renderItemCard).join('')}
            </div>
          </div>
        </div>
        
        <div style="margin-top: 32px; text-align: center;">
          <button id="btn-back-store" class="btn-secondary" style="min-width: 200px;">Volver al Dashboard</button>
        </div>
      </div>
    `;
  }

  renderRetirement() {
    const player = this.engine.player;
    const totals = player.getCareerTotals();
    const seasons = player.seasonsHistory.length;
    const titles = player.seasonsHistory.filter(s => s.wonTitle).length;
    const currentTeam = this.engine.currentTeam;

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
    const history = this.engine.player.seasonsHistory;
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
    // Menu Inicial
    const btnRandom = document.getElementById("btn-start-random");
    if (btnRandom) {
      btnRandom.onclick = () => {
        this.engine.startNewCareer({ mode: "random" });
        this.state.screen = "DASHBOARD";
        this.render();
      };
    }

    const btnCustom = document.getElementById("btn-start-custom");
    if (btnCustom) btnCustom.onclick = () => { this.state.screen = "CUSTOM_SETUP"; this.render(); };

    const btnStore = document.getElementById("btn-open-store");
    if (btnStore) {
      btnStore.onclick = () => {
        this.state.screen = "STORE";
        this.render();
      };
    }

    const btnBuyStore = document.querySelectorAll(".btn-buy-store");
    btnBuyStore.forEach(btn => {
      btn.onclick = (e) => {
        const itemId = e.currentTarget.getAttribute("data-item-id");
        const item = getStoreItemById(itemId);
        if (item) {
          if (this.engine.player.buyItem(item)) {
            this.render(); // Re-render to show purchased status and new balance
          } else {
            alert("No tenés suficiente dinero.");
          }
        }
      };
    });

    const btnBackStore = document.getElementById("btn-back-store");
    if (btnBackStore) {
      btnBackStore.onclick = () => {
        this.state.screen = "DASHBOARD";
        this.render();
      };
    }

    // Resumen de Temporada (Carrusel)
    const btnPrevLeague = document.getElementById("btn-prev-league");
    if (btnPrevLeague) {
      btnPrevLeague.onclick = () => {
        const res = this.state.lastSeasonResult;
        if (res && res.seasonRecord && res.seasonRecord.allStandings) {
          const keys = Object.keys(res.seasonRecord.allStandings);
          this.state.summaryLeagueIndex = (this.state.summaryLeagueIndex - 1 + keys.length) % keys.length;
          this.render();
        }
      };
    }
    
    const btnNextLeague = document.getElementById("btn-next-league");
    if (btnNextLeague) {
      btnNextLeague.onclick = () => {
        const res = this.state.lastSeasonResult;
        if (res && res.seasonRecord && res.seasonRecord.allStandings) {
          const keys = Object.keys(res.seasonRecord.allStandings);
          this.state.summaryLeagueIndex = (this.state.summaryLeagueIndex + 1) % keys.length;
          this.render();
        }
      };
    }

    // Custom Setup - Clic en Nodos de Cancha Táctica
    const pitchNodes = document.querySelectorAll(".pitch-node");
    pitchNodes.forEach(node => {
      node.onclick = (e) => {
        const key = e.currentTarget.getAttribute("data-pos-key");
        this.state.selectedPositionKey = key;
        this.render();
      };
    });

    // Custom Setup - Cambiar pestañas de división
    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach(btn => {
      btn.onclick = (e) => {
        const tab = e.currentTarget.getAttribute("data-tab");
        this.state.selectedDivisionTab = tab;
        
        const tabMap = {
          primera: ARGENTINE_LEAGUES.primera,
          b_nacional: ARGENTINE_LEAGUES.b_nacional,
          b_metro: ARGENTINE_LEAGUES.b_metro,
          primera_c: ARGENTINE_LEAGUES.primera_c
        };
        const league = tabMap[tab] || ARGENTINE_LEAGUES.primera;
        if (league.teams.length) {
          this.state.selectedCustomTeamId = league.teams[0].id;
        }

        this.render();
      };
    });

    // Custom Setup - Selección visual de club
    const clubCards = document.querySelectorAll(".club-card-select");
    clubCards.forEach(card => {
      card.onclick = (e) => {
        const teamId = e.currentTarget.getAttribute("data-team-id");
        this.state.selectedCustomTeamId = teamId;
        this.render();
      };
    });

    const btnConfirmCustom = document.getElementById("btn-confirm-custom");
    if (btnConfirmCustom) {
      btnConfirmCustom.onclick = () => {
        const name = document.getElementById("input-name").value.trim() || "El Pibe";
        const positionKey = this.state.selectedPositionKey || "delantero";
        const customTeamId = this.state.selectedCustomTeamId || "river";

        this.engine.startNewCareer({ playerName: name, positionKey, mode: "custom_start", customTeamId });
        this.state.screen = "DASHBOARD";
        this.render();
      };
    }

    const btnBackMenu = document.getElementById("btn-back-menu");
    if (btnBackMenu) {
      btnBackMenu.onclick = () => {
        this.state.screen = "START_MENU";
        this.render();
      };
    }

    // Dashboard -> Pretemporada
    const btnNextTraining = document.getElementById("btn-next-training");
    if (btnNextTraining) {
      btnNextTraining.onclick = () => {
        this.state.currentTrainingOptions = this.engine.getTrainingOptions();
        this.state.screen = "TRAINING";
        this.render();
      };
    }

    // Selección de Entrenamiento -> Mitad de Temporada
    const cardBtns = document.querySelectorAll(".btn-select-card");
    cardBtns.forEach(btn => {
      btn.onclick = (e) => {
        const idx = Number(e.currentTarget.getAttribute("data-card-index"));
        const selectedCard = this.state.currentTrainingOptions[idx];
        if (selectedCard) {
          this.engine.applyTrainingCard(selectedCard);
        }

        this.state.screen = "MIDSEASON";
        this.render();
      };
    });

    // Saltear pretemporada (sin cartas disponibles)
    const btnSkipTraining = document.getElementById("btn-skip-training");
    if (btnSkipTraining) {
      btnSkipTraining.onclick = () => {
        // Sin carta seleccionada, cargar eventos de mitad de temporada igualmente
        this.engine.seasonPhase = "MIDSEASON_EVENT";
        this.engine.midseasonEvents = this.engine.eventManager.getSeasonEventsForPlayer(this.engine.player, this.engine.currentTeam);
        this.engine.midseasonEventIndex = 0;
        this.engine.midseasonEventResults = [];
        this.engine.activeMidseasonEvent = this.engine.midseasonEvents[0] ?? null;
        this.state.screen = "MIDSEASON";
        this.render();
      };
    }

    // Evento de Mitad de Temporada -> puede haber varios consecutivos
    const eventBtns = document.querySelectorAll(".btn-event-option");
    eventBtns.forEach(btn => {
      btn.onclick = (e) => {
        const idx = Number(e.currentTarget.getAttribute("data-opt-index"));
        this.engine.resolveMidseasonEvent(idx);

        if (this.engine.seasonPhase === "NARRATIVE_MINIGAME") {
          this.state.screen = "NARRATIVE_MINIGAME";
        } else if (this.engine.hasPendingMidseasonEvents) {
          this.state.screen = "MIDSEASON";
        } else if (this.engine.seasonPhase === "CUP_NATIONAL" || this.engine.seasonPhase === "CUP_INTERNATIONAL") {
          this.state.screen = "CUP_MATCH";
        } else {
          const seasonRes = this.engine.finishCurrentSeason();
          this.state.lastSeasonResult = seasonRes;
          this.state.screen = seasonRes.isRetired ? "RETIREMENT" : "SEASON_SUMMARY";
        }
        this.render();
      };
    });

    const btnContinueSeason = document.getElementById("btn-continue-season");
    if (btnContinueSeason) {
      btnContinueSeason.onclick = () => {
        this.engine.resolveMidseasonEvent(-1);
        
        if (this.engine.seasonPhase === "NARRATIVE_MINIGAME") {
          this.state.screen = "NARRATIVE_MINIGAME";
        } else if (this.engine.hasPendingMidseasonEvents) {
          this.state.screen = "MIDSEASON";
        } else if (this.engine.seasonPhase === "CUP_NATIONAL" || this.engine.seasonPhase === "CUP_INTERNATIONAL") {
          this.state.screen = "CUP_MATCH";
        } else {
          const seasonRes = this.engine.finishCurrentSeason();
          this.state.lastSeasonResult = seasonRes;
          this.state.screen = seasonRes.isRetired ? "RETIREMENT" : "SEASON_SUMMARY";
        }
        this.render();
      };
    }

    // Minijuegos Narrativos (Penales)
    const narrativePenaltyBtns = document.querySelectorAll(".btn-narrative-penalty");
    narrativePenaltyBtns.forEach(btn => {
      btn.onclick = (e) => {
        const dir = e.currentTarget.getAttribute("data-dir");
        this.engine.resolveNarrativePenaltyKick(dir);
        this.render();
      };
    });

    const btnContinueNarrative = document.getElementById("btn-continue-narrative");
    if (btnContinueNarrative) {
      btnContinueNarrative.onclick = () => {
        this.engine.continueFromNarrativeMinigame();
        if (this.engine.hasPendingMidseasonEvents) {
          this.state.screen = "MIDSEASON";
        } else if (this.engine.seasonPhase === "CUP_NATIONAL" || this.engine.seasonPhase === "CUP_INTERNATIONAL") {
          this.state.screen = "CUP_MATCH";
        } else {
          const seasonRes = this.engine.finishCurrentSeason();
          this.state.lastSeasonResult = seasonRes;
          this.state.screen = seasonRes.isRetired ? "RETIREMENT" : "SEASON_SUMMARY";
        }
        this.render();
      };
    }

    // Minijuego de Copa: Matriz
    const matrixBtns = document.querySelectorAll(".btn-matrix-cell");
    matrixBtns.forEach(btn => {
      btn.onclick = (e) => {
        const idx = Number(e.currentTarget.getAttribute("data-cell-index"));
        this.engine.resolveCupMatrixClick(idx);
        this.render();
      };
    });

    // Minijuego de Copa: Penales
    const penaltyBtns = document.querySelectorAll(".btn-penalty-dir");
    penaltyBtns.forEach(btn => {
      btn.onclick = (e) => {
        const dir = e.currentTarget.getAttribute("data-dir");
        this.engine.resolvePenaltyKick(dir);
        this.render();
      };
    });

    // El flujo de penales ahora es automático, no se necesita btn-end-penalty

    const btnContinueCup = document.getElementById("btn-continue-cup");
    if (btnContinueCup) {
      btnContinueCup.onclick = () => {
        this.engine.continueFromCup();
        if (this.engine.seasonPhase === "CUP_NATIONAL" || this.engine.seasonPhase === "CUP_INTERNATIONAL") {
          this.state.screen = "CUP_MATCH";
        } else {
          const seasonRes = this.engine.finishCurrentSeason();
          this.state.lastSeasonResult = seasonRes;
          this.state.screen = seasonRes.isRetired ? "RETIREMENT" : "SEASON_SUMMARY";
        }
        this.render();
      };
    }

    // Resumen Anual -> Mercado de Pases
    const btnOpenMarket = document.getElementById("btn-open-market");
    if (btnOpenMarket) {
      btnOpenMarket.onclick = () => {
        this.state.screen = "TRANSFER_MARKET";
        this.render();
      };
    }

    // Aceptar oferta de transferencia
    const acceptBtns = document.querySelectorAll(".btn-accept-transfer");
    acceptBtns.forEach(btn => {
      btn.onclick = (e) => {
        const idx = Number(e.currentTarget.getAttribute("data-offer-index"));
        this.engine.acceptTransferOffer(idx);
        this.state.screen = "DASHBOARD";
        this.render();
      };
    });

    // Rechazar todas las ofertas de transferencia y renovar
    const btnRejectTransfers = document.getElementById("btn-reject-transfers");
    if (btnRejectTransfers) {
      btnRejectTransfers.onclick = () => {
        this.engine.rejectAllTransferOffers();
        this.state.screen = "DASHBOARD";
        this.render();
      };
    }

    // Reiniciar
    const btnRestart = document.getElementById("btn-restart");
    if (btnRestart) {
      btnRestart.onclick = () => {
        this.state.screen = "START_MENU";
        this.render();
      };
    }
  }
}
