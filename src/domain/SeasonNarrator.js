/**
 * Clase SeasonNarrator (POO)
 * Genera texto narrativo periodístico argentino sobre el rendimiento de la temporada
 * y el resumen de carrera, adaptado a la posición del jugador y sus estadísticas reales.
 */
export class SeasonNarrator {

  /**
   * Genera un párrafo narrativo de fin de temporada según posición y stats.
   * @param {object} record - El registro de la temporada (stats simuladas)
   * @param {string} positionKey - Clave de posición del jugador
   * @param {string} playerName - Nombre del jugador
   * @param {string} teamName - Nombre del club
   * @param {string} leagueName - Nombre de la liga
   * @param {number} age - Edad del jugador ese año
   * @returns {string} Párrafo HTML con la narrativa
   */
  static generateSeasonNarrative(record, positionKey, playerName, teamName, leagueName, age) {
    const rating = record.rating;
    const level = rating >= 8.0 ? "excelente" : rating >= 7.0 ? "bueno" : rating >= 6.0 ? "regular" : "flojo";

    let narrativa = "";

    if (positionKey === "arquero") {
      narrativa = SeasonNarrator._narrativeArquero(record, level, playerName, teamName);
    } else if (positionKey === "defensor_central_izq" || positionKey === "defensor_central_der") {
      narrativa = SeasonNarrator._narrativeDefensor(record, level, playerName, teamName);
    } else if (positionKey === "lateral_izquierdo" || positionKey === "lateral_derecho") {
      narrativa = SeasonNarrator._narrativeLateral(record, level, playerName, teamName);
    } else if (positionKey === "mediocampista_defensivo" || positionKey === "mediocampista_central") {
      narrativa = SeasonNarrator._narrativeMediocampista(record, level, playerName, teamName);
    } else if (positionKey === "extremo_izquierdo" || positionKey === "extremo_derecho") {
      narrativa = SeasonNarrator._narrativeExtremo(record, level, playerName, teamName);
    } else if (positionKey === "enganche") {
      narrativa = SeasonNarrator._narrativeEnganche(record, level, playerName, teamName);
    } else {
      // Delantero (delantero / segundo_delantero)
      narrativa = SeasonNarrator._narrativeDelantero(record, level, playerName, teamName);
    }

    // Agregado por campeonato o fracaso colectivo
    if (record.wonTitle) {
      narrativa += ` Y como si fuera poco, el año terminó con la copa en las manos: <strong>campeones en ${leagueName}</strong>. Una temporada para enmarcar.`;
    } else if (level === "flojo") {
      narrativa += ` Fue un año para olvidar, pero los mejores siempre vuelven más fuertes.`;
    }

    return narrativa;
  }

  static _narrativeArquero(r, level, name, team) {
    const saves = r.saves || 0;
    const cs = r.cleanSheets || 0;
    const gc = r.goalsConceded || 0;

    if (level === "excelente") {
      return `${name} tuvo una temporada descomunal bajo los tres palos de <strong>${team}</strong>. Con ${saves} atajadas y ${cs} valla${cs !== 1 ? 's' : ''} invicta${cs !== 1 ? 's' : ''}, fue uno de los mejores del torneo. Le sacó lo insacable y fue el muro que permitió soñar.`;
    } else if (level === "bueno") {
      return `Sólida campaña de ${name} en el arco de <strong>${team}</strong>. Terminó el año con ${saves} atajadas y ${cs} valla${cs !== 1 ? 's' : ''} en cero. Hubo noches difíciles (${gc} goles recibidos), pero bancó el palo siempre.`;
    } else if (level === "regular") {
      return `Temporada irregular para ${name} en el arco de <strong>${team}</strong>. Los números finales muestran ${cs} valla${cs !== 1 ? 's' : ''} invicta${cs !== 1 ? 's' : ''} y ${gc} goles en contra. Hay margen para crecer.`;
    }
    return `Temporada para el olvido de ${name} en <strong>${team}</strong>. ${gc} goles recibidos y solo ${cs} valla${cs !== 1 ? 's' : ''} en cero. El cuerpo técnico sabe que hay que trabajar mucho.`;
  }

