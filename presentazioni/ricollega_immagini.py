"""Ricollega le immagini di una presentazione dopo averle caricate in un nuovo artifact.

Le slide puntano alle immagini con indirizzi /_blob/<id>, validi solo nell'artifact in cui sono state caricate.
In un nuovo account (o in un nuovo artifact) si caricano di nuovo le immagini di img/ con upload_asset
e si ottiene un nuovo indirizzo per ciascuna. Questo script sostituisce i vecchi indirizzi con i nuovi.

Uso:
  python3 ricollega_immagini.py <deck> nuovi.json
    <deck>     deckA2 | deckB2 | roadmap
    nuovi.json {"mappa-andalus": "/_blob/nuovoid", ...}  (nome immagine senza .png -> nuovo indirizzo)
Modifica: progetti/<deck>/project/slides/*.html e il generatore corrispondente (deckA2.py, deckB2.py, roadmap.py).
"""
import json, sys, glob, os
QUI = os.path.dirname(os.path.abspath(__file__))
deck, nuovi = sys.argv[1], json.load(open(sys.argv[2]))
vecchi = json.load(open(os.path.join(QUI, "blob.json")))[deck]["blob_immagine"]
gen = {"deckA2": "deckA2.py", "deckB2": "deckB2.py", "roadmap": "roadmap.py"}[deck]
file = glob.glob(os.path.join(QUI, "progetti", deck, "project", "slides", "*.html")) + [os.path.join(QUI, gen)]
if deck == "deckA2":
    file += glob.glob(os.path.join(QUI, "modifiche-utente-hayy", "*.html"))
for f in file:
    s = open(f).read()
    for vecchio, nome in vecchi.items():
        if nome in nuovi:
            s = s.replace(vecchio, nuovi[nome])
    open(f, "w").write(s)
print("Aggiornati", len(file), "file")
