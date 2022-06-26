const CACHE_NAME = 'static-v1';
const toCache = [
    '/',
    '/index.html',
];

self.addEventListener('install', function (event)
{
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache)
            {
                return cache.addAll(toCache)
            })
            .then(self.skipWaiting())
    );
    console.log('service worker registered');
})


self.addEventListener('activate', function (event)
{
    console.log('service worker activates');
    event.waitUntil(
        caches.keys()
            .then((keyList) =>
            {
                return Promise.all(keyList.map((key) =>
                {
                    if (key !== CACHE_NAME)
                    {
                        console.log('[ServiceWorker] Removing old cache', key)
                        return caches.delete(key)
                    }
                }))
            })
            .then(() => self.clients.claim())
    );
})

self.addEventListener('fetch', function (event)
{
    event.respondWith(
        fetch(event.request)
            .catch(() =>
            {
                return caches.open(CACHE_NAME)
                    .then((cache) =>
                    {
                        return cache.match(event.request)
                    })
            })
    );
    console.log('requests got interpreted by service worker');
})