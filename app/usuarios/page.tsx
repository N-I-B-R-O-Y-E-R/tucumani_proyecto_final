'use client';
import { useState, useEffect } from 'react';
import { UsuarioController } from '@/controllers/usuarioController';
import { useRouter } from 'next/navigation';

interface IUsuario { id: string; nombre: string; email: string; rol: string; }

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Estados del Formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('Cajero');

  // 🚀 ESTADOS PARA NOTIFICACIONES Y MODAL ELEGANTES
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'success' });
  const [modalConfirm, setModalConfirm] = useState({ isOpen: false, id: '', nombre: '' });

  const showToast = (mensaje: string, tipo: 'success' | 'error' = 'success') => {
    setToast({ visible: true, mensaje, tipo });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 4000);
  };

  const cargarUsuarios = async () => {
    try {
      const data = await UsuarioController.listarUsuarios();
      setUsuarios(data as IUsuario[]);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { cargarUsuarios(); }, []);

  const handleCrearUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await UsuarioController.crearUsuario(nombre, email, password, rol);
      showToast('Usuario creado y autorizado exitosamente', 'success');
      setNombre(''); setEmail(''); setPassword('');
      cargarUsuarios(); 
      router.refresh();
    } catch (err: any) {
      showToast(err.message.includes('duplicate') ? 'Ese correo ya existe en el sistema' : 'Error al crear usuario', 'error');
    } finally { 
      setLoading(false); 
    }
  };

  // 🚀 FUNCIÓN QUE EJECUTA LA DESHABILITACIÓN TRAS CONFIRMAR EN EL MODAL
  // 🚀 FUNCIÓN QUE EJECUTA LA DESHABILITACIÓN TRAS CONFIRMAR EN EL MODAL
  const confirmarDeshabilitar = async () => {
    try {
      await UsuarioController.deshabilitarUsuario(modalConfirm.id);
      showToast(`Acceso denegado para ${modalConfirm.nombre}`, 'success');
      setModalConfirm({ isOpen: false, id: '', nombre: '' });
      cargarUsuarios(); 
      router.refresh();
    } catch (err: any) { 
      // AHORA SÍ LEEMOS EL ERROR REAL DE SUPABASE
      showToast(`Error BD: ${err.message}`, 'error'); 
    }
  };

  const handleReactivar = async (id: string, nombre: string) => {
    try {
      await UsuarioController.reactivarUsuario(id);
      showToast(`Se ha reactivado a ${nombre} como Cajero`, 'success');
      cargarUsuarios();
      router.refresh();
    } catch (err: any) {
      // AHORA SÍ LEEMOS EL ERROR REAL DE SUPABASE
      showToast(`Error BD: ${err.message}`, 'error');
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto relative animate-fade-in">
      
      {/* 🚀 NOTIFICACIÓN FLOTANTE (TOAST) */}
      {toast.visible && (
        <div className={`fixed top-6 right-6 z-[9999] px-6 py-4 rounded-xl shadow-2xl font-bold text-white transform transition-all flex items-center gap-3 animate-bounce-short ${toast.tipo === 'success' ? 'bg-slate-900 border-l-4 border-green-500' : 'bg-red-600 border-l-4 border-white'}`}>
          <span className="text-2xl">{toast.tipo === 'success' ? '✅' : '⚠️'}</span>
          {toast.mensaje}
        </div>
      )}

      {/* 🚀 VENTANA MODAL ELEGANTE DE CONFIRMACIÓN */}
      {modalConfirm.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in p-6 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">¿Deshabilitar Acceso?</h2>
            <p className="text-slate-500 mb-6">El empleado <b>{modalConfirm.nombre}</b> ya no podrá ingresar al sistema.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setModalConfirm({ isOpen: false, id: '', nombre: '' })} className="px-5 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition">
                Cancelar
              </button>
              <button onClick={confirmarDeshabilitar} className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition transform active:scale-95">
                Sí, Deshabilitar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Gestión de Personal</h1>
        <p className="text-slate-500 mt-1">Control de accesos y roles del sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Panel de Creación */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200 h-fit">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">➕ Nuevo Empleado</h2>
          <form onSubmit={handleCrearUsuario} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
              <input type="text" required value={nombre} onChange={(e)=>setNombre(e.target.value)} className="w-full border p-2 rounded bg-gray-50 focus:bg-white outline-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo (Usuario)</label>
              <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full border p-2 rounded bg-gray-50 focus:bg-white outline-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input type="text" required value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full border p-2 rounded bg-gray-50 focus:bg-white outline-blue-500" placeholder="Mínimo 6 caracteres" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol de Acceso</label>
              <select value={rol} onChange={(e)=>setRol(e.target.value)} className="w-full border p-2 rounded bg-gray-50 focus:bg-white outline-blue-500 font-bold text-blue-700">
                <option value="Cajero">Cajero (Solo Ventas)</option>
                <option value="Supervisor">Supervisor (Ventas y Reportes)</option>
                <option value="Administrador">Administrador (Acceso Total)</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-bold py-3 rounded hover:bg-slate-800 transition shadow">
              {loading ? 'Guardando...' : 'Otorgar Acceso'}
            </button>
          </form>
        </div>

        {/* Tabla de Usuarios */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b">
                  <th className="p-4">Empleado</th>
                  <th className="p-4">Correo de Acceso</th>
                  <th className="p-4 text-center">Rol</th>
                  <th className="p-4 text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-800">{u.nombre}</td>
                    <td className="p-4 text-slate-500">{u.email}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${u.rol === 'Administrador' ? 'bg-purple-100 text-purple-700' : u.rol === 'Supervisor' ? 'bg-blue-100 text-blue-700' : u.rol === 'Inactivo' ? 'bg-gray-200 text-gray-600' : 'bg-green-100 text-green-700'}`}>
                        {u.rol}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {/* Lógica Inteligente de Botones */}
                      {u.rol === 'Inactivo' ? (
                        <button onClick={() => handleReactivar(u.id, u.nombre)} className="bg-green-100 hover:bg-green-600 text-green-700 hover:text-white px-3 py-1 rounded text-sm font-bold transition">
                          Reactivar
                        </button>
                      ) : u.rol !== 'Administrador' ? (
                        <button onClick={() => setModalConfirm({ isOpen: true, id: u.id, nombre: u.nombre })} className="bg-red-100 hover:bg-red-600 text-red-600 hover:text-white px-3 py-1 rounded text-sm font-bold transition">
                          Quitar Acceso
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 font-bold">Protegido</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}