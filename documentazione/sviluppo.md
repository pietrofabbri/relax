# Sviluppo: come è fatto il gioco

Torna a: [documentazione](README.md) · [presentazione del progetto](../README.md)

## Le scelte, e perché

| Scelta | Perché |
| --- | --- |
| HTML, CSS e JavaScript semplice, **nessuna libreria** | Niente da aggiornare, niente che si rompe tra qualche anno |
| **Script classici**, niente moduli e niente caricamenti di file | Il gioco funziona anche aprendo `index.html` da una chiavetta, senza server |
| Il mondo è disegnato su **Canvas 2D**; finestre, testi e pulsanti sono **HTML** | L'HTML si ingrandisce, si legge con la sintesi vocale ed è accessibile |
| **Suoni sintetizzati** con Web Audio | Nessun file audio da gestire |
| Tutti i **testi in un solo file** (`js/testi-it.js`) | Per correggere una frase o tradurre il gioco non si tocca il codice |
| Salvataggio solo sul dispositivo (`localStorage`) | Nessun dato raccolto; se non è disponibile il gioco funziona lo stesso |

## I file

| File | Cosa fa |
| --- | --- |
| `index.html` | La pagina: carica gli script in ordine |
| `css/stile.css` | Lo stile "carta e inchiostro" |
| `js/testi-it.js` | **Tutti i testi** in italiano |
| `js/impostazioni.js` | Impostazioni e salvataggio |
| `js/voce.js` | Lettura ad alta voce (facoltativa) |
| `js/suoni.js` | Battito, suono di scoperta, tonfo |
| `js/battito.js` | Il battito **simulato** del personaggio: sale, poi torna da solo verso la base |
| `js/pannello.js` | Finestre di racconto e di scelta (restituiscono Promise, così le scene si scrivono in ordine) |
| `js/quaderno.js` | L'**album delle scoperte**: ogni scoperta è una carta da collezionare, con simbolo e codice della roadmap |
| `js/arte.js` | **Tutti i disegni**: cielo, mare, palme, grotta, animali, persone; colori che cambiano con l'ora del giorno |
| `js/mondo.js` | Il motore: telecamera, strati in parallasse, ora del giorno, buio e luci, vista del calore, particelle, tocchi |
| `js/fondale.js` | Il **fondale**: il disegno del ragazzo dietro al livello (da file o da foto del telefono) |
| `js/spettacolo.js` | **Punti, serie, stelle, "Indovina!", sipario** tra le tappe: valgono per tutti i livelli |
| `js/app.js` | L'app sul telefono: installazione, schermo intero, aggiornamenti da GitHub |
| `js/schemi.js` | Gli **schemi** delle spiegazioni (corpo, catena della corsa, riflesso, media, termostato…), a inchiostro con un colore d'accento |
| `js/storia.js` | **La storia sempre chiara**: prologo a immagini, capitolo a ogni tappa (cosa succede nel libro, cosa fai nel gioco), filo della storia con "Sei qui" |
| `js/cartina.js` | Cartina disegnata dal codice (Mediterraneo e Oceano Indiano), con spilli e rotte animate |
| `js/icone.js` | Le icone a colori (cuore, fuoco, gazzella, termometro…): simboli al posto delle frasi |
| `js/didascalia.js` | La riga di testo in basso e la frase fissa in alto ("cosa devo fare") |
| `js/livello1.js` | Il livello 1: oggetti, tappe, scene |
| `js/main.js` | Avvio, schermata iniziale, impostazioni |
| `sw.js`, `manifest.webmanifest` | Installazione sul telefono e uso offline quando il gioco è online |
| `strumenti/prepara_fondale.py` | Dalla scansione o foto dei fogli al fondale (PNG con la carta trasparente) |
| `strumenti/guida_striscia.py` | Crea la **guida da stampare** per la striscia del fondale (`documentazione/fondali/livello1-guida.pdf`) |
| `strumenti/qr.py` | Crea il codice QR del gioco (`assets/qr-gioco.png`) |
| `strumenti/test_livello1.py` | Gioca il livello 1 dall'inizio alla fine e segnala errori |

## Il fondale: il disegno del ragazzo

**Un livello, un fondale, sempre lo stesso.** Come il fondale di un teatro: sta dietro a tutto il livello, dall'alba alla notte. Davanti, il codice disegna il sentiero, i personaggi, gli oggetti e il primo piano, così il gioco resta leggibile e i personaggi si possono animare.

```
cielo animato (sole, nuvole, stelle)      ← codice: si vede dove il foglio è bianco
FONDALE = il disegno del ragazzo          ← scorre piano, tinto dall'ora del giorno
sentiero, personaggi, oggetti, effetti    ← codice
primo piano (foglie scure)                ← codice
buio della notte, luci del fuoco           ← codice, sopra a tutto
```

