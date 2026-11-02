/* ============================================================
   Magische Belohnungen – Service Worker
   Cached animierte Porträt-Videos für sofortige Wiedergabe
   ============================================================ */
const CACHE_NAME = 'hp-tcg-v95';
const BASE = '.';

const PRECACHE_URLS = [
  `${BASE}/kessel/flakon-felix.png`,
  `${BASE}/kessel/flakon-fuelle.png`,
  `${BASE}/kessel/flakon-sucher.png`,
  `${BASE}/kessel/flakon-erleuchtung.png`,
  `${BASE}/kessel/flakon-verwandlung.png`,
  `${BASE}/kessel/kessel.png`,
  `${BASE}/kessel/zut-mondstein.png`,
  `${BASE}/kessel/zut-kiem.png`,
  `${BASE}/kessel/zut-bezoar.png`,
  `${BASE}/kessel/zut-drachenblut.png`,
  `${BASE}/kessel/zut-einhorn.png`,
  `${BASE}/kessel/zut-alraune.png`,
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
  `${BASE}/cards/pot-felix.jpg`,
  `${BASE}/cards/pot-fuelle.jpg`,
  `${BASE}/cards/pot-sucher.jpg`,
  `${BASE}/cards/pot-erleuchtung.jpg`,
  `${BASE}/cards/pot-verwandlung.jpg`,
  `${BASE}/pack/pack-front.jpg`,
  `${BASE}/pack/pack-foil.jpg`,
  `${BASE}/cards/hp-zut-001.jpg`,
  `${BASE}/cards/hp-zut-002.jpg`,
  `${BASE}/cards/hp-zut-003.jpg`,
  `${BASE}/cards/hp-zut-004.jpg`,
  `${BASE}/cards/hp-zut-005.jpg`,
  `${BASE}/cards/hp-zut-006.jpg`,
  `${BASE}/cards/hp-149.jpg`,
  `${BASE}/cards/hp-150.jpg`,
  `${BASE}/cards/hp-151.jpg`,
  `${BASE}/cards/hp-152.jpg`,
  `${BASE}/cards/hp-153.jpg`,
  `${BASE}/cards/hp-154.jpg`,
  `${BASE}/cards/hp-155.jpg`,
  `${BASE}/cards/hp-156.jpg`,
  `${BASE}/cards/hp-157.jpg`,
  `${BASE}/cards/hp-158.jpg`,
  `${BASE}/cards/hp-159.jpg`,
  `${BASE}/cards/hp-160.jpg`,
  `${BASE}/cards/hp-161.jpg`,
  `${BASE}/cards/hp-162.jpg`,
  `${BASE}/cards/hp-163.jpg`,
  `${BASE}/cards/hp-164.jpg`,
  `${BASE}/cards/hp-165.jpg`,
  `${BASE}/cards/hp-166.jpg`,
  `${BASE}/cards/hp-167.jpg`,
  `${BASE}/cards/hp-168.jpg`,
  `${BASE}/cards/hp-169.jpg`,
  `${BASE}/cards/hp-170.jpg`,
  `${BASE}/cards/hp-171.jpg`,
  `${BASE}/cards/hp-172.jpg`,
  `${BASE}/cards/hp-173.jpg`,
  `${BASE}/cards/hp-174.jpg`,
  `${BASE}/cards/hp-175.jpg`,
  `${BASE}/cards/hp-176.jpg`,
  `${BASE}/cards/hp-177.jpg`,
  `${BASE}/cards/hp-178.jpg`,
  `${BASE}/cards/hp-179.jpg`,
  `${BASE}/cards/hp-180.jpg`,
  `${BASE}/cards/hp-181.jpg`,
  `${BASE}/cards/hp-182.jpg`,
  `${BASE}/cards/hp-183.jpg`,
  `${BASE}/cards/hp-184.jpg`,
  `${BASE}/cards/hp-185.jpg`,
  `${BASE}/cards/hp-186.jpg`,
  `${BASE}/cards/hp-187.jpg`,
  `${BASE}/cards/hp-188.jpg`,
  `${BASE}/cards/hp-189.jpg`,
  `${BASE}/cards/hp-190.jpg`,
  `${BASE}/cards/hp-191.jpg`,
  `${BASE}/cards/hp-192.jpg`,
  `${BASE}/cards/hp-193.jpg`,
  `${BASE}/cards/hp-194.jpg`,
  `${BASE}/cards/hp-195.jpg`,
  `${BASE}/cards/hp-196.jpg`,
  `${BASE}/cards/hp-197.jpg`,
  `${BASE}/cards/hp-198.jpg`,
  `${BASE}/cards/hp-199.jpg`,
  `${BASE}/cards/hp-200.jpg`,
  `${BASE}/cards/hp-201.jpg`,
  `${BASE}/cards/hp-202.jpg`,
  `${BASE}/cards/hp-203.jpg`,
  `${BASE}/cards/hp-204.jpg`,
  `${BASE}/cards/hp-205.jpg`,
  `${BASE}/cards/hp-206.jpg`,
  `${BASE}/cards/hp-207.jpg`,
  `${BASE}/cards/hp-208.jpg`,
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