  static _narrativeDefensor(r, level, name, team) {
    const tackles = r.tackles || 0;
    const aerials = r.aerialsWon || 0;
    const goals = r.goals || 0;

    if (level === "excelente") {
      return `${name} fue una roca en la defensa de <strong>${team}</strong>. ${tackles} quites, ${aerials} duelos aéreos ganados y hasta ${goals > 0 ? `${goals} gol${goals !== 1 ? 'es' : ''} de pelota parada` : 'presencia ofensiva en los corners'}. Un zaguero con todas las letras.`;
    } else if (level === "bueno") {
      return `Buen año de ${name} en el fondo de <strong>${team}</strong>. Fue contundente en los duelos (${tackles} quites) y comandó el juego aéreo con ${aerials} disputas ganadas. Un pilar del equipo.`;
    } else if (level === "regular") {
      return `Temporada con altibajos para ${name} en la defensa de <strong>${team}</strong>. Sumó ${tackles} quites, pero hubo partidos donde le costó. El trabajo en doble turno va a ser clave para el año que viene.`;
    }
    return `Año difícil para ${name} como defensor de <strong>${team}</strong>. Solo ${tackles} quites en toda la temporada y varios errores que le costaron caro al equipo. Hay que resetear.`;
  }

  static _narrativeLateral(r, level, name, team) {
    const assists = r.assists || 0;
    const tackles = r.tackles || 0;
    const goals = r.goals || 0;

    if (level === "excelente") {
      return `${name} fue el lateral más desequilibrante de <strong>${team}</strong>. Ida y vuelta por la banda todo el año: ${assists} asistencia${assists !== 1 ? 's' : ''} para el gol${goals > 0 ? `, ${goals} tanto${goals !== 1 ? 's' : ''} propio${goals !== 1 ? 's' : ''}` : ''} y ${tackles} recuperaciones. Un puñal de banda.`;
    } else if (level === "bueno") {
      return `Buen desempeño de ${name} en la banda de <strong>${team}</strong>. Aportó ${assists} asistencia${assists !== 1 ? 's' : ''} y cumplió bien en defensa con ${tackles} quites. Un lateral confiable en los dos lados de la cancha.`;
    } else if (level === "regular") {
      return `Temporada de más a menos para ${name} en el carril lateral de <strong>${team}</strong>. Solo ${assists} asistencia${assists !== 1 ? 's' : ''} y ${tackles} recuperaciones. El nivel físico hay que mantenerlo todo el año.`;
    }
    return `Año que no fue el de ${name} en el lateral de <strong>${team}</strong>. Costó tanto en ataque como en defensa. Tiene las herramientas para dar vuelta esto.`;
  }

  static _narrativeMediocampista(r, level, name, team) {
    const tackles = r.tackles || 0;
    const keyPasses = r.keyPasses || 0;
    const assists = r.assists || 0;

    if (level === "excelente") {
      return `${name} fue el motor del mediocampo de <strong>${team}</strong>. ${tackles} recuperaciones, ${keyPasses} pases clave y ${assists} asistencia${assists !== 1 ? 's' : ''}: un volante completo que no se cansa de correr. El pulmón del equipo.`;
    } else if (level === "bueno") {
      return `Buena temporada de ${name} en el mediocampo de <strong>${team}</strong>. Recuperó ${tackles} veces y armó el juego con ${keyPasses} pases clave. Un fijo en el esquema del técnico.`;
    } else if (level === "regular") {
      return `Temporada con claroscuros para ${name} en el medio de <strong>${team}</strong>. ${tackles} recuperaciones y ${assists} asistencia${assists !== 1 ? 's' : ''}, pero le faltó consistencia. El talento está, hay que pulir la concentración.`;
    }
    return `Fue un año complicado para ${name} en el mediocampo de <strong>${team}</strong>. Los números no acompañaron: pocas recuperaciones y sin claridad para armar. Hay que volver a los fundamentos.`;
  }

