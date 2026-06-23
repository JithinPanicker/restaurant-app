const CACHE_NAME = 'spice-delight-v37'; // Changed to v37

const assets = [
  './',
  './index.html',
  './menu.html',
  './food-details.html', // New HTML
  './style.css',
  './app.js',
  './manifest.json',
  './restaurent-logo.png',
  './welcome-food-image.png',
  './menu-images/starters.png',
  './menu-images/Main-course.png',
  './menu-images/Beverages.png',
  './menu-images/Desserts.png',
  './menu-images/Chicken-biriyani.png',
  './menu-images/Paneer-Butter-Masala.png',
  './menu-images/Veg-Fried-Rice.png',
  './menu-images/Chicken-Curry.png',
  './Food-detail-images/Chicken-biriyani.png' // New Image Folder
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      cache.addAll(assets);
    })
  );
});

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