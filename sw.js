const cacheName = "restaurant-review-v3";

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
            console.log(`ServiceWorker Clearing Old Cache: ${ cache }`);
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
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone of the response
        let responseClone = response.clone();
        // Open cache
        caches.open(cacheName).then(cache => {
          //Add the response to the cache
          cache.put(event.request, responseClone);
        });
        // Return the original response
        return response;
      })
      .catch(err => {
        // If it is offline, the catch will return the caches
        console.log(err);
        caches
          .match(event.request)
          .then(response => response)
      })
  );
});
