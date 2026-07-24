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
      // 1. Validar el surtidor y su stock actual
      const surtidores = await db.get('Surtidores', { id: surtidorId }) as any[];
      if (!surtidores || surtidores.length === 0) {
        throw new Error("El surtidor seleccionado no existe en la base de datos.");
      }
      
      const surtidor = surtidores[0];

      if (surtidor.nivel < litros) {
        throw new Error(`Stock insuficiente. El surtidor solo tiene ${surtidor.nivel.toFixed(2)} litros/m³.`);
      }

      // 2. Descontar el combustible del tanque
      const nuevoNivel = surtidor.nivel - litros;
      await db.update('Surtidores', surtidorId.toString(), {
        nivel: nuevoNivel,
        estado: nuevoNivel < (surtidor.capacidad * 0.15) ? 'Crítico' : 'Activo'
      });

      // 3. Registrar la venta financiera (CORREGIDO: precio_unitario)
      const total = litros * precio;
      const resultado = await db.insert('Ventas', {
        surtidor_id: surtidorId,
        combustible: combustible,
        litros: litros,
        precio_unitario: precio, // <--- Aquí estaba el error, ahora coincide con la BD
        total: total,
        fecha: new Date().toISOString()
      });

      // 4. Si el nivel bajó del 15%, disparar una Alerta automática (Patrón Observer)
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