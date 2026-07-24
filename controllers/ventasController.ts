import { db } from '../services/DatabaseAdapter';

export class VentasController {
  static async registrarVenta(
    _ignorado: string, 
    surtidorId: number, 
    combustible: string, 
    litros: number, 
    precio: number
  ) {
    try {
      const surtidores = await db.get('Surtidores', { id: surtidorId }) as any[];
      if (!surtidores || surtidores.length === 0) {
        throw new Error("El surtidor seleccionado no existe en la base de datos.");
      }
      
      const surtidor = surtidores[0];

      if (surtidor.nivel < litros) {
        throw new Error(`Stock insuficiente. El surtidor solo tiene ${surtidor.nivel.toFixed(2)} litros/m³.`);
      }

      const nuevoNivel = surtidor.nivel - litros;
      await db.update('Surtidores', surtidorId.toString(), {
        nivel: nuevoNivel,
        estado: nuevoNivel < (surtidor.capacidad * 0.15) ? 'Crítico' : 'Activo'
      });

      const total = litros * precio;
      const resultado = await db.insert('Ventas', {
        surtidor_id: surtidorId,
        combustible: combustible,
        litros: litros,
        precio_unitario: precio, 
        total: total,
        fecha: new Date().toISOString()
      });

      if (nuevoNivel < (surtidor.capacidad * 0.15)) {
        await db.insert('Alertas', {
          surtidor_id: surtidorId,
          tipo: 'Nivel Bajo',
          fecha: new Date().toISOString(),
          estado: 'Pendiente'
        });
      }

      return resultado;
    } catch (err: any) {
      throw new Error(err.message || String(err));
    }
  }

  static async obtenerHistorialVentas() {
    try {
      return await db.get('Ventas');
    } catch (err: any) {
      throw new Error(err.message || String(err));
    }
  }
}