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
    neurone: { neurone: "neurone", filo: "filo lungo (assone)", elettrico: "segnale elettrico", velocita: "fino a 100 metri al secondo", sinapsi: "sinapsi", chimica: "passa una sostanza chimica" },
    tempi: { viaggio1: "viaggio nei nervi", cervello: "il cervello capisce e decide", muscolo: "il muscolo si muove", totale: "in tutto ≈ 0,2 secondi" },
    cuoreGiorno: { numero: "100.000", alGiorno: "battiti al giorno", ancheDormi: "anche di notte" },
    dueStrade: { nervi: "nervi", veloce: "velocissimi", breve: "durano poco", sangue: "sangue", lento: "lenti", dura: "durano a lungo" },
    termostato: { caldo: "caldo", sudi: "sudi", freddo: "freddo", tremi: "tremi", sempre: "il cervello riporta il corpo a 37 °C" },
    fuocoAria: { legna: "legna", aria: "ossigeno", corpo: "cibo", energia: "ossigeno + cibo = energia" }
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
        domanda: { testo: "Sull'isola non ci sono adulti né libri. Come potrà imparare Hayy?", opzioni: ["osservando gli animali e la natura", "andando a scuola", "chiedendo ai vicini"], giusta: 0, aiuto: "Chi c'è sull'isola, oltre a Hayy?" } },
      animali: { icona: "foglia", titolo: "Hayy è diverso", libro: ["Hayy cresce con gli animali.", "Non ha corna, né pelo, né guscio.", "Allora li copia: foglie e bastoni."], gioco: "Copia gli animali.",
        domanda: { testo: "Hayy usa un bastone al posto delle corna. Che cosa potrebbe usare per scavare, al posto degli artigli?", opzioni: ["una piuma", "una pietra appuntita", "una foglia"], giusta: 1, aiuto: "Gli artigli sono duri e appuntiti." } },
      corsa: { icona: "corsa", titolo: "Forte e veloce", libro: ["Hayy diventa grande e forte.", "Corre con le gazzelle."], gioco: "Corri e guarda dentro il corpo.",
        domanda: { testo: "Dopo la corsa Hayy ha il fiato corto. Se si siede e aspetta, che cosa succede?", opzioni: ["il respiro resta veloce per sempre", "il respiro torna calmo da solo", "smette di respirare"], giusta: 1, aiuto: "Quando hai finito di correre, che cosa ti succede?" } },
      cocchi: { icona: "cocco", titolo: "Il cibo dell'isola", libro: ["Hayy mangia i frutti dell'isola."], gioco: "Prendi i cocchi al volo.",
        domanda: { testo: "Hayy non sa quali frutti sono buoni. Come può scoprirlo senza rischiare troppo?", opzioni: ["osserva che cosa mangiano gli animali", "assaggia tutto quello che trova", "aspetta che qualcuno glielo dica"], giusta: 0, aiuto: "Hayy impara sempre guardando gli animali." } },
      cerva: { icona: "cuore", titolo: "La gazzella muore", libro: ["La gazzella diventa vecchia.", "Un giorno smette di muoversi.", "Hayy vuole capire perché."], gioco: "Ascolta il suo cuore.",
        domanda: { testo: "La gazzella non si muove più, ma fuori non ha ferite. Dove penserà Hayy di cercare il problema?", opzioni: ["dentro il corpo", "nel cielo", "nell'acqua del mare"], giusta: 0, aiuto: "Fuori sembra tutto a posto…" } },
      fuoco: { icona: "fuoco", titolo: "Il fuoco", libro: ["Un fulmine incendia le canne.", "Hayy scopre luce e calore.", "Porta il fuoco nella sua grotta."], gioco: "Proteggi la fiamma dal vento.",
        domanda: { testo: "Perché Hayy porta il fuoco proprio nella grotta?", opzioni: ["per ripararlo da vento e pioggia", "perché il fuoco ha paura del buio", "per nasconderlo alla gazzella"], giusta: 0, aiuto: "Che cosa ha rischiato di spegnere la fiamma, mentre la portavi?" } },
      calore: { icona: "termometro", titolo: "Il calore della vita", libro: ["Hayy nota una cosa:", "gli animali vivi sono caldi."], gioco: "Guarda il calore delle cose.",
        domanda: { testo: "Hayy tocca un sasso al sole e una capra all'ombra. Che cosa scopre?", opzioni: ["la capra è calda anche all'ombra", "il sasso è sempre più caldo", "sono uguali"], giusta: 0, aiuto: "Un corpo vivo produce calore da sé." } },
      misura: { icona: "battito", titolo: "Il tuo cuore", libro: ["Hayy misura e confronta tutto."], gioco: "Ora conta il tuo battito." },
      alba: { icona: "barca", titolo: "Absal", libro: ["Passano tanti anni.", "Arriva Absal, da un'altra isola.", "Insegna a Hayy a parlare."], gioco: "Impara le parole con Absal.",
        domanda: { testo: "Perché per Hayy imparare a parlare è così importante?", opzioni: ["per comandare gli animali", "per imparare dagli altri ciò che da solo non ha scoperto", "per diventare re dell'isola"], giusta: 1, aiuto: "Da solo, Hayy ci ha messo anni a capire ogni cosa." } }
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
      cocchi: "Quanto sei veloce a reagire?",
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
          { schema: "corpo", testo: "Il corpo è fatto di *organi*.\nOgnuno ha un *compito*.", attesa: 3.6 },
          { schema: "corpo", testo: "Il cervello comanda. I polmoni prendono l'aria.\nIl cuore spinge il sangue. I muscoli muovono." },
          { schema: "corpo", testo: "Anche gli animali hanno parti con compiti diversi:\ncorna per difendersi, piume per scaldarsi." }
        ],
        domanda: { testo: "In questo momento stai leggendo. Quale organo sta lavorando di più?", opzioni: ["lo stomaco", "il cervello", "i muscoli delle gambe"], giusta: 1, aiuto: "Chi capisce le parole che leggi?" }
      },
      insieme: {
        titolo: "Quando corri",
        schede: [
          { schema: "catena", testo: "I *muscoli* lavorano. Per lavorare bruciano zuccheri con l'*ossigeno*.", attesa: 3.6, fino: 1 },
          { schema: "catena", testo: "Il *respiro* accelera: entra più ossigeno.\nIl *cuore* accelera: lo porta ai muscoli col sangue.", fino: 5 },
          { schema: "catena", testo: "Lavorando, i muscoli producono *calore*.\nIl *sudore* evapora e raffredda la pelle." }
        ],
        domanda: { testo: "Sali le scale di corsa. Che cosa NON succede?", opzioni: ["il respiro accelera", "il cuore accelera", "il corpo si raffredda"], giusta: 2, aiuto: "I muscoli al lavoro producono calore." }
      },
      veloci: {
        titolo: "Come viaggiano i messaggi nei nervi",
        schede: [
          { schema: "neurone", testo: "I nervi sono fatti di cellule lunghe e sottili:\ni *neuroni*.", attesa: 3.2, fino: 2 },
          { schema: "neurone", testo: "Lungo il neurone corre un piccolo *segnale elettrico*.\nPuò andare a 100 metri al secondo: più di un'auto in autostrada.", fino: 3 },
          { schema: "neurone", testo: "Tra un neurone e l'altro c'è un piccolo spazio: la *sinapsi*.\nLì il messaggio passa con una sostanza chimica." },
          { schema: "riflesso", testo: "Occhio → cervello → mano:\nin tutto circa *due decimi di secondo*.", attesa: 3.4 },
          { schema: "tempi", testo: "Il viaggio nei nervi è rapidissimo.\nLa maggior parte del tempo serve al *cervello* per capire e decidere.", attesa: 3 }
        ],
        domanda: { testo: "Se sei stanco o distratto, prendi il cocco più tardi. Perché?", opzioni: ["i nervi si accorciano", "il cervello ci mette di più a capire e decidere", "il segnale elettrico si spegne"], giusta: 1, aiuto: "In una reazione, dove si spende la maggior parte del tempo?" }
      },
      ripeti: {
        titolo: "Come lavora uno scienziato",
        schede: [
          { schema: "media", testo: "Tre prove, tre tempi diversi.\nNessuna è sbagliata: ogni misura varia un po'.", attesa: 2.8 },
          { schema: "media", testo: "Per questo si misura più volte\ne si fa la *media*: la somma diviso il numero di prove." }
        ],
        domanda: { testo: "Tre prove: 300, 200 e 250 millesimi. Qual è la media?", opzioni: ["200", "250", "750"], giusta: 1, aiuto: "Somma i tre tempi, poi dividi per 3." }
      },
      cuore: {
        titolo: "Il cuore",
        schede: [
          { schema: "cuoreGiorno", testo: "Il cuore è un *muscolo* che si stringe e spinge il sangue.\nOgni stretta è un *battito*.", attesa: 2.8, fino: 1 },
          { schema: "cuoreGiorno", testo: "Batte circa *100.000 volte* al giorno.\nNon si riposa mai: nemmeno quando dormi." }
        ],
        domanda: { testo: "Più o meno quante volte batte il cuore in 10 giorni?", opzioni: ["circa 10.000", "circa 1 milione", "circa 100"], giusta: 1, aiuto: "100.000 al giorno, per 10 giorni." }
      },
      lenti: {
        titolo: "Due strade per i messaggi",
        schede: [
          { schema: "dueStrade", testo: "I messaggi dei *nervi* sono veloci e durano poco.", attesa: 2.8, fino: 1 },
          { schema: "dueStrade", testo: "Altri messaggi, gli *ormoni*, viaggiano nel *sangue*.\nUno si chiama *adrenalina*: arriva con la paura e fa battere forte il cuore." },
          { schema: "dueStrade", testo: "Gli ormoni restano nel sangue per minuti.\nPer questo un'emozione forte non passa subito." }
        ],
        domanda: { testo: "Hai litigato con un amico. Lui è andato via, ma tu sei ancora agitato. Perché?", opzioni: ["l'adrenalina è ancora nel sangue", "i nervi sono rotti", "il cuore si è stancato"], giusta: 0, aiuto: "Quale strada dei messaggi dura più a lungo?" }
      },
      equilibrio: {
        titolo: "Il termostato del corpo",
        schede: [
          { schema: "termostato", testo: "Il corpo resta intorno ai *37 gradi*.\nUna parte del cervello controlla, come un termostato.", attesa: 3.4, fino: 1 },
          { schema: "termostato", testo: "Se hai caldo, *sudi*: il sudore evapora e ti raffredda.", fino: 2 },
          { schema: "termostato", testo: "Se hai freddo, *tremi*: i muscoli si muovono\ne, lavorando, producono calore." }
        ],
        domanda: { testo: "Fuori fa freddissimo e tu batti i denti. A che cosa serve?", opzioni: ["a scaldarti: i muscoli producono calore", "a raffreddarti", "a niente: è solo paura"], giusta: 0, aiuto: "Che cosa producono i muscoli quando lavorano?" }
      },
      fuocoAria: {
        titolo: "Il fuoco e il corpo",
        schede: [
          { schema: "fuocoAria", testo: "Il fuoco brucia la legna usando l'*ossigeno* dell'aria.", attesa: 3.2, fino: 1 },
          { schema: "fuocoAria", testo: "Le cellule del corpo fanno qualcosa di simile, ma piano:\nusano l'ossigeno per avere *energia* dal cibo.", fino: 3 },
          { schema: "fuocoAria", testo: "Per questo respiri, sempre.\nLo scoprirai con Ulisse!" }
        ],
        domanda: { testo: "Copri una candela accesa con un barattolo. Che cosa succede?", opzioni: ["brucia più forte", "si spegne: finisce l'ossigeno", "non cambia niente"], giusta: 1, aiuto: "Di che cosa ha bisogno il fuoco per bruciare?" }
      }
    },

    /* le carte dell'album: titolo, una frase, il simbolo e il passo della roadmap */
    pagine: {
      parti: { titolo: "Ogni parte ha un compito", testo: "Cuore, polmoni, cervello: ognuno fa il suo lavoro.", icona: "puzzle", roadmap: "B1.1" },
      insieme: { titolo: "Lavorano insieme", testo: "Se corri, cuore, respiro e calore cambiano insieme.", icona: "ingranaggi", roadmap: "B1.2" },
      veloci: { titolo: "Neuroni e riflessi", testo: "Nei neuroni corre un segnale elettrico, fino a 100 m al secondo. La maggior parte del tempo di una reazione serve al cervello.", icona: "fulmine", roadmap: "B1.3" },
      ripeti: { titolo: "Misura più volte", testo: "Ogni misura varia un po': si ripete e si fa la media.", icona: "ripeti", roadmap: "B1.6" },
      cuore: { titolo: "Il cuore non si ferma", testo: "Batte tutta la vita, anche quando dormi.", icona: "cuore", roadmap: "R1.1" },
      lenti: { titolo: "Ormoni: messaggi lenti", testo: "Gli ormoni, come l'adrenalina, viaggiano nel sangue e durano minuti.", icona: "goccia", roadmap: "B1.4" },
      equilibrio: { titolo: "Sempre 37 gradi", testo: "Sudore per raffreddare, brividi per scaldare: il cervello fa da termostato.", icona: "termometro", roadmap: "B1.5" },
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