  static _narrativeExtremo(r, level, name, team) {
    const goals = r.goals || 0;
    const assists = r.assists || 0;
    const keyPasses = r.keyPasses || 0;

    if (level === "excelente") {
      return `¡Tremendo año el de ${name} por la banda de <strong>${team}</strong>! ${goals} gol${goals !== 1 ? 'es' : ''} y ${assists} asistencia${assists !== 1 ? 's' : ''}: rompió a todos los defensas que le pusieron enfrente. Gambeta, velocidad y definición. La pesadilla de los laterales rivales.`;
    } else if (level === "bueno") {
      return `Buen andar del extremo ${name} en <strong>${team}</strong>. Cerró la temporada con ${goals} gol${goals !== 1 ? 'es' : ''} y ${assists} asistencia${assists !== 1 ? 's' : ''}, generando peligro cada vez que agarró la pelota en la banda. Un extremo de calidad.`;
    } else if (level === "regular") {
      return `Temporada irregular de ${name} por las bandas de <strong>${team}</strong>. ${goals} gol${goals !== 1 ? 'es' : ''} y ${assists} asistencia${assists !== 1 ? 's' : ''} en ${r.matches} partidos. Tuvo destellos pero le faltó consistencia en el tramo final del año.`;
    }
    return `Año para olvidar de ${name} en la banda de <strong>${team}</strong>. Le costó desbordar, le costó definir. Solo ${goals} gol${goals !== 1 ? 'es' : ''} en toda la temporada. El año que viene tiene que ser diferente.`;
  }

  static _narrativeEnganche(r, level, name, team) {
    const assists = r.assists || 0;
    const goals = r.goals || 0;
    const keyPasses = r.keyPasses || 0;

    if (level === "excelente") {
      return `${name} fue el cerebro y el corazón de <strong>${team}</strong> en esta temporada. ${assists} asistencia${assists !== 1 ? 's' : ''}, ${goals} gol${goals !== 1 ? 'es' : ''} (varios de tiro libre) y ${keyPasses} pases de calidad. Una 10 de lujo que hizo jugar al equipo.`;
    } else if (level === "bueno") {
      return `Buena actuación de ${name} como enganche de <strong>${team}</strong>. Distribuyó bien el juego, aportó ${assists} asistencia${assists !== 1 ? 's' : ''} y ${goals} gol${goals !== 1 ? 'es' : ''} de pelota parada. Un enganche con clase y visión de juego.`;
    } else if (level === "regular") {
      return `Temporada sin brillo del enganche ${name} en <strong>${team}</strong>. Solo ${assists} asistencia${assists !== 1 ? 's' : ''} y ${goals} gol${goals !== 1 ? 'es' : ''}. Se vio el talento en momentos puntuales, pero no pudo ser regular. La próxima temporada tiene que marcar la diferencia.`;
    }
    return `Año opaco para ${name} en la media punta de <strong>${team}</strong>. El equipo le exigía más creatividad y no llegó. ${assists} asistencia${assists !== 1 ? 's' : ''} en toda la temporada hablan solos. A resetear.`;
  }

  static _narrativeDelantero(r, level, name, team) {
    const goals = r.goals || 0;
    const assists = r.assists || 0;

    if (level === "excelente") {
      if (goals >= 20) return `¡${name} fue una máquina goleadora en <strong>${team}</strong>! ${goals} goles en la temporada: el delantero que todos querían en su equipo. Con olfato, potencia y cabeza. Una bestia del área.`;
      return `Golazo de temporada para ${name} en <strong>${team}</strong>. ${goals} goles y ${assists} asistencia${assists !== 1 ? 's' : ''}: un delantero que apareció siempre en los momentos clave. Los rivales no sabían cómo pararle.`;
    } else if (level === "bueno") {
      return `Buena campaña del 9 ${name} en <strong>${team}</strong>. Terminó con ${goals} goles en ${r.matches} partidos y colaboró con ${assists} asistencia${assists !== 1 ? 's' : ''} para sus compañeros. Un delantero que se hizo notar.`;
    } else if (level === "regular") {
      return `Temporada con luces y sombras para el delantero ${name} en <strong>${team}</strong>. ${goals} goles en toda la campaña: tuvo rachas y también noches de sequía. El trabajo en el área tiene que ser más constante.`;
    }
    return `Año difícil para ${name} como punta de <strong>${team}</strong>. Solo ${goals} gol${goals !== 1 ? 'es' : ''} en toda la temporada y poco aporte. Los delanteros se miden por los goles, y esto no alcanzó. La próxima tiene que ser otra historia.`;
  }

