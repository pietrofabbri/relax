import sys, json, re
sys.path.insert(0, "/home/claude/decks")
from comune import Deck, CSS_BASE, CSS_SOBRIO

B = {"mappa-mondo": "/_blob/ccbb6a42b3a6e28fbc1cf0595f5811da"}
D = Deck("/home/claude/decks/roadmap/project", B)
P = D.punti
R = json.load(open("/home/claude/decks/roadmap.json"))

def pulito(t):
    t = t.replace("**", "")
    t = re.sub(r"\[(ponte|ipotesi)\]\s*", "", t)
    return re.sub(r'"([^"]+)"', r"«\1»", t)

def marca(t):
    m = ""
    if "[ponte]" in t: m += ' <span class="tag indiretto">ponte</span>'
    if "[ipotesi]" in t: m += ' <span class="tag contesto">ipotesi discussa</span>'
    return m

FILONI = [
 ("B", "Basi comuni", "ingranaggi", "Come è organizzato il corpo, come comunica con sé stesso, come resta in equilibrio e come facciamo a saperlo.", "1. L'isola (Ḥayy ibn Yaqẓān)"),
 ("R", "Respiro e cuore", "polmoni", "Il respiro è una delle poche funzioni automatiche che si possono anche guidare; attraverso il respiro si influisce sul cuore.", "2. Il mare dei venti (Ulisse)"),
 ("E", "Emozioni e stress", "cervello", "Dall'allarme che protegge alla regolazione delle emozioni. Tutte le emozioni sono utili; non si chiede di raccontare esperienze personali.", "3. Il deserto (Sinuhe)"),
 ("A", "Alimentazione ed energia", "cocco", "Il collegamento tra cibo, fisiologia ed emozioni. Nessun cibo è «buono» o «cattivo»: si osservano gli effetti, senza colpevolizzare.", "4. Il campo di mais (Popol Vuh)"),
 ("S", "Sonno e ritmi", "luna", "L'orologio interno, la luce e il sonno come momento in cui il corpo recupera.", "5. Il vulcano del sole (Māui)"),
 ("M", "Mondo esterno, relazioni e diritti", "mappa", "Sensi, ambiente, movimento, persone, tecnologia e il collegamento con i diritti umani.", "6. Il palazzo sotto il mare (Urashima Tarō)"),
]
MONDI = {1: ("Mondo 1", "Scuola primaria", "Sentire, osservare, contare, nominare, usare"),
         2: ("Mondo 2", "Scuola secondaria di primo grado", "Strutture, apparati, modelli semplici"),
         3: ("Mondo 3", "Scuola secondaria di secondo grado", "Meccanismi: molecole, circuiti, regolazione"),
         4: ("Mondo 4", "Università", "Integrazione, misure, evidenze, controversie")}

# ---------------------------------------------------------------- apertura
D.add("copertina", "scuro copertina", f'''<div class="cop-testo">
<p class="occhiello">Progetto Respira</p>
<h1>Roadmap disciplinare</h1>
<div class="filetto"></div>
<p class="sotto">Le nozioni trattate nel gioco: sei filoni, quattro mondi, 144 passi</p>
<p class="data">Versione 2, novembre 2026</p></div>
<div class="cop-vis">{D.img("mappa-mondo", maxh=520, maxw=860)}</div>''')

D.libera("struttura", "Introduzione", "Struttura della roadmap",
 '<table class="tabella compatta"><tr><th></th><th>Filone</th><th>Di che cosa si occupa</th></tr>'
 + "".join(f'<tr><td class="i">{D.ico(i, 48)}</td><td><b>{c}</b>. {n}</td><td>{d}</td></tr>' for c, n, i, d, _ in FILONI)
 + "</table>"
 + '<div class="basso"><div class="testo">' + P(["<b>6 filoni × 4 mondi × 6 passi = 144 passi.</b> Ogni passo introduce una sola idea nuova."]) + "</div>"
 + D.parole([("Filone", "insieme di nozioni su uno stesso tema, ripreso a ogni mondo")]) + "</div>")

D.libera("mondi", "Introduzione", "La scala della conoscenza",
 '<table class="tabella"><tr><th>Mondo</th><th>Livello scolastico</th><th>Che cosa si fa</th><th>Domanda guida</th></tr>'
 + "".join(f'<tr><td><b>{MONDI[k][0]}</b></td><td>{MONDI[k][1]}</td><td>{MONDI[k][2]}</td><td><i>{q}</i></td></tr>'
           for k, q in [(1, "Che cosa succede nel mio corpo?"), (2, "Dove succede, e con quali organi?"), (3, "Come succede?"), (4, "Come lo sappiamo, e quanto ne siamo sicuri?")])
 + "</table>"
 + '<div class="basso"><div class="testo">' + P(["Il gioco in sviluppo copre il <b>Mondo 1</b>.<br>Alcune parole del Mondo 2 sono anticipate con un disegno quando servono."]) + "</div>"
 + D.parole([("Mondo", "grado di approfondimento, legato all'età")]) + "</div>", alt=True)

