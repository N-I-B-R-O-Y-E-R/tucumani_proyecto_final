import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import AuthGuard from "../components/AuthGuard";
import PWAInstaller from "../components/PWAInstaller";
import AppLayout from "../components/AppLayout";

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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <style>{`
          @media print {
            .no-print, aside { display: none !important; }
            .printable-area { width: 100%; margin: 0; padding: 0; }
          }
        `}</style>
      </head>
      {/* CORRECCIÓN: Quitamos el "overflow-hidden" y "flex" para no bloquear la pantalla globalmente */}
      <body className={inter.className}>
        <AuthGuard>
          <AppLayout>
            {children}
          </AppLayout>
        </AuthGuard>

        <PWAInstaller />
      </body>
    </html>
  );
}