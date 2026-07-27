/**
 * Catálogo Extensible de Eventos y Dilemas de Carrera
 */
export const CAREER_EVENTS_CATALOG = [
  // --- EVENTOS DE ÍDOLO ---
  {
    id: "barra-consejo-idolo",
    positions: ["todos"],
    minIdol: 70, // Solo sale si sos un ídolo total
    title: "👑 Reunión con los referentes",
    description: "Sos un referente indiscutido. La cúpula de la barra brava y la dirigencia te citan para preguntarte qué técnico deberían traer para el próximo torneo.",
    options: [
      {
        text: "Recomendar a un DT ofensivo y moderno",
        action: "RECOMENDAR_OFENSIVO",
        idolBonus: 5,
        famaBonus: 5
      },
      {
        text: "No meterse en decisiones dirigenciales",
        action: "EVITAR_CONFLICTO",
        famaBonus: 2
      }
    ]
  },
  {
    id: "apriete-estacionamiento-resistido",
    positions: ["todos"],
    maxIdol: 10, // Solo sale si te odian o sos intrascendente
    title: "⚠️ Murmullos y apriete",
    description: "La hinchada no te banca. Al salir del entrenamiento, un grupo de hinchas te frena el auto: 'A ver si empezás a transpirar la camiseta porque acá no se jode'.",
    options: [
      {
        text: "Bajar el vidrio y dar la cara (Arriesgado)",
        action: "DAR_LA_CARA",
        idolBonus: 8,
        famaBonus: -2
      },
      {
        text: "Acelerar e irse rápido",
        action: "ESCAPAR",
        idolBonus: -5,
        famaBonus: -5
      }
    ]
  },

  // --- CLÁSICOS Y DERBIES ---
  {
    id: "clasico-titularidad",
    positions: ["todos"],
    minAge: 16,
    maxAge: 38,
    title: "🔥 El Clásico de la Fecha 12",
    description: "Se viene el partido más esperado del año contra tu clásico rival. El DT te agarra en la práctica: 'Necesito que juegues con el alma pero sin hacerte echar'.",
    options: [
      {
        text: "Jugar con máxima intensidad (Posibilidad de gol o roja)",
        action: "PLAY_INTENSE",
        idolBonus: 8,
        famaBonus: 10
      },
      {
        text: "Jugar con la cabeza fría y priorizar el equipo",
        action: "PLAY_SMART",
        idolBonus: 4
      }
    ]
  },

  // --- PRENSA Y ESCÁNDALOS ---
  {
    id: "prensa-declaraciones",
    positions: ["todos"],
    minAge: 17,
    maxAge: 36,
    title: "🎙️ Conferencia de Prensa picante",
    description: "Un periodista te pregunta si creés que el equipo merece estar más arriba y si los arbitrajes los perjudicaron.",
    options: [
      {
        text: "Responder con firmeza y bancar al grupo",
        action: "PRESS_STRONG",
        famaBonus: 12,
        idolBonus: 5
      },
      {
        text: "Dar una respuesta diplomática de manual",
        action: "PRESS_SAFE",
        famaBonus: 3
      }
    ]
  },

  // --- VESTUARIO Y COMPAÑEROS ---
  {
    id: "vestuario-discusion",
    positions: ["todos"],
    minAge: 18,
    maxAge: 38,
    title: "⚽ Discusión en el vestuario",
    description: "Tras una derrota dolorosa, dos referentes del plantel se están diciendo de todo. El grupo te mira a vos para ver si ponés paños fríos.",
    options: [
      {
        text: "Intervenir y pedir unión para el próximo partido",
        action: "LOCKER_LEAD",
        idolBonus: 6
      },
      {
        text: "Morderte la lengua y dejar que lo resuelvan los más grandes",
        action: "LOCKER_SILENT",
        idolBonus: 0
      }
    ]
  },

  // --- SALUD Y LESIONES ---
  {
    id: "lesion-tobillo",
    positions: ["todos"],
    minAge: 16,
    maxAge: 38,
    title: "🩺 Molestia en el tobillo",
    description: "En una jugada dividida sentiste un pinchazo fuerte. El cuerpo médico te sugiere parar dos fechas o infiltrarte.",
    options: [
      {
        text: "Parar y recuperarte al 100%",
        action: "REST",
        matchesPenalty: 3
      },
      {
        text: "Infiltrarte y jugar el fin de semana a toda costa",
        action: "RISK",
        statPenalty: { res: -2 }
      }
    ]
  },

  // --- SELECCIÓN NACIONAL ---
  {
    id: "llamado-seleccion",
    positions: ["todos"],
    minAge: 18,
    maxAge: 35,
    minOvr: 74,
    title: "🇦🇷 ¡Convocatoria a la Selección Nacional!",
    description: "El Director Técnico de la Selección incluyó tu nombre en la lista oficial para disputar la fecha FIFA.",
    options: [
      {
        text: "Vestir la camiseta albiceleste con orgullo",
        action: "SELECTION",
        famaBonus: 25,
        idolBonus: 10
      }
    ]
  },

  // --- PATROCINADORES Y MARCAS ---
  {
    id: "patrocinador-botines",
    positions: ["todos"],
    minAge: 17,
    maxAge: 34,
    minOvr: 68,
    title: "👟 Oferta de marca de botines",
    description: "Una multinacional deportiva quiere firmarte un contrato exclusivo de indumentaria para tus partidos.",
    options: [
      {
        text: "Firmar contrato de patrocinio (+ $80,000 USD)",
        action: "SPONSOR_SIGN",
        moneyBonus: 80000,
        famaBonus: 10
      }
    ]
  },

  // --- NUEVOS EVENTOS ---
  {
    id: "salida-nocturna",
    positions: ["todos"],
    minAge: 18,
    maxAge: 32,
    title: "🪩 Salida nocturna antes del partido",
    description: "Un compañero muy fiestero te invita a salir a un boliche de moda a 48 horas de un partido clave. La prensa puede estar ahí.",
    options: [
      {
        text: "Quedarte a descansar en casa (Enfoque total)",
        action: "STAY_HOME",
        statPenalty: { phy: 1 }, // Simula leve mejora o mantención (como no hay bonus de stat positivo directo en el event manager, asumo que no pierde nada)
        famaBonus: -2,
        idolBonus: 1
      },
      {
        text: "Ir un rato pero no tomar (Presencia social)",
        action: "GO_CALM",
        famaBonus: 5,
        idolBonus: -2
      },
      {
        text: "Salir con todo a romper la noche",
        action: "PARTY_HARD",
        famaBonus: 15,
        idolBonus: -15,
        statPenalty: { phy: -3, dri: -2 }
      }
    ]
  },
  {
    id: "cruce-redes-sociales",
    positions: ["todos"],
    minAge: 16,
    maxAge: 38,
    title: "📱 Cruce picante en redes sociales",
    description: "Un periodista deportivo muy polémico te mata en Twitter/X diciendo que estás 'caminando la cancha'.",
    options: [
      {
        text: "Contestarle con chicanas y memes",
        action: "REPLY_SOCIAL",
        famaBonus: 15,
        idolBonus: -5
      },
      {
        text: "Ignorarlo y responder en la cancha",
        action: "IGNORE_SOCIAL",
        idolBonus: 5,
        famaBonus: 0
      },
      {
        text: "Hacer autocrítica pública y pedir disculpas",
        action: "APOLOGIZE",
        idolBonus: 8,
        famaBonus: 2
      }
    ]
  },
  {
    id: "discusion-tactica-dt",
    positions: ["todos"],
    minAge: 18,
    maxAge: 35,
    title: "🗣️ Discusión táctica con el DT",
    description: "El técnico te pide en privado que cambies tu estilo y sacrifiques ataque para defender más en el próximo esquema.",
    options: [
      {
        text: "Aceptar sin chistar por el bien del equipo",
        action: "ACCEPT_TACTICS",
        idolBonus: 6,
        statPenalty: { att: -2, def: 2 }
      },
      {
        text: "Plantarte y decir que vos rendís jugando a tu manera",
        action: "REJECT_TACTICS",
        idolBonus: -10,
        famaBonus: 5
      }
    ]
  },
  {
    id: "pibe-inferiores",
    positions: ["todos"],
    minAge: 25,
    maxAge: 40,
    title: "👶 El pibe de las inferiores",
    description: "Un chico de la reserva de 17 años sube a Primera. Juega en tu posición y te pide consejos porque sos su ídolo.",
    options: [
      {
        text: "Apadrinarlo y quedarte después de hora a enseñarle",
        action: "MENTOR_KID",
        idolBonus: 8,
        famaBonus: 5,
        statPenalty: { phy: -1 }
      },
      {
        text: "Decirle que mire y aprenda, no hay tiempo extra",
        action: "IGNORE_KID",
        idolBonus: -2,
        famaBonus: 0
      }
    ]
  },
  {
    id: "rumores-arabia",
    positions: ["todos"],
    minAge: 24,
    maxAge: 38,
    minOvr: 72,
    title: "💵 Rumores de Arabia",
    description: "Un intermediario árabe te ofrece un contrato que triplica lo que ganás acá si forzás tu salida en enero.",
    options: [
      {
        text: "Dejar la puerta abierta a la transferencia",
        action: "OPEN_TRANSFER",
        moneyBonus: 50000,
        idolBonus: -20,
        famaBonus: 5
      },
      {
        text: "Jurar lealtad absoluta al club y rechazar todo",
        action: "REJECT_TRANSFER",
        idolBonus: 13,
        famaBonus: -2
      }
    ]
  },
  {
    id: "partido-beneficio",
    positions: ["todos"],
    minAge: 18,
    maxAge: 40,
    title: "🤝 Partido a beneficio",
    description: "Te invitan a jugar un picado solidario organizado por una leyenda del fútbol, en el medio de una semana de entrenamientos duros.",
    options: [
      {
        text: "Ir a jugar para ayudar y mostrarte",
        action: "PLAY_CHARITY",
        famaBonus: 15,
        idolBonus: 3,
        matchesPenalty: 1
      },
      {
        text: "Donar dinero pero no jugar para descansar",
        action: "DONATE_CHARITY",
        moneyBonus: -10000,
        famaBonus: 5,
        idolBonus: 3
      }
    ]
  },
  {
    id: "representante-pesado",
    positions: ["todos"],
    minAge: 16,
    maxAge: 22,
    title: "👟 El representante 'pesado'",
    description: "Un representante muy famoso te ofrece manejar tu carrera y llevarte a Europa, pero la hinchada lo odia por vaciar el club hace unos años.",
    options: [
      {
        text: "Firmar con el representante (Proyección internacional)",
        action: "SIGN_AGENT",
        famaBonus: 25,
        idolBonus: -15,
        moneyBonus: 15000
      },
      {
        text: "Seguir con tu representante de perfil bajo",
        action: "KEEP_AGENT",
        idolBonus: 8,
        famaBonus: -5
      }
    ]
  },
  {
    id: "penal-decisivo",
    positions: ["todos"],
    minAge: 17,
    maxAge: 40,
    title: "🎯 El penal decisivo",
    description: "Último minuto. Penal a favor y el partido está empatado. El pateador oficial ya salió reemplazado.",
    options: [
      {
        text: "Agarrar la pelota y hacerte cargo de la presión",
        action: "TAKE_PENALTY",
        famaBonus: 20,
        idolBonus: 10 // Se asume que entra!
      },
      {
        text: "Dejárselo al capitán del equipo",
        action: "LEAVE_PENALTY",
        famaBonus: -5,
        idolBonus: 1
      }
    ]
  },
  {
    id: "entrenamiento-invisible",
    positions: ["todos"],
    minAge: 18,
    maxAge: 35,
    title: "🏋️‍♂️ Entrenamiento invisible",
    description: "Es tu día libre. No hay prensa, el club está cerrado y nadie te obliga a hacer nada.",
    options: [
      {
        text: "Pagar un PF personal y meter doble turno",
        action: "DOUBLE_SHIFT",
        moneyBonus: -3000,
        statPenalty: { phy: 1, pac: 1 } // un pequeño buff en vez de penalty
      },
      {
        text: "Disfrutar del asado en familia y descansar la cabeza",
        action: "FAMILY_REST",
        idolBonus: 0,
        statPenalty: { men: 2 } // Mejora mental
      }
    ]
  },
  {
    id: "interes-rival",
    positions: ["todos"],
    minAge: 18,
    maxAge: 35,
    minOvr: 70,
    title: "🕵️ Interés del eterno rival",
    description: "Se filtra en la prensa que el clásico rival de tu equipo preguntó condiciones por tu pase.",
    options: [
      {
        text: "Salir a desmentirlo a muerte y jurar amor por tu camiseta",
        action: "DENY_RIVAL",
        idolBonus: 15,
        famaBonus: 5
      },
      {
        text: "No decir nada y dejar la puerta abierta (Para negociar mejor contrato)",
        action: "BAIT_RIVAL",
        moneyBonus: 35000,
        idolBonus: -25,
        famaBonus: 10
      }
    ]
  },
  {
    id: "conflicto-premios",
    positions: ["todos"],
    minAge: 20,
    maxAge: 40,
    minTier: 3,
    title: "💸 Conflicto por los premios",
    description: "El capitán del equipo se pelea con los dirigentes por la plata de los premios antes de un partido clave. El plantel amenaza con no concentrar.",
    options: [
      {
        text: "Ponerte del lado del capitán y plantarte (Unión de grupo)",
        action: "BACK_CAPTAIN",
        idolBonus: 5,
        moneyBonus: 5000,
        famaBonus: -5
      },
      {
        text: "No meterte y decir que vos solo querés jugar",
        action: "IGNORE_CONFLICT",
        idolBonus: -10,
        famaBonus: 5
      }
    ]
  },
  {
    id: "publicidad-bizarra",
    positions: ["todos"],
    minAge: 18,
    maxAge: 38,
    minOvr: 70,
    title: "🍔 La publicidad bizarra",
    description: "Una marca de alfajores local te ofrece buena plata para protagonizar un comercial actuando pésimo y bailando.",
    options: [
      {
        text: "Aceptar y hacer el ridículo",
        action: "DO_COMMERCIAL",
        moneyBonus: 15000,
        famaBonus: 20,
        idolBonus: -5
      },
      {
        text: "Rechazarla por cuidar tu imagen seria",
        action: "REJECT_COMMERCIAL",
        moneyBonus: 0,
        famaBonus: -5,
        idolBonus: 3
      }
    ]
  },
  {
    id: "apriete-barra",
    positions: ["todos"],
    minAge: 18,
    maxAge: 40,
    title: "🥁 Apriete de la barra",
    description: "El equipo viene de perder el clásico y 30 integrantes de la barra interrumpen el entrenamiento pidiendo 'más actitud'.",
    options: [
      {
        text: "Dar la cara y hablarles para calmar las aguas",
        action: "FACE_ULTRAS",
        idolBonus: 8,
        famaBonus: 5,
        statPenalty: { men: -2 } // Estrés mental
      },
      {
        text: "Quedarte atrás con los pibes y no decir nada",
        action: "HIDE_ULTRAS",
        idolBonus: -5,
        famaBonus: -2
      }
    ]
  },
  {
    id: "ex-club-resentido",
    positions: ["todos"],
    minAge: 20,
    maxAge: 40,
    title: "🤬 El ex club resentido",
    description: "Jugás de visitante contra tu club anterior. La gente te silba cada vez que tocás la pelota.",
    options: [
      {
        text: "Jugar callado y aguantar la presión enfocado",
        action: "PLAY_FOCUSED",
        statPenalty: { men: 3 }, // Buff mental
        idolBonus: 3
      },
      {
        text: "Si hacés gol, gritarlo con furia de cara a la tribuna",
        action: "CELEBRATE_HARD",
        famaBonus: 15,
        idolBonus: -10
      }
    ]
  },
  {
    id: "cambio-de-dt",
    positions: ["todos"],
    minAge: 18,
    maxAge: 40,
    title: "👔 Cambio de DT",
    description: "Echan al técnico que te bancaba y viene uno nuevo de la 'vieja escuela' que prefiere traer a los suyos.",
    options: [
      {
        text: "Entrenar el doble para ganarte el puesto",
        action: "TRAIN_HARDER",
        idolBonus: 5,
        statPenalty: { phy: 2 } // Buff físico
      },
      {
        text: "Ir a los medios a quejarte por la falta de minutos",
        action: "COMPLAIN_MEDIA",
        famaBonus: 10,
        idolBonus: -15
      }
    ]
  },
  {
    id: "psicologo-deportivo",
    positions: ["todos"],
    minAge: 16,
    maxAge: 35,
    title: "🧠 El psicólogo deportivo",
    description: "El club contrata a un coach emocional y te cita a una sesión porque nota que te frustrás rápido al errar.",
    options: [
      {
        text: "Abrirte y hacer los ejercicios propuestos",
        action: "DO_THERAPY",
        statPenalty: { men: 5 }, // Gran buff mental
        idolBonus: 0
      },
      {
        text: "Decir que vos te arreglás solo pateando al arco",
        action: "SKIP_THERAPY",
        statPenalty: { sho: 1 }, // Leve buff de tiro
        idolBonus: -2
      }
    ]
  },
  {
    id: "error-juvenil",
    positions: ["todos"],
    minAge: 24,
    maxAge: 40,
    title: "🤦‍♂️ El error del juvenil",
    description: "Un pibe recién subido debuta, se manda una macana gigante y pierden. En el vestuario, los referentes lo quieren matar.",
    options: [
      {
        text: "Saltar a defender al pibe (Liderazgo)",
        action: "DEFEND_KID",
        idolBonus: 8,
        famaBonus: 5,
        statPenalty: { men: 2 }
      },
      {
        text: "Sumarte a la bronca porque te hizo perder el premio",
        action: "BLAME_KID",
        idolBonus: -10,
        famaBonus: 0
      }
    ]
  },
  {
    id: "inversion-dudosa",
    positions: ["todos"],
    minAge: 21,
    maxAge: 40,
    minOvr: 68,
    title: "📈 Inversión dudosa",
    description: "Un excompañero te llama para invitarte a invertir $15,000 USD en un complejo de canchas de pádel. Dice que 'es seguro'.",
    options: [
      {
        text: "Entrarle con fe al negocio",
        action: "INVEST_MONEY",
        moneyBonus: 35000, // En este caso le fue bien
        famaBonus: 5
      },
      {
        text: "Agradecer y pasar de largo",
        action: "IGNORE_INVESTMENT",
        moneyBonus: 0
      }
    ]
  },
  {
    id: "topo-vestuario",
    positions: ["todos"],
    minAge: 20,
    maxAge: 40,
    title: "🐀 El topo del vestuario",
    description: "Un periodista cuenta con lujo de detalles una pelea que hubo ayer. El capitán busca al 'topo' desesperado.",
    options: [
      {
        text: "Proponer una reunión a solas para limpiar asperezas",
        action: "CLEAR_AIR",
        idolBonus: 8,
        statPenalty: { men: 2 }
      },
      {
        text: "Quedarte callado (Vos fuiste el que le filtró el dato al periodista)",
        action: "STAY_SILENT",
        famaBonus: 15,
        idolBonus: -10,
        moneyBonus: 5000
      }
    ]
  },
  {
    id: "contrato-congelado",
    positions: ["todos"],
    minAge: 21, // Edad donde típicamente terminan los primeros contratos
    maxAge: 35,
    title: "🥶 O firmás o te colgamos",
    description: "Quedan 6 meses de contrato. El presidente te aprieta: 'O renovás hoy por la misma plata, o no jugás más hasta quedar libre'.",
    options: [
      {
        text: "Achicarte y firmar para asegurar jugar",
        action: "SIGN_CHEAP",
        moneyBonus: -10000, // Pierde plata potencial
        idolBonus: 8
      },
      {
        text: "Plantarte, no firmar y aguantar la presión",
        action: "WAIT_FREE",
        matchesPenalty: 5, // Lo cuelgan unos partidos
        moneyBonus: 40000, // Salto económico futuro
        idolBonus: -10
      }
    ]
  },
  {
    id: "noche-de-goce",
    positions: ["todos"],
    minAge: 18,
    maxAge: 35,
    title: "😈 Noche de descontrol",
    description: "Te habla un/a modelo/influencer de OnlyFans muy famoso/a por privado en Instagram invitándote a pasar una 'noche de goce'.",
    options: [
      {
        text: "Aceptar la invitación (La tentación es fuerte)",
        action: "ACCEPT_INVITE",
        idolBonus: -15, // Te ven desconcentrado y sale en los chimentos
        famaBonus: 20,  // Sos tapa de las revistas de chimentos
        statPenalty: { phy: -1, men: -1, pac: -1, sho: -1, pas: -1, dri: -1, def: -1 } // Reduce todas las stats un punto por el desgaste
      },
      {
        text: "Rechazar sutilmente y enfocarte en el fútbol",
        action: "REJECT_INVITE",
        idolBonus: 5, // Se valora tu profesionalismo
        famaBonus: -2
      }
    ]
  }
];
