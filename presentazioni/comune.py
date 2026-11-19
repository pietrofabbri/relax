"""Aiuti condivisi per generare i due pacchi di slide (struttura v5 del tipo Slides)."""
import json, os, datetime

ICONE = json.load(open("/home/claude/decks/icone.json"))

# Dimensioni delle immagini (per tenere l'impaginazione stabile anche prima del caricamento)
DIM = {}
try:
    from PIL import Image
    import glob
    for f in glob.glob("/home/claude/decks/img/*.png"):
        DIM[os.path.basename(f)[:-4]] = Image.open(f).size
except Exception:
    pass


class Deck:
    def __init__(self, root, blob):
        self.R = root
        self.blob = blob
        self.S = {}
        self.ordine = []
        os.makedirs(root + "/slides", exist_ok=True)

    # --- elementi visivi -------------------------------------------------
    def img(self, nome, did="", alt="", maxh=600, maxw=820, stile=""):
        """Immagine con larghezza e altezza esplicite (il formato Slides le richiede)."""
        w, h = DIM.get(nome, (1600, 900))
        W = min(maxw, maxh * w / h)
        H = W * h / w
        style = f"width:{round(W)}px;height:{round(H)}px;object-fit:contain;flex:none;" + stile
        cap = f'<p class="didascalia">{did}</p>' if did else ""
        return f'<figure class="fig"><img src="{self.blob[nome]}" alt="{alt or did}" style="{style}">{cap}</figure>'

    @staticmethod
    def ico(nome, dim=96):
        return f'<svg class="ico" viewBox="0 0 64 64" width="{dim}" height="{dim}" aria-hidden="true">{ICONE[nome]}</svg>'

    def icona_grande(self, nome, did=""):
        cap = f'<p class="didascalia">{did}</p>' if did else ""
        return f'<figure class="fig emblema"><div class="cornice">{self.ico(nome, 220)}</div>{cap}</figure>'

    def icone(self, voci, colonne=2):
        """voci: lista di (icona, titolo, testo)"""
        celle = "".join(
            f'<div class="cella">{self.ico(i, 88)}<div><p class="t">{t}</p><p class="d">{d}</p></div></div>'
            for i, t, d in voci)
        return f'<div class="griglia-ico c{colonne}">{celle}</div>'

    # --- testo ------------------------------------------------------------
    @staticmethod
    def parole(voci):
        if not voci:
            return ""
        def frase(d):
            d = d[0].upper() + d[1:]
            return d if d.endswith((".", "»", ")")) else d + "."
        righe = "".join(f'<p><b>{t}</b>. {frase(d)}</p>' for t, d in voci)
        return f'<div class="parole"><p class="tit-parole">Glossario</p>{righe}</div>'

    @staticmethod
    def punti(righe):
        return "".join(f'<p class="punto">{r}</p>' for r in righe)

    # --- impaginazioni ------------------------------------------------------
    @staticmethod
    def formale(t):
        """Occhiello sobrio: «I · L'autore · Dove» -> «Parte I. L'autore, dove»."""
        import re
        parti = [x.strip() for x in t.split(" · ")]
        if parti and re.fullmatch(r"[IVX]+", parti[0]):
            parti[0] = "Parte " + parti[0]
        if len(parti) > 1 and re.fullmatch(r"\d+/\d+", parti[-1]):
            n = parti.pop()
            parti[-1] += " (" + n.replace("/", " di ") + ")"
        return ". ".join(parti)

    def add(self, id, cls, corpo, nota=""):
        import re
        assert id not in self.S, id
        corpo = re.sub(r'<p class="occhiello">(.*?)</p>', lambda m: '<p class="occhiello">' + self.formale(m.group(1)) + "</p>", corpo)
        corpo = re.sub(r"Art\. (\d+) · ", r"Art. \1, ", corpo)
        corpo = corpo.replace(" · ", "; ").replace(" → ", ", ")
        corpo = re.sub(r'<td class="i">.*?</td>', "", corpo, flags=re.S).replace("<tr><th></th>", "<tr>")
        self.S[id] = (f'<section id="{id}" class="{cls}">\n{corpo}\n'
                      + (f"<aside>{nota}</aside>\n" if nota else "") + "</section>\n")
        self.ordine.append(id)

    def pagina(self, id, occhiello, titolo, testo, visivo, parole=None, fonte="", nota="", alt=False, inverti=False):
        """Testo a sinistra (con parole nuove), elemento visivo a destra."""
        f = f'<p class="fonte">{fonte}</p>' if fonte else ""
        sx = f'<div class="testo">{testo}{self.parole(parole)}</div>'
        dx = f'<div class="visivo">{visivo}</div>'
        corpo = (f'<p class="occhiello">{occhiello}</p><h2>{titolo}</h2>'
                 f'<div class="corpo{" inv" if inverti else ""}">{sx}{dx}</div>{f}')
        self.add(id, "pag" + (" alt" if alt else ""), corpo, nota)

    def larga(self, id, occhiello, titolo, visivo, testo, parole=None, fonte="", nota="", alt=False):
        """Elemento visivo largo in alto, sotto testo e parole nuove affiancati."""
        f = f'<p class="fonte">{fonte}</p>' if fonte else ""
        corpo = (f'<p class="occhiello">{occhiello}</p><h2>{titolo}</h2>'
                 f'<div class="alto">{visivo}</div>'
                 f'<div class="basso"><div class="testo">{testo}</div>{self.parole(parole)}</div>{f}')
        self.add(id, "pag" + (" alt" if alt else ""), corpo, nota)

    def libera(self, id, occhiello, titolo, html, fonte="", nota="", alt=False):
        f = f'<p class="fonte">{fonte}</p>' if fonte else ""
        self.add(id, "pag" + (" alt" if alt else ""),
                 f'<p class="occhiello">{occhiello}</p><h2>{titolo}</h2>{html}{f}', nota)

    def scrivi(self, titolo, cover, sezioni, faces, css):
        os.makedirs(self.R + "/slides", exist_ok=True)
        for f in os.listdir(self.R + "/slides"):
            os.remove(self.R + "/slides/" + f)
        for k, v in self.S.items():
            open(f"{self.R}/slides/{k}.html", "w").write(v)
        open(f"{self.R}/deck.css", "w").write(css)
        deck = {"v": 5,
                "createdOnFiles": {"v": 1, "at": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")},
                "lists": "css", "format": {"v": 1, "shared": ["project/deck.css"]},
                "title": titolo, "cover": cover, "order": self.ordine,
                "sections": sezioni, "faces": faces, "designSystems": []}
        json.dump(deck, open(f"{self.R}/deck.json", "w"), ensure_ascii=False, indent=1)
        print(len(self.S), "slide")


CSS_BASE = '''
.pag { padding: 80px 112px 120px; display: flex; flex-direction: column; gap: 22px; }
.corpo { display: flex; gap: 64px; align-items: flex-start; flex: none; }
.corpo.inv { flex-direction: row-reverse; }
.corpo .testo { flex: 1; display: flex; flex-direction: column; gap: 18px; min-width: 0; }
.corpo .visivo { width: 820px; flex: none; display: flex; justify-content: center; }
.alto { display: flex; justify-content: center; }
.basso { display: flex; gap: 56px; align-items: flex-start; }
.basso .testo { flex: 1; display: flex; flex-direction: column; gap: 14px; }
.basso .parole { width: 760px; flex: none; }
.fig { margin: 0; display: flex; flex-direction: column; align-items: center; gap: 10px; max-width: 100%; }
.fig img { display: block; border-radius: 14px; border: 2px solid var(--linea); background: var(--carta2); }
.didascalia { font-size: 22px; color: var(--muto); text-align: center; }
.tondo { width: 420px; height: 420px; border-radius: 50%; background: var(--carta2); display: flex; align-items: center; justify-content: center; border: 3px solid var(--linea); }
.punto { font-size: 33px; line-height: 1.38; color: var(--testo); }
.punto b { color: var(--inchiostro); }
.parole { background: var(--fondo-parole); border-left: 8px solid var(--accento); border-radius: 10px; padding: 18px 26px; display: flex; flex-direction: column; gap: 6px; }
.parole p { font-size: 26px; line-height: 1.32; color: var(--testo); }
.parole b { color: var(--inchiostro); }
.tit-parole { font-size: 20px !important; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--accento) !important; }
.griglia-ico { display: grid; gap: 22px 36px; width: 100%; }
.griglia-ico.c1 { grid-template-columns: 1fr; }
.griglia-ico.c2 { grid-template-columns: 1fr 1fr; }
.griglia-ico.c3 { grid-template-columns: 1fr 1fr 1fr; }
.cella { display: flex; gap: 20px; align-items: flex-start; background: var(--fondo-cella); border-radius: 14px; padding: 16px 20px; border: 2px solid var(--linea); }
.cella .ico { flex: none; }
.cella .t { font-size: 29px; font-weight: 700; color: var(--inchiostro); line-height: 1.2; }
.cella .d { font-size: 25px; line-height: 1.3; color: var(--testo); margin-top: 4px; }
.fonte { position: absolute; left: 112px; bottom: 44px; width: 1696px; font-size: 21px; color: var(--muto); }
.linea-tempo { display: flex; width: 100%; position: relative; padding-top: 24px; }
.linea-tempo::before { content: ""; position: absolute; left: 0; right: 0; top: 62px; height: 6px; background: var(--linea); border-radius: 3px; }
.lt-voce { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; position: relative; padding: 0 8px; }
.lt-anno { font-size: 30px; font-weight: 700; color: var(--accento); background: var(--carta); padding: 0 8px; position: relative; z-index: 1; }
.lt-pallino { width: 26px; height: 26px; border-radius: 50%; background: var(--accento); border: 5px solid var(--carta); position: relative; z-index: 1; }
.lt-voce.altro .lt-pallino { background: var(--muto); }
.lt-voce.altro .lt-anno { color: var(--muto); }
.lt-testo { font-size: 25px; line-height: 1.3; color: var(--testo); }
.lt-voce .ico { margin-top: 4px; }
.alt .lt-anno { background: var(--carta2); }
.alt .lt-pallino { border-color: var(--carta2); }
.tabella { width: 100%; border-collapse: collapse; font-size: 29px; }
.tabella th { text-align: left; font-weight: 700; color: var(--inchiostro); background: var(--carta2); padding: 10px 16px; border-bottom: 2px solid var(--linea); }
.alt .tabella th { background: var(--carta); }
.tabella td { padding: 16px 16px; border-bottom: 1px solid var(--linea); color: var(--testo); vertical-align: middle; line-height: 1.3; }
.tabella td.i { width: 76px; padding: 4px 8px; }
.tabella td b { color: var(--inchiostro); }
.citazione { border-left: 8px solid var(--accento); padding: 6px 0 6px 32px; display: flex; flex-direction: column; gap: 10px; }
.citazione .norma { font-family: var(--serif); font-size: 36px; line-height: 1.3; color: var(--inchiostro); font-style: italic; }
.citazione .rif { font-size: 22px; color: var(--muto); }
.legenda { display: flex; gap: 16px; flex-wrap: wrap; }
.tag { display: inline-block; font-size: 20px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 4px 12px; border-radius: 6px; background: var(--accento); color: #fff; }
.tag.indiretto { background: var(--muto); }
.tag.contesto { background: transparent; color: var(--muto); border: 2px solid var(--muto); }
'''


CSS_SOBRIO = '''
/* stile sobrio e formale */
.occhiello { font-family: var(--serif) !important; font-size: 27px !important; font-weight: 500 !important; font-style: italic; letter-spacing: 0 !important; text-transform: none !important; color: var(--accento) !important; }
.ico { filter: grayscale(1) sepia(0.2) contrast(1.15); opacity: 0.82; }
.emblema .cornice { width: 400px; height: 330px; display: flex; align-items: center; justify-content: center; border-top: 2px solid var(--inchiostro); border-bottom: 1px solid var(--linea); }
.scuro .emblema .cornice, .notte .emblema .cornice { border-color: #8D96A6; }
.fig img { border-radius: 2px !important; border: 1px solid var(--linea) !important; }
.didascalia { font-style: italic; font-size: 21px; }
.parole { background: transparent !important; border-left: none !important; border-radius: 0 !important; border-top: 2px solid var(--inchiostro); padding: 12px 0 0 !important; }
.tit-parole { font-family: var(--serif); font-variant: small-caps; text-transform: none !important; letter-spacing: 1px !important; font-size: 24px !important; color: var(--inchiostro) !important; font-weight: 600; }
.parole p { font-size: 24px !important; }
.cella { border-radius: 0 !important; border: none !important; border-top: 1px solid var(--linea) !important; background: transparent !important; padding: 14px 0 6px !important; }
.tag { border-radius: 0 !important; background: transparent !important; color: var(--accento) !important; border: 1.5px solid var(--accento); font-weight: 600; letter-spacing: 0.5px; }
.tag.indiretto { color: var(--muto) !important; border-color: var(--muto); }
.tag.contesto { border-style: dashed; }
.citazione { border-left-width: 3px !important; }
.lt-pallino { width: 18px !important; height: 18px !important; border-width: 4px !important; }
.linea-tempo::before { height: 2px !important; top: 64px !important; border-radius: 0 !important; }
.tabella th { background: transparent !important; border-bottom: 2px solid var(--inchiostro) !important; font-family: var(--serif); font-size: 30px; }
.filetto { height: 2px !important; }
'''
