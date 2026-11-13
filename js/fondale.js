/*
 * Il fondale: il disegno del ragazzo dietro a tutto il livello, come il fondale di un teatro.
 *
 * Un livello = un fondale, sempre lo stesso. Il formato migliore è una striscia di 3 fogli A4
 * orizzontali affiancati: mentre Hayy cammina il fondale scorre piano, e dal primo all'ultimo passo
 * del livello si vede tutto il disegno, da sinistra a destra (alba a sinistra, spiaggia a destra).
 * Con un foglio solo il disegno si ripete a specchio, così i bordi combaciano.
 * Davanti restano, disegnati dal codice, il sentiero, i personaggi, gli oggetti e il primo piano.
 *
 * La carta bianca diventa trasparente: dove il ragazzo non ha colorato si vede il cielo animato
 * (sole, nuvole, stelle). L'ora del giorno colora il disegno: arancione al tramonto, blu di notte.
 *
 * Da dove arriva il disegno, in ordine:
 *   1. una foto scelta sul telefono (Impostazioni → Il tuo disegno). Resta solo su quel telefono.
 *   2. il file indicato in FONDALI (preparato con strumenti/prepara_fondale.py e messo su GitHub).
 *   3. nessun disegno: si usa il paesaggio disegnato dal codice.
 */
