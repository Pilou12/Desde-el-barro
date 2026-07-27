/**
 * Jerarquía de Clases PositionStrategy (Patrón Strategy - POO)
 * Define las posiciones del fútbol, sus atributos ponderados para el OVR
 * y las fórmulas de simulación de rendimiento por temporada.
 */

export class PositionStrategy {
  constructor(key, number, label, tagline) {
    this.key = key;
    this.number = number;
    this.label = label;
    this.tagline = tagline;
  }

  calculateOVR(attributes) {
    throw new Error("Abstract method calculateOVR must be implemented by subclass.");
  }

  getPrimaryStatValue(attributes) {
    throw new Error("Abstract method getPrimaryStatValue must be implemented by subclass.");
  }

  generateInitialAttributes() {
    throw new Error("Abstract method generateInitialAttributes must be implemented by subclass.");
  }

  simulateSeason(player, team, matches = 32) {
    throw new Error("Abstract method simulateSeason must be implemented by subclass.");
  }
}

export class GoalkeeperPosition extends PositionStrategy {
  constructor() {
    super(
      "arquero",
      1,
      "Arquero",
      "La 1. Los tres palos son tu reino: voladas, achiques y vallas invictas."
    );
  }

  calculateOVR(attr) {
    return Math.round(attr.ref * 0.45 + attr.lid * 0.20 + attr.res * 0.20 + attr.mar * 0.15);
  }

  getPrimaryStatValue(attr) {
    return attr.ref;
  }

  generateInitialAttributes() {
    return { ref: 60, lid: 50, res: 55, mar: 45, def: 35, vel: 40, pot: 45 };
  }

  simulateSeason(player, team, matches = 32) {
    const ovr = player.calculateOVR();
    const teamQuality = 80 - (team.tier - 1) * 8;
    const performanceRatio = (ovr / teamQuality);

    const cleanSheets = Math.max(0, Math.round((matches * 0.35) * performanceRatio + (Math.random() * 4 - 2)));
    const saves = Math.round(matches * 3.5 * performanceRatio + (Math.random() * 15 - 7));
    const goalsConceded = Math.max(8, Math.round(matches * 1.4 / Math.max(0.6, performanceRatio)));
    const rating = Math.min(10, Math.max(4, Number((6.2 + performanceRatio * 1.2 + (cleanSheets * 0.1)).toFixed(2))));

    return {
      matches,
      cleanSheets,
      saves,
      goalsConceded,
      goals: 0,
      assists: 0,
      tackles: Math.round(saves * 0.4),
      keyPasses: Math.round(saves * 0.1),
      rating
    };
  }
}

export class DefenderPosition extends PositionStrategy {
  constructor(key = "defensor_central", number = 2, label = "Defensor Central", tagline = "El 2/6. Firme abajo, invencible arriba y la voz de mando en el fondo.") {
    super(key, number, label, tagline);
  }

  calculateOVR(attr) {
    return Math.round(attr.mar * 0.40 + attr.pot * 0.25 + attr.lid * 0.20 + attr.res * 0.15);
  }

  getPrimaryStatValue(attr) {
    return attr.mar;
  }

  generateInitialAttributes() {
    return { mar: 60, pot: 58, lid: 50, res: 55, def: 40, vel: 45, ref: 35 };
  }

  simulateSeason(player, team, matches = 32) {
    const ovr = player.calculateOVR();
    const teamQuality = 80 - (team.tier - 1) * 8;
    const performanceRatio = (ovr / teamQuality);

    const tackles = Math.round(matches * 3.8 * performanceRatio + (Math.random() * 10 - 5));
    const aerialsWon = Math.round(matches * 2.5 * performanceRatio + (Math.random() * 8 - 4));
    const goals = Math.max(0, Math.round((player.attributes.pot / 30) * Math.random() * 3));
    const assists = Math.max(0, Math.round(Math.random() * 2));
    const rating = Math.min(10, Math.max(4, Number((6.0 + performanceRatio * 1.3 + (tackles * 0.02)).toFixed(2))));

    return {
      matches,
      tackles,
      aerialsWon,
      cleanSheets: Math.round(matches * 0.3 * performanceRatio),
      goals,
      assists,
      keyPasses: Math.round(assists * 1.5),
      rating
    };
  }
}

export class FullbackPosition extends PositionStrategy {
  constructor(key = "lateral", number = 4, label = "Lateral Izquierdo/Derecho", tagline = "El 3/4. Despliegue físico, cierre de banda y proyección constante hasta el fondo.") {
    super(key, number, label, tagline);
  }

  calculateOVR(attr) {
    return Math.round(attr.vel * 0.35 + attr.mar * 0.30 + attr.res * 0.20 + attr.pot * 0.15);
  }

  getPrimaryStatValue(attr) {
    return attr.vel;
  }

  generateInitialAttributes() {
    return { vel: 62, mar: 55, res: 58, pot: 52, def: 42, lid: 45, ref: 35 };
  }

