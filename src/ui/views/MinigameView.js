import { MinigameEngine } from "../../domain/MinigameEngine.js";

export class MinigameView {
  constructor(container, stateManager, eventBus, cupManager, seasonSimulator) {
    this.container = container;
    this.stateManager = stateManager;
    this.eventBus = eventBus;
    this.cupManager = cupManager;
    this.seasonSimulator = seasonSimulator;
    
    // Escuchar cambios de estado
    this.eventBus.on("stateChanged", (state) => this.onStateChanged(state));
  }

  onStateChanged(state) {
    if (state.screen !== "CUP_MATCH" && state.screen !== "NARRATIVE_MINIGAME") return;
    this.render(state);
  }

  render(state) {
    const minigame = state.activeMinigame;
    if (!minigame) return;

    if (minigame.type === "matrix" && minigame.status !== "PENALTIES") {
      const grid = this.container.querySelector(".matrix-grid-container");
      if (grid && minigame.status === "PLAYING") {
        this.updateMatrixDOM(minigame);
      } else {
        this.container.innerHTML = this.getMatrixHTML(minigame);
        this.bindEvents(state);
      }
    } else if (minigame.type === "free_kick") {
      this.container.innerHTML = this.getFreeKickHTML(minigame);
      this.bindEvents(state);
    } else if (minigame.type === "penalty_shootout" || (minigame.isNarrative && minigame.type !== "free_kick") || (minigame.type === "matrix" && minigame.status === "PENALTIES")) {
      this.container.innerHTML = this.getPenaltyHTML(minigame, state.screen);
      this.bindEvents(state);
    }
  }

  updateMatrixDOM(minigame) {
    const cells = this.container.querySelectorAll(".btn-matrix-cell");
    const getCellContent = (status) => {
      if (status === "HIDDEN") return "?";
      if (status === "REVEALED_WIN") return "✅";
      if (status === "REVEALED_DRAW") return "⚖️";
      if (status === "REVEALED_LOSS") return "❌";
      if (status === "HINT_WIN") return "🟢";
      if (status === "HINT_DRAW") return "🟡";
      if (status === "HINT_LOSS") return "💀";
      return "?";
    };
    const getCellClass = (status) => {
      if (status === "REVEALED_WIN") return "btn-matrix-cell win";
      if (status === "REVEALED_LOSS") return "btn-matrix-cell loss";
      if (status === "REVEALED_DRAW") return "btn-matrix-cell draw";
      if (status.startsWith("HINT_")) return "btn-matrix-cell hint";
      return "btn-matrix-cell";
    };

    cells.forEach((cell, index) => {
      const status = minigame.grid[index];
      const cls = getCellClass(status);
      const isClickable = !status.startsWith("REVEALED_");
      cell.className = cls;
      if (!isClickable) {
        cell.setAttribute("disabled", "true");
      }
      cell.innerHTML = getCellContent(status);
    });

    const logsContainer = this.container.querySelector(".match-logs");
    if (logsContainer) {
      let logsHTML = "<h4>Relato de la Copa</h4>";
      [...minigame.matchLogs].reverse().forEach(log => {
        logsHTML += `<p>${log}</p>`;
      });
      logsContainer.innerHTML = logsHTML;
    }
  }

