import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Dashboard Surtidores',
  description: 'Sistema de gestión de estación de servicio',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-100 text-black">
        <nav className="bg-gray-900 text-white p-4 shadow-md">
          <div className="max-w-7xl mx-auto flex gap-6 font-semibold">
            <Link href="/" className="hover:text-blue-400 transition">Dashboard</Link>
            <Link href="/ventas" className="hover:text-blue-400 transition">Ventas & Reportes</Link>
            <Link href="/surtidores" className="hover:text-blue-400 transition">Gestión Surtidores</Link>
            <Link href="/login" className="hover:text-blue-400 transition ml-auto">Acceso</Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}