import sys
sys.path.insert(0, "/home/claude/decks")
from comune import Deck, CSS_BASE, CSS_SOBRIO

B = {
 "mappa-andalus": "/_blob/a3d367bccd30527179d234e30406d43d",
 "mappa-filosofi": "/_blob/2a94d0393dab889dd89e126a246bbee9",
 "mappa-isola": "/_blob/99879b8d7d3cba76dbb1c56bec3e3592",
 "mappa-manoscritto": "/_blob/77d17334446c98126d1e274c4bae0172",
 "mappa-traduzioni": "/_blob/1c76435448c6a1d6a3e1c5ad49565413",
 "scena-isola-alba": "/_blob/370640d20392964525f377ecae3dbf1a",
 "scena-gazzella": "/_blob/ba28efe2f8930a4d8a7c8dcdb3b0ced9",
 "scena-animali": "/_blob/9873a6a3d1d05cb7c32f0cac59697ddd",
 "scena-palme-grotta": "/_blob/46f0f3843c33ac38b9bde7f9fa2beae5",
 "scena-tramonto-gazzella": "/_blob/da1f20aab78440aadeda0a19dd9c732e",
 "scena-fuoco": "/_blob/f6e2aef9c1f11c39f7529ccc6e64b149",
 "scena-barca-absal": "/_blob/9853a28aaed8db42806c2b3e0508a578",
}
D = Deck("/home/claude/decks/deckA2/project", B)
P = D.punti
ILL = "Illustrazione a inchiostro dal gioco Respira"

def tempo(voci):
    """voci: (anno, testo, icona, altro)"""
    h = "".join(
        f'<div class="lt-voce{" altro" if a else ""}"><span class="lt-anno">{y}</span><span class="lt-pallino"></span>'
        f'{D.ico(i, 64) if i else ""}<p class="lt-testo">{t}</p></div>' for y, t, i, a in voci)
    return f'<div class="linea-tempo">{h}</div>'

def capitolo(id, num, tit, sotto, visivo):
    D.add(id, "scuro capitolo", f'<div class="cap-testo"><p class="numero">{num}</p><h2>{tit}</h2><p class="sotto">{sotto}</p></div><div class="cap-vis">{visivo}</div>')

# ======================================================================
D.add("copertina", "scuro copertina", f'''<div class="cop-testo">
<p class="occhiello">Progetto Respira · Storia 1 · Documento di riferimento</p>
<h1>Ḥayy ibn Yaqẓān</h1>
<p class="autore">di Ibn Ṭufayl</p>
<div class="filetto"></div>
<p class="sotto">Riferimenti letterari, elementi della storia e diritti umani collegati</p>
<p class="data">Novembre 2026</p></div>
<div class="cop-vis">{D.img("scena-isola-alba", maxh=520, maxw=860)}</div>''')

D.pagina("indice", "Indice", "Struttura del documento",
 P(["<b>I · L'autore</b><br>chi era, dove e quando è vissuto",
    "<b>II · L'opera</b><br>titolo, trama, tutti gli elementi della storia, temi",
    "<b>III · Il viaggio del libro</b><br>manoscritti, traduzioni, lettori in Europa",
    "<b>IV · Diritti umani</b><br>gli articoli collegati alla storia, con i limiti",
    "<b>V · Fonti</b>"]),
 D.icona_grande("libro", "Un libro scritto in arabo intorno al 1170"))

# ======================================================================
capitolo("cap1", "I", "L'autore", "Ibn Ṭufayl, medico e filosofo<br>nella Spagna musulmana del XII secolo", D.img("mappa-andalus", maxh=640, maxw=860))

D.pagina("chi", "I · L'autore", "Profilo biografico",
 P(["Era un <b>medico</b>,<br>un <b>filosofo</b>,<br>un <b>astronomo</b> e un <b>poeta</b>.",
    "Lavorò per molti anni alla <b>corte</b> di un sovrano,<br>come consigliere e medico personale.",
    "Ha scritto <b>un solo libro di filosofia</b> che ci è arrivato:<br>la storia di Ḥayy."]),
 D.icona_grande("cervello", "In latino era chiamato Abubacer"),
 [("Filosofo", "chi cerca di capire con il ragionamento come è fatto il mondo e come vivere"),
  ("Corte", "le persone che vivono e lavorano intorno a un re")],
 "Fonti: Encyclopaedia Britannica, «Ibn Ṭufayl»; T. Kukkonen, Ibn Tufayl (2014).")

D.pagina("dove", "I · L'autore · Dove", "Luoghi di nascita e di morte",
 P(["Nacque a <b>Guadix</b>, vicino a <b>Granada</b>,<br>nel sud dell'attuale Spagna.",
    "Alcune fonti indicano altri due paesi vicini:<br><b>Purchena</b> o <b>Tíjola</b>.",
    "Morì a <b>Marrakech</b>, in Marocco,<br>dall'altra parte dello stretto di Gibilterra."]),
 D.img("mappa-andalus", "Al-Andalus e il Marocco nel XII secolo", maxh=640),
 [("Al-Andalus", "il nome arabo delle terre della penisola iberica governate da sovrani musulmani (dal 711 al 1492)"),
  ("Stretto", "un braccio di mare stretto tra due terre")],
 "Fonti: Encyclopaedia Britannica; M. Forcada, Biographical Encyclopedia of Astronomers.")