  getMatrixHTML(minigame) {
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

    const getCellContent = (status) => {
      if (status === "HIDDEN") return "?";
      if (status === "REVEALED_WIN") return "✅";
      if (status === "REVEALED_DRAW") return "⚖️";
      if (status === "REVEALED_LOSS") return "❌";
      if (status === "HINT_WIN") return "🟢";
      if (status === "HINT_DRAW") return "🟡";
      if (status === "HINT_LOSS") return "💀";
      return "?";
    };

    const getCellClass = (status) => {
      if (status === "REVEALED_WIN") return "btn-matrix-cell win";
      if (status === "REVEALED_LOSS") return "btn-matrix-cell loss";
      if (status === "REVEALED_DRAW") return "btn-matrix-cell draw";
      if (status.startsWith("HINT_")) return "btn-matrix-cell hint";
      return "btn-matrix-cell";
    };

    let gridHTML = `<div class="matrix-grid-container" style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 4px; max-width: 400px; margin: 0 auto 20px auto;">`;
    minigame.grid.forEach((cellStatus, index) => {
      const cls = getCellClass(cellStatus);
      const isClickable = !cellStatus.startsWith("REVEALED_");
      gridHTML += `
        <button class="${cls}" data-cell-index="${index}" ${!isClickable ? 'disabled' : ''}>
          ${getCellContent(cellStatus)}
        </button>
      `;
    });
    gridHTML += `</div>`;

    let logsHTML = `<div class="match-logs"><h4>Relato de la Copa</h4>`;
    if (minigame.matchLogs.length === 0) {
      logsHTML += `<p style="color:var(--text-secondary); text-align:center;">Hacé click en un casillero para jugar la ronda...</p>`;
    } else {
      [...minigame.matchLogs].reverse().forEach(log => {
        logsHTML += `<p>${log}</p>`;
      });
    }
    logsHTML += `</div>`;

    let actionHTML = "";
    if (minigame.status === "WON") {
      actionHTML = `
        <div class="end-screen success" style="margin-top: 16px; text-align: center;">
          <h3>🏆 ¡CAMPEÓN!</h3>
          <p>Has ganado el título.</p>
          <button class="btn btn-primary" id="btn-continue-cup" style="margin-top: 12px;">Festejar y Continuar</button>
        </div>
      `;
    } else if (minigame.status === "ELIMINATED") {
      actionHTML = `
        <div class="end-screen danger" style="margin-top: 16px; text-align: center;">
          <h3>💀 ELIMINADO</h3>
          <p>El sueño se terminó por este año.</p>
          <button class="btn-primary" id="btn-continue-cup" style="margin-top: 12px; background: var(--accent-red); border-color: var(--accent-red);">Aceptar la Derrota</button>
        </div>
      `;
    } else if (minigame.status === "PENALTIES") {
      actionHTML = `
        <div class="end-screen warning" style="margin-top: 16px; text-align: center;">
          <h3>⚖️ ¡HAY PENALES!</h3>
          <p>El partido terminó en empate. Preparate para la definición.</p>
          <button class="btn btn-warning" id="btn-go-penalties" style="margin-top: 12px;">Ir a los Penales</button>
        </div>
      `;
    }

    return `
      <div class="dashboard-layout" style="max-width: 800px; margin: 0 auto; grid-template-columns: 1fr;">
        <div class="panel glass-panel">
          ${headerHTML}
          ${gridHTML}
          ${actionHTML}
          ${logsHTML}
        </div>
      </div>
    `;
  }

  getPenaltyHTML(minigame, screen) {
    const isNarrative = screen === "NARRATIVE_MINIGAME";
    const shootout = isNarrative ? minigame : minigame.penaltyShootout;
    
    let html = `
      <div class="dashboard-layout" style="max-width: 800px; margin: 0 auto; grid-template-columns: 1fr;">
        <div class="panel glass-panel" style="text-align: center;">
          <h2 style="font-family: var(--font-heading); font-size: 2rem; color: var(--accent-gold); margin-bottom: 10px;">
            ${isNarrative ? "Momento Decisivo: PENAL" : "Definición por Penales"}
          </h2>
          <p style="color: var(--text-secondary); margin-bottom: 20px;">
            ${isNarrative ? "La responsabilidad cae sobre tus hombros." : "Muerte súbita. Un fallo puede ser la eliminación."}
          </p>
          
          <div style="font-size: 2rem; font-weight: bold; margin-bottom: 20px;">
             Penales convertidos: ${shootout.playerScore} / ${shootout.currentKick}
          </div>
    `;

    if (shootout.status === "PLAYING") {
      html += `
        <div style="display: flex; gap: 20px; justify-content: center; margin-bottom: 30px;">
          <button class="btn btn-secondary btn-penalty" data-dir="LEFT">◀ Izquierda</button>
          <button class="btn btn-secondary btn-penalty" data-dir="CENTER">▲ Medio</button>
          <button class="btn btn-secondary btn-penalty" data-dir="RIGHT">Derecha ▶</button>
        </div>
        <p style="color: #aaa; font-size: 0.9rem;">Elegí a dónde patear.</p>
      `;
    } else {
      if (shootout.status === "WON") {
        html += `
          <div class="alert success" style="margin-bottom: 20px;">
            <h3>⚽ ¡GOOOOOL Y GLORIA!</h3>
            <p>Le pegaste con alma y vida.</p>
          </div>
        `;
      } else {
        html += `
          <div class="alert danger" style="margin-bottom: 20px;">
            <h3>❌ ¡ATAJÓ EL ARQUERO / AFUERA!</h3>
            <p>Erró el penal. Una lástima.</p>
          </div>
        `;
      }
      
      html += `
        <button class="btn btn-primary" id="${isNarrative ? 'btn-narrative-continue' : 'btn-penalties-continue'}">
          Continuar
        </button>
      `;
    }

    html += `
        </div>
      </div>
    `;
    return html;
  }

