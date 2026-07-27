/**
 * Clase EventCard (POO)
 * Modela una carta de entrenamiento o evento con efectos sobre el jugador.
 */
export class EventCard {
  constructor({ id, positions = ["todos"], name, rarity = "comun", copyText, delta = {}, minAge = 16, maxAge = 40 }) {
    this.id = id;
    this.positions = positions;
    this.name = name;
    this.rarity = rarity; // comun, rara, dorada
    this.copyText = copyText;
    this.delta = delta;
    this.minAge = minAge;
    this.maxAge = maxAge;
  }

  // Mapa de familia de posición: los catálogos usan claves cortas, los jugadores usan claves completas
  static _POSITION_FAMILY = {
    "arquero":              "arquero",
    "defensor_central_izq": "defensor_central",
    "defensor_central_der": "defensor_central",
    "lateral_izquierdo":    "lateral",
    "lateral_derecho":      "lateral",
    "mediocampista_defensivo": "mediocampista",
    "mediocampista_central":   "mediocampista",
    "enganche":             "enganche",
    "extremo_izquierdo":    "extremo",
    "extremo_derecho":      "extremo",
    "delantero":            "delantero",
    "segundo_delantero":    "delantero",
  };

  isEligibleForPlayer(player) {
    if (player.age < this.minAge || player.age > this.maxAge) return false;
    if (this.positions.includes("todos")) return true;
    // Chequeo exacto (por si alguien usa la clave completa)
    if (this.positions.includes(player.position.key)) return true;
    // Chequeo por familia de posición
    const family = EventCard._POSITION_FAMILY[player.position.key];
    if (family && this.positions.includes(family)) return true;
    return false;
  }

  getFormattedDeltas() {
    const labelsMap = {
      def: "Definición",
      vel: "Velocidad",
      pot: "Potencia",
      lid: "Liderazgo",
      mar: "Marca",
      ref: "Reflejos",
      res: "Resistencia"
    };

    const result = [];
    for (const [key, val] of Object.entries(this.delta)) {
      if (val !== 0) {
        const sign = val > 0 ? "+" : "";
        const label = labelsMap[key] || key.toUpperCase();
        result.push({ key, label, text: `${sign}${val} ${label}`, val });
      }
    }
    return result;
  }

  applyEffect(player) {
    player.attributes.applyDelta(this.delta);
  }
}
