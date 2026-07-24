export interface ISurtidor {
  tipo: string;
  unidad: string;
  dispensar(litros: number): void;
}

class SurtidorGasolina implements ISurtidor {
  tipo = "Gasolina";
  unidad = "Litros";
  dispensar(litros: number) { console.log(`Dispensando ${litros}L de Gasolina`); }
}

class SurtidorDiesel implements ISurtidor {
  tipo = "Diesel";
  unidad = "Litros";
  dispensar(litros: number) { console.log(`Dispensando ${litros}L de Diesel`); }
}

class SurtidorGNV implements ISurtidor {
  tipo = "GNV";
  unidad = "Metros Cúbicos";
  dispensar(litros: number) { console.log(`Dispensando ${litros}L de GNV`); }
}

export class SurtidorFactory {
  static crear(tipo: string): ISurtidor {
    switch (tipo.toLowerCase()) {
      case "gasolina": return new SurtidorGasolina();
      case "diesel": return new SurtidorDiesel();
      case "gnv": return new SurtidorGNV();
      default: throw new Error("Tipo de combustible no soportado");
    }
  }

  static crearSurtidor(tipo: string): ISurtidor {
    return this.crear(tipo);
  }
}