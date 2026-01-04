// Service Worker for Samektra Compliance Lens PWA
// Notes:
// - CORE_ASSETS are required for the app shell.
// - OPTIONAL_ASSETS are best-effort so missing files won't block install.

const CACHE_NAME = 'samektra-lens-v7';

const CORE_ASSETS = [
  '/',              // app shell (index.html)
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

const OPTIONAL_ASSETS = [
  '/?source=pwa',
  '/index.html',
  // Screenshots are optional (PWABuilder uses them for store listing)
  '/screenshots/home-narrow.png',
  '/screenshots/history-narrow.png',
  '/screenshots/desktop-wide.png',
];

// Install: pre-cache core assets, best-effort cache optional assets
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);

    // CORE assets: fail install if any are missing (so we know early)
    await cache.addAll(CORE_ASSETS);

    // OPTIONAL assets: don't block installation if missing
    await Promise.allSettled(
      OPTIONAL_ASSETS.map((url) => cache.add(url))
    );

    self.skipWaiting();
  })());
});

// Activate: clean old caches and take control immediately
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : Promise.resolve())));
    await self.clients.claim();
  })());
});

// Fetch: network-first for navigation/HTML, cache-first for same-origin GETs
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // For navigations (SPA routes), try network then fallback to cached app shell
  const isNavigation =
    event.request.mode === 'navigate' ||
    (event.request.headers.get('accept') || '').includes('text/html');

  if (isNavigation) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(event.request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, fresh.clone());
        return fresh;
      } catch {
        return (
          (await caches.match(event.request)) ||
          (await caches.match('/index.html', { ignoreSearch: true })) ||
          (await caches.match('/', { ignoreSearch: true })) ||
          Response.error()
        );
      }
    })());
    return;
  }

  // For other requests: cache-first, then network
  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;

    const fresh = await fetch(event.request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(event.request, fresh.clone());
    return fresh;
  })());
});
