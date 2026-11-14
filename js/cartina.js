/*
 * Cartina disegnata dal codice: dal Mediterraneo all'Oceano Indiano.
 * Coste semplificate (longitudine e latitudine in gradi), proiezione piana: x = lon, y = -lat.
 * Cartina.svg({ punti, rotta, etichette }) restituisce il codice SVG.
 */
(function () {
  "use strict";

  var LON0 = -12, LAT0 = 48, K = 10; /* angolo in alto a sinistra e scala */
  function p(lon, lat) { return ((lon - LON0) * K).toFixed(0) + "," + ((LAT0 - lat) * K).toFixed(0); }
  function poligono(punti) { return "M" + punti.map(function (q) { return p(q[0], q[1]); }).join("L") + "Z"; }

  /* Europa, con Iberia, Italia, Balcani e Anatolia */
  var EUROPA = [[-5, 60], [-4.7, 48.4], [-1.2, 46], [-1.8, 43.4], [-8, 43.7], [-9.3, 43], [-8.7, 41.5], [-9.5, 39.5], [-8.8, 38.7], [-8.9, 37],
    [-6.3, 36.8], [-5.6, 36], [-2, 36.7], [-0.7, 37.6], [0, 39], [0.5, 40.5], [3.2, 41.9], [3, 43.3], [6, 43.1], [7.5, 43.8], [8.8, 44.4],
    [10.5, 43], [12, 41.7], [14, 40.8], [15.6, 40], [15.7, 38], [16.5, 38.4], [17, 39.3], [17, 40.5], [18.5, 40.1], [16, 41.4], [14, 42.5],
    [12.4, 44.2], [12.3, 45.4], [13.7, 45.6], [15, 44], [17, 43], [19, 42], [19.5, 40.5], [21, 38], [22.5, 36.5], [23, 38], [24, 38.5],
    [23, 40], [24, 40.9], [26, 40.8], [26.5, 39.5], [27.3, 37.5], [28, 36.7], [30.5, 36.3], [32.5, 36.1], [36, 36.5], [40, 37], [45, 40],
    [50, 60], [-5, 60]];
  /* Africa fino al bordo basso della cartina */
  var AFRICA = [[-5.9, 35.8], [-6.8, 34], [-9.6, 30.4], [-13, 27.5], [-17, 21], [-17.5, 14.7], [-15, 11], [-13, 8], [-8, 4.5], [-3, 5],
    [2, 6.3], [6, 4.3], [9.5, 3.5], [9, -1], [12, -5], [13, -12], [12, -30], [40, -30], [40, -12], [39.5, -6], [40, -3], [42, -0.5], [45, 2], [48, 5], [51, 11],
    [49, 11.3], [45, 10.5], [43.3, 11.7], [39, 15.5], [37.5, 18.5], [36.8, 22], [35.5, 24], [33.5, 27.5], [32.5, 30], [32.3, 31.2],
    [30, 31.4], [25, 31.6], [20, 32], [19.5, 30.3], [15.5, 31.5], [13, 32.9], [11, 33.2], [10, 34.5], [11, 35.5], [10, 37.2], [8, 36.9],
    [3, 36.8], [-2, 35.2]];
  /* Levante, Arabia, Persia, India */
  var ASIA = [[36, 36.5], [35.9, 35], [35, 33], [34.3, 31.3], [32.6, 31.1], [32.8, 29.8], [34.4, 28], [35, 29.5], [36.5, 26], [39, 22], [42.5, 16],
    [43.5, 12.7], [45, 13], [49, 14.5], [52, 16], [55, 17.5], [57.8, 19], [59.8, 22.4], [58.5, 23.7], [56.4, 26.3], [56, 24.5], [54, 24],
    [52, 24], [50.8, 25.6], [50, 26.5], [48.5, 28.5], [48, 30], [50, 30], [51.5, 27.8], [54, 26.6], [56.5, 27.1], [58, 25.7], [61.5, 25.2],
    [66.5, 25.4], [67.5, 24], [68.5, 23], [70, 22.5], [72.6, 21.4], [73, 19], [74, 15.5], [75, 12.5], [76.5, 9], [77.5, 8], [78.2, 9],
    [79.8, 10.3], [80.3, 13], [80, 15.6], [82.3, 17], [85, 19.5], [87, 21.5], [88.5, 22], [91, 22.5], [94, 18], [98, 16], [98, 8], [100, 4], [104, 1.5], [104, 10], [110, 20], [125, 30], [125, 60], [45, 60], [45, 40], [40, 37]];
  var SRI_LANKA = [[79.9, 9.8], [81.2, 8.6], [81.8, 7.5], [81, 6], [80, 6.2], [79.7, 8]];
  var MAR_NERO = [[28, 41.2], [29, 41.2], [31, 41.1], [35, 42], [38, 41], [41.5, 41.5], [41.6, 42.6], [39, 44.5], [37, 45.2], [34, 46], [31, 46.6], [30, 45], [28.6, 43.5]];
  var CASPIO = [[47, 45], [50, 46.5], [53, 45.5], [52.5, 42], [54, 40], [53.5, 37.5], [51, 36.8], [49, 38], [49.5, 40.5], [47.5, 43]];

  window.Cartina = {
    luoghi: {
      andalus: [-3.6, 37.2],       /* Granada e Guadix, dove visse Ibn Tufayl */
      isolaHayy: [79, -4],         /* l'isola del racconto: immaginaria, "vicino all'India, sotto l'equatore" */
      itaca: [20.7, 38.4],
      egitto: [31.2, 30],
      mesoamerica: null
    },
    xy: function (lon, lat) { return [(lon - LON0) * K, (LAT0 - lat) * K]; },

    /*
     * o.punti: [{ luogo:[lon,lat], nome, colore, grande }]
     * o.rotta: [[lon,lat], ...] linea tratteggiata animata
     * o.vista: [lonMin, latMax, larghezzaGradi, altezzaGradi] per inquadrare una parte
     * o.etichette: true per i nomi dei mari
     */
    svg: function (o) {
      o = o || {};
      var v = o.vista || [LON0, LAT0, 104, 58];
      var vb = [(v[0] - LON0) * K, (LAT0 - v[1]) * K, v[2] * K, v[3] * K].join(" ");
      var s = '<svg class="cartina" viewBox="' + vb + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true">';
      s += '<defs><radialGradient id="mare-c" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="#7cc4e0"/><stop offset="1" stop-color="#2f7fae"/></radialGradient>' +
        '<filter id="ombra-c"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#0a2a40" flood-opacity="0.35"/></filter></defs>';
      s += '<rect x="-200" y="-200" width="1500" height="1000" fill="url(#mare-c)"/>';
      /* onde decorative */
      for (var i = 0; i < 14; i++) {
        var ox = 60 + (i * 173) % 1000, oy = 80 + (i * 97) % 560;
        s += '<path d="M' + ox + ' ' + oy + 'q8 -6 16 0t16 0" stroke="rgba(255,255,255,0.35)" stroke-width="3" fill="none" stroke-linecap="round"/>';
      }
      s += '<g filter="url(#ombra-c)" fill="#f1dfb4" stroke="#8a6a44" stroke-width="3" stroke-linejoin="round">';
      [EUROPA, AFRICA, ASIA, SRI_LANKA].forEach(function (q) { s += '<path d="' + poligono(q) + '"/>'; });
      s += "</g>";
      s += '<g fill="url(#mare-c)" stroke="#8a6a44" stroke-width="2.5">';
      [MAR_NERO, CASPIO].forEach(function (q) { s += '<path d="' + poligono(q) + '"/>'; });
      s += "</g>";
      /* deserti e monti, appena accennati */
      s += '<g fill="#e3c98e" opacity="0.7"><ellipse cx="' + p(10, 25).split(",")[0] + '" cy="' + p(10, 25).split(",")[1] + '" rx="170" ry="60"/>' +
        '<ellipse cx="' + p(45, 23).split(",")[0] + '" cy="' + p(45, 23).split(",")[1] + '" rx="80" ry="40"/></g>';
      if (o.etichette !== false) {
        var et = [["Mar Mediterraneo", 19, 35.6, 20], ["Oceano Indiano", 57, -4, 30], ["Africa", 18, 14, 30], ["Europa", 10, 46.5, 26], ["Arabia", 46, 21, 22], ["India", 78.5, 19, 22]];
        et.forEach(function (e) {
          var xy = p(e[1], e[2]).split(",");
          var mare = /Mar|Oceano/.test(e[0]);
          s += '<text x="' + xy[0] + '" y="' + xy[1] + '" font-size="' + e[3] + '" text-anchor="middle" fill="' + (mare ? "#e8f6ff" : "#8a6a44") +
            '" font-style="italic" font-family="Georgia, serif" opacity="0.9">' + e[0] + "</text>";
        });
      }
      if (o.rotta) {
        var d = "M" + o.rotta.map(function (q) { return p(q[0], q[1]); }).join("L");
        s += '<path class="rotta" d="' + d + '" fill="none" stroke="#e5484d" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="14 12"/>';
      }
      (o.punti || []).forEach(function (pt, k) {
        var xy = p(pt.luogo[0], pt.luogo[1]).split(",");
        var r = pt.grande ? 16 : 11;
        s += '<g class="spillo" style="animation-delay:' + (0.3 + k * 0.5) + 's">';
        if (pt.isola) s += '<ellipse cx="' + xy[0] + '" cy="' + xy[1] + '" rx="34" ry="20" fill="#9ed37a" stroke="#4a7a2a" stroke-width="3"/><path d="M' + (+xy[0] + 4) + " " + (+xy[1] - 4) + 'l-2 -22m2 0l-12 4m12 -4l12 4" stroke="#2e5a26" stroke-width="3" fill="none"/>';
        s += '<circle cx="' + xy[0] + '" cy="' + xy[1] + '" r="' + (r + 10) + '" fill="' + (pt.colore || "#e5484d") + '" opacity="0.25" class="pulsa"/>';
        s += '<circle cx="' + xy[0] + '" cy="' + xy[1] + '" r="' + r + '" fill="' + (pt.colore || "#e5484d") + '" stroke="#fff" stroke-width="4"/>';
        if (pt.nome) {
          var tx = +xy[0] + (pt.dx || 0), ty = +xy[1] - r - 16 + (pt.dy || 0);
          s += '<text x="' + tx + '" y="' + ty + '" font-size="30" font-weight="900" text-anchor="middle" fill="#fff" stroke="#3a2a1a" stroke-width="7" paint-order="stroke" font-family="Trebuchet MS, sans-serif">' + pt.nome + "</text>";
        }
        s += "</g>";
      });
      s += "</svg>";
      return s;
    }
  };
})();
