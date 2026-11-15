/* Service worker: conserva i file del gioco per giocare anche senza connessione. */
var VERSIONE = "respira-v8";
var FILE = [
  "./",
  "index.html",
  "css/stile.css",
  "js/testi-it.js",
  "js/impostazioni.js",
  "js/voce.js",
  "js/suoni.js",
  "js/battito.js",
  "js/pannello.js",
  "js/icone.js",
  "js/cartina.js",
  "js/schemi.js",
  "js/storia.js",
  "js/didascalia.js",
  "js/arte.js",
  "js/fondale.js",
  "js/app.js",
  "js/quaderno.js",
  "js/mondo.js",
  "js/spettacolo.js",
  "js/livello1.js",
  "js/main.js",
  "manifest.webmanifest",
  "assets/icone/icona.svg",
  "assets/icone/icona-192.png",
  "assets/icone/icona-512.png",
  "assets/icone/icona-maschera-512.png",
  "assets/icone/icona-180.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSIONE).then(function (c) { return c.addAll(FILE); }));
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (chiavi) {
    return Promise.all(chiavi.filter(function (k) { return k !== VERSIONE; }).map(function (k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});

/* Prima la rete (così gli aggiornamenti arrivano subito), poi la copia salvata se si è offline. */
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(function (r) {
      var copia = r.clone();
      caches.open(VERSIONE).then(function (c) { c.put(e.request, copia); });
      return r;
    }).catch(function () { return caches.match(e.request); })
  );
});
