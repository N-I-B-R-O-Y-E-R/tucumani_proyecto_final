'use client';
import { useEffect, useState } from 'react';
import { db } from '@/services/DatabaseAdapter';
import { SurtidorController } from '@/controllers/surtidorController';
import { useRouter } from 'next/navigation';

interface ISurtidor { id: number; numero: number; combustible: string; capacidad: number; nivel: number; estado: string; }
interface IAlerta { id: number; surtidor_id: number; tipo: string; estado: string; }
interface IVenta { id: number; combustible: string; litros: number; total: number; fecha: string; }

export default function DashboardPage() {
  const [surtidores, setSurtidores] = useState<ISurtidor[]>([]);
  const [alertas, setAlertas] = useState<IAlerta[]>([]);
  const [ventas, setVentas] = useState<IVenta[]>([]);
  const [vistaActiva, setVistaActiva] = useState<'operaciones' | 'finanzas'>('operaciones');
  const router = useRouter();

  const cargarDatos = async () => {
    try {
      const dataSurtidores = await SurtidorController.listarSurtidores();
      setSurtidores((dataSurtidores as ISurtidor[]).sort((a, b) => a.numero - b.numero));

      const dataAlertas = await db.get('Alertas', { estado: 'Pendiente' });
      setAlertas(dataAlertas as IAlerta[]);

      const dataVentas = await db.get('Ventas');
      setVentas(dataVentas as IVenta[]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const resolverAlerta = async (alertaId: number) => {
    try {
      await db.update('Alertas', alertaId.toString(), { estado: 'Resuelta' });
      cargarDatos(); 
      router.refresh();
    } catch (error) {
      console.error("Error al resolver alerta", error);
    }
  };

  const totalIngresos = ventas.reduce((acc, v) => acc + v.total, 0);
  const totalLitros = ventas.reduce((acc, v) => acc + v.litros, 0);
  
  const ventasGasolina = ventas.filter(v => v.combustible === 'Gasolina').reduce((acc, v) => acc + v.total, 0);
  const ventasDiesel = ventas.filter(v => v.combustible === 'Diesel').reduce((acc, v) => acc + v.total, 0);
  const ventasGNV = ventas.filter(v => v.combustible === 'GNV').reduce((acc, v) => acc + v.total, 0);

  const calcPorcentaje = (valor: number) => totalIngresos === 0 ? 0 : ((valor / totalIngresos) * 100).toFixed(1);

  const ventasRecientes = [...ventas].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).slice(0, 5);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      
      {/* HEADER DEL DASHBOARD */}
      <div className="flex justify-between items-end border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Centro de Comando</h1>
          <p className="text-slate-500 mt-1">Supervisión operativa y financiera en tiempo real</p>
        </div>
      </div>

      {/* PESTAÑAS DE NAVEGACIÓN */}
      <div className="flex gap-6 border-b border-gray-300">
        <button
          onClick={() => setVistaActiva('operaciones')}
          className={`pb-3 px-4 font-bold text-lg transition-all flex items-center gap-2 ${vistaActiva === 'operaciones' ? 'border-b-4 border-blue-600 text-blue-700' : 'text-gray-500 hover:text-gray-800'}`}
        >
          📡 Monitoreo Operativo
        </button>
        <button
          onClick={() => setVistaActiva('finanzas')}
          className={`pb-3 px-4 font-bold text-lg transition-all flex items-center gap-2 ${vistaActiva === 'finanzas' ? 'border-b-4 border-emerald-500 text-emerald-700' : 'text-gray-500 hover:text-gray-800'}`}
        >
          💰 Resumen de Ingresos
        </button>
      </div>

      {/* =========================================
          VISTA 1: OPERACIONES (Surtidores y Alertas) 
          ========================================= */}
      {vistaActiva === 'operaciones' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          
          {/* Panel de Alertas */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">⚠️ Panel de Alertas</h2>
            <div className="space-y-3">
              {alertas.length === 0 ? (
                <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 font-medium">
                  ✅ Todos los sistemas operando con normalidad.
                </div>
              ) : (
                alertas.map(alerta => (
                  <div key={alerta.id} className="p-3 bg-red-50 border-l-4 border-red-500 rounded shadow-sm flex justify-between items-center">
                    <div>
                      <span className="font-bold text-red-700 block text-sm">Surtidor #{alerta.surtidor_id}</span>
                      <span className="text-red-600 text-sm">{alerta.tipo}</span>
                    </div>
                    <button 
                      onClick={() => resolverAlerta(alerta.id)}
                      className="bg-red-200 hover:bg-red-300 text-red-800 px-3 py-1 rounded text-xs font-bold transition"
                      title="Forzar limpieza de alerta"
                    >
                      ✓ Ok
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Monitoreo en Vivo (Diseño Original Intacto) */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Monitoreo de Surtidores en Vivo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {surtidores.map((surtidor) => {
                const porcentaje = (surtidor.nivel / surtidor.capacidad) * 100;
                const isCritico = porcentaje < 15;

                return (
                  <div key={surtidor.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">Surtidor #{surtidor.numero}</h3>
                        <p className="text-sm text-slate-500 font-medium">{surtidor.combustible}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${isCritico ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {isCritico ? 'Crítico' : 'Activo'}
                      </span>
                    </div>
                    
                    <div>
                      <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${isCritico ? 'bg-red-500' : 'bg-green-500'}`} 
                          style={{ width: `${porcentaje}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-end text-xs font-mono text-slate-500">
                        {surtidor.nivel.toFixed(2)}L / {surtidor.capacidad}L
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          VISTA 2: FINANZAS E INGRESOS 
          ========================================= */}
      {vistaActiva === 'finanzas' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Tarjetas KPI (Key Performance Indicators) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-emerald-500">
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Ingresos Totales</p>
              <h3 className="text-4xl font-bold text-slate-800 mt-2">Bs. {totalIngresos.toFixed(2)}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-blue-500">
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Volumen Despachado</p>
              <h3 className="text-4xl font-bold text-slate-800 mt-2">{totalLitros.toFixed(2)} <span className="text-2xl text-slate-400">L/m³</span></h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-indigo-500">
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Total de Transacciones</p>
              <h3 className="text-4xl font-bold text-slate-800 mt-2">{ventas.length} <span className="text-2xl text-slate-400">Ventas</span></h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Barras: Distribución de Ingresos */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Distribución de Ingresos</h3>
              
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                    <span>Gasolina Especial</span>
                    <span>{calcPorcentaje(ventasGasolina)}% (Bs. {ventasGasolina.toFixed(2)})</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                    <div className="bg-yellow-400 h-4 rounded-full" style={{ width: `${calcPorcentaje(ventasGasolina)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                    <span>Diesel</span>
                    <span>{calcPorcentaje(ventasDiesel)}% (Bs. {ventasDiesel.toFixed(2)})</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                    <div className="bg-slate-800 h-4 rounded-full" style={{ width: `${calcPorcentaje(ventasDiesel)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                    <span>GNV</span>
                    <span>{calcPorcentaje(ventasGNV)}% (Bs. {ventasGNV.toFixed(2)})</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                    <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${calcPorcentaje(ventasGNV)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla Rápida: Últimas Transacciones */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Transacciones Recientes</h3>
                <button onClick={() => router.push('/reportes')} className="text-sm text-blue-600 font-bold hover:underline">Ver todo</button>
              </div>
              
              {ventasRecientes.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No hay ventas registradas aún.</p>
              ) : (
                <div className="space-y-4">
                  {ventasRecientes.map(venta => (
                    <div key={venta.id} className="flex justify-between items-center border-b border-slate-100 pb-3 last:border-0">
                      <div>
                        <p className="font-bold text-slate-700 text-sm">{venta.combustible} <span className="text-slate-400 font-normal">({venta.litros}L)</span></p>
                        <p className="text-xs text-slate-400">{new Date(venta.fecha).toLocaleString()}</p>
                      </div>
                      <div className="font-bold text-emerald-600">
                        + Bs. {venta.total.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}