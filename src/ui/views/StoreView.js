import { View } from './View.js';
import { ARGENTINE_LEAGUES } from '../../data/leagues/argLeaguesData.js';
import { STORE_ITEMS, getStoreItemById } from '../../domain/StoreCatalog.js';
import { PositionFactory } from '../../domain/positions/PositionStrategy.js';
import { SeasonNarrator } from '../../domain/SeasonNarrator.js';

export class StoreView extends View {
  getTemplate() {
    const player = this.state.player;
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

  bindEvents() {
const btnBuyStore = document.querySelectorAll(".btn-buy-store");
    btnBuyStore.forEach(btn => {
      btn.onclick = (e) => {
        const itemId = e.currentTarget.getAttribute("data-item-id");
        const item = getStoreItemById(itemId);
        if (item) {
          if (this.deps.economyManager.buyStoreItem(item)) {
            this.deps.appRouter.render(); // Re-render to show purchased status and new balance
          } else {
            alert("No tenés suficiente dinero.");
          }
        }
      };
    });

    const btnBackStore = document.getElementById("btn-back-store");
    if (btnBackStore) {
      btnBackStore.onclick = () => {
        this.deps.stateManager.update({screen: "DASHBOARD"});
        this.deps.appRouter.render();
      };
    }
  }
}
