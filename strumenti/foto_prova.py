import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        pg = await (await b.new_context(viewport={"width":844,"height":390}, device_scale_factor=2)).new_page()
        await pg.goto("file:///home/claude/relax/index.html"); await pg.wait_for_timeout(800)
        await pg.evaluate("Pannello.chiudi(); const d=AVVENTURE1.scogliera; Mondo.caricaScena(Avventura.scena(d)); Mondo.ora(d.ora); void Avventura.gioca(d); 0")
        await pg.wait_for_timeout(500)
        await pg.evaluate("(()=>{const s=Avventura.debug(); s.p.x=1360; s.p.y=600; s.p.vy=0; s.contatori.semi=6;})()")
        await pg.wait_for_timeout(1500)
        await pg.keyboard.press("Space"); await pg.wait_for_timeout(250)
        await pg.screenshot(path="/home/claude/decks/img/ui-platform.png")
        await b.close()
asyncio.run(main())
