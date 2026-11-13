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
| `js/quaderno.js` | Il quaderno: ogni pagina ha il codice del passo della roadmap |
| `js/arte.js` | **Tutti i disegni**: cielo, mare, palme, grotta, animali, persone; colori che cambiano con l'ora del giorno |
| `js/mondo.js` | Il motore: telecamera, strati in parallasse, ora del giorno, buio e luci, vista del calore, particelle, tocchi |
| `js/fondale.js` | Il **fondale**: il disegno del ragazzo dietro al livello (da file o da foto del telefono) |
| `js/spettacolo.js` | **Punti, serie, stelle, "Indovina!", sipario** tra le tappe: valgono per tutti i livelli |
| `js/app.js` | L'app sul telefono: installazione, schermo intero, aggiornamenti da GitHub |
| `js/didascalia.js` | La riga di testo in basso e la frase fissa in alto ("cosa devo fare") |
| `js/livello1.js` | Il livello 1: oggetti, tappe, scene |
| `js/main.js` | Avvio, schermata iniziale, impostazioni |
| `sw.js`, `manifest.webmanifest` | Installazione sul telefono e uso offline quando il gioco è online |
| `strumenti/prepara_fondale.py` | Dalla scansione o foto dei fogli al fondale (PNG con la carta trasparente) |
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

**Il foglio.** Una striscia di **3 fogli A4 orizzontali**, uno accanto all'altro: si legge da sinistra (il rifugio, l'alba) a destra (la grotta, la spiaggia). Mentre Hayy cammina, il fondale scorre e alla fine del livello si è visto tutto, senza ripetizioni. Con un foglio solo funziona lo stesso: il disegno si ripete a specchio, così i bordi combaciano.

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
