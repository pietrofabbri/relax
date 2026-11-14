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
    mondoAColori: "Mondo a colori (invece che a inchiostro)",
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

  /* etichette degli schemi */
  schemi: {
    corpo: { cervello: "cervello", cervelloFa: "pensa e comanda", polmoni: "polmoni", polmoniFa: "prendono l'aria", cuore: "cuore", cuoreFa: "spinge il sangue",
      stomaco: "stomaco", stomacoFa: "digerisce", muscoli: "muscoli", muscoliFa: "muovono" },
    catena: { muscoli: "muscoli", respiro: "respiro", cuore: "cuore", calore: "calore", sudore: "sudore", insieme: "tutto insieme!" },
    riflesso: { occhio: "occhio", nervo: "nervo", cervello: "cervello", mano: "mano", tempo: "≈ 0,2 secondi" },
    media: { media: "media" },
    cuoreGiorno: { numero: "100.000", alGiorno: "battiti al giorno", ancheDormi: "anche di notte" },
    dueStrade: { nervi: "nervi", veloce: "velocissimi", breve: "durano poco", sangue: "sangue", lento: "lenti", dura: "durano a lungo" },
    termostato: { caldo: "caldo", sudi: "sudi", freddo: "freddo", tremi: "tremi", sempre: "il corpo torna sempre a 37 °C" },
    fuocoAria: { legna: "legna", aria: "aria", corpo: "cibo", energia: "aria + cibo = energia" }
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
      segui: { icona: "gazzella", titolo: "La gazzella", libro: ["Hayy è un neonato.", "Una gazzella lo trova e lo allatta."], gioco: "Seguila nel bosco.",
        domanda: { testo: "Chi cresce Hayy?", opzioni: ["un pescatore", "una gazzella", "una lupa"], giusta: 1, riga: 1 } },
      animali: { icona: "foglia", titolo: "Hayy è diverso", libro: ["Hayy cresce con gli animali.", "Non ha corna, né pelo, né guscio.", "Allora li copia: foglie e bastoni."], gioco: "Copia gli animali.",
        domanda: { testo: "Che cosa usa Hayy al posto di corna e pelo?", opzioni: ["foglie e bastoni", "ferro e stoffa"], giusta: 0, riga: 2 } },
      corsa: { icona: "corsa", titolo: "Forte e veloce", libro: ["Hayy diventa grande e forte.", "Corre con le gazzelle."], gioco: "Corri e guarda dentro il corpo.",
        domanda: { testo: "Con chi corre Hayy?", opzioni: ["con i cavalli", "da solo", "con le gazzelle"], giusta: 2, riga: 1 } },
      cocchi: { icona: "cocco", titolo: "Il cibo dell'isola", libro: ["Hayy mangia i frutti dell'isola."], gioco: "Prendi i cocchi al volo.",
        domanda: { testo: "Che cosa mangia Hayy?", opzioni: ["i frutti dell'isola", "il pane"], giusta: 0, riga: 0 } },
      cerva: { icona: "cuore", titolo: "La gazzella muore", libro: ["La gazzella diventa vecchia.", "Un giorno smette di muoversi.", "Hayy vuole capire perché."], gioco: "Ascolta il suo cuore.",
        domanda: { testo: "Che cosa vuole fare Hayy?", opzioni: ["scappare dall'isola", "capire perché non si muove più"], giusta: 1, riga: 2 } },
      fuoco: { icona: "fuoco", titolo: "Il fuoco", libro: ["Un fulmine incendia le canne.", "Hayy scopre luce e calore.", "Porta il fuoco nella sua grotta."], gioco: "Proteggi la fiamma dal vento.",
        domanda: { testo: "Come nasce il fuoco?", opzioni: ["lo accende Absal", "un fulmine incendia le canne", "lo porta il mare"], giusta: 1, riga: 0 } },
      calore: { icona: "termometro", titolo: "Il calore della vita", libro: ["Hayy nota una cosa:", "gli animali vivi sono caldi."], gioco: "Guarda il calore delle cose.",
        domanda: { testo: "Che cosa nota Hayy?", opzioni: ["gli animali vivi sono freddi", "gli animali vivi sono caldi"], giusta: 1, riga: 1 } },
      misura: { icona: "battito", titolo: "Il tuo cuore", libro: ["Hayy misura e confronta tutto."], gioco: "Ora conta il tuo battito." },
      alba: { icona: "barca", titolo: "Absal", libro: ["Passano tanti anni.", "Arriva Absal, da un'altra isola.", "Insegna a Hayy a parlare."], gioco: "Impara le parole con Absal.",
        domanda: { testo: "Che cosa insegna Absal a Hayy?", opzioni: ["a parlare", "a nuotare"], giusta: 0, riga: 2 } }
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

    /* spiegazioni a schede, con uno schema per scheda; alla fine una domanda per andare avanti */
    spiegazioni: {
      parti: {
        titolo: "Come è fatto il corpo",
        schede: [
          { schema: "corpo", testo: "Il corpo è fatto di *parti*.", attesa: 3.4 },
          { schema: "corpo", testo: "Ogni parte ha un *compito*.\nIl cuore spinge il sangue." },
          { schema: "corpo", testo: "Gli animali hanno parti diverse.\nCorna, piume, guscio: ognuna serve a qualcosa." }
        ],
        domanda: { testo: "Che cosa fa il cuore?", opzioni: ["spinge il sangue", "pensa", "digerisce il cibo"], giusta: 0, riga: 1 }
      },
      insieme: {
        titolo: "Quando corri",
        schede: [
          { schema: "catena", testo: "I *muscoli* lavorano e chiedono ossigeno.", attesa: 3.6 },
          { schema: "catena", testo: "Il *respiro* accelera: entra più aria.\nIl *cuore* accelera: porta più sangue." },
          { schema: "catena", testo: "Il corpo si scalda.\nIl *sudore* lo raffredda." }
        ],
        domanda: { testo: "Perché il cuore accelera quando corri?", opzioni: ["perché è stanco", "per portare più ossigeno ai muscoli"], giusta: 1, riga: 1 }
      },
      veloci: {
        titolo: "Messaggi veloci",
        schede: [
          { schema: "riflesso", testo: "L'*occhio* vede il cocco.", attesa: 3.6 },
          { schema: "riflesso", testo: "Un messaggio corre nei *nervi*.\nIl *cervello* decide." },
          { schema: "riflesso", testo: "Un altro messaggio va alla *mano*.\nTutto in circa due decimi di secondo." }
        ],
        domanda: { testo: "Chi decide di muovere la mano?", opzioni: ["l'occhio", "il cervello", "la mano"], giusta: 1, riga: 1 }
      },
      ripeti: {
        titolo: "Come lavora uno scienziato",
        schede: [
          { schema: "media", testo: "Tre prove, tre tempi diversi.", attesa: 2.6 },
          { schema: "media", testo: "Una misura sola può *ingannare*.\nSi ripete e si fa la *media*." }
        ],
        domanda: { testo: "Perché si misura più volte?", opzioni: ["perché una misura sola può ingannare", "per fare in fretta"], giusta: 0, riga: 1 }
      },
      cuore: {
        titolo: "Il cuore",
        schede: [
          { schema: "cuoreGiorno", testo: "Il cuore batte circa *100.000 volte* al giorno.", attesa: 2.6 },
          { schema: "cuoreGiorno", testo: "Non si ferma mai.\nNemmeno quando dormi." }
        ],
        domanda: { testo: "Quando si ferma il cuore di una persona viva?", opzioni: ["di notte", "mai"], giusta: 1, riga: 1 }
      },
      lenti: {
        titolo: "Due strade per i messaggi",
        schede: [
          { schema: "dueStrade", testo: "I messaggi dei *nervi* sono veloci e brevi.", attesa: 2.8 },
          { schema: "dueStrade", testo: "Altri messaggi viaggiano nel *sangue*.\nSono lenti e durano a lungo." },
          { schema: "dueStrade", testo: "Per questo un'emozione forte\nresta addosso per un po'." }
        ],
        domanda: { testo: "Dopo uno spavento il cuore resta veloce. Perché?", opzioni: ["il messaggio viaggia nel sangue e dura", "il cuore si è rotto"], giusta: 0, riga: 1 }
      },
      equilibrio: {
        titolo: "Il termostato del corpo",
        schede: [
          { schema: "termostato", testo: "Il corpo resta intorno ai *37 gradi*.", attesa: 3.4 },
          { schema: "termostato", testo: "Se fa caldo, *sudi*.\nSe fa freddo, *tremi*." }
        ],
        domanda: { testo: "Se hai molto caldo, il corpo…", opzioni: ["trema", "suda"], giusta: 1, riga: 1 }
      },
      fuocoAria: {
        titolo: "Il fuoco e il corpo",
        schede: [
          { schema: "fuocoAria", testo: "Il fuoco brucia la legna con l'*aria*.", attesa: 3.2 },
          { schema: "fuocoAria", testo: "Il corpo fa qualcosa di simile:\nusa l'aria per avere *energia* dal cibo." },
          { schema: "fuocoAria", testo: "Per questo respiri.\nLo scoprirai con Ulisse!" }
        ],
        domanda: { testo: "A che cosa serve l'aria al corpo?", opzioni: ["ad avere energia dal cibo", "a rinfrescare i capelli"], giusta: 0, riga: 1 }
      }
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
