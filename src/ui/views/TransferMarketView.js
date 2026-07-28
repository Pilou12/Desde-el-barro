import { View } from './View.js';
import { ARGENTINE_LEAGUES } from '../../data/leagues/argLeaguesData.js';
import { STORE_ITEMS, getStoreItemById } from '../../domain/StoreCatalog.js';
import { PositionFactory } from '../../domain/positions/PositionStrategy.js';
import { SeasonNarrator } from '../../domain/SeasonNarrator.js';

export class TransferMarketView extends View {
  getTemplate() {
    const offers = this.state.currentTransferOffers;
    
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
          <span style="color: var(--accent-gold); font-weight: 800; font-size: 0.8rem; text-transform: uppercase;">💼 Mercado de Pases ${this.state.currentYear}</span>
          <h2 style="font-family: var(--font-heading); margin-top: 2px;">Ofertas de Transferencia Recibidas</h2>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">
            Tus buenas actuaciones despertaron el interés de los siguientes clubes. Podés firmar con uno o renovar en tu equipo actual:
          </p>

          <div class="transfer-grid">
            ${offersHTML}
          </div>

          <button id="btn-reject-transfers" class="btn-secondary" style="margin-top: 20px; padding: 14px;">
            ❤️ Rechazar todo y Renovar en ${this.state.currentTeam.name} (+10% Ídolo)
          </button>
        </div>
      </div>
    `;
  }

  bindEvents() {
// Aceptar oferta de transferencia
    const acceptBtns = document.querySelectorAll(".btn-accept-transfer");
    acceptBtns.forEach(btn => {
      btn.onclick = (e) => {
        const idx = Number(e.currentTarget.getAttribute("data-offer-index"));
        this.deps.economyManager.acceptTransferOffer(idx);
        this.deps.stateManager.update({screen: "DASHBOARD"});
        this.deps.appRouter.render();
      };
    });

    // Rechazar todas las ofertas de transferencia y renovar
    const btnRejectTransfers = document.getElementById("btn-reject-transfers");
    if (btnRejectTransfers) {
      btnRejectTransfers.onclick = () => {
        this.deps.economyManager.rejectAllTransferOffers();
        this.deps.stateManager.update({screen: "DASHBOARD"});
        this.deps.appRouter.render();
      };
    }
  }
}
