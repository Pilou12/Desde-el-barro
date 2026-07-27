export const STORE_ITEMS = [
  // LUJOS
  {
    id: "reloj_oro",
    name: "Reloj de Oro Macizo",
    price: 25000,
    category: "lujo",
    icon: "⌚",
    description: "Tu primer gustito al firmar tu primer contrato profesional. Puro status, 0 aporte en la cancha."
  },
  {
    id: "auto_deportivo",
    name: "Auto Deportivo Importado",
    price: 300000,
    category: "lujo",
    icon: "🏎️",
    description: "El clásico de todo jugador que la pegó en un equipo grande. Llegá a entrenar tirando facha."
  },
  {
    id: "mansion_privada",
    name: "Mansión Privada",
    price: 1500000,
    category: "lujo",
    icon: "🏡",
    description: "Cancha propia, pileta climatizada y 10 habitaciones. Firmaste un contrato millonario y se nota."
  },
  {
    id: "equipo_esports",
    name: "Equipo de eSports Propio",
    price: 3500000,
    category: "lujo",
    icon: "🎮",
    description: "Te volviste streamer en tu tiempo libre y armaste tu propio equipo como el Kun Agüero."
  },
  {
    id: "jet_privado",
    name: "Jet Privado",
    price: 10000000,
    category: "lujo",
    icon: "✈️",
    description: "El lujo definitivo. Solo para leyendas absolutas que cobraron en Europa."
  },

  // MEJORAS
  {
    id: "psicologo",
    name: "Psicólogo Deportivo",
    price: 250000,
    category: "mejora",
    icon: "🧠",
    description: "Te ayuda a mantener la cabeza fría. Reduce a la mitad el impacto negativo en Fama e Ídolo ante malas rachas o eventos adversos."
  },
  {
    id: "kinesiologo",
    name: "Kinesiólogo Personal",
    price: 350000,
    category: "mejora",
    icon: "🩺",
    description: "Te recupera en tiempo récord. Si sufrís lesiones por baja resistencia, este profesional reduce casi a cero los partidos perdidos."
  },
  {
    id: "agente_prensa",
    name: "Agente de Prensa Estrella",
    price: 500000,
    category: "mejora",
    icon: "📸",
    description: "¡Te vende humo como nadie! Cada vez que ganes Reputación (Fama), ganás un 50% extra pasivamente."
  },
  {
    id: "asesor_financiero",
    name: "Asesor Financiero",
    price: 800000,
    category: "mejora",
    icon: "📈",
    description: "Invierte tu dinero mientras jugás. Te genera pasivamente un 10% de ganancia anual sobre tu saldo en el banco cada temporada."
  },
  {
    id: "gimnasio_alta_tecnologia",
    name: "Gimnasio de Alta Tecnología",
    price: 1200000,
    category: "mejora",
    icon: "🦾",
    description: "Instalás un centro de alto rendimiento en tu casa. Efecto INMEDIATO: +3 Puntos permanentes en TODOS tus atributos al comprarlo."
  }
];

export function getStoreItemById(id) {
  return STORE_ITEMS.find(item => item.id === id);
}
