const CACHE_NAME = "bookkeeping-cache-v1";
const urlsToCache = [
  "/index.html",
  "/logo.png",
  "/manifest.json",
  "/favicon.ico"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