D.libera("quando", "I · L'autore · Quando", "Cronologia essenziale",
 tempo([("1105–1110", "nasce Ibn Ṭufayl", "bimbo", False),
        ("1147", "gli Almohadi conquistano Marrakech", "scudo", False),
        ("1155", "Federico Barbarossa diventa imperatore", "", True),
        ("1163", "Abū Yaʿqūb Yūsuf diventa califfo · si posa la prima pietra di Notre-Dame a Parigi", "stella", False),
        ("1176", "battaglia di Legnano", "", True),
        ("1182", "si ritira; lo sostituisce Averroè", "libro", False),
        ("1185–1186", "muore a Marrakech", "luna", False)])
 + '<div class="basso"><div class="testo">' + P(["<b>In rosso</b>: la vita di Ibn Ṭufayl.<br><b>In grigio</b>: che cosa succedeva intanto in Italia e in Europa."]) + '</div>'
 + D.parole([("XII secolo", "gli anni dal 1101 al 1200"), ("Califfo", "capo politico e religioso di uno Stato musulmano")]) + '</div>',
 "Le date di nascita e di morte variano tra le fonti: si riportano gli intervalli.")

D.pagina("nome", "I · L'autore · Il nome", "Il nome completo",
 '<div class="nome-arabo">'
 '<p><span class="pz">Abū Bakr</span> «padre di Bakr»</p>'
 '<p><span class="pz">Muḥammad</span> il nome proprio</p>'
 '<p><span class="pz">ibn ʿAbd al-Malik</span> «figlio di ʿAbd al-Malik»</p>'
 '<p><span class="pz">ibn Ṭufayl</span> il nome di un antenato</p>'
 '<p><span class="pz">al-Qaysī</span> «della tribù dei Qays»</p></div>',
 D.icona_grande("parola", "In Europa il nome fu accorciato in «Abubacer»"),
 [("ibn", "in arabo significa «figlio di»"), ("Antenato", "un parente vissuto molte generazioni prima"),
  ("Tribù", "un grande gruppo di famiglie che si considerano discendenti dagli stessi antenati")],
 "Fonte: Encyclopaedia Britannica, «Ibn Ṭufayl».")

D.pagina("mestieri", "I · L'autore · Il lavoro", "Attività e incarichi",
 P(["Nel XII secolo uno studioso poteva occuparsi <b>insieme</b><br>di medicina, stelle, poesia e filosofia.",
    "Ibn Ṭufayl fu prima <b>segretario</b> dei governatori<br>di Granada, Ceuta e Tangeri.",
    "Poi divenne <b>medico</b> e <b>consigliere</b> del califfo."]),
 D.icone([("cuore", "Medico", "cura i malati"), ("stella", "Astronomo", "studia il cielo"),
          ("libro", "Segretario", "scrive le lettere ufficiali"), ("parola", "Poeta", "scrive versi")]),
 [("Governatore", "chi governa una città o una regione per conto del sovrano"),
  ("Astronomo", "chi studia le stelle e i pianeti")],
 "Fonti: M. Forcada, Biographical Encyclopedia of Astronomers; Encyclopaedia Britannica.", alt=True)

D.pagina("corte", "I · L'autore · La corte", "Alla corte del califfo almohade",
 P(["Gli <b>Almohadi</b> erano una dinastia nata in Marocco.<br>Dal 1147 governarono da <b>Marrakech</b>.",
    "Il califfo <b>Abū Yaʿqūb Yūsuf</b> (regno 1163–1184)<br>amava i libri e chiamava a corte medici e filosofi.",
    "Ibn Ṭufayl fu il suo <b>medico</b> e uno dei suoi <b>consiglieri</b>."]),
 D.img("mappa-andalus", "Marrakech, capitale degli Almohadi", maxh=640),
 [("Dinastia", "una serie di sovrani della stessa famiglia"),
  ("Almohadi", "dinastia berbera che governò Marocco e al-Andalus nel XII e XIII secolo")],
 "Fonti: Encyclopaedia Britannica; S. Günther, Institute for Advanced Study (2018).")

D.pagina("averroe", "I · L'autore · Un incontro", "Il rapporto con Averroè",
 P(["Verso il <b>1169</b> presentò al califfo un giovane studioso:<br><b>Averroè</b> (Ibn Rushd).",
    "Il califfo voleva capire meglio <b>Aristotele</b>.<br>Averroè ne scrisse i <b>commenti</b>, poi letti in tutta Europa.",
    "Nel <b>1182</b> Ibn Ṭufayl si ritirò<br>e Averroè prese il suo posto di medico del califfo."]),
 D.icone([("libro", "Aristotele", "IV secolo a.C., Grecia"), ("parola", "Averroè", "1126–1198, Cordova"),
          ("cervello", "Ibn Ṭufayl", "il maestro che lo presenta")], 1),
 [("Aristotele", "filosofo greco; i suoi libri spiegano natura, animali, logica"),
  ("Commento", "un libro che spiega un altro libro, frase per frase")],
 "Fonti: Encyclopaedia Britannica, voci «Ibn Ṭufayl» e «Averroës».", alt=True)

D.larga("filosofi", "I · L'autore · I predecessori", "I predecessori discussi nell'opera",
 D.img("mappa-filosofi", maxh=330, maxw=1696),
 P(["Nell'introduzione del libro discute <b>quattro filosofi</b> venuti prima di lui:",
    "<b>al-Fārābī</b> (c. 870–950) · <b>Avicenna</b> (980–1037)<br><b>al-Ghazālī</b> (1058–1111) · <b>Ibn Bājja</b> (c. 1085–1138)"]),
 [("Predecessore", "chi ha fatto lo stesso lavoro prima di te"),
  ("Introduzione", "la parte iniziale di un libro, che spiega perché è stato scritto")],
 "Fonti: Encyclopedia.com, «Ibn Ṭufayl»; Kukkonen (2014).")

# ======================================================================
capitolo("cap2", "II", "L'opera", "Un racconto filosofico sulla conoscenza<br>raggiunta senza maestri", D.img("scena-gazzella", maxh=460, maxw=860))

