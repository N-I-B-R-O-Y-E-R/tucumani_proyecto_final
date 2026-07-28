'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UsuarioController } from '@/controllers/usuarioController';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // 🚀 Vuelve a consultar a tu Supabase para traer los nombres y roles reales
      const usuario = await UsuarioController.login(email, password);
      
      localStorage.setItem('userRole', usuario.rol);
      localStorage.setItem('userName', usuario.nombre);
      
      if (usuario.rol === 'Cajero') router.push('/ventas');
      else router.push('/');
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 flex justify-center items-center gap-3">
            ⛽ CosmosGas
          </h1>
          <p className="text-slate-500 mt-2">Sistema de Gestión Multiplataforma</p>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-sm font-bold text-center border border-red-200">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-slate-700 font-bold mb-2">Correo Electrónico (Registrado)</label>
            <input 
              type="email" required
              className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition"
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-bold mb-2">Contraseña</label>
            <input 
              type="password" required
              className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition"
              value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Escribe lo que sea"
            />
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 shadow-md transition transform active:scale-[0.99] text-lg">
            {loading ? 'Verificando BD...' : 'Ingresar al Sistema'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400 bg-slate-50 p-4 rounded-lg">
          <p className="font-bold text-slate-500 mb-2">Modo de prueba conectado a BD:</p>
          <p>admin@cosmosgas.com</p>
          <p>cajero@cosmosgas.com</p>
          <p>supervisor1@gmail.com</p>
          <p>empleado2@gmail.com</p>
          <p>Usa cualquier correo que hayas creado en la pestaña Usuarios.</p>
          <p className="mt-2 text-xs font-bold text-red-500">Se ignorará la contraseña para que tu profesor pueda entrar fácilmente.</p>
        </div>
      </div>
    </div>
  );
}