**La striscia.** Il formato giusto è una striscia di **5 fogli A4 orizzontali in fila** (148,5 x 21 cm). Copre tutto il livello **alla stessa scala del gioco**: ciò che è disegnato a metà striscia compare a metà livello e scorre insieme al mondo. La **guida da stampare** ([`fondali/livello1-guida.pdf`](fondali/livello1-guida.pdf), creata da `strumenti/guida_striscia.py`) mette su ogni foglio, a matita leggera: il capitolo della storia e l'ora del giorno di quel tratto, la linea del terreno, e a tratteggio il posto degli oggetti che disegna il gioco (grotta, palme, animali), così il paesaggio si costruisce intorno a loro. Strisce più corte funzionano lo stesso (scorrono più piano); con un foglio solo il disegno si ripete a specchio.

**Bianco e nero va benissimo:** il mondo del gioco è a inchiostro, e il disegno a china ci sta dentro senza stonare.

Regole per chi disegna:
- **il cielo si lascia bianco**: diventa trasparente e lì si vede il cielo animato (niente sole né luna: li fa il gioco, e cambiano con l'ora);
- la **striscia bassa** del foglio (gli ultimi 2-3 cm) resta vuota o semplice: lì camminano i personaggi;
- contorni marcati, colori pieni (pennarelli, tempere), niente scritte.

**Due strade per metterlo nel gioco:**

1. **Dal telefono, in classe (subito):** Impostazioni → *Il tuo disegno come fondale* → *Scegli una foto* (si possono scegliere più fogli, da sinistra a destra). Il gioco toglie le ombre della foto, rende trasparente la carta, ravviva i colori e mette il disegno in scena. Le foto restano solo su quel telefono (IndexedDB): non vengono inviate a nessuno.
2. **Per tutti (definitivo):** `python3 strumenti/prepara_fondale.py foglio1.jpg foglio2.jpg foglio3.jpg assets/fondali/livello1.png`, poi in `js/fondale.js` scrivi il percorso in `FONDALI.livello1.file` e carica tutto su GitHub.

In `FONDALI` si regolano anche `alto` e `basso` (la fascia dello schermo occupata dal disegno) e `sostituisce` (quali strati del codice il disegno prende il posto di: isole lontane, mare, giungla).

## Lo spettacolo: punti, stelle, "Indovina!"

Regola: **ogni gesto riuscito fa festa, ogni scoperta ha un premio, ogni esperimento comincia con una scommessa.**

- **Punti e serie** (`Spettacolo.premio`, `serie`, `rompi`): i colpi riusciti di fila moltiplicano i punti e alzano la nota del suono.
- **Stelle** (da 1 a 3) alla fine di ogni tappa, in base ai punti presi rispetto al punteggio pieno (`MASSIMI` in `livello1.js`).
- **"Indovina!"** (`Spettacolo.indovina`): prima dell'esperimento si sceglie cosa succederà (il cuore accelera o rallenta? chi è più caldo?). È il metodo scientifico in piccolo: ipotesi, prova, confronto.
- **Effetti del motore** (`Mondo.scuoti`, `zoom`, `rallenta`, `lampo`, `scritta`, `onda`, `coriandoli`, `sipario`). Con "Meno movimento sullo schermo" scosse, zoom e lampi si riducono.
- **Semi di luce** lungo il sentiero: si raccolgono passandoci sopra.

## L'app sul telefono

`manifest.webmanifest` + `sw.js` + `js/app.js`. L'app installata punta a GitHub Pages; il service worker prende sempre prima la versione in rete e salva una copia per giocare offline. Quando si carica una versione nuova, **alza `VERSIONE` in `sw.js`**: l'app se ne accorge quando torna in primo piano e si aggiorna da sola sulla schermata iniziale.

## Leggere per andare avanti

Il gioco è pieno di stimoli; i momenti di lettura no. Regole:

- **Tempo di lettura:** ogni frase resta da sola il tempo di leggerla (circa 3 parole al secondo, una barra si riempie); solo dopo compare "Tocca per continuare".
- **Domanda di ragionamento:** dopo ogni capitolo e ogni spiegazione c'è una domanda che chiede di **usare** ciò che si è letto in una situazione nuova (non di ripeterlo). Si va avanti solo con la risposta giusta. Se si sbaglia compare un aiuto per ragionare (campo `aiuto`), e si riprova.
- **Spiegazioni a schede con schemi** (`Storia.spiega`): come il prologo, una frase per scheda e uno schema che si disegna a passi. Lo schema si costruisce scheda dopo scheda (campo `fino`: quanti pezzi mostrare). Alla fine la domanda. Poi, come premio, la carta dell'album.
- Durante la lettura: sfondo calmo, niente effetti, niente punti che saltano.

## Stile a inchiostro

Il mondo è disegnato su **due tele**:

- la tela del **mondo** (cielo, paesaggio, personaggi): nello stile "inchiostro" un filtro la rende bianco e nero, un velo color carta la scalda, e ogni forma riceve un **contorno nero** come un disegno a china (`preparaContorno` in `mondo.js`);
- la tela del **colore**, sopra: fuoco, cuore e organi, cose da toccare, fiori, semi di luce, effetti, scritte. Il colore indica dove guardare.

Così il disegno a matita o a china del ragazzo e il disegno del codice stanno bene insieme. Nelle impostazioni si può scegliere "Mondo a colori". In ogni livello: ciò che va a colori si disegna in `disegnaColore`, il resto in `disegna`.

## Le prove platform (livello 1, versioni 6 e 7)

- **Motore:** `js/avventura.js`. Comandi a schermo (◀ ▶, salto, bastone) e tastiera; fisica con salto variabile, tolleranza ai bordi, doppio salto con le piume; nemici (granchio, vespa, riccio), buche, piattaforme fisse, mobili e che crollano, muri, rovi, spine, foglie elastiche, cocchi che cadono, fuochi (punti di ripartenza).
- **Livelli:** `js/livelli/avventure-1.js` (bosco, scogliera, notte). Ogni prova dichiara `cuori0` e `corpo`: `["fiato"]`, poi `["fiato","calma"]`, poi `["fiato","calma","calore"]`.
- **Corpo:** il fiato cala correndo e torna fermandosi; un colpo alza l'agitazione (salti più deboli, Hayy trema) che scende se ci si ferma; lontano dai fuochi il calore cala (brividi, poi un cuore perso).
- **Premi e sconfitta:** 3 pezzi di carta per prova aprono una carta d'oro (`oroBosco`, `oroScogliera`, `oroNotte` in `testi-it.js`); senza cuori compare «Hai perso!» e si riprova la prova.
- **Nel livello:** `prova(nome, oro, xDopo)` in `js/livello1.js` cambia scena, gioca, mostra il risultato (con «Riprova la prova») e torna alla scena del livello.
- **Test:** `strumenti/test_avventure.py`; `strumenti/test_livello1.py` gioca anche le prove (le gioca qualche secondo, poi porta Hayy al traguardo).

## Parole nuove e paesaggio da toccare

- Nelle spiegazioni una scheda `{ parola: "cellula" }` mostra la parola nuova con un disegno (`TESTI.paroleNuove`, schemi omonimi in `js/schemi.js`).
- `tocca(wx, wy)` in `js/livello1.js` fa reagire animali, palme, grotta, sassi, cespugli e cielo; la prima volta ogni cosa dà punti. Durante i giochi di precisione `mondo.noTocchi` lo spegne.

## Regole per i testi

- **Una idea per frase.** Frasi di 3-8 parole; due righe al massimo per volta.
- **Prima il simbolo, poi la parola:** ogni capitolo, carta e scelta ha un'icona.
- Le parole importanti tra `*asterischi*`: il gioco le colora.
- **Libro e gioco separati:** nei capitoli, "Nel libro" dice solo cose che il libro racconta davvero; ciò che è inventato per giocare sta nella riga verde (▶).
- Italiano corretto prima di tutto: accenti (è, perché, più), apostrofi (un'isola, un altro), maiuscole solo dove servono.

## Come tradurre il gioco

1. Copia `js/testi-it.js` in `js/testi-en.js`.
2. Traduci solo i testi tra virgolette, lasciando i nomi a sinistra dei due punti.
3. In `index.html`, carica `js/testi-en.js` al posto di `js/testi-it.js`. Un selettore della lingua si aggiungerà quando servirà.

## Come aggiungere un livello

Copia la struttura di `js/livello1.js`:

- `mondo`: dove stanno le cose (in coordinate del mondo: 1000 di altezza, il suolo a 790);
- le **tappe** (`tappaQualcosa`), scritte come catene di Promise: `Didascalia.mostra(...)`, poi `attivita({...})`, poi `pagina(...)`;
- `attivita` riceve i tocchi (`giu`, `muovi`, `su`), aggiorna ogni fotogramma (`aggiorna`) e può disegnare sopra (`disegnaMondo`, `disegnaSchermo`); finisce con `this.fine()`;
- `luci()` e `calore()` dicono al motore cosa illumina il buio e cosa è caldo.

Ogni livello salva la tappa raggiunta, così si può riprendere dopo aver chiuso il gioco.

## Come provare il gioco

- **A mano:** apri `index.html` in un browser. Per simulare un telefono, usa gli strumenti per sviluppatori del browser (modalità dispositivo, in orizzontale).
- **Test automatico:** `python3 strumenti/test_livello1.py`. Richiede Python con Playwright e Chrome. Il test gioca tutto il livello da solo (tocca, trascina, salta, tiene premuto, scrive il battito), fallisce se compare un errore o se una tappa resta ferma, e salva una schermata per tappa in `/tmp/foto_test`.

## Regole per chi scrive codice qui

- Nomi in italiano, commenti brevi che spiegano il **perché**.
- Nessuna libreria esterna e nessun servizio online.
- Nessuna raccolta di dati, nessuna notifica, nessuna ricompensa a sorpresa per trattenere il giocatore (vedi roadmap, passo M3.6).
- Il battito mostrato è sempre dichiarato **simulato**.
- Ogni nuova pagina del quaderno indica il passo della roadmap che insegna.