D.pagina("titolo", "II · L'opera · Il titolo", "Il titolo",
 '<div class="nome-arabo">'
 '<p><span class="pz">Risāla</span> lettera, epistola</p>'
 '<p><span class="pz">Ḥayy</span> «vivo»</p>'
 '<p><span class="pz">ibn Yaqẓān</span> «figlio di Desto»</p>'
 '<p><span class="pz">asrār al-ḥikma</span> «i segreti della sapienza»</p>'
 '<p><span class="pz">al-mashriqiyya</span> «orientale»</p></div>'
 + P(["Il nome del protagonista significa quindi<br><b>«il Vivo, figlio del Desto»</b>."]),
 D.icona_grande("occhio", "Desto = sveglio, attento"),
 [("Epistola", "una lettera, spesso lunga, scritta per spiegare un'idea"),
  ("Sapienza", "un sapere profondo, che guida la vita")],
 "Fonti: Encyclopaedia Britannica; Encyclopedia.com.")

D.pagina("forma", "II · L'opera · La forma", "Forma e struttura",
 P(["Il libro comincia come una <b>lettera a un amico</b><br>che aveva chiesto spiegazioni.",
    "Poi l'autore racconta una <b>storia inventata</b>:<br>la vita di Ḥayy su un'isola.",
    "La storia serve a <b>mostrare un'idea</b>:<br>che cosa può scoprire la mente umana da sola."]),
 D.icone([("parola", "1 · La lettera", "a chi è rivolta, perché"), ("libro", "2 · I filosofi", "che cosa hanno detto prima"),
          ("gazzella", "3 · Il racconto", "la vita di Ḥayy"), ("barca", "4 · Il finale", "Absal e l'isola abitata")]),
 [("Racconto filosofico", "una storia inventata per far riflettere su una domanda importante")], alt=True)

D.pagina("data", "II · L'opera · Quando", "Datazione",
 P(["Non conosciamo la data esatta.<br>Gli studiosi propongono date diverse:",
    "<b>verso il 1160</b>,<br><b>tra il 1169 e il 1182</b>,<br><b>verso il 1175</b>.",
    "È l'<b>unica opera filosofica</b> di Ibn Ṭufayl arrivata fino a noi."]),
 tempo([("1160", "prima ipotesi", "", False), ("1169", "inizio periodo a corte", "", False),
        ("1175", "ipotesi intermedia", "", False), ("1182", "ritiro", "", False)]),
 [("Datazione", "stabilire quando è stato scritto un testo"),
  ("Ipotesi", "una spiegazione possibile, non ancora sicura")],
 "Fonti: Encyclopaedia Britannica; S. Günther (2018); Wikipedia, «Hayy ibn Yaqdhan».")

D.pagina("nomi", "II · L'opera · Le fonti", "Il rapporto con Avicenna",
 P(["<b>Avicenna</b>, un secolo prima, aveva scritto due racconti simbolici:<br><i>Ḥayy ibn Yaqẓān</i> e <i>Salāmān e Absāl</i>.",
    "Ibn Ṭufayl riprende quei <b>nomi</b>,<br>ma inventa una <b>storia nuova</b> con un'isola e una vita intera.",
    "In alcuni manoscritti il nome è scritto <b>«Asāl»</b>.<br>Qui usiamo la forma più diffusa: <b>Absal</b>."]),
 D.icona_grande("libro", "Avicenna (Ibn Sīnā), 980–1037"),
 [("Simbolico", "che rappresenta un'idea attraverso personaggi e immagini"),
  ("Manoscritto", "un libro copiato a mano, prima della stampa")],
 "Fonti: Encyclopedia.com (H. Corbin); New World Encyclopedia, «Ibn Tufail».", alt=True)

D.pagina("isola", "II · L'opera · Dove", "L'ambientazione",
 P(["La storia si svolge su un'<b>isola disabitata</b><br>dell'<b>Oceano Indiano</b>, vicino all'<b>equatore</b>.",
    "L'autore dice che lì il clima è <b>sempre mite</b>.",
    "È un luogo <b>immaginario</b>: non corrisponde a un'isola reale."]),
 D.img("mappa-isola", "La zona in cui l'autore colloca l'isola", maxh=640),
 [("Equatore", "la linea immaginaria che divide la Terra in due metà, nord e sud"),
  ("Disabitata", "dove non vive nessun essere umano")],
 "Fonte: L. E. Goodman, Ibn Tufayl's Hayy ibn Yaqzān (2009).")

# ---- trama ------------------------------------------------------------
TR = "II · L'opera · La trama"
D.pagina("t1", TR + " · 1/8", "Le due versioni della nascita",
 P(["L'autore offre <b>due versioni</b> e lascia scegliere al lettore.",
    "<b>A.</b> Ḥayy nasce <b>dalla terra</b>, senza genitori.",
    "<b>B.</b> Una principessa, sposata in segreto con <b>Yaqẓān</b>,<br>affida il neonato al mare in una <b>cassa</b>.<br>Le onde lo portano sull'isola."]),
 D.img("scena-isola-alba", ILL, maxh=440),
 [("Versione", "un modo diverso di raccontare lo stesso fatto")])

D.pagina("t2", TR + " · 2/8", "La gazzella",
 P(["Una <b>gazzella</b> che ha perso il suo piccolo<br>sente il pianto del bambino.",
    "Lo <b>allatta</b>, lo protegge e lo cresce<br>come se fosse suo figlio.",
    "Ḥayy impara a camminare e a correre<br><b>insieme agli animali</b>."]),
 D.img("scena-gazzella", ILL, maxh=440),
 [("Gazzella", "un'antilope piccola e veloce, che vive in Africa e in Asia"),
  ("Allattare", "nutrire un piccolo con il proprio latte")], alt=True)

D.pagina("t3", TR + " · 3/8", "L'imitazione degli animali",
 P(["Ḥayy <b>imita i versi</b> degli animali per farsi capire.",
    "Si accorge di essere <b>diverso</b>: non ha pelo, piume, corna.",
    "Si copre con <b>foglie</b>, poi con la <b>pelle</b> e le <b>piume</b> di un'aquila.<br>Usa i <b>bastoni</b> per difendersi."]),
 D.img("scena-animali", ILL, maxh=440),
 [("Imitare", "fare la stessa cosa che fa un altro, copiandolo")])

