/* Il quaderno del Guardiano: raccoglie le scoperte sul corpo. Ogni pagina indica il passo della roadmap. */
(function () {
  "use strict";

  var pagine = [];   /* { id, titolo, testo, roadmap } */
  var codaAvvisi = Promise.resolve();

  function salva() {
    var p = window.Salvataggio.progressi("quaderno");
    p.pagine = pagine;
    window.Salvataggio.salvaProgressi();
  }

  /* Piccolo avviso in alto: non ferma il gioco. */
  function avviso(pagina) {
    var el = document.getElementById("avviso-quaderno");
    el.querySelector(".avviso-titolo").textContent = pagina.titolo;
    el.querySelector(".avviso-testo").textContent = pagina.testo;
    el.classList.add("visibile");
    window.Suoni.scoperta();
    var btn = document.getElementById("btn-quaderno");
    btn.classList.add("nuovo");
    return new Promise(function (r) {
      setTimeout(function () {
        el.classList.remove("visibile");
        setTimeout(function () { btn.classList.remove("nuovo"); r(); }, 500);
      }, 3200);
    });
  }

  window.Quaderno = {
    carica: function () {
      var p = window.Salvataggio.progressi("quaderno");
      pagine = Array.isArray(p.pagine) ? p.pagine.slice() : [];
    },
    azzera: function () { pagine = []; salva(); },
    ha: function (id) { return pagine.some(function (x) { return x.id === id; }); },
    numero: function () { return pagine.length; },

    /* Aggiunge una pagina e mostra l'avviso. La Promise si risolve subito: il gioco non si ferma. */
    aggiungi: function (pagina) {
      var esistente = -1;
      pagine.forEach(function (x, i) { if (x.id === pagina.id) esistente = i; });
      if (esistente >= 0) pagine[esistente] = pagina; else pagine.push(pagina);
      salva();
      codaAvvisi = codaAvvisi.then(function () { return avviso(pagina); });
      return Promise.resolve();
    },

    mostra: function () {
      var P = window.Pannello;
      return new Promise(function (risolvi) {
        P.apri(window.TESTI.quaderno.titolo);
        var el = P.elementi();
        if (!pagine.length) el.testo.appendChild(P.paragrafo(window.TESTI.quaderno.vuoto));
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