D.pagina("principi", "Introduzione", "Principi di gradualità",
 P(["<b>Una sola idea nuova per passo.</b>",
    "<b>Ogni passo è vero:</b> il mondo successivo aggiunge, non smentisce.",
    "<b>Dal concreto all'astratto:</b> esperienza, poi schema, poi termine tecnico.",
    "<b>Spirale:</b> ogni filone torna in ogni mondo, più in profondità.",
    "<b>Prerequisiti espliciti</b>, anche tra filoni diversi.",
    "<b>Ipotesi discusse</b> solo nel Mondo 4, con argomenti a favore e contro."]),
 D.icona_grande("ripeti", "Ogni concetto si riprende e si approfondisce"),
 [("Prerequisito", "nozione da conoscere prima di affrontarne un'altra")])

D.pagina("codici", "Introduzione", "Come si leggono i codici",
 '<div class="nome-arabo"><p><span class="pz">R</span> il filone (Respiro e cuore)</p><p><span class="pz">2</span> il mondo (scuola secondaria di primo grado)</p><p><span class="pz">5</span> il quinto passo del filone in quel mondo</p></div>'
 + P(["Esempio: <b>R2.5</b>, «il respiro è sia automatico sia volontario».",
      'Le etichette <span class="tag indiretto">ponte</span> e <span class="tag contesto">ipotesi discussa</span> segnalano<br>i passi che collegano due mondi e i temi ancora aperti.']),
 D.icona_grande("parola"),
 [("Ponte", "passo che riprende il mondo precedente e lo porta al livello successivo")], alt=True)

D.larga("livelli", "Introduzione", "I livelli del Mondo 1 e i filoni",
 D.img("mappa-mondo", maxh=330, maxw=1696),
 P(["<b>1</b> Ḥayy, Basi comuni; <b>2</b> Ulisse, Respiro e cuore; <b>3</b> Sinuhe, Emozioni e stress;",
    "<b>4</b> Popol Vuh, Alimentazione; <b>5</b> Māui, Sonno e ritmi; <b>6</b> Urashima, Mondo esterno; <b>7</b> Sundiata, tutti i filoni."]),
 [("Livello", "parte del gioco legata a una storia e a un filone")])

D.libera("livello1", "Introduzione", "Il livello 1 nella roadmap",
 '<table class="tabella compatta"><tr><th>Codice</th><th>Nozione</th><th>Nel gioco</th></tr>'
 + "".join(f"<tr><td><b>{c}</b></td><td>{pulito(R[c]['passo'])}</td><td>{g}</td></tr>" for c, g in [
   ("B1.1", "copiare gli animali; schema degli organi"),
   ("B1.2", "prova del bosco; cuore e polmoni come un unico giro"),
   ("B1.3", "i cocchi al volo; neuroni e sinapsi"),
   ("B1.4", "il cuore della gazzella; gli ormoni"),
   ("B1.5", "la vista del calore; prova della notte"),
   ("B1.6", "tre prove e la media"),
   ("R1.1", "ascoltare il cuore della gazzella"),
   ("R1.2", "contare il proprio battito (facoltativo)")])
 + "</table>"
 + '<div class="basso"><div class="testo">' + P(["Termini anticipati con un disegno: <b>cellula</b> (B2.1), <b>neurone</b> (B2.3), <b>sinapsi</b> (B2.4)."]) + "</div></div>")

# ---------------------------------------------------------------- filoni
def tabella(f, m):
    righe = ""
    for n in range(1, 7):
        c = f"{f}{m}.{n}"
        r = R[c]
        righe += (f"<tr><td class=\"cod\"><b>{c}</b></td><td>{pulito(r['passo'])}{marca(r['passo'])}</td>"
                  f"<td class=\"pre\">{r['pre']}</td><td class=\"ver\">{pulito(r['ver'])}</td></tr>")
    return ('<table class="tabella rm"><tr><th>Codice</th><th>Nozione</th><th>Prerequisiti</th><th>Verifica</th></tr>'
            + righe + "</table>")

for k, (f, nome, ic, desc, livello) in enumerate(FILONI):
    D.add("f" + f, "scuro capitolo",
          f'<div class="cap-testo"><p class="numero">{f}</p><h2>{nome}</h2><p class="sotto">{desc}</p>'
          f'<p class="sotto piccolo">Livello del Mondo 1: {livello}</p></div>'
          f'<div class="cap-vis"><figure class="fig emblema"><div class="cornice">{D.ico(ic, 260)}</div></figure></div>')
    for m in range(1, 5):
        D.libera(f"{f}{m}", f"Filone {f}. {nome}", f"{MONDI[m][0]}: {MONDI[m][1].lower()}",
                 f'<div class="fil-ico">{D.ico(ic, 90)}</div>' + tabella(f, m), alt=(m % 2 == 0))

