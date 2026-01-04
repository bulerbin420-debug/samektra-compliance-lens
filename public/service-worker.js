// Service Worker for Samektra Compliance Lens PWA
const CACHE_NAME = 'samektra-lens-v5';

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
  // Handle cross-origin requests (like our placeholder icons) separately
  // to avoid opaque response issues in strict cache logic, though simple caching usually works.
  
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
        return caches.match(event.request);
      })
  );
});