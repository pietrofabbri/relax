import sys
sys.path.insert(0, "/home/claude/decks")
from comune import Deck, CSS_BASE, CSS_SOBRIO

B = {
 "mappa-mondo": "/_blob/4c45a90c0fb734bf10de60d939292d3c",
 "ui-capitolo-domanda": "/_blob/98d53413d22391fb8d4a0d7ec0e726b7",
 "ui-capitolo-aiuto": "/_blob/7f0938eff59ac37668b805558310805c",
 "ui-schema": "/_blob/9858385615505e5b5c56b2f9d77a621a",
 "ui-domanda": "/_blob/5604c43ca88a25f6f78746fd75dcfe87",
 "ui-carta": "/_blob/04a0e204e4f700ffc2c4e3808fb727c3",
 "ui-sfida": "/_blob/6fb33753ad726f3d0025684c4f34fedc",
 "qr": "/_blob/1863ea242948122003e379481abc3c22",
 "ui-titolo": "/_blob/5bd638b611260f189ad171e81a60a19b",
 "scena-isola-alba": "/_blob/33cfea52f1432432d0546388895efcff",
 "scena-gazzella": "/_blob/e4af96eb97f644a79fa0a2b91fac0727",
 "scena-fuoco": "/_blob/ca2a271592b407297298e6c4d76aa5e5",
 "scena-palme-grotta": "/_blob/1b129737b4bca71eea6e1f61365aa93c",
 "guida-2": "/_blob/d0d97981cf45785ca23fe86ba5665fcb",
 "ui-platform": "/_blob/d0a2824353d65b8752b86e1885a49485",
 "ui-parola": "/_blob/67bee0dd69db069bcfce904c85a4d567",
 "ui-risultato": "/_blob/ca7b109421efeff88d1a6ae571dc1fb7",
}
D = Deck("/home/claude/decks/deckB2/project", B)
P = D.punti
URL = "pietrofabbri.github.io/relax"

def passi(voci):
    """voci: (numero, icona, titolo, testo)"""
    h = "".join(f'<div class="passo"><span class="pn">{n}</span>{D.ico(i, 84)}<p class="pt">{t}</p><p class="pd">{d}</p></div>' for n, i, t, d in voci)
    return f'<div class="passi">{h}</div>'


D.add("copertina", "notte copertina", f'''<div class="cop-testo">
<p class="occhiello">Progetto Respira</p>
<h1>Organizzazione del lavoro</h1>
<div class="filetto"></div>
<p class="sotto">Il gioco, le storie, la settimana di lavoro</p>
<p class="sotto piccolo">Novembre 2026</p></div>
<div class="cop-vis">{D.img("ui-titolo", maxh=520, maxw=900)}</div>''')

D.pagina("gioco", "Il gioco", "Il gioco Respira",
 P(["<b>Applicazione per smartphone</b>,<br>installabile e utilizzabile anche senza rete.",
    "<b>Obiettivo</b>: insegnare a rilassarsi<br>e spiegare il funzionamento del corpo e del cervello.",
    "<b>Destinatari</b>: fino a 12 anni.<br>Ogni contenuto è calibrato sulla comprensione di un dodicenne."]),
 D.img("ui-platform", "Una prova del livello 1", maxh=500),
 [("Rilassamento", "riduzione della tensione del corpo e della mente"),
  ("Neurobiologia", "scienza che studia il sistema nervoso")])

D.larga("storie", "Le storie", "Sette storie da sette culture",
 D.img("mappa-mondo", maxh=420, maxw=1696),
 P(["Ogni livello prende avvio da un <b>testo antico</b> di una cultura diversa.",
    "Il primo è <b>Ḥayy ibn Yaqẓān</b>, scritto in al-Andalus nel XII secolo."]),
 [("Cultura", "insieme di usi, idee e racconti di un popolo")], alt=True)

D.pagina("diritti", "Le storie", "Storie e diritti umani",
 P(["Ogni storia è collegata ad alcuni <b>diritti umani</b>.",
    "Per la prima storia: la <b>ragione</b> di ogni persona<br>e il <b>diritto all'istruzione</b>.",
    "Le storie sono lette e discusse <b>insieme</b>."]),
 D.icone([("cervello", "Ragione", "Dichiarazione universale, art. 1"),
          ("scuola", "Istruzione", "Dichiarazione universale, art. 26; Costituzione, art. 34"),
          ("bilancia", "Uguaglianza", "Costituzione, art. 3")], 1),
 [("Diritti umani", "diritti che spettano a ogni persona, fissati in documenti come la Dichiarazione universale del 1948")])

