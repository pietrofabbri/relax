"""Gioca il livello 1 dall'inizio alla fine in un telefono simulato e registra errori e screenshot."""
import asyncio, sys
from playwright.async_api import async_playwright

import os, pathlib
RADICE = pathlib.Path(__file__).resolve().parent.parent
URL = (RADICE / "index.html").as_uri()
CHROME = os.environ.get("CHROME", "/usr/bin/google-chrome")
VW, VH = 844, 390
SHOTS = "/tmp/shots"

errori = []

async def pannello_aperto(pg):
    return await pg.evaluate("!document.getElementById('pannello').classList.contains('nascosto')")

async def avanza(pg, massimo=40, prima=None):
    """Clicca il bottone principale finché il pannello resta aperto."""
    n = 0
    await pg.wait_for_timeout(250)
    while await pannello_aperto(pg) and n < massimo:
        # se c'è un campo numerico, non è il momento di avanzare
        if await pg.locator("#pannello input[type=number]").count():
            return n
        if await pg.locator("#pannello button", has_text="Non ora").count():
            return n
        await pg.locator("#pannello .bottone.principale").last.click()
        n += 1
        await pg.wait_for_timeout(180)
    return n

async def dbg(pg):
    return await pg.evaluate("(() => { const d = RESPIRA.livello.debug(); return {tappa: d.tappa, oggetti: d.oggetti, g: d.guardiano, limite: d.limite, cocco: d.cocco}; })()")

async def pos(pg, oid):
    return await pg.evaluate(f"RESPIRA.livello.debug().posizione('{oid}')")

async def vai_e_tocca(pg, oid, tentativi=30):
    for _ in range(tentativi):
        p = await pos(pg, oid)
        if 60 < p["x"] < VW - 60:
            await pg.mouse.click(p["x"], p["y"])
            await pg.wait_for_timeout(900)
            # aspetta l'arrivo e l'apertura del pannello
            for _ in range(20):
                if await pannello_aperto(pg):
                    return True
                await pg.wait_for_timeout(250)
            return False
        # cammina verso l'oggetto toccando il sentiero
        x = VW - 40 if p["x"] >= VW - 60 else 40
        await pg.mouse.click(x, VH * 0.72)
        await pg.wait_for_timeout(700)
    return False

async def foto(pg, nome):
    await pg.screenshot(path=f"{SHOTS}/{nome}.png")

