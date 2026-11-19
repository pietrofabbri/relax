# Presentazioni

Tre presentazioni realizzate come artifact di tipo **Slides** su claude.ai. Qui c'è tutto per consultarle (PDF), rigenerarle e ripubblicarle, anche da un altro account.

| Presentazione | Cartella dei file pubblicati | Generatore | Artifact (account originale) | PDF |
| --- | --- | --- | --- | --- |
| Ḥayy ibn Yaqẓān: riferimenti letterari e diritti umani (52 slide) | `progetti/deckA2/project` | `deckA2.py` | slug `a61dd0cc-daf2-447a-99db-29add2d9989e` · https://claude.ai/artifact/MWjxVprbEfePH5ADPawYLu | `pdf/Hayy ibn Yaqzan - riferimenti letterari e diritti umani.pdf` |
| Respira: organizzazione del lavoro (20 slide) | `progetti/deckB2/project` | `deckB2.py` | slug `7e5156bc-4498-497b-b686-fec647da7a53` · https://claude.ai/artifact/GbhX6y7dsoVYMNp3c4Ugen | `pdf/Respira - organizzazione del lavoro.pdf` |
| Respira: roadmap disciplinare (40 slide) | `progetti/roadmap/project` | `roadmap.py` | slug `d4f42c17-6ac7-4409-af41-91feb286871d` · https://claude.ai/artifact/TJCEYzrnxQ77RApr8YdHmv | `pdf/Respira - roadmap disciplinare.pdf` |

I file in `progetti/` sono **identici a quelli pubblicati** al 19 novembre 2026, comprese le modifiche fatte a mano dall'utente nell'editor.

## Contenuto delle presentazioni

**Ḥayy ibn Yaqẓān** (documento di riferimento, tono formale). Parte I l'autore (profilo, luoghi, cronologia, nome, incarichi, corte almohade, Averroè, predecessori) · Parte II l'opera (titolo, forma, datazione, Avicenna, ambientazione, trama in 8 slide, elementi della storia in 6 tabelle, tre temi) · Parte III il viaggio del libro (manoscritto, edizione latina 1671, traduzioni, quaccheri, Robinson Crusoe, edizioni moderne) · Parte IV diritti umani (documenti, criteri, DUDU artt. 1, 26, 19, 27, Costituzione artt. 3 e 33, limiti, quadro riassuntivo) · Fonti.

**Organizzazione del lavoro.** Il gioco; le sette storie (mappa); storie e diritti; struttura del livello 1 (capitolo, prova, schema, domanda, carta, con schermate); il controllo del corpo in progressione; la settimana di lavoro; attività a casa (prova del gioco, fondale, guida della striscia); in classe (storia e diritti 20 minuti, game design); progressione dei contenuti scientifici; codice QR del gioco.

**Roadmap disciplinare.** Struttura (6 filoni), scala dei 4 mondi, principi di gradualità, codici, livelli e filoni, il livello 1 nella roadmap; per ogni filone (B, R, E, A, S, M) un'apertura e 4 tabelle (una per mondo: codice, nozione, prerequisiti, verifica); catene di prerequisiti, cautele scienza→gioco, revisione. Dati letti da `roadmap.json`, estratto da `documentazione/didattica/roadmap/roadmap-disciplinare-v2.md`.

## Come sono fatti i file (formato Slides v5)

- `project/deck.json`: titolo, `order` (ordine delle slide), `sections`, `faces` (caratteri Google: EB Garamond e Public Sans), `format.shared = ["project/deck.css"]`.
- `project/deck.css`: tutto lo stile comune.
- `project/slides/<id>.html`: una `<section id="<id>">` per slide, tela 1920×1080.
- Le immagini sono indirizzi `/_blob/<id>` validi **solo** nell'artifact in cui sono state caricate. `blob.json` dice a quale immagine di `img/` corrisponde ogni indirizzo.

## Strumenti

| File | A che cosa serve |
| --- | --- |
| `comune.py` | Classe `Deck`: impaginazioni (`pagina`, `larga`, `libera`), glossario, immagini con dimensioni esplicite, icone, stile sobrio (`CSS_SOBRIO`), pulizia automatica (occhielli formali, niente «·», niente colonne di icone nelle tabelle) |
| `deckA2.py`, `deckB2.py`, `roadmap.py` | Generatori delle tre presentazioni |
| `mappe.js`, `mappe_def.js`, `render_mappe.py` | Mappe disegnate in codice (SVG → PNG in `img/`) |
| `illustrazioni.py`, `ui.py` | Illustrazioni e schermate prese dal gioco (`img/scena-*`, `img/ui-*`) |
| `render2.py` | Anteprima locale delle slide in PNG e controllo che nulla esca dalla slide (limite 920 px) |
| `pdf.py` | PDF di tutte e tre le presentazioni (`pdf/`) |
| `ricollega_immagini.py` | Sostituisce gli indirizzi `/_blob/` dopo un nuovo caricamento delle immagini |
| `modifiche-utente-hayy/` | Slide di Ḥayy modificate a mano dall'utente (`dudu19`, `edizioni`, `temi2`): vanno ricopiate sopra dopo ogni rigenerazione |
| `img/` | Tutte le immagini (PNG ottimizzati) |

Prima di tutto: `sh strumenti/prepara_ambiente.sh` dalla radice della repo (gli script usano i percorsi `/home/claude/decks`, `/home/claude/testo`, `/home/claude/relax`).

## Rigenerare

```sh
cd /home/claude/decks
python3 deckA2.py && cp modifiche-utente-hayy/*.html progetti/deckA2/project/slides/
python3 deckB2.py      # poi: in casa-prova.html la didascalia va sopra l'immagine (scelta dell'utente)
python3 roadmap.py
python3 render2.py deckA2 /tmp/anteprima deckA2.py      # controllo
python3 pdf.py                                         # PDF aggiornati
```
**Attenzione:** rigenerare sovrascrive le modifiche fatte a mano nell'editor. Prima di rigenerare, confrontare con la versione pubblicata (punto seguente).

## Ripubblicare nello stesso account

Con gli strumenti artifact di Claude:
1. `list_files` sullo slug: confrontare gli `sha256` con i file locali (`sha256sum`). I file diversi sono modifiche dell'utente: leggerli con `read_file` e riportarle nel generatore (o copiarli così come sono).
2. `publish_files` con `mode: "patch"`, `base_version` = versione appena letta, solo i file cambiati; `remove` per le slide tolte.

## Ricreare in un nuovo account

1. `list_types` → tipo **Slides**; `create_from_type` con il titolo della presentazione.
2. `upload_asset` delle immagini usate (elenco in `blob.json`, file in `img/`): annotare i nuovi indirizzi in un file `nuovi.json` (`{"mappa-andalus": "/_blob/…", …}`).
3. `python3 ricollega_immagini.py deckA2 nuovi.json` (o `deckB2`, `roadmap`).
4. `publish_files` (modo `patch`) con `project/deck.json`, `project/deck.css` e tutte le `project/slides/*.html`.
5. Aggiornare link e slug in questo file e in `RIPARTIRE.md`.

## Regole di stile già concordate
Vedi `RIPARTIRE.md`, sezione 4: tono neutro e formale, nessuna menzione dello studente, glossario in ogni slide, nessuna colonna di disegni nelle tabelle, immagini con dimensioni esplicite.
