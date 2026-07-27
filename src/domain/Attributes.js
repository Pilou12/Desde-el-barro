/**
 * Clase Attributes (POO)
 * Modela los atributos cuantificables del jugador con límites y cálculos de variación.
 */
export class Attributes {
  constructor(initialValues = {}) {
    this.def = initialValues.def ?? 50; // Definición / Pegada / Remate
    this.vel = initialValues.vel ?? 50; // Velocidad / Aceleración
    this.pot = initialValues.pot ?? 50; // Potencia / Fuerza / Gambeta
    this.lid = initialValues.lid ?? 50; // Liderazgo / Visión de Juego
    this.mar = initialValues.mar ?? 50; // Marca / Quites / Intercepción
    this.ref = initialValues.ref ?? 50; // Reflejos / Atajadas (para Arqueros)
    this.res = initialValues.res ?? 50; // Resistencia / Estado Físico
  }

  static clamp(value, min = 35, max = 99) {
    return Math.max(min, Math.min(max, Math.round(value)));
  }

  applyDelta(delta = {}) {
    if (delta.def !== undefined) this.def = Attributes.clamp(this.def + delta.def);
    if (delta.vel !== undefined) this.vel = Attributes.clamp(this.vel + delta.vel);
    if (delta.pot !== undefined) this.pot = Attributes.clamp(this.pot + delta.pot);
    if (delta.lid !== undefined) this.lid = Attributes.clamp(this.lid + delta.lid);
    if (delta.mar !== undefined) this.mar = Attributes.clamp(this.mar + delta.mar);
    if (delta.ref !== undefined) this.ref = Attributes.clamp(this.ref + delta.ref);
    if (delta.res !== undefined) this.res = Attributes.clamp(this.res + delta.res);
  }

  getFormattedList(positionKey = "delantero") {
    const isGK = positionKey === "arquero";

    const list = [
      { key: "def", label: isGK ? "Saque / Remate" : "Definición / Pegada", val: this.def },
      { key: "vel", label: "Velocidad / Aceleración", val: this.vel },
      { key: "pot", label: isGK ? "Salidas / Potencia" : "Potencia / Gambeta", val: this.pot },
      { key: "lid", label: "Liderazgo / Visión", val: this.lid },
      { key: "mar", label: isGK ? "Ubicación" : "Marca / Quites", val: this.mar },
      { key: "res", label: "Resistencia Física", val: this.res }
    ];

    if (isGK) {
      list.unshift({ key: "ref", label: "Reflejos / Atajadas", val: this.ref });
    }

    return list;
  }

  clone() {
    return new Attributes({
      def: this.def,
      vel: this.vel,
      pot: this.pot,
      lid: this.lid,
      mar: this.mar,
      ref: this.ref,
      res: this.res
    });
  }
}
