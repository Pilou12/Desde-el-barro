/**
 * EventBus.js
 * Patrón Pub/Sub para desacoplar la UI de la lógica de negocio.
 */
export class EventBus {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    // Retorna una función para desuscribirse
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  emit(event, payload) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => callback(payload));
  }
}
