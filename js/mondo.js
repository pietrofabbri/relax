/*
 * Il mondo: camera, ora del giorno, luce, particelle, tocchi.
 * Coordinate del mondo: altezza fissa 1000, larghezza decisa dalla scena.
 * Il disegno vero e proprio sta in arte.js; le regole del livello in livello1.js.
 */
(function () {
  "use strict";

  var A = window.Arte;
  var ALTEZZA = 1000;

  /*
   * Due tele sovrapposte:
   *  - il MONDO (cielo, paesaggio, personaggi): in stile "inchiostro" diventa bianco e nero su carta,
   *    con i contorni neri, per stare bene accanto ai disegni a matita o a china del ragazzo;
   *  - il COLORE (fuoco, cuore, cose da toccare, effetti, scritte): resta a colori, sopra a tutto,
   *    così l'occhio va subito a ciò che conta.
   */
  var canvas, ctx, dpr = 1, scala = 1, vw = 1000;
  var cw = null, telaColore = null, cc = null;
  var inchiostro = false, contorno = false;
  var buio = null, bctx = null, carta = null;
  var scena = null, attivita = null;
  var tempo = 0, ultimo = 0;
  var camera = { x: 0, segui: null, anticipo: 0.38 };
  var ora = { valore: 1, da: 1, a: 1, t: 1, durata: 1 };
  var termica = { attiva: false, mix: 0 };
  var particelle = [];
  var tocchi = { giu: false };
  /* effetti: scossa, zoom, rallentatore, lampo, scritte, sipario */
  var fx = { scossa: 0, scossaMax: 0, sx: 0, sy: 0, zoom: 1, zoomA: 1, zoomT: 0, fuoco: null,
    lento: 1, lentoT: 0, lampo: 0, lampoCol: [255, 255, 255], scritte: [], onde: [],
    sipario: null };
  var calmo = function () { try { return window.Salvataggio.impostazioni().movimentoRidotto; } catch (e) { return false; } };

  /* ---------- particelle ---------- */

  var TIPI = {
    polvere: { colore: [230, 210, 170], vita: 0.8, gravita: -20, dimensione: 6, sfuma: true },
    scintilla: { colore: [255, 170, 60], vita: 1.4, gravita: -60, dimensione: 3, luce: true },
    goccia: { colore: [190, 230, 255], vita: 0.7, gravita: 600, dimensione: 3 },
    foglia: { colore: [110, 160, 90], vita: 3, gravita: 40, dimensione: 7 },
    lucciola: { colore: [230, 255, 140], vita: 4, gravita: 0, dimensione: 2.5, luce: true },
    stella: { colore: [255, 240, 180], vita: 0.9, gravita: 0, dimensione: 5, luce: true },
    fumo: { colore: [180, 180, 190], vita: 2.5, gravita: -40, dimensione: 18, sfuma: true },
    coriandolo: { colore: [255, 255, 255], vita: 2.6, gravita: 520, dimensione: 9 },
    brace: { colore: [255, 120, 40], vita: 0.9, gravita: 300, dimensione: 4, luce: true }
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
        ph: Math.random() * 6,
        col: o.colori ? o.colori[Math.floor(Math.random() * o.colori.length)] : null
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
      if (q.tipo === "coriandolo") { q.vx *= 1 - dt * 1.5; q.vy = Math.min(q.vy, 260); }
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
      ctx.fillStyle = A.rgba(q.col || t.colore, a);
      if (q.tipo === "coriandolo") {
        ctx.save();
        ctx.translate(q.x, q.y);
        ctx.rotate(tempo * 6 + q.ph);
        ctx.scale(1, Math.sin(tempo * 9 + q.ph));
        ctx.fillRect(-q.d / 2, -q.d / 3, q.d, q.d * 0.66);
        ctx.restore();
        return;
      }
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
    telaColore.width = canvas.width;
    telaColore.height = canvas.height;
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

  /* Trasformazione con zoom (intorno al punto fuoco) e scossa. mondo=true: coordinate del mondo */
  function trasforma(c, mondo, profondita) {
    var z = fx.zoom, W = canvas.width, H = canvas.height;
    var px = fx.fuoco ? (fx.fuoco.x - camera.x) * scala : W / 2, py = fx.fuoco ? fx.fuoco.y * scala : H * 0.6;
    var k = profondita === undefined ? 1 : profondita;
    var ox = px * (1 - z) + fx.sx * k * dpr, oy = py * (1 - z) + fx.sy * k * dpr;
    if (mondo) ox -= camera.x * scala * z;
    c.setTransform(scala * z, 0, 0, scala * z, ox, oy);
  }

  function disegna() {
    var p = A.tavolozza(ora.valore);
    var W = canvas.width, H = canvas.height;
    var F = window.Fondale;

    /* ===== tela del MONDO ===== */
    ctx = cw;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    /* cielo: fermo, solo un po' di scossa */
    ctx.setTransform(scala, 0, 0, scala, fx.sx * 0.2 * dpr, fx.sy * 0.2 * dpr);
    A.cielo(ctx, p, vw, tempo);
    A.nuvole(ctx, p, camera.x, vw, tempo);
    /* lontananza: il fondale disegnato dal ragazzo, oppure il paesaggio del codice */
    trasforma(ctx, false, 0.5);
    contorno = inchiostro;
    if (!F.sostituisce("isole")) A.isoleLontane(ctx, p, camera.x, vw);
    if (!F.sostituisce("mare")) A.mare(ctx, p, camera.x, vw, tempo);
    contorno = false;
    F.disegna(ctx, p, ora.valore, camera.x, vw, scena.larghezza);
    contorno = inchiostro;
    if (!F.sostituisce("giungla")) A.giungla(ctx, p, camera.x, vw, tempo);

    /* mondo vicino */
    trasforma(ctx, true);
    A.terreno(ctx, p, camera.x, vw, tempo, scena.larghezza, scena.spiaggiaDa);
    if (scena.disegna) scena.disegna(ctx, p, tempo, camera.x, vw);
    if (attivita && attivita.disegnaMondo) attivita.disegnaMondo(ctx, p, tempo);

    /* primo piano */
    trasforma(ctx, false, 1.4);
    A.primoPiano(ctx, p, camera.x, vw, tempo, scena.larghezza);
    contorno = false;

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
      trasforma(bctx, true);
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
    }

    /* grana della carta e vignetta */
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = inchiostro ? 0.9 : 0.5;
    ctx.fillStyle = ctx.createPattern(carta, "repeat");
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    var agit = window.Battito.agitazione();
    A.vignetta(ctx, W, H, 0.35 + agit * 0.4);

    /* ===== tela del COLORE ===== */
    ctx = cc;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);

    /* bagliore caldo delle luci (fuoco): il colore che scalda il bianco e nero */
    if (forzaBuio > 0.02 || inchiostro) {
      trasforma(ctx, true);
      luci.forEach(function (l) {
        if (!l.colore) return;
        var forza = (l.forza || 1) * (inchiostro ? 0.26 + forzaBuio * 0.1 : 0.22);
        var g2 = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r * 0.8);
        g2.addColorStop(0, A.rgba(l.colore, forza));
        g2.addColorStop(1, A.rgba(l.colore, 0));
        ctx.fillStyle = g2;
        ctx.fillRect(l.x - l.r, l.y - l.r, l.r * 2, l.r * 2);
      });
    }

    /* ciò che va a colori: fuoco, cuore, cose da toccare */
    trasforma(ctx, true);
    if (scena.disegnaColore) scena.disegnaColore(ctx, p, tempo, camera.x, vw);
    if (attivita && attivita.disegnaColore) attivita.disegnaColore(ctx, p, tempo);
    disegnaParticelle();
    disegnaScritte(p);

    /* vista del calore */
    if (termica.mix > 0.01) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "rgba(6,14,48," + (0.86 * termica.mix).toFixed(3) + ")";
      ctx.fillRect(0, 0, W, H);
      trasforma(ctx, true);
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
      /* le cose calde restano visibili anche sopra il velo blu */
      trasforma(ctx, true);
      if (scena.disegnaColore) scena.disegnaColore(ctx, p, tempo, camera.x, vw, true);
    }

    /* onde dei tocchi e lampo */
    ctx.setTransform(scala, 0, 0, scala, 0, 0);
    fx.onde.forEach(function (o) {
      var f = o.t / o.vita;
      ctx.strokeStyle = A.rgba(o.colore, (1 - f) * 0.8);
      ctx.lineWidth = o.spessore * (1 - f) + 1;
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r0 + (o.r - o.r0) * (1 - Math.pow(1 - f, 3)), 0, Math.PI * 2);
      ctx.stroke();
    });
    if (fx.lampo > 0.01) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = A.rgba(fx.lampoCol, Math.min(1, fx.lampo));
      ctx.fillRect(0, 0, W, H);
    }

    /* interfaccia dell'attività, in coordinate dello schermo */
    if (attivita && attivita.disegnaSchermo) {
      ctx.setTransform(scala, 0, 0, scala, 0, 0);
      attivita.disegnaSchermo(ctx, vw, ALTEZZA, p, tempo);
    }
    disegnaSipario();
  }

  /*
   * Contorno a inchiostro: nello stile "inchiostro", ogni forma piena e ben visibile
   * riceve anche un tratto nero, come un disegno a china. Ombre e bagliori (sfumati o trasparenti) no.
   */
  function preparaContorno(c) {
    /* anche i tratti spessi (zampe, tronchi, steli) ricevono un bordo nero sotto */
    var traccia = c.stroke;
    c.stroke = function () {
      if (contorno && !c._inBordo && c.lineWidth >= 5 && c.globalAlpha >= 0.6 && typeof c.strokeStyle === "string" &&
          c.strokeStyle !== "#1d1815" && !(c.strokeStyle.charAt(0) === "r" && parseFloat(c.strokeStyle.split(",")[3]) < 0.6)) {
        var ss = c.strokeStyle, lw = c.lineWidth;
        c.strokeStyle = "#1d1815";
        c.lineWidth = lw + 5;
        traccia.apply(c, arguments);
        c.strokeStyle = ss;
        c.lineWidth = lw;
      }
      traccia.apply(c, arguments);
    };
    var riempi = c.fill;
    c.fill = function () {
      riempi.apply(c, arguments);
      if (!contorno || c.globalAlpha < 0.6 || typeof c.fillStyle !== "string") return;
      var fs = c.fillStyle;
      if (fs.charAt(0) === "r") {
        var a = parseFloat(fs.split(",")[3]);
        if (!isNaN(a) && a < 0.6) return;
      }
      var lw = c.lineWidth, ss = c.strokeStyle, lj = c.lineJoin, ld = c.getLineDash();
      c.setLineDash([]);
      c.lineWidth = 3.4;
      c.lineJoin = "round";
      c.strokeStyle = "#1d1815";
      c._inBordo = true;
      if (arguments.length && typeof arguments[0] === "object") c.stroke(arguments[0]); else c.stroke();
      c._inBordo = false;
      c.lineWidth = lw; c.strokeStyle = ss; c.lineJoin = lj; c.setLineDash(ld);
    };
  }

  /* ---------- scritte che saltano fuori ("PERFETTO!", "+10") ---------- */

  function disegnaScritte() {
    fx.scritte.forEach(function (s) {
      var f = s.t / s.vita;
      var entra = Math.min(1, s.t / 0.18);
      var rimbalzo = entra < 1 ? 0.3 + 0.9 * entra : 1 + Math.sin(Math.min(1, (s.t - 0.18) / 0.25) * Math.PI) * 0.15;
      var a = f > 0.75 ? (1 - f) / 0.25 : 1;
      ctx.save();
      ctx.translate(s.x, s.y - s.t * s.sale);
      ctx.rotate(s.ruota * (1 - entra));
      ctx.scale(rimbalzo, rimbalzo);
      ctx.globalAlpha = a;
      ctx.font = "900 " + s.dim + "px 'Trebuchet MS', 'Arial Rounded MT Bold', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineJoin = "round";
      ctx.lineWidth = s.dim * 0.22;
      ctx.strokeStyle = "rgba(30,20,40,0.85)";
      ctx.strokeText(s.testo, 0, 0);
      var g = ctx.createLinearGradient(0, -s.dim / 2, 0, s.dim / 2);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(0.5, s.colore);
      g.addColorStop(1, s.colore);
      ctx.fillStyle = g;
      ctx.fillText(s.testo, 0, 0);
      ctx.restore();
    });
  }

  /* ---------- sipario tra una tappa e l'altra: un cerchio che si chiude e si riapre ---------- */

  function disegnaSipario() {
    var sp = fx.sipario;
    if (!sp) return;
    var W = canvas.width, H = canvas.height;
    var f = sp.t / sp.durata, aperto;
    if (sp.fase === "chiude") aperto = 1 - f * f;
    else if (sp.fase === "pausa") aperto = 0;
    else aperto = 1 - Math.pow(1 - f, 3);
    var raggio = Math.hypot(W, H) * 0.6 * aperto;
    var cx = sp.x !== undefined ? (sp.x - camera.x) * scala : W / 2, cy = (sp.y !== undefined ? sp.y : 600) * scala;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#0d1020";
    ctx.beginPath();
    ctx.rect(0, 0, W, H);
    ctx.arc(cx, cy, Math.max(0, raggio), 0, Math.PI * 2, true);
    ctx.fill("evenodd");
    if (sp.titolo && (sp.fase === "pausa" || (sp.fase === "chiude" && f > 0.6) || (sp.fase === "apre" && f < 0.4))) {
      var a = sp.fase === "pausa" ? 1 : sp.fase === "chiude" ? (f - 0.6) / 0.4 : 1 - f / 0.4;
      var tp = sp.fase === "pausa" ? sp.t / sp.durata : 0;
      ctx.setTransform(scala, 0, 0, scala, 0, 0);
      ctx.globalAlpha = Math.max(0, a);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#ffd27a";
      ctx.font = "900 150px 'Trebuchet MS', sans-serif";
      ctx.fillText(sp.numero || "", vw / 2, 400 - tp * 10);
      ctx.fillStyle = "#ffffff";
      ctx.font = "700 64px 'Trebuchet MS', sans-serif";
      ctx.fillText(sp.titolo, vw / 2, 560 - tp * 10);
      ctx.globalAlpha = 1;
    }
  }

  function aggiornaEffetti(dt) {
    /* scossa che si smorza */
    if (fx.scossa > 0) {
      fx.scossa = Math.max(0, fx.scossa - dt);
      var forza = fx.scossaMax * (fx.scossa / (fx.scossaDurata || 0.3));
      fx.sx = (Math.random() - 0.5) * 2 * forza;
      fx.sy = (Math.random() - 0.5) * 2 * forza;
    } else { fx.sx = fx.sy = 0; }
    /* zoom: va verso il valore voluto, poi torna a 1 */
    if (fx.zoomT > 0) fx.zoomT -= dt; else fx.zoomA = 1;
    fx.zoom += (fx.zoomA - fx.zoom) * Math.min(1, dt * 7);
    /* rallentatore */
    if (fx.lentoT > 0) { fx.lentoT -= dt; if (fx.lentoT <= 0) fx.lento = 1; }
    fx.lampo = Math.max(0, fx.lampo - dt * 3.2);
    fx.scritte.forEach(function (s) { s.t += dt; });
    fx.scritte = fx.scritte.filter(function (s) { return s.t < s.vita; });
    fx.onde.forEach(function (o) { o.t += dt; });
    fx.onde = fx.onde.filter(function (o) { return o.t < o.vita; });
    var sp = fx.sipario;
    if (sp) {
      sp.t += dt;
      if (sp.t >= sp.durata) {
        sp.t = 0;
        if (sp.fase === "chiude") {
          sp.fase = "pausa"; sp.durata = sp.pausa;
          if (sp.alBuio) sp.alBuio();
          /* attendi: il sipario resta chiuso finché la Promise non si risolve (per esempio il capitolo) */
          if (sp.attendi) {
            sp.durata = Infinity;
            sp.attendi().then(function () { sp.t = 0; sp.fase = "apre"; sp.durata = 0.7; });
          }
        }
        else if (sp.fase === "pausa") { sp.fase = "apre"; sp.durata = 0.7; }
        else { var fatto = sp.fatto; fx.sipario = null; if (fatto) fatto(); }
      }
    }
  }

  function ciclo(adesso) {
    var dtVero = Math.min(0.05, (adesso - (ultimo || adesso)) / 1000);
    ultimo = adesso;
    aggiornaEffetti(dtVero);
    var dt = dtVero * fx.lento;
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
    var px = (e.clientX - r.left) * dpr, py = (e.clientY - r.top) * dpr;
    var sx = px / scala, sy = py / scala;
    /* togli zoom e scossa per sapere dove si è toccato nel mondo */
    var z = fx.zoom, W = canvas.width, H = canvas.height;
    var fxp = fx.fuoco ? (fx.fuoco.x - camera.x) * scala : W / 2, fyp = fx.fuoco ? fx.fuoco.y * scala : H * 0.6;
    var mx = (px - fxp * (1 - z) - fx.sx * dpr) / (scala * z), my = (py - fyp * (1 - z) - fx.sy * dpr) / (scala * z);
    return { sx: sx, sy: sy, wx: mx + camera.x, wy: my };
  }

  function giu(e) {
    if (window.Pannello.aperto()) return;
    window.Suoni.sblocca();
    tocchi.giu = true;
    try { canvas.setPointerCapture(e.pointerId); } catch (x) { /* niente */ }
    var c = coordinate(e);
    onda(c.sx, c.sy, { r: 70, vita: 0.45, colore: [255, 255, 255], spessore: 6 });
    /* le cose del paesaggio rispondono sempre al tocco (solo effetti: non cambiano l'attività) */
    if (scena && scena.tocca) scena.tocca(c.wx, c.wy);
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

  function onda(x, y, o) {
    o = o || {};
    fx.onde.push({ x: x, y: y, t: 0, vita: o.vita || 0.6, r: o.r || 120, r0: o.r0 || 6, colore: o.colore || [255, 240, 200], spessore: o.spessore || 10 });
  }

  window.Mondo = {
    SUOLO: 790,
    prepara: function () {
      canvas = document.getElementById("mondo");
      cw = ctx = canvas.getContext("2d");
      telaColore = document.getElementById("colore");
      cc = telaColore.getContext("2d");
      preparaContorno(cw);
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
    oraAttuale: function () { return ora.t < 1 ? ora.a : ora.valore; },
    termica: function (si) { termica.attiva = !!si; },
    /* stile: "inchiostro" (bianco e nero su carta, colore solo dove conta) oppure "colori" */
    stile: function (nome) {
      inchiostro = nome !== "colori";
      A.inchiostro = inchiostro;
      document.body.classList.toggle("stile-inchiostro", inchiostro);
    },
    inchiostro: function () { return inchiostro; },
    emetti: emetti,

    /* --- effetti --- */
    scuoti: function (forza, durata) {
      if (calmo()) forza *= 0.25;
      if (forza < fx.scossaMax * (fx.scossa / (fx.scossaDurata || 0.3))) return;
      fx.scossaMax = forza; fx.scossa = fx.scossaDurata = durata || 0.3;
    },
    zoom: function (fattore, durata, fuoco) {
      fattore = Math.max(1, fattore); /* sotto 1 si vedrebbero i bordi del mondo */
      if (calmo()) fattore = 1 + (fattore - 1) * 0.3;
      fx.zoomA = fattore; fx.zoomT = durata || 0.4; fx.fuoco = fuoco || null;
    },
    rallenta: function (fattore, durata) { fx.lento = fattore; fx.lentoT = durata; },
    lampo: function (colore, forza) { fx.lampoCol = colore || [255, 255, 255]; fx.lampo = calmo() ? 0.25 : (forza || 0.8); },
    /* scritta grande nel mondo che salta fuori e sale */
    scritta: function (testo, x, y, o) {
      o = o || {};
      fx.scritte.push({ testo: testo, x: x, y: y, t: 0, vita: o.vita || 1.3, dim: o.dim || 64, colore: o.colore || "#ffd27a",
        sale: o.sale === undefined ? 60 : o.sale, ruota: (Math.random() - 0.5) * 0.5 });
    },
    /* onda in coordinate del mondo */
    onda: function (wx, wy, o) { onda(wx - camera.x, wy, o); },
    coriandoli: function (x, y, n) {
      emetti("coriandolo", x, y, n || 60, { vy: -700, dispersione: 900, spazio: 40,
        colori: [[255, 210, 90], [255, 120, 140], [120, 210, 255], [150, 230, 140], [200, 160, 255]] });
    },
    /* sipario: si chiude (con titolo grande al buio) e si riapre. alBuio: cosa fare quando è chiuso */
    sipario: function (o) {
      o = o || {};
      return new Promise(function (r) {
        fx.sipario = { fase: "chiude", t: 0, durata: 0.6, pausa: o.pausa || 1.1, titolo: o.titolo, numero: o.numero,
          x: o.x, y: o.y, alBuio: o.alBuio, attendi: o.attendi, fatto: r };
      });
    },
    aSchermo: function (wx, wy) {
      var z = fx.zoom, W = canvas.width, H = canvas.height;
      var fxp = fx.fuoco ? (fx.fuoco.x - camera.x) * scala : W / 2, fyp = fx.fuoco ? fx.fuoco.y * scala : H * 0.6;
      return { x: (fxp * (1 - z) + fx.sx * dpr + (wx - camera.x) * scala * z) / dpr, y: (fyp * (1 - z) + fx.sy * dpr + wy * scala * z) / dpr };
    }
  };
})();
