/*
 * Livello 1 — L'isola (storia: Hayy ibn Yaqzan, Andalusia, XII secolo).
 * Filone B (Basi comuni), passi B1.1-B1.6 e R1.1-R1.2 della roadmap.
 * Scheda di progetto: documentazione/livelli/01-isola-hayy.md
 *
 * Il livello è diviso in tappe. Ogni tappa salva i progressi, così si può riprendere.
 */
(function () {
  "use strict";

  var T = window.TESTI.livello1;
  var M = window.Mondo;
  var P = window.Pannello;
  var Q = window.Quaderno;
  var B = window.Battito;
  var SUOLO = M.SUOLO;

  var LARGHEZZA = 3700;
  var progressi = null;
  var occupato = false;          /* mentre una scena racconta, i tocchi sul mondo si ignorano */
  var limite = { min: 60, max: 600 };
  var intercetta = null;         /* minigiochi: catturano i tocchi */

  /* ---------- oggetti della scena ---------- */

  function oggetto(def) {
    def.attivo = def.attivo || false;
    def.domanda = def.domanda !== false;
    return def;
  }

  var O = {
    rifugio: oggetto({ id: "rifugio", x: 150, r: 0, disegna: function (D, o) { D.rifugio(o.x, SUOLO - 30); } }),
    cespuglio1: oggetto({ id: "c1", x: 560, disegna: function (D, o) { D.cespuglio(o.x, SUOLO - 40, 1); } }),
    capra: oggetto({ id: "capra", x: 830, r: 110, disegna: function (D, o) { D.capra(o.x, SUOLO - 30, -1); } }),
    cespuglio2: oggetto({ id: "c2", x: 1140, disegna: function (D, o) { D.cespuglio(o.x, SUOLO - 30, 1.2); } }),
    uccello: oggetto({ id: "uccello", x: 1140, r: 100, yDomanda: SUOLO - 300, disegna: function (D, o) { D.uccello(o.x, SUOLO - 150); } }),
    tartaruga: oggetto({ id: "tartaruga", x: 1430, r: 100, disegna: function (D, o) { D.tartaruga(o.x, SUOLO - 20); } }),
    palma: oggetto({ id: "palma", x: 1820, r: 140, yDomanda: SUOLO - 480, disegna: function (D, o) { D.palma(o.x, SUOLO - 20, 420, true); } }),
    sasso: oggetto({ id: "sasso", x: 2040, r: 80, yDomanda: SUOLO - 120, disegna: function (D, o) { D.sasso(o.x, SUOLO - 20); } }),
    grotta: oggetto({ id: "grotta", x: 2400, r: 150, yDomanda: SUOLO - 380, accesa: false, disegna: function (D, o) { D.grotta(o.x, SUOLO - 30, o.accesa); } }),
    tomba: oggetto({ id: "tomba", x: 2240, visibile: false, disegna: function (D, o) { D.cespuglio(o.x, SUOLO - 20, 0.7); } }),
    capra2: oggetto({ id: "capra2", x: 2660, r: 110, visibile: false, disegna: function (D, o) { D.capra(o.x, SUOLO - 30, 1); } }),
    bastone: oggetto({ id: "bastone", x: 2700, r: 80, yDomanda: SUOLO - 120, disegna: function (D, o) { D.bastone ? D.bastone(o.x) : null; } }),
    canne: oggetto({ id: "canne", x: 2950, r: 150, yDomanda: SUOLO - 330, fuoco: false, disegna: function (D, o) { D.canne(o.x, SUOLO - 20, o.fuoco); } }),
    barca: oggetto({ id: "barca", x: 3560, visibile: false, disegna: function (D, o) { D.barca(o.x, SUOLO - 10); } }),
    absal: oggetto({ id: "absal", x: 3420, r: 100, visibile: false, yDomanda: SUOLO - 300, disegna: function (D, o) { D.persona(o.x, -1, 0, false, null, "#7b5b43"); } })
  };
  var lista = Object.keys(O).map(function (k) { return O[k]; });

  /* il bastone a terra (disegno aggiuntivo) */
  function disegnaBastone(D, o) {
    var ctx = document.getElementById("mondo").getContext("2d");
    ctx.beginPath();
    ctx.moveTo(o.x - 50, SUOLO + 6);
    ctx.lineTo(o.x + 50, SUOLO - 8);
    ctx.lineWidth = 9;
    ctx.strokeStyle = "#7a5636";
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#2b2622";
    ctx.stroke();
  }
  O.bastone.disegna = disegnaBastone;

  /* ---------- utilità ---------- */

  function aiuto(testo) {
    var el = document.getElementById("aiuto");
    if (testo) { el.textContent = testo; el.classList.remove("nascosto"); }
    else el.classList.add("nascosto");
  }

  var aiutoTemporaneoTimer = null;
  function aiutoTemporaneo(testo, dopo) {
    var precedente = document.getElementById("aiuto").textContent;
    aiuto(testo);
    clearTimeout(aiutoTemporaneoTimer);
    aiutoTemporaneoTimer = setTimeout(function () { aiuto(dopo || precedente); }, 2600);
  }

  function attiva(ids) {
    lista.forEach(function (o) { o.attivo = ids.indexOf(o.id) >= 0; });
  }

  function salvaTappa(tappa) {
    progressi.tappa = tappa;
    window.Salvataggio.salvaProgressi();
  }

  function pagina(id) {
    var p = T.pagine.filter(function (x) { return x.id === id; })[0];
    return Q.aggiungi({ id: p.id, titolo: p.titolo, testo: p.testo, roadmap: p.roadmap });
  }

  function attendi(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  /* Esegue una scena bloccando i tocchi sul mondo. */
  function scena(fn) {
    if (occupato) return;
    occupato = true;
    Promise.resolve().then(fn).catch(function (e) { console.error(e); }).then(function () { occupato = false; });
  }

  /* ---------- tocchi sul mondo ---------- */

  function tocco(wx, wy) {
    if (intercetta) { intercetta(wx, wy); return; }
    if (occupato) return;
    var g = M.guardiano;

    /* tocco sul Guardiano stesso */
    if (O.hayy && O.hayy.attivo && Math.abs(wx - g.x) < 70 && wy > SUOLO - 240 && wy < SUOLO + 40) {
      O.hayy.azione();
      return;
    }

    /* se più oggetti sono vicini al dito, vince il più vicino */
    var colpito = null, distanza = Infinity;
    lista.forEach(function (o) {
      if (!o.attivo || o.visibile === false || !o.r) return;
      var d = Math.abs(wx - o.x);
      if (d < o.r && wy > 260 && d < distanza) { colpito = o; distanza = d; }
    });

    if (colpito) {
      var dest = colpito.x + (g.x < colpito.x ? -120 : 120);
      dest = Math.max(limite.min, Math.min(limite.max, dest));
      occupato = true;
      M.vai(g, dest).then(function () {
        g.verso = colpito.x >= g.x ? 1 : -1;
        occupato = false;
        if (colpito.azione) colpito.azione();
      });
      return;
    }

    var x = Math.max(limite.min, Math.min(limite.max, wx));
    if (wx > limite.max + 40) aiutoTemporaneo(limite.messaggio || T.aiuti.bloccato);
    M.vai(g, x);
  }

  /* ---------- tappa 1: il risveglio e gli animali ---------- */

  var osservati = {};

  function preparaAnimali() {
    limite = { min: 60, max: 1560, messaggio: T.aiuti.osservaAnimali };
    attiva(["capra", "uccello", "tartaruga"]);
    ["capra", "uccello", "tartaruga"].forEach(function (id) {
      if (osservati[id]) O[id].attivo = false;
    });
    aiuto(T.aiuti.cammina);
  }

  function osserva(id) {
    scena(function () {
      var a = T.animali[id];
      return P.racconta([a.testo], a.nome).then(function () {
        osservati[id] = true;
        O[id].attivo = false;
        progressi.osservati = osservati;
        window.Salvataggio.salvaProgressi();
        if (Object.keys(osservati).length === 1) return pagina("parti");
      }).then(function () {
        if (Object.keys(osservati).length === 3) return dopoAnimali();
        aiuto(T.aiuti.osservaAnimali);
      });
    });
  }
  O.capra.azione = function () { osserva("capra"); };
  O.uccello.azione = function () { osserva("uccello"); };
  O.tartaruga.azione = function () { osserva("tartaruga"); };

  function dopoAnimali() {
    aiuto(null);
    var c = M.cerva;
    var frasi = T.scene.dopoAnimali;
    return P.racconta(frasi.slice(0, 2)).then(function () {
      /* la cerva corre: tutto cambia insieme */
      c.vel = 560;
      return M.vai(c, Math.min(M.guardiano.x + 420, 1700));
    }).then(function () {
      c.vel = 260;
      return P.racconta([frasi[2]]);
    }).then(function () {
      B.mostra();
      B.velocita(6);
      B.vai(B.base() + 22, 4);
      return P.racconta([frasi[3], window.TESTI.gioco.avvisoBattito]);
    }).then(function () {
      return pagina("insieme");
    }).then(function () {
      salvaTappa("riflessi");
      preparaRiflessi();
    });
  }

  /* ---------- tappa 2: i riflessi alla palma ---------- */

  var cocco = { stato: "fermo", y: 0, t0: 0, tempi: [] };

  function preparaRiflessi() {
    limite = { min: 60, max: 1980, messaggio: T.aiuti.vaiPalma };
    attiva(["palma"]);
    M.cerva.dest = 2080;
    aiuto(T.aiuti.vaiPalma);
  }

  O.palma.azione = function () {
    scena(function () {
      aiuto(null);
      return P.racconta(T.scene.riflessiIntro).then(function () {
        cocco.tempi = [];
        return provaRiflessi();
      });
    });
  };

  function provaRiflessi() {
    return new Promise(function (fine) {
      function nuovaProva() {
        var n = cocco.tempi.length + 1;
        P.scegli(T.riflessi.prova.replace("{n}", n), [T.riflessi.pronto], [T.riflessi.inizia]).then(function () {
          cocco.stato = "attesa";
          cocco.y = 0;
          aiuto(T.riflessi.aspetta);
          var timer = setTimeout(function () {
            cocco.stato = "cade";
            cocco.t0 = performance.now();
            aiuto(T.riflessi.ora);
          }, 1200 + Math.random() * 2000);
          riprovaCallback = nuovaProva;
          intercetta = function () {
            var adesso = performance.now();
            if (cocco.stato === "attesa") {
              clearTimeout(timer);
              cocco.stato = "fermo";
              intercetta = null;
              aiuto(null);
              P.racconta([T.riflessi.presto]).then(nuovaProva);
            } else if (cocco.stato === "cade") {
              var ms = Math.round(adesso - cocco.t0);
              cocco.stato = "preso";
              intercetta = null;
              aiuto(null);
              cocco.tempi.push(ms);
              window.Suoni.scoperta();
              P.racconta([T.riflessi.tempo.replace("{ms}", ms)]).then(function () {
                cocco.stato = "fermo";
                if (cocco.tempi.length < 3) nuovaProva(); else fine();
              });
            }
          };
        });
      }
      nuovaProva();
    }).then(function () {
      riprovaCallback = null;
      var media = Math.round(cocco.tempi.reduce(function (a, b) { return a + b; }, 0) / cocco.tempi.length);
      progressi.riflessi = cocco.tempi.slice();
      window.Salvataggio.salvaProgressi();
      return P.racconta([
        T.riflessi.risultati.replace("{lista}", cocco.tempi.join(", ")).replace("{media}", media)
      ].concat(T.scene.riflessiFine));
    }).then(function () {
      return pagina("veloci");
    }).then(function () {
      salvaTappa("cerva");
      preparaCerva();
    });
  }

  /* cocco che cade: disegnato sopra il mondo */
  function disegnaCocco(ctx, D) {
    if (cocco.stato === "fermo") return;
    var cx = O.palma.x + 40, cy0 = SUOLO - 20 - 420 + 30, terra = SUOLO + 10;
    if (cocco.stato === "cade") {
      var t = (performance.now() - cocco.t0) / 1000;
      cocco.y = Math.min(terra - cy0, 0.5 * 1100 * t * t);
      if (cocco.y >= terra - cy0) {
        cocco.stato = "terra";
        window.Suoni.tonfo();
        intercetta = null;
        aiuto(null);
        P.racconta([T.riflessi.mancato]).then(function () {
          cocco.stato = "fermo";
          /* ripete la prova senza contarla */
          provaRiflessiRiprova();
        });
      }
    }
    D.cocco(cx, cy0 + cocco.y);
  }

  var riprovaCallback = null;
  function provaRiflessiRiprova() { if (riprovaCallback) riprovaCallback(); }

  /* ---------- tappa 3: la cerva ---------- */

  function preparaCerva() {
    limite = { min: 60, max: 2560, messaggio: T.aiuti.vaiGrotta };
    attiva(["grotta"]);
    M.cerva.visibile = true;
    M.cerva.dest = 2560;
    aiuto(T.aiuti.vaiGrotta);
  }

  /* Il cuore della cerva rallenta e si ferma, con delicatezza. */
  function cuoreCerva() {
    var intervalli = [1100, 1250, 1450, 1700, 2000, 2400];
    var i = 0;
    return new Promise(function (r) {
      function colpo() {
        if (i >= intervalli.length) { r(); return; }
        window.Suoni.battito(0.35 - i * 0.04);
        setTimeout(colpo, intervalli[i++]);
      }
      colpo();
    });
  }

  O.grotta.azione = function () {
    if (progressi.tappa === "fuoco") { azioneGrottaFuoco(); return; }
    scena(function () {
      aiuto(null);
      var frasi = T.scene.cerva;
      M.cerva.stato = "sdraiata";
      M.cerva.verso = -1;
      return P.racconta(frasi.slice(0, 2)).then(function () {
        /* il suono continua da solo mentre il racconto va avanti */
        cuoreCerva();
        return P.racconta([frasi[2]]);
      }).then(function () {
        return P.racconta(frasi.slice(3, 5));
      }).then(function () {
        return pagina("cuore");
      }).then(function () {
        return P.racconta([frasi[5]]);
      }).then(function () {
        M.cerva.visibile = false;
        O.tomba.visibile = true;
        /* l'emozione resta addosso: messaggi lenti (B1.4), poi l'equilibrio (B1.5) */
        B.velocita(8);
        B.vai(B.base() + 26);
        B.udibile(true);
        return attendi(1500);
      }).then(function () {
        return P.racconta(T.scene.tristezza.slice(0, 2));
      }).then(function () {
        B.velocita(2.5);
        B.calma();
        return P.racconta([T.scene.tristezza[2]]);
      }).then(function () {
        B.udibile(false);
        return pagina("lenti");
      }).then(function () {
        return misuraBattito("prima");
      }).then(function () {
        salvaTappa("fuoco");
        preparaFuoco();
      });
    });
  };

  /* ---------- misura del battito vero (R1.2, B1.6) ---------- */

  function misuraBattito(quale) {
    var testi = T.misura;
    return P.racconta(quale === "prima" ? T.scene.mioBattito : []).then(function () {
      return P.scegli("", [quale === "prima" ? T.scene.mioBattito[2] : T.scene.secondaMisura[1]], [testi.salta, testi.via]);
    }).then(function (scelta) {
      if (scelta === 0) return null;
      return contoAllaRovescia().then(chiediNumero);
    }).then(function (n) {
      if (n === null || n === undefined) return null;
      var bpm = n * 2;
      progressi.misure = progressi.misure || {};
      progressi.misure[quale] = bpm;
      window.Salvataggio.salvaProgressi();
      var frasi = [testi.risultato.replace("{bpm}", bpm).replace("{n}", n)];
      if (quale === "seconda" && progressi.misure.prima) {
        frasi.push(testi.confronto.replace("{a}", progressi.misure.prima).replace("{b}", bpm));
      }
      frasi.push(testi.nota);
      return P.racconta(frasi).then(function () {
        var m = progressi.misure;
        var testo = "Prima misura: " + (m.prima ? m.prima + " battiti al minuto." : "non fatta.");
        if (m.seconda) testo += " Seconda misura: " + m.seconda + " battiti al minuto.";
        testo += " Il battito di una persona a riposo cambia con l'età, il movimento, le emozioni.";
        return Q.aggiungi({ id: T.paginaMioBattito.id, titolo: T.paginaMioBattito.titolo, testo: testo, roadmap: T.paginaMioBattito.roadmap });
      });
    });
  }

  function contoAllaRovescia() {
    return new Promise(function (r) {
      P.apri("");
      var el = P.elementi();
      var num = document.createElement("p");
      num.className = "grande-numero";
      var sotto = P.paragrafo(T.misura.conta);
      el.testo.appendChild(num);
      el.testo.appendChild(sotto);
      var s = 30;
      num.textContent = s;
      var timer = setInterval(function () {
        s--;
        num.textContent = s;
        if (s <= 0) {
          clearInterval(timer);
          window.Suoni.scoperta();
          P.chiudi();
          r();
        }
      }, 1000);
    });
  }

  function chiediNumero() {
    return new Promise(function (r) {
      function chiedi(errore) {
        P.apri("");
        var el = P.elementi();
        el.testo.appendChild(P.paragrafo(errore || T.misura.domanda));
        var riga = document.createElement("div");
        riga.className = "riga-campo";
        var campo = document.createElement("input");
        campo.type = "number";
        campo.inputMode = "numeric";
        campo.min = "10";
        campo.max = "100";
        campo.setAttribute("aria-label", T.misura.domanda);
        riga.appendChild(campo);
        el.testo.appendChild(riga);
        el.azioni.appendChild(P.bottone(T.misura.salta, "secondario", function () { P.chiudi(); r(null); }));
        el.azioni.appendChild(P.bottone(T.misura.conferma, "principale", function () {
          var n = parseInt(campo.value, 10);
          /* tra 15 e 90 battiti in 30 secondi (30-180 al minuto) */
          if (!(n >= 15 && n <= 90)) { chiedi(T.misura.fuoriScala); return; }
          P.chiudi();
          r(n);
        }));
        setTimeout(function () { campo.focus(); }, 50);
      }
      chiedi();
    });
  }

  /* ---------- tappa 4: il fuoco e il calore ---------- */

  var toccati = {};

  function preparaFuoco() {
    limite = { min: 60, max: 3100, messaggio: T.aiuti.vaiCanne };
    M.cerva.visibile = false;
    O.tomba.visibile = true;
    O.canne.fuoco = true;
    if (!progressi.bastone) {
      attiva(["canne"]);
      aiuto(T.aiuti.vaiCanne);
    } else {
      M.guardiano.tiene = "fuoco";
      attiva(["grotta"]);
      aiuto(T.aiuti.portaFuoco);
    }
  }

  O.canne.azione = function () {
    scena(function () {
      aiuto(null);
      return P.racconta(T.scene.fuocoIntro).then(function () {
        B.velocita(10);
        B.vai(B.base() + 30, 2);
        return P.racconta(T.scene.scotta);
      }).then(function () {
        B.velocita(3);
        attiva(["bastone"]);
        aiuto(T.aiuti.prendiBastone);
      });
    });
  };

  O.bastone.azione = function () {
    scena(function () {
      O.bastone.visibile = false;
      M.guardiano.tiene = "fuoco";
      progressi.bastone = true;
      window.Salvataggio.salvaProgressi();
      return P.racconta(T.scene.bastone).then(function () {
        attiva(["grotta"]);
        aiuto(T.aiuti.portaFuoco);
      });
    });
  };

  function azioneGrottaFuoco() {
    if (O.grotta.accesa) return;
    scena(function () {
      aiuto(null);
      O.grotta.accesa = true;
      M.guardiano.tiene = null;
      return P.racconta(T.scene.grottaAccesa).then(function () {
        O.capra2.visibile = true;
        toccati = {};
        attiva(["sasso", "capra2"]);
        O.hayy = { attivo: true, azione: function () { tocca("hayy"); } };
        aiuto(T.aiuti.tocca3);
      });
    });
  }

  function tocca(id) {
    scena(function () {
      var chiave = id === "capra2" ? "capra" : id;
      return P.racconta([T.scene.caldoFreddo[chiave]]).then(function () {
        toccati[id] = true;
        if (id === "sasso") O.sasso.attivo = false;
        if (id === "capra2") O.capra2.attivo = false;
        if (id === "hayy") O.hayy.attivo = false;
        if (Object.keys(toccati).length < 3) { aiuto(T.aiuti.tocca3); return; }
        aiuto(null);
        return P.racconta(T.scene.dopoCaldo).then(function () {
          return pagina("equilibrio");
        }).then(function () {
          return P.racconta([T.scene.secondaMisura[0]]);
        }).then(function () {
          return misuraBattito("seconda");
        }).then(function () {
          return pagina("misurare");
        }).then(function () {
          salvaTappa("absal");
          preparaAbsal();
        });
      });
    });
  }
  O.sasso.azione = function () { tocca("sasso"); };
  O.capra2.azione = function () { tocca("capra2"); };

  /* ---------- tappa 5: Absal ---------- */

  function preparaAbsal() {
    limite = { min: 60, max: 3320, messaggio: T.aiuti.vaiSpiaggia };
    M.cerva.visibile = false;
    O.tomba.visibile = true;
    O.canne.fuoco = false;
    O.grotta.accesa = true;
    O.capra2.visibile = true;
    O.barca.visibile = true;
    O.absal.visibile = true;
    if (O.hayy) O.hayy.attivo = false;
    attiva(["absal"]);
    aiuto(T.aiuti.vaiSpiaggia);
  }

  O.absal.azione = function () {
    scena(function () {
      aiuto(null);
      return P.racconta(T.scene.absal).then(function () {
        salvaTappa("fine");
        progressi.completato = true;
        window.Salvataggio.salvaProgressi();
        return finale();
      });
    });
  };

  function finale() {
    var F = T.finale;
    return new Promise(function (r) {
      P.apri(F.titolo);
      var el = P.elementi();
      el.testo.appendChild(P.paragrafo(F.testo));
      el.testo.appendChild(P.paragrafo(F.diritto));
      el.testo.appendChild(P.paragrafo(F.domanda));
      el.testo.appendChild(P.paragrafo(F.prossimo, "piccolo"));
      el.azioni.appendChild(P.bottone(window.TESTI.gioco.quaderno, "secondario", function () {
        Q.mostra().then(finale).then(r);
      }));
      el.azioni.appendChild(P.bottone(F.torna, "principale", function () {
        P.chiudi();
        r();
        window.location.reload();
      }));
      if (window.Salvataggio.impostazioni().voce) window.Voce.leggi([F.titolo, F.testo, F.diritto, F.domanda].join(" "));
    });
  }

  /* ---------- avvio e ripresa ---------- */

  function posiziona(tappa) {
    var g = M.guardiano, c = M.cerva;
    var pos = { animali: [200, 380], riflessi: [1500, 2080], cerva: [1950, 2560], fuoco: [2500, 2560], absal: [2700, 2560], fine: [3200, 2560] };
    var p = pos[tappa] || pos.animali;
    g.x = g.dest = p[0];
    c.x = c.dest = p[1];
    M.camera.x = Math.max(0, g.x - M.larghezzaVista() * 0.4);
  }

  window.Livello1 = {
    carica: function () {
      progressi = window.Salvataggio.progressi("livello1");
      osservati = progressi.osservati || {};
      O.bastone.visibile = !progressi.bastone;

      M.caricaScena({
        larghezza: LARGHEZZA,
        spiaggiaDa: 3150,
        /* Quando arriverà la scansione del disegno del ragazzo:
           sfondo: "assets/sfondi/livello1-isola.jpg", */
        oggetti: lista,
        extra: function (ctx, D) { disegnaCocco(ctx, D); }
      });
      M.alTocco(tocco);
      posiziona(progressi.tappa || "animali");
    },

    inizia: function () {
      var tappa = progressi.tappa;
      riprovaCallback = null;
      if (!tappa) {
        return P.pagine(T.prologo).then(function () {
          return P.racconta(T.scene.risveglio);
        }).then(function () {
          salvaTappa("animali");
          M.vai(M.cerva, 620);
          preparaAnimali();
        });
      }
      if (tappa !== "animali") B.mostra();
      if (tappa === "animali") { preparaAnimali(); return Promise.resolve(); }
      if (tappa === "riflessi") { preparaRiflessi(); return Promise.resolve(); }
      if (tappa === "cerva") { preparaCerva(); return Promise.resolve(); }
      if (tappa === "fuoco") { preparaFuoco(); return Promise.resolve(); }
      if (tappa === "absal") { preparaAbsal(); return Promise.resolve(); }
      if (tappa === "fine") { preparaAbsal(); return finale(); }
      return Promise.resolve();
    },

    /* Solo per i test automatici: stato e posizioni degli oggetti. */
    debug: function () {
      return {
        tappa: progressi.tappa,
        oggetti: lista.filter(function (o) { return o.attivo && o.visibile !== false; }).map(function (o) { return o.id; }),
        guardiano: M.guardiano.x,
        limite: limite.max,
        cocco: cocco.stato,
        posizione: function (id) {
          var o = id === "hayy" ? { x: M.guardiano.x, yDomanda: SUOLO - 120 } : O[id];
          return M.aSchermo(o.x, o.yDomanda ? o.yDomanda + 60 : SUOLO - 80);
        }
      };
    }
  };
})();
