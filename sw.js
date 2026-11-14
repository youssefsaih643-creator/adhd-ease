const CACHE_NAME = 'adhd-ease-shell-v2';
const APP_SHELL = [
  '/',
  '/index.html',
  '/install.html',
  '/supabase.js',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key.startsWith('adhd-ease-shell-') && key !== CACHE_NAME)
        .map((key) => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Never cache Supabase/API requests, other origins, or non-GET requests.
  if (url.origin !== self.location.origin || request.method !== 'GET') return;

  // Always try the latest HTML first. Use the cached app shell only when offline.
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, response.clone());
          if (url.pathname === '/' || url.pathname === '/index.html') {
            cache.put('/', response.clone());
          }
        }
        return response;
      } catch {
        const cached = await caches.match(request) ||
          (url.pathname === '/install' ? await caches.match('/install.html') : null) ||
          await caches.match('/') ||
          await caches.match('/index.html');
        return cached || Response.error();
      }
    })());
    return;
  }

  // For same-origin static files, prefer the network so deployments update promptly.
  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if (response && response.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
      }
      return response;
    } catch {
      return (await caches.match(request)) || Response.error();
    }
  })());
});
