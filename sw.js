// 1. Changed v1 to v2 to force the app to update
const CACHE_NAME = 'spice-delight-v2'; 

const assets = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  // 2. Added your new image files below so they load offline
  './restaurent-logo.png',
  './welcome-food-image.png' 
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      cache.addAll(assets);
    })
  );
});

// Delete old caches so the phone doesn't get confused
self.addEventListener('activate', evt => {
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
            );
        })
    );
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request);
    })
  );
});