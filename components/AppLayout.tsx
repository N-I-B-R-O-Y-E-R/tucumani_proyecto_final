'use client';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import FloatingVoiceAssistant from './FloatingVoiceAssistant';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  // Si estamos en la página de Login
  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-slate-900 w-full flex flex-col">
        {children}
      </div>
    );
  }

  // CORRECCIÓN: Envolvemos el sistema en un contenedor que maneja su propia barra de scroll
  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-slate-50">
      <Sidebar />
      
      {/* La clase "overflow-y-auto" asegura que solo el contenido central se deslice */}
      <main className="flex-1 h-full overflow-y-auto relative pt-16 md:pt-0">
        {children}
        <FloatingVoiceAssistant />
      </main>
    </div>
  );
}