const APP_CACHE_VERSION = 'v5.2.0-adaptive-progression'; 
const CACHE = `language-ai-${APP_CACHE_VERSION}`;
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './adaptive-engine.js',
  './firebase-backend.js',
  './manifest.webmanifest'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
    .then(cache => cache.addAll(ASSETS))
    .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
    .then(keys =>
      Promise.all(
        keys
        .filter(key => key.startsWith('language-ai-') && key !== CACHE)
        .map(key => caches.delete(key))
      )
    )
    .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
    .then(response => {
      const resClone = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, resClone));
      return response;
    })
    .catch(() => caches.match(event.request))
  );
});