L1 = "Il livello 1"
D.libera("l1", L1, "Struttura del livello 1",
 passi([("1", "libro", "Capitolo", "lettura di una parte della storia"),
        ("2", "corsa", "Prova", "gioco di movimento"),
        ("3", "cervello", "Schema", "spiegazione illustrata del corpo"),
        ("4", "puzzle", "Domanda", "ragionamento su un caso nuovo"),
        ("5", "stella", "Carta", "sintesi della scoperta, nell'album")])
 + '<div class="basso"><div class="testo">' + P(["Il livello è diviso in <b>nove capitoli</b>.<br>Ciascuno alterna questi cinque momenti."]) + '</div>'
 + D.parole([("Livello", "parte del gioco con una storia e prove proprie"),
             ("Capitolo", "segmento della storia")]) + '</div>')

D.pagina("l1-capitolo", L1 + " · Capitolo", "Il capitolo",
 P(["Una <b>breve parte</b> della storia,<br>in due righe.",
    "Segue una <b>domanda di ragionamento</b>:<br>la risposta non si trova nel testo, va dedotta.",
    "Si prosegue solo dopo aver risposto correttamente."]),
 D.img("ui-capitolo-domanda", "", maxh=480),
 [("Dedurre", "ricavare una conclusione da ciò che si sa")], alt=True)

D.pagina("l1-aiuto", L1 + " · Capitolo", "L'errore e l'aiuto",
 P(["Una risposta errata <b>non blocca</b> il gioco.",
    "Compare un <b>indizio</b>, non la soluzione.",
    "La risposta corretta al <b>primo tentativo</b> vale più punti."]),
 D.img("ui-capitolo-aiuto", "Indizio dopo una risposta errata", maxh=480),
 [("Indizio", "informazione che orienta verso la risposta")])

D.pagina("l1-sfida", L1 + " · Prova", "La prova",
 P(["Tre prove di <b>tipo platform</b>: corsa, salti,<br>nemici, piattaforme mobili.",
    "Comandi a schermo. Tre o più <b>cuori</b>:<br>si può perdere e ripetere la prova."],),
 D.img("ui-platform", "", maxh=480),
 [("Platform", "genere di gioco in cui il personaggio corre e salta tra piattaforme")], alt=True)

D.libera("l1-corpo", L1 + " · Prova", "Il controllo del corpo, in progressione",
 '<table class="tabella"><tr><th></th><th>Prova</th><th>Che cosa va controllato</th><th>Come</th></tr>'
 + f'<tr><td class="i"></td><td><b>1. Il bosco</b></td><td>il <b>fiato</b></td><td>correndo cala; fermandosi torna</td></tr>'
 + f'<tr><td class="i"></td><td><b>2. La scogliera</b></td><td>il fiato e la <b>calma</b></td><td>un colpo agita il personaggio; fermarsi e respirare lo calma</td></tr>'
 + f'<tr><td class="i"></td><td><b>3. La notte dei fuochi</b></td><td>fiato, calma e <b>calore</b></td><td>lontano dai fuochi il corpo si raffredda</td></tr></table>'
 + '<div class="basso"><div class="testo">' + P(["Nei livelli successivi la gestione del corpo, e poi delle emozioni, si arricchisce di nuovi elementi."]) + '</div>'
 + D.parole([("Progressione", "aumento graduale della difficoltà")]) + '</div>')

D.pagina("l1-schema", L1 + " · Schema", "Lo schema",
 P(["Dopo la prova, un <b>disegno animato</b><br>spiega che cosa è successo nel corpo.",
    "Ogni termine nuovo è presentato <b>prima</b> di essere usato,<br>con una figura: cellula, zuccheri, ossigeno.",
    "Esempio: il percorso <b>polmoni, cuore, muscoli</b>."]),
 D.img("ui-parola", "Presentazione di un termine nuovo", maxh=480),
 [("Cellula", "unità più piccola di cui è fatto un essere vivente")])

