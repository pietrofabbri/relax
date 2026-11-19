# Ripartire da qui

Questo file serve a riprendere il lavoro **da zero**, con un altro account o in una nuova conversazione con Claude, senza perdere nulla. Tutto ciò che è stato prodotto per il progetto è in questa repository.

**Come usarlo con Claude:** collega la repository `pietrofabbri/relax` alla nuova sessione e scrivi: *«Leggi RIPARTIRE.md e riprendi il progetto da dove è rimasto.»*

Aggiornato al 19 novembre 2026.

---

## 1. Il progetto in breve

- **Che cosa:** *Respira*, un gioco per smartphone (app web installabile) che insegna a rilassarsi e spiega perché funziona (corpo, nervi, cervello).
- **Per chi:** fino a 12 anni. Tutto deve essere comprensibile a un dodicenne.
- **Contesto:** progetto scolastico di 25 ore con uno studente di quinta (biotecnologie). In classe: storia e diritti umani (20 minuti), poi game design.
- **Struttura:** 7 livelli, ognuno nato da un testo antico di una cultura diversa, collegato a uno o più diritti umani. Il livello 1 (*L'isola*, Ḥayy ibn Yaqẓān) è **giocabile**; gli altri sono progettati (`documentazione/livelli/`).
- **Gioco pubblicato:** https://pietrofabbri.github.io/relax/ (GitHub Pages dal ramo `main`).
- **Lingua:** italiano; traduzioni previste (tutti i testi del gioco stanno in `js/testi-it.js`).
- **Privacy:** il gioco non raccoglie dati. Non mettere mai dati personali nella repository.

## 2. Mappa della repository

| Percorso | Che cosa contiene | Documentazione |
| --- | --- | --- |
| `index.html`, `css/`, `js/`, `assets/`, `sw.js`, `manifest.webmanifest` | Il gioco | `documentazione/sviluppo.md` |
| `js/livello1.js` | Le tappe del livello 1 | `documentazione/livelli/01-isola-hayy.md` |
| `js/avventura.js`, `js/livelli/avventure-1.js` | Motore delle prove platform e le tre prove del livello 1 | sezione 4 qui sotto |
| `js/testi-it.js` | Tutti i testi del gioco (capitoli, domande, spiegazioni, parole nuove, carte) | — |
| `documentazione/didattica/` | Storie, diritti, **roadmap disciplinare v2** (144 passi) | `documentazione/didattica/README.md` |
| `documentazione/livelli/` | Schede dei 7 livelli | `documentazione/livelli/README.md` |
| `presentazioni/` | Le tre presentazioni: generatori, file pubblicati, immagini, PDF | `presentazioni/README.md` |
| `testi/hayy/` | Testo di approfondimento su Ḥayy (PDF 12 pagine) e generatore | `testi/hayy/README.md` |
| `strumenti/` | Test automatici, preparazione fondali, QR, ambiente | sezione 5 qui sotto |

## 3. Dove siamo arrivati

### Gioco (livello 1, versione 7)
- 9 capitoli. Ognuno alterna: **capitolo** (due righe della storia + domanda di ragionamento con aiuto), **prova**, **schema** animato del corpo, **domanda**, **carta** dell'album.
- **Tre prove platform** (stile Super Mario), graduali: *il bosco* (facile, 5 cuori), *la scogliera* (media, 4 cuori), *la notte dei fuochi* (più difficile, con aiuti). Si può perdere e si riprova la prova.
- **Il corpo da controllare cresce di prova in prova:** fiato → fiato + calma (colpito ti agiti: fermati e respira) → fiato + calma + calore (lontano dai fuochi hai freddo).
- **Premi veri:** 3 pezzi di carta per prova aprono una carta d'oro; domanda giusta al primo colpo = 60 punti e bollino.
- **Parole nuove spiegate prima di usarle**, con disegno: cellula, zuccheri, ossigeno, evaporare, millesimo di secondo. Schema **cuore e polmoni** come unico giro.
- **Paesaggio da toccare** (animali, palme, grotta, sassi, cespugli, cielo).
- Stile a inchiostro (bianco e nero su carta, colore solo dove conta); fondale disegnabile dallo studente (striscia).
- Adattato agli smartphone piccoli (667×375): titolo su una riga, domande che stanno nello schermo.

### Presentazioni (artifact Slides su claude.ai)
| Presentazione | Slide | Link (account originale) |
| --- | --- | --- |
| Ḥayy ibn Yaqẓān: riferimenti letterari e diritti umani | 52 | https://claude.ai/artifact/MWjxVprbEfePH5ADPawYLu |
| Respira: organizzazione del lavoro | 20 | https://claude.ai/artifact/GbhX6y7dsoVYMNp3c4Ugen |
| Respira: roadmap disciplinare | 40 | https://claude.ai/artifact/TJCEYzrnxQ77RApr8YdHmv |

Gli artifact appartengono all'account originale: da un altro account **potrebbero non essere accessibili**. Per questo la repository contiene **tutti i file pubblicati** (`presentazioni/progetti/`), le immagini, i generatori e i **PDF** (`presentazioni/pdf/`). Come ricrearle in un nuovo account: `presentazioni/README.md`.

### Testo di approfondimento
`testi/hayy/Hayy ibn Yaqzan - la storia e i diritti umani.pdf`: storia, contesto, temi, fortuna del libro, diritti umani con testo integrale degli articoli, note a piè di pagina; il gioco solo nell'ultimo capitolo.

## 4. Preferenze e regole stabilite (rispettarle sempre)

### Presentazioni e testi
- **Toni neutri e formali**; non devono sembrare fatte da un'intelligenza artificiale: niente emoji, niente frecce decorative, niente punto centrale come separatore, niente frasi a effetto, niente slide «come leggere queste slide».
- **Non menzionare mai lo studente** nelle slide.
- **Testi leggibili:** grassetti, a capo, una idea per slide; un **glossario** (titolo «Glossario», forma «**Termine**. Definizione.») per le parole nuove.
- **Un elemento visivo per slide** (mappa, illustrazione, schermata); niente fotografie disponibili nell'ambiente di lavoro: mappe disegnate in codice e illustrazioni del gioco.
- **Niente colonne con disegni nelle tabelle** (richiesta esplicita).
- **Immagini con larghezza e altezza esplicite**, altrimenti nel visualizzatore Slides coprono il testo.
- **Diritti umani:** nella presentazione su Ḥayy si usano DUDU artt. 1, 26, 19, 27 e Costituzione artt. 3, 33. **Tolti su richiesta:** Convenzione ONU sui diritti dell'infanzia (artt. 28, 29, 12, 13, 31) e Costituzione art. 34. Collegamento all'art. 27 formulato così: «Ḥayy arriva da solo a vere scoperte sulla natura. Sull'isola abitata prova a condividerle: il sapere e i suoi benefici diventano di tutti.»
- **Collegamenti «tematici»:** premettere sempre che nel XII secolo i diritti umani non esistevano (evitare l'anacronismo); etichette diretto / indiretto / contesto.
- Nel testo su Ḥayy: **prima la storia, il gioco tutto in fondo**.
- L'utente modifica a mano le slide nell'editor: **prima di ripubblicare, leggere sempre le sue modifiche** (vedi `presentazioni/README.md`) e riportarle nei generatori.

### Gioco
- Più gioco e meno testo; **più pirotecnia**; tutto **graduale**; ogni parola nuova spiegata **prima** di essere usata; domande di **ragionamento**, non mnemoniche.
- Si deve poter **perdere** (difficile ma possibile); i premi devono essere **guadagnati**.
- La gestione del corpo (e poi delle emozioni) si **arricchisce di livello in livello**: l'utente lo ha apprezzato, proseguire su questa linea nei livelli 2-7.
- Prove platform: già rese più facili una volta; mantenere la gradualità.
- Il gioco deve stare bene sugli smartphone (anche piccoli).

### Settimana di lavoro (come comunicato nelle slide)
Martedì sera esce la nuova versione → a casa si prova sul telefono e si disegna → in classe: prima si rivedono insieme le correzioni, poi 20 minuti di storia e diritti umani, poi game design (introdotto gradualmente).

### Git
- Commit in italiano; in coda ai messaggi le righe di attribuzione richieste dall'ambiente.
- Pubblicazione: `git push origin main` (GitHub Pages si aggiorna da solo). Dopo modifiche al gioco, alzare `VERSIONE` in `sw.js` (ora `respira-v10`).

## 5. Come lavorare (comandi)

```sh
sh strumenti/prepara_ambiente.sh          # una volta: collega i percorsi usati dagli script
python3 strumenti/test_livello1.py         # gioca tutto il livello 1 da solo (~10 min); foto in /tmp/foto_test
python3 strumenti/test_avventure.py        # prova le tre prove platform
python3 strumenti/test_mobile.py           # schermate su 667x375, 844x390, 375x667
```
Servono Python 3 con Playwright e Google Chrome in `/usr/bin/google-chrome`.

## 6. Questioni aperte

- **Edizione italiana** di *Ḥayy ibn Yaqẓān*: da verificare in SBN (nelle slide e nel testo è citato solo il titolo *Il filosofo autodidatta*).
- **Traduzione olandese di Bouwmeester (1672)**: data non confermata da una fonte; nel testo è citata solo «una traduzione olandese».
- **Testi DUDU** nel PDF: confronto parola per parola con il sito del Senato consigliato prima della distribuzione.
- **Caratteri dei PDF**: generati con Lora e un carattere senza grazie di sistema (EB Garamond e Public Sans non scaricabili nell'ambiente); per i caratteri esatti esportare dagli artifact.
- **Roadmap disciplinare**: bozza da rivedere con un docente di scienze.
- **Livelli 2-7**: progettati sulla carta, da realizzare; proseguire con prove platform graduali e controllo del corpo/emozioni sempre più ricco.
