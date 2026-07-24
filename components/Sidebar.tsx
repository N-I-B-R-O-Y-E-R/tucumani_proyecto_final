'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  if (pathname === '/login') return null;

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col no-print shadow-xl z-10 relative h-screen">
      <div className="p-6 text-2xl font-bold border-b border-slate-700 flex items-center gap-2">
        ⛽ CosmosGas
      </div>
      <nav className="flex-1 p-4 space-y-2 text-sm font-medium">
        <Link href="/" className={`block py-3 px-4 rounded transition ${pathname === '/' ? 'bg-slate-800 border-l-4 border-blue-500' : 'hover:bg-slate-800'}`}>📊 Dashboard</Link>
        <Link href="/ventas" className={`block py-3 px-4 rounded transition ${pathname === '/ventas' ? 'bg-slate-800 border-l-4 border-blue-500' : 'hover:bg-slate-800'}`}>💰 Módulo Ventas</Link>
        <Link href="/surtidores" className={`block py-3 px-4 rounded transition ${pathname === '/surtidores' ? 'bg-slate-800 border-l-4 border-blue-500' : 'hover:bg-slate-800'}`}>⚙️ Gestor Surtidores</Link>
        <Link href="/reportes" className={`block py-3 px-4 rounded transition text-blue-300 ${pathname === '/reportes' ? 'bg-slate-800 border-l-4 border-blue-500' : 'hover:bg-slate-800'}`}>📄 Reportes y Exportación</Link>
      </nav>
      <div className="p-4">
        <Link href="/login" className="block text-center bg-red-600 hover:bg-red-700 py-2 rounded font-bold transition">Cerrar Sesión</Link>
      </div>
      <div className="p-4 text-xs text-slate-500 text-center border-t border-slate-700">
        Arquitectura MVC<br/>Desarrollado para Producción
      </div>
    </aside>
  );
}