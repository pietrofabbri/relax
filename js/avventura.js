/*
 * Avventura: le parti "platform" dei livelli.
 * Hayy si muove con i comandi (◀ ▶ salta, bastone), su piattaforme, sopra le buche, contro granchi, vespe e ricci.
 * Si può perdere: tre cuori; se finiscono, si ricomincia la prova.
 * Il fiato è una regola del gioco: correndo cala, fermandosi a respirare torna. Senza fiato si va piano.
 *
 *   Avventura.gioca(def, hayy, cerva) -> Promise<{ frammenti, semi, cadute, sconfitte }>
 *
 * def: vedi js/livelli/avventure-1.js
 */
(function () {
  "use strict";

  var M = window.Mondo, A = window.Arte, S = window.Spettacolo;
  var SUOLO = 790;
  var G = 3000, VMAX = 470, ACC = 3200, FRENO = 3800, SALTO = 1220, SALTO2 = 1080, MOLLA = 1800;
  var LARGO = 26, ALTO = 180;

  var st = null;         /* stato della prova */
  var tasti = { sx: false, dx: false, salta: false, colpo: false };
  var comandi, hud, preparato = false;

  /* ---------- comandi a schermo e tastiera ---------- */

  function prepara() {
    if (preparato) return;
    preparato = true;
    comandi = document.getElementById("comandi");
    hud = document.getElementById("avv-hud");
    var fi = document.querySelector(".avv-fiato-icona");
    if (fi) fi.innerHTML = window.Icone.svg("polmoni");
    function lega(id, chiave) {
      var b = document.getElementById(id);
      function giu(e) {
        e.preventDefault(); e.stopPropagation();
        window.Suoni.sblocca();
        try { b.setPointerCapture(e.pointerId); } catch (x) { /* niente */ }
        if (!tasti[chiave] && st) premuto(chiave);
        tasti[chiave] = true; b.classList.add("premuto");
      }
      function su(e) {
        e.preventDefault();
        if (tasti[chiave] && st) rilasciato(chiave);
        tasti[chiave] = false; b.classList.remove("premuto");
      }
      b.addEventListener("pointerdown", giu);
      b.addEventListener("pointerup", su);
      b.addEventListener("pointercancel", su);
      b.addEventListener("lostpointercapture", su);
      b.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    }
    lega("cmd-sx", "sx"); lega("cmd-dx", "dx"); lega("cmd-salta", "salta"); lega("cmd-colpo", "colpo");
    var mappa = { ArrowLeft: "sx", KeyA: "sx", ArrowRight: "dx", KeyD: "dx", ArrowUp: "salta", Space: "salta", KeyW: "salta", KeyX: "colpo", KeyJ: "colpo", Enter: "colpo" };
    window.addEventListener("keydown", function (e) {
      var k = mappa[e.code];
      if (!k || !st) return;
      e.preventDefault();
      if (!tasti[k]) premuto(k);
      tasti[k] = true;
    });
    window.addEventListener("keyup", function (e) {
      var k = mappa[e.code];
      if (!k) return;
      if (tasti[k] && st) rilasciato(k);
      tasti[k] = false;
    });
  }

  function premuto(k) {
    if (st.fermo) return;
    if (k === "salta") st.bufferSalto = 0.14;
    if (k === "colpo") colpisci();
  }
  function rilasciato(k) {
    if (k === "salta" && st && st.p.vy < -380) st.p.vy *= 0.5;   /* salto corto se si lascia presto */
  }

  /* ---------- costruzione della prova ---------- */

  function copia(o) { return JSON.parse(JSON.stringify(o)); }

  function costruisci(def) {
    var d = copia(def);
    var s = {
      def: def, t: 0, fermo: false,
      p: { x: d.inizio, y: SUOLO, vx: 0, vy: 0, aTerra: true, coyote: 0, doppio: false, invul: 0, colpo: 0, ricarica: 0, su: null, fermoT: 0 },
      cuori: 3, cuoriMax: 3, fiato: 1, affanno: false,
      piume: !!d.piumeSubito, bastone: d.bastone !== false,
      bufferSalto: 0,
      salvataggio: d.inizio, sicuro: d.inizio,
      buche: d.buche || [],
      piatt: (d.piattaforme || []).map(function (q, i) {
        q.id = i; q.x0 = q.x; q.y0 = q.y; q.h = q.h || 34; q.tipo = q.tipo || "pietra";
        q.dx = 0; q.dy = 0; q.stato = "su"; q.t = 0; q.ph = q.ph || 0; return q;
      }),
      muri: (d.muri || []).map(function (q) { q.h = q.h || 160; q.w = q.w || 90; return q; }),
      rovi: (d.rovi || []).map(function (q) { q.vivo = true; q.w = q.w || 80; q.h = q.h || 150; return q; }),
      spine: d.spine || [],
      molle: (d.molle || []).map(function (q) { q.t = 0; return q; }),
      nemici: (d.nemici || []).map(function (n) {
        n.vivo = true; n.x0 = n.x; n.y = n.y || SUOLO; n.y0 = n.y; n.verso = -1; n.t = Math.random() * 6; n.stordito = 0;
        n.da = n.da === undefined ? n.x - 160 : n.da; n.a = n.a === undefined ? n.x + 160 : n.a; return n;
      }),
      palme: (d.palme || []).map(function (x) { return { x: x, cocco: true, cade: null, t: 0 }; }),
      semi: (d.semi || []).map(function (q) { return { x: q[0], y: q[1], preso: false, t: 0 }; }),
      frammenti: (d.frammenti || []).map(function (q) { return { x: q[0], y: q[1], preso: false }; }),
      cuoriExtra: (d.cuori || []).map(function (q) { return { x: q[0], y: q[1], preso: false }; }),
      frutti: (d.frutti || []).map(function (q) { return { x: q[0], y: q[1], preso: false }; }),
      piumeObj: d.piume ? { x: d.piume[0], y: d.piume[1], preso: false } : null,
      fuochi: (d.fuochi || []).map(function (x) { return { x: x, acceso: false }; }),
      fine: d.fine,
      razzi: [],
      contatori: { semi: 0, frammenti: 0, cadute: 0, colpiti: 0 },
      avvisi: {}
    };
    return s;
  }

  /* ---------- geometria ---------- */

  function inBuca(x) {
    for (var i = 0; i < st.buche.length; i++) if (x > st.buche[i][0] + 10 && x < st.buche[i][1] - 10) return true;
    return false;
  }

  function sopra(q) { return q.y + q.dy; }

  function tocca(a, b) {
    return a.x1 < b.x2 && a.x2 > b.x1 && a.y1 < b.y2 && a.y2 > b.y1;
  }

  function corpo() {
    var p = st.p;
    return { x1: p.x - LARGO, x2: p.x + LARGO, y1: p.y - ALTO, y2: p.y };
  }

  function boxNemico(n) {
    var w = n.tipo === "vespa" ? 40 : n.tipo === "riccio" ? 52 : 50;
    var h = n.tipo === "vespa" ? 34 : n.tipo === "riccio" ? 56 : 42;
    return { x1: n.x - w, x2: n.x + w, y1: n.y - h * 2, y2: n.y };
  }

  /* ---------- azioni ---------- */

  function salta(forza, doppio) {
    var p = st.p;
    var k = st.affanno ? 0.82 : 1;
    p.vy = -forza * k;
    p.aTerra = false; p.su = null; p.coyote = 0;
    st.fiato = Math.max(0, st.fiato - 0.035);
    window.Suoni.salto();
    if (doppio) {
      M.emetti("foglia", p.x, p.y - 40, 14, { dispersione: 340, vy: 120, colori: [[250, 250, 255], [210, 220, 240]] });
      M.onda(p.x, p.y - 60, { r: 110, colore: [230, 240, 255], vita: 0.4 });
    } else {
      M.emetti("polvere", p.x, p.y, 10, { dispersione: 220 });
    }
  }

  function colpisci() {
    var p = st.p, h = window.Livello1Hayy;
    if (!st.bastone || p.ricarica > 0) return;
    p.colpo = 0.28; p.ricarica = 0.42;
    window.Suoni.whoosh();
    var zona = { x1: p.x + (h.verso > 0 ? 0 : -150), x2: p.x + (h.verso > 0 ? 150 : 0), y1: p.y - 200, y2: p.y + 10 };
    st.nemici.forEach(function (n) {
      if (!n.vivo) return;
      if (tocca(zona, boxNemico(n))) sconfiggi(n, "bastone");
    });
    st.rovi.forEach(function (r) {
      if (!r.vivo) return;
      if (tocca(zona, { x1: r.x - r.w / 2, x2: r.x + r.w / 2, y1: SUOLO - r.h, y2: SUOLO })) {
        r.vivo = false;
        M.emetti("foglia", r.x, SUOLO - r.h / 2, 30, { dispersione: 600, vy: -200 });
        M.emetti("polvere", r.x, SUOLO - 20, 20, { dispersione: 400 });
        M.scuoti(10, 0.2);
        S.premio(15, r.x, SUOLO - r.h - 60, null, { scintille: 14 });
      }
    });
    st.palme.forEach(function (q) {
      if (q.cocco && Math.abs(q.x - p.x) < 170) cadeCocco(q);
    });
  }

  function cadeCocco(q) {
    q.cocco = false;
    q.cade = { x: q.x + 30, y: SUOLO - 430, vy: 0, a: 0, rotola: 0 };
    window.Suoni.whoosh();
  }

  function sconfiggi(n, come) {
    n.vivo = false;
    n.morte = 0;
    var serie = S.serie();
    var testi = window.TESTI.avventura;
    S.premio(n.tipo === "riccio" ? 40 : 25, n.x, n.y - 160, serie > 1 ? "x" + serie : (come === "bastone" ? testi.colpo : testi.salto), { serie: true, colore: serie > 2 ? "#9cf0ff" : "#ffd27a", scintille: 18 });
    M.emetti("stella", n.x, n.y - 40, 22, { dispersione: 520, colori: [[255, 220, 120], [255, 140, 90], [160, 230, 255]] });
    M.onda(n.x, n.y - 40, { r: 170, colore: [255, 240, 200], vita: 0.45 });
    M.scuoti(8, 0.18);
  }

  function ferisci(daX) {
    var p = st.p;
    if (p.invul > 0 || st.fermo) return;
    st.cuori--;
    st.contatori.colpiti++;
    p.invul = 1.6;
    p.vy = -720;
    p.vx = (p.x < daX ? -1 : 1) * 520;
    p.aTerra = false; p.su = null;
    S.rompi();
    window.Suoni.ops();
    M.scuoti(18, 0.35);
    M.lampo([255, 80, 60], 0.35);
    M.emetti("stella", p.x, p.y - 120, 12, { dispersione: 400, colori: [[255, 90, 90]] });
    aggiornaHud();
    if (st.cuori <= 0) perdi();
  }

  function cadutaInBuca() {
    st.contatori.cadute++;
    st.cuori--;
    window.Suoni.tonfo();
    M.emetti("goccia", st.p.x, SUOLO + 20, 40, { vy: -700, dispersione: 500 });
    S.rompi();
    aggiornaHud();
    if (st.cuori <= 0) { perdi(); return; }
    st.fermo = true;
    setTimeout(function () {
      if (!st) return;
      var p = st.p;
      p.x = Math.max(st.salvataggio, st.sicuro); p.y = SUOLO - 300; p.vx = 0; p.vy = 0; p.invul = 1.6; p.su = null;
      st.fermo = false;
      M.onda(p.x, SUOLO - 120, { r: 200, colore: [255, 230, 160], vita: 0.6 });
    }, 700);
  }

  /* ---------- sconfitta e vittoria ---------- */

  function perdi() {
    st.fermo = true;
    st.sconfitte = (st.sconfitte || 0) + 1;
    var T = window.TESTI.avventura;
    M.rallenta(0.3, 1.2);
    M.zoom(1.3, 1.4, { x: st.p.x, y: st.p.y - 100 });
    window.Suoni.tonfo();
    var box = document.getElementById("sconfitta");
    box.innerHTML = '<div class="sc-faccia">' + window.Icone.svg("cuore") + '</div><p class="sc-titolo">' + T.perso + '</p><p class="sc-testo">' + T.persoSotto +
      '</p><button class="bottone principale" id="sc-riprova">' + T.riprova + "</button>";
    setTimeout(function () {
      box.classList.remove("nascosto");
      var b = document.getElementById("sc-riprova");
      b.focus();
      b.onclick = function () {
        window.Suoni.pop();
        box.classList.add("nascosto");
        var sconfitte = st.sconfitte, fatto = st.fatto, punti = st.puntiInizio;
        st = costruisci(st.def);
        st.sconfitte = sconfitte; st.fatto = fatto; st.puntiInizio = punti;
        posizionaHayy();
        aggiornaHud();
        M.camera.x = Math.max(0, st.p.x - M.vista() * 0.38);
      };
    }, 900);
  }

  function vinci() {
    st.fermo = true;
    var p = st.p, T = window.TESTI.avventura;
    M.rallenta(0.5, 0.8);
    M.scritta(T.vinto, p.x + 120, SUOLO - 420, { dim: 110, colore: "#ffd27a", vita: 2.6 });
    M.coriandoli(p.x + 100, 200, 110);
    window.Suoni.fanfara(3);
    for (var i = 0; i < 7; i++) {
      (function (k) {
        setTimeout(function () {
          if (!st) return;
          st.razzi.push({ x: p.x - 300 + Math.random() * 900, y: SUOLO, vy: -1100 - Math.random() * 300, col: [[255, 200, 80], [255, 110, 120], [120, 220, 255], [190, 255, 140]][k % 4], t: 0 });
          window.Suoni.whoosh();
        }, k * 260);
      })(i);
    }
    var risultato = { frammenti: st.contatori.frammenti, totFrammenti: st.frammenti.length, semi: st.contatori.semi, cadute: st.contatori.cadute, colpiti: st.contatori.colpiti, sconfitte: st.sconfitte || 0 };
    var fatto = st.fatto;
    setTimeout(function () { fine(); fatto(risultato); }, 2800);
  }

  /* ---------- HUD ---------- */

  function aggiornaHud() {
    if (!st) return;
    var I = window.Icone, h = "";
    for (var i = 0; i < st.cuoriMax; i++) h += '<span class="avv-cuore' + (i < st.cuori ? "" : " vuoto") + '">' + I.svg("cuore") + "</span>";
    document.getElementById("avv-cuori").innerHTML = h;
    var f = "";
    for (var j = 0; j < st.frammenti.length; j++) f += '<span class="avv-framm' + (st.frammenti[j].preso ? " preso" : "") + '">' + I.svg("stella") + "</span>";
    document.getElementById("avv-frammenti").innerHTML = f;
  }

  function aggiornaFiato() {
    var b = document.getElementById("avv-fiato-barra");
    b.style.width = Math.round(st.fiato * 100) + "%";
    b.parentNode.classList.toggle("poco", st.fiato < 0.25);
    document.getElementById("cmd-colpo").classList.toggle("nascosto", !st.bastone);
  }

  /* ---------- aggiornamento ---------- */

  function aggiorna(dt, tempo) {
    if (!st) return;
    st.t += dt;
    var p = st.p, h = window.Livello1Hayy;

    /* piattaforme che si muovono o crollano */
    st.piatt.forEach(function (q) {
      var dxPrima = q.dx, dyPrima = q.dy;
      if (q.tipo === "mobile") {
        var w = (st.t + q.ph) * Math.PI * 2 / (q.periodo || 4);
        q.dx = Math.sin(w) * (q.ampX || 0);
        q.dy = Math.sin(w) * (q.ampY || 0);
      }
      if (q.tipo === "crolla") {
        if (q.stato === "trema") { q.t += dt; q.dx = Math.sin(st.t * 60) * 3; if (q.t > 0.55) { q.stato = "cade"; q.vy = 0; window.Suoni.tonfo(); } }
        else if (q.stato === "cade") { q.vy += G * 0.8 * dt; q.dy += q.vy * dt; q.dx = 0; if (q.dy > 700) { q.stato = "via"; q.t = 0; } }
        else if (q.stato === "via") { q.t += dt; if (q.t > 3.5) { q.stato = "su"; q.dy = 0; q.t = 0; } }
      }
      q.mx = q.dx - dxPrima; q.my = q.dy - dyPrima;
    });

    if (!st.fermo) {
      /* corsa */
      var dir = (tasti.dx ? 1 : 0) - (tasti.sx ? 1 : 0);
      var vmax = VMAX * (st.affanno ? 0.55 : 1);
      if (dir) { p.vx += dir * ACC * dt; if (Math.abs(p.vx) > vmax) p.vx = Math.sign(p.vx) * Math.max(vmax, Math.abs(p.vx) - FRENO * dt); h.verso = dir; }
      else { var fr = FRENO * dt * (p.aTerra ? 1 : 0.35); p.vx = Math.abs(p.vx) <= fr ? 0 : p.vx - Math.sign(p.vx) * fr; }

      /* fiato: correndo cala, fermi torna */
      var sforzo = Math.abs(p.vx) / VMAX;
      if (sforzo > 0.3) { st.fiato -= dt * 0.055 * sforzo; p.fermoT = 0; }
      else { p.fermoT += dt; st.fiato += dt * (p.fermoT > 0.6 ? 0.32 : 0.08); }
      st.fiato = Math.max(0, Math.min(1, st.fiato));
      if (st.fiato < 0.08 && !st.affanno) {
        st.affanno = true;
        M.scritta(window.TESTI.avventura.senzaFiato, p.x, p.y - 300, { dim: 56, colore: "#a8d8ff", vita: 2 });
      }
      if (st.affanno && st.fiato > 0.45) st.affanno = false;

      /* salto (con un attimo di tolleranza ai bordi) */
      if (st.bufferSalto > 0) {
        st.bufferSalto -= dt;
        if (p.aTerra || p.coyote > 0) { salta(SALTO); st.bufferSalto = 0; p.doppio = false; }
        else if (st.piume && !p.doppio) { salta(SALTO2, true); st.bufferSalto = 0; p.doppio = true; }
      }
    }

    p.invul = Math.max(0, p.invul - dt);
    p.colpo = Math.max(0, p.colpo - dt);
    p.ricarica = Math.max(0, p.ricarica - dt);
    if (!p.aTerra) p.coyote = Math.max(0, p.coyote - dt);

    /* trasportato dalla piattaforma */
    if (p.su && !st.fermo) { p.x += p.su.mx; p.y = sopra(p.su); if (p.su.stato === "cade" || p.su.stato === "via") { p.su = null; p.aTerra = false; } }

    /* movimento orizzontale e muri */
    var prima = p.x;
    if (!st.fermo || st.p.vy) p.x += p.vx * dt;
    p.x = Math.max(st.def.inizio - 200, Math.min(st.def.larghezza - 60, p.x));
    var solidi = st.muri.map(function (m) { return { x1: m.x - m.w / 2, x2: m.x + m.w / 2, y1: SUOLO - m.h }; })
      .concat(st.rovi.filter(function (r) { return r.vivo; }).map(function (r) { return { x1: r.x - r.w / 2, x2: r.x + r.w / 2, y1: SUOLO - r.h, rovo: true }; }));
    solidi.forEach(function (m) {
      if (p.y > m.y1 + 6 && p.x + LARGO > m.x1 && p.x - LARGO < m.x2) {
        p.x = prima <= (m.x1 + m.x2) / 2 ? m.x1 - LARGO : m.x2 + LARGO;
        p.vx = 0;
        if (m.rovo && !st.avvisi.rovo) { st.avvisi.rovo = 1; M.scritta(window.TESTI.avventura.usaBastone, p.x, p.y - 300, { dim: 50, colore: "#ffe08a", vita: 2.4 }); }
      }
    });

    /* movimento verticale */
    var yPrima = p.y;
    if (!(p.su && p.aTerra)) {
      p.vy += G * dt;
      p.y += p.vy * dt;
    }
    var atterrato = false;
    if (p.vy >= 0 && !(p.su && p.aTerra)) {
      /* piattaforme: si sale da sotto, si atterra da sopra */
      st.piatt.forEach(function (q) {
        if (atterrato || q.stato === "via") return;
        var y = sopra(q), x1 = q.x + q.dx, x2 = x1 + q.w;
        if (yPrima <= y + 2 && p.y >= y && p.x > x1 - 14 && p.x < x2 + 14) {
          p.y = y; atterrato = true; p.su = q;
          if (q.tipo === "crolla" && q.stato === "su") { q.stato = "trema"; q.t = 0; }
        }
      });
      solidi.forEach(function (m) {
        if (atterrato) return;
        if (yPrima <= m.y1 + 2 && p.y >= m.y1 && p.x > m.x1 - 10 && p.x < m.x2 + 10) { p.y = m.y1; atterrato = true; p.su = null; }
      });
      if (!atterrato && yPrima <= SUOLO + 2 && p.y >= SUOLO && !inBuca(p.x)) { p.y = SUOLO; atterrato = true; p.su = null; }
    }
    if (atterrato) {
      if (!p.aTerra && p.vy > 900) M.emetti("polvere", p.x, p.y, 12, { dispersione: 260 });
      p.vy = 0; p.aTerra = true; p.coyote = 0.1; p.doppio = false;
    } else if (p.aTerra && !(p.su && p.su.stato !== "via")) {
      /* camminando oltre un bordo */
      var ancora = false;
      if (p.su) { var x1 = p.su.x + p.su.dx; ancora = p.x > x1 - 14 && p.x < x1 + p.su.w + 14; }
      else if (p.y === SUOLO) ancora = !inBuca(p.x);
      else ancora = solidi.some(function (m) { return p.y === m.y1 && p.x > m.x1 - 10 && p.x < m.x2 + 10; });
      if (!ancora) { p.aTerra = false; p.su = null; }
    } else if (p.su) {
      var xs = p.su.x + p.su.dx;
      if (p.x < xs - 14 || p.x > xs + p.su.w + 14) { p.su = null; p.aTerra = false; }
    }

    /* molle: foglie elastiche */
    st.molle.forEach(function (m) {
      m.t = Math.max(0, m.t - dt);
      if (p.vy > 0 && Math.abs(p.x - m.x) < 60 && yPrima <= m.y - 30 && p.y >= m.y - 30) {
        p.y = m.y - 30; p.vy = -MOLLA; p.aTerra = false; p.su = null; p.doppio = false; m.t = 0.4;
        window.Suoni.salto(); window.Suoni.ding(6);
        M.emetti("foglia", m.x, m.y - 30, 16, { dispersione: 400, vy: -300 });
        M.onda(m.x, m.y - 30, { r: 150, colore: [190, 255, 160], vita: 0.4 });
      }
    });

    /* buche: si ricorda l'ultimo punto sicuro, lontano da buche e spine */
    if (p.aTerra && p.y === SUOLO && !p.su) {
      var lontano = st.buche.every(function (b) { return p.x < b[0] - 90 || p.x > b[1] + 90; }) &&
        st.spine.every(function (sp) { return p.x < sp[0] - 90 || p.x > sp[1] + 90; }) &&
        st.nemici.every(function (n) { return !n.vivo || Math.abs(n.x - p.x) > 260; });
      if (lontano) st.sicuro = p.x;
    }
    if (p.y > 1060 && !st.fermo) cadutaInBuca();

    /* spine nel terreno */
    st.spine.forEach(function (sp) {
      if (p.aTerra && p.y === SUOLO && p.x > sp[0] && p.x < sp[1]) ferisci(p.x - p.vx);
    });

    /* nemici */
    st.nemici.forEach(function (n) {
      if (!n.vivo) { n.morte = (n.morte || 0) + dt; return; }
      n.t += dt;
      if (n.tipo === "vespa") {
        n.x = n.x0 + Math.sin(n.t * (n.vel || 1.3)) * (n.ampX || 160);
        n.y = n.y0 + Math.sin(n.t * 2.6) * (n.ampY || 40);
        n.verso = Math.cos(n.t * (n.vel || 1.3)) > 0 ? 1 : -1;
      } else {
        var v = (n.tipo === "riccio" ? 70 : 120) * (n.vel || 1);
        n.x += n.verso * v * dt;
        if (n.x < n.da) { n.x = n.da; n.verso = 1; }
        if (n.x > n.a) { n.x = n.a; n.verso = -1; }
      }
      if (st.fermo || p.invul > 0.9) return;
      var b = boxNemico(n), c = corpo();
      if (!tocca(b, c)) return;
      var daSopra = p.vy > 120 && yPrima <= b.y1 + 26;
      if (daSopra && n.tipo !== "riccio") {
        sconfiggi(n, "salto");
        p.vy = tasti.salta ? -1150 : -820; p.aTerra = false; p.su = null; p.doppio = false;
      } else if (daSopra && n.tipo === "riccio") {
        ferisci(n.x);
        if (!st.avvisi.riccio) { st.avvisi.riccio = 1; M.scritta(window.TESTI.avventura.riccio, n.x, n.y - 260, { dim: 46, colore: "#ffb0a0", vita: 2.4 }); }
      } else {
        ferisci(n.x);
      }
    });

    /* cocchi che cadono dalle palme */
    st.palme.forEach(function (q) {
      if (q.cocco && Math.abs(p.x - (q.x - 120)) < 30 && !st.fermo) cadeCocco(q);
      var c = q.cade;
      if (!c) return;
      if (c.rotola) {
        c.rotola -= dt; c.x += 260 * dt; c.a += dt * 8;
        if (c.rotola <= 0) { q.cade = null; M.emetti("polvere", c.x, SUOLO - 10, 8); }
      } else {
        c.vy += G * 0.7 * dt; c.y += c.vy * dt; c.a += dt * 4;
        if (c.y >= SUOLO - 26) { c.y = SUOLO - 26; c.rotola = 1.2; M.scuoti(6, 0.12); window.Suoni.tonfo(); }
      }
      if (!st.fermo && tocca({ x1: c.x - 26, x2: c.x + 26, y1: c.y - 26, y2: c.y + 26 }, corpo())) {
        if (p.colpo > 0) return;
        ferisci(c.x); q.cade = null;
      }
    });

    /* oggetti da raccogliere */
    var cp = corpo();
    function preso(o, r) { return !o.preso && tocca({ x1: o.x - r, x2: o.x + r, y1: o.y - r, y2: o.y + r }, cp); }
    st.semi.forEach(function (sm) {
      if (sm.preso) { sm.t += dt; return; }
      if (preso(sm, 34)) {
        sm.preso = true; st.contatori.semi++;
        M.onda(sm.x, sm.y, { r: 90, colore: [255, 230, 140], vita: 0.45 });
        S.premio(10, sm.x, sm.y - 50, null, { nota: st.contatori.semi % 10, dim: 44, scintille: 8 });
      }
    });
    st.frammenti.forEach(function (f) {
      if (preso(f, 44)) {
        f.preso = true; st.contatori.frammenti++;
        M.rallenta(0.4, 0.4);
        M.lampo([255, 240, 190], 0.4);
        M.coriandoli(f.x, f.y - 60, 40);
        S.premio(50, f.x, f.y - 90, window.TESTI.avventura.frammento + " " + st.contatori.frammenti + "/" + st.frammenti.length, { colore: "#ffe27a", scintille: 30 });
        window.Suoni.scoperta();
        aggiornaHud();
      }
    });
    st.cuoriExtra.forEach(function (c) {
      if (preso(c, 40)) {
        c.preso = true; st.cuori = Math.min(st.cuoriMax, st.cuori + 1);
        M.emetti("stella", c.x, c.y, 18, { dispersione: 300, colori: [[255, 120, 140]] });
        S.premio(20, c.x, c.y - 60, window.TESTI.avventura.cuore, { colore: "#ff9aa8" });
        aggiornaHud();
      }
    });
    st.frutti.forEach(function (c) {
      if (preso(c, 40)) {
        c.preso = true; st.fiato = 1; st.affanno = false;
        M.emetti("stella", c.x, c.y, 14, { dispersione: 300, colori: [[180, 230, 255]] });
        S.premio(15, c.x, c.y - 60, window.TESTI.avventura.frutto, { colore: "#a8d8ff" });
      }
    });
    if (st.piumeObj && preso(st.piumeObj, 50)) {
      st.piumeObj.preso = true; st.piume = true;
      M.rallenta(0.35, 0.8);
      M.zoom(1.2, 1.2, { x: p.x, y: p.y - 120 });
      M.lampo([255, 255, 255], 0.6);
      M.emetti("foglia", p.x, p.y - 100, 40, { dispersione: 700, colori: [[250, 250, 255], [200, 210, 230]] });
      S.premio(40, p.x, p.y - 330, window.TESTI.avventura.piume, { colore: "#ffffff", dim: 70, scintille: 30 });
      window.Suoni.scoperta();
    }

    /* fuochi: punti da cui si riparte */
    st.fuochi.forEach(function (f) {
      if (!f.acceso && p.x > f.x - 20) {
        f.acceso = true; st.salvataggio = f.x;
        window.Suoni.fiammata();
        M.emetti("brace", f.x, SUOLO - 60, 30, { vy: -500, dispersione: 300 });
        M.scritta(window.TESTI.avventura.salvato, f.x, SUOLO - 300, { dim: 46, colore: "#ffb070", vita: 1.6 });
        if (st.cuori < st.cuoriMax) { st.cuori++; aggiornaHud(); }
      }
    });

    /* corpo di Hayy: cuore, respiro, sudore */
    var sforzoTot = 1 - st.fiato;
    h.cuore += ((74 + sforzoTot * 96) - h.cuore) * Math.min(1, dt * 2);
    h.respiro = 1.6 + sforzoTot * 5;
    if (sforzoTot > 0.55 && Math.random() < dt * 8) M.emetti("goccia", p.x + 8 * h.verso, p.y - 170, 1, { vy: -100, vx: -60 * h.verso });
    if (st.affanno && Math.random() < dt * 4) M.emetti("fumo", p.x + 30 * h.verso, p.y - 150, 1, { vx: 60 * h.verso, vy: -30 });
    if (window.Battito.visibile()) window.Battito.vai(Math.round(h.cuore));

    /* aggiorna il disegno di Hayy */
    h.x = p.x; h.y = p.y; h.salto = 0;
    h.passo += dt * Math.abs(p.vx) / 32;
    h.posa = !p.aTerra ? "salta" : Math.abs(p.vx) > 280 ? "corre" : Math.abs(p.vx) > 20 ? "cammina" : "fermo";
    st.lampeggia = p.invul > 0 && Math.floor(p.invul * 12) % 2 === 0;

    /* razzi della festa */
    st.razzi.forEach(function (r) {
      r.t += dt; r.vy += 900 * dt; r.y += r.vy * dt;
      if (Math.random() < 0.7) M.emetti("brace", r.x, r.y, 1, { vy: 100 });
      if (r.vy > -150 && !r.esploso) {
        r.esploso = true;
        M.emetti("stella", r.x, r.y, 60, { dispersione: 900, colori: [r.col, [255, 255, 255]] });
        M.onda(r.x, r.y, { r: 260, colore: r.col, vita: 0.6 });
        window.Suoni.ding(Math.floor(Math.random() * 8));
      }
    });
    st.razzi = st.razzi.filter(function (r) { return !r.esploso; });

    /* traguardo */
    if (!st.fermo && p.x >= st.fine) vinci();

    aggiornaFiato();
  }

  /* ---------- disegno ---------- */

  function lastra(ctx, pal, x, y, w, h, tipo, tempo) {
    var base = tipo === "tronco" ? A.mescola(pal.terra, [90, 60, 40], 0.45) : tipo === "foglia" ? A.mescola(pal.medio, [120, 170, 90], 0.3) : A.mescola(pal.terra, [120, 110, 100], 0.35);
    ctx.fillStyle = A.rgba(base);
    ctx.beginPath();
    if (tipo === "foglia") {
      ctx.ellipse(x + w / 2, y + 8, w / 2 + 10, 20, 0, 0, Math.PI * 2);
    } else {
      var r = 16;
      ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w - 10, y + h); ctx.lineTo(x + 10, y + h); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
    }
    ctx.fill();
    /* erba o venature */
    ctx.strokeStyle = A.rgba(A.mescola(base, [20, 15, 10], 0.5), 0.7);
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (tipo === "tronco") { for (var i = 1; i < 3; i++) { ctx.moveTo(x + 12, y + i * h / 3); ctx.lineTo(x + w - 12, y + i * h / 3); } }
    else if (tipo !== "foglia") { for (var k = 14; k < w - 10; k += 26) { ctx.moveTo(x + k, y + 2); ctx.lineTo(x + k - 5, y - 10 - (k * 7 % 9)); } }
    ctx.stroke();
  }

  function disegna(ctx, pal, tempo, camX, vw) {
    if (!st) return;
    var vis = function (x, m) { return x > camX - (m || 300) && x < camX + vw + (m || 300); };

    /* buche: acqua scura tra due rive */
    st.buche.forEach(function (b) {
      if (!vis(b[0], b[1] - b[0] + 200)) return;
      var g = ctx.createLinearGradient(0, SUOLO - 8, 0, SUOLO + 240);
      g.addColorStop(0, A.rgba(A.mescola(pal.mareAlto, [10, 20, 40], 0.6)));
      g.addColorStop(1, A.rgba(A.mescola(pal.mareAlto, [0, 0, 10], 0.9)));
      ctx.fillStyle = g;
      ctx.fillRect(b[0], SUOLO - 8, b[1] - b[0], 260);
      /* rive di roccia ai due lati */
      ctx.fillStyle = A.rgba(A.mescola(pal.terra, [70, 55, 45], 0.45));
      [b[0], b[1]].forEach(function (x, k) {
        ctx.beginPath();
        ctx.moveTo(x, SUOLO - 10);
        ctx.lineTo(x + (k ? 18 : -18), SUOLO + 240);
        ctx.lineTo(x + (k ? -26 : 26), SUOLO + 240);
        ctx.lineTo(x + (k ? -14 : 14), SUOLO + 30);
        ctx.closePath();
        ctx.fill();
      });
      ctx.strokeStyle = A.rgba(pal.mareBasso, 0.8);
      ctx.lineWidth = 4;
      ctx.beginPath();
      for (var x = b[0]; x <= b[1]; x += 20) ctx.lineTo(x, SUOLO + 40 + Math.sin(x * 0.05 + tempo * 3) * 6);
      ctx.stroke();
    });

    /* palme con cocchi */
    st.palme.forEach(function (q, i) { if (vis(q.x, 500)) A.palma(ctx, pal, q.x, SUOLO - 10, 470 + (i % 3) * 30, tempo, q.cocco ? 3 : 0); });
    st.palme.forEach(function (q) { if (q.cade) A.cocco(ctx, pal, q.cade.x, q.cade.y, 26); });

    /* muri di roccia */
    st.muri.forEach(function (m) { if (vis(m.x)) A.roccia(ctx, pal, m.x, SUOLO + 6, m.w + 20, m.h + 6, 40 + m.x % 17); });

    /* piattaforme */
    st.piatt.forEach(function (q) {
      if (q.stato === "via" || !vis(q.x + q.dx, q.w + 200)) return;
      lastra(ctx, pal, q.x + q.dx, sopra(q), q.w, q.h, q.tipo === "crolla" ? "tronco" : q.tipo === "mobile" ? "foglia" : q.tipo, tempo);
    });

    /* molle */
    st.molle.forEach(function (m) {
      if (!vis(m.x)) return;
      var sch = m.t > 0 ? 1 - m.t * 1.2 : 1;
      ctx.fillStyle = A.rgba(A.mescola(pal.medio, [120, 190, 90], 0.4));
      ctx.beginPath();
      ctx.ellipse(m.x, m.y - 18 * sch, 64, 22 * sch, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = A.rgba(A.mescola(pal.terra, [70, 50, 30], 0.4));
      ctx.fillRect(m.x - 8, m.y - 10, 16, SUOLO - m.y + 10);
    });

    /* fuochi spenti (la fiamma è nello strato a colori) */
    st.fuochi.forEach(function (f) {
      if (!vis(f.x)) return;
      ctx.fillStyle = A.rgba(A.mescola(pal.terra, [60, 40, 30], 0.5));
      for (var i = -1; i <= 1; i++) { ctx.save(); ctx.translate(f.x + i * 14, SUOLO - 10); ctx.rotate(i * 0.5); ctx.fillRect(-6, -40, 12, 44); ctx.restore(); }
    });

    /* cerva al traguardo */
    var cerva = window.Livello1Cerva;
    if (st.def.traguardo === "cerva" && cerva && vis(st.fine + 140)) { cerva.x = st.fine + 160; cerva.y = SUOLO; cerva.verso = -1; cerva.stato = "ferma"; A.cerva(ctx, pal, cerva, tempo); }

    /* Hayy */
    var h = window.Livello1Hayy;
    if (!st.lampeggia) { h.strato = "corpo"; A.persona(ctx, pal, h, tempo); }
    if (st.p.colpo > 0) {
      var f = 1 - st.p.colpo / 0.28;
      ctx.strokeStyle = "rgba(255,255,255," + (0.8 * (1 - f)).toFixed(2) + ")";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(st.p.x, st.p.y - 110, 120, h.verso > 0 ? -1.4 + f * 1.8 : Math.PI + 1.4 - f * 1.8, h.verso > 0 ? -0.6 + f * 1.8 : Math.PI + 0.6 - f * 1.8, h.verso < 0);
      ctx.stroke();
    }
  }

  /* nello strato a colori: ciò che si prende e ciò che fa male */
  function disegnaColore(ctx, pal, tempo, camX, vw) {
    if (!st) return;
    var vis = function (x) { return x > camX - 200 && x < camX + vw + 200; };

    st.semi.forEach(function (sm) {
      if (!vis(sm.x)) return;
      if (sm.preso) { if (sm.t < 0.4) { ctx.fillStyle = "rgba(255,230,140," + (1 - sm.t / 0.4) + ")"; ctx.beginPath(); ctx.arc(sm.x, sm.y - sm.t * 200, 14, 0, 7); ctx.fill(); } return; }
      var y = sm.y + Math.sin(tempo * 3 + sm.x) * 6;
      var g = ctx.createRadialGradient(sm.x, y, 0, sm.x, y, 34);
      g.addColorStop(0, "rgba(255,240,170,0.95)"); g.addColorStop(0.4, "rgba(255,200,80,0.6)"); g.addColorStop(1, "rgba(255,200,80,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sm.x, y, 34, 0, 7); ctx.fill();
      ctx.fillStyle = "#fff6d0"; ctx.beginPath(); ctx.arc(sm.x, y, 9, 0, 7); ctx.fill();
    });

    st.frammenti.forEach(function (f) {
      if (f.preso || !vis(f.x)) return;
      var y = f.y + Math.sin(tempo * 2.4) * 10;
      ctx.save(); ctx.translate(f.x, y); ctx.rotate(Math.sin(tempo * 1.7) * 0.25);
      var g = ctx.createRadialGradient(0, 0, 0, 0, 0, 80);
      g.addColorStop(0, "rgba(255,240,150,0.7)"); g.addColorStop(1, "rgba(255,240,150,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 80, 0, 7); ctx.fill();
      ctx.fillStyle = "#ffd34a"; ctx.strokeStyle = "#7a4a00"; ctx.lineWidth = 5;
      ctx.beginPath();
      for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 18 : 40; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.restore();
    });

    st.cuoriExtra.forEach(function (c) {
      if (c.preso || !vis(c.x)) return;
      var s = 1 + Math.sin(tempo * 6) * 0.08;
      ctx.save(); ctx.translate(c.x, c.y); ctx.scale(s, s);
      ctx.fillStyle = "#ff5a6e"; ctx.strokeStyle = "#7a1f22"; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(0, 22); ctx.bezierCurveTo(-40, -6, -22, -34, 0, -14); ctx.bezierCurveTo(22, -34, 40, -6, 0, 22); ctx.fill(); ctx.stroke();
      ctx.restore();
    });

    st.frutti.forEach(function (c) {
      if (c.preso || !vis(c.x)) return;
      var y = c.y + Math.sin(tempo * 3) * 5;
      ctx.fillStyle = "#ff9a3a"; ctx.strokeStyle = "#6a3410"; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(c.x, y, 22, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#5cb85c"; ctx.beginPath(); ctx.ellipse(c.x + 8, y - 24, 12, 6, -0.5, 0, 7); ctx.fill();
    });

    if (st.piumeObj && !st.piumeObj.preso && vis(st.piumeObj.x)) {
      var q = st.piumeObj, yq = q.y + Math.sin(tempo * 2) * 12;
      var g2 = ctx.createRadialGradient(q.x, yq, 0, q.x, yq, 110);
      g2.addColorStop(0, "rgba(255,255,255,0.8)"); g2.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(q.x, yq, 110, 0, 7); ctx.fill();
      for (var k = -1; k <= 1; k++) {
        ctx.save(); ctx.translate(q.x + k * 18, yq); ctx.rotate(k * 0.4 + Math.sin(tempo * 3) * 0.1);
        ctx.fillStyle = "#f4f1ea"; ctx.strokeStyle = "#5a4a3a"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.ellipse(0, -30, 14, 44, 0, 0, 7); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, 14); ctx.lineTo(0, -70); ctx.stroke();
        ctx.restore();
      }
    }

    /* piume addosso: due ali leggere quando si può fare il doppio salto */
    var h = window.Livello1Hayy;
    if (st.piume && !st.lampeggia) {
      var batti = st.p.aTerra ? 0.2 : Math.sin(tempo * 18) * 0.5;
      ctx.save(); ctx.translate(st.p.x - 10 * h.verso, st.p.y - 150); ctx.scale(h.verso, 1);
      ctx.fillStyle = st.p.doppio ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.85)";
      ctx.strokeStyle = "rgba(90,74,58,0.8)"; ctx.lineWidth = 3;
      ctx.rotate(-0.6 - batti);
      ctx.beginPath(); ctx.ellipse(-30, 0, 44, 16, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.restore();
    }

    /* traguardo: un grande fuoco */
    if (st.def.traguardo === "fuoco" && vis(st.fine + 160)) {
      A.fiamma(ctx, st.fine + 160, SUOLO - 30, 2.2, tempo, 7);
    }

    /* fiamme dei fuochi accesi */
    st.fuochi.forEach(function (f) {
      if (!vis(f.x)) return;
      if (f.acceso) A.fiamma(ctx, f.x, SUOLO - 30, 1.1, tempo, f.x);
      else {
        ctx.strokeStyle = "rgba(255,200,120," + (0.4 + Math.sin(tempo * 4) * 0.3).toFixed(2) + ")"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(f.x, SUOLO - 40, 50, 0, 7); ctx.stroke();
      }
    });

    /* spine (rovi bassi) */
    st.spine.forEach(function (sp) {
      if (!vis(sp[0]) && !vis(sp[1])) return;
      ctx.fillStyle = "#6a3a5a"; ctx.strokeStyle = "#2a1020"; ctx.lineWidth = 3;
      for (var x = sp[0]; x < sp[1]; x += 28) {
        ctx.beginPath(); ctx.moveTo(x, SUOLO + 4); ctx.lineTo(x + 14, SUOLO - 34); ctx.lineTo(x + 28, SUOLO + 4); ctx.closePath(); ctx.fill(); ctx.stroke();
      }
    });

    /* rovi da abbattere col bastone */
    st.rovi.forEach(function (r) {
      if (!r.vivo || !vis(r.x)) return;
      ctx.strokeStyle = "#4a2a40"; ctx.lineWidth = 7; ctx.lineCap = "round";
      for (var i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.moveTo(r.x - r.w / 2 + i * r.w / 6, SUOLO);
        ctx.quadraticCurveTo(r.x + Math.sin(i * 2.1 + tempo) * 30, SUOLO - r.h * 0.6, r.x - r.w / 2 + ((i * 3) % 7) * r.w / 6, SUOLO - r.h);
        ctx.stroke();
      }
      ctx.fillStyle = "#b03a6a";
      for (var j = 0; j < 9; j++) { ctx.beginPath(); ctx.arc(r.x - r.w / 2 + (j * 37 % r.w), SUOLO - 20 - (j * 53 % (r.h - 30)), 6, 0, 7); ctx.fill(); }
    });

    /* nemici */
    st.nemici.forEach(function (n) {
      if (!vis(n.x)) return;
      if (!n.vivo) {
        if (n.morte > 0.6) return;
        ctx.save(); ctx.globalAlpha = 1 - n.morte / 0.6; ctx.translate(n.x, n.y - n.morte * 300); ctx.rotate(n.morte * 10); ctx.scale(1, -1);
        nemico(ctx, n, tempo, true); ctx.restore(); return;
      }
      ctx.save(); ctx.translate(n.x, n.y); nemico(ctx, n, tempo); ctx.restore();
    });
  }

  function nemico(ctx, n, tempo, capovolto) {
    var I = "#2a1a14";
    ctx.lineWidth = 4; ctx.strokeStyle = I;
    if (n.tipo === "granchio") {
      var z = Math.sin(n.t * 14) * 4;
      ctx.fillStyle = "#e5603a";
      for (var i = -1; i <= 1; i += 2) for (var k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(i * 20, -18); ctx.lineTo(i * (44 + k * 6), -4 + (k % 2 ? z : -z)); ctx.stroke(); }
      ctx.beginPath(); ctx.ellipse(0, -30, 46, 26, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(-46, -54 + z, 14, 0, 7); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(46, -54 - z, 14, 0, 7); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-12, -52); ctx.lineTo(-14, -72); ctx.moveTo(12, -52); ctx.lineTo(14, -72); ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(-14, -76, 8, 0, 7); ctx.arc(14, -76, 8, 0, 7); ctx.fill();
      ctx.fillStyle = I; ctx.beginPath(); ctx.arc(-13 + n.verso * 3, -76, 4, 0, 7); ctx.arc(15 + n.verso * 3, -76, 4, 0, 7); ctx.fill();
    } else if (n.tipo === "vespa") {
      var ali = Math.sin(tempo * 50) * 0.6;
      ctx.scale(n.verso, 1);
      ctx.fillStyle = "rgba(220,240,255,0.8)";
      ctx.save(); ctx.translate(-4, -46); ctx.rotate(-0.6 + ali); ctx.beginPath(); ctx.ellipse(0, -18, 12, 24, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
      ctx.fillStyle = "#f5c52a";
      ctx.beginPath(); ctx.ellipse(0, -34, 40, 24, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = I;
      for (var s = -1; s <= 1; s++) { ctx.fillRect(-6 + s * 16, -56, 8, 44); }
      ctx.beginPath(); ctx.moveTo(-40, -34); ctx.lineTo(-58, -30); ctx.lineTo(-40, -26); ctx.fill();
      ctx.fillStyle = "#f5c52a"; ctx.beginPath(); ctx.arc(36, -40, 14, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = I; ctx.beginPath(); ctx.arc(42, -44, 4, 0, 7); ctx.fill();
    } else if (n.tipo === "riccio") {
      ctx.scale(n.verso, 1);
      ctx.fillStyle = "#6b4a30";
      for (var a = 0; a < 13; a++) {
        var an = Math.PI + a * Math.PI / 12;
        ctx.beginPath(); ctx.moveTo(Math.cos(an) * 34, -30 + Math.sin(an) * 30); ctx.lineTo(Math.cos(an) * 66, -30 + Math.sin(an) * 62); ctx.lineTo(Math.cos(an + 0.15) * 34, -30 + Math.sin(an + 0.15) * 30); ctx.fill(); ctx.stroke();
      }
      ctx.fillStyle = "#8a6444"; ctx.beginPath(); ctx.ellipse(0, -28, 50, 30, 0, Math.PI, 0); ctx.lineTo(50, -4); ctx.lineTo(-50, -4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#e8c8a0"; ctx.beginPath(); ctx.ellipse(48, -18, 20, 15, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = I; ctx.beginPath(); ctx.arc(66, -20, 5, 0, 7); ctx.arc(50, -24, 4, 0, 7); ctx.fill();
    }
  }

  function luci() {
    if (!st) return [];
    var l = st.fuochi.filter(function (f) { return f.acceso; }).map(function (f) { return { x: f.x, y: SUOLO - 60, r: 380, colore: [255, 180, 90] }; });
    l.push({ x: st.p.x, y: st.p.y - 100, r: 420, colore: [255, 220, 160] });
    if (st.def.traguardo === "fuoco") l.push({ x: st.fine + 160, y: SUOLO - 80, r: 600, colore: [255, 170, 80] });
    return l;
  }

  /* ---------- inizio e fine ---------- */

  function posizionaHayy() {
    var h = window.Livello1Hayy;
    h.x = st.p.x; h.y = SUOLO; h.salto = 0; h.vy = 0; h.verso = 1; h.inCorsa = true; h.posa = "fermo";
    h.equip = h.equip || {};
    M.camera.segui = h;
  }

  function fine() {
    comandi.classList.add("nascosto");
    hud.classList.add("nascosto");
    var h = window.Livello1Hayy;
    h.inCorsa = false; h.y = SUOLO; h.posa = "fermo";
    st = null;
    tasti.sx = tasti.dx = tasti.salta = tasti.colpo = false;
  }

  window.Avventura = {
    gioca: function (def) {
      prepara();
      return new Promise(function (fatto) {
        st = costruisci(def);
        st.fatto = fatto;
        posizionaHayy();
        comandi.classList.remove("nascosto");
        hud.classList.remove("nascosto");
        window.Battito.mostra();
        aggiornaHud();
        aggiornaFiato();
      });
    },
    /* la scena (da passare a Mondo.caricaScena) */
    scena: function (def) {
      return {
        larghezza: def.larghezza,
        spiaggiaDa: def.larghezza + 2000,
        disegna: disegna,
        disegnaColore: disegnaColore,
        aggiorna: aggiorna,
        luci: luci,
        buio: function () { return def.buio || 0; },
        calore: function () { return []; }
      };
    },
    attivo: function () { return !!st; },
    /* solo per i test automatici */
    debug: function () { return st; },
    tasti: tasti
  };
})();