D.pagina("l1-domanda", L1 + " · Domanda", "La previsione",
 P(["Prima di alcune esperienze si chiede<br>di <b>prevedere</b> il risultato.",
    "Il gioco mostra poi che cosa accade.",
    "Il procedimento riprende il metodo scientifico:<br><b>ipotesi, prova, verifica</b>."]),
 D.img("ui-domanda", "Scelta prima dell'esperienza", maxh=480),
 [("Ipotesi", "previsione da mettere alla prova")], alt=True)

D.pagina("l1-carta", L1 + " · Carta", "La carta e l'album",
 P(["Ogni scoperta diventa una <b>carta</b>.",
    "Le carte d'oro si ottengono solo<br>trovando <b>tutti i pezzi</b> di una prova.",
    "L'album è consultabile in ogni momento."]),
 D.img("ui-risultato", "Esito di una prova", maxh=480),
 [("Album", "raccolta delle carte ottenute")])

D.libera("settimana", "La settimana", "La settimana di lavoro",
 passi([("1", "fulmine", "Martedì sera", "pubblicazione della nuova versione"),
        ("2", "occhio", "A casa", "prova sul telefono e disegno"),
        ("3", "ingranaggi", "In classe, all'inizio", "verifica comune delle correzioni"),
        ("4", "libro", "In classe, 20 minuti", "storia e diritti umani"),
        ("5", "puzzle", "In classe, il resto", "game design")])
 + '<div class="basso"><div class="testo">' + P(["Ogni incontro parte dalla versione<br>provata a casa durante la settimana."]) + '</div>'
 + D.parole([("Versione", "rilascio del gioco con le correzioni")]) + '</div>', alt=True)

D.pagina("casa-prova", "A casa", "Prova della nuova versione",
 P(["Il gioco si apre dal <b>collegamento</b> o dal <b>codice QR</b>.",
    "Si annotano i punti <b>poco chiari</b>,<br>gli <b>errori</b> e le parti <b>poco interessanti</b>.",
    "Le correzioni sono verificate insieme in classe."]),
 D.img("ui-titolo", "Schermata iniziale", maxh=460),
 [("Codice QR", "immagine che il telefono legge per aprire un indirizzo")])

D.pagina("casa-disegna", "A casa", "Il fondale",
 P(["Il <b>fondale</b> è lo sfondo del livello:<br>una lunga striscia di paesaggio.",
    "È disegnato a mano, in modo libero, ma sempre con stile coerente.",
    "Palme, grotta, animali e personaggi<br>sono aggiunti dal gioco sopra il disegno."]),
 D.img("scena-palme-grotta", "Fondale con gli elementi del gioco", maxh=440),
 [("Fondale", "disegno che sta dietro alla scena, come le quinte a teatro")], alt=True)

D.pagina("guida", "A casa", "La guida per la striscia",
 P(["Una guida stampabile indica le <b>misure</b> della striscia.",
    "La <b>fascia grigia</b> in basso è coperta dal terreno.",
    "Il disegno si fotografa e si carica nel gioco."]),
 D.img("guida-2", "Particolare della guida", maxh=440),
 [("Proporzione", "rapporto tra larghezza e altezza")])

D.pagina("classe-storia", "In classe", "Storia e diritti umani (20 minuti)",
 P(["Lettura e discussione della <b>storia del livello</b>.",
    "Contesto: <b>luogo</b>, <b>epoca</b> e <b>autore</b>.",
    "Collegamento con i <b>diritti umani</b>."]),
 D.img("scena-gazzella", "Ḥayy e la gazzella", maxh=440),
 [("Contesto", "situazione storica in cui nasce un testo")])

D.pagina("classe-design", "In classe", "Game design",
 P(["Analisi di <b>come si gioca</b>:<br>prove, premi, ostacoli, errori.",
    "Che cosa rende un gioco <b>interessante</b><br>e che cosa lo rende <b>chiaro</b>.",
    "Gli argomenti sono introdotti <b>gradualmente</b>."]),
 D.icone([("corsa", "Meccaniche", "azioni possibili del personaggio"),
          ("stella", "Premi", "che cosa si ottiene e come"),
          ("lucchetto", "Ostacoli", "che cosa rende difficile")], 1),
 [("Game design", "progettazione delle regole e dell'esperienza di gioco")], alt=True)

