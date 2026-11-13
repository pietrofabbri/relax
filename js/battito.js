/*
 * Il battito del personaggio. È SIMULATO e il gioco lo dichiara.
 * Il valore si avvicina piano al "bersaglio": così si vede che il corpo
 * cambia e poi torna in equilibrio da solo (roadmap B1.4, B1.5).
 */
(function () {
  "use strict";

  var elemento, numero, simulato;
  var valore = 72;
  var bersaglio = 72;
  var base = 72;
  var velocita = 0.6;          /* battiti al secondo verso il bersaglio */
  var prossimoColpo = 0;
  var udibile = false;
  var visibile = false;
  var ritornoTimer = null;

  function aggiorna() {
    if (!elemento) return;
    numero.textContent = Math.round(valore);
    elemento.style.setProperty("--periodo", (60 / Math.max(30, valore)).toFixed(3) + "s");
    elemento.setAttribute("aria-label", "Battito di Hayy: " + Math.round(valore) + " al minuto, simulato");
  }

  window.Battito = {
    prepara: function () {
      elemento = document.getElementById("battito");
      numero = document.getElementById("battito-numero");
      simulato = document.getElementById("battito-simulato");
      simulato.textContent = window.TESTI.gioco.battitoSimulato;
      aggiorna();
    },
    mostra: function () { visibile = true; elemento.classList.remove("nascosto"); },
    nascondi: function () { visibile = false; elemento.classList.add("nascosto"); },
    visibile: function () { return visibile; },
    valore: function () { return valore; },
    base: function () { return base; },
    /* Porta il battito verso un valore. Se "torna" è indicato, dopo quei secondi torna alla base. */
    vai: function (bpm, torna) {
      bersaglio = bpm;
      if (ritornoTimer) clearTimeout(ritornoTimer);
      if (torna) {
        ritornoTimer = setTimeout(function () { bersaglio = base; }, torna * 1000);
      }
    },
    velocita: function (v) { velocita = v; },
    calma: function () { bersaglio = base; },
    udibile: function (si) { udibile = !!si; },
    /* Chiamata a ogni fotogramma */
    passo: function (dt, adesso) {
      var diff = bersaglio - valore;
      var passoMax = velocita * dt;
      if (Math.abs(diff) <= passoMax) valore = bersaglio;
      else valore += Math.sign(diff) * passoMax;
      aggiorna();

      if (adesso >= prossimoColpo && valore > 0) {
        prossimoColpo = adesso + 60000 / Math.max(30, valore);
        if (udibile) window.Suoni.battito(0.45);
        var toccato = !navigator.userActivation || navigator.userActivation.hasBeenActive;
        if (visibile && toccato && window.Salvataggio.impostazioni().vibrazione && navigator.vibrate) {
          try { navigator.vibrate(18); } catch (e) { /* non supportato */ }
        }
      }
    },
    /* Calma: 0 = calmo, 1 = molto agitato. Serve al mondo per colori e luce. */
    agitazione: function () {
      return Math.max(0, Math.min(1, (valore - base) / 50));
    }
  };
})();
