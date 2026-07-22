import { db } from '@/services/DatabaseAdapter';
import { SurtidorFactory } from '@/models/SurtidorFactory';

export async function getDashboardData() {
  try {
    const surtidoresRaw = await db.get('surtidores');
    const ventasRaw = await db.get('ventas');
    const alertasRaw = await db.get('alertas', { estado: false }); 

    if (!surtidoresRaw || surtidoresRaw.length === 0) {
      console.warn("No hay surtidores en la base de datos.");
      return { surtidores: [], totalVentasHoy: "0.00", alertasActivas: 0 };
    }

    const surtidores = surtidoresRaw.map(row => {
      const surtidor = SurtidorFactory.crearSurtidor(row.combustible, row.numero, row.capacidad);
      surtidor.nivel_actual = row.nivel;
      surtidor.estadoBinario = row.estado_binario;
      return surtidor;
    });

    const totalVentasHoy = ventasRaw.reduce((acc, venta) => acc + Number(venta.total || 0), 0);

    return {
      surtidores: surtidores.sort((a, b) => a.numero - b.numero), 
      totalVentasHoy: totalVentasHoy.toFixed(2),
      alertasActivas: alertasRaw ? alertasRaw.length : 0
    };

  } catch (error) {
    console.error("Error en getDashboardData:", error);
    return { surtidores: [], totalVentasHoy: "0.00", alertasActivas: 0 };
  }
}