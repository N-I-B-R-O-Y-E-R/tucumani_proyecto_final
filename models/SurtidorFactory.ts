export interface Surtidor {
  id?: string;
  numero: number;
  combustible: string;
  capacidad: number;
  nivel_actual: number;
  estadoBinario: number;
  unidad: string;
}

class SurtidorBase implements Surtidor {
  id?: string;
  numero: number;
  combustible: string;
  capacidad: number;
  nivel_actual: number;
  estadoBinario: number;
  unidad: string = 'Unidades';

  constructor(numero: number, capacidad: number, combustible: string) {
    this.numero = numero;
    this.capacidad = capacidad;
    this.nivel_actual = capacidad;
    this.combustible = combustible;
    this.estadoBinario = 1;
  }
}

export class SurtidorFactory {
  static crearSurtidor(combustible: string, numero: number, capacidad: number): Surtidor {
    const surtidor = new SurtidorBase(numero, capacidad, combustible);
    if (combustible.toUpperCase() === 'GNV') {
      surtidor.unidad = 'm3';
    } else {
      surtidor.unidad = 'Litros';
    }
    return surtidor;
  }
}