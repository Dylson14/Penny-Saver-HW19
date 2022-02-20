const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/styles.css",
    "/dist/bundle.js",
    "/dist/assets/icons/icon_192x192.png",
    "/dist/assets/icons/icon_512x512.png",
  ];
  
  const CACHE_NAME = "static-cache-v1";
  const DATA_CACHE_NAME = "data-cache";
  
  const populateCache = async (cacheName, assets) => {
    const cache = await caches.open(cacheName);
    await cache.addAll(assets);
    self.skipWaiting();
    return;
  }
  
  self.addEventListener("install", (event) => {
    event.waitUntil(populateCache(CACHE_NAME, FILES_TO_CACHE));
  });
  
  self.addEventListener("activate", (event) => {
    const currentCaches = [CACHE_NAME, DATA_CACHE_NAME];
    event.waitUntil(
      caches.keys().then((cacheNames) => {
          return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then((cachesToDelete) => {
          return Promise.all(cachesToDelete.map((cacheToDelete) => {
              return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
  });
  
  self.addEventListener("fetch", event => {
    if (
      event.request.method !== "GET" ||
      !event.request.url.startsWith(self.location.origin)
    ) {
      event.respondWith(fetch(event.request));
      return;
    }
  
    if (event.request.url.includes("/api/transaction")) {
      event.respondWith(
        caches.open(DATA_CACHE_NAME).then(cache => {
          return fetch(event.request)
            .then(response => {
              cache.put(event.request, response.clone());
              return response;
            })
            .catch(() => caches.match(event.request));
        })
      );
      return;
    }
  
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
  
        return caches.open(DATA_CACHE_NAME).then(cache => {
          return fetch(event.request).then(response => {
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  });
    
    
    