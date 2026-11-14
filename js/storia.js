/*
 * La storia, sempre chiara: il prologo con la cartina, e un "capitolo" a ogni tappa
 * con il filo della storia e il punto in cui ci si trova ("Sei qui").
 * Distingue sempre cosa succede nel libro e cosa si fa nel gioco.
 */
(function () {
  "use strict";

  var G = function () { return window.TESTI.gioco; };
  var corrente = null; /* { capitoli, ordine, nome } */

  /* testo sicuro: *parola* evidenziata, \n a capo */
  function formatta(t) {
    var e = String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return e.replace(/\*([^*]+)\*/g, '<b class="evidenzia">$1</b>').replace(/\n/g, "<br>");
  }

  function immagine(nome) {
    var I = window.Icone, C = window.Cartina;
    if (nome === "cartina-andalus") {
      return C.svg({ punti: [{ luogo: C.luoghi.andalus, nome: "Al-Andalus", grande: true }] });
    }
    if (nome === "cartina-isola") {
      return C.svg({
        punti: [{ luogo: C.luoghi.andalus, nome: "Al-Andalus" }, { luogo: C.luoghi.isolaHayy, nome: "L'isola di Hayy", colore: "#2e9e5a", isola: true, grande: true, dx: -60 }],
        rotta: [C.luoghi.andalus, [8, 37.8], [25, 33.2], [32.5, 32], [33.6, 27.5], [39, 17.5], [44, 12.2], [60, 8], [79, -4]]
      });
    }
    if (nome === "gazzella-bimbo") return '<div class="coppia">' + I.svg("gazzella", "gigante") + I.svg("cuore", "piccola battente") + I.svg("bimbo", "gigante") + "</div>";
    return '<div class="coppia">' + I.svg(nome, "gigante") + "</div>";
  }

  function striscia(capitoli, ordine, attuale) {
    var I = window.Icone;
    var i0 = ordine.indexOf(attuale);
    var h = '<div class="filo">';
    ordine.forEach(function (nome, i) {
      var stato = i < i0 ? "fatto" : i === i0 ? "attuale" : "dopo";
      h += '<div class="nodo ' + stato + '" style="animation-delay:' + (i * 0.05) + 's">' +
        (stato === "attuale" ? '<span class="sei-qui">' + G().seiQui + "</span>" : "") +
        '<div class="tondo-nodo">' + I.svg(capitoli[nome].icona) + "</div>" +
        '<span class="num">' + (i + 1) + "</span></div>";
      if (i < ordine.length - 1) h += '<div class="tratto ' + (i < i0 ? "fatto" : "") + '"></div>';
    });
    return h + "</div>";
  }

  window.Storia = {
    formatta: formatta,

    /* prepara il libro del livello: capitoli e ordine */
    usa: function (capitoli, ordine) { corrente = { capitoli: capitoli, ordine: ordine, nome: null }; },
    attuale: function () { return corrente && corrente.nome; },

    /* Prologo: immagini grandi e una frase per volta */
    prologo: function (schede) {
      var box = document.getElementById("racconto");
      return new Promise(function (fatto) {
        var i = 0;
        function mostra() {
          var s = schede[i];
          box.innerHTML =
            '<div class="scena-racconto">' + immagine(s.immagine) + "</div>" +
            '<div class="frase-racconto"><p>' + formatta(s.testo) + "</p></div>" +
            '<div class="puntini">' + schede.map(function (_, k) { return '<i class="' + (k === i ? "on" : k < i ? "fatto" : "") + '"></i>'; }).join("") + "</div>" +
            '<button class="salta-racconto">' + G().salta + " ▸▸</button>" +
            '<div class="tocca-racconto">' + G().tocchi + " ▸</div>";
          box.classList.remove("nascosto");
          box.querySelector(".salta-racconto").addEventListener("click", function (e) { e.stopPropagation(); chiudi(); });
          window.Suoni.whoosh();
        }
        function chiudi() { box.classList.add("nascosto"); box.onclick = null; fatto(); }
        box.onclick = function () {
          window.Suoni.sblocca();
          i++;
          if (i >= schede.length) chiudi(); else mostra();
        };
        mostra();
      });
    },

    /* Capitolo: dove siamo nella storia. numero parte da 1 */
    capitolo: function (nome) {
      corrente.nome = nome;
      var c = corrente.capitoli[nome], n = corrente.ordine.indexOf(nome) + 1, tot = corrente.ordine.length;
      var I = window.Icone;
      var box = document.getElementById("capitolo");
      var libro = c.libro.map(function (r, k) { return '<li style="animation-delay:' + (0.5 + k * 0.45) + 's">' + formatta(r) + "</li>"; }).join("");
      box.innerHTML =
        '<div class="cap-sinistra"><div class="raggi"></div><div class="cap-icona">' + I.svg(c.icona) + "</div></div>" +
        '<div class="cap-destra">' +
        '<div class="cap-nastro">' + G().capitolo + " " + n + " / " + tot + "</div>" +
        '<h2 class="cap-titolo">' + formatta(c.titolo) + "</h2>" +
        '<div class="cap-libro"><span class="etichetta-libro">' + I.svg("libro") + G().nelLibro + "</span><ul>" + libro + "</ul></div>" +
        '<div class="cap-gioco" style="animation-delay:' + (0.6 + c.libro.length * 0.45) + 's"><span>▶</span> ' + formatta(c.gioco) + "</div>" +
        "</div>" +
        striscia(corrente.capitoli, corrente.ordine, nome) +
        '<div class="tocca-racconto">' + G().tocchi + " ▸</div>";
      box.classList.remove("nascosto");
      window.Suoni.fanfara(1);
      return new Promise(function (fatto) {
        var pronto = false;
        setTimeout(function () { pronto = true; box.classList.add("pronto"); }, 700);
        box.onclick = function () {
          if (!pronto) return;
          window.Suoni.sblocca();
          window.Suoni.pop();
          box.onclick = null;
          box.classList.add("esce");
          setTimeout(function () { box.classList.add("nascosto"); box.classList.remove("esce", "pronto"); fatto(); }, 280);
        };
      });
    },

    /* il filo della storia, da consultare in qualsiasi momento (bottone in alto) */
    mostraFilo: function () {
      if (!corrente) return Promise.resolve();
      var P = window.Pannello;
      return new Promise(function (r) {
        P.apri(window.TESTI.gioco.storia);
        var el = P.elementi();
        var d = document.createElement("div");
        d.innerHTML = striscia(corrente.capitoli, corrente.ordine, corrente.nome || corrente.ordine[0]);
        var c = corrente.capitoli[corrente.nome || corrente.ordine[0]];
        var testo = document.createElement("div");
        testo.className = "filo-testo";
        testo.innerHTML = "<b>" + formatta(c.titolo) + "</b><br>" + c.libro.map(formatta).join(" ");
        el.testo.appendChild(d.firstChild);
        el.testo.appendChild(testo);
        var b = P.bottone(window.TESTI.gioco.chiudi, "principale", function () { P.chiudi(); r(); });
        el.azioni.appendChild(b);
      });
    }
  };
})();
