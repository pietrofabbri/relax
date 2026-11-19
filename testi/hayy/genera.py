import re, json, html
G = {
 "andalus": ("al-Andalus", "nome arabo delle terre della penisola iberica (oggi Spagna e Portogallo) governate da sovrani musulmani tra il 711 e il 1492."),
 "xii": ("XII secolo", "gli anni dal 1101 al 1200. In Italia è il tempo dei Comuni e dello scontro con l'imperatore Federico Barbarossa."),
 "medioevo": ("Medioevo", "periodo della storia europea che si fa andare convenzionalmente dal 476 (fine dell'Impero romano d'Occidente) al 1492."),
 "filosofo": ("filosofo", "chi cerca di capire, con il ragionamento, come è fatto il mondo, che cosa possiamo conoscere e come conviene vivere."),
 "corte": ("corte", "l'insieme delle persone che vivono e lavorano intorno a un sovrano: consiglieri, funzionari, medici, poeti."),
 "romanzo": ("romanzo filosofico", "racconto inventato che serve a far riflettere su una grande domanda; qui: che cosa può scoprire da sola la mente umana."),
 "anacronismo": ("anacronismo", "errore che consiste nell'attribuire a un'epoca idee, oggetti o fatti che appartengono a un'epoca successiva."),
 "genealogia": ("genealogia", "la serie degli antenati di una persona: padre, nonno, bisnonno e così via."),
 "tribu": ("tribù", "grande gruppo di famiglie che si considerano discendenti da antenati comuni."),
 "latinizzato": ("latinizzato", "adattato alla lingua latina, che fino al Settecento era la lingua comune degli studiosi europei."),
 "astronomia": ("astronomia", "scienza che studia gli astri: stelle, pianeti, Sole, Luna e i loro movimenti."),
 "governatore": ("governatore", "funzionario che governa una città o una regione per conto del sovrano."),
 "califfo": ("califfo", "capo politico e religioso di uno Stato musulmano; letteralmente «successore» (del profeta Maometto)."),
 "dinastia": ("dinastia", "serie di sovrani appartenenti alla stessa famiglia, che si succedono al potere."),
 "almohadi": ("Almohadi", "dinastia di origine berbera (popoli del Nord Africa) che governò il Marocco e al-Andalus tra il XII e il XIII secolo."),
 "aristotele": ("Aristotele", "filosofo greco del IV secolo a.C.; i suoi libri sulla natura, sugli animali e sulla logica furono studiati per secoli in tutto il Mediterraneo."),
 "commento": ("commento", "libro che spiega un altro libro, passo per passo."),
 "barbarossa": ("Federico Barbarossa", "imperatore del Sacro Romano Impero dal 1155 al 1190; combatté contro i Comuni dell'Italia settentrionale."),
 "legnano": ("battaglia di Legnano", "battaglia del 1176 in cui la Lega dei Comuni lombardi sconfisse l'esercito di Federico Barbarossa."),
 "fede": ("fede", "l'adesione a verità religiose che si accolgono per fiducia nella rivelazione, cioè in ciò che si ritiene comunicato da Dio."),
 "epistola": ("epistola", "lettera, spesso lunga e rivolta a una persona precisa, scritta per spiegare un'idea."),
 "simbolico": ("simbolico", "che rappresenta un'idea astratta attraverso personaggi, oggetti o immagini concrete."),
 "manoscritto": ("manoscritto", "libro copiato a mano; prima dell'invenzione della stampa (metà del Quattrocento) tutti i libri erano manoscritti."),
 "equatore": ("equatore", "linea immaginaria che divide la Terra in due metà, nord e sud; nelle zone vicine all'equatore il clima è caldo tutto l'anno."),
 "tizzone": ("tizzone", "pezzo di legno che brucia ancora o è ancora acceso."),
 "meditare": ("meditare", "riflettere a lungo e in silenzio, spesso per motivi religiosi o spirituali."),
 "esperimento": ("esperimento mentale", "esperimento condotto solo con l'immaginazione, chiedendosi «che cosa succederebbe se…»."),
 "orientalista": ("orientalista", "studioso delle lingue, delle religioni e delle culture del Medio Oriente e dell'Asia."),
 "ebraico": ("ebraico", "lingua del popolo ebraico, in cui è scritta la Bibbia ebraica; nel Medioevo era anche lingua di studio e di scienza."),
 "fronte": ("traduzione a fronte", "edizione in cui il testo originale e la traduzione sono stampati su pagine affiancate."),
 "quaccheri": ("quaccheri", "movimento cristiano nato in Inghilterra nel Seicento, senza preti né riti, che dà grande valore alla coscienza di ciascuno."),
 "ragionenat": ("ragione naturale", "la capacità di conoscere che ogni essere umano possiede per natura, indipendentemente dall'istruzione e dalla rivelazione religiosa."),
 "divulgativo": ("divulgativo", "scritto per un pubblico ampio, non solo per specialisti."),
 "naufrago": ("naufrago", "chi si salva da una nave affondata."),
 "onu": ("Nazioni Unite (ONU)", "organizzazione internazionale fondata nel 1945, alla fine della Seconda guerra mondiale, per mantenere la pace e la cooperazione tra gli Stati."),
 "assemblea": ("Assemblea generale", "l'organo dell'ONU in cui sono rappresentati tutti gli Stati membri, ciascuno con un voto."),
 "dichiarazione": ("dichiarazione", "testo con cui si affermano solennemente dei principi; la Dichiarazione universale non è di per sé una legge vincolante, ma ha ispirato trattati e costituzioni."),
 "costituzione": ("Costituzione", "la legge fondamentale dello Stato, che stabilisce i diritti dei cittadini e l'organizzazione dei poteri pubblici. Tutte le altre leggi devono rispettarla."),
 "dignita": ("dignità", "il valore che ogni persona ha per il solo fatto di esistere, e che va sempre rispettato."),
 "coscienza": ("coscienza", "la capacità di capire che cosa è giusto e che cosa è sbagliato, e di riconoscersi responsabili delle proprie azioni."),
 "fratellanza": ("fratellanza", "legame di solidarietà e rispetto reciproco tra tutte le persone, come tra fratelli."),
 "molestato": ("molestato", "disturbato, infastidito o perseguitato."),
 "frontiere": ("senza riguardo a frontiere", "indipendentemente dai confini tra gli Stati."),
 "istruzionetec": ("istruzione tecnica e professionale", "scuole che preparano a un mestiere o a una professione."),
 "merito": ("merito", "l'impegno e i risultati di una persona."),
 "personalita": ("personalità", "l'insieme delle qualità, dei talenti e del carattere che rendono unica ogni persona."),
 "tolleranza": ("tolleranza", "rispetto per idee, culture e religioni diverse dalle proprie."),
 "progresso": ("progresso scientifico", "l'insieme delle nuove conoscenze e delle scoperte che la scienza raggiunge nel tempo."),
 "interessi": ("interessi morali e materiali", "il diritto di essere riconosciuti come autori di un'opera (interesse morale) e di ricavarne un guadagno (interesse materiale)."),
 "paridignita": ("pari dignità sociale", "uguale rispetto e uguale valore nella società, qualunque sia la condizione della persona."),
 "repubblica": ("Repubblica", "forma di Stato in cui il capo dello Stato non è un re ma è eletto; nella Costituzione la parola indica lo Stato e tutti gli enti pubblici."),
 "comma": ("comma", "ciascuna delle parti, separate da un a capo, in cui è diviso un articolo di legge."),
 "parita": ("scuole paritarie", "scuole non statali riconosciute dallo Stato, che rilasciano titoli di studio con lo stesso valore di quelli delle scuole statali."),
 "esamestato": ("esame di Stato", "esame organizzato dallo Stato, uguale per tutti, per concludere un percorso di studi o per esercitare una professione."),
 "ordinamenti": ("ordinamenti autonomi", "regole interne che le università possono darsi da sole, nel rispetto delle leggi."),
 "psicofisico": ("benessere psicofisico", "lo stare bene del corpo e della mente insieme."),
 "dissezione": ("dissezione", "apertura di un corpo dopo la morte per studiarne l'interno; nel libro è descritta come parte della ricerca di Ḥayy."),
 "ratifica": ("ratificare", "approvare ufficialmente un trattato internazionale, rendendolo legge dello Stato."),
}