  /**
   * Genera un párrafo narrativo de resumen de carrera completa al momento del retiro.
   * @param {object} totals - Totales acumulados de carrera
   * @param {string} positionKey - Posición del jugador
   * @param {string} playerName - Nombre del jugador
   * @param {number} age - Edad al retiro
   * @param {number} seasons - Cantidad de temporadas jugadas
   * @param {number} titles - Títulos ganados
   * @param {number} peakOvR - OVR máximo alcanzado
   * @returns {string} Párrafo HTML con la narrativa de retiro
   */
  static generateCareerNarrative(totals, positionKey, playerName, age, seasons, titles, idolScore) {
    const isGK = positionKey === "arquero";
    const isAttacker = ["delantero", "segundo_delantero", "extremo_izquierdo", "extremo_derecho", "enganche"].includes(positionKey);
    const isDefense = ["defensor_central_izq", "defensor_central_der", "lateral_izquierdo", "lateral_derecho"].includes(positionKey);

    let intro = `${playerName} dijo adiós al fútbol profesional a los ${age} años, tras ${seasons} temporada${seasons !== 1 ? 's' : ''} de carrera. `;

    let body = "";

    if (isGK) {
      const saves = totals.saves || 0;
      const cs = totals.cleanSheets || 0;
      body = `Bajo los tres palos realizó ${saves} atajadas y protagonizó ${cs} partido${cs !== 1 ? 's' : ''} sin goles en contra. `;
      if (cs > 60) body += `Un guardameta de los que no se olvidan: muralla pura. `;
      else if (cs > 30) body += `Un arquero sólido, de los confiables de verdad. `;
      else body += `Tuvo sus grandes noches aunque también le tocó sufrir. `;
    } else if (isDefense) {
      const tackles = totals.tackles || 0;
      body = `En defensa acumuló ${tackles} recuperaciones de pelota a lo largo de su carrera. `;
      if (tackles > 500) body += `Un zaguero que imponía respeto en cada partido: nadie lo pasaba fácil. `;
      else if (tackles > 250) body += `Un defensor de fiar, de los que le daban tranquilidad al equipo. `;
      else body += `Tuvo sus altibajos pero siempre quiso dejar todo en la cancha. `;
    } else if (isAttacker) {
      const goals = totals.goals || 0;
      const assists = totals.assists || 0;
      if (positionKey === "enganche") {
        body = `Como enganche dejó ${assists} asistencia${assists !== 1 ? 's' : ''} y ${goals} gol${goals !== 1 ? 'es' : ''} que se recuerdan con cariño. `;
        if (assists > 80) body += `Un creativo de los que hacen jugar al equipo. La 10 que todos querían tener. `;
        else if (assists > 40) body += `Un volante con visión y clase por encima del promedio. `;
      } else {
        body = `Metió ${goals} gol${goals !== 1 ? 'es' : ''} y repartió ${assists} asistencia${assists !== 1 ? 's' : ''} durante toda su carrera. `;
        if (goals > 150) body += `Un goleador histórico, de esos que se eternizan en la memoria de los hinchas. `;
        else if (goals > 80) body += `Un atacante de jerarquía que supo hacer daño con regularidad. `;
        else body += `No fue un romperedes serial, pero su aporte al equipo siempre se sintió. `;
      }
    } else {
      // Mediocampistas
      const tackles = totals.tackles || 0;
      const assists = totals.assists || 0;
      body = `En el mediocampo sumó ${tackles} recuperaciones y ${assists} asistencia${assists !== 1 ? 's' : ''} a lo largo de su carrera. `;
      if (tackles > 400) body += `Un motor infatigable, de los que hacen el trabajo sucio sin quejarse. `;
      else body += `Un mediocampista que siempre le puso el pecho a la cancha. `;
    }

    let closing = "";
    if (titles > 0) {
      closing = `Levantó ${titles} trofeo${titles !== 1 ? 's' : ''} en su carrera. `;
    }

    if (idolScore >= 80) {
      closing += `Y lo más importante: se fue como un <strong>ídolo</strong>, con el cariño eterno de la gente. ¡Gracias, crack!`;
    } else if (idolScore >= 50) {
      closing += `Se ganó el respeto de la hinchada y se va con la frente en alto.`;
    } else {
      closing += `Quizás no llegó a la cima, pero nadie le puede quitar lo que le puso al fútbol.`;
    }

    return intro + body + closing;
  }

