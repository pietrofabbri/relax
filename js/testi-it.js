/*
 * Respira — testi in italiano.
 * Tutti i testi del gioco stanno qui: per tradurre basta copiare questo file e tradurre i valori.
 * Regole: frasi corte (una idea per frase). Una riga alla volta. Si impara facendo, non leggendo.
 * Le parole tra *asterischi* vengono evidenziate a colori.
 */
window.TESTI = {
  gioco: {
    titolo: "Respira",
    sottotitolo: "Entra nelle storie. Scopri il tuo corpo.",
    inizia: "Gioca",
    continua: "Continua",
    ricomincia: "Ricomincia",
    impostazioni: "Impostazioni",
    quaderno: "Album",
    chiudi: "Chiudi",
    avanti: "Avanti",
    ascolta: "Ascolta",
    battitoSimulato: "simulato",
    ruota: "Gira il telefono in orizzontale.",
    avviso: "È un gioco, non una cura. Il battito sullo schermo è simulato. Il gioco non raccoglie dati.",
    tocca: "tocca",
    installa: "Installa l'app",
    iosTitolo: "Mettila sul telefono",
    iosPasso1: "Tocca «Condividi».",
    iosPasso2: "Poi «Aggiungi alla schermata Home».",
    capito: "Ho capito",
    salta: "Salta",
    tocchi: "Tocca per continuare",
    seiQui: "Sei qui",
    nelLibro: "Nel libro",
    nelGioco: "Nel gioco",
    capitolo: "Capitolo",
    storia: "La storia"
  },

  impostazioni: {
    titolo: "Impostazioni",
    testoGrande: "Testo grande",
    voce: "Lettura ad alta voce",
    vibrazione: "Vibrazione col battito",
    suoni: "Suoni",
    movimentoRidotto: "Meno movimento",
    disegno: "Il tuo disegno come fondale",
    scegliFoto: "Scegli le foto",
    togliFoto: "Togli",
    disegnoNota: "Fotografa i fogli dall'alto, con buona luce. Più fogli? Sceglili da sinistra a destra. Le foto restano su questo telefono.",
    preparo: "Preparo il disegno…"
  },

  quaderno: {
    titolo: "Album delle scoperte",
    vuoto: "Ancora vuoto. Gioca e trova le carte!",
    nuovaPagina: "Nuova carta!",
    raccolte: "carte",
    bloccata: "Ancora da scoprire"
  },

  livello1: {
    nome: "L'isola",

    /* prologo: poche parole, molte immagini */
    prologo: [
      { immagine: "cartina-andalus", testo: "*Al-Andalus*: oggi Spagna e Portogallo.\nPiù di 800 anni fa." },
      { immagine: "libro", testo: "Il medico *Ibn Tufayl*\nscrive una storia." },
      { immagine: "cartina-isola", testo: "Un'isola deserta,\nvicino all'*India*." },
      { immagine: "gazzella-bimbo", testo: "Un neonato è solo.\nUna *gazzella* lo cresce." },
      { immagine: "bimbo", testo: "Si chiama *Hayy*.\nOra Hayy sei tu!" }
    ],

    /* i capitoli della storia: uno per tappa. libro = cosa succede nel libro; gioco = cosa fai tu */
    capitoli: {
      segui: { icona: "gazzella", titolo: "La gazzella", libro: ["Hayy è un neonato.", "Una gazzella lo trova e lo allatta."], gioco: "Seguila nel bosco." },
      animali: { icona: "foglia", titolo: "Hayy è diverso", libro: ["Hayy cresce con gli animali.", "Non ha corna, né pelo, né guscio.", "Allora li copia: foglie e bastoni."], gioco: "Copia gli animali." },
      corsa: { icona: "corsa", titolo: "Forte e veloce", libro: ["Hayy diventa grande e forte.", "Corre con le gazzelle."], gioco: "Corri e guarda dentro il corpo." },
      cocchi: { icona: "cocco", titolo: "Il cibo dell'isola", libro: ["Hayy mangia i frutti dell'isola."], gioco: "Prendi i cocchi al volo." },
      cerva: { icona: "cuore", titolo: "La gazzella muore", libro: ["La gazzella diventa vecchia.", "Un giorno smette di muoversi.", "Hayy vuole capire perché."], gioco: "Ascolta il suo cuore." },
      fuoco: { icona: "fuoco", titolo: "Il fuoco", libro: ["Un fulmine incendia le canne.", "Hayy scopre luce e calore.", "Porta il fuoco nella sua grotta."], gioco: "Proteggi la fiamma dal vento." },
      calore: { icona: "termometro", titolo: "Il calore della vita", libro: ["Hayy nota una cosa:", "gli animali vivi sono caldi."], gioco: "Guarda il calore delle cose." },
      misura: { icona: "battito", titolo: "Il tuo cuore", libro: ["Hayy misura e confronta tutto."], gioco: "Ora conta il tuo battito." },
      alba: { icona: "barca", titolo: "Absal", libro: ["Passano tanti anni.", "Arriva Absal, da un'altra isola.", "Insegna a Hayy a parlare."], gioco: "Impara le parole con Absal." }
    },

    /* obiettivi: la riga fissa in alto */
    obiettivi: {
      segui: "Tocca il sentiero: segui la gazzella",
      animali: "Tocca un animale",
      trascina: "Trascina l'oggetto su Hayy",
      salta: "Tocca per saltare!",
      cocchi: "Tocca appena cade un cocco!",
      ascolta: "Tieni il dito sulla gazzella",
      fiori: "Tocca tre volte: tre fiori",
      accendi: "Tocca il bastone",
      ripara: "Arriva il vento? Tieni premuto!",
      calore: "Tocca l'occhio, poi le cose",
      spiaggia: "Vai verso la spiaggia",
      parole: "Tocca la cosa giusta"
    },

    /* nomi delle tappe */
    tappe: {
      segui: "Segui la gazzella",
      animali: "Copia gli animali",
      corsa: "Corri!",
      cocchi: "Riflessi",
      cerva: "Il cuore della gazzella",
      fuoco: "Il fuoco",
      calore: "La vista del calore",
      misura: "Il tuo cuore",
      alba: "Absal"
    },

    d: {
      super: "SUPER!",
      salto: "SALTO!",
      presto: "PRESTO!",
      riprova: "Riprova!",
      fulmine2: "FULMINE!",
      ottimo: "OTTIMO!",
      bene: "BENE!",
      lento: "LENTO",
      fuocoPreso: "FUOCO!",
      vento: "VENTO!",
      parata: "PARATA!",
      spentoBreve: "SPENTO!",
      casa: "CASA!",
      amico: "UN AMICO!",
      giusto: "GIUSTO!",
      sbagliato: "NO…",

      indovinaCorsa: "Se Hayy corre, il cuore…",
      accelera: "accelera",
      rallenta: "rallenta",
      indovinaCuore: "Dopo una grande emozione, il cuore si calma…",
      subito: "subito",
      piano: "piano piano",
      indovinaCalore: "Chi è più caldo?",
      ilSasso: "il sasso",
      laCapra: "la capra",
      indovinaFuoco: "Per bruciare, il fuoco ha bisogno di…",
      aria: "aria",
      acqua: "acqua",
      rispostaFuoco: "Aria! Anche il tuo corpo brucia il cibo con l'*aria*.",

      inizio: "La gazzella ti chiama.",
      copia: "Niente corna, piume o guscio?\nCopia gli animali!",
      capra: "*Corna*: per difendersi.",
      capraFatto: "Un bastone: le tue corna!",
      uccello: "*Piume*: per stare al caldo.",
      uccelloFatto: "Foglie: le tue piume!",
      tartaruga: "*Guscio*: per proteggersi.",
      tartarugaFatto: "Corteccia: il tuo guscio!",
      corsa: "La gazzella corre. Seguila!",
      corsaFine: "*Cuore*, *respiro*, *calore*:\ncambiano tutti insieme!",
      riposo: "Riposa. Tutto torna calmo.",
      inciampo: "OPS!",
      etichettaCuore: "cuore più veloce",
      etichettaRespiro: "respiro più veloce",
      etichettaCalore: "più caldo",
      cocchi: "Occhio → cervello → mano.\nQuanto sei veloce?",
      cocchiRisultato: "Media: *{media}* millesimi di secondo.",
      sera: "È sera. La gazzella è vecchia e stanca.",
      cuoreCerva: "Il suo cuore ha battuto per tutta la vita.",
      fermo: "Ora si ferma.",
      fiori: "Hayy la saluta così.",
      tuoCuore: "Le emozioni viaggiano nel *sangue*.\nPer questo durano un po'.",
      fulmine: "Un fulmine! Le canne bruciano!",
      acceso: "Portalo alla grotta!",
      spento: "Si è spento. Riaccendilo!",
      grotta: "Luce e calore!",
      calore: "Guarda il calore delle cose.",
      sasso: "Sasso: 18 gradi.",
      capra2: "Capra: 39 gradi.",
      hayy: "Hayy: 37 gradi.",
      caldoFine: "Chi è vivo resta caldo.\nSempre alla stessa temperatura.",
      misura: "E il tuo cuore? Contalo per 30 secondi.",
      alba: "All'alba arriva una barca.",
      absal: "È *Absal*. Viene da un'altra isola.",
      absalParole: "Absal insegna a Hayy le parole.",
      scuola: "Da solo, Hayy ci ha messo anni.\nInsieme si impara prima!",
    },

    /* le parole che Absal insegna, nella sua lingua (arabo), con la pronuncia */
    parole: [
      { id: "fuoco", ar: "نار", tr: "nār", it: "fuoco" },
      { id: "capra", ar: "ماعز", tr: "māʿiz", it: "capra" },
      { id: "barca", ar: "قارب", tr: "qārib", it: "barca" }
    ],

    misura: {
      via: "Via",
      dopo: "Dopo",
      conta: "Conta i battiti al polso",
      domanda: "Quanti battiti?",
      conferma: "OK",
      strano: "Mmm… Riprova con calma.",
      risultato: "{bpm} battiti al minuto."
    },

    /* le carte dell'album: titolo, una frase, il simbolo e il passo della roadmap */
    pagine: {
      parti: { titolo: "Ogni parte ha un compito", testo: "Cuore, polmoni, cervello: ognuno fa il suo lavoro.", icona: "puzzle", roadmap: "B1.1" },
      insieme: { titolo: "Lavorano insieme", testo: "Se corri, cuore, respiro e calore cambiano insieme.", icona: "ingranaggi", roadmap: "B1.2" },
      veloci: { titolo: "Messaggi veloci", testo: "Nei nervi un messaggio arriva in un lampo.", icona: "fulmine", roadmap: "B1.3" },
      ripeti: { titolo: "Misura più volte", testo: "Una misura sola può ingannare. Ripeti e confronta.", icona: "ripeti", roadmap: "B1.6" },
      cuore: { titolo: "Il cuore non si ferma", testo: "Batte tutta la vita, anche quando dormi.", icona: "cuore", roadmap: "R1.1" },
      lenti: { titolo: "Messaggi lenti", testo: "Viaggiano nel sangue. Per questo un'emozione dura un po'.", icona: "goccia", roadmap: "B1.4" },
      equilibrio: { titolo: "Sempre 37 gradi", testo: "Se fa caldo sudi, se fa freddo tremi.", icona: "termometro", roadmap: "B1.5" },
      mioBattito: { titolo: "Il mio battito", testo: "{bpm} battiti al minuto.", icona: "battito", roadmap: "R1.2" }
    },

    finale: {
      titolo: "Fine del capitolo",
      diritto: "Imparare è un diritto di tutti.",
      fonte: "Dichiarazione universale dei diritti umani, articolo 26",
      domanda: "E se Hayy avesse avuto una scuola?",
      prossimo: "Prossima storia: Ulisse e il mare dei venti",
      torna: "Torna all'inizio",
      punti: "punti",
      stelle: "stelle",
      carte: "carte"
    }
  }
};
