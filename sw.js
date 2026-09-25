/* ============================================================
   Magische Belohnungen – Service Worker
   Cached animierte Porträt-Videos für sofortige Wiedergabe
   ============================================================ */
const CACHE_NAME = 'hp-tcg-v36';
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
  `${BASE}/cards/hp-125-anim-5s.mp4`,
  `${BASE}/cards/order-panorama.mp4`,
  `${BASE}/cards/hp-hal-013-anim-5s.mp4`,
  `${BASE}/album/bg-band1.jpg`,
  `${BASE}/album/bg-band2.jpg`,
  `${BASE}/album/bg-band3.jpg`,
  `${BASE}/album/bg-band4.jpg`,
  `${BASE}/album/bg-band5.jpg`,
  `${BASE}/album/bg-band6.jpg`,
  `${BASE}/album/bg-band7.jpg`,
  `${BASE}/album/bg-beach.jpg`,
  `${BASE}/album/bg-founders.jpg`,
  `${BASE}/album/bg-order.jpg`,
  `${BASE}/album/bg-halloween.jpg`,
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

// Nachricht von der App: sofort übernehmen (für den Update-Button)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

// Fetch: App-Shell (index.html) network-first → Updates greifen sofort.
// Bilder/Videos cache-first → sofortige Wiedergabe, offline verfügbar.
self.addEventListener('fetch', event => {
  // Nur GET-Anfragen cachen
  if (event.request.method !== 'GET') return;

  // API-Anfragen niemals cachen
  if (event.request.url.includes('/api/')) return;

  // Navigation / index.html → NETWORK-FIRST (Cache nur als Offline-Fallback)
  const url = event.request.url;
  const isShell = event.request.mode === 'navigate' ||
                  event.request.destination === 'document' ||
                  /\/index\.html(\?|$)/.test(url) ||
                  /\/$/.test(new URL(url).pathname);

  if (isShell) {
    event.respondWith(
      fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() =>
        // Offline: gespeicherte Shell ausliefern
        caches.match(event.request).then(c => c || caches.match(`${BASE}/index.html`))
      )
    );
    return;
  }

  // Alle übrigen Assets → cache-first (mit Nachladen in den Cache)
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
