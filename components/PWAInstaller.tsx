'use client';
import { useEffect } from 'react';

export default function PWAInstaller() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('PWA Service Worker registrado con éxito:', reg.scope))
        .catch((err) => console.error('Error al registrar Service Worker:', err));
    }
  }, []);

  return null; 
}