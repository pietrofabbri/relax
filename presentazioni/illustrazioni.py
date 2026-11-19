import asyncio
from playwright.async_api import async_playwright
SCENE = [
 ("isola-alba", "h.x=h.dest=420; c.x=c.dest=600; M.ora(0.15)"),
 ("gazzella", "h.x=h.dest=480; h.verso=1; c.x=c.dest=640; c.verso=-1; M.ora(0.8)"),
 ("animali", "h.x=h.dest=980; M.ora(1)"),
 ("palme-grotta", "h.x=h.dest=3150; c.visibile=false; M.ora(1.3)"),
 ("tramonto-gazzella", "h.x=h.dest=3240; h.posa='inginocchiato'; h.verso=1; c.visibile=true; c.x=c.dest=3420; c.stato='sdraiata'; c.verso=-1; M.ora(2)"),
 ("fuoco", "h.x=h.dest=3950; h.posa='fermo'; c.visibile=false; d.mondo.canneFuoco=true; d.mondo.grottaLuce=1; M.ora(3)"),
 ("barca-absal", "h.x=h.dest=4250; h.verso=1; d.mondo.canneFuoco=false; d.mondo.barca.visibile=true; d.mondo.barca.x=4560; a.visibile=true; a.x=a.dest=4400; d.mondo.capra2.visibile=true; M.ora(0.3)"),
]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        ctx = await b.new_context(viewport={"width": 1280, "height": 600}, device_scale_factor=1.5)
        pg = await ctx.new_page()
        await pg.goto("file:///home/claude/relax/index.html"); await pg.wait_for_timeout(1000)
        await pg.add_style_tag(content="#pannello,#barra,#battito,#punti,#inventario,#suggerimento,#didascalia,#ruota,#avviso-quaderno{display:none!important}")
        for nome, js in SCENE:
            await pg.evaluate("(()=>{const d=RESPIRA.livello.debug(), h=d.hayyRef, c=d.cervaRef, a=d.absalRef, M=RESPIRA.mondo; d.mondo.semi.forEach(s=>s.preso=true);" + js + "})()")
            await pg.wait_for_timeout(2200)
            await pg.screenshot(path=f"/home/claude/decks/img/scena-{nome}.png")
            print(nome)
        await b.close()
asyncio.run(main())
