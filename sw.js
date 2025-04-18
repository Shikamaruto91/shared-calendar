// Salva i file importanti
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('calendario-v1').then(function(cache) {
      return cache.addAll([
        'index.html',
        'styles.css',
        'script.js'
      ]);
    })
  );
});

// Usa i file salvati quando non c'è internet
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});