const CACHE_NAME = 'foush-v8';
const CRITICAL_ASSETS = [
  './',
  './index.html',
  './logo.png',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

const CDN_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&family=Orbitron:wght@400;900&display=swap'
];

const EXTERNAL_LIBS = [
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-database-compat.js'
];

// Combined assets list
const ASSETS = [...CRITICAL_ASSETS, ...CDN_ASSETS, ...EXTERNAL_LIBS];

// Install: Cache critical assets immediately
self.addEventListener('install', event => {
  console.log('[SW] Installing and caching critical assets...');
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache critical assets (HTML, CSS, JS)
      return cache.addAll(CRITICAL_ASSETS).then(() => {
        // Cache CDN & external libs (non-blocking)
        cache.addAll(CDN_ASSETS);
        cache.addAll(EXTERNAL_LIBS);
      }).catch(error => {
        console.error('[SW] Cache addAll error:', error);
      });
    })
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating and cleaning old caches...');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => {
          console.log('[SW] Deleting old cache:', key);
          return caches.delete(key);
        })
      );
    })
  );
});

// Fetch: Smart caching strategy
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Strategy 1: Critical assets - Cache First
  if (CRITICAL_ASSETS.some(asset => request.url.includes(asset))) {
    event.respondWith(
      caches.match(request).then(response => {
        if (response) {
          return response;
        }
        return fetch(request).then(response => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
          });
          return response;
        });
      })
    );
    return;
  }

  // Strategy 2: CDN/External - Network First with cache fallback
  if (CDN_ASSETS.some(asset => request.url.includes(asset)) ||
      EXTERNAL_LIBS.some(lib => request.url.includes(lib))) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return caches.match(request);
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request) || new Response('Offline - Resource not available', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        })
    );
    return;
  }

  // Strategy 3: API/Realtime data - Network First, DO NOT cache (preserve realtime)
  if (url.pathname.includes('/api/') || url.hostname !== location.hostname) {
    event.respondWith(
      fetch(request)
        .then(response => response)
        .catch(() => {
          return new Response(
            JSON.stringify({ error: 'Offline - API not available' }),
            { status: 503, headers: { 'Content-Type': 'application/json' } }
          );
        })
    );
    return;
  }

  // Strategy 4: Everything else - Network First with cache fallback
  event.respondWith(
    fetch(request)
      .then(response => {
        if (!response || response.status !== 200 || response.type === 'error') {
          return caches.match(request);
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Handle messages from clients
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
