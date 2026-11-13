/*
 * Respira — testi in italiano.
 * Tutti i testi del gioco stanno qui: per tradurre basta copiare questo file e tradurre i valori.
 * Regola: poche parole. Una riga alla volta. Si impara facendo, non leggendo.
 */
window.TESTI = {
  gioco: {
    titolo: "Respira",
    sottotitolo: "Un viaggio dentro le storie, e dentro il tuo corpo",
    inizia: "Inizia",
    continua: "Continua",
    ricomincia: "Ricomincia",
    impostazioni: "Impostazioni",
    quaderno: "Quaderno",
    chiudi: "Chiudi",
    avanti: "Avanti",
    ascolta: "Ascolta",
    battitoSimulato: "simulato",
    ruota: "Gira il telefono in orizzontale.",
    avviso: "È un gioco, non una cura. Il battito sullo schermo è simulato. Non raccoglie nessun dato.",
    tocca: "tocca"
  },

  impostazioni: {
    titolo: "Impostazioni",
    testoGrande: "Testo grande",
    voce: "Leggi i testi ad alta voce",
    vibrazione: "Vibrazione a tempo di battito",
    suoni: "Suoni",
    movimentoRidotto: "Meno movimento sullo schermo"
  },

  quaderno: {
    titolo: "Il quaderno",
    vuoto: "Ancora vuoto. Esplora e si riempirà.",
    nuovaPagina: "Nuova pagina nel quaderno"
  },

  livello1: {
    nome: "L'isola",
    prologo: {
      titolo: "L'isola",
      testo: "Andalusia, più di 800 anni fa. Ibn Tufayl racconta di Hayy, un bambino cresciuto da una cerva su un'isola deserta. Ora Hayy sei tu."
    },

    /* obiettivi: la riga fissa in alto */
    obiettivi: {
      segui: "Segui la cerva: tocca il sentiero.",
      animali: "Tocca un animale per osservarlo.",
      trascina: "Trascina l'oggetto su Hayy.",
      salta: "Tocca per saltare!",
      cocchi: "Tocca appena un cocco cade!",
      ascolta: "Tieni il dito sulla cerva.",
      fiori: "Tocca tre punti per piantare i fiori.",
      accendi: "Tocca il bastone vicino al fuoco.",
      ripara: "Tieni premuto quando arriva il vento!",
      calore: "Tocca l'occhio, poi le cose intorno.",
      spiaggia: "Vai alla spiaggia."
    },

    d: {
      inizio: "La cerva ti chiama.",
      diverso: "Hayy non ha corna, né piume, né guscio.",
      copia: "Osserva gli animali. Copiali.",
      capra: "Corna: per difendersi.",
      capraFatto: "Un bastone: le tue corna.",
      uccello: "Piume: per stare al caldo.",
      uccelloFatto: "Un mantello di foglie: le tue piume.",
      tartaruga: "Guscio: per proteggersi.",
      tartarugaFatto: "Uno scudo di corteccia: il tuo guscio.",
      corsa: "La cerva corre. Stalle dietro!",
      corsaFine: "Cuore, respiro, calore: è cambiato tutto insieme.",
      riposo: "Riposa… e tutto torna come prima.",
      inciampo: "Ops!",
      etichettaCuore: "cuore più veloce",
      etichettaRespiro: "respiro più veloce",
      etichettaCalore: "più caldo",
      cocchi: "Occhi, cervello, mano: un messaggio velocissimo.",
      cocchiRisultato: "Tre prove, tre tempi diversi. Media: {media} millesimi.",
      sera: "Si fa sera. La cerva è vecchia e stanca.",
      cuoreCerva: "Il suo cuore ha battuto per tutta la vita.",
      fermo: "Ora si ferma.",
      fiori: "Hayy la saluta così.",
      tuoCuore: "Il tuo cuore è ancora veloce. Le emozioni restano un po' nel sangue.",
      fulmine: "Un fulmine! Le canne bruciano.",
      acceso: "Fuoco! Ora portalo alla grotta.",
      spento: "Si è spento. Torna ad accenderlo.",
      grotta: "Luce e calore.",
      calore: "Guarda il calore delle cose.",
      sasso: "Sasso: 18 gradi.",
      capra2: "Capra: 39 gradi.",
      hayy: "Hayy: 37 gradi.",
      caldoFine: "I corpi vivi restano caldi, sempre uguali.",
      misura: "E il tuo cuore? Contalo per 30 secondi.",
      alba: "All'alba arriva una barca.",
      absal: "È Absal. Insegna a Hayy a parlare.",
      scuola: "Hayy ha impiegato anni a capire da solo. Insieme si impara prima."
    },

    misura: {
      via: "Via",
      dopo: "Dopo",
      conta: "Conta i battiti al polso",
      domanda: "Quanti battiti?",
      conferma: "Ok",
      strano: "Mmm, riprova con calma.",
      risultato: "{bpm} battiti al minuto."
    },

    pagine: {
      parti: { titolo: "Ogni parte ha un compito", testo: "Cuore, polmoni, cervello: ogni organo ha il suo lavoro.", roadmap: "B1.1" },
      insieme: { titolo: "Le parti lavorano insieme", testo: "Quando corri, cuore, respiro e calore cambiano insieme.", roadmap: "B1.2" },
      veloci: { titolo: "Messaggi velocissimi", testo: "Viaggiano lungo i nervi in pochi decimi di secondo.", roadmap: "B1.3" },
      ripeti: { titolo: "Misura più volte", testo: "Una misura sola inganna: si ripete e si confronta.", roadmap: "B1.6" },
      cuore: { titolo: "Il cuore batte sempre", testo: "Per tutta la vita, anche quando dormi.", roadmap: "R1.1" },
      lenti: { titolo: "Messaggi lenti", testo: "Viaggiano nel sangue: un'emozione resta addosso per un po'.", roadmap: "B1.4" },
      equilibrio: { titolo: "Il corpo cerca l'equilibrio", testo: "Resta intorno ai 37 gradi: se fa caldo sudi, se fa freddo tremi.", roadmap: "B1.5" },
      mioBattito: { titolo: "Il mio battito", testo: "{bpm} battiti al minuto.", roadmap: "R1.2" }
    },

    finale: {
      titolo: "Fine della prima pagina",
      diritto: "Imparare è un diritto di tutti.",
      fonte: "Dichiarazione universale dei diritti umani, art. 26",
      domanda: "Cosa avrebbe scoperto Hayy, con una scuola?",
      prossimo: "Prossima pagina: il mare dei venti, con Ulisse.",
      torna: "Torna all'inizio"
    }
  }
};
