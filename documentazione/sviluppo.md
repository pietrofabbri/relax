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
| `js/didascalia.js` | La riga di testo in basso e la frase fissa in alto ("cosa devo fare") |
| `js/livello1.js` | Il livello 1: oggetti, tappe, scene |
| `js/main.js` | Avvio, schermata iniziale, impostazioni |
| `sw.js`, `manifest.webmanifest` | Installazione sul telefono e uso offline quando il gioco è online |
| `strumenti/test_livello1.py` | Gioca il livello 1 dall'inizio alla fine e segnala errori |

## Come aggiungere il disegno del ragazzo

1. Scansiona il foglio a 300 dpi (o fotografalo con un'app di scansione), in orizzontale.
2. Salvalo in `assets/sfondi/`, per esempio `livello1-giungla.png` (meglio PNG con lo sfondo trasparente, così il cielo resta quello animato).
3. In `js/mondo.js` gli strati sono disegnati in ordine: cielo, nuvole, isole lontane, mare, giungla, terreno, scena, primo piano. Il disegno va al posto di uno strato (di solito la giungla, che scorre a metà velocità): si carica con `new Image()` e si disegna nella stessa funzione, con la stessa parallasse.
4. Il buio della notte e le luci si applicano sopra, quindi il disegno cambia da solo con l'ora del giorno.

**Regole per il foglio:** una fascia per foglio (lontano, medio o vicino); contorni marcati, colori pieni; niente scritte; lasciare libera la parte bassa, dove camminano i personaggi.

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