D.pagina("scienza", "Contenuti", "Progressione dei contenuti scientifici",
 P(["Dal più semplice al più complesso"]),
 D.icone([("puzzle", "Cellula", "unità dei viventi"), ("fulmine", "Neurone", "trasmette segnali"),
          ("cuore", "Cuore", "spinge il sangue"), ("polmoni", "Polmoni", "caricano l'ossigeno")]),
 None)

D.add("fine", "notte fine", f'''<div class="cop-testo">
<p class="occhiello">Accesso al gioco</p>
<h2>Codice QR</h2>
<p class="sotto">Indirizzo: <b>{URL}</b></p>
<p class="sotto piccolo">Installabile sulla schermata principale del telefono.<br>Funziona senza rete. Non raccoglie dati.</p></div>
<div class="qr-box"><img src="{B["qr"]}" alt="Codice QR del gioco Respira"></div>''')

CSS = '''section {
  --carta: #F5F4F0; --carta2: #E9E7E0; --inchiostro: #1F2A33; --testo: #3B4550; --muto: #626B74;
  --accento: #24525C; --linea: #C9C6BC; --fondo-parole: transparent; --fondo-cella: transparent;
  --serif: 'EB Garamond', Georgia, serif;
  background: var(--carta); color: var(--inchiostro);
  font-family: 'Public Sans', Arial, sans-serif; font-size: 29px; line-height: 1.4;
}
.alt { background: var(--carta2); }
.notte { background: var(--inchiostro); color: #EEF0F0; }
.notte .occhiello { color: #9CC3C9 !important; }
h1 { font-family: var(--serif); font-weight: 600; font-size: 104px; line-height: 1.02; margin: 0; color: #EEF0F0; }
h2 { font-family: var(--serif); font-weight: 600; font-size: 60px; line-height: 1.08; margin: 0 0 8px; color: var(--inchiostro); }
.notte h2 { color: #EEF0F0; font-size: 84px; }
p { margin: 0; color: var(--testo); }
.copertina, .fine { display: flex; align-items: center; gap: 72px; padding: 112px; }
.cop-testo { flex: 1; display: flex; flex-direction: column; gap: 26px; }
.cop-vis { width: 900px; flex: none; }
.filetto { width: 160px; background: #9CC3C9; }
.notte .sotto { font-size: 34px; color: #C9CFD2; line-height: 1.35; }
.notte .sotto b { color: #EEF0F0; }
.notte .sotto.piccolo { font-size: 26px; color: #98A1A8; }
.notte .fig img { border-color: #3A4652 !important; }
.qr-box { width: 600px; height: 600px; background: #fff; display: flex; align-items: center; justify-content: center; flex: none; }
.qr-box img { width: 520px; height: 520px; image-rendering: pixelated; }
.passi { display: flex; gap: 0; width: 100%; margin-top: 12px; border-top: 2px solid var(--inchiostro); }
.passo { flex: 1; padding: 22px 20px 10px; display: flex; flex-direction: column; align-items: flex-start; gap: 10px; border-right: 1px solid var(--linea); }
.passo:last-child { border-right: none; }
.pn { font-family: var(--serif); font-size: 44px; font-weight: 600; color: var(--accento); line-height: 1; }
.pt { font-family: var(--serif); font-size: 32px; font-weight: 600; color: var(--inchiostro); line-height: 1.1; }
.pd { font-size: 24px; line-height: 1.3; }
.basso { margin-top: 28px; }
''' + CSS_BASE + CSS_SOBRIO

D.scrivi("Respira: organizzazione del lavoro", "copertina",
 {"s0": {"description": "Copertina, il gioco, le storie", "start": "copertina"},
  "s1": {"description": "Il livello 1: struttura, prove, schemi, domande, carte", "start": "l1"},
  "s2": {"description": "La settimana: a casa e in classe", "start": "settimana"},
  "s3": {"description": "Contenuti scientifici e accesso al gioco", "start": "scienza"}},
 {"eb-garamond": {"family": "EB Garamond", "href": "https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400..700&family=Public+Sans:wght@400;600;700&display=swap"},
  "public-sans": {"family": "Public Sans", "href": "https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;600;700&display=swap"}},
 CSS)
