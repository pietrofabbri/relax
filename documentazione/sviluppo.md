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
| `js/mondo.js` | Disegno del mondo, movimento, tocchi |
| `js/livello1.js` | Il livello 1: oggetti, tappe, scene |
| `js/main.js` | Avvio, schermata iniziale, impostazioni |
| `sw.js`, `manifest.webmanifest` | Installazione sul telefono e uso offline quando il gioco è online |
| `strumenti/test_livello1.py` | Gioca il livello 1 dall'inizio alla fine e segnala errori |

## Come aggiungere il disegno del ragazzo

1. Scansiona il foglio a 300 dpi (o fotografalo con un'app di scansione), in orizzontale.
2. Salvalo come `assets/sfondi/livello1-isola.jpg`.
3. In `js/livello1.js`, nella funzione `carica`, togli il commento alla riga `sfondo: "assets/sfondi/livello1-isola.jpg",`.

Il disegno prende il posto del cielo, del mare e della terra disegnati dal codice; personaggi e oggetti restano sopra, a inchiostro. Se il file manca, il gioco usa il disegno provvisorio.

**Regole per il foglio:** tre fasce leggere (sfondo in alto, sentiero al centro, primo piano in basso); contorni marcati, colori pieni; niente scritte nel disegno.

## Come tradurre il gioco

1. Copia `js/testi-it.js` in `js/testi-en.js`.
2. Traduci solo i testi tra virgolette, lasciando i nomi a sinistra dei due punti.
3. In `index.html`, carica `js/testi-en.js` al posto di `js/testi-it.js`. Un selettore della lingua si aggiungerà quando servirà.

## Come aggiungere un livello

Copia la struttura di `js/livello1.js`:

- un elenco di **oggetti** (posizione, disegno, azione quando vengono toccati);
- le **tappe**, ognuna con una funzione `prepara…` (cosa è attivo, dove si può camminare, il suggerimento in basso);
- le **scene**, scritte come catene di `Pannello.racconta(...)`, una dopo l'altra.

Ogni livello salva la tappa raggiunta, così si può riprendere dopo aver chiuso il gioco.

## Come provare il gioco

- **A mano:** apri `index.html` in un browser. Per simulare un telefono, usa gli strumenti per sviluppatori del browser (modalità dispositivo, in orizzontale).
- **Test automatico:** `python3 strumenti/test_livello1.py`. Richiede Python con Playwright e Chrome. Il test gioca tutto il livello, controlla che non ci siano errori e salva le schermate in `/tmp/shots`.

## Regole per chi scrive codice qui

- Nomi in italiano, commenti brevi che spiegano il **perché**.
- Nessuna libreria esterna e nessun servizio online.
- Nessuna raccolta di dati, nessuna notifica, nessuna ricompensa a sorpresa per trattenere il giocatore (vedi roadmap, passo M3.6).
- Il battito mostrato è sempre dichiarato **simulato**.
- Ogni nuova pagina del quaderno indica il passo della roadmap che insegna.
