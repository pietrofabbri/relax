"""Crea un codice QR (PNG) senza librerie esterne, a parte Pillow.

Uso:  python3 strumenti/qr.py https://pietrofabbri.github.io/relax/ assets/qr-gioco.png
Codifica in modalità byte, correzione d'errore M, versioni 1-6 (fino a 106 caratteri).
"""
import sys
from PIL import Image

# versione: (codici di correzione per blocco, [dati per blocco...])
TABELLA_M = {1: (10, [16]), 2: (16, [28]), 3: (26, [44]), 4: (18, [32, 32]), 5: (24, [43, 43]), 6: (16, [27, 27, 27, 27])}
ALLINEAMENTO = {1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34]}

# aritmetica nel campo GF(256)
ESP, LOG = [0] * 512, [0] * 256
x = 1
for i in range(255):
    ESP[i] = x
    LOG[x] = i
    x <<= 1
    if x & 0x100:
        x ^= 0x11D
for i in range(255, 512):
    ESP[i] = ESP[i - 255]


def molt(a, b):
    return 0 if a == 0 or b == 0 else ESP[LOG[a] + LOG[b]]


def correzione(dati, n):
    gen = [1]
    for i in range(n):
        nuovo = [0] * (len(gen) + 1)
        for j, g in enumerate(gen):
            nuovo[j] ^= g
            nuovo[j + 1] ^= molt(g, ESP[i])
        gen = nuovo
    resto = list(dati) + [0] * n
    for i in range(len(dati)):
        c = resto[i]
        if c:
            for j in range(1, len(gen)):
                resto[i + j] ^= molt(gen[j], c)
    return resto[len(dati):]


def codifica(testo):
    b = testo.encode("utf-8")
    for v in sorted(TABELLA_M):
        ec, blocchi = TABELLA_M[v]
        capienza = sum(blocchi)
        if len(b) + 2 <= capienza:
            break
    else:
        raise SystemExit("Testo troppo lungo")
    bit = "0100" + format(len(b), "08b") + "".join(format(c, "08b") for c in b)
    bit += "0" * min(4, capienza * 8 - len(bit))
    bit += "0" * (-len(bit) % 8)
    dati = [int(bit[i:i + 8], 2) for i in range(0, len(bit), 8)]
    riempi, i = [0xEC, 0x11], 0
    while len(dati) < capienza:
        dati.append(riempi[i % 2])
        i += 1
    # blocchi e intreccio
    pezzi, pos = [], 0
    for n in blocchi:
        pezzi.append(dati[pos:pos + n])
        pos += n
    corr = [correzione(p, ec) for p in pezzi]
    finale = []
    for i in range(max(blocchi)):
        for p in pezzi:
            if i < len(p):
                finale.append(p[i])
    for i in range(ec):
        for c in corr:
            finale.append(c[i])
    return v, finale


