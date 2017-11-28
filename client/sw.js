
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1')
      .then(cache => {
        console.log('Opened cache')
        return cache.addAll([
          '/',
          '/js/bundle.js',
          '/css/main.css',
        ])
      })
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate',  event => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, {ignoreSearch:true}).then(response => {
      return response || fetch(event.request)
    })
  )
})
