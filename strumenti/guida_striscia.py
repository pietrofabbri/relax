"""Crea la guida da stampare per disegnare la striscia del fondale di un livello.

Uso:  python3 strumenti/guida_striscia.py [documentazione/fondali/livello1-guida.pdf]

La striscia è fatta di 5 fogli A4 orizzontali messi in fila (148,5 x 21 cm).
Copre tutto il livello, da sinistra (inizio) a destra (fine), alla stessa scala del gioco:
quello che il ragazzo disegna a 30 cm dall'inizio comparirà esattamente lì nel gioco.

Il ragazzo disegna il FONDALE come vuole. Il gioco ci mette sopra tutto il resto:
il terreno, le palme, la grotta, gli animali, Hayy.
Ogni foglio porta solo, a matita leggera:
- in alto, il capitolo della storia e l'ora del giorno di quel tratto (un'idea, non un obbligo);
- in basso, la fascia che verrà coperta dal terreno del gioco.
La prima pagina spiega come fare.
"""
import sys
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.units import cm
from reportlab.lib.colors import Color
from reportlab.pdfgen import canvas

USCITA = sys.argv[1] if len(sys.argv) > 1 else "documentazione/fondali/livello1-guida.pdf"

LARGHEZZA = 4700        # larghezza del livello nel gioco
ALTO, BASSO = 140, 805  # fascia del fondale nel gioco (vedi FONDALI in js/fondale.js)
SUOLO = 790
FOGLI = 5
W, H = landscape(A4)    # 29,7 x 21 cm
STRISCIA = FOGLI * W

MATITA = Color(0.55, 0.55, 0.6)
CHIARO = Color(0.75, 0.75, 0.8)
ROSSO = Color(0.85, 0.35, 0.3)


def px(wx):
    """x del gioco -> x sulla striscia (in punti tipografici)"""
    return wx / LARGHEZZA * STRISCIA


def py(wy):
    """y del gioco (0 in alto) -> y sul foglio (0 in basso)"""
    return (BASSO - wy) / (BASSO - ALTO) * H


CAPITOLI = [  # (da, a, numero, titolo, ora)
    (0, 820, 1, "Segui la gazzella", "alba"),
    (820, 1660, 2, "Copia gli animali", "giorno"),
    (1660, 2720, 3, "Corri!", "giorno"),
    (2720, 3150, 4, "Riflessi: i cocchi", "giorno"),
    (3150, 3560, 5, "Il cuore della gazzella", "tramonto"),
    (3560, 4100, 6, "Il fuoco / 7 Il calore", "notte"),
    (4100, 4700, 9, "Absal arriva dal mare", "alba"),
]

def foglio_istruzioni(c):
    c.setFont("Helvetica-Bold", 26)
    c.drawString(2 * cm, H - 2.6 * cm, "Respira - La striscia del livello 1: L'isola")
    c.setFont("Helvetica", 13)
    righe = [
        "1. Metti in fila 5 fogli A4 orizzontali: dal foglio 1 (inizio del livello) al foglio 5 (fine).",
        "2. Disegna a matita, poi ripassa a china o pennarello nero. Pochi colori, o nessuno.",
        "3. Il CIELO resta bianco: nel gioco diventa il cielo animato. Niente sole e niente luna: li fa il gioco.",
        "4. Disegna il paesaggio come vuoi: monti, mare, boschi, nuvole, rovine, tutto quello che immagini.",
        "5. Palme, grotta, animali, Hayy e il terreno li mette il gioco, sopra al tuo disegno.",
        "6. La fascia grigia in basso verra' coperta dal terreno: li' non serve disegnare molto.",
        "7. In alto trovi il capitolo della storia e l'ora del giorno di ogni tratto: se vuoi, lasciati ispirare.",
        "8. Fotografa i fogli dall'alto, uno alla volta, con buona luce. Poi:",
        "     - dal telefono: Impostazioni > Il tuo disegno come fondale > scegli le foto da sinistra a destra;",
        "     - per tutti: python3 strumenti/prepara_fondale.py foglio1.jpg ... foglio5.jpg assets/fondali/livello1.png",
    ]
    y = H - 4.2 * cm
    for r in righe:
        c.drawString(2 * cm, y, r)
        y -= 0.85 * cm
    # la striscia intera, in piccolo
    x0, y0, lw = 2 * cm, 2 * cm, W - 4 * cm
    sh = lw / FOGLI * (H / W)
    c.setStrokeColor(MATITA)
    c.setLineWidth(1)
    for i in range(FOGLI):
        c.rect(x0 + i * lw / FOGLI, y0, lw / FOGLI, sh)
        c.setFont("Helvetica-Bold", 14)
        c.setFillColor(MATITA)
        c.drawCentredString(x0 + (i + 0.5) * lw / FOGLI, y0 + sh / 2 - 5, "foglio %d" % (i + 1))
    k = lw / STRISCIA
    c.setFillColor(ROSSO)
    c.setFont("Helvetica", 7)
    for (da, a, n, titolo, ora) in CAPITOLI:
        c.drawString(x0 + px(da) * k + 2, y0 + sh + 4, "%d %s" % (n, titolo))
    c.showPage()


def foglio(c, i):
    x_inizio = i * W  # questo foglio copre [x_inizio, x_inizio + W] sulla striscia
    c.translate(-x_inizio, 0)
    # ora del giorno: fascia leggera in alto
    c.setFont("Helvetica-Bold", 11)
    for (da, a, n, titolo, ora) in CAPITOLI:
        x1, x2 = px(da), px(a)
        if x2 < x_inizio or x1 > x_inizio + W:
            continue
        c.setStrokeColor(CHIARO)
        c.setLineWidth(0.8)
        c.setDash(2, 3)
        c.line(x1, H - 1.6 * cm, x1, H - 0.4 * cm)
        c.setDash()
        c.setFillColor(ROSSO)
        c.drawString(max(x1, x_inizio) + 6, H - 0.9 * cm, "%d. %s" % (n, titolo))
        c.setFillColor(MATITA)
        c.setFont("Helvetica-Oblique", 10)
        c.drawString(max(x1, x_inizio) + 6, H - 1.4 * cm, ora)
        c.setFont("Helvetica-Bold", 11)
    # fascia coperta dal terreno del gioco (la sabbia comincia a y = 632)
    yt = py(632)
    c.setFillColor(Color(0.6, 0.6, 0.65, alpha=0.12))
    c.rect(x_inizio, 0, W, yt, stroke=0, fill=1)
    c.setStrokeColor(MATITA)
    c.setLineWidth(0.8)
    c.setDash(8, 5)
    c.line(x_inizio, yt, x_inizio + W, yt)
    c.setDash()
    c.setFillColor(MATITA)
    c.setFont("Helvetica", 9)
    c.drawString(x_inizio + 8, yt - 14, "qui sotto il gioco disegna il terreno: questa fascia sara' coperta")
    # numero del foglio e righello in cm
    c.setFillColor(MATITA)
    c.setFont("Helvetica-Bold", 10)
    c.drawRightString(x_inizio + W - 10, 8, "foglio %d di %d  ->" % (i + 1, FOGLI))
    c.setFont("Helvetica", 7)
    for k in range(0, 30):
        x = x_inizio + k * cm
        c.line(x, 0, x, 4 if k % 5 else 9)
    c.showPage()


def main():
    c = canvas.Canvas(USCITA, pagesize=(W, H))
    c.setTitle("Respira - guida per la striscia del livello 1")
    foglio_istruzioni(c)
    for i in range(FOGLI):
        foglio(c, i)
    c.save()
    print("salvato", USCITA)


if __name__ == "__main__":
    main()
