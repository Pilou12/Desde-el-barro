import { Attributes } from "./Attributes.js";
import { PositionFactory } from "./positions/PositionStrategy.js";

/**
 * Clase Player (POO)
 * Representa al futbolista protagonista, sus atributos, posición, contrato,
 * historial de estadísticas y métricas de reputación e ídolo.
 */
export class Player {
  constructor({ name, positionKey = "delantero", initialAge = 16 }) {
    this.name = name;
    this.position = PositionFactory.create(positionKey);
    this.age = initialAge;
    
    // Atributos iniciales según posición
    const baseAttrs = this.position.generateInitialAttributes();
    this.attributes = new Attributes(baseAttrs);

    // Métricas de Carrera
    this.reputation = 20; // 0 - 100
    this.clubIdolScores = {}; // Mapa de teamId -> porcentaje (0 - 100)
    this.exposure = 0;    // 0 - 100: qué tanto te conoce el mundo fútbolístico fuera de tu liga
    this.bankBalance = 15000; // USD
    this.seasonsHistory = [];
    this.trophies = [];
    this.isRetired = false;
    this.purchasedItems = []; // Registro de items de la tienda comprados
  }

  calculateOVR() {
    return this.position.calculateOVR(this.attributes);
  }

  applyTraining(eventCard) {
    eventCard.applyEffect(this);
  }

  getIdolScore(teamId) {
    return this.clubIdolScores[teamId] || 0;
  }

  addIdolScore(teamId, amount, teamPower = 60) {
    let finalAmount = amount;
    if (amount > 0) {
      // Escalado por dificultad: a mayor power, menor es el multiplicador.
      // Formula: (110 - teamPower) / 50. Ej: Power 60 -> x1.0, Power 90 -> x0.4, Power 40 -> x1.4
      const multiplier = Math.max(0.1, (110 - teamPower) / 50);
      finalAmount = Math.round(amount * multiplier);
    }
    const current = this.getIdolScore(teamId);
    this.clubIdolScores[teamId] = Math.min(100, Math.max(0, current + finalAmount));
  }

  addSeasonRecord(seasonRecord) {
    this.seasonsHistory.push(seasonRecord);
    this.age += 1;

    // --- Sueldo anual basado en wageBudget del equipo ---
    const ovr = this.calculateOVR();
    const tierCap = { 1: 95, 2: 80, 3: 70, 4: 60 };
    const cap = tierCap[seasonRecord.teamTier] ?? 70;
    const performanceFactor = Math.min(1, Math.max(0.1, (ovr - (cap * 0.6)) / (cap * 0.4)));
    const yearSalary = Math.round((seasonRecord.teamWageBudget ?? 1000) * performanceFactor);
    this.bankBalance += yearSalary;

    // Reputación según rendimiento (con amortiguador si sos ídolo)
    let repDelta = Math.round((seasonRecord.rating - 6) * 4);
    if (repDelta < 0) {
      const currentIdol = this.getIdolScore(seasonRecord.teamId);
      if (currentIdol >= 50) {
        // La hinchada te perdona: la caída de reputación mundial es menor porque no hay tanto escándalo local
        repDelta = Math.round(repDelta / 2);
      }
    }
    this.reputation = Math.min(100, Math.max(0, this.reputation + repDelta));

    // Ídolo: sube por estadísticas en el club actual
    const statsIdolGain = Math.round(seasonRecord.goals * 0.25 + seasonRecord.assists * 0.2);
    this.addIdolScore(seasonRecord.teamId, statsIdolGain);

    // Decaimiento natural del ídolo en el club actual: si no salís campeón, baja
    if (!seasonRecord.wonTitle) {
      const currentIdol = this.getIdolScore(seasonRecord.teamId);
      const idolDecay = Math.max(2, Math.round(currentIdol * 0.08));
      this.addIdolScore(seasonRecord.teamId, -idolDecay);
    }

    // Retiro dinámico basado en Resistencia Física (res)
    // 40 res = 34 años
    // 65 res = 37 años
    // 90 res = 40 años
    const retireAge = 34 + Math.floor((this.attributes.res - 40) / 8);
    if (this.age >= retireAge) {
      this.isRetired = true;
    }
  }

  getCareerTotals() {
    return this.seasonsHistory.reduce((acc, curr) => {
      acc.matches += curr.matches || 0;
      acc.goals += curr.goals || 0;
      acc.assists += curr.assists || 0;
      acc.tackles += curr.tackles || 0;
      acc.cleanSheets += curr.cleanSheets || 0;
      acc.saves += curr.saves || 0;
      return acc;
    }, { matches: 0, goals: 0, assists: 0, tackles: 0, cleanSheets: 0, saves: 0 });
  }

  hasItem(itemId) {
    return this.purchasedItems.includes(itemId);
  }

  buyItem(item) {
    if (this.bankBalance >= item.price && !this.hasItem(item.id)) {
      this.bankBalance -= item.price;
      this.purchasedItems.push(item.id);
      
      // Efectos inmediatos
      if (item.id === "gimnasio_alta_tecnologia") {
        this.attributes.applyDelta({ ref: 3, mar: 3, def: 3, vel: 3, pot: 3, lid: 3, res: 3 });
      }
      return true;
    }
    return false;
  }
}
