'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Verificamos si existe una sesión activa en el navegador
    const userRole = localStorage.getItem('userRole');
    
    if (!userRole && pathname !== '/login') {
      // Si no hay sesión y no está en el login, lo expulsamos al login
      router.push('/login');
    } else {
      // Si todo está en orden, permitimos renderizar la aplicación
      setIsAuthorized(true);
    }
  }, [pathname, router]);

  // Mientras verifica, mostramos una pantalla en blanco para evitar "parpadeos"
  if (!isAuthorized && pathname !== '/login') {
    return <div className="min-h-screen bg-gray-100"></div>; 
  }

  return <>{children}</>;
}