async def main():
    import os
    os.makedirs(SHOTS, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROME, args=["--no-sandbox", "--autoplay-policy=no-user-gesture-required"])
        ctx = await b.new_context(viewport={"width": VW, "height": VH}, device_scale_factor=2, has_touch=True, is_mobile=True)
        pg = await ctx.new_page()
        pg.on("console", lambda m: errori.append("console." + m.type + ": " + m.text) if m.type in ("error", "warning") else None)
        pg.on("pageerror", lambda e: errori.append("pageerror: " + str(e)))
        await pg.goto(URL)
        await pg.wait_for_timeout(800)
        await foto(pg, "01-titolo")

        await pg.get_by_text("Inizia il viaggio").click()
        await pg.wait_for_timeout(300)
        await foto(pg, "02-prologo")
        await avanza(pg)
        print("dopo prologo", await dbg(pg))
        await foto(pg, "03-isola")

        for animale in ["capra", "uccello", "tartaruga"]:
            ok = await vai_e_tocca(pg, animale)
            print(animale, ok)
            if animale == "capra":
                await foto(pg, "04-capra")
            await avanza(pg)
            # la cerva corre dopo il terzo animale: attesa di sicurezza
            await pg.wait_for_timeout(1500)
            await avanza(pg)
        print("dopo animali", await dbg(pg))
        await foto(pg, "05-battito")

        # riflessi
        ok = await vai_e_tocca(pg, "palma")
        print("palma", ok)
        await avanza(pg)   # introduzione fino al pannello 'Prova 1 di 3' (principale = Inizia)
        prove = 0
        presto_testato = False
        while prove < 3:
            stato = (await dbg(pg))["cocco"]
            if await pannello_aperto(pg):
                testo = await pg.inner_text("#pannello")
                await pg.locator("#pannello .bottone.principale").last.click()
                await pg.wait_for_timeout(150)
                continue
            if stato == "attesa" and not presto_testato:
                await pg.mouse.click(VW / 2, VH / 2)   # troppo presto, apposta
                presto_testato = True
                await pg.wait_for_timeout(300)
                continue
            if stato == "cade":
                await pg.wait_for_timeout(120)
                await pg.mouse.click(VW / 2, VH / 2)
                if prove == 0:
                    await pg.wait_for_timeout(100)
                    await foto(pg, "06-cocco")
                prove += 1
                await pg.wait_for_timeout(300)
                continue
            await pg.wait_for_timeout(60)
        await pg.wait_for_timeout(400)
        await foto(pg, "07-risultati-riflessi")
        await avanza(pg)
        print("dopo riflessi", await dbg(pg))

        # la cerva e la grotta
        ok = await vai_e_tocca(pg, "grotta")
        print("grotta", ok)
        await foto(pg, "08-cerva")
        await avanza(pg, massimo=60)
        # prima misura: 'Non ora' (secondario) quando compare la scelta
        for _ in range(20):
            if await pannello_aperto(pg) and await pg.get_by_text("Non ora").count():
                break
            await avanza(pg, massimo=1)
            await pg.wait_for_timeout(300)
        await foto(pg, "09-scelta-misura")
        await pg.get_by_text("Non ora").click()
        await pg.wait_for_timeout(500)
        await avanza(pg)
        print("dopo cerva", await dbg(pg))

        # fuoco
        for oid in ["canne", "bastone", "grotta"]:
            ok = await vai_e_tocca(pg, oid)
            print(oid, ok)
            await avanza(pg)
        await foto(pg, "10-grotta-accesa")
        for oid in ["sasso", "capra2", "hayy"]:
            ok = await vai_e_tocca(pg, oid)
            print(oid, ok)
            if oid == "hayy":
                await avanza(pg, massimo=12)
            else:
                await avanza(pg)
        # seconda misura: scegli 'Via' e fai il conto alla rovescia
        for _ in range(20):
            if await pannello_aperto(pg) and await pg.get_by_text("Via", exact=True).count():
                break
            await avanza(pg, massimo=1)
            await pg.wait_for_timeout(300)
        await pg.get_by_text("Via", exact=True).click()
        await pg.wait_for_timeout(2000)
        await foto(pg, "11-conto")
        await pg.wait_for_timeout(29500)
        await pg.fill("#pannello input[type=number]", "200")
        await pg.get_by_text("Conferma").click()
        await pg.wait_for_timeout(300)
        fuori = await pg.inner_text("#pannello")
        print("numero fuori scala ->", "strano" in fuori)
        await pg.fill("#pannello input[type=number]", "38")
        await foto(pg, "12-numero")
        await pg.get_by_text("Conferma").click()
        await pg.wait_for_timeout(300)
        await avanza(pg)
        print("dopo fuoco", await dbg(pg))

        ok = await vai_e_tocca(pg, "absal")
        print("absal", ok)
        await foto(pg, "13-absal")
        for _ in range(10):
            if await pg.get_by_text("Fine della prima pagina").count():
                break
            await pg.locator("#pannello .bottone.principale").last.click()
            await pg.wait_for_timeout(200)
        await foto(pg, "14-finale")
        await pg.get_by_text("Quaderno", exact=True).last.click()
        await pg.wait_for_timeout(300)
        await foto(pg, "15-quaderno")
        q = await pg.evaluate("RESPIRA.quaderno.numero()")
        print("pagine nel quaderno:", q)
        print("finale", await dbg(pg))

        # ripresa: ricarica e controlla che il gioco riparta dalla fine
        await pg.reload()
        await pg.wait_for_timeout(800)
        print("dopo ricarica, tasto Continua:", await pg.get_by_text("Continua").count() > 0)

        # verticale
        await pg.set_viewport_size({"width": 390, "height": 844})
        await pg.wait_for_timeout(500)
        await foto(pg, "16-verticale")
        await b.close()

    print("\nERRORI:", len(errori))
    for e in errori:
        print(" -", e)
    sys.exit(1 if errori else 0)

asyncio.run(main())
