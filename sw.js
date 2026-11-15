const CACHE_NAME = 'adhd-ease-shell-v4';
const APP_BASE = new URL(self.registration.scope);
const appUrl = (path = '') => new URL(path, APP_BASE).toString();

const APP_SHELL = [
  appUrl('./'),
  appUrl('index.html'),
  appUrl('install.html'),
  appUrl('supabase.js'),
  appUrl('manifest.webmanifest'),
  appUrl('icons/icon-192.png'),
  appUrl('icons/icon-512.png'),
  appUrl('icons/icon-maskable-512.png')
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

  // Do not cache cross-origin requests or non-GET requests.
  if (url.origin !== self.location.origin || request.method !== 'GET') return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, response.clone());
        }
        return response;
      } catch {
        const isInstallPage = url.pathname.endsWith('/install.html');
        const fallbackUrl = isInstallPage ? appUrl('install.html') : appUrl('index.html');
        return (await caches.match(request)) ||
          (await caches.match(fallbackUrl)) ||
          (await caches.match(appUrl('./'))) ||
          Response.error();
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
