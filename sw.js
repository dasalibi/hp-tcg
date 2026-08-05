/* ============================================================
   Magische Belohnungen – Service Worker
   Cached animierte Porträt-Videos für sofortige Wiedergabe
   ============================================================ */
const CACHE_NAME = 'hp-tcg-v10';
const BASE = '.';

const PRECACHE_URLS = [
  `${BASE}/`,
  `${BASE}/index.html`,
  `${BASE}/manifest.json`,
  `${BASE}/icon-192.png`,
  `${BASE}/icon-512.png`,
  `${BASE}/cards/hp-081-anim-5s.mp4`,
  `${BASE}/cards/hp-082-anim-5s.mp4`,
  `${BASE}/cards/hp-083-anim-5s.mp4`,
  `${BASE}/cards/hp-084-anim-5s.mp4`,
  `${BASE}/cards/hp-102-anim-5s.mp4`,
  `${BASE}/cards/hp-103-anim-5s.mp4`,
  `${BASE}/cards/hp-104-anim-3s.mp4`,
  `${BASE}/cards/hp-105-anim-5s.mp4`,
  `${BASE}/cards/hp-106-anim-3s.mp4`,
  `${BASE}/cards/hp-107-anim-5s.mp4`,
  `${BASE}/cards/hp-108-anim-3s.mp4`,
  `${BASE}/album/bg-band1.jpg`,
  `${BASE}/album/bg-band2.jpg`,
  `${BASE}/album/bg-band3.jpg`,
  `${BASE}/album/bg-band4.jpg`,
  `${BASE}/album/bg-band5.jpg`,
  `${BASE}/album/bg-band6.jpg`,
  `${BASE}/album/bg-band7.jpg`,
  `${BASE}/album/bg-beach.jpg`,
  `${BASE}/album/bg-founders.jpg`,
];

// Install: Pre-Cache alle wichtigen Dateien
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Alte Caches aufräumen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => {
      return Promise.all(
        names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Cache-first für gecachte Assets, sonst Netzwerk
self.addEventListener('fetch', event => {
  // Nur GET-Anfragen cachen
  if (event.request.method !== 'GET') return;

  // API-Anfragen niemals cachen
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Nur erfolgreiche Antworten cachen
        if (!response || response.status !== 200) return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          // Nur MP4s und Bilder in den Cache
          if (event.request.url.match(/\.(mp4|png|jpg|jpeg|webp|svg|ico)$/)) {
            cache.put(event.request, clone);
          }
        });
        return response;
      });
    })
  );
});
