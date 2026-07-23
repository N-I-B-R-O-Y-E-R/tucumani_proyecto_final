'use client';
import { useState, useEffect } from 'react';
import { db } from '@/services/DatabaseAdapter';

export default function SurtidoresCRUD() {
  const [surtidores, setSurtidores] = useState<any[]>([]);
  const [numero, setNumero] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [combustible, setCombustible] = useState('Gasolina');
  const [cargando, setCargando] = useState(false);

  useEffect(() => { cargarSurtidores(); }, []);
  
  const cargarSurtidores = async () => {
    try {
      setSurtidores(await db.get('surtidores') || []);
    } catch (e) { console.error(e); }
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    try {
      await db.insert('surtidores', { numero: Number(numero), capacidad: Number(capacidad), nivel: Number(capacidad), combustible, estado_binario: 1 });
      setNumero(''); setCapacidad('');
      cargarSurtidores();
    } catch (error) {
      console.error(error);
      alert("Hubo un error al crear el surtidor.");
    } finally {
      setCargando(false);
    }
  };

  const eliminar = async (id: string) => {
    if(confirm('¿Estás seguro de eliminar este surtidor?')) { 
      try {
        await db.delete('surtidores', id); 
        cargarSurtidores(); 
      } catch (e) { console.error(e); }
    }
  };

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900">Gestión de Surtidores (CRUD)</h1>
      
      <form onSubmit={guardar} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8 flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Número de Bomba</label>
          <input type="number" required className="border border-gray-300 rounded p-2 w-full" value={numero} onChange={e=>setNumero(e.target.value)}/>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Capacidad Máxima</label>
          <input type="number" required className="border border-gray-300 rounded p-2 w-full" value={capacidad} onChange={e=>setCapacidad(e.target.value)}/>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Tipo de Combustible</label>
          <select className="border border-gray-300 rounded p-2 w-full" value={combustible} onChange={e=>setCombustible(e.target.value)}>
            <option>Gasolina</option><option>Diesel</option><option>GNV</option>
          </select>
        </div>
        <button type="submit" disabled={cargando} className="bg-blue-600 text-white font-bold px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400">
          {cargando ? 'Guardando...' : 'Crear Surtidor'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {surtidores.map(s => (
          <div key={s.id} className="bg-white p-6 shadow-md rounded-xl border border-gray-100 relative">
            <h3 className="text-xl font-bold text-gray-800">Bomba #{s.numero}</h3>
            <p className="text-sm text-gray-600 mt-1"><span className="font-semibold">Combustible:</span> {s.combustible}</p>
            <p className="text-sm text-gray-600"><span className="font-semibold">Capacidad:</span> {s.capacidad}</p>
            <button onClick={() => eliminar(s.id)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-2 py-1 rounded">Eliminar</button>
          </div>
        ))}
      </div>
    </main>
  );
}