import { getDashboardData } from '@/controllers/dashboardController';
import SurtidorCard from '@/components/Dashboard/SurtidorCard';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Dashboard Operativo</h1>
          <p className="text-gray-500">Monitoreo en tiempo real de la estación de servicio</p>
        </header>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-sm font-medium text-gray-500">Ingresos (Ventas realizadas por empleados hoy)</h2>
            <p className="text-3xl font-bold text-gray-900">Bs. {data.totalVentasHoy}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 border-l-4 border-l-red-500">
            <h2 className="text-sm font-medium text-gray-500">Alertas Críticas Pendientes</h2>
            <p className="text-3xl font-bold text-red-600">{data.alertasActivas}</p>
          </div>
        </div>

        {/* Cuadrícula de Surtidores */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Estado de Surtidores</h2>
        {data.surtidores.length === 0 ? (
          <p className="text-red-500">No se pudieron cargar los surtidores. Revisa tu .env.local y Supabase.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.surtidores.map((surtidor) => (
              <SurtidorCard key={surtidor.numero} surtidor={surtidor} />
            ))}
          </div>
        )}

      </div>
    </main>
  );
}