self.addEventListener('install', (e) => {
  console.log('[Service Worker] Instalado');
  self.skipWaiting(); // Fuerza a que se active de inmediato
});

self.addEventListener('activate', (e) => {
  console.log('[Service Worker] Activado');
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Responde con la red, y si falla (no hay internet), no crashea la app
  e.respondWith(
    fetch(e.request).catch(() => {
      return new Response("Aplicación sin conexión a internet.");
    })
  );
});