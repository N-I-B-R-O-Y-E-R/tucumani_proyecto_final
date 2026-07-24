import { db } from '../services/DatabaseAdapter';

export class DashboardController {
  static async obtenerEstadisticas() {
    try {
      const surtidores = await db.get('Surtidores') as { id: number, numero: number, combustible: string, capacidad: number, nivel: number, estado: string }[];
      const alertas = await db.get('Alertas', { estado: 'Pendiente' }) as unknown[];
      const ventas = await db.get('Ventas') as { total: number }[];

      const totalIngresos = ventas.reduce((acc: number, venta: { total: number }) => acc + venta.total, 0);
      const combustibleTotal = surtidores.reduce((acc: number, surtidor: { nivel: number }) => acc + surtidor.nivel, 0);

      return {
        surtidores,
        alertasActivas: alertas.length,
        totalIngresos,
        combustibleTotal,
        ventasRealizadas: ventas.length
      };
    } catch (error) {
      console.error("Error cargando estadísticas del dashboard:", error);
      throw new Error("No se pudieron cargar los datos del sistema");
    }
  }
}