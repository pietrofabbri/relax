/* Avvio del gioco: schermata iniziale, impostazioni, pulsanti fissi. */
(function () {
  "use strict";

  var G = window.TESTI.gioco;
  var P = window.Pannello;

  function schermataIniziale() {
    var progressi = window.Salvataggio.progressi("livello1");
    var giaIniziato = !!progressi.tappa;

    P.apri("");
    var el = P.elementi();
    var h = document.createElement("h1");
    h.className = "titolo-gioco";
    h.textContent = G.titolo;
    el.testo.appendChild(h);
    el.testo.appendChild(P.paragrafo(G.sottotitolo, "sottotitolo"));
    el.testo.appendChild(P.paragrafo(G.avvisoTerapia, "piccolo"));
    el.testo.appendChild(P.paragrafo(G.salvataggio, "piccolo"));

    el.azioni.appendChild(P.bottone(G.impostazioni, "secondario", function () {
      impostazioni().then(schermataIniziale);
    }));
    if (giaIniziato) {
      el.azioni.appendChild(P.bottone(G.ricomincia, "secondario", function () {
        window.Salvataggio.azzera();
        window.location.reload();
      }));
    }
    var b = P.bottone(giaIniziato ? G.continua : G.inizia, "principale", function () {
      P.chiudi();
      document.getElementById("barra").classList.remove("nascosto");
      window.Livello1.inizia();
    });
    el.azioni.appendChild(b);
    b.focus();
  }

  function impostazioni() {
    var I = window.TESTI.impostazioni;
    var valori = window.Salvataggio.impostazioni();
    return new Promise(function (r) {
      P.apri(I.titolo);
      var el = P.elementi();
      [
        ["testoGrande", I.testoGrande],
        ["voce", I.voce, !window.Voce.disponibile],
        ["suoni", I.suoni],
        ["vibrazione", I.vibrazione, !navigator.vibrate],
        ["movimentoRidotto", I.movimentoRidotto]
      ].forEach(function (op) {
        if (op[2]) return;
        var etichetta = document.createElement("label");
        etichetta.className = "opzione";
        var c = document.createElement("input");
        c.type = "checkbox";
        c.checked = !!valori[op[0]];
        c.addEventListener("change", function () { window.Salvataggio.imposta(op[0], c.checked); });
        etichetta.appendChild(c);
        etichetta.appendChild(document.createTextNode(op[1]));
        el.testo.appendChild(etichetta);
      });
      var b = P.bottone(G.chiudi, "principale", function () { P.chiudi(); r(); });
      el.azioni.appendChild(b);
      b.focus();
    });
  }

  function avvia() {
    window.Salvataggio.applica();
    window.Battito.prepara();
    P.prepara();
    window.Quaderno.carica();
    window.Mondo.prepara();
    window.Livello1.carica();

    document.getElementById("btn-quaderno").addEventListener("click", function () {
      if (!P.aperto()) window.Quaderno.mostra();
    });
    document.getElementById("btn-impostazioni").addEventListener("click", function () {
      if (!P.aperto()) impostazioni();
    });

    schermataIniziale();

    /* Funzionamento offline quando il gioco è pubblicato online (non serve aprendo il file da una chiavetta). */
    if ("serviceWorker" in navigator && /^https?:$/.test(window.location.protocol)) {
      navigator.serviceWorker.register("sw.js").catch(function () { /* il gioco funziona lo stesso */ });
    }

    /* Per i test automatici */
    window.RESPIRA = { livello: window.Livello1, mondo: window.Mondo, battito: window.Battito, quaderno: window.Quaderno };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", avvia);
  else avvia();
})();
