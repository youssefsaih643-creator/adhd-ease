const CACHE_NAME = 'adhd-ease-shell-v3';
const APP_BASE = new URL('./', self.registration.scope);
const APP_SHELL = [
  APP_BASE.href,
  new URL('index.html', APP_BASE).href,
  new URL('install.html', APP_BASE).href,
  new URL('supabase.js', APP_BASE).href,
  new URL('manifest.webmanifest', APP_BASE).href,
  new URL('icons/icon-192.png', APP_BASE).href,
  new URL('icons/icon-512.png', APP_BASE).href,
  new URL('icons/icon-maskable-512.png', APP_BASE).href
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('adhd-ease-shell-') && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || request.method !== 'GET') return;
  if (!url.href.startsWith(APP_BASE.href)) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, response.clone());
          if (url.pathname === new URL('./', APP_BASE).pathname || url.pathname === new URL('index.html', APP_BASE).pathname) {
            await cache.put(APP_BASE.href, response.clone());
          }
        }
        return response;
      } catch {
        const cached = await caches.match(request) || await caches.match(APP_BASE.href) || await caches.match(new URL('index.html', APP_BASE).href);
        return cached || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    try {
      const response = await fetch(request);
      if (response && response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
      }
      return response;
    } catch {
      return cached || Response.error();
    }
  })());
});
