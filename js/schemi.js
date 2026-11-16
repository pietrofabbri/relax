/*
 * Schemi per le spiegazioni: disegni a inchiostro su carta, con un solo colore d'accento.
 * Le parti compaiono una dopo l'altra (classe "passo", con ritardo), così l'occhio segue l'ordine giusto.
 * Schemi.svg(nome, etichette) — le etichette arrivano da testi-it.js (TESTI.schemi), per poterle tradurre.
 */
(function () {
  "use strict";

  var INK = "#2b2622", CARTA = "#fbf6ea";
  var k = 0, indice = 0, opz = {};
  /* un passo dello schema. opz.fino: quanti passi mostrare; opz.da: passi già visti (compaiono subito) */
  function passo(contenuto, ritardo) {
    var i = indice++;
    if (opz.fino !== undefined && i >= opz.fino) return "";
    var r = ritardo !== undefined ? ritardo : (k++ * 0.45);
    if (opz.da !== undefined) r = i < opz.da ? 0 : (i - opz.da) * 0.5 + 0.2;
    return '<g class="passo" style="animation-delay:' + r.toFixed(2) + 's">' + contenuto + "</g>";
  }
  function testo(x, y, t, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.ancora || "middle") + '" font-size="' + (o.dim || 26) +
      '" font-weight="' + (o.peso || 800) + '" fill="' + (o.colore || INK) + '" font-family="Trebuchet MS, sans-serif">' + t + "</text>";
  }
  function freccia(x1, y1, x2, y2, colore, curva) {
    var mx = (x1 + x2) / 2 + (curva || 0), my = (y1 + y2) / 2 - (curva || 0) * 0.3;
    var a = Math.atan2(y2 - my, x2 - mx), L = 16;
    return '<path d="M' + x1 + " " + y1 + "Q" + mx + " " + my + " " + x2 + " " + y2 + '" stroke="' + (colore || INK) + '" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<path d="M' + x2 + " " + y2 + "L" + (x2 - L * Math.cos(a - 0.45)) + " " + (y2 - L * Math.sin(a - 0.45)) + "M" + x2 + " " + y2 + "L" +
      (x2 - L * Math.cos(a + 0.45)) + " " + (y2 - L * Math.sin(a + 0.45)) + '" stroke="' + (colore || INK) + '" stroke-width="5" stroke-linecap="round"/>';
  }
  function tondo(x, y, r, icona, colore) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + CARTA + '" stroke="' + (colore || INK) + '" stroke-width="5"/>' +
      '<g transform="translate(' + (x - r * 0.62) + "," + (y - r * 0.62) + ") scale(" + (r * 1.24 / 64) + ')">' + window.Icone.svgInterno(icona) + "</g>";
  }
  /* sagoma di una persona, a inchiostro */
  function sagoma(x, y, s) {
    return '<g transform="translate(' + x + "," + y + ") scale(" + s + ')" fill="' + CARTA + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round">' +
      '<circle cx="0" cy="-150" r="30"/>' +
      '<path d="M-42 -110 Q0 -122 42 -110 L50 -10 Q0 4 -50 -10 Z"/>' +
      '<path d="M-42 -104 L-70 -20 M42 -104 L70 -20" fill="none" stroke-width="16" stroke-linecap="round"/>' +
      '<path d="M-42 -104 L-70 -20 M42 -104 L70 -20" fill="none" stroke="' + CARTA + '" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M-22 -6 L-28 110 M22 -6 L28 110" fill="none" stroke-width="20" stroke-linecap="round"/>' +
      '<path d="M-22 -6 L-28 110 M22 -6 L28 110" fill="none" stroke="' + CARTA + '" stroke-width="12" stroke-linecap="round"/></g>';
  }

  var S = {
    /* le parti del corpo e i loro compiti */
    corpo: function (L) {
      var h = passo(sagoma(400, 230, 1.15), 0);
      var parti = [
        ["cervello", 400, 58, 560, 50, "#c4421a"],
        ["polmoni", 378, 130, 210, 110, "#4a90e2"],
        ["cuore", 412, 132, 600, 150, "#e5484d"],
        ["stomaco", 400, 185, 220, 215, "#2fb27a"],
        ["muscoli", 432, 300, 590, 300, "#9a6a2a"]
      ];
      parti.forEach(function (q, i) {
        var g = '<circle cx="' + q[1] + '" cy="' + q[2] + '" r="13" fill="' + q[5] + '" stroke="' + INK + '" stroke-width="3"/>' +
          '<path d="M' + q[1] + " " + q[2] + "L" + q[3] + " " + q[4] + '" stroke="' + INK + '" stroke-width="2.5" stroke-dasharray="6 5"/>' +
          testo(q[3] + (q[3] > 400 ? 12 : -12), q[4] - 6, L[q[0]], { ancora: q[3] > 400 ? "start" : "end", colore: q[5] }) +
          testo(q[3] + (q[3] > 400 ? 12 : -12), q[4] + 22, L[q[0] + "Fa"], { ancora: q[3] > 400 ? "start" : "end", dim: 20, peso: 600 });
        h += passo(g, 0.6 + i * 0.55);
      });
      return h;
    },

    /* corsa: tutto cambia insieme, a catena */
    catena: function (L) {
      var nodi = [["corsa", 130, 120, L.muscoli], ["polmoni", 400, 70, L.respiro], ["cuore", 670, 120, L.cuore], ["fuoco", 560, 300, L.calore], ["goccia", 240, 300, L.sudore]];
      var h = "", icone = { corsa: "corsa", polmoni: "ingranaggi", cuore: "cuore", fuoco: "fuoco", goccia: "goccia" };
      nodi.forEach(function (n, i) {
        var g = tondo(n[1], n[2], 48, icone[n[0]] === "ingranaggi" ? "polmoni" : icone[n[0]]) + testo(n[1], n[2] + 80, n[3], { dim: 24 });
        h += passo(g, i * 0.6);
        if (i < nodi.length - 1) {
          var m = nodi[i + 1];
          h += passo(freccia(n[1] + (m[1] - n[1]) * 0.25, n[2] + (m[2] - n[2]) * 0.25, n[1] + (m[1] - n[1]) * 0.72, n[2] + (m[2] - n[2]) * 0.72, "#c4421a", 20), i * 0.6 + 0.3);
        }
      });
      h += passo(testo(400, 210, L.insieme, { dim: 30, colore: "#c4421a" }), 3.2);
      return h;
    },

    /* il messaggio veloce: occhio, nervo, cervello, nervo, mano */
    riflesso: function (L) {
      var h = "", xs = [90, 400, 710];
      h += passo(tondo(xs[0], 170, 62, "occhio") + testo(xs[0], 270, L.occhio), 0);
      h += passo('<path d="M152 170 C230 120 290 220 338 170" stroke="#f2a01b" stroke-width="7" fill="none" stroke-dasharray="10 8"/>' + testo(245, 125, L.nervo, { dim: 20, colore: "#b0600a" }) + freccia(310, 178, 338, 170, "#f2a01b"), 0.6);
      h += passo(tondo(xs[1], 170, 62, "cervello") + testo(xs[1], 270, L.cervello), 1.1);
      h += passo('<path d="M462 170 C510 220 570 120 648 170" stroke="#f2a01b" stroke-width="7" fill="none" stroke-dasharray="10 8"/>' + testo(555, 125, L.nervo, { dim: 20, colore: "#b0600a" }) + freccia(620, 162, 648, 170, "#f2a01b"), 1.7);
      h += passo(tondo(xs[2], 170, 62, "mano") + testo(xs[2], 270, L.mano), 2.2);
      h += passo('<rect x="230" y="310" width="340" height="56" rx="28" fill="#ffd34d" stroke="' + INK + '" stroke-width="4"/>' + testo(400, 348, L.tempo, { dim: 28 }), 2.9);
      return h;
    },

    /* il neurone: corpo, filo lungo (assone), segnale elettrico, sinapsi */
    neurone: function (L) {
      var h = "";
      var corpo = '<path d="M120 200 m-46 0 a46 46 0 1 0 92 0 a46 46 0 1 0 -92 0" fill="#f4d9c0" stroke="' + INK + '" stroke-width="5"/>' +
        '<circle cx="120" cy="200" r="14" fill="#c4421a"/>' +
        '<path d="M80 176 L40 140 M40 140 L22 150 M40 140 L36 118 M84 226 L44 262 M44 262 L26 254 M44 262 L42 286 M118 154 L112 112 M112 112 L96 100 M112 112 L126 96" stroke="' + INK + '" stroke-width="5" stroke-linecap="round" fill="none"/>';
      h += passo(corpo + testo(120, 330, L.neurone, { dim: 26 }), 0);
      var assone = '<path id="assone" d="M166 200 H560" stroke="' + INK + '" stroke-width="6"/>';
      for (var i = 0; i < 6; i++) assone += '<rect x="' + (182 + i * 64) + '" y="188" width="48" height="24" rx="12" fill="#fff" stroke="' + INK + '" stroke-width="4"/>';
      h += passo(assone + testo(360, 168, L.filo, { dim: 22, peso: 600 }), 0.8);
      h += passo('<circle r="12" fill="#ffd34d" stroke="#b0600a" stroke-width="3"><animateMotion dur="1.4s" repeatCount="indefinite" path="M166 200 H560"/></circle>' +
        testo(360, 262, L.elettrico, { dim: 26, colore: "#b0600a" }) + testo(360, 296, L.velocita, { dim: 22, peso: 600 }), 1.6);
      h += passo('<path d="M560 200 L600 182 M560 200 L600 218" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>' +
        '<path d="M630 160 Q650 200 630 240" stroke="' + INK + '" stroke-width="6" fill="#f4d9c0"/>' +
        '<circle cx="614" cy="190" r="4" fill="#4a90e2"/><circle cx="618" cy="206" r="4" fill="#4a90e2"/><circle cx="610" cy="214" r="4" fill="#4a90e2"/>' +
        testo(640, 120, L.sinapsi, { dim: 24, colore: "#4a90e2" }) + testo(640, 290, L.chimica, { dim: 20, peso: 600 }), 2.5);
      return h;
    },

    /* dove si spende il tempo di una reazione */
    tempi: function (L) {
      var h = "", x0 = 90, W = 620;
      var parti = [[0.12, "#f2a01b", L.viaggio1], [0.72, "#c4421a", L.cervello], [0.16, "#4a90e2", L.muscolo]];
      var x = x0;
      parti.forEach(function (q, i) {
        var w = W * q[0];
        h += passo('<rect x="' + x + '" y="150" width="' + w + '" height="70" rx="8" fill="' + q[1] + '" stroke="' + INK + '" stroke-width="4"/>' +
          testo(x + w / 2, i === 1 ? 194 : 120 + (i === 2 ? 0 : 0), i === 1 ? q[2] : "", { dim: 24, colore: "#fff" }), i * 0.7);
        if (i !== 1) h += passo(testo(x + w / 2, i === 0 ? 120 : 260, q[2], { dim: 20, peso: 700 }), i * 0.7 + 0.2);
        x += w;
      });
      h += passo('<path d="M' + x0 + ' 300H' + (x0 + W) + '" stroke="' + INK + '" stroke-width="4"/><path d="M' + x0 + ' 290v20M' + (x0 + W) + ' 290v20" stroke="' + INK + '" stroke-width="4"/>' +
        testo(x0 + W / 2, 345, L.totale, { dim: 26 }), 2.2);
      return h;
    },

    /* misurare più volte: tre barre e la media */
    media: function (L) {
      var h = "", v = [310, 240, 275], x0 = 230;
      v.forEach(function (n, i) {
        var hh = n * 0.8;
        h += passo('<rect x="' + (x0 + i * 130) + '" y="' + (340 - hh) + '" width="90" height="' + hh + '" rx="10" fill="#f2b84b" stroke="' + INK + '" stroke-width="4"/>' +
          testo(x0 + i * 130 + 45, 330 - hh, n + " ms", { dim: 22 }), i * 0.5);
      });
      var m = 275 * 0.8;
      h += passo('<path d="M200 ' + (340 - m) + 'H620" stroke="#c4421a" stroke-width="5" stroke-dasharray="14 10"/>' + testo(640, 345 - m, L.media, { ancora: "start", colore: "#c4421a" }), 1.7);
      h += passo('<path d="M200 340H620" stroke="' + INK + '" stroke-width="4"/>', 0);
      return h;
    },

    /* il cuore non si ferma mai */
    cuoreGiorno: function (L) {
      var h = passo('<g class="batte-svg">' + tondo(250, 190, 110, "cuore", "#e5484d") + "</g>", 0);
      h += passo(testo(560, 150, L.numero, { dim: 54, colore: "#e5484d" }) + testo(560, 195, L.alGiorno, { dim: 28 }), 0.8);
      h += passo(tondo(500, 290, 40, "luna") + testo(620, 300, L.ancheDormi, { dim: 24, ancora: "start" }), 1.6);
      return h;
    },

    /* due strade per i messaggi: nervi (veloci) e sangue (lenti) */
    dueStrade: function (L) {
      var h = "";
      h += passo('<rect x="30" y="30" width="350" height="330" rx="26" fill="#fff4cc" stroke="' + INK + '" stroke-width="4"/>' + tondo(205, 120, 58, "fulmine") +
        testo(205, 220, L.nervi, { dim: 30 }) + testo(205, 262, L.veloce, { dim: 24, peso: 600 }) + testo(205, 300, L.breve, { dim: 24, peso: 600 }), 0);
      h += passo('<rect x="420" y="30" width="350" height="330" rx="26" fill="#ffe1e1" stroke="' + INK + '" stroke-width="4"/>' + tondo(595, 120, 58, "sangue") +
        testo(595, 220, L.sangue, { dim: 30 }) + testo(595, 262, L.lento, { dim: 24, peso: 600 }) + testo(595, 300, L.dura, { dim: 24, peso: 600 }), 1);
      return h;
    },

    /* parola nuova: cellula. Il corpo, la lente, i mattoncini */
    cellula: function (L) {
      var h = passo(sagoma(130, 250, 0.95) + testo(130, 385, L.corpo, { dim: 24 }), 0);
      h += passo('<circle cx="175" cy="150" r="26" fill="none" stroke="#c4421a" stroke-width="5"/>' +
        '<path d="M195 135 L430 40 M195 168 L430 360" stroke="#c4421a" stroke-width="3" stroke-dasharray="8 6"/>' + testo(300, 210, L.pelle, { dim: 22, colore: "#c4421a" }), 0.8);
      var c = '<clipPath id="lente-c"><circle cx="590" cy="200" r="165"/></clipPath><g clip-path="url(#lente-c)"><rect x="420" y="30" width="340" height="340" fill="#ffe9dc"/>';
      for (var r = 0; r < 6; r++) for (var q = 0; q < 6; q++) {
        var x = 440 + q * 62 + (r % 2) * 31, y = 50 + r * 58;
        c += '<rect x="' + x + '" y="' + y + '" width="56" height="52" rx="18" fill="#ffc9b3" stroke="' + INK + '" stroke-width="3"/>' +
          '<circle cx="' + (x + 28) + '" cy="' + (y + 26) + '" r="9" fill="#c4421a"/>';
      }
      c += '</g><circle cx="590" cy="200" r="165" fill="none" stroke="' + INK + '" stroke-width="7"/>';
      h += passo(c, 1.5);
      h += passo(testo(590, 392, L.cellule + " · " + L.mattoni, { dim: 26, colore: "#c4421a" }), 2.3);
      return h;
    },

    /* parola nuova: zuccheri. Cibo → zuccheri → muscoli → energia */
    zuccheri: function (L) {
      var h = passo(tondo(90, 90, 50, "cocco") + testo(90, 170, L.frutta, { dim: 22 }) +
        '<g transform="translate(90 245)"><path d="M-48 20 Q-50 -26 0 -28 Q50 -26 48 20 Z" fill="#e8b46a" stroke="' + INK + '" stroke-width="4"/><path d="M-20 -18 l8 18 M2 -22 l8 18 M22 -18 l8 18" stroke="' + INK + '" stroke-width="3"/></g>' + testo(90, 300, L.pane, { dim: 22 }) +
        '<g transform="translate(90 340)"><rect x="-28" y="-14" width="56" height="44" rx="10" fill="#f6c142" stroke="' + INK + '" stroke-width="4"/><rect x="-32" y="-24" width="64" height="12" rx="4" fill="#b98863" stroke="' + INK + '" stroke-width="3"/></g>' + testo(160, 360, L.miele, { dim: 22, ancora: "start" }), 0);
      h += passo(freccia(180, 200, 290, 200), 0.9);
      var cubi = "";
      [[330, 160], [390, 160], [360, 108], [330, 220], [390, 220]].forEach(function (c) {
        cubi += '<rect x="' + c[0] + '" y="' + c[1] + '" width="50" height="50" rx="6" fill="#fff" stroke="' + INK + '" stroke-width="4"/><path d="M' + (c[0] + 10) + ' ' + (c[1] + 12) + 'l8 0" stroke="#c4421a" stroke-width="4" stroke-linecap="round"/>';
      });
      h += passo(cubi + testo(385, 310, L.zuccheri, { dim: 30, colore: "#c4421a" }), 1.3);
      h += passo(freccia(460, 200, 560, 200) + tondo(630, 180, 62, "corsa") + testo(630, 275, L.muscolo, { dim: 24 }), 2);
      h += passo(tondo(730, 330, 40, "fulmine") + testo(660, 340, L.energia, { dim: 24, ancora: "end", colore: "#c4421a" }), 2.6);
      return h;
    },

    /* parola nuova: ossigeno. L'aria è un miscuglio */
    ossigeno: function (L) {
      var cx = 230, cy = 200, r = 150, a = -Math.PI / 2, b = a + Math.PI * 2 * 0.21;
      var h = passo('<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#e6e1d6" stroke="' + INK + '" stroke-width="5"/>' + testo(cx - 30, cy + 70, L.altro, { dim: 26, colore: "#6b6258" }), 0);
      h += passo('<path d="M' + cx + " " + cy + "L" + (cx + r * Math.cos(a)) + " " + (cy + r * Math.sin(a)) + "A" + r + " " + r + " 0 0 1 " + (cx + r * Math.cos(b)) + " " + (cy + r * Math.sin(b)) + 'Z" fill="#6fb3ff" stroke="' + INK + '" stroke-width="5"/>' +
        testo(cx + 70, cy - 70, "O₂", { dim: 34, colore: "#fff" }) + testo(440, 70, L.ossigeno, { dim: 34, colore: "#2a6fc4", ancora: "start" }), 0.9);
      h += passo(freccia(440, 150, 540, 210, "#2a6fc4") + tondo(600, 250, 58, "fuoco"), 1.7);
      h += passo(freccia(470, 160, 690, 120, "#2a6fc4", 40) + tondo(730, 140, 50, "polmoni"), 2.3);
      return h;
    },

    /* parola nuova: evaporare. Il panno al sole */
    evapora: function (L) {
      var h = passo(tondo(660, 90, 60, "sole"), 0);
      h += passo('<path d="M140 250 H460 V300 H140 Z" fill="#9cc9ff" stroke="' + INK + '" stroke-width="5"/>' +
        '<path d="M120 250 H480" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>' +
        '<circle cx="200" cy="320" r="8" fill="#6fb3ff"/><circle cx="330" cy="330" r="8" fill="#6fb3ff"/>' + testo(300, 370, L.panno, { dim: 24 }), 0.6);
      var v = "";
      for (var i = 0; i < 4; i++) { var x = 180 + i * 80; v += '<path d="M' + x + ' 230 q-20 -30 0 -60 q20 -30 0 -60" fill="none" stroke="#7fa8d8" stroke-width="5" stroke-linecap="round" opacity="0.8"/>'; }
      h += passo(v + testo(300, 70, L.vapore, { dim: 26, colore: "#2a6fc4" }), 1.4);
      h += passo(tondo(600, 280, 50, "termometro") + freccia(600, 340, 600, 390, "#2a6fc4") + testo(670, 290, L.fresco, { dim: 22, ancora: "start", colore: "#2a6fc4" }), 2.2);
      return h;
    },

    /* parola nuova: millesimo di secondo */
    millesimo: function (L) {
      var h = passo('<rect x="60" y="150" width="680" height="70" rx="10" fill="#fff4cc" stroke="' + INK + '" stroke-width="5"/>' + testo(400, 120, L.secondo, { dim: 32 }), 0);
      var t = "";
      for (var i = 1; i < 100; i++) { var x = 60 + i * 6.8; t += '<path d="M' + x.toFixed(1) + " 150 V" + (i % 10 ? 172 : 200) + '" stroke="' + INK + '" stroke-width="' + (i % 10 ? 1 : 2.5) + '"/>'; }
      h += passo(t + testo(400, 260, L.pezzi, { dim: 26, colore: "#c4421a" }), 0.9);
      h += passo('<rect x="60" y="150" width="204" height="70" fill="#6fb3ff" opacity="0.45"/>' + tondo(162, 330, 46, "occhio") + testo(225, 340, L.ciglia, { dim: 22, ancora: "start" }), 1.8);
      return h;
    },

    /* il termostato del corpo */
    termostato: function (L) {
      var h = passo(tondo(400, 170, 80, "termometro") + testo(400, 290, "37 °C", { dim: 44, colore: "#c4421a" }), 0);
      h += passo(freccia(300, 170, 180, 170, "#e5484d") + testo(150, 110, L.caldo, { dim: 28, colore: "#e5484d" }) + tondo(130, 200, 44, "sole") + testo(130, 280, L.sudi, { dim: 24 }), 0.9);
      h += passo(freccia(500, 170, 620, 170, "#4a90e2") + testo(650, 110, L.freddo, { dim: 28, colore: "#4a90e2" }) + tondo(670, 200, 44, "fiocco") + testo(670, 280, L.tremi, { dim: 24 }), 1.7);
      h += passo(testo(400, 360, L.sempre, { dim: 26 }), 2.5);
      return h;
    },

    /* fuoco e corpo: tutti e due usano l'aria per "bruciare" */
    fuocoAria: function (L) {
      var h = passo(tondo(170, 170, 80, "fuoco") + testo(170, 290, L.legna, { dim: 24 }), 0);
      h += passo(testo(400, 120, "+", { dim: 60 }) + tondo(400, 190, 56, "polmoni") + testo(400, 280, L.aria, { dim: 26, colore: "#4a90e2" }), 0.8);
      h += passo(freccia(470, 190, 560, 190, INK) + tondo(640, 170, 80, "cuore") + testo(640, 290, L.corpo, { dim: 24 }), 1.6);
      h += passo(testo(400, 360, L.energia, { dim: 26, colore: "#c4421a" }), 2.4);
      return h;
    }
  };

  window.Schemi = {
    svg: function (nome, etichette, o) {
      k = 0; indice = 0; opz = o || {};
      return '<svg class="schema" viewBox="0 0 800 400" aria-hidden="true">' + (S[nome] ? S[nome](etichette || {}) : "") + "</svg>";
    }
  };
})();
