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
| **Stato** | **Fatto, versione 3** (13 novembre 2026): punti, serie, stelle per tappa, tre "Indovina!", semi di luce, effetti (scosse, zoom, lampi, rallentatore, coriandoli), sipario tra le tappe; il test automatico lo gioca tutto senza errori |
| **Codice** | `js/livello1.js` (tappe), `js/testi-it.js` (testi), `js/arte.js` (disegni), `js/mondo.js` (motore) |

## 2. Ambientazione

- **Luogo:** un'isola tropicale dell'Oceano Indiano, con una grotta, un canneto, animali.
- **Colore dominante:** sabbia e turchese.
- **Foglio guida:** in alto mare e cielo; al centro un sentiero tra le palme; in basso la riva.
- **Nota:** è il primo disegno del ragazzo da scansionare (sessione 1).

## 3. Tappe (versione 2)

Regola: **si capisce facendo**. Il testo è una riga in basso; in alto, una frase fissa dice cosa fare. Le pagine del quaderno arrivano come avviso che non blocca il gioco.

| Tappa | Ora del giorno | Cosa fa il giocatore | Pagina del quaderno |
| --- | --- | --- | --- |
| Segui | Alba | Tocca il sentiero e segue la cerva | — |
| Animali | Giorno | Tocca capra, uccello, tartaruga: la parte del corpo si illumina (corna, ali, guscio). Poi trascina su Hayy l'oggetto che la imita: bastone, mantello di foglie, scudo di corteccia. Hayy si equipaggia | B1.1 Ogni parte ha un compito |
| Corsa | Giorno | Corre dietro la cerva e tocca per saltare quattro ostacoli. Il corpo diventa trasparente: cuore che accelera, polmoni che si gonfiano, calore, sudore. Poi si siede e tutto torna giù | B1.2 Le parti lavorano insieme |
| Cocchi | Giorno | Tocca appena un cocco si stacca: tre prove, tempi in millesimi e grafico a barre | B1.3 Messaggi velocissimi · B1.6 Misura più volte |
| Cerva | Tramonto | Tiene il dito sulla cerva e sente il suo cuore rallentare (anelli e vibrazione) fino a fermarsi. Pianta tre fiori; la cerva sfuma. Il cuore di Hayy resta alto, poi torna giù da solo | R1.1 Il cuore batte sempre · B1.4 Messaggi lenti |
| Fuoco | Notte | Un fulmine incendia le canne. Tocca il bastone per accenderlo, poi tiene premuto per riparare la fiamma dalle raffiche mentre Hayy la porta alla grotta. Se si spegne, si riaccende | — |
| Calore | Notte | Accende la vista del calore (bottone con l'occhio) e tocca sasso (18°), capra (39°), sé stesso (37°) | B1.5 Il corpo cerca l'equilibrio |
| Misura | Notte | Facoltativo: conta il proprio polso per 30 secondi | R1.2 Il mio battito |
| Alba | Alba | Arriva una barca: va alla spiaggia e incontra Absal | — |
| Fine | — | Diritto (art. 26) e una domanda aperta | — |

### Indovina! (prima dell'esperimento)

| Tappa | Domanda | Risposta |
| --- | --- | --- |
| Corsa | Se Hayy corre, il cuore… accelera o rallenta? | accelera |
| Cerva | Dopo un'emozione forte, il cuore si calma… subito o piano piano? | piano piano |
| Calore | Chi è più caldo, il sasso o la capra? | la capra |

### Premi

Semi di luce lungo il sentiero (+10), oggetto copiato (+50), salti puliti di fila (+20 × serie), cocchi presi (da +20 "LENTO" a +100 "FULMINE!" sotto i 260 ms), raffiche parate (+30 × serie), fuoco nella grotta (+100), temperature scoperte (+30), Indovina giusto (+50). Alla fine di ogni tappa da 1 a 3 stelle.

## 4. Meccanica principale

**Imitare, provare, ascoltare il corpo.** Ogni tappa ha un gesto diverso (toccare, trascinare, saltare, reagire, tenere premuto, scegliere dove guardare), così il tutorial insegna tutti i comandi che servono nei livelli dopo.

## 5. Sfida finale

Portare il fuoco alla grotta nel vento: è la prima prova in cui si può fallire (e riprovare).

## 6. Pagina del quaderno

Il corpo è fatto di parti con compiti diversi, che lavorano insieme e si mandano messaggi. Per capirlo bisogna osservare, ripetere, confrontare. E si può sbagliare: anche Hayy si è sbagliato.

## 7. Il diritto del livello

Ognuno ha una mente per ragionare (art. 1) e il diritto di imparare (art. 26). [Il ragionamento completo](../didattica/storie/01-hayy-ibn-yaqzan/diritti.md)

## 8. Adattamenti e cose da evitare

- La dissezione della cerva **non si mostra**: Hayy ascolta il suo cuore, che non batte più.
- La morte della cerva è un lutto: tono delicato, nessun dettaglio crudo.

## 9. Accessibilità

- Nessuna prova a tempo blocca il gioco: nei cocchi un errore fa solo ripartire la prova; nella corsa un inciampo rallenta e basta.
- Le schede del quaderno si possono anche ascoltare.

## 10. Decisioni prese e aperte

- [x] I tre animali da osservare: capra, uccello, tartaruga
- [x] La scena del lutto: evocata con il suono del cuore che rallenta, senza immagini; Hayy seppellisce la cerva, come nel libro dopo aver osservato i corvi
- [x] La misura del battito è facoltativa ("Non ora"), e i numeri impossibili vengono rifiutati
- [ ] Sostituire il disegno provvisorio con la scansione dell'ambientazione del ragazzo (vedi `documentazione/sviluppo.md`)
- [ ] Far provare il livello a un bambino e annotare dove si blocca
