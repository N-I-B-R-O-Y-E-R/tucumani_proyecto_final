'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setUserRole(localStorage.getItem('userRole'));
    setUserName(localStorage.getItem('userName'));
  }, []);

  // Aquí definimos las rutas y quién puede verlas. ¡Agregamos Usuarios al final!
  const allLinks = [
    { name: 'Dashboard', path: '/', icon: '📊', roles: ['Administrador', 'Supervisor'] },
    { name: 'Punto de Venta', path: '/ventas', icon: '⛽', roles: ['Administrador', 'Supervisor', 'Cajero'] },
    { name: 'Surtidores', path: '/surtidores', icon: '⚙️', roles: ['Administrador'] },
    { name: 'Reportes', path: '/reportes', icon: '📋', roles: ['Administrador', 'Supervisor'] },
    { name: 'Usuarios', path: '/usuarios', icon: '👥', roles: ['Administrador'] },
  ];

  const allowedLinks = allLinks.filter(link => userRole && link.roles.includes(userRole));

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    router.push('/login');
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="md:hidden fixed top-4 left-4 z-40 p-2 bg-slate-900 text-white rounded-lg shadow-lg hover:bg-slate-800 transition">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>

      {isOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity" onClick={() => setIsOpen(false)}></div>}

      <aside className={`fixed md:relative top-0 left-0 h-[100dvh] w-64 bg-slate-900 text-white z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} flex flex-col shadow-2xl md:shadow-none`}>
        <div className="p-6 flex justify-between items-center border-b border-slate-700">
          <div className="overflow-hidden">
            <h2 className="text-2xl font-bold text-blue-400">CosmosGas</h2>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest truncate" title={userName || 'Usuario'}>
              {userRole || 'Usuario'}
            </p>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-400 hover:text-white text-3xl">&times;</button>
        </div>
        
        <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
          {allowedLinks.map(link => (
            <Link 
              key={link.path} href={link.path} 
              onClick={() => setIsOpen(false)} 
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${pathname === link.path ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <span className="text-xl">{link.icon}</span>
              <span className="font-medium">{link.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button onClick={handleLogout} className="w-full p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-center font-bold transition-all border border-red-500/20">
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}