import { getDashboardData } from '@/controllers/dashboardController';
import SurtidorCard from '@/components/Dashboard/SurtidorCard';

// Elimina el caché para tener datos en vivo siempre
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Dashboard Operativo</h1>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-sm font-medium text-gray-500">Ingresos Totales (Hoy)</h2>
          <p className="text-3xl font-bold text-gray-900">Bs. {data.totalVentasHoy}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-l-red-500">
          <h2 className="text-sm font-medium text-gray-500">Alertas Críticas</h2>
          <p className="text-3xl font-bold text-red-600">{data.alertasActivas}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.surtidores.map((surtidor: any) => (
          <SurtidorCard key={surtidor.numero} surtidor={surtidor} />
        ))}
      </div>
    </main>
  );
}