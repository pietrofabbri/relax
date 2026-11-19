# Testo di approfondimento: Ḥayy ibn Yaqẓān

**File finale:** `Hayy ibn Yaqzan - la storia e i diritti umani.pdf` (12 pagine A4).

## Contenuto
1. Introduzione · 2. L'autore e il suo tempo (con mappa e tabella cronologica) · 3. L'opera (titolo, forma, data, fonti) · 4. La storia episodio per episodio (con mappa dell'isola) · 5. Personaggi, luoghi, oggetti (tabelle) · 6. I temi · 7. Il viaggio del libro in Europa (con mappa del manoscritto) · 8. I diritti umani collegati alla storia, con **testo integrale** di DUDU artt. 1, 26, 19, 27 e Costituzione artt. 3, 33 (testo vigente, con l'ultimo comma sullo sport aggiunto dalla l. cost. 26 settembre 2023, n. 1) · 9. Fonti · 10. La storia nel gioco Respira (tutto ciò che riguarda il gioco sta **solo** qui, in fondo: richiesta esplicita).

**Note a piè di pagina:** 58 note numerate, ognuna nella pagina in cui la parola compare la prima volta (parole difficili, contesto storico, termini giuridici).

## Come si rigenera
- `contenuto.html`: il testo. Le parole da spiegare in nota si scrivono `{chiave}` oppure `{chiave|testo visibile}`.
- `genera.py`: contiene il dizionario `G` delle note (chiave → parola, definizione) e costruisce `hayy2.html`. Un piccolo script nella pagina impagina in fogli A4 e mette le note in fondo alla pagina giusta (se un blocco non ci sta, passa alla pagina dopo; un titolo non resta mai da solo in fondo).
- `pdf.py`: apre `hayy2.html` con Chrome (Playwright) e stampa il PDF.

```sh
sh strumenti/prepara_ambiente.sh      # una volta, dalla radice della repo
cd testi/hayy && python3 genera.py && python3 pdf.py
```
Carattere: Lora (installato nel sistema, `/usr/share/fonts/truetype/google-fonts/`). Le mappe vengono da `presentazioni/img/`.

## Da verificare
- Testi degli articoli DUDU riportati nella traduzione italiana UNRIC: struttura e frasi controllate in rete; un confronto parola per parola con il sito del Senato è consigliato prima della distribuzione.
- Edizione italiana dell'opera: citato solo il titolo con cui è nota (*Il filosofo autodidatta*); edizione precisa da cercare in SBN.
