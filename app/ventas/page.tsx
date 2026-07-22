'use client';
import { useState, useEffect } from 'react';
import { db } from '@/services/DatabaseAdapter';
import { ESTADOS_VENTA, codificarEstado, decodificarEstado } from '@/utils/binaryLogic';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Venta {
  id: string;
  fecha: string;
  combustible: string;
  litros: number;
  total: number;
}

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [litros, setLitros] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    fetchVentas();
  }, []);

  const fetchVentas = async () => {
    const data = await db.get('ventas');
    setVentas((data as Venta[]) || []);
  };

  const registrarVenta = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);

    const litrosNum = Number(litros);
    const precioFijo = 3.72; 
    const totalVenta = litrosNum * precioFijo;

    const estadoBinarioOperacion = codificarEstado([ESTADOS_VENTA.NUEVA, ESTADOS_VENTA.PAGADA]);

    try {
      await db.insert('ventas', {
        combustible: 'Gasolina',
        litros: litrosNum,
        precio: precioFijo,
        total: totalVenta,
      });
      alert(`Venta Registrada. Estado Interno: ${estadoBinarioOperacion}`);
      setLitros('');
      fetchVentas();
    } catch (error) {
      console.error("Error al registrar venta:", error);
    } finally {
      setCargando(false);
    }
  };

  const generarReportePDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Reporte Corporativo de Ventas', 14, 22);
    doc.setFontSize(11);
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 14, 30);

    const datosTabla = ventas.map((v) => [
      v.id.substring(0, 8),
      new Date(v.fecha).toLocaleString(),
      v.combustible,
      v.litros,
      `Bs. ${v.total}`,
      decodificarEstado(3) 
    ]);

    (doc as any).autoTable({
      startY: 40,
      head: [['ID', 'Fecha', 'Combustible', 'Litros', 'Total', 'Estado (Decodificado)']],
      body: datosTabla,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] }
    });

    doc.save('Reporte_Ventas_Empresa.pdf');
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Módulo de Ventas</h1>
          <button 
            onClick={generarReportePDF}
            className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 font-bold transition"
          >
            Descargar Reporte PDF
          </button>
        </header>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
          <h2 className="text-xl font-bold mb-4 text-black">Registrar Nueva Venta</h2>
          <form onSubmit={registrarVenta} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Litros (Gasolina)</label>
              <input 
                type="number" 
                required
                min="1"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                value={litros}
                onChange={(e) => setLitros(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              disabled={cargando}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 font-bold"
            >
              {cargando ? 'Procesando...' : 'Cobrar Venta'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Combustible</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Litros</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-black">
              {ventas.map((venta) => (
                <tr key={venta.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(venta.fecha).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{venta.combustible}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{venta.litros} L</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">Bs. {venta.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}