'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('userRole');

    // 1. Si no hay sesión y no está en login, expulsar al login
    if (!role && pathname !== '/login') {
      router.push('/login');
      return;
    }

    // 2. Si es CAJERO, encerrarlo SOLO en la pantalla de Ventas
    if (role === 'Cajero' && pathname !== '/ventas' && pathname !== '/login') {
      router.push('/ventas');
      return;
    }

    // 3. Si todo está bien, mostrar la pantalla
    setIsAuthorized(true);
  }, [pathname, router]);

  // Evita parpadeos de pantallas prohibidas antes de redireccionar
  if (!isAuthorized && pathname !== '/login') {
    return <div className="h-screen w-screen bg-slate-900 flex items-center justify-center text-white font-bold">Verificando credenciales...</div>;
  }

  return <>{children}</>;
}