def matrice(testo):
    v, parole = codifica(testo)
    n = 17 + 4 * v
    m = [[None] * n for _ in range(n)]

    def mirino(r, c):
        for dr in range(-1, 8):
            for dc in range(-1, 8):
                rr, cc = r + dr, c + dc
                if 0 <= rr < n and 0 <= cc < n:
                    dentro = 0 <= dr <= 6 and 0 <= dc <= 6
                    nero = dentro and (dr in (0, 6) or dc in (0, 6) or (2 <= dr <= 4 and 2 <= dc <= 4))
                    m[rr][cc] = nero
    mirino(0, 0); mirino(0, n - 7); mirino(n - 7, 0)
    for i in range(8, n - 8):
        m[6][i] = m[i][6] = i % 2 == 0
    pos = ALLINEAMENTO[v]
    for r in pos:
        for c in pos:
            if m[r][c] is not None:
                continue
            for dr in range(-2, 3):
                for dc in range(-2, 3):
                    m[r + dr][c + dc] = max(abs(dr), abs(dc)) != 1
    m[n - 8][8] = True  # modulo scuro fisso
    riservati = set()
    for i in range(9):
        riservati.add((8, i)); riservati.add((i, 8))
    for i in range(8):
        riservati.add((8, n - 1 - i)); riservati.add((n - 1 - i, 8))
    for (r, c) in riservati:
        if m[r][c] is None:
            m[r][c] = False
    libero = [[m[r][c] is None for c in range(n)] for r in range(n)]
    for (r, c) in riservati:
        libero[r][c] = False
    bit = "".join(format(p, "08b") for p in parole)
    k, c, su = 0, n - 1, True
    while c > 0:
        if c == 6:
            c -= 1
        righe = range(n - 1, -1, -1) if su else range(n)
        for r in righe:
            for cc in (c, c - 1):
                if libero[r][cc]:
                    m[r][cc] = k < len(bit) and bit[k] == "1"
                    k += 1
        su = not su
        c -= 2

    maschere = [lambda r, c: (r + c) % 2 == 0, lambda r, c: r % 2 == 0, lambda r, c: c % 3 == 0,
                lambda r, c: (r + c) % 3 == 0, lambda r, c: (r // 2 + c // 3) % 2 == 0,
                lambda r, c: (r * c) % 2 + (r * c) % 3 == 0, lambda r, c: ((r * c) % 2 + (r * c) % 3) % 2 == 0,
                lambda r, c: ((r + c) % 2 + (r * c) % 3) % 2 == 0]

    def formato(mm, maschera):
        dati = (0b00 << 3) | maschera  # livello M = 00
        resto = dati << 10
        for i in range(14, 9, -1):
            if resto & (1 << i):
                resto ^= 0x537 << (i - 10)
        f = ((dati << 10) | resto) ^ 0x5412
        b = [(f >> i) & 1 == 1 for i in range(15)]  # b[0] è il bit meno significativo
        # prima copia, intorno al mirino in alto a sinistra
        sequenza = [(8, 0), (8, 1), (8, 2), (8, 3), (8, 4), (8, 5), (8, 7), (8, 8), (7, 8), (5, 8), (4, 8), (3, 8), (2, 8), (1, 8), (0, 8)]
        for i, (r, c) in enumerate(sequenza):
            mm[r][c] = b[14 - i]
        # seconda copia
        for i in range(7):
            mm[n - 1 - i][8] = b[14 - i]
        for i in range(8):
            mm[8][n - 8 + i] = b[7 - i]
        mm[n - 8][8] = True

    def penalita(mm):
        p = 0
        for linee in (mm, list(zip(*mm))):
            for riga in linee:
                serie, prec = 0, None
                for x in riga:
                    if x == prec:
                        serie += 1
                    else:
                        if serie >= 5:
                            p += serie - 2
                        serie, prec = 1, x
                if serie >= 5:
                    p += serie - 2
                s = "".join("1" if x else "0" for x in riga)
                p += 40 * (s.count("10111010000") + s.count("00001011101"))
        for r in range(n - 1):
            for c in range(n - 1):
                if mm[r][c] == mm[r + 1][c] == mm[r][c + 1] == mm[r + 1][c + 1]:
                    p += 3
        neri = sum(sum(1 for x in riga if x) for riga in mm)
        p += abs(neri * 100 // (n * n) - 50) // 5 * 10
        return p

    migliore = None
    for i, f in enumerate(maschere):
        mm = [riga[:] for riga in m]
        for r in range(n):
            for c in range(n):
                if libero[r][c] and f(r, c):
                    mm[r][c] = not mm[r][c]
        formato(mm, i)
        pen = penalita(mm)
        if migliore is None or pen < migliore[0]:
            migliore = (pen, mm)
    return migliore[1]


def salva(testo, percorso, modulo=12, bordo=4):
    m = matrice(testo)
    n = len(m)
    im = Image.new("L", ((n + 2 * bordo) * modulo,) * 2, 255)
    px = im.load()
    for r in range(n):
        for c in range(n):
            if m[r][c]:
                for y in range(modulo):
                    for x in range(modulo):
                        px[(c + bordo) * modulo + x, (r + bordo) * modulo + y] = 0
    im.save(percorso)


if __name__ == "__main__":
    salva(sys.argv[1], sys.argv[2])
    print("salvato", sys.argv[2])
