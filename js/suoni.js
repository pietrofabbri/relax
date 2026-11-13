/* Suoni sintetizzati con Web Audio: nessun file audio da scaricare o da mantenere. */
(function () {
  "use strict";

  var ctx = null;

  function contesto() {
    if (ctx) return ctx;
    var C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    try { ctx = new C(); } catch (e) { ctx = null; }
    return ctx;
  }

  function attivo() {
    return window.Salvataggio && window.Salvataggio.impostazioni().suoni;
  }

  /* Un colpo sordo, come un battito: frequenza bassa che scende in fretta. */
  function colpo(quando, volume) {
    var c = contesto();
    if (!c) return;
    var o = c.createOscillator();
    var g = c.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(70, quando);
    o.frequency.exponentialRampToValueAtTime(38, quando + 0.12);
    g.gain.setValueAtTime(0.0001, quando);
    g.gain.exponentialRampToValueAtTime(volume, quando + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, quando + 0.18);
    o.connect(g);
    g.connect(c.destination);
    o.start(quando);
    o.stop(quando + 0.2);
  }

  /* una nota breve */
  function nota(f, quando, durata, volume, tipo, scivola) {
    var c = contesto();
    if (!c) return;
    var o = c.createOscillator(), g = c.createGain();
    o.type = tipo || "triangle";
    o.frequency.setValueAtTime(f, quando);
    if (scivola) o.frequency.exponentialRampToValueAtTime(scivola, quando + durata);
    g.gain.setValueAtTime(0.0001, quando);
    g.gain.exponentialRampToValueAtTime(volume, quando + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, quando + durata);
    o.connect(g);
    g.connect(c.destination);
    o.start(quando);
    o.stop(quando + durata + 0.02);
  }

  /* rumore bianco filtrato (esplosioni, fruscii) */
  function rumore(durata, filtro, da, a, volume) {
    var c = contesto();
    if (!c) return;
    var n = Math.floor(c.sampleRate * durata);
    var buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    var src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(), t = c.currentTime;
    src.buffer = buf;
    f.type = filtro;
    f.frequency.setValueAtTime(da, t);
    f.frequency.exponentialRampToValueAtTime(a, t + durata);
    g.gain.setValueAtTime(volume, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + durata);
    src.connect(f); f.connect(g); g.connect(c.destination);
    src.start();
  }

  /* scala pentatonica: le note dei premi salgono con la serie */
  var PENTA = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51, 1567.98, 1760];

  window.Suoni = {
    /* premio: una nota che sale con la serie (combo) */
    ding: function (serie) {
      if (!attivo()) return;
      var c = contesto();
      if (!c) return;
      var f = PENTA[Math.min(PENTA.length - 1, serie || 0)], t = c.currentTime + 0.005;
      nota(f, t, 0.25, 0.12, "triangle");
      nota(f * 2, t + 0.04, 0.18, 0.05, "sine");
    },
    pop: function () {
      if (!attivo()) return;
      var c = contesto();
      if (!c) return;
      nota(300, c.currentTime + 0.005, 0.09, 0.15, "sine", 900);
    },
    /* salto: un fischio che sale */
    salto: function () {
      if (!attivo()) return;
      var c = contesto();
      if (!c) return;
      nota(260, c.currentTime + 0.005, 0.22, 0.09, "square", 700);
    },
    /* errore morbido: due note che scendono */
    ops: function () {
      if (!attivo()) return;
      var c = contesto();
      if (!c) return;
      var t = c.currentTime + 0.005;
      nota(330, t, 0.14, 0.1, "sawtooth", 250);
      nota(247, t + 0.12, 0.2, 0.1, "sawtooth", 180);
    },
    /* tuono */
    tuono: function () {
      if (!attivo()) return;
      rumore(2.2, "lowpass", 1800, 60, 0.9);
      var c = contesto();
      if (c) colpo(c.currentTime + 0.01, 0.9);
    },
    /* fuoco che divampa */
    fiammata: function () {
      if (!attivo()) return;
      rumore(0.9, "bandpass", 300, 2500, 0.35);
    },
    /* folata veloce (sipario, scatti) */
    whoosh: function () {
      if (!attivo()) return;
      rumore(0.45, "bandpass", 300, 2200, 0.18);
    },
    /* fanfara: arpeggio che sale */
    fanfara: function (stelle) {
      if (!attivo()) return;
      var c = contesto();
      if (!c) return;
      var t = c.currentTime + 0.01;
      [523.25, 659.25, 783.99, 1046.5].slice(0, 1 + (stelle || 3)).forEach(function (f, i) {
        nota(f, t + i * 0.11, 0.5, 0.1, "triangle");
        nota(f / 2, t + i * 0.11, 0.4, 0.05, "sine");
      });
    },
    /* stella: un tintinnio */
    stella: function (i) {
      if (!attivo()) return;
      var c = contesto();
      if (!c) return;
      var f = [880, 1108.73, 1318.51][Math.min(2, i || 0)];
      nota(f, c.currentTime + 0.005, 0.5, 0.1, "sine");
      nota(f * 1.5, c.currentTime + 0.03, 0.4, 0.04, "sine");
    },

    sblocca: function () {
      var c = contesto();
      if (c && c.state === "suspended") { try { c.resume(); } catch (e) { /* niente */ } }
    },
    /* Battito doppio (lub-dub) */
    battito: function (volume) {
      if (!attivo()) return;
      var c = contesto();
      if (!c) return;
      var v = volume === undefined ? 0.5 : volume;
      var t = c.currentTime + 0.01;
      colpo(t, v);
      colpo(t + 0.16, v * 0.6);
    },
    /* Un piccolo suono di scoperta: due note morbide */
    scoperta: function () {
      if (!attivo()) return;
      var c = contesto();
      if (!c) return;
      var t = c.currentTime + 0.01;
      [523.25, 783.99].forEach(function (f, i) {
        var o = c.createOscillator();
        var g = c.createGain();
        o.type = "triangle";
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t + i * 0.12);
        g.gain.exponentialRampToValueAtTime(0.12, t + i * 0.12 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.12 + 0.6);
        o.connect(g);
        g.connect(c.destination);
        o.start(t + i * 0.12);
        o.stop(t + i * 0.12 + 0.65);
      });
    },
    /* Una folata di vento: rumore filtrato che sale e scende */
    vento: function () {
      if (!attivo()) return;
      var c = contesto();
      if (!c) return;
      var durata = 1.6, n = Math.floor(c.sampleRate * durata);
      var buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
      for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
      var src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
      src.buffer = buf;
      f.type = "bandpass";
      f.frequency.setValueAtTime(400, c.currentTime);
      f.frequency.linearRampToValueAtTime(900, c.currentTime + durata / 2);
      f.frequency.linearRampToValueAtTime(300, c.currentTime + durata);
      g.gain.setValueAtTime(0.0001, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.25, c.currentTime + 0.4);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + durata);
      src.connect(f); f.connect(g); g.connect(c.destination);
      src.start();
    },
    /* Un tonfo leggero (il cocco sulla sabbia) */
    tonfo: function () {
      if (!attivo()) return;
      var c = contesto();
      if (!c) return;
      colpo(c.currentTime + 0.01, 0.3);
    }
  };
})();
