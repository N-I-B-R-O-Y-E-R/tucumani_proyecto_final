'use client';
import { useState, useEffect } from 'react';
import { db } from '@/services/DatabaseAdapter';
import { ESTADOS_VENTA, codificarEstado, decodificarEstado } from '@/utils/binaryLogic';
import { SurtidorSubject, AlertaObserver } from '@/models/Observer';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Venta { id: string; fecha: string; combustible: string; litros: number; total: number; surtidor_id: string; }
interface SurtidorData { id: string; numero: number; combustible: string; nivel: number; capacidad: number; }

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [surtidores, setSurtidores] = useState<SurtidorData[]>([]);
  const [litros, setLitros] = useState('');
  const [surtidorId, setSurtidorId] = useState('');
  const [cargando, setCargando] = useState(false);
  const [escuchando, setEscuchando] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setVentas((await db.get('ventas') as Venta[]) || []);
      setSurtidores((await db.get('surtidores') as SurtidorData[]) || []);
    } catch (e) { console.error(e); }
  };

  const iniciarDictado = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Tu navegador no soporta Web Speech API");
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.onstart = () => setEscuchando(true);
    recognition.onresult = (event: any) => {
      const texto = event.results[0][0].transcript;
      const numeroLitros = texto.replace(/[^0-9]/g, '');
      if(numeroLitros) setLitros(numeroLitros);
      setEscuchando(false);
    };
    recognition.onerror = () => setEscuchando(false);
    recognition.start();
  };

  const copiarRecibo = async (venta: Venta) => {
    const texto = `Recibo Venta ID: ${venta.id}\nCombustible: ${venta.combustible}\nLitros: ${venta.litros}\nTotal: Bs. ${venta.total}`;
    await navigator.clipboard.writeText(texto);
    alert("Recibo copiado al portapapeles!");
  };

  const registrarVenta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!surtidorId || !litros) return alert("Complete los datos");
    setCargando(true);

    const litrosNum = Number(litros);
    const surtidor = surtidores.find(s => s.id === surtidorId);
    if(!surtidor) return setCargando(false);

    const totalVenta = parseFloat((litrosNum * 3.72).toFixed(2));
    const nuevoNivel = surtidor.nivel - litrosNum;
    const estadoBinario = codificarEstado([ESTADOS_VENTA.NUEVA, ESTADOS_VENTA.PAGADA]);

    try {
      await db.insert('ventas', { combustible: surtidor.combustible, litros: litrosNum, precio: 3.72, total: totalVenta, surtidor_id: surtidorId });
      await db.update('surtidores', surtidorId, { nivel: nuevoNivel });
      
      const monitor = new SurtidorSubject();
      monitor.addObserver(new AlertaObserver());
      await monitor.notify(surtidorId, nuevoNivel, surtidor.capacidad);

      setLitros('');
      fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.text('Reporte de Ventas', 14, 20);
    const datos = ventas.map((v) => [v.id.substring(0, 8), new Date(v.fecha).toLocaleDateString(), v.combustible, v.litros, `Bs. ${v.total}`, decodificarEstado(3)]);
    (doc as any).autoTable({ startY: 30, head: [['ID', 'Fecha', 'Tipo', 'Litros', 'Total', 'Estado']], body: datos });
    doc.save('Reporte_Ventas.pdf');
  };

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between mb-8 items-center">
        <h1 className="text-3xl font-bold">Módulo de Ventas</h1>
        <button onClick={generarPDF} className="bg-green-600 text-white px-4 py-2 rounded font-bold shadow hover:bg-green-700">Generar PDF</button>
      </div>

      <form onSubmit={registrarVenta} className="bg-white p-6 rounded-xl shadow-md mb-8 flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Seleccionar Surtidor</label>
          <select required className="w-full p-2 border border-gray-300 rounded" value={surtidorId} onChange={e => setSurtidorId(e.target.value)}>
            <option value="">-- Seleccione --</option>
            {surtidores.map(s => <option key={s.id} value={s.id}>Bomba #{s.numero} - {s.combustible} (Disp: {s.nivel})</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Litros</label>
          <div className="flex gap-2">
            <input type="number" required min="1" step="0.1" className="w-full p-2 border border-gray-300 rounded" value={litros} onChange={e => setLitros(e.target.value)} />
            <button type="button" onClick={iniciarDictado} title="Dictar por voz" className={`p-2 rounded text-white ${escuchando ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}>🎤</button>
          </div>
        </div>
        <button type="submit" disabled={cargando} className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400">
          {cargando ? 'Cobrando...' : 'Cobrar Venta'}
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-800 text-white">
            <tr><th className="p-4 text-left font-medium">Fecha</th><th className="p-4 text-left font-medium">Combustible</th><th className="p-4 text-left font-medium">Total</th><th className="p-4 text-left font-medium">Acción</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {ventas.map(v => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="p-4 text-sm">{new Date(v.fecha).toLocaleDateString()}</td>
                <td className="p-4 text-sm">{v.combustible} ({v.litros} L)</td>
                <td className="p-4 font-bold text-green-600">Bs. {v.total}</td>
                <td className="p-4"><button onClick={() => copiarRecibo(v)} className="text-blue-600 hover:text-blue-800 text-sm font-semibold">Copiar Recibo</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}