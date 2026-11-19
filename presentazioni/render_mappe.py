import asyncio, json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        pg = await b.new_page(viewport={"width":1600,"height":1200})
        js = open("/home/claude/decks/mappe.js").read() + open("/home/claude/decks/mappe_def.js").read()
        await pg.set_content("<html><body style='margin:0'><div id='m'></div></body></html>")
        await pg.add_script_tag(content=js)
        nomi = await pg.evaluate("Object.keys(MAPPE)")
        for n in nomi:
            svg = await pg.evaluate(f"Mappa(MAPPE['{n}'])")
            open(f"/home/claude/decks/img/mappa-{n}.svg","w").write(svg)
            await pg.evaluate("s=>{document.getElementById('m').innerHTML=s}", svg)
            el = await pg.query_selector("#m svg")
            await el.screenshot(path=f"/home/claude/decks/img/mappa-{n}.png")
            print(n)
        await b.close()
asyncio.run(main())
