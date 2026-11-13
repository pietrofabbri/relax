/*
 * Il mondo: disegno, personaggi, tocchi.
 * Coordinate del mondo: altezza fissa 1000 unità, larghezza decisa dalla scena.
 * Lo stile "carta e inchiostro" è disegnato dal codice in modo provvisorio:
 * quando arriveranno le scansioni dei disegni del ragazzo, basterà indicare
 * l'immagine nella scena (campo "sfondo") e verrà usata al posto del disegno.
 */
(function () {
  "use strict";

  var ALTEZZA = 1000;
  var SUOLO = 720;               /* la linea del sentiero */
  var INCHIOSTRO = "#2b2622";

  var canvas, ctx, dpr = 1, scala = 1;
  var larghezzaVista = 1000;
  var camera = { x: 0 };
  var scena = null;
  var carta = null;              /* motivo della carta, generato una volta */
  var tempo = 0;
  var ultimo = 0;
  var callbackTocco = null;

  var guardiano = { x: 200, dest: 200, vel: 430, verso: 1, passo: 0, tiene: null, attesa: null };
  var cerva = { x: 380, dest: 380, vel: 260, verso: 1, passo: 0, stato: "ferma", visibile: true };

  /* ---------- utilità ---------- */

  /* Generatore pseudo-casuale con seme: i disegni restano uguali a ogni fotogramma. */
  function casuale(seme) {
    var s = seme % 2147483647;
    if (s <= 0) s += 2147483646;
    return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }

  function tratto(punti, spessore, colore) {
    ctx.beginPath();
    ctx.moveTo(punti[0][0], punti[0][1]);
    for (var i = 1; i < punti.length; i++) ctx.lineTo(punti[i][0], punti[i][1]);
    ctx.lineWidth = spessore || 4;
    ctx.strokeStyle = colore || INCHIOSTRO;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  }

  function ellisse(x, y, rx, ry, riempi, contorno, spessore) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    if (riempi) { ctx.fillStyle = riempi; ctx.fill(); }
    if (contorno !== false) { ctx.lineWidth = spessore || 4; ctx.strokeStyle = INCHIOSTRO; ctx.stroke(); }
  }

  function preparaCarta() {
    var c = document.createElement("canvas");
    c.width = c.height = 256;
    var g = c.getContext("2d");
    g.fillStyle = "#f3ecdf";
    g.fillRect(0, 0, 256, 256);
    var r = casuale(7);
    for (var i = 0; i < 2600; i++) {
      var a = r() * 0.06;
      g.fillStyle = "rgba(90,70,50," + a.toFixed(3) + ")";
      g.fillRect(r() * 256, r() * 256, 1 + r() * 1.5, 1 + r() * 1.5);
    }
    return c;
  }

  /* ---------- disegni degli elementi ---------- */

  var Disegni = {
    roccia: function (x, y, l, a) {
      ctx.beginPath();
      ctx.moveTo(x - l / 2, y);
      ctx.quadraticCurveTo(x - l / 2 + 10, y - a, x, y - a - 10);
      ctx.quadraticCurveTo(x + l / 2 - 5, y - a + 15, x + l / 2, y);
      ctx.closePath();
      ctx.fillStyle = "#cbbfa8";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = INCHIOSTRO;
      ctx.stroke();
    },
    cespuglio: function (x, y, s) {
      for (var i = -1; i <= 1; i++) ellisse(x + i * 34 * s, y - 30 * s - (i === 0 ? 14 * s : 0), 40 * s, 32 * s, "#7c9a5e");
    },
    palma: function (x, y, alta, cocchi) {
      ctx.beginPath();
      ctx.moveTo(x - 12, y);
      ctx.quadraticCurveTo(x - 40, y - alta / 2, x + 20, y - alta);
      ctx.lineTo(x + 34, y - alta + 4);
      ctx.quadraticCurveTo(x - 20, y - alta / 2, x + 14, y);
      ctx.closePath();
      ctx.fillStyle = "#a88a62";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = INCHIOSTRO;
      ctx.stroke();
      var cx = x + 26, cy = y - alta;
      var foglie = [[-150, -10], [-110, -60], [-30, -90], [60, -75], [140, -20], [110, 40], [-120, 45]];
      foglie.forEach(function (f) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.quadraticCurveTo(cx + f[0] * 0.5, cy + f[1] - 40, cx + f[0], cy + f[1]);
        ctx.quadraticCurveTo(cx + f[0] * 0.55, cy + f[1] * 0.4 - 10, cx, cy);
        ctx.fillStyle = "#6f8f4e";
        ctx.fill();
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = INCHIOSTRO;
        ctx.stroke();
      });
      if (cocchi) {
        ellisse(cx - 12, cy + 22, 16, 16, "#7a5636");
        ellisse(cx + 16, cy + 26, 16, 16, "#7a5636");
      }
    },
    cocco: function (x, y) { ellisse(x, y, 17, 17, "#7a5636"); },
    rifugio: function (x, y) {
      Disegni.roccia(x, y, 380, 230);
      ctx.beginPath();
      ctx.moveTo(x - 70, y);
      ctx.quadraticCurveTo(x - 60, y - 120, x, y - 125);
      ctx.quadraticCurveTo(x + 60, y - 120, x + 70, y);
      ctx.closePath();
      ctx.fillStyle = "#5b4d40";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = INCHIOSTRO;
      ctx.stroke();
    },
    grotta: function (x, y, accesa) {
      Disegni.roccia(x, y, 560, 330);
      ctx.beginPath();
      ctx.moveTo(x - 120, y);
      ctx.quadraticCurveTo(x - 110, y - 200, x, y - 210);
      ctx.quadraticCurveTo(x + 110, y - 200, x + 120, y);
      ctx.closePath();
      if (accesa) {
        var g = ctx.createRadialGradient(x, y - 60, 10, x, y - 60, 170);
        g.addColorStop(0, "#ffd99a");
        g.addColorStop(1, "#8a5a3a");
        ctx.fillStyle = g;
      } else {
        ctx.fillStyle = "#3d342c";
      }
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = INCHIOSTRO;
      ctx.stroke();
      if (accesa) Disegni.fiamma(x, y - 8, 1.1);
    },
    canne: function (x, y, fuoco) {
      var r = casuale(42);
      for (var i = 0; i < 16; i++) {
        var cx = x - 120 + i * 16 + r() * 8;
        var h = 140 + r() * 90;
        tratto([[cx, y], [cx + 6, y - h]], 4, "#5d6b3a");
        tratto([[cx + 6, y - h], [cx + 22, y - h - 14]], 3, "#5d6b3a");
      }
      if (fuoco) {
        Disegni.fiamma(x - 40, y - 20, 1.6);
        Disegni.fiamma(x + 30, y - 10, 1.3);
      }
    },
    fiamma: function (x, y, s) {
      var t = tempo;
      var o = Math.sin(t * 9 + x) * 6 * s;
      ctx.beginPath();
      ctx.moveTo(x - 26 * s, y);
      ctx.quadraticCurveTo(x - 30 * s, y - 50 * s, x + o, y - 90 * s);
      ctx.quadraticCurveTo(x + 30 * s, y - 50 * s, x + 26 * s, y);
      ctx.closePath();
      ctx.fillStyle = "#e0782f";
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = INCHIOSTRO;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 12 * s, y);
      ctx.quadraticCurveTo(x - 12 * s, y - 30 * s, x + o * 0.6, y - 52 * s);
      ctx.quadraticCurveTo(x + 12 * s, y - 30 * s, x + 12 * s, y);
      ctx.closePath();
      ctx.fillStyle = "#f6c453";
      ctx.fill();
    },
    barca: function (x, y) {
      ctx.beginPath();
      ctx.moveTo(x - 110, y - 40);
      ctx.lineTo(x + 110, y - 40);
      ctx.quadraticCurveTo(x + 80, y + 10, x, y + 10);
      ctx.quadraticCurveTo(x - 80, y + 10, x - 110, y - 40);
      ctx.fillStyle = "#9b7350";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = INCHIOSTRO;
      ctx.stroke();
      tratto([[x, y - 40], [x, y - 190]], 4);
      ctx.beginPath();
      ctx.moveTo(x + 4, y - 185);
      ctx.quadraticCurveTo(x + 80, y - 120, x + 4, y - 60);
      ctx.closePath();
      ctx.fillStyle = "#efe5d0";
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.stroke();
    },
    sasso: function (x, y) { ellisse(x, y - 22, 46, 26, "#a9a091"); },

    /* --- animali --- */
    capra: function (x, y, verso) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(verso || 1, 1);
      ellisse(0, -70, 60, 34, "#e9e1d2");
      tratto([[-40, -45], [-44, 0]], 6);
      tratto([[-18, -42], [-16, 0]], 6);
      tratto([[22, -42], [24, 0]], 6);
      tratto([[42, -46], [40, 0]], 6);
      tratto([[50, -90], [74, -128]], 10, "#e9e1d2");
      tratto([[50, -90], [74, -128]], 4);
      ellisse(84, -132, 24, 16, "#e9e1d2");
      tratto([[84, -146], [70, -176], [56, -184]], 5);
      tratto([[94, -146], [92, -178], [80, -190]], 5);
      tratto([[90, -118], [94, -100]], 3);
      ellisse(90, -136, 2.5, 2.5, INCHIOSTRO, false);
      tratto([[-58, -78], [-72, -92]], 4);
      ctx.restore();
    },
    uccello: function (x, y) {
      var b = Math.sin(tempo * 3) * 3;
      ellisse(x, y - 20 + b, 34, 22, "#c8d2d8");
      ellisse(x + 30, y - 42 + b, 16, 15, "#c8d2d8");
      ctx.beginPath();
      ctx.moveTo(x + 44, y - 44 + b);
      ctx.lineTo(x + 64, y - 38 + b);
      ctx.lineTo(x + 44, y - 34 + b);
      ctx.closePath();
      ctx.fillStyle = "#d39a3a";
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = INCHIOSTRO;
      ctx.stroke();
      ellisse(x + 33, y - 46 + b, 2.5, 2.5, INCHIOSTRO, false);
      tratto([[x - 10, y - 26 + b], [x - 40, y - 54 + b], [x - 56, y - 34 + b]], 3.5);
      tratto([[x - 2, y + 2 + b], [x - 4, y + 18]], 3);
      tratto([[x + 10, y + 2 + b], [x + 10, y + 18]], 3);
    },
    tartaruga: function (x, y) {
      ctx.beginPath();
      ctx.moveTo(x - 60, y - 6);
      ctx.quadraticCurveTo(x, y - 90, x + 60, y - 6);
      ctx.closePath();
      ctx.fillStyle = "#7f8f56";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = INCHIOSTRO;
      ctx.stroke();
      tratto([[x - 30, y - 30], [x, y - 52], [x + 30, y - 30]], 3);
      tratto([[x, y - 52], [x, y - 10]], 3);
      var t = Math.sin(tempo * 1.5) * 4;
      ellisse(x + 74 + t, y - 18, 16, 12, "#a7b07a");
      ellisse(x - 44, y - 2, 12, 7, "#a7b07a");
      ellisse(x + 40, y - 2, 12, 7, "#a7b07a");
    },
    cerva: function (c) {
      ctx.save();
      ctx.translate(c.x, SUOLO + 10);
      ctx.scale(c.verso, 1);
      if (c.stato === "sdraiata") {
        ellisse(0, -26, 74, 26, "#c79a6b");
        tratto([[50, -40], [86, -66]], 10, "#c79a6b");
        tratto([[50, -40], [86, -66]], 4);
        ellisse(98, -70, 22, 14, "#c79a6b");
        tratto([[92, -82], [86, -100]], 4);
      } else {
        var m = c.stato === "cammina" ? Math.sin(c.passo) * 14 : 0;
        ellisse(0, -100, 70, 32, "#c79a6b");
        tratto([[-46, -78], [-46 + m, -4]], 6);
        tratto([[-24, -74], [-24 - m, -4]], 6);
        tratto([[30, -74], [30 - m, -4]], 6);
        tratto([[50, -78], [50 + m, -4]], 6);
        tratto([[52, -118], [80, -170]], 12, "#c79a6b");
        tratto([[52, -118], [80, -170]], 4);
        ellisse(94, -176, 26, 16, "#c79a6b");
        tratto([[84, -190], [78, -214]], 4);
        tratto([[94, -190], [96, -214]], 4);
        ellisse(100, -180, 2.5, 2.5, INCHIOSTRO, false);
        tratto([[-70, -108], [-82, -120]], 4);
      }
      ctx.restore();
    },
    /* Il Guardiano: una sagoma a inchiostro, senza età, genere o cultura. */
    persona: function (x, verso, passo, camminando, tiene, colore) {
      ctx.save();
      ctx.translate(x, SUOLO + 10);
      ctx.scale(verso, 1);
      var m = camminando ? Math.sin(passo) * 22 : 12;
      var b = camminando ? Math.abs(Math.sin(passo)) * 4 : 0;
      /* alone color carta: la sagoma resta visibile anche davanti a una grotta buia */
      ctx.shadowColor = "rgba(243,236,223,0.95)";
      ctx.shadowBlur = 10;
      tratto([[0, -90 - b], [-m * 0.6, -45], [-m, -2]], 7);
      tratto([[0, -90 - b], [m * 0.6, -45], [m, -2]], 7);
      ctx.beginPath();
      ctx.moveTo(-26, -92 - b);
      ctx.quadraticCurveTo(-30, -150 - b, 0, -160 - b);
      ctx.quadraticCurveTo(30, -150 - b, 26, -92 - b);
      ctx.closePath();
      ctx.fillStyle = colore || INCHIOSTRO;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = INCHIOSTRO;
      ctx.stroke();
      ellisse(0, -186 - b, 24, 24, colore || INCHIOSTRO);
      if (tiene === "fuoco" || tiene === "bastone") {
        tratto([[14, -140 - b], [44, -150 - b], [62, -200 - b]], 6, "#7a5636");
        if (tiene === "fuoco") Disegni.fiamma(64, -200 - b, 0.55);
      } else {
        tratto([[16, -146 - b], [26 - m * 0.3, -110 - b]], 6);
      }
      tratto([[-16, -146 - b], [-26 + m * 0.3, -110 - b]], 6);
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
      ctx.restore();
    },
    domanda: function (x, y) {
      var b = Math.sin(tempo * 3 + x) * 5;
      ellisse(x, y + b, 30, 30, "#fff7e6", true, 4);
      ctx.fillStyle = INCHIOSTRO;
      ctx.font = "bold 40px Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("?", x, y + b + 2);
    }
  };

  /* ---------- sfondo ---------- */

  function disegnaSfondo(W) {
    /* carta */
    var motivo = ctx.createPattern(carta, "repeat");
    ctx.fillStyle = motivo;
    ctx.fillRect(camera.x - 10, 0, larghezzaVista + 20, ALTEZZA);

    /* immagine del ragazzo, se presente */
    if (scena.immagine && scena.immagine.complete && scena.immagine.naturalWidth) {
      var img = scena.immagine;
      var l = img.naturalWidth * (ALTEZZA / img.naturalHeight);
      for (var x0 = 0; x0 < W; x0 += l) ctx.drawImage(img, x0, 0, l, ALTEZZA);
      return;
    }

    /* cielo: acquerello leggero */
    var cielo = ctx.createLinearGradient(0, 0, 0, 470);
    cielo.addColorStop(0, "rgba(140,180,200,0.35)");
    cielo.addColorStop(1, "rgba(200,220,215,0.15)");
    ctx.fillStyle = cielo;
    ctx.fillRect(camera.x - 10, 0, larghezzaVista + 20, 470);

    /* sole */
    ellisse(camera.x * 0.85 + 260, 130, 48, 48, "rgba(246,196,83,0.85)", true, 3);

    /* nuvole, con parallasse */
    var r = casuale(11);
    for (var i = 0; i < 9; i++) {
      var nx = i * 520 + r() * 200 + camera.x * 0.4;
      var ny = 90 + r() * 120;
      ellisse(nx, ny, 70, 20, "rgba(255,255,255,0.7)", true, 2.5);
      ellisse(nx + 50, ny - 12, 46, 18, "rgba(255,255,255,0.7)", true, 2.5);
    }

    /* mare */
    ctx.fillStyle = "rgba(77,140,150,0.45)";
    ctx.fillRect(camera.x - 10, 470, larghezzaVista + 20, 110);
    tratto([[camera.x - 10, 470], [camera.x + larghezzaVista + 10, 470]], 3);
    for (var o = 0; o < 26; o++) {
      var ox = Math.floor(camera.x / 180) * 180 + o * 90 + ((o % 2) * 40);
      var oy = 500 + (o % 3) * 24;
      var s = Math.sin(tempo * 1.2 + o) * 6;
      tratto([[ox + s, oy], [ox + 18 + s, oy - 8], [ox + 36 + s, oy]], 2.5, "rgba(43,38,34,0.6)");
    }

    /* terra dell'isola */
    ctx.beginPath();
    ctx.moveTo(camera.x - 10, 580);
    for (var x = Math.floor(camera.x / 60) * 60 - 60; x <= camera.x + larghezzaVista + 60; x += 60) {
      ctx.lineTo(x, 575 + Math.sin(x * 0.01) * 10);
    }
    ctx.lineTo(camera.x + larghezzaVista + 10, ALTEZZA);
    ctx.lineTo(camera.x - 10, ALTEZZA);
    ctx.closePath();
    ctx.fillStyle = "rgba(196,178,120,0.55)";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = INCHIOSTRO;
    ctx.stroke();

    /* spiaggia in fondo all'isola */
    if (scena.spiaggiaDa) {
      ctx.fillStyle = "rgba(236,214,160,0.75)";
      ctx.fillRect(scena.spiaggiaDa, 576, W - scena.spiaggiaDa, ALTEZZA - 576);
    }

    /* sentiero */
    ctx.fillStyle = "rgba(230,214,170,0.75)";
    ctx.fillRect(camera.x - 10, SUOLO - 18, larghezzaVista + 20, 54);
    ctx.setLineDash([22, 18]);
    tratto([[camera.x - 10, SUOLO - 18], [camera.x + larghezzaVista + 10, SUOLO - 18]], 2.5, "rgba(43,38,34,0.45)");
    tratto([[camera.x - 10, SUOLO + 36], [camera.x + larghezzaVista + 10, SUOLO + 36]], 2.5, "rgba(43,38,34,0.45)");
    ctx.setLineDash([]);

    /* erba in primo piano */
    var re = casuale(99);
    for (var e = 0; e < 70; e++) {
      var ex = re() * W;
      if (ex < camera.x - 40 || ex > camera.x + larghezzaVista + 40) continue;
      var ey = 820 + re() * 150;
      tratto([[ex, ey], [ex - 6, ey - 26]], 3, "rgba(80,100,50,0.8)");
      tratto([[ex + 6, ey], [ex + 10, ey - 22]], 3, "rgba(80,100,50,0.8)");
    }
  }

  /* ---------- ciclo principale ---------- */

  function ridimensiona() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    scala = canvas.height / ALTEZZA;
    larghezzaVista = canvas.width / scala;
    var ruota = document.getElementById("ruota");
    if (ruota) {
      ruota.textContent = window.TESTI.gioco.ruota;
      ruota.classList.toggle("nascosto", window.innerWidth >= window.innerHeight || !scena);
    }
  }

  function aggiornaPersonaggio(p, dt) {
    var diff = p.dest - p.x;
    if (Math.abs(diff) > 2) {
      var s = Math.sign(diff) * Math.min(Math.abs(diff), p.vel * dt);
      p.x += s;
      p.verso = Math.sign(diff);
      p.passo += dt * 9;
      return true;
    }
    p.x = p.dest;
    return false;
  }

  function ciclo(adesso) {
    var dt = Math.min(0.05, (adesso - (ultimo || adesso)) / 1000);
    ultimo = adesso;
    tempo += dt;

    window.Battito.passo(dt, adesso);

    if (scena) {
      var W = scena.larghezza;
      var cammina = aggiornaPersonaggio(guardiano, dt);
      guardiano.camminando = cammina;
      if (!cammina && guardiano.attesa) { var a = guardiano.attesa; guardiano.attesa = null; a(); }
      var cervaCammina = aggiornaPersonaggio(cerva, dt);
      if (cerva.stato !== "sdraiata") cerva.stato = cervaCammina ? "cammina" : "ferma";
      if (!cervaCammina && cerva.attesa) { var ac = cerva.attesa; cerva.attesa = null; ac(); }

      /* camera: segue il Guardiano */
      var obiettivo = guardiano.x - larghezzaVista * 0.4;
      obiettivo = Math.max(0, Math.min(W - larghezzaVista, obiettivo));
      if (W < larghezzaVista) obiettivo = (W - larghezzaVista) / 2;
      camera.x += (obiettivo - camera.x) * Math.min(1, dt * 4);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      var tremito = 0;
      var agit = window.Battito.agitazione();
      if (agit > 0.35 && !window.Salvataggio.impostazioni().movimentoRidotto) {
        tremito = Math.sin(tempo * 40) * agit * 4;
      }
      ctx.setTransform(scala, 0, 0, scala, (-camera.x + tremito) * scala, 0);

      disegnaSfondo(W);

      /* oggetti dietro ai personaggi */
      scena.oggetti.forEach(function (o) {
        if (o.visibile === false) return;
        if (o.disegna) o.disegna(Disegni, o, tempo);
      });

      if (cerva.visibile) Disegni.cerva(cerva);
      Disegni.persona(guardiano.x, guardiano.verso, guardiano.passo, guardiano.camminando, guardiano.tiene);

      scena.oggetti.forEach(function (o) {
        if (o.visibile !== false && o.attivo && o.domanda) Disegni.domanda(o.x, (o.yDomanda || SUOLO - 260));
      });

      if (scena.extra) scena.extra(ctx, Disegni, tempo);

      /* vignetta: più il battito è alto, più si stringe la luce */
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      var buio = scena.buio ? scena.buio() : 0;
      var forza = Math.max(agit * 0.55, buio);
      if (forza > 0.01) {
        var cx = canvas.width / 2, cy = canvas.height * 0.6;
        var g = ctx.createRadialGradient(cx, cy, canvas.height * 0.25, cx, cy, Math.max(canvas.width, canvas.height) * 0.75);
        g.addColorStop(0, "rgba(30,25,20,0)");
        g.addColorStop(1, "rgba(30,25,20," + forza.toFixed(3) + ")");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }

    window.requestAnimationFrame(ciclo);
  }

  /* ---------- tocchi ---------- */

  function alTocco(e) {
    if (!scena || window.Pannello.aperto()) return;
    window.Suoni.sblocca();
    var r = canvas.getBoundingClientRect();
    var sx = (e.clientX - r.left) * dpr;
    var sy = (e.clientY - r.top) * dpr;
    var wx = sx / scala + camera.x;
    var wy = sy / scala;
    if (callbackTocco) callbackTocco(wx, wy);
  }

  window.Mondo = {
    SUOLO: SUOLO,
    prepara: function () {
      canvas = document.getElementById("mondo");
      ctx = canvas.getContext("2d");
      carta = preparaCarta();
      ridimensiona();
      window.addEventListener("resize", ridimensiona);
      canvas.addEventListener("pointerdown", alTocco);
      window.requestAnimationFrame(ciclo);
    },
    caricaScena: function (s) {
      scena = s;
      if (s.sfondo) {
        var img = new Image();
        img.onerror = function () { scena.immagine = null; };
        img.src = s.sfondo;
        s.immagine = img;
      }
      ridimensiona();
    },
    scena: function () { return scena; },
    alTocco: function (fn) { callbackTocco = fn; },
    guardiano: guardiano,
    cerva: cerva,
    camera: camera,
    larghezzaVista: function () { return larghezzaVista; },
    /* Muove un personaggio e risolve quando arriva. */
    vai: function (personaggio, x) {
      return new Promise(function (risolvi) {
        personaggio.dest = x;
        personaggio.attesa = risolvi;
      });
    },
    /* Posizione sullo schermo (in pixel CSS) di un punto del mondo: serve ai test. */
    aSchermo: function (wx, wy) {
      return { x: (wx - camera.x) * scala / dpr, y: wy * scala / dpr };
    }
  };
})();
