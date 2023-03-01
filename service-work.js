const cacheList = [
  '/src',
  '/index.html',
];
const cacheName = 'cache-v1';

// install
self.addEventListener('install', event => {
  console.log('installing...');
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('Caching app ok');
      return cache.addAll(cacheList);
    })
  );
});

// activate
self.addEventListener('activate', event => {
  console.log('now ready to handle fetches!');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      const promiseArr = cacheNames.map(item => {
        if (item !== cacheName) {
          // Delete that cached file
          return caches.delete(item);
        }
      });
      return Promise.all(promiseArr);
    })
  ); // end e.waitUntil
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
        caches.open(cacheName).then(cache => {
          // cache.put(key, value)
          // 下一次 caches.match 會對應到 event.request
          cache.put(event.request.url, res.clone());
          return res;
        })
      )
    })
  );
});