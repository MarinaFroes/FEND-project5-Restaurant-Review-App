const appName = "restaurant-review"
const cacheName = `${appName}-v1`;

// Call install event
self.addEventListener("install", event => {
  console.log("Service Worker installed");
});

// Call activate event
self.addEventListener("activate", event => {
  console.log("Service Worker activated");
  // Remove unwanted caches
  event.waitUntil(
    // Loop through the caches and remove it if it's not the current one
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log("ServiceWorker Clearing Old Cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

//Call Fetch Event - show cached files if we are offline
self.addEventListener("fetch", event => {
  console.log("Service Worker Fetching");
  // First check if the live site is available, if not, it will load the cached site
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response
        const responseClone = response.clone();
        // Open cache
        caches.open(cacheName).then(cache => {
          //Add the response to the cache
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(err => {
        // If it is offline, the catch will return the caches
        console.log(err);
        caches.match(event.request).then(response => response || fetch(event.request));
      })
  );
});
