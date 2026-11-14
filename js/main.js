/* Avvio del gioco: schermata iniziale, impostazioni, pulsanti fissi. */
(function () {
  "use strict";

  var G = window.TESTI.gioco;
  var P = window.Pannello;

  var suTitolo = false;

  function schermataIniziale() {
    suTitolo = true;
    var progressi = window.Salvataggio.progressi("livello1");
    var giaIniziato = !!progressi.tappa;

    P.apri("");
    var el = P.elementi();
    document.getElementById("pannello").classList.add("titolo");
    var I = window.Icone;
    var h = document.createElement("h1");
    h.className = "titolo-gioco";
    h.innerHTML = G.titolo.split("").map(function (c, i) { return '<span style="animation-delay:' + (i * 0.08) + 's">' + c + "</span>"; }).join("");
    var giro = document.createElement("div");
    giro.className = "giro-icone";
    giro.innerHTML = ["cuore", "cervello", "fuoco", "foglia", "barca", "stella"].map(function (n, i) {
      return '<span style="--i:' + i + '">' + I.svg(n) + "</span>";
    }).join("");
    el.testo.appendChild(giro);
    el.testo.appendChild(h);
    el.testo.appendChild(P.paragrafo(G.sottotitolo, "sottotitolo"));
    el.testo.appendChild(P.paragrafo(G.avviso, "piccolo centrato avviso-titolo"));

    el.azioni.appendChild(P.bottone(G.impostazioni, "secondario", function () {
      impostazioni().then(schermataIniziale);
    }));
    if (giaIniziato) {
      el.azioni.appendChild(P.bottone(G.ricomincia, "secondario", function () {
        window.Salvataggio.azzera();
        window.location.reload();
      }));
    }
    var come = window.App.comeInstallare();
    if (come) {
      el.azioni.appendChild(P.bottone(G.installa, "secondario installa", function () {
        if (come === "android") window.App.installa().then(schermataIniziale);
        else istruzioniIos().then(schermataIniziale);
      }));
    }
    var b = P.bottone(giaIniziato ? G.continua : G.inizia, "principale grande-gioca", function () {
      document.getElementById("pannello").classList.remove("titolo");
      suTitolo = false;
      window.App.schermoIntero();
      P.chiudi();
      document.getElementById("barra").classList.remove("nascosto");
      window.Livello1.inizia();
    });
    el.azioni.appendChild(b);
    b.focus();
  }

  /* Su iPhone non c'è un pulsante di installazione: si mostrano i due tocchi da fare in Safari */
  function istruzioniIos() {
    return new Promise(function (r) {
      P.apri(G.iosTitolo);
      var el = P.elementi();
      var passi = document.createElement("div");
      passi.className = "passi-ios";
      passi.innerHTML =
        '<div><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5M5 12v8h14v-8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span></span></div>' +
        '<div><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span></span></div>';
      passi.querySelectorAll("span")[0].textContent = G.iosPasso1;
      passi.querySelectorAll("span")[1].textContent = G.iosPasso2;
      el.testo.appendChild(passi);
      var b = P.bottone(G.capito, "principale", function () { P.chiudi(); r(); });
      el.azioni.appendChild(b);
    });
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
      /* il disegno del ragazzo come fondale, da una foto del telefono */
      var riquadro = document.createElement("div");
      riquadro.className = "riquadro-disegno";
      var titolo = P.paragrafo(I.disegno, "titoletto");
      var nota = P.paragrafo(I.disegnoNota, "piccolo");
      var file = document.createElement("input");
      file.type = "file";
      file.accept = "image/*";
      file.multiple = true;
      file.id = "foto-disegno";
      file.className = "nascosto";
      var righe = document.createElement("div");
      righe.className = "riga-bottoni";
      var scegli = P.bottone(I.scegliFoto, "secondario", function () { file.click(); });
      righe.appendChild(scegli);
      if (window.Fondale.origine() === "foto") {
        righe.appendChild(P.bottone(I.togliFoto, "secondario", function () {
          window.Fondale.rimuovi().then(function () { P.chiudi(); r(); });
        }));
      }
      file.addEventListener("change", function () {
        if (!file.files || !file.files[0]) return;
        scegli.textContent = I.preparo;
        window.Fondale.daFoto(file.files).then(function () { P.chiudi(); r(); }, function () { scegli.textContent = I.scegliFoto; });
      });
      riquadro.appendChild(titolo);
      riquadro.appendChild(righe);
      riquadro.appendChild(nota);
      riquadro.appendChild(file);
      el.testo.appendChild(riquadro);

      var b = P.bottone(G.chiudi, "principale", function () { P.chiudi(); r(); });
      el.azioni.appendChild(b);
      b.focus();
    });
  }

  function avvia() {
    window.Salvataggio.applica();
    window.Battito.prepara();
    P.prepara();
    window.Didascalia.prepara();
    window.Quaderno.carica();
    window.Mondo.prepara();
    window.Livello1.carica();

    document.getElementById("btn-storia").addEventListener("click", function () {
      if (!P.aperto()) window.Storia.mostraFilo();
    });
    document.querySelectorAll("#inventario .slot").forEach(function (sl) {
      sl.innerHTML = window.Icone.svg(sl.getAttribute("data-oggetto"));
    });
    document.getElementById("btn-quaderno").addEventListener("click", function () {
      if (!P.aperto()) window.Quaderno.mostra();
    });
    document.getElementById("btn-impostazioni").addEventListener("click", function () {
      if (!P.aperto()) impostazioni();
    });

    schermataIniziale();

    /* App sul telefono: aggiornamenti da GitHub Pages e uso senza rete */
    window.App.sulTitolo = function () { return suTitolo; };
    window.App.quandoCambia(function () { if (suTitolo && P.aperto()) schermataIniziale(); });
    window.App.registra();

    /* Per i test automatici */
    window.RESPIRA = { storia: window.Storia, livello: window.Livello1, mondo: window.Mondo, battito: window.Battito, quaderno: window.Quaderno, didascalia: window.Didascalia };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", avvia);
  else avvia();
})();
