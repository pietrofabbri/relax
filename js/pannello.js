/* Finestre di testo e scelte. Ogni funzione restituisce una Promise, così le scene si scrivono in ordine, come un racconto. */
(function () {
  "use strict";

  var radice, titolo, testo, azioni;
  var aperto = false;

  function prepara() {
    radice = document.getElementById("pannello");
    titolo = document.getElementById("pannello-titolo");
    testo = document.getElementById("pannello-testo");
    azioni = document.getElementById("pannello-azioni");
  }

  function paragrafo(contenuto, classe) {
    var p = document.createElement("p");
    if (classe) p.className = classe;
    p.textContent = contenuto;
    return p;
  }

  function bottone(etichetta, classe, alClic) {
    var b = document.createElement("button");
    b.className = "bottone " + (classe || "");
    b.textContent = etichetta;
    b.addEventListener("click", function (e) {
      e.stopPropagation();
      window.Suoni.sblocca();
      alClic();
    });
    return b;
  }

  function apri(t) {
    titolo.textContent = t || "";
    testo.innerHTML = "";
    azioni.innerHTML = "";
    radice.classList.remove("nascosto", "titolo");
    aperto = true;
  }

  function chiudi() {
    radice.classList.add("nascosto");
    aperto = false;
    window.Voce.zitto();
  }

  function leggiSeServe(contenuto) {
    if (window.Salvataggio.impostazioni().voce) window.Voce.leggi(contenuto);
  }

  function aggiungiAscolta(contenuto) {
    if (!window.Voce.disponibile) return;
    azioni.appendChild(bottone(window.TESTI.gioco.ascolta, "secondario", function () { window.Voce.leggi(contenuto); }));
  }

  window.Pannello = {
    prepara: prepara,
    aperto: function () { return aperto; },
    chiudi: chiudi,
    paragrafo: paragrafo,
    bottone: bottone,
    elementi: function () { return { radice: radice, titolo: titolo, testo: testo, azioni: azioni }; },
    apri: apri,

    /* Mostra una serie di frasi, una schermata alla volta. */
    racconta: function (frasi, t) {
      var grezza = Array.isArray(frasi) ? frasi : [frasi];
      var lista = grezza.filter(function (f) { return !!f; });
      if (lista.length !== grezza.length && window.console) console.warn("Respira: testo mancante in un racconto", grezza);
      if (!lista.length) return Promise.resolve();
      return new Promise(function (risolvi) {
        var i = 0;
        function mostra() {
          apri(t);
          testo.appendChild(paragrafo(lista[i]));
          aggiungiAscolta(lista[i]);
          var ultima = i === lista.length - 1;
          var b = bottone(ultima ? window.TESTI.gioco.continua : window.TESTI.gioco.avanti, "principale", function () {
            if (ultima) { chiudi(); risolvi(); } else { i++; mostra(); }
          });
          azioni.appendChild(b);
          b.focus();
          leggiSeServe(lista[i]);
        }
        mostra();
      });
    },

    /* Pannelli con titolo e testo (per esempio il prologo). */
    pagine: function (lista) {
      return new Promise(function (risolvi) {
        var i = 0;
        function mostra() {
          apri(lista[i].titolo);
          testo.appendChild(paragrafo(lista[i].testo));
          aggiungiAscolta(lista[i].testo);
          var ultima = i === lista.length - 1;
          var b = bottone(ultima ? window.TESTI.gioco.continua : window.TESTI.gioco.avanti, "principale", function () {
            if (ultima) { chiudi(); risolvi(); } else { i++; mostra(); }
          });
          azioni.appendChild(b);
          b.focus();
          leggiSeServe(lista[i].testo);
        }
        mostra();
      });
    },

    /* Una scelta tra più bottoni: risolve con l'indice scelto. */
    scegli: function (t, frasi, etichette) {
      return new Promise(function (risolvi) {
        apri(t);
        (Array.isArray(frasi) ? frasi : [frasi]).forEach(function (f) { testo.appendChild(paragrafo(f)); });
        etichette.forEach(function (et, i) {
          azioni.appendChild(bottone(et, i === etichette.length - 1 ? "principale" : "secondario", function () {
            chiudi();
            risolvi(i);
          }));
        });
        leggiSeServe((Array.isArray(frasi) ? frasi : [frasi]).join(" "));
      });
    }
  };
})();
