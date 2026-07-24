'use client';
import { useState, useEffect } from 'react';
import { VentasController } from '@/controllers/ventasController';
import { SurtidorController } from '@/controllers/surtidorController';
import { useNativeAPIs } from '@/utils/useNativeAPIs';
import { useRouter } from 'next/navigation'; 

interface ISurtidorData { id: number; numero: number; combustible: string; capacidad: number; nivel: number; estado: string; }

export default function VentasPage() {
  const { hablar } = useNativeAPIs(); 
  const router = useRouter(); 
  
  const [surtidores, setSurtidores] = useState<ISurtidorData[]>([]);
  const [surtidorId, setSurtidorId] = useState('');
  const [combustible, setCombustible] = useState('');
  const [precioUnitario, setPrecioUnitario] = useState(0);
  const [litros, setLitros] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estado para la notificación flotante
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'success' });

  const showToast = (mensaje: string, tipo: 'success' | 'error' = 'success') => {
    setToast({ visible: true, mensaje, tipo });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 4000);
  };

  useEffect(() => {
    const cargarSurtidores = async () => {
      try {
        const data = await SurtidorController.listarSurtidores();
        const listaOrdenada = (data as ISurtidorData[]).sort((a, b) => a.numero - b.numero);
        setSurtidores(listaOrdenada);
        if (listaOrdenada.length > 0) manejarCambioSurtidor(listaOrdenada[0].id.toString(), listaOrdenada);
      } catch (e) { console.error(e); }
    };
    cargarSurtidores();
  }, []);

  const manejarCambioSurtidor = (id: string, listaSurtidores = surtidores) => {
    setSurtidorId(id);
    const surtidorSeleccionado = listaSurtidores.find(s => s.id.toString() === id);
    if (surtidorSeleccionado) {
      setCombustible(surtidorSeleccionado.combustible);
      if (surtidorSeleccionado.combustible === 'Gasolina') setPrecioUnitario(3.74);
      else if (surtidorSeleccionado.combustible === 'Diesel') setPrecioUnitario(3.72);
      else setPrecioUnitario(2.00);
    }
  };

  const totalCalculado = (parseFloat(litros) || 0) * precioUnitario;

  const handleVenta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!surtidorId) return showToast("Seleccione un surtidor.", "error");
    
    setLoading(true);
    try {
      await VentasController.registrarVenta('', parseInt(surtidorId), combustible, parseFloat(litros), precioUnitario);
      hablar(`Venta registrada exitosamente por ${totalCalculado.toFixed(2)} bolivianos.`);
      showToast("¡Venta registrada! El stock se actualizó automáticamente.", "success");
      setLitros('');
      router.refresh(); 
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto relative">

      {/* NOTIFICACIÓN FLOTANTE (TOAST) */}
      {toast.visible && (
        <div className={`fixed top-6 right-6 z-[9999] px-6 py-4 rounded-xl shadow-2xl font-bold text-white transform transition-all flex items-center gap-3 animate-bounce-short ${toast.tipo === 'success' ? 'bg-slate-900 border-l-4 border-green-500' : 'bg-red-600 border-l-4 border-white'}`}>
          <span className="text-2xl">{toast.tipo === 'success' ? '✅' : '⚠️'}</span>
          {toast.mensaje}
        </div>
      )}

      <div className="mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-bold text-slate-800">Punto de Venta Automático</h1>
        <p className="text-slate-500 mt-2">Facturación, despacho e inteligencia de inventario</p>
      </div>

      <form onSubmit={handleVenta} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div>
            <label className="block text-slate-700 font-semibold mb-2">Máquina Dispensadora</label>
            <select 
              className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-lg font-bold text-blue-700 cursor-pointer shadow-sm"
              value={surtidorId} onChange={(e) => manejarCambioSurtidor(e.target.value)} required
            >
              {surtidores.map(s => (
                <option key={s.id} value={s.id}>Surtidor #{s.numero} ({s.combustible})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-2">Combustible</label>
            <div className="w-full border border-gray-200 p-3 rounded-lg bg-gray-100 text-lg font-medium text-gray-500 cursor-not-allowed">
              {combustible ? `${combustible} (Bs ${precioUnitario.toFixed(2)})` : 'Seleccione'}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-slate-700 font-semibold mb-2">Cantidad a Dispensar (Litros/m³)</label>
          <input 
            type="number" step="0.01" required
            className="w-full border border-slate-300 p-4 rounded-lg text-3xl font-mono focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 text-slate-800"
            placeholder="0.00" value={litros} onChange={(e) => setLitros(e.target.value)}
          />
        </div>

        <div className="bg-slate-900 p-6 rounded-xl mb-8 flex justify-between items-center shadow-inner">
          <span className="text-slate-300 font-medium text-xl">Total a Cobrar:</span>
          <span className="text-5xl font-bold text-green-400 font-mono tracking-wider">Bs. {totalCalculado.toFixed(2)}</span>
        </div>

        <button 
          type="submit" disabled={loading || surtidores.length === 0}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 shadow-md transition-all transform active:scale-[0.99] text-xl disabled:bg-gray-400"
        >
          {loading ? 'Procesando Transacción...' : 'Confirmar Venta y Descontar Stock'}
        </button>
      </form>
    </div>
  );
}