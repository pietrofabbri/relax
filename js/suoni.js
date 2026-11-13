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

  window.Suoni = {
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
    /* Un tonfo leggero (il cocco sulla sabbia) */
    tonfo: function () {
      if (!attivo()) return;
      var c = contesto();
      if (!c) return;
      colpo(c.currentTime + 0.01, 0.3);
    }
  };
})();