  getFreeKickHTML(minigame) {
    let html = `
      <div class="dashboard-layout" style="max-width: 800px; margin: 0 auto; grid-template-columns: 1fr;">
        <div class="panel glass-panel" style="text-align: center;">
          <h2 style="font-family: var(--font-heading); font-size: 2rem; color: var(--accent-gold); margin-bottom: 10px;">
            Momento Decisivo: TIRO LIBRE
          </h2>
          <p style="color: var(--text-secondary); margin-bottom: 20px;">
            Acomodá la pelota. Hacé click en el punto hacia donde querés patear el tiro libre. ¡Ojo que el arquero puede adivinar!
          </p>
    `;

    if (minigame.status === "PLAYING") {
      // Dibujar la portería con los 5 puntos
      let hintMsg = "";
      if (minigame.hintPoint) {
        let dirTrans = minigame.formatDirection(minigame.hintPoint);
        hintMsg = `
          <div style="background: rgba(255,0,0,0.2); border: 1px solid #ff4d4d; border-radius: 8px; padding: 10px; margin-bottom: 15px; text-align: center; color: white;">
            <strong>👁️ ¡OJO!</strong> Sabemos que el arquero va a intentar tapar <strong>${dirTrans}</strong>. ¡No patees ahí!
          </div>
        `;
      }

      html += `
        ${hintMsg}
        <div style="position: relative; width: 100%; max-width: 500px; aspect-ratio: 2/1; margin: 0 auto 30px auto; border: 4px solid white; border-bottom: none; background: rgba(255,255,255,0.1); border-radius: 10px 10px 0 0;">
          <!-- Puntos -->
          <button class="btn btn-primary btn-freekick" data-dir="TOP_LEFT" style="position: absolute; top: 10px; left: 10px; width: 40px; height: 40px; border-radius: 50%; padding: 0;">TL</button>
          <button class="btn btn-primary btn-freekick" data-dir="BOTTOM_LEFT" style="position: absolute; bottom: 10px; left: 10px; width: 40px; height: 40px; border-radius: 50%; padding: 0;">BL</button>
          
          <button class="btn btn-primary btn-freekick" data-dir="CENTER" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; border-radius: 50%; padding: 0;">C</button>
          
          <button class="btn btn-primary btn-freekick" data-dir="TOP_RIGHT" style="position: absolute; top: 10px; right: 10px; width: 40px; height: 40px; border-radius: 50%; padding: 0;">TR</button>
          <button class="btn btn-primary btn-freekick" data-dir="BOTTOM_RIGHT" style="position: absolute; bottom: 10px; right: 10px; width: 40px; height: 40px; border-radius: 50%; padding: 0;">BR</button>
        </div>
      `;
    } else {
      const logs = minigame.matchLogs.map(log => `<p>${log}</p>`).join("");
      if (minigame.status === "WON") {
        html += `
          <div class="alert success" style="margin-bottom: 20px;">
            <h3>⚽ ¡GOLAZO AL ÁNGULO!</h3>
            ${logs}
          </div>
        `;
      } else {
        html += `
          <div class="alert danger" style="margin-bottom: 20px;">
            <h3>❌ ¡ATAJÓ EL ARQUERO / BARRERA!</h3>
            ${logs}
          </div>
        `;
      }
      
      html += `
        <button class="btn btn-primary" id="btn-narrative-continue">
          Continuar
        </button>
      `;
    }

    html += `
        </div>
      </div>
    `;
    return html;
  }

