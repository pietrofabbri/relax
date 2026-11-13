/*
 * Il mondo: camera, ora del giorno, luce, particelle, tocchi.
 * Coordinate del mondo: altezza fissa 1000, larghezza decisa dalla scena.
 * Il disegno vero e proprio sta in arte.js; le regole del livello in livello1.js.
 */
(function () {
  "use strict";

  var A = window.Arte;
  var ALTEZZA = 1000;

  var canvas, ctx, dpr = 1, scala = 1, vw = 1000;
  var buio = null, bctx = null, carta = null;
  var scena = null, attivita = null;
  var tempo = 0, ultimo = 0;
  var camera = { x: 0, segui: null, anticipo: 0.38 };
  var ora = { valore: 1, da: 1, a: 1, t: 1, durata: 1 };
  var termica = { attiva: false, mix: 0 };
  var particelle = [];
  var tocchi = { giu: false };

  /* ---------- particelle ---------- */

  var TIPI = {
    polvere: { colore: [230, 210, 170], vita: 0.8, gravita: -20, dimensione: 6, sfuma: true },
    scintilla: { colore: [255, 170, 60], vita: 1.4, gravita: -60, dimensione: 3, luce: true },
    goccia: { colore: [190, 230, 255], vita: 0.7, gravita: 600, dimensione: 3 },
    foglia: { colore: [110, 160, 90], vita: 3, gravita: 40, dimensione: 7 },
    lucciola: { colore: [230, 255, 140], vita: 4, gravita: 0, dimensione: 2.5, luce: true },
    stella: { colore: [255, 240, 180], vita: 0.9, gravita: 0, dimensione: 5, luce: true },
    fumo: { colore: [180, 180, 190], vita: 2.5, gravita: -40, dimensione: 18, sfuma: true }
  };

  function emetti(tipo, x, y, n, o) {
    var t = TIPI[tipo];
    o = o || {};
    for (var i = 0; i < (n || 1); i++) {
      particelle.push({
        tipo: tipo, x: x + (Math.random() - 0.5) * (o.spazio || 20), y: y + (Math.random() - 0.5) * (o.spazio || 20),
        vx: (o.vx || 0) + (Math.random() - 0.5) * (o.dispersione || 60),
        vy: (o.vy || 0) + (Math.random() - 0.5) * (o.dispersione || 60),
        vita: t.vita * (0.6 + Math.random() * 0.6), max: 0, d: t.dimensione * (0.6 + Math.random() * 0.8),
        ph: Math.random() * 6
      });
      particelle[particelle.length - 1].max = particelle[particelle.length - 1].vita;
    }
    if (particelle.length > 500) particelle.splice(0, particelle.length - 500);
  }

  function aggiornaParticelle(dt) {
    for (var i = particelle.length - 1; i >= 0; i--) {
      var q = particelle[i], t = TIPI[q.tipo];
      q.vita -= dt;
      if (q.vita <= 0) { particelle.splice(i, 1); continue; }
      q.vy += t.gravita * dt;
      if (q.tipo === "lucciola") { q.vx = Math.sin(tempo + q.ph) * 30; q.vy = Math.cos(tempo * 0.7 + q.ph) * 20; }
      if (q.tipo === "foglia") q.vx += Math.sin(tempo * 3 + q.ph) * 40 * dt;
      q.x += q.vx * dt;
      q.y += q.vy * dt;
    }
  }

  function disegnaParticelle() {
    particelle.forEach(function (q) {
      var t = TIPI[q.tipo], f = q.vita / q.max;
      var a = t.sfuma ? f * 0.6 : Math.min(1, f * 2);
      if (q.tipo === "lucciola") a *= 0.5 + 0.5 * Math.sin(tempo * 6 + q.ph);
      if (t.luce) ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = A.rgba(t.colore, a);
      ctx.beginPath();
      if (q.tipo === "foglia") ctx.ellipse(q.x, q.y, q.d, q.d * 0.45, tempo * 2 + q.ph, 0, Math.PI * 2);
      else ctx.arc(q.x, q.y, q.d * (t.sfuma ? (2 - f) : 1), 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    });
  }

  /* ---------- carta (grana leggera, per restare nello stile del quaderno) ---------- */

  function preparaCarta() {
    var c = document.createElement("canvas");
    c.width = c.height = 200;
    var g = c.getContext("2d");
    var r = A.casuale(7);
    for (var i = 0; i < 3000; i++) {
      var v = Math.floor(r() * 255);
      g.fillStyle = "rgba(" + v + "," + v + "," + v + "," + (r() * 0.08).toFixed(3) + ")";
      g.fillRect(r() * 200, r() * 200, 1.5, 1.5);
    }
    return c;
  }

  /* ---------- disegno ---------- */

  function ridimensiona() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    scala = canvas.height / ALTEZZA;
    vw = canvas.width / scala;
    buio.width = canvas.width;
    buio.height = canvas.height;
    var ruota = document.getElementById("ruota");
    if (ruota) {
      ruota.textContent = window.TESTI.gioco.ruota;
      ruota.classList.toggle("nascosto", window.innerWidth >= window.innerHeight);
    }
  }

  function aggiornaCamera(dt) {
    if (!scena) return;
    var obiettivo = camera.x;
    if (camera.segui) obiettivo = camera.segui.x - vw * camera.anticipo;
    if (camera.fisso !== undefined && camera.fisso !== null) obiettivo = camera.fisso;
    obiettivo = Math.max(0, Math.min(scena.larghezza - vw, obiettivo));
    camera.x += (obiettivo - camera.x) * Math.min(1, dt * 3.5);
  }

  function disegna() {
    var p = A.tavolozza(ora.valore);
    var W = canvas.width, H = canvas.height;
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    /* cielo e lontananza: coordinate dello schermo scalate */
    ctx.setTransform(scala, 0, 0, scala, 0, 0);
    A.cielo(ctx, p, vw, tempo);
    A.nuvole(ctx, p, camera.x, vw, tempo);
    A.isoleLontane(ctx, p, camera.x, vw);
    A.mare(ctx, p, camera.x, vw, tempo);
    A.giungla(ctx, p, camera.x, vw, tempo);

    /* mondo vicino */
    ctx.setTransform(scala, 0, 0, scala, -camera.x * scala, 0);
    A.terreno(ctx, p, camera.x, vw, tempo, scena.larghezza, scena.spiaggiaDa);
    if (scena.disegna) scena.disegna(ctx, p, tempo, camera.x, vw);
    if (attivita && attivita.disegnaMondo) attivita.disegnaMondo(ctx, p, tempo);
    disegnaParticelle();

    /* primo piano */
    ctx.setTransform(scala, 0, 0, scala, 0, 0);
    A.primoPiano(ctx, p, camera.x, vw, tempo, scena.larghezza);

    /* buio con le fonti di luce */
    var forzaBuio = Math.min(0.88, p.notte * 0.82 + (scena.buio ? scena.buio() : 0));
    var luci = scena.luci ? scena.luci() : [];
    if (forzaBuio > 0.02) {
      bctx.setTransform(1, 0, 0, 1, 0, 0);
      bctx.globalCompositeOperation = "source-over";
      bctx.clearRect(0, 0, W, H);
      bctx.fillStyle = "rgba(4,6,18," + forzaBuio.toFixed(3) + ")";
      bctx.fillRect(0, 0, W, H);
      bctx.globalCompositeOperation = "destination-out";
      bctx.setTransform(scala, 0, 0, scala, -camera.x * scala, 0);
      luci.forEach(function (l) {
        var trem = 1 + Math.sin(tempo * 11 + l.x) * 0.04 + Math.sin(tempo * 17) * 0.03;
        var g = bctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r * trem);
        g.addColorStop(0, "rgba(0,0,0," + (l.forza || 1) + ")");
        g.addColorStop(0.5, "rgba(0,0,0," + ((l.forza || 1) * 0.6) + ")");
        g.addColorStop(1, "rgba(0,0,0,0)");
        bctx.fillStyle = g;
        bctx.fillRect(l.x - l.r * 1.1, l.y - l.r * 1.1, l.r * 2.2, l.r * 2.2);
      });
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(buio, 0, 0);
      /* bagliore caldo delle luci */
      ctx.setTransform(scala, 0, 0, scala, -camera.x * scala, 0);
      ctx.globalCompositeOperation = "lighter";
      luci.forEach(function (l) {
        if (!l.colore) return;
        var g2 = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r * 0.8);
        g2.addColorStop(0, A.rgba(l.colore, 0.22 * (l.forza || 1)));
        g2.addColorStop(1, A.rgba(l.colore, 0));
        ctx.fillStyle = g2;
        ctx.fillRect(l.x - l.r, l.y - l.r, l.r * 2, l.r * 2);
      });
      ctx.globalCompositeOperation = "source-over";
    }

    /* vista del calore */
    if (termica.mix > 0.01) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "rgba(6,14,48," + (0.86 * termica.mix).toFixed(3) + ")";
      ctx.fillRect(0, 0, W, H);
      ctx.setTransform(scala, 0, 0, scala, -camera.x * scala, 0);
      ctx.globalCompositeOperation = "lighter";
      (scena.calore ? scena.calore() : []).forEach(function (c) {
        var caldo = Math.max(0, Math.min(1, (c.temp - 10) / 30));
        var col = caldo > 0.7 ? [255, 90, 40] : caldo > 0.45 ? [255, 190, 60] : [60, 140, 255];
        var g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
        g.addColorStop(0, A.rgba(col, 0.85 * termica.mix));
        g.addColorStop(0.6, A.rgba(col, 0.35 * termica.mix));
        g.addColorStop(1, A.rgba(col, 0));
        ctx.fillStyle = g;
        ctx.fillRect(c.x - c.r, c.y - c.r, c.r * 2, c.r * 2);
      });
      ctx.globalCompositeOperation = "source-over";
    }

    /* grana della carta e vignetta */
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = ctx.createPattern(carta, "repeat");
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    var agit = window.Battito.agitazione();
    A.vignetta(ctx, W, H, 0.35 + agit * 0.4);

    /* interfaccia dell'attività, in coordinate dello schermo */
    if (attivita && attivita.disegnaSchermo) {
      ctx.setTransform(scala, 0, 0, scala, 0, 0);
      attivita.disegnaSchermo(ctx, vw, ALTEZZA, p, tempo);
    }
  }

  function ciclo(adesso) {
    var dt = Math.min(0.05, (adesso - (ultimo || adesso)) / 1000);
    ultimo = adesso;
    tempo += dt;

    if (ora.t < 1) {
      ora.t = Math.min(1, ora.t + dt / ora.durata);
      var e = ora.t * ora.t * (3 - 2 * ora.t);
      ora.valore = ora.da + (ora.a - ora.da) * e;
    }
    termica.mix += ((termica.attiva ? 1 : 0) - termica.mix) * Math.min(1, dt * 5);

    window.Battito.passo(dt, adesso);
    if (scena) {
      if (scena.aggiorna) scena.aggiorna(dt, tempo);
      if (attivita && attivita.aggiorna) attivita.aggiorna(dt, tempo);
      aggiornaParticelle(dt);
      aggiornaCamera(dt);
      disegna();
    }
    window.requestAnimationFrame(ciclo);
  }

  /* ---------- tocchi ---------- */

  function coordinate(e) {
    var r = canvas.getBoundingClientRect();
    var sx = (e.clientX - r.left) * dpr / scala;
    var sy = (e.clientY - r.top) * dpr / scala;
    return { sx: sx, sy: sy, wx: sx + camera.x, wy: sy };
  }

  function giu(e) {
    if (window.Pannello.aperto()) return;
    window.Suoni.sblocca();
    tocchi.giu = true;
    try { canvas.setPointerCapture(e.pointerId); } catch (x) { /* niente */ }
    var c = coordinate(e);
    if (attivita && attivita.giu) attivita.giu(c.wx, c.wy, c.sx, c.sy);
  }
  function muovi(e) {
    if (!tocchi.giu) return;
    var c = coordinate(e);
    if (attivita && attivita.muovi) attivita.muovi(c.wx, c.wy, c.sx, c.sy);
  }
  function su(e) {
    if (!tocchi.giu) return;
    tocchi.giu = false;
    var c = coordinate(e);
    if (attivita && attivita.su) attivita.su(c.wx, c.wy, c.sx, c.sy);
  }

  window.Mondo = {
    SUOLO: 790,
    prepara: function () {
      canvas = document.getElementById("mondo");
      ctx = canvas.getContext("2d");
      buio = document.createElement("canvas");
      bctx = buio.getContext("2d");
      carta = preparaCarta();
      ridimensiona();
      window.addEventListener("resize", ridimensiona);
      canvas.addEventListener("pointerdown", giu);
      canvas.addEventListener("pointermove", muovi);
      canvas.addEventListener("pointerup", su);
      canvas.addEventListener("pointercancel", su);
      window.requestAnimationFrame(ciclo);
    },
    caricaScena: function (s) { scena = s; ridimensiona(); },
    attivita: function (a) { attivita = a; },
    camera: camera,
    vista: function () { return vw; },
    tempo: function () { return tempo; },
    /* porta l'ora del giorno a un valore (0 alba, 1 giorno, 2 tramonto, 3 notte) */
    ora: function (valore, durata) {
      if (!durata) { ora.valore = ora.a = ora.da = valore; ora.t = 1; return; }
      ora.da = ora.valore; ora.a = valore; ora.t = 0; ora.durata = durata;
    },
    termica: function (si) { termica.attiva = !!si; },
    emetti: emetti,
    aSchermo: function (wx, wy) {
      return { x: (wx - camera.x) * scala / dpr, y: wy * scala / dpr };
    }
  };
})();