D.pagina("t4", TR + " · 4/8", "La morte della gazzella",
 P(["La gazzella invecchia e <b>muore</b>.",
    "Ḥayy vuole capire <b>che cosa si è fermato</b> dentro di lei.",
    "Cerca nel corpo e trova il <b>cuore</b>:<br>pensa che lì abitasse ciò che la faceva vivere."]),
 D.img("scena-tramonto-gazzella", ILL, maxh=440),
 [("Cuore", "il muscolo che spinge il sangue in tutto il corpo"),
  ("Dissezione", "aprire un corpo per studiarne l'interno; nel libro è descritta")], alt=True)

D.pagina("t5", TR + " · 5/8", "La scoperta del fuoco",
 P(["Un giorno vede un <b>fuoco</b> nato tra le <b>canne</b>.",
    "Si avvicina, prende un <b>tizzone</b> e lo porta nel suo rifugio.",
    "Nota che il fuoco è <b>caldo</b><br>come i corpi degli animali vivi."]),
 D.img("scena-fuoco", ILL, maxh=440),
 [("Canna", "pianta alta con fusto vuoto, che cresce vicino all'acqua"),
  ("Tizzone", "un pezzo di legno che brucia ancora")])

D.pagina("t6", TR + " · 6/8", "I cicli di sette anni",
 P(["La vita di Ḥayy è divisa in <b>periodi di sette anni</b>.",
    "In ogni periodo studia qualcosa di nuovo:<br><b>animali, piante, sassi, cielo</b>.",
    "Con il ragionamento arriva all'idea<br>di <b>un'unica causa</b> di tutto il mondo."]),
 D.img("scena-palme-grotta", ILL, maxh=440),
 [("Periodo", "un tratto di tempo"), ("Causa", "ciò che fa succedere qualcosa")], alt=True)

D.pagina("t7", TR + " · 7/8", "L'incontro con Absal",
 P(["Quando Ḥayy ha circa <b>cinquant'anni</b><br>arriva <b>Absal</b>, da un'isola abitata.",
    "Absal cerca un luogo <b>tranquillo</b> per pensare e pregare.",
    "Absal <b>insegna a Ḥayy a parlare</b>.<br>Scoprono di essere arrivati a idee simili<br>per strade diverse."]),
 D.img("scena-barca-absal", ILL, maxh=440),
 [("Solitudine", "lo stare da soli, per scelta o per caso")],
 "Sull'età di Ḥayy: T. Kukkonen, A Sourcebook in Global Philosophy, cap. 54.")

D.pagina("t8", TR + " · 8/8", "L'isola abitata e il ritorno",
 P(["Ḥayy e Absal vanno sull'<b>isola abitata</b>,<br>governata dal re <b>Salāmān</b>.",
    "Ḥayy prova a <b>spiegare</b> ciò che ha scoperto,<br>ma quasi nessuno lo ascolta.",
    "I due <b>tornano</b> sull'isola deserta e vi restano."]),
 D.icone([("barca", "Il viaggio", "dall'isola deserta a quella abitata"),
          ("parola", "Il tentativo", "spiegare agli abitanti"),
          ("ripeti", "Il ritorno", "di nuovo sull'isola deserta")], 1),
 [("Abitata", "dove vivono delle persone")], alt=True)

# ---- inventario -------------------------------------------------------
EL = "II · L'opera · Elementi della storia"
def tab(intest, righe):
    th = "".join(f"<th>{x}</th>" for x in intest)
    tr = "".join("<tr>" + f'<td class="i">{D.ico(r[0], 64)}</td>' + "".join(f"<td>{c}</td>" for c in r[1:]) + "</tr>" for r in righe)
    return f'<table class="tabella"><tr><th></th>{th}</tr>{tr}</table>'

D.libera("e-pers", EL + " · 1/6", "I personaggi",
 tab(["Personaggio", "Chi è", "Che cosa fa"], [
  ("bimbo", "<b>Ḥayy</b>", "il protagonista", "cresce da solo, osserva, ragiona"),
  ("gazzella", "<b>La gazzella</b>", "la madre adottiva", "lo allatta e lo protegge"),
  ("barca", "<b>Absal</b>", "un uomo dell'isola abitata", "cerca solitudine; insegna a parlare"),
  ("scudo", "<b>Salāmān</b>", "re dell'isola abitata, amico di Absal", "governa la comunità"),
  ("mano", "<b>La principessa</b> e <b>Yaqẓān</b>", "i genitori nella versione B", "affidano il figlio al mare"),
  ("ingranaggi", "<b>Gli abitanti</b>", "la gente dell'isola abitata", "seguono le regole, non cercano oltre")]))

D.libera("e-luoghi", EL + " · 2/6", "I luoghi",
 tab(["Luogo", "Com'è", "Che cosa succede"], [
  ("sole", "<b>L'isola deserta</b>", "sotto l'equatore, clima mite", "tutta la vita di Ḥayy"),
  ("cocco", "<b>Il bosco</b>", "alberi, frutti, animali", "Ḥayy cresce e cerca cibo"),
  ("sasso", "<b>Il rifugio</b>", "una tana tra le rocce", "porta il fuoco, si ripara"),
  ("fuoco", "<b>Il canneto</b>", "canne vicino all'acqua", "nasce il fuoco"),
  ("barca", "<b>Il mare</b>", "separa le due isole", "arriva la cassa; arriva Absal"),
  ("scuola", "<b>L'isola abitata</b>", "città, leggi, religione", "Ḥayy prova a insegnare")]), alt=True)

