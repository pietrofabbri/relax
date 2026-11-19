import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        ctx = await b.new_context(viewport={"width": 1280, "height": 600}, device_scale_factor=1.5)
        pg = await ctx.new_page()
        await pg.goto("file:///home/claude/relax/index.html"); await pg.wait_for_timeout(1000)
        await pg.screenshot(path="/home/claude/decks/img/ui-titolo.png")
        await pg.evaluate("document.getElementById('pannello').classList.add('nascosto'); Storia.usa(TESTI.livello1.capitoli, ['segui','animali','corsa','cocchi','cerva','fuoco','calore','misura','alba']); void Storia.capitolo('animali')")
        await pg.wait_for_timeout(11000)
        await pg.screenshot(path="/home/claude/decks/img/ui-capitolo-domanda.png")
        await pg.click("#capitolo .dl-scelta >> nth=0", force=True); await pg.wait_for_timeout(900)
        await pg.screenshot(path="/home/claude/decks/img/ui-capitolo-aiuto.png")
        await pg.click("#capitolo .dl-scelta >> nth=1", force=True); await pg.wait_for_timeout(1500)
        await pg.evaluate("void Storia.spiega(TESTI.livello1.spiegazioni.insieme)")
        for i in range(3):
            await pg.wait_for_timeout(5500)
            if i == 2: await pg.screenshot(path="/home/claude/decks/img/ui-schema.png")
            await pg.mouse.click(640, 300)
        await pg.wait_for_timeout(1500)
        await pg.screenshot(path="/home/claude/decks/img/ui-domanda.png")
        await b.close()
asyncio.run(main())
