/*
 * Respira come app sul telefono.
 * Il gioco vive su GitHub Pages: l'app installata apre sempre quell'indirizzo,
 * e il service worker scarica da lì l'ultima versione appena c'è rete (altrimenti usa la copia salvata).
 */
(function () {
  "use strict";

  var richiesta = null;      /* evento di installazione di Android/Chrome */
  var ascoltatori = [];

  function installata() {
    return (window.matchMedia && window.matchMedia("(display-mode: fullscreen), (display-mode: standalone)").matches) ||
      window.navigator.standalone === true;
  }

  function ios() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  }

  function avvisa() { ascoltatori.forEach(function (f) { try { f(); } catch (e) { /* niente */ } }); }

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    richiesta = e;
    avvisa();
  });
  window.addEventListener("appinstalled", function () { richiesta = null; avvisa(); });

  window.App = {
    installata: installata,

    /* "android": c'è il pulsante vero; "ios": servono due tocchi a mano; null: niente da fare */
    comeInstallare: function () {
      if (installata() || !/^https?:$/.test(location.protocol)) return null;
      if (richiesta) return "android";
      if (ios()) return "ios";
      return null;
    },

    quandoCambia: function (f) { ascoltatori.push(f); },

    installa: function () {
      if (!richiesta) return Promise.resolve(false);
      var r = richiesta;
      richiesta = null;
      r.prompt();
      return r.userChoice.then(function (s) { avvisa(); return s && s.outcome === "accepted"; });
    },

    /* Schermo intero e orizzontale, quando il browser lo permette (serve un tocco del giocatore) */
    schermoIntero: function () {
      var d = document.documentElement;
      try {
        if (!installata() && !document.fullscreenElement && d.requestFullscreen && /android/i.test(navigator.userAgent)) {
          d.requestFullscreen({ navigationUI: "hide" }).then(blocca, function () { /* niente */ });
        } else {
          blocca();
        }
      } catch (e) { /* niente */ }
      function blocca() {
        try { if (screen.orientation && screen.orientation.lock) screen.orientation.lock("landscape").catch(function () {}); } catch (e) { /* niente */ }
      }
    },

    registra: function () {
      if (!("serviceWorker" in navigator) || !/^https?:$/.test(location.protocol)) return;
      var primaVolta = !navigator.serviceWorker.controller;
      navigator.serviceWorker.register("sw.js").then(function (reg) {
        /* controlla se su GitHub c'è una versione nuova ogni volta che l'app torna in primo piano */
        document.addEventListener("visibilitychange", function () {
          if (document.visibilityState === "visible") reg.update().catch(function () {});
        });
      }).catch(function () { /* il gioco funziona lo stesso */ });
      /* versione nuova attivata: si ricarica solo se si è ancora sulla schermata iniziale */
      navigator.serviceWorker.addEventListener("controllerchange", function () {
        if (primaVolta) return;
        if (window.App.sulTitolo && window.App.sulTitolo()) location.reload();
        else window.App.daAggiornare = true;
      });
    }
  };
})();
