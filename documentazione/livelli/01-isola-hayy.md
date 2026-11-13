# Livello 1 — L'isola

Torna a: [indice dei livelli](README.md) · Storia: [opera](../didattica/storie/01-hayy-ibn-yaqzan/opera.md) · [vicende](../didattica/storie/01-hayy-ibn-yaqzan/vicende.md) · [diritti](../didattica/storie/01-hayy-ibn-yaqzan/diritti.md)

## 1. Dati del livello

| | |
| --- | --- |
| **Storia** | Hayy ibn Yaqzan (Andalusia, XII secolo) |
| **Il Guardiano diventa** | Hayy |
| **Filone** | B — Basi comuni |
| **Passi della roadmap** | B1.1-B1.6, R1.1 |
| **Ruolo nel gioco** | Tutorial: si impara a muoversi, a osservare e a usare il quaderno |
| **Chi lo progetta** | Noi, completo prima della sessione 1 |
| **Stato** | **Fatto, versione 1** (13 novembre 2026): giocabile dall'inizio alla fine, testato su telefono simulato |
| **Codice** | `js/livello1.js` (logica), `js/testi-it.js` (testi), `js/mondo.js` (disegno) |

## 2. Ambientazione

- **Luogo:** un'isola tropicale dell'Oceano Indiano, con una grotta, un canneto, animali.
- **Colore dominante:** sabbia e turchese.
- **Foglio guida:** in alto mare e cielo; al centro un sentiero tra le palme; in basso la riva.
- **Nota:** è il primo disegno del ragazzo da scansionare (sessione 1).

## 3. Scene (come sono state costruite)

| Tappa | Scena | Cosa fa il giocatore | Pagina del quaderno |
| --- | --- | --- | --- |
| Prologo | Il quaderno si apre | Legge chi è il Guardiano, chi era Ibn Tufayl, chi è Hayy | — |
| Animali | Il risveglio | Esce dal rifugio e segue la cerva | — |
| Animali | Gli animali | Osserva capra, uccello e tartaruga: a cosa servono corna, ali, guscio | B1.1 Ogni parte ha un compito |
| Animali | La cerva corre | Vede che tutto cambia insieme; compare il battito (simulato) | B1.2 Le parti lavorano insieme |
| Riflessi | La palma | Minigioco: tocca lo schermo quando cade il cocco, tre prove, tempo in millesimi di secondo | B1.3 Messaggi velocissimi |
| Cerva | La cerva stanca | Ascolta il cuore della cerva che rallenta e si ferma; Hayy la seppellisce | R1.1 Il cuore batte sempre |
| Cerva | La tristezza | Il battito resta alto, poi torna da solo | B1.4 Messaggi lenti |
| Cerva | Il mio battito | Facoltativo: conta il proprio battito per 30 secondi | R1.2 Il mio battito |
| Fuoco | Le canne in fiamme | Si scotta, accende un bastone, porta il fuoco nella grotta | — |
| Fuoco | Caldo e freddo | Tocca il sasso, la capra e sé stesso | B1.5 Il corpo cerca l'equilibrio |
| Fuoco | Seconda misura | Facoltativo: misura di nuovo il battito e confronta | B1.6 Misurare, ripetere, confrontare |
| Absal | Lo straniero | Incontra Absal: imparare è un diritto | — |
| Fine | La pagina finale | Riassunto, diritto (art. 1 e 26), una domanda aperta | — |

## 4. Meccanica principale

**Osservare e annotare.** Toccando un animale o un oggetto, il Guardiano lo osserva e una scheda si aggiunge al quaderno. Il battito appare per la prima volta in alto, e il giocatore impara a leggerlo.

## 5. Sfida finale

Nessuna: è il livello tutorial. Si chiude quando il quaderno ha almeno tre schede.

## 6. Pagina del quaderno

Il corpo è fatto di parti con compiti diversi, che lavorano insieme e si mandano messaggi. Per capirlo bisogna osservare, ripetere, confrontare. E si può sbagliare: anche Hayy si è sbagliato.

## 7. Il diritto del livello

Ognuno ha una mente per ragionare (art. 1) e il diritto di imparare (art. 26). [Il ragionamento completo](../didattica/storie/01-hayy-ibn-yaqzan/diritti.md)

## 8. Adattamenti e cose da evitare

- La dissezione della cerva **non si mostra**: Hayy ascolta il suo cuore, che non batte più.
- La morte della cerva è un lutto: tono delicato, nessun dettaglio crudo.

## 9. Accessibilità

- Minigioco dei riflessi con difficoltà regolabile.
- Le schede del quaderno si possono anche ascoltare.

## 10. Decisioni prese e aperte

- [x] I tre animali da osservare: capra, uccello, tartaruga
- [x] La scena del lutto: evocata con il suono del cuore che rallenta, senza immagini; Hayy seppellisce la cerva, come nel libro dopo aver osservato i corvi
- [x] La misura del battito è facoltativa ("Non ora"), e i numeri impossibili vengono rifiutati
- [ ] Sostituire il disegno provvisorio con la scansione dell'ambientazione del ragazzo (vedi `documentazione/sviluppo.md`)
- [ ] Far provare il livello a un bambino e annotare dove si blocca
