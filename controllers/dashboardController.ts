import { db } from '@/services/DatabaseAdapter';
import { SurtidorFactory } from '@/models/SurtidorFactory';

export async function getDashboardData() {
  try {
    const surtidoresRaw = await db.get('surtidores');
    const ventasRaw = await db.get('ventas');
    const alertasRaw = await db.get('alertas', { estado: false });

    const surtidores = (surtidoresRaw || []).map((row: any) => {
      // 1. Usamos la clase Factory
      const s = SurtidorFactory.crearSurtidor(row.combustible, row.numero, row.capacidad);
      s.id = row.id;
      s.nivel_actual = row.nivel;
      s.estadoBinario = row.estado_binario || 1;
      
      // 2. SOLUCIÓN: Convertimos la Clase a un Objeto Plano para que Next.js lo acepte
      return {
        id: s.id,
        numero: s.numero,
        combustible: s.combustible,
        capacidad: s.capacidad,
        nivel_actual: s.nivel_actual,
        estadoBinario: s.estadoBinario,
        unidad: s.unidad
      };
    });

    const totalVentasHoy = (ventasRaw || []).reduce((acc: number, v: any) => acc + Number(v.total || 0), 0);

    return {
      surtidores: surtidores.sort((a: any, b: any) => a.numero - b.numero),
      totalVentasHoy: totalVentasHoy.toFixed(2),
      alertasActivas: alertasRaw ? alertasRaw.length : 0
    };
  } catch (error) {
    console.error("Error cargando dashboard:", error);
    return { surtidores: [], totalVentasHoy: "0.00", alertasActivas: 0 };
  }
}