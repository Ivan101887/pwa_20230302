const resourcesToCache = [
  '/index.html',
  '/src/js/main.js',
  '/src/image/bear.png',
  '/src/style/index.css',
];
const staticCacheName = 'static_cache_v1';
const DynamicCacheName = 'dynamic_cache_v1';

// install
self.addEventListener('install', event => {
  console.log('[Service worker] service worker installing...');
  event.waitUntil(
    caches.open(staticCacheName)
      .then(cache => {
        console.log('[Service worker] Caching app ok');
        return cache.addAll(resourcesToCache);
      })
  );
});

// activate
self.addEventListener('activate', event => {
  console.log('now ready to handle fetches!');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      const promiseArr = cacheNames.map(key => {
        if (key !== staticCacheName && key !== DynamicCacheName) {
          // Delete that cached file
          return caches.delete(key);
        }
      });
      return Promise.all(promiseArr);
    })
  ); // end e.waitUntil
  return self.client.claims();
});

// fetch
self.addEventListener('fetch', event => {
  console.log('now fetch!');
  console.log('event.request:', event.request);
  console.log('[ServiceWorker] Fetch', event.request.url);
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(res =>
        // 存 caches 之前，要先打開 caches.open(dataCacheName)
        caches.open(DynamicCacheName).then(cache => {
          // cache.put(key, value)
          // 下一次 caches.match 會對應到 event.request
          cache.put(event.request.url, res.clone());
          return res;
        })
      )
    })
  );
});