D.libera("e-natura", EL + " · 3/6", "Animali e piante",
 tab(["Elemento", "Nella storia"], [
  ("gazzella", "<b>Gazzella</b>", "nutre e cresce Ḥayy"),
  ("capra", "<b>Animali dell'isola</b>", "Ḥayy li osserva, li imita, ne studia il corpo"),
  ("stella", "<b>Aquila</b>", "pelle e piume diventano un vestito"),
  ("foglia", "<b>Foglie</b>", "la prima copertura del corpo"),
  ("cocco", "<b>Frutti</b>", "il cibo; Ḥayy impara a non sprecarli"),
  ("fuoco", "<b>Canne</b>", "tra le canne nasce il fuoco")]))

D.libera("e-oggetti", EL + " · 4/6", "Oggetti e tecniche",
 tab(["Oggetto", "A che cosa serve", "Che cosa insegna"], [
  ("foglia", "<b>Foglie e piume</b>", "coprirsi", "il corpo umano ha bisogno di protezione"),
  ("bastone", "<b>Bastoni</b>", "difendersi, raggiungere", "la mano umana usa gli attrezzi"),
  ("sasso", "<b>Pietre affilate</b>", "tagliare", "un attrezzo si può costruire"),
  ("fuoco", "<b>Tizzone</b>", "portare il fuoco", "il fuoco si conserva e si nutre"),
  ("mano", "<b>Vesti cucite</b>", "vestirsi meglio", "si può migliorare ciò che si ha"),
  ("corsa", "<b>Cavalcare</b>", "andare più veloce", "si collabora con gli animali")]), alt=True)

D.libera("e-idee", EL + " · 5/6", "Scoperte e idee",
 tab(["Scoperta", "Come ci arriva"], [
  ("occhio", "<b>Ḥayy è diverso dagli animali</b>", "si confronta con loro"),
  ("cuore", "<b>Il cuore è il centro della vita</b>", "cerca che cosa si è fermato nella gazzella"),
  ("termometro", "<b>Il calore accompagna la vita</b>", "tocca il fuoco e i corpi vivi"),
  ("puzzle", "<b>Tutti i viventi hanno parti simili</b>", "confronta animali e piante"),
  ("stella", "<b>Il cielo si muove con regolarità</b>", "osserva sole, luna, stelle"),
  ("bilancia", "<b>Prendere solo ciò che serve</b>", "rispetta piante e animali")]))

D.libera("e-tempi", EL + " · 6/6", "Le età di Ḥayy",
 tempo([("0", "arriva sull'isola; la gazzella lo allatta", "bimbo", False),
        ("infanzia", "imita gli animali, si copre, usa i bastoni", "bastone", False),
        ("fanciullezza", "muore la gazzella; scopre il cuore", "cuore", False),
        ("giovinezza", "il fuoco; studia animali e piante", "fuoco", False),
        ("età adulta", "studia il cielo e l'origine del mondo", "stella", False),
        ("~50 anni", "arriva Absal; impara a parlare", "barca", False)])
 + '<div class="basso"><div class="testo">' + P(["Il racconto procede per <b>periodi di sette anni</b>.<br>Le fonti non sempre concordano sull'età precisa di ogni episodio: qui si indicano le fasi."]) + '</div>'
 + D.parole([("Fase", "un tratto della vita con caratteristiche proprie")]) + '</div>', alt=True)

D.pagina("temi1", "II · L'opera · Temi", "Primo tema: la conoscenza per osservazione",
 P(["Ḥayy non ha libri né maestri.<br>Impara <b>guardando</b>, <b>provando</b>, <b>sbagliando</b>.",
    "Molti lettori hanno visto nel racconto un <b>esperimento mentale</b>:<br>che cosa sa una mente senza scuola?",
    "Il racconto mostra anche il <b>costo</b>:<br>ci vogliono decenni, e alcune conclusioni sono sbagliate."]),
 D.icona_grande("occhio"),
 [("Esperimento mentale", "un esperimento fatto solo con l'immaginazione: «che cosa succederebbe se…»")],
 "Fonti: Kukkonen (2014); Qantara.de, recensione dell'edizione Meiner.")

D.pagina("temi2", "II · L'opera · Temi", "Secondo tema: ragione e religione",
 P(["Absal conosce la verità attraverso la <b>religione</b>,<br>Ḥayy attraverso la <b>ragione</b>.",
    "L'autore sostiene che le due strade<br><b>arrivano allo stesso punto</b>.",
    "Il tema è qui presentato<br>come <b>contesto storico</b>, senza valutazioni."]),
 D.icona_grande("bilancia"),
 [("Ragione", "la capacità di pensare, collegare, dedurre"),
  ("Contesto", "la situazione in cui un fatto avviene e che aiuta a capirlo")], alt=True)

D.pagina("temi3", "II · L'opera · Temi", "Terzo tema: individuo e comunità",
 P(["Sull'isola abitata quasi nessuno vuole ascoltare Ḥayy.",
    "Il finale mostra che <b>trasmettere il sapere è difficile</b>:<br>non tutti cercano la conoscenza nello stesso modo.",
    "Per l'autore solo <b>pochi</b> arrivano alla conoscenza più alta:<br>un'idea che oggi è <b>discussa</b> (vedi parte IV)."]),
 D.icona_grande("scuola"),
 [("Comunità", "un gruppo di persone che vivono insieme e condividono regole"),
  ("Trasmettere", "passare qualcosa da una persona a un'altra")])

# ======================================================================
capitolo("cap3", "III", "Il viaggio del libro", "Manoscritti, edizioni e traduzioni<br>dal XIV al XX secolo", D.img("mappa-traduzioni", maxh=380, maxw=860))

