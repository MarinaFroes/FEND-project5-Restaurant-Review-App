const cacheVersion = "restaurant-review-v2";

//Install
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
          if (cache !== cacheVersion) {
            console.log(`ServiceWorker Clearing Old Cache: ${ cache }`);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

//Call Fetch Event - show cached files first
self.addEventListener("fetch", event => {
  console.log("Service Worker Fetching: " + event.request.url);
  // Fetch all the responses and save them to caches
  event.respondWith(
    // Check the cache first and then fetch the response and put it in the cache
    caches.open(cacheVersion).then((cache) => {
      return cache.match(event.request)
        .then((matched) => {
          if (matched) {
            return matched;
          }
          return fetch(event.request).then(response => {
            cache.put(event.request, response.clone());
            return response;
          })
        })
        .catch(err => {
          console.log(err);
        })
    })
  );
});
