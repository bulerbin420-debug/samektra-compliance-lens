// Bump this version whenever you change caching behavior or update core PWA files
// (manifest, icons, screenshots, app shell, etc.) so clients reliably receive updates.
const CACHE_NAME = 'samektra-lens-v20';

// Make SW work from site root OR a subfolder (GitHub Pages / PWABuilder / TWA)
const SCOPE_URL = (self.registration && self.registration.scope) ? self.registration.scope : self.location.origin + '/';
const BASE_PATH = new URL(SCOPE_URL).pathname; // always starts with '/'
const scopePath = BASE_PATH.endsWith('/') ? BASE_PATH : `${BASE_PATH}/`;

const PRECACHE_URLS = [
  scopePath, // SPA entry (app shell)
  `${scopePath}manifest.json`,
  `${scopePath}icons/icon-192.png`,
  `${scopePath}icons/icon-512.png`,
  `${scopePath}icons/icon-192-maskable.png`,
  `${scopePath}icons/icon-512-maskable.png`,
  `${scopePath}screenshots/home-narrow.png`,
  `${scopePath}screenshots/history-narrow.png`,
  `${scopePath}screenshots/desktop-wide.png`,
  `${scopePath}sw.js`,
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch((err) => {
        console.warn('SW Install: pre-cache failed (continuing anyway)', err);
      })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
          return Promise.resolve(false);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // SPA navigation fallback (important for offline + refresh on routes)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Update cached app shell
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(scopePath, copy));
          return response;
        })
        .catch(() => caches.match(scopePath))
    );
    return;
  }

  // Cache-first for static assets; network update in background
  const isStaticAsset =
    url.pathname.startsWith(`${scopePath}assets/`) ||
    url.pathname.startsWith(`${scopePath}icons/`) ||
    url.pathname.startsWith(`${scopePath}screenshots/`) ||
    url.pathname === `${scopePath}manifest.json`;

  if (!isStaticAsset) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});
