/**
 * Clase Team (POO)
 * Modela un club de fútbol con sus atributos, colores, prestigio y banco múltiple de escudos CDN/Wikimedia reales.
 *
 * Lógica de escudos:
 *  - Si apiId < 10000 → se considera ID real de API-Football; se usan CDNs + customLogoUrls como respaldo.
 *  - Si apiId >= 10000 → ID provisional/inventado; se usan SOLO customLogoUrls (Wikimedia) y,
 *    si no hay ninguno o todos fallan, muestra el fallback de iniciales coloreadas.
 */
export class Team {
  constructor({ id, apiId, name, nickname, tier, country = "ar", colors = ["#000000", "#ffffff"], rivals = [], customLogoUrls = [], wageBudget = null, power = null }) {
    this.id = id;
    this.apiId = apiId || 435; // ID oficial de fútbol (< 10000 = real, >= 10000 = provisional)
    this.name = name;
    this.nickname = nickname || name;
    this.tier = tier; // 1: Top/Primera, 2: B Nacional, 3: B Metro, 4: Primera C
    this.country = country;
    this.colors = colors;
    this.rivals = rivals;
    this.customLogoUrls = customLogoUrls;

    // Presupuesto base anual
    const defaultWageByTier = { 1: 80000, 2: 15000, 3: 4000, 4: 800 };
    this.baseWageBudget = wageBudget ?? (defaultWageByTier[tier] || 1000);
    this.wageBudget = this.baseWageBudget;

    // Rating de Poder del equipo (1-100). Sirve para emular simulaciones de ligas y copas.
    if (power !== null) {
      this.power = power;
    } else {
      // Asignar un power base según el tier y su presupuesto si no se especificó.
      // Ej. tier 1: 65 a 85.
      const basePower = { 1: 72, 2: 60, 3: 50, 4: 40 }[tier] || 40;
      const budgetFactor = Math.min(10, Math.max(0, (this.wageBudget / (defaultWageByTier[tier] || 1000)) * 2));
      this.power = Math.round(basePower + budgetFactor);
    }

    // true si el apiId corresponde a un equipo registrado en API-Football
    this.hasRealApiId = this.apiId < 10000;
  }

  updateTier(newTier) {
    if (newTier < this.tier) {
      // Ascenso: boost de poder
      this.power = Math.min(95, this.power + 5);
    } else if (newTier > this.tier) {
      // Descenso: penalidad de poder
      this.power = Math.max(20, this.power - 5);
    }
    
    this.tier = newTier;
    // Multiplicadores base por tier:
    // Tier 1: 1.0 (100%) - Tier 2: 0.18 (18%) - Tier 3: 0.05 (5%) - Tier 4: 0.01 (1%)
    const tierMultipliers = { 1: 1.0, 2: 0.1875, 3: 0.05, 4: 0.01 };
    const originalMultiplier = tierMultipliers[this.originalTier || newTier] || 0.05;
    const newMultiplier = tierMultipliers[this.tier] || 0.05;
    
    // El nuevo budget es relativo al original, ajustado a la nueva categoría
    const ratio = newMultiplier / originalMultiplier;
    this.wageBudget = Math.round(this.baseWageBudget * ratio);
  }

  addTitleBoost() {
    this.power = Math.min(95, this.power + 2);
  }

  /**
   * Devuelve la lista ordenada de URLs de logo a intentar.
   * - apiId real (<10000): CDNs primero, Wikimedia como respaldo.
   * - apiId provisional (>=10000): solo Wikimedia/customLogoUrls; las CDNs cargarían escudos erróneos.
   */
  getLogoUrls() {
    const hasCustom = this.customLogoUrls && this.customLogoUrls.length > 0;

    if (this.hasRealApiId) {
      // ID real: CDNs primero, Wikimedia después
      const cdnUrls = [
        `https://media.api-sports.io/football/teams/${this.apiId}.png`,
        `https://images.fotmob.com/image_resources/logo/teamlogo/${this.apiId}.png`,
        `https://api.sofascore.app/api/v1/team/${this.apiId}/image`
      ];
      return hasCustom ? [...cdnUrls, ...this.customLogoUrls] : cdnUrls;
    }

    // ID provisional: solo Wikimedia (customLogoUrls)
    if (hasCustom) {
      return [...this.customLogoUrls];
    }

    // Sin ningún logo verificado → array vacío, se mostrará el fallback de iniciales
    return [];
  }

  renderCrestHTML(size = 48) {
    const urls = this.getLogoUrls();
    const c1 = this.colors[0] || "#111";
    const c2 = this.colors[1] || "#fff";
    const initials = this.name.substring(0, 2).toUpperCase();

    const fallbackStyle = [
      `display: none`,
      `width: ${size}px`,
      `height: ${size}px`,
      `border-radius: 12px`,
      `background: linear-gradient(135deg, ${c1} 50%, ${c2} 50%)`,
      `align-items: center`,
      `justify-content: center`,
      `font-weight: 900`,
      `color: #fff`,
      `font-size: ${Math.max(10, Math.round(size * 0.38))}px`,
      `border: 2px solid rgba(255,255,255,0.4)`,
      `box-shadow: 0 4px 10px rgba(0,0,0,0.5)`
    ].join("; ");

    if (!urls.length) {
      // Sin URLs disponibles → mostrar iniciales directamente
      return `
        <div style="position: relative; width: ${size}px; height: ${size}px; display: inline-flex; align-items: center; justify-content: center;">
          <div style="${fallbackStyle.replace('display: none', 'display: flex')}">${initials}</div>
        </div>
      `;
    }

    // onerror en cascada: intenta cada URL del array y al agotar muestra las iniciales
    const urlsJson = JSON.stringify(urls);
    const onerrorScript = `(function(el){var urls=${urlsJson};var i=parseInt(el.dataset.fi||0)+1;if(i<urls.length){el.dataset.fi=i;el.src=urls[i];}else{el.style.display='none';var fb=el.nextElementSibling;if(fb)fb.style.display='flex';}})(this)`;

    return `
      <div style="position: relative; width: ${size}px; height: ${size}px; display: inline-flex; align-items: center; justify-content: center;">
        <img src="${urls[0]}" alt="${this.name}" width="${size}" height="${size}" 
             style="object-fit: contain; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.6)); max-width: 100%; max-height: 100%;" 
             onerror="${onerrorScript}" />
        <div style="${fallbackStyle}">${initials}</div>
      </div>
    `;
  }
}
