/* Il quaderno del Guardiano: raccoglie le scoperte sul corpo. Ogni pagina indica il passo della roadmap. */
(function () {
  "use strict";

  var pagine = [];   /* { id, titolo, testo, roadmap } */

  function salva() {
    var p = window.Salvataggio.progressi("quaderno");
    p.pagine = pagine;
    window.Salvataggio.salvaProgressi();
  }

  window.Quaderno = {
    carica: function () {
      var p = window.Salvataggio.progressi("quaderno");
      pagine = Array.isArray(p.pagine) ? p.pagine.slice() : [];
    },
    azzera: function () { pagine = []; salva(); },
    ha: function (id) { return pagine.some(function (x) { return x.id === id; }); },
    numero: function () { return pagine.length; },

    /* Aggiunge una pagina (o la aggiorna, se esiste già) e mostra un piccolo avviso. */
    aggiungi: function (pagina) {
      var esistente = -1;
      pagine.forEach(function (x, i) { if (x.id === pagina.id) esistente = i; });
      if (esistente >= 0) pagine[esistente] = pagina; else pagine.push(pagina);
      salva();
      window.Suoni.scoperta();
      var P = window.Pannello;
      return new Promise(function (risolvi) {
        P.apri(window.TESTI.quaderno.nuovaPagina);
        var el = P.elementi();
        var h = document.createElement("h3");
        h.textContent = pagina.titolo;
        el.testo.appendChild(h);
        el.testo.appendChild(P.paragrafo(pagina.testo));
        if (window.Voce.disponibile) {
          el.azioni.appendChild(P.bottone(window.TESTI.gioco.ascolta, "secondario", function () {
            window.Voce.leggi(pagina.titolo + ". " + pagina.testo);
          }));
        }
        var b = P.bottone(window.TESTI.gioco.continua, "principale", function () { P.chiudi(); risolvi(); });
        el.azioni.appendChild(b);
        b.focus();
        if (window.Salvataggio.impostazioni().voce) window.Voce.leggi(pagina.titolo + ". " + pagina.testo);
      });
    },

    /* Mostra tutto il quaderno. */
    mostra: function () {
      var P = window.Pannello;
      return new Promise(function (risolvi) {
        P.apri(window.TESTI.quaderno.titolo);
        var el = P.elementi();
        if (!pagine.length) {
          el.testo.appendChild(P.paragrafo(window.TESTI.quaderno.vuoto));
        }
        pagine.forEach(function (pg) {
          var d = document.createElement("div");
          d.className = "pagina-quaderno";
          var h = document.createElement("h3");
          h.textContent = pg.titolo;
          if (pg.roadmap) {
            var c = document.createElement("span");
            c.className = "codice";
            c.textContent = pg.roadmap;
            h.appendChild(c);
          }
          d.appendChild(h);
          d.appendChild(P.paragrafo(pg.testo));
          el.testo.appendChild(d);
        });
        var b = P.bottone(window.TESTI.gioco.chiudi, "principale", function () { P.chiudi(); risolvi(); });
        el.azioni.appendChild(b);
        b.focus();
      });
    }
  };
})();
