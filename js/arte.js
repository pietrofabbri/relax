/*
 * Arte: tutto ciò che si disegna.
 * Stile: paesaggio a strati in profondità (parallasse), luce che cambia con l'ora del giorno,
 * personaggi a sagoma con luce sul bordo. Nessuna immagine esterna: tutto è disegnato dal codice,
 * finché non arriveranno le scansioni dei disegni del ragazzo.
 */
(function () {
  "use strict";

  /* ---------- colori ---------- */

  function hex(h) {
    var n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function mescola(a, b, t) {
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  }
  function rgba(c, a) {
    return "rgba(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + "," + (a === undefined ? 1 : a) + ")";
  }

  /* Quattro momenti della giornata: alba, giorno, tramonto, notte. */
  var INCHIOSTRO = "#1d1815";

  var MOMENTI = [
    { cieloAlto: "#2d3e6b", cieloMezzo: "#c27d8c", cieloBasso: "#f7c38c", sole: "#ffd59a", soleY: 430,
      mareAlto: "#3d5d80", mareBasso: "#d39581", lontano: "#7d7395", medio: "#3f5560", medioScuro: "#2c3d48",
      sabbia: "#e0b48e", terra: "#b98863", primoPiano: "#16232a", bordo: "#ffd4a3", pelle: "#2e2320", notte: 0 },
    { cieloAlto: "#3a8cc4", cieloMezzo: "#8cc8df", cieloBasso: "#f3ecd4", sole: "#fff4c8", soleY: 140,
      mareAlto: "#2c8aa0", mareBasso: "#86d4c8", lontano: "#95bcc0", medio: "#4f8c6c", medioScuro: "#356b52",
      sabbia: "#f2dba8", terra: "#d6b27a", primoPiano: "#1d3a30", bordo: "#fff6d8", pelle: "#33261f", notte: 0 },
    { cieloAlto: "#363d78", cieloMezzo: "#de7a6a", cieloBasso: "#ffc579", sole: "#ffb25a", soleY: 420,
      mareAlto: "#3b4c7b", mareBasso: "#e69c70", lontano: "#8d6c88", medio: "#3a4b58", medioScuro: "#283545",
      sabbia: "#dba27b", terra: "#a8735a", primoPiano: "#151b28", bordo: "#ffb880", pelle: "#2a1f1d", notte: 0.15 },
    { cieloAlto: "#070d24", cieloMezzo: "#16224a", cieloBasso: "#34396a", sole: "#e3ecff", soleY: 120,
      mareAlto: "#0c1a36", mareBasso: "#26385e", lontano: "#1b2546", medio: "#111b2c", medioScuro: "#0b1320",
      sabbia: "#4d5170", terra: "#353851", primoPiano: "#05080f", bordo: "#a9bcff", pelle: "#16131a", notte: 1 }
  ];
  var CHIAVI = Object.keys(MOMENTI[0]);

  MOMENTI.push(MOMENTI[0]); /* dopo la notte torna l'alba */

  /* t: 0 alba, 1 giorno, 2 tramonto, 3 notte, 4 di nuovo alba (valori intermedi sfumano) */
  function tavolozza(t) {
    var i = Math.max(0, Math.min(3, Math.floor(t)));
    var f = Math.max(0, Math.min(1, t - i));
    var a = MOMENTI[i], b = MOMENTI[i + 1], p = {};
    CHIAVI.forEach(function (k) {
      if (typeof a[k] === "number") p[k] = a[k] + (b[k] - a[k]) * f;
      else p[k] = mescola(hex(a[k]), hex(b[k]), f);
    });
    return p;
  }

  /* ---------- utilità ---------- */

  function casuale(seme) {
    var s = seme % 2147483647;
    if (s <= 0) s += 2147483646;
    return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }

  /* colline morbide e ripetibili */
  function profilo(x, seme, ampiezza) {
    return Math.sin(x * 0.0021 + seme) * ampiezza * 0.55 +
      Math.sin(x * 0.0053 + seme * 2.1) * ampiezza * 0.3 +
      Math.sin(x * 0.013 + seme * 0.7) * ampiezza * 0.15;
  }

  /* spessore in più per il contorno a inchiostro (si disegna prima in nero, più grosso) */
  var extra = 0;

  function capsula(ctx, x1, y1, x2, y2, spessore, colore) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = spessore + extra;
    ctx.lineCap = "round";
    ctx.strokeStyle = colore;
    ctx.stroke();
  }

  /* arto a due segmenti: anca/spalla -> ginocchio/gomito -> piede/mano */
  function puntoArto(x, y, a1, l1, a2, l2) {
    var x1 = x + Math.sin(a1) * l1, y1 = y + Math.cos(a1) * l1;
    return [x1, y1, x1 + Math.sin(a1 + a2) * l2, y1 + Math.cos(a1 + a2) * l2];
  }

  function arto(ctx, x, y, a1, l1, a2, l2, spessore, colore) {
    var q = puntoArto(x, y, a1, l1, a2, l2), x1 = q[0], y1 = q[1], x2 = q[2], y2 = q[3];
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = spessore + extra;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = colore;
    ctx.stroke();
    return [x2, y2];
  }

  function ombra(ctx, x, y, larghezza, alfa) {
    var g = ctx.createRadialGradient(x, y, 0, x, y, larghezza);
    g.addColorStop(0, "rgba(10,15,20," + (alfa || 0.28) + ")");
    g.addColorStop(1, "rgba(10,15,20,0)");
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, 0.22);
    ctx.translate(-x, -y);
    ctx.fillStyle = g;
    ctx.fillRect(x - larghezza, y - larghezza, larghezza * 2, larghezza * 2);
    ctx.restore();
  }

  /* ---------- cielo e paesaggio ---------- */

  var stelle = (function () {
    var r = casuale(5), l = [];
    for (var i = 0; i < 140; i++) l.push([r(), r() * 0.55, 0.5 + r() * 1.6, r() * 6]);
    return l;
  })();

  var Arte = {
    tavolozza: tavolozza,
    rgba: rgba,
    mescola: mescola,
    hex: hex,
    casuale: casuale,
    ombra: ombra,

    /* in coordinate dello schermo (già scalate): larghezza vista vw, altezza 1000 */
    cielo: function (ctx, p, vw, tempo) {
      var g = ctx.createLinearGradient(0, 0, 0, 560);
      g.addColorStop(0, rgba(p.cieloAlto));
      g.addColorStop(0.55, rgba(p.cieloMezzo));
      g.addColorStop(1, rgba(p.cieloBasso));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, vw, 560);

      if (p.notte > 0.05) {
        stelle.forEach(function (s) {
          var a = p.notte * (0.45 + 0.55 * Math.sin(tempo * 1.3 + s[3]) * 0.5 + 0.25);
          ctx.fillStyle = "rgba(235,240,255," + Math.max(0, a).toFixed(3) + ")";
          ctx.fillRect(s[0] * vw, s[1] * 1000, s[2], s[2]);
        });
      }

      /* sole (o luna) con alone */
      var sx = vw * 0.72, sy = p.soleY;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      var a = ctx.createRadialGradient(sx, sy, 10, sx, sy, 420);
      a.addColorStop(0, rgba(p.sole, 0.55 * (1 - p.notte * 0.6)));
      a.addColorStop(0.25, rgba(p.sole, 0.18 * (1 - p.notte * 0.6)));
      a.addColorStop(1, rgba(p.sole, 0));
      ctx.fillStyle = a;
      ctx.fillRect(sx - 420, sy - 420, 840, 840);
      ctx.restore();
      ctx.beginPath();
      ctx.arc(sx, sy, p.notte > 0.5 ? 34 : 46, 0, Math.PI * 2);
      ctx.fillStyle = rgba(p.sole, 0.95);
      ctx.fill();
      if (p.notte > 0.5) {
        ctx.beginPath();
        ctx.arc(sx + 14, sy - 8, 30, 0, Math.PI * 2);
        ctx.fillStyle = rgba(p.cieloAlto, p.notte);
        ctx.fill();
      }
    },

    nuvole: function (ctx, p, camX, vw, tempo) {
      var r = casuale(17);
      var off = camX * 0.08 + tempo * 6;
      for (var i = 0; i < 12; i++) {
        var base = r() * 5200, y = 70 + r() * 260, l = 160 + r() * 220;
        var x = ((base - off) % 5200 + 5200) % 5200 - 400;
        if (x > vw + 300) continue;
        var c = mescola(p.cieloBasso, [255, 255, 255], 0.6);
        for (var k = 0; k < 4; k++) {
          var cx = x + k * l * 0.28, cy = y - Math.sin(k * 1.3) * 18, rr = l * (0.35 - Math.abs(k - 1.5) * 0.05);
          var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr);
          g.addColorStop(0, rgba(c, 0.42 * (1 - p.notte * 0.7)));
          g.addColorStop(1, rgba(c, 0));
          ctx.fillStyle = g;
          ctx.fillRect(cx - rr, cy - rr, rr * 2, rr * 2);
        }
      }
    },

    isoleLontane: function (ctx, p, camX, vw) {
      var off = camX * 0.18;
      ctx.fillStyle = rgba(p.lontano, 0.85);
      ctx.beginPath();
      ctx.moveTo(0, 525);
      for (var x = 0; x <= vw + 20; x += 20) {
        var w = x + off;
        var h = Math.max(0, profilo(w, 3.1, 70) + 20) * (0.5 + 0.5 * Math.sin(w * 0.0009));
        ctx.lineTo(x, 525 - h);
      }
      ctx.lineTo(vw + 20, 530);
      ctx.lineTo(0, 530);
      ctx.closePath();
      ctx.fill();
    },

    mare: function (ctx, p, camX, vw, tempo) {
      var g = ctx.createLinearGradient(0, 520, 0, 650);
      g.addColorStop(0, rgba(p.mareAlto));
      g.addColorStop(1, rgba(p.mareBasso));
      ctx.fillStyle = g;
      ctx.fillRect(0, 520, vw, 140);
      /* riflesso del sole */
      var sx = vw * 0.72;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (var i = 0; i < 26; i++) {
        var y = 528 + i * 4.6;
        var w = (60 - i * 1.6) * (0.6 + 0.4 * Math.sin(tempo * 2 + i));
        ctx.fillStyle = rgba(p.sole, 0.22 * (1 - i / 30));
        ctx.fillRect(sx - w / 2 + Math.sin(tempo * 1.5 + i * 0.7) * 6, y, w, 2);
      }
      /* scintillii */
      var r = casuale(23), off = camX * 0.35;
      for (var k = 0; k < 70; k++) {
        var bx = r() * 3000, by = 530 + r() * 110;
        var x = ((bx - off) % 3000 + 3000) % 3000 - 100;
        if (x > vw) continue;
        var a = Math.max(0, Math.sin(tempo * 2.2 + k)) * 0.35;
        ctx.fillStyle = rgba(p.bordo, a);
        ctx.fillRect(x, by, 14 + (by - 530) * 0.2, 1.6);
      }
      ctx.restore();
    },

    /* collina con la giungla: parallasse 0.5 */
    giungla: function (ctx, p, camX, vw, tempo) {
      var off = camX * 0.5;
      ctx.fillStyle = rgba(p.medio);
      ctx.beginPath();
      ctx.moveTo(0, 640);
      for (var x = -20; x <= vw + 20; x += 18) {
        var w = x + off;
        ctx.lineTo(x, 585 - Math.max(0, profilo(w, 1.7, 90) + 25));
      }
      ctx.lineTo(vw + 20, 640);
      ctx.closePath();
      ctx.fill();
      /* palme lontane, sagome */
      var r = casuale(31);
      for (var i = 0; i < 30; i++) {
        var bw = r() * 6000, alt = 90 + r() * 80;
        var x2 = bw - off;
        if (x2 < -150 || x2 > vw + 150) continue;
        var base = 585 - Math.max(0, profilo(bw, 1.7, 90) + 25) + 8;
        Arte.palmaSagoma(ctx, x2, base, alt, rgba(p.medioScuro), tempo, r() * 6);
      }
    },

    palmaSagoma: function (ctx, x, y, alt, colore, tempo, fase) {
      var sway = Math.sin(tempo * 0.8 + fase) * 4;
      ctx.strokeStyle = colore;
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x - 12, y - alt * 0.5, x + sway, y - alt);
      ctx.stroke();
      ctx.fillStyle = colore;
      for (var f = 0; f < 6; f++) {
        var a = -Math.PI / 2 + (f - 2.5) * 0.55 + Math.sin(tempo + f + fase) * 0.04;
        var lx = x + sway + Math.cos(a) * alt * 0.42, ly = y - alt + Math.sin(a) * alt * 0.22 + alt * 0.12;
        ctx.beginPath();
        ctx.moveTo(x + sway, y - alt);
        ctx.quadraticCurveTo((x + sway + lx) / 2, y - alt - alt * 0.12, lx, ly);
        ctx.quadraticCurveTo((x + sway + lx) / 2, y - alt + 4, x + sway, y - alt + 4);
        ctx.fill();
      }
    },

    /* terreno vicino: parallasse 1 (coordinate del mondo) */
    terreno: function (ctx, p, camX, vw, tempo, larghezza, spiaggiaDa) {
      var x0 = camX - 40, x1 = camX + vw + 40;
      /* battigia */
      var g = ctx.createLinearGradient(0, 600, 0, 1000);
      g.addColorStop(0, rgba(p.sabbia));
      g.addColorStop(1, rgba(p.terra));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x0, 1000);
      for (var x = Math.floor(x0 / 30) * 30; x <= x1; x += 30) {
        ctx.lineTo(x, 632 + Math.sin(x * 0.004) * 8 + Math.sin(x * 0.011) * 4);
      }
      ctx.lineTo(x1, 1000);
      ctx.closePath();
      ctx.fill();
      /* schiuma che va e viene */
      ctx.strokeStyle = "rgba(255,255,255," + (0.55 - p.notte * 0.35) + ")";
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (var xs = Math.floor(x0 / 24) * 24; xs <= x1; xs += 24) {
        var ys = 628 + Math.sin(xs * 0.004) * 8 + Math.sin(tempo * 0.9 + xs * 0.02) * 3 - Math.max(0, Math.sin(tempo * 0.6)) * 4;
        if (xs === Math.floor(x0 / 24) * 24) ctx.moveTo(xs, ys); else ctx.lineTo(xs, ys);
      }
      ctx.stroke();
      /* sentiero: banda più chiara, morbida */
      var s = ctx.createLinearGradient(0, 720, 0, 830);
      s.addColorStop(0, rgba(p.sabbia, 0));
      s.addColorStop(0.5, rgba(mescola(p.sabbia, [255, 255, 255], 0.25), 0.55));
      s.addColorStop(1, rgba(p.sabbia, 0));
      ctx.fillStyle = s;
      ctx.fillRect(x0, 720, x1 - x0, 110);
      /* sassolini e ciuffi */
      var r = casuale(77);
      for (var i = 0; i < 260; i++) {
        var px = r() * larghezza, py = 680 + r() * 300, t = r();
        if (px < x0 || px > x1) { r(); continue; }
        if (t < 0.5) {
          ctx.fillStyle = rgba(mescola(p.terra, [40, 30, 20], 0.3), 0.35);
          ctx.beginPath();
          ctx.ellipse(px, py, 3 + t * 6, 2 + t * 3, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (px < (spiaggiaDa || 1e9)) {
          var col = rgba(mescola(p.medio, p.sabbia, 0.2), 0.9);
          var sw = Math.sin(tempo * 1.6 + px * 0.05) * 3;
          ctx.strokeStyle = col;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          for (var k = -2; k <= 2; k++) {
            ctx.moveTo(px + k * 4, py);
            ctx.quadraticCurveTo(px + k * 6, py - 12, px + k * 7 + sw, py - 18 - Math.abs(k) * -2);
          }
          ctx.stroke();
        }
      }
    },

    /* foglie scure in primo piano (parallasse 1.3) */
    primoPiano: function (ctx, p, camX, vw, tempo, larghezza) {
      var off = camX * 1.3;
      var r = casuale(91);
      for (var i = 0; i < 14; i++) {
        var bx = r() * larghezza * 1.3, alt = 0.7 + r() * 0.6, lato = r() < 0.5 ? -1 : 1;
        var x = bx - off;
        if (x < -400 || x > vw + 400) continue;
        Arte.ciuffoGrande(ctx, x, 1010, alt, rgba(p.primoPiano), tempo, i, lato);
      }
    },

    ciuffoGrande: function (ctx, x, y, s, colore, tempo, fase, lato) {
      ctx.fillStyle = colore;
      for (var f = 0; f < 5; f++) {
        var a = -Math.PI / 2 + (f - 2) * 0.32 * lato + Math.sin(tempo * 0.9 + fase + f) * 0.03;
        var l = (180 + f * 30) * s;
        var tx = x + Math.cos(a) * l, ty = y + Math.sin(a) * l;
        var nx = Math.cos(a + Math.PI / 2) * 26 * s, ny = Math.sin(a + Math.PI / 2) * 26 * s;
        ctx.beginPath();
        ctx.moveTo(x - nx * 0.3, y - ny * 0.3);
        ctx.quadraticCurveTo((x + tx) / 2 + nx, (y + ty) / 2 + ny, tx, ty);
        ctx.quadraticCurveTo((x + tx) / 2 - nx, (y + ty) / 2 - ny, x + nx * 0.3, y + ny * 0.3);
        ctx.fill();
      }
    },

    /* ---------- oggetti ---------- */

    palma: function (ctx, p, x, y, alt, tempo, cocchi) {
      var sway = Math.sin(tempo * 0.7 + x) * 8;
      ombra(ctx, x + 60, y, 140, 0.22);
      /* tronco ad anelli */
      var tx = x + 40 + sway, ty = y - alt;
      var tronco = mescola(p.terra, [70, 50, 35], 0.55);
      for (var i = 0; i < 18; i++) {
        var t = i / 18, t2 = (i + 1) / 18;
        var ax = x + (tx - x) * t + Math.sin(t * Math.PI) * -30, ay = y + (ty - y) * t;
        var bx = x + (tx - x) * t2 + Math.sin(t2 * Math.PI) * -30, by = y + (ty - y) * t2;
        capsula(ctx, ax, ay, bx, by, 26 - t * 10, rgba(mescola(tronco, [0, 0, 0], i % 2 ? 0.12 : 0)));
      }
      /* luce sul tronco */
      ctx.strokeStyle = rgba(p.bordo, 0.25);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + 8, y);
      ctx.quadraticCurveTo(x - 10, y - alt * 0.5, tx + 6, ty);
      ctx.stroke();
      /* foglie */
      var verde = mescola(p.medio, [30, 70, 40], 0.35);
      for (var f = 0; f < 9; f++) {
        var a = -Math.PI / 2 + (f - 4) * 0.42 + Math.sin(tempo * 1.1 + f + x) * 0.05;
        var l = 170 + (f % 3) * 25;
        var ex = tx + Math.cos(a) * l, ey = ty + Math.sin(a) * l * 0.55 + l * 0.35;
        var mx = (tx + ex) / 2 + Math.cos(a - Math.PI / 2) * 10, my = (ty + ey) / 2 - 40;
        var col = rgba(mescola(verde, [0, 0, 0], (f % 2) * 0.15));
        /* nervatura */
        ctx.strokeStyle = col;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.quadraticCurveTo(mx, my, ex, ey);
        ctx.stroke();
        /* foglioline */
        for (var k = 2; k < 14; k++) {
          var u = k / 14;
          var qx = (1 - u) * (1 - u) * tx + 2 * (1 - u) * u * mx + u * u * ex;
          var qy = (1 - u) * (1 - u) * ty + 2 * (1 - u) * u * my + u * u * ey;
          var lf = 46 * (1 - u * 0.6);
          ctx.lineWidth = 6 * (1 - u * 0.5);
          ctx.beginPath();
          ctx.moveTo(qx, qy);
          ctx.lineTo(qx + Math.cos(a + 1.2) * lf * 0.4, qy + lf);
          ctx.moveTo(qx, qy);
          ctx.lineTo(qx + Math.cos(a - 1.2) * lf * 0.4, qy + lf * 0.9);
          ctx.stroke();
        }
      }
      if (cocchi) {
        for (var c = 0; c < cocchi; c++) {
          Arte.cocco(ctx, p, tx - 14 + c * 18, ty + 18 + (c % 2) * 6, 14);
        }
      }
      return { x: tx, y: ty };
    },

    cocco: function (ctx, p, x, y, r) {
      var g = ctx.createRadialGradient(x - r * 0.4, y - r * 0.4, 1, x, y, r);
      g.addColorStop(0, rgba(mescola([150, 105, 60], p.bordo, 0.2)));
      g.addColorStop(1, rgba([70, 45, 25]));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    },

    roccia: function (ctx, p, x, y, l, a, seme) {
      var r = casuale(seme || 3);
      ombra(ctx, x, y + 4, l * 0.7, 0.25);
      var col = mescola(p.terra, [120, 115, 110], 0.5);
      ctx.beginPath();
      ctx.moveTo(x - l / 2, y);
      var n = 7;
      for (var i = 1; i < n; i++) {
        var t = i / n;
        var ang = Math.PI * (1 - t);
        ctx.lineTo(x + Math.cos(ang) * l / 2 * (0.85 + r() * 0.2), y - Math.sin(ang) * a * (0.8 + r() * 0.3));
      }
      ctx.lineTo(x + l / 2, y);
      ctx.closePath();
      var g = ctx.createLinearGradient(x - l / 2, y - a, x + l / 2, y);
      g.addColorStop(0, rgba(mescola(col, p.bordo, 0.35)));
      g.addColorStop(1, rgba(mescola(col, [20, 20, 30], 0.45)));
      ctx.fillStyle = g;
      ctx.fill();
    },

    grotta: function (ctx, p, x, y, luce, tempo) {
      /* massa di roccia */
      var col = mescola(p.terra, [110, 100, 95], 0.55);
      ctx.beginPath();
      ctx.moveTo(x - 360, y + 10);
      ctx.bezierCurveTo(x - 380, y - 260, x - 160, y - 420, x + 40, y - 400);
      ctx.bezierCurveTo(x + 260, y - 390, x + 380, y - 220, x + 360, y + 10);
      ctx.closePath();
      var g = ctx.createLinearGradient(x - 300, y - 400, x + 300, y);
      g.addColorStop(0, rgba(mescola(col, p.bordo, 0.3)));
      g.addColorStop(0.6, rgba(col));
      g.addColorStop(1, rgba(mescola(col, [15, 15, 25], 0.5)));
      ctx.fillStyle = g;
      ctx.fill();
      /* venature */
      ctx.strokeStyle = rgba(mescola(col, [0, 0, 0], 0.35), 0.5);
      ctx.lineWidth = 3;
      [[-250, -200, -120, -260], [120, -300, 240, -180], [-60, -340, 60, -360]].forEach(function (v) {
        ctx.beginPath();
        ctx.moveTo(x + v[0], y + v[1]);
        ctx.quadraticCurveTo(x + (v[0] + v[2]) / 2, y + v[1] - 30, x + v[2], y + v[3]);
        ctx.stroke();
      });
      /* apertura */
      ctx.beginPath();
      ctx.moveTo(x - 140, y + 6);
      ctx.bezierCurveTo(x - 150, y - 180, x - 40, y - 250, x + 20, y - 250);
      ctx.bezierCurveTo(x + 100, y - 250, x + 160, y - 170, x + 150, y + 6);
      ctx.closePath();
      if (luce > 0) {
        var f = 0.85 + Math.sin(tempo * 9) * 0.05 + Math.sin(tempo * 13) * 0.04;
        var gl = ctx.createRadialGradient(x, y - 40, 10, x, y - 60, 260);
        gl.addColorStop(0, rgba(mescola([30, 20, 20], [255, 200, 120], luce * f)));
        gl.addColorStop(0.6, rgba(mescola([20, 15, 18], [170, 90, 50], luce * f)));
        gl.addColorStop(1, rgba([18, 14, 18]));
        ctx.fillStyle = gl;
      } else {
        var gd = ctx.createLinearGradient(x, y - 250, x, y);
        gd.addColorStop(0, "#120e12");
        gd.addColorStop(1, "#2a2026");
        ctx.fillStyle = gd;
      }
      ctx.fill();
    },

    cespuglio: function (ctx, p, x, y, s, tempo, fiori) {
      var verde = mescola(p.medio, [40, 90, 50], 0.3);
      var r = casuale(Math.floor(x));
      for (var i = 0; i < 7; i++) {
        var cx = x + (r() - 0.5) * 120 * s, cy = y - 20 * s - r() * 50 * s, rr = (30 + r() * 26) * s;
        var g = ctx.createRadialGradient(cx - rr * 0.3, cy - rr * 0.4, 2, cx, cy, rr);
        g.addColorStop(0, rgba(mescola(verde, p.bordo, 0.3)));
        g.addColorStop(1, rgba(mescola(verde, [0, 0, 0], 0.35)));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx + Math.sin(tempo + i) * 1.5, cy, rr, 0, Math.PI * 2);
        ctx.fill();
      }
      if (fiori) {
        for (var k = 0; k < fiori; k++) {
          var fx = x + (r() - 0.5) * 100 * s, fy = y - 30 * s - r() * 50 * s;
          ctx.fillStyle = k % 2 ? "#f6d36b" : "#ef8fa6";
          for (var q = 0; q < 5; q++) {
            ctx.beginPath();
            ctx.arc(fx + Math.cos(q * 1.26) * 5, fy + Math.sin(q * 1.26) * 5, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    },

    canne: function (ctx, p, x, y, tempo, bruciate) {
      var r = casuale(42);
      for (var i = 0; i < 26; i++) {
        var cx = x - 160 + i * 13 + r() * 8, h = 160 + r() * 140, sw = Math.sin(tempo * 1.4 + i * 0.4) * 10;
        ctx.strokeStyle = rgba(mescola(bruciate ? [40, 30, 25] : mescola(p.medio, [150, 150, 70], 0.3), [0, 0, 0], r() * 0.25));
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cx, y);
        ctx.quadraticCurveTo(cx + sw * 0.3, y - h * 0.6, cx + sw, y - h);
        ctx.stroke();
        if (!bruciate) {
          ctx.fillStyle = rgba(mescola([150, 110, 70], p.bordo, 0.2));
          ctx.beginPath();
          ctx.ellipse(cx + sw, y - h - 8, 5, 16, sw * 0.02, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },

    fiamma: function (ctx, x, y, s, tempo, seme) {
      var t = tempo * 10 + (seme || 0);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      var alone = ctx.createRadialGradient(x, y - 30 * s, 2, x, y - 30 * s, 120 * s);
      alone.addColorStop(0, "rgba(255,170,70,0.55)");
      alone.addColorStop(1, "rgba(255,120,40,0)");
      ctx.fillStyle = alone;
      ctx.fillRect(x - 120 * s, y - 150 * s, 240 * s, 240 * s);
      ctx.restore();
      var strati = [["#ff6a1f", 1], ["#ffad33", 0.7], ["#fff1b0", 0.38]];
      strati.forEach(function (st, i) {
        var w = 30 * s * st[1], h = 95 * s * st[1];
        var o = Math.sin(t + i) * 6 * s * st[1];
        ctx.beginPath();
        ctx.moveTo(x - w, y);
        ctx.bezierCurveTo(x - w * 1.1, y - h * 0.5, x - w * 0.2 + o, y - h * 0.7, x + o * 1.5, y - h);
        ctx.bezierCurveTo(x + w * 0.3 + o, y - h * 0.6, x + w * 1.1, y - h * 0.4, x + w, y);
        ctx.closePath();
        ctx.fillStyle = st[0];
        ctx.fill();
      });
    },

    barca: function (ctx, p, x, y, tempo) {
      var dondola = Math.sin(tempo * 1.2) * 0.03, alza = Math.sin(tempo * 1.2) * 4;
      ctx.save();
      ctx.translate(x, y + alza);
      ctx.rotate(dondola);
      var legno = mescola([110, 70, 40], p.bordo, 0.15);
      ctx.beginPath();
      ctx.moveTo(-170, -50);
      ctx.quadraticCurveTo(-60, 20, 0, 18);
      ctx.quadraticCurveTo(110, 20, 190, -70);
      ctx.lineTo(150, -48);
      ctx.lineTo(-140, -44);
      ctx.closePath();
      ctx.fillStyle = rgba(legno);
      ctx.fill();
      ctx.strokeStyle = rgba(mescola(legno, [0, 0, 0], 0.4));
      ctx.lineWidth = 3;
      ctx.stroke();
      capsula(ctx, 10, -46, 30, -300, 7, rgba(mescola(legno, [0, 0, 0], 0.3)));
      /* vela latina, come le barche dell'Oceano Indiano */
      ctx.beginPath();
      ctx.moveTo(-90, -110);
      ctx.lineTo(120, -330);
      ctx.quadraticCurveTo(150, -170, 40, -60);
      ctx.closePath();
      var v = ctx.createLinearGradient(-90, -330, 120, -60);
      v.addColorStop(0, rgba(mescola([245, 236, 215], p.bordo, 0.3)));
      v.addColorStop(1, rgba(mescola([200, 180, 150], [0, 0, 0], 0.15)));
      ctx.fillStyle = v;
      ctx.fill();
      capsula(ctx, -100, -100, 130, -340, 4, rgba(mescola(legno, [0, 0, 0], 0.3)));
      ctx.restore();
    },

    /* ---------- animali ---------- */

    cerva: function (ctx, p, c, tempo) {
      var x = c.x, y = c.y || 790;
      ombra(ctx, x, y, 110, 0.3);
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(c.verso || 1, 1);
      var pelo = mescola([176, 120, 78], p.bordo, 0.12);
      var scuro = rgba(mescola(pelo, [0, 0, 0], 0.35));
      if (c.stato === "sdraiata") {
        var g0 = ctx.createLinearGradient(0, -70, 0, 0);
        g0.addColorStop(0, rgba(pelo));
        g0.addColorStop(1, rgba(mescola(pelo, [255, 240, 220], 0.4)));
        ctx.fillStyle = g0;
        ctx.beginPath();
        ctx.ellipse(0, -30, 86, 32, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(86, -36, 30, 15, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = scuro;
        ctx.beginPath();
        ctx.ellipse(78, -52, 7, 16, -0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return;
      }
      var corre = c.stato === "corre", cammina = c.stato === "cammina";
      var ph = c.passo || 0;
      var amp = corre ? 0.75 : cammina ? 0.35 : 0;
      var salto = corre ? Math.abs(Math.sin(ph)) * 18 : 0;
      ctx.translate(0, -salto);
      /* zampe dietro (più scure) */
      arto(ctx, -48, -110, Math.sin(ph + Math.PI) * amp, 52, 0.5, 58, 10, scuro);
      arto(ctx, 50, -110, Math.sin(ph) * amp, 50, -0.35, 60, 10, scuro);
      /* corpo */
      var g = ctx.createLinearGradient(0, -170, 0, -80);
      g.addColorStop(0, rgba(mescola(pelo, p.bordo, 0.3)));
      g.addColorStop(0.6, rgba(pelo));
      g.addColorStop(1, rgba(mescola(pelo, [255, 240, 220], 0.35)));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(-82, -128);
      ctx.bezierCurveTo(-80, -172, 50, -178, 76, -150);
      ctx.bezierCurveTo(92, -120, 70, -96, 40, -98);
      ctx.bezierCurveTo(0, -92, -60, -92, -76, -104);
      ctx.closePath();
      ctx.fill();
      /* coda */
      ctx.fillStyle = "#f4eadc";
      ctx.beginPath();
      ctx.ellipse(-86, -140, 9, 14, -0.5, 0, Math.PI * 2);
      ctx.fill();
      /* collo e testa */
      var testa = corre ? -0.25 : Math.sin(tempo * 0.8) * 0.05;
      ctx.save();
      ctx.translate(62, -150);
      ctx.rotate(testa);
      ctx.fillStyle = rgba(pelo);
      ctx.beginPath();
      ctx.moveTo(-14, 6);
      ctx.quadraticCurveTo(4, -40, 22, -74);
      ctx.lineTo(42, -66);
      ctx.quadraticCurveTo(24, -30, 22, 12);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(44, -78, 30, 15, 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = scuro;
      ctx.beginPath();
      ctx.ellipse(26, -98, 7, 18, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(38, -100, 6, 16, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#1a1210";
      ctx.beginPath();
      ctx.arc(46, -82, 3.2, 0, Math.PI * 2);
      ctx.arc(72, -70, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      /* zampe davanti */
      arto(ctx, -40, -106, Math.sin(ph) * amp, 52, 0.45, 58, 10, rgba(pelo));
      arto(ctx, 58, -108, Math.sin(ph + Math.PI) * amp, 50, -0.3, 60, 10, rgba(pelo));
      ctx.restore();
    },

    capra: function (ctx, p, x, y, verso, tempo) {
      ombra(ctx, x, y, 80, 0.28);
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(verso || 1, 1);
      var pelo = mescola([238, 230, 214], p.bordo, 0.15), om = rgba(mescola(pelo, [60, 60, 80], 0.35));
      arto(ctx, -36, -80, 0, 40, 0, 40, 9, om);
      arto(ctx, 34, -80, 0, 40, 0, 40, 9, om);
      var g = ctx.createLinearGradient(0, -130, 0, -70);
      g.addColorStop(0, rgba(pelo));
      g.addColorStop(1, rgba(mescola(pelo, [120, 110, 120], 0.35)));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(0, -100, 62, 32, 0, 0, Math.PI * 2);
      ctx.fill();
      var mastica = Math.sin(tempo * 4) * 2;
      ctx.beginPath();
      ctx.moveTo(42, -116);
      ctx.quadraticCurveTo(64, -150, 72, -158);
      ctx.lineTo(96, -150 + mastica);
      ctx.quadraticCurveTo(84, -120, 58, -96);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = rgba(mescola(pelo, [0, 0, 0], 0.15));
      ctx.beginPath();
      ctx.moveTo(88, -142);
      ctx.lineTo(84, -118 + mastica);
      ctx.lineTo(80, -140);
      ctx.fill();
      /* corna */
      ctx.strokeStyle = rgba(mescola([120, 100, 80], p.bordo, 0.2));
      ctx.lineWidth = 7;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(70, -160);
      ctx.quadraticCurveTo(60, -196, 32, -200);
      ctx.moveTo(78, -160);
      ctx.quadraticCurveTo(76, -192, 52, -206);
      ctx.stroke();
      ctx.fillStyle = "#1a1210";
      ctx.beginPath();
      ctx.arc(80, -150, 3, 0, Math.PI * 2);
      ctx.fill();
      arto(ctx, -26, -78, 0.05, 40, 0, 40, 9, rgba(pelo));
      arto(ctx, 44, -80, -0.05, 40, 0, 40, 9, rgba(pelo));
      ctx.restore();
    },

    uccello: function (ctx, p, x, y, tempo, vola) {
      ctx.save();
      ctx.translate(x, y);
      var piuma = mescola([235, 238, 242], p.bordo, 0.2), ala = mescola(piuma, [70, 80, 100], 0.35);
      var battito = vola ? Math.sin(tempo * 12) : Math.sin(tempo * 2) * 0.1;
      ctx.fillStyle = rgba(ala);
      ctx.beginPath();
      ctx.moveTo(-6, -30);
      ctx.quadraticCurveTo(-40, -30 - battito * 50, -86, -24 - battito * 60);
      ctx.quadraticCurveTo(-40, -14, -4, -18);
      ctx.fill();
      var g = ctx.createLinearGradient(0, -50, 0, -5);
      g.addColorStop(0, rgba(piuma));
      g.addColorStop(1, rgba(mescola(piuma, [120, 130, 150], 0.4)));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(0, -26, 34, 17, -0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(30, -42, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#e7a33a";
      ctx.beginPath();
      ctx.moveTo(40, -46);
      ctx.lineTo(62, -40);
      ctx.lineTo(40, -38);
      ctx.fill();
      ctx.fillStyle = "#1a1210";
      ctx.beginPath();
      ctx.arc(34, -45, 2.6, 0, Math.PI * 2);
      ctx.fill();
      if (!vola) {
        capsula(ctx, -2, -12, -4, 4, 3, "#c98a3a");
        capsula(ctx, 8, -12, 8, 4, 3, "#c98a3a");
      }
      ctx.restore();
    },

    tartaruga: function (ctx, p, x, y, tempo) {
      ombra(ctx, x, y, 80, 0.3);
      var pelle = mescola([150, 160, 110], p.bordo, 0.1);
      var t = Math.sin(tempo * 1.2) * 4;
      ctx.fillStyle = rgba(pelle);
      ctx.beginPath();
      ctx.ellipse(x + 70 + t, y - 22, 20, 14, 0.2, 0, Math.PI * 2);
      ctx.ellipse(x - 46, y - 4, 16, 8, 0, 0, Math.PI * 2);
      ctx.ellipse(x + 40, y - 4, 16, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#1a1210";
      ctx.beginPath();
      ctx.arc(x + 80 + t, y - 25, 2.6, 0, Math.PI * 2);
      ctx.fill();
      var g = ctx.createRadialGradient(x - 10, y - 60, 4, x, y - 30, 80);
      g.addColorStop(0, rgba(mescola([150, 125, 70], p.bordo, 0.35)));
      g.addColorStop(1, rgba([70, 60, 35]));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x - 66, y - 8);
      ctx.bezierCurveTo(x - 60, y - 80, x + 60, y - 80, x + 66, y - 8);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(40,30,15,0.45)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(x - 22, y - 60); ctx.lineTo(x - 8, y - 38); ctx.lineTo(x + 22, y - 38); ctx.lineTo(x + 30, y - 58);
      ctx.moveTo(x - 8, y - 38); ctx.lineTo(x - 22, y - 10);
      ctx.moveTo(x + 22, y - 38); ctx.lineTo(x + 34, y - 10);
      ctx.moveTo(x - 46, y - 40); ctx.lineTo(x - 22, y - 30);
      ctx.moveTo(x + 46, y - 40); ctx.lineTo(x + 26, y - 30);
      ctx.stroke();
    },

    /* ---------- persone ---------- */

    /*
     * Una persona a sagoma con luce sul bordo.
     * o: { x, y, verso, passo, posa: "fermo"|"cammina"|"corre"|"salta"|"siede"|"inginocchiato", salto,
     *      equip: { bastone, mantello, scudo, fuoco }, veste, barba, cuore, respiro, calore }
     */
    persona: function (ctx, p, o, tempo) {
      var x = o.x, y = o.y || 790;
      if (o.strato !== "colore") ombra(ctx, x, y, 70, 0.32);
      ctx.save();
      ctx.translate(x, y - (o.salto || 0));
      ctx.scale(o.verso || 1, 1);
      var buio = p.notte || 0;
      var base = o.pelleColore || [156, 100, 66];
      var pelleRgb = mescola(mescola(base, p.bordo, 0.18), [22, 20, 34], buio * 0.55);
      var pelle = rgba(pelleRgb);
      var pelleScura = rgba(mescola(pelleRgb, [20, 14, 18], 0.38));
      var capelliCol = rgba(mescola(o.capelli || [38, 26, 22], [10, 10, 20], buio * 0.4));
      var luce = rgba(p.bordo, 0.85);
      var ph = o.passo || 0, posa = o.posa || "fermo";
      var amp = posa === "corre" ? 0.9 : posa === "cammina" ? 0.45 : 0;
      var respiro = Math.sin(tempo * (o.respiro || 1.6)) * 2;
      var fianco = posa === "siede" || posa === "inginocchiato";
      var hipY = fianco ? -70 : -96 - Math.abs(Math.sin(ph)) * (posa === "corre" ? 8 : 3);
      /* braccio davanti: serve anche allo strato a colori (fiamma in mano) */
      var braccioF = posa === "corre" ? Math.sin(ph + Math.PI) * 1.1 : posa === "cammina" ? Math.sin(ph + Math.PI) * 0.4 : -0.1;
      var gomitoF = -0.5;
      if (o.equip && (o.equip.bastone || o.equip.fuoco)) { braccioF = -0.9; gomitoF = -0.9; }
      if (o.ripara) { braccioF = -1.6; gomitoF = -1.2; }
      if (posa === "inginocchiato") { braccioF = -0.7; gomitoF = -0.6; }

      /* strato a colori: solo organi (vista ai raggi X) e fiamma, sopra al mondo in bianco e nero */
      if (o.strato === "colore") {
        var sp0 = hipY - 72 + respiro * 0.3;
        if (o.raggiX) organi(sp0);
        if (o.equip && o.equip.fuoco) {
          var m0 = puntoArto(6, sp0, braccioF, 38, gomitoF, 36);
          Arte.fiamma(ctx, m0[2] + 20, m0[3] - 66, 0.45 * (o.fuocoForza === undefined ? 1 : o.fuocoForza), tempo, 3);
        }
        ctx.restore();
        return;
      }

      function organi(spalla) {
        var by = spalla + 18;
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        var calore = o.calore || 0;
        if (calore > 0.05) {
          var gc = ctx.createRadialGradient(0, by + 10, 4, 0, by + 10, 90);
          gc.addColorStop(0, "rgba(255,120,60," + (0.35 * calore) + ")");
          gc.addColorStop(1, "rgba(255,120,60,0)");
          ctx.fillStyle = gc;
          ctx.fillRect(-90, by - 80, 180, 180);
        }
        var polmoni = 1 + Math.sin(tempo * (o.respiro || 1.6)) * 0.12;
        ctx.fillStyle = "rgba(140,200,255,0.55)";
        ctx.beginPath();
        ctx.ellipse(-7, by, 7 * polmoni, 15 * polmoni, 0.1, 0, Math.PI * 2);
        ctx.ellipse(9, by, 7 * polmoni, 15 * polmoni, -0.1, 0, Math.PI * 2);
        ctx.fill();
        var bpm = o.cuore || 70;
        var fase = (tempo * bpm / 60) % 1;
        var pulsa = 1 + Math.max(0, 1 - fase * 6) * 0.45;
        ctx.fillStyle = "rgba(255,80,90,0.9)";
        ctx.beginPath();
        ctx.arc(4, by + 8, 6 * pulsa, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      function figura(dx, dy, colore, retro, capelli) {
        retro = retro || colore; capelli = capelli || colore;
        ctx.save();
        ctx.translate(dx, dy);
        /* gamba dietro */
        if (posa === "siede") {
          arto(ctx, 0, hipY, 1.4, 48, -1.3, 50, 15, retro);
        } else if (posa === "inginocchiato") {
          arto(ctx, 0, hipY, 0.2, 44, 1.6, 40, 15, retro);
        } else if (posa === "salta") {
          arto(ctx, 0, hipY, -0.6, 48, 1.2, 48, 15, retro);
        } else {
          arto(ctx, 0, hipY, Math.sin(ph + Math.PI) * amp, 48, Math.max(0, Math.sin(ph + Math.PI * 1.5)) * amp * 1.2, 50, 15, retro);
        }
        /* braccio dietro */
        var spalla = hipY - 72 + respiro * 0.3;
        var braccioDietro = posa === "corre" ? Math.sin(ph) * 1.1 : posa === "cammina" ? Math.sin(ph) * 0.4 : 0.15;
        arto(ctx, -2, spalla, braccioDietro, 38, -0.4 - (posa === "corre" ? 0.8 : 0), 36, 12, retro);
        /* busto */
        ctx.beginPath();
        ctx.moveTo(-20, hipY + 4);
        ctx.bezierCurveTo(-26, hipY - 30, -24, spalla - 6, -10, spalla - 10);
        ctx.lineTo(14, spalla - 10);
        ctx.bezierCurveTo(26, spalla - 2, 24, hipY - 30, 18, hipY + 4);
        ctx.closePath();
        ctx.fillStyle = colore;
        ctx.fill();
        if (retro !== colore) {
          /* ombra morbida sul busto: luce da sinistra-alto */
          var gb = ctx.createLinearGradient(-24, 0, 24, 0);
          gb.addColorStop(0, "rgba(255,240,210,0.16)");
          gb.addColorStop(0.55, "rgba(0,0,0,0)");
          gb.addColorStop(1, "rgba(20,10,10,0.28)");
          ctx.fillStyle = gb;
          ctx.fill();
        }
        /* testa */
        ctx.fillStyle = colore;
        var inclina = posa === "corre" ? 10 : 0;
        ctx.beginPath();
        ctx.arc(4 + inclina, spalla - 38, 25, 0, Math.PI * 2);
        ctx.fill();
        if (retro !== colore) {
          /* naso, orecchio, occhio, sopracciglio */
          ctx.beginPath();
          ctx.moveTo(26 + inclina, spalla - 44);
          ctx.quadraticCurveTo(36 + inclina, spalla - 34, 27 + inclina, spalla - 31);
          ctx.fill();
          ctx.fillStyle = retro;
          ctx.beginPath();
          ctx.ellipse(-4 + inclina, spalla - 36, 5, 7, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#1b1212";
          ctx.beginPath();
          ctx.ellipse(17 + inclina, spalla - 42, 2.6, 3.4, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(255,255,255,0.7)";
          ctx.beginPath();
          ctx.arc(18 + inclina, spalla - 43, 1, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = capelli;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(12 + inclina, spalla - 50); ctx.lineTo(22 + inclina, spalla - 49);
          ctx.stroke();
          /* bocca: sorride quando è calmo */
          ctx.strokeStyle = "rgba(60,25,20,0.7)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(17 + inclina, spalla - 25);
          ctx.quadraticCurveTo(21 + inclina, spalla - 23 + (posa === "corre" ? -2 : 1), 25 + inclina, spalla - 26);
          ctx.stroke();
          ctx.fillStyle = colore;
        }
        /* capelli mossi */
        ctx.beginPath();
        for (var c = 0; c < 6; c++) {
          var a = Math.PI * 1.05 + c * 0.32;
          var vento = Math.sin(tempo * 3 + c) * 2 - (posa === "corre" ? 8 : 0);
          ctx.moveTo(4 + inclina + Math.cos(a) * 20, spalla - 38 + Math.sin(a) * 20);
          ctx.quadraticCurveTo(4 + inclina + Math.cos(a) * 34 + vento, spalla - 38 + Math.sin(a) * 34, 4 + inclina + Math.cos(a + 0.2) * 38 + vento * 1.5, spalla - 38 + Math.sin(a + 0.2) * 40);
        }
        ctx.lineWidth = 9;
        ctx.lineCap = "round";
        ctx.strokeStyle = capelli;
        ctx.stroke();
        ctx.fillStyle = capelli;
        ctx.beginPath();
        ctx.arc(4 + inclina, spalla - 38, 25, Math.PI * 1.02, Math.PI * 1.9);
        ctx.lineTo(4 + inclina, spalla - 46);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = colore;
        /* gamba davanti */
        if (posa === "siede") {
          arto(ctx, 6, hipY, 1.5, 48, -1.4, 50, 15, colore);
        } else if (posa === "inginocchiato") {
          arto(ctx, 8, hipY, -0.6, 44, 0.9, 46, 15, colore);
        } else if (posa === "salta") {
          arto(ctx, 4, hipY, 0.9, 48, -1.4, 48, 15, colore);
        } else {
          arto(ctx, 4, hipY, Math.sin(ph) * amp, 48, Math.max(0, Math.sin(ph + Math.PI / 2)) * amp * 1.2, 50, 15, colore);
        }
        ctx.restore();
        return spalla;
      }

      /* bordo di luce: la figura disegnata in chiaro e spostata, poi la figura scura sopra */
      if (Arte.inchiostro) { extra = 6; figura(0, 0, INCHIOSTRO); extra = 0; }
      else figura(-2.5, -1.5, luce);
      var spalla = figura(0, 0, pelle, pelleScura, capelliCol);
      /* perizoma di corteccia */
      if (!o.veste) {
        ctx.fillStyle = rgba(mescola(mescola([120, 82, 46], p.bordo, 0.15), [20, 18, 30], buio * 0.5));
        ctx.beginPath();
        ctx.moveTo(-22, hipY - 6);
        ctx.lineTo(20, hipY - 6);
        ctx.lineTo(22, hipY + 16);
        ctx.lineTo(8, hipY + 26);
        ctx.lineTo(-4, hipY + 14);
        ctx.lineTo(-20, hipY + 22);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "rgba(40,24,12,0.5)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-22, hipY - 2); ctx.lineTo(20, hipY - 2);
        ctx.stroke();
      }

      /* veste (Absal) */
      if (o.veste) {
        ctx.fillStyle = rgba(mescola(mescola(hex(o.veste), p.bordo, 0.15), [20, 18, 30], buio * 0.5));
        ctx.beginPath();
        ctx.moveTo(-22, spalla - 6);
        ctx.lineTo(18, spalla - 6);
        ctx.lineTo(30, hipY + 60);
        ctx.lineTo(-30, hipY + 60);
        ctx.closePath();
        ctx.fill();
      }
      /* mantello di foglie */
      if (o.equip && o.equip.mantello) {
        var verde = mescola(p.medio, [50, 110, 60], 0.4);
        ctx.fillStyle = rgba(verde);
        for (var f = 0; f < 7; f++) {
          var fx = -24 + f * 1.5, fy = spalla - 4 + f * 13, sw = Math.sin(tempo * 2 + f) * 3 - (posa === "corre" ? 10 : 0);
          ctx.beginPath();
          ctx.ellipse(fx - 8 + sw, fy, 16, 9, 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (o.raggiX && o.strato !== "corpo") organi(spalla);
      /* braccio davanti, con gli attrezzi */
      if (Arte.inchiostro) { extra = 6; arto(ctx, 6, spalla, braccioF, 38, gomitoF, 36, 12, INCHIOSTRO); extra = 0; }
      var mano = arto(ctx, 6, spalla, braccioF, 38, gomitoF, 36, 12, pelle);
      if (o.equip && o.equip.scudo) {
        ctx.save();
        ctx.translate(-14, spalla + 30);
        var gs = ctx.createLinearGradient(-20, -40, 20, 40);
        gs.addColorStop(0, rgba(mescola([140, 100, 60], p.bordo, 0.3)));
        gs.addColorStop(1, rgba([70, 48, 30]));
        ctx.fillStyle = gs;
        ctx.beginPath();
        ctx.ellipse(0, 0, 20, 36, 0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(30,20,10,0.5)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-10, -26); ctx.lineTo(-6, 26);
        ctx.moveTo(4, -32); ctx.lineTo(8, 30);
        ctx.stroke();
        ctx.restore();
      }
      if (o.equip && (o.equip.bastone || o.equip.fuoco)) {
        var punta = [mano[0] + 20, mano[1] - 70];
        capsula(ctx, mano[0] - 10, mano[1] + 30, punta[0], punta[1], 6, rgba(mescola([120, 85, 50], p.bordo, 0.2)));
        if (o.equip.fuoco && o.strato !== "corpo") Arte.fiamma(ctx, punta[0], punta[1] + 4, 0.45 * (o.fuocoForza === undefined ? 1 : o.fuocoForza), tempo, 3);
      }
      if (o.barba) {
        ctx.fillStyle = capelliCol;
        ctx.beginPath();
        ctx.moveTo(-2, spalla - 24);
        ctx.quadraticCurveTo(8, spalla + 2, 26, spalla - 22);
        ctx.quadraticCurveTo(14, spalla - 14, -2, spalla - 24);
        ctx.fill();
      }
      ctx.restore();
    },

    /* ---------- luce e atmosfera ---------- */

    vignetta: function (ctx, w, h, forza, colore) {
      var g = ctx.createRadialGradient(w / 2, h * 0.55, h * 0.35, w / 2, h * 0.55, Math.max(w, h) * 0.8);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, colore || "rgba(10,8,20," + forza + ")");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }
  };

  window.Arte = Arte;
})();
