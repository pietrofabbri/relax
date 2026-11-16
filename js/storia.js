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

  /* quanto serve per leggere una frase: circa 3 parole al secondo, mai meno di 1,4 secondi */
  function tempoLettura(t) {
    var parole = String(t).replace(/\*/g, "").split(/\s+/).filter(Boolean).length;
    return Math.max(1.4, parole * 0.33);
  }

  /* barra che si riempie mentre si legge; poi compare "Tocca per continuare" */
  function attesaLettura(box, secondi) {
    var barra = box.querySelector(".barra-lettura i");
    var invito = box.querySelector(".tocca-racconto");
    if (invito) invito.classList.add("spento");
    if (barra) { barra.style.transition = "none"; barra.style.width = "0%"; void barra.offsetWidth; barra.style.transition = "width " + secondi + "s linear"; barra.style.width = "100%"; }
    return new Promise(function (r) {
      setTimeout(function () { if (invito) invito.classList.remove("spento"); r(); }, secondi * 1000);
    });
  }

  /*
   * Domanda di comprensione: si va avanti solo con la risposta giusta.
   * Se si sbaglia, la frase che contiene la risposta si illumina, e si riprova.
   * dove: elemento in cui mettere la domanda; righe: elementi delle frasi (per illuminarle)
   */
  function domanda(dove, d, righe) {
    var I = window.Icone;
    var box = document.createElement("div");
    box.className = "domanda-lettura";
    box.innerHTML = '<div class="dl-titolo">' + I.svg("occhio") + "<span>" + formatta(d.testo) + '</span></div><div class="dl-scelte"></div>';
    dove.appendChild(box);
    var scelte = box.querySelector(".dl-scelte");
    var errori = 0;
    return new Promise(function (fatto) {
      d.opzioni.forEach(function (op, i) {
        var b = document.createElement("button");
        b.className = "dl-scelta";
        b.innerHTML = formatta(op);
        b.addEventListener("click", function (e) {
          e.stopPropagation();
          window.Suoni.sblocca();
          if (i === d.giusta) {
            b.classList.add("giusta");
            scelte.querySelectorAll("button").forEach(function (x) { x.disabled = true; });
            window.Suoni.fanfara(errori ? 1 : 3);
            /* al primo colpo vale molto di più: è un premio vero */
            if (window.Spettacolo) window.Spettacolo.premio(errori ? 10 : 60);
            if (!errori) {
              b.classList.add("perfetta");
              var bollo = document.createElement("div");
              bollo.className = "bollo-perfetto";
              bollo.innerHTML = window.Icone.svg("stella") + "<span>" + (window.TESTI.gioco.primoColpo || "") + "</span><b>+60</b>";
              box.appendChild(bollo);
            }
            setTimeout(fatto, errori ? 700 : 1500);
          } else {
            b.classList.add("sbagliata");
            b.disabled = true;
            errori++;
            window.Suoni.ops();
            /* un aiuto per ragionare, non la risposta */
            if (d.aiuto) {
              var a = box.querySelector(".dl-aiuto");
              if (!a) { a = document.createElement("div"); a.className = "dl-aiuto"; box.appendChild(a); }
              a.innerHTML = window.Icone.svg("cervello") + "<span>" + formatta(d.aiuto) + "</span>";
              a.classList.remove("rileggi"); void a.offsetWidth; a.classList.add("rileggi");
            }
          }
        });
        scelte.appendChild(b);
      });
    });
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
    tempoLettura: tempoLettura,

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
            '<div class="frase-racconto"><p>' + formatta(s.testo) + '</p><div class="barra-lettura"><i></i></div></div>' +
            '<div class="puntini">' + schede.map(function (_, k) { return '<i class="' + (k === i ? "on" : k < i ? "fatto" : "") + '"></i>'; }).join("") + "</div>" +
            '<button class="salta-racconto">' + G().salta + " ▸▸</button>" +
            '<div class="tocca-racconto">' + G().tocchi + " ▸</div>";
          box.classList.remove("nascosto");
          box.querySelector(".salta-racconto").addEventListener("click", function (e) { e.stopPropagation(); chiudi(); });
          window.Suoni.whoosh();
          pronto = false;
          attesaLettura(box, tempoLettura(s.testo)).then(function () { pronto = true; });
        }
        var pronto = false;
        function chiudi() { box.classList.add("nascosto"); box.onclick = null; fatto(); }
        box.onclick = function () {
          if (!pronto) return;
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
      /* ogni frase arriva quando la precedente ha avuto il tempo di essere letta */
      var t = 0.5, ritardi = c.libro.map(function (r) { var q = t; t += tempoLettura(r) * 0.8; return q; });
      var tGioco = t;
      t += tempoLettura(c.gioco) * 0.6;
      var libro = c.libro.map(function (r, k) { return '<li style="animation-delay:' + ritardi[k].toFixed(2) + 's">' + formatta(r) + "</li>"; }).join("");
      box.innerHTML =
        '<div class="cap-sinistra"><div class="cap-icona">' + I.svg(c.icona) + "</div></div>" +
        '<div class="cap-destra">' +
        '<div class="cap-nastro">' + G().capitolo + " " + n + " / " + tot + "</div>" +
        '<h2 class="cap-titolo">' + formatta(c.titolo) + "</h2>" +
        '<div class="cap-libro"><span class="etichetta-libro">' + I.svg("libro") + G().nelLibro + "</span><ul>" + libro + "</ul></div>" +
        '<div class="cap-gioco" style="animation-delay:' + tGioco.toFixed(2) + 's"><span>▶</span> ' + formatta(c.gioco) + "</div>" +
        '<div class="cap-fondo"></div>' +
        "</div>" +
        striscia(corrente.capitoli, corrente.ordine, nome);
      box.classList.remove("nascosto");
      window.Suoni.whoosh();
      var fondo = box.querySelector(".cap-fondo");
      return new Promise(function (fatto) {
        function esci() {
          window.Suoni.pop();
          box.classList.add("esce");
          setTimeout(function () { box.classList.add("nascosto"); box.classList.remove("esce"); fatto(); }, 280);
        }
        setTimeout(function () {
          if (c.domanda) {
            domanda(fondo, c.domanda, box.querySelectorAll(".cap-libro li")).then(esci);
          } else {
            var b = document.createElement("button");
            b.className = "bottone principale vai-avanti";
            b.textContent = G().avanti;
            b.addEventListener("click", function (e) { e.stopPropagation(); esci(); });
            fondo.appendChild(b);
          }
        }, t * 1000);
      });
    },

    /*
     * Spiegazione a schede, con schemi (come il prologo): una frase per scheda, lo schema si disegna a passi.
     * Alla fine una domanda: si passa solo rispondendo giusto.
     */
    spiega: function (sp) {
      var box = document.getElementById("spiegazione");
      var L = window.TESTI.schemi || {};
      return new Promise(function (fatto) {
        var i = 0, pronto = false;
        function mostra() {
          var s = sp.schede[i], testa;
          if (s.parola) {
            /* parola nuova: prima di usarla, la si vede con un disegno */
            var PN = window.TESTI.paroleNuove, pn = PN[s.parola];
            s = { schema: s.parola, testo: pn.frase, attesa: 3.6 };
            testa = '<div class="sp-testa sp-parola"><span class="pn-nastro">' + PN.nastro + '</span><span class="pn-parola">' + formatta(pn.parola) + "</span></div>";
            window.Suoni.scoperta();
          } else {
            testa = '<div class="sp-testa">' + window.Icone.svg("libro") + "<span>" + formatta(sp.titolo || "") + "</span></div>";
          }
          box.innerHTML = testa +
            '<div class="sp-schema">' + window.Schemi.svg(s.schema, L[s.schema], { fino: s.fino, da: (i > 0 && sp.schede[i - 1].schema === s.schema) ? sp.schede[i - 1].fino : undefined }) + "</div>" +
            '<div class="sp-frase"><p>' + formatta(s.testo) + '</p><div class="barra-lettura"><i></i></div></div>' +
            '<div class="puntini">' + sp.schede.map(function (_, k) { return '<i class="' + (k === i ? "on" : k < i ? "fatto" : "") + '"></i>'; }).join("") + "</div>" +
            '<div class="tocca-racconto">' + G().tocchi + " ▸</div>";
          box.classList.remove("nascosto");
          pronto = false;
          /* si aspetta lo schema che si disegna e la frase da leggere */
          attesaLettura(box, Math.max(tempoLettura(s.testo), s.attesa || 2.4)).then(function () { pronto = true; });
        }
        function fine() {
          box.onclick = null;
          if (!sp.domanda) { box.classList.add("nascosto"); fatto(); return; }
          box.querySelector(".tocca-racconto").remove();
          /* la domanda chiede di usare ciò che si è capito, in una situazione nuova */
          var frase = box.querySelector(".sp-frase");
          frase.classList.add("con-domanda");
          frase.innerHTML = "";
          box.querySelector(".sp-schema").classList.add("piccolo");
          domanda(frase, sp.domanda).then(function () {
            box.classList.add("nascosto");
            fatto();
          });
        }
        box.onclick = function () {
          if (!pronto) return;
          window.Suoni.sblocca();
          window.Suoni.pop();
          if (i < sp.schede.length - 1) { i++; mostra(); } else fine();
        };
        mostra();
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
