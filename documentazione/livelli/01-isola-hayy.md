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
| **Stato** | **Fatto, versione 5** (14 novembre 2026): si legge per andare avanti (tempo di lettura e 16 domande di comprensione), 8 spiegazioni a schede con schemi, mondo a inchiostro con colore solo dove conta, striscia del fondale con guida da stampare. 15 novembre: domande di ragionamento con aiuto, spiegazione dei nervi con neuroni e sinapsi, fondale libero con gli oggetti del gioco sopra. **16 novembre, versione 6**: tre prove platform (si può perdere), carte d'oro da guadagnare, paesaggio che si tocca, parole nuove spiegate prima di usarle, domande più difficili |
| **Codice** | `js/livello1.js` (tappe), `js/avventura.js` (motore delle prove platform), `js/livelli/avventure-1.js` (le tre prove), `js/testi-it.js` (testi), `js/arte.js` (disegni), `js/mondo.js` (motore) |

## 2. Ambientazione

- **Luogo:** un'isola tropicale dell'Oceano Indiano, con una grotta, un canneto, animali.
- **Colore dominante:** sabbia e turchese.
- **Foglio guida:** in alto mare e cielo; al centro un sentiero tra le palme; in basso la riva.
- **Nota:** è il primo disegno del ragazzo da scansionare (sessione 1).

## Le prove platform (versione 6)

Tre prove in cui si gioca davvero: comandi a schermo (◀ ▶, salto, bastone), tre cuori, si può perdere.

| Prova | Dentro la tappa | Che cosa c'è | Si impara |
| --- | --- | --- | --- |
| Il bosco | Corsa | buche, granchi, cocchi che cadono, rovi da abbattere col bastone, spine, foglia elastica, un riccio | correndo il fiato cala; fermandosi torna (barra del fiato, cuore che sale) |
| La scogliera | Cocchi | piattaforme che si muovono, tronchi che crollano, vespe, ricci | — (abilità) |
| La notte dei fuochi | Calore | piume d'aquila (doppio salto, come nel libro), muro alto, fuochi da accendere per ripartire | — (abilità) |

- **Premio vero:** in ogni prova ci sono 3 pezzi di carta, nascosti nei punti difficili. Tutti e tre aprono una **carta d'oro** nell'album (★1-★3). Se ne manca uno, si può riprovare subito o andare avanti.
- **Si può perdere:** cadere in una buca o farsi colpire toglie un cuore. Senza cuori compare «Hai perso!» e si riprova la prova (non il livello).
- **Domande:** al primo colpo valgono 60 punti e un bollino; dopo un errore, 10.
- **Parole nuove:** cellula, zuccheri, ossigeno, evaporare, millesimo di secondo compaiono con un disegno prima di essere usate.
- **Paesaggio che si tocca:** animali, palme (cade un cocco), grotta (eco), sassi, cespugli, cielo (stella cadente). La prima volta ogni cosa dà un seme di luce.

## 3. Tappe (versione 2)

Regola: **si capisce facendo**. Il testo è una riga in basso; in alto, una frase fissa dice cosa fare. Le pagine del quaderno arrivano come avviso che non blocca il gioco.

