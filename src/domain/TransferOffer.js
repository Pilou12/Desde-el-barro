/**
 * Clase TransferOffer (POO)
 * Modela una oferta concreta de transferencia emitida por un club.
 */
export class TransferOffer {
  constructor({ team, league, monthlySalary, contractYears = 2, signingBonus = 0 }) {
    this.team = team;
    this.league = league;
    this.monthlySalary = monthlySalary;
    this.contractYears = contractYears;
    this.signingBonus = signingBonus;
  }

  getFormattedSalary() {
    return `$${this.monthlySalary.toLocaleString()} USD / mes`;
  }

  getFormattedBonus() {
    return `$${this.signingBonus.toLocaleString()} USD`;
  }
}