  bindEvents(state) {
    const minigame = state.activeMinigame;
    
    // Matrix clicks
    const cells = this.container.querySelectorAll(".btn-matrix-cell:not([disabled])");
    cells.forEach(cell => {
      cell.onclick = (e) => {
        const idx = Number(e.currentTarget.getAttribute("data-cell-index"));
        this.deps.cupManager.resolveCupMatrixClick(idx);
      };
    });

    // Penalties clicks
    const penBtns = this.container.querySelectorAll(".btn-penalty");
    penBtns.forEach(btn => {
      btn.onclick = (e) => {
        const dir = e.currentTarget.getAttribute("data-dir");
        if (minigame && minigame.isNarrative) {
          this.stateManager.mutate((s) => {
            if(s.activeMinigame) {
              // Llamamos al nuevo método de la clase
              s.activeMinigame.resolveKick(dir);
              
              if (s.activeMinigame.status === "ELIMINATED") {
                s.player.reputation = Math.max(0, s.player.reputation - 15);
                s.player.addIdolScore(s.currentTeam.id, -10, s.currentTeam.power); 
                s.player.attributes.applyDelta({ definicion: -2, mentalidad: -3 });
              } else if (s.activeMinigame.status === "WON") {
                s.player.reputation = Math.min(100, s.player.reputation + 25);
                s.player.addIdolScore(s.currentTeam.id, 50, s.currentTeam.power); 
                s.player.attributes.applyDelta({ definicion: 2, mentalidad: 3 });
              }
            }
          });
        } else {
          this.deps.cupManager.resolvePenaltyKick(dir);
        }
      };
    });

    // Free Kick clicks
    const freekickBtns = this.container.querySelectorAll(".btn-freekick");
    freekickBtns.forEach(btn => {
      btn.onclick = (e) => {
        const dir = e.currentTarget.getAttribute("data-dir");
        this.stateManager.mutate((s) => {
          if(s.activeMinigame && s.activeMinigame.type === "free_kick") {
             // Llama al método resolveKick que actualiza el estado directamente dentro del minijuego
             s.activeMinigame.resolveKick(dir);
             
             // Castigo / Recompensa básica narrativa
             if (s.activeMinigame.status === "ELIMINATED") {
                s.player.reputation = Math.max(0, s.player.reputation - 5);
                s.player.addIdolScore(s.currentTeam.id, -5, s.currentTeam.power); 
             } else if (s.activeMinigame.status === "WON") {
                s.player.reputation = Math.min(100, s.player.reputation + 15);
                s.player.addIdolScore(s.currentTeam.id, 20, s.currentTeam.power); 
             }
          }
        });
      };
    });

    const btnContCup = this.container.querySelector("#btn-continue-cup");
    if (btnContCup) {
      btnContCup.onclick = () => {
        const s = this.stateManager.getState();
        if (s.player.qualifiedCups && s.player.qualifiedCups.length > 0) {
          this.stateManager.mutate(st => {
            const nextCup = st.player.qualifiedCups.shift();
            st.seasonPhase = nextCup === "copa_argentina" ? "CUP_NATIONAL" : "CUP_INTERNATIONAL";
            const playerStat = st.player.position.getPrimaryStatValue(st.player.attributes);
            st.activeMinigame = MinigameEngine.generateCupMatrix(nextCup, st.player.calculateOVR(), playerStat, st.currentTeam.power);
            st.screen = "CUP_MATCH";
          });
        } else {
          if (this.seasonSimulator) {
            this.deps.seasonSimulator.finishCurrentSeason();
          } else {
            this.stateManager.mutate(st => {
              st.seasonPhase = "SEASON_END";
              st.screen = "DASHBOARD";
            });
          }
        }
      };
    }

    const btnGoPen = this.container.querySelector("#btn-go-penalties");
    if (btnGoPen) {
      btnGoPen.onclick = () => {
         this.stateManager.mutate(s => {
             if(s.activeMinigame) s.activeMinigame.status = "PENALTIES";
         });
      };
    }

    const btnPenCont = this.container.querySelector("#btn-penalties-continue");
    if (btnPenCont) {
      btnPenCont.onclick = () => {
         this.stateManager.mutate(s => {
             if(s.activeMinigame.status === "WON" || s.activeMinigame.status === "ELIMINATED" || s.activeMinigame.status === "PLAYING") {
               if(s.activeMinigame.penaltyShootout) {
                 s.activeMinigame.penaltyShootout = null;
               }
             }
         });
      };
    }

    const btnNarCont = this.container.querySelector("#btn-narrative-continue");
    if (btnNarCont) {
      btnNarCont.onclick = () => {
         this.stateManager.mutate(s => {
            s.activeMinigame = null;
            if (s.activeMidseasonEvent) {
              s.midseasonEventResults.push({ event: s.activeMidseasonEvent, optionIndex: 0, option: s.activeMidseasonEvent.options[0] });
            }
            s.midseasonEventIndex += 1;
            if (s.midseasonEventIndex < s.midseasonEvents.length) {
              s.activeMidseasonEvent = s.midseasonEvents[s.midseasonEventIndex];
              s.seasonPhase = "MIDSEASON_EVENT";
              s.screen = "MIDSEASON";
            } else {
              s.activeMidseasonEvent = null;
              s.seasonPhase = "SEASON_END";
              s.screen = "DASHBOARD";
            }
         });
      };
    }
  }
}