# ---------------------------------------------------------------- chiusura
CATENE = [("Dal respiro alla risonanza", "R1.4, R1.5, R1.6, R2.5, R3.1, R3.3, R3.4, R4.1, R4.3, R4.4"),
          ("Dal cibo all'asse intestino-cervello", "A1.1, A2.1, A2.3, A3.5, A3.6, A4.1, A4.2, A4.3"),
          ("Dalla paura allo stress cronico", "E1.3, E1.4, E2.2, E2.4, E3.1, E3.2, E3.3, E3.4, E4.4"),
          ("Dall'equilibrio all'allostasi", "B1.5, B3.6, B4.1, B4.2, M4.2, M4.3"),
          ("Dal buio al sonno e alle emozioni", "S1.2, S2.3, S3.2, S3.3, S3.5, S4.1, S4.2, S4.3"),
          ("Dai diritti alle politiche", "M1.6, M2.6, M4.3, M4.5")]
D.libera("catene", "Sintesi", "Le catene di prerequisiti più lunghe",
 '<table class="tabella"><tr><th>Percorso</th><th>Passi, in ordine</th></tr>'
 + "".join(f"<tr><td><b>{a}</b></td><td>{b}</td></tr>" for a, b in CATENE) + "</table>"
 + '<div class="basso"><div class="testo">' + P(["Sono le sequenze che attraversano più filoni e tutti e quattro i mondi:<br>vanno rispettate con particolare attenzione."]) + "</div></div>")

D.libera("gioco", "Sintesi", "Dalla scienza al gioco: cautele",
 '<table class="tabella"><tr><th>Rischio</th><th>Scelta nel gioco</th></tr>' + "".join(f"<tr><td>{a}</td><td>{b}</td></tr>" for a, b in [
  ("Il battito del gioco sembra una misura reale", "È simulato, e il gioco lo dichiara"),
  ("«Battito alto = male»", "Il battito alto serve per correre o scappare"),
  ("Ritmo del respiro troppo lento per un bambino", "Ritmo adattivo, che parte da quello naturale"),
  ("Lo zucchero dà una «spinta»", "Nessun bonus dagli zuccheri"),
  ("Le sostanze sono «nemici»", "Le sostanze hanno pregi e limiti"),
  ("Tecniche persuasive (ricompense casuali, notifiche)", "Nessuna ricompensa casuale né notifica; sessioni brevi"),
  ("Le ipotesi diventano fatti", "Le ipotesi stanno solo nel Mondo 4, segnalate come tali")]) + "</table>", alt=True)

D.pagina("revisione", "Sintesi", "Revisione e fonti",
 P(["La roadmap è una <b>bozza</b> da rivedere con un docente di scienze<br>prima dell'uso con i bambini.",
    "Le fonti dei punti critici (zuccheri e umore, misure dell'intestino, ore di sonno,<br>respiro lento nei bambini, teoria polivagale, schermi e sonno)<br>sono elencate nel documento completo della roadmap.",
    "Documento: <b>documentazione/didattica/roadmap</b> nel repository del progetto."]),
 D.icona_grande("libro"),
 [("Revisione", "controllo dei contenuti da parte di un esperto")])

CSS = open("/home/claude/decks/deckA2/project/deck.css").read() + '''
.rm td { font-size: 23px; padding: 10px 12px; line-height: 1.25; }
.rm th { font-size: 24px; }
.rm td.cod { width: 96px; white-space: nowrap; }
.rm td.pre { width: 190px; font-size: 21px; color: var(--muto); }
.rm td.ver { width: 470px; font-size: 21px; }
.compatta td { font-size: 23px; padding: 8px 12px; line-height: 1.25; }
.compatta td.i { padding: 2px 6px; }
.fil-ico { position: absolute; right: 112px; top: 64px; }
.capitolo .sotto.piccolo { font-size: 26px; color: #A9A291; }
'''

D.scrivi("Respira: roadmap disciplinare", "copertina",
 {"s0": {"description": "Introduzione: struttura, mondi, principi, codici, livelli", "start": "copertina"},
  "s1": {"description": "Filone B, basi comuni", "start": "fB"},
  "s2": {"description": "Filone R, respiro e cuore", "start": "fR"},
  "s3": {"description": "Filone E, emozioni e stress", "start": "fE"},
  "s4": {"description": "Filone A, alimentazione ed energia", "start": "fA"},
  "s5": {"description": "Filone S, sonno e ritmi", "start": "fS"},
  "s6": {"description": "Filone M, mondo esterno, relazioni e diritti", "start": "fM"},
  "s7": {"description": "Sintesi: catene di prerequisiti, cautele, revisione", "start": "catene"}},
 {"eb-garamond": {"family": "EB Garamond", "href": "https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400..700&family=Public+Sans:wght@400;600;700&display=swap"},
  "public-sans": {"family": "Public Sans", "href": "https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;600;700&display=swap"}},
 CSS)
