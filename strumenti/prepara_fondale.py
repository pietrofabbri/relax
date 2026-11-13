"""Trasforma la scansione (o la foto) di un disegno nel fondale di un livello.

Uso:
    python3 strumenti/prepara_fondale.py foglio1.jpg [foglio2.jpg foglio3.jpg] assets/fondali/livello1.png

Più fogli vengono messi in fila da sinistra a destra. Il formato migliore è una striscia di
3 fogli A4 orizzontali: il fondale scorre per tutto il livello senza ripetersi.

Poi, in js/fondale.js, scrivi il percorso in FONDALI.livello1.file.

Cosa fa (la stessa ricetta che il gioco usa per le foto scelte dal telefono):
1. raddrizza l'orientamento della foto e la rimpicciolisce (altezza 900 punti);
2. toglie le ombre: misura la luce della carta zona per zona e la riporta al bianco;
3. la carta (chiara e poco colorata) diventa trasparente: lì si vedrà il cielo animato;
4. i colori del pennarello diventano più vivi.
"""
import sys
import numpy as np
from PIL import Image, ImageFilter, ImageOps


def mappa_luce(a, celle=12):
    """La luce della carta zona per zona: il 90° percentile di ogni cella (la carta è la parte più chiara),
    poi il massimo con le celle vicine (una zona tutta colorata prende la luce della carta accanto)."""
    h, w, _ = a.shape
    lato = max(8, h // celle)
    ny, nx = -(-h // lato), -(-w // lato)
    griglia = np.zeros((ny, nx, 3), np.float32)
    for j in range(ny):
        for i in range(nx):
            griglia[j, i] = np.percentile(a[j * lato:(j + 1) * lato, i * lato:(i + 1) * lato].reshape(-1, 3), 90, axis=0)
    bordo = np.pad(griglia, ((1, 1), (1, 1), (0, 0)), mode="edge")
    vicini = griglia.copy()
    for dj in (0, 1, 2):
        for di in (0, 1, 2):
            vicini = np.maximum(vicini, bordo[dj:dj + ny, di:di + nx])
    carta = np.percentile(griglia.reshape(-1, 3), 90, axis=0)
    vicini = np.maximum(vicini, carta * 0.8)
    luce = Image.fromarray(np.clip(vicini, 0, 255).astype(np.uint8)).resize((w, h), Image.BILINEAR)
    return np.maximum(np.asarray(luce).astype(np.float32), 60)


def prepara(entrata, uscita, altezza=900):
    if isinstance(entrata, (list, tuple)):
        fogli = [ImageOps.exif_transpose(Image.open(e)).convert("RGB") for e in entrata]
        hh = min(altezza, min(f.height for f in fogli))
        fogli = [f.resize((round(f.width * hh / f.height), hh), Image.LANCZOS) for f in fogli]
        im = Image.new("RGB", (sum(f.width for f in fogli), hh))
        x = 0
        for f in fogli:
            im.paste(f, (x, 0))
            x += f.width
        entrata = im
    im = entrata if isinstance(entrata, Image.Image) else ImageOps.exif_transpose(Image.open(entrata)).convert("RGB")
    if im.height > altezza:
        im = im.resize((round(im.width * altezza / im.height), altezza), Image.LANCZOS)
    a = np.asarray(im).astype(np.float32)
    luce = mappa_luce(a)
    a = np.minimum(255, a * 255 / luce)
    mx, mn = a.max(axis=2), a.min(axis=2)
    lum = a @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    sat = np.where(mx == 0, 0, (mx - mn) / np.maximum(mx, 1))
    carta = np.clip((lum - 200) / 40, 0, 1) * np.clip((0.22 - sat) / 0.12, 0, 1)
    media = a.mean(axis=2, keepdims=True)
    a = media + (a - media) * 1.2
    a = np.clip((a - 128) * 1.05 + 128, 0, 255)
    alfa = np.round(255 * (1 - carta))[..., None]
    out = Image.fromarray(np.concatenate([a, alfa], axis=2).astype(np.uint8), "RGBA")
    out.save(uscita, optimize=True)
    trasparente = float((alfa < 20).mean()) * 100
    print(f"salvato {uscita}: {out.width}x{out.height}, carta resa trasparente: {trasparente:.0f}%")
    if trasparente < 5:
        print("Nota: quasi niente carta bianca. Va bene se il cielo è colorato a mano: copre quello animato.")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        raise SystemExit(__doc__)
    prepara(sys.argv[1:-1] if len(sys.argv) > 3 else sys.argv[1], sys.argv[-1])
