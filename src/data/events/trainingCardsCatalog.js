/**
 * Catálogo Extensible de Cartas de Entrenamiento por Posición
 */
export const TRAINING_CARDS_CATALOG = [
  // --- ARQUERO ---
  {
    id: "arq-mano-a-mano",
    positions: ["arquero"],
    name: "Mano a mano con el 9",
    rarity: "comun",
    copyText: "Le achicás los ángulos al delantero en cada práctica hasta que no encuentra arco.",
    delta: { ref: 3, res: 1 }
  },
  {
    id: "arq-voladas-angulo",
    positions: ["arquero"],
    name: "Voladas al ángulo lejano",
    rarity: "rara",
    copyText: "Tiros libres directos a la escuadra. Volás de palo a palo hasta sacarlas todas.",
    delta: { ref: 4, lid: 1 }
  },
  {
    id: "arq-corta-centros",
    positions: ["arquero"],
    name: "Salida a cortar centros",
    rarity: "comun",
    copyText: "Dominás el área chica de noche bajo los reflectores. Puños firmes y voz de mando.",
    delta: { lid: 3, ref: 1 }
  },

  // --- DEFENSOR CENTRAL ---
  {
    id: "def-choque-tanques",
    positions: ["defensor_central"],
    name: "Choque contra los tanques",
    rarity: "comun",
    copyText: "Cuerpo a cuerpo contra los 9 más pesados del plantel. Salís hecho de fierro.",
    delta: { mar: 3, pot: 2 }
  },
  {
    id: "def-cruce-al-piso",
    positions: ["defensor_central"],
    name: "Cruce salvaje al piso",
    rarity: "rara",
    copyText: "Barridas quirúrgicas a la pelota antes de que el delantero saque el remate.",
    delta: { mar: 4, vel: 1 }
  },
  {
    id: "def-cabezazo-area",
    positions: ["defensor_central"],
    name: "Impulso y salto en las dos áreas",
    rarity: "comun",
    copyText: "Despejás todas en el fondo y vas a buscar el gol de cabeza en los tiros de esquina.",
    delta: { pot: 3, def: 1 }
  },

  // --- LATERAL ---
  {
    id: "lat-ida-vuelta",
    positions: ["lateral"],
    name: "El ida y vuelta en la banda",
    rarity: "comun",
    copyText: "Sprints continuos de área a área. La banda es tuya durante los noventa minutos.",
    delta: { vel: 3, res: 2 }
  },
  {
    id: "lat-centros-carrera",
    positions: ["lateral"],
    name: "Centros venenosos a la carrera",
    rarity: "rara",
    copyText: "Llegás hasta la línea de fondo a máxima velocidad y ponés la pelota en la cabeza del 9.",
    delta: { vel: 3, pot: 3 }
  },

  // --- MEDIOCAMPISTA CENTRAL (5) ---
  {
    id: "med-trabar-cabeza",
    positions: ["mediocampista"],
    name: "Trabar con la cabeza en el medio",
    rarity: "comun",
    copyText: "En el círculo central no se negocia la intensidad. Recuperás y tocás de primera.",
    delta: { mar: 3, lid: 2 }
  },
  {
    id: "med-primer-pase",
    positions: ["mediocampista"],
    name: "Salida limpia y primer pase",
    rarity: "rara",
    copyText: "Entre los dos centrales, bajás a recibir con la cancha de frente y distribuís el juego.",
    delta: { lid: 4, mar: 2 }
  },

  // --- EXTREMO ---
  {
    id: "ext-gambeta-corta",
    positions: ["extremo"],
    name: "Gambeta corta pegada a la raya",
    rarity: "comun",
    copyText: "Frenás en seco, dejás descolocado al lateral y tirás el centro atrás.",
    delta: { vel: 3, pot: 2 }
  },
  {
    id: "ext-diagonal-gol",
    positions: ["extremo"],
    name: "Diagonal punzante al segundo palo",
    rarity: "rara",
    copyText: "Arrancás bien abierto y te metés al área a la espalda del marcador para definir.",
    delta: { vel: 4, def: 2 }
  },

  // --- ENGANCHE (10) ---
  {
    id: "eng-pase-gol",
    positions: ["enganche"],
    name: "El pase entre líneas",
    rarity: "comun",
    copyText: "Ves huecos donde nadie más ve nada. Filtrás la pelota con un toque sutil.",
    delta: { lid: 3, def: 2 }
  },
  {
    id: "eng-tiro-libre",
    positions: ["enganche"],
    name: "Especialista en pelota parada",
    rarity: "rara",
    copyText: "Pateás cincuenta tiros libres al ángulo sobre la barrera humana.",
    delta: { def: 4, lid: 2 }
  },

  // --- DELANTERO CENTRO (9) ---
  {
    id: "del-mano-a-mano",
    positions: ["delantero"],
    name: "Mano a mano con el arquero",
    rarity: "comun",
    copyText: "Definición mano a mano hasta que la pelota entra junto al palo.",
    delta: { def: 3, pot: 1 }
  },
  {
    id: "del-olfato-area",
    positions: ["delantero"],
    name: "Olfato de gol en el rebote",
    rarity: "rara",
    copyText: "Aparecés donde va a caer la pelota suelta antes que cualquier defensor.",
    delta: { def: 4, vel: 2 }
  },

  // --- UNIVERSALES (APLICAN A CUALQUIER POSICIÓN) ---
  {
    id: "gen-cinta-gym",
    positions: ["todos"],
    name: "La cinta del gimnasio",
    rarity: "comun",
    copyText: "Una hora de cinta antes de que abra el club. El cuerpo responde siempre.",
    delta: { res: 3 }
  },
  {
    id: "gen-mesa-capitanes",
    positions: ["todos"],
    name: "La mesa de capitanes",
    rarity: "comun",
    copyText: "Los referentes del vestuario te invitan a su mesa. Te hiciste escuchar.",
    delta: { lid: 3 }
  },
  {
    id: "gen-pretemporada-altura",
    positions: ["todos"],
    name: "Pretemporada exigente",
    rarity: "rara",
    copyText: "Doble turno con el preparador físico bajo el sol de verano.",
    delta: { vel: 2, res: 3 }
  }
];
