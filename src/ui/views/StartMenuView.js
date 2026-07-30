import { View } from './View.js';
import { ARGENTINE_LEAGUES } from '../../data/leagues/argLeaguesData.js';
import { STORE_ITEMS, getStoreItemById } from '../../domain/StoreCatalog.js';
import { PositionFactory } from '../../domain/positions/PositionStrategy.js';
import { SeasonNarrator } from '../../domain/SeasonNarrator.js';

export class StartMenuView extends View {
  getTemplate() {
    return `
      <div class="hero-banner" style="position: relative;">
        <button id="btn-goto-debug" style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.5); border: 1px solid #ff4d4d; color: #ff4d4d; border-radius: 4px; padding: 4px 8px; font-size: 0.7rem; cursor: pointer;">🛠 Debug</button>
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

  bindEvents() {
    const btnRandom = document.getElementById("btn-start-random");
    if (btnRandom) {
      btnRandom.onclick = () => {
        this.deps.stateManager.update({ screen: "CUSTOM_SETUP", setupMode: "random" });
        this.deps.appRouter.render();
      };
    }

    const btnCustom = document.getElementById("btn-start-custom");
    if (btnCustom) {
      btnCustom.onclick = () => {
        this.deps.stateManager.update({ screen: "CUSTOM_SETUP", setupMode: "custom" });
        this.deps.appRouter.render();
      };
    }

    const btnDebug = document.getElementById("btn-goto-debug");
    if (btnDebug) {
      btnDebug.onclick = () => {
        this.deps.stateManager.update({ screen: "DEBUG_MENU" });
        this.deps.appRouter.render();
      };
    }
  }
}
