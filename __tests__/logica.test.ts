import { describe, expect, test } from '@jest/globals';
import { codificarEstado, decodificarEstado, ESTADOS_VENTA } from '../utils/binaryLogic';
import { SurtidorFactory } from '../models/SurtidorFactory';

describe('Pruebas Unitarias del Sistema', () => {
  
  test('Aritmética Binaria: Codifica y Decodifica estados correctamente', () => {
    // Simulamos una venta Nueva (1) y Pagada (2)
    const estadoCodificado = codificarEstado([ESTADOS_VENTA.NUEVA, ESTADOS_VENTA.PAGADA]);
    expect(estadoCodificado).toBe(3); // 1 + 2 = 3

    const estadoDecodificado = decodificarEstado(3);
    expect(estadoDecodificado).toBe('Nueva + Pagada');
  });

  test('Patrón Factory: Crea surtidores con la unidad correcta', () => {
    const surtidorGasolina = SurtidorFactory.crearSurtidor('Gasolina', 1, 5000);
    expect(surtidorGasolina.unidad).toBe('Litros');

    const surtidorGNV = SurtidorFactory.crearSurtidor('GNV', 2, 2000);
    expect(surtidorGNV.unidad).toBe('m3'); // Regla de negocio específica
  });

});