/**
 * cupsCatalog.js
 * Configuración centralizada de todas las copas del juego.
 * 
 * Cada copa define:
 *  - id            : clave interna usada en todo el juego
 *  - name          : nombre para mostrar en la UI
 *  - emoji         : ícono
 *  - country       : "ar" | "intl" | "regional"
 *  - description   : descripción corta para la UI
 *  - matrixConfig  : configuración del minijuego de matriz
 *  - qualifyRules  : reglas de clasificación (evaluadas por SeasonSimulator)
 */

export const CUPS_CATALOG = [

    // ─── ARGENTINA ──────────────────────────────────────────────────────────────

    {
        id: "copa_argentina",
        name: "Copa Argentina",
        emoji: "🇦🇷",
        country: "ar",
        description: "La copa nacional abierta a todos los clubes argentinos de las 4 divisiones. El campeón clasifica a la Copa Libertadores.",
        matrixConfig: {
            gridSize: 64,   // 8x8
            hasGroupStage: false,
            knockoutWins: 6,
        },
        qualifyRules: {
            // Todos los equipos argentinos (tier 1-4) clasifican siempre
            allArgentineTeams: true,
        },
        winnerRewards: {
            // Ganar la copa argentina da cupo a Libertadores sin importar la categoría
            qualifiesFor: "libertadores",
        },
    },

    {
        id: "libertadores",
        name: "Copa Libertadores",
        emoji: "🏆",
        country: "intl",
        description: "El torneo más importante de Sudamérica. Argentina manda 7 equipos: top 4 de LPF, campeón de Copa Argentina, y ganadores de Sudamericana/Recopa si aplica.",
        matrixConfig: {
            gridSize: 64,
            hasGroupStage: true,
            knockoutWins: 4, // Octavos a Final
        },
        qualifyRules: {
            // Top 4 de Primera División Argentina (tier 1)
            leagueTier: 1,
            country: "ar",
            topPositions: 4,
            // O ganador de Copa Argentina (se chequea por cupWinners en SeasonSimulator)
            orCupWinner: "copa_argentina",
        },
        winnerRewards: {
            qualifiesFor: null, // No hay clasificación extra por ganar libertadores en el juego actual
        },
    },

    {
        id: "sudamericana",
        name: "Copa Sudamericana",
        emoji: "🌎",
        country: "intl",
        description: "La segunda copa continental. Posiciones 5-10 de Primera División Argentina clasifican.",
        matrixConfig: {
            gridSize: 64,
            hasGroupStage: true,
            knockoutWins: 4, // Octavos a Final
        },
        qualifyRules: {
            leagueTier: 1,
            country: "ar",
            positionRange: [5, 10], // inclusive
        },
        winnerRewards: {
            qualifiesFor: null,
        },
    },

    {
        id: "recopa",
        name: "Recopa Sudamericana",
        emoji: "⚽",
        country: "intl",
        description: "El campeón de Libertadores vs el campeón de Sudamericana. Solo ida y vuelta.",
        matrixConfig: {
            gridSize: 64,
            hasGroupStage: false,
            knockoutWins: 1,  // Final única
        },
        qualifyRules: {
            // Solo si ganaste Libertadores o Sudamericana el año anterior
            orCupWinner: "libertadores",
        },
        winnerRewards: {
            qualifiesFor: null,
        },
    },

    {
        id: "copa_america",
        name: "Copa América",
        emoji: "🏆🌎",
        country: "intl",
        description: "Torneo internacional de selecciones sudamericanas e invitadas. Se juega cada 4 años.",
        matrixConfig: {
            gridSize: 64,
            hasGroupStage: true,
            knockoutWins: 3, // Cuartos, Semis, Final
        },
        qualifyRules: {
            isNationalTeam: true,
        },
        winnerRewards: {
            qualifiesFor: null,
        },
    },

];

/**
 * Helper: obtener configuración de una copa por id
 * @param {string} cupId
 * @returns {object|null}
 */
export function getCupById(cupId) {
    return CUPS_CATALOG.find(c => c.id === cupId) ?? null;
}

/**
 * Helper: obtener la config de matriz para una copa dada
 * (para que MatrixMinigame la consuma directamente)
 * @param {string} cupId
 * @returns {{ gridSize, hasGroupStage, knockoutWins }}
 */
export function getCupMatrixConfig(cupId) {
    const cup = getCupById(cupId);
    if (!cup) {
        // Fallback genérico si no existe la copa
        return { gridSize: 64, hasGroupStage: false, knockoutWins: 6 };
    }
    return cup.matrixConfig;
}

/**
 * Helper: dada la situación del jugador, calcular en qué copas clasifica el año siguiente.
 * 
 * @param {object} params
 * @param {object} params.currentTeam     - Team del jugador
 * @param {number} params.leagueRank      - Posición final en la liga (1-indexed)
 * @param {number} params.leagueTier      - Tier de la liga (1 = Primera División)
 * @param {object} params.cupWinners      - { copa_argentina: Team|null, libertadores: Team|null, ... }
 * @param {string} params.country         - "ar" | ...
 * @returns {string[]} - Array de cup IDs para el año siguiente
 */
export function calculateQualifiedCups({ currentTeam, leagueRank, leagueTier, cupWinners, country }) {
    const qualified = new Set();

    for (const cup of CUPS_CATALOG) {
        const rules = cup.qualifyRules;

        // Todos los equipos del país clasifican (ej: Copa Argentina)
        if (rules.allArgentineTeams && country === "ar") {
            qualified.add(cup.id);
            continue;
        }

        // Regla por posición en liga
        if (rules.leagueTier && rules.country === country && leagueTier === rules.leagueTier) {
            if (rules.topPositions && leagueRank <= rules.topPositions) {
                qualified.add(cup.id);
            }
            if (rules.positionRange) {
                const [min, max] = rules.positionRange;
                if (leagueRank >= min && leagueRank <= max) {
                    qualified.add(cup.id);
                }
            }
        }

        // Regla por ser ganador de otra copa
        if (rules.orCupWinner && cupWinners[rules.orCupWinner]) {
            if (cupWinners[rules.orCupWinner].id === currentTeam.id) {
                qualified.add(cup.id);
            }
        }
    }

    // Aplicar rewards: si ganaste una copa que da cupo a otra, agregar esa otra también
    for (const cup of CUPS_CATALOG) {
        if (cup.winnerRewards?.qualifiesFor && cupWinners[cup.id]?.id === currentTeam.id) {
            qualified.add(cup.winnerRewards.qualifiesFor);
        }
    }

    // Copa Argentina siempre va primero, luego internacionales
    const order = ["copa_argentina", "libertadores", "sudamericana", "recopa", "copa_america"];
    return order.filter(id => qualified.has(id));
}