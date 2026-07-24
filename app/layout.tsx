import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Sidebar from "../components/Sidebar";
import FloatingVoiceAssistant from "../components/FloatingVoiceAssistant";
import AuthGuard from "../components/AuthGuard";
import PWAInstaller from "../components/PWAInstaller"; // <-- Importamos el componente limpio

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CosmosGas - Gestión de Combustible",
  description: "Arquitectura MVC Multiplataforma",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
        <style>{`
          @media print {
            .no-print, aside { display: none !important; }
            .printable-area { width: 100%; margin: 0; padding: 0; }
          }
        `}</style>
      </head>
      <body className={`${inter.className} bg-gray-100 flex min-h-screen overflow-hidden`}>
        
        <AuthGuard>
          <Sidebar />
          <main className="flex-1 overflow-y-auto relative h-screen">
            {children}
            <FloatingVoiceAssistant />
          </main>
        </AuthGuard>

        {/* Carga del Service Worker sin advertencias en React */}
        <PWAInstaller />

      </body>
    </html>
  );
}