D.pagina("manoscritto", "III · Il viaggio del libro", "La trasmissione manoscritta",
 P(["Il libro viene <b>copiato a mano</b> per secoli in arabo<br>e tradotto anche in <b>ebraico</b>.",
    "Nel Seicento l'orientalista inglese <b>Edward Pococke</b><br>porta in Inghilterra manoscritti comprati in Oriente.",
    "Tra questi c'è una copia del <b>1303</b> della storia di Ḥayy."]),
 D.img("mappa-manoscritto", "Il percorso del manoscritto verso l'Inghilterra", maxh=640),
 [("Orientalista", "studioso delle lingue e delle culture del Medio Oriente e dell'Asia"),
  ("Copia", "un manoscritto riscritto a mano da un altro manoscritto")],
 "Fonti: Wikipedia, «Hayy ibn Yaqdhan»; Gallien e Ferlier (2019).")

D.pagina("pococke", "III · Il viaggio del libro", "L'edizione latina del 1671",
 P(["Il figlio, <b>Edward Pococke il giovane</b>, pubblica a <b>Oxford</b><br>il testo arabo con la traduzione latina accanto.",
    "Il titolo latino è <b><i>Philosophus autodidactus</i></b>,<br>«il filosofo che ha imparato da solo».",
    "Seconda edizione: <b>1700</b>."]),
 D.icona_grande("libro", "Arabo a sinistra, latino a destra"),
 [("Latino", "la lingua comune degli studiosi europei fino al Settecento"),
  ("Autodidatta", "chi impara da solo, senza maestri"),
  ("Traduzione a fronte", "originale e traduzione su pagine affiancate")],
 "Fonte: Wikipedia, «Hayy ibn Yaqdhan».", alt=True)

D.larga("traduzioni", "III · Il viaggio del libro", "Le traduzioni europee, 1671-1708",
 D.img("mappa-traduzioni", maxh=340, maxw=1696),
 P(["<b>1671</b> latino (Oxford) · <b>1672</b> olandese (J. Bouwmeester)",
    "<b>1674</b> inglese (G. Keith) · <b>1686</b> inglese (G. Ashwell)<br><b>1708</b> inglese, dall'arabo (S. Ockley, Cambridge)"]),
 [("Traduzione", "un testo riscritto in un'altra lingua"),
  ("Edizione", "una pubblicazione di un libro, con un curatore e un anno")],
 "Fonti: Wikipedia; Gallien e Ferlier, Eastern Resonances in Early Modern England (Springer, 2019).")

D.pagina("quaccheri", "III · I lettori", "La ricezione presso i quaccheri",
 P(["<b>George Keith</b> traduce il libro in inglese nel <b>1674</b>.",
    "Era un <b>quacchero</b>: per i quaccheri ogni persona<br>ha dentro di sé una <b>«luce interiore»</b>.",
    "In Ḥayy, che scopre la verità senza maestri,<br>vedono un <b>esempio</b> di questa idea."]),
 D.icona_grande("sole", "La «luce interiore»"),
 [("Quaccheri", "un gruppo cristiano nato in Inghilterra nel Seicento, senza preti né riti"),
  ("Interiore", "che sta dentro la persona")],
 "Fonte: Gallien e Ferlier (2019).")

D.pagina("robinson", "III · I lettori", "Il confronto con Robinson Crusoe",
 P(["Nel <b>1719</b> Daniel Defoe pubblica <b><i>Robinson Crusoe</i></b>:<br>un naufrago sopravvive da solo su un'isola.",
    "Esce <b>undici anni</b> dopo la traduzione di Ockley.",
    "Che Defoe si sia <b>ispirato</b> a Ḥayy è un'<b>ipotesi discussa</b>:<br>non ci sono prove sicure."]),
 D.img("scena-barca-absal", ILL, maxh=420),
 [("Naufrago", "chi si salva da una nave affondata"),
  ("Ispirarsi", "prendere un'idea da un'altra opera")],
 "Fonti: eScholarship, tesi su Ḥayy e Robinson Crusoe; Akyol (2021).")

D.pagina("edizioni", "III · Oggi", "Le edizioni moderne",
 P(["<b>Inglese</b> · L. E. Goodman, 1972; nuova ed. Chicago 2009",
    "<b>Francese</b> · L. Gauthier, Vrin",
    "<b>Spagnolo</b> · Á. González Palencia, rist. Trotta 1995",
    "<b>Tedesco</b> · <i>Der Philosoph als Autodidakt</i>, Meiner",
    "<b>Italiano</b> · noto come <i>Il filosofo autodidatta</i><br><span class=\"dav\">[edizione di riferimento da verificare in biblioteca]</span>"]),
 D.icona_grande("mappa", "Il libro oggi si legge in molte lingue"),
 [("Curatore", "chi prepara un'edizione: traduce, spiega, aggiunge note")],
 "Fonti: cataloghi PhilPapers, ISMI, Marcial Pons; Qantara.de.",
 "L'edizione italiana va completata con il catalogo SBN prima dell'uso.", alt=True)

# ======================================================================
capitolo("cap4", "IV", "Diritti umani", "Gli articoli collegati alla storia,<br>con i criteri e i limiti del collegamento", D.icona_grande("scuola"))

D.libera("documenti", "IV · Diritti umani", "Due documenti di riferimento",
 tempo([("1948", "<b>Costituzione italiana</b><br>(in vigore dal 1° gennaio)", "scudo", False),
        ("1948", "<b>Dichiarazione universale dei diritti umani</b><br>(ONU, 10 dicembre)", "mappa", False),
        ])
 + '<div class="basso"><div class="testo">' + P(["Abbreviazione: <b>DUDU</b>, Dichiarazione universale dei diritti umani."]) + '</div>'
 + D.parole([("Dichiarazione", "un testo che afferma principi comuni"),
             ("Costituzione", "la legge fondamentale dello Stato")]) + '</div>')