def g(k, t=None):
    return f'<span class="g" data-k="{k}">{t or G[k][0]}</span>'


src = open("/home/claude/testo/contenuto.html").read()
def sost(m):
    k = m.group(1); t = m.group(2)
    assert k in G, k
    return f'<span class="g" data-k="{k}">{t or G[k][0]}</span>'
src = re.sub(r"\{(\w+)(?:\|([^}]+))?\}", sost, src)
defs = {k: [v[0], v[1]] for k, v in G.items()}

CSS = """
@font-face{font-family:'Testo';src:url(file:///usr/share/fonts/truetype/google-fonts/Lora-Variable.ttf);font-weight:100 900;font-style:normal}
@font-face{font-family:'Testo';src:url(file:///usr/share/fonts/truetype/google-fonts/Lora-Italic-Variable.ttf);font-weight:100 900;font-style:italic}
@page{size:210mm 297mm;margin:0}
html,body{margin:0;padding:0}
body{font-family:'Testo',Georgia,serif;color:#1f2328}
#src{position:absolute;left:-9999px;width:642px}
.pagina{width:794px;height:1123px;box-sizing:border-box;padding:72px 76px 52px;display:flex;flex-direction:column;page-break-after:always;break-after:page;overflow:hidden;position:relative}
.corpo{flex:1;overflow:hidden;font-size:14.2px;line-height:1.55}
.note{flex:none;font-size:11px;line-height:1.38;color:#333}
.note:not(:empty){border-top:0.8px solid #888;padding-top:6px;margin-top:8px}
.note p{margin:0 0 3px;text-align:left}
.note sup{font-size:9px;margin-right:3px}
.num{position:absolute;bottom:22px;left:0;right:0;text-align:center;font-size:11px;color:#777}
h1{font-size:30px;font-weight:600;margin:0 0 4px;line-height:1.15}
.sottotitolo{font-size:17px;font-style:italic;color:#5a4a3a;margin:0 0 14px}
.frontespizio{border-bottom:1px solid #1f2328;padding-bottom:10px;margin-bottom:14px}
.indice p{margin:0 0 2px}
h2{font-size:20px;font-weight:600;margin:20px 0 6px;color:#6e2a1e}
h3{font-size:15.5px;font-weight:600;margin:12px 0 4px}
p{margin:0 0 9px;text-align:justify;hyphens:auto}
.nota{font-size:12px;color:#555}
sup.r{font-size:9px;color:#6e2a1e;margin-left:1px}
figure{margin:8px 0 12px;text-align:center}
figure img{border:0.6px solid #ccc}
figcaption{font-size:11.5px;font-style:italic;color:#555;margin-top:3px}
table{border-collapse:collapse;width:100%;font-size:13px;margin:6px 0 12px}
th{text-align:left;border-bottom:1.4px solid #1f2328;padding:4px 6px;font-weight:600}
td{border-bottom:0.6px solid #c9c3b6;padding:4px 6px;vertical-align:top}
blockquote{margin:6px 0 10px;padding:4px 0 4px 14px;border-left:2.5px solid #6e2a1e;font-style:italic;font-size:13.6px;line-height:1.5}
.rif{font-style:normal;font-size:11.5px;color:#555;display:block;margin-top:4px}
ol.fonti li{margin-bottom:4px;font-size:13px}
"""
JS = """
const D = %s;
const src = document.getElementById('src');
const blocchi = [...src.children];
let n = 0; const visti = {};
let pag, corpo, note, numPag = 0;
function nuova(){ numPag++; pag=document.createElement('div'); pag.className='pagina';
  corpo=document.createElement('div'); corpo.className='corpo'; note=document.createElement('div'); note.className='note';
  const nu=document.createElement('div'); nu.className='num'; nu.textContent=numPag;
  pag.append(corpo,note,nu); document.body.appendChild(pag); }
function eccede(){ return corpo.scrollHeight > corpo.clientHeight + 1; }
function metti(b){
  const aggiunte=[];
  b.querySelectorAll('span.g').forEach(s=>{ const k=s.dataset.k;
    if(visti[k]){ return; } n++; visti[k]=n; aggiunte.push(k);
    const sup=document.createElement('sup'); sup.className='r'; sup.textContent=n; s.after(sup); s.dataset.sup='1';
    const p=document.createElement('p'); p.innerHTML='<sup>'+n+'</sup><b>'+D[k][0]+'</b>: '+D[k][1]; p.dataset.k=k; note.appendChild(p); });
  corpo.appendChild(b);
  return aggiunte;
}
function togli(b, agg){
  corpo.removeChild(b);
  agg.forEach(k=>{ delete visti[k]; n--; note.querySelector('p[data-k="'+k+'"]').remove(); });
  b.querySelectorAll('sup.r').forEach(s=>s.remove());
}
nuova();
for (const b of blocchi){
  let agg = metti(b);
  if (eccede() && corpo.children.length > 1){
    togli(b, agg);
    // il titolo non resta da solo in fondo alla pagina
    const sposta=[];
    while (corpo.lastElementChild && /^H[23]$/.test(corpo.lastElementChild.tagName)) { sposta.unshift(corpo.lastElementChild); corpo.removeChild(corpo.lastElementChild); }
    nuova();
    sposta.forEach(h=>corpo.appendChild(h));
    agg = metti(b);
  }
}
src.remove();
document.body.dataset.pronto = numPag;
""" % json.dumps(defs, ensure_ascii=False)

doc = f'<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"><style>{CSS}</style></head><body><div id="src">{src}</div><script>document.fonts.ready.then(()=>{{{JS}}});</script></body></html>'
open("/home/claude/testo/hayy2.html", "w").write(doc)
print("ok")
