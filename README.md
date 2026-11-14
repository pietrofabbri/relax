# Respira

**Un videogioco per smartphone in cui si vince restando calmi, e si capisce perché.**

Progetto scolastico · 25 ore con uno studente di quinta, indirizzo biotecnologie ambientali · Aggiornato al 13 novembre 2026

---

## Gioca

<img src="assets/qr-gioco.png" alt="Codice QR per aprire il gioco" width="160" align="right">

**Sul telefono, come app.** Inquadra il codice QR (o apri `https://pietrofabbri.github.io/relax/`), poi:

- **Android (Chrome):** nella schermata iniziale del gioco tocca **Installa l'app**.
- **iPhone (Safari):** tocca **Condividi**, poi **Aggiungi alla schermata Home** (il gioco mostra i due passi).

L'icona sul telefono apre sempre la versione pubblicata su GitHub: ogni modifica caricata su `main` arriva da sola all'app la volta dopo che la si apre con la rete. Senza rete si gioca con l'ultima versione scaricata. Si gioca a tutto schermo, in orizzontale, con un dito.

**Senza internet, dal computer:** *Code → Download ZIP*, scompatta e apri `index.html` con un browser.

**Disponibile ora:** il livello 1, *L'isola* (storia di Hayy ibn Yaqzan). Gli altri livelli sono progettati e documentati.

---

## In una pagina

**Cos'è.** *Respira* è un'avventura in cui il gesto principale è un vero esercizio di respirazione: tieni premuto per inspirare, rilascia lentamente per espirare. Chi gioca si rilassa davvero, e intanto impara come funzionano il corpo e le emozioni.

**Per chi.** Si comincia dalle elementari; la scienza sale a gradini fino al livello universitario, ma resta sempre comprensibile a un ragazzo di 12 anni.

**Il viaggio.** Il Guardiano, una sagoma a inchiostro senza età, genere o cultura, ha un quaderno di viaggio. Ogni pagina è una storia di un altro luogo e di un altro tempo, da cinque continenti. Quando la apre, ne diventa uno dei personaggi:

| Livello | Storia | Da dove viene | Cosa insegna sul corpo | Quale diritto | Stato |
| --- | --- | --- | --- | --- | --- |
| 1 | Hayy ibn Yaqzan | Andalusia | Com'è fatto il corpo e come si studia | Ragionare e imparare | **Giocabile** |
| 2 | L'otre dei venti | Grecia | Il respiro guida il cuore | Riposare | Progettato |
| 3 | Sinuhe | Egitto | La paura è un allarme, a volte falso | Essere accolti | Progettato |
| 4 | Le persone di mais | Maya | Siamo fatti di ciò che mangiamo | Il cibo | Progettato |
| 5 | Māui e il sole | Polinesia | Luce e buio danno il ritmo al corpo | Orari ragionevoli e riposo | Progettato |
| 6 | Urashima Tarō | Giappone | Il mondo esterno può travolgerci | Il gioco e lo svago | Progettato |
| 7 | Sundiata | Mali | Tutto insieme | La dignità di ognuno | Progettato |

**Il filo che lega tutto.** Persone di culture ed epoche lontanissime hanno descritto lo stesso corpo: il cuore che corre per la paura, la stanchezza che vince anche gli eroi. **Il corpo è uguale per tutti, e per questo anche i diritti valgono per tutti.**

**Come lavora il ragazzo.** Ogni sessione comincia con 15 minuti di teoria e un esperimento sul proprio corpo; il resto è game design. La libertà cresce da un livello all'altro: i livelli 1 e 2 li costruiamo noi, nel 3 decide con dei sì/no, nel 4 sceglie tra varianti, nel 5 usa una scheda guida, dal 6 progetta da zero. Disegna lui tutte le ambientazioni. Non lavora mai a casa.

**Fatto per durare.** Solo standard del web (HTML, CSS, JavaScript semplice), nessuna libreria, formati aperti, funziona anche offline da una chiavetta. Gratuito, senza account, nessun dato raccolto.

---

## Com'è organizzato il repository

