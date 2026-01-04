// Service Worker for Samektra Compliance Lens PWA
const CACHE_NAME = 'samektra-lens-v6';

// STRICT CACHE: These files MUST exist for the app to install.
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_URLS);
      })
      .catch((err) => {
        console.warn('SW Install: Pre-caching failed', err);
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
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', (event) => {
  // Skip non-GET or cross-origin requests unless they are our own assets
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Valid response?
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Clone response to cache
        const responseToCache = response.clone();

        caches.open(CACHE_NAME)
          .then((cache) => {
            // Only cache http/https
            if (event.request.url.startsWith('http')) {
               cache.put(event.request, responseToCache);
            }
          });

        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request);
      })
  );
});