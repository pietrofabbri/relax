/* Didascalie: una riga alla volta, in basso. Sostituiscono le finestre di testo. */
(function () {
  "use strict";

  var box, testo, freccia, cattura, suggerimento;
  var attesa = null;

  function chiudi() {
    box.classList.remove("visibile");
    cattura.classList.add("nascosto");
    window.Voce.zitto();
    if (attesa) { var a = attesa; attesa = null; a(); }
  }

  window.Didascalia = {
    prepara: function () {
      box = document.getElementById("didascalia");
      testo = document.getElementById("didascalia-testo");
      freccia = document.getElementById("didascalia-freccia");
      cattura = document.getElementById("cattura");
      suggerimento = document.getElementById("suggerimento");
      cattura.addEventListener("pointerdown", function (e) {
        e.preventDefault();
        window.Suoni.sblocca();
        chiudi();
      });
    },

    /*
     * Mostra una frase. Se "tocca" è vero, aspetta un tocco; altrimenti sparisce dopo "durata" secondi.
     * Restituisce una Promise che si risolve quando la frase sparisce.
     */
    mostra: function (frase, o) {
      o = o || {};
      return new Promise(function (risolvi) {
        if (attesa) { var vecchia = attesa; attesa = null; vecchia(); }
        testo.innerHTML = (o.icona ? window.Icone.svg(o.icona, "chi") : "") + window.Storia.formatta(frase);
        box.classList.remove("visibile");
        void box.offsetWidth;
        box.classList.add("visibile");
        var tocca = o.tocca !== false;
        freccia.classList.toggle("nascosto", !tocca);
        if (window.Salvataggio.impostazioni().voce) window.Voce.leggi(frase.replace(/\*/g, ""));
        attesa = risolvi;
        if (tocca) {
          cattura.classList.remove("nascosto");
        } else {
          setTimeout(function () { if (attesa === risolvi) chiudi(); }, (o.durata || 2.4) * 1000);
        }
      });
    },

    /* Più frasi, una dopo l'altra, ognuna con un tocco. */
    sequenza: function (frasi) {
      var D = window.Didascalia;
      return frasi.reduce(function (pr, f) { return pr.then(function () { return D.mostra(f); }); }, Promise.resolve());
    },

    chiudi: chiudi,

    /* Indicazione fissa in alto ("cosa devo fare"), finché non cambia. */
    obiettivo: function (frase) {
      if (!frase) { suggerimento.classList.add("nascosto"); return; }
      suggerimento.innerHTML = "<span class=\"freccia-obiettivo\">▶</span>" + window.Storia.formatta(frase);
      suggerimento.classList.remove("nascosto");
    }
  };
})();
