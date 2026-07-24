'use client';
import { useState, useEffect } from 'react';
import { SurtidorController } from '@/controllers/surtidorController';
import { useRouter } from 'next/navigation';

interface ISurtidorData { id: number; numero: number; combustible: string; capacidad: number; nivel: number; estado: string; }

export default function SurtidoresPage() {
  const [surtidores, setSurtidores] = useState<ISurtidorData[]>([]);
  const [loading, setLoading] = useState(false);
  const [numero, setNumero] = useState('');
  const [combustible, setCombustible] = useState('Gasolina');
  const [capacidad, setCapacidad] = useState('10000');
  const router = useRouter();

  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'success' });
  const [modal, setModal] = useState({ isOpen: false, id: 0, numero: 0, nivelActual: 0, capacidadMaxima: 0 });
  const [litrosRecarga, setLitrosRecarga] = useState('');

  const showToast = (mensaje: string, tipo: 'success' | 'error' = 'success') => {
    setToast({ visible: true, mensaje, tipo });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 4000);
  };

  const cargarSurtidores = async () => {
    const data = await SurtidorController.listarSurtidores();
    setSurtidores((data as ISurtidorData[]).sort((a, b) => a.numero - b.numero));
  };

  useEffect(() => { cargarSurtidores(); }, []);

  const handleCrearSurtidor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await SurtidorController.crearSurtidor(parseInt(numero), combustible, parseFloat(capacidad));
      showToast("Surtidor creado y enlazado correctamente.", "success");
      setNumero(''); cargarSurtidores(); router.refresh();
    } catch (err: any) {
      if (err.message.includes('duplicate key')) showToast("Ese número ya existe. Elige otro.", "error");
      else showToast("Error al crear surtidor.", "error");
    } finally { setLoading(false); }
  };

  const confirmarRecarga = async (e: React.FormEvent) => {
    e.preventDefault();
    const cantidad = parseFloat(litrosRecarga);
    if (isNaN(cantidad) || cantidad <= 0) return showToast("Ingrese una cantidad válida mayor a 0", "error");

    try {
      await SurtidorController.recargarSurtidor(modal.id, modal.nivelActual, cantidad, modal.capacidadMaxima);
      showToast(`Recarga de ${cantidad}L procesada exitosamente.`, "success");
      setModal({ ...modal, isOpen: false });
      setLitrosRecarga('');
      cargarSurtidores(); 
      router.refresh();
    } catch (error: any) {
      showToast(`Error al recargar: ${error.message}`, "error");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto relative">
      
      {/* NOTIFICACIÓN FLOTANTE (TOAST) */}
      {toast.visible && (
        <div className={`fixed top-6 right-6 z-[9999] px-6 py-4 rounded-xl shadow-2xl font-bold text-white transform transition-all flex items-center gap-3 animate-bounce-short ${toast.tipo === 'success' ? 'bg-slate-900 border-l-4 border-green-500' : 'bg-red-600 border-l-4 border-white'}`}>
          <span className="text-2xl">{toast.tipo === 'success' ? '✅' : '⚠️'}</span>
          {toast.mensaje}
        </div>
      )}

      {/* VENTANA MODAL DE RECARGA */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="bg-slate-900 p-6 text-white">
              <h2 className="text-2xl font-bold flex items-center gap-2">🚚 Ingreso por Cisterna</h2>
              <p className="text-slate-300 text-sm mt-1">Surtidor #{modal.numero}</p>
            </div>
            <form onSubmit={confirmarRecarga} className="p-6">
              <div className="mb-6">
                <label className="block text-slate-700 font-bold mb-2">Cantidad a depositar (Litros/m³)</label>
                <input 
                  type="number" step="0.01" required autoFocus
                  className="w-full border-2 border-slate-200 p-4 rounded-xl text-2xl font-mono focus:border-blue-500 focus:ring-0 outline-none"
                  placeholder="Ej: 5000"
                  value={litrosRecarga} onChange={(e) => setLitrosRecarga(e.target.value)}
                />
                <p className="text-sm text-slate-500 mt-2 font-medium">
                  Espacio máximo disponible: <span className="text-blue-600">{(modal.capacidadMaxima - modal.nivelActual).toFixed(2)} L</span>
                </p>
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setModal({ ...modal, isOpen: false })} className="px-5 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition">
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition transform active:scale-95">
                  Confirmar Recarga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Surtidores</h1>
          <p className="text-gray-500 mt-1">Administración y control de hardware de dispensación</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200 h-fit">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">➕ Nuevo Surtidor</h2>
          <form onSubmit={handleCrearSurtidor} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
              <input type="number" required value={numero} onChange={(e) => setNumero(e.target.value)} className="w-full border p-2 rounded bg-gray-50 focus:bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Combustible</label>
              <select value={combustible} onChange={(e) => setCombustible(e.target.value)} className="w-full border p-2 rounded bg-gray-50 focus:bg-white">
                <option value="Gasolina">Gasolina</option><option value="Diesel">Diesel</option><option value="GNV">GNV</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad Máxima</label>
              <input type="number" required value={capacidad} onChange={(e) => setCapacidad(e.target.value)} className="w-full border p-2 rounded bg-gray-50 focus:bg-white" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-bold py-2 rounded hover:bg-slate-800 transition">
              {loading ? 'Registrando...' : 'Dar de Alta'}
            </button>
          </form>
        </div>
        
        <div className="lg:col-span-2 bg-white rounded-xl shadow overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b">
                <th className="p-4">Máquina</th>
                <th className="p-4">Combustible</th>
                <th className="p-4">Nivel Actual</th>
                <th className="p-4 text-center">Estado</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {surtidores.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 font-bold text-blue-600">Surtidor #{s.numero}</td>
                  <td className="p-4 font-medium">{s.combustible}</td>
                  <td className="p-4 font-mono text-gray-600">
                    <span className={s.nivel < (s.capacidad * 0.15) ? "text-red-500 font-bold" : ""}>{s.nivel.toFixed(2)}</span> / {s.capacidad}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${s.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {s.estado}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => setModal({ isOpen: true, id: s.id, numero: s.numero, nivelActual: s.nivel, capacidadMaxima: s.capacidad })}
                      disabled={s.nivel >= s.capacidad}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-bold shadow transition transform active:scale-95"
                    >
                      {s.nivel >= s.capacidad ? 'Lleno' : 'Recargar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}