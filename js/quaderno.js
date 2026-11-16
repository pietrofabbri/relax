/*
 * L'album delle scoperte: ogni scoperta sul corpo è una carta da collezionare.
 * Ogni carta ha un simbolo, un titolo, una frase e il passo della roadmap (B1.1, R1.1…).
 * Quando se ne trova una, la carta entra in scena girandosi, con un lampo.
 */
(function () {
  "use strict";

  var pagine = [];     /* carte trovate: { id, titolo, testo, icona, roadmap } */
  var catalogo = [];   /* tutte le carte del livello, per mostrare quelle ancora da trovare */
  var coda = Promise.resolve();

  function salva() {
    var p = window.Salvataggio.progressi("quaderno");
    p.pagine = pagine;
    window.Salvataggio.salvaProgressi();
  }

  function colore(roadmap) {
    var f = (roadmap || "B")[0];
    return { B: "verde", R: "rosso", A: "oro", "★": "oro", E: "viola", S: "blu", M: "rosa" }[f] || "verde";
  }

  function htmlCarta(pg, girata) {
    var I = window.Icone, F = window.Storia.formatta;
    return '<div class="carta ' + colore(pg.roadmap) + (girata ? " girata" : "") + '">' +
      '<div class="carta-faccia">' +
      '<div class="carta-codice">' + (pg.roadmap || "") + "</div>" +
      '<div class="carta-icona">' + I.svg(pg.icona || "stella") + "</div>" +
      '<div class="carta-titolo">' + F(pg.titolo) + "</div>" +
      '<div class="carta-testo">' + F(pg.testo) + "</div>" +
      '<div class="lucido"></div>' +
      "</div></div>";
  }

  /* la carta nuova: entra girando, luccica, poi vola verso il bottone dell'album */
  function rivela(pg) {
    var box = document.getElementById("carta-nuova");
    box.innerHTML = '<div class="nastro-nuova">' + window.TESTI.quaderno.nuovaPagina + "</div>" + htmlCarta(pg) +
      '<div class="raggi"></div>';
    box.classList.remove("nascosto", "vola");
    window.Suoni.fanfara(2);
    var btn = document.getElementById("btn-quaderno");
    return new Promise(function (r) {
      var chiuso = false;
      function chiudi() {
        if (chiuso) return;
        chiuso = true;
        box.onclick = null;
        box.classList.add("vola");
        btn.classList.add("nuovo");
        setTimeout(function () { box.classList.add("nascosto"); box.classList.remove("vola"); r(); }, 500);
        setTimeout(function () { btn.classList.remove("nuovo"); }, 2000);
      }
      setTimeout(function () { box.onclick = chiudi; }, 600);
      setTimeout(chiudi, 2600);
    });
  }

  window.Quaderno = {
    carica: function () {
      var p = window.Salvataggio.progressi("quaderno");
      pagine = Array.isArray(p.pagine) ? p.pagine.slice() : [];
    },
    /* le carte che si possono trovare nel livello: { id: { titolo, testo, icona, roadmap } } */
    catalogo: function (tutte) {
      catalogo = Object.keys(tutte).map(function (id) { var c = tutte[id]; return { id: id, titolo: c.titolo, testo: c.testo, icona: c.icona, roadmap: c.roadmap, oro: !!c.oro }; });
    },
    azzera: function () { pagine = []; salva(); },
    ha: function (id) { return pagine.some(function (x) { return x.id === id; }); },
    numero: function () { return pagine.length; },
    totale: function () { return catalogo.length; },

    /* aggiunge la carta e la mostra; la Promise si risolve quando la carta è volata nell'album */
    aggiungi: function (pagina) {
      var esistente = -1;
      pagine.forEach(function (x, i) { if (x.id === pagina.id) esistente = i; });
      if (esistente >= 0) pagine[esistente] = pagina; else pagine.push(pagina);
      salva();
      coda = coda.then(function () { return rivela(pagina); });
      return coda;
    },

    mostra: function () {
      var P = window.Pannello, Q = window.TESTI.quaderno, I = window.Icone;
      return new Promise(function (risolvi) {
        P.apri(Q.titolo);
        var el = P.elementi();
        var conto = document.createElement("p");
        conto.className = "conto-carte";
        conto.textContent = pagine.length + " / " + Math.max(catalogo.length, pagine.length) + " " + Q.raccolte;
        el.testo.appendChild(conto);
        var griglia = document.createElement("div");
        griglia.className = "album";
        var elenco = catalogo.length ? catalogo : pagine;
        elenco.forEach(function (c) {
          var trovata = null;
          pagine.forEach(function (x) { if (x.id === c.id) trovata = x; });
          var cella = document.createElement("div");
          cella.className = "cella-album";
          if (trovata) {
            cella.innerHTML = htmlCarta(trovata);
            cella.addEventListener("click", function () { cella.classList.toggle("ingrandita"); window.Suoni.pop(); });
          } else {
            cella.innerHTML = '<div class="carta bloccata' + (c.oro ? " oro" : "") + '"><div class="carta-faccia"><div class="carta-icona">' + I.svg(c.oro ? "stella" : "lucchetto") +
              '</div><div class="carta-titolo">?</div><div class="carta-testo">' + (c.oro ? Q.bloccataOro : Q.bloccata) + "</div></div></div>";
          }
          griglia.appendChild(cella);
        });
        el.testo.appendChild(griglia);
        var b = P.bottone(window.TESTI.gioco.chiudi, "principale", function () { P.chiudi(); risolvi(); });
        el.azioni.appendChild(b);
        b.focus();
      });
    }
  };
})();