(function () {
  "use strict";

  /* Un fondale per livello. file: null finché non c'è la scansione. */
  window.FONDALI = {
    livello1: {
      file: null,               /* per esempio "assets/fondali/livello1.png" */
      alto: 60,                 /* dove comincia il disegno (0 = cima dello schermo, 1000 = fondo) */
      basso: 805,               /* dove finisce: appena sotto la linea su cui camminano i personaggi */
      sostituisce: ["isole", "mare", "giungla"]  /* strati del codice che il disegno prende il posto di */
    }
  };

  var DB = "respira", NEGOZIO = "fondali";
  var stato = { img: null, cfg: null, chiave: null, cache: null, oraCache: -9, origine: null };

  /* ---------- archivio sul telefono (IndexedDB), con try/catch ovunque ---------- */

  function apri() {
    return new Promise(function (ok, no) {
      try {
        var r = indexedDB.open(DB, 1);
        r.onupgradeneeded = function () { r.result.createObjectStore(NEGOZIO); };
        r.onsuccess = function () { ok(r.result); };
        r.onerror = function () { no(r.error); };
      } catch (e) { no(e); }
    });
  }
  function leggi(chiave) {
    return apri().then(function (db) {
      return new Promise(function (ok) {
        var r = db.transaction(NEGOZIO).objectStore(NEGOZIO).get(chiave);
        r.onsuccess = function () { ok(r.result || null); };
        r.onerror = function () { ok(null); };
      });
    }).catch(function () { return null; });
  }
  function scrivi(chiave, valore) {
    return apri().then(function (db) {
      return new Promise(function (ok) {
        var t = db.transaction(NEGOZIO, "readwrite");
        if (valore === null) t.objectStore(NEGOZIO).delete(chiave); else t.objectStore(NEGOZIO).put(valore, chiave);
        t.oncomplete = function () { ok(true); };
        t.onerror = function () { ok(false); };
      });
    }).catch(function () { return false; });
  }

  function immagine(src) {
    return new Promise(function (ok, no) {
      var i = new Image();
      i.onload = function () { ok(i); };
      i.onerror = no;
      i.src = src;
    });
  }

  /* ---------- dalla foto del foglio al fondale ----------
   * Stessa ricetta di strumenti/prepara_fondale.py:
   * 1. rimpicciolisce (altezza massima 900 punti);
   * 2. toglie le ombre: misura la luce della carta zona per zona e la riporta al bianco;
   * 3. la carta (chiara e poco colorata) diventa trasparente, con un bordo morbido;
   * 4. i colori del pennarello diventano più vivi.
   */
  /* La luce della carta zona per zona (come mappa_luce in prepara_fondale.py) */
  function mappaLuce(px, w, h) {
    var lato = Math.max(8, Math.floor(h / 12)), nx = Math.ceil(w / lato), ny = Math.ceil(h / lato);
    var griglia = new Float32Array(nx * ny * 3), ist = new Uint32Array(256 * 3);
    for (var cy = 0; cy < ny; cy++) {
      for (var cx = 0; cx < nx; cx++) {
        ist.fill(0);
        var n = 0;
        for (var y = cy * lato; y < Math.min(h, (cy + 1) * lato); y += 2) {
          for (var x = cx * lato; x < Math.min(w, (cx + 1) * lato); x += 2) {
            var k = (y * w + x) * 4;
            ist[px[k]]++; ist[256 + px[k + 1]]++; ist[512 + px[k + 2]]++; n++;
          }
        }
        for (var ch = 0; ch < 3; ch++) {
          var soglia = n * 0.9, somma = 0, v = 0;
          for (v = 0; v < 256; v++) { somma += ist[ch * 256 + v]; if (somma >= soglia) break; }
          griglia[(cy * nx + cx) * 3 + ch] = v;
        }
      }
    }
    /* il massimo con le celle vicine, e mai meno dell'80% della carta più chiara */
    var vicini = new Float32Array(griglia.length), tutte = [];
    for (var j = 0; j < ny; j++) {
      for (var i = 0; i < nx; i++) {
        for (var c = 0; c < 3; c++) {
          var m = 0;
          for (var dj = -1; dj <= 1; dj++) for (var di = -1; di <= 1; di++) {
            var jj = Math.max(0, Math.min(ny - 1, j + dj)), ii = Math.max(0, Math.min(nx - 1, i + di));
            m = Math.max(m, griglia[(jj * nx + ii) * 3 + c]);
          }
          vicini[(j * nx + i) * 3 + c] = m;
        }
        tutte.push(griglia[(j * nx + i) * 3] + griglia[(j * nx + i) * 3 + 1] + griglia[(j * nx + i) * 3 + 2]);
      }
    }
    tutte.sort(function (a, b) { return a - b; });
    var cartaChiara = tutte[Math.floor(tutte.length * 0.9)] / 3 * 0.8;
    /* allargata a tutta la foto, sfumando tra i centri delle celle */
    var L = new Float32Array(w * h * 4);
    for (var yy = 0; yy < h; yy++) {
      var fy = Math.max(0, Math.min(ny - 1, (yy + 0.5) / lato - 0.5)), y0 = Math.floor(fy), y1 = Math.min(ny - 1, y0 + 1), ty = fy - y0;
      for (var xx = 0; xx < w; xx++) {
        var fx = Math.max(0, Math.min(nx - 1, (xx + 0.5) / lato - 0.5)), x0 = Math.floor(fx), x1 = Math.min(nx - 1, x0 + 1), tx = fx - x0;
        for (var q = 0; q < 3; q++) {
          var a00 = vicini[(y0 * nx + x0) * 3 + q], a01 = vicini[(y0 * nx + x1) * 3 + q];
          var a10 = vicini[(y1 * nx + x0) * 3 + q], a11 = vicini[(y1 * nx + x1) * 3 + q];
          var val = (a00 * (1 - tx) + a01 * tx) * (1 - ty) + (a10 * (1 - tx) + a11 * tx) * ty;
          L[(yy * w + xx) * 4 + q] = Math.max(60, cartaChiara, val);
        }
      }
    }
    return L;
  }

  function preparaFoto(img) {
    var h = Math.min(900, img.naturalHeight || img.height);
    var w = Math.round((img.naturalWidth || img.width) * h / (img.naturalHeight || img.height));
    var c = document.createElement("canvas");
    c.width = w; c.height = h;
    var g = c.getContext("2d");
    g.drawImage(img, 0, 0, w, h);
    var d = g.getImageData(0, 0, w, h), px = d.data;
    var L = mappaLuce(px, w, h);
    for (var i = 0; i < px.length; i += 4) {
      var r = px[i], gg = px[i + 1], b = px[i + 2];
      var lr = L[i], lg = L[i + 1], lb = L[i + 2];
      r = Math.min(255, r * 255 / lr); gg = Math.min(255, gg * 255 / lg); b = Math.min(255, b * 255 / lb);
      var max = Math.max(r, gg, b), min = Math.min(r, gg, b);
      var lum = 0.299 * r + 0.587 * gg + 0.114 * b;
      var sat = max === 0 ? 0 : (max - min) / max;
      /* quanto è "carta": chiaro e grigio */
      var carta = Math.max(0, Math.min(1, (lum - 200) / 40)) * Math.max(0, Math.min(1, (0.22 - sat) / 0.12));
      /* colori più vivi */
      var media = (r + gg + b) / 3;
      r = media + (r - media) * 1.2; gg = media + (gg - media) * 1.2; b = media + (b - media) * 1.2;
      px[i] = Math.max(0, Math.min(255, (r - 128) * 1.05 + 128));
      px[i + 1] = Math.max(0, Math.min(255, (gg - 128) * 1.05 + 128));
      px[i + 2] = Math.max(0, Math.min(255, (b - 128) * 1.05 + 128));
      px[i + 3] = Math.round(255 * (1 - carta));
    }
    g.putImageData(d, 0, 0);
    return c;
  }

  /* ---------- colore dell'ora del giorno, ricalcolato solo quando l'ora cambia ---------- */

  function tinta(p, ora) {
    if (stato.cache && Math.abs(ora - stato.oraCache) < 0.04) return stato.cache;
    var img = stato.img;
    var c = stato.cache || document.createElement("canvas");
    c.width = img.width; c.height = img.height;
    var g = c.getContext("2d");
    g.globalCompositeOperation = "source-over";
    g.clearRect(0, 0, c.width, c.height);
    g.drawImage(img, 0, 0);
    g.globalCompositeOperation = "source-atop";
    /* luce calda o fredda del momento */
    g.fillStyle = window.Arte.rgba(p.bordo, 0.16 + (1 - p.notte) * 0.04);
    g.fillRect(0, 0, c.width, c.height);
    /* lontananza: un velo del colore del cielo basso, che lega il disegno all'aria */
    g.fillStyle = window.Arte.rgba(p.cieloBasso, 0.12);
    g.fillRect(0, 0, c.width, c.height);
    if (p.notte > 0.05) {
      g.fillStyle = "rgba(14,20,52," + (p.notte * 0.5).toFixed(3) + ")";
      g.fillRect(0, 0, c.width, c.height);
    }
    stato.cache = c;
    stato.oraCache = ora;
    return c;
  }

  window.Fondale = {
    /* Prepara il fondale del livello: prima la foto del telefono, poi il file su GitHub */
    carica: function (chiave) {
      stato.chiave = chiave;
      stato.cfg = window.FONDALI[chiave] || {};
      stato.img = null; stato.cache = null; stato.origine = null;
      return leggi(chiave).then(function (dati) {
        if (dati) return immagine(dati).then(function (i) { stato.img = i; stato.origine = "foto"; });
        if (stato.cfg.file) return immagine(stato.cfg.file).then(function (i) { stato.img = i; stato.origine = "file"; });
      }).catch(function () { stato.img = null; });
    },

    attivo: function () { return !!stato.img; },
    origine: function () { return stato.origine; },

    /* true se lo strato del codice va saltato perché c'è il disegno */
    sostituisce: function (strato) {
      return !!stato.img && (stato.cfg.sostituisce || []).indexOf(strato) >= 0;
    },

    /* Disegna il fondale. Coordinate dello schermo già scalate (altezza 1000). */
    disegna: function (ctx, p, ora, camX, vw, larghezza) {
      if (!stato.img) return;
      var cfg = stato.cfg, alto = cfg.alto === undefined ? 60 : cfg.alto, basso = cfg.basso === undefined ? 805 : cfg.basso;
      var h = basso - alto;
      var w = stato.img.width * h / stato.img.height;
      var img = tinta(p, ora);
      if (w >= vw * 1.05) {
        /* fondale lungo (più fogli affiancati): scorre in modo che all'inizio del livello
           si veda il bordo sinistro e alla fine quello destro */
        var corsa = Math.max(1, larghezza - vw);
        var x = -(w - vw) * Math.max(0, Math.min(1, camX / corsa));
        ctx.drawImage(img, x, alto, w, h);
      } else {
        /* fondale corto (un foglio solo): si ripete a specchio, così i bordi combaciano sempre */
        var inizio = -((camX * 0.25) % (2 * w));
        for (var k = 0, xx = inizio; xx < vw; k++, xx += w) {
          if (xx + w < 0) continue;
          if (k % 2 === 0) ctx.drawImage(img, xx, alto, w, h);
          else { ctx.save(); ctx.translate(xx + w, alto); ctx.scale(-1, 1); ctx.drawImage(img, 0, 0, w, h); ctx.restore(); }
        }
      }
      /* attaccatura morbida con il terreno */
      var g = ctx.createLinearGradient(0, basso - 40, 0, basso);
      g.addColorStop(0, window.Arte.rgba(p.sabbia, 0));
      g.addColorStop(1, window.Arte.rgba(p.sabbia, 0.9));
      ctx.fillStyle = g;
      ctx.fillRect(0, basso - 40, vw, 40);
    },

    /* Dalla foto scelta sul telefono: la prepara, la salva sul telefono e la mette subito in scena */
    daFoto: function (files) {
      /* una o più foto: più fogli vengono messi in fila, da sinistra a destra, nell'ordine scelto */
      var lista = Array.prototype.slice.call(files.length !== undefined ? files : [files], 0, 6);
      return Promise.all(lista.map(function (f) {
        var url = URL.createObjectURL(f);
        return immagine(url).then(function (img) { URL.revokeObjectURL(url); return preparaFoto(img); });
      })).then(function (fogli) {
        var c = fogli[0];
        if (fogli.length > 1) {
          var hh = Math.min.apply(null, fogli.map(function (f) { return f.height; }));
          c = document.createElement("canvas");
          c.height = hh;
          c.width = fogli.reduce(function (t, f) { return t + Math.round(f.width * hh / f.height); }, 0);
          var x = 0, g = c.getContext("2d");
          fogli.forEach(function (f) { var ww = Math.round(f.width * hh / f.height); g.drawImage(f, x, 0, ww, hh); x += ww; });
        }
        var dati = c.toDataURL("image/png");
        return scrivi(stato.chiave, dati).then(function () { return window.Fondale.carica(stato.chiave); });
      });
    },

    rimuovi: function () {
      return scrivi(stato.chiave, null).then(function () { return window.Fondale.carica(stato.chiave); });
    },

    /* esposta per i test */
    _preparaFoto: preparaFoto
  };
})();
