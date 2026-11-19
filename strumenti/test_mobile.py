import asyncio, sys
from playwright.async_api import async_playwright
SIZES=[(667,375),(844,390),(375,667)]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        for w,h in SIZES:
            pg = await (await b.new_context(viewport={"width":w,"height":h}, device_scale_factor=2, is_mobile=True, has_touch=True)).new_page()
            err=[]; pg.on("pageerror", lambda e: err.append(str(e)))
            await pg.goto("file:///home/claude/relax/index.html"); await pg.wait_for_timeout(1500)
            await pg.screenshot(path=f"/tmp/m-{w}-titolo.png")
            await pg.evaluate("Pannello.chiudi(); Storia.usa(TESTI.livello1.capitoli, ['segui','animali','corsa','cocchi','cerva','fuoco','calore','misura','alba']); void Storia.capitolo('corsa'); 0")
            await pg.wait_for_timeout(4500); await pg.screenshot(path=f"/tmp/m-{w}-capitolo.png")
            await pg.evaluate("document.getElementById('capitolo').classList.add('nascosto'); void Storia.spiega(TESTI.livello1.spiegazioni.insieme); 0")
            await pg.wait_for_timeout(1500); 
            for i in range(3):
                await pg.wait_for_timeout(3500); await pg.mouse.click(w//2, h//2)
            await pg.wait_for_timeout(2500); await pg.screenshot(path=f"/tmp/m-{w}-spiega.png")
            await pg.evaluate("document.getElementById('spiegazione').classList.add('nascosto'); const d=AVVENTURE1.notte; Mondo.caricaScena(Avventura.scena(d)); Mondo.ora(d.ora); void Avventura.gioca(d); 0")
            await pg.wait_for_timeout(1200); await pg.screenshot(path=f"/tmp/m-{w}-prova.png")
            print(w,h,err)
        await b.close()
asyncio.run(main())
