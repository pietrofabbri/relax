/* Lettura ad alta voce con la sintesi vocale del browser (standard Web Speech). Facoltativa. */
(function () {
  "use strict";

  var disponibile = typeof window.speechSynthesis !== "undefined" && typeof window.SpeechSynthesisUtterance !== "undefined";

  function scegliVoce() {
    if (!disponibile) return null;
    var voci = window.speechSynthesis.getVoices() || [];
    for (var i = 0; i < voci.length; i++) {
      if (voci[i].lang && voci[i].lang.toLowerCase().indexOf("it") === 0) return voci[i];
    }
    return null;
  }

  window.Voce = {
    disponibile: disponibile,
    leggi: function (testo) {
      if (!disponibile || !testo) return;
      try {
        window.speechSynthesis.cancel();
        var u = new window.SpeechSynthesisUtterance(testo);
        u.lang = "it-IT";
        u.rate = 0.95;
        var v = scegliVoce();
        if (v) u.voice = v;
        window.speechSynthesis.speak(u);
      } catch (e) { /* nessuna voce disponibile */ }
    },
    zitto: function () {
      if (!disponibile) return;
      try { window.speechSynthesis.cancel(); } catch (e) { /* niente */ }
    }
  };
})();
