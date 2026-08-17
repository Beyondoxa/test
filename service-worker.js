const CACHE_NAME = "dyati-cache-v1";

const filesToCache = [
  "/",
  "/index.html",
  "/custom.css",
  "/common.js"
];


self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});


self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      return response || fetch(event.request);
    })
  );
});