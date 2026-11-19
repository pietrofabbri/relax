#!/bin/sh
# Prepara i percorsi usati dagli script delle presentazioni e dei testi.
# Gli script sono stati scritti con percorsi assoluti (/home/claude/decks, /home/claude/testo, /home/claude/relax):
# questi collegamenti li fanno puntare alle cartelle della repo, ovunque sia stata clonata.
# Uso: sh strumenti/prepara_ambiente.sh   (dalla radice della repo)
set -e
REPO="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p /home/claude
[ "$REPO" = "/home/claude/relax" ] || ln -sfn "$REPO" /home/claude/relax
for coppia in "presentazioni:/home/claude/decks" "testi/hayy:/home/claude/testo"; do
  sorgente="$REPO/${coppia%%:*}"; dest="${coppia#*:}"
  if [ -d "$dest" ] && [ ! -L "$dest" ]; then echo "Attenzione: $dest esiste già come cartella: spostala e rilancia."; exit 1; fi
  ln -sfn "$sorgente" "$dest"
done
# i generatori scrivono in /home/claude/decks/<deck>/project: li facciamo puntare a progetti/<deck>
for d in deckA2 deckB2 roadmap; do ln -sfn "$REPO/presentazioni/progetti/$d" "$REPO/presentazioni/$d"; done
echo "Pronto: /home/claude/decks -> $REPO/presentazioni"
