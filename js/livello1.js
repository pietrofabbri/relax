/*
 * Livello 1 — L'isola (storia: Hayy ibn Yaqzan, Andalusia, XII secolo).
 * Filone B della roadmap (B1.1-B1.6) e R1.1-R1.2. Scheda: documentazione/livelli/01-isola-hayy.md
 *
 * Il livello è una sequenza di tappe. In ogni tappa si impara facendo qualcosa:
 *  1 segui      seguire la cerva
 *  2 animali    copiare gli animali (trascinare gli oggetti su Hayy)         B1.1
 *  3 corsa      correre e saltare: cuore, respiro e calore cambiano insieme  B1.2
 *  4 cocchi     afferrare i cocchi al volo: messaggi velocissimi             B1.3, B1.6
 *  5 cerva      ascoltare il cuore della cerva, piantare i fiori             R1.1, B1.4
 *  6 fuoco      portare il fuoco riparandolo dal vento
 *  7 calore     guardare il calore delle cose                                B1.5
 *  8 misura     contare il proprio battito (facoltativo)                     R1.2
 *  9 alba       Absal e il diritto di imparare
 */
(function () {
  "use strict";

  var T = window.TESTI.livello1, D = T.d, OB = T.obiettivi;
  var M = window.Mondo, A = window.Arte;
  var Did = window.Didascalia, Q = window.Quaderno, B = window.Battito, P = window.Pannello;
  var S = window.Spettacolo;
  var SUOLO = 790;
  var LARGHEZZA = 4700;
  var TAPPE = ["segui", "animali", "corsa", "cocchi", "cerva", "fuoco", "calore", "misura", "alba", "fine"];

  var progressi;

  /* ---------- personaggi e oggetti ---------- */

  var hayy = { x: 260, y: SUOLO, verso: 1, passo: 0, posa: "fermo", salto: 0, vy: 0, equip: {}, dest: 260, vel: 340, cuore: 74, respiro: 1.6, calore: 0 };
  var cerva = { x: 520, y: SUOLO, verso: 1, passo: 0, stato: "ferma", dest: 520, vel: 300, visibile: true, alfa: 1 };
  var absal = { x: 4380, y: SUOLO, verso: -1, passo: 0, posa: "fermo", veste: "#6b4f8a", barba: true, visibile: false };

  var mondo = {
    animali: { capra: { x: 860, fatto: false }, uccello: { x: 1130, fatto: false }, tartaruga: { x: 1420, fatto: false } },
    ostacoli: [1900, 2160, 2420, 2640].map(function (x) { return { x: x, passato: false }; }),
    palme: [2920, 3110, 3300],
    cocco: null,
    grottaX: 3720,
    grottaLuce: 0,
    canneX: 4180,
    canneFuoco: false,
    bastone: { x: 4040, visibile: false },
    fiori: [],
    tomba: false,
    sasso: { x: 3420 },
    capra2: { x: 3980, visibile: false },
    barca: { x: 5000, visibile: false },
    etichette: [],
    anelli: [],
    oggetto: null,          /* oggetto da trascinare */
    evidenzia: null,        /* parte dell'animale osservata */
    temperature: [],        /* etichette della vista del calore */
    /* semi di luce: si raccolgono passandoci sopra */
    semi: [380, 480, 580, 680, 780, 1000, 1280, 1550, 3500, 3640, 3780, 3920, 4060].map(function (x, i) {
      return { x: x, y: SUOLO - 70 - (i % 3) * 30, preso: false, t: 0 };
    }),
    semiPresi: 0
  };

  /* punteggio pieno di ogni tappa: serve per le stelle */
  var MASSIMI = { segui: 30, animali: 170, corsa: 250, cocchi: 240, cerva: 170, fuoco: 220, calore: 140, alba: 140 };

  /* ---------- utilità ---------- */

  function attendi(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function salvaTappa(t) { progressi.tappa = t; window.Salvataggio.salvaProgressi(); }

  function pagina(chiave, sostituzioni) {
    var pg = T.pagine[chiave];
    var testo = pg.testo;
    Object.keys(sostituzioni || {}).forEach(function (k) { testo = testo.replace("{" + k + "}", sostituzioni[k]); });
    return Q.aggiungi({ id: chiave, titolo: pg.titolo, testo: testo, roadmap: pg.roadmap });
  }

  /* Imposta l'attività corrente e risolve quando l'attività chiama fine(). */
  function attivita(def) {
    return new Promise(function (r) {
      def.fine = function (v) { M.attivita(null); r(v); };
      M.attivita(def);
    });
  }

  function vai(ent, x, vel) {
    return new Promise(function (r) {
      ent.dest = x;
      if (vel) ent.vel = vel;
      ent.arrivo = r;
    });
  }

  function vicino(wx, wy, x, y, raggio) {
    return Math.abs(wx - x) < raggio && Math.abs(wy - y) < raggio * 1.6;
  }

  function etichetta(testo, colore) {
    mondo.etichette.push({ testo: testo, colore: colore || "#ffffff", vita: 2.6, dy: 0 });
  }

  /* ---------- aggiornamento continuo ---------- */

  function muovi(ent, dt, corsa) {
    if (ent.dest === undefined) return false;
    var diff = ent.dest - ent.x;
    if (Math.abs(diff) > 3) {
      ent.x += Math.sign(diff) * Math.min(Math.abs(diff), ent.vel * dt);
      ent.verso = Math.sign(diff);
      ent.passo += dt * (ent.vel > 400 ? 13 : 9);
      return true;
    }
    ent.x = ent.dest;
    if (ent.arrivo) { var a = ent.arrivo; ent.arrivo = null; a(); }
    return false;
  }

  function aggiorna(dt, tempo) {
    if (!hayy.inCorsa) {
      var cammina = muovi(hayy, dt);
      if (hayy.posa === "cammina" || hayy.posa === "fermo" || hayy.posa === "corre") hayy.posa = cammina ? (hayy.vel > 400 ? "corre" : "cammina") : "fermo";
    }
    if (cerva.stato !== "sdraiata") {
      var c = muovi(cerva, dt);
      cerva.stato = c ? (cerva.vel > 400 ? "corre" : "cammina") : "ferma";
    }
    if (absal.visibile) muovi(absal, dt);

    mondo.semi.forEach(function (sm) {
      if (sm.preso) { sm.t += dt; return; }
      if (Math.abs(hayy.x - sm.x) < 55) {
        sm.preso = true;
        mondo.semiPresi++;
        M.onda(sm.x, sm.y, { r: 90, colore: [255, 230, 140], vita: 0.5 });
        S.premio(10, sm.x, sm.y - 50, null, { nota: mondo.semiPresi % 10, dim: 44, scintille: 8 });
      }
    });

    mondo.etichette.forEach(function (e) { e.vita -= dt; e.dy += dt * 30; });
    mondo.etichette = mondo.etichette.filter(function (e) { return e.vita > 0; });
    mondo.anelli.forEach(function (a) { a.t += dt; });
    mondo.anelli = mondo.anelli.filter(function (a) { return a.t < 1.6; });
    mondo.temperature.forEach(function (e) { e.t += dt; });
    mondo.fiori.forEach(function (f) { f.s = Math.min(1, f.s + dt * 2); });

    if (mondo.canneFuoco && Math.random() < dt * 14) M.emetti("scintilla", mondo.canneX + (Math.random() - 0.5) * 260, 620, 1, { vy: -80 });
    if (mondo.grottaLuce > 0.5 && Math.random() < dt * 5) M.emetti("scintilla", mondo.grottaX, 740, 1, { vy: -60, dispersione: 30 });

    /* il battito sullo schermo segue quello di Hayy */
    if (B.visibile()) B.vai(Math.round(hayy.cuore));
  }

  /* ---------- disegno della scena ---------- */

  function disegna(ctx, p, tempo, camX, vw) {
    var visibile = function (x, m) { return x > camX - (m || 400) && x < camX + vw + (m || 400); };
    disegnaSemi(ctx, tempo, visibile);

    /* rifugio di Hayy */
    if (visibile(150)) A.roccia(ctx, p, 120, SUOLO - 20, 360, 230, 11);

    /* boschetto degli animali */
    if (visibile(1000, 700)) {
      A.cespuglio(ctx, p, 700, SUOLO - 40, 1.1, tempo, 4);
      A.roccia(ctx, p, 1150, SUOLO - 30, 200, 110, 5);
      A.cespuglio(ctx, p, 1600, SUOLO - 40, 1.3, tempo, 3);
    }
    var an = mondo.animali;
    if (visibile(an.capra.x)) A.capra(ctx, p, an.capra.x, SUOLO + 10, -1, tempo);
    if (visibile(an.uccello.x)) A.uccello(ctx, p, an.uccello.x, SUOLO - 130, tempo, false);
    if (visibile(an.tartaruga.x)) A.tartaruga(ctx, p, an.tartaruga.x, SUOLO + 6, tempo);

    /* anelli che indicano cosa si può toccare */
    if (progressi.tappa === "animali") {
      ["capra", "uccello", "tartaruga"].forEach(function (k) {
        if (an[k].fatto || mondo.oggetto) return;
        var y = k === "uccello" ? SUOLO - 160 : SUOLO - 80;
        anelloInvito(ctx, an[k].x, y, tempo);
      });
    }
    if (mondo.evidenzia) {
      var e = mondo.evidenzia;
      ctx.strokeStyle = "rgba(255,240,180," + (0.6 + Math.sin(tempo * 6) * 0.3) + ")";
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 8]);
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r + Math.sin(tempo * 4) * 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    /* ostacoli della corsa */
    mondo.ostacoli.forEach(function (o, i) {
      if (!visibile(o.x)) return;
      if (i % 2) A.roccia(ctx, p, o.x, SUOLO + 4, 90, 60, 20 + i);
      else tronco(ctx, p, o.x, SUOLO + 4);
    });

    /* palme dei cocchi */
    mondo.palme.forEach(function (x, i) {
      if (visibile(x, 500)) A.palma(ctx, p, x, SUOLO - 10, 470 + i * 30, tempo, 3);
    });

    /* grotta, sasso, tomba */
    if (visibile(mondo.grottaX, 600)) A.grotta(ctx, p, mondo.grottaX, SUOLO - 4, mondo.grottaLuce, tempo);
    if (mondo.grottaLuce > 0.3) A.fiamma(ctx, mondo.grottaX, SUOLO - 20, 0.9, tempo, 1);
    if (visibile(mondo.sasso.x)) A.roccia(ctx, p, mondo.sasso.x, SUOLO + 6, 110, 64, 33);
    if (mondo.tomba) {
      ctx.fillStyle = A.rgba(A.mescola(p.terra, [60, 50, 40], 0.3));
      ctx.beginPath();
      ctx.ellipse(3420 - 150, SUOLO + 2, 110, 30, 0, Math.PI, 0);
      ctx.fill();
    }
    mondo.fiori.forEach(function (f) { fiore(ctx, f.x, SUOLO - 2, f.s, f.c, tempo); });

    /* canne e fuoco */
    if (visibile(mondo.canneX, 500)) {
      A.canne(ctx, p, mondo.canneX, SUOLO - 6, tempo, false);
      if (mondo.canneFuoco) {
        A.fiamma(ctx, mondo.canneX - 90, SUOLO - 30, 1.8, tempo, 1);
        A.fiamma(ctx, mondo.canneX + 20, SUOLO - 40, 2.2, tempo, 2);
        A.fiamma(ctx, mondo.canneX + 120, SUOLO - 25, 1.6, tempo, 3);
      }
    }
    if (mondo.bastone.visibile) {
      capsulaBastone(ctx, mondo.bastone.x, SUOLO + 4);
      anelloInvito(ctx, mondo.bastone.x, SUOLO - 10, tempo);
    }

    /* capra che dorme vicino alla grotta */
    if (mondo.capra2.visibile) A.capra(ctx, p, mondo.capra2.x, SUOLO + 10, -1, tempo * 0.2);

    /* barca e Absal */
    if (mondo.barca.visibile) A.barca(ctx, p, mondo.barca.x, 680, tempo);
    if (absal.visibile) A.persona(ctx, p, absal, tempo);

    /* cerva e Hayy */
    if (cerva.visibile) {
      ctx.globalAlpha = cerva.alfa;
      A.cerva(ctx, p, cerva, tempo);
      ctx.globalAlpha = 1;
    }
    mondo.anelli.forEach(function (a) {
      ctx.strokeStyle = "rgba(255,150,150," + (0.7 * (1 - a.t / 1.6)) + ")";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(a.x, a.y, 20 + a.t * 120, 0, Math.PI * 2);
      ctx.stroke();
    });
    A.persona(ctx, p, hayy, tempo);

    /* cocco che cade */
    if (mondo.cocco && mondo.cocco.stato !== "preso") A.cocco(ctx, p, mondo.cocco.x, mondo.cocco.y, 16);

    /* oggetto da trascinare */
    if (mondo.oggetto) disegnaOggetto(ctx, p, mondo.oggetto, tempo);

    /* etichette sopra Hayy */
    mondo.etichette.forEach(function (e, i) {
      pillola(ctx, e.testo, hayy.x + 90, SUOLO - 280 - i * 46 - e.dy, e.colore, Math.min(1, e.vita));
    });
    mondo.temperature.forEach(function (e) {
      pillola(ctx, e.testo, e.x, e.y - Math.min(30, e.t * 60), e.colore, Math.min(1, e.t * 3));
    });
  }

  function anelloInvito(ctx, x, y, tempo) {
    var f = (tempo * 0.8) % 1;
    ctx.strokeStyle = "rgba(255,245,200," + (0.8 * (1 - f)) + ")";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 50 + f * 40, 0, Math.PI * 2);
    ctx.stroke();
  }

  function pillola(ctx, testo, x, y, colore, alfa) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, alfa);
    ctx.font = "600 30px Georgia, serif";
    var w = ctx.measureText(testo).width + 36;
    ctx.fillStyle = "rgba(20,20,30,0.72)";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x - w / 2, y - 26, w, 52, 26); else ctx.rect(x - w / 2, y - 26, w, 52);
    ctx.fill();
    ctx.fillStyle = colore;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(testo, x, y + 1);
    ctx.restore();
  }

  function tronco(ctx, p, x, y) {
    A.ombra(ctx, x, y, 70, 0.3);
    var legno = A.mescola([120, 85, 55], p.bordo, 0.15);
    var g = ctx.createLinearGradient(x, y - 50, x, y);
    g.addColorStop(0, A.rgba(A.mescola(legno, p.bordo, 0.3)));
    g.addColorStop(1, A.rgba(A.mescola(legno, [0, 0, 0], 0.4)));
    ctx.fillStyle = g;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x - 60, y - 46, 120, 44, 22); else ctx.rect(x - 60, y - 46, 120, 44);
    ctx.fill();
    ctx.fillStyle = A.rgba(A.mescola(legno, [255, 230, 190], 0.4));
    ctx.beginPath();
    ctx.ellipse(x + 58, y - 24, 10, 21, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function disegnaSemi(ctx, tempo, visibile) {
    mondo.semi.forEach(function (sm) {
      if (!visibile(sm.x) || (sm.preso && sm.t > 0.4)) return;
      var y = sm.y + Math.sin(tempo * 3 + sm.x) * 8;
      var k = sm.preso ? 1 + sm.t * 4 : 1, a = sm.preso ? 1 - sm.t / 0.4 : 1;
      ctx.save();
      ctx.globalAlpha = a;
      ctx.globalCompositeOperation = "lighter";
      var g = ctx.createRadialGradient(sm.x, y, 0, sm.x, y, 44 * k);
      g.addColorStop(0, "rgba(255,240,170,0.95)");
      g.addColorStop(0.35, "rgba(255,200,90,0.45)");
      g.addColorStop(1, "rgba(255,180,60,0)");
      ctx.fillStyle = g;
      ctx.fillRect(sm.x - 50 * k, y - 50 * k, 100 * k, 100 * k);
      ctx.strokeStyle = "rgba(255,240,190,0.6)";
      ctx.lineWidth = 2;
      for (var i = 0; i < 4; i++) {
        var an = tempo * 1.5 + i * Math.PI / 2, r1 = 14 * k, r2 = (26 + Math.sin(tempo * 5 + i) * 4) * k;
        ctx.beginPath();
        ctx.moveTo(sm.x + Math.cos(an) * r1, y + Math.sin(an) * r1);
        ctx.lineTo(sm.x + Math.cos(an) * r2, y + Math.sin(an) * r2);
        ctx.stroke();
      }
      ctx.restore();
      ctx.fillStyle = "rgba(255,255,240," + a + ")";
      ctx.beginPath();
      ctx.arc(sm.x, y, 7, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function capsulaBastone(ctx, x, y) {
    ctx.strokeStyle = "#7a5636";
    ctx.lineWidth = 9;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x - 55, y);
    ctx.lineTo(x + 55, y - 14);
    ctx.stroke();
  }

  function fiore(ctx, x, y, s, colore, tempo) {
    var h = 50 * s, sw = Math.sin(tempo * 1.5 + x) * 3;
    ctx.strokeStyle = "#4f7d48";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + sw, y - h * 0.5, x + sw, y - h);
    ctx.stroke();
    ctx.fillStyle = colore;
    for (var i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.ellipse(x + sw + Math.cos(i * 1.05) * 9 * s, y - h + Math.sin(i * 1.05) * 9 * s, 7 * s, 4 * s, i * 1.05, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#ffe08a";
    ctx.beginPath();
    ctx.arc(x + sw, y - h, 4 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  function disegnaOggetto(ctx, p, o, tempo) {
    var x = o.x, y = o.y + (o.trascinato ? 0 : Math.sin(tempo * 3) * 5);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    var g = ctx.createRadialGradient(x, y, 0, x, y, 70);
    g.addColorStop(0, "rgba(255,240,180,0.45)");
    g.addColorStop(1, "rgba(255,240,180,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - 70, y - 70, 140, 140);
    ctx.restore();
    if (o.tipo === "bastone") {
      ctx.strokeStyle = "#8a6440";
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x - 30, y + 40);
      ctx.lineTo(x + 26, y - 44);
      ctx.stroke();
      ctx.fillStyle = "#d8c7a0";
      ctx.beginPath();
      ctx.moveTo(x + 22, y - 40);
      ctx.lineTo(x + 36, y - 62);
      ctx.lineTo(x + 32, y - 36);
      ctx.fill();
    } else if (o.tipo === "foglie") {
      for (var i = 0; i < 5; i++) {
        ctx.fillStyle = A.rgba(A.mescola([70, 130, 70], [140, 190, 90], i / 5));
        ctx.beginPath();
        ctx.ellipse(x - 20 + i * 10, y - 10 + (i % 2) * 14, 24, 11, 0.5 + i * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      var gs = ctx.createLinearGradient(x - 20, y - 40, x + 20, y + 40);
      gs.addColorStop(0, "#b48a58");
      gs.addColorStop(1, "#5d3f26");
      ctx.fillStyle = gs;
      ctx.beginPath();
      ctx.ellipse(x, y, 26, 42, 0.15, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* luci della notte */
  function luci() {
    var l = [];
    if (mondo.canneFuoco) l.push({ x: mondo.canneX, y: SUOLO - 120, r: 700, colore: [255, 150, 60] });
    if (mondo.grottaLuce > 0) l.push({ x: mondo.grottaX, y: SUOLO - 100, r: 620 * mondo.grottaLuce, colore: [255, 160, 70] });
    if (hayy.equip.fuoco) l.push({ x: hayy.x + 40 * hayy.verso, y: SUOLO - 260, r: 120 + 260 * (hayy.fuocoForza || 0), colore: [255, 170, 80] });
    l.push({ x: hayy.x, y: SUOLO - 120, r: 170, forza: 0.5 });
    return l;
  }

  /* corpi caldi e freddi, per la vista del calore */
  function calore() {
    var c = [
      { x: mondo.sasso.x, y: SUOLO - 30, r: 90, temp: 18 },
      { x: hayy.x, y: SUOLO - 130, r: 130, temp: 37 }
    ];
    if (mondo.capra2.visibile) c.push({ x: mondo.capra2.x, y: SUOLO - 90, r: 130, temp: 39 });
    if (mondo.grottaLuce > 0) c.push({ x: mondo.grottaX, y: SUOLO - 60, r: 160, temp: 300 });
    if (mondo.canneFuoco) c.push({ x: mondo.canneX, y: SUOLO - 80, r: 260, temp: 300 });
    return c;
  }

  /* ================= TAPPE ================= */

  /* 1 — seguire la cerva */
  function tappaSegui() {
    salvaTappa("segui");
    M.ora(0.15);
    M.ora(1, 14);
    M.camera.segui = hayy;
    return Did.mostra(D.inizio, { tocca: false, durata: 2 }).then(function () {
      vai(cerva, 900, 220);
      Did.obiettivo(OB.segui);
      return attivita({
        giu: function (wx) { hayy.dest = Math.max(100, Math.min(820, wx)); hayy.vel = 340; },
        aggiorna: function () { if (hayy.x > 640) this.fine(); }
      });
    });
  }

  /* 2 — copiare gli animali */
  function tappaAnimali() {
    salvaTappa("animali");
    M.ora(1);
    M.camera.segui = hayy;
    Did.obiettivo(null);
    var dati = {
      capra: { testo: D.capra, fatto: D.capraFatto, tipo: "bastone", equip: "bastone", parte: [0, -190, 60] },
      uccello: { testo: D.uccello, fatto: D.uccelloFatto, tipo: "foglie", equip: "mantello", parte: [-20, -160, 70] },
      tartaruga: { testo: D.tartaruga, fatto: D.tartarugaFatto, tipo: "corteccia", equip: "scudo", parte: [0, -40, 75] }
    };
    vai(cerva, 1700, 200);
    return Did.mostra(D.copia).then(function () {
      Did.obiettivo(OB.animali);
      return attivita({
        occupato: false,
        giu: function (wx, wy) {
          var self = this;
          var o = mondo.oggetto;
          if (o && vicino(wx, wy, o.x, o.y, 90)) { o.trascinato = true; o.dx = o.x - wx; o.dy = o.y - wy; return; }
          if (self.occupato || o) return;
          var scelto = null;
          Object.keys(dati).forEach(function (k) {
            var a = mondo.animali[k];
            if (!a.fatto && Math.abs(wx - a.x) < 120 && wy > 500) scelto = k;
          });
          if (scelto) { osserva(self, scelto); return; }
          hayy.dest = Math.max(100, Math.min(1650, wx));
        },
        muovi: function (wx, wy) {
          var o = mondo.oggetto;
          if (o && o.trascinato) { o.x = wx + o.dx; o.y = wy + o.dy; }
        },
        su: function () {
          var self = this, o = mondo.oggetto;
          if (!o || !o.trascinato) return;
          o.trascinato = false;
          if (Math.abs(o.x - hayy.x) < 110 && o.y > SUOLO - 300 && o.y < SUOLO + 20) {
            var d = dati[o.animale];
            hayy.equip[d.equip] = true;
            mondo.animali[o.animale].fatto = true;
            mondo.oggetto = null;
            M.emetti("stella", hayy.x, SUOLO - 150, 30, { dispersione: 420, spazio: 80 });
            M.onda(hayy.x, SUOLO - 150, { r: 260, colore: [255, 230, 150], vita: 0.7, spessore: 16 });
            M.zoom(1.22, 0.7, { x: hayy.x, y: SUOLO - 150 });
            M.coriandoli(hayy.x, SUOLO - 260, 40);
            M.scuoti(8, 0.2);
            S.premio(50, hayy.x, SUOLO - 330, D.super);
            Did.obiettivo(OB.animali);
            Did.mostra(d.fatto, { tocca: false, durata: 2.2 });
            var tutti = Object.keys(dati).every(function (k) { return mondo.animali[k].fatto; });
            if (tutti) {
              progressi.equip = hayy.equip;
              setTimeout(function () { self.fine(); }, 1800);
            }
          } else {
            o.x = o.casaX; o.y = o.casaY;
          }
        }
      });
    }).then(function () {
      Did.obiettivo(null);
      return pagina("parti");
    });

    function osserva(self, k) {
      self.occupato = true;
      var a = mondo.animali[k], d = dati[k];
      var lato = hayy.x < a.x ? -1 : 1;
      vai(hayy, a.x + lato * 170, 340).then(function () {
        hayy.verso = -lato;
        mondo.evidenzia = { x: a.x + d.parte[0], y: SUOLO + d.parte[1], r: d.parte[2] };
        M.zoom(1.3, 2.2, { x: a.x, y: SUOLO + d.parte[1] });
        window.Suoni.pop();
        return Did.mostra(d.testo, { tocca: false, durata: 2.2 });
      }).then(function () {
        mondo.evidenzia = null;
        var ox = hayy.x + lato * 110;
        mondo.oggetto = { tipo: d.tipo, animale: k, x: ox, y: SUOLO - 60, casaX: ox, casaY: SUOLO - 60 };
        Did.obiettivo(OB.trascina);
        self.occupato = false;
      });
    }
  }

  /* 3 — la corsa */
  function tappaCorsa() {
    salvaTappa("corsa");
    M.ora(1);
    hayy.equip = progressi.equip || { bastone: true, mantello: true, scudo: true };
    Did.obiettivo(null);
    return vai(hayy, 1680, 340).then(function () {
      cerva.x = Math.max(cerva.x, 1800);
      cerva.dest = cerva.x;
      return S.indovina(D.indovinaCorsa, [{ icona: "▲", testo: D.accelera }, { icona: "▼", testo: D.rallenta }], 0);
    }).then(function () {
      return Did.mostra(D.corsa, { tocca: false, durata: 1.4 });
    }).then(function () {
      B.mostra();
      Did.obiettivo(OB.salta);
      hayy.inCorsa = true;
      hayy.raggiX = true;
      hayy.posa = "corre";
      var vel = 260, rallenta = 0, mostrate = {};
      mondo.ostacoli.forEach(function (o) { o.passato = false; });
      return attivita({
        giu: function () {
          if (hayy.salto <= 0.5) {
            hayy.vy = 980; hayy.posa = "salta"; window.Suoni.salto();
            M.emetti("polvere", hayy.x, SUOLO, 10, { dispersione: 200 });
          }
        },
        aggiorna: function (dt) {
          vel = Math.min(560, vel + dt * 90);
          if (rallenta > 0) rallenta -= dt;
          var v = rallenta > 0 ? 180 : vel;
          hayy.x += v * dt;
          hayy.passo += dt * 14;
          hayy.verso = 1;
          /* salto */
          if (hayy.salto > 0 || hayy.vy > 0) {
            hayy.vy -= 2600 * dt;
            hayy.salto = Math.max(0, hayy.salto + hayy.vy * dt);
            if (hayy.salto === 0) { hayy.vy = 0; hayy.posa = "corre"; M.emetti("polvere", hayy.x, SUOLO, 6); }
          }
          if (Math.random() < dt * 8 && hayy.salto === 0) M.emetti("polvere", hayy.x - 20, SUOLO - 4, 1, { vx: -80 });
          /* ostacoli */
          mondo.ostacoli.forEach(function (o) {
            if (o.passato) return;
            if (hayy.x > o.x - 30 && hayy.x < o.x + 30) {
              o.passato = true;
              if (hayy.salto < 45) {
                rallenta = 0.7;
                M.emetti("polvere", o.x, SUOLO - 20, 24, { dispersione: 300 });
                M.scuoti(16, 0.35);
                M.scritta(D.inciampo, o.x, SUOLO - 280, { colore: "#ff8a8a", dim: 70 });
                window.Suoni.ops();
                S.rompi();
              } else {
                var serie = S.serie();
                S.premio(20, o.x, SUOLO - 300, serie > 1 ? "x" + serie : D.salto, { serie: true, colore: serie > 2 ? "#9cf0ff" : "#ffd27a" });
                M.onda(o.x, SUOLO - 40, { r: 160, colore: [255, 255, 255], vita: 0.4 });
              }
            }
          });
          /* la cerva corre davanti */
          cerva.dest = Math.min(2860, hayy.x + 300);
          cerva.vel = 600;
          /* il corpo cambia insieme */
          var f = Math.max(0, Math.min(1, (hayy.x - 1680) / 1000));
          hayy.cuore = 74 + f * 76;
          hayy.respiro = 1.6 + f * 5;
          hayy.calore = f;
          if (f > 0.45 && Math.random() < dt * 10) M.emetti("goccia", hayy.x + 6, SUOLO - 220, 1, { vy: -120, vx: -60 });
          if (f > 0.15 && !mostrate.c) { mostrate.c = 1; etichetta(D.etichettaCuore, "#ff9a9a"); }
          if (f > 0.4 && !mostrate.r) { mostrate.r = 1; etichetta(D.etichettaRespiro, "#a8d8ff"); }
          if (f > 0.65 && !mostrate.t) { mostrate.t = 1; etichetta(D.etichettaCalore, "#ffc27a"); }
          this.velocita = rallenta > 0 ? 0 : (vel - 260) / 300;
          if (hayy.x >= 2720) {
            M.rallenta(0.35, 0.8);
            M.zoom(1.25, 1.4, { x: 2720, y: SUOLO - 150 });
            hayy.x = 2720;
            hayy.dest = 2720;
            hayy.salto = 0;
            hayy.vy = 0;
            hayy.inCorsa = false;
            hayy.posa = "fermo";
            this.fine();
          }
        },
        disegnaSchermo: function (ctx, vw) {
          var v = this.velocita || 0;
          if (v <= 0.05) return;
          var t = M.tempo();
          ctx.strokeStyle = "rgba(255,255,255," + (0.25 * v).toFixed(3) + ")";
          ctx.lineCap = "round";
          for (var i = 0; i < 18; i++) {
            var y = 80 + ((i * 137) % 760);
            var len = 120 + (i % 4) * 60;
            var x = vw - ((t * 2600 + i * 311) % (vw + len * 2));
            ctx.lineWidth = 2 + (i % 3);
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + len, y);
            ctx.stroke();
          }
        }
      });
    }).then(function () {
      Did.obiettivo(null);
      cerva.vel = 220;
      M.zoom(1, 0.01);
      return Did.mostra(D.corsaFine);
    }).then(function () {
      hayy.posa = "siede";
      Did.mostra(D.riposo, { tocca: false, durata: 3 });
      return attivita({
        aggiorna: function (dt) {
          hayy.cuore += (74 - hayy.cuore) * dt * 0.7;
          hayy.respiro += (1.6 - hayy.respiro) * dt * 0.7;
          hayy.calore += (0 - hayy.calore) * dt * 0.7;
          if (hayy.cuore < 78) this.fine();
        }
      });
    }).then(function () {
      hayy.raggiX = false;
      hayy.posa = "fermo";
      return pagina("insieme");
    });
  }

  /* 4 — i cocchi */
  function tappaCocchi() {
    salvaTappa("cocchi");
    M.ora(1);
    B.mostra();
    hayy.equip = progressi.equip || hayy.equip;
    return vai(hayy, 3110, 300).then(function () {
      hayy.verso = 1;
      return Did.mostra(D.cocchi);
    }).then(function () {
      Did.obiettivo(OB.cocchi);
      var tempi = [], stato = "attesa", timer = 0, cocco = null, risultati = null;
      function nuovo() {
        stato = "attesa";
        timer = 1.2 + Math.random() * 2;
        mondo.cocco = null;
      }
      nuovo();
      return attivita({
        giu: function () {
          if (risultati) { if (risultati.t > 1) this.fine(tempi); return; }
          if (stato === "attesa") {
            M.scritta(D.presto, hayy.x, SUOLO - 380, { colore: "#ff8a8a", dim: 66 });
            window.Suoni.ops();
            M.scuoti(6, 0.2);
            nuovo();
            return;
          }
          if (stato === "cade") {
            var ms = Math.round(performance.now() - cocco.t0);
            tempi.push(ms);
            stato = "preso";
            cocco.stato = "preso";
            M.emetti("stella", cocco.x, cocco.y, 24, { dispersione: 360 });
            M.onda(cocco.x, cocco.y, { r: 180, colore: [255, 240, 160], vita: 0.5, spessore: 14 });
            var voto = ms < 260 ? [100, D.fulmine2, "#9cf0ff"] : ms < 340 ? [80, D.ottimo, "#ffd27a"] : ms < 460 ? [50, D.bene, "#ffe9a8"] : [20, D.lento, "#ffffff"];
            if (ms < 260) { M.lampo([255, 250, 200], 0.5); M.scuoti(12, 0.25); M.rallenta(0.3, 0.35); }
            S.premio(voto[0], cocco.x, cocco.y - 120, voto[1], { colore: voto[2], nota: tempi.length * 2 });
            M.scritta(ms + " ms", cocco.x, cocco.y + 10, { colore: "#ffffff", dim: 42, vita: 1.6, sale: 20 });
            if (tempi.length >= 3) { risultati = { t: 0 }; Did.obiettivo(null); }
            else setTimeout(nuovo, 900);
          }
        },
        aggiorna: function (dt) {
          if (risultati) { risultati.t += dt; if (risultati.t > 3.5) this.fine(tempi); return; }
          if (stato === "attesa") {
            timer -= dt;
            if (timer <= 0) {
              var px = mondo.palme[Math.floor(Math.random() * 3)];
              var alt = 470 + mondo.palme.indexOf(px) * 30;
              cocco = { x: px + 40, y: SUOLO - 10 - alt + 26, vy: 0, t0: performance.now(), stato: "cade" };
              mondo.cocco = cocco;
              stato = "cade";
            }
          } else if (stato === "cade") {
            cocco.vy += 1500 * dt;
            cocco.y += cocco.vy * dt;
            if (cocco.y >= SUOLO - 6) {
              cocco.y = SUOLO - 6;
              stato = "terra";
              window.Suoni.tonfo();
              M.emetti("polvere", cocco.x, SUOLO, 10);
              M.scuoti(7, 0.2);
              M.scritta(D.riprova, cocco.x, SUOLO - 200, { colore: "#ffffff", dim: 54 });
              setTimeout(nuovo, 1000);
            }
          }
        },
        disegnaSchermo: function (ctx, vw, h) {
          if (!risultati) return;
          var a = Math.min(1, risultati.t * 2);
          var max = Math.max.apply(null, tempi.concat([400]));
          var bw = 90, gap = 40, tot = tempi.length * bw + (tempi.length - 1) * gap;
          var x0 = vw / 2 - tot / 2, base = 470;
          ctx.save();
          ctx.globalAlpha = a;
          ctx.fillStyle = "rgba(20,20,30,0.6)";
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(x0 - 50, 110, tot + 100, 420, 30); else ctx.rect(x0 - 50, 110, tot + 100, 420);
          ctx.fill();
          tempi.forEach(function (t, i) {
            var hh = 300 * (t / max) * Math.min(1, risultati.t * 1.5);
            var x = x0 + i * (bw + gap);
            var g = ctx.createLinearGradient(0, base - hh, 0, base);
            g.addColorStop(0, "#ffe08a");
            g.addColorStop(1, "#f08a4b");
            ctx.fillStyle = g;
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(x, base - hh, bw, hh, 14); else ctx.rect(x, base - hh, bw, hh);
            ctx.fill();
            ctx.fillStyle = "#fff";
            ctx.font = "600 30px Georgia, serif";
            ctx.textAlign = "center";
            ctx.fillText(t + " ms", x + bw / 2, base - hh - 16);
          });
          ctx.restore();
        }
      });
    }).then(function (tempi) {
      mondo.cocco = null;
      progressi.riflessi = tempi;
      var media = Math.round(tempi.reduce(function (a, b) { return a + b; }, 0) / tempi.length);
      return Did.mostra(D.cocchiRisultato.replace("{media}", media));
    }).then(function () {
      return pagina("veloci");
    }).then(function () {
      return pagina("ripeti");
    });
  }

  /* 5 — il cuore della cerva */
  function tappaCerva() {
    salvaTappa("cerva");
    B.mostra();
    hayy.equip = progressi.equip || hayy.equip;
    M.ora(2, 6);
    cerva.visibile = true;
    cerva.alfa = 1;
    cerva.x = Math.max(cerva.x, 3200);
    vai(cerva, 3420, 140);
    return vai(hayy, 3240, 180).then(function () {
      return attendi(400);
    }).then(function () {
      cerva.stato = "sdraiata";
      cerva.verso = -1;
      hayy.verso = 1;
      return Did.mostra(D.sera);
    }).then(function () {
      hayy.posa = "inginocchiato";
      Did.obiettivo(OB.ascolta);
      var intervalli = [0.9, 1.0, 1.15, 1.3, 1.5, 1.8, 2.2, 2.7], battito = 0, attesaBattito = 0.3, tiene = false, detto = false;
      return attivita({
        giu: function (wx, wy) { if (vicino(wx, wy, cerva.x, SUOLO - 40, 160)) tiene = true; },
        su: function () { tiene = false; },
        aggiorna: function (dt) {
          if (!tiene) return;
          attesaBattito -= dt;
          if (attesaBattito <= 0) {
            window.Suoni.battito(0.5 - battito * 0.05);
            mondo.anelli.push({ x: cerva.x - 20, y: SUOLO - 40, t: 0 });
            if (navigator.vibrate && window.Salvataggio.impostazioni().vibrazione) { try { navigator.vibrate(30); } catch (e) { /* niente */ } }
            battito++;
            if (battito === 3 && !detto) { detto = true; Did.mostra(D.cuoreCerva, { tocca: false, durata: 3.2 }); }
            if (battito >= intervalli.length) { S.premio(60, cerva.x, SUOLO - 260, null, { colore: "#ffb3c1" }); this.fine(); return; }
            attesaBattito = intervalli[battito];
          }
        }
      });
    }).then(function () {
      Did.obiettivo(null);
      return attendi(1600);
    }).then(function () {
      return Did.mostra(D.fermo);
    }).then(function () {
      for (var i = 0; i < 14; i++) M.emetti("lucciola", cerva.x + (Math.random() - 0.5) * 500, SUOLO - 150 - Math.random() * 200, 1, { spazio: 10 });
      Did.obiettivo(OB.fiori);
      var colori = ["#f39ab2", "#f6d36b", "#b9a2f0"];
      return attivita({
        giu: function (wx) {
          var x = Math.max(cerva.x - 220, Math.min(cerva.x + 160, wx));
          mondo.fiori.push({ x: x, s: 0, c: colori[mondo.fiori.length % 3] });
          M.emetti("foglia", x, SUOLO - 40, 8, { dispersione: 200 });
          M.onda(x, SUOLO - 40, { r: 110, colore: [255, 200, 220], vita: 0.6 });
          S.premio(20, x, SUOLO - 180, null, { colore: "#ffc2d6", nota: mondo.fiori.length + 2, dim: 46 });
          if (mondo.fiori.length >= 3) this.fine();
        }
      });
    }).then(function () {
      Did.obiettivo(null);
      /* la cerva sfuma lentamente */
      return attivita({
        aggiorna: function (dt) {
          cerva.alfa = Math.max(0, cerva.alfa - dt * 0.4);
          if (cerva.alfa <= 0) { cerva.visibile = false; mondo.tomba = true; this.fine(); }
        }
      });
    }).then(function () {
      progressi.fiori = mondo.fiori.map(function (f) { return f.x; });
      return Did.mostra(D.fiori, { tocca: false, durata: 2.2 });
    }).then(function () {
      hayy.posa = "fermo";
      hayy.raggiX = true;
      hayy.cuore = 104;
      return S.indovina(D.indovinaCuore, [{ icona: "⚡", testo: D.subito }, { icona: "〰", testo: D.piano }], 1);
    }).then(function () {
      return Did.mostra(D.tuoCuore);
    }).then(function () {
      return attivita({
        aggiorna: function (dt) {
          hayy.cuore += (74 - hayy.cuore) * dt * 0.35;
          if (hayy.cuore < 78) this.fine();
        }
      });
    }).then(function () {
      hayy.raggiX = false;
      return pagina("cuore");
    }).then(function () {
      return pagina("lenti");
    });
  }

  /* 6 — il fuoco */
  function tappaFuoco() {
    salvaTappa("fuoco");
    B.mostra();
    hayy.equip = progressi.equip || hayy.equip;
    hayy.equip.bastone = false;
    ripristinaFiori();
    M.ora(3, 5);
    return attendi(1500).then(function () {
      /* il fulmine */
      var lampo = document.getElementById("lampo");
      lampo.classList.add("acceso");
      setTimeout(function () { lampo.classList.remove("acceso"); }, 180);
      M.lampo([235, 240, 255], 1);
      M.scuoti(34, 0.8);
      M.zoom(1.18, 1.4, { x: mondo.canneX, y: SUOLO - 200 });
      window.Suoni.tuono();
      setTimeout(function () { window.Suoni.fiammata(); }, 250);
      mondo.canneFuoco = true;
      M.emetti("scintilla", mondo.canneX, SUOLO - 200, 80, { dispersione: 700 });
      M.emetti("brace", mondo.canneX, SUOLO - 260, 40, { vy: -600, dispersione: 600 });
      return Did.mostra(D.fulmine);
    }).then(accendi);

    function accendi() {
      mondo.bastone.visibile = true;
      hayy.equip.fuoco = false;
      return vai(hayy, 3900, 260).then(function () {
        hayy.verso = 1;
        Did.obiettivo(OB.accendi);
        return attivita({
          giu: function (wx, wy) {
            if (vicino(wx, wy, mondo.bastone.x, SUOLO - 20, 120)) this.fine();
          }
        });
      }).then(function () {
        Did.obiettivo(null);
        mondo.bastone.visibile = false;
        return vai(hayy, 4010, 200);
      }).then(function () {
        hayy.equip.fuoco = true;
        hayy.fuocoForza = 1;
        M.emetti("scintilla", hayy.x + 60, SUOLO - 260, 40, { dispersione: 320 });
        M.onda(hayy.x + 40, SUOLO - 270, { r: 220, colore: [255, 170, 80], vita: 0.6, spessore: 14 });
        window.Suoni.fiammata();
        S.premio(50, hayy.x, SUOLO - 380, D.fuocoPreso, { colore: "#ffb36a" });
        return Did.mostra(D.acceso, { tocca: false, durata: 2 });
      }).then(porta);
    }

    function porta() {
      Did.obiettivo(OB.ripara);
      var vento = { prossimo: 1.5, avviso: 0, soffia: 0 }, tiene = false;
      hayy.dest = hayy.x;
      return attivita({
        giu: function () { tiene = true; hayy.ripara = true; },
        su: function () { tiene = false; hayy.ripara = false; },
        aggiorna: function (dt) {
          /* Hayy cammina verso la grotta */
          hayy.dest = mondo.grottaX + 150;
          hayy.vel = 120;
          vento.prossimo -= dt;
          if (vento.prossimo <= 0 && vento.avviso <= 0 && vento.soffia <= 0) {
            vento.avviso = 0.9;
            M.scritta(D.vento, hayy.x + 200, SUOLO - 420, { colore: "#cfe6ff", dim: 60, vita: 1 });
          }
          if (vento.avviso > 0) {
            vento.avviso -= dt;
            if (vento.avviso <= 0) { vento.soffia = 1.3; vento.tenuto = 0; vento.totale = 0; window.Suoni.vento && window.Suoni.vento(); M.scuoti(7, 1.3); }
          }
          if (vento.soffia > 0) {
            vento.soffia -= dt;
            vento.totale += dt;
            if (tiene) vento.tenuto += dt;
            if (vento.soffia <= 0 && vento.tenuto / vento.totale > 0.7) {
              S.serie();
              S.premio(30, hayy.x, SUOLO - 380, D.parata, { serie: true, colore: "#9cf0ff" });
            }
            if (Math.random() < dt * 40) M.emetti("foglia", hayy.x + 500, SUOLO - 100 - Math.random() * 300, 1, { vx: -700, dispersione: 40 });
            if (!tiene) hayy.fuocoForza = Math.max(0, hayy.fuocoForza - dt * 0.75);
            if (vento.soffia <= 0) vento.prossimo = 1.6 + Math.random() * 1.6;
          } else {
            hayy.fuocoForza = Math.min(1, hayy.fuocoForza + dt * 0.15);
          }
          this.vento = vento;
          if (hayy.fuocoForza <= 0.05) { hayy.equip.fuoco = false; hayy.ripara = false; hayy.dest = hayy.x; this.fine("spento"); return; }
          if (hayy.x <= mondo.grottaX + 160) { hayy.ripara = false; this.fine("arrivato"); }
        },
        disegnaSchermo: function (ctx, vw) {
          var v = this.vento;
          if (!v) return;
          var forza = v.avviso > 0 ? 0.35 : v.soffia > 0 ? 0.8 : 0;
          if (!forza) return;
          ctx.strokeStyle = "rgba(220,235,255," + forza * 0.6 + ")";
          ctx.lineWidth = 3;
          var t = M.tempo();
          for (var i = 0; i < 14; i++) {
            var y = 150 + i * 50 + Math.sin(i * 3.1) * 20;
            var x = vw - ((t * 1400 + i * 260) % (vw + 400));
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.quadraticCurveTo(x + 80, y - 10, x + 180, y);
            ctx.stroke();
          }
        }
      }).then(function (esito) {
        Did.obiettivo(null);
        hayy.posa = "fermo";
        hayy.dest = hayy.x;
        if (esito === "spento") {
          M.emetti("fumo", hayy.x + 40, SUOLO - 270, 14);
          M.scritta(D.spentoBreve, hayy.x, SUOLO - 380, { colore: "#bbbbbb", dim: 66 });
          window.Suoni.ops();
          S.rompi();
          return Did.mostra(D.spento, { tocca: false, durata: 1.8 }).then(accendi);
        }
        hayy.equip.fuoco = false;
        return attivita({
          aggiorna: function (dt) {
            mondo.grottaLuce = Math.min(1, mondo.grottaLuce + dt * 0.8);
            if (mondo.grottaLuce >= 1) this.fine();
          }
        }).then(function () {
          M.lampo([255, 180, 90], 0.6);
          M.emetti("scintilla", mondo.grottaX, SUOLO - 120, 70, { dispersione: 600 });
          M.zoom(1.15, 1.6, { x: mondo.grottaX, y: SUOLO - 150 });
          window.Suoni.fiammata();
          S.premio(100, mondo.grottaX, SUOLO - 380, D.casa, { colore: "#ffb36a" });
          progressi.grotta = true;
          return Did.mostra(D.grotta, { tocca: false, durata: 2 });
        });
      });
    }
  }

  /* 7 — la vista del calore */
  function tappaCalore() {
    salvaTappa("calore");
    B.mostra();
    hayy.equip = progressi.equip || hayy.equip;
    hayy.equip.fuoco = false;
    ripristinaFiori();
    M.ora(3);
    mondo.canneFuoco = false;
    mondo.grottaLuce = 1;
    mondo.capra2.visibile = true;
    mondo.capra2.x = 3980;
    var bottone = document.getElementById("btn-calore");
    return vai(hayy, 3700, 260).then(function () {
      hayy.verso = 1;
      return S.indovina(D.indovinaCalore, [{ icona: "🪨", testo: D.ilSasso }, { icona: "🐐", testo: D.laCapra }], 1);
    }).then(function () {
      return Did.mostra(D.calore, { tocca: false, durata: 1.6 });
    }).then(function () {
      bottone.classList.remove("nascosto");
      bottone.onclick = function () {
        var attivo = !bottone.classList.contains("attivo");
        bottone.classList.toggle("attivo", attivo);
        M.termica(attivo);
        if (attivo) { M.lampo([80, 140, 255], 0.5); window.Suoni.whoosh(); }
      };
      Did.obiettivo(OB.calore);
      var visti = {};
      return attivita({
        giu: function (wx, wy) {
          var self = this;
          var bersagli = [
            ["sasso", mondo.sasso.x, SUOLO - 30, 110, "#7fb8ff"],
            ["capra2", mondo.capra2.x, SUOLO - 90, 130, "#ff9a5a"],
            ["hayy", hayy.x, SUOLO - 130, 110, "#ffb36a"]
          ];
          bersagli.forEach(function (b) {
            if (visti[b[0]] || !vicino(wx, wy, b[1], b[2], b[3])) return;
            visti[b[0]] = true;
            if (!bottone.classList.contains("attivo")) { bottone.classList.add("attivo"); M.termica(true); M.lampo([80, 140, 255], 0.5); window.Suoni.whoosh(); }
            S.premio(30, b[1], b[2] - 260, D[b[0]].replace(/[^0-9]/g, "") + "°", { colore: b[4], dim: 90 });
            M.onda(b[1], b[2], { r: 200, colore: b[0] === "sasso" ? [120, 180, 255] : [255, 150, 90], vita: 0.6, spessore: 14 });
            mondo.temperature.push({ testo: D[b[0]].replace(/:.*/, "") + " " + D[b[0]].replace(/[^0-9]/g, "") + "°", x: b[1], y: b[2] - 150, colore: b[4], t: 0 });
            Did.mostra(D[b[0]], { tocca: false, durata: 1.8 });
            if (Object.keys(visti).length === 3) setTimeout(function () { self.fine(); }, 2000);
          });
        }
      });
    }).then(function () {
      Did.obiettivo(null);
      return Did.mostra(D.caldoFine);
    }).then(function () {
      M.termica(false);
      mondo.temperature = [];
      bottone.classList.add("nascosto");
      bottone.classList.remove("attivo");
      return pagina("equilibrio");
    });
  }

  /* 8 — il battito vero (facoltativo) */
  function tappaMisura() {
    salvaTappa("misura");
    var Mi = T.misura;
    return P.scegli("", [D.misura], [Mi.dopo, Mi.via]).then(function (scelta) {
      if (scelta === 0) return null;
      return contoAllaRovescia().then(chiediNumero);
    }).then(function (n) {
      if (!n) return;
      var bpm = n * 2;
      progressi.mioBattito = bpm;
      return Did.mostra(Mi.risultato.replace("{bpm}", bpm)).then(function () {
        return pagina("mioBattito", { bpm: bpm });
      });
    });
  }

  function contoAllaRovescia() {
    return new Promise(function (r) {
      P.apri("");
      var el = P.elementi();
      var num = document.createElement("p");
      num.className = "grande-numero";
      el.testo.appendChild(num);
      el.testo.appendChild(P.paragrafo(T.misura.conta, "centrato"));
      var s = 30;
      num.textContent = s;
      var timer = setInterval(function () {
        s--;
        num.textContent = s;
        if (s <= 0) { clearInterval(timer); window.Suoni.scoperta(); P.chiudi(); r(); }
      }, 1000);
    });
  }

  function chiediNumero() {
    return new Promise(function (r) {
      function chiedi(testo) {
        P.apri("");
        var el = P.elementi();
        el.testo.appendChild(P.paragrafo(testo, "centrato"));
        var riga = document.createElement("div");
        riga.className = "riga-campo";
        var campo = document.createElement("input");
        campo.type = "number";
        campo.inputMode = "numeric";
        campo.setAttribute("aria-label", T.misura.domanda);
        riga.appendChild(campo);
        el.testo.appendChild(riga);
        el.azioni.appendChild(P.bottone(T.misura.dopo, "secondario", function () { P.chiudi(); r(null); }));
        el.azioni.appendChild(P.bottone(T.misura.conferma, "principale", function () {
          var n = parseInt(campo.value, 10);
          if (!(n >= 15 && n <= 90)) { chiedi(T.misura.strano); return; }
          P.chiudi();
          r(n);
        }));
        setTimeout(function () { campo.focus(); }, 50);
      }
      chiedi(T.misura.domanda);
    });
  }

  /* 9 — l'alba e Absal */
  function tappaAlba() {
    salvaTappa("alba");
    B.mostra();
    hayy.equip = progressi.equip || hayy.equip;
    hayy.equip.fuoco = false;
    ripristinaFiori();
    mondo.grottaLuce = 1;
    mondo.capra2.visibile = true;
    M.ora(3);
    M.ora(4, 7);
    mondo.barca.visibile = true;
    mondo.barca.x = 5000;
    return Did.mostra(D.alba, { tocca: false, durata: 2.5 }).then(function () {
      Did.obiettivo(OB.spiaggia);
      var arrivata = false;
      return attivita({
        giu: function (wx) { hayy.dest = Math.max(3300, Math.min(4250, wx)); hayy.vel = 340; },
        aggiorna: function (dt) {
          if (!arrivata) {
            mondo.barca.x = Math.max(4560, mondo.barca.x - dt * 120);
            if (mondo.barca.x <= 4560) {
              arrivata = true; absal.visibile = true; absal.x = 4470; absal.dest = 4380; absal.vel = 120;
              M.emetti("goccia", 4520, SUOLO - 20, 30, { vy: -400, dispersione: 400 });
              M.scritta("!", 4470, SUOLO - 360, { colore: "#ffd27a", dim: 120 });
              window.Suoni.pop();
            }
          }
          if (arrivata && hayy.x > 4100) this.fine();
        }
      });
    }).then(function () {
      Did.obiettivo(null);
      hayy.verso = 1;
      M.zoom(1.2, 4, { x: (hayy.x + absal.x) / 2, y: SUOLO - 180 });
      M.coriandoli((hayy.x + absal.x) / 2, SUOLO - 400, 90);
      window.Suoni.fanfara(3);
      S.premio(100, (hayy.x + absal.x) / 2, SUOLO - 420, D.amico, { colore: "#c9a6ff" });
      return Did.sequenza([D.absal, D.scuola]);
    }).then(function () {
      salvaTappa("fine");
      progressi.completato = true;
      window.Salvataggio.salvaProgressi();
      return finale();
    });
  }

  function finale() {
    var F = T.finale;
    return new Promise(function (r) {
      P.apri(F.titolo);
      var el = P.elementi();
      var r = S.riepilogo();
      el.testo.appendChild(P.paragrafo("✦ " + r.punti + "     ★ " + r.stelle + " / " + r.max, "grande centrato bottino"));
      el.testo.appendChild(P.paragrafo(F.diritto, "grande"));
      el.testo.appendChild(P.paragrafo(F.fonte, "piccolo"));
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
    });
  }

  function ripristinaFiori() {
    if (!mondo.fiori.length && progressi.fiori) {
      mondo.fiori = progressi.fiori.map(function (x, i) { return { x: x, s: 1, c: ["#f39ab2", "#f6d36b", "#b9a2f0"][i % 3] }; });
    }
    if (progressi.fiori) { mondo.tomba = true; cerva.visibile = false; }
  }

  /* ---------- posizioni per riprendere una tappa ---------- */

  function posiziona(tappa) {
    var pos = { segui: [260, 520], animali: [700, 900], corsa: [1500, 1800], cocchi: [2720, 2860], cerva: [2900, 3100],
      fuoco: [3300, 0], calore: [3800, 0], misura: [3700, 0], alba: [3700, 0], fine: [4200, 0] };
    var p = pos[tappa] || pos.segui;
    hayy.x = hayy.dest = p[0];
    if (p[1]) { cerva.x = cerva.dest = p[1]; } else { cerva.visibile = false; }
    var segnati = TAPPE.indexOf(tappa);
    if (segnati > TAPPE.indexOf("animali")) {
      Object.keys(mondo.animali).forEach(function (k) { mondo.animali[k].fatto = true; });
      hayy.equip = progressi.equip || { bastone: true, mantello: true, scudo: true };
    }
    M.camera.x = Math.max(0, hayy.x - M.vista() * 0.38);
    var ore = { segui: 0.2, animali: 1, corsa: 1, cocchi: 1, cerva: 1.3, fuoco: 2, calore: 3, misura: 3, alba: 3, fine: 4 };
    M.ora(ore[tappa] === undefined ? 1 : ore[tappa]);
    if (segnati >= TAPPE.indexOf("calore")) mondo.grottaLuce = 1;
  }

  /* ---------- interfaccia pubblica ---------- */

  window.Livello1 = {
    carica: function () {
      progressi = window.Salvataggio.progressi("livello1");
      M.caricaScena({
        larghezza: LARGHEZZA,
        spiaggiaDa: 4300,
        /* Quando arriverà la scansione del disegno del ragazzo, si potrà aggiungere qui come strato. */
        disegna: disegna,
        aggiorna: aggiorna,
        luci: luci,
        calore: calore
      });
      window.Fondale.carica("livello1");
      S.prepara(progressi);
      M.camera.segui = hayy;
      posiziona(progressi.tappa || "segui");
      ripristinaFiori();
    },

    inizia: function () {
      var tappa = progressi.tappa;
      var sequenza = { segui: tappaSegui, animali: tappaAnimali, corsa: tappaCorsa, cocchi: tappaCocchi, cerva: tappaCerva,
        fuoco: tappaFuoco, calore: tappaCalore, misura: tappaMisura, alba: tappaAlba };
      var ordine = ["segui", "animali", "corsa", "cocchi", "cerva", "fuoco", "calore", "misura", "alba"];
      var da = tappa ? ordine.indexOf(tappa) : 0;
      if (tappa === "fine") return finale();
      var inizio = tappa ? Promise.resolve() : P.pagine([T.prologo]);
      S.mostra();
      return ordine.slice(Math.max(0, da)).reduce(function (pr, nome) {
        return pr.then(function () {
          return S.sipario(ordine.indexOf(nome) + 1, T.tappe[nome]);
        }).then(function () {
          if (MASSIMI[nome]) S.tappa(nome, MASSIMI[nome]);
          return sequenza[nome]();
        }).then(function () {
          if (MASSIMI[nome]) return S.stelle();
        });
      }, inizio).catch(function (e) { if (window.console) console.error(e); });
    },

    /* Solo per i test automatici */
    debug: function () {
      return {
        tappa: progressi.tappa,
        hayy: { x: hayy.x, salto: hayy.salto, equip: hayy.equip, cuore: hayy.cuore },
        cerva: { x: cerva.x, visibile: cerva.visibile },
        oggetto: mondo.oggetto ? { x: mondo.oggetto.x, y: mondo.oggetto.y } : null,
        cocco: mondo.cocco ? mondo.cocco.stato : null,
        ostacoli: mondo.ostacoli.map(function (o) { return o.x; }),
        animali: mondo.animali,
        aSchermo: function (wx, wy) { return M.aSchermo(wx, wy); },
        mondo: mondo,
        hayyRef: hayy
      };
    }
  };
})();
