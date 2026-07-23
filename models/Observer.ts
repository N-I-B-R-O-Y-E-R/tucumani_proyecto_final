import { db } from '@/services/DatabaseAdapter';

export interface Observer {
  update(surtidorId: string, nivel: number, capacidad: number): void;
}

export class AlertaObserver implements Observer {
  async update(surtidorId: string, nivel: number, capacidad: number) {
    const porcentaje = (nivel / capacidad) * 100;
    if (porcentaje < 20) {
      await db.insert('alertas', {
        surtidor_id: surtidorId,
        tipo: 'Nivel Crítico (<20%)',
        estado: false
      });
    }
  }
}

export class SurtidorSubject {
  private observers: Observer[] = [];

  addObserver(observer: Observer) {
    this.observers.push(observer);
  }

  async notify(surtidorId: string, nivel: number, capacidad: number) {
    for (const observer of this.observers) {
      await observer.update(surtidorId, nivel, capacidad);
    }
  }
}