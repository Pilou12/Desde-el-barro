import { View } from './View.js';
import { Player } from '../../domain/Player.js';
import { Team } from '../../domain/Team.js';
import { MatrixMinigame } from '../../domain/minigames/MatrixMinigame.js';

export class DebugMenuView extends View {
  getTemplate() {
    return `
      <div class="glass-card" style="max-width: 600px; margin: 40px auto; text-align: center;">
        <h2 style="color: #ff4d4d; font-family: var(--font-heading); margin-bottom: 8px;">🛠 Menú de Debug (Oculto)</h2>
        <p style="color: var(--text-secondary); margin-bottom: 24px;">Esta pantalla permite probar rápidamente minijuegos y torneos inyectando datos falsos. No usar en la versión de producción.</p>
        
        <div style="display: flex; flex-direction: column; gap: 12px; max-width: 400px; margin: 0 auto;">
          <button id="btn-dbg-libertadores" class="btn-primary" style="background: linear-gradient(45deg, #001f3f, #003366); border: 1px solid #ffcc00;">Test Copa Libertadores</button>
          <button id="btn-dbg-sudamericana" class="btn-primary" style="background: linear-gradient(45deg, #333, #666); border: 1px solid silver;">Test Copa Sudamericana</button>
          <button id="btn-dbg-recopa" class="btn-primary" style="background: linear-gradient(45deg, #660000, #cc0000); border: 1px solid #ff9999;">Test Recopa (Penales)</button>
          <button id="btn-dbg-america" class="btn-primary" style="background: linear-gradient(45deg, #004d00, #009900); border: 1px solid #ccffcc;">Test Copa América</button>
          <button id="btn-dbg-argentina" class="btn-primary" style="background: linear-gradient(45deg, #003399, #33ccff); border: 1px solid #ffffff;">Test Copa Argentina</button>
          
          <button id="btn-dbg-back" class="btn-secondary" style="margin-top: 24px;">⬅ Volver al Inicio</button>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const startMinigame = (cupType) => {
      this.deps.stateManager.mutate(state => {
        // Objeto de configuración 100% puro y genérico, sin depender de stats o equipos
        const config = {
          cupType: cupType,
          gridSize: 100, // Matriz grande de prueba
          hasGroupStage: cupType !== "recopa",
          requiredWins: 6,
          winCount: 40,
          drawCount: 15,
          hintsCount: 10,
          difficultyLabel: "DEBUG",
          penaltyConfig: {
            totalKicks: 5,
            kicksWithHints: 5 // Todas con pistas
          }
        };

        // Instanciamos el minijuego de forma pura
        state.activeMinigame = new MatrixMinigame(config, false);
        state.activeMinigame.isDebug = true;
        state.screen = "CUP_MATCH";
      });
      this.deps.appRouter.render();
    };

    const bindButton = (id, cupType) => {
      const btn = document.getElementById(id);
      if (btn) btn.onclick = () => startMinigame(cupType);
    };

    bindButton("btn-dbg-libertadores", "libertadores");
    bindButton("btn-dbg-sudamericana", "sudamericana");
    bindButton("btn-dbg-recopa", "recopa");
    bindButton("btn-dbg-america", "copa_america");
    bindButton("btn-dbg-argentina", "copa_argentina");

    const btnBack = document.getElementById("btn-dbg-back");
    if (btnBack) {
      btnBack.onclick = () => {
        this.deps.stateManager.update({ screen: "START_MENU" });
        this.deps.appRouter.render();
      };
    }
  }
}
