import { EventCard } from "./EventCard.js";
import { TRAINING_CARDS_CATALOG } from "../data/events/trainingCardsCatalog.js";
import { CAREER_EVENTS_CATALOG } from "../data/events/careerEventsCatalog.js";

/**
 * Clase EventManager (POO)
 * Carga los catálogos de datos y procesa la selección de eventos/cartas para el jugador.
 */
export class EventManager {
  constructor() {
    this.trainingCards = TRAINING_CARDS_CATALOG.map(cardData => new EventCard(cardData));
    this.careerEvents = CAREER_EVENTS_CATALOG;
  }

  getTrainingCardsForPlayer(player, count = 3) {
    const eligible = this.trainingCards.filter(card => card.isEligibleForPlayer(player));
    
    // Mezclar copias elegibles
    const shuffled = [...eligible].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  getSeasonEventsForPlayer(player, currentTeam, count = null) {
    const ovr = player.calculateOVR();
    const eligible = this.careerEvents.filter(event => {
      if (event.minAge && player.age < event.minAge) return false;
      if (event.maxAge && player.age > event.maxAge) return false;
      if (event.minTier && currentTeam.tier < event.minTier) return false;
      if (event.minOvr && ovr < event.minOvr) return false;
      
      const currentIdol = player.getIdolScore(currentTeam.id);
      if (event.minIdol !== undefined && currentIdol < event.minIdol) return false;
      if (event.maxIdol !== undefined && currentIdol > event.maxIdol) return false;

      return true;
    });

    if (!eligible.length) return [];

    // Cantidad aleatoria entre 1 y 2, limitada por los disponibles
    const numEvents = count ?? (Math.random() < 0.5 ? 1 : 2);
    const shuffled = [...eligible].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(numEvents, shuffled.length));
  }

  // Alias para compatibilidad inversa — devuelve un solo evento
  getSeasonEventForPlayer(player, currentTeam) {
    const events = this.getSeasonEventsForPlayer(player, currentTeam, 1);
    return events[0] ?? null;
  }
}
