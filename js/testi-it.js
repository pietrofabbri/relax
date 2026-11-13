/*
 * Respira — testi in italiano.
 * Tutti i testi del gioco stanno qui: per tradurre il gioco basta copiare
 * questo file (per esempio testi-en.js) e tradurre i valori, senza toccare il codice.
 * Regole: frasi brevi, parole semplici, comprensibili a 12 anni; nessuna citazione
 * testuale dalle opere originali, solo riassunti con parole nostre.
 */
window.TESTI = {
  gioco: {
    titolo: "Respira",
    sottotitolo: "Un viaggio dentro le storie, e dentro il tuo corpo",
    inizia: "Inizia il viaggio",
    continua: "Continua",
    ricomincia: "Ricomincia da capo",
    impostazioni: "Impostazioni",
    quaderno: "Quaderno",
    chiudi: "Chiudi",
    avanti: "Avanti",
    ascolta: "Ascolta",
    battitoSimulato: "simulato",
    ruota: "Il gioco si vede meglio con il telefono in orizzontale.",
    avvisoTerapia:
      "Respira è un gioco educativo. Non è una cura e non sostituisce l'aiuto di un medico o di uno psicologo. " +
      "Se un'emozione o un malessere non passa, parlane con un adulto di cui ti fidi.",
    avvisoBattito:
      "Il battito che vedi in alto è simulato: è il battito del personaggio, non il tuo.",
    salvataggio: "Il gioco ricorda a che punto sei solo su questo dispositivo. Non raccoglie nessun dato."
  },

  impostazioni: {
    titolo: "Impostazioni",
    testoGrande: "Testo grande",
    voce: "Leggi i testi ad alta voce",
    vibrazione: "Vibrazione a tempo di battito (solo alcuni telefoni)",
    suoni: "Suoni",
    movimentoRidotto: "Riduci i movimenti dello schermo"
  },

  quaderno: {
    titolo: "Il quaderno del Guardiano",
    vuoto: "Il quaderno è ancora vuoto. Osserva il mondo e le pagine si riempiranno.",
    nuovaPagina: "Nuova pagina nel quaderno"
  },

  livello1: {
    nome: "L'isola",
    storia: "Hayy ibn Yaqzan",

    prologo: [
      {
        titolo: "Il quaderno si apre",
        testo:
          "Sei il Guardiano. Hai un quaderno di viaggio: ogni pagina è una storia di un altro luogo e di un altro tempo. " +
          "Quando apri una pagina, entri nella storia e diventi uno dei suoi personaggi."
      },
      {
        titolo: "La prima pagina",
        testo:
          "Questa storia l'ha scritta Ibn Tufayl, un medico e filosofo che visse più di 800 anni fa in Andalusia, " +
          "la Spagna dei tempi in cui era governata dagli Arabi. Il suo libro si intitola Hayy ibn Yaqzan."
      },
      {
        titolo: "Diventi Hayy",
        testo:
          "Su un'isola deserta, in mezzo all'oceano, vive un bambino senza genitori. Si chiama Hayy. " +
          "Lo ha cresciuto una cerva, come se fosse suo figlio. Nessuno gli ha mai insegnato niente: " +
          "tutto quello che sa, l'ha scoperto osservando. Ora tu sei Hayy."
      }
    ],

    aiuti: {
      cammina: "Tocca un punto del sentiero per camminare. Tocca gli oggetti con il punto di domanda per osservarli.",
      seguiCerva: "La cerva ti aspetta più avanti.",
      osservaAnimali: "Osserva i tre animali prima di proseguire.",
      vaiPalma: "Vai alla palma di cocco.",
      vaiGrotta: "Vai alla grotta, dove la cerva si è fermata a riposare.",
      vaiCanne: "Laggiù, tra le canne, sta succedendo qualcosa.",
      prendiBastone: "Il fuoco scotta. Cerca un bastone per portarlo con te.",
      portaFuoco: "Porta il fuoco nella grotta.",
      tocca3: "Tocca il sasso, la capra e te stesso per sentire chi è caldo e chi no.",
      vaiSpiaggia: "Sulla spiaggia è arrivato qualcuno.",
      bloccato: "Prima finisci quello che stai facendo qui."
    },

    scene: {
      risveglio: [
        "Ti svegli nel rifugio tra le rocce dove sei cresciuto. La cerva è già fuori e ti chiama.",
        "Il mondo è pieno di cose da scoprire. Hayy non ha libri né maestri: ha solo i suoi occhi, le sue mani e la sua testa."
      ],
      dopoAnimali: [
        "Hayy si accorge di essere diverso dagli animali: non ha corna, né guscio, né ali. All'inizio se ne vergogna.",
        "Poi capisce una cosa importante: ogni parte del corpo ha un compito. E le parti lavorano tutte insieme.",
        "Guarda la cerva che corre: cambiano tante cose nello stesso momento. Respira più in fretta, il cuore batte più forte, il corpo si scalda.",
        "Anche tu hai un cuore che batte. Eccolo, in alto sullo schermo: è il battito di Hayy."
      ],
      riflessiIntro: [
        "Sotto la palma cadono le noci di cocco. Hayy ha imparato ad afferrarle al volo.",
        "Quando vedi cadere il cocco, i tuoi occhi mandano un messaggio al cervello, e il cervello lo manda alla mano. È un messaggio velocissimo, che viaggia lungo i nervi.",
        "Proviamo a misurarlo. Quando vedi il cocco cadere, tocca lo schermo il più in fretta possibile. Faremo tre prove."
      ],
      riflessiFine: [
        "Hai visto? I tre tempi non sono uguali. Per questo gli scienziati non si fidano di una misura sola: misurano più volte e confrontano.",
        "Il messaggio dagli occhi alla mano impiega più o meno due o tre decimi di secondo. Meno di un battito di ciglia."
      ],
      cerva: [
        "La cerva è diventata vecchia. Ora cammina piano e dorme molto.",
        "Hayy si siede accanto a lei e appoggia l'orecchio sul suo fianco. Sente il suo cuore: batte piano, piano.",
        "Il cuore ha battuto per tutta la sua vita, anche mentre dormiva. Ora, dolcemente, si ferma.",
        "Hayy è molto triste. Non capisce: fuori il corpo della cerva sembra intatto. Allora pensa che la vita si nascondesse dentro, nel cuore, e che sia andata via.",
        "Hayy si sbagliava su come funziona il cuore: lo scoprirai più avanti nel viaggio. Ma aveva ragione su una cosa: per capire, bisogna osservare.",
        "Poi, osservando due corvi, Hayy impara a dare sepoltura: copre la cerva con la terra e con le foglie, vicino alla grotta."
      ],
      tristezza: [
        "Senti? Il cuore di Hayy batte più in fretta, anche se il momento è passato.",
        "Il corpo ha anche messaggi lenti: viaggiano nel sangue e durano più a lungo. Per questo un'emozione forte ci resta addosso per un po'.",
        "Ma il corpo cerca sempre l'equilibrio: piano piano, il battito torna come prima."
      ],
      mioBattito: [
        "Ora ascolta il tuo cuore, quello vero.",
        "Appoggia due dita sul polso, dalla parte del pollice, oppure piano sul collo, da un lato solo.",
        "Quando sei pronto, premi Via e conta i battiti per 30 secondi. Poi scrivi il numero."
      ],
      fuocoIntro: [
        "Un giorno, tra le canne vicino alla spiaggia, si accende un fuoco.",
        "Hayy non ha mai visto niente del genere. Fa luce e fa caldo."
      ],
      scotta: [
        "Ahi! Hayy prova ad afferrare la fiamma con la mano, e si scotta.",
        "Il dolore arriva subito: è un altro messaggio velocissimo, che dice alla mano di ritirarsi."
      ],
      bastone: ["Hayy accende la punta di un bastone. Così può portare il fuoco con sé, senza bruciarsi."],
      grottaAccesa: [
        "La grotta si illumina. Hayy si siede vicino al fuoco e si scalda.",
        "Gli viene un'idea: anche i corpi vivi sono caldi. Forse la vita ha qualcosa a che fare con il calore."
      ],
      caldoFreddo: {
        sasso: "Il sasso è freddo, ha la temperatura dell'aria intorno.",
        capra: "La capra è calda: circa 39 gradi. Il suo corpo produce calore.",
        hayy: "Anche tu sei caldo: circa 36 o 37 gradi, sempre più o meno uguale, che fuori faccia caldo o freddo."
      },
      dopoCaldo: [
        "Il corpo tiene la sua temperatura in equilibrio. Quando fa caldo suda, e il sudore lo rinfresca. Quando fa freddo trema, e tremando si scalda.",
        "Hayy non conosceva ancora queste parole. Ma, osservando, aveva capito molto."
      ],
      secondaMisura: [
        "Un'ultima cosa, prima di proseguire. Vuoi misurare di nuovo il tuo battito?",
        "Una misura sola può ingannare: confrontandone due, capisci meglio."
      ],
      absal: [
        "Sulla spiaggia è arrivata una barca. Ne scende un uomo: si chiama Absal, e viene da un'isola vicina.",
        "All'inizio Hayy e Absal si guardano con sospetto. Poi Absal insegna a Hayy a parlare, e Hayy gli racconta tutto quello che ha scoperto da solo.",
        "Absal è stupito: sull'isola da cui viene, molte di queste cose si imparano da piccoli, senza dover ricominciare da zero.",
        "Hayy ha impiegato anni a capire ciò che si può imparare in poco tempo, se qualcuno te lo insegna. Per questo imparare è un diritto di tutti."
      ]
    },

    animali: {
      capra: {
        nome: "La capra",
        testo: "Ha le corna per difendersi e una pelliccia folta per il freddo. Le zampe con gli zoccoli si arrampicano sulle rocce."
      },
      uccello: {
        nome: "L'uccello",
        testo: "Ha le ali per volare e le piume che lo tengono caldo e asciutto. Il becco gli serve come una mano."
      },
      tartaruga: {
        nome: "La tartaruga",
        testo: "Ha un guscio duro che la protegge. È lenta, ma non ha bisogno di scappare: si chiude dentro."
      }
    },

    riflessi: {
      pronto: "Pronto? Tocca Inizia, poi aspetta che il cocco cada.",
      inizia: "Inizia",
      aspetta: "Aspetta…",
      ora: "Ora!",
      presto: "Troppo presto! Aspetta che il cocco inizi a cadere.",
      mancato: "Il cocco è caduto sulla sabbia. Nessun problema, riprova.",
      tempo: "Tempo: {ms} millesimi di secondo",
      prova: "Prova {n} di 3",
      risultati: "I tuoi tre tempi: {lista}. Media: {media} millesimi di secondo."
    },

    misura: {
      via: "Via",
      secondi: "{s} secondi",
      conta: "Conta i battiti…",
      domanda: "Quanti battiti hai contato in 30 secondi?",
      conferma: "Conferma",
      salta: "Non ora",
      risultato: "Il tuo cuore batte circa {bpm} volte al minuto (hai contato {n} battiti in 30 secondi, per 2).",
      confronto: "Prima misura: {a} battiti al minuto. Seconda misura: {b}. Sono diverse? È normale: il battito cambia di continuo.",
      fuoriScala: "Mmm, questo numero sembra strano. Riprova a contare con calma.",
      nota: "Nel gioco il battito resta simulato: è quello di Hayy, non il tuo."
    },

    pagine: [
      {
        id: "parti",
        titolo: "Ogni parte ha un compito",
        testo: "Il corpo è fatto di parti, gli organi. Ognuna ha il suo compito: il cuore pompa il sangue, i polmoni prendono l'aria, lo stomaco digerisce, il cervello pensa e comanda.",
        roadmap: "B1.1"
      },
      {
        id: "insieme",
        titolo: "Le parti lavorano insieme",
        testo: "Quando corri cambiano tante cose nello stesso momento: respiri più in fretta, il cuore batte più forte, ti scaldi. Le parti del corpo lavorano in squadra.",
        roadmap: "B1.2"
      },
      {
        id: "veloci",
        titolo: "Messaggi velocissimi",
        testo: "Le parti del corpo si mandano messaggi. Alcuni sono velocissimi: viaggiano lungo i nervi, come lungo dei fili, e arrivano in pochi decimi di secondo.",
        roadmap: "B1.3"
      },
      {
        id: "cuore",
        titolo: "Il cuore batte sempre",
        testo: "Il cuore batte per tutta la vita, anche quando dormi. Non devi pensarci tu: lavora da solo.",
        roadmap: "R1.1"
      },
      {
        id: "lenti",
        titolo: "Messaggi lenti",
        testo: "Altri messaggi del corpo sono lenti: viaggiano nel sangue e durano a lungo. Per questo, dopo uno spavento o una tristezza, il cuore resta veloce ancora per un po'.",
        roadmap: "B1.4"
      },
      {
        id: "equilibrio",
        titolo: "Il corpo cerca l'equilibrio",
        testo: "Il corpo si sposta, poi torna da solo come prima. Il battito sale e poi scende. La temperatura resta intorno ai 36-37 gradi: se fa caldo sudi, se fa freddo tremi.",
        roadmap: "B1.5"
      },
      {
        id: "misurare",
        titolo: "Misurare, ripetere, confrontare",
        testo: "Per capire il corpo si osserva e si misura. Ma una misura sola può ingannare: si ripete e si confronta. E si può sbagliare, come Hayy. Anche questo fa parte della scienza.",
        roadmap: "B1.6"
      }
    ],

    paginaMioBattito: {
      id: "mio-battito",
      titolo: "Il mio battito",
      roadmap: "R1.2"
    },

    finale: {
      titolo: "Fine della prima pagina",
      testo:
        "Hai scoperto, come Hayy, che il corpo è fatto di parti che lavorano insieme, che si mandano messaggi veloci e lenti, e che cerca sempre l'equilibrio. " +
        "E hai scoperto che per capirlo bisogna osservare, misurare, ripetere.",
      diritto:
        "Ogni persona ha una mente per ragionare e il diritto di imparare. (Dichiarazione universale dei diritti umani, articoli 1 e 26)",
      domanda: "Una domanda per te: cosa avrebbe imparato Hayy più in fretta, se avesse avuto una scuola?",
      prossimo: "La prossima pagina del quaderno: il mare dei venti, con Ulisse. In arrivo.",
      torna: "Torna all'inizio"
    }
  }
};
