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
    storia: "La storia",
    primoColpo: "Al primo colpo!",
    scoperta: "scoperte"
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
    bloccata: "Ancora da scoprire",
    bloccataOro: "Carta d'oro: trova i 3 pezzi di carta in una prova"
  },

  /* prove platform */
  avventura: {
    comandi: "◀ ▶ corri   ⤒ salta",
    comandiBastone: "Il bastone abbatte rovi e nemici",
    senzaFiato: "SENZA FIATO! Fermati un attimo",
    usaBastone: "Usa il bastone!",
    riccio: "AHI! Sul riccio non si salta",
    colpo: "PAF!",
    salto: "BOING!",
    perso: "Hai perso!",
    persoSotto: "Era difficile. Riprova: ora conosci la strada.",
    riprova: "Riprova",
    vinto: "CE L'HAI FATTA!",
    frammento: "PEZZO DI CARTA",
    cuore: "+1 CUORE",
    frutto: "FIATO PIENO!",
    piume: "PIUME D'AQUILA: DOPPIO SALTO!",
    salvato: "FUOCO ACCESO",
    agitato: "AGITATO! Fermati e respira",
    freddo: "FREDDO! Cerca un fuoco",
    risultato: "Prova superata",
    pezzi: "pezzi di carta",
    semi: "semi di luce",
    cadute: "cadute",
    tuttiPezzi: "Tutti e tre i pezzi: ecco la *carta d'oro*!",
    mancano: "Mancano dei pezzi: la carta d'oro resta chiusa.\nRiprova, oppure vai avanti e torna dopo.",
    riprovaPezzi: "Riprova la prova",
    avanti: "Avanti",
    nomi: { bosco: "Il bosco", scogliera: "La scogliera", notte: "La notte dei fuochi" },
    intro: {
      bosco: "Trova i *3 pezzi di carta*!",
      scogliera: "Se ti colpiscono ti agiti.\nFermati e *respira*.",
      notte: "Di notte fa freddo.\nResta vicino ai *fuochi*."
    }
  },

  /* parole nuove: compaiono prima di essere usate */
  paroleNuove: {
    nastro: "Parola nuova",
    cellula: { parola: "cellula", frase: "Il corpo è fatto di *cellule*:\npezzetti piccolissimi, come mattoncini." },
    zuccheri: { parola: "zuccheri", frase: "Nel cibo ci sono gli *zuccheri*:\nil carburante del corpo, come la legna per il fuoco." },
    ossigeno: { parola: "ossigeno", frase: "Nell'aria c'è l'*ossigeno*.\nServe al fuoco per bruciare, e a te per vivere." },
    evapora: { parola: "evaporare", frase: "Il panno al sole si asciuga: l'acqua *evapora*.\nE intanto porta via calore." },
    millesimo: { parola: "millesimo di secondo", frase: "Dividi un secondo in 1000 pezzetti:\nognuno è un *millesimo* (ms)." }
  },

  /* etichette degli schemi */
  schemi: {
    corpo: { cervello: "cervello", cervelloFa: "pensa e comanda", polmoni: "polmoni", polmoniFa: "prendono l'aria", cuore: "cuore", cuoreFa: "spinge il sangue",
      stomaco: "stomaco", stomacoFa: "digerisce", muscoli: "muscoli", muscoliFa: "muovono" },
    cuorePolmoni: { polmoni: "polmoni", aria: "aria", cuore: "cuore", muscoli: "muscoli", ossigeno: "ossigeno", porta: "sangue", giro: "il sangue torna indietro e ricomincia il giro" },
    catena: { muscoli: "muscoli", respiro: "respiro", cuore: "cuore", calore: "calore", sudore: "sudore", insieme: "tutto insieme!" },
    riflesso: { occhio: "occhio", nervo: "nervo", cervello: "cervello", mano: "mano", tempo: "≈ 0,2 secondi" },
    media: { media: "media" },
    cellula: { corpo: "corpo", pelle: "pelle", cellule: "cellule", mattoni: "come mattoncini" },
    zuccheri: { frutta: "frutta", pane: "pane", miele: "miele", zuccheri: "zuccheri", muscolo: "muscoli", energia: "energia" },
    evapora: { panno: "panno bagnato", vapore: "vapore", fresco: "porta via calore" },
    millesimo: { secondo: "1 secondo", pezzi: "1000 millesimi", ciglia: "battito di ciglia ≈ 300 ms" },
    neurone: { neurone: "neurone", filo: "filo lungo", elettrico: "segnale elettrico", velocita: "fino a 100 metri al secondo", sinapsi: "sinapsi", chimica: "passa una sostanza chimica" },
    tempi: { viaggio1: "viaggio nei nervi", cervello: "il cervello capisce e decide", muscolo: "il muscolo si muove", totale: "in tutto ≈ 0,2 secondi" },
    cuoreGiorno: { numero: "100.000", alGiorno: "battiti al giorno", ancheDormi: "anche di notte" },
    dueStrade: { nervi: "nervi", veloce: "velocissimi", breve: "durano poco", sangue: "sangue", lento: "lenti", dura: "durano a lungo" },
    termostato: { caldo: "caldo", sudi: "sudi", freddo: "freddo", tremi: "tremi", sempre: "il cervello riporta il corpo a 37 °C" },
    ossigeno: { aria: "aria", ossigeno: "ossigeno", altro: "altri gas" },
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
      segui: { icona: "gazzella", titolo: "La gazzella", libro: ["Una gazzella trova Hayy", "e lo allatta."], gioco: "Seguila nel bosco.",
        domanda: { testo: "Hayy cresce senza persone intorno. Che cosa NON potrà mai scoprire da solo, solo guardando?", opzioni: ["che il fuoco scotta", "come si chiama la gazzella nella lingua degli uomini", "che l'acqua toglie la sete"], giusta: 1, aiuto: "Le cose si scoprono provando. Ma i nomi chi li inventa?" } },
      animali: { icona: "foglia", titolo: "Hayy è diverso", libro: ["Hayy non ha corna, pelo, guscio.", "Allora copia gli animali."], gioco: "Copia gli animali.",
        domanda: { testo: "Gli animali nascono con corna, pelo o guscio. Hayy no. Allora qual è il suo punto di forza?", opzioni: ["le mani e la testa: può costruire ciò che gli manca", "è più veloce di tutti gli animali", "da grande gli crescerà il pelo"], giusta: 0, aiuto: "Corna, piume e guscio: Hayy come li ha ottenuti?" } },
      corsa: { icona: "corsa", titolo: "Forte e veloce", libro: ["Hayy diventa grande e forte.", "Corre con le gazzelle."], gioco: "Corri nel bosco.",
        domanda: { testo: "Hayy corre in salita con un sasso pesante in mano. Rispetto alla corsa senza sasso, il fiato finisce…", opzioni: ["prima: le gambe e le braccia fanno più fatica", "dopo: il sasso dà la spinta", "uguale: si corre allo stesso modo"], giusta: 0, aiuto: "Più fatica fanno i muscoli, più aria chiedono." } },
      cocchi: { icona: "cocco", titolo: "Il cibo dell'isola", libro: ["Hayy mangia i frutti dell'isola."], gioco: "Prendi i cocchi al volo.",
        domanda: { testo: "Un frutto è rosso e lucido, ma nessun animale lo mangia mai. Che cosa conviene pensare?", opzioni: ["è il più buono: gli animali lo lasciano a Hayy", "forse fa male: meglio non rischiare", "gli animali non vedono il rosso"], giusta: 1, aiuto: "Gli animali dell'isola sanno che cosa si mangia da molto prima di Hayy." } },
      cerva: { icona: "cuore", titolo: "La gazzella muore", libro: ["La gazzella, vecchia, si ferma.", "Hayy vuole capire perché."], gioco: "Ascolta il suo cuore.",
        domanda: { testo: "La gazzella è ferma. Fuori non ha ferite. Che cosa ha smesso di funzionare, secondo te?", opzioni: ["qualcosa dentro: il cuore, il respiro", "il pelo", "le corna"], giusta: 0, aiuto: "Quando la gazzella correva, che cosa sentivi battere?" } },
      fuoco: { icona: "fuoco", titolo: "Il fuoco", libro: ["Un fulmine incendia le canne.", "Hayy porta il fuoco nella grotta."], gioco: "Proteggi la fiamma dal vento.",
        domanda: { testo: "C'è vento forte. Come proteggi meglio una fiammella?", opzioni: ["la chiudi in una scatola senza buchi", "le metti le mani intorno, ma lasci passare un po' d'aria", "ci soffi sopra per farla crescere"], giusta: 1, aiuto: "Il vento forte la spegne. Ma senza aria si spegne lo stesso." } },
      calore: { icona: "termometro", titolo: "Il calore della vita", libro: ["Hayy nota una cosa:", "gli animali vivi sono caldi."], gioco: "Guarda il calore delle cose.",
        domanda: { testo: "Una capra dorme all'ombra. Accanto c'è un sasso, all'ombra anche lui. Hayy li tocca: che cosa sente?", opzioni: ["sono uguali: stanno nello stesso posto", "la capra è più calda", "il sasso è più caldo: è più duro"], giusta: 1, aiuto: "Il sasso prende calore solo dal sole. E la capra?" } },
      misura: { icona: "battito", titolo: "Il tuo cuore", libro: ["Hayy misura e confronta tutto."], gioco: "Ora conta il tuo battito." },
      alba: { icona: "barca", titolo: "Absal", libro: ["Anni dopo arriva Absal.", "Insegna a Hayy a parlare."], gioco: "Impara le parole con Absal.",
        domanda: { testo: "Absal vuole insegnare a Hayy la parola «fuoco». Hayy non sa leggere. Qual è il modo più rapido?", opzioni: ["scriverla sulla sabbia", "spiegarla con altre parole", "indicare il fuoco e dire la parola"], giusta: 2, aiuto: "Hayy non conosce ancora nessuna parola." } }
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
      copia: "Copia gli animali!",
      capra: "*Corna*: per difendersi.",
      capraFatto: "Un bastone: le tue corna!",
      uccello: "*Piume*: per stare al caldo.",
      uccelloFatto: "Foglie: le tue piume!",
      tartaruga: "*Guscio*: per proteggersi.",
      tartarugaFatto: "Corteccia: il tuo guscio!",
      corsa: "La gazzella corre. Seguila!",
      corsaFine: "*Cuore*, *respiro*, *calore*: insieme!",
      riposo: "Riposa. Tutto torna calmo.",
      inciampo: "OPS!",
      etichettaCuore: "cuore più veloce",
      etichettaRespiro: "respiro più veloce",
      etichettaCalore: "più caldo",
      cocchi: "Quanto sei veloce a reagire?",
      cocchiRisultato: "Media: *{media}* ms",
      sera: "È sera. La gazzella è vecchia e stanca.",
      cuoreCerva: "Il suo cuore ha battuto per tutta la vita.",
      fermo: "Ora si ferma.",
      fiori: "Hayy la saluta così.",
      tuoCuore: "Il cuore si calma piano piano.",
      fulmine: "Un fulmine! Le canne bruciano!",
      acceso: "Portalo alla grotta!",
      spento: "Si è spento. Riaccendilo!",
      grotta: "Luce e calore!",
      calore: "Guarda il calore delle cose.",
      sasso: "Sasso: 18 gradi.",
      capra2: "Capra: 39 gradi.",
      hayy: "Hayy: 37 gradi.",
      caldoFine: "Chi è vivo resta caldo.",
      misura: "E il tuo cuore? Contalo per 30 secondi.",
      alba: "All'alba arriva una barca.",
      absal: "È *Absal*. Viene da un'altra isola.",
      absalParole: "Absal insegna a Hayy le parole.",
      scuola: "Insieme si impara prima!",
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
          { schema: "corpo", testo: "Il corpo ha tanti *organi*.\nOgnuno fa un lavoro.", attesa: 3.6 },
          { schema: "corpo", testo: "Guarda lo schema: chi fa che cosa?" }
        ],
        domanda: { testo: "I polmoni di una persona prendono poca aria. Quale altro organo dovrà lavorare di più?", opzioni: ["lo stomaco", "il cuore: deve far girare il sangue più in fretta", "nessuno"], giusta: 1, aiuto: "Chi porta in giro per il corpo ciò che entra nei polmoni?" }
      },
      insieme: {
        titolo: "Quando corri",
        schede: [
          { parola: "zuccheri" },
          { parola: "ossigeno" },
          { schema: "cuorePolmoni", testo: "I *polmoni* passano l'ossigeno al sangue.", attesa: 3, fino: 3 },
          { schema: "cuorePolmoni", testo: "Il *cuore* spinge quel sangue ai *muscoli*.\nPoi il sangue torna, e ricomincia.", attesa: 3.4 },
          { schema: "catena", testo: "Corri: i muscoli vogliono più ossigeno.\nPolmoni e cuore *accelerano insieme*.", attesa: 3.4, fino: 3 },
          { schema: "catena", testo: "I muscoli si scaldano. La pelle *suda*." }
        ],
        domanda: { testo: "Se i polmoni respirassero veloci ma il cuore restasse lento, che cosa succederebbe ai muscoli?", opzioni: ["avrebbero lo stesso poco ossigeno: il sangue non lo porta", "avrebbero tanto ossigeno", "niente: il cuore non c'entra"], giusta: 0, aiuto: "Chi trasporta l'ossigeno dai polmoni ai muscoli?" }
      },
      veloci: {
        titolo: "Come viaggiano i messaggi nei nervi",
        schede: [
          { parola: "cellula" },
          { schema: "neurone", testo: "I nervi sono fatti di cellule lunghe:\ni *neuroni*.", attesa: 3.2, fino: 2 },
          { schema: "neurone", testo: "Dentro corre un *segnale elettrico*:\nfino a 100 metri al secondo!", fino: 3 },
          { schema: "neurone", testo: "Tra due neuroni c'è un piccolo spazio:\nla *sinapsi*." },
          { schema: "riflesso", testo: "Occhio, cervello, mano:\ncirca *200 ms*.", attesa: 3.4 },
          { schema: "tempi", testo: "Il tempo più lungo?\nQuello del *cervello* che decide.", attesa: 3 }
        ],
        domanda: { testo: "Un amico è distratto e prende il cocco 100 ms dopo di te. Dove ha perso quel tempo?", opzioni: ["nei nervi: si sono accorciati", "nel cervello: ci ha messo di più a capire e decidere", "nella mano: è più lenta"], giusta: 1, aiuto: "Guarda la barra: quale pezzo è il più lungo?" }
      },
      ripeti: {
        titolo: "Come lavora uno scienziato",
        schede: [
          { schema: "media", testo: "Tre prove, tre tempi diversi.\nOgni misura varia un po'.", attesa: 2.8 },
          { schema: "media", testo: "Si misura più volte e si fa la *media*." }
        ],
        domanda: { testo: "Tre prove: 300, 200 e 250 ms. Fai una quarta prova. Che cosa è più probabile?", opzioni: ["esattamente 250", "un tempo vicino a 250, un po' più o un po' meno", "0 ms"], giusta: 1, aiuto: "Le tre misure erano tutte uguali?" }
      },
      cuore: {
        titolo: "Il cuore",
        schede: [
          { schema: "cuoreGiorno", testo: "Il cuore è un *muscolo*.\nOgni stretta è un *battito*.", attesa: 2.8, fino: 1 },
          { schema: "cuoreGiorno", testo: "*100.000 battiti* al giorno.\nAnche quando dormi." }
        ],
        domanda: { testo: "Hai 10 anni. Più o meno quante volte ha già battuto il tuo cuore?", opzioni: ["circa 3 milioni", "circa 350 milioni", "circa 35.000"], giusta: 1, aiuto: "100.000 al giorno. Un anno ha 365 giorni. Poi per 10…" }
      },
      lenti: {
        titolo: "Due strade per i messaggi",
        schede: [
          { schema: "dueStrade", testo: "I *nervi*: messaggi veloci, che durano poco.", attesa: 2.8, fino: 1 },
          { schema: "dueStrade", testo: "Gli *ormoni*: messaggi nel *sangue*, lenti.\nLa paura porta l'*adrenalina*." },
          { schema: "dueStrade", testo: "Gli ormoni restano per minuti.\nPer questo la paura non passa subito." }
        ],
        domanda: { testo: "Hai litigato con un amico. Lui è andato via, ma tu sei ancora agitato. Perché?", opzioni: ["l'adrenalina è ancora nel sangue", "i nervi sono rotti", "il cuore si è stancato"], giusta: 0, aiuto: "Quale strada dei messaggi dura più a lungo?" }
      },
      equilibrio: {
        titolo: "La temperatura del corpo",
        schede: [
          { schema: "termostato", testo: "Il corpo resta a *37 gradi*.\nIl cervello lo controlla.", attesa: 3.4, fino: 1 },
          { parola: "evapora" },
          { schema: "termostato", testo: "Caldo? *Sudi*: il sudore evapora e rinfresca.", fino: 2 },
          { schema: "termostato", testo: "Freddo? *Tremi*: i muscoli si scaldano." }
        ],
        domanda: { testo: "Esci dal mare bagnato e c'è vento. Hai freddo anche se è estate. Perché?", opzioni: ["l'acqua sulla pelle evapora e porta via calore", "il mare è salato", "il vento è sempre gelido"], giusta: 0, aiuto: "Pensa al panno bagnato al sole." }
      },
      fuocoAria: {
        titolo: "Il fuoco e il corpo",
        schede: [
          { schema: "fuocoAria", testo: "Il fuoco brucia la legna con l'*ossigeno*.", attesa: 3.2, fino: 1 },
          { schema: "fuocoAria", testo: "Le cellule fanno lo stesso, piano:\nossigeno + zuccheri = *energia*.", fino: 3 }
        ],
        domanda: { testo: "Dopo una corsa respiri a bocca aperta. Perché il corpo vuole tanta aria?", opzioni: ["per raffreddare i polmoni", "i muscoli usano più ossigeno per avere energia", "per far uscire il sudore"], giusta: 1, aiuto: "Che cosa serve al fuoco, e ai muscoli, per bruciare?" }
      }
    },

    /* le carte dell'album: titolo, una frase, il simbolo e il passo della roadmap */
    pagine: {
      parti: { titolo: "Ogni parte ha un compito", testo: "Cuore, polmoni, cervello: ognuno fa il suo lavoro.", icona: "puzzle", roadmap: "B1.1" },
      insieme: { titolo: "Cuore e polmoni, un solo giro", testo: "I polmoni caricano l'ossigeno, il cuore lo porta ai muscoli.", icona: "ingranaggi", roadmap: "B1.2" },
      veloci: { titolo: "Neuroni e riflessi", testo: "Nei neuroni corre un segnale elettrico, fino a 100 m al secondo. La maggior parte del tempo di una reazione serve al cervello.", icona: "fulmine", roadmap: "B1.3" },
      ripeti: { titolo: "Misura più volte", testo: "Ogni misura varia un po': si ripete e si fa la media.", icona: "ripeti", roadmap: "B1.6" },
      cuore: { titolo: "Il cuore non si ferma", testo: "Batte tutta la vita, anche quando dormi.", icona: "cuore", roadmap: "R1.1" },
      lenti: { titolo: "Ormoni: messaggi lenti", testo: "Gli ormoni, come l'adrenalina, viaggiano nel sangue e durano minuti.", icona: "sangue", roadmap: "B1.4" },
      equilibrio: { titolo: "Sempre 37 gradi", testo: "Sudore per raffreddare, brividi per scaldare: il cervello regola la temperatura.", icona: "termometro", roadmap: "B1.5" },
      mioBattito: { titolo: "Il mio battito", testo: "{bpm} battiti al minuto.", icona: "battito", roadmap: "R1.2" },
      oroBosco: { titolo: "Carta d'oro: il bosco", testo: "Tre pezzi trovati. Hai corso, saltato e ripreso fiato.", icona: "corsa", roadmap: "★1", oro: true },
      oroScogliera: { titolo: "Carta d'oro: la scogliera", testo: "Tre pezzi trovati sulle rocce che crollano.", icona: "sasso", roadmap: "★2", oro: true },
      oroNotte: { titolo: "Carta d'oro: i fuochi", testo: "Tre pezzi trovati nella notte, con le piume d'aquila.", icona: "fuoco", roadmap: "★3", oro: true }
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