D.pagina("criteri", "IV · Diritti umani", "Criteri di collegamento",
 P(["Nel XII secolo l'idea di <b>diritti umani</b> non esisteva.",
    "Il collegamento è <b>tematico</b>: la storia mostra un bisogno umano<br>che i testi di oggi proteggono.",
    "Ogni collegamento ha un'etichetta:"])
 + '<div class="legenda"><span class="tag">Diretto</span><span class="tag indiretto">Indiretto</span><span class="tag contesto">Contesto</span></div>',
 D.icone([("puzzle", "Diretto", "l'episodio illustra proprio quell'articolo"),
          ("ingranaggi", "Indiretto", "c'è un legame, ma passa per un'altra idea"),
          ("mappa", "Contesto", "aiuta a capire, senza legame forte")], 1),
 [("Anacronismo", "attribuire a un'epoca idee che sono nate dopo"),
  ("Tematico", "che riguarda lo stesso tema")], alt=True)

def articolo(id, occh, tit, norma, rif, tag, collegamento, icona, parole, fonte, alt=False):
    D.pagina(id, occh, tit,
     f'<div class="citazione"><p class="norma">{norma}</p><p class="rif">{rif}</p></div>'
     + f'<p class="punto"><span class="tag {tag}">{ {"":"Diretto","indiretto":"Indiretto","contesto":"Contesto"}[tag] }</span></p>'
     + P(collegamento), D.icona_grande(icona), parole, fonte, alt=alt)

articolo("dudu1", "IV · DUDU 1948", "Articolo 1: ragione e coscienza",
 "«Tutti gli esseri umani nascono liberi ed eguali in dignità e diritti. Essi sono dotati di ragione e di coscienza e devono agire gli uni verso gli altri in spirito di fratellanza.»",
 "Dichiarazione universale dei diritti umani, art. 1", "",
 ["Ḥayy, <b>privo di famiglia e di istruzione</b>, conosce il mondo con la <b>propria ragione</b>.<br>La capacità di ragionare è attribuita a <b>ogni</b> essere umano."],
 "cervello", [("Dignità", "il valore che ogni persona ha, per il solo fatto di esistere"), ("Coscienza", "la capacità di capire che cosa è giusto")],
 "Testo: versione italiana ufficiale (UNRIC / Senato della Repubblica).")

articolo("dudu26", "IV · DUDU 1948", "Articolo 26: istruzione",
 "«Ogni individuo ha diritto all'istruzione. L'istruzione deve essere gratuita almeno per quanto riguarda le classi elementari e fondamentali. L'istruzione elementare deve essere obbligatoria.»",
 "DUDU, art. 26, par. 1 · il par. 2 indica come fine il pieno sviluppo della personalità", "",
 ["Ḥayy impiega <b>decenni</b> per scoprire da solo ciò che la scuola insegna in poco tempo.<br>L'incontro con Absal mostra il <b>valore di chi insegna</b>."],
 "scuola", [("Istruzione", "l'insegnamento organizzato, a scuola"), ("Obbligatoria", "che tutti devono fare per legge")],
 "Testo: versione italiana ufficiale della Dichiarazione.", alt=True)

articolo("dudu19", "IV · DUDU 1948", "Articolo 19: opinione ed espressione",
 "Ogni individuo ha diritto alla libertà di opinione e di espressione, compreso il diritto di cercare, ricevere e diffondere informazioni e idee con ogni mezzo.",
 "DUDU, art. 19 (sintesi)", "contesto",
 ["Ḥayy prova a <b>condividere</b> sull'isola abitata<br>ciò che ha scoperto da solo."],
 "parola", [("Opinione", "quello che una persona pensa su un argomento"), ("Diffondere", "far conoscere a molti")],
 "Testo integrale: versione italiana ufficiale della Dichiarazione.")

articolo("dudu27", "IV · DUDU 1948", "Articolo 27: cultura e scienza",
 "Ogni individuo ha diritto di prendere parte alla vita culturale della comunità e di partecipare al progresso scientifico e ai suoi benefici.",
 "DUDU, art. 27, par. 1 (sintesi)", "contesto",
 ["Ḥayy arriva da solo a vere <b>scoperte</b> sulla natura.<br>Sull'isola abitata prova a <b>condividerle</b>:<br>il sapere e i suoi benefici diventano di tutti."],
 "stella", [("Progresso scientifico", "le nuove conoscenze che la scienza raggiunge nel tempo"), ("Beneficio", "un vantaggio")],
 "Testo integrale: versione italiana ufficiale della Dichiarazione.", alt=True)

D.pagina("cost3", "IV · Costituzione italiana", "Articoli 3 e 33",
 P(["<b>Art. 3, comma 2</b><br>La Repubblica deve <b>rimuovere gli ostacoli</b><br>che impediscono l'uguaglianza tra le persone.",
    "<b>Art. 33</b><br>L'arte e la scienza sono libere e <b>libero ne è l'insegnamento</b>.<br>La Repubblica istituisce scuole statali."]),
 D.icone([("bilancia", "Uguaglianza", "le stesse possibilità per tutti"),
          ("libro", "Libertà di insegnamento", "chi insegna sceglie come farlo")], 1),
 [("Comma", "una parte di un articolo di legge"), ("Statale", "organizzato dallo Stato")],
 "Testo: Costituzione della Repubblica italiana (senato.it).")

D.pagina("limiti", "IV · Diritti umani", "Limiti e cautele",
 P(["<b>Pochi o tutti?</b><br>Nel libro solo pochi raggiungono la conoscenza più alta.<br>I diritti umani dicono invece: <b>istruzione per tutti</b>.",
    "<b>Il corpo della gazzella</b><br>Il libro descrive una dissezione: va presentata con <b>cautela</b>.",
    "<b>La religione</b><br>Il finale religioso è <b>contesto storico</b>, senza giudizi."]),
 D.icone([("bilancia", "Pochi o tutti", ""), ("cuore", "Il corpo", ""), ("libro", "La religione", "")], 1),
 [("Cautela", "attenzione, prudenza")], alt=True)

