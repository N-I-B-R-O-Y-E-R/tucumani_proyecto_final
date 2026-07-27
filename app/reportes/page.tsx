'use client';
import { useEffect, useState } from 'react';
import { VentasController } from '@/controllers/ventasController';
import { db } from '@/services/DatabaseAdapter';
import { BinaryMath } from '@/utils/binaryLogic';
import { useNativeAPIs } from '@/utils/useNativeAPIs';

interface IVenta { id: number; fecha: string; combustible: string; litros: number; total: number; }
interface IEvento { id: number; surtidor_id: number; tipo: string; fecha: string; estado: string; }

export default function ReportesPage() {
  const [ventas, setVentas] = useState<IVenta[]>([]);
  const [eventos, setEventos] = useState<IEvento[]>([]);
  const [vistaActiva, setVistaActiva] = useState<'ventas' | 'eventos'>('ventas');
  const { copiarAlPortapapeles } = useNativeAPIs();

  useEffect(() => {
    const cargarDatos = async () => {
      const dataVentas = await VentasController.obtenerHistorialVentas();
      setVentas((dataVentas as IVenta[]).sort((a,b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()));

      const dataEventos = await db.get('Alertas');
      setEventos((dataEventos as IEvento[]).sort((a,b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()));
    };
    cargarDatos();
  }, []);

  const exportarCSV = () => {
    const esVentas = vistaActiva === 'ventas';
    let csvContent = "\uFEFF"; 
    
    if (esVentas) {
      csvContent += "ID Transaccion;Fecha;Combustible;Litros;Total (Bs)\n";
      ventas.forEach(v => {
        csvContent += `${v.id};"${new Date(v.fecha).toLocaleString()}";"${v.combustible}";${v.litros};${v.total.toFixed(2)}\n`;
      });
    } else {
      csvContent += "ID Evento;Fecha;Surtidor Afectado;Detalle Movimiento;Estado Sistema\n";
      eventos.forEach(e => {
        csvContent += `${e.id};"${new Date(e.fecha).toLocaleString()}";"Surtidor ${e.surtidor_id}";"${e.tipo}";"${e.estado}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `CosmosGas_${vistaActiva}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  const exportarPDF = () => { window.print(); };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto printable-area">
      {/* Cabecera responsiva */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 no-print">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Auditoría y Reportes</h1>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button onClick={exportarCSV} className="flex-1 md:flex-none justify-center bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 text-sm font-bold">📊 Excel / CSV</button>
          <button onClick={exportarPDF} className="flex-1 md:flex-none justify-center bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 text-sm font-bold">📄 Generar PDF</button>
        </div>
      </div>

      {/* Pestañas con scroll horizontal en móviles */}
      <div className="flex gap-4 md:gap-8 mb-6 border-b border-gray-300 no-print overflow-x-auto whitespace-nowrap scrollbar-hide">
        <button onClick={() => setVistaActiva('ventas')} className={`pb-3 px-2 font-bold text-base md:text-lg transition-all ${vistaActiva === 'ventas' ? 'border-b-4 border-blue-600 text-blue-700' : 'text-gray-500 hover:text-gray-800'}`}>💰 Historial de Ventas</button>
        <button onClick={() => setVistaActiva('eventos')} className={`pb-3 px-2 font-bold text-base md:text-lg transition-all ${vistaActiva === 'eventos' ? 'border-b-4 border-blue-600 text-blue-700' : 'text-gray-500 hover:text-gray-800'}`}>📋 Registro de Recargas y Fallos</button>
      </div>

      {vistaActiva === 'ventas' && (
        <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
          {/* Contenedor que permite deslizar la tabla hacia los lados */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-800 text-white">
                  <th className="p-4">Transacción</th><th className="p-4">Fecha</th><th className="p-4">Combustible</th><th className="p-4">Litros</th><th className="p-4">Total (Decimal)</th><th className="p-4 bg-slate-900 text-blue-300 font-mono">Total (Binario)</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map((v) => (
                  <tr key={v.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-700">#{v.id}</td><td className="p-4">{new Date(v.fecha).toLocaleString()}</td><td className="p-4"><span className="px-2 py-1 bg-gray-200 rounded text-sm">{v.combustible}</span></td><td className="p-4">{v.litros} L</td><td className="p-4 font-bold text-green-600">Bs. {v.total.toFixed(2)}</td><td className="p-4 font-mono text-gray-500">{BinaryMath.decimalABinario(v.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {vistaActiva === 'eventos' && (
        <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200 animate-fade-in">
          {/* Contenedor que permite deslizar la tabla hacia los lados */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-800 text-white">
                  <th className="p-4">ID Evento</th><th className="p-4">Fecha y Hora</th><th className="p-4">Surtidor Afectado</th><th className="p-4">Detalle del Movimiento</th><th className="p-4 text-center">Estado del Sistema</th>
                </tr>
              </thead>
              <tbody>
                {eventos.map((e) => (
                  <tr key={e.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-700">#{e.id}</td><td className="p-4">{new Date(e.fecha).toLocaleString()}</td><td className="p-4 font-bold text-blue-600">Surtidor {e.surtidor_id}</td><td className="p-4 font-medium text-gray-800">{e.tipo}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm whitespace-nowrap ${e.estado === 'Resuelta' ? 'bg-green-100 text-green-700' : e.estado === 'Informativo' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700 animate-pulse'}`}>{e.estado}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}