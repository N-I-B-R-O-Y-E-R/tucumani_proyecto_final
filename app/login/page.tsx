'use client';
import { useState } from 'react';
import { db } from '@/services/DatabaseAdapter';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      // 1. Intentar iniciar sesión
      const { error: authError } = await db.client.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (authError) {
        // Si Supabase lo rechaza, mostramos el error y soltamos el botón
        setError('Error: ' + authError.message);
        setCargando(false);
      } else {
        // 2. Si entra, forzamos la recarga de página directo a la raíz. 
        // Esto ignora cualquier traba de Next.js.
        window.location.href = '/';
      }
    } catch (err: any) {
      // 3. Si hay un error de red o de código, destrabamos el botón
      console.error(err);
      setError('Error interno de conexión. Revisa la consola.');
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 absolute top-0 left-0 w-full z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">Sistema Operativo</h1>
          <p className="text-gray-500 mt-2">Acceso Corporativo</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700 text-sm font-bold">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              required 
              className="block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 text-black" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input 
              type="password" 
              required 
              className="block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 text-black" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          <button 
            type="submit" 
            disabled={cargando} 
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition font-bold disabled:bg-gray-400"
          >
            {cargando ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}