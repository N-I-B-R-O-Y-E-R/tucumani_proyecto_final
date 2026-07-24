type ObserverFunction = (mensaje: string) => void;

export class AlertSubject {
  private observers: ObserverFunction[] = [];

  suscribir(observer: ObserverFunction) {
    this.observers.push(observer);
  }

  desuscribir(observerToRemove: ObserverFunction) {
    this.observers = this.observers.filter(obs => obs !== observerToRemove);
  }

  notificar(mensaje: string) {
    this.observers.forEach(observer => observer(mensaje));
  }
}

// Instancia global para usar en toda la app (ej. cuando el nivel baje)
export const alertSystem = new AlertSubject();