  simulateSeason(player, team, matches = 32) {
    const ovr = player.calculateOVR();
    const teamQuality = 80 - (team.tier - 1) * 8;
    const performanceRatio = (ovr / teamQuality);

    const tackles = Math.round(matches * 3.2 * performanceRatio);
    const assists = Math.max(0, Math.round((player.attributes.vel / 25) * performanceRatio * (Math.random() * 4)));
    const goals = Math.max(0, Math.round(Math.random() * 2));
    const keyPasses = Math.round(assists * 2.2 + 8);
    const rating = Math.min(10, Math.max(4, Number((6.1 + performanceRatio * 1.2 + (assists * 0.15)).toFixed(2))));

    return {
      matches,
      tackles,
      assists,
      goals,
      keyPasses,
      cleanSheets: Math.round(matches * 0.28 * performanceRatio),
      rating
    };
  }
}

export class MidfielderPosition extends PositionStrategy {
  constructor(key = "mediocampista", number = 5, label = "Mediocampista Central / 5", tagline = "El 5/8. El pulmón y termómetro del equipo: recuperación, equilibrio y primer pase.") {
    super(key, number, label, tagline);
  }

  calculateOVR(attr) {
    return Math.round(attr.mar * 0.30 + attr.lid * 0.30 + attr.res * 0.25 + attr.pot * 0.15);
  }

  getPrimaryStatValue(attr) {
    return Math.max(attr.mar, attr.lid);
  }

  generateInitialAttributes() {
    return { mar: 56, lid: 56, res: 60, pot: 52, def: 48, vel: 50, ref: 35 };
  }

  simulateSeason(player, team, matches = 32) {
    const ovr = player.calculateOVR();
    const teamQuality = 80 - (team.tier - 1) * 8;
    const performanceRatio = (ovr / teamQuality);

    const tackles = Math.round(matches * 4.2 * performanceRatio);
    const keyPasses = Math.round(matches * 1.8 * performanceRatio);
    const assists = Math.max(0, Math.round(keyPasses * 0.25 + (Math.random() * 3 - 1)));
    const goals = Math.max(0, Math.round((player.attributes.def / 35) * performanceRatio * (Math.random() * 4)));
    const rating = Math.min(10, Math.max(4, Number((6.3 + performanceRatio * 1.25 + (tackles * 0.015)).toFixed(2))));

    return {
      matches,
      tackles,
      keyPasses,
      assists,
      goals,
      cleanSheets: Math.round(matches * 0.25 * performanceRatio),
      rating
    };
  }
}

export class WingerPosition extends PositionStrategy {
  constructor(key = "extremo", number = 7, label = "Extremo / Volante por Banda", tagline = "El 7/11. Velocidad pura, gambeta endiablada, centros venenosos y llegada al gol.") {
    super(key, number, label, tagline);
  }

  calculateOVR(attr) {
    return Math.round(attr.vel * 0.40 + attr.pot * 0.30 + attr.def * 0.20 + attr.res * 0.10);
  }

  getPrimaryStatValue(attr) {
    return attr.vel;
  }

  generateInitialAttributes() {
    return { vel: 65, pot: 60, def: 52, res: 54, lid: 44, mar: 38, ref: 35 };
  }

  simulateSeason(player, team, matches = 32) {
    const ovr = player.calculateOVR();
    const teamQuality = 80 - (team.tier - 1) * 8;
    const performanceRatio = (ovr / teamQuality);

    const assists = Math.max(1, Math.round((player.attributes.pot / 18) * performanceRatio + (Math.random() * 4 - 2)));
    const goals = Math.max(0, Math.round((player.attributes.def / 20) * performanceRatio + (Math.random() * 5 - 2)));
    const keyPasses = Math.round(assists * 2.5 + 10);
    const tackles = Math.round(matches * 1.1);
    const rating = Math.min(10, Math.max(4, Number((6.2 + performanceRatio * 1.3 + ((goals + assists) * 0.08)).toFixed(2))));

    return {
      matches,
      goals,
      assists,
      keyPasses,
      tackles,
      rating
    };
  }
}

export class PlaymakerPosition extends PositionStrategy {
  constructor(key = "enganche", number = 10, label = "Enganche", tagline = "La 10. El cerebro: pausa, tiro libre y la asistencia precisa que rompe defensas.") {
    super(key, number, label, tagline);
  }

  calculateOVR(attr) {
    return Math.round(attr.def * 0.35 + attr.lid * 0.35 + attr.pot * 0.20 + attr.vel * 0.10);
  }

  getPrimaryStatValue(attr) {
    return Math.max(attr.def, attr.lid);
  }

  generateInitialAttributes() {
    return { def: 58, lid: 60, pot: 55, vel: 48, res: 50, mar: 36, ref: 35 };
  }

