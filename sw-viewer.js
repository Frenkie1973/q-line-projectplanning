// Cache versie - verhoog dit getal om cache te forceren op alle apparaten
const CACHE_VERSION = 'v9';
const CACHE_NAME = 'qline-viewer-' + CACHE_VERSION;

// Bestanden die gecached worden
const CACHE_FILES = [
  '/q-line-projectplanning/mobile-viewer.html',
  '/q-line-projectplanning/eem-production/mobile-viewer.html',
  '/q-line-projectplanning/manifest-viewer.json',
  '/q-line-projectplanning/eem-production/manifest-viewer.json',
  '/q-line-projectplanning/icon-192.png',
  '/q-line-projectplanning/icon-512.png'
];

// Installatie: cache bestanden
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CACHE_FILES))
  );
  self.skipWaiting();
});

// Activatie: verwijder oude caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network first, dan cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Sla verse versie op in cache
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
