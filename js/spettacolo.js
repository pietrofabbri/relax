/*
 * Spettacolo: punti, serie (combo), stelle di fine tappa, "Indovina!" e sipario.
 * Serve a tutti i livelli: ogni gesto riuscito deve fare festa, ogni scoperta deve avere un premio.
 *
 *   S.premio(10, x, y)          punti con scritta che salta fuori nel mondo
 *   S.serie() / S.rompi()       la serie cresce a ogni colpo riuscito; i punti si moltiplicano
 *   S.tappa("corsa", 300)       comincia a contare i punti della tappa (300 = punteggio pieno)
 *   S.stelle()                  fine tappa: da 1 a 3 stelle, con fanfara (Promise)
 *   S.indovina(domanda, opz, i) prima dell'esperimento si scommette su cosa succederà (Promise<bool>)
 *   S.sipario(n, titolo, fai)   cambio di scena con il numero e il nome della tappa (Promise)
 */
(function () {
  "use strict";

  var M = window.Mondo;
  var stato = { totale: 0, serie: 0, tappa: null, max: 1, presi: 0, stelleTot: 0, stelleMax: 0 };
  var hud, numero, salva = function () {};

  function aggiornaHud(salta) {
    numero.textContent = stato.totale;
    if (salta) {
      hud.classList.remove("salta");
      void hud.offsetWidth;
      hud.classList.add("salta");
    }
  }

  window.Spettacolo = {
    prepara: function (salvataggio) {
      hud = document.getElementById("punti");
      numero = document.getElementById("punti-numero");
      if (salvataggio) {
        stato.totale = salvataggio.punti || 0;
        stato.stelleTot = salvataggio.stelle || 0;
        stato.stelleMax = salvataggio.stelleMax || 0;
        salva = function () {
          salvataggio.punti = stato.totale;
          salvataggio.stelle = stato.stelleTot;
          salvataggio.stelleMax = stato.stelleMax;
          window.Salvataggio.salvaProgressi();
        };
      }
      aggiornaHud(false);
    },

    mostra: function () { hud.classList.remove("nascosto"); },

    /* punti con festa. testo facoltativo ("PERFETTO!"), altrimenti "+n" */
    premio: function (n, x, y, testo, o) {
      o = o || {};
      var molt = o.serie ? Math.max(1, stato.serie) : 1;
      var tot = n * molt;
      stato.totale += tot;
      stato.presi += tot;
      if (x !== undefined) {
        M.scritta(testo || ("+" + tot), x, y, { dim: o.dim || (testo ? 80 : 54), colore: o.colore || "#ffd27a" });
        if (testo && tot) M.scritta("+" + tot, x + 10, y + 70, { dim: 40, colore: "#ffffff", vita: 1.1 });
        M.emetti("stella", x, y + 20, o.scintille || 12, { dispersione: 380 });
      }
      window.Suoni.ding(o.nota !== undefined ? o.nota : stato.serie);
      aggiornaHud(true);
      salva();
      return tot;
    },

    serie: function () { stato.serie++; return stato.serie; },
    rompi: function () { stato.serie = 0; },
    valoreSerie: function () { return stato.serie; },

    tappa: function (nome, max) { stato.tappa = nome; stato.max = max || 1; stato.presi = 0; stato.serie = 0; },

    /* fine tappa: stelle che arrivano una alla volta */
    stelle: function () {
      var r = stato.presi / stato.max;
      var n = r >= 0.8 ? 3 : r >= 0.45 ? 2 : 1;
      stato.stelleTot += n;
      stato.stelleMax += 3;
      salva();
      var box = document.getElementById("stelle");
      var figli = box.querySelectorAll(".stella");
      figli.forEach(function (s) { s.classList.remove("piena", "accesa"); });
      box.classList.remove("nascosto");
      box.classList.add("visibile");
      return new Promise(function (fatto) {
        var i = 0;
        function prossima() {
          if (i < 3) {
            figli[i].classList.add("accesa");
            if (i < n) { figli[i].classList.add("piena"); window.Suoni.stella(i); M.scuoti(6, 0.15); }
            i++;
            setTimeout(prossima, 260);
          } else {
            window.Suoni.fanfara(n);
            if (n === 3) M.coriandoli(M.camera.x + M.vista() / 2, 300, 70);
            setTimeout(function () {
              box.classList.remove("visibile");
              setTimeout(function () { box.classList.add("nascosto"); fatto(n); }, 300);
            }, 1100);
          }
        }
        setTimeout(prossima, 250);
      });
    },

    riepilogo: function () { return { punti: stato.totale, stelle: stato.stelleTot, max: stato.stelleMax }; },

    /* "Indovina!": prima dell'esperimento si sceglie cosa succederà. opzioni: [{ icona, testo }] */
    indovina: function (domanda, opzioni, giusta) {
      var box = document.getElementById("indovina");
      var titolo = box.querySelector(".domanda");
      var scelte = box.querySelector(".scelte");
      titolo.textContent = domanda;
      scelte.innerHTML = "";
      box.classList.remove("nascosto");
      return new Promise(function (fatto) {
        opzioni.forEach(function (op, i) {
          var b = document.createElement("button");
          b.className = "scelta";
          b.innerHTML = '<span class="icona"></span><span class="testo"></span>';
          b.querySelector(".icona").textContent = op.icona;
          b.querySelector(".testo").textContent = op.testo;
          b.addEventListener("click", function (e) {
            e.stopPropagation();
            window.Suoni.sblocca();
            var giusto = i === giusta;
            scelte.querySelectorAll(".scelta").forEach(function (x, k) {
              x.disabled = true;
              if (k === giusta) x.classList.add("giusta");
            });
            if (!giusto) b.classList.add("sbagliata");
            if (giusto) {
              window.Suoni.fanfara(2);
              window.Spettacolo.premio(50, undefined, undefined);
            } else {
              window.Suoni.ops();
            }
            setTimeout(function () { box.classList.add("nascosto"); fatto(giusto); }, giusto ? 900 : 1300);
          });
          scelte.appendChild(b);
        });
      });
    },

    /* cambio di scena: il cerchio si chiude, compare la tappa, si riapre */
    sipario: function (numero, titolo, alBuio, x, y) {
      window.Suoni.whoosh();
      return M.sipario({ numero: String(numero), titolo: titolo, alBuio: alBuio, x: x, y: y, pausa: 1.0 });
    }
  };
})();
