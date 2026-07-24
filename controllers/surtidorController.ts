import { db } from '../services/DatabaseAdapter';
import { SurtidorFactory } from '../models/SurtidorFactory';

export class SurtidorController {
  static async listarSurtidores() {
    try { return await db.get('Surtidores'); } 
    catch (err: any) { throw new Error(err.message || String(err)); }
  }

  static async crearSurtidor(numero: number, combustible: string, capacidad: number) {
    const surtidorObj = SurtidorFactory.crearSurtidor(combustible);
    try {
      return await db.insert('Surtidores', {
        numero, combustible: surtidorObj.tipo, capacidad, nivel: capacidad, estado: 'Activo'
      });
    } catch (error: any) { throw new Error(error.message || String(error)); }
  }

  static async recargarSurtidor(id: number, nivelActual: number, cantidad: number, capacidadMaxima: number) {
    try {
      let nuevoNivel = nivelActual + cantidad;
      if (nuevoNivel > capacidadMaxima) nuevoNivel = capacidadMaxima;

      const resultado = await db.update('Surtidores', id.toString(), {
        nivel: nuevoNivel, estado: 'Activo'
      });

      const alertasPendientes = await db.get('Alertas', { surtidor_id: id, estado: 'Pendiente' }) as any[];
      for (const alerta of alertasPendientes) {
        await db.update('Alertas', alerta.id.toString(), { estado: 'Resuelta' });
      }

      await db.insert('Alertas', {
        surtidor_id: id,
        tipo: `🚚 Ingreso de Cisterna: +${cantidad} L/m³`,
        fecha: new Date().toISOString(),
        estado: 'Informativo'
      });

      return resultado;
    } catch (error: any) {
      throw new Error(error.message || String(error));
    }
  }
}