  simulateSeason(player, team, matches = 32) {
    const ovr = player.calculateOVR();
    const teamQuality = 80 - (team.tier - 1) * 8;
    const performanceRatio = (ovr / teamQuality);

    const assists = Math.max(2, Math.round((player.attributes.lid / 15) * performanceRatio + (Math.random() * 5 - 2)));
    const goals = Math.max(1, Math.round((player.attributes.def / 22) * performanceRatio + (Math.random() * 4 - 2)));
    const keyPasses = Math.round(assists * 2.8 + 12);
    const tackles = Math.round(matches * 0.8);
    const rating = Math.min(10, Math.max(4, Number((6.3 + performanceRatio * 1.35 + ((goals + assists) * 0.09)).toFixed(2))));

    return {
      matches,
      assists,
      goals,
      keyPasses,
      tackles,
      rating
    };
  }
}

export class StrikerPosition extends PositionStrategy {
  constructor(key = "delantero", number = 9, label = "Delantero Centro", tagline = "La 9. Vivís del gol: potencia, cabezazo y el área como tu hábitat natural.") {
    super(key, number, label, tagline);
  }

  calculateOVR(attr) {
    return Math.round(attr.def * 0.45 + attr.pot * 0.25 + attr.vel * 0.20 + attr.lid * 0.10);
  }

  getPrimaryStatValue(attr) {
    return attr.def;
  }

  generateInitialAttributes() {
    return { def: 62, pot: 58, vel: 55, lid: 42, res: 50, mar: 32, ref: 35 };
  }

  simulateSeason(player, team, matches = 32) {
    const ovr = player.calculateOVR();
    const teamQuality = 80 - (team.tier - 1) * 8;
    const performanceRatio = (ovr / teamQuality);

    const goals = Math.max(2, Math.round((player.attributes.def / 14) * performanceRatio + (Math.random() * 6 - 3)));
    const assists = Math.max(0, Math.round((player.attributes.pot / 28) * (Math.random() * 3)));
    const keyPasses = Math.round(assists * 1.8 + 4);
    const tackles = Math.round(matches * 0.5);
    const rating = Math.min(10, Math.max(4, Number((6.2 + performanceRatio * 1.4 + (goals * 0.12)).toFixed(2))));

    return {
      matches,
      goals,
      assists,
      keyPasses,
      tackles,
      rating
    };
  }
}

/**
 * Factory POO para instanciar estrategias de posición.
 */
export class PositionFactory {
  static create(key) {
    switch (key) {
      case "arquero": return new GoalkeeperPosition();
      case "defensor_central_izq": return new DefenderPosition("defensor_central_izq", 2, "Defensor Central Izquierdo (DFI)", "El 2. Caño, marca ruda y solvencia en el fondo.");
      case "defensor_central_der": return new DefenderPosition("defensor_central_der", 6, "Defensor Central Derecho (DFD)", "El 6. Salida limpia con los pies y fortaleza aérea.");
      case "lateral_izquierdo": return new FullbackPosition("lateral_izquierdo", 3, "Lateral Izquierdo (LI)", "El 3. Zurda para cerrar y proyectarse al ataque.");
      case "lateral_derecho": return new FullbackPosition("lateral_derecho", 4, "Lateral Derecho (LD)", "El 4. Despliegue de ida y vuelta por la banda derecha.");
      case "mediocampista_defensivo": return new MidfielderPosition("mediocampista_defensivo", 5, "5 de Marca / Pivote (MCD)", "El 5. Quites rasantes y equilibrio defensivo.");
      case "mediocampista_central": return new MidfielderPosition("mediocampista_central", 8, "Volante Mixto / Interno (MC)", "El 8. Dinámica, llegada al área rival y distribución.");
      case "enganche": return new PlaymakerPosition();
      case "extremo_izquierdo": return new WingerPosition("extremo_izquierdo", 11, "Extremo Izquierdo (EI)", "El 11. Desborde, enganche hacia adentro y remate.");
      case "extremo_derecho": return new WingerPosition("extremo_derecho", 7, "Extremo Derecho (ED)", "El 7. Velocidad pura y centros rasantes.");
      case "delantero":
      default:
        return new StrikerPosition();
    }
  }

  static getAllPositions() {
    return [
      new GoalkeeperPosition(),
      new DefenderPosition("defensor_central_izq", 2, "Defensor Central Izquierdo (DFI)"),
      new DefenderPosition("defensor_central_der", 6, "Defensor Central Derecho (DFD)"),
      new FullbackPosition("lateral_izquierdo", 3, "Lateral Izquierdo (LI)"),
      new FullbackPosition("lateral_derecho", 4, "Lateral Derecho (LD)"),
      new MidfielderPosition("mediocampista_defensivo", 5, "5 de Marca / Pivote (MCD)"),
      new MidfielderPosition("mediocampista_central", 8, "Volante Mixto / Interno (MC)"),
      new PlaymakerPosition(),
      new WingerPosition("extremo_izquierdo", 11, "Extremo Izquierdo (EI)"),
      new WingerPosition("extremo_derecho", 7, "Extremo Derecho (ED)"),
      new StrikerPosition()
    ];
  }
}
