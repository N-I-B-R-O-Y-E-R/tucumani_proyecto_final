class Surtidor {
  constructor(numero, capacidad) {
    this.numero = numero;
    this.capacidad = capacidad;
    this.nivel_actual = capacidad;
    this.estadoBinario = 1; 
  }
}

class SurtidorGasolina extends Surtidor {
  constructor(numero, capacidad) {
    super(numero, capacidad);
    this.combustible = 'Gasolina';
    this.unidad = 'Litros';
  }
}

class SurtidorGNV extends Surtidor {
  constructor(numero, capacidad) {
    super(numero, capacidad);
    this.combustible = 'GNV';
    this.unidad = 'Metros Cúbicos';
  }
}

export class SurtidorFactory {
  static crearSurtidor(tipo, numero, capacidad) {
    switch (tipo.toUpperCase()) {
      case 'GASOLINA':
      case 'DIESEL':
        return new SurtidorGasolina(numero, capacidad);
      case 'GNV':
        return new SurtidorGNV(numero, capacidad);
      default:
        throw new Error(`Tipo de combustible no soportado: ${tipo}`);
    }
  }
}