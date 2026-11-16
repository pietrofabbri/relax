"""Prova le tre prove platform del livello 1: le gioca un po' con i tasti, poi porta Hayy al traguardo.
Uso: python3 strumenti/test_avventure.py [cartella foto]
"""
import asyncio, os, sys
from playwright.async_api import async_playwright

RADICE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FOTO = sys.argv[1] if len(sys.argv) > 1 else "/tmp/av"

async def main():
    os.makedirs(FOTO, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        ctx = await b.new_context(viewport={"width": 844, "height": 390}, device_scale_factor=2, has_touch=True, is_mobile=True)
        pg = await ctx.new_page()
        errori = []
        pg.on("pageerror", lambda e: errori.append(str(e)))
        pg.on("console", lambda m: errori.append(m.text) if m.type == "error" else None)
        await pg.goto("file://" + os.path.join(RADICE, "index.html"))
        await pg.wait_for_timeout(800)
        await pg.evaluate("Pannello.chiudi()")
        for nome in ["bosco", "scogliera", "notte"]:
            await pg.evaluate(f"""(() => {{ const d = AVVENTURE1.{nome}; Mondo.caricaScena(Avventura.scena(d)); if (d.ora !== undefined) Mondo.ora(d.ora);
              window._fine = null; Avventura.gioca(d).then(r => window._fine = r); }})()""")
            await pg.wait_for_timeout(600)
            await pg.screenshot(path=f"{FOTO}/{nome}-0.png")
            await pg.keyboard.down("ArrowRight")
            for i in range(14):
                await pg.keyboard.press("Space")
                await pg.wait_for_timeout(230)
                if i == 6:
                    await pg.keyboard.press("KeyX")
            await pg.screenshot(path=f"{FOTO}/{nome}-1.png")
            await pg.keyboard.up("ArrowRight")
            st = await pg.evaluate("(() => { const s = Avventura.debug(); return s ? {x: s.p.x, cuori: s.cuori, fiato: s.fiato, semi: s.contatori.semi} : null })()")
            print(nome, "dopo 3 s:", st)
            # metà percorso: foto
            await pg.evaluate("(() => { const s = Avventura.debug(); s.p.x = s.def.fine * 0.55; s.p.y = 500; })()")
            await pg.wait_for_timeout(900)
            await pg.screenshot(path=f"{FOTO}/{nome}-2.png")
            # al traguardo
            await pg.evaluate("(() => { const s = Avventura.debug(); s.p.invul = 5; s.p.x = s.def.fine - 30; s.p.y = 790; s.p.vy = 0; })()")
            await pg.keyboard.down("ArrowRight")
            await pg.wait_for_timeout(700)
            await pg.keyboard.up("ArrowRight")
            await pg.screenshot(path=f"{FOTO}/{nome}-3.png")
            await pg.wait_for_timeout(3200)
            print(nome, "risultato:", await pg.evaluate("window._fine"))
        # sconfitta
        await pg.evaluate("""(() => { const d = AVVENTURE1.bosco; Mondo.caricaScena(Avventura.scena(d)); Avventura.gioca(d); })()""")
        await pg.wait_for_timeout(300)
        await pg.evaluate("(() => { const s = Avventura.debug(); s.cuori = 1; s.p.x = 860; s.p.y = 700; })()")
        await pg.wait_for_timeout(1800)
        await pg.screenshot(path=f"{FOTO}/sconfitta.png")
        print("sconfitta visibile:", await pg.evaluate("!document.getElementById('sconfitta').classList.contains('nascosto')"))
        print("ERRORI:", errori)
        await b.close()

asyncio.run(main())
