/* Impostazioni e salvataggio. Tutto resta sul dispositivo (localStorage); se non è disponibile, il gioco funziona lo stesso. */
(function () {
  "use strict";

  var CHIAVE = "respira.v1";

  function leggi() {
    try {
      var grezzo = window.localStorage.getItem(CHIAVE);
      return grezzo ? JSON.parse(grezzo) : {};
    } catch (e) {
      return {};
    }
  }

  var stato = leggi();
  stato.impostazioni = stato.impostazioni || {
    testoGrande: false,
    voce: false,
    vibrazione: true,
    suoni: true,
    movimentoRidotto: false
  };
  stato.progressi = stato.progressi || {};

  function salva() {
    try {
      window.localStorage.setItem(CHIAVE, JSON.stringify(stato));
    } catch (e) {
      /* memoria non disponibile: si gioca senza salvare */
    }
  }

  function applica() {
    document.body.classList.toggle("testo-grande", !!stato.impostazioni.testoGrande);
    document.body.classList.toggle("movimento-ridotto", !!stato.impostazioni.movimentoRidotto);
  }

  window.Salvataggio = {
    impostazioni: function () { return stato.impostazioni; },
    imposta: function (nome, valore) { stato.impostazioni[nome] = valore; salva(); applica(); },
    progressi: function (livello) {
      stato.progressi[livello] = stato.progressi[livello] || {};
      return stato.progressi[livello];
    },
    salvaProgressi: salva,
    azzera: function () { stato.progressi = {}; salva(); },
    applica: applica
  };
})();
