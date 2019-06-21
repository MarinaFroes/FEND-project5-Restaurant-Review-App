/**
 *  Register Service Worker
 * */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("../sw.js")
      .then(reg => console.log(`ServiceWorker registered - scope: ${reg.scope}`))
      .catch(err => console.log(`ServiceWorker registrationn failed: ${err}`));
  });
}