D.libera("sintesi", "IV · Sintesi", "Quadro riassuntivo",
 tab(["Episodio o idea della storia", "Riferimento", "Tipo"], [
  ("cervello", "Ḥayy conosce il mondo con la ragione", "DUDU art. 1", '<span class="tag">Diretto</span>'),
  ("scuola", "Imparare da soli costa una vita; Absal insegna", "DUDU art. 26", '<span class="tag">Diretto</span>'),
  ("parola", "Condividere ciò che si scopre", "DUDU artt. 19, 27", '<span class="tag contesto">Contesto</span>'),
  ("bilancia", "Uguaglianza delle possibilità", "Cost. art. 3, c. 2", '<span class="tag contesto">Contesto</span>')]))

# ======================================================================
D.libera("fonti", "V · Fonti", "Fonti consultate",
 '<div class="basso"><div class="testo">' + P([
  "Encyclopaedia Britannica, «Ibn Ṭufayl».",
  "Encyclopedia.com, «Hayy ibn Yaqzan» e «Ibn Ṭufayl».",
  "M. Forcada, «Ibn Ṭufayl», <i>Biographical Encyclopedia of Astronomers</i>.",
  "S. Günther, <i>Ibn Ṭufayl on Learning and Spirituality</i>, IAS, 2018.",
  "T. Kukkonen, <i>Ibn Tufayl: Living the Life of Reason</i>, Oneworld, 2014.",
  "L. E. Goodman (trad.), <i>Ibn Tufayl's Hayy ibn Yaqzān</i>, Univ. of Chicago Press, 2009."]) + '</div><div class="testo">' + P([
  "C. Gallien, L. Ferlier, in <i>Eastern Resonances in Early Modern England</i>, Springer, 2019.",
  "Dichiarazione universale dei diritti umani, testo italiano (UNRIC, Senato).",
  "Costituzione della Repubblica italiana, artt. 3 e 33 (senato.it).",
  "Mappe disegnate per questo documento; illustrazioni dal gioco Respira."]) + '</div></div>',
 nota="Prima dell'uso in classe, completare l'edizione italiana dell'opera con il catalogo SBN.", alt=True)

CSS = '''section {
  --carta: #F6F3EC; --carta2: #ECE6D9; --inchiostro: #1E2633; --testo: #3C4554; --muto: #5F6672;
  --accento: #8A3324; --linea: #CFC6B3; --fondo-parole: #FBF3E6; --fondo-cella: #FBF9F4;
  --serif: 'EB Garamond', Georgia, serif;
  background: var(--carta); color: var(--inchiostro);
  font-family: 'Public Sans', Arial, sans-serif; font-size: 28px; line-height: 1.4;
}
.alt { background: var(--carta2); --fondo-cella: var(--carta); }
.scuro { background: var(--inchiostro); color: #F2EEE4; }
.occhiello { font-size: 22px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: var(--accento); margin: 0; }
.scuro .occhiello { color: #E3A48F; }
h1 { font-family: var(--serif); font-weight: 600; font-size: 112px; line-height: 1; margin: 0; color: #F2EEE4; }
h2 { font-family: var(--serif); font-weight: 600; font-size: 60px; line-height: 1.08; margin: 0 0 8px; color: var(--inchiostro); }
.scuro h2 { color: #F2EEE4; font-size: 84px; }
p { margin: 0; color: var(--testo); }
.copertina, .capitolo { display: flex; align-items: center; gap: 72px; padding: 112px; }
.cop-testo, .cap-testo { flex: 1; display: flex; flex-direction: column; gap: 26px; }
.cop-vis, .cap-vis { width: 860px; flex: none; display: flex; justify-content: center; }
.copertina .autore { font-family: var(--serif); font-size: 52px; color: #E3A48F; }
.copertina .sotto, .capitolo .sotto { font-size: 34px; color: #CFC8BA; line-height: 1.35; }
.copertina .data { font-size: 24px; color: #A9A291; }
.filetto { width: 160px; height: 6px; background: #E3A48F; }
.capitolo .numero { font-family: var(--serif); font-size: 170px; line-height: 1; color: #E3A48F; }
.scuro .fig img { border-color: #3A4556; }
.scuro .tondo { background: #2A3444; border-color: #3A4556; }
.nome-arabo { display: flex; flex-direction: column; gap: 12px; }
.nome-arabo p { font-size: 28px; color: var(--testo); display: flex; gap: 20px; align-items: baseline; }
.nome-arabo .pz { font-family: var(--serif); font-size: 40px; font-weight: 600; color: var(--accento); min-width: 330px; }
.dav { color: var(--accento); font-size: 24px; }
''' + CSS_BASE

CSS = CSS + CSS_SOBRIO
D.scrivi("Hayy ibn Yaqzan: riferimenti letterari e diritti umani", "copertina",
 {"s0": {"description": "Copertina e indice", "start": "copertina"},
  "s1": {"description": "L'autore: chi, dove, quando, nome, lavoro, corte, predecessori", "start": "cap1"},
  "s2": {"description": "L'opera: titolo, forma, data, fonti, luogo, trama in 8 tappe, elementi della storia, temi", "start": "cap2"},
  "s3": {"description": "Il viaggio del libro: manoscritto, traduzioni, lettori, edizioni", "start": "cap3"},
  "s4": {"description": "Diritti umani: documenti, criteri, articoli, limiti, sintesi", "start": "cap4"},
  "s5": {"description": "Fonti", "start": "fonti"}},
 {"eb-garamond": {"family": "EB Garamond", "href": "https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400..700&family=Public+Sans:wght@400;600;700&display=swap"},
  "public-sans": {"family": "Public Sans", "href": "https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;600;700&display=swap"}},
 CSS)