```
relax/
├── README.md                     ← questa presentazione
├── index.html                    ← il gioco
├── css/  js/  assets/            ← codice, testi e immagini del gioco
├── manifest.webmanifest, sw.js   ← installazione sul telefono e uso offline
├── strumenti/                    ← test automatico del livello 1
└── documentazione/
    ├── README.md                 indice della documentazione
    ├── sviluppo.md               come è fatto il codice, come aggiungere disegni e lingue
    ├── livelli/                  COME diventa gioco: una scheda per livello
    └── didattica/                COSA si insegna e DA DOVE viene
        ├── roadmap/              la scienza: 144 passi in 6 filoni e 4 mondi
        ├── storie/               le 7 storie: opera completa, vicende, diritti
        └── diritti/              i diritti umani spiegati a 12 anni
```

**Da dove cominciare:**
- per giocare → `index.html`;
- per capire **cosa si impara** → [la roadmap](documentazione/didattica/roadmap/README.md);
- per leggere **le storie** → [le sette storie](documentazione/didattica/storie/README.md);
- per il **perché dei diritti** → [i diritti umani](documentazione/didattica/diritti/README.md);
- per **progettare il gioco** → [i livelli](documentazione/livelli/README.md);
- per **lavorare sul codice** → [sviluppo](documentazione/sviluppo.md).

**Regola di manutenzione:** un file, un argomento. Ogni file ha in alto i collegamenti ai file vicini.

---

## Il piano delle 25 ore, in breve

| Fase | Ore | Cosa succede |
| --- | --- | --- |
| Partenza | 1-3 | Il ragazzo prova i livelli 1 e 2, decide il livello 3 con dei sì/no e disegna la prima ambientazione. **All'ora 3 il gioco è giocabile.** |
| Guidato | 4-10 | Livelli 4 e 5: varianti, poi scheda guida |
| Libero | 11-20 | Livelli 6 e 7 progettati da zero; test con un bambino delle elementari |
| Oltre | 21-25 | Un livello ponte del Mondo 3, revisione con il docente di scienze, presentazione finale |

---

## Stato e prossimi passi

**Fatto**
- Concept, meccaniche, tecnologia
- Roadmap disciplinare v2 (144 passi, revisione critica, fonti)
- Le sette storie: scelte, verificate su fonti, ordinate secondo la roadmap
- Documentazione didattica (storie e diritti) e schede dei livelli
- **App installabile** sul telefono (Android e iPhone), aggiornata da GitHub Pages
- **Fondale disegnato**: il disegno del ragazzo dietro a tutto il livello, anche fotografato dal telefono
- **Si legge per andare avanti**: tempo di lettura, domande di comprensione, spiegazioni con schemi
- **Stile a inchiostro**: mondo in bianco e nero su carta, colore solo dove conta; **guida da stampare** per la striscia del fondale ([PDF](documentazione/fondali/livello1-guida.pdf))
- **Storia sempre chiara**: prologo con cartina, capitoli con "Sei qui", album di carte da collezionare
- **Livello 1 giocabile, versione 5** (punti, serie, stelle, "Indovina!", effetti), con: poco testo, grafica disegnata dal codice con ora del giorno, luci e notte, nove attività diverse (imitare gli animali, corsa con il corpo trasparente, riflessi, il cuore della gazzella, il fuoco nel vento, la vista del calore, la misura del battito, l'arrivo di Absal)

**Da fare**
- [ ] Livello 2 (il respiro, con Ulisse): da costruire prima della sessione 1
- [ ] Livello 3 (Sinuhe) come semilavorato, con le decisioni sì/no per il ragazzo
- [ ] Scegliere con il ragazzo i nomi dei livelli
- [ ] Sostituire i disegni provvisori con le scansioni del ragazzo
- [ ] Roadmap v3: tutti i passi riscritti in linguaggio per dodicenni
- [ ] Revisione scientifica e storica da parte dei docenti
- [ ] Scegliere una licenza per il codice e per i contenuti

**Licenza:** da decidere. Finché non c'è, il contenuto resta di proprietà degli autori.