| Tappa | Ora del giorno | Cosa fa il giocatore | Pagina del quaderno |
| --- | --- | --- | --- |
| Segui | Alba | Tocca il sentiero e segue la gazzella | — |
| Animali | Giorno | Tocca capra, uccello, tartaruga: la parte del corpo si illumina (corna, ali, guscio). Poi trascina su Hayy l'oggetto che la imita: bastone, mantello di foglie, scudo di corteccia. Hayy si equipaggia | B1.1 Ogni parte ha un compito |
| Corsa | Giorno | Corre dietro la gazzella e tocca per saltare quattro ostacoli. Il corpo diventa trasparente: cuore che accelera, polmoni che si gonfiano, calore, sudore. Poi si siede e tutto torna giù | B1.2 Le parti lavorano insieme |
| Cocchi | Giorno | Tocca appena un cocco si stacca: tre prove, tempi in millesimi e grafico a barre | B1.3 Messaggi velocissimi · B1.6 Misura più volte |
| Gazzella (tappa `cerva`) | Tramonto | Tiene il dito sulla gazzella e sente il suo cuore rallentare (anelli e vibrazione) fino a fermarsi. Pianta tre fiori; la gazzella sfuma. Il cuore di Hayy resta alto, poi torna giù da solo | R1.1 Il cuore batte sempre · B1.4 Messaggi lenti |
| Fuoco | Notte | Un fulmine incendia le canne. Tocca il bastone per accenderlo, poi tiene premuto per riparare la fiamma dalle raffiche mentre Hayy la porta alla grotta. Se si spegne, si riaccende | — |
| Calore | Notte | Accende la vista del calore (bottone con l'occhio) e tocca sasso (18°), capra (39°), sé stesso (37°) | B1.5 Il corpo cerca l'equilibrio |
| Misura | Notte | Facoltativo: conta il proprio polso per 30 secondi | R1.2 Il mio battito |
| Alba | Alba | Arriva una barca: va alla spiaggia e incontra Absal | — |
| Fine | — | Diritto (art. 26) e una domanda aperta | — |

### La storia, capitolo per capitolo

Prima di ogni tappa si chiude il sipario e si apre il **capitolo**: icona grande, "Nel libro" (2-3 frasi brevi, solo ciò che il libro racconta davvero), "▶" (cosa si fa nel gioco) e il filo dei 9 capitoli con **Sei qui**. Il filo si può riaprire in ogni momento con il bottone del libro in alto.

Il **prologo** è fatto di 5 immagini con una frase ciascuna: la cartina di Al-Andalus, Ibn Tufayl che scrive, la rotta fino all'isola (immaginaria) vicino all'India, la gazzella e il neonato, "Ora Hayy sei tu!".

### Spiegazioni con schema (prima di ogni carta)

Le domande **non chiedono di ripetere una frase**: chiedono di usare ciò che si è capito in una situazione nuova. Se si sbaglia, compare un aiuto per ragionare (non la risposta) e si riprova.

| Carta | Schema (si costruisce scheda dopo scheda) | Domanda di ragionamento |
| --- | --- | --- |
| B1.1 Ogni parte ha un compito | il corpo e i suoi organi | Stai leggendo: quale organo lavora di più? |
| B1.2 Lavorano insieme | muscoli → ossigeno → respiro → cuore → calore → sudore | Sali le scale di corsa: che cosa NON succede? |
| B1.3 Neuroni e riflessi | neurone, assone, segnale elettrico (fino a 100 m/s), sinapsi; occhio → cervello → mano; dove si spende il tempo | Stanco o distratto, prendi il cocco più tardi: perché? |
| B1.6 Misura più volte | tre misure e la media | 300, 200 e 250 millesimi: qual è la media? |
| R1.1 Il cuore non si ferma | il cuore-muscolo, 100.000 battiti al giorno | Quanti battiti in 10 giorni? |
| B1.4 Ormoni: messaggi lenti | nervi (veloci, brevi) e sangue (ormoni, adrenalina: lenti, durano minuti) | Dopo una lite sei ancora agitato: perché? |
| B1.5 Sempre 37 gradi | il termostato del cervello: sudore che raffredda, brividi che scaldano | Batti i denti dal freddo: a che cosa serve? |
| (ponte al livello 2) | fuoco e cellule: ossigeno + combustibile = energia | Una candela sotto un barattolo: che cosa succede? |

Anche i capitoli della storia hanno domande di ragionamento (per esempio: "Sull'isola non ci sono adulti né libri: come potrà imparare Hayy?").

### Absal insegna le parole

Absal dice una parola nella sua lingua (in arabo, con la pronuncia): نار *nār* (fuoco), ماعز *māʿiz* (capra), قارب *qārib* (barca). Hayy tocca la cosa giusta e scopre la parola italiana. È il diritto di imparare, giocato: da soli si fatica, insieme si impara prima.

### Indovina! (prima dell'esperimento)

| Tappa | Domanda | Risposta |
| --- | --- | --- |
| Corsa | Se Hayy corre, il cuore… accelera o rallenta? | accelera |
| Gazzella | Dopo un'emozione forte, il cuore si calma… subito o piano piano? | piano piano |
| Calore | Chi è più caldo, il sasso o la capra? | la capra |
| Fuoco | Per bruciare, il fuoco ha bisogno di… aria o acqua? | aria (ponte verso il livello 2: anche il corpo "brucia" il cibo con l'aria) |

### Premi

Semi di luce lungo il sentiero (+10), oggetto copiato (+50), salti puliti di fila (+20 × serie), cocchi presi (da +20 "LENTO" a +100 "FULMINE!" sotto i 260 ms), raffiche parate (+30 × serie), fuoco nella grotta (+100), temperature scoperte (+30), Indovina giusto (+50). Alla fine di ogni tappa da 1 a 3 stelle.

## 4. Meccanica principale

**Imitare, provare, ascoltare il corpo.** Ogni tappa ha un gesto diverso (toccare, trascinare, saltare, reagire, tenere premuto, scegliere dove guardare), così il tutorial insegna tutti i comandi che servono nei livelli dopo.

## 5. Sfida finale

Portare il fuoco alla grotta nel vento: è la prima prova in cui si può fallire (e riprovare).

## 6. Le carte dell'album (8)

Ogni scoperta è una carta con simbolo, titolo, una frase e codice della roadmap: B1.1 puzzle, B1.2 ingranaggi, B1.3 fulmine, B1.6 frecce, R1.1 cuore, B1.4 goccia, B1.5 termometro, R1.2 battito.

## 6b. In sintesi

Il corpo è fatto di parti con compiti diversi, che lavorano insieme e si mandano messaggi. Per capirlo bisogna osservare, ripetere, confrontare. E si può sbagliare: anche Hayy si è sbagliato.

## 7. Il diritto del livello

Ognuno ha una mente per ragionare (art. 1) e il diritto di imparare (art. 26). [Il ragionamento completo](../didattica/storie/01-hayy-ibn-yaqzan/diritti.md)

## 8. Adattamenti e cose da evitare

- La dissezione della gazzella **non si mostra**: Hayy ascolta il suo cuore, che non batte più.
- La morte della gazzella è un lutto: tono delicato, nessun dettaglio crudo.

## 9. Accessibilità

- Nessuna prova a tempo blocca il gioco: nei cocchi un errore fa solo ripartire la prova; nella corsa un inciampo rallenta e basta.
- Le schede del quaderno si possono anche ascoltare.

## 10. Decisioni prese e aperte

- [x] I tre animali da osservare: capra, uccello, tartaruga
- [x] La scena del lutto: evocata con il suono del cuore che rallenta, senza immagini; Hayy seppellisce la gazzella, come nel libro dopo aver osservato i corvi
- [x] La misura del battito è facoltativa ("Non ora"), e i numeri impossibili vengono rifiutati
- [ ] Sostituire il disegno provvisorio con la scansione dell'ambientazione del ragazzo (vedi `documentazione/sviluppo.md`)
- [ ] Far provare il livello a un bambino e annotare dove si blocca
