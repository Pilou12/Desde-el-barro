import { Team } from "./Team.js";

/**
 * Clase que representa a una Selección Nacional.
 * Hereda de Team, pero sobreescribe la lógica de escudos para evitar llamadas
 * a la API de clubes y garantizar que siempre se utilicen las banderas del país.
 */
export class NationalTeam extends Team {
  constructor(config) {
    super({
      ...config,
      apiId: null, // Forzamos a null para que no tome el ID 435 por defecto
      country: "international",
      rivals: []
    });
    
    this.isNational = true;
    this.hasRealApiId = false; // Ignora los CDNs de API-Football
  }

  /**
   * Sobreescribe el método de la clase padre.
   * Una selección solo retorna las URLs de su bandera configurada.
   */
  getLogoUrls() {
    return this.customLogoUrls || [];
  }
}