  /**
   * Devuelve las stats relevantes a mostrar en el resumen de temporada según posición.
   * @param {object} record - El registro de la temporada
   * @param {string} positionKey - Clave de posición
   * @returns {Array} Array de {label, value, icon, color}
   */
  static getPositionStats(record, positionKey) {
    const base = { label: "Partidos", value: record.matches, icon: "⚽", color: "var(--text-primary)" };
    const rating = { label: "Rating", value: record.rating, icon: "⭐", color: "var(--accent-gold)" };

    if (positionKey === "arquero") {
      return [
        base,
        { label: "Atajadas", value: record.saves ?? 0, icon: "🧤", color: "var(--accent-blue)" },
        { label: "Vallas Inv.", value: record.cleanSheets ?? 0, icon: "🛡️", color: "var(--accent-green)" },
        { label: "Goles Recib.", value: record.goalsConceded ?? 0, icon: "🥅", color: "#ff6b6b" },
        rating
      ];
    }

    if (positionKey === "defensor_central_izq" || positionKey === "defensor_central_der") {
      return [
        base,
        { label: "Quites", value: record.tackles ?? 0, icon: "💪", color: "var(--accent-blue)" },
        { label: "Duelos Aéreos", value: record.aerialsWon ?? 0, icon: "📐", color: "#b39ddb" },
        { label: "Goles", value: record.goals ?? 0, icon: "🎯", color: "var(--accent-green)" },
        rating
      ];
    }

    if (positionKey === "lateral_izquierdo" || positionKey === "lateral_derecho") {
      return [
        base,
        { label: "Quites", value: record.tackles ?? 0, icon: "💪", color: "var(--accent-blue)" },
        { label: "Asistencias", value: record.assists ?? 0, icon: "🎯", color: "var(--accent-green)" },
        { label: "Goles", value: record.goals ?? 0, icon: "⚡", color: "#ffb74d" },
        rating
      ];
    }

    if (positionKey === "mediocampista_defensivo" || positionKey === "mediocampista_central") {
      return [
        base,
        { label: "Recuperac.", value: record.tackles ?? 0, icon: "💪", color: "var(--accent-blue)" },
        { label: "Pases Clave", value: record.keyPasses ?? 0, icon: "🎯", color: "#b39ddb" },
        { label: "Asistencias", value: record.assists ?? 0, icon: "✨", color: "var(--accent-green)" },
        rating
      ];
    }

    if (positionKey === "extremo_izquierdo" || positionKey === "extremo_derecho") {
      return [
        base,
        { label: "Goles", value: record.goals ?? 0, icon: "⚡", color: "var(--accent-green)" },
        { label: "Asistencias", value: record.assists ?? 0, icon: "🎯", color: "var(--accent-blue)" },
        { label: "Pases Clave", value: record.keyPasses ?? 0, icon: "✨", color: "#b39ddb" },
        rating
      ];
    }

    if (positionKey === "enganche") {
      return [
        base,
        { label: "Asistencias", value: record.assists ?? 0, icon: "🎯", color: "var(--accent-gold)" },
        { label: "Goles", value: record.goals ?? 0, icon: "⚡", color: "var(--accent-green)" },
        { label: "Pases Clave", value: record.keyPasses ?? 0, icon: "✨", color: "#b39ddb" },
        rating
      ];
    }

    // delantero / segundo_delantero (default)
    return [
      base,
      { label: "Goles", value: record.goals ?? 0, icon: "⚡", color: "var(--accent-green)" },
      { label: "Asistencias", value: record.assists ?? 0, icon: "🎯", color: "var(--accent-blue)" },
      { label: "Pases Clave", value: record.keyPasses ?? 0, icon: "✨", color: "#b39ddb" },
      rating
    ];
  }
}
