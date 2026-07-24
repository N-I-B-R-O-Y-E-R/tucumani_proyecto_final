'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/services/DatabaseAdapter';

// Interfaz estricta para el linter
interface IUsuario {
  nombre: string;
  rol: string;
}

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
      // Consulta real a la base de datos usando nuestro Adapter
      const usuarios = await db.get('Usuarios', { email, password }) as IUsuario[];
      
      if (usuarios && usuarios.length > 0) {
        const usuario = usuarios[0];
        
        // Guardamos los datos de la sesión
        localStorage.setItem('userRole', usuario.rol);
        localStorage.setItem('userName', usuario.nombre);
        
        // Redirección por roles
        if (usuario.rol === 'Cajero') {
          router.push('/ventas');
        } else {
          router.push('/');
        }
      } else {
        setError('Credenciales inválidas. Verifique su correo y contraseña.');
      }
    } catch (_err) {
      console.error(_err);
      setError('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 absolute top-0 left-0 w-full z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">⛽ CosmosGas</h1>
          <p className="text-slate-500">Sistema de Gestión Multiplataforma</p>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm font-semibold">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">Correo Electrónico</label>
            <input 
              type="email" required
              className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-600 outline-none"
              placeholder="admin@cosmosgas.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium">Contraseña</label>
            <input 
              type="password" required
              className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-600 outline-none"
              placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition"
          >
            {loading ? 'Verificando credenciales...' : 'Ingresar al Sistema'}
          </button>
        </form>
        
        <div className="mt-6 text-sm text-gray-500 text-center">
          Roles disponibles: Administrador, Cajero, Supervisor
        </div>
      </div>
    </